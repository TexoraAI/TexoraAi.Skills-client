import React, { useState, useEffect } from "react";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Percent,
  ArrowUp,
  ArrowDown,
  User,
  Bell,
  MessageCircle,
  Calendar,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Inbox,
} from "lucide-react";
import { getStudentClassroom } from "@/services/batchService";

/* ═══════════════════════════════════════════════
   MINI CALENDAR COMPONENT
═══════════════════════════════════════════════ */
const MiniCalendar = () => {
  const today = new Date();
  const [current, setCurrent] = useState({
    month: today.getMonth(),
    year: today.getFullYear(),
  });

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const dayNames = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1);
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();

  const prevMonth = () => setCurrent(p => {
    const m = p.month === 0 ? 11 : p.month - 1;
    const y = p.month === 0 ? p.year - 1 : p.year;
    return { month: m, year: y };
  });
  const nextMonth = () => setCurrent(p => {
    const m = p.month === 11 ? 0 : p.month + 1;
    const y = p.month === 11 ? p.year + 1 : p.year;
    return { month: m, year: y };
  });

  const isToday = (d) =>
    d === today.getDate() &&
    current.month === today.getMonth() &&
    current.year === today.getFullYear();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-700 dark:text-white">
          {monthNames[current.month]} {current.year}
        </span>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-zinc-500 transition"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-zinc-500 transition"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {dayNames.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-slate-400 dark:text-zinc-600 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((d, i) => (
          <div key={i} className="flex items-center justify-center py-1">
            {d ? (
              <button
                className={`w-7 h-7 rounded-full text-xs font-medium flex items-center justify-center transition
                  ${isToday(d)
                    ? "bg-violet-600 text-white shadow-sm shadow-violet-200 dark:shadow-violet-900/40 font-bold"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
              >
                {d}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   CHART PLACEHOLDER (bar chart style)
═══════════════════════════════════════════════ */
const EmptyChart = () => (
  <div className="flex items-end justify-center gap-2 h-24 px-4">
    {[30, 50, 20, 70, 40, 60, 35, 55, 25, 45, 65, 30].map((h, i) => (
      <div
        key={i}
        className="flex-1 rounded-t-sm bg-slate-100 dark:bg-white/5"
        style={{ height: `${h}%` }}
      />
    ))}
  </div>
);

/* ═══════════════════════════════════════════════
   MAIN DASHBOARD PAGE
═══════════════════════════════════════════════ */
const DashboardPage = () => {
  const [activeTab, setActiveTab]       = useState("overview");
  const [classroom, setClassroom]       = useState(null);
  const [loading, setLoading]           = useState(true);
  const [chartPeriod, setChartPeriod]   = useState("Annual");

  /* ================= LOAD CLASSROOM — NO LOGIC CHANGE ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getStudentClassroom();
        setClassroom(res.data);
      } catch (e) {
        console.log("Student not assigned yet");
        setClassroom(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ===== STATS ===== */
  const stats = [
    {
      label: "Active Courses",
      value: "0",
      change: "0 this month",
      trend: "up",
      icon: BookOpen,
      gradient: "from-violet-500 to-purple-700",
      accent: "border-l-violet-500",
    },
    {
      label: "Completed Courses",
      value: "0",
      change: "0 completed",
      trend: "up",
      icon: CheckCircle,
      gradient: "from-emerald-400 to-teal-600",
      accent: "border-l-emerald-500",
    },
    {
      label: "Pending Assessments",
      value: "0",
      change: "0 overdue",
      trend: "down",
      icon: Clock,
      gradient: "from-amber-400 to-orange-500",
      accent: "border-l-amber-500",
    },
    {
      label: "Attendance",
      value: "0%",
      change: "No data",
      trend: "up",
      icon: Percent,
      gradient: "from-rose-400 to-pink-600",
      accent: "border-l-sky-500",
    },
  ];

  /* ===== CLASSROOM CARD ===== */
  const ClassroomCard = () => (
    <div className="bg-white dark:bg-[#111111] rounded-2xl p-5 border border-slate-100 dark:border-[#1a1a1a] shadow-sm flex items-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-200 dark:shadow-violet-900/30">
        <User className="text-white h-5 w-5" />
      </div>
      {loading ? (
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white">Loading classroom...</h3>
          <p className="text-sm text-slate-400 dark:text-zinc-500">Please wait</p>
        </div>
      ) : classroom ? (
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white">{classroom.batchName}</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Trainer: {classroom.trainerName}</p>
          <p className="text-xs text-slate-400 dark:text-zinc-500">{classroom.trainerEmail}</p>
        </div>
      ) : (
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white">No Classroom Assigned</h3>
          <p className="text-sm text-slate-400 dark:text-zinc-500">Waiting for admin to assign trainer</p>
        </div>
      )}
    </div>
  );

  /* ===== OVERVIEW ===== */
  const OverviewPage = () => (
    <div className="space-y-5">
      {/* Classroom */}
      <ClassroomCard />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item) => {
          const Icon      = item.icon;
          const TrendIcon = item.trend === "up" ? ArrowUp : ArrowDown;
          return (
            <div
              key={item.label}
              className={`rounded-2xl border-l-4 ${item.accent} border border-slate-100 dark:border-[#1a1a1a] bg-white dark:bg-[#111111] p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-default`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                  {item.label}
                </p>
                <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-sm`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {item.value}
              </p>
              <div className="flex items-center gap-1 text-[12px] mt-2 text-slate-400 dark:text-zinc-500">
                <TrendIcon className="h-3 w-3" />
                {item.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── ROW 2: Chart + Notifications ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Total Users Chart — 2/3 width */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111111] rounded-2xl border border-slate-100 dark:border-[#1a1a1a] shadow-sm p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-0.5">
                Total Users
              </p>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-500">0% vs last period</span>
              </div>
            </div>
            {/* Period tabs */}
            <div className="flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
              {["Today","Weekly","Monthly","Annual"].map(p => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150
                    ${chartPeriod === p
                      ? "bg-white dark:bg-[#1a1a1a] text-violet-600 dark:text-violet-400 shadow-sm"
                      : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Chart area */}
          <div className="relative">
            <EmptyChart />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-slate-400 dark:text-zinc-600 font-medium">No chart data available</p>
            </div>
          </div>
        </div>

        {/* Notifications — 1/3 width */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-100 dark:border-[#1a1a1a] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-violet-500" />
              <p className="text-sm font-semibold text-slate-700 dark:text-white">Notifications & Update</p>
            </div>
            <button className="text-slate-400 dark:text-zinc-600 hover:text-slate-600 dark:hover:text-zinc-400 transition">
              <MoreHorizontal size={15} />
            </button>
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-3">
              <Bell className="h-5 w-5 text-slate-300 dark:text-zinc-700" />
            </div>
            <p className="text-sm text-slate-400 dark:text-zinc-600">No notifications yet</p>
            <p className="text-xs text-slate-300 dark:text-zinc-700 mt-1">You're all caught up!</p>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Calendar + Latest Message ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Schedule / Calendar */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-100 dark:border-[#1a1a1a] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-violet-500" />
              <p className="text-sm font-semibold text-slate-700 dark:text-white">Schedule</p>
            </div>
            <button className="text-slate-400 dark:text-zinc-600 hover:text-slate-600 dark:hover:text-zinc-400 transition">
              <MoreHorizontal size={15} />
            </button>
          </div>
          <MiniCalendar />
        </div>

        {/* Latest Message */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-100 dark:border-[#1a1a1a] shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-violet-500" />
              <p className="text-sm font-semibold text-slate-700 dark:text-white">Latest Message</p>
            </div>
            <button className="text-slate-400 dark:text-zinc-600 hover:text-slate-600 dark:hover:text-zinc-400 transition">
              <MoreHorizontal size={15} />
            </button>
          </div>

          {/* Empty state */}
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-3">
              <MessageCircle className="h-5 w-5 text-slate-300 dark:text-zinc-700" />
            </div>
            <p className="text-sm text-slate-400 dark:text-zinc-600">No messages yet</p>
          </div>

          {/* Go to Inbox */}
          <div className="mt-auto pt-3 border-t border-slate-100 dark:border-[#1a1a1a]">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition">
              <Inbox size={14} />
              Go to Inbox
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const CoursesPage = () => (
    <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 border border-slate-100 dark:border-[#1a1a1a] shadow-sm">
      <h2 className="text-lg font-bold mb-1 text-slate-800 dark:text-white">My Courses</h2>
      <p className="text-sm text-slate-400 dark:text-zinc-500">Courses will appear here</p>
    </div>
  );

  const ProgressPage = () => (
    <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 border border-slate-100 dark:border-[#1a1a1a] shadow-sm">
      <h2 className="text-lg font-bold mb-2 text-slate-800 dark:text-white">Learning Progress</h2>
      <p className="text-sm text-slate-400 dark:text-zinc-500">Progress will appear here</p>
    </div>
  );

  /* ===== ROOT ===== */
  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HERO */}
        <div
          className="rounded-3xl p-8 text-white relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 30%, #ec4899 60%, #f97316 100%)",
          }}
        >
          {/* Warm glow top-left */}
          <div
            className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #fbbf24, transparent 70%)", transform: "translate(-30%, -30%)" }}
          />
          {/* Mint glow bottom-right */}
          <div
            className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-15 pointer-events-none"
            style={{ background: "radial-gradient(circle, #34d399, transparent 70%)", transform: "translate(30%, 30%)" }}
          />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-1">
                Student Portal
              </p>
              <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
              <p className="text-sm text-white/65 mt-1 font-normal">
                Your classroom & learning overview
              </p>
            </div>

            <div className="flex bg-black/20 backdrop-blur-sm border border-white/15 p-1 rounded-2xl gap-0.5">
              {["overview", "courses", "progress"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-xl text-sm capitalize font-medium transition-all duration-200
                    ${activeTab === tab
                      ? "bg-white text-violet-600 shadow-sm"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeTab === "overview"  && <OverviewPage />}
        {activeTab === "courses"   && <CoursesPage />}
        {activeTab === "progress"  && <ProgressPage />}
      </div>
    </div>
  );
};

export default DashboardPage;