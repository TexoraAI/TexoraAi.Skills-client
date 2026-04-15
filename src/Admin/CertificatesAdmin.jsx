// import axios from "axios";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowLeft, Award, BookOpen, ChevronRight,
//   FileText, Palette, Plus, Search, Upload, X, Zap,
// } from "lucide-react";
// import { Input } from "@/components/ui/input";

// const API_GATEWAY = "http://localhost:9000";

// /* ── templates (unchanged) ── */
// const templates = [
//   { id:1, name:"Completion Certificate", bg:"from-violet-600 to-indigo-700",  font:"Serif", theme:"#7C3AED", linkedCourses:4, type:"COMPLETION" },
//   { id:2, name:"Excellence Certificate", bg:"from-slate-700 to-slate-900",    font:"Sans",  theme:"#0F172A", linkedCourses:2, type:"EXCELLENCE" },
//   { id:3, name:"Internship Certificate", bg:"from-amber-500 to-amber-700",    font:"Serif", theme:"#F59E0B", linkedCourses:3, type:"INTERNSHIP" },
// ];

// /* ════════════ MAIN ════════════ */
// const CertificatesAdmin = () => {
//   const navigate = useNavigate();

//   /* ── state (all unchanged) ── */
//   const [search, setSearch]                   = useState("");
//   const [panelOpen, setPanelOpen]             = useState(false);
//   const [mode, setMode]                       = useState("GENERATE");
//   const [studentEmail, setStudentEmail]       = useState("");
//   const [studentName, setStudentName]         = useState("");
//   const [courseName, setCourseName]           = useState("");
//   const [certificateType, setCertificateType] = useState("COMPLETION");
//   const [file, setFile]                       = useState(null);
//   const [loading, setLoading]                 = useState(false);

//   const filtered = templates.filter(t =>
//     t.name.toLowerCase().includes(search.toLowerCase())
//   );

//   /* ── submit (unchanged) ── */
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
//       setPanelOpen(false);
//       resetForm();
//     } catch { alert("Operation failed"); }
//     finally { setLoading(false); }
//   };

//   const resetForm = () => {
//     setStudentEmail(""); setStudentName(""); setCourseName("");
//     setFile(null); setMode("GENERATE"); setCertificateType("COMPLETION");
//   };

//   const openPanel = (type = "COMPLETION") => {
//     setCertificateType(type); setPanelOpen(true);
//   };

//   /* ════════════ RENDER ════════════ */
//   return (
//     <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 space-y-5">

//       {/* ═══ HERO ═══ */}
//       <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4]">
//         <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
//         <div className="pointer-events-none absolute right-32 bottom-[-30px] h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
//         <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
//         <div className="relative flex items-center justify-between px-6 py-5">
//           <div className="flex items-center gap-4">
//             <button onClick={() => navigate(-1)}
//               className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all">
//               <ArrowLeft className="h-4 w-4" /> Back
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold tracking-tight text-white">Certificates</h1>
//               <p className="mt-0.5 text-sm text-blue-100/80">Issue or upload certificates for students</p>
//             </div>
//           </div>
//           <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
//             <Award className="h-4 w-4 text-cyan-200" />
//             <span className="text-sm font-semibold text-white">
//               {templates.length}<span className="ml-1 font-normal text-blue-100/80">Templates</span>
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* ═══ ACTION BAR ═══ */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="relative sm:w-72">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//           <Input placeholder="Search templates…" value={search} onChange={e => setSearch(e.target.value)}
//             className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm" />
//         </div>
//         <button onClick={() => openPanel()}
//           className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 hover:scale-105 transition-all self-start sm:self-auto">
//           <Plus className="h-4 w-4" /> Issue Certificate
//         </button>
//       </div>

//       {/* ═══ MAIN — grid + inline panel ═══ */}
//       <div className={`flex gap-4 ${panelOpen ? "items-start" : ""}`}>

//         {/* TEMPLATE GRID */}
//         <div className={`transition-all duration-300 ${panelOpen ? "flex-1 min-w-0" : "w-full"}`}>
//           {filtered.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 gap-3">
//               <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
//                 <Award className="h-7 w-7 text-slate-400" />
//               </div>
//               <p className="text-sm font-medium text-slate-500">No templates found</p>
//             </div>
//           ) : (
//             <div className={`grid gap-4 ${panelOpen ? "grid-cols-1 md:grid-cols-2" : "md:grid-cols-3"}`}>
//               {filtered.map(tpl => (
//                 <div key={tpl.id}
//                   className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200">

