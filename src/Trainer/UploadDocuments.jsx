// // src/trainer/UploadDocuments.jsx
// import { Button } from "@/components/ui/button";
// import { CheckCircle, Download, Eye, Folder, Loader2, Sparkles, Trash2, UploadCloud } from "lucide-react";
// import { useEffect, useState } from "react";
// import fileService from "../services/fileService";
// import videoService from "../services/videoService";
// import {
//   useTrainerTheme, PageShell, PageHero, ThemedCard, CardHeader,
//   ThemedInput, ThemedTextarea, ThemedSelect, FieldLabel,
//   PrimaryButton, EmptyState, Pill,
// } from "./trainerTheme";

// const UploadDocuments = () => {
//   const { t, isDark } = useTrainerTheme();

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
//     } catch (err) { console.error(err); }
//   };

//   const loadBatches = async () => {
//     try {
//       const res = await videoService.getTrainerBatches();
//       setBatches(res.data || []);
//     } catch (err) { console.error("Failed to load batches", err); }
//   };

//   const allowedTypes = [
//     "application/pdf",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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
//       await fileService.uploadFile(file, batchId, title, description);
//       setMessage("File uploaded successfully");
//       setMessageType("success");
//       setFile(null); setTitle(""); setDescription(""); setBatchId("");
//       loadFiles();
//     } catch {
//       setMessage("Upload failed");
//       setMessageType("error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await fileService.deleteFile(id);
//       setFiles(files.filter((f) => f.id !== id));
//       setMessage("File deleted successfully");
//       setMessageType("success");
//     } catch {
//       setMessage("Delete failed");
//       setMessageType("error");
//     }
//   };

//   const handlePreview = async (fileItem) => {
//     try {
//       const res = await fileService.viewFileBlob(fileItem.id);
//       const blob = new Blob([res.data], { type: res.headers["content-type"] });
//       const url = window.URL.createObjectURL(blob);
//       window.open(url, "_blank");
//     } catch (err) {
//       console.error(err);
//       alert("Preview failed");
//     }
//   };

//   return (
//     <PageShell t={t}>
//       {/* HERO */}
//       <PageHero
//         t={t} isDark={isDark}
//         icon={Folder}
//         badge="Content Management"
//         title="Document Studio"
//         subtitle="Upload training PDFs with details"
//         color="#2563eb"
//       />

//       {/* UPLOAD CARD */}
//       <ThemedCard t={t} style={{ marginBottom: 20 }}>
//         <CardHeader t={t} icon={Sparkles} color="#2563eb" title="Upload Document" />

//         {/* DROP ZONE */}
//         <div
//           onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
//           onDragLeave={() => setIsDragging(false)}
//           onDrop={handleDrop}
//           style={{
//             borderRadius: 16,
//             border: `2px dashed ${isDragging ? "#2563eb" : t.inputBorder}`,
//             padding: "40px 24px",
//             textAlign: "center",
//             background: isDragging ? "rgba(37,99,235,0.04)" : t.inputBg,
//             marginBottom: 24,
//             transition: "all 0.2s",
//           }}
//         >
//           {!file ? (
//             <>
//               <UploadCloud size={40} color="#2563eb" style={{ display: "block", margin: "0 auto 12px" }} />
//               <p style={{ fontSize: 13, color: t.textSub, fontFamily: "'Poppins',sans-serif", marginBottom: 16 }}>
//                 Drag & drop document here
//               </p>
//               <label style={{
//                 display: "inline-flex", alignItems: "center", gap: 8,
//                 padding: "10px 20px", borderRadius: 12,
//                 background: "#2563eb", color: "#fff",
//                 fontSize: 13, fontWeight: 700,
//                 fontFamily: "'Poppins',sans-serif", cursor: "pointer",
//               }}>
//                 Browse File
//                 <input type="file" hidden accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={(e) => validateAndSetFile(e.target.files[0])} />
//               </label>
//             </>
//           ) : (
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
//               <CheckCircle size={36} color="#34d399" />
//               <p style={{ fontSize: 13, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{file.name}</p>
//             </div>
//           )}
//         </div>

//         {/* INPUTS */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginBottom: 24 }}>
//           <div>
//             <FieldLabel t={t}>Title</FieldLabel>
//             <ThemedInput t={t} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document title" />
//           </div>
//           <div>
//             <FieldLabel t={t}>Select Batch</FieldLabel>
//             <ThemedSelect t={t} value={batchId} onChange={(e) => setBatchId(e.target.value)}>
//               <option value="">Select Batch</option>
//               {batches.map((b) => (
//                 <option key={b.id} value={b.id}>{b.name || "Batch"} (ID: {b.id})</option>
//               ))}
//             </ThemedSelect>
//           </div>
//           <div style={{ gridColumn: "1 / -1" }}>
//             <FieldLabel t={t}>Description</FieldLabel>
//             <ThemedTextarea t={t} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
//           </div>
//         </div>

//         <PrimaryButton
//           color="#34d399"
//           onClick={handleUpload}
//           disabled={!file || loading}
//           style={{ width: "100%", justifyContent: "center", opacity: (!file || loading) ? 0.6 : 1 }}
//         >
//           {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : "Upload File"}
//         </PrimaryButton>

//         {message && (
//           <p style={{
//             marginTop: 12, fontSize: 13, fontFamily: "'Poppins',sans-serif",
//             color: messageType === "success" ? t.liveText : "#f87171",
//           }}>{message}</p>
//         )}
//       </ThemedCard>

//       {/* UPLOADED FILES */}
//       {files.length > 0 && (
//         <ThemedCard t={t}>
//           <CardHeader t={t} icon={Folder} color="#2563eb" title="Uploaded Documents" right={<Pill t={t}>{files.length} files</Pill>} />
//           <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//             {files.map((fileItem) => (
//               <div key={fileItem.id} style={{
//                 display: "flex", alignItems: "center", justifyContent: "space-between",
//                 padding: "12px 16px", borderRadius: 14,
//                 background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`,
//                 gap: 12, flexWrap: "wrap",
//               }}>
//                 <div>
//                   <p style={{ fontSize: 13, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
//                     {fileItem.title || fileItem.fileName || "No Title"}
//                   </p>
//                   <p style={{ fontSize: 11, color: t.textMuted, margin: "3px 0 0", fontFamily: "'Poppins',sans-serif" }}>
//                     {fileItem.description || "No Description"}
//                   </p>
//                   <p style={{ fontSize: 10, color: "#2563eb", margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>
//                     Batch ID: {fileItem.batchId || "N/A"}
//                   </p>
//                 </div>
//                 <div style={{ display: "flex", gap: 8 }}>
//                   {[
//                     { icon: Eye, label: "Preview", color: "#2563eb", onClick: () => handlePreview(fileItem) },
//                     {
//                       icon: Download, label: "Download", color: "#34d399",
//                       onClick: () => {
//                         const link = document.createElement("a");
//                         link.href = fileItem.fileUrl;
//                         link.download = fileItem.fileName || "document";
//                         link.click();
//                       }
//                     },
//                     { icon: Trash2, label: "Delete", color: "#f87171", onClick: () => handleDelete(fileItem.id) },
//                   ].map(({ icon: Icon, color, onClick }) => (
//                     <button key={color} onClick={onClick} style={{
//                       width: 34, height: 34, borderRadius: 10,
//                       display: "flex", alignItems: "center", justifyContent: "center",
//                       background: `${color}18`, border: `1px solid ${color}30`,
//                       cursor: "pointer", transition: "all 0.2s",
//                     }}>
//                       <Icon size={14} color={color} />
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </ThemedCard>
//       )}
//     </PageShell>
//   );
// };

// export default UploadDocuments;
















// src/trainer/UploadDocuments.jsx
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Eye, Folder, Loader2, Sparkles, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import fileService from "../services/fileService";
import videoService from "../services/videoService";
import {
  useTrainerTheme, PageShell, PageHero, ThemedCard, CardHeader,
  ThemedInput, ThemedTextarea, ThemedSelect, FieldLabel,
  PrimaryButton, EmptyState, Pill,
} from "./trainerTheme";

/* ─────────────────── HELPER ─────────────────── */
const extractTitle = (fileName) =>
  fileName
    .replace(/\.[^/.]+$/, "")                      // remove extension
    .replace(/[_-]/g, " ")                          // _ and - → space
    .replace(/\b\w/g, (c) => c.toUpperCase());      // capitalize each word

