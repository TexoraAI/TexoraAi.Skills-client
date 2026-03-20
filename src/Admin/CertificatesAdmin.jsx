// import axios from "axios";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowLeft, Award, BookOpen, FileText,
//   Palette, Plus, Search, Upload, X, Zap,
// } from "lucide-react";

// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";

// const API_GATEWAY = "http://localhost:9000";

// /* ── templates (unchanged) ── */
// const templates = [
//   { id: 1, name: "Completion Certificate",  bg: "from-violet-600 to-indigo-700",  font: "Serif", theme: "#7C3AED", linkedCourses: 4, type: "COMPLETION"  },
//   { id: 2, name: "Excellence Certificate",  bg: "from-slate-700 to-slate-900",     font: "Sans",  theme: "#0F172A", linkedCourses: 2, type: "EXCELLENCE"  },
//   { id: 3, name: "Internship Certificate",  bg: "from-amber-500 to-amber-700",     font: "Serif", theme: "#F59E0B", linkedCourses: 3, type: "INTERNSHIP"  },
// ];

// /* ── type badge colours ── */
// const TYPE_CFG = {
//   COMPLETION:  "bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800",
//   EXCELLENCE:  "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700",
//   INTERNSHIP:  "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
// };

// /* ================= MAIN ================= */
// const CertificatesAdmin = () => {
//   const navigate = useNavigate();

//   const [search, setSearch]                 = useState("");
//   const [open, setOpen]                     = useState(false);
//   const [mode, setMode]                     = useState("GENERATE");
//   const [studentEmail, setStudentEmail]     = useState("");
//   const [studentName, setStudentName]       = useState("");
//   const [courseName, setCourseName]         = useState("");
//   const [certificateType, setCertificateType] = useState("COMPLETION");
//   const [file, setFile]                     = useState(null);
//   const [loading, setLoading]               = useState(false);

//   const filtered = templates.filter((t) =>
//     t.name.toLowerCase().includes(search.toLowerCase())
//   );

//   /* ── SUBMIT (unchanged) ── */
//   const handleSubmit = async () => {
//     if (!studentEmail || !courseName) { alert("Student email & course name required"); return; }
//     try {
//       setLoading(true);
//       if (mode === "GENERATE") {
//         if (!studentName) { alert("Student name required"); return; }
//         await axios.post(`${API_GATEWAY}/api/files/certificates/generate`, null, {
//           params: { email: studentEmail, studentName, courseName, type: certificateType },
//           headers: { Authorization: `Bearer ${localStorage.getItem("lms_token")}` },
//         });
//       } else {
//         if (!file) { alert("Please select certificate file"); return; }
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("email", studentEmail);
//         formData.append("courseName", courseName);
//         await axios.post(`${API_GATEWAY}/api/files/certificates/upload`, formData, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("lms_token")}` },
//         });
//       }
//       alert("Certificate processed successfully");
//       setOpen(false);
//       resetForm();
//     } catch { alert("Operation failed"); }
//     finally { setLoading(false); }
//   };

//   const resetForm = () => {
//     setStudentEmail(""); setStudentName(""); setCourseName("");
//     setFile(null); setMode("GENERATE"); setCertificateType("COMPLETION");
//   };

//   /* ================= RENDER ================= */
//   return (
//     <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 space-y-5">

//       {/* ═══════ HERO ═══════ */}
//       <div className="relative overflow-hidden rounded-2xl shadow-xl
//         bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4]">
//         <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
//         <div className="pointer-events-none absolute right-32 bottom-[-30px] h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
//         <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

//         <div className="relative flex items-center justify-between px-6 py-5">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5
//                 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all"
//             >
//               <ArrowLeft className="h-4 w-4" /> Back
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold tracking-tight text-white">Certificates</h1>
//               <p className="mt-0.5 text-sm text-blue-100/80">Issue or upload certificates for students</p>
//             </div>
//           </div>

