// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { uploadRecording } from "@/services/liveSessionService";
// import { ArrowLeft, UploadCloud, X, Video, Sparkles } from "lucide-react";

// /* ─── theme tokens ─── */
// const T = {
//   dark: {
//     pageBg: "#0a0a0a", cardBg: "#111111", heroBg: "#141414",
//     border: "rgba(255,255,255,0.06)", borderHero: "rgba(255,255,255,0.07)",
//     text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
//     labelColor: "rgba(255,255,255,0.4)", inputBg: "#1a1a1a",
//     inputBorder: "rgba(255,255,255,0.08)", inputText: "#ffffff",
//     shadow: "0 4px 20px rgba(0,0,0,0.4)", gridLine: "rgba(255,255,255,0.5)",
//     barBg: "rgba(255,255,255,0.05)", dropBg: "rgba(255,255,255,0.02)",
//     dropBorder: "rgba(255,255,255,0.07)",
//   },
//   light: {
//     pageBg: "#f1f5f9", cardBg: "#ffffff", heroBg: "#ffffff",
//     border: "#e2e8f0", borderHero: "#e2e8f0",
//     text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
//     labelColor: "#64748b", inputBg: "#f8fafc",
//     inputBorder: "#e2e8f0", inputText: "#0f172a",
//     shadow: "0 1px 8px rgba(0,0,0,0.07)", gridLine: "rgba(0,0,0,0.12)",
//     barBg: "#f1f5f9", dropBg: "#f8fafc", dropBorder: "#e2e8f0",
//   },
// };

// const UploadRecordedVideo = () => {
//   const navigate = useNavigate();
//   const fileRef = useRef(null);

//   const [isDark, setIsDark] = useState(
//     () => typeof document !== "undefined" && (document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark")
//   );
//   useEffect(() => {
//     const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark"));
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
//     return () => obs.disconnect();
//   }, []);
//   const t = isDark ? T.dark : T.light;

//   const [file, setFile] = useState(null);
//   const [batches, setBatches] = useState([]);
//   const [loadingBatches, setLoadingBatches] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [dragOver, setDragOver] = useState(false);
//   const [form, setForm] = useState({ lectureTitle: "", shortDescription: "", batchId: "", batchName: "" });

//   const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

//   useEffect(() => {
//     const fetchBatches = async () => {
//       try {
//         const res = await fetch("/api/batches");
//         const data = await res.json();
//         setBatches(data);
//       } catch (err) {
//         console.error("Batch fetch failed:", err);
//       } finally {
//         setLoadingBatches(false);
//       }
//     };
//     fetchBatches();
//   }, []);

//   const handleBatchChange = (value) => {
//     const selected = batches.find((b) => b.id === value);
//     setForm((prev) => ({ ...prev, batchId: value, batchName: selected?.batchName || "" }));
//   };

//   const handleUpload = async () => {
//     if (!form.lectureTitle || !form.batchId) { alert("Lecture Title and Batch are required"); return; }
//     try {
//       setUploading(true);
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("title", form.lectureTitle);
//       formData.append("description", form.shortDescription);
//       formData.append("batchId", form.batchId);
//       await uploadRecording(formData);
//       alert("Video uploaded successfully");
//       navigate("/trainer/recorded-list");
//     } catch (error) {
//       console.error("Upload failed:", error);
//       alert("Upload failed. Please try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragOver(false);
//     const dropped = e.dataTransfer.files[0];
//     if (dropped && dropped.type.startsWith("video/")) setFile(dropped);
//   };

//   const inputStyle = {
//     width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 10,
//     border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText,
//     fontSize: 12, fontFamily: "'Poppins',sans-serif", fontWeight: 500, outline: "none",
//     transition: "border 0.2s",
//   };
//   const labelStyle = { fontSize: 11, fontWeight: 600, color: t.labelColor, fontFamily: "'Poppins',sans-serif", letterSpacing: "0.04em", marginBottom: 6, display: "block" };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
//         @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
//         .dfade{animation:fadeUp 0.45s ease both}
//         @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
//         @keyframes uploadFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
//         select option{background:${t.inputBg};color:${t.inputText}}
//       `}</style>

//       <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s" }}>
//       <div style={{
//   position: "relative",
//   zIndex: 1,
//   padding: "24px 40px",   // better spacing
//   width: "100%",
//   maxWidth: "100%",
//   margin: 0,
//   paddingBottom: 52
// }}>

//           {/* ═══ HERO ═══ */}
//           <div className="dfade" style={{ borderRadius: 24, padding: "30px 36px", background: t.heroBg, border: `1px solid ${t.borderHero}`, position: "relative", overflow: "hidden", marginBottom: 20, boxShadow: t.shadow }}>
//             <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: isDark ? 0.04 : 0.025, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
//             <div style={{ position: "absolute", top: "-30%", left: "40%", width: 300, height: 200, background: "radial-gradient(ellipse,rgba(34,211,238,0.06),transparent 70%)", pointerEvents: "none" }} />

//             <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16 }}>
//               <button onClick={() => navigate("/trainer")} style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${t.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textMuted, flexShrink: 0 }}>
//                 <ArrowLeft size={16} />
//               </button>
//               <div>
//                 <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
//                   <Sparkles size={11} color={t.textSub} />
//                   <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>Content</span>
//                 </div>
//                 <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.4rem,3vw,2rem)", color: t.text, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 10 }}>
//                   <UploadCloud size={22} color="#2dd4bf" /> Upload Recorded Video
//                 </h1>
//               </div>
//             </div>
//           </div>

//           {!file ? (
//             /* ═══ DROP ZONE ═══ */
//             <div
//               className="dfade"
//               onClick={() => fileRef.current.click()}
//               onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//               onDragLeave={() => setDragOver(false)}
//               onDrop={handleDrop}
//               style={{
//                 borderRadius: 20, border: `2px dashed ${dragOver ? "#2dd4bf" : t.dropBorder}`,
//                 background: dragOver ? (isDark ? "rgba(45,212,191,0.05)" : "rgba(45,212,191,0.04)") : t.dropBg,
//                 padding: "60px 24px", textAlign: "center", cursor: "pointer",
//                 transition: "all 0.2s", boxShadow: t.shadow,
//                 display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
//               }}
//             >
//               <div style={{ animation: "uploadFloat 2.5s ease-in-out infinite" }}>
//                 <div style={{ width: 64, height: 64, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)" }}>
//                   <UploadCloud size={28} color="#2dd4bf" />
//                 </div>
//               </div>
//               <div>
//                 <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: t.text, margin: "0 0 6px" }}>Drop your video here</p>
//                 <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: t.textMuted, margin: 0 }}>MP4, MOV, AVI up to 2GB</p>
//               </div>
//               <button style={{ padding: "9px 22px", borderRadius: 10, border: "1px solid rgba(45,212,191,0.3)", background: "rgba(45,212,191,0.1)", color: "#2dd4bf", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>
//                 Select File
//               </button>
//               <input ref={fileRef} type="file" accept="video/*" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
//             </div>
//           ) : (
//             <>
//               {/* ═══ FILE CARD ═══ */}
//               <div className="dfade" style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: "16px 20px", boxShadow: t.shadow, marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
//                 <div style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)", flexShrink: 0 }}>
//                   <Video size={18} color="#2dd4bf" />
//                 </div>
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <p style={{ fontSize: 12, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
//                   <p style={{ fontSize: 10, color: t.textMuted, margin: "3px 0 0", fontFamily: "'Poppins',sans-serif" }}>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
//                 </div>
//                 <button onClick={() => setFile(null)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textMuted, transition: "all 0.15s" }}>
//                   <X size={14} />
//                 </button>
//               </div>

//               {/* ═══ FORM ═══ */}
//               <div className="dfade" style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 24, boxShadow: t.shadow, marginBottom: 14 }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
//                   <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)" }}>
//                     <Video size={15} color="#2dd4bf" />
//                   </div>
//                   <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Video Details</span>
//                 </div>

//                 <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//                   <div>
//                     <label style={labelStyle}>Lecture Title</label>
//                     <input style={inputStyle} value={form.lectureTitle} onChange={(e) => set("lectureTitle", e.target.value)} placeholder="Enter lecture title..." />
//                   </div>
//                   <div>
//                     <label style={labelStyle}>Short Description</label>
//                     <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} placeholder="Brief description..." />
//                   </div>
//                   <div>
//                     <label style={labelStyle}>Select Batch</label>
//                     <select style={{ ...inputStyle, cursor: "pointer" }} value={form.batchId} onChange={(e) => handleBatchChange(e.target.value)}>
//                       <option value="">{loadingBatches ? "Loading batches..." : "Select a batch..."}</option>
//                       {batches.map((batch) => (
//                         <option key={batch.id} value={batch.id}>{batch.batchName}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* ═══ UPLOAD BUTTON ═══ */}
//               <UploadBtn uploading={uploading} onClick={handleUpload} />
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// function UploadBtn({ uploading, onClick }) {
//   const [hov, setHov] = useState(false);
//   return (
//     <button onClick={onClick} disabled={uploading} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
//       width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
//       background: uploading ? "rgba(45,212,191,0.5)" : hov ? "#14b8a6" : "#2dd4bf",
//       color: uploading ? "rgba(255,255,255,0.7)" : "#0f172a",
//       fontSize: 13, fontWeight: 700, cursor: uploading ? "not-allowed" : "pointer",
//       fontFamily: "'Poppins',sans-serif", letterSpacing: "0.05em",
//       display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//       transition: "all 0.2s", boxShadow: hov && !uploading ? "0 8px 24px rgba(45,212,191,0.35)" : "none",
//     }}>
//       {uploading ? (
//         <><span style={{ width: 14, height: 14, border: "2px solid rgba(15,23,42,0.3)", borderTop: "2px solid rgba(15,23,42,0.8)", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />Uploading...</>
//       ) : (
//         <><UploadCloud size={16} />Upload &amp; Publish</>
//       )}
//     </button>
//   );
// }



// export default UploadRecordedVideo;








































import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadRecording } from "@/services/liveSessionService";
import { getTrainerBatches } from "@/services/batchService";
import {
  ArrowLeft,
  UploadCloud,
  X,
  Video,
  Sparkles,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

const T = {
  dark: {
    pageBg: "#0a0a0a",
    cardBg: "#111111",
    heroBg: "#141414",
    border: "rgba(255,255,255,0.06)",
    borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff",
    textSub: "rgba(255,255,255,0.3)",
    textMuted: "rgba(255,255,255,0.2)",
    labelColor: "rgba(255,255,255,0.4)",
    inputBg: "#1a1a1a",
    inputBorder: "rgba(255,255,255,0.08)",
    inputText: "#ffffff",
    selectBg: "#1a1a1a",
    shadow: "0 4px 20px rgba(0,0,0,0.4)",
    gridLine: "rgba(255,255,255,0.5)",
    dropBg: "rgba(255,255,255,0.02)",
    dropBorder: "rgba(255,255,255,0.07)",
  },
  light: {
    pageBg: "#f1f5f9",
    cardBg: "#ffffff",
    heroBg: "#ffffff",
    border: "#e2e8f0",
    borderHero: "#e2e8f0",
    text: "#0f172a",
    textSub: "#64748b",
    textMuted: "#94a3b8",
    labelColor: "#64748b",
    inputBg: "#f8fafc",
    inputBorder: "#e2e8f0",
    inputText: "#0f172a",
    selectBg: "#f8fafc",
    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    gridLine: "rgba(0,0,0,0.12)",
    dropBg: "#f8fafc",
    dropBorder: "#e2e8f0",
  },
};

/* ─── Unwrap whatever shape the API returns into a plain array ─── */
function unwrapBatches(raw) {
  if (!raw) return [];
  // already an array: [{ id, name }, ...]
  if (Array.isArray(raw)) return raw;
  // axios-style: { data: [...] }
  if (Array.isArray(raw.data)) return raw.data;
  // wrapped: { batches: [...] }
  if (Array.isArray(raw.batches)) return raw.batches;
  // wrapped: { content: [...] }  (Spring Page)
  if (Array.isArray(raw.content)) return raw.content;
  return [];
}

/* ─── Extract a stable string ID from any batch object shape ─── */
function getBatchId(b) {
  return String(b.id ?? b.batchId ?? b.batch_id ?? b.BatchId ?? "");
}

/* ─── Extract a human-readable name from any batch object shape ─── */
function getBatchName(b, id) {
  return b.name ?? b.batchName ?? b.batch_name ?? b.BatchName ?? `Batch ${id}`;
}

const UploadRecordedVideo = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"),
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark",
      ),
    );
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

  const [file, setFile] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState({
    lectureTitle: "",
    shortDescription: "",
    batchId: "",
    batchName: "",
    durationMinutes: "",
  });
  const set = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  // ─── Fetch batches — identical call to StartLiveSession ───────────────────
  useEffect(() => {
    (async () => {
      setLoadingBatches(true);
      try {
        const raw = await getTrainerBatches();

        // 🔍 Log the raw value so you can see the shape in the console
        console.log("[UploadRecordedVideo] raw response →", raw);

        const list = unwrapBatches(raw);
        console.log("[UploadRecordedVideo] unwrapped list →", list);

        setBatches(list);

        // Auto-select the first batch so the dropdown is never blank
        if (list.length > 0) {
          const first = list[0];
          const id = getBatchId(first);
          const name = getBatchName(first, id);
          console.log("[UploadRecordedVideo] auto-selecting →", { id, name });
          setForm((p) => ({ ...p, batchId: id, batchName: name }));
        }
      } catch (err) {
        console.error("[UploadRecordedVideo] batch fetch error →", err);
        setBatches([]);
      } finally {
        setLoadingBatches(false);
      }
    })();
  }, []);

  const handleBatchChange = (value) => {
    const selected = batches.find((b) => getBatchId(b) === String(value));
    setForm((p) => ({
      ...p,
      batchId: String(value),
      batchName: selected ? getBatchName(selected, value) : "",
    }));
  };

  const handleUpload = async () => {
    if (!form.lectureTitle.trim()) {
      setError("Lecture title is required");
      return;
    }
    if (!form.batchId) {
      setError("Please select a batch");
      return;
    }
    if (!file) {
      setError("Please select a video file");
      return;
    }
    setError(null);
    try {
      setUploading(true);
      const user = JSON.parse(localStorage.getItem("lms_user") || "{}");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", form.lectureTitle);
      formData.append("description", form.shortDescription);
      formData.append("batchId", form.batchId);
      formData.append("batchName", form.batchName);
      if (form.durationMinutes)
        formData.append("durationMinutes", form.durationMinutes);
      if (user.id) formData.append("trainerId", user.id);
      await uploadRecording(formData);
      setUploadSuccess(true);
      setTimeout(() => navigate("/trainer/recorded-list"), 1500);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(
        err?.response?.data?.error || "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type.startsWith("video/")) {
      setFile(dropped);
      setError(null);
    }
  };

  const iStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 14px",
    borderRadius: 10,
    border: `1px solid ${t.inputBorder}`,
    background: t.inputBg,
    color: t.inputText,
    fontSize: 12,
    fontFamily: "'Poppins',sans-serif",
    fontWeight: 500,
    outline: "none",
    transition: "border 0.2s",
    appearance: "none",
  };
  const lStyle = {
    fontSize: 10,
    fontWeight: 600,
    color: t.labelColor,
    fontFamily: "'Poppins',sans-serif",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 6,
    display: "block",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp      { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes uploadFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes spin        { to{transform:rotate(360deg)} }
        .dfade { animation: fadeUp 0.45s ease both }
        input[type=date]::-webkit-calendar-picker-indicator,
        input[type=time]::-webkit-calendar-picker-indicator {
          filter: ${isDark ? "invert(1) opacity(0.3)" : "opacity(0.5)"}; cursor: pointer;
        }
        select option { background: ${isDark ? "#1a1a1a" : "#f8fafc"}; color: ${isDark ? "#ffffff" : "#0f172a"}; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: t.pageBg,
          color: t.text,
          fontFamily: "'Poppins',sans-serif",
        }}
      >
        <div
          style={{
            padding: "24px 40px",
            maxWidth: 760,
            margin: "0 auto",
            paddingBottom: 52,
          }}
        >
          {/* ── HERO ── */}
          <div
            className="dfade"
            style={{
              borderRadius: 24,
              padding: "30px 36px",
              background: t.heroBg,
              border: `1px solid ${t.borderHero}`,
              position: "relative",
              overflow: "hidden",
              marginBottom: 20,
              boxShadow: t.shadow,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                opacity: isDark ? 0.04 : 0.025,
                backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <button
                onClick={() => navigate("/trainer/recorded-list")}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  border: `1px solid ${t.border}`,
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: t.textMuted,
                }}
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    marginBottom: 8,
                  }}
                >
                  <Sparkles size={11} color={t.textSub} />
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: t.textSub,
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    Content Studio
                  </span>
                </div>
                <h1
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontWeight: 900,
                    fontSize: "clamp(1.4rem,3vw,2rem)",
                    color: t.text,
                    margin: 0,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <UploadCloud size={22} color="#2dd4bf" /> Upload Recorded
                  Video
                </h1>
              </div>
            </div>
          </div>

          {/* ── SUCCESS ── */}
          {uploadSuccess && (
            <div
              className="dfade"
              style={{
                background: "rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.3)",
                borderRadius: 16,
                padding: "20px 24px",
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <CheckCircle2 size={24} color="#34d399" />
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#34d399",
                    margin: 0,
                    fontFamily: "'Poppins',sans-serif",
                  }}
                >
                  Video uploaded successfully!
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: t.textMuted,
                    margin: "3px 0 0",
                    fontFamily: "'Poppins',sans-serif",
                  }}
                >
                  Redirecting to your video library...
                </p>
              </div>
            </div>
          )}

          {/* ── ERROR ── */}
          {error && (
            <div
              style={{
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.3)",
                borderRadius: 12,
                padding: "12px 16px",
                marginBottom: 14,
                fontSize: 12,
                color: "#f87171",
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* ── DROP ZONE ── */}
          {!file ? (
            <div
              className="dfade"
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                borderRadius: 20,
                border: `2px dashed ${dragOver ? "#2dd4bf" : t.dropBorder}`,
                background: dragOver ? "rgba(45,212,191,0.05)" : t.dropBg,
                padding: "60px 24px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: t.shadow,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{ animation: "uploadFloat 2.5s ease-in-out infinite" }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(45,212,191,0.1)",
                    border: "1px solid rgba(45,212,191,0.2)",
                  }}
                >
                  <UploadCloud size={28} color="#2dd4bf" />
                </div>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    color: t.text,
                    margin: "0 0 6px",
                  }}
                >
                  Drop your video here
                </p>
                <p
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: 11,
                    color: t.textMuted,
                    margin: 0,
                  }}
                >
                  MP4, MOV, AVI — max 500MB
                </p>
              </div>
              <button
                style={{
                  padding: "9px 22px",
                  borderRadius: 10,
                  border: "1px solid rgba(45,212,191,0.3)",
                  background: "rgba(45,212,191,0.1)",
                  color: "#2dd4bf",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                Select File
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="video/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setError(null);
                }}
              />
            </div>
          ) : (
            <>
              {/* ── FILE CARD ── */}
              <div
                className="dfade"
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.border}`,
                  borderRadius: 20,
                  padding: "16px 20px",
                  boxShadow: t.shadow,
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(45,212,191,0.1)",
                    border: "1px solid rgba(45,212,191,0.2)",
                    flexShrink: 0,
                  }}
                >
                  <Video size={18} color="#2dd4bf" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: t.text,
                      margin: 0,
                      fontFamily: "'Poppins',sans-serif",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {file.name}
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: t.textMuted,
                      margin: "3px 0 0",
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    {(file.size / (1024 * 1024)).toFixed(2)} MB · {file.type}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setError(null);
                  }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    border: `1px solid ${t.border}`,
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: t.textMuted,
                  }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* ── FORM ── */}
              <div
                className="dfade"
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.border}`,
                  borderRadius: 20,
                  padding: 24,
                  boxShadow: t.shadow,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(45,212,191,0.1)",
                      border: "1px solid rgba(45,212,191,0.2)",
                    }}
                  >
                    <Video size={15} color="#2dd4bf" />
                  </div>
                  <span
                    style={{
                      fontFamily: "'Poppins',sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      color: t.text,
                    }}
                  >
                    Video Details
                  </span>
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {/* Title */}
                  <div>
                    <label style={lStyle}>Lecture Title *</label>
                    <input
                      style={iStyle}
                      value={form.lectureTitle}
                      onChange={(e) => set("lectureTitle", e.target.value)}
                      placeholder="e.g. React Hooks Deep Dive"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label style={lStyle}>Short Description</label>
                    <textarea
                      style={{ ...iStyle, resize: "vertical", minHeight: 80 }}
                      value={form.shortDescription}
                      onChange={(e) => set("shortDescription", e.target.value)}
                      placeholder="Brief overview for students..."
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label style={lStyle}>Duration (minutes)</label>
                    <input
                      type="number"
                      style={iStyle}
                      value={form.durationMinutes}
                      onChange={(e) => set("durationMinutes", e.target.value)}
                      placeholder="e.g. 60"
                      min="1"
                    />
                  </div>

                  {/* ── BATCH ── */}
                  <div>
                    <label style={lStyle}>Select Batch *</label>

                    {loadingBatches ? (
                      <div
                        style={{
                          ...iStyle,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          color: t.textMuted,
                          cursor: "not-allowed",
                        }}
                      >
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            border: `2px solid ${t.inputBorder}`,
                            borderTop: "2px solid #2dd4bf",
                            borderRadius: "50%",
                            display: "inline-block",
                            animation: "spin 0.8s linear infinite",
                          }}
                        />
                        Loading batches...
                      </div>
                    ) : batches.length === 0 ? (
                      <div
                        style={{
                          ...iStyle,
                          color: "#f87171",
                          cursor: "default",
                        }}
                      >
                        ⚠️ No batches found — check console for API response
                        shape
                      </div>
                    ) : (
                      /* ✅ No placeholder option — renders real batches directly */
                      <div style={{ position: "relative" }}>
                        <select
                          style={{
                            ...iStyle,
                            cursor: "pointer",
                            paddingRight: 36,
                          }}
                          value={form.batchId}
                          onChange={(e) => handleBatchChange(e.target.value)}
                        >
                          {batches.map((b, i) => {
                            const id = getBatchId(b);
                            const name = getBatchName(b, id);
                            return (
                              <option key={i} value={id}>
                                {name}
                              </option>
                            );
                          })}
                        </select>
                        <ChevronDown
                          size={13}
                          color={t.textMuted}
                          style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── UPLOAD BUTTON ── */}
              <UploadBtn
                uploading={uploading}
                success={uploadSuccess}
                onClick={handleUpload}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

function UploadBtn({ uploading, success, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={uploading || success}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        padding: "14px 0",
        borderRadius: 14,
        border: "none",
        background: success
          ? "#34d399"
          : uploading
            ? "rgba(45,212,191,0.5)"
            : hov
              ? "#14b8a6"
              : "#2dd4bf",
        color: uploading ? "rgba(255,255,255,0.7)" : "#0f172a",
        fontSize: 13,
        fontWeight: 700,
        cursor: uploading || success ? "not-allowed" : "pointer",
        fontFamily: "'Poppins',sans-serif",
        letterSpacing: "0.05em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "all 0.2s",
        boxShadow:
          hov && !uploading ? "0 8px 24px rgba(45,212,191,0.35)" : "none",
      }}
    >
      {success ? (
        <>
          <CheckCircle2 size={16} /> Uploaded!
        </>
      ) : uploading ? (
        <>
          <span
            style={{
              width: 14,
              height: 14,
              border: "2px solid rgba(15,23,42,0.3)",
              borderTop: "2px solid rgba(15,23,42,0.8)",
              borderRadius: "50%",
              display: "inline-block",
              animation: "spin 0.8s linear infinite",
            }}
          />
          Uploading...
        </>
      ) : (
        <>
          <UploadCloud size={16} /> Upload &amp; Publish
        </>
      )}
    </button>
  );
}

export default UploadRecordedVideo;

