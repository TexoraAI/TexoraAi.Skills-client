// import React, { useEffect, useState } from "react";
// import fileService from "../services/fileService";
// import videoService from "../services/videoService";
// import {
//   UploadCloud,
//   Loader2,
//   CheckCircle,
//   X,
//   Folder,
//   Sparkles,
// } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// const UploadDocuments = () => {
//   const [file, setFile] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");
//   const [isDragging, setIsDragging] = useState(false);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [batchId, setBatchId] = useState("");

//   useEffect(() => {
//     loadFiles();
//     loadBatches();
//   }, []);

//   const loadFiles = async () => {
//     try {
//       const res = await fileService.getTrainerFiles();
//       setFiles(res.data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const loadBatches = async () => {
//     try {
//       const res = await videoService.getTrainerBatches();
//       setBatches(res.data || []);
//     } catch (err) {
//       console.error("Failed to load batches", err);
//     }
//   };

//   // ✅ ALLOW PDF + WORD + PPT
//   const allowedTypes = [
//     "application/pdf",

//     // WORD
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

//     // PPT
//     "application/vnd.ms-powerpoint",
//     "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//   ];

//   const validateAndSetFile = (selectedFile) => {
//     if (!selectedFile) return;

//     if (!allowedTypes.includes(selectedFile.type)) {
//       setMessage("Only PDF, Word, or PPT files are allowed");
//       setMessageType("error");
//       setFile(null);
//       return;
//     }

//     if (selectedFile.size > 100 * 1024 * 1024) {
//       setMessage("File exceeds 100MB");
//       setMessageType("error");
//       setFile(null);
//       return;
//     }