//           {/* stats pill */}
//           <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
//             <Award className="h-4 w-4 text-cyan-200" />
//             <span className="text-sm font-semibold text-white">
//               {templates.length}
//               <span className="ml-1 font-normal text-blue-100/80">Templates</span>
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* ═══════ ACTION BAR ═══════ */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="relative sm:w-72">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//           <Input
//             placeholder="Search templates…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900
//               border-slate-200 dark:border-slate-800 text-sm"
//           />
//         </div>

//         <button
//           onClick={() => setOpen(true)}
//           className="flex items-center gap-1.5 rounded-xl
//             bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2
//             text-sm font-semibold text-white shadow
//             hover:opacity-90 hover:scale-105 transition-all self-start sm:self-auto"
//         >
//           <Plus className="h-4 w-4" /> Issue Certificate
//         </button>
//       </div>

//       {/* ═══════ TEMPLATE GRID ═══════ */}
//       {filtered.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-16 gap-3">
//           <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
//             <Award className="h-7 w-7 text-slate-400" />
//           </div>
//           <p className="text-sm font-medium text-slate-500">No templates found</p>
//         </div>
//       ) : (
//         <div className="grid gap-4 md:grid-cols-3">
//           {filtered.map((tpl) => (
//             <div
//               key={tpl.id}
//               className="group overflow-hidden rounded-2xl border border-slate-200
//                 dark:border-slate-800 bg-white dark:bg-slate-900 shadow
//                 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800
//                 transition-all duration-200"
//             >
//               {/* gradient preview */}
//               <div className={`relative h-28 bg-gradient-to-br ${tpl.bg}
//                 flex items-center justify-center overflow-hidden`}>
//                 {/* decorative rings */}
//                 <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
//                 <div className="absolute -left-4 -bottom-4 h-16 w-16 rounded-full bg-white/10" />
//                 <Award className="relative h-9 w-9 text-white/90 drop-shadow" />

//                 {/* type badge overlay */}
//                 <span className="absolute top-3 right-3 rounded-lg bg-black/30 px-2 py-0.5
//                   text-[10px] font-bold text-white/90 backdrop-blur-sm">
//                   {tpl.type}
//                 </span>
//               </div>

//               <div className="p-4 space-y-3">
//                 <p className="text-sm font-bold text-slate-800 dark:text-slate-100
//                   group-hover:text-blue-600 transition-colors">
//                   {tpl.name}
//                 </p>

//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
//                     <Palette className="h-3.5 w-3.5" />
//                     <span className="font-mono">{tpl.theme}</span>
//                   </div>
//                   <span className="rounded-lg bg-slate-100 dark:bg-slate-800
//                     px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
//                     {tpl.font}
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
//                   <BookOpen className="h-3.5 w-3.5" />
//                   <span>{tpl.linkedCourses} linked courses</span>
//                 </div>

//                 {/* divider */}
//                 <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
//                   <button
//                     onClick={() => { setCertificateType(tpl.type); setOpen(true); }}
//                     className="w-full flex items-center justify-center gap-1.5 rounded-xl
//                       bg-gradient-to-r from-blue-600 to-cyan-500 py-1.5
//                       text-xs font-semibold text-white shadow
//                       hover:opacity-90 hover:scale-[1.02] transition-all"
//                   >
//                     <Zap className="h-3.5 w-3.5" /> Issue Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ═══════ MODAL ═══════ */}
//       {open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center
//           bg-black/50 backdrop-blur-md">

//           <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden
//             bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">

//             {/* modal header */}
//             <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2.5">
//                   <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
//                     <Award className="h-4 w-4 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-bold text-white">Issue Certificate</h3>
//                     <p className="text-[11px] text-blue-100/70">Generate or upload a certificate</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => { setOpen(false); resetForm(); }}
//                   className="rounded-lg bg-white/15 p-1.5 text-white hover:bg-white/25 transition-colors"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>

//             {/* modal body */}
//             <div className="p-5 space-y-4">

//               {/* mode toggle */}
//               <div className="flex gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
//                 {["GENERATE", "UPLOAD"].map((m) => (
//                   <button
//                     key={m}
//                     onClick={() => setMode(m)}
//                     className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5
//                       text-xs font-semibold transition-all
//                       ${mode === m
//                         ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow"
//                         : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
//                       }`}
//                   >
//                     {m === "GENERATE"
//                       ? <><Zap className="h-3.5 w-3.5" /> Generate</>
//                       : <><Upload className="h-3.5 w-3.5" /> Upload</>
//                     }
//                   </button>
//                 ))}
//               </div>

//               {/* fields */}
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Student Email</label>
//                 <Input
//                   placeholder="student@example.com"
//                   value={studentEmail}
//                   onChange={(e) => setStudentEmail(e.target.value)}
//                   className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
//                 />
//               </div>

//               {mode === "GENERATE" && (
//                 <div className="space-y-1.5">
//                   <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Student Name</label>
//                   <Input
//                     placeholder="e.g. Raghib Khan"
//                     value={studentName}
//                     onChange={(e) => setStudentName(e.target.value)}
//                     className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
//                   />
//                 </div>
//               )}

//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Course Name</label>
//                 <Input
//                   placeholder="e.g. React for Beginners"
//                   value={courseName}
//                   onChange={(e) => setCourseName(e.target.value)}
//                   className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
//                 />
//               </div>

//               {mode === "GENERATE" && (
//                 <div className="space-y-1.5">
//                   <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Certificate Type</label>
//                   <div className="flex gap-2 flex-wrap">
//                     {["COMPLETION", "EXCELLENCE", "INTERNSHIP"].map((type) => (
//                       <button
//                         key={type}
//                         onClick={() => setCertificateType(type)}
//                         className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all
//                           ${certificateType === type
//                             ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent shadow"
//                             : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
//                           }`}
//                       >
//                         {type}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {mode === "UPLOAD" && (
//                 <div className="space-y-1.5">
//                   <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Certificate File</label>
//                   <div className="relative">
//                     <Input
//                       type="file"
//                       accept=".pdf,.png,.jpg,.jpeg"
//                       onChange={(e) => setFile(e.target.files[0])}
//                       className="h-10 rounded-xl border-slate-200 dark:border-slate-700
//                         bg-slate-50 dark:bg-slate-800 text-sm file:mr-3 file:rounded-lg
//                         file:border-0 file:bg-blue-50 file:text-blue-700 file:text-xs file:font-semibold"
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* buttons */}
//               <div className="flex justify-end gap-2 pt-1">
//                 <button
//                   onClick={() => { setOpen(false); resetForm(); }}
//                   className="px-4 py-2 rounded-xl text-sm font-medium
//                     bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
//                     hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   disabled={loading}
//                   className="flex items-center gap-1.5 px-5 py-2 rounded-xl
//                     text-sm font-semibold text-white shadow
//                     bg-gradient-to-r from-blue-600 to-cyan-500
//                     hover:opacity-90 hover:scale-105 transition-all
//                     disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
//                 >
//                   {loading ? (
//                     <><span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Processing…</>
//                   ) : mode === "UPLOAD" ? (
//                     <><Upload className="h-3.5 w-3.5" /> Upload</>
//                   ) : (
//                     <><Zap className="h-3.5 w-3.5" /> Issue</>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CertificatesAdmin;



























import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Award, BookOpen, ChevronRight,
  FileText, Palette, Plus, Search, Upload, X, Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const API_GATEWAY = "http://localhost:9000";

/* ── templates (unchanged) ── */
const templates = [
  { id:1, name:"Completion Certificate", bg:"from-violet-600 to-indigo-700",  font:"Serif", theme:"#7C3AED", linkedCourses:4, type:"COMPLETION" },
  { id:2, name:"Excellence Certificate", bg:"from-slate-700 to-slate-900",    font:"Sans",  theme:"#0F172A", linkedCourses:2, type:"EXCELLENCE" },
  { id:3, name:"Internship Certificate", bg:"from-amber-500 to-amber-700",    font:"Serif", theme:"#F59E0B", linkedCourses:3, type:"INTERNSHIP" },
];

/* ════════════ MAIN ════════════ */
const CertificatesAdmin = () => {
  const navigate = useNavigate();

  /* ── state (all unchanged) ── */
  const [search, setSearch]                   = useState("");
  const [panelOpen, setPanelOpen]             = useState(false);
  const [mode, setMode]                       = useState("GENERATE");
  const [studentEmail, setStudentEmail]       = useState("");
  const [studentName, setStudentName]         = useState("");
  const [courseName, setCourseName]           = useState("");
  const [certificateType, setCertificateType] = useState("COMPLETION");
  const [file, setFile]                       = useState(null);
  const [loading, setLoading]                 = useState(false);

  const filtered = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ── submit (unchanged) ── */
  const handleSubmit = async () => {
    if (!studentEmail || !courseName) { alert("Student email & course name required"); return; }
    try {
      setLoading(true);
      if (mode === "GENERATE") {
        if (!studentName) { alert("Student name required"); return; }
        await axios.post(`${API_GATEWAY}/api/files/certificates/generate`, null, {
          params: { email: studentEmail, studentName, courseName, type: certificateType },
          headers: { Authorization: `Bearer ${localStorage.getItem("lms_token")}` },
        });
      } else {
        if (!file) { alert("Please select certificate file"); return; }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("email", studentEmail);
        formData.append("courseName", courseName);
        await axios.post(`${API_GATEWAY}/api/files/certificates/upload`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("lms_token")}` },
        });
      }
      alert("Certificate processed successfully");
      setPanelOpen(false);
      resetForm();
    } catch { alert("Operation failed"); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setStudentEmail(""); setStudentName(""); setCourseName("");
    setFile(null); setMode("GENERATE"); setCertificateType("COMPLETION");
  };

  const openPanel = (type = "COMPLETION") => {
    setCertificateType(type); setPanelOpen(true);
  };

  /* ════════════ RENDER ════════════ */
  return (
    <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 space-y-5">

      {/* ═══ HERO ═══ */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4]">
        <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute right-32 bottom-[-30px] h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="relative flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Certificates</h1>
              <p className="mt-0.5 text-sm text-blue-100/80">Issue or upload certificates for students</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
            <Award className="h-4 w-4 text-cyan-200" />
            <span className="text-sm font-semibold text-white">
              {templates.length}<span className="ml-1 font-normal text-blue-100/80">Templates</span>
            </span>
          </div>
        </div>
      </div>

      {/* ═══ ACTION BAR ═══ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search templates…" value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm" />
        </div>
        <button onClick={() => openPanel()}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 hover:scale-105 transition-all self-start sm:self-auto">
          <Plus className="h-4 w-4" /> Issue Certificate
        </button>
      </div>

      {/* ═══ MAIN — grid + inline panel ═══ */}
      <div className={`flex gap-4 ${panelOpen ? "items-start" : ""}`}>

        {/* TEMPLATE GRID */}
        <div className={`transition-all duration-300 ${panelOpen ? "flex-1 min-w-0" : "w-full"}`}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Award className="h-7 w-7 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">No templates found</p>
            </div>
          ) : (
            <div className={`grid gap-4 ${panelOpen ? "grid-cols-1 md:grid-cols-2" : "md:grid-cols-3"}`}>
              {filtered.map(tpl => (
                <div key={tpl.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200">

                  {/* gradient preview */}
                  <div className={`relative h-28 bg-gradient-to-br ${tpl.bg} flex items-center justify-center overflow-hidden`}>
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
                    <div className="absolute -left-4 -bottom-4 h-16 w-16 rounded-full bg-white/10" />
                    <Award className="relative h-9 w-9 text-white/90 drop-shadow" />
                    <span className="absolute top-3 right-3 rounded-lg bg-black/30 px-2 py-0.5 text-[10px] font-bold text-white/90 backdrop-blur-sm">
                      {tpl.type}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{tpl.name}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Palette className="h-3.5 w-3.5" />
                        <span className="font-mono">{tpl.theme}</span>
                      </div>
                      <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">{tpl.font}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{tpl.linkedCourses} linked courses</span>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                      <button onClick={() => openPanel(tpl.type)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-1.5 text-xs font-semibold text-white shadow hover:opacity-90 hover:scale-[1.02] transition-all">
                        <Zap className="h-3.5 w-3.5" /> Issue Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ═══ INLINE SLIDE PANEL ═══ */}
        <div className={`flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden
          ${panelOpen ? "w-80 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}>

          <div className="w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">

            {/* panel header */}
            <div className="bg-gradient-to-r from-[#1a56db] to-[#06b6d4] px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Issue Certificate</h3>
                    <p className="text-[11px] text-blue-100/70">Generate or upload a certificate</p>
                  </div>
                </div>
                <button onClick={() => { setPanelOpen(false); resetForm(); }}
                  className="h-7 w-7 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors">
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* step bar */}
              <div className="flex gap-1.5 mt-4">
                {["Student Info","Certificate"].map((step, i) => (
                  <div key={step} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    i === 0 ? "bg-white/20 text-white" : "text-white/40"}`}>
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      i === 0 ? "bg-white text-blue-600" : "bg-white/20 text-white/60"}`}>{i+1}</div>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* panel body */}
            <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(100vh-280px)]">

              {/* mode toggle */}
              <div className="flex gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                {["GENERATE","UPLOAD"].map(m => (
                  <button key={m} onClick={() => setMode(m)}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                      mode === m
                        ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>
                    {m === "GENERATE"
                      ? <><Zap className="h-3.5 w-3.5"/> Generate</>
                      : <><Upload className="h-3.5 w-3.5"/> Upload</>}
                  </button>
                ))}
              </div>

              {/* student email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Student Email</label>
                <Input placeholder="student@example.com" value={studentEmail} onChange={e => setStudentEmail(e.target.value)}
                  className="h-9 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm" />
              </div>

              {/* student name — generate only */}
              {mode === "GENERATE" && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Student Name</label>
                  <Input placeholder="e.g. Raghib Khan" value={studentName} onChange={e => setStudentName(e.target.value)}
                    className="h-9 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm" />
                </div>
              )}

              {/* course name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Course Name</label>
                <Input placeholder="e.g. React for Beginners" value={courseName} onChange={e => setCourseName(e.target.value)}
                  className="h-9 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm" />
              </div>

              {/* certificate type — generate only */}
              {mode === "GENERATE" && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Certificate Type</label>
                  <div className="flex flex-col gap-2">
                    {["COMPLETION","EXCELLENCE","INTERNSHIP"].map(type => (
                      <button key={type} onClick={() => setCertificateType(type)}
                        className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all text-left ${
                          certificateType === type
                            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent shadow"
                            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                        <div className={`h-6 w-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          certificateType === type ? "bg-white/20" : "bg-slate-100 dark:bg-slate-700"}`}>
                          <Award className={`h-3.5 w-3.5 ${certificateType === type ? "text-white" : "text-slate-500"}`}/>
                        </div>
                        {type}
                        {certificateType === type && <ChevronRight className="h-3.5 w-3.5 ml-auto"/>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* file upload — upload only */}
              {mode === "UPLOAD" && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Certificate File</label>
                  <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e => setFile(e.target.files[0])}
                    className="h-9 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:text-xs file:font-semibold" />
                </div>
              )}
            </div>

            {/* panel footer */}
            <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
              <button onClick={() => { setPanelOpen(false); resetForm(); }}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={loading}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white shadow bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100">
                {loading
                  ? <><span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"/> Processing…</>
                  : mode === "UPLOAD"
                  ? <><Upload className="h-3.5 w-3.5"/> Upload</>
                  : <><Zap className="h-3.5 w-3.5"/> Issue</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesAdmin;