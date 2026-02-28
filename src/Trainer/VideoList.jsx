// import React, { useEffect, useState } from "react";
// import { Play, Clock, Trash2, Loader2, Video } from "lucide-react";
// import videoService from "../services/videoService";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// const VideoList = ({ refreshKey }) => {
//   const [videos, setVideos] = useState([]);
//   const [videoUrls, setVideoUrls] = useState({});
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         setLoading(true);
//         const res = await videoService.getAllVideos();

//         const sorted = (res.data || [])
//           .filter((v) => v?.id)
//           .sort(
//             (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
//           );

//         setVideos(sorted);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVideos();
//   }, [refreshKey]);

//   const loadVideo = async (video) => {
//     if (videoUrls[video.id]) return;
//     const res = await videoService.getVideoBlob(video.storedFileName);
//     setVideoUrls((p) => ({
//       ...p,
//       [video.id]: URL.createObjectURL(res.data),
//     }));
//   };

//   const deleteVideo = async (id) => {
//     if (!confirm("Delete this video?")) return;
//     await videoService.deleteVideo(id);
//     setVideos((p) => p.filter((v) => v.id !== id));
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-48">
//         <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">

//       {/* HERO */}
//       <div className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 p-4 text-white shadow-md">
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 rounded-lg bg-white shadow flex items-center justify-center">
//             <Video className="w-4 h-4 text-blue-600" />
//           </div>

//           <div>
//             <h2 className="text-base font-semibold">
//               Uploaded Videos
//             </h2>
//             <p className="text-sm text-white/90">
//               {videos.length} videos • latest first
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* EMPTY */}
//       {videos.length === 0 ? (
//         <Card className="border-dashed p-8 text-center">
//           <Video className="w-5 h-5 text-slate-400 mx-auto mb-2" />
//           <p className="text-sm text-muted-foreground">
//             No videos uploaded yet
//           </p>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//           {videos.map((video) => (
//             <Card key={video.id} className="p-4 space-y-2">

//               {/* Preview */}
//               <div className="h-36 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
//                 {!videoUrls[video.id] ? (
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => loadVideo(video)}
//                   >
//                     <Play className="w-4 h-4 mr-1" />
//                     Load
//                   </Button>
//                 ) : (
//                   <video
//                     src={videoUrls[video.id]}
//                     controls
//                     className="w-full h-full object-cover"
//                   />
//                 )}
//               </div>

//               {/* Title */}
//               <h3 className="text-sm font-semibold">
//                 {video.title || video.originalFileName}
//               </h3>

//               {/* Description */}
//               {video.description && (
//                 <p className="text-xs text-muted-foreground line-clamp-2">
//                   {video.description}
//                 </p>
//               )}

//               {/* ✅ ONLY Batch ID */}
//               {video.batchId && (
//                 <div className="text-xs text-blue-600">
//                   Batch ID: {video.batchId}
//                 </div>
//               )}

//               {/* Meta */}
//               <div className="flex items-center justify-between text-xs text-muted-foreground">
//                 <span className="flex items-center gap-1">
//                   <Clock className="w-3 h-3" />
//                   {video.uploadedAt
//                     ? new Date(video.uploadedAt).toLocaleDateString()
//                     : "N/A"}
//                 </span>
//                 <span>
//                   {video.fileSize
//                     ? (video.fileSize / 1024 / 1024).toFixed(1) + " MB"
//                     : ""}
//                 </span>
//               </div>

//               {/* Actions */}
//               <div className="flex gap-2 pt-2">
//                 <Button
//                   size="sm"
//                   className="flex-1"
//                   onClick={() => loadVideo(video)}
//                 >
//                   <Play className="w-4 h-4 mr-1" />
//                   Play
//                 </Button>

//                 <Button
//                   size="sm"
//                   variant="destructive"
//                   onClick={() => deleteVideo(video.id)}
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </Button>
//               </div>

//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoList;
import React, { useEffect, useState } from "react";
import { Play, Trash2, Loader2 } from "lucide-react";
import videoService from "../services/videoService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VideoList = ({ refreshKey, trainerMode }) => {
  const [videos, setVideos] = useState([]);
  const [videoUrls, setVideoUrls] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);

        // 🔥 FIXED: trainer should see only his batch videos
        const res = trainerMode
          ? await videoService.getTrainerVideos()
          : await videoService.getStudentVideos();

        setVideos(res.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [refreshKey, trainerMode]);

  const loadVideo = async (video) => {
    if (videoUrls[video.id]) return;
    const res = await videoService.getVideoBlob(video.storedFileName);
    setVideoUrls((p) => ({
      ...p,
      [video.id]: URL.createObjectURL(res.data),
    }));
  };

  const deleteVideo = async (id) => {
    if (!trainerMode) return;
    if (!confirm("Delete this video?")) return;
    await videoService.deleteVideo(id);
    setVideos((p) => p.filter((v) => v.id !== id));
  };

  if (loading) {
    return <Loader2 className="w-7 h-7 animate-spin mx-auto mt-10" />;
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {videos.map((video) => (
        <Card key={video.id} className="p-4 space-y-2">
          <div className="h-36 flex items-center justify-center bg-muted rounded-lg">
            {!videoUrls[video.id] ? (
              <Button size="sm" onClick={() => loadVideo(video)}>
                <Play className="w-4 h-4 mr-1" /> Play
              </Button>
            ) : (
              <video
                src={videoUrls[video.id]}
                controls
                className="w-full h-full"
              />
            )}
          </div>

          <h3 className="text-sm font-semibold">{video.title}</h3>

          {trainerMode && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteVideo(video.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
};

export default VideoList;
