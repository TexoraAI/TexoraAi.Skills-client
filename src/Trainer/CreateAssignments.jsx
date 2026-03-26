// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";

// import { CheckCircle, FileText, List, Upload } from "lucide-react";

// import {
//   createAssignment,
//   uploadAssignmentFile,
// } from "@/services/assessmentService";

// import { getTrainerBatches } from "@/services/batchService";

// const CreateAssignments = () => {
//   const navigate = useNavigate();

//   const [batches, setBatches] = useState([]);

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

//   // ✅ FIXED BATCH LOADING
//   useEffect(() => {
//     const loadBatches = async () => {
//       try {
//         const res = await getTrainerBatches();

//         // 🔥 IMPORTANT FIX
//         setBatches(res || []);
//       } catch (err) {
//         console.error("Failed to load trainer batches", err);
//       }
//     };

//     loadBatches();
//   }, []);

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setFormData((prev) => ({
//       ...prev,
//       attachments: files,
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

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
//       <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600">
//         <div className="max-w-5xl mx-auto px-6 py-8">
//           <div className="flex justify-between items-center">
//             <div>
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="p-2 bg-white/20 rounded-lg">
//                   <FileText className="w-6 h-6 text-white" />
//                 </div>
//                 <p className="text-xs font-semibold tracking-wide text-purple-100 uppercase">
//                   Assessments
//                 </p>
//               </div>

//               <h1 className="text-3xl font-bold text-white mb-2">
//                 Create Assignment
//               </h1>

//               <p className="text-purple-100">
//                 Share tasks with deadlines and attachments
//               </p>
//             </div>

//             <Button
//               variant="secondary"
//               className="gap-2"
//               onClick={() => navigate("/trainer/my-assignments")}
//             >
//               <List size={16} />
//               My Assignments
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-5xl mx-auto px-6 py-8">
//         {showSuccess && (
//           <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
//             <CheckCircle className="w-5 h-5 text-green-600" />
//             <p className="font-semibold text-green-800">
//               Assignment Created Successfully!
//             </p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <Card className="p-6 space-y-4">
//             <h2 className="font-semibold text-lg">Basic Information</h2>

//             <Input
//               placeholder="Assignment Title"
//               value={formData.title}
//               onChange={(e) =>
//                 setFormData({ ...formData, title: e.target.value })
//               }
//               required
//             />

//             <Textarea
//               rows={5}
//               placeholder="Description"
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData({ ...formData, description: e.target.value })
//               }
//               required
//             />
//           </Card>

//           <Card className="p-6 space-y-4">
//             <h2 className="font-semibold text-lg">Assignment Details</h2>

//             <select
//               value={formData.batch}
//               onChange={(e) =>
//                 setFormData({ ...formData, batch: e.target.value })
//               }
//               className="w-full border rounded-md p-2"
//               required
//             >
//               <option value="">Select Batch</option>
//               {batches.map((b) => (
//                 <option key={b.id} value={b.id}>
//                   Batch {b.id}
//                 </option>
//               ))}
//             </select>

//             <Input
//               type="datetime-local"
//               value={formData.deadline}
//               onChange={(e) =>
//                 setFormData({ ...formData, deadline: e.target.value })
//               }
//               required
//             />

//             <Input
//               type="number"
//               placeholder="Maximum Marks"
//               value={formData.maxMarks}
//               onChange={(e) =>
//                 setFormData({ ...formData, maxMarks: e.target.value })
//               }
//               required
//             />

//             <Input
//               placeholder="Duration (Optional)"
//               value={formData.duration}
//               onChange={(e) =>
//                 setFormData({ ...formData, duration: e.target.value })
//               }
//             />
//           </Card>

//           <Card className="p-6 space-y-4">
//             <h2 className="font-semibold text-lg">Attachments</h2>

//             <label className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer block hover:border-purple-500 transition">
//               <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
//               <p>Select PDF, DOC, ZIP files</p>

//               <input
//                 type="file"
//                 multiple
//                 onChange={handleFileChange}
//                 className="hidden"
//                 accept=".pdf,.doc,.docx,.zip,.txt"
//               />
//             </label>

//             {formData.attachments.length > 0 && (
//               <div className="space-y-2">
//                 {formData.attachments.map((file, index) => (
//                   <div key={index} className="text-sm text-gray-600">
//                     {file.name}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </Card>

//           <Button
//             type="submit"
//             disabled={isSubmitting}
//             className="bg-purple-600 hover:bg-purple-700 text-white"
//           >
//             {isSubmitting ? "Creating..." : "Create Assignment"}
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateAssignments;









































import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ChevronRight, FileText, List, Upload, X } from "lucide-react";
import {
  createAssignment,
  uploadAssignmentFile,
} from "@/services/assessmentService";
import { getTrainerBatches } from "@/services/batchService";

const PANELS = ["basic", "details", "attachments"];

const CreateAssignments = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [open, setOpen] = useState("basic");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    batch: "",
    deadline: "",
    maxMarks: "",
    duration: "",
    attachments: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const bodyRefs = {
    basic: useRef(null),
    details: useRef(null),
    attachments: useRef(null),
  };

  useEffect(() => {
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, attachments: files }));
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await createAssignment({
        title: formData.title,
        description: formData.description,
        batchId: Number(formData.batch),
        deadline: formData.deadline,
        maxMarks: Number(formData.maxMarks),
        duration: formData.duration,
      });
      const assignmentId = response.data.id;
      if (formData.attachments.length > 0) {
        for (let file of formData.attachments) {
          await uploadAssignmentFile(assignmentId, file);
        }
      }
      setShowSuccess(true);
      setFormData({
        title: "",
        description: "",
        batch: "",
        deadline: "",
        maxMarks: "",
        duration: "",
        attachments: [],
      });
    } catch (error) {
      console.error("Assignment creation error:", error);
      alert("Failed to create assignment.");
    }
    setIsSubmitting(false);
  };

  const toggle = (panel) => setOpen((prev) => (prev === panel ? null : panel));

  const inp =
    "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-[13px] text-slate-800 dark:text-slate-100 outline-none transition-all duration-150 focus:border-purple-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-purple-400/15 placeholder:text-slate-400 dark:placeholder:text-slate-600";

  const panelMeta = {
    basic: {
      num: 1,
      label: "Basic Information",
      sub: "Title & description",
      iconBg: "bg-purple-600",
      activeBorder: "border-purple-300 dark:border-purple-700/60",
      activeHeader:
        "bg-gradient-to-r from-purple-50 to-violet-50/50 dark:from-purple-950/30 dark:to-violet-950/20",
      dot: "#9333ea",
      nextKey: "details",
      nextLabel: "Continue to Details",
      btnGrad: "from-purple-600 to-violet-600",
      btnShadow: "0 2px 8px rgba(124,58,237,0.28)",
    },
    details: {
      num: 2,
      label: "Assignment Details",
      sub: "Batch, deadline & marks",
      iconBg: "bg-indigo-600",
      activeBorder: "border-indigo-300 dark:border-indigo-700/60",
      activeHeader:
        "bg-gradient-to-r from-indigo-50 to-blue-50/50 dark:from-indigo-950/30 dark:to-blue-950/20",
      dot: "#4f46e5",
      nextKey: "attachments",
      nextLabel: "Continue to Attachments",
      btnGrad: "from-indigo-600 to-blue-600",
      btnShadow: "0 2px 8px rgba(79,70,229,0.28)",
    },
    attachments: {
      num: 3,
      label: "Attachments & Submit",
      sub: `${formData.attachments.length} file${
        formData.attachments.length !== 1 ? "s" : ""
      } selected`,
      iconBg: "bg-emerald-600",
      activeBorder: "border-emerald-300 dark:border-emerald-700/60",
      activeHeader:
        "bg-gradient-to-r from-emerald-50 to-green-50/50 dark:from-emerald-950/30 dark:to-green-950/20",
      dot: "#059669",
      nextKey: null,
      nextLabel: null,
      btnGrad: "from-purple-600 to-violet-600",
      btnShadow: "0 2px 10px rgba(124,58,237,0.3)",
    },
  };

  const completedPanels = {
    basic: !!(formData.title && formData.description),
    details: !!(formData.batch && formData.deadline && formData.maxMarks),
    attachments: false,
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] dark:bg-slate-950 px-4 py-4 pb-12">

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden rounded-2xl mb-4"
        style={{
          background:
            "linear-gradient(135deg, #7c3aed 0%, #6d28d9 40%, #4338ca 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute -top-12 -right-12 w-52 h-52 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #c4b5fd, transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/4 w-40 h-20 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #818cf8, transparent)",
          }}
        />
        <div className="relative px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <FileText style={{ width: 18, height: 18, color: "white" }} />
            </div>
            <div>
              <p
                className="text-[9px] font-bold uppercase tracking-[0.12em] mb-0.5"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                Assessments
              </p>
              <h1 className="text-[17px] font-bold text-white leading-none tracking-tight">
                Create Assignment
              </h1>
            </div>
          </div>
          <button
            onClick={() => navigate("/trainer/my-assignments")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-semibold text-white transition-all"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.22)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
            }
          >
            <List style={{ width: 12, height: 12 }} />
            My Assignments
          </button>
        </div>
      </div>

      {/* ── SUCCESS BANNER ── */}
      {showSuccess && (
        <div
          className="rounded-xl border border-emerald-200 dark:border-emerald-800 px-4 py-3 flex items-center gap-3 mb-4"
          style={{
            background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)",
            boxShadow: "0 1px 3px rgba(16,185,129,0.12)",
          }}
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle style={{ width: 14, height: 14, color: "#059669" }} />
          </div>
          <p className="text-[13px] font-semibold text-emerald-700">
            Assignment Created Successfully!
          </p>
        </div>
      )}

      {/* ── STEPPER CARDS (single unified card) ── */}
      <form onSubmit={handleSubmit}>
        <div
          className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900"
          style={{
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.07)",
            border: "1px solid rgba(0,0,0,0.07)",
          }}
        >
          {PANELS.map((key, idx) => {
            const meta = panelMeta[key];
            const isOpen = open === key;
            const isCompleted = completedPanels[key];
            const isLast = idx === PANELS.length - 1;

            return (
              <div
                key={key}
                className={`${
                  !isLast
                    ? "border-b border-slate-100 dark:border-slate-800"
                    : ""
                }`}
              >
                {/* ── HEADER ── */}
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-all duration-200 ${
                    isOpen
                      ? meta.activeHeader
                      : "hover:bg-slate-50/80 dark:hover:bg-slate-800/30"
                  }`}
                >
                  {/* step badge */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isCompleted
                        ? "bg-green-100 dark:bg-green-900/40"
                        : isOpen
                        ? meta.iconBg
                        : "bg-slate-100 dark:bg-slate-800"
                    }`}
                    style={
                      isOpen && !isCompleted
                        ? { boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }
                        : {}
                    }
                  >
                    {isCompleted ? (
                      <CheckCircle
                        style={{ width: 14, height: 14, color: "#059669" }}
                      />
                    ) : (
                      <span
                        className={`text-[11px] font-bold ${
                          isOpen
                            ? "text-white"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {meta.num}
                      </span>
                    )}
                  </div>

                  {/* label */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[13px] font-semibold leading-tight transition-colors ${
                        isOpen
                          ? "text-slate-900 dark:text-slate-50"
                          : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {meta.label}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                      {meta.sub}
                    </p>
                  </div>

                  {/* progress pills */}
                  <div className="flex items-center gap-1 mr-2">
                    {PANELS.map((p, pi) => {
                      const isActive = p === key;
                      const isPast = pi < PANELS.indexOf(key);
                      return (
                        <span
                          key={p}
                          className="rounded-full transition-all duration-300"
                          style={{
                            width: isActive ? 18 : 6,
                            height: 6,
                            background: isActive
                              ? meta.dot
                              : isPast
                              ? "#94a3b8"
                              : "#e2e8f0",
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* chevron */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isOpen
                        ? "bg-white dark:bg-slate-700 shadow-sm"
                        : "bg-transparent"
                    }`}
                  >
                    <ChevronRight
                      className="text-slate-400 transition-transform duration-300"
                      style={{
                        width: 14,
                        height: 14,
                        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    />
                  </div>
                </button>

                {/* ── BODY (smooth collapse) ── */}
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: isOpen ? "900px" : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div
                    className={`px-5 pb-5 pt-1 border-t ${
                      isOpen
                        ? "border-slate-100 dark:border-slate-800"
                        : "border-transparent"
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* left accent line */}
                      <div
                        className="w-px self-stretch rounded-full mt-3 mb-1 shrink-0"
                        style={{ background: meta.dot, opacity: 0.2 }}
                      />

                      <div className="flex-1 space-y-3 pt-3">

                        {/* ── PANEL 1: BASIC ── */}
                        {key === "basic" && (
                          <>
                            <div>
                              <label className="block text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                Assignment Title
                              </label>
                              <input
                                placeholder="e.g. React Hooks Assignment"
                                value={formData.title}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    title: e.target.value,
                                  })
                                }
                                required
                                className={inp}
                              />
                            </div>
                            <div>
                              <label className="block text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                Description
                              </label>
                              <textarea
                                rows={3}
                                placeholder="Describe the assignment task..."
                                value={formData.description}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    description: e.target.value,
                                  })
                                }
                                required
                                className={`${inp} resize-none`}
                              />
                            </div>
                            <div className="flex justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => setOpen("details")}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r ${meta.btnGrad} text-white text-[12px] font-semibold transition-all hover:brightness-105`}
                                style={{ boxShadow: meta.btnShadow }}
                              >
                                {meta.nextLabel}
                                <ChevronRight
                                  style={{ width: 13, height: 13 }}
                                />
                              </button>
                            </div>
                          </>
                        )}

                        {/* ── PANEL 2: DETAILS ── */}
                        {key === "details" && (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                  Select Batch
                                </label>
                                <select
                                  value={formData.batch}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      batch: e.target.value,
                                    })
                                  }
                                  required
                                  className={inp}
                                >
                                  <option value="">Select Batch</option>
                                  {batches.map((b) => (
                                    <option key={b.id} value={b.id}>
                                      Batch {b.id}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                  Deadline
                                </label>
                                <input
                                  type="datetime-local"
                                  value={formData.deadline}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      deadline: e.target.value,
                                    })
                                  }
                                  required
                                  className={inp}
                                />
                              </div>
                              <div>
                                <label className="block text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                  Maximum Marks
                                </label>
                                <input
                                  type="number"
                                  placeholder="e.g. 100"
                                  value={formData.maxMarks}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      maxMarks: e.target.value,
                                    })
                                  }
                                  required
                                  className={inp}
                                />
                              </div>
                              <div>
                                <label className="block text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                  Duration{" "}
                                  <span className="normal-case font-normal text-slate-400">
                                    (optional)
                                  </span>
                                </label>
                                <input
                                  placeholder="e.g. 2 hours"
                                  value={formData.duration}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      duration: e.target.value,
                                    })
                                  }
                                  className={inp}
                                />
                              </div>
                            </div>
                            <div className="flex justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => setOpen("attachments")}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r ${meta.btnGrad} text-white text-[12px] font-semibold transition-all hover:brightness-105`}
                                style={{ boxShadow: meta.btnShadow }}
                              >
                                {meta.nextLabel}
                                <ChevronRight
                                  style={{ width: 13, height: 13 }}
                                />
                              </button>
                            </div>
                          </>
                        )}

                        {/* ── PANEL 3: ATTACHMENTS + SUBMIT ── */}
                        {key === "attachments" && (
                          <>
                            {/* dropzone */}
                            <label className="block cursor-pointer">
                              <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-600 bg-slate-50 dark:bg-slate-800/40 hover:bg-purple-50/40 transition-all duration-200 py-6 px-4 text-center">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center mx-auto mb-2.5">
                                  <Upload
                                    style={{
                                      width: 16,
                                      height: 16,
                                      color: "#94a3b8",
                                    }}
                                  />
                                </div>
                                <p className="text-[13px] font-semibold text-slate-600 dark:text-slate-300 mb-0.5">
                                  Click to upload files
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  PDF, DOC, DOCX, ZIP, TXT
                                </p>
                                <input
                                  type="file"
                                  multiple
                                  onChange={handleFileChange}
                                  className="hidden"
                                  accept=".pdf,.doc,.docx,.zip,.txt"
                                />
                              </div>
                            </label>

                            {/* file list */}
                            {formData.attachments.length > 0 && (
                              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/60">
                                {formData.attachments.map((file, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2.5 px-3.5 py-2"
                                  >
                                    <div className="w-6 h-6 rounded-md bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                                      <FileText
                                        style={{
                                          width: 12,
                                          height: 12,
                                          color: "#9333ea",
                                        }}
                                      />
                                    </div>
                                    <span className="text-[12px] text-slate-600 dark:text-slate-300 truncate flex-1">
                                      {file.name}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeFile(index)}
                                      className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center justify-center transition-colors shrink-0"
                                    >
                                      <X
                                        style={{
                                          width: 10,
                                          height: 10,
                                          color: "#94a3b8",
                                        }}
                                      />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* summary chips */}
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { label: "Title", val: formData.title || "—" },
                                {
                                  label: "Batch",
                                  val: formData.batch
                                    ? `Batch ${formData.batch}`
                                    : "—",
                                },
                                {
                                  label: "Max Marks",
                                  val: formData.maxMarks || "—",
                                },
                              ].map(({ label, val }) => (
                                <div
                                  key={label}
                                  className="rounded-xl px-3 py-2.5 border border-slate-100 dark:border-slate-700/60"
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #fafafa, #f8f9ff)",
                                  }}
                                >
                                  <p className="text-[9.5px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                                    {label}
                                  </p>
                                  <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200 truncate">
                                    {val}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* actions */}
                            <div className="flex items-center justify-between pt-1">
                              <button
                                type="button"
                                onClick={() => setOpen("details")}
                                className="flex items-center gap-1 text-[11.5px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors font-medium"
                              >
                                <ChevronRight
                                  style={{
                                    width: 12,
                                    height: 12,
                                    transform: "rotate(180deg)",
                                  }}
                                />
                                Back to Details
                              </button>
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r ${meta.btnGrad} text-white text-[13px] font-semibold disabled:opacity-60 transition-all hover:brightness-105`}
                                style={{ boxShadow: meta.btnShadow }}
                              >
                                {isSubmitting ? (
                                  <>
                                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Creating…
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle
                                      style={{ width: 14, height: 14 }}
                                    />
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
                </div>
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
};

export default CreateAssignments;