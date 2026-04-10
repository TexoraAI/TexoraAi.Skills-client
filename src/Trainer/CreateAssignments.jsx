// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { CheckCircle, ChevronRight, FileText, List, Upload, X } from "lucide-react";
// import {
//   createAssignment,
//   uploadAssignmentFile,
// } from "@/services/assessmentService";
// import { getTrainerBatches } from "@/services/batchService";

// const PANELS = ["basic", "details", "attachments"];

// const CreateAssignments = () => {
//   const navigate = useNavigate();
//   const [batches, setBatches] = useState([]);
//   const [open, setOpen] = useState("basic");
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     batch: "",
//     deadline: "",
//     maxMarks: "",
//     duration: "",
//     attachments: [],
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   const bodyRefs = {
//     basic: useRef(null),
//     details: useRef(null),
//     attachments: useRef(null),
//   };

//   useEffect(() => {
//     const loadBatches = async () => {
//       try {
//         const res = await getTrainerBatches();
//         setBatches(res || []);
//       } catch (err) {
//         console.error("Failed to load trainer batches", err);
//       }
//     };
//     loadBatches();
//   }, []);

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setFormData((prev) => ({ ...prev, attachments: files }));
//   };

//   const removeFile = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       attachments: prev.attachments.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const response = await createAssignment({
//         title: formData.title,
//         description: formData.description,
//         batchId: Number(formData.batch),
//         deadline: formData.deadline,
//         maxMarks: Number(formData.maxMarks),
//         duration: formData.duration,
//       });
//       const assignmentId = response.data.id;
//       if (formData.attachments.length > 0) {
//         for (let file of formData.attachments) {
//           await uploadAssignmentFile(assignmentId, file);
//         }
//       }
//       setShowSuccess(true);
//       setFormData({
//         title: "",
//         description: "",
//         batch: "",
//         deadline: "",
//         maxMarks: "",
//         duration: "",
//         attachments: [],
//       });
//     } catch (error) {
//       console.error("Assignment creation error:", error);
//       alert("Failed to create assignment.");
//     }
//     setIsSubmitting(false);
//   };

//   const toggle = (panel) => setOpen((prev) => (prev === panel ? null : panel));

//   const inp =
//     "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-[13px] text-slate-800 dark:text-slate-100 outline-none transition-all duration-150 focus:border-purple-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-purple-400/15 placeholder:text-slate-400 dark:placeholder:text-slate-600";

//   const panelMeta = {
//     basic: {
//       num: 1,
//       label: "Basic Information",
//       sub: "Title & description",
//       iconBg: "bg-purple-600",
//       activeBorder: "border-purple-300 dark:border-purple-700/60",
//       activeHeader:
//         "bg-gradient-to-r from-purple-50 to-violet-50/50 dark:from-purple-950/30 dark:to-violet-950/20",
//       dot: "#9333ea",
//       nextKey: "details",
//       nextLabel: "Continue to Details",
//       btnGrad: "from-purple-600 to-violet-600",
//       btnShadow: "0 2px 8px rgba(124,58,237,0.28)",
//     },
//     details: {
//       num: 2,
//       label: "Assignment Details",
//       sub: "Batch, deadline & marks",
//       iconBg: "bg-indigo-600",
//       activeBorder: "border-indigo-300 dark:border-indigo-700/60",
//       activeHeader:
//         "bg-gradient-to-r from-indigo-50 to-blue-50/50 dark:from-indigo-950/30 dark:to-blue-950/20",
//       dot: "#4f46e5",
//       nextKey: "attachments",
//       nextLabel: "Continue to Attachments",
//       btnGrad: "from-indigo-600 to-blue-600",
//       btnShadow: "0 2px 8px rgba(79,70,229,0.28)",
//     },
//     attachments: {
//       num: 3,
//       label: "Attachments & Submit",
//       sub: `${formData.attachments.length} file${
//         formData.attachments.length !== 1 ? "s" : ""
//       } selected`,
//       iconBg: "bg-emerald-600",
//       activeBorder: "border-emerald-300 dark:border-emerald-700/60",
//       activeHeader:
//         "bg-gradient-to-r from-emerald-50 to-green-50/50 dark:from-emerald-950/30 dark:to-green-950/20",
//       dot: "#059669",
//       nextKey: null,
//       nextLabel: null,
//       btnGrad: "from-purple-600 to-violet-600",
//       btnShadow: "0 2px 10px rgba(124,58,237,0.3)",
//     },
//   };

//   const completedPanels = {
//     basic: !!(formData.title && formData.description),
//     details: !!(formData.batch && formData.deadline && formData.maxMarks),
//     attachments: false,
//   };

//   return (
//     <div className="min-h-screen bg-[#f4f6fb] dark:bg-slate-950 px-4 py-4 pb-12">

//       {/* ── HERO ── */}
//       <div
//         className="relative overflow-hidden rounded-2xl mb-4"
//         style={{
//           background:
//             "linear-gradient(135deg, #7c3aed 0%, #6d28d9 40%, #4338ca 100%)",
//         }}
//       >
//         <div
//           className="pointer-events-none absolute -top-12 -right-12 w-52 h-52 rounded-full opacity-20"
//           style={{
//             background: "radial-gradient(circle, #c4b5fd, transparent)",
//           }}
//         />
//         <div
//           className="pointer-events-none absolute bottom-0 left-1/4 w-40 h-20 rounded-full opacity-10"
//           style={{
//             background: "radial-gradient(circle, #818cf8, transparent)",
//           }}
//         />
//         <div className="relative px-5 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div
//               className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
//               style={{
//                 background: "rgba(255,255,255,0.15)",
//                 border: "1px solid rgba(255,255,255,0.25)",
//               }}
//             >
//               <FileText style={{ width: 18, height: 18, color: "white" }} />
//             </div>
//             <div>
//               <p
//                 className="text-[9px] font-bold uppercase tracking-[0.12em] mb-0.5"
//                 style={{ color: "rgba(255,255,255,0.55)" }}
//               >
//                 Assessments
//               </p>
//               <h1 className="text-[17px] font-bold text-white leading-none tracking-tight">
//                 Create Assignment
//               </h1>
//             </div>
//           </div>
//           <button
//             onClick={() => navigate("/trainer/my-assignments")}
//             className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-semibold text-white transition-all"
//             style={{
//               background: "rgba(255,255,255,0.12)",
//               border: "1px solid rgba(255,255,255,0.22)",
//             }}
//             onMouseEnter={(e) =>
//               (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
//             }
//             onMouseLeave={(e) =>
//               (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
//             }
//           >
//             <List style={{ width: 12, height: 12 }} />
//             My Assignments
//           </button>
//         </div>
//       </div>

//       {/* ── SUCCESS BANNER ── */}
//       {showSuccess && (
//         <div
//           className="rounded-xl border border-emerald-200 dark:border-emerald-800 px-4 py-3 flex items-center gap-3 mb-4"
//           style={{
//             background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)",
//             boxShadow: "0 1px 3px rgba(16,185,129,0.12)",
//           }}
//         >
//           <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
//             <CheckCircle style={{ width: 14, height: 14, color: "#059669" }} />
//           </div>
//           <p className="text-[13px] font-semibold text-emerald-700">
//             Assignment Created Successfully!
//           </p>
//         </div>
//       )}

//       {/* ── STEPPER CARDS (single unified card) ── */}
//       <form onSubmit={handleSubmit}>
//         <div
//           className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900"
//           style={{
//             boxShadow:
//               "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.07)",
//             border: "1px solid rgba(0,0,0,0.07)",
//           }}
//         >
//           {PANELS.map((key, idx) => {
//             const meta = panelMeta[key];
//             const isOpen = open === key;
//             const isCompleted = completedPanels[key];
//             const isLast = idx === PANELS.length - 1;

//             return (
//               <div
//                 key={key}
//                 className={`${
//                   !isLast
//                     ? "border-b border-slate-100 dark:border-slate-800"
//                     : ""
//                 }`}
//               >
//                 {/* ── HEADER ── */}
//                 <button
//                   type="button"
//                   onClick={() => toggle(key)}
//                   className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-all duration-200 ${
//                     isOpen
//                       ? meta.activeHeader
//                       : "hover:bg-slate-50/80 dark:hover:bg-slate-800/30"
//                   }`}
//                 >
//                   {/* step badge */}
//                   <div
//                     className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
//                       isCompleted
//                         ? "bg-green-100 dark:bg-green-900/40"
//                         : isOpen
//                         ? meta.iconBg
//                         : "bg-slate-100 dark:bg-slate-800"
//                     }`}
//                     style={
//                       isOpen && !isCompleted
//                         ? { boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }
//                         : {}
//                     }
//                   >
//                     {isCompleted ? (
//                       <CheckCircle
//                         style={{ width: 14, height: 14, color: "#059669" }}
//                       />
//                     ) : (
//                       <span
//                         className={`text-[11px] font-bold ${
//                           isOpen
//                             ? "text-white"
//                             : "text-slate-500 dark:text-slate-400"
//                         }`}
//                       >
//                         {meta.num}
//                       </span>
//                     )}
//                   </div>

//                   {/* label */}
//                   <div className="flex-1 min-w-0">
//                     <p
//                       className={`text-[13px] font-semibold leading-tight transition-colors ${
//                         isOpen
//                           ? "text-slate-900 dark:text-slate-50"
//                           : "text-slate-600 dark:text-slate-300"
//                       }`}
//                     >
//                       {meta.label}
//                     </p>
//                     <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
//                       {meta.sub}
//                     </p>
//                   </div>

//                   {/* progress pills */}
//                   <div className="flex items-center gap-1 mr-2">
//                     {PANELS.map((p, pi) => {
//                       const isActive = p === key;
//                       const isPast = pi < PANELS.indexOf(key);
//                       return (
//                         <span
//                           key={p}
//                           className="rounded-full transition-all duration-300"
//                           style={{
//                             width: isActive ? 18 : 6,
//                             height: 6,
//                             background: isActive
//                               ? meta.dot
//                               : isPast
//                               ? "#94a3b8"
//                               : "#e2e8f0",
//                           }}
//                         />
//                       );
//                     })}
//                   </div>

//                   {/* chevron */}
//                   <div
//                     className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
//                       isOpen
//                         ? "bg-white dark:bg-slate-700 shadow-sm"
//                         : "bg-transparent"
//                     }`}
//                   >
//                     <ChevronRight
//                       className="text-slate-400 transition-transform duration-300"
//                       style={{
//                         width: 14,
//                         height: 14,
//                         transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
//                       }}
//                     />
//                   </div>
//                 </button>

//                 {/* ── BODY (smooth collapse) ── */}
//                 <div
//                   className="overflow-hidden transition-all duration-300 ease-in-out"
//                   style={{
//                     maxHeight: isOpen ? "900px" : "0px",
//                     opacity: isOpen ? 1 : 0,
//                   }}
//                 >
//                   <div
//                     className={`px-5 pb-5 pt-1 border-t ${
//                       isOpen
//                         ? "border-slate-100 dark:border-slate-800"
//                         : "border-transparent"
//                     }`}
//                   >
//                     <div className="flex gap-4">
//                       {/* left accent line */}
//                       <div
//                         className="w-px self-stretch rounded-full mt-3 mb-1 shrink-0"
//                         style={{ background: meta.dot, opacity: 0.2 }}
//                       />

//                       <div className="flex-1 space-y-3 pt-3">

//                         {/* ── PANEL 1: BASIC ── */}
//                         {key === "basic" && (
//                           <>
//                             <div>
//                               <label className="block text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
//                                 Assignment Title
//                               </label>
//                               <input
//                                 placeholder="e.g. React Hooks Assignment"
//                                 value={formData.title}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     title: e.target.value,
//                                   })
//                                 }
//                                 required
//                                 className={inp}
//                               />
//                             </div>
//                             <div>
//                               <label className="block text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
//                                 Description
//                               </label>
//                               <textarea
//                                 rows={3}
//                                 placeholder="Describe the assignment task..."
//                                 value={formData.description}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     description: e.target.value,
//                                   })
//                                 }
//                                 required
//                                 className={`${inp} resize-none`}
//                               />
//                             </div>
//                             <div className="flex justify-end pt-1">
//                               <button
//                                 type="button"
//                                 onClick={() => setOpen("details")}
//                                 className={`flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r ${meta.btnGrad} text-white text-[12px] font-semibold transition-all hover:brightness-105`}
//                                 style={{ boxShadow: meta.btnShadow }}
//                               >
//                                 {meta.nextLabel}
//                                 <ChevronRight
//                                   style={{ width: 13, height: 13 }}
//                                 />
//                               </button>
//                             </div>
//                           </>
//                         )}

//                         {/* ── PANEL 2: DETAILS ── */}
//                         {key === "details" && (
//                           <>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                               <div>
//                                 <label className="block text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
//                                   Select Batch
//                                 </label>
//                                 <select
//                                   value={formData.batch}
//                                   onChange={(e) =>
//                                     setFormData({
//                                       ...formData,
//                                       batch: e.target.value,
//                                     })
//                                   }
//                                   required
//                                   className={inp}
//                                 >
//                                   <option value="">Select Batch</option>
//                                   {batches.map((b) => (
//                                     <option key={b.id} value={b.id}>
//                                       Batch {b.id}
//                                     </option>
//                                   ))}
//                                 </select>
//                               </div>
//                               <div>
//                                 <label className="block text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
//                                   Deadline
//                                 </label>
//                                 <input
//                                   type="datetime-local"
//                                   value={formData.deadline}
//                                   onChange={(e) =>
//                                     setFormData({
//                                       ...formData,
//                                       deadline: e.target.value,
//                                     })
//                                   }
//                                   required
//                                   className={inp}
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
//                                   Maximum Marks
//                                 </label>
//                                 <input
//                                   type="number"
//                                   placeholder="e.g. 100"
//                                   value={formData.maxMarks}
//                                   onChange={(e) =>
//                                     setFormData({
//                                       ...formData,
//                                       maxMarks: e.target.value,
//                                     })
//                                   }
//                                   required
//                                   className={inp}
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
//                                   Duration{" "}
//                                   <span className="normal-case font-normal text-slate-400">
//                                     (optional)
//                                   </span>
//                                 </label>
//                                 <input
//                                   placeholder="e.g. 2 hours"
//                                   value={formData.duration}
//                                   onChange={(e) =>
//                                     setFormData({
//                                       ...formData,
//                                       duration: e.target.value,
//                                     })
//                                   }
//                                   className={inp}
//                                 />
//                               </div>
//                             </div>
//                             <div className="flex justify-end pt-1">
//                               <button
//                                 type="button"
//                                 onClick={() => setOpen("attachments")}
//                                 className={`flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r ${meta.btnGrad} text-white text-[12px] font-semibold transition-all hover:brightness-105`}
//                                 style={{ boxShadow: meta.btnShadow }}
//                               >
//                                 {meta.nextLabel}
//                                 <ChevronRight
//                                   style={{ width: 13, height: 13 }}
//                                 />
//                               </button>
//                             </div>
//                           </>
//                         )}

//                         {/* ── PANEL 3: ATTACHMENTS + SUBMIT ── */}
//                         {key === "attachments" && (
//                           <>
//                             {/* dropzone */}
//                             <label className="block cursor-pointer">
//                               <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-600 bg-slate-50 dark:bg-slate-800/40 hover:bg-purple-50/40 transition-all duration-200 py-6 px-4 text-center">
//                                 <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center mx-auto mb-2.5">
//                                   <Upload
//                                     style={{
//                                       width: 16,
//                                       height: 16,
//                                       color: "#94a3b8",
//                                     }}
//                                   />
//                                 </div>
//                                 <p className="text-[13px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5">
//                                   Click to upload files
//                                 </p>
//                                 <p className="text-[11px] text-slate-400">
//                                   PDF, DOC, DOCX, ZIP, TXT
//                                 </p>
//                                 <input
//                                   type="file"
//                                   multiple
//                                   onChange={handleFileChange}
//                                   className="hidden"
//                                   accept=".pdf,.doc,.docx,.zip,.txt"
//                                 />
//                               </div>
//                             </label>

//                             {/* file list */}
//                             {formData.attachments.length > 0 && (
//                               <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/60">
//                                 {formData.attachments.map((file, index) => (
//                                   <div
//                                     key={index}
//                                     className="flex items-center gap-2.5 px-3.5 py-2"
//                                   >
//                                     <div className="w-6 h-6 rounded-md bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
//                                       <FileText
//                                         style={{
//                                           width: 12,
//                                           height: 12,
//                                           color: "#9333ea",
//                                         }}
//                                       />
//                                     </div>
//                                     <span className="text-[12px] text-slate-600 dark:text-slate-300 truncate flex-1">
//                                       {file.name}
//                                     </span>
//                                     <button
//                                       type="button"
//                                       onClick={() => removeFile(index)}
//                                       className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center justify-center transition-colors shrink-0"
//                                     >
//                                       <X
//                                         style={{
//                                           width: 10,
//                                           height: 10,
//                                           color: "#94a3b8",
//                                         }}
//                                       />
//                                     </button>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}

//                             {/* summary chips */}
//                             <div className="grid grid-cols-3 gap-2">
//                               {[
//                                 { label: "Title", val: formData.title || "—" },
//                                 {
//                                   label: "Batch",
//                                   val: formData.batch
//                                     ? `Batch ${formData.batch}`
//                                     : "—",
//                                 },
//                                 {
//                                   label: "Max Marks",
//                                   val: formData.maxMarks || "—",
//                                 },
//                               ].map(({ label, val }) => (
//                                 <div
//                                   key={label}
//                                   className="rounded-xl px-3 py-2.5 border border-slate-100 dark:border-slate-700/60"
//                                   style={{
//                                     background:
//                                       "linear-gradient(135deg, #fafafa, #f8f9ff)",
//                                   }}
//                                 >
//                                   <p className="text-[9.5px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
//                                     {label}
//                                   </p>
//                                   <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200 truncate">
//                                     {val}
//                                   </p>
//                                 </div>
//                               ))}
//                             </div>

//                             {/* actions */}
//                             <div className="flex items-center justify-between pt-1">
//                               <button
//                                 type="button"
//                                 onClick={() => setOpen("details")}
//                                 className="flex items-center gap-1 text-[11.5px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors font-medium"
//                               >
//                                 <ChevronRight
//                                   style={{
//                                     width: 12,
//                                     height: 12,
//                                     transform: "rotate(180deg)",
//                                   }}
//                                 />
//                                 Back to Details
//                               </button>
//                               <button
//                                 type="submit"
//                                 disabled={isSubmitting}
//                                 className={`flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r ${meta.btnGrad} text-white text-[13px] font-semibold disabled:opacity-60 transition-all hover:brightness-105`}
//                                 style={{ boxShadow: meta.btnShadow }}
//                               >
//                                 {isSubmitting ? (
//                                   <>
//                                     <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                                     Creating…
//                                   </>
//                                 ) : (
//                                   <>
//                                     <CheckCircle
//                                       style={{ width: 14, height: 14 }}
//                                     />
//                                     Create Assignment
//                                   </>
//                                 )}
//                               </button>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateAssignments;










// src/trainer/CreateAssignments.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ChevronRight, FileText, List, Upload, X } from "lucide-react";
import { createAssignment, uploadAssignmentFile } from "@/services/assessmentService";
import { getTrainerBatches } from "@/services/batchService";
import {
  useTrainerTheme, PageShell, PageHero, ThemedCard,
  ThemedInput, ThemedTextarea, ThemedSelect, FieldLabel,
  PrimaryButton, SecondaryButton,
} from "./trainerTheme";

const PANELS = ["basic", "details", "attachments"];

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
      try {
        const res = await getTrainerBatches();
        setBatches(res || []);
      } catch (err) { console.error("Failed to load trainer batches", err); }
    };
    loadBatches();
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, attachments: files }));
  };

  const removeFile = (index) => {
    setFormData((prev) => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index) }));
  };

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
        for (let file of formData.attachments) {
          await uploadAssignmentFile(assignmentId, file);
        }
      }
      setShowSuccess(true);
      setFormData({ title: "", description: "", batch: "", deadline: "", maxMarks: "", duration: "", attachments: [] });
    } catch (error) {
      console.error("Assignment creation error:", error);
      alert("Failed to create assignment.");
    }
    setIsSubmitting(false);
  };

  const toggle = (panel) => setOpen((prev) => (prev === panel ? null : panel));

  const completedPanels = {
    basic: !!(formData.title && formData.description),
    details: !!(formData.batch && formData.deadline && formData.maxMarks),
    attachments: false,
  };

  const panelMeta = {
    basic:       { num: 1, label: "Basic Information",    sub: "Title & description",       color: "#7c3aed", next: "details",      nextLabel: "Continue to Details" },
    details:     { num: 2, label: "Assignment Details",   sub: "Batch, deadline & marks",   color: "#2563eb", next: "attachments",  nextLabel: "Continue to Attachments" },
    attachments: { num: 3, label: "Attachments & Submit", sub: `${formData.attachments.length} file${formData.attachments.length !== 1 ? "s" : ""} selected`, color: "#34d399", next: null, nextLabel: null },
  };

  return (
    <PageShell t={t}>
      {/* HERO */}
      <PageHero
        t={t} isDark={isDark}
        icon={FileText}
        badge="Assessments"
        title="Create Assignment"
        subtitle="Build assignments with attachments for your students."
        color="#7c3aed"
        right={
          <button
            onClick={() => navigate("/trainer/my-assignments")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 16px", borderRadius: 12, cursor: "pointer",
              background: t.actBg, border: `1px solid ${t.border}`,
              color: t.textSub, fontSize: 12, fontWeight: 600,
              fontFamily: "'Poppins',sans-serif", transition: "all 0.2s",
            }}
          >
            <List size={13} /> My Assignments
          </button>
        }
      />

      {/* SUCCESS BANNER */}
      {showSuccess && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 18px", borderRadius: 14, marginBottom: 16,
          background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)",
        }}>
          <CheckCircle size={16} color="#34d399" />
          <p style={{ fontSize: 13, fontWeight: 600, color: "#34d399", margin: 0, fontFamily: "'Poppins',sans-serif" }}>
            Assignment Created Successfully!
          </p>
        </div>
      )}

      {/* STEPPER */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, borderRadius: 20, overflow: "hidden", border: `1px solid ${t.border}`, boxShadow: t.shadow }}>
          {PANELS.map((key, idx) => {
            const meta = panelMeta[key];
            const isOpen = open === key;
            const isCompleted = completedPanels[key];
            const isLast = idx === PANELS.length - 1;

            return (
              <div key={key} style={{ borderBottom: !isLast ? `1px solid ${t.border}` : "none" }}>
                {/* Header */}
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "16px 20px", textAlign: "left",
                    background: isOpen ? `${meta.color}06` : t.cardBg,
                    border: "none", cursor: "pointer", transition: "background 0.2s",
                    borderBottom: isOpen ? `1px solid ${t.border}` : "none",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 999,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isCompleted ? "rgba(52,211,153,0.15)" : isOpen ? `${meta.color}20` : t.inputBg,
                    border: `1px solid ${isCompleted ? "rgba(52,211,153,0.3)" : isOpen ? `${meta.color}40` : t.inputBorder}`,
                    flexShrink: 0, transition: "all 0.2s",
                  }}>
                    {isCompleted
                      ? <CheckCircle size={14} color="#34d399" />
                      : <span style={{ fontSize: 11, fontWeight: 800, color: isOpen ? meta.color : t.textMuted, fontFamily: "'Poppins',sans-serif" }}>{meta.num}</span>
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: isOpen ? t.text : t.textSub, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{meta.label}</p>
                    <p style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{meta.sub}</p>
                  </div>
                  <div style={{ display: "flex", gap: 4, marginRight: 8 }}>
                    {PANELS.map((p, pi) => (
                      <span key={p} style={{
                        borderRadius: 999, transition: "all 0.3s",
                        width: p === key ? 18 : 6, height: 6,
                        background: p === key ? meta.color : pi < PANELS.indexOf(key) ? "#94a3b8" : t.barBg,
                      }} />
                    ))}
                  </div>
                  <ChevronRight size={14} color={t.textMuted} style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                </button>

                {/* Body */}
                {isOpen && (
                  <div style={{ background: t.cardBg, padding: "20px 20px 24px" }}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ width: 1, background: `${meta.color}30`, borderRadius: 999, flexShrink: 0 }} />
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* PANEL 1 */}
                        {key === "basic" && (
                          <>
                            <div>
                              <FieldLabel t={t}>Assignment Title</FieldLabel>
                              <ThemedInput t={t} placeholder="e.g. React Hooks Assignment" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div>
                              <FieldLabel t={t}>Description</FieldLabel>
                              <ThemedTextarea t={t} rows={3} placeholder="Describe the assignment task..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                              <PrimaryButton color={meta.color} type="button" onClick={() => setOpen("details")}>
                                {meta.nextLabel} <ChevronRight size={13} />
                              </PrimaryButton>
                            </div>
                          </>
                        )}

                        {/* PANEL 2 */}
                        {key === "details" && (
                          <>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                              <div>
                                <FieldLabel t={t}>Select Batch</FieldLabel>
                                <ThemedSelect t={t} value={formData.batch} onChange={(e) => setFormData({ ...formData, batch: e.target.value })} required>
                                  <option value="">Select Batch</option>
                                  {batches.map((b) => (<option key={b.id} value={b.id}>Batch {b.id}</option>))}
                                </ThemedSelect>
                              </div>
                              <div>
                                <FieldLabel t={t}>Deadline</FieldLabel>
                                <ThemedInput t={t} type="datetime-local" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required />
                              </div>
                              <div>
                                <FieldLabel t={t}>Maximum Marks</FieldLabel>
                                <ThemedInput t={t} type="number" placeholder="e.g. 100" value={formData.maxMarks} onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })} required />
                              </div>
                              <div>
                                <FieldLabel t={t}>Duration (optional)</FieldLabel>
                                <ThemedInput t={t} placeholder="e.g. 2 hours" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                              </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                              <PrimaryButton color={meta.color} type="button" onClick={() => setOpen("attachments")}>
                                {meta.nextLabel} <ChevronRight size={13} />
                              </PrimaryButton>
                            </div>
                          </>
                        )}

                        {/* PANEL 3 */}
                        {key === "attachments" && (
                          <>
                            <label style={{ cursor: "pointer" }}>
                              <div style={{
                                borderRadius: 16, border: `2px dashed ${t.inputBorder}`,
                                padding: "32px 24px", textAlign: "center", background: t.inputBg,
                                transition: "all 0.2s",
                              }}>
                                <div style={{
                                  width: 40, height: 40, borderRadius: 12,
                                  background: t.actBg, border: `1px solid ${t.border}`,
                                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px",
                                }}>
                                  <Upload size={16} color={t.textMuted} />
                                </div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: t.textSub, margin: "0 0 4px", fontFamily: "'Poppins',sans-serif" }}>Click to upload files</p>
                                <p style={{ fontSize: 11, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>PDF, DOC, DOCX, ZIP, TXT</p>
                                <input type="file" multiple onChange={handleFileChange} hidden accept=".pdf,.doc,.docx,.zip,.txt" />
                              </div>
                            </label>

                            {formData.attachments.length > 0 && (
                              <div style={{ borderRadius: 14, border: `1px solid ${t.border}`, overflow: "hidden" }}>
                                {formData.attachments.map((file, index) => (
                                  <div key={index} style={{
                                    display: "flex", alignItems: "center", gap: 10,
                                    padding: "10px 14px",
                                    borderBottom: index < formData.attachments.length - 1 ? `1px solid ${t.border}` : "none",
                                  }}>
                                    <div style={{
                                      width: 24, height: 24, borderRadius: 7,
                                      background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)",
                                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                    }}>
                                      <FileText size={12} color="#7c3aed" />
                                    </div>
                                    <span style={{ fontSize: 12, color: t.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins',sans-serif" }}>{file.name}</span>
                                    <button type="button" onClick={() => removeFile(index)} style={{
                                      width: 20, height: 20, borderRadius: 999, background: t.actBg,
                                      border: `1px solid ${t.border}`, display: "flex", alignItems: "center",
                                      justifyContent: "center", cursor: "pointer", flexShrink: 0,
                                    }}>
                                      <X size={10} color={t.textMuted} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Summary */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                              {[
                                { label: "Title",     val: formData.title || "—" },
                                { label: "Batch",     val: formData.batch ? `Batch ${formData.batch}` : "—" },
                                { label: "Max Marks", val: formData.maxMarks || "—" },
                              ].map(({ label, val }) => (
                                <div key={label} style={{
                                  background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`,
                                  borderRadius: 12, padding: "10px 14px",
                                }}>
                                  <p style={{ fontSize: 9, color: t.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, fontFamily: "'Poppins',sans-serif" }}>{label}</p>
                                  <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</p>
                                </div>
                              ))}
                            </div>

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <button type="button" onClick={() => setOpen("details")} style={{
                                display: "flex", alignItems: "center", gap: 4,
                                fontSize: 12, color: t.textMuted, background: "none", border: "none",
                                cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontWeight: 500,
                              }}>
                                <ChevronRight size={12} style={{ transform: "rotate(180deg)" }} /> Back to Details
                              </button>
                              <PrimaryButton color="#7c3aed" type="submit" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.6 : 1 }}>
                                {isSubmitting ? (
                                  <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Creating…</>
                                ) : (
                                  <><CheckCircle size={14} /> Create Assignment</>
                                )}
                              </PrimaryButton>
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