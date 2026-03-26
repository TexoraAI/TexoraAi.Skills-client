import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTrainerBatchStudents } from "../services/batchService";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Users, GraduationCap, Search, Mail } from "lucide-react";

const TrainerClassroomPage = () => {
  const { batchId } = useParams();
  const [students, setStudents] = useState([]);

  // ── UI-only state ──────────────────────────────────────
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await getTrainerBatchStudents(batchId);
      setStudents(res.data || []);
    };
    load();
  }, [batchId]);

  // UI-only derived value — no logic change
  const filtered = students.filter((email) =>
    email.toLowerCase().includes(search.toLowerCase()),
  );

  // Unique avatar color per student (UI only)
  const avatarColors = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-amber-600",
    "from-pink-500 to-rose-600",
    "from-indigo-500 to-blue-600",
    "from-teal-500 to-green-600",
    "from-red-500 to-orange-600",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] p-6">
      {/* ── HERO HEADER ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-xl">
        {/* decorative blobs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative px-8 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <GraduationCap size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Classroom Students
              </h1>
              <p className="text-sm text-blue-100 mt-0.5">
                Batch ID: {batchId}
              </p>
            </div>
          </div>

          {/* stat pill */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2.5 w-fit">
            <Users size={16} />
            <span className="text-sm font-semibold">
              {students.length} Student{students.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* ── STUDENTS CARD ───────────────────────────────── */}
      <Card className="shadow-sm border border-gray-200 dark:border-gray-800 dark:bg-[#111827]">
        <CardContent className="p-0">
          {/* Card header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-indigo-500" />
              <h2 className="font-semibold text-gray-800 dark:text-white">
                Enrolled Students
              </h2>
              <span className="ml-1 text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 rounded-full px-2.5 py-0.5">
                {students.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Search — UI only */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#1F2937] rounded-xl px-3 py-1.5 text-sm">
                <Search size={13} className="text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student..."
                  className="bg-transparent outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 w-36"
                />
              </div>

              {/* Collapse / Expand arrow — UI only */}
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                title={isOpen ? "Collapse" : "Expand"}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1F2937] hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <ChevronDown
                  size={15}
                  className={`text-gray-500 transition-transform duration-300 ${
                    isOpen ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Student list — collapses/expands */}
          {isOpen && (
            <div className="p-4">
              {students.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
                    <Users size={30} className="text-indigo-400" />
                  </div>
                  <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg">
                    No students yet
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Students assigned to this batch will appear here.
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                  No students match "{search}"
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filtered.map((email, i) => {
                    const name = email.split("@")[0];
                    const initials = name
                      .split(/[._-]/)
                      .map((p) => p[0]?.toUpperCase() ?? "")
                      .slice(0, 2)
                      .join("");
                    const colorClass =
                      avatarColors[i % avatarColors.length];

                    return (
                      <div
                        key={email}
                        className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1F2937] hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
                      >
                        {/* Avatar */}
                        <div
                          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}
                        >
                          {initials || name[0]?.toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 dark:text-white capitalize truncate text-sm">
                            {name.replace(/[._-]/g, " ")}
                          </p>
                          <p className="flex items-center gap-1 text-xs text-gray-400 truncate mt-0.5">
                            <Mail size={11} />
                            {email}
                          </p>
                        </div>

                        {/* Index badge */}
                        <span className="ml-auto text-xs text-gray-300 dark:text-gray-600 font-mono flex-shrink-0">
                          #{String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Footer count */}
              {filtered.length > 0 && (
                <p className="text-xs text-gray-400 mt-4 px-1">
                  Showing {filtered.length} of {students.length} students
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerClassroomPage;