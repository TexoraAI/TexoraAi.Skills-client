
// import { useEffect, useState } from "react";
// import videoService from "../services/videoService";
// import VideoList from "./VideoList";
// import { UploadCloud, Video, FileText } from "lucide-react";

// const UploadVideos = () => {
//   const [file, setFile] = useState(null);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [batchId, setBatchId] = useState(null); // ⭐ MUST BE NUMBER
//   const [batches, setBatches] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [refreshKey, setRefreshKey] = useState(0);

//   // 🔥 LOAD TRAINER BATCHES
//   useEffect(() => {
//     const loadBatches = async () => {
//       try {
//         const res = await videoService.getTrainerBatches();
//         setBatches(res.data || []);
//       } catch (err) {
//         console.error("Failed to load batches", err);
//       }
//     };
//     loadBatches();
//   }, []);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file || !title.trim() || !batchId) {
//       setMessage("❌ Select video, title & batch");
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");

//       await videoService.uploadVideo(file, title, description, batchId);

//       setMessage("✅ Video uploaded successfully");
//       setRefreshKey((p) => p + 1);

//       setFile(null);
//       setTitle("");
//       setDescription("");
//       setBatchId(null);
//     } catch (e) {
//       setMessage("❌ Upload failed (not assigned to batch)");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* HERO SECTION */}
//       <div className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 p-5 text-white shadow-md">
//         <p className="text-xs font-semibold tracking-widest uppercase text-white/90">
//           Trainer Studio
//         </p>

//         <h1 className="mt-1 text-xl font-semibold">Publish New Lecture</h1>

//         <p className="text-sm text-white/90 max-w-xl">
//           Upload recorded lectures for students.
//         </p>
//       </div>

//       {/* UPLOAD CARD */}
//       <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg p-6 space-y-6">
//         {/* DROP ZONE */}
//         <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 p-10 text-center bg-slate-50 dark:bg-slate-950">
//           <UploadCloud className="mx-auto h-10 w-10 text-indigo-500 mb-3" />
//           <p className="text-sm text-slate-600 dark:text-slate-400">
//             Drag & drop your lecture video here
//           </p>

//           <label className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold cursor-pointer hover:bg-indigo-700 transition">
//             <Video className="w-4 h-4" />
//             Browse Video
//             <input
//               type="file"
//               accept="video/*"
//               hidden
//               onChange={handleFileChange}
//             />
//           </label>

//           {file && (
//             <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-400">
//               Selected: {file.name}
//             </p>
//           )}
//         </div>

//         {/* INPUTS */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           {/* TITLE */}
//           <div>
//             <label className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
//               Lecture Title
//             </label>
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="React State Management – Lecture 1"
//               className="mt-1 w-full rounded-lg border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
//             />
//           </div>

//           {/* DESCRIPTION */}
//           <div>
//             <label className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
//               Short Description
//             </label>
//             <textarea
//               rows={2}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="What students will learn in this lecture"
//               className="mt-1 w-full rounded-lg border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
//             />
//           </div>

//           {/* ⭐ SELECT BATCH DROPDOWN */}
//           <div>
//             <label className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
//               Select Batch
//             </label>

//             <select
//               value={batchId || ""}
//               onChange={(e) => setBatchId(Number(e.target.value))} // ⭐ FIX
//               className="mt-1 w-full rounded-lg border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
//             >
//               <option value="">Select Batch</option>
//               {batches.map((b) => (
//                 <option key={b.id} value={b.id}>
//                   {b.name || "Batch"} (ID: {b.id})
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* ACTION */}
//         <div className="flex items-center justify-between">
//           {message && (
//             <p className="text-sm text-slate-600 dark:text-slate-300">
//               {message}
//             </p>
//           )}

//           <button
//             onClick={handleUpload}
//             disabled={loading}
//             className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
//           >
//             <FileText className="w-4 h-4" />
//             {loading ? "Uploading..." : "Publish Lecture"}
//           </button>
//         </div>
//       </div>

//       {/* VIDEO LIST */}
//       <VideoList refreshKey={refreshKey} trainerMode={true} />
//     </div>
//   );
// };

// export default UploadVideos;












// src/trainer/UploadVideos.jsx
import { useEffect, useState } from "react";
import videoService from "../services/videoService";
import VideoList from "./VideoList";
import { UploadCloud, Video, FileText } from "lucide-react";
import {
  useTrainerTheme, PageShell, PageHero, ThemedCard, CardHeader,
  ThemedInput, ThemedTextarea, ThemedSelect, FieldLabel,
  PrimaryButton, SecondaryButton,
} from "./trainerTheme";

const UploadVideos = () => {
  const { t, isDark } = useTrainerTheme();

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [batchId, setBatchId] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadBatches = async () => {
      try {
        const res = await videoService.getTrainerBatches();
        setBatches(res.data || []);
      } catch (err) {
        console.error("Failed to load batches", err);
      }
    };
    loadBatches();
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file || !title.trim() || !batchId) {
      setMessage("❌ Select video, title & batch");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      await videoService.uploadVideo(file, title, description, batchId);
      setMessage("✅ Video uploaded successfully");
      setRefreshKey((p) => p + 1);
      setFile(null);
      setTitle("");
      setDescription("");
      setBatchId(null);
    } catch (e) {
      setMessage("❌ Upload failed (not assigned to batch)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell t={t}>
      {/* HERO */}
      <PageHero
        t={t} isDark={isDark}
        icon={Video}
        badge="Trainer Studio"
        title="Publish New Lecture"
        subtitle="Upload recorded lectures for students."
        color="#7c3aed"
      />

      {/* UPLOAD CARD */}
      <ThemedCard t={t} style={{ marginBottom: 20 }}>
        <CardHeader t={t} icon={UploadCloud} color="#7c3aed" title="Upload Video" />

        {/* DROP ZONE */}
        <div style={{
          borderRadius: 16,
          border: `2px dashed ${t.inputBorder}`,
          padding: "40px 24px",
          textAlign: "center",
          background: t.inputBg,
          marginBottom: 24,
          transition: "border 0.2s",
        }}>
          <UploadCloud size={40} color="#7c3aed" style={{ display: "block", margin: "0 auto 12px" }} />
          <p style={{ fontSize: 13, color: t.textSub, fontFamily: "'Poppins',sans-serif", marginBottom: 16 }}>
            Drag & drop your lecture video here
          </p>
          <label style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 12,
            background: "#7c3aed", color: "#fff",
            fontSize: 13, fontWeight: 700,
            fontFamily: "'Poppins',sans-serif", cursor: "pointer",
          }}>
            <Video size={14} />
            Browse Video
            <input type="file" accept="video/*" hidden onChange={handleFileChange} />
          </label>
          {file && (
            <p style={{ marginTop: 12, fontSize: 11, color: t.liveText, fontFamily: "'Poppins',sans-serif" }}>
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* INPUTS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginBottom: 24 }}>
          <div>
            <FieldLabel t={t}>Lecture Title</FieldLabel>
            <ThemedInput
              t={t}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="React State Management – Lecture 1"
            />
          </div>
          <div>
            <FieldLabel t={t}>Short Description</FieldLabel>
            <ThemedTextarea
              t={t}
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What students will learn in this lecture"
            />
          </div>
          <div>
            <FieldLabel t={t}>Select Batch</FieldLabel>
            <ThemedSelect
              t={t}
              value={batchId || ""}
              onChange={(e) => setBatchId(Number(e.target.value))}
            >
              <option value="">Select Batch</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name || "Batch"} (ID: {b.id})
                </option>
              ))}
            </ThemedSelect>
          </div>
        </div>

        {/* ACTION */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          {message && (
            <p style={{
              fontSize: 13, fontFamily: "'Poppins',sans-serif",
              color: message.startsWith("✅") ? t.liveText : "#f87171",
            }}>{message}</p>
          )}
          <PrimaryButton
            color="#34d399"
            onClick={handleUpload}
            disabled={loading}
            style={{ marginLeft: "auto", opacity: loading ? 0.6 : 1 }}
          >
            <FileText size={14} />
            {loading ? "Uploading..." : "Publish Lecture"}
          </PrimaryButton>
        </div>
      </ThemedCard>

      {/* VIDEO LIST */}
      <VideoList refreshKey={refreshKey} trainerMode={true} />
    </PageShell>
  );
};

export default UploadVideos;