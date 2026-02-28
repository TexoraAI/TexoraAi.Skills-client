import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Video,
  Calendar,
  Clock,
  Users,
  BarChart3,
  Play,
  FileText,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LiveSessionHistory = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setSessions([]);
      } catch (error) {
        console.error("Failed to fetch session history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filtered = sessions.filter((s) => {
    const matchSearch = s.title
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-[#0B1120] dark:text-white">

      {/* HEADER */}
      <div className="px-8 py-6 rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/trainer/live")}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Video size={22} />
              Session History
            </h2>
            <p className="text-sm opacity-90 mt-1">
              All your past live sessions in one place
            </p>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <Card className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 mb-6">
        <CardContent className="p-4 flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Search sessions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 bg-white text-black dark:bg-[#1F2937] dark:text-white dark:border-white/10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44 bg-white text-black dark:bg-[#1F2937] dark:text-white dark:border-white/10">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>

            <SelectContent
              position="popper"
              className="z-50 bg-white text-black border border-gray-200 dark:bg-[#111827] dark:text-white dark:border-white/10"
            >
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-500 dark:text-slate-400">
              Loading history...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-slate-500">
              <Video size={40} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium">No sessions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#1F2937]">
                    {[
                      "Session",
                      "Date & Time",
                      "Duration",
                      "Viewers",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#1F2937] transition cursor-pointer"
                      onClick={() =>
                        navigate(`/trainer/live/attendance/${s.id}`)
                      }
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                            <Video size={14} className="text-blue-500" />
                          </div>
                          <div>
                            <p className="font-medium">{s.title}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                              {s.category}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium">{s.date}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">
                          {s.time}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-gray-600 dark:text-slate-300">
                          <Clock size={14} /> {s.duration ?? "—"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-gray-600 dark:text-slate-300">
                          <Users size={14} />
                          <strong>{s.viewers ?? 0}</strong>
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <Badge
                          className={
                            s.status === "completed"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          }
                        >
                          {s.status}
                        </Badge>
                      </td>

                      <td
                        className="px-6 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {s.status === "completed" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs dark:border-white/10"
                              onClick={() =>
                                navigate(`/trainer/live/attendance/${s.id}`)
                              }
                            >
                              <FileText size={12} className="mr-1" />
                              Report
                            </Button>

                            {s.recordingUrl && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs dark:border-white/10"
                              >
                                <Play size={12} className="mr-1" />
                                Replay
                              </Button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveSessionHistory;
