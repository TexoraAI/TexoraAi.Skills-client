// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// import {
//   getAssignmentFiles,
//   getStudentAssignments,
//   submitAssignment,
// } from "@/services/assessmentService";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";

// import { Award, Calendar, CheckCircle, FileText, Upload } from "lucide-react";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// export default function AssignmentDetail() {
//   const { id } = useParams();

//   const [assignment, setAssignment] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [submissionStatus, setSubmissionStatus] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     loadAssignment();
//     loadFiles();
//   }, [id]);

//   const loadAssignment = async () => {
//     try {
//       const assignmentRes = await getStudentAssignments();
//       const found = assignmentRes.data.find((a) => a.id === Number(id));
//       setAssignment(found);
//     } catch (error) {
//       console.error("Error loading assignment:", error);
//     }
//   };

//   const loadFiles = async () => {
//     try {
//       const res = await getAssignmentFiles(id);
//       setFiles(res.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleFileSelect = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile) {
//       alert("Please select a file");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await submitAssignment(id, selectedFile);
//       setSubmissionStatus(res.data.status);
//       alert("Assignment submitted successfully!");
//     } catch (error) {
//       console.error(error);
//       alert("You have already submitted this assignment.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!assignment) {
//     return <div className="p-6">Loading...</div>;
//   }

//   const isLate = new Date(assignment.deadline) < new Date();

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">{assignment.title}</h1>
//         <p className="text-muted-foreground mt-2">{assignment.description}</p>
//       </div>

//       <Card className="p-6 space-y-4">
//         <div>
//           <Calendar className="inline w-4 h-4 mr-2 text-purple-600" />
//           Deadline:
//           <strong className="ml-2">
//             {new Date(assignment.deadline).toLocaleString()}
//           </strong>
//           {isLate && (
//             <span className="ml-3 text-red-600 font-semibold">
//               (Deadline Passed)
//             </span>
//           )}
//         </div>

//         <div>
//           <Award className="inline w-4 h-4 mr-2 text-purple-600" />
//           Max Marks:
//           <strong className="ml-2">{assignment.maxMarks}</strong>
//         </div>
//       </Card>

//       <Card className="p-6 space-y-4">
//         <h2 className="font-semibold text-lg flex items-center gap-2">
//           <FileText className="w-5 h-5 text-purple-600" />
//           Assignment Files
//         </h2>

//         {files.map((file) => (
//           <div key={file.id} className="flex justify-between items-center">
//             <span>{file.fileName}</span>

//             <Button
//               onClick={async () => {
//                 try {
//                   const token = localStorage.getItem("lms_token");

//                   const response = await fetch(
//                     `${API_BASE_URL.replace("/api", "")}${file.downloadUrl}`,
//                     {
//                       headers: {
//                         Authorization: `Bearer ${token}`,
//                       },
//                     },
//                   );

//                   const blob = await response.blob();
//                   const url = window.URL.createObjectURL(blob);
//                   const link = document.createElement("a");
//                   link.href = url;
//                   link.download = file.fileName;
//                   document.body.appendChild(link);
//                   link.click();
//                   document.body.removeChild(link);
//                   window.URL.revokeObjectURL(url);
//                 } catch (error) {
//                   console.error("Download failed:", error);
//                 }
//               }}
//             >
//               Download
//             </Button>
//           </div>
//         ))}
//       </Card>

//       <Card className="p-6 space-y-4">
//         <h2 className="font-semibold text-lg flex items-center gap-2">
//           <Upload className="w-5 h-5 text-purple-600" />
//           Submit Assignment
//         </h2>

//         {submissionStatus && (
//           <div className="text-green-600 flex items-center gap-2">
//             <CheckCircle className="w-4 h-4" />
//             Submitted ({submissionStatus})
//           </div>
//         )}

//         <Input
//           type="file"
//           onChange={handleFileSelect}
//           accept=".pdf,.doc,.docx,.zip,.txt"
//         />

//         <Button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="bg-purple-600 text-white"
//         >
//           {loading ? "Submitting..." : "Submit Assignment"}
//         </Button>
//       </Card>
//     </div>
//   );
// } old ui 

















// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// import {
//   getAssignmentFiles,
//   getStudentAssignments,
//   submitAssignment,
// } from "@/services/assessmentService";

// import { Award, Calendar, CheckCircle, FileText, Upload, Eye, Download } from "lucide-react";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// /* ─── Styles ────────────────────────────────────────────────────────────── */
// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

//   :root {
//     --ad-bg:        #f1f5f9;
//     --ad-card:      #ffffff;
//     --ad-text:      #0f172a;
//     --ad-muted:     #64748b;
//     --ad-border:    #e2e8f0;
//     --ad-accent1:   #22d3ee;
//     --ad-accent2:   #fb923c;
//     --ad-accent3:   #34d399;
//     --ad-accent4:   #a78bfa;
//     --ad-danger:    #f87171;
//     --ad-shadow:    0 4px 24px rgba(0,0,0,0.06);
//     --ad-shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
//     --ad-radius:    20px;
//   }

//   .ad-dark {
//     --ad-bg:        #0a0a0a;
//     --ad-card:      #111111;
//     --ad-text:      #ffffff;
//     --ad-muted:     #94a3b8;
//     --ad-border:    rgba(255,255,255,0.06);
//     --ad-shadow:    0 4px 24px rgba(0,0,0,0.40);
//     --ad-shadow-lg: 0 8px 40px rgba(0,0,0,0.60);
//   }

//   .ad-root {
//     font-family: 'Poppins', sans-serif;
//     min-height: 100vh;
//     background: var(--ad-bg);
//     color: var(--ad-text);
//     padding: 24px;
//     box-sizing: border-box;
//     transition: background 0.3s, color 0.3s;
//   }

//   .ad-inner {
//     max-width: 900px;
//     margin: 0 auto;
//     display: flex;
//     flex-direction: column;
//     gap: 20px;
//   }

//   /* Loading */
//   .ad-loading {
//     font-family: 'Poppins', sans-serif;
//     padding: 48px;
//     text-align: center;
//     color: var(--ad-muted);
//     font-size: 14px;
//     font-weight: 500;
//   }

//   /* ── Page title block ── */
//   .ad-title-block {
//     margin-bottom: 4px;
//   }

//   .ad-badge {
//     display: inline-flex;
//     align-items: center;
//     gap: 6px;
//     padding: 5px 12px;
//     border-radius: 50px;
//     border: 1px solid var(--ad-border);
//     background: rgba(167,139,250,0.08);
//     color: var(--ad-accent4);
//     font-size: 10px;
//     font-weight: 700;
//     letter-spacing: 0.08em;
//     text-transform: uppercase;
//     margin-bottom: 12px;
//   }

//   .ad-h1 {
//     font-size: 28px;
//     font-weight: 800;
//     color: var(--ad-text);
//     margin: 0 0 8px;
//     line-height: 1.2;
//   }

//   .ad-desc {
//     font-size: 13px;
//     color: var(--ad-muted);
//     margin: 0;
//     line-height: 1.6;
//   }

//   /* ── Cards ── */
//   .ad-card {
//     background: var(--ad-card);
//     border: 1px solid var(--ad-border);
//     border-radius: var(--ad-radius);
//     padding: 24px 28px;
//     box-shadow: var(--ad-shadow);
//   }

//   .ad-card-title {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     font-size: 15px;
//     font-weight: 700;
//     color: var(--ad-text);
//     margin: 0 0 20px;
//   }

//   .ad-card-title-icon {
//     width: 36px;
//     height: 36px;
//     border-radius: 10px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }

//   /* ── Meta rows ── */
//   .ad-meta-row {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     padding: 14px 16px;
//     border-radius: 12px;
//     background: var(--ad-bg);
//     border: 1px solid var(--ad-border);
//     margin-bottom: 10px;
//     font-size: 13px;
//     font-weight: 500;
//     color: var(--ad-muted);
//   }

//   .ad-meta-row:last-child { margin-bottom: 0; }

//   .ad-meta-icon {
//     width: 32px;
//     height: 32px;
//     border-radius: 8px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     flex-shrink: 0;
//   }

//   .ad-meta-label { color: var(--ad-muted); }

//   .ad-meta-value {
//     font-weight: 700;
//     color: var(--ad-text);
//     margin-left: 4px;
//   }

//   .ad-late-tag {
//     margin-left: 8px;
//     padding: 3px 10px;
//     border-radius: 6px;
//     background: rgba(248,113,113,0.12);
//     color: var(--ad-danger);
//     font-size: 11px;
//     font-weight: 700;
//     border: 1px solid rgba(248,113,113,0.20);
//   }

//   /* ── File rows ── */
//   .ad-file-row {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     gap: 12px;
//     padding: 14px 16px;
//     border-radius: 12px;
//     background: var(--ad-bg);
//     border: 1px solid var(--ad-border);
//     margin-bottom: 10px;
//     transition: border-color 0.2s;
//   }

//   .ad-file-row:last-child { margin-bottom: 0; }
//   .ad-file-row:hover { border-color: rgba(34,211,238,0.25); }

//   .ad-file-name-wrap {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     min-width: 0;
//   }

//   .ad-file-icon {
//     width: 36px;
//     height: 36px;
//     border-radius: 10px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     background: rgba(34,211,238,0.10);
//     color: var(--ad-accent1);
//     flex-shrink: 0;
//   }

//   .ad-file-name {
//     font-size: 13px;
//     font-weight: 600;
//     color: var(--ad-text);
//     white-space: nowrap;
//     overflow: hidden;
//     text-overflow: ellipsis;
//   }

//   .ad-file-actions {
//     display: flex;
//     gap: 8px;
//     flex-shrink: 0;
//   }

//   /* ── Buttons ── */
//   .ad-btn {
//     display: inline-flex;
//     align-items: center;
//     gap: 6px;
//     padding: 9px 16px;
//     border-radius: 10px;
//     border: none;
//     font-family: 'Poppins', sans-serif;
//     font-size: 12px;
//     font-weight: 700;
//     cursor: pointer;
//     transition: opacity 0.2s, transform 0.15s;
//     white-space: nowrap;
//   }

//   .ad-btn:hover { opacity: 0.85; transform: translateY(-1px); }
//   .ad-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

//   .ad-btn-cyan {
//     background: var(--ad-accent1);
//     color: #0a0a0a;
//   }

//   .ad-btn-outline {
//     background: transparent;
//     color: var(--ad-accent1);
//     border: 1px solid rgba(34,211,238,0.35);
//   }

//   .ad-btn-outline:hover {
//     background: rgba(34,211,238,0.08);
//     opacity: 1;
//   }

//   .ad-btn-purple {
//     background: var(--ad-accent4);
//     color: #0a0a0a;
//   }

//   .ad-btn-full {
//     width: 100%;
//     justify-content: center;
//     padding: 13px 20px;
//     border-radius: 14px;
//     font-size: 13px;
//   }

//   /* ── Submit section ── */
//   .ad-submit-status {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     padding: 12px 16px;
//     border-radius: 12px;
//     background: rgba(52,211,153,0.08);
//     border: 1px solid rgba(52,211,153,0.20);
//     color: var(--ad-accent3);
//     font-size: 13px;
//     font-weight: 600;
//     margin-bottom: 16px;
//   }

//   .ad-file-input-wrap {
//     position: relative;
//     width: 100%;
//     margin-bottom: 16px;
//   }

//   .ad-file-input {
//     width: 100%;
//     padding: 13px 16px;
//     border-radius: 14px;
//     border: 1px dashed var(--ad-border);
//     background: var(--ad-bg);
//     color: var(--ad-text);
//     font-family: 'Poppins', sans-serif;
//     font-size: 12px;
//     font-weight: 500;
//     cursor: pointer;
//     box-sizing: border-box;
//     transition: border-color 0.2s;
//   }

//   .ad-file-input:hover { border-color: var(--ad-accent1); }

//   .ad-file-input::file-selector-button {
//     font-family: 'Poppins', sans-serif;
//     font-size: 11px;
//     font-weight: 700;
//     padding: 6px 14px;
//     border-radius: 8px;
//     border: none;
//     background: rgba(34,211,238,0.15);
//     color: var(--ad-accent1);
//     cursor: pointer;
//     margin-right: 12px;
//     transition: background 0.2s;
//   }

