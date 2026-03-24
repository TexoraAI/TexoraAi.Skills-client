// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Search,
//   Video,
//   Upload,
// } from "lucide-react";

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const RecordedClassList = () => {
//   const navigate = useNavigate();

//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   // 🔥 Fetch videos from backend
//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const res = await fetch("/api/recorded-videos");
//         if (!res.ok) { setVideos([]); return; }
//         const text = await res.text();
//         const data = text ? JSON.parse(text) : [];
//         setVideos(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error("Failed to fetch videos", error);
//         setVideos([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVideos();
//   }, []);

//   const filtered = videos.filter((v) =>
//     v.title?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen p-6 bg-gray-100 dark:bg-[#0B1120] dark:text-white">

//       {/* HEADER */}
//       <div className="px-8 py-6 rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg flex justify-between items-center">

//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate("/trainer")}
//             className="p-2 rounded-full bg-white/20 hover:bg-white/30"
//           >
//             <ArrowLeft size={18} />
//           </button>

//           <div>
//             <h2 className="text-2xl font-semibold flex items-center gap-2">
//               <Video size={22} />
//               Recorded Classes
//             </h2>
//             <p className="text-sm opacity-90 mt-1">
//               {videos.length} videos
//             </p>
//           </div>
//         </div>

//         <Button
//           onClick={() => navigate("/trainer/upload-recorded")}
//           className="bg-white text-blue-600 hover:bg-blue-50 flex items-center gap-2"
//         >
//           <Upload size={16} /> Upload Video
//         </Button>
//       </div>

//       {/* SEARCH */}
//       <Card className="mb-6 bg-white dark:bg-[#1F2937]">
//         <CardContent className="p-4">
//           <Input
//             placeholder="Search videos..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </CardContent>
//       </Card>

//       {/* LOADING */}
//       {loading && (
//         <div className="text-center py-20">
//           <p>Loading videos...</p>
//         </div>
//       )}

//       {/* EMPTY */}
//       {!loading && filtered.length === 0 && (
//         <div className="text-center py-20">
//           <Video size={50} className="mx-auto mb-4 opacity-30" />
//           <p>No videos found</p>
//         </div>
//       )}

//       {/* LIST */}
//       {!loading && filtered.length > 0 && (
//         <div className="grid md:grid-cols-3 gap-6">
//           {filtered.map((video) => (
//             <Card
//               key={video.id}
//               className="bg-white dark:bg-[#1F2937] border dark:border-white/10"
//             >
//               <CardContent className="p-4">

//                 {/* Thumbnail */}
//                 {video.thumbnail && (
//                   <img
//                     src={video.thumbnail}
//                     alt={video.title}
//                     className="rounded-lg mb-3 h-40 w-full object-cover"
//                   />
//                 )}

//                 <h3 className="font-semibold text-lg">
//                   {video.title}
//                 </h3>

//                 <p className="text-sm opacity-70 mt-1">
//                   {video.description}
//                 </p>

//                 <p className="text-xs mt-2 opacity-60">
//                   Batch: {video.batchName}
//                 </p>

//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecordedClassList;

























import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Video,
  Upload,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RecordedClassList = () => {
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ================= FETCH VIDEOS FROM BACKEND ================= */
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/recorded-videos");

        // ✅ Check response is OK before parsing
        if (!res.ok) {
          console.error("Server error:", res.status);
          setVideos([]);
          return;
        }

        // ✅ Safe parse — avoids crash if response body is empty
        const text = await res.text();
        const data = text ? JSON.parse(text) : [];

        setVideos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filtered = videos.filter((v) =>
    v.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-[#0B1120] dark:text-white">

      {/* ================= HEADER ================= */}
      <div className="px-8 py-6 rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg flex justify-between items-center">

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/trainer")}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Video size={22} />
              Recorded Classes
            </h2>
            <p className="text-sm opacity-90 mt-1">
              {videos.length} videos
            </p>
          </div>
        </div>

        <Button
          onClick={() => navigate("/trainer/upload-recorded")}
          className="bg-white text-blue-600 hover:bg-blue-50 flex items-center gap-2"
        >
          <Upload size={16} /> Upload Video
        </Button>
      </div>

      {/* ================= SEARCH ================= */}
      <Card className="mb-6 bg-white dark:bg-[#1F2937]">
        <CardContent className="p-4">
          <Input
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-slate-400">Loading videos...</p>
        </div>
      )}

      {/* ================= EMPTY ================= */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400 dark:text-slate-500">
          <Video size={50} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">No videos found</p>
        </div>
      )}

      {/* ================= VIDEO GRID ================= */}
      {!loading && filtered.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((video) => (
            <Card
              key={video.id}
              className="bg-white dark:bg-[#1F2937] border dark:border-white/10 hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/trainer/live/recorded/edit/${video.id}`)}
            >
              <CardContent className="p-4">

                {/* Thumbnail */}
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="rounded-lg mb-3 h-40 w-full object-cover"
                  />
                ) : (
                  <div className="rounded-lg mb-3 h-40 w-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                    <Video size={32} className="text-blue-300 opacity-50" />
                  </div>
                )}

                <h3 className="font-semibold text-lg">{video.title}</h3>

                <p className="text-sm opacity-70 mt-1 line-clamp-2">
                  {video.description}
                </p>

                <p className="text-xs mt-2 opacity-60">
                  Batch: {video.batchName}
                </p>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecordedClassList;