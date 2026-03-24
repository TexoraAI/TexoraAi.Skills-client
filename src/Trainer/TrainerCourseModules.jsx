// import axios from "axios";
// import { FileText, Plus, Trash2, Video } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";


// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const API = import.meta.env.VITE_API_BASE_URL ||"http://localhost:9000/api";

// const authHeader = () => ({
//   Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
// });

// export default function TrainerCourseModules() {
//   const { courseId } = useParams();

//   const [modules, setModules] = useState([]);
//   const [title, setTitle] = useState("");
//   const [file, setFile] = useState(null);
//   const [type, setType] = useState("VIDEO");
//   const [loading, setLoading] = useState(false);

//   // VIDEO LIBRARY
//   const [videoLibrary, setVideoLibrary] = useState([]);
//   const [useLibrary, setUseLibrary] = useState(false);
//   const [selectedVideo, setSelectedVideo] = useState(null);

//   // PDF LIBRARY
//   const [pdfLibrary, setPdfLibrary] = useState([]);
//   const [selectedPdf, setSelectedPdf] = useState(null);

//   useEffect(() => {
//     loadModules();
//     loadVideoLibrary();
//     loadPdfLibrary();
//   }, [courseId]);

//   const loadModules = async () => {
//     const res = await axios.get(`${API}/content/course/${courseId}`, {
//       headers: authHeader(),
//     });
//     setModules(res.data);
//   };

//   const loadVideoLibrary = async () => {
//     const res = await axios.get(`${API}/video`, {
//       headers: authHeader(),
//     });
//     setVideoLibrary(res.data);
//   };

//   const loadPdfLibrary = async () => {
//     const res = await axios.get(`${API}/files`, {
//       headers: {
//         ...authHeader(),
//         "X-ROLE": JSON.parse(localStorage.getItem("lms_user"))?.role,
//       },
//     });
//     setPdfLibrary(res.data?.content || []);
//   };

//   const uploadAsset = async () => {
//     if (!title) return alert("Title required");

//     try {
//       setLoading(true);
//       let fileName = null;
//       if (type === "VIDEO") {
//         if (useLibrary) {
//           if (!selectedVideo?.storedFileName) return alert("Select video");
//           fileName = selectedVideo.storedFileName;
//         } else {
//           if (!file) return alert("Video required");

//           const formData = new FormData();
//           formData.append("file", file);
//           formData.append("courseId", courseId);
//           formData.append("moduleId", 0);
//           formData.append("batchId", 0);

//           const uploadRes = await axios.post(
//             `${API}/course-videos/upload`,
//             formData,
//             {
//               headers: {
//                 ...authHeader(),
//                 "Content-Type": "multipart/form-data",
//               },
//             },
//           );

//           fileName = uploadRes.data?.url;
//         }
//       }

//       if (type === "PDF") {
//         if (useLibrary) {
//           if (!selectedPdf?.storedName) return alert("Select PDF");
//           fileName = selectedPdf.storedName;
//         } else {
//           if (!file) return alert("PDF required");

//           const formData = new FormData();
//           formData.append("file", file);
//           formData.append("courseId", courseId);
//           formData.append("moduleId", 0); // same as video
//           formData.append("batchId", 0); // same as video

//           const uploadRes = await axios.post(
//             `${API}/course-files/upload`, // 🔥 changed endpoint
//             formData,
//             {
//               headers: {
//                 ...authHeader(),
//                 "Content-Type": "multipart/form-data",
//               },
//             },
//           );

//           fileName = uploadRes.data?.url; // same pattern as video
//         }
//       }

//       await axios.post(
//         `${API}/content`,
//         {
//           courseId,
//           title,
//           contentType: type,
//           url: fileName,
//           orderIndex: modules.length + 1,
//         },
//         { headers: authHeader() },
//       );

//       setTitle("");
//       setFile(null);
//       setSelectedVideo(null);
//       setSelectedPdf(null);
//       setUseLibrary(false);

//       loadModules();
//     } catch (err) {
//       console.error(err);
//       alert("Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteModule = async (id) => {
//     if (!window.confirm("Delete this module?")) return;
//     await axios.delete(`${API}/api/content/${id}`, {
//       headers: authHeader(),
//     });
//     loadModules();
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
//       <div>
//         <p className="text-xs font-semibold text-muted-foreground uppercase">
//           Course
//         </p>
//         <h1 className="text-2xl font-semibold text-foreground">
//           Course Modules
//         </h1>
//       </div>

//       {/* ADD MODULE */}
//       <Card className="p-6 space-y-4">
//         <Input
//           placeholder="Lesson title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         <Select value={type} onValueChange={setType}>
//           <SelectTrigger>
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="VIDEO">Video</SelectItem>
//             <SelectItem value="PDF">PDF</SelectItem>
//           </SelectContent>
//         </Select>

//         <div className="flex gap-6 text-sm text-muted-foreground">
//           <label className="flex gap-2 items-center">
//             <input
//               type="radio"
//               checked={!useLibrary}
//               onChange={() => setUseLibrary(false)}
//             />
//             Upload New
//           </label>

//           <label className="flex gap-2 items-center">
//             <input
//               type="radio"
//               checked={useLibrary}
//               onChange={() => setUseLibrary(true)}
//             />
//             Select from Library
//           </label>
//         </div>

//         {type === "VIDEO" && useLibrary && (
//           <Select
//             onValueChange={(id) =>
//               setSelectedVideo(videoLibrary.find((v) => v.id === Number(id)))
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select video" />
//             </SelectTrigger>
//             <SelectContent>
//               {videoLibrary.map((v) => (
//                 <SelectItem key={v.id} value={String(v.id)}>
//                   {v.originalFileName}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         )}

//         {type === "PDF" && useLibrary && (
//           <Select
//             onValueChange={(id) =>
//               setSelectedPdf(pdfLibrary.find((p) => p.id === Number(id)))
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select PDF" />
//             </SelectTrigger>
//             <SelectContent>
//               {pdfLibrary.map((p) => (
//                 <SelectItem key={p.id} value={String(p.id)}>
//                   {p.originalName}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         )}

//         {!useLibrary && (
//           <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//         )}

//         <Button onClick={uploadAsset} disabled={loading}>
//           <Plus className="w-4 h-4 mr-2" />
//           {loading ? "Saving..." : "Add Module"}
//         </Button>
//       </Card>

//       {/* MODULE LIST */}
//       <div className="space-y-3">
//         {modules.map((m) => (
//           <Card key={m.id} className="p-4 flex justify-between items-center">
//             <div className="flex items-center gap-3">
//               {m.contentType === "VIDEO" ? <Video /> : <FileText />}
//               <div>
//                 <p className="font-semibold text-foreground">{m.title}</p>
//                 <p className="text-xs text-muted-foreground">{m.url}</p>
//               </div>
//             </div>

//             <Button
//               variant="destructive"
//               size="icon"
//               onClick={() => deleteModule(m.id)}
//             >
//               <Trash2 className="w-4 h-4" />
//             </Button>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }



















import axios from "axios";
import {
  FileText, Plus, Trash2, Video,
  BookOpen, ChevronLeft, ChevronRight,
  Upload, Library, List
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});