//   .ad-file-input::file-selector-button:hover {
//     background: rgba(34,211,238,0.25);
//   }
// `;

// if (!document.getElementById("ad-styles")) {
//   const tag = document.createElement("style");
//   tag.id = "ad-styles";
//   tag.textContent = styles;
//   document.head.appendChild(tag);
// }

// const isDark = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// /* ─── Component ──────────────────────────────────────────────────────────── */
// export default function AssignmentDetail() {
//   const { id } = useParams();

//   const [assignment, setAssignment] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [submissionStatus, setSubmissionStatus] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [dark, setDark] = useState(isDark);

//   useEffect(() => {
//     loadAssignment();
//     loadFiles();
//   }, [id]);

//   useEffect(() => {
//     const obs = new MutationObserver(() => setDark(isDark()));
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
//     obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
//     return () => obs.disconnect();
//   }, []);

//   const loadAssignment = async () => {
//     try {
//       const assignmentRes = await getStudentAssignments();
//       const found = assignmentRes.data.find((a) => a.id === Number(id));
//       setAssignment(found);
//     } catch (error) {
//       console.error("Error loading assignment:", error);
//     }
//   };

//   const loadFiles = async () => {
//     try {
//       const res = await getAssignmentFiles(id);
//       setFiles(res.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleFileSelect = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile) {
//       alert("Please select a file");
//       return;
//     }
//     try {
//       setLoading(true);
//       const res = await submitAssignment(id, selectedFile);
//       setSubmissionStatus(res.data.status);
//       alert("Assignment submitted successfully!");
//     } catch (error) {
//       console.error(error);
//       alert("You have already submitted this assignment.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async (file) => {
//     try {
//       const token = localStorage.getItem("lms_token");
//       const response = await fetch(
//         `${API_BASE_URL.replace("/api", "")}${file.downloadUrl}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = file.fileName;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download failed:", error);
//     }
//   };

//   const handleView = async (file) => {
//     try {
//       const token = localStorage.getItem("lms_token");
//       const response = await fetch(
//         `${API_BASE_URL.replace("/api", "")}${file.downloadUrl}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       window.open(url, "_blank");
//     } catch (error) {
//       console.error("View failed:", error);
//     }
//   };

//   if (!assignment) {
//     return <div className={`ad-root${dark ? " ad-dark" : ""}`}><div className="ad-loading">Loading assignment...</div></div>;
//   }

//   const isLate = new Date(assignment.deadline) < new Date();

//   return (
//     <div className={`ad-root${dark ? " ad-dark" : ""}`}>
//       <div className="ad-inner">

//         {/* ── Title ── */}
//         <div className="ad-title-block">
//           <div className="ad-badge">
//             <FileText size={10} />
//             Assignment Detail
//           </div>
//           <h1 className="ad-h1">{assignment.title}</h1>
//           <p className="ad-desc">{assignment.description}</p>
//         </div>

//         {/* ── Meta card ── */}
//         <div className="ad-card">
//           <div className="ad-meta-row">
//             <div className="ad-meta-icon" style={{ background: "rgba(167,139,250,0.10)", color: "var(--ad-accent4)" }}>
//               <Calendar size={15} />
//             </div>
//             <span className="ad-meta-label">Deadline</span>
//             <span className="ad-meta-value">{new Date(assignment.deadline).toLocaleString()}</span>
//             {isLate && <span className="ad-late-tag">Deadline Passed</span>}
//           </div>

//           <div className="ad-meta-row">
//             <div className="ad-meta-icon" style={{ background: "rgba(251,146,60,0.10)", color: "var(--ad-accent2)" }}>
//               <Award size={15} />
//             </div>
//             <span className="ad-meta-label">Max Marks</span>
//             <span className="ad-meta-value">{assignment.maxMarks}</span>
//           </div>
//         </div>

//         {/* ── Files card ── */}
//         <div className="ad-card">
//           <div className="ad-card-title">
//             <div className="ad-card-title-icon" style={{ background: "rgba(34,211,238,0.10)", color: "var(--ad-accent1)" }}>
//               <FileText size={17} />
//             </div>
//             Assignment Files
//           </div>

//           {files.length === 0 && (
//             <p style={{ color: "var(--ad-muted)", fontSize: 13, margin: 0 }}>No files attached.</p>
//           )}

//           {files.map((file) => (
//             <div key={file.id} className="ad-file-row">
//               <div className="ad-file-name-wrap">
//                 <div className="ad-file-icon">
//                   <FileText size={16} />
//                 </div>
//                 <span className="ad-file-name">{file.fileName}</span>
//               </div>

//               <div className="ad-file-actions">
//                 <button
//                   className="ad-btn ad-btn-outline"
//                   onClick={() => handleView(file)}
//                 >
//                   <Eye size={13} />
//                   View
//                 </button>
//                 <button
//                   className="ad-btn ad-btn-cyan"
//                   onClick={() => handleDownload(file)}
//                 >
//                   <Download size={13} />
//                   Download
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ── Submit card ── */}
//         <div className="ad-card">
//           <div className="ad-card-title">
//             <div className="ad-card-title-icon" style={{ background: "rgba(52,211,153,0.10)", color: "var(--ad-accent3)" }}>
//               <Upload size={17} />
//             </div>
//             Submit Assignment
//           </div>

//           {submissionStatus && (
//             <div className="ad-submit-status">
//               <CheckCircle size={16} />
//               Submitted ({submissionStatus})
//             </div>
//           )}

//           <div className="ad-file-input-wrap">
//             <input
//               className="ad-file-input"
//               type="file"
//               onChange={handleFileSelect}
//               accept=".pdf,.doc,.docx,.zip,.txt"
//             />
//           </div>

//           <button
//             className="ad-btn ad-btn-purple ad-btn-full"
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             <Upload size={15} />
//             {loading ? "Submitting..." : "Submit Assignment"}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// } updated ui no progress service add



















import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getAssignmentFiles,
  getStudentAssignments,
  submitAssignment,
} from "@/services/assessmentService";

import { progressService } from "@/services/progressService";

import { Award, Calendar, CheckCircle, CheckCircle2, FileText, Upload, Eye, Download } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

/* ─── Styles ─────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

  :root {
    --ad-bg:        #f1f5f9;
    --ad-card:      #ffffff;
    --ad-text:      #0f172a;
    --ad-muted:     #64748b;
    --ad-border:    #e2e8f0;
    --ad-accent1:   #22d3ee;
    --ad-accent2:   #fb923c;
    --ad-accent3:   #34d399;
    --ad-accent4:   #a78bfa;
    --ad-danger:    #f87171;
    --ad-shadow:    0 4px 24px rgba(0,0,0,0.06);
    --ad-shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
    --ad-radius:    20px;
  }

  .ad-dark {
    --ad-bg:        #0a0a0a;
    --ad-card:      #111111;
    --ad-text:      #ffffff;
    --ad-muted:     #94a3b8;
    --ad-border:    rgba(255,255,255,0.06);
    --ad-shadow:    0 4px 24px rgba(0,0,0,0.40);
    --ad-shadow-lg: 0 8px 40px rgba(0,0,0,0.60);
  }

  .ad-root {
    font-family: 'Poppins', sans-serif;
    min-height: 100vh;
    background: var(--ad-bg);
    color: var(--ad-text);
    padding: 24px;
    box-sizing: border-box;
    transition: background 0.3s, color 0.3s;
  }

  .ad-inner { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }

  .ad-loading {
    font-family: 'Poppins', sans-serif; padding: 48px; text-align: center;
    color: var(--ad-muted); font-size: 14px; font-weight: 500;
  }

  .ad-title-block { margin-bottom: 4px; }

  .ad-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 50px;
    border: 1px solid var(--ad-border);
    background: rgba(167,139,250,0.08); color: var(--ad-accent4);
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; margin-bottom: 12px;
  }

  .ad-h1 { font-size: 28px; font-weight: 800; color: var(--ad-text); margin: 0 0 8px; line-height: 1.2; }
  .ad-desc { font-size: 13px; color: var(--ad-muted); margin: 0; line-height: 1.6; }

  .ad-card {
    background: var(--ad-card); border: 1px solid var(--ad-border);
    border-radius: var(--ad-radius); padding: 24px 28px; box-shadow: var(--ad-shadow);
  }

  /* ✅ Submitted state for submit card */
  .ad-card.submitted { background: rgba(52,211,153,0.04); border-color: rgba(52,211,153,0.25); }

  .ad-card-title { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 700; color: var(--ad-text); margin: 0 0 20px; }
  .ad-card-title-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }

  .ad-meta-row {
    display: flex; align-items: center; gap: 10px;
    padding: 14px 16px; border-radius: 12px;
    background: var(--ad-bg); border: 1px solid var(--ad-border);
    margin-bottom: 10px; font-size: 13px; font-weight: 500; color: var(--ad-muted);
  }

  .ad-meta-row:last-child { margin-bottom: 0; }

  .ad-meta-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ad-meta-label { color: var(--ad-muted); }
  .ad-meta-value { font-weight: 700; color: var(--ad-text); margin-left: 4px; }

  .ad-late-tag {
    margin-left: 8px; padding: 3px 10px; border-radius: 6px;
    background: rgba(248,113,113,0.12); color: var(--ad-danger);
    font-size: 11px; font-weight: 700; border: 1px solid rgba(248,113,113,0.20);
  }

  /* ✅ Progress row */
  .ad-progress-row {
    display: flex; align-items: center; gap: 10px;
    padding: 14px 16px; border-radius: 12px;
    background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.20);
    margin-bottom: 16px;
  }

  .ad-progress-text { font-size: 13px; font-weight: 700; color: var(--ad-accent3); flex: 1; }
  .ad-progress-sub { font-size: 11px; color: var(--ad-muted); }

  .ad-progress-bar-wrap { width: 100px; height: 4px; border-radius: 99px; background: rgba(52,211,153,0.15); overflow: hidden; }
  .ad-progress-bar { height: 100%; border-radius: 99px; background: var(--ad-accent3); transition: width 0.5s ease; }

  .ad-file-row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; padding: 14px 16px; border-radius: 12px;
    background: var(--ad-bg); border: 1px solid var(--ad-border);
    margin-bottom: 10px; transition: border-color 0.2s;
  }

  .ad-file-row:last-child { margin-bottom: 0; }
  .ad-file-row:hover { border-color: rgba(34,211,238,0.25); }

  .ad-file-name-wrap { display: flex; align-items: center; gap: 10px; min-width: 0; }

  .ad-file-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(34,211,238,0.10); color: var(--ad-accent1); flex-shrink: 0;
  }

  .ad-file-name { font-size: 13px; font-weight: 600; color: var(--ad-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .ad-file-actions { display: flex; gap: 8px; flex-shrink: 0; }

  .ad-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 16px; border-radius: 10px; border: none;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; transition: opacity 0.2s, transform 0.15s; white-space: nowrap;
  }

  .ad-btn:hover { opacity: 0.85; transform: translateY(-1px); }
  .ad-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .ad-btn-cyan { background: var(--ad-accent1); color: #0a0a0a; }
  .ad-btn-outline { background: transparent; color: var(--ad-accent1); border: 1px solid rgba(34,211,238,0.35); }
  .ad-btn-outline:hover { background: rgba(34,211,238,0.08); opacity: 1; }
  .ad-btn-purple { background: var(--ad-accent4); color: #0a0a0a; }
  .ad-btn-green { background: var(--ad-accent3); color: #0a0a0a; }
  .ad-btn-full { width: 100%; justify-content: center; padding: 13px 20px; border-radius: 14px; font-size: 13px; }

  .ad-submit-status {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 16px; border-radius: 12px;
    background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.20);
    color: var(--ad-accent3); font-size: 13px; font-weight: 600; margin-bottom: 16px;
  }

  .ad-file-input-wrap { position: relative; width: 100%; margin-bottom: 16px; }

  .ad-file-input {
    width: 100%; padding: 13px 16px; border-radius: 14px;
    border: 1px dashed var(--ad-border); background: var(--ad-bg);
    color: var(--ad-text); font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 500; cursor: pointer;
    box-sizing: border-box; transition: border-color 0.2s;
  }

  .ad-file-input:hover { border-color: var(--ad-accent1); }

  .ad-file-input::file-selector-button {
    font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 700;
    padding: 6px 14px; border-radius: 8px; border: none;
    background: rgba(34,211,238,0.15); color: var(--ad-accent1);
    cursor: pointer; margin-right: 12px; transition: background 0.2s;
  }

  .ad-file-input::file-selector-button:hover { background: rgba(34,211,238,0.25); }
`;

if (!document.getElementById("ad-styles")) {
  const tag = document.createElement("style");
  tag.id = "ad-styles";
  tag.textContent = styles;
  document.head.appendChild(tag);
}

// ✅ Decode email from JWT
const getEmailFromToken = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch {
    return null;
  }
};

const isDarkMode = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export default function AssignmentDetail() {
  const { id } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalAssignmentCount, setTotalAssignmentCount] = useState(1);
  const [dark, setDark] = useState(isDarkMode);

  // ✅ Progress state from backend
  const [completedAssignmentIds, setCompletedAssignmentIds] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const studentEmail = getEmailFromToken();

  useEffect(() => {
    loadAssignment();
    loadFiles();
  }, [id]);

  useEffect(() => {
    const obs = new MutationObserver(() => setDark(isDarkMode()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const loadAssignment = async () => {
    try {
      const assignmentRes = await getStudentAssignments();
      const list =
        assignmentRes?.data?.data ||
        assignmentRes?.data?.assignments ||
        assignmentRes?.data || [];
      const assignmentList = Array.isArray(list) ? list : [];
      const found = assignmentList.find((a) => a.id === Number(id));
      setAssignment(found);

      if (found?.batchId) {
        const sameBlock = assignmentList.filter((a) => a.batchId === found.batchId);
        setTotalAssignmentCount(sameBlock.length || 1);

        // ✅ Load existing progress
        if (studentEmail) {
          try {
            const prog = await progressService.getAssignmentProgress(
              studentEmail,
              found.batchId,
            );
            setCompletedAssignmentIds(prog.data.completedAssignmentIds || []);
            setProgressPercentage(prog.data.percentage || 0);
          } catch {
            setCompletedAssignmentIds([]);
            setProgressPercentage(0);
          }
        }
      }
    } catch (error) {
      console.error("Error loading assignment:", error);
    }
  };

  const loadFiles = async () => {
    try {
      const res = await getAssignmentFiles(id);
      setFiles(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileSelect = (e) => setSelectedFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!selectedFile) { alert("Please select a file"); return; }
    try {
      setLoading(true);

      // 1️⃣ Submit the file
      const res = await submitAssignment(id, selectedFile);
      setSubmissionStatus(res.data.status);

      // 2️⃣ Mark progress
      const batchId = assignment?.batchId;
      const assignmentId = Number(id);
      if (studentEmail && batchId) {
        try {
          const prog = await progressService.markAssignmentComplete(
            studentEmail, batchId, assignmentId, totalAssignmentCount,
          );
          setCompletedAssignmentIds(prog.data.completedAssignmentIds || []);
          setProgressPercentage(prog.data.percentage || 0);
          console.log("✅ Assignment progress updated:", prog.data);
        } catch (progressError) {
          console.error("❌ Progress API error:", progressError?.response?.data || progressError.message);
        }
      }

      alert("Assignment submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("You have already submitted this assignment.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file) => {
    try {
      const token = localStorage.getItem("lms_token");
      const response = await fetch(
        `${API_BASE_URL.replace("/api", "")}${file.downloadUrl}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleView = async (file) => {
    try {
      const token = localStorage.getItem("lms_token");
      const response = await fetch(
        `${API_BASE_URL.replace("/api", "")}${file.downloadUrl}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("View failed:", error);
    }
  };

  if (!assignment) return (
    <div className={`ad-root${dark ? " ad-dark" : ""}`}>
      <div className="ad-loading">Loading assignment...</div>
    </div>
  );

  const isLate = new Date(assignment.deadline) < new Date();
  // ✅ Check completedAssignmentIds from backend
  const isSubmitted = completedAssignmentIds.includes(Number(id));

  return (
    <div className={`ad-root${dark ? " ad-dark" : ""}`}>
      <div className="ad-inner">

        {/* ── Title ── */}
        <div className="ad-title-block">
          <div className="ad-badge">
            <FileText size={10} />
            Assignment Detail
          </div>
          <h1 className="ad-h1">{assignment.title}</h1>
          <p className="ad-desc">{assignment.description}</p>
        </div>

        {/* ── Meta card ── */}
        <div className="ad-card">
          <div className="ad-meta-row">
            <div className="ad-meta-icon" style={{ background: "rgba(167,139,250,0.10)", color: "var(--ad-accent4)" }}>
              <Calendar size={15} />
            </div>
            <span className="ad-meta-label">Deadline</span>
            <span className="ad-meta-value">{new Date(assignment.deadline).toLocaleString()}</span>
            {isLate && <span className="ad-late-tag">Deadline Passed</span>}
          </div>

          <div className="ad-meta-row">
            <div className="ad-meta-icon" style={{ background: "rgba(251,146,60,0.10)", color: "var(--ad-accent2)" }}>
              <Award size={15} />
            </div>
            <span className="ad-meta-label">Max Marks</span>
            <span className="ad-meta-value">{assignment.maxMarks}</span>
          </div>

          {/* ✅ Submission progress row */}
          {totalAssignmentCount > 0 && (
            <div className="ad-progress-row" style={{ marginTop: 10, marginBottom: 0 }}>
              <CheckCircle2 size={16} color="var(--ad-accent3)" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p className="ad-progress-text">
                  {completedAssignmentIds.length} / {totalAssignmentCount} assignments submitted
                </p>
                <div className="ad-progress-bar-wrap" style={{ marginTop: 4 }}>
                  <div className="ad-progress-bar" style={{ width: `${progressPercentage}%` }} />
                </div>
              </div>
              <span className="ad-progress-sub">{progressPercentage.toFixed(0)}%</span>
            </div>
          )}
        </div>

        {/* ── Files card ── */}
        <div className="ad-card">
          <div className="ad-card-title">
            <div className="ad-card-title-icon" style={{ background: "rgba(34,211,238,0.10)", color: "var(--ad-accent1)" }}>
              <FileText size={17} />
            </div>
            Assignment Files
          </div>

          {files.length === 0 && (
            <p style={{ color: "var(--ad-muted)", fontSize: 13, margin: 0 }}>No files attached.</p>
          )}

          {files.map((file) => (
            <div key={file.id} className="ad-file-row">
              <div className="ad-file-name-wrap">
                <div className="ad-file-icon"><FileText size={16} /></div>
                <span className="ad-file-name">{file.fileName}</span>
              </div>
              <div className="ad-file-actions">
                <button className="ad-btn ad-btn-outline" onClick={() => handleView(file)}>
                  <Eye size={13} /> View
                </button>
                <button className="ad-btn ad-btn-cyan" onClick={() => handleDownload(file)}>
                  <Download size={13} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Submit card ── */}
        <div className={`ad-card${isSubmitted ? " submitted" : ""}`}>
          <div className="ad-card-title">
            <div className="ad-card-title-icon" style={{ background: "rgba(52,211,153,0.10)", color: "var(--ad-accent3)" }}>
              <Upload size={17} />
            </div>
            Submit Assignment
          </div>

          {/* ✅ Submitted confirmation block */}
          {isSubmitted && (
            <div className="ad-submit-status" style={{ marginBottom: 16 }}>
              <CheckCircle2 size={18} />
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>Assignment Submitted</p>
                <p style={{ margin: "2px 0 0", fontSize: 11, opacity: 0.75 }}>
                  {completedAssignmentIds.length}/{totalAssignmentCount} submitted ({progressPercentage.toFixed(0)}% complete)
                </p>
              </div>
            </div>
          )}

          {submissionStatus && !isSubmitted && (
            <div className="ad-submit-status">
              <CheckCircle size={16} />
              Submitted ({submissionStatus})
            </div>
          )}

          <div className="ad-file-input-wrap">
            <input
              className="ad-file-input"
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.zip,.txt"
            />
          </div>

          <button
            className={`ad-btn ad-btn-full${isSubmitted ? " ad-btn-green" : " ad-btn-purple"}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            <Upload size={15} />
            {loading ? "Submitting..." : isSubmitted ? "Resubmit Assignment" : "Submit Assignment"}
          </button>
        </div>

      </div>
    </div>
  );
}