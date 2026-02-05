
// import React, { useEffect, useState } from "react";
// import videoService from "../services/videoService";

// const AdminVideoList = () => {
//   const [videos, setVideos] = useState([]);
//   const [videoUrls, setVideoUrls] = useState({});
//   const [playingId, setPlayingId] = useState(null);

//   useEffect(() => {
//     videoService
//       .getAllVideos()
//       .then((res) => setVideos(res.data))
//       .catch(console.error);
//   }, []);

//   const playVideo = async (video) => {
//     if (!videoUrls[video.id]) {
//       const res = await videoService.getVideoBlob(video.storedFileName);

//       const blobUrl = URL.createObjectURL(res.data);

//       setVideoUrls((prev) => ({
//         ...prev,
//         [video.id]: blobUrl,
//       }));
//     }

//     setPlayingId(video.id);
//   };

//   // ===== ✅ DELETE (ONLY ADDITION) =====
//   const deleteVideo = async (id) => {
//     if (!window.confirm("Delete this video?")) return;

//     try {
//       await videoService.deleteVideo(id);

//       // remove from UI
//       setVideos((prev) => prev.filter((v) => v.id !== id));

//       // cleanup blob if playing
//       if (videoUrls[id]) {
//         URL.revokeObjectURL(videoUrls[id]);
//       }
//     } catch (err) {
//       alert("Delete failed");
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <h2 className="text-lg font-semibold">Videos</h2>

//       {videos.map((v) => (
//         <div key={v.id} className="border rounded p-3">
//           <p className="font-medium">{v.originalFileName}</p>
//           <p className="text-xs text-slate-500">
//             {Math.round(v.size / 1024 / 1024)} MB
//           </p>

//           <div className="mt-2 flex gap-3">
//             <button
//               onClick={() => playVideo(v)}
//               className="px-4 py-1 text-sm bg-indigo-600 text-white rounded"
//             >
//               Play
//             </button>

//             {/* ✅ DELETE BUTTON (ADDED ONLY) */}
//             <button
//               onClick={() => deleteVideo(v.id)}
//               className="px-4 py-1 text-sm bg-red-600 text-white rounded"
//             >
//               Delete
//             </button>
//           </div>

//           {playingId === v.id && videoUrls[v.id] && (
//             <video
//               className="mt-3 w-full rounded"
//               controls
//               src={videoUrls[v.id]}
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AdminVideoList;



import React, { useEffect, useState } from "react";
import {
  Play,
  Trash2,
  Video,
  Pause,
} from "lucide-react";

import videoService from "../services/videoService";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const AdminVideoList = () => {
  const [videos, setVideos] = useState([]);
  const [videoUrls, setVideoUrls] = useState({});
  const [playingId, setPlayingId] = useState(null);

  /* ================= LOAD VIDEOS ================= */
  useEffect(() => {
    videoService
      .getAllVideos()
      .then((res) => setVideos(res.data || []))
      .catch(console.error);
  }, []);

  /* ================= PLAY ================= */
  const playVideo = async (video) => {
    if (!videoUrls[video.id]) {
      const res = await videoService.getVideoBlob(video.storedFileName);
      const blobUrl = URL.createObjectURL(res.data);

      setVideoUrls((prev) => ({
        ...prev,
        [video.id]: blobUrl,
      }));
    }

    setPlayingId(video.id);
  };

  /* ================= DELETE ================= */
  const deleteVideo = async (id) => {
    if (!window.confirm("Delete this video?")) return;

    try {
      await videoService.deleteVideo(id);

      setVideos((prev) => prev.filter((v) => v.id !== id));

      if (videoUrls[id]) {
        URL.revokeObjectURL(videoUrls[id]);
      }
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Video className="h-4 w-4" />
          Uploaded Videos
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {videos.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No videos uploaded yet
          </p>
        )}

        {videos.map((v) => (
          <div
            key={v.id}
            className="rounded-lg border p-4 space-y-3 hover:bg-muted/40 transition"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {v.originalFileName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(v.size / 1024 / 1024)} MB
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => playVideo(v)}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Play
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => deleteVideo(v.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* PLAYER */}
            {playingId === v.id && videoUrls[v.id] && (
              <video
                className="w-full rounded-lg border"
                controls
                src={videoUrls[v.id]}
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AdminVideoList;