//     setFile(selectedFile);
//     setMessage("");
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     validateAndSetFile(e.dataTransfer.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file || !batchId) {
//       setMessage("Select batch and file");
//       setMessageType("error");
//       return;
//     }

//     try {
//       setLoading(true);
//       await fileService.uploadFile(file, batchId);

//       setMessage("File uploaded successfully");
//       setMessageType("success");

//       setFile(null);
//       setTitle("");
//       setDescription("");
//       setBatchId("");
//       loadFiles();
//     } catch {
//       setMessage("Upload failed");
//       setMessageType("error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors p-6">
//       <div className="max-w-5xl mx-auto space-y-6">
//         <div className="rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 p-6 text-white shadow-lg">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow">
//               <Folder className="w-5 h-5 text-blue-600" />
//             </div>
//             <div>
//               <h1 className="text-xl font-semibold">Document Studio</h1>
//               <p className="text-sm text-white/90">
//                 Upload training PDFs with details
//               </p>
//             </div>
//           </div>
//         </div>

//         <Card className="rounded-2xl p-6 shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
//           <div className="flex items-center gap-2 mb-5">
//             <Sparkles className="text-blue-500 w-4 h-4" />
//             <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
//               Upload Document
//             </h2>
//           </div>

//           <div
//             onDragOver={(e) => {
//               e.preventDefault();
//               setIsDragging(true);
//             }}
//             onDragLeave={() => setIsDragging(false)}
//             onDrop={handleDrop}
//             className={`rounded-xl border-2 border-dashed p-8 text-center transition-all
//             ${isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800"}`}
//           >
//             {!file ? (
//               <>
//                 <UploadCloud className="w-10 h-10 mx-auto text-blue-500 mb-3" />
//                 <p className="text-sm text-slate-600 dark:text-slate-300">
//                   Drag & drop document here
//                 </p>

//                 {/* ✅ only change here */}
//                 <label className="inline-block mt-4 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold cursor-pointer transition">
//                   Browse File
//                   <input
//                     type="file"
//                     hidden
//                     accept=".pdf,.doc,.docx,.ppt,.pptx"
//                     onChange={(e) => validateAndSetFile(e.target.files[0])}
//                   />
//                 </label>
//               </>
//             ) : (
//               <div className="space-y-2">
//                 <CheckCircle className="w-9 h-9 mx-auto text-emerald-500" />
//                 <p className="font-semibold text-slate-900 dark:text-slate-100">
//                   {file.name}
//                 </p>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={() => setFile(null)}
//                 >
//                   <X className="w-4 h-4 mr-1" /> Remove
//                 </Button>
//               </div>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Title"
//               className="rounded-lg border px-4 py-2 text-sm"
//             />

//             <select
//               value={batchId}
//               onChange={(e) => setBatchId(e.target.value)}
//               className="rounded-lg border px-4 py-2 text-sm"
//             >
//               <option value="">Select Batch</option>
//               {batches.map((b) => (
//                 <option key={b.id} value={b.id}>
//                   {b.name || "Batch"} (ID: {b.id})
//                 </option>
//               ))}
//             </select>

//             <textarea
//               rows={3}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Description"
//               className="rounded-lg border px-4 py-2 text-sm md:col-span-2"
//             />
//           </div>

//           <Button
//             onClick={handleUpload}
//             disabled={!file || loading}
//             className="mt-6 w-full bg-emerald-600 text-white"
//           >
//             {loading ? <Loader2 className="animate-spin" /> : "Upload File"}
//           </Button>

//           {message && (
//             <p
//               className={`mt-3 text-sm ${messageType === "success" ? "text-emerald-500" : "text-red-500"}`}
//             >
//               {message}
//             </p>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default UploadDocuments;

import React, { useEffect, useState } from "react";
import fileService from "../services/fileService";
import videoService from "../services/videoService";
import {
  UploadCloud,
  Loader2,
  CheckCircle,
  X,
  Folder,
  Sparkles,
  Eye,
  Download,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UploadDocuments = () => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [batchId, setBatchId] = useState("");

  useEffect(() => {
    loadFiles();
    loadBatches();
  }, []);

  const loadFiles = async () => {
    try {
      const res = await fileService.getTrainerFiles();
      console.log(res.data); // debugging
      setFiles(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadBatches = async () => {
    try {
      const res = await videoService.getTrainerBatches();
      setBatches(res.data || []);
    } catch (err) {
      console.error("Failed to load batches", err);
    }
  };

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage("Only PDF, Word, or PPT files are allowed");
      setMessageType("error");
      setFile(null);
      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      setMessage("File exceeds 100MB");
      setMessageType("error");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !batchId) {
      setMessage("Select batch and file");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      await fileService.uploadFile(file, batchId, title, description);

      setMessage("File uploaded successfully");
      setMessageType("success");

      setFile(null);
      setTitle("");
      setDescription("");
      setBatchId("");
      loadFiles();
    } catch {
      setMessage("Upload failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fileService.deleteFile(id);
      setFiles(files.filter((f) => f.id !== id));
      setMessage("File deleted successfully");
      setMessageType("success");
    } catch {
      setMessage("Delete failed");
      setMessageType("error");
    }
  };

  const handlePreview = async (fileItem) => {
    try {
      const res = await fileService.viewFileBlob(fileItem.id);

      const blob = new Blob([res.data], {
        type: res.headers["content-type"],
      });

      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      alert("Preview failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 p-6 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow">
              <Folder className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Document Studio</h1>
              <p className="text-sm text-white/90">
                Upload training PDFs with details
              </p>
            </div>
          </div>
        </div>

        <Card className="rounded-2xl p-6 shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          {/* Upload Section */}
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="text-blue-500 w-4 h-4" />
            <h2 className="text-lg font-semibold">Upload Document</h2>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`rounded-xl border-2 border-dashed p-8 text-center transition-all
            ${isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800"}`}
          >
            {!file ? (
              <>
                <UploadCloud className="w-10 h-10 mx-auto text-blue-500 mb-3" />
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Drag & drop document here
                </p>
                <label className="inline-block mt-4 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold cursor-pointer transition">
                  Browse File
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={(e) => validateAndSetFile(e.target.files[0])}
                  />
                </label>
              </>
            ) : (
              <div className="space-y-2">
                <CheckCircle className="w-9 h-9 mx-auto text-emerald-500" />
                <p className="font-semibold">{file.name}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePreview(fileItem)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="rounded-lg border px-4 py-2 text-sm"
            />

            <select
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              <option value="">Select Batch</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name || "Batch"} (ID: {b.id})
                </option>
              ))}
            </select>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="rounded-lg border px-4 py-2 text-sm md:col-span-2"
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            className="mt-6 w-full bg-emerald-600 text-white"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Upload File"}
          </Button>

          {message && (
            <p
              className={`mt-3 text-sm ${messageType === "success" ? "text-emerald-500" : "text-red-500"}`}
            >
              {message}
            </p>
          )}

          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-md font-semibold">Uploaded Documents</h3>

              {files.map((fileItem) => (
                <div
                  key={fileItem.id}
                  className="flex items-center justify-between p-4 rounded-xl border bg-slate-50 dark:bg-slate-800"
                >
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm">
                      {fileItem.title || fileItem.fileName || "No Title"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {fileItem.description || "No Description"}
                    </p>
                    <p className="text-xs text-blue-500">
                      Batch ID: {fileItem.batchId || "N/A"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePreview(fileItem)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = fileItem.fileUrl;
                        link.download = fileItem.fileName || "document";
                        link.click();
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(fileItem.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
