
// import React, { useEffect, useState } from "react";
// import { Award, Download, Eye } from "lucide-react";

// import fileService from "@/services/fileService";
// import auth from "@/auth";

// const Certificates = () => {
//   const [certificates, setCertificates] = useState([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= FETCH STUDENT CERTIFICATES ================= */
//   useEffect(() => {
//     const fetchCertificates = async () => {
//       try {
//         const { email } = auth.getCurrentUser();

//         if (!email) {
//           console.error("Student email not found in auth storage");
//           setLoading(false);
//           return;
//         }

//         const res = await fileService.getStudentCertificates(email);
//         setCertificates(res.data || []);
//       } catch (err) {
//         console.error("Failed to fetch certificates", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCertificates();
//   }, []);

//   /* ================= ACTIONS ================= */
//   const handlePreview = async (fileName) => {
//     try {
//       const res = await fileService.getCertificateBlob(fileName);
//       const blob = new Blob([res.data], { type: "application/pdf" });
//       const url = window.URL.createObjectURL(blob);
//       window.open(url, "_blank");
//     } catch {
//       alert("Unable to preview certificate");
//     }
//   };

//   const handleDownload = async (fileName) => {
//     try {
//       const res = await fileService.getCertificateBlob(fileName);
//       const blob = new Blob([res.data], { type: "application/pdf" });
//       const url = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = url;
//       link.download = fileName;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       window.URL.revokeObjectURL(url);
//     } catch {
//       alert("Unable to download certificate");
//     }
//   };

//   /* ================= LOADING ================= */
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
//         <p className="text-slate-600 dark:text-slate-400">
//           Loading certificates...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-8">

//       {/* ================= LIGHT BLUE HERO ================= */}
//       <header
//         className="relative overflow-hidden rounded-3xl
//         bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400
//         dark:from-sky-600 dark:via-blue-600 dark:to-indigo-600
//         p-8 text-white shadow-xl mb-10 max-w-6xl mx-auto"
//       >
//         <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />

//         <div className="relative flex items-center gap-3">
//           <div className="p-3 rounded-xl bg-white/30 backdrop-blur shadow">
//             <Award className="w-7 h-7" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold">Your Certificates</h1>
//             <p className="mt-1 text-sm text-white/85">
//               View, preview and download your issued certificates
//             </p>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-6xl mx-auto space-y-8">

//         {/* ================= EMPTY STATE ================= */}
//         {certificates.length === 0 && (
//           <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center shadow">
//             <p className="text-slate-600 dark:text-slate-400">
//               No certificates issued yet.
//             </p>
//           </div>
//         )}

//         {/* ================= CERTIFICATE LIST ================= */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {certificates.map((c, idx) => (
//             <div
//               key={idx}
//               className="bg-white dark:bg-slate-900
//                          rounded-2xl shadow-lg p-6 space-y-4
//                          border border-slate-200 dark:border-slate-800
//                          hover:shadow-xl transition"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
//                   <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//                 </div>

//                 <span className="text-xs font-semibold px-3 py-1 rounded-full
//                                  bg-blue-100 dark:bg-blue-900/30
//                                  text-blue-700 dark:text-blue-300">
//                   {c.type}
//                 </span>
//               </div>

//               <div>
//                 <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
//                   {c.courseName}
//                 </h3>
//                 <p className="text-sm text-slate-500 dark:text-slate-400">
//                   Issued on:{" "}
//                   {c.issuedDate
//                     ? new Date(c.issuedDate).toLocaleDateString()
//                     : "-"}
//                 </p>
//               </div>

//               <div className="flex gap-2 pt-2">
//                 <button
//                   onClick={() => handlePreview(c.fileName)}
//                   className="flex-1 flex items-center justify-center gap-2
//                              px-4 py-2 rounded-xl
//                              bg-blue-600 hover:bg-blue-700
//                              text-white transition"
//                 >
//                   <Eye className="w-4 h-4" />
//                   Preview
//                 </button>

//                 <button
//                   onClick={() => handleDownload(c.fileName)}
//                   className="flex-1 flex items-center justify-center gap-2
//                              px-4 py-2 rounded-xl
//                              bg-slate-100 dark:bg-slate-800
//                              hover:bg-slate-200 dark:hover:bg-slate-700
//                              text-slate-700 dark:text-slate-200 transition"
//                 >
//                   <Download className="w-4 h-4" />
//                   Download
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Certificates;



















import React, { useEffect, useState } from "react";
import { Award, Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";

import fileService from "@/services/fileService";
import auth from "@/auth";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);

  /* ================= FETCH STUDENT CERTIFICATES ================= */
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { email } = auth.getCurrentUser();
        if (!email) {
          console.error("Student email not found in auth storage");
          setLoading(false);
          return;
        }
        const res = await fileService.getStudentCertificates(email);
        setCertificates(res.data || []);
      } catch (err) {
        console.error("Failed to fetch certificates", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  /* ================= ACTIONS ================= */
  const handlePreview = async (fileName) => {
    try {
      const res = await fileService.getCertificateBlob(fileName);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      alert("Unable to preview certificate");
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const res = await fileService.getCertificateBlob(fileName);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Unable to download certificate");
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#0f1b38]">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Loading certificates...
        </p>
      </div>
    );
  }

  const total = certificates.length;
  const recent = certificates.filter((c) => {
    if (!c.issuedDate) return false;
    const diff = Date.now() - new Date(c.issuedDate).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  }).length;

  /* Stat card inline styles — rich gradients for both modes */
  const statCards = [
    {
      label: "TOTAL CERTIFICATES",
      value: total,
      sub: "All issued",
      lightStyle: { background: "linear-gradient(135deg, #1e3a8a, #1d4ed8)" },
      darkStyle:  { background: "linear-gradient(135deg, #1e3a5f, #16304f)" },
    },
    {
      label: "AVAILABLE NOW",
      value: total,
      sub: "Ready to view",
      lightStyle: { background: "linear-gradient(135deg, #0f766e, #0891b2)" },
      darkStyle:  { background: "linear-gradient(135deg, #0f4d5e, #0b3d4d)" },
    },
    {
      label: "THIS WEEK",
      value: recent,
      sub: "Newly issued",
      lightStyle: { background: "linear-gradient(135deg, #4338ca, #6366f1)" },
      darkStyle:  { background: "linear-gradient(135deg, #1a3a52, #12304a)" },
    },
    {
      label: "ACTIVE",
      value: total,
      sub: "Valid & active",
      lightStyle: { background: "linear-gradient(135deg, #0369a1, #0ea5e9)" },
      darkStyle:  { background: "linear-gradient(135deg, #1b3d5a, #143351)" },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1b38] px-6 py-8">

      {/* ===== PAGE TITLE ===== */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-wide">
          Certificate Database
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          View, preview and download your issued certificates
        </p>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((s, i) => (
          <div
            key={i}
            className="rounded-xl px-5 py-4 flex flex-col gap-1 text-white shadow-md"
            style={s.lightStyle}
          >
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/70">
              {s.label}
            </span>
            <span className="text-2xl font-extrabold">{s.value}</span>
            <span className="text-xs text-white/60">{s.sub}</span>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">

        {/* ===== EMPTY STATE ===== */}
        {certificates.length === 0 && (
          <div className="rounded-2xl border border-slate-200 dark:border-white/10
                          bg-white dark:bg-[#162040] p-12 text-center shadow-sm">
            <Award className="w-12 h-12 text-slate-300 dark:text-slate-500 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No certificates issued yet.
            </p>
          </div>
        )}

        {/* ===== CERTIFICATE GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((c, idx) => {
            const isExpanded = expandedCard === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden
                  bg-white dark:bg-gradient-to-br dark:from-[#162040] dark:to-[#1a2952]
                  ${isExpanded
                    ? "border-blue-400 dark:border-cyan-500/50 shadow-lg"
                    : "border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-cyan-700/40 shadow-sm"
                  }`}
              >
                {/* ---- TOP BAR ---- */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-cyan-900/40
                                    border border-blue-200 dark:border-cyan-700/30">
                      <Award className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                    </div>
                    <span className="text-[10px] font-bold tracking-widest uppercase
                                     px-2.5 py-1 rounded-full
                                     bg-blue-100 dark:bg-cyan-900/40
                                     text-blue-700 dark:text-cyan-300
                                     border border-blue-200 dark:border-cyan-700/30">
                      {c.type}
                    </span>
                  </div>

                  {/* ← → Toggle arrows */}
                  <button
                    onClick={() => setExpandedCard(isExpanded ? null : idx)}
                    title={isExpanded ? "Collapse" : "Expand"}
                    className="flex items-center gap-0.5 px-2 py-1 rounded-lg
                               bg-slate-100 dark:bg-white/5
                               border border-slate-200 dark:border-white/10
                               hover:bg-blue-50 dark:hover:bg-white/10
                               hover:border-blue-300 dark:hover:border-cyan-600/40
                               text-slate-400 dark:text-slate-300
                               hover:text-blue-600 dark:hover:text-cyan-300
                               transition"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* ---- COURSE NAME ---- */}
                <div className="px-5 pb-3">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white leading-snug">
                    {c.courseName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Issued on:{" "}
                    {c.issuedDate
                      ? new Date(c.issuedDate).toLocaleDateString()
                      : "-"}
                  </p>
                </div>

                {/* ---- EXPANDED DETAILS ---- */}
                {isExpanded && (
                  <div className="px-5 pb-4 pt-3 border-t border-slate-100 dark:border-white/8 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 dark:bg-white/5
                                      border border-slate-100 dark:border-white/5
                                      rounded-lg px-3 py-2">
                        <span className="text-slate-400 block">File Name</span>
                        <span className="text-slate-700 dark:text-slate-200 font-medium truncate block">
                          {c.fileName || "-"}
                        </span>
                      </div>
                      <div className="bg-slate-50 dark:bg-white/5
                                      border border-slate-100 dark:border-white/5
                                      rounded-lg px-3 py-2">
                        <span className="text-slate-400 block">Type</span>
                        <span className="text-slate-700 dark:text-slate-200 font-medium">
                          {c.type || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ---- DIVIDER ---- */}
                <div className="mx-5 border-t border-slate-100 dark:border-white/8" />

                {/* ---- ACTIONS ---- */}
                <div className="flex gap-2 px-5 py-4">
                  <button
                    onClick={() => handlePreview(c.fileName)}
                    className="flex-1 flex items-center justify-center gap-2
                               px-4 py-2.5 rounded-xl text-sm font-semibold
                               bg-blue-600 hover:bg-blue-700
                               text-white transition shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleDownload(c.fileName)}
                    className="flex-1 flex items-center justify-center gap-2
                               px-4 py-2.5 rounded-xl text-sm font-semibold
                               bg-slate-100 dark:bg-white/8
                               border border-slate-200 dark:border-white/12
                               hover:bg-slate-200 dark:hover:bg-white/14
                               text-slate-700 dark:text-slate-200 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Certificates;