export default function TrainerCourseModules() {
  const { courseId } = useParams();

  const [modules, setModules] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("VIDEO");
  const [loading, setLoading] = useState(false);

  // VIDEO LIBRARY
  const [videoLibrary, setVideoLibrary] = useState([]);
  const [useLibrary, setUseLibrary] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // PDF LIBRARY
  const [pdfLibrary, setPdfLibrary] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  /* ================= PANEL STATE ================= */
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightWidth, setRightWidth] = useState(300);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  const onMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);
  const onMouseMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const fromRight = rect.right - e.clientX;
    if (fromRight > 220 && fromRight < 520) setRightWidth(fromRight);
  }, []);
  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  /* ================= DATA ================= */
  useEffect(() => {
    loadModules();
    loadVideoLibrary();
    loadPdfLibrary();
  }, [courseId]);

  const loadModules = async () => {
    const res = await axios.get(`${API}/content/course/${courseId}`, { headers: authHeader() });
    setModules(res.data);
  };

  const loadVideoLibrary = async () => {
    const res = await axios.get(`${API}/video`, { headers: authHeader() });
    setVideoLibrary(res.data);
  };

  const loadPdfLibrary = async () => {
    const res = await axios.get(`${API}/files`, {
      headers: {
        ...authHeader(),
        "X-ROLE": JSON.parse(localStorage.getItem("lms_user"))?.role,
      },
    });
    setPdfLibrary(res.data?.content || []);
  };

  const uploadAsset = async () => {
    if (!title) return alert("Title required");
    try {
      setLoading(true);
      let fileName = null;

      if (type === "VIDEO") {
        if (useLibrary) {
          if (!selectedVideo?.storedFileName) return alert("Select video");
          fileName = selectedVideo.storedFileName;
        } else {
          if (!file) return alert("Video required");
          const formData = new FormData();
          formData.append("file", file);
          formData.append("courseId", courseId);
          formData.append("moduleId", 0);
          formData.append("batchId", 0);
          const uploadRes = await axios.post(`${API}/course-videos/upload`, formData, {
            headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
          });
          fileName = uploadRes.data?.url;
        }
      }

      if (type === "PDF") {
        if (useLibrary) {
          if (!selectedPdf?.storedName) return alert("Select PDF");
          fileName = selectedPdf.storedName;
        } else {
          if (!file) return alert("PDF required");
          const formData = new FormData();
          formData.append("file", file);
          formData.append("courseId", courseId);
          formData.append("moduleId", 0);
          formData.append("batchId", 0);
          const uploadRes = await axios.post(`${API}/course-files/upload`, formData, {
            headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
          });
          fileName = uploadRes.data?.url;
        }
      }

      await axios.post(`${API}/content`, {
        courseId, title, contentType: type,
        url: fileName, orderIndex: modules.length + 1,
      }, { headers: authHeader() });

      setTitle(""); setFile(null);
      setSelectedVideo(null); setSelectedPdf(null);
      setUseLibrary(false);
      loadModules();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteModule = async (id) => {
    if (!window.confirm("Delete this module?")) return;
    await axios.delete(`${API}/api/content/${id}`, { headers: authHeader() });
    loadModules();
  };

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1b38] flex flex-col">

      {/* ===== PAGE TITLE ===== */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-lg" style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}>
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Course
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Course Modules</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Add and manage video/PDF lessons for this course
        </p>
      </div>

      {/* ===== STAT ROW ===== */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: <List size={18} />,      value: modules.length,                                    label: "Total Modules",  style: "linear-gradient(135deg,#1e3a8a,#2563eb)" },
            { icon: <Video size={18} />,     value: modules.filter(m => m.contentType === "VIDEO").length, label: "Videos",     style: "linear-gradient(135deg,#0369a1,#0ea5e9)" },
            { icon: <FileText size={18} />,  value: modules.filter(m => m.contentType === "PDF").length,   label: "PDFs",       style: "linear-gradient(135deg,#92400e,#d97706)" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl px-5 py-4 flex flex-col gap-1 text-white shadow-md"
              style={{ background: s.style }}>
              <span className="text-white/70">{s.icon}</span>
              <span className="text-2xl font-extrabold">{s.value}</span>
              <span className="text-xs text-white/65 uppercase tracking-widest font-semibold">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 3-PANEL BODY ===== */}
      <div
        ref={containerRef}
        className="flex flex-1 mx-6 mb-6 overflow-hidden rounded-2xl
                   border border-slate-200 dark:border-white/10
                   bg-white dark:bg-[#162040] shadow-sm"
        style={{ height: "calc(100vh - 270px)", minHeight: "420px" }}
      >

        {/* ======== PANEL 1: Type / Source (collapsible) ======== */}
        <div
          className="flex-shrink-0 flex flex-col border-r border-slate-100 dark:border-white/10 transition-all duration-300 overflow-hidden"
          style={{ width: leftCollapsed ? "0px" : "200px" }}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-white/10">
            <Library className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
            <span className="text-sm font-bold text-slate-700 dark:text-white whitespace-nowrap">Options</span>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">

            {/* Content Type */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                Content Type
              </p>
              <div className="space-y-1">
                {["VIDEO", "PDF"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition font-medium flex items-center gap-2
                      ${type === t
                        ? "text-white"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                      }`}
                    style={type === t ? { background: "linear-gradient(135deg,#1e3a8a,#2563eb)" } : {}}
                  >
                    {t === "VIDEO" ? <Video className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                    {t === "VIDEO" ? "Video" : "PDF"}
                  </button>
                ))}
              </div>
            </div>

            {/* Source */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                Source
              </p>
              <div className="space-y-1">
                {[
                  { label: "Upload New",         icon: <Upload className="w-3.5 h-3.5" />,  val: false },
                  { label: "From Library",        icon: <Library className="w-3.5 h-3.5" />, val: true  },
                ].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setUseLibrary(s.val)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition font-medium flex items-center gap-2
                      ${useLibrary === s.val
                        ? "text-white"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                      }`}
                    style={useLibrary === s.val ? { background: "linear-gradient(135deg,#0369a1,#0ea5e9)" } : {}}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Left collapse handle */}
        <div
          onClick={() => setLeftCollapsed(!leftCollapsed)}
          className="relative flex-shrink-0 w-3 flex items-center justify-center
                     cursor-pointer group z-10
                     bg-slate-100 dark:bg-white/5
                     border-r border-slate-200 dark:border-white/10
                     hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
        >
          <div className="absolute flex items-center gap-0.5 px-1.5 py-2 rounded-lg
                          bg-white dark:bg-[#1e3a5f]
                          border border-slate-300 dark:border-white/20
                          shadow group-hover:border-blue-400 dark:group-hover:border-blue-600
                          transition select-none">
            {leftCollapsed
              ? <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500" />
              : <>
                  <svg width="5" height="10" viewBox="0 0 6 12" fill="none" className="text-slate-400 group-hover:text-blue-500">
                    <path d="M1 1L0 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <div className="w-px h-3 bg-slate-300 dark:bg-slate-500 group-hover:bg-blue-400 transition mx-0.5" />
                  <svg width="5" height="10" viewBox="0 0 6 12" fill="none" className="text-slate-400 group-hover:text-blue-500">
                    <path d="M5 1L6 6L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </>
            }
          </div>
        </div>

        {/* ======== PANEL 2: Module List ======== */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 dark:border-white/10">
            <List className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="text-sm font-bold text-slate-700 dark:text-white tracking-wide">
              Modules ({modules.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {modules.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                <BookOpen className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                <p className="text-sm text-slate-400 dark:text-slate-500">No modules yet. Add your first lesson!</p>
              </div>
            )}

            {modules.map((m, idx) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl
                           border border-slate-100 dark:border-white/8
                           bg-slate-50 dark:bg-white/3
                           hover:border-blue-200 dark:hover:border-blue-700/40
                           hover:bg-blue-50/50 dark:hover:bg-white/5 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Order badge */}
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)" }}>
                    {idx + 1}
                  </span>

                  {/* Type icon */}
                  <div className={`flex-shrink-0 p-1.5 rounded-lg border
                    ${m.contentType === "VIDEO"
                      ? "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700/30"
                      : "bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-700/30"
                    }`}>
                    {m.contentType === "VIDEO"
                      ? <Video className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      : <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    }
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {m.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{m.url}</p>
                  </div>
                </div>

                <button
                  onClick={() => deleteModule(m.id)}
                  className="flex-shrink-0 p-1.5 rounded-lg
                             text-slate-300 dark:text-slate-600
                             hover:bg-red-50 dark:hover:bg-red-900/20
                             hover:text-red-500 dark:hover:text-red-400
                             border border-transparent
                             hover:border-red-200 dark:hover:border-red-800/40
                             transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ======== DRAG HANDLE between panel 2 & 3 ======== */}
        <div
          onMouseDown={onMouseDown}
          className="relative flex-shrink-0 w-3 flex items-center justify-center
                     cursor-col-resize group z-10
                     bg-slate-100 dark:bg-white/5
                     border-x border-slate-200 dark:border-white/10
                     hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
        >
          <div className="absolute flex items-center gap-0.5 px-1.5 py-2 rounded-lg
                          bg-white dark:bg-[#1e3a5f]
                          border border-slate-300 dark:border-white/20
                          shadow group-hover:border-blue-400 dark:group-hover:border-blue-600
                          transition select-none">
            <svg width="5" height="10" viewBox="0 0 6 12" fill="none"
              className="text-slate-400 dark:text-slate-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
              <path d="M1 1L0 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div className="w-px h-3 bg-slate-300 dark:bg-slate-500 group-hover:bg-blue-400 transition mx-0.5" />
            <svg width="5" height="10" viewBox="0 0 6 12" fill="none"
              className="text-slate-400 dark:text-slate-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
              <path d="M5 1L6 6L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* ======== PANEL 3: Add Module Form ======== */}
        <div
          className="flex-shrink-0 flex flex-col border-l border-slate-100 dark:border-white/10"
          style={{ width: `${rightWidth}px` }}
        >
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 dark:border-white/10">
            <div className="p-1.5 rounded-lg" style={{ background: "linear-gradient(135deg,#166534,#16a34a)" }}>
              <Plus className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-white tracking-wide">Add Module</span>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

            {/* Lesson Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Lesson Title <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="e.g., Introduction to React"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm
                           bg-slate-50 dark:bg-white/5
                           border border-slate-200 dark:border-white/10
                           text-slate-800 dark:text-slate-100
                           placeholder-slate-400 dark:placeholder-slate-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
              />
            </div>

            {/* Content Type (mirrored from panel 1, for context) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Content Type
              </label>
              <div className="flex gap-2">
                {["VIDEO", "PDF"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition
                      ${type === t
                        ? "text-white border-transparent"
                        : "text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-blue-300"
                      }`}
                    style={type === t ? { background: "linear-gradient(135deg,#1e3a8a,#2563eb)" } : {}}
                  >
                    {t === "VIDEO" ? <Video className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                    {t === "VIDEO" ? "Video" : "PDF"}
                  </button>
                ))}
              </div>
            </div>

            {/* Source Toggle */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Source
              </label>
              <div className="flex gap-2">
                {[
                  { label: "Upload New", icon: <Upload className="w-3.5 h-3.5" />, val: false },
                  { label: "Library",   icon: <Library className="w-3.5 h-3.5" />, val: true },
                ].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setUseLibrary(s.val)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition
                      ${useLibrary === s.val
                        ? "text-white border-transparent"
                        : "text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-blue-300"
                      }`}
                    style={useLibrary === s.val ? { background: "linear-gradient(135deg,#0369a1,#0ea5e9)" } : {}}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Video library select */}
            {type === "VIDEO" && useLibrary && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Select Video
                </label>
                <Select onValueChange={(id) => setSelectedVideo(videoLibrary.find((v) => v.id === Number(id)))}>
                  <SelectTrigger className="rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100">
                    <SelectValue placeholder="Choose from library" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#162040] border-slate-200 dark:border-white/10">
                    {videoLibrary.map((v) => (
                      <SelectItem key={v.id} value={String(v.id)}>{v.originalFileName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* PDF library select */}
            {type === "PDF" && useLibrary && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Select PDF
                </label>
                <Select onValueChange={(id) => setSelectedPdf(pdfLibrary.find((p) => p.id === Number(id)))}>
                  <SelectTrigger className="rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100">
                    <SelectValue placeholder="Choose from library" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#162040] border-slate-200 dark:border-white/10">
                    {pdfLibrary.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.originalName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* File upload */}
            {!useLibrary && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Upload File <span className="text-red-500">*</span>
                </label>
                <label className="flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl
                                  border-2 border-dashed border-slate-200 dark:border-white/15
                                  bg-slate-50 dark:bg-white/3
                                  hover:border-blue-400 dark:hover:border-blue-600
                                  hover:bg-blue-50/50 dark:hover:bg-blue-900/10
                                  cursor-pointer transition">
                  <Upload className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    {file ? file.name : `Click to upload ${type === "VIDEO" ? "video" : "PDF"}`}
                  </span>
                  <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                </label>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={uploadAsset}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2
                         px-4 py-2.5 rounded-xl text-sm font-semibold text-white
                         shadow-md transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg,#166534,#16a34a)" }}
            >
              <Plus className="w-4 h-4" />
              {loading ? "Saving..." : "Add Module"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}