//                   {/* gradient preview */}
//                   <div className={`relative h-28 bg-gradient-to-br ${tpl.bg} flex items-center justify-center overflow-hidden`}>
//                     <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
//                     <div className="absolute -left-4 -bottom-4 h-16 w-16 rounded-full bg-white/10" />
//                     <Award className="relative h-9 w-9 text-white/90 drop-shadow" />
//                     <span className="absolute top-3 right-3 rounded-lg bg-black/30 px-2 py-0.5 text-[10px] font-bold text-white/90 backdrop-blur-sm">
//                       {tpl.type}
//                     </span>
//                   </div>

//                   <div className="p-4 space-y-3">
//                     <p className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{tpl.name}</p>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
//                         <Palette className="h-3.5 w-3.5" />
//                         <span className="font-mono">{tpl.theme}</span>
//                       </div>
//                       <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">{tpl.font}</span>
//                     </div>
//                     <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
//                       <BookOpen className="h-3.5 w-3.5" />
//                       <span>{tpl.linkedCourses} linked courses</span>
//                     </div>
//                     <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
//                       <button onClick={() => openPanel(tpl.type)}
//                         className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-1.5 text-xs font-semibold text-white shadow hover:opacity-90 hover:scale-[1.02] transition-all">
//                         <Zap className="h-3.5 w-3.5" /> Issue Now
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ═══ INLINE SLIDE PANEL ═══ */}
//         <div className={`flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden
//           ${panelOpen ? "w-80 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}>

//           <div className="w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">

//             {/* panel header */}
//             <div className="bg-gradient-to-r from-[#1a56db] to-[#06b6d4] px-5 py-4">
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
//                 <button onClick={() => { setPanelOpen(false); resetForm(); }}
//                   className="h-7 w-7 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors">
//                   <X className="h-4 w-4 text-white" />
//                 </button>
//               </div>

//               {/* step bar */}
//               <div className="flex gap-1.5 mt-4">
//                 {["Student Info","Certificate"].map((step, i) => (
//                   <div key={step} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
//                     i === 0 ? "bg-white/20 text-white" : "text-white/40"}`}>
//                     <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
//                       i === 0 ? "bg-white text-blue-600" : "bg-white/20 text-white/60"}`}>{i+1}</div>
//                     {step}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* panel body */}
//             <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(100vh-280px)]">

//               {/* mode toggle */}
//               <div className="flex gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
//                 {["GENERATE","UPLOAD"].map(m => (
//                   <button key={m} onClick={() => setMode(m)}
//                     className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
//                       mode === m
//                         ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow"
//                         : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>
//                     {m === "GENERATE"
//                       ? <><Zap className="h-3.5 w-3.5"/> Generate</>
//                       : <><Upload className="h-3.5 w-3.5"/> Upload</>}
//                   </button>
//                 ))}
//               </div>

//               {/* student email */}
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Student Email</label>
//                 <Input placeholder="student@example.com" value={studentEmail} onChange={e => setStudentEmail(e.target.value)}
//                   className="h-9 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm" />
//               </div>

//               {/* student name — generate only */}
//               {mode === "GENERATE" && (
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Student Name</label>
//                   <Input placeholder="e.g. Raghib Khan" value={studentName} onChange={e => setStudentName(e.target.value)}
//                     className="h-9 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm" />
//                 </div>
//               )}

//               {/* course name */}
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Course Name</label>
//                 <Input placeholder="e.g. React for Beginners" value={courseName} onChange={e => setCourseName(e.target.value)}
//                   className="h-9 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm" />
//               </div>

//               {/* certificate type — generate only */}
//               {mode === "GENERATE" && (
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Certificate Type</label>
//                   <div className="flex flex-col gap-2">
//                     {["COMPLETION","EXCELLENCE","INTERNSHIP"].map(type => (
//                       <button key={type} onClick={() => setCertificateType(type)}
//                         className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all text-left ${
//                           certificateType === type
//                             ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent shadow"
//                             : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
//                         <div className={`h-6 w-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
//                           certificateType === type ? "bg-white/20" : "bg-slate-100 dark:bg-slate-700"}`}>
//                           <Award className={`h-3.5 w-3.5 ${certificateType === type ? "text-white" : "text-slate-500"}`}/>
//                         </div>
//                         {type}
//                         {certificateType === type && <ChevronRight className="h-3.5 w-3.5 ml-auto"/>}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* file upload — upload only */}
//               {mode === "UPLOAD" && (
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Certificate File</label>
//                   <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e => setFile(e.target.files[0])}
//                     className="h-9 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:text-xs file:font-semibold" />
//                 </div>
//               )}
//             </div>

//             {/* panel footer */}
//             <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
//               <button onClick={() => { setPanelOpen(false); resetForm(); }}
//                 className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
//                 Cancel
//               </button>
//               <button onClick={handleSubmit} disabled={loading}
//                 className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white shadow bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100">
//                 {loading
//                   ? <><span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"/> Processing…</>
//                   : mode === "UPLOAD"
//                   ? <><Upload className="h-3.5 w-3.5"/> Upload</>
//                   : <><Zap className="h-3.5 w-3.5"/> Issue</>}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CertificatesAdmin;
















// CertificatesAdmin.jsx
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Award, BookOpen, ChevronRight, FileText, Palette, Plus, Search, Upload, X, Zap } from "lucide-react";

