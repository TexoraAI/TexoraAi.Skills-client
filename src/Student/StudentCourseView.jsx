
// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";

// const API = "http://localhost:9000";

// const authHeader = () => ({
//   Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
// });

// export default function StudentCourseView() {
//   const { id } = useParams();

//   const [course, setCourse] = useState(null);
//   const [contents, setContents] = useState([]);

//   const [active, setActive] = useState(null);
//   const [mediaUrl, setMediaUrl] = useState(null);
//   const [mediaType, setMediaType] = useState(null);

//   useEffect(() => {
//     load();

//     return () => {
//       if (mediaType === "PDF" && mediaUrl) {
//         URL.revokeObjectURL(mediaUrl);
//       }
//     };
//   }, []);

//   const load = async () => {
//     const c = await axios.get(`${API}/api/courses/${id}`, {
//       headers: authHeader(),
//     });

//     const con = await axios.get(`${API}/api/content/student/course/${id}`, {
//       headers: authHeader(),
//     });

//     const valid = con.data.filter((c) => c.url && c.url !== "undefined");

//     setCourse(c.data);
//     setContents(valid);
//   };

//   // ================= VIDEO =================
//   const playVideo = (c) => {
//     if (!c?.url) {
//       alert("Video missing");
//       return;
//     }

//     const streamUrl = `${API}/api/video/play/${encodeURIComponent(c.url)}`;

//     setMediaUrl(streamUrl);
//     setMediaType("VIDEO");
//     setActive(c);
//   };

//   // ================= PDF =================
//   const openPdf = async (c) => {
//     if (!c?.url) {
//       alert("File missing");
//       return;
//     }

//     if (mediaType === "PDF" && mediaUrl) {
//       URL.revokeObjectURL(mediaUrl);
//     }

//     const res = await axios.get(
//       `${API}/api/files/download/${encodeURIComponent(c.url)}`,
//       {
//         responseType: "blob",
//         headers: authHeader(),
//       }
//     );

//     const blobUrl = URL.createObjectURL(
//       new Blob([res.data], { type: "application/pdf" })
//     );

//     setMediaUrl(blobUrl);
//     setMediaType("PDF");
//     setActive(c);
//   };

//   return (
//     <div className="p-8 min-h-screen bg-background text-foreground">
//       {/* Header */}
//       <h1 className="text-3xl font-bold">
//         {course?.title}
//       </h1>
//       <p className="text-muted-foreground mt-2">
//         {course?.description}
//       </p>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
//         {/* LEFT */}
//         <div className="space-y-3">
//           <h2 className="text-xl font-semibold">
//             Course Content
//           </h2>

//           {contents.map((c) => (
//             <div
//               key={c.id}
//               className={`
//                 p-4 rounded-lg border border-border cursor-pointer
//                 ${active?.id === c.id ? "bg-primary text-primary-foreground" : "bg-card"}
//               `}
//             >
//               <div className="font-semibold">
//                 {c.title}
//               </div>

//               <div className="text-sm text-muted-foreground">
//                 {c.contentType}
//               </div>

//               {c.contentType === "VIDEO" && (
//                 <button
//                   onClick={() => playVideo(c)}
//                   className="
//                     mt-2 px-3 py-1 rounded
//                     bg-primary text-primary-foreground
//                     hover:opacity-90
//                   "
//                 >
//                   ▶ Play
//                 </button>
//               )}

//               {c.contentType === "PDF" && (
//                 <button
//                   onClick={() => openPdf(c)}
//                   className="
//                     mt-2 px-3 py-1 rounded
//                     bg-muted text-foreground
//                     hover:bg-muted/80
//                   "
//                 >
//                   📄 View
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* RIGHT */}
//         <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
//           {!mediaUrl && (
//             <p className="text-muted-foreground text-center mt-20">
//               Select a module to view
//             </p>
//           )}

//           {mediaType === "VIDEO" && mediaUrl && (
//             <video
//               src={mediaUrl}
//               controls
//               autoPlay
//               controlsList="nodownload"
//               disablePictureInPicture
//               className="w-full rounded-xl"
//             />
//           )}

//           {mediaType === "PDF" && mediaUrl && (
//             <iframe
//               src={mediaUrl}
//               className="w-full h-[600px] rounded-xl"
//               title="PDF"
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { PlayCircle, FileText, BookOpen, Video, File, GraduationCap, Clock } from "lucide-react";

const API = "http://localhost:9000";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});

export default function StudentCourseView() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);

  const [active, setActive] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  useEffect(() => {
    load();

    return () => {
      if (mediaType === "PDF" && mediaUrl) {
        URL.revokeObjectURL(mediaUrl);
      }
    };
  }, []);

  const load = async () => {
    const c = await axios.get(`${API}/api/courses/${id}`, {
      headers: authHeader(),
    });

    const con = await axios.get(`${API}/api/content/student/course/${id}`, {
      headers: authHeader(),
    });

    const valid = con.data.filter((c) => c.url && c.url !== "undefined");

    setCourse(c.data);
    setContents(valid);
  };

  // ================= VIDEO =================
  const playVideo = (c) => {
    if (!c?.url) {
      alert("Video missing");
      return;
    }

    const streamUrl = `${API}/api/video/play/${encodeURIComponent(c.url)}`;

    setMediaUrl(streamUrl);
    setMediaType("VIDEO");
    setActive(c);
  };

  // ================= PDF =================
  const openPdf = async (c) => {
    if (!c?.url) {
      alert("File missing");
      return;
    }

    if (mediaType === "PDF" && mediaUrl) {
      URL.revokeObjectURL(mediaUrl);
    }

    const res = await axios.get(
      `${API}/api/files/download/${encodeURIComponent(c.url)}`,
      {
        responseType: "blob",
        headers: authHeader(),
      }
    );

    const blobUrl = URL.createObjectURL(
      new Blob([res.data], { type: "application/pdf" })
    );

    setMediaUrl(blobUrl);
    setMediaType("PDF");
    setActive(c);
  };

  // Calculate stats
  const videoCount = contents.filter(c => c.contentType === "VIDEO").length;
  const pdfCount = contents.filter(c => c.contentType === "PDF").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* ================= MODERN HERO BANNER ================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Floating orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        
        {/* Content */}
        <div className="relative px-6 py-12 md:py-16 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            {/* Left side - Course info */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                <GraduationCap className="h-4 w-4 text-blue-300" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Course Content
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
                {course?.title || "Loading..."}
              </h1>
              
              <p className="text-base md:text-lg text-white/90 mb-6 max-w-3xl">
                {course?.description || "Course description will appear here"}
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <BookOpen className="h-5 w-5 text-white/80" />
                  <div className="text-left">
                    <p className="text-xl font-bold text-white">{contents.length}</p>
                    <p className="text-xs text-white/70">Total Modules</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <Video className="h-5 w-5 text-white/80" />
                  <div className="text-left">
                    <p className="text-xl font-bold text-white">{videoCount}</p>
                    <p className="text-xs text-white/70">Videos</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <FileText className="h-5 w-5 text-white/80" />
                  <div className="text-left">
                    <p className="text-xl font-bold text-white">{pdfCount}</p>
                    <p className="text-xs text-white/70">Documents</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= COURSE CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT - Content List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-5 sticky top-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b-2 border-slate-200 dark:border-slate-700">
                <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Course Modules
                </h2>
              </div>

              <div className="space-y-3">
                {contents.length === 0 ? (
                  <div className="text-center py-8">
                    <File className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">No content available</p>
                  </div>
                ) : (
                  contents.map((c, index) => (
                    <div
                      key={c.id}
                      className={`group p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        active?.id === c.id
                          ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 border-indigo-500 dark:border-indigo-400 shadow-md"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          active?.id === c.id
                            ? "bg-indigo-500 text-white"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                        }`}>
                          {index + 1}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-2">
                            {c.contentType === "VIDEO" ? (
                              <Video className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                                active?.id === c.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"
                              }`} />
                            ) : (
                              <FileText className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                                active?.id === c.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"
                              }`} />
                            )}
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                              {c.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                              c.contentType === "VIDEO"
                                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            }`}>
                              {c.contentType}
                            </span>
                          </div>

                          {c.contentType === "VIDEO" && (
                            <button
                              onClick={() => playVideo(c)}
                              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                            >
                              <PlayCircle size={14} />
                              Play Video
                            </button>
                          )}

                          {c.contentType === "PDF" && (
                            <button
                              onClick={() => openPdf(c)}
                              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all"
                            >
                              <FileText size={14} />
                              View Document
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT - Media Player */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-6">
              {!mediaUrl ? (
                <div className="h-[600px] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-900/20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
                    <BookOpen className="relative w-20 h-20 mb-4 text-indigo-500 dark:text-indigo-400" strokeWidth={1.5} />
                  </div>
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Ready to Learn?
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Select a module from the left to begin
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Active Module Info */}
                  {active && (
                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500 text-white">
                          {mediaType === "VIDEO" ? <Video className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                            {active.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                              mediaType === "VIDEO"
                                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            }`}>
                              {mediaType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Media Container */}
                  <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-slate-200 dark:border-slate-700">
                    {mediaType === "VIDEO" && mediaUrl && (
                      <video
                        src={mediaUrl}
                        controls
                        autoPlay
                        controlsList="nodownload"
                        disablePictureInPicture
                        className="w-full aspect-video bg-black"
                      />
                    )}

                    {mediaType === "PDF" && mediaUrl && (
                      <iframe
                        src={mediaUrl}
                        className="w-full h-[600px]"
                        title="PDF Viewer"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}