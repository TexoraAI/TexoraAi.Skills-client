
// import { useEffect, useState } from "react";
// import {
//   addOption,
//   addQuestion,
//   createQuiz,
// } from "../services/assessmentService";

// import { getTrainerBatches } from "../services/batchService"; // ⭐ ONLY ADDITION

// import {
//   ClipboardList,
//   HelpCircle,
//   Loader2,
//   PlusCircle
// } from "lucide-react";
// import auth from "../auth";

// const CreateQuiz = () => {
//   const [title, setTitle] = useState("");
//   const [batchId, setBatchId] = useState("");
//   const [instructions, setInstructions] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [batches, setBatches] = useState([]); // ⭐ STORE TRAINER BATCHES

//   const [questions, setQuestions] = useState([
//     {
//       text: "",
//       options: { A: "", B: "", C: "", D: "" },
//       correctOption: "",
//     },
//   ]);

//   // 🔥 LOAD TRAINER BATCHES (SAME AS VIDEO SERVICE)
//   useEffect(() => {
//     if (!auth.isAuthenticated()) {
//       alert("Please login again");
//       return;
//     }

//     const loadBatches = async () => {
//       try {
//         const res = await getTrainerBatches();
//         setBatches(res || []); // batchService already returns data
//       } catch (err) {
//         console.error("Failed to load trainer batches", err);
//       }
//     };

//     loadBatches();
//   }, []);

//   const addNewQuestion = () => {
//     setQuestions([
//       ...questions,
//       {
//         text: "",
//         options: { A: "", B: "", C: "", D: "" },
//         correctOption: "",
//       },
//     ]);
//   };

//   const handleSaveQuiz = async () => {
//     try {
//       for (const q of questions) {
//         if (!q.text.trim()) {
//           alert("Please enter question text");
//           return;
//         }
//         if (!q.correctOption) {
//           alert("Please select correct option for all questions");
//           return;
//         }
//       }

//       if (!batchId) {
//         alert("Please select a batch");
//         return;
//       }

//       setLoading(true);

//       const quizRes = await createQuiz({
//         title,
//         batchId,
//         instructions,
//       });

//       const quizId = quizRes.data.id;

//       for (const q of questions) {
//         const qRes = await addQuestion({
//           quizId,
//           text: q.text,
//         });

//         const questionId = qRes.data.id;

//         for (const key of ["A", "B", "C", "D"]) {
//           await addOption({
//             questionId,
//             text: q.options[key],
//             correct: key === q.correctOption,
//           });
//         }
//       }

//       alert("✅ Quiz created successfully");

//       setTitle("");
//       setBatchId("");
//       setInstructions("");
//       setQuestions([
//         {
//           text: "",
//           options: { A: "", B: "", C: "", D: "" },
//           correctOption: "",
//         },
//       ]);
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to create quiz");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 transition-colors">
//       <div className="max-w-6xl mx-auto space-y-6">
//         {/* HERO */}
//         <div className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 p-5 text-white shadow-md">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-lg bg-white shadow flex items-center justify-center">
//               <ClipboardList className="w-4 h-4 text-blue-600" />
//             </div>
//             <div>
//               <h1 className="text-lg font-semibold">Quiz Builder</h1>
//               <p className="text-sm text-white/90">
//                 Create assessments for students
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* DETAILS */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Quiz Title"
//             className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
//           />

//           {/* ⭐ AUTO LOAD BATCHES */}
//           <select
//             value={batchId}
//             onChange={(e) => setBatchId(Number(e.target.value))}
//             className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
//           >
//             <option value="">Select Batch</option>
//             {batches.map((b) => (
//               <option key={b.id} value={b.id}>
//                 Batch {b.id}
//               </option>
//             ))}
//           </select>
//         </div>

//         <textarea
//           value={instructions}
//           onChange={(e) => setInstructions(e.target.value)}
//           placeholder="Quiz instructions"
//           rows={3}
//           className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
//         />

//         {/* QUESTIONS UI UNCHANGED */}
//         <div className="space-y-6">
//           {questions.map((q, index) => (
//             <div
//               key={index}
//               className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-5 space-y-4"
//             >
//               <div className="flex items-center gap-2">
//                 <HelpCircle className="w-4 h-4 text-blue-600" />
//                 <h2 className="text-sm font-semibold">Question {index + 1}</h2>
//               </div>

//               <input
//                 value={q.text}
//                 onChange={(e) => {
//                   const updated = [...questions];
//                   updated[index].text = e.target.value;
//                   setQuestions(updated);
//                 }}
//                 placeholder="Enter question text"
//                 className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
//               />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 {["A", "B", "C", "D"].map((key) => (
//                   <div key={key} className="rounded-lg border p-3">
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="radio"
//                         name={`correct-${index}`}
//                         checked={q.correctOption === key}
//                         onChange={() => {
//                           const updated = [...questions];
//                           updated[index].correctOption = key;
//                           setQuestions(updated);
//                         }}
//                       />
//                       <input
//                         value={q.options[key]}
//                         onChange={(e) => {
//                           const updated = [...questions];
//                           updated[index].options[key] = e.target.value;
//                           setQuestions(updated);
//                         }}
//                         placeholder={`Option ${key}`}
//                         className="flex-1 bg-transparent outline-none"
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ACTIONS */}
//         <div className="flex flex-col sm:flex-row gap-3">
//           <button
//             onClick={addNewQuestion}
//             className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
//           >
//             <PlusCircle className="w-4 h-4" />
//             Add Question
//           </button>

//           <button
//             onClick={handleSaveQuiz}
//             disabled={loading}
//             className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 Saving…
//               </>
//             ) : (
//               "Publish Quiz"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateQuiz;
























import { useEffect, useState } from "react";
import {
  addOption,
  addQuestion,
  createQuiz,
} from "../services/assessmentService";

import { getTrainerBatches } from "../services/batchService";

import {
  ChevronDown,
  ClipboardList,
  HelpCircle,
  Loader2,
  PlusCircle,
  Settings2,
  CheckCircle2,
} from "lucide-react";
import auth from "../auth";

const PANELS = ["details", "questions", "review"];

const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [batchId, setBatchId] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [open, setOpen] = useState("details");

  const [questions, setQuestions] = useState([
    { text: "", options: { A: "", B: "", C: "", D: "" }, correctOption: "" },
  ]);

  useEffect(() => {
    if (!auth.isAuthenticated()) { alert("Please login again"); return; }
    const loadBatches = async () => {
      try {
        const res = await getTrainerBatches();
        setBatches(res || []);
      } catch (err) {
        console.error("Failed to load trainer batches", err);
      }
    };
    loadBatches();
  }, []);

  const addNewQuestion = () => {
    setQuestions([...questions, { text: "", options: { A: "", B: "", C: "", D: "" }, correctOption: "" }]);
  };

  const handleSaveQuiz = async () => {
    try {
      for (const q of questions) {
        if (!q.text.trim()) { alert("Please enter question text"); return; }
        if (!q.correctOption) { alert("Please select correct option for all questions"); return; }
      }
      if (!batchId) { alert("Please select a batch"); return; }
      setLoading(true);
      const quizRes = await createQuiz({ title, batchId, instructions });
      const quizId = quizRes.data.id;
      for (const q of questions) {
        const qRes = await addQuestion({ quizId, text: q.text });
        const questionId = qRes.data.id;
        for (const key of ["A", "B", "C", "D"]) {
          await addOption({ questionId, text: q.options[key], correct: key === q.correctOption });
        }
      }
      alert("✅ Quiz created successfully");
      setTitle(""); setBatchId(""); setInstructions("");
      setQuestions([{ text: "", options: { A: "", B: "", C: "", D: "" }, correctOption: "" }]);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (panel) => setOpen((prev) => (prev === panel ? null : panel));

  const panelMeta = {
    details: {
      label: "Quiz Details",
      sub: "Title, batch & instructions",
      accent: "from-cyan-500 to-blue-600",
      ring: "focus-within:ring-2 focus-within:ring-blue-400/30",
      activeBorder: "border-blue-300 dark:border-blue-700",
      dot: "#06b6d4",
    },
    questions: {
      label: "Questions",
      sub: `${questions.length} question${questions.length !== 1 ? "s" : ""} added`,
      accent: "from-indigo-500 to-violet-600",
      ring: "focus-within:ring-2 focus-within:ring-indigo-400/30",
      activeBorder: "border-indigo-300 dark:border-indigo-700",
      dot: "#6366f1",
    },
    review: {
      label: "Review & Publish",
      sub: "Confirm and save",
      accent: "from-emerald-500 to-green-600",
      ring: "focus-within:ring-2 focus-within:ring-emerald-400/30",
      activeBorder: "border-emerald-300 dark:border-emerald-700",
      dot: "#10b981",
    },
  };

  /* shared input classes */
  const inp = "w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 placeholder:text-slate-400 dark:placeholder:text-slate-500";
  const sel = "w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20";

  return (
    <div className="p-4 pb-12 space-y-4 bg-slate-50 dark:bg-slate-950 min-h-screen">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-6 py-5 text-white shadow-xl shadow-blue-500/20">
        <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 left-1/4 w-32 h-32 rounded-full bg-indigo-400/20 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shadow-inner shrink-0">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60 mb-0.5">Assessment Builder</p>
            <h1 className="text-xl font-bold tracking-tight leading-none">Quiz Builder</h1>
          </div>
        </div>
      </div>

      {/* ── ACCORDION PANELS ── */}
      {PANELS.map((key, idx) => {
        const meta = panelMeta[key];
        const isOpen = open === key;

        return (
          <div
            key={key}
            className={`rounded-2xl border bg-white dark:bg-slate-900 overflow-hidden transition-all duration-200 ${
              isOpen
                ? `shadow-lg ${meta.activeBorder}`
                : "border-slate-200 dark:border-slate-800 shadow-sm"
            }`}
          >
            {/* ── header ── */}
            <button
              onClick={() => toggle(key)}
              className="w-full flex items-center gap-3.5 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              {/* step badge */}
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${meta.accent} flex items-center justify-center shrink-0 shadow-md`}>
                <span className="text-xs font-bold text-white">{idx + 1}</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">{meta.label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{meta.sub}</p>
              </div>

              {/* progress dots */}
              <div className="flex items-center gap-1.5 mr-1">
                {PANELS.map((p, pi) => (
                  <span
                    key={p}
                    className="w-1.5 h-1.5 rounded-full transition-all"
                    style={{
                      background: p === key ? meta.dot : pi < idx ? "#94a3b8" : "#e2e8f0",
                      transform: p === key ? "scale(1.3)" : "scale(1)",
                    }}
                  />
                ))}
              </div>

              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* ── body ── */}
            {isOpen && (
              <div className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">

                {/* PANEL 1 — DETAILS */}
                {key === "details" && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Quiz Title</label>
                        <input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. React Fundamentals"
                          className={inp}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Select Batch</label>
                        <select
                          value={batchId}
                          onChange={(e) => setBatchId(Number(e.target.value))}
                          className={sel}
                        >
                          <option value="">Select Batch</option>
                          {batches.map((b) => (
                            <option key={b.id} value={b.id}>Batch {b.id}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Instructions</label>
                      <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Quiz instructions for students…"
                        rows={3}
                        className={`${inp} resize-none`}
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => setOpen("questions")}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 hover:brightness-105 transition-all"
                      >
                        Next: Add Questions →
                      </button>
                    </div>
                  </>
                )}

                {/* PANEL 2 — QUESTIONS */}
                {key === "questions" && (
                  <>
                    <div className="space-y-4">
                      {questions.map((q, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3 shadow-sm"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-sm">
                              <span className="text-[10px] font-bold text-white">{index + 1}</span>
                            </div>
                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                              Question {index + 1}
                            </span>
                          </div>

                          <input
                            value={q.text}
                            onChange={(e) => {
                              const updated = [...questions];
                              updated[index].text = e.target.value;
                              setQuestions(updated);
                            }}
                            placeholder="Enter question text"
                            className={inp}
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {["A", "B", "C", "D"].map((optKey) => (
                              <label
                                key={optKey}
                                className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 cursor-pointer transition-all shadow-sm ${
                                  q.correctOption === optKey
                                    ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 shadow-emerald-100 dark:shadow-emerald-900/20"
                                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 hover:bg-slate-50"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`correct-${index}`}
                                  checked={q.correctOption === optKey}
                                  onChange={() => {
                                    const updated = [...questions];
                                    updated[index].correctOption = optKey;
                                    setQuestions(updated);
                                  }}
                                  className="accent-emerald-500"
                                />
                                <span
                                  className={`text-[10px] font-bold w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                    q.correctOption === optKey
                                      ? "bg-emerald-500 text-white shadow-sm"
                                      : "bg-slate-100 dark:bg-slate-700 text-slate-500"
                                  }`}
                                >
                                  {optKey}
                                </span>
                                <input
                                  value={q.options[optKey]}
                                  onChange={(e) => {
                                    const updated = [...questions];
                                    updated[index].options[optKey] = e.target.value;
                                    setQuestions(updated);
                                  }}
                                  placeholder={`Option ${optKey}`}
                                  className="flex-1 bg-transparent outline-none text-sm min-w-0 placeholder:text-slate-400"
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={addNewQuestion}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-500 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:border-indigo-400 transition-all"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Add Question
                      </button>
                      <button
                        onClick={() => setOpen("review")}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-semibold shadow-md shadow-indigo-500/25 hover:shadow-lg hover:brightness-105 transition-all"
                      >
                        Next: Review →
                      </button>
                    </div>
                  </>
                )}

                {/* PANEL 3 — REVIEW */}
                {key === "review" && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Title", val: title || "—" },
                        { label: "Batch", val: batchId ? `Batch ${batchId}` : "—" },
                        { label: "Questions", val: questions.length },
                      ].map(({ label, val }) => (
                        <div key={label} className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-sm">
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1">{label}</p>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{val}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setOpen("questions")}
                        className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition font-medium"
                      >
                        ← Back to Questions
                      </button>
                      <button
                        onClick={handleSaveQuiz}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30 hover:brightness-105 disabled:opacity-60 transition-all"
                      >
                        {loading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
                        ) : (
                          <><CheckCircle2 className="w-4 h-4" />Publish Quiz</>
                        )}
                      </button>
                    </div>
                  </>
                )}

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CreateQuiz;