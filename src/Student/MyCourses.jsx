
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ICONS
import {
  FaAward,
  FaBookOpen,
  FaChartLine,
  FaChevronRight,
  FaGraduationCap,
  FaSearch,
  FaUser,
} from "react-icons/fa";

const API =  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});

const MyCourses = () => {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/courses/student`, { headers: authHeader() })
      .then((res) => setCourses(res.data))
      .catch(console.error);
  }, []);

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  // Stats (placeholder – backend same)
  const totalCourses = courses.length;
  const inProgressCourses = courses.length;
  const completedCourses = 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ================= LIGHT BLUE HERO ================= */}
      <header
        className="relative overflow-hidden
        bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400
        dark:from-sky-600 dark:via-blue-600 dark:to-indigo-600"
      >
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />

        <div className="relative px-6 py-10 md:py-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* LEFT */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/30 backdrop-blur border border-white/30 mb-4">
                <FaGraduationCap className="h-3.5 w-3.5 text-white" />
                <span className="text-[11px] font-semibold text-white uppercase tracking-wider">
                  Learning Dashboard
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                My Courses
              </h1>

              <p className="text-sm md:text-base text-white/90 mb-5 max-w-xl">
                Continue your learning journey and track your progress
              </p>

              {/* STATS */}
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                <Stat
                  icon={<FaBookOpen />}
                  label="Enrolled"
                  value={totalCourses}
                />
                <Stat
                  icon={<FaChartLine />}
                  label="In Progress"
                  value={inProgressCourses}
                />
                <Stat
                  icon={<FaAward />}
                  label="Completed"
                  value={completedCourses}
                />
              </div>
            </div>

            {/* RIGHT ICON */}
            <div className="hidden lg:block">
              <div className="w-40 h-40 rounded-xl bg-white/30 backdrop-blur border border-white/30 flex items-center justify-center shadow">
                <FaBookOpen className="h-14 w-14 text-white/90" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= SEARCH ================= */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-12 pr-4 py-3 rounded-xl
                         bg-white dark:bg-slate-900
                         border border-slate-200 dark:border-slate-700
                         text-slate-900 dark:text-slate-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ================= COURSES GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="group p-6 rounded-2xl
                         bg-white dark:bg-slate-900
                         border border-slate-200 dark:border-slate-800
                         shadow-sm hover:shadow-xl
                         transition-all hover:-translate-y-1
                         flex flex-col"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-4">
                <h2
                  className="text-lg font-bold
                               text-slate-900 dark:text-slate-100
                               group-hover:text-blue-600 transition-colors
                               line-clamp-2"
                >
                  {course.title}
                </h2>
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <FaBookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

              {/* INSTRUCTOR */}
              <div
                className="flex items-center gap-2 mb-4 pb-3
                              border-b border-slate-200 dark:border-slate-700"
              >
                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <FaUser className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
                <p
                  className="text-sm font-semibold
                              text-slate-900 dark:text-slate-100 truncate"
                >
                  {course.createdBy}
                </p>
              </div>

              {/* CATEGORY */}
              <span
                className="inline-flex w-fit px-3 py-1.5 mb-4
                               text-xs font-semibold rounded-lg
                               bg-blue-100 dark:bg-blue-900/30
                               text-blue-700 dark:text-blue-300"
              >
                {course.category || "General"}
              </span>

              {/* PROGRESS */}
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Progress
                  </span>
                  <span className="text-xs font-bold text-blue-600">0%</span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full mb-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full"
                    style={{ width: "0%" }}
                  />
                </div>

                <button
                  onClick={() => navigate(`/student/course/${course.id}`)}
                  className="w-full inline-flex items-center justify-center gap-2
                             py-3 px-4 rounded-xl
                             bg-blue-600 hover:bg-blue-700
                             text-white font-semibold transition"
                >
                  View Course
                  <FaChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16">
              <FaBookOpen className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                {search ? "No courses found" : "No courses enrolled"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ================= STAT =================
const Stat = ({ icon, label, value }) => (
  <div
    className="flex items-center gap-2 px-4 py-2
                  rounded-xl bg-white/30 backdrop-blur
                  border border-white/30 text-white shadow"
  >
    <div className="text-lg">{icon}</div>
    <div>
      <p className="text-lg font-bold leading-none">{value}</p>
      <p className="text-[11px] text-white/80">{label}</p>
    </div>
  </div>
);

export default MyCourses;
