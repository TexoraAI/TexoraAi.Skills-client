
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FileText, Image, Video, Download } from "lucide-react";

// const API_GATEWAY = "http://localhost:9000";

// export default function Resources() {
//   const [resources, setResources] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchResources = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("lms_token");
//         const response = await axios.get(`${API_GATEWAY}/api/resources`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "X-ROLE": localStorage.getItem("role") || "STUDENT",
//           },
//         });
//         setResources(response.data);
//       } catch (err) {
//         console.error(err);
//         setError("Resources load nahi hue");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResources();
//   }, []);

//   if (loading) return <div className="text-center py-10 text-muted-foreground">Loading resources...</div>;
//   if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

//   return (
//     <div className="min-h-screen p-8 bg-background text-foreground">
//       {/* ================= HEADER ================= */}
//       <div className="max-w-6xl mx-auto mb-6">
//         <h2 className="text-2xl font-semibold tracking-tight">
//           Resources
//         </h2>
//         <p className="text-sm text-muted-foreground mt-1">
//           Download notes, videos and learning materials shared by trainers
//         </p>
//       </div>

//       {/* ================= RESOURCE GRID ================= */}
//       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {resources.map((item, idx) => {
//           const Icon = item.type === "pdf" || item.type === "document" ? FileText : 
//                       item.type === "video" ? Video : Image;

//           return (
//             <div
//               key={idx}
//               className="
//                 p-5 rounded-xl
//                 border border-border
//                 bg-background
//                 hover:border-primary/50
//                 transition
//               "
//             >
//               {/* ICON + TITLE */}
//               <div className="flex items-center gap-3 mb-3">
//                 <div
//                   className="
//                     p-2 rounded-lg
//                     border border-border
//                     text-muted-foreground
//                   "
//                 >
//                   <Icon size={18} />
//                 </div>

//                 <h3 className="text-sm font-medium">
//                   {item.title}
//                 </h3>
//               </div>

//               <p className="text-xs text-muted-foreground">
//                 File Size: {item.size || "N/A"}
//               </p>

//               {/* ACTION */}
//               <a
//                 href={item.url || item.download_url}
//                 download={item.title}
//                 className="
//                   mt-5 w-full
//                   inline-flex items-center justify-center gap-2
//                   px-4 py-2 text-xs font-medium
//                   rounded-lg
//                   border border-border
//                   bg-background hover:bg-accent
//                   transition
//                 "
//               >
//                 <Download size={14} />
//                 Download
//               </a>
//             </div>
//           );
//         })}

//         {resources.length === 0 && (
//           <div className="col-span-full text-center text-sm text-muted-foreground py-10">
//             No resources available yet.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Image, Video, Download, FolderOpen, Package, Archive } from "lucide-react";

const API_GATEWAY = "http://localhost:9000";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("lms_token");
        const response = await axios.get(`${API_GATEWAY}/api/resources`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-ROLE": localStorage.getItem("role") || "STUDENT",
          },
        });
        setResources(response.data);
      } catch (err) {
        console.error(err);
        setError("Resources load nahi hue");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Calculate stats
  const documentCount = resources.filter(r => r.type === "pdf" || r.type === "document").length;
  const videoCount = resources.filter(r => r.type === "video").length;
  const imageCount = resources.filter(r => r.type === "image").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading resources...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* ================= MODERN HERO BANNER ================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-900 dark:via-purple-900 dark:to-fuchsia-900">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Floating orbs */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Content */}
        <div className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left side - Text content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Package className="h-4 w-4 text-violet-300" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Resource Center
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                Resources
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                Download notes, videos, and learning materials shared by your trainers
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <FolderOpen className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{resources.length}</p>
                    <p className="text-xs text-white/70">Total Resources</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <FileText className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{documentCount}</p>
                    <p className="text-xs text-white/70">Documents</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <Video className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{videoCount}</p>
                    <p className="text-xs text-white/70">Videos</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <Image className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{imageCount}</p>
                    <p className="text-xs text-white/70">Images</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-64 h-64 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center overflow-hidden">
                  <div className="relative">
                    {/* Layered resources effect */}
                    <div className="absolute -top-4 -left-4 w-24 h-24 rounded-xl bg-violet-400/20 backdrop-blur-sm flex items-center justify-center transform -rotate-12">
                      <FileText className="h-12 w-12 text-white/60" />
                    </div>
                    <div className="absolute -top-2 left-8 w-24 h-24 rounded-xl bg-purple-400/20 backdrop-blur-sm flex items-center justify-center transform rotate-6">
                      <Video className="h-12 w-12 text-white/60" />
                    </div>
                    <div className="relative w-32 h-32 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Archive className="h-20 w-20 text-white/80" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-fuchsia-400/20 backdrop-blur-sm flex items-center justify-center animate-bounce">
                  <Download className="h-10 w-10 text-fuchsia-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RESOURCE GRID ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((item, idx) => {
            const Icon = item.type === "pdf" || item.type === "document" ? FileText : 
                        item.type === "video" ? Video : Image;
            
            const typeColors = {
              pdf: "from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 text-red-600 dark:text-red-400",
              document: "from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400",
              video: "from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 text-purple-600 dark:text-purple-400",
              image: "from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-600 dark:text-green-400",
            };

            const gradientClass = typeColors[item.type] || typeColors.document;

            return (
              <div key={idx} className="group p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                {/* ICON + TITLE */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientClass} group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* META INFO */}
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-xs font-medium text-violet-700 dark:text-violet-300">
                      {item.type?.toUpperCase() || 'FILE'}
                    </span>
                    {item.size && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {item.size}
                      </span>
                    )}
                  </div>
                </div>

                {/* ACTION */}
                <a href={item.url || item.download_url} download={item.title} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300">
                  <Download size={16} />
                  Download
                </a>
              </div>
            );
          })}

          {resources.length === 0 && (
            <div className="col-span-full text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-violet-100 dark:bg-violet-900/20 mb-4">
                <FolderOpen className="h-10 w-10 text-violet-600 dark:text-violet-400" />
              </div>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                No Resources Available
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Resources shared by your trainers will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}