const UploadDocuments = () => {
  const { t, isDark } = useTrainerTheme();

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
      setFiles(res.data || []);
    } catch (err) { console.error(err); }
  };

  const loadBatches = async () => {
    try {
      const res = await videoService.getTrainerBatches();
      setBatches(res.data || []);
    } catch (err) { console.error("Failed to load batches", err); }
  };

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  /* ── Validate + set file + AUTO FILL TITLE ── */
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
    setTitle(extractTitle(selectedFile.name));    // ← AUTO FILL TITLE
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
      setFile(null); setTitle(""); setDescription(""); setBatchId("");
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
      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      alert("Preview failed");
    }
  };

  return (
    <PageShell t={t}>
      {/* HERO */}
      <PageHero
        t={t} isDark={isDark}
        icon={Folder}
        badge="Content Management"
        title="Document Studio"
        subtitle="Upload training PDFs with details"
        color="#2563eb"
      />

      {/* UPLOAD CARD */}
      <ThemedCard t={t} style={{ marginBottom: 20 }}>
        <CardHeader t={t} icon={Sparkles} color="#2563eb" title="Upload Document" />

        {/* DROP ZONE */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          style={{
            borderRadius: 16,
            border: `2px dashed ${isDragging ? "#2563eb" : t.inputBorder}`,
            padding: "40px 24px",
            textAlign: "center",
            background: isDragging ? "rgba(37,99,235,0.04)" : t.inputBg,
            marginBottom: 24,
            transition: "all 0.2s",
          }}
        >
          {!file ? (
            <>
              <UploadCloud size={40} color="#2563eb" style={{ display: "block", margin: "0 auto 12px" }} />
              <p style={{ fontSize: 13, color: t.textSub, fontFamily: "'Poppins',sans-serif", marginBottom: 16 }}>
                Drag & drop document here
              </p>
              <label style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 20px", borderRadius: 12,
                background: "#2563eb", color: "#fff",
                fontSize: 13, fontWeight: 700,
                fontFamily: "'Poppins',sans-serif", cursor: "pointer",
              }}>
                Browse File
                {/* ── onChange now calls validateAndSetFile (which auto-fills title) ── */}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => validateAndSetFile(e.target.files[0])}
                />
              </label>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <CheckCircle size={36} color="#34d399" />
              <p style={{ fontSize: 13, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{file.name}</p>
            </div>
          )}
        </div>

        {/* INPUTS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginBottom: 24 }}>
          <div>
            <FieldLabel t={t}>Title</FieldLabel>
            {/* value is auto-filled but still manually editable */}
            <ThemedInput
              t={t}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title"
            />
          </div>
          <div>
            <FieldLabel t={t}>Select Batch</FieldLabel>
            <ThemedSelect t={t} value={batchId} onChange={(e) => setBatchId(e.target.value)}>
              <option value="">Select Batch</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>{b.name || "Batch"} (ID: {b.id})</option>
              ))}
            </ThemedSelect>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <FieldLabel t={t}>Description</FieldLabel>
            <ThemedTextarea t={t} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          </div>
        </div>

        <PrimaryButton
          color="#34d399"
          onClick={handleUpload}
          disabled={!file || loading}
          style={{ width: "100%", justifyContent: "center", opacity: (!file || loading) ? 0.6 : 1 }}
        >
          {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : "Upload File"}
        </PrimaryButton>

        {message && (
          <p style={{
            marginTop: 12, fontSize: 13, fontFamily: "'Poppins',sans-serif",
            color: messageType === "success" ? t.liveText : "#f87171",
          }}>{message}</p>
        )}
      </ThemedCard>

      {/* UPLOADED FILES */}
      {files.length > 0 && (
        <ThemedCard t={t}>
          <CardHeader t={t} icon={Folder} color="#2563eb" title="Uploaded Documents" right={<Pill t={t}>{files.length} files</Pill>} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {files.map((fileItem) => (
              <div key={fileItem.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px", borderRadius: 14,
                background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`,
                gap: 12, flexWrap: "wrap",
              }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
                    {fileItem.title || fileItem.fileName || "No Title"}
                  </p>
                  <p style={{ fontSize: 11, color: t.textMuted, margin: "3px 0 0", fontFamily: "'Poppins',sans-serif" }}>
                    {fileItem.description || "No Description"}
                  </p>
                  <p style={{ fontSize: 10, color: "#2563eb", margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>
                    Batch ID: {fileItem.batchId || "N/A"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    { icon: Eye, label: "Preview", color: "#2563eb", onClick: () => handlePreview(fileItem) },
                    {
                      icon: Download, label: "Download", color: "#34d399",
                      onClick: () => {
                        const link = document.createElement("a");
                        link.href = fileItem.fileUrl;
                        link.download = fileItem.fileName || "document";
                        link.click();
                      }
                    },
                    { icon: Trash2, label: "Delete", color: "#f87171", onClick: () => handleDelete(fileItem.id) },
                  ].map(({ icon: Icon, color, onClick }) => (
                    <button key={color} onClick={onClick} style={{
                      width: 34, height: 34, borderRadius: 10,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: `${color}18`, border: `1px solid ${color}30`,
                      cursor: "pointer", transition: "all 0.2s",
                    }}>
                      <Icon size={14} color={color} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ThemedCard>
      )}
    </PageShell>
  );
};

export default UploadDocuments;