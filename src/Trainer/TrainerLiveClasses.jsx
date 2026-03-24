// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getBatchSessions } from "@/services/liveSessionService";
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
//   const [stats, setStats] = useState({
//     live: 0,
//     viewers: 0,
//     scheduled: 0,
//     completed: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("all");

//   useEffect(() => {
//     const loadSessions = async () => {
//       try {
//         const res = await getBatchSessions(1);

//         setSessions(res.data);
//       } catch (err) {
//         console.error("Failed to load sessions", err);
//       }

//       setLoading(false);
//     };

//     loadSessions();
//   }, []);
//   const filtered =
//     activeTab === "all"
//       ? sessions
//       : sessions.filter((s) => s.status === activeTab);

//   const tabs = ["all", "live", "scheduled", "ended"];

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
//       {/* HEADER */}
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

//       {/* STATS */}
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

//       {/* QUICK LINKS */}
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

//       {/* SESSIONS */}
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
//             <p>Loading sessions...</p>
//           ) : filtered.length === 0 ? (
//             <div className="text-center py-16">
//               <Video size={40} className="mx-auto mb-4 opacity-30" />
//               <p>No sessions found</p>
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
//                   className="flex items-center gap-4 p-4 rounded-xl border hover:bg-gray-50 dark:hover:bg-[#1F2937] cursor-pointer"
//                   onClick={() =>
//                     navigate(`/trainer/live-controls/${session.id}`)
//                   }
//                 >
//                   <div className="flex-1">
//                     <p className="font-medium">{session.title}</p>
//                     <div className="flex gap-4 mt-1 text-xs text-gray-500 flex-wrap">
//                       <span className="flex items-center gap-1">
//                         <Calendar size={14} /> {session.date}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Clock size={14} /> {session.time}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Users size={14} /> {session.viewers ?? 0}
//                       </span>
//                     </div>
//                   </div>

//                   <Badge>
//                     {session.status === "live" && (
//                       <Circle
//                         size={8}
//                         className="inline mr-1 text-red-500 animate-pulse"
//                       />
//                     )}
//                     {session.status}
//                   </Badge>
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
import { getBatchSessions } from "@/services/liveSessionService";
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
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TrainerLiveClasses = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    live: 0,
    viewers: 0,
    scheduled: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  /* ================= FETCH SESSIONS FROM BACKEND ================= */
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const res = await getBatchSessions(1); // ⚠️ replace 1 with real batchId from auth/context
        const data = res.data || [];

        setSessions(data);

        // ✅ Derive stats from fetched sessions
        setStats({
          live: data.filter((s) => s.status === "live").length,
          viewers: data.reduce((acc, s) => acc + (s.viewers ?? 0), 0),
          scheduled: data.filter((s) => s.status === "scheduled").length,
          completed: data.filter((s) => s.status === "ended" || s.status === "completed").length,
        });
      } catch (err) {
        console.error("Failed to load sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  const filtered =
    activeTab === "all"
      ? sessions
      : sessions.filter((s) => s.status === activeTab);

  const tabs = ["all", "live", "scheduled", "ended"];

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
            <div className={`p-3 rounded-xl ${q.bg} ${q.color}`}>
              {q.icon}
            </div>
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
          <div className="flex justify-between mb-5 flex-wrap gap-3">
            <h3 className="font-semibold text-lg">Sessions</h3>

            <div className="flex gap-2 flex-wrap">
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
            </div>
          </div>

          {loading ? (
            <p className="text-gray-500 dark:text-slate-400">Loading sessions...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Video size={40} className="mx-auto mb-4 opacity-30" />
              <p className="text-gray-400 dark:text-slate-500">No sessions found</p>
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
                  className="flex items-center gap-4 p-4 rounded-xl border hover:bg-gray-50 dark:hover:bg-[#1F2937] cursor-pointer transition"
                  onClick={() => navigate(`/trainer/live-controls/${session.id}`)}
                >
                  <div className="flex-1">
                    <p className="font-medium">{session.title}</p>
                    <div className="flex gap-4 mt-1 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {session.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {session.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} /> {session.viewers ?? 0}
                      </span>
                    </div>
                  </div>

                  <Badge>
                    {session.status === "live" && (
                      <Circle
                        size={8}
                        className="inline mr-1 text-red-500 animate-pulse"
                      />
                    )}
                    {session.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerLiveClasses;