// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import {
//   getBatchSessions,
//   endLiveSession,
//   deleteLiveSession,
// } from "@/services/liveSessionService";

// import { getTrainerBatches } from "@/services/batchService";

// import {
//   Video,
//   History,
//   Upload,
//   List,
//   BarChart3,
//   Circle,
//   Calendar,
//   Clock,
//   Users,
//   Radio,
// } from "lucide-react";

// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

// const TrainerLiveClasses = () => {
//   const navigate = useNavigate();

//   const [sessions, setSessions] = useState([]);
//   const [batchId, setBatchId] = useState(null);
//   const [stats, setStats] = useState({
//     live: 0,
//     viewers: 0,
//     scheduled: 0,
//     completed: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("all");

//   // ✅ STEP 1: Load trainer batches to get batchId dynamically
//   useEffect(() => {
//     const loadBatches = async () => {
//       try {
//         const data = await getTrainerBatches();
//         console.log("BATCHES:", data);

//         if (Array.isArray(data) && data.length > 0) {
//           const firstBatch = data[0];
//           const id = firstBatch.id ?? firstBatch.batchId ?? firstBatch.batch_id;
//           console.log("BATCH ID:", id);
//           setBatchId(id);
//         }
//       } catch (err) {
//         console.error("Failed to load batches:", err);
//       }
//     };

//     loadBatches();
//   }, []);

//   // ✅ STEP 2: Load sessions once batchId is available
//   useEffect(() => {
//     if (!batchId) return;

//     const loadSessions = async () => {
//       try {
//         const res = await getBatchSessions(batchId);
//         const data = res.data || [];

//         console.log("Sessions:", data);

//         setSessions(data);

//         setStats({
//           live: data.filter((s) => s.status === "LIVE").length,
//           viewers: data.reduce((acc, s) => acc + (s.viewers ?? 0), 0),
//           scheduled: data.filter((s) => s.status === "SCHEDULED").length,
//           completed: data.filter((s) => s.status === "ENDED").length,
//         });
//       } catch (err) {
//         console.error("Failed to load sessions:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadSessions();
//   }, [batchId]);

//   const tabs = ["all", "LIVE", "SCHEDULED", "ENDED"];

//   const filtered =
//     activeTab === "all"
//       ? sessions
//       : sessions.filter((s) => s.status === activeTab);

//   // ✅ End a live session
//   const handleEnd = async (id) => {
//     try {
//       await endLiveSession(id);
//       setSessions((prev) =>
//         prev.map((s) => (s.id === id ? { ...s, status: "ENDED" } : s)),
//       );
//       // Update stats
//       setStats((prev) => ({
//         ...prev,
//         live: prev.live - 1,
//         completed: prev.completed + 1,
//       }));
//     } catch (err) {
//       console.error("End failed", err);
//     }
//   };

//   // ✅ Delete an ended session
//   const handleDelete = async (id) => {
//     try {
//       await deleteLiveSession(id);
//       setSessions((prev) => prev.filter((s) => s.id !== id));
//       setStats((prev) => ({
//         ...prev,
//         completed: prev.completed - 1,
//       }));
//     } catch (err) {
//       console.error("Delete failed", err);
//     }
//   };

//   const quickLinks = [
//     {
//       icon: <Radio size={18} />,
//       label: "Start Live Session",
//       desc: "Launch a new live class",
//       path: "/trainer/start-live",
//       color: "text-red-500",
//       bg: "bg-red-50 dark:bg-red-900/20",
//     },
//     {
//       icon: <History size={18} />,
//       label: "Session History",
//       desc: "View past live sessions",
//       path: "/trainer/live-history",
//       color: "text-blue-500",
//       bg: "bg-blue-50 dark:bg-blue-900/20",
//     },
//     {
//       icon: <Upload size={18} />,
//       label: "Upload Video",
//       desc: "Upload a recorded class",
//       path: "/trainer/upload-recorded",
//       color: "text-green-500",
//       bg: "bg-green-50 dark:bg-green-900/20",
//     },
//     {
//       icon: <List size={18} />,
//       label: "Recorded Classes",
//       desc: "Manage your video library",
//       path: "/trainer/recorded-list",
//       color: "text-purple-500",
//       bg: "bg-purple-50 dark:bg-purple-900/20",
//     },
//   ];

//   return (
//     <div className="min-h-screen p-6 bg-gray-100 dark:bg-[#0B1120] dark:text-white">
//       {/* ================= HEADER ================= */}
//       <div className="px-8 py-6 rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-2xl font-semibold flex items-center gap-2">
//               <Radio size={22} />
//               Live Studio
//             </h2>
//             <p className="text-sm opacity-90 mt-1">
//               Manage your live sessions & recorded content
//             </p>
//           </div>

//           <Button
//             onClick={() => navigate("/trainer/start-live")}
//             className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
//           >
//             + Go Live
//           </Button>
//         </div>
//       </div>

//       {/* ================= STATS ================= */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//         {[
//           {
//             label: "Live Now",
//             value: stats.live,
//             icon: <Circle className="text-red-500 animate-pulse" size={16} />,
//             color: "text-red-500",
//           },
//           {
//             label: "Live Viewers",
//             value: stats.viewers,
//             icon: <Users className="text-yellow-500" size={18} />,
//             color: "text-yellow-500",
//           },
//           {
//             label: "Scheduled",
//             value: stats.scheduled,
//             icon: <Calendar className="text-blue-500" size={18} />,
//             color: "text-blue-500",
//           },
//           {
//             label: "Completed",
//             value: stats.completed,
//             icon: <BarChart3 className="text-green-500" size={18} />,
//             color: "text-green-500",
//           },
//         ].map((s) => (
//           <Card key={s.label}>
//             <CardContent className="p-5 flex items-center gap-4">
//               {s.icon}
//               <div>
//                 <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
//                 <p className="text-xs text-gray-500">{s.label}</p>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* ================= QUICK LINKS ================= */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//         {quickLinks.map((q) => (
//           <button
//             key={q.path}
//             onClick={() => navigate(q.path)}
//             className="flex items-center gap-3 p-4 rounded-2xl border bg-white dark:bg-[#111827] hover:shadow-md transition text-left"
//           >
//             <div className={`p-3 rounded-xl ${q.bg} ${q.color}`}>{q.icon}</div>
//             <div>
//               <p className="font-semibold text-sm">{q.label}</p>
//               <p className="text-xs text-gray-500">{q.desc}</p>
//             </div>
//           </button>
//         ))}
//       </div>

//       {/* ================= SESSIONS ================= */}
//       <Card>
//         <CardContent className="p-6">
//           <div className="flex justify-between mb-5 flex-wrap gap-3">
//             <h3 className="font-semibold text-lg">Sessions</h3>

//             <div className="flex gap-2 flex-wrap">
//               {tabs.map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => setActiveTab(t)}
//                   className={`px-4 py-1.5 rounded-full text-sm capitalize ${
//                     activeTab === t
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-100 dark:bg-[#1F2937]"
//                   }`}
//                 >
//                   {t}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {loading ? (
//             <p className="text-gray-500 dark:text-slate-400">
//               Loading sessions...
//             </p>
//           ) : filtered.length === 0 ? (
//             <div className="text-center py-16">
//               <Video size={40} className="mx-auto mb-4 opacity-30" />
//               <p className="text-gray-400 dark:text-slate-500">
//                 No sessions found
//               </p>
//               <Button
//                 onClick={() => navigate("/trainer/start-live")}
//                 className="mt-4 bg-blue-600 text-white"
//               >
//                 Start Now
//               </Button>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {filtered.map((session) => (
//                 <div
//                   key={session.id}
//                   className="flex items-center gap-4 p-4 rounded-xl border hover:bg-gray-50 dark:hover:bg-[#1F2937] transition"
//                 >
//                   {/* Clickable info area */}
//                   <div
//                     className="flex-1 cursor-pointer"
//                     onClick={() => {
//                       if (session.status === "LIVE") {
//                         navigate(`/trainer/live-controls/${session.id}`);
//                       }
//                     }}
//                   >
//                     <p className="font-medium">{session.title}</p>
//                     <div className="flex gap-4 mt-1 text-xs text-gray-500 flex-wrap">
//                       <span className="flex items-center gap-1">
//                         <Calendar size={12} /> {session.date}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Clock size={12} /> {session.time}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Users size={12} /> {session.viewers ?? 0}
//                       </span>
//                     </div>
//                   </div>

//                   <Badge>
//                     {session.status === "LIVE" && (
//                       <Circle
//                         size={8}
//                         className="inline mr-1 text-red-500 animate-pulse"
//                       />
//                     )}
//                     {session.status}
//                   </Badge>

//                   {/* Action Buttons */}
//                   <div className="flex gap-2">
//                     {session.status === "LIVE" && (
//                       <>
//                         <Button
//                           onClick={() =>
//                             navigate(`/trainer/live-controls/${session.id}`)
//                           }
//                           className="bg-green-500 hover:bg-green-600"
//                         >
//                           Join
//                         </Button>

//                         <Button
//                           onClick={() => handleEnd(session.id)}
//                           className="bg-yellow-500 hover:bg-yellow-600"
//                         >
//                           End
//                         </Button>
//                       </>
//                     )}

//                     {session.status === "ENDED" && (
//                       <Button
//                         onClick={() => handleDelete(session.id)}
//                         className="bg-red-500 hover:bg-red-600"
//                       >
//                         Delete
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default TrainerLiveClasses;






























import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getBatchSessions,
  endLiveSession,
  deleteLiveSession,
} from "@/services/liveSessionService";

import { getTrainerBatches } from "@/services/batchService";

import {
  Video,
  History,
  Upload,
  List,
  BarChart3,
  Circle,
  Calendar,
  Clock,
  Users,
  Radio,
  ChevronDown,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TrainerLiveClasses = () => {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [batchId, setBatchId] = useState(null);
  const [stats, setStats] = useState({
    live: 0,
    viewers: 0,
    scheduled: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isSessionsOpen, setIsSessionsOpen] = useState(true); // ✅ UI only

  // ✅ STEP 1: Load trainer batches to get batchId dynamically
  useEffect(() => {
    const loadBatches = async () => {
      try {
        const data = await getTrainerBatches();
        console.log("BATCHES:", data);

        if (Array.isArray(data) && data.length > 0) {
          const firstBatch = data[0];
          const id = firstBatch.id ?? firstBatch.batchId ?? firstBatch.batch_id;
          console.log("BATCH ID:", id);
          setBatchId(id);
        }
      } catch (err) {
        console.error("Failed to load batches:", err);
      }
    };

    loadBatches();
  }, []);

  // ✅ STEP 2: Load sessions once batchId is available
  useEffect(() => {
    if (!batchId) return;

    const loadSessions = async () => {
      try {
        const res = await getBatchSessions(batchId);
        const data = res.data || [];

        console.log("Sessions:", data);

        setSessions(data);

        setStats({
          live: data.filter((s) => s.status === "LIVE").length,
          viewers: data.reduce((acc, s) => acc + (s.viewers ?? 0), 0),
          scheduled: data.filter((s) => s.status === "SCHEDULED").length,
          completed: data.filter((s) => s.status === "ENDED").length,
        });
      } catch (err) {
        console.error("Failed to load sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [batchId]);

  const tabs = ["all", "LIVE", "SCHEDULED", "ENDED"];

  const filtered =
    activeTab === "all"
      ? sessions
      : sessions.filter((s) => s.status === activeTab);

  // ✅ End a live session
  const handleEnd = async (id) => {
    try {
      await endLiveSession(id);
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "ENDED" } : s)),
      );
      // Update stats
      setStats((prev) => ({
        ...prev,
        live: prev.live - 1,
        completed: prev.completed + 1,
      }));
    } catch (err) {
      console.error("End failed", err);
    }
  };

  // ✅ Delete an ended session
  const handleDelete = async (id) => {
    try {
      await deleteLiveSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      setStats((prev) => ({
        ...prev,
        completed: prev.completed - 1,
      }));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const quickLinks = [
    {
      icon: <Radio size={18} />,
      label: "Start Live Session",
      desc: "Launch a new live class",
      path: "/trainer/start-live",
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
    {
      icon: <History size={18} />,
      label: "Session History",
      desc: "View past live sessions",
      path: "/trainer/live-history",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: <Upload size={18} />,
      label: "Upload Video",
      desc: "Upload a recorded class",
      path: "/trainer/upload-recorded",
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: <List size={18} />,
      label: "Recorded Classes",
      desc: "Manage your video library",
      path: "/trainer/recorded-list",
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-[#0B1120] dark:text-white">
      {/* ================= HEADER ================= */}
      <div className="px-8 py-6 rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Radio size={22} />
              Live Studio
            </h2>
            <p className="text-sm opacity-90 mt-1">
              Manage your live sessions & recorded content
            </p>
          </div>

          <Button
            onClick={() => navigate("/trainer/start-live")}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
          >
            + Go Live
          </Button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Live Now",
            value: stats.live,
            icon: <Circle className="text-red-500 animate-pulse" size={16} />,
            color: "text-red-500",
          },
          {
            label: "Live Viewers",
            value: stats.viewers,
            icon: <Users className="text-yellow-500" size={18} />,
            color: "text-yellow-500",
          },
          {
            label: "Scheduled",
            value: stats.scheduled,
            icon: <Calendar className="text-blue-500" size={18} />,
            color: "text-blue-500",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: <BarChart3 className="text-green-500" size={18} />,
            color: "text-green-500",
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5 flex items-center gap-4">
              {s.icon}
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ================= QUICK LINKS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((q) => (
          <button
            key={q.path}
            onClick={() => navigate(q.path)}
            className="flex items-center gap-3 p-4 rounded-2xl border bg-white dark:bg-[#111827] hover:shadow-md transition text-left"
          >
            <div className={`p-3 rounded-xl ${q.bg} ${q.color}`}>{q.icon}</div>
            <div>
              <p className="font-semibold text-sm">{q.label}</p>
              <p className="text-xs text-gray-500">{q.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ================= SESSIONS ================= */}
      <Card>
        <CardContent className="p-6">
          {/* Header row with tabs + collapse arrow */}
          <div className="flex justify-between mb-5 flex-wrap gap-3">
            <h3 className="font-semibold text-lg">Sessions</h3>

            <div className="flex gap-2 flex-wrap items-center">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-1.5 rounded-full text-sm capitalize ${
                    activeTab === t
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-[#1F2937]"
                  }`}
                >
                  {t}
                </button>
              ))}

              {/* ✅ Collapse / Expand arrow — UI only */}
              <button
                onClick={() => setIsSessionsOpen((prev) => !prev)}
                title={isSessionsOpen ? "Collapse sessions" : "Expand sessions"}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1F2937] hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                <ChevronDown
                  size={14}
                  className={`text-gray-500 transition-transform duration-300 ${
                    isSessionsOpen ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* ✅ Sessions body — collapses/expands */}
          {isSessionsOpen && (
            <>
              {loading ? (
                <p className="text-gray-500 dark:text-slate-400">
                  Loading sessions...
                </p>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                  <Video size={40} className="mx-auto mb-4 opacity-30" />
                  <p className="text-gray-400 dark:text-slate-500">
                    No sessions found
                  </p>
                  <Button
                    onClick={() => navigate("/trainer/start-live")}
                    className="mt-4 bg-blue-600 text-white"
                  >
                    Start Now
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center gap-4 p-4 rounded-xl border hover:bg-gray-50 dark:hover:bg-[#1F2937] transition"
                    >
                      {/* Clickable info area */}
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          if (session.status === "LIVE") {
                            navigate(`/trainer/live-controls/${session.id}`);
                          }
                        }}
                      >
                        <p className="font-medium">{session.title}</p>
                        <div className="flex gap-4 mt-1 text-xs text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {session.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {session.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={12} /> {session.viewers ?? 0}
                          </span>
                        </div>
                      </div>

                      <Badge>
                        {session.status === "LIVE" && (
                          <Circle
                            size={8}
                            className="inline mr-1 text-red-500 animate-pulse"
                          />
                        )}
                        {session.status}
                      </Badge>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {session.status === "LIVE" && (
                          <>
                            <Button
                              onClick={() =>
                                navigate(
                                  `/trainer/live-controls/${session.id}`,
                                )
                              }
                              className="bg-green-500 hover:bg-green-600"
                            >
                              Join
                            </Button>

                            <Button
                              onClick={() => handleEnd(session.id)}
                              className="bg-yellow-500 hover:bg-yellow-600"
                            >
                              End
                            </Button>
                          </>
                        )}

                        {session.status === "ENDED" && (
                          <Button
                            onClick={() => handleDelete(session.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerLiveClasses;






