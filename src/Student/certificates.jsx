// import React, { useEffect, useState } from "react";
// import { Award, Download, Eye } from "lucide-react";

// import fileService from "@/services/fileService";
// import auth from "@/auth"; // ✅ USE EXISTING AUTH LOGIC

// const Certificates = () => {
//   const [certificates, setCertificates] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ================= FETCH STUDENT CERTIFICATES =================
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

//   // ================= ACTIONS (UPDATED ONLY HERE) =================
//   const handlePreview = async (fileName) => {
//     try {
//       const res = await fileService.getCertificateBlob(fileName);
//       const blob = new Blob([res.data], { type: "application/pdf" });
//       const url = window.URL.createObjectURL(blob);

//       // preview in new tab (JWT-secured)
//       window.open(url, "_blank");
//     } catch (err) {
//       console.error("Preview failed", err);
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
//     } catch (err) {
//       console.error("Download failed", err);
//       alert("Unable to download certificate");
//     }
//   };

//   // ================= LOADING =================
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-slate-600">Loading certificates...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       <div className="max-w-6xl mx-auto space-y-8">
//         {/* HEADER */}
//         <div className="rounded-3xl bg-gradient-to-r from-indigo-500 to-sky-500 p-8 text-white shadow-xl">
//           <div className="flex items-center gap-3">
//             <Award className="w-8 h-8" />
//             <h1 className="text-3xl font-bold">Your Certificates</h1>
//           </div>
//           <p className="mt-2 opacity-90">
//             View, preview and download your issued certificates
//           </p>
//         </div>

//         {/* EMPTY STATE */}
//         {certificates.length === 0 && (
//           <div className="bg-white rounded-xl p-8 text-center shadow">
//             <p className="text-slate-600">No certificates issued yet.</p>
//           </div>
//         )}

//         {/* CERTIFICATE LIST */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {certificates.map((c, idx) => (
//             <div
//               key={idx}
//               className="bg-white rounded-2xl shadow-lg p-6 space-y-4"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="p-3 rounded-xl bg-indigo-100">
//                   <Award className="w-6 h-6 text-indigo-600" />
//                 </div>

//                 <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100">
//                   {c.type}
//                 </span>
//               </div>

//               <div>
//                 <h3 className="text-lg font-bold">{c.courseName}</h3>
//                 <p className="text-sm text-slate-500">
//                   Issued on:{" "}
//                   {c.issuedDate
//                     ? new Date(c.issuedDate).toLocaleDateString()
//                     : "-"}
//                 </p>
//               </div>

//               <div className="flex gap-2 pt-2">
//                 <button
//                   onClick={() => handlePreview(c.fileName)}
//                   className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
//                 >
//                   <Eye className="w-4 h-4" />
//                   Preview
//                 </button>

//                 <button
//                   onClick={() => handleDownload(c.fileName)}
//                   className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
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
import { Award, Download, Eye } from "lucide-react";

import fileService from "@/services/fileService";
import auth from "@/auth";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-slate-600 dark:text-slate-400">
          Loading certificates...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-8">

      {/* ================= LIGHT BLUE HERO ================= */}
      <header
        className="relative overflow-hidden rounded-3xl
        bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400
        dark:from-sky-600 dark:via-blue-600 dark:to-indigo-600
        p-8 text-white shadow-xl mb-10 max-w-6xl mx-auto"
      >
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />

        <div className="relative flex items-center gap-3">
          <div className="p-3 rounded-xl bg-white/30 backdrop-blur shadow">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Your Certificates</h1>
            <p className="mt-1 text-sm text-white/85">
              View, preview and download your issued certificates
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto space-y-8">

        {/* ================= EMPTY STATE ================= */}
        {certificates.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center shadow">
            <p className="text-slate-600 dark:text-slate-400">
              No certificates issued yet.
            </p>
          </div>
        )}

        {/* ================= CERTIFICATE LIST ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((c, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900
                         rounded-2xl shadow-lg p-6 space-y-4
                         border border-slate-200 dark:border-slate-800
                         hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>

                <span className="text-xs font-semibold px-3 py-1 rounded-full
                                 bg-blue-100 dark:bg-blue-900/30
                                 text-blue-700 dark:text-blue-300">
                  {c.type}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {c.courseName}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Issued on:{" "}
                  {c.issuedDate
                    ? new Date(c.issuedDate).toLocaleDateString()
                    : "-"}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handlePreview(c.fileName)}
                  className="flex-1 flex items-center justify-center gap-2
                             px-4 py-2 rounded-xl
                             bg-blue-600 hover:bg-blue-700
                             text-white transition"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>

                <button
                  onClick={() => handleDownload(c.fileName)}
                  className="flex-1 flex items-center justify-center gap-2
                             px-4 py-2 rounded-xl
                             bg-slate-100 dark:bg-slate-800
                             hover:bg-slate-200 dark:hover:bg-slate-700
                             text-slate-700 dark:text-slate-200 transition"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Certificates;
