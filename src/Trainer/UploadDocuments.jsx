// import React, { useEffect, useState } from "react";
// import fileService from "../services/fileService";

// import {
//   Upload,
//   FileText,
//   Loader2,
//   File,
//   CheckCircle,
//   AlertCircle,
//   X,
//   Folder,
//   Download,
//   Eye,
//   Trash2,
//   Search,
//   Filter,
//   FileType,
//   Calendar,
//   HardDrive,
//   Sparkles,
// } from "lucide-react";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// const UploadDocuments = () => {
//   const [file, setFile] = useState(null);
//   const [files, setFiles] = useState([]); // ✅ REAL DATA
//   const [loading, setLoading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");
//   const [isDragging, setIsDragging] = useState(false);

//   const role = localStorage.getItem("lms_role"); // ADMIN / TRAINER

//   /* ================= FETCH FILES (RECENT UPLOADS) ================= */
//   useEffect(() => {
//     loadFiles();
//   }, []);

//   const loadFiles = async () => {
//     try {
//       const res = await fileService.getFiles(0, 20); // backend API
//       setFiles(res.data.content || []);
//     } catch (err) {
//       console.error("Failed to load files", err);
//     }
//   };

//   /* ================= FILE VALIDATION ================= */
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) validateAndSetFile(selectedFile);
//   };

//   const validateAndSetFile = (selectedFile) => {
//     const validTypes = [
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       "application/vnd.ms-powerpoint",
//       "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//       "text/plain",
//     ];

//     if (!validTypes.includes(selectedFile.type)) {
//       setMessage("Please upload a valid document (PDF, DOC, DOCX, PPT, PPTX, TXT)");
//       setMessageType("error");
//       return;
//     }

//     if (selectedFile.size > 52428800) {
//       setMessage("File size exceeds 50MB limit");
//       setMessageType("error");
//       return;
//     }

//     setFile(selectedFile);
//     setMessage("");
//     setMessageType("");
//   };

//   /* ================= DRAG & DROP ================= */
//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => setIsDragging(false);

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const droppedFile = e.dataTransfer.files[0];
//     if (droppedFile) validateAndSetFile(droppedFile);
//   };

//   /* ================= UPLOAD API ================= */
//   const handleUpload = async () => {
//     if (!file) {
//       setMessage("Please select a document");
//       setMessageType("error");
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");
//       setMessageType("");
//       setUploadProgress(0);

//       const progressInterval = setInterval(() => {
//         setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 10));
//       }, 200);

//       await fileService.uploadFile(file, role); // ✅ UPLOAD API

//       clearInterval(progressInterval);
//       setUploadProgress(100);

//       setTimeout(async () => {
//         setMessage("Document uploaded successfully!");
//         setMessageType("success");
//         setFile(null);
//         setUploadProgress(0);
//         await loadFiles(); // ✅ REFRESH RECENT UPLOADS
//       }, 400);
//     } catch (err) {
//       console.error(err);
//       setMessage("Upload failed. Please try again.");
//       setMessageType("error");
//       setUploadProgress(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatFileSize = (bytes) => {
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
//       <div className="max-w-7xl mx-auto space-y-8">

//         {/* ================= HEADER ================= */}
//         <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-10 text-white shadow-xl">
//           <div className="flex items-center gap-4">
//             <Folder className="w-8 h-8" />
//             <h1 className="text-4xl font-bold">Upload Documents</h1>
//           </div>
//         </div>

//         {/* ================= UPLOAD CARD ================= */}
//         <Card className="p-8 rounded-3xl">
//           <h2 className="text-2xl font-bold mb-6">Upload New Document</h2>

//           <div
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onDrop={handleDrop}
//             className={`border-2 border-dashed rounded-xl p-10 text-center ${
//               isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300"
//             }`}
//           >
//             {!file ? (
//               <>
//                 <FileText className="w-12 h-12 mx-auto text-blue-500" />
//                 <input type="file" onChange={handleFileChange} className="mt-4" />
//               </>
//             ) : (
//               <>
//                 <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
//                 <p className="mt-2">{file.name}</p>
//                 <p className="text-sm">{formatFileSize(file.size)}</p>
//                 <Button variant="outline" size="sm" onClick={() => setFile(null)}>
//                   <X className="w-4 h-4 mr-1" /> Remove
//                 </Button>
//               </>
//             )}
//           </div>

//           {loading && <p className="mt-3">Uploading... {uploadProgress}%</p>}

//           <Button onClick={handleUpload} disabled={loading || !file} className="mt-4 w-full">
//             {loading ? <Loader2 className="animate-spin" /> : <Upload className="mr-2" />}
//             Upload Document
//           </Button>

//           {message && (
//             <p className={`mt-3 ${messageType === "success" ? "text-green-600" : "text-red-600"}`}>
//               {message}
//             </p>
//           )}
//         </Card>

//         {/* ================= RECENT UPLOADS (API) ================= */}
//         <Card className="p-8 rounded-3xl">
//           <h2 className="text-2xl font-bold mb-4">Recent Uploads</h2>

//           {files.length === 0 ? (
//             <p className="text-sm text-slate-500">No documents uploaded yet</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {files.map((doc) => (
//                 <Card key={doc.id} className="p-4">
//                   <p className="font-semibold truncate">{doc.originalName}</p>
//                   <p className="text-xs text-slate-500">
//                     {formatFileSize(doc.size)} ·{" "}
//                     {new Date(doc.uploadedAt).toLocaleDateString()}
//                   </p>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </Card>

//       </div>
//     </div>
//   );
// };

// export default UploadDocuments;



import React, { useEffect, useState } from "react";
import fileService from "../services/fileService";
import {
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle,
  X,
  Folder,
  Calendar,
  HardDrive,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UploadDocuments = () => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const role = localStorage.getItem("lms_role");

  /* ================= LOAD FILES ================= */
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const res = await fileService.getFiles(0, 20);
      setFiles(res.data.content || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FILE VALIDATION ================= */
  const validateAndSetFile = (selectedFile) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
    ];

    if (!validTypes.includes(selectedFile.type)) {
      setMessage("Only PDF, DOC, DOCX, PPT, PPTX, TXT allowed");
      setMessageType("error");
      return;
    }

    if (selectedFile.size > 52428800) {
      setMessage("File size exceeds 50MB");
      setMessageType("error");
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  /* ================= DRAG DROP ================= */
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) validateAndSetFile(droppedFile);
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setUploadProgress(10);

      const interval = setInterval(() => {
        setUploadProgress((p) => (p >= 90 ? 90 : p + 10));
      }, 200);

      await fileService.uploadFile(file, role);

      clearInterval(interval);
      setUploadProgress(100);

      setTimeout(async () => {
        setMessage("Document uploaded successfully");
        setMessageType("success");
        setFile(null);
        setUploadProgress(0);
        await loadFiles();
      }, 400);
    } catch {
      setMessage("Upload failed");
      setMessageType("error");
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) =>
    Math.round(bytes / 1024 / 1024) + " MB";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ================= HERO ================= */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
          <div className="relative flex items-center gap-4">
            <Folder className="w-10 h-10" />
            <div>
              <h1 className="text-4xl font-bold">Document Studio</h1>
              <p className="text-white/80 mt-1">
                Upload & manage learning resources for your students
              </p>
            </div>
          </div>
        </div>

        {/* ================= UPLOAD ================= */}
        <Card className="rounded-3xl p-8 shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-indigo-500" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Upload New Document
            </h2>
          </div>

          {/* DROP ZONE */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed p-10 text-center transition-all
              ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
                  : "border-slate-300 dark:border-slate-700"
              }`}
          >
            {!file ? (
              <>
                <UploadCloud className="w-12 h-12 mx-auto text-indigo-500 mb-4" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Drag & drop your document here
                </p>

                <label className="inline-block mt-4 px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold cursor-pointer hover:bg-indigo-700">
                  Browse File
                  <input type="file" hidden onChange={(e) => validateAndSetFile(e.target.files[0])} />
                </label>
              </>
            ) : (
              <div className="space-y-3">
                <CheckCircle className="w-10 h-10 mx-auto text-emerald-500" />
                <p className="font-semibold">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {formatFileSize(file.size)}
                </p>
                <Button size="sm" variant="outline" onClick={() => setFile(null)}>
                  <X className="w-4 h-4 mr-1" /> Remove
                </Button>
              </div>
            )}
          </div>

          {/* PROGRESS */}
          {loading && (
            <div className="mt-4">
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  style={{ width: `${uploadProgress}%` }}
                  className="h-full bg-indigo-600 transition-all"
                />
              </div>
              <p className="text-xs mt-1 text-slate-500">
                Uploading… {uploadProgress}%
              </p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Upload Document"}
          </Button>

          {message && (
            <p
              className={`mt-3 text-sm ${
                messageType === "success"
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </Card>

        {/* ================= RECENT FILES ================= */}
        <Card className="rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            Recent Uploads
          </h2>

          {files.length === 0 ? (
            <p className="text-sm text-slate-500">
              No documents uploaded yet
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {files.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition"
                >
                  <FileText className="text-indigo-500 mb-2" />
                  <p className="font-semibold truncate">{doc.originalName}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                    <HardDrive className="w-3 h-3 ml-2" />
                    {formatFileSize(doc.size)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UploadDocuments;
