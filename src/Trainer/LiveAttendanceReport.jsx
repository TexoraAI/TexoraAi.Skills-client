import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  MessageCircle,
  Users,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const LiveAttendanceReport = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const [report, setReport] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Dummy Data
  useEffect(() => {
    setReport({
      sessionTitle: "React Live Class",
      date: "2026-02-19",
      time: "10:00 AM",
    });

    setAttendees([
      {
        name: "Raghib Imam",
        joinTime: "10:00 AM",
        leaveTime: "11:00 AM",
        duration: "60 min",
        watchPercent: 95,
        chatMessages: 5,
        status: "present",
      },
    ]);
  }, [sessionId]);

  // ✅ CSV Export
  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Join Time,Leave Time,Duration,Watch %,Chat Messages\n" +
      attendees
        .map(
          (a) =>
            `${a.name},${a.joinTime},${a.leaveTime},${a.duration},${a.watchPercent},${a.chatMessages}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `attendance-${sessionId}.csv`;
    document.body.appendChild(link);
    link.click();
  };

  const filtered = attendees.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase())
  );

  const completedCount = attendees.filter(
    (a) => a.status === "present"
  ).length;

  const completionRate =
    attendees.length > 0
      ? Math.round((completedCount / attendees.length) * 100)
      : 0;

  const avgWatchTime =
    attendees.length > 0
      ? Math.round(
          attendees.reduce((acc, a) => acc + (a.watchPercent ?? 0), 0) /
            attendees.length
        )
      : 0;

  const totalMessages = attendees.reduce(
    (acc, a) => acc + (a.chatMessages ?? 0),
    0
  );

  const statusConfig = {
    present: {
      label: "On Time",
      icon: <CheckCircle2 size={12} className="text-green-500" />,
      badge:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    late: {
      label: "Late",
      icon: <AlertCircle size={12} className="text-yellow-500" />,
      badge:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    "left-early": {
      label: "Left Early",
      icon: <XCircle size={12} className="text-red-400" />,
      badge:
        "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    },
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-[#0B1120] dark:text-white">

      {/* HEADER */}
      <div className="px-8 py-6 rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/trainer/live/history")}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <BarChart3 size={22} />
                Attendance Report
              </h2>
              <p className="text-sm opacity-90 mt-1">
                {report?.sessionTitle} • {report?.date} • {report?.time}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleExport}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 flex items-center gap-2"
            >
              <Download size={14} /> Export CSV
            </Button>

            <Button
              onClick={() =>
                navigate(`/trainer/live/full-report/${sessionId}`)
              }
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold flex items-center gap-2"
            >
              <FileText size={14} /> Full Report
            </Button>
          </div>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          {
            label: "Total Attendees",
            value: attendees.length,
            icon: <Users className="text-blue-500" />,
            color: "text-blue-500",
          },
          {
            label: "Completed",
            value: completedCount,
            icon: <CheckCircle2 className="text-green-500" />,
            color: "text-green-500",
          },
          {
            label: "Completion Rate",
            value: `${completionRate}%`,
            icon: <BarChart3 className="text-purple-500" />,
            color: "text-purple-500",
          },
          {
            label: "Avg Watch Time",
            value: `${avgWatchTime}%`,
            icon: <Clock className="text-yellow-500" />,
            color: "text-yellow-500",
          },
          {
            label: "Chat Messages",
            value: totalMessages,
            icon: <MessageCircle className="text-pink-500" />,
            color: "text-pink-500",
          },
        ].map((m) => (
          <Card
            key={m.label}
            className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10"
          >
            <CardContent className="p-5 flex items-center gap-3">
              {m.icon}
              <div>
                <p className={`text-2xl font-bold ${m.color}`}>
                  {m.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {m.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TABLE */}
      <Card className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10">
        <CardContent className="p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                {[
                  "Student",
                  "Joined",
                  "Left",
                  "Duration",
                  "Watch %",
                  "Chat",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((a, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-white/10">
                  <td className="px-4 py-3 font-medium">{a.name}</td>
                  <td className="px-4 py-3">{a.joinTime}</td>
                  <td className="px-4 py-3">{a.leaveTime}</td>
                  <td className="px-4 py-3">{a.duration}</td>
                  <td className="px-4 py-3 font-semibold">{a.watchPercent}%</td>
                  <td className="px-4 py-3">{a.chatMessages}</td>
                  <td className="px-4 py-3">
                    <Badge className={`${statusConfig[a.status].badge} flex items-center gap-1 w-fit`}>
                      {statusConfig[a.status].icon}
                      {statusConfig[a.status].label}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveAttendanceReport;
