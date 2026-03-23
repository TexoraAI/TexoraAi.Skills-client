// import React, { useState, useRef, useEffect } from "react";

// const RecordedClasses = () => {
//   const [lessons, setLessons] = useState([]);
//   const [selectedLesson, setSelectedLesson] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const videoRef = useRef(null);

//   /* ================= FETCH FROM BACKEND ================= */

//   useEffect(() => {
//     const fetchLessons = async () => {
//       try {
//         const res = await fetch("/api/recorded-videos");

//         const data = await res.json();

//         setLessons(data);

//         if (data.length > 0) {
//           setSelectedLesson(data[0]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch lessons:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLessons();
//   }, []);

//   /* ================= RESUME PLAYBACK ================= */

//   useEffect(() => {
//     if (!selectedLesson) return;

//     const savedTime = localStorage.getItem(selectedLesson.id);

//     if (savedTime && videoRef.current) {
//       videoRef.current.currentTime = parseFloat(savedTime);
//     }
//   }, [selectedLesson]);

//   const handleTimeUpdate = () => {
//     if (!selectedLesson) return;

//     localStorage.setItem(selectedLesson.id, videoRef.current.currentTime);
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-100 text-gray-900 dark:bg-[#0B1120] dark:text-white">
//       {/* HEADER */}

//       <div className="px-8 py-6 rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-2xl font-semibold">🎬 Video Lectures</h2>

//             <div className="text-sm opacity-90 mt-2">
//               {lessons.length} videos • HD Streaming
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MAIN */}

//       <div className="flex gap-8">
//         {/* PLAYLIST */}

//         <div className="w-80 p-6 rounded-2xl shadow-md bg-white border border-gray-200 dark:bg-[#111827] dark:border-white/10">
//           <h3 className="font-semibold mb-4">Course Content</h3>

//           {loading ? (
//             <p className="text-sm text-gray-500">Loading...</p>
//           ) : lessons.length === 0 ? (
//             <p className="text-sm text-gray-500">
//               No recorded lessons available.
//             </p>
//           ) : (
//             lessons.map((lesson) => (
//               <div
//                 key={lesson.id}
//                 onClick={() => setSelectedLesson(lesson)}
//                 className={`p-3 rounded-xl cursor-pointer mb-3 transition
//                 ${
//                   selectedLesson?.id === lesson.id
//                     ? "bg-blue-100 dark:bg-blue-900/40"
//                     : "hover:bg-gray-200 dark:hover:bg-[#1F2937]"
//                 }`}
//               >
//                 <div className="text-sm font-medium">{lesson.title}</div>

//                 <div className="text-xs text-gray-500 dark:text-slate-400">
//                   {lesson.duration} • {lesson.size}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* VIDEO SECTION */}

//         <div className="flex-1">
//           <div className="rounded-3xl overflow-hidden shadow-2xl bg-black">
//             {selectedLesson ? (
//               <video
//                 key={selectedLesson.videoUrl}
//                 ref={videoRef}
//                 src={selectedLesson.videoUrl}
//                 controls
//                 preload="metadata"
//                 onTimeUpdate={handleTimeUpdate}
//                 className="w-full h-[480px]"
//               />
//             ) : (
//               <div className="h-[480px] flex items-center justify-center text-gray-400">
//                 Select a lesson to start watching
//               </div>
//             )}
//           </div>

//           {/* DESCRIPTION */}

//           <div className="mt-6 p-6 rounded-2xl shadow-md bg-white dark:bg-[#111827] dark:border dark:border-white/10">
//             <h3 className="font-semibold mb-3">Lesson Description</h3>

//             <p className="text-sm text-gray-600 dark:text-slate-400">
//               {selectedLesson?.description ||
//                 "Lesson description will appear here once backend is connected."}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecordedClasses;
import React, { useState, useRef, useEffect } from "react";
import { getStudentBatch } from "@/services/batchService";
import { getLiveSessionsByBatch } from "@/services/liveSessionService";

const RecordedClasses = () => {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  const videoRef = useRef(null);

  /* ================= FETCH LIVE SESSIONS ================= */
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        // ✅ Get student batch
        const batch = await getStudentBatch();
        const batchId = batch?.id;

        if (!batchId) {
          setLessons([]);
          return;
        }

        // ✅ Get LIVE sessions
        const res = await getLiveSessionsByBatch(batchId);
        const data = res.data || [];

        // ✅ Map to UI format (NO UI CHANGE)
        const mapped = data.map((session) => ({
          id: session.id,
          title: session.title,
          description: session.description,
          videoUrl: "", // live → no video file
          duration: session.duration + " mins",
          size: "LIVE",
        }));

        setLessons(mapped);

        if (mapped.length > 0) {
          setSelectedLesson(mapped[0]);
        }
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  /* ================= RESUME PLAYBACK ================= */
  useEffect(() => {
    if (!selectedLesson) return;

    const savedTime = localStorage.getItem(selectedLesson.id);

    if (savedTime && videoRef.current) {
      videoRef.current.currentTime = parseFloat(savedTime);
    }
  }, [selectedLesson]);

  const handleTimeUpdate = () => {
    if (!selectedLesson) return;
    localStorage.setItem(selectedLesson.id, videoRef.current.currentTime);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-900 dark:bg-[#0B1120] dark:text-white">
      {/* HEADER */}
      <div className="px-8 py-6 rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">🎬 Video Lectures</h2>
            <div className="text-sm opacity-90 mt-2">
              {lessons.length} videos • HD Streaming
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex gap-8">
        {/* PLAYLIST */}
        <div className="w-80 p-6 rounded-2xl shadow-md bg-white border border-gray-200 dark:bg-[#111827] dark:border-white/10">
          <h3 className="font-semibold mb-4">Course Content</h3>

          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : lessons.length === 0 ? (
            <p className="text-sm text-gray-500">
              No recorded lessons available.
            </p>
          ) : (
            lessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className={`p-3 rounded-xl cursor-pointer mb-3 transition
                ${
                  selectedLesson?.id === lesson.id
                    ? "bg-blue-100 dark:bg-blue-900/40"
                    : "hover:bg-gray-200 dark:hover:bg-[#1F2937]"
                }`}
              >
                <div className="text-sm font-medium">{lesson.title}</div>

                <div className="text-xs text-gray-500 dark:text-slate-400">
                  {lesson.duration} • {lesson.size}
                </div>
              </div>
            ))
          )}
        </div>

        {/* VIDEO SECTION */}
        <div className="flex-1">
          <div className="rounded-3xl overflow-hidden shadow-2xl bg-black">
            {selectedLesson ? (
              <div className="h-[480px] flex items-center justify-center text-white">
                🔴 LIVE SESSION - Click to Join
              </div>
            ) : (
              <div className="h-[480px] flex items-center justify-center text-gray-400">
                Select a lesson to start watching
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="mt-6 p-6 rounded-2xl shadow-md bg-white dark:bg-[#111827] dark:border dark:border-white/10">
            <h3 className="font-semibold mb-3">Lesson Description</h3>

            <p className="text-sm text-gray-600 dark:text-slate-400">
              {selectedLesson?.description ||
                "Lesson description will appear here once backend is connected."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordedClasses;