const STYLES_CERT = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;--c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;--sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.ce-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);--sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
.ce{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
.ce-inner{max-width:1300px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}
.ce-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.ce-hdr-l{display:flex;align-items:center;gap:14px;}
.ce-back{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s;flex-shrink:0;}
.ce-back:hover{border-color:rgba(34,211,238,.35);color:var(--c1);}
.ce-hdr-ico{width:52px;height:52px;border-radius:14px;background:rgba(251,146,60,.10);border:1px solid rgba(251,146,60,.18);display:flex;align-items:center;justify-content:center;color:var(--c2);flex-shrink:0;}
.ce-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(251,146,60,.08);color:var(--c2);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
.ce-h1{font-size:22px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.ce-sub{font-size:13px;color:var(--mu);margin:0;}
.ce-chip{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);font-size:13px;font-weight:700;white-space:nowrap;box-shadow:var(--sh);}
.ce-abar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.ce-sw{position:relative;}
.ce-sw svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
.ce-sw input{padding:10px 14px 10px 38px;border-radius:13px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;width:260px;transition:border-color .2s,box-shadow .2s;}
.ce-sw input::placeholder{color:var(--mu);}
.ce-sw input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.ce-issue-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:13px;border:none;background:var(--c2);color:#0a0a0a;font-family:'Poppins',sans-serif;font-size:13px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s;}
.ce-issue-btn:hover{opacity:.87;transform:translateY(-1px);}
.ce-main{display:flex;gap:18px;align-items:flex-start;}
.ce-grid{display:grid;gap:16px;transition:all .3s;}
.ce-tpl{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;transition:all .2s;}
.ce-tpl:hover{box-shadow:var(--shl);border-color:rgba(251,146,60,.25);}
.ce-tpl-preview{height:110px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.ce-tpl-preview::before{content:"";position:absolute;right:-16px;top:-16px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.12);}
.ce-tpl-type{position:absolute;top:10px;right:10px;padding:3px 9px;border-radius:7px;background:rgba(0,0,0,.30);font-size:10px;font-weight:800;color:rgba(255,255,255,.9);backdrop-filter:blur(4px);}
.ce-tpl-body{padding:16px;}
.ce-tpl-name{font-size:13px;font-weight:800;color:var(--tx);margin:0 0 10px;transition:color .15s;}
.ce-tpl:hover .ce-tpl-name{color:var(--c2);}
.ce-tpl-meta{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.ce-tpl-theme{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--mu);font-family:monospace;}
.ce-tpl-font{padding:3px 8px;border-radius:6px;background:var(--bg);border:1px solid var(--bd);font-size:11px;color:var(--mu);}
.ce-tpl-courses{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--mu);margin-bottom:12px;}
.ce-tpl-divider{height:1px;background:var(--bd);margin-bottom:12px;}
.ce-now-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:12px;border:none;background:var(--c2);color:#0a0a0a;font-family:'Poppins',sans-serif;font-size:12px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s;}
.ce-now-btn:hover{opacity:.87;transform:translateY(-1px);}
.ce-empty-grid{display:flex;flex-direction:column;align-items:center;padding:60px 20px;gap:10px;}
.ce-empty-ico{width:52px;height:52px;border-radius:15px;background:rgba(251,146,60,.08);border:1px solid rgba(251,146,60,.15);display:flex;align-items:center;justify-content:center;color:var(--c2);}
/* panel */
.ce-panel{flex-shrink:0;background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--shl);overflow:hidden;width:320px;transition:all .3s;}
.ce-ph{padding:18px 20px;background:rgba(34,211,238,.06);border-bottom:1px solid var(--bd);}
.ce-ph-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.ce-ph-l{display:flex;align-items:center;gap:10px;}
.ce-ph-ico{width:36px;height:36px;border-radius:10px;background:rgba(34,211,238,.12);border:1px solid rgba(34,211,238,.20);display:flex;align-items:center;justify-content:center;color:var(--c1);}
.ce-ph-title{font-size:14px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.ce-ph-sub{font-size:11px;color:var(--mu);margin:0;}
.ce-xbtn{width:30px;height:30px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
.ce-xbtn:hover{border-color:rgba(248,113,113,.30);color:var(--cr);}
.ce-steps{display:flex;gap:4px;}
.ce-step{display:flex;align-items:center;gap:5px;padding:6px 10px;border-radius:9px;font-family:'Poppins',sans-serif;font-size:11px;font-weight:600;}
.ce-step.on{background:rgba(34,211,238,.12);border:1px solid rgba(34,211,238,.22);color:var(--c1);}
.ce-step.off{color:var(--mu);}
.ce-step-num{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0;}
.ce-step.on .ce-step-num{background:var(--c1);color:#0a0a0a;}
.ce-step.off .ce-step-num{background:var(--bd);color:var(--mu);}
.ce-pb{padding:18px 20px;display:flex;flex-direction:column;gap:13px;overflow-y:auto;max-height:calc(100vh - 320px);}
.ce-mode-toggle{display:flex;gap:4px;background:var(--bg);border-radius:12px;padding:4px;}
.ce-mtab{flex:1;display:flex;align-items:center;justify-content:center;gap:5px;padding:8px;border-radius:8px;border:none;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;}
.ce-mtab.on{background:var(--card);color:var(--tx);box-shadow:0 1px 4px rgba(0,0,0,.08);}
.ce-mtab.off{background:transparent;color:var(--mu);}
.ce-field label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);margin-bottom:5px;}
.ce-inp{width:100%;padding:9px 12px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;outline:none;box-sizing:border-box;transition:border-color .2s,box-shadow .2s;}
.ce-inp:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.ce-inp::placeholder{color:var(--mu);}
.ce-type-btn{width:100%;display:flex;align-items:center;gap:10px;padding:10px 13px;border-radius:12px;border:1px solid var(--bd);background:transparent;font-family:'Poppins',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;text-align:left;margin-bottom:6px;}
.ce-type-btn.on{border-color:rgba(34,211,238,.40);background:rgba(34,211,238,.06);color:var(--c1);}
.ce-type-btn:not(.on){color:var(--mu);}
.ce-type-btn:not(.on):hover{border-color:rgba(34,211,238,.25);}
.ce-type-ico{width:26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ce-pf{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-top:1px solid var(--bd);}
.ce-cancel{padding:9px 16px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;}
.ce-cancel:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
.ce-submit{display:inline-flex;align-items:center;gap:6px;padding:9px 20px;border-radius:11px;border:none;background:var(--c1);color:#0a0a0a;font-family:'Poppins',sans-serif;font-size:12px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s;}
.ce-submit:hover{opacity:.87;transform:translateY(-1px);}
.ce-submit:disabled{opacity:.5;cursor:not-allowed;transform:none;}
`;
if(!document.getElementById("ce-st")){const t=document.createElement("style");t.id="ce-st";t.textContent=STYLES_CERT;document.head.appendChild(t);}
const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;
const API_GATEWAY="http://localhost:9000";
const templates=[
  {id:1,name:"Completion Certificate",grad:"linear-gradient(135deg,#6d28d9,#4338ca)",font:"Serif",theme:"#7C3AED",linkedCourses:4,type:"COMPLETION"},
  {id:2,name:"Excellence Certificate",grad:"linear-gradient(135deg,#1e293b,#0f172a)",font:"Sans",theme:"#0F172A",linkedCourses:2,type:"EXCELLENCE"},
  {id:3,name:"Internship Certificate",grad:"linear-gradient(135deg,#b45309,#92400e)",font:"Serif",theme:"#F59E0B",linkedCourses:3,type:"INTERNSHIP"},
];

const CertificatesAdmin=()=>{
  const navigate=useNavigate();
  const[dark,setDark]=useState(isDark);
  const[search,setSearch]=useState("");
  const[panelOpen,setPanelOpen]=useState(false);
  const[mode,setMode]=useState("GENERATE");
  const[studentEmail,setStudentEmail]=useState("");
  const[studentName,setStudentName]=useState("");
  const[courseName,setCourseName]=useState("");
  const[certificateType,setCertificateType]=useState("COMPLETION");
  const[file,setFile]=useState(null);
  const[loading,setLoading]=useState(false);

  React.useEffect(()=>{const o=new MutationObserver(()=>setDark(isDark()));o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});o.observe(document.body,{attributes:true,attributeFilter:["class"]});return()=>o.disconnect();},[]);

  const filtered=templates.filter(t=>t.name.toLowerCase().includes(search.toLowerCase()));
  const resetForm=()=>{setStudentEmail("");setStudentName("");setCourseName("");setFile(null);setMode("GENERATE");setCertificateType("COMPLETION");};
  const openPanel=(type="COMPLETION")=>{setCertificateType(type);setPanelOpen(true);};

  const handleSubmit=async()=>{
    if(!studentEmail||!courseName){alert("Student email & course name required");return;}
    try{
      setLoading(true);
      if(mode==="GENERATE"){
        if(!studentName){alert("Student name required");return;}
        await axios.post(`${API_GATEWAY}/api/files/certificates/generate`,null,{params:{email:studentEmail,studentName,courseName,type:certificateType},headers:{Authorization:`Bearer ${localStorage.getItem("lms_token")}`}});
      }else{
        if(!file){alert("Please select certificate file");return;}
        const fd=new FormData();fd.append("file",file);fd.append("email",studentEmail);fd.append("courseName",courseName);
        await axios.post(`${API_GATEWAY}/api/files/certificates/upload`,fd,{headers:{Authorization:`Bearer ${localStorage.getItem("lms_token")}`}});
      }
      alert("Certificate processed successfully");setPanelOpen(false);resetForm();
    }catch{alert("Operation failed");}
    finally{setLoading(false);}
  };

  return(
    <div className={`ce${dark?" ce-dk":""}`}>
      <div className="ce-inner">
        <div className="ce-hdr">
          <div className="ce-hdr-l">
            <button className="ce-back" onClick={()=>navigate(-1)}><ArrowLeft size={14}/> Back</button>
            <div className="ce-hdr-ico"><Award size={24}/></div>
            <div>
              <div className="ce-bdg"><Award size={10}/> Certificates</div>
              <h1 className="ce-h1">Certificates</h1>
              <p className="ce-sub">Issue or upload certificates for students</p>
            </div>
          </div>
          <div className="ce-chip"><Award size={14} style={{color:"var(--c2)"}}/><span style={{fontWeight:800,color:"var(--c2)"}}>{templates.length}</span><span style={{color:"var(--mu)",fontWeight:500}}>Templates</span></div>
        </div>

        <div className="ce-abar">
          <div className="ce-sw"><Search size={14}/><input placeholder="Search templates…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
          <button className="ce-issue-btn" onClick={()=>openPanel()}><Plus size={15}/> Issue Certificate</button>
        </div>

        <div className="ce-main">
          <div style={{flex:1,minWidth:0}}>
            {filtered.length===0?(
              <div className="ce-empty-grid"><div className="ce-empty-ico"><Award size={24}/></div><p style={{fontSize:13,fontWeight:700,color:"var(--mu)",margin:0}}>No templates found</p></div>
            ):(
              <div className="ce-grid" style={{gridTemplateColumns:panelOpen?"repeat(auto-fill,minmax(240px,1fr))":"repeat(auto-fill,minmax(280px,1fr))"}}>
                {filtered.map(tpl=>(
                  <div key={tpl.id} className="ce-tpl">
                    <div className="ce-tpl-preview" style={{background:tpl.grad}}>
                      <Award size={36} color="rgba(255,255,255,.9)"/>
                      <span className="ce-tpl-type">{tpl.type}</span>
                    </div>
                    <div className="ce-tpl-body">
                      <p className="ce-tpl-name">{tpl.name}</p>
                      <div className="ce-tpl-meta">
                        <div className="ce-tpl-theme"><Palette size={12}/>{tpl.theme}</div>
                        <span className="ce-tpl-font">{tpl.font}</span>
                      </div>
                      <div className="ce-tpl-courses"><BookOpen size={13}/>{tpl.linkedCourses} linked courses</div>
                      <div className="ce-tpl-divider"/>
                      <button className="ce-now-btn" onClick={()=>openPanel(tpl.type)}><Zap size={13}/> Issue Now</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {panelOpen&&(
            <div className="ce-panel">
              <div className="ce-ph">
                <div className="ce-ph-row">
                  <div className="ce-ph-l">
                    <div className="ce-ph-ico"><Award size={17}/></div>
                    <div><p className="ce-ph-title">Issue Certificate</p><p className="ce-ph-sub">Generate or upload a certificate</p></div>
                  </div>
                  <button className="ce-xbtn" onClick={()=>{setPanelOpen(false);resetForm();}}><X size={14}/></button>
                </div>
                <div className="ce-steps">
                  {["Student Info","Certificate"].map((s,i)=>(
                    <div key={s} className={`ce-step${i===0?" on":" off"}`}>
                      <div className="ce-step-num">{i+1}</div>{s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="ce-pb">
                <div className="ce-mode-toggle">
                  {["GENERATE","UPLOAD"].map(m=>(
                    <button key={m} className={`ce-mtab${mode===m?" on":" off"}`} onClick={()=>setMode(m)}>
                      {m==="GENERATE"?<><Zap size={12}/> Generate</>:<><Upload size={12}/> Upload</>}
                    </button>
                  ))}
                </div>
                <div className="ce-field"><label>Student Email</label><input className="ce-inp" placeholder="student@example.com" value={studentEmail} onChange={e=>setStudentEmail(e.target.value)}/></div>
                {mode==="GENERATE"&&<div className="ce-field"><label>Student Name</label><input className="ce-inp" placeholder="e.g. Raghib Khan" value={studentName} onChange={e=>setStudentName(e.target.value)}/></div>}
                <div className="ce-field"><label>Course Name</label><input className="ce-inp" placeholder="e.g. React for Beginners" value={courseName} onChange={e=>setCourseName(e.target.value)}/></div>
                {mode==="GENERATE"&&(
                  <div className="ce-field">
                    <label>Certificate Type</label>
                    {["COMPLETION","EXCELLENCE","INTERNSHIP"].map(type=>(
                      <button key={type} className={`ce-type-btn${certificateType===type?" on":""}`} onClick={()=>setCertificateType(type)}>
                        <div className="ce-type-ico" style={{background:certificateType===type?"rgba(34,211,238,.15)":"var(--bg)"}}><Award size={14} style={{color:certificateType===type?"var(--c1)":"var(--mu)"}}/></div>
                        {type}
                        {certificateType===type&&<ChevronRight size={14} style={{marginLeft:"auto",color:"var(--c1)"}}/>}
                      </button>
                    ))}
                  </div>
                )}
                {mode==="UPLOAD"&&<div className="ce-field"><label>Certificate File</label><input className="ce-inp" type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e=>setFile(e.target.files[0])}/></div>}
              </div>
              <div className="ce-pf">
                <button className="ce-cancel" onClick={()=>{setPanelOpen(false);resetForm();}}>Cancel</button>
                <button className="ce-submit" onClick={handleSubmit} disabled={loading}>
                  {loading?<><span style={{width:13,height:13,borderRadius:"50%",border:"2px solid rgba(0,0,0,.2)",borderTopColor:"#0a0a0a",animation:"ce-spin .8s linear infinite",display:"inline-block"}}/> Processing…</>:mode==="UPLOAD"?<><Upload size={13}/> Upload</>:<><Zap size={13}/> Issue</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes ce-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};
export default CertificatesAdmin;