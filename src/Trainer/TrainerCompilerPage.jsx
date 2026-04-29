// import { useState, useEffect } from "react";
// import {
//   getMyProblems,
//   createCodingProblem,
//   updateCodingProblem,
//   deleteCodingProblem,
//   addTestCase,
//   getTestCases,
//   assignProblemToBatch,
//   getAssignmentsByBatchForTrainer,
//   unassignProblem,
//   getBatchCodeSubmissions,
// } from "../services/assessmentService";
// import { getTrainerBatches } from "../services/batchService";

// const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];

// const emptyProblem = {
//   title: "",
//   description: "",
//   inputFormat: "",
//   outputFormat: "",
//   constraints: "",
//   sampleInput: "",
//   sampleOutput: "",
//   difficulty: "EASY",
//   totalMarks: 10,
//   testCases: [],
// };

// const emptyTestCase = {
//   input: "",
//   expectedOutput: "",
//   isHidden: false,
//   weightage: 1,
// };

// export default function TrainerCompilerPage({ defaultBatchId = "" }) {
//   const [tab, setTab] = useState("problems");
//   const [problems, setProblems] = useState([]);
//   const [formData, setFormData] = useState(emptyProblem);
//   const [testCaseForm, setTestCaseForm] = useState(emptyTestCase);
//   const [editingId, setEditingId] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [selectedProblemForTC, setSelectedProblemForTC] = useState(null);
//   const [existingTestCases, setExistingTestCases] = useState([]);
//   const [assignProblemId, setAssignProblemId] = useState("");
//   const [assignBatchId, setAssignBatchId] = useState("");
//   const [assignDueDate, setAssignDueDate] = useState("");
//   const [assignments, setAssignments] = useState([]);
//   const [assignBatchQuery, setAssignBatchQuery] = useState("");
//   const [submissions, setSubmissions] = useState([]);
//   const [submissionBatchId, setSubmissionBatchId] = useState("");
//   const [loadingSubmissions, setLoadingSubmissions] = useState(false);
//   const [expandedSubmission, setExpandedSubmission] = useState(null);
//   const [successMsg, setSuccessMsg] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");

//   // Batch dropdown state
//   const [trainerBatches, setTrainerBatches] = useState([]);
//   const [loadingBatches, setLoadingBatches] = useState(false);

//   useEffect(() => {
//     fetchProblems();
//     fetchTrainerBatches();
//   }, []);

//   const flash = (msg, isError = false) => {
//     if (isError) setErrorMsg(msg);
//     else setSuccessMsg(msg);
//     setTimeout(() => {
//       setSuccessMsg("");
//       setErrorMsg("");
//     }, 3000);
//   };

//   const fetchProblems = async () => {
//     try {
//       const res = await getMyProblems();
//       setProblems(res.data || []);
//     } catch {
//       setProblems([]);
//     }
//   };

//   const fetchTrainerBatches = async () => {
//     setLoadingBatches(true);
//     try {
//       const data = await getTrainerBatches();
//       // getTrainerBatches returns res.data directly (see batchService)
//       setTrainerBatches(Array.isArray(data) ? data : []);
//     } catch {
//       setTrainerBatches([]);
//     } finally {
//       setLoadingBatches(false);
//     }
//   };

//   const handleFormChange = (field, value) => {
//     setFormData((p) => ({ ...p, [field]: value }));
//   };

//   const handleTCChange = (field, value) => {
//     setTestCaseForm((p) => ({ ...p, [field]: value }));
//   };

//   const addTestCaseToForm = () => {
//     if (!testCaseForm.expectedOutput.trim()) {
//       flash("Expected output is required for test case.", true);
//       return;
//     }
//     setFormData((p) => ({
//       ...p,
//       testCases: [...p.testCases, { ...testCaseForm }],
//     }));
//     setTestCaseForm(emptyTestCase);
//   };

//   const removeTestCaseFromForm = (idx) => {
//     setFormData((p) => ({
//       ...p,
//       testCases: p.testCases.filter((_, i) => i !== idx),
//     }));
//   };

//   const handleSaveProblem = async () => {
//     if (!formData.title.trim() || !formData.description.trim()) {
//       flash("Title and description are required.", true);
//       return;
//     }
//     setSaving(true);
//     try {
//       if (editingId) {
//         await updateCodingProblem(editingId, formData);
//         flash("Problem updated successfully!");
//       } else {
//         await createCodingProblem(formData);
//         flash("Problem created successfully!");
//       }
//       setFormData(emptyProblem);
//       setEditingId(null);
//       setTab("problems");
//       fetchProblems();
//     } catch (e) {
//       flash(e.response?.data?.message || "Save failed.", true);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleEditProblem = (p) => {
//     setFormData({
//       title: p.title || "",
//       description: p.description || "",
//       inputFormat: p.inputFormat || "",
//       outputFormat: p.outputFormat || "",
//       constraints: p.constraints || "",
//       sampleInput: p.sampleInput || "",
//       sampleOutput: p.sampleOutput || "",
//       difficulty: p.difficulty || "EASY",
//       totalMarks: p.totalMarks || 10,
//       testCases: [],
//     });
//     setEditingId(p.id);
//     setTab("create");
//   };

//   const handleDeleteProblem = async (id) => {
//     if (!window.confirm("Delete this problem? This cannot be undone.")) return;
//     try {
//       await deleteCodingProblem(id);
//       flash("Problem deleted.");
//       fetchProblems();
//     } catch {
//       flash("Delete failed.", true);
//     }
//   };

//   const handleAddTestCaseToExisting = async () => {
//     if (!selectedProblemForTC) return;
//     if (!testCaseForm.expectedOutput.trim()) {
//       flash("Expected output is required.", true);
//       return;
//     }
//     try {
//       await addTestCase(selectedProblemForTC, testCaseForm);
//       flash("Test case added!");
//       setTestCaseForm(emptyTestCase);
//       const res = await getTestCases(selectedProblemForTC);
//       setExistingTestCases(res.data || []);
//     } catch {
//       flash("Failed to add test case.", true);
//     }
//   };

//   const openTestCaseManager = async (problemId) => {
//     setSelectedProblemForTC(problemId);
//     try {
//       const res = await getTestCases(problemId);
//       setExistingTestCases(res.data || []);
//     } catch {
//       setExistingTestCases([]);
//     }
//   };

//   const handleAssign = async () => {
//     if (!assignProblemId || !assignBatchId.trim()) {
//       flash("Problem and batch are required.", true);
//       return;
//     }
//     try {
//       await assignProblemToBatch({
//         problemId: Number(assignProblemId),
//         batchId: assignBatchId.trim(),
//         dueDate: assignDueDate || null,
//       });
//       flash("Problem assigned to batch!");
//       setAssignProblemId("");
//       setAssignBatchId("");
//       setAssignDueDate("");
//     } catch (e) {
//       flash(e.response?.data?.message || "Assignment failed.", true);
//     }
//   };

//   const fetchAssignments = async () => {
//     if (!assignBatchQuery.trim()) return;
//     try {
//       const res = await getAssignmentsByBatchForTrainer(
//         assignBatchQuery.trim(),
//       );
//       setAssignments(res.data || []);
//     } catch {
//       setAssignments([]);
//     }
//   };

//   const handleUnassign = async (id) => {
//     try {
//       await unassignProblem(id);
//       flash("Assignment removed.");
//       fetchAssignments();
//     } catch {
//       flash("Failed to remove.", true);
//     }
//   };

//   const fetchSubmissions = async () => {
//     if (!submissionBatchId.trim()) return;
//     setLoadingSubmissions(true);
//     try {
//       const res = await getBatchCodeSubmissions(submissionBatchId.trim());
//       setSubmissions(res.data || []);
//     } catch {
//       setSubmissions([]);
//     } finally {
//       setLoadingSubmissions(false);
//     }
//   };

//   const statusColor = (s) => {
//     if (s === "SUCCESS") return "#00e676";
//     if (s === "COMPILE_ERROR") return "#ffab40";
//     return "#ff5252";
//   };

//   const diffColor = (d) => {
//     if (d === "EASY") return "#00e676";
//     if (d === "MEDIUM") return "#ffab40";
//     return "#ff5252";
//   };

//   return (
//     <div style={styles.root}>
//       {/* ── HEADER ── */}
//       <div style={styles.header}>
//         <div style={styles.headerLeft}>
//           <span style={styles.logo}>{"</>"}</span>
//           <span style={styles.logoText}>CodeLab</span>
//           <span style={styles.trainerBadge}>Trainer</span>
//         </div>
//         <div style={styles.tabs}>
//           {[
//             { key: "problems", label: "📋 Problems" },
//             { key: "create", label: editingId ? "✏️ Edit" : "➕ Create" },
//             { key: "assign", label: "🎯 Assign" },
//             { key: "submissions", label: "📊 Submissions" },
//           ].map(({ key, label }) => (
//             <button
//               key={key}
//               onClick={() => setTab(key)}
//               style={{
//                 ...styles.tabBtn,
//                 ...(tab === key ? styles.tabActive : {}),
//               }}
//             >
//               {label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ── FLASH MESSAGES ── */}
//       {successMsg && <div style={styles.flashSuccess}>{successMsg}</div>}
//       {errorMsg && <div style={styles.flashError}>{errorMsg}</div>}

//       {/* ═══════════════════════════════════════ */}
//       {/* TAB: PROBLEMS LIST                      */}
//       {/* ═══════════════════════════════════════ */}
//       {tab === "problems" && (
//         <div style={styles.content}>
//           <div style={styles.sectionTitle}>
//             <span>My Problems</span>
//             <span style={styles.countBadge}>{problems.length}</span>
//             <button
//               style={styles.createBtn}
//               onClick={() => {
//                 setFormData(emptyProblem);
//                 setEditingId(null);
//                 setTab("create");
//               }}
//             >
//               + New Problem
//             </button>
//           </div>
//           {problems.length === 0 ? (
//             <div style={styles.empty}>
//               No problems yet. Create your first problem!
//             </div>
//           ) : (
//             <div style={styles.problemTable}>
//               <div style={styles.tableHeader}>
//                 <span style={{ flex: 3 }}>Title</span>
//                 <span style={{ flex: 1 }}>Difficulty</span>
//                 <span style={{ flex: 1 }}>Marks</span>
//                 <span style={{ flex: 1 }}>Status</span>
//                 <span style={{ flex: 2, textAlign: "right" }}>Actions</span>
//               </div>
//               {problems.map((p) => (
//                 <div key={p.id} style={styles.tableRow}>
//                   <span style={{ flex: 3, fontWeight: 600 }}>{p.title}</span>
//                   <span
//                     style={{
//                       flex: 1,
//                       color: diffColor(p.difficulty),
//                       fontWeight: 700,
//                     }}
//                   >
//                     {p.difficulty}
//                   </span>
//                   <span style={{ flex: 1, color: "#f0c040" }}>
//                     {p.totalMarks}
//                   </span>
//                   <span
//                     style={{
//                       flex: 1,
//                       color: p.isActive ? "#00e676" : "#ff5252",
//                     }}
//                   >
//                     {p.isActive ? "Active" : "Inactive"}
//                   </span>
//                   <span
//                     style={{
//                       flex: 2,
//                       display: "flex",
//                       gap: 8,
//                       justifyContent: "flex-end",
//                     }}
//                   >
//                     <button
//                       style={styles.actionBtn}
//                       onClick={() => openTestCaseManager(p.id)}
//                     >
//                       🧪 Tests
//                     </button>
//                     <button
//                       style={styles.actionBtn}
//                       onClick={() => handleEditProblem(p)}
//                     >
//                       ✏️ Edit
//                     </button>
//                     <button
//                       style={{ ...styles.actionBtn, ...styles.deleteBtn }}
//                       onClick={() => handleDeleteProblem(p.id)}
//                     >
//                       🗑 Delete
//                     </button>
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Test case manager panel */}
//           {selectedProblemForTC && (
//             <div style={styles.tcManagerPanel}>
//               <div style={styles.tcManagerHeader}>
//                 <span>Test Cases — Problem #{selectedProblemForTC}</span>
//                 <button
//                   style={styles.closeBtn}
//                   onClick={() => setSelectedProblemForTC(null)}
//                 >
//                   ✕
//                 </button>
//               </div>
//               <div style={styles.tcList}>
//                 {existingTestCases.length === 0 ? (
//                   <div style={styles.empty}>No test cases yet.</div>
//                 ) : (
//                   existingTestCases.map((tc, i) => (
//                     <div key={tc.id} style={styles.tcItem}>
//                       <div style={styles.tcItemHeader}>
//                         <span style={styles.tcNum}>#{i + 1}</span>
//                         {tc.isHidden && (
//                           <span style={styles.hiddenBadge}>Hidden</span>
//                         )}
//                         <span style={styles.weightBadge}>{tc.weightage}pt</span>
//                       </div>
//                       <div style={styles.tcRow}>
//                         <span style={styles.tcKey}>Input:</span>
//                         <code style={styles.tcVal}>{tc.input || "(none)"}</code>
//                       </div>
//                       <div style={styles.tcRow}>
//                         <span style={styles.tcKey}>Expected:</span>
//                         <code style={styles.tcVal}>{tc.expectedOutput}</code>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//               <div style={styles.tcAddForm}>
//                 <div style={styles.formLabel}>Add Test Case</div>
//                 <div style={styles.formRow}>
//                   <textarea
//                     style={styles.tcInput}
//                     placeholder="Input (optional)"
//                     value={testCaseForm.input}
//                     onChange={(e) => handleTCChange("input", e.target.value)}
//                     rows={2}
//                   />
//                   <textarea
//                     style={styles.tcInput}
//                     placeholder="Expected output *"
//                     value={testCaseForm.expectedOutput}
//                     onChange={(e) =>
//                       handleTCChange("expectedOutput", e.target.value)
//                     }
//                     rows={2}
//                   />
//                 </div>
//                 <div style={styles.formRow}>
//                   <label style={styles.checkLabel}>
//                     <input
//                       type="checkbox"
//                       checked={testCaseForm.isHidden}
//                       onChange={(e) =>
//                         handleTCChange("isHidden", e.target.checked)
//                       }
//                     />
//                     Hidden (not shown to student)
//                   </label>
//                   <input
//                     style={styles.smallInput}
//                     type="number"
//                     min={1}
//                     placeholder="Weightage"
//                     value={testCaseForm.weightage}
//                     onChange={(e) =>
//                       handleTCChange("weightage", Number(e.target.value))
//                     }
//                   />
//                   <button
//                     style={styles.addTCBtn}
//                     onClick={handleAddTestCaseToExisting}
//                   >
//                     + Add
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ═══════════════════════════════════════ */}
//       {/* TAB: CREATE / EDIT PROBLEM              */}
//       {/* ═══════════════════════════════════════ */}
//       {tab === "create" && (
//         <div style={styles.content}>
//           <div style={styles.sectionTitle}>
//             {editingId ? "✏️ Edit Problem" : "➕ Create New Problem"}
//           </div>
//           <div style={styles.createForm}>
//             <div style={styles.formGrid}>
//               <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
//                 <label style={styles.formLabel}>Title *</label>
//                 <input
//                   style={styles.formInput}
//                   value={formData.title}
//                   onChange={(e) => handleFormChange("title", e.target.value)}
//                   placeholder="e.g. Two Sum"
//                 />
//               </div>

//               <div style={styles.formGroup}>
//                 <label style={styles.formLabel}>Difficulty *</label>
//                 <div style={styles.diffBtnGroup}>
//                   {DIFFICULTIES.map((d) => (
//                     <button
//                       key={d}
//                       style={{
//                         ...styles.diffBtn,
//                         ...(formData.difficulty === d
//                           ? {
//                               background:
//                                 d === "EASY"
//                                   ? "#00e67622"
//                                   : d === "MEDIUM"
//                                     ? "#ffab4022"
//                                     : "#ff525222",
//                               color:
//                                 d === "EASY"
//                                   ? "#00e676"
//                                   : d === "MEDIUM"
//                                     ? "#ffab40"
//                                     : "#ff5252",
//                               border: `1px solid ${d === "EASY" ? "#00e676" : d === "MEDIUM" ? "#ffab40" : "#ff5252"}`,
//                             }
//                           : {}),
//                       }}
//                       onClick={() => handleFormChange("difficulty", d)}
//                     >
//                       {d}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div style={styles.formGroup}>
//                 <label style={styles.formLabel}>Total Marks *</label>
//                 <input
//                   style={styles.formInput}
//                   type="number"
//                   min={1}
//                   value={formData.totalMarks}
//                   onChange={(e) =>
//                     handleFormChange("totalMarks", Number(e.target.value))
//                   }
//                 />
//               </div>

//               <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
//                 <label style={styles.formLabel}>Description *</label>
//                 <textarea
//                   style={{ ...styles.formInput, ...styles.formTextarea }}
//                   value={formData.description}
//                   onChange={(e) =>
//                     handleFormChange("description", e.target.value)
//                   }
//                   placeholder="Describe the problem clearly..."
//                   rows={4}
//                 />
//               </div>

//               <div style={styles.formGroup}>
//                 <label style={styles.formLabel}>Input Format</label>
//                 <textarea
//                   style={{ ...styles.formInput, ...styles.formTextarea }}
//                   value={formData.inputFormat}
//                   onChange={(e) =>
//                     handleFormChange("inputFormat", e.target.value)
//                   }
//                   rows={3}
//                 />
//               </div>
//               <div style={styles.formGroup}>
//                 <label style={styles.formLabel}>Output Format</label>
//                 <textarea
//                   style={{ ...styles.formInput, ...styles.formTextarea }}
//                   value={formData.outputFormat}
//                   onChange={(e) =>
//                     handleFormChange("outputFormat", e.target.value)
//                   }
//                   rows={3}
//                 />
//               </div>

//               <div style={styles.formGroup}>
//                 <label style={styles.formLabel}>Constraints</label>
//                 <textarea
//                   style={{ ...styles.formInput, ...styles.formTextarea }}
//                   value={formData.constraints}
//                   onChange={(e) =>
//                     handleFormChange("constraints", e.target.value)
//                   }
//                   rows={3}
//                   placeholder="e.g. 1 ≤ n ≤ 10^5"
//                 />
//               </div>

//               <div style={styles.formGroup}>
//                 <label style={styles.formLabel}>Sample Input</label>
//                 <textarea
//                   style={{
//                     ...styles.formInput,
//                     ...styles.formTextarea,
//                     fontFamily: "monospace",
//                   }}
//                   value={formData.sampleInput}
//                   onChange={(e) =>
//                     handleFormChange("sampleInput", e.target.value)
//                   }
//                   rows={3}
//                 />
//               </div>
//               <div style={styles.formGroup}>
//                 <label style={styles.formLabel}>Sample Output</label>
//                 <textarea
//                   style={{
//                     ...styles.formInput,
//                     ...styles.formTextarea,
//                     fontFamily: "monospace",
//                   }}
//                   value={formData.sampleOutput}
//                   onChange={(e) =>
//                     handleFormChange("sampleOutput", e.target.value)
//                   }
//                   rows={3}
//                 />
//               </div>
//             </div>

//             {/* Test cases */}
//             <div style={styles.tcSection}>
//               <div style={styles.formLabel}>Test Cases</div>
//               {formData.testCases.length > 0 && (
//                 <div style={styles.tcList}>
//                   {formData.testCases.map((tc, i) => (
//                     <div key={i} style={styles.tcItem}>
//                       <div style={styles.tcItemHeader}>
//                         <span style={styles.tcNum}>#{i + 1}</span>
//                         {tc.isHidden && (
//                           <span style={styles.hiddenBadge}>Hidden</span>
//                         )}
//                         <span style={styles.weightBadge}>{tc.weightage}pt</span>
//                         <button
//                           style={styles.removeTCBtn}
//                           onClick={() => removeTestCaseFromForm(i)}
//                         >
//                           ✕
//                         </button>
//                       </div>
//                       <div style={styles.tcRow}>
//                         <span style={styles.tcKey}>Input:</span>
//                         <code style={styles.tcVal}>{tc.input || "(none)"}</code>
//                       </div>
//                       <div style={styles.tcRow}>
//                         <span style={styles.tcKey}>Expected:</span>
//                         <code style={styles.tcVal}>{tc.expectedOutput}</code>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//               <div style={styles.tcAddForm}>
//                 <div style={styles.formRow}>
//                   <textarea
//                     style={styles.tcInput}
//                     placeholder="Input (optional)"
//                     value={testCaseForm.input}
//                     onChange={(e) => handleTCChange("input", e.target.value)}
//                     rows={2}
//                   />
//                   <textarea
//                     style={styles.tcInput}
//                     placeholder="Expected output *"
//                     value={testCaseForm.expectedOutput}
//                     onChange={(e) =>
//                       handleTCChange("expectedOutput", e.target.value)
//                     }
//                     rows={2}
//                   />
//                 </div>
//                 <div style={styles.formRow}>
//                   <label style={styles.checkLabel}>
//                     <input
//                       type="checkbox"
//                       checked={testCaseForm.isHidden}
//                       onChange={(e) =>
//                         handleTCChange("isHidden", e.target.checked)
//                       }
//                     />
//                     Hidden test case
//                   </label>
//                   <input
//                     style={styles.smallInput}
//                     type="number"
//                     min={1}
//                     placeholder="Weightage"
//                     value={testCaseForm.weightage}
//                     onChange={(e) =>
//                       handleTCChange("weightage", Number(e.target.value))
//                     }
//                   />
//                   <button style={styles.addTCBtn} onClick={addTestCaseToForm}>
//                     + Add
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div style={styles.formActions}>
//               <button
//                 style={styles.cancelBtn}
//                 onClick={() => {
//                   setTab("problems");
//                   setEditingId(null);
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 style={styles.saveBtn}
//                 onClick={handleSaveProblem}
//                 disabled={saving}
//               >
//                 {saving
//                   ? "Saving..."
//                   : editingId
//                     ? "Update Problem"
//                     : "Create Problem"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ═══════════════════════════════════════ */}
//       {/* TAB: ASSIGN                             */}
//       {/* ═══════════════════════════════════════ */}
//       {tab === "assign" && (
//         <div style={styles.content}>
//           <div style={styles.sectionTitle}>🎯 Assign Problems to Batches</div>

//           <div style={styles.assignCard}>
//             <div style={styles.formLabel}>Assign a Problem to a Batch</div>
//             <div style={styles.assignForm}>
//               {/* Select Problem */}
//               <div style={styles.formGroup}>
//                 <label style={styles.formLabel}>Select Problem</label>
//                 <select
//                   style={styles.formInput}
//                   value={assignProblemId}
//                   onChange={(e) => setAssignProblemId(e.target.value)}
//                 >
//                   <option value="">-- Select Problem --</option>
//                   {problems.map((p) => (
//                     <option key={p.id} value={p.id}>
//                       {p.title} ({p.difficulty})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Select Batch — DROPDOWN from trainer's batches */}
//               <div style={styles.formGroup}>
//                 <label style={styles.formLabel}>Select Batch *</label>
//                 <select
//                   style={styles.formInput}
//                   value={assignBatchId}
//                   onChange={(e) => setAssignBatchId(e.target.value)}
//                   disabled={loadingBatches}
//                 >
//                   <option value="">
//                     {loadingBatches
//                       ? "Loading batches..."
//                       : "-- Select Batch --"}
//                   </option>
//                   {trainerBatches.map((b) => (
//                     <option key={b.batchId || b.id} value={b.batchId || b.id}>
//                       {b.batchName || b.name || b.batchId || b.id}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Due Date */}
//               <div style={styles.formGroup}>
//                 <label style={styles.formLabel}>Due Date (optional)</label>
//                 <input
//                   style={styles.formInput}
//                   type="datetime-local"
//                   value={assignDueDate}
//                   onChange={(e) => setAssignDueDate(e.target.value)}
//                 />
//               </div>

//               <button style={styles.saveBtn} onClick={handleAssign}>
//                 ⚡ Assign
//               </button>
//             </div>
//           </div>

//           {/* View assignments by batch */}
//           <div style={{ ...styles.assignCard, marginTop: 24 }}>
//             <div style={styles.formLabel}>View Assignments for a Batch</div>
//             <div
//               style={{
//                 display: "flex",
//                 gap: 12,
//                 marginBottom: 16,
//                 alignItems: "flex-end",
//               }}
//             >
//               <div style={{ flex: 1 }}>
//                 <select
//                   style={{ ...styles.formInput, width: "100%" }}
//                   value={assignBatchQuery}
//                   onChange={(e) => setAssignBatchQuery(e.target.value)}
//                 >
//                   <option value="">-- Select Batch to View --</option>
//                   {trainerBatches.map((b) => (
//                     <option key={b.batchId || b.id} value={b.batchId || b.id}>
//                       {b.batchName || b.name || b.batchId || b.id}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <button style={styles.saveBtn} onClick={fetchAssignments}>
//                 Search
//               </button>
//             </div>
//             {assignments.length > 0 ? (
//               <div style={styles.assignList}>
//                 {assignments.map((a) => (
//                   <div key={a.assignmentId} style={styles.assignItem}>
//                     <div style={styles.assignItemLeft}>
//                       <span style={styles.assignTitle}>{a.problemTitle}</span>
//                       <span style={styles.assignMeta}>Batch: {a.batchId}</span>
//                       {a.dueDate && (
//                         <span style={styles.assignMeta}>
//                           Due: {new Date(a.dueDate).toLocaleDateString()}
//                         </span>
//                       )}
//                     </div>
//                     <button
//                       style={{ ...styles.actionBtn, ...styles.deleteBtn }}
//                       onClick={() => handleUnassign(a.assignmentId)}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ) : assignBatchQuery ? (
//               <div style={styles.empty}>
//                 No assignments found for this batch.
//               </div>
//             ) : null}
//           </div>
//         </div>
//       )}

//       {/* ═══════════════════════════════════════ */}
//       {/* TAB: SUBMISSIONS                        */}
//       {/* ═══════════════════════════════════════ */}
//       {tab === "submissions" && (
//         <div style={styles.content}>
//           <div style={styles.sectionTitle}>📊 Student Submissions</div>
//           <div
//             style={{
//               display: "flex",
//               gap: 12,
//               marginBottom: 24,
//               alignItems: "flex-end",
//             }}
//           >
//             <div style={{ flex: 1, maxWidth: 360 }}>
//               <select
//                 style={{ ...styles.formInput, width: "100%" }}
//                 value={submissionBatchId}
//                 onChange={(e) => setSubmissionBatchId(e.target.value)}
//               >
//                 <option value="">-- Select Batch --</option>
//                 {trainerBatches.map((b) => (
//                   <option key={b.batchId || b.id} value={b.batchId || b.id}>
//                     {b.batchName || b.name || b.batchId || b.id}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <button style={styles.saveBtn} onClick={fetchSubmissions}>
//               {loadingSubmissions ? "Loading..." : "Load Submissions"}
//             </button>
//           </div>

//           {submissions.length === 0 && submissionBatchId ? (
//             <div style={styles.empty}>No submissions found for this batch.</div>
//           ) : (
//             <div style={styles.submissionList}>
//               {submissions.map((s) => (
//                 <div
//                   key={s.submissionId}
//                   style={{
//                     ...styles.submissionCard,
//                     ...(expandedSubmission === s.submissionId
//                       ? styles.submissionCardActive
//                       : {}),
//                   }}
//                 >
//                   <div
//                     style={styles.submissionTop}
//                     onClick={() =>
//                       setExpandedSubmission(
//                         expandedSubmission === s.submissionId
//                           ? null
//                           : s.submissionId,
//                       )
//                     }
//                   >
//                     <span style={styles.studentEmail}>{s.studentEmail}</span>
//                     <span style={styles.langTag}>{s.language}</span>
//                     <span
//                       style={{ color: statusColor(s.status), fontWeight: 700 }}
//                     >
//                       {s.status}
//                     </span>
//                     <span style={styles.execTime}>{s.executionTimeMs}ms</span>
//                     <span style={styles.submissionTime}>
//                       {new Date(s.timestamp).toLocaleString()}
//                     </span>
//                     <span style={styles.chevron}>
//                       {expandedSubmission === s.submissionId ? "▲" : "▼"}
//                     </span>
//                   </div>
//                   {expandedSubmission === s.submissionId && (
//                     <div style={styles.submissionExpand}>
//                       <div style={styles.expandSection}>
//                         <div style={styles.sectionLabel}>Output</div>
//                         <pre style={styles.codeBlock}>
//                           {s.output || "(no output)"}
//                         </pre>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ── STYLES ── */
// const styles = {
//   root: {
//     minHeight: "100vh",
//     background: "#0d1117",
//     color: "#e6edf3",
//     fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
//     display: "flex",
//     flexDirection: "column",
//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "0 24px",
//     height: 56,
//     background: "#161b22",
//     borderBottom: "1px solid #30363d",
//     flexShrink: 0,
//   },
//   headerLeft: { display: "flex", alignItems: "center", gap: 12 },
//   logo: { fontSize: 22, color: "#f79327", fontWeight: 900 },
//   logoText: { fontSize: 16, fontWeight: 700, letterSpacing: 1 },
//   trainerBadge: {
//     fontSize: 11,
//     background: "#f7932722",
//     color: "#f79327",
//     border: "1px solid #f79327",
//     borderRadius: 20,
//     padding: "2px 10px",
//     fontWeight: 600,
//   },
//   tabs: { display: "flex", gap: 4 },
//   tabBtn: {
//     background: "none",
//     border: "none",
//     color: "#8b949e",
//     padding: "8px 16px",
//     borderRadius: 6,
//     cursor: "pointer",
//     fontSize: 13,
//     fontFamily: "inherit",
//   },
//   tabActive: { background: "#21262d", color: "#e6edf3", fontWeight: 600 },
//   flashSuccess: {
//     background: "#00e67622",
//     color: "#00e676",
//     border: "1px solid #00e676",
//     padding: "10px 24px",
//     fontSize: 13,
//     textAlign: "center",
//   },
//   flashError: {
//     background: "#ff525222",
//     color: "#ff5252",
//     border: "1px solid #ff5252",
//     padding: "10px 24px",
//     fontSize: 13,
//     textAlign: "center",
//   },
//   content: {
//     flex: 1,
//     padding: "28px 32px",
//     maxWidth: 1200,
//     width: "100%",
//     margin: "0 auto",
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 700,
//     marginBottom: 24,
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     flexWrap: "wrap",
//   },
//   countBadge: {
//     background: "#21262d",
//     color: "#8b949e",
//     borderRadius: 20,
//     padding: "2px 12px",
//     fontSize: 13,
//     fontWeight: 600,
//   },
//   createBtn: {
//     marginLeft: "auto",
//     background: "#238636",
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     padding: "8px 18px",
//     cursor: "pointer",
//     fontWeight: 700,
//     fontSize: 13,
//     fontFamily: "inherit",
//   },
//   empty: {
//     color: "#8b949e",
//     textAlign: "center",
//     padding: "60px 0",
//     fontSize: 15,
//   },
//   problemTable: {
//     border: "1px solid #30363d",
//     borderRadius: 10,
//     overflow: "hidden",
//   },
//   tableHeader: {
//     display: "flex",
//     gap: 16,
//     padding: "12px 18px",
//     background: "#161b22",
//     borderBottom: "1px solid #30363d",
//     fontSize: 11,
//     color: "#8b949e",
//     fontWeight: 700,
//     textTransform: "uppercase",
//     letterSpacing: 0.8,
//   },
//   tableRow: {
//     display: "flex",
//     gap: 16,
//     padding: "14px 18px",
//     borderBottom: "1px solid #21262d",
//     alignItems: "center",
//     fontSize: 13,
//   },
//   actionBtn: {
//     background: "#21262d",
//     color: "#c9d1d9",
//     border: "1px solid #30363d",
//     padding: "5px 12px",
//     borderRadius: 6,
//     cursor: "pointer",
//     fontSize: 12,
//     fontFamily: "inherit",
//   },
//   deleteBtn: { color: "#ff5252", borderColor: "#ff525244" },
//   tcManagerPanel: {
//     marginTop: 28,
//     background: "#161b22",
//     border: "1px solid #30363d",
//     borderRadius: 12,
//     padding: 20,
//   },
//   tcManagerHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//     fontWeight: 700,
//     fontSize: 15,
//   },
//   closeBtn: {
//     background: "none",
//     border: "none",
//     color: "#8b949e",
//     cursor: "pointer",
//     fontSize: 18,
//     fontFamily: "inherit",
//   },
//   tcList: {
//     display: "flex",
//     flexDirection: "column",
//     gap: 8,
//     marginBottom: 16,
//   },
//   tcItem: {
//     background: "#0d1117",
//     border: "1px solid #30363d",
//     borderRadius: 8,
//     padding: "12px 14px",
//   },
//   tcItemHeader: {
//     display: "flex",
//     gap: 10,
//     alignItems: "center",
//     marginBottom: 6,
//   },
//   tcNum: { color: "#8b949e", fontSize: 12, fontWeight: 700 },
//   hiddenBadge: {
//     background: "#ff525222",
//     color: "#ff5252",
//     border: "1px solid #ff525244",
//     borderRadius: 10,
//     padding: "1px 8px",
//     fontSize: 10,
//     fontWeight: 700,
//   },
//   weightBadge: {
//     background: "#f0c04022",
//     color: "#f0c040",
//     border: "1px solid #f0c04044",
//     borderRadius: 10,
//     padding: "1px 8px",
//     fontSize: 10,
//     fontWeight: 700,
//   },
//   removeTCBtn: {
//     marginLeft: "auto",
//     background: "none",
//     border: "none",
//     color: "#ff5252",
//     cursor: "pointer",
//     fontSize: 14,
//     fontFamily: "inherit",
//   },
//   tcRow: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 3 },
//   tcKey: { color: "#8b949e", fontSize: 12, minWidth: 72, flexShrink: 0 },
//   tcVal: {
//     color: "#79c0ff",
//     fontSize: 12,
//     background: "#161b22",
//     padding: "1px 6px",
//     borderRadius: 4,
//     wordBreak: "break-all",
//   },
//   tcAddForm: {
//     background: "#0d1117",
//     border: "1px solid #30363d",
//     borderRadius: 8,
//     padding: 14,
//   },
//   tcInput: {
//     flex: 1,
//     background: "#161b22",
//     border: "1px solid #30363d",
//     color: "#e6edf3",
//     borderRadius: 6,
//     padding: "8px 10px",
//     fontSize: 12,
//     fontFamily: "inherit",
//     resize: "vertical",
//     outline: "none",
//   },
//   formRow: { display: "flex", gap: 10, alignItems: "center", marginBottom: 10 },
//   checkLabel: {
//     display: "flex",
//     gap: 8,
//     alignItems: "center",
//     color: "#c9d1d9",
//     fontSize: 13,
//     cursor: "pointer",
//   },
//   smallInput: {
//     width: 90,
//     background: "#161b22",
//     border: "1px solid #30363d",
//     color: "#e6edf3",
//     borderRadius: 6,
//     padding: "6px 10px",
//     fontSize: 13,
//     fontFamily: "inherit",
//     outline: "none",
//   },
//   addTCBtn: {
//     background: "#238636",
//     color: "#fff",
//     border: "none",
//     borderRadius: 6,
//     padding: "6px 16px",
//     cursor: "pointer",
//     fontWeight: 700,
//     fontSize: 13,
//     fontFamily: "inherit",
//   },
//   createForm: {
//     background: "#161b22",
//     border: "1px solid #30363d",
//     borderRadius: 12,
//     padding: 28,
//   },
//   formGrid: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: 20,
//     marginBottom: 24,
//   },
//   formGroup: { display: "flex", flexDirection: "column", gap: 6 },
//   formLabel: {
//     fontSize: 12,
//     fontWeight: 700,
//     color: "#8b949e",
//     letterSpacing: 0.8,
//     textTransform: "uppercase",
//   },
//   formInput: {
//     background: "#0d1117",
//     border: "1px solid #30363d",
//     color: "#e6edf3",
//     borderRadius: 8,
//     padding: "10px 12px",
//     fontSize: 13,
//     fontFamily: "inherit",
//     outline: "none",
//     width: "100%",
//     boxSizing: "border-box",
//   },
//   formTextarea: { resize: "vertical" },
//   diffBtnGroup: { display: "flex", gap: 8 },
//   diffBtn: {
//     background: "#21262d",
//     border: "1px solid #30363d",
//     color: "#8b949e",
//     padding: "7px 16px",
//     borderRadius: 6,
//     cursor: "pointer",
//     fontWeight: 700,
//     fontSize: 13,
//     fontFamily: "inherit",
//   },
//   tcSection: { marginBottom: 24 },
//   formActions: {
//     display: "flex",
//     gap: 12,
//     justifyContent: "flex-end",
//     marginTop: 8,
//   },
//   cancelBtn: {
//     background: "#21262d",
//     color: "#c9d1d9",
//     border: "1px solid #30363d",
//     padding: "10px 24px",
//     borderRadius: 8,
//     cursor: "pointer",
//     fontWeight: 700,
//     fontSize: 14,
//     fontFamily: "inherit",
//   },
//   saveBtn: {
//     background: "#1f6feb",
//     color: "#fff",
//     border: "none",
//     padding: "10px 24px",
//     borderRadius: 8,
//     cursor: "pointer",
//     fontWeight: 700,
//     fontSize: 14,
//     fontFamily: "inherit",
//   },
//   assignCard: {
//     background: "#161b22",
//     border: "1px solid #30363d",
//     borderRadius: 12,
//     padding: 24,
//   },
//   assignForm: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: 16,
//     alignItems: "flex-end",
//     marginTop: 16,
//   },
//   assignList: { display: "flex", flexDirection: "column", gap: 10 },
//   assignItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     background: "#0d1117",
//     border: "1px solid #30363d",
//     borderRadius: 8,
//     padding: "12px 16px",
//   },
//   assignItemLeft: { display: "flex", flexDirection: "column", gap: 3 },
//   assignTitle: { fontWeight: 700, fontSize: 14 },
//   assignMeta: { fontSize: 12, color: "#8b949e" },
//   submissionList: { display: "flex", flexDirection: "column", gap: 8 },
//   submissionCard: {
//     background: "#161b22",
//     border: "1px solid #30363d",
//     borderRadius: 10,
//     overflow: "hidden",
//   },
//   submissionCardActive: { borderColor: "#f79327" },
//   submissionTop: {
//     display: "flex",
//     gap: 16,
//     padding: "14px 18px",
//     alignItems: "center",
//     cursor: "pointer",
//     flexWrap: "wrap",
//   },
//   studentEmail: { fontWeight: 600, fontSize: 13, flex: 1, minWidth: 180 },
//   langTag: {
//     background: "#21262d",
//     color: "#79c0ff",
//     borderRadius: 6,
//     padding: "2px 10px",
//     fontSize: 12,
//     fontWeight: 700,
//   },
//   execTime: { color: "#8b949e", fontSize: 12 },
//   submissionTime: { color: "#8b949e", fontSize: 12, marginLeft: "auto" },
//   chevron: { color: "#8b949e", fontSize: 12 },
//   submissionExpand: { padding: "0 18px 18px" },
//   expandSection: {},
//   sectionLabel: {
//     fontSize: 11,
//     fontWeight: 700,
//     color: "#58a6ff",
//     letterSpacing: 1.2,
//     textTransform: "uppercase",
//     marginBottom: 6,
//     marginTop: 12,
//   },
//   codeBlock: {
//     background: "#0d1117",
//     border: "1px solid #30363d",
//     borderRadius: 6,
//     padding: "10px 14px",
//     fontSize: 12,
//     color: "#79c0ff",
//     fontFamily: "inherit",
//     whiteSpace: "pre-wrap",
//     lineHeight: 1.6,
//     margin: 0,
//   },
// };

import { useState, useEffect } from "react";
import {
  getMyProblems,
  createCodingProblem,
  updateCodingProblem,
  deleteCodingProblem,
  addTestCase,
  getTestCases,
  assignProblemToBatch,
  getAssignmentsByBatchForTrainer,
  unassignProblem,
  getBatchCodeSubmissions,
} from "../services/assessmentService";
import { getTrainerBatches } from "../services/batchService";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];

const emptyProblem = {
  title: "",
  description: "",
  inputFormat: "",
  outputFormat: "",
  constraints: "",
  sampleInput: "",
  sampleOutput: "",
  difficulty: "EASY",
  totalMarks: 10,
  testCases: [],
};
const emptyTC = {
  input: "",
  expectedOutput: "",
  isHidden: false,
  weightage: 1,
};

export default function TrainerCompilerPage() {
  const [tab, setTab] = useState("problems");
  const [problems, setProblems] = useState([]);
  const [formData, setFormData] = useState(emptyProblem);
  const [tcForm, setTcForm] = useState(emptyTC);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tcProblemId, setTcProblemId] = useState(null);
  const [existingTCs, setExistingTCs] = useState([]);
  const [assignProblemId, setAssignProblemId] = useState("");
  const [assignBatchId, setAssignBatchId] = useState("");
  const [assignDueDate, setAssignDueDate] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [assignBatchQuery, setAssignBatchQuery] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [submissionBatchId, setSubmissionBatchId] = useState("");
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [trainerBatches, setTrainerBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // problemId pending delete

  useEffect(() => {
    fetchProblems();
    fetchBatches();
  }, []);

  const flash = (msg, isError = false) => {
    if (isError) setErrorMsg(msg);
    else setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg("");
      setErrorMsg("");
    }, 3500);
  };

  const fetchProblems = async () => {
    try {
      const res = await getMyProblems();
      setProblems(res.data || []);
    } catch {
      setProblems([]);
    }
  };

  const fetchBatches = async () => {
    setLoadingBatches(true);
    try {
      const data = await getTrainerBatches();
      setTrainerBatches(Array.isArray(data) ? data : []);
    } catch {
      setTrainerBatches([]);
    } finally {
      setLoadingBatches(false);
    }
  };

  const formChange = (f, v) => setFormData((p) => ({ ...p, [f]: v }));
  const tcChange = (f, v) => setTcForm((p) => ({ ...p, [f]: v }));

  const addTCToForm = () => {
    if (!tcForm.expectedOutput.trim()) {
      flash("Expected output is required.", true);
      return;
    }
    setFormData((p) => ({ ...p, testCases: [...p.testCases, { ...tcForm }] }));
    setTcForm(emptyTC);
  };

  const removeTCFromForm = (idx) =>
    setFormData((p) => ({
      ...p,
      testCases: p.testCases.filter((_, i) => i !== idx),
    }));

  // CREATE or UPDATE via PUT
  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      flash("Title and description are required.", true);
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        // PUT /api/v1/problems/{id}
        await updateCodingProblem(editingId, formData);
        flash("Problem updated!");
      } else {
        // POST /api/v1/problems
        await createCodingProblem(formData);
        flash("Problem created!");
      }
      setFormData(emptyProblem);
      setEditingId(null);
      setTab("problems");
      fetchProblems();
    } catch (e) {
      flash(e.response?.data?.message || "Save failed.", true);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p) => {
    setFormData({
      title: p.title || "",
      description: p.description || "",
      inputFormat: p.inputFormat || "",
      outputFormat: p.outputFormat || "",
      constraints: p.constraints || "",
      sampleInput: p.sampleInput || "",
      sampleOutput: p.sampleOutput || "",
      difficulty: p.difficulty || "EASY",
      totalMarks: p.totalMarks || 10,
      testCases: [],
    });
    setEditingId(p.id);
    setTab("create");
  };

  // Hard delete via DELETE /api/v1/problems/{id}
  const confirmDelete = (id) => setDeleteConfirm(id);
  const cancelDelete = () => setDeleteConfirm(null);
  const executeDelete = async () => {
    try {
      await deleteCodingProblem(deleteConfirm);
      flash("Problem deleted.");
      fetchProblems();
    } catch {
      flash("Delete failed.", true);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const openTCManager = async (id) => {
    setTcProblemId(id);
    try {
      const res = await getTestCases(id);
      setExistingTCs(res.data || []);
    } catch {
      setExistingTCs([]);
    }
  };

  const addTCToExisting = async () => {
    if (!tcProblemId || !tcForm.expectedOutput.trim()) {
      flash("Expected output required.", true);
      return;
    }
    try {
      await addTestCase(tcProblemId, tcForm);
      flash("Test case added!");
      setTcForm(emptyTC);
      const res = await getTestCases(tcProblemId);
      setExistingTCs(res.data || []);
    } catch {
      flash("Failed to add test case.", true);
    }
  };

  const handleAssign = async () => {
    if (!assignProblemId || !assignBatchId.trim()) {
      flash("Problem and batch required.", true);
      return;
    }
    try {
      await assignProblemToBatch({
        problemId: Number(assignProblemId),
        batchId: assignBatchId.trim(),
        dueDate: assignDueDate || null,
      });
      flash("Problem assigned!");
      setAssignProblemId("");
      setAssignBatchId("");
      setAssignDueDate("");
    } catch (e) {
      flash(e.response?.data?.message || "Assignment failed.", true);
    }
  };

  const fetchAssignments = async () => {
    if (!assignBatchQuery.trim()) return;
    try {
      const res = await getAssignmentsByBatchForTrainer(
        assignBatchQuery.trim(),
      );
      setAssignments(res.data || []);
    } catch {
      setAssignments([]);
    }
  };

  const handleUnassign = async (id) => {
    try {
      await unassignProblem(id);
      flash("Removed.");
      fetchAssignments();
    } catch {
      flash("Failed to remove.", true);
    }
  };

  const fetchSubmissions = async () => {
    if (!submissionBatchId.trim()) return;
    setLoadingSubmissions(true);
    try {
      const res = await getBatchCodeSubmissions(submissionBatchId.trim());
      setSubmissions(res.data || []);
    } catch {
      setSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const statusColor = (s) =>
    s === "SUCCESS" ? "#16a34a" : s === "COMPILE_ERROR" ? "#d97706" : "#dc2626";
  const diffColor = (d) =>
    d === "EASY" ? "#16a34a" : d === "MEDIUM" ? "#d97706" : "#dc2626";
  const diffBg = (d) =>
    d === "EASY" ? "#dcfce7" : d === "MEDIUM" ? "#fef3c7" : "#fee2e2";

  return (
    <div style={T.root}>
      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirm && (
        <div style={T.modalOverlay}>
          <div style={T.modal}>
            <div style={T.modalTitle}>Delete Problem?</div>
            <div style={T.modalBody}>
              This will permanently delete the problem and all its test cases.
              This action cannot be undone.
            </div>
            <div style={T.modalActions}>
              <button style={T.cancelBtn} onClick={cancelDelete}>
                Cancel
              </button>
              <button style={T.dangerBtn} onClick={executeDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={T.header}>
        <div style={T.headerLeft}>
          <span style={T.logo}>{"</>"}</span>
          <span style={T.logoText}>CodeLab</span>
          <span style={T.trainerBadge}>Trainer</span>
        </div>
        <div style={T.tabs}>
          {[
            { key: "problems", label: "📋 Problems" },
            { key: "create", label: editingId ? "✏️ Edit" : "➕ Create" },
            { key: "assign", label: "🎯 Assign" },
            { key: "submissions", label: "📊 Submissions" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{ ...T.tabBtn, ...(tab === key ? T.tabActive : {}) }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* FLASH */}
      {successMsg && <div style={T.flashOk}>{successMsg}</div>}
      {errorMsg && <div style={T.flashErr}>{errorMsg}</div>}

      {/* ══════════════════════════════════════ */}
      {/* TAB: PROBLEMS                         */}
      {/* ══════════════════════════════════════ */}
      {tab === "problems" && (
        <div style={T.content}>
          <div style={T.pageTitle}>
            My Problems
            <span style={T.countBadge}>{problems.length}</span>
            <button
              style={T.newBtn}
              onClick={() => {
                setFormData(emptyProblem);
                setEditingId(null);
                setTab("create");
              }}
            >
              + New Problem
            </button>
          </div>

          {problems.length === 0 ? (
            <div style={T.empty}>
              No problems yet. Create your first problem!
            </div>
          ) : (
            <div style={T.table}>
              <div style={T.tableHead}>
                <span style={{ flex: 3 }}>Title</span>
                <span style={{ flex: 1 }}>Difficulty</span>
                <span style={{ flex: 1 }}>Marks</span>
                <span style={{ flex: 1 }}>Status</span>
                <span style={{ flex: 2, textAlign: "right" }}>Actions</span>
              </div>
              {problems.map((p) => (
                <div key={p.id} style={T.tableRow}>
                  <span style={{ flex: 3, fontWeight: 600, color: "#0f172a" }}>
                    {p.title}
                  </span>
                  <span style={{ flex: 1 }}>
                    <span
                      style={{
                        background: diffBg(p.difficulty),
                        color: diffColor(p.difficulty),
                        borderRadius: 20,
                        padding: "2px 10px",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {p.difficulty}
                    </span>
                  </span>
                  <span style={{ flex: 1, color: "#d97706", fontWeight: 600 }}>
                    {p.totalMarks}
                  </span>
                  <span style={{ flex: 1 }}>
                    <span
                      style={{
                        background: p.isActive ? "#dcfce7" : "#fee2e2",
                        color: p.isActive ? "#16a34a" : "#dc2626",
                        borderRadius: 20,
                        padding: "2px 10px",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </span>
                  <span
                    style={{
                      flex: 2,
                      display: "flex",
                      gap: 8,
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      style={T.actBtn}
                      onClick={() => openTCManager(p.id)}
                    >
                      🧪 Tests
                    </button>
                    <button style={T.actBtn} onClick={() => startEdit(p)}>
                      ✏️ Edit
                    </button>
                    <button
                      style={{ ...T.actBtn, ...T.delActBtn }}
                      onClick={() => confirmDelete(p.id)}
                    >
                      🗑 Delete
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TEST CASE MANAGER */}
          {tcProblemId && (
            <div style={T.tcPanel}>
              <div style={T.tcPanelHead}>
                <span style={{ fontWeight: 700 }}>
                  Test Cases — Problem #{tcProblemId}
                </span>
                <button style={T.closeBtn} onClick={() => setTcProblemId(null)}>
                  ✕
                </button>
              </div>

              {/* Sample explanation box */}
              <div style={T.sampleBox}>
                <div style={T.sampleTitle}>📌 How Test Cases Work</div>
                <div style={T.sampleText}>
                  Each test case has an <b>Input</b> and <b>Expected Output</b>.
                  When a student submits code, the judge runs their code with
                  each input and compares the actual output to the expected
                  output.
                  <br />
                  <br />
                  <b>Example for "Print Hello World":</b>
                </div>
                <div style={T.sampleRow}>
                  <div style={T.sampleCell}>
                    <div style={T.sampleCellLabel}>Input</div>
                    <code style={T.sampleCode}>(empty — no input needed)</code>
                  </div>
                  <div style={T.sampleArrow}>→</div>
                  <div style={T.sampleCell}>
                    <div style={T.sampleCellLabel}>Expected Output</div>
                    <code style={T.sampleCode}>Hello World</code>
                  </div>
                  <div style={T.sampleArrow}>→</div>
                  <div style={T.sampleCell}>
                    <div style={T.sampleCellLabel}>Student code prints</div>
                    <code style={{ ...T.sampleCode, color: "#16a34a" }}>
                      Hello World ✓ PASS
                    </code>
                  </div>
                </div>
                <div style={T.sampleText}>
                  <b>Hidden test cases</b> are used for scoring — students see
                  verdict (PASS/FAIL) but not the input/output. Visible test
                  cases act as examples shown to students.
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                {existingTCs.length === 0 ? (
                  <div
                    style={{
                      color: "#94a3b8",
                      padding: "20px 0",
                      textAlign: "center",
                    }}
                  >
                    No test cases yet. Add one below.
                  </div>
                ) : (
                  existingTCs.map((tc, i) => (
                    <div key={tc.id} style={T.tcItem}>
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            color: "#94a3b8",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          #{i + 1}
                        </span>
                        {tc.isHidden && (
                          <span style={T.hiddenBadge}>Hidden</span>
                        )}
                        <span style={T.weightBadge}>{tc.weightage}pt</span>
                      </div>
                      <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
                        <span style={{ color: "#94a3b8", minWidth: 72 }}>
                          Input:
                        </span>
                        <code style={{ color: "#0369a1" }}>
                          {tc.input || "(none)"}
                        </code>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          fontSize: 12,
                          marginTop: 3,
                        }}
                      >
                        <span style={{ color: "#94a3b8", minWidth: 72 }}>
                          Expected:
                        </span>
                        <code style={{ color: "#16a34a", fontWeight: 600 }}>
                          {tc.expectedOutput}
                        </code>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={T.addTCForm}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#0f172a",
                    marginBottom: 10,
                  }}
                >
                  + Add Test Case
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <textarea
                    style={T.tcInput}
                    placeholder="Input (leave empty if no input needed)"
                    value={tcForm.input}
                    onChange={(e) => tcChange("input", e.target.value)}
                    rows={2}
                  />
                  <textarea
                    style={T.tcInput}
                    placeholder="Expected output *"
                    value={tcForm.expectedOutput}
                    onChange={(e) => tcChange("expectedOutput", e.target.value)}
                    rows={2}
                  />
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <label
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      fontSize: 13,
                      color: "#374151",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={tcForm.isHidden}
                      onChange={(e) => tcChange("isHidden", e.target.checked)}
                    />
                    Hidden (not shown to student)
                  </label>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <span style={{ fontSize: 13, color: "#374151" }}>
                      Points:
                    </span>
                    <input
                      style={{ ...T.smallInput }}
                      type="number"
                      min={1}
                      value={tcForm.weightage}
                      onChange={(e) =>
                        tcChange("weightage", Number(e.target.value))
                      }
                    />
                  </div>
                  <button style={T.addBtn} onClick={addTCToExisting}>
                    + Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════ */}
      {/* TAB: CREATE / EDIT                    */}
      {/* ══════════════════════════════════════ */}
      {tab === "create" && (
        <div style={T.content}>
          <div style={T.pageTitle}>
            {editingId ? "✏️ Edit Problem" : "➕ Create New Problem"}
          </div>

          {/* SAMPLE GUIDE */}
          {!editingId && (
            <div style={T.guideBox}>
              <div style={T.guideTitle}>
                📘 Quick Guide — Creating a Problem
              </div>
              <div style={T.guideGrid}>
                <div style={T.guideStep}>
                  <div style={T.guideNum}>1</div>
                  <div>
                    <b>Write the Problem</b>
                    <br />
                    <span style={{ color: "#64748b", fontSize: 12 }}>
                      Fill in Title, Description, Input/Output format. Be clear
                      so students understand exactly what to code.
                    </span>
                  </div>
                </div>
                <div style={T.guideStep}>
                  <div style={T.guideNum}>2</div>
                  <div>
                    <b>Add Sample Test Cases</b>
                    <br />
                    <span style={{ color: "#64748b", fontSize: 12 }}>
                      Add visible test cases students can see as examples. Add
                      hidden ones for actual scoring.
                    </span>
                  </div>
                </div>
                <div style={T.guideStep}>
                  <div style={T.guideNum}>3</div>
                  <div>
                    <b>Assign to Batch</b>
                    <br />
                    <span style={{ color: "#64748b", fontSize: 12 }}>
                      After creating, go to the Assign tab and assign this
                      problem to your batch so students can see it.
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: 12,
                  padding: "10px 14px",
                  background: "#fef3c7",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "#92400e",
                }}
              >
                <b>Example:</b> Problem = "Print sum of two numbers" · Input =
                "3 5" · Expected Output = "8" · Student writes code that reads
                two numbers and prints their sum.
              </div>
            </div>
          )}

          <div style={T.form}>
            <div style={T.formGrid}>
              <div style={{ ...T.formGroup, gridColumn: "1 / -1" }}>
                <label style={T.formLabel}>Title *</label>
                <input
                  style={T.formInput}
                  value={formData.title}
                  onChange={(e) => formChange("title", e.target.value)}
                  placeholder="e.g. Print Sum of Two Numbers"
                />
              </div>

              <div style={T.formGroup}>
                <label style={T.formLabel}>Difficulty *</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      onClick={() => formChange("difficulty", d)}
                      style={{
                        ...T.diffBtn,
                        ...(formData.difficulty === d
                          ? {
                              background: diffBg(d),
                              color: diffColor(d),
                              border: `1px solid ${diffColor(d)}`,
                            }
                          : {}),
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div style={T.formGroup}>
                <label style={T.formLabel}>Total Marks *</label>
                <input
                  style={T.formInput}
                  type="number"
                  min={1}
                  value={formData.totalMarks}
                  onChange={(e) =>
                    formChange("totalMarks", Number(e.target.value))
                  }
                />
              </div>

              <div style={{ ...T.formGroup, gridColumn: "1 / -1" }}>
                <label style={T.formLabel}>
                  Description *{" "}
                  <span
                    style={{
                      color: "#94a3b8",
                      fontWeight: 400,
                      fontSize: 11,
                      textTransform: "none",
                    }}
                  >
                    — Explain what the student needs to code
                  </span>
                </label>
                <textarea
                  style={{ ...T.formInput, resize: "vertical" }}
                  rows={4}
                  value={formData.description}
                  onChange={(e) => formChange("description", e.target.value)}
                  placeholder="e.g. Write a program that reads two integers and prints their sum."
                />
              </div>

              <div style={T.formGroup}>
                <label style={T.formLabel}>Input Format</label>
                <textarea
                  style={{ ...T.formInput, resize: "vertical" }}
                  rows={3}
                  value={formData.inputFormat}
                  onChange={(e) => formChange("inputFormat", e.target.value)}
                  placeholder="e.g. First line contains two space-separated integers A and B."
                />
              </div>
              <div style={T.formGroup}>
                <label style={T.formLabel}>Output Format</label>
                <textarea
                  style={{ ...T.formInput, resize: "vertical" }}
                  rows={3}
                  value={formData.outputFormat}
                  onChange={(e) => formChange("outputFormat", e.target.value)}
                  placeholder="e.g. Print a single integer — the sum of A and B."
                />
              </div>

              <div style={T.formGroup}>
                <label style={T.formLabel}>Constraints</label>
                <textarea
                  style={{
                    ...T.formInput,
                    resize: "vertical",
                    fontFamily: "monospace",
                  }}
                  rows={3}
                  value={formData.constraints}
                  onChange={(e) => formChange("constraints", e.target.value)}
                  placeholder="e.g. 1 ≤ A, B ≤ 10^9"
                />
              </div>
              <div style={T.formGroup}>
                <label style={T.formLabel}>Sample Input</label>
                <textarea
                  style={{
                    ...T.formInput,
                    resize: "vertical",
                    fontFamily: "monospace",
                  }}
                  rows={3}
                  value={formData.sampleInput}
                  onChange={(e) => formChange("sampleInput", e.target.value)}
                  placeholder="e.g. 3 5"
                />
              </div>
              <div style={{ ...T.formGroup, gridColumn: "1 / -1" }}>
                <label style={T.formLabel}>Sample Output</label>
                <textarea
                  style={{
                    ...T.formInput,
                    resize: "vertical",
                    fontFamily: "monospace",
                  }}
                  rows={2}
                  value={formData.sampleOutput}
                  onChange={(e) => formChange("sampleOutput", e.target.value)}
                  placeholder="e.g. 8"
                />
              </div>
            </div>

            {/* INLINE TEST CASES */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#0f172a",
                  marginBottom: 12,
                }}
              >
                Test Cases
              </div>
              {formData.testCases.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  {formData.testCases.map((tc, i) => (
                    <div key={i} style={T.tcItem}>
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            color: "#94a3b8",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          #{i + 1}
                        </span>
                        {tc.isHidden && (
                          <span style={T.hiddenBadge}>Hidden</span>
                        )}
                        <span style={T.weightBadge}>{tc.weightage}pt</span>
                        <button
                          style={{
                            marginLeft: "auto",
                            background: "none",
                            border: "none",
                            color: "#dc2626",
                            cursor: "pointer",
                            fontSize: 14,
                          }}
                          onClick={() => removeTCFromForm(i)}
                        >
                          ✕
                        </button>
                      </div>
                      <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
                        <span style={{ color: "#94a3b8", minWidth: 72 }}>
                          Input:
                        </span>
                        <code style={{ color: "#0369a1" }}>
                          {tc.input || "(none)"}
                        </code>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          fontSize: 12,
                          marginTop: 3,
                        }}
                      >
                        <span style={{ color: "#94a3b8", minWidth: 72 }}>
                          Expected:
                        </span>
                        <code style={{ color: "#16a34a", fontWeight: 600 }}>
                          {tc.expectedOutput}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={T.addTCForm}>
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <textarea
                    style={T.tcInput}
                    placeholder="Input (optional)"
                    value={tcForm.input}
                    onChange={(e) => tcChange("input", e.target.value)}
                    rows={2}
                  />
                  <textarea
                    style={T.tcInput}
                    placeholder="Expected output *"
                    value={tcForm.expectedOutput}
                    onChange={(e) => tcChange("expectedOutput", e.target.value)}
                    rows={2}
                  />
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <label
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      fontSize: 13,
                      color: "#374151",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={tcForm.isHidden}
                      onChange={(e) => tcChange("isHidden", e.target.checked)}
                    />
                    Hidden test case
                  </label>
                  <input
                    style={T.smallInput}
                    type="number"
                    min={1}
                    placeholder="Points"
                    value={tcForm.weightage}
                    onChange={(e) =>
                      tcChange("weightage", Number(e.target.value))
                    }
                  />
                  <button style={T.addBtn} onClick={addTCToForm}>
                    + Add
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
            >
              <button
                style={T.cancelBtn}
                onClick={() => {
                  setTab("problems");
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
              <button style={T.saveBtn} onClick={handleSave} disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Problem"
                    : "Create Problem"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════ */}
      {/* TAB: ASSIGN                           */}
      {/* ══════════════════════════════════════ */}
      {tab === "assign" && (
        <div style={T.content}>
          <div style={T.pageTitle}>🎯 Assign Problems to Batches</div>

          <div style={T.card}>
            <div style={T.cardTitle}>Assign a Problem to a Batch</div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                marginTop: 16,
                alignItems: "flex-end",
              }}
            >
              <div style={T.formGroup}>
                <label style={T.formLabel}>Select Problem</label>
                <select
                  style={T.formInput}
                  value={assignProblemId}
                  onChange={(e) => setAssignProblemId(e.target.value)}
                >
                  <option value="">-- Select Problem --</option>
                  {problems.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.difficulty})
                    </option>
                  ))}
                </select>
              </div>
              <div style={T.formGroup}>
                <label style={T.formLabel}>Select Batch *</label>
                <select
                  style={T.formInput}
                  value={assignBatchId}
                  onChange={(e) => setAssignBatchId(e.target.value)}
                  disabled={loadingBatches}
                >
                  <option value="">
                    {loadingBatches ? "Loading..." : "-- Select Batch --"}
                  </option>
                  {trainerBatches.map((b) => (
                    <option key={b.batchId || b.id} value={b.batchId || b.id}>
                      {b.batchName || b.name || b.batchId || b.id}
                    </option>
                  ))}
                </select>
              </div>
              <div style={T.formGroup}>
                <label style={T.formLabel}>Due Date (optional)</label>
                <input
                  style={T.formInput}
                  type="datetime-local"
                  value={assignDueDate}
                  onChange={(e) => setAssignDueDate(e.target.value)}
                />
              </div>
              <button style={T.saveBtn} onClick={handleAssign}>
                ⚡ Assign
              </button>
            </div>
          </div>

          <div style={{ ...T.card, marginTop: 24 }}>
            <div style={T.cardTitle}>View Assignments for a Batch</div>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 16,
                marginBottom: 16,
                alignItems: "flex-end",
              }}
            >
              <select
                style={{ ...T.formInput, flex: 1 }}
                value={assignBatchQuery}
                onChange={(e) => setAssignBatchQuery(e.target.value)}
              >
                <option value="">-- Select Batch to View --</option>
                {trainerBatches.map((b) => (
                  <option key={b.batchId || b.id} value={b.batchId || b.id}>
                    {b.batchName || b.name || b.batchId || b.id}
                  </option>
                ))}
              </select>
              <button style={T.saveBtn} onClick={fetchAssignments}>
                Search
              </button>
            </div>
            {assignments.length > 0 ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {assignments.map((a) => (
                  <div
                    key={a.assignmentId}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: "12px 16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: "#0f172a",
                        }}
                      >
                        {a.problemTitle}
                      </span>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>
                        Batch: {a.batchId}
                      </span>
                      {a.dueDate && (
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>
                          Due: {new Date(a.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <button
                      style={{ ...T.actBtn, ...T.delActBtn }}
                      onClick={() => handleUnassign(a.assignmentId)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : assignBatchQuery ? (
              <div style={T.empty}>No assignments found.</div>
            ) : null}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════ */}
      {/* TAB: SUBMISSIONS                      */}
      {/* ══════════════════════════════════════ */}
      {tab === "submissions" && (
        <div style={T.content}>
          <div style={T.pageTitle}>📊 Student Submissions</div>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 24,
              alignItems: "flex-end",
            }}
          >
            <select
              style={{ ...T.formInput, flex: 1, maxWidth: 360 }}
              value={submissionBatchId}
              onChange={(e) => setSubmissionBatchId(e.target.value)}
            >
              <option value="">-- Select Batch --</option>
              {trainerBatches.map((b) => (
                <option key={b.batchId || b.id} value={b.batchId || b.id}>
                  {b.batchName || b.name || b.batchId || b.id}
                </option>
              ))}
            </select>
            <button style={T.saveBtn} onClick={fetchSubmissions}>
              {loadingSubmissions ? "Loading..." : "Load Submissions"}
            </button>
          </div>

          {submissions.length === 0 && submissionBatchId ? (
            <div style={T.empty}>No submissions found for this batch.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {submissions.map((s) => (
                <div
                  key={s.submissionId}
                  style={{
                    ...T.subCard,
                    ...(expandedSubmission === s.submissionId
                      ? { borderColor: "#f59e0b" }
                      : {}),
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      padding: "14px 18px",
                      alignItems: "center",
                      cursor: "pointer",
                      flexWrap: "wrap",
                    }}
                    onClick={() =>
                      setExpandedSubmission(
                        expandedSubmission === s.submissionId
                          ? null
                          : s.submissionId,
                      )
                    }
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        flex: 1,
                        minWidth: 180,
                        color: "#0f172a",
                      }}
                    >
                      {s.studentEmail}
                    </span>
                    <span
                      style={{
                        background: "#e0f2fe",
                        color: "#0369a1",
                        borderRadius: 6,
                        padding: "2px 10px",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {s.language}
                    </span>
                    <span
                      style={{ color: statusColor(s.status), fontWeight: 700 }}
                    >
                      {s.status}
                    </span>
                    <span style={{ color: "#94a3b8", fontSize: 12 }}>
                      {s.executionTimeMs}ms
                    </span>
                    <span
                      style={{
                        color: "#94a3b8",
                        fontSize: 12,
                        marginLeft: "auto",
                      }}
                    >
                      {new Date(s.timestamp).toLocaleString()}
                    </span>
                    <span style={{ color: "#94a3b8", fontSize: 12 }}>
                      {expandedSubmission === s.submissionId ? "▲" : "▼"}
                    </span>
                  </div>
                  {expandedSubmission === s.submissionId && (
                    <div style={{ padding: "0 18px 18px" }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#0ea5e9",
                          marginBottom: 6,
                          textTransform: "uppercase",
                        }}
                      >
                        Output
                      </div>
                      <pre
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 6,
                          padding: "10px 14px",
                          fontSize: 12,
                          color: "#374151",
                          whiteSpace: "pre-wrap",
                          margin: 0,
                        }}
                      >
                        {s.output || "(no output)"}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const T = {
  root: {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#1e293b",
    fontFamily: "'JetBrains Mono','Fira Code',monospace",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: 56,
    background: "#0f172a",
    borderBottom: "1px solid #1e293b",
    flexShrink: 0,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  logo: { fontSize: 22, color: "#f59e0b", fontWeight: 900 },
  logoText: {
    fontSize: 16,
    fontWeight: 700,
    color: "#f1f5f9",
    letterSpacing: 1,
  },
  trainerBadge: {
    fontSize: 11,
    background: "#f59e0b22",
    color: "#f59e0b",
    border: "1px solid #f59e0b",
    borderRadius: 20,
    padding: "2px 10px",
    fontWeight: 600,
  },
  tabs: { display: "flex", gap: 4 },
  tabBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
  },
  tabActive: { background: "#1e293b", color: "#f1f5f9", fontWeight: 600 },
  flashOk: {
    background: "#dcfce7",
    color: "#16a34a",
    border: "1px solid #bbf7d0",
    padding: "10px 24px",
    fontSize: 13,
    textAlign: "center",
  },
  flashErr: {
    background: "#fee2e2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    padding: "10px 24px",
    fontSize: 13,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: "28px 32px",
    maxWidth: 1200,
    width: "100%",
    margin: "0 auto",
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 24,
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "#0f172a",
  },
  countBadge: {
    background: "#e2e8f0",
    color: "#64748b",
    borderRadius: 20,
    padding: "2px 12px",
    fontSize: 13,
    fontWeight: 600,
  },
  newBtn: {
    marginLeft: "auto",
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 18px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
    fontFamily: "inherit",
  },
  empty: {
    color: "#94a3b8",
    textAlign: "center",
    padding: "60px 0",
    fontSize: 15,
  },
  table: {
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  tableHead: {
    display: "flex",
    gap: 16,
    padding: "12px 18px",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    fontSize: 11,
    color: "#64748b",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  tableRow: {
    display: "flex",
    gap: 16,
    padding: "14px 18px",
    borderBottom: "1px solid #f1f5f9",
    alignItems: "center",
    fontSize: 13,
  },
  actBtn: {
    background: "#f1f5f9",
    color: "#475569",
    border: "1px solid #e2e8f0",
    padding: "5px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "inherit",
  },
  delActBtn: {
    color: "#dc2626",
    borderColor: "#fecaca",
    background: "#fef2f2",
  },
  // TC Panel
  tcPanel: {
    marginTop: 28,
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  tcPanelHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: 18,
    fontFamily: "inherit",
  },
  sampleBox: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  sampleTitle: {
    fontWeight: 700,
    fontSize: 13,
    color: "#1d4ed8",
    marginBottom: 8,
  },
  sampleText: {
    fontSize: 12,
    color: "#1e40af",
    lineHeight: 1.6,
    marginBottom: 8,
  },
  sampleRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  sampleCell: {
    background: "#fff",
    border: "1px solid #bfdbfe",
    borderRadius: 8,
    padding: "8px 12px",
    flex: 1,
    minWidth: 120,
  },
  sampleCellLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sampleCode: { fontSize: 12, color: "#0369a1", fontFamily: "monospace" },
  sampleArrow: { color: "#93c5fd", fontWeight: 700, fontSize: 18 },
  tcItem: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "12px 14px",
  },
  hiddenBadge: {
    background: "#fee2e2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: 10,
    padding: "1px 8px",
    fontSize: 10,
    fontWeight: 700,
  },
  weightBadge: {
    background: "#fef3c7",
    color: "#d97706",
    border: "1px solid #fde68a",
    borderRadius: 10,
    padding: "1px 8px",
    fontSize: 10,
    fontWeight: 700,
  },
  addTCForm: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: 14,
  },
  tcInput: {
    flex: 1,
    background: "#fff",
    border: "1px solid #e2e8f0",
    color: "#1e293b",
    borderRadius: 6,
    padding: "8px 10px",
    fontSize: 12,
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
  },
  smallInput: {
    width: 80,
    background: "#fff",
    border: "1px solid #e2e8f0",
    color: "#1e293b",
    borderRadius: 6,
    padding: "6px 10px",
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
  },
  addBtn: {
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "7px 18px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
    fontFamily: "inherit",
  },
  // Guide box
  guideBox: {
    background: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  guideTitle: {
    fontWeight: 700,
    fontSize: 14,
    color: "#0369a1",
    marginBottom: 14,
  },
  guideGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 16,
    marginBottom: 12,
  },
  guideStep: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    fontSize: 13,
  },
  guideNum: {
    background: "#0369a1",
    color: "#fff",
    borderRadius: "50%",
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
  },
  // Form
  form: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 28,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginBottom: 24,
  },
  formGroup: { display: "flex", flexDirection: "column", gap: 6 },
  formLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#64748b",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  formInput: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#1e293b",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  diffBtn: {
    background: "#f1f5f9",
    border: "1px solid #e2e8f0",
    color: "#64748b",
    padding: "7px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
    fontFamily: "inherit",
  },
  formActions: { display: "flex", gap: 12, justifyContent: "flex-end" },
  cancelBtn: {
    background: "#f1f5f9",
    color: "#475569",
    border: "1px solid #e2e8f0",
    padding: "10px 24px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    fontFamily: "inherit",
  },
  saveBtn: {
    background: "#0f172a",
    color: "#fff",
    border: "none",
    padding: "10px 24px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    fontFamily: "inherit",
  },
  // Cards
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  cardTitle: { fontWeight: 700, fontSize: 15, color: "#0f172a" },
  // Submissions
  subCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  // Delete modal
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: 12,
    padding: 28,
    maxWidth: 420,
    width: "90%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#dc2626",
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 1.6,
    marginBottom: 24,
  },
  modalActions: { display: "flex", gap: 12, justifyContent: "flex-end" },
  dangerBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 24px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    fontFamily: "inherit",
  },
};
