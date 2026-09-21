import React from "react";
import {
  ClipboardList,
  ShieldAlert,
  CheckCircle2,
  Clock,
  User,
  AlertTriangle,
  Activity,
  Database,
  Bell,
  ChevronDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

/* ------------------------------------------------------------------ */
/* DEMO DATA                                                           */
/* ------------------------------------------------------------------ */

const STAT_ROW_1 = [
  {
    icon: ClipboardList,
    label: "Total Audit Events",
    value: "48,291",
    sub: "Today across all services",
    badge: "+12%",
    tone: "up",
    bg: "linear-gradient(135deg,#EFF6FF 0%,#DBEAFE 100%)",
    border: "#BFDBFE",
    iconBg: "linear-gradient(135deg,#3B82F6,#2563EB)",
    dot: "#3B82F6",
  },
  {
    icon: ShieldAlert,
    label: "Total Failures",
    value: "143",
    sub: "Failed actions today",
    badge: "-3%",
    tone: "up", // fewer failures is good
    bg: "linear-gradient(135deg,#FAF5FF 0%,#EDE9FE 100%)",
    border: "#DDD6FE",
    iconBg: "linear-gradient(135deg,#A855F7,#7C3AED)",
    dot: "#8B5CF6",
  },
  {
    icon: CheckCircle2,
    label: "Services Online",
    value: "13/14",
    sub: "1 service degraded",
    badge: "+0%",
    tone: "neutral",
    bg: "linear-gradient(135deg,#F0FDF4 0%,#DCFCE7 100%)",
    border: "#BBF7D0",
    iconBg: "linear-gradient(135deg,#22C55E,#16A34A)",
    dot: "#22C55E",
  },
  {
    icon: Clock,
    label: "Kafka Lag",
    value: "4,200",
    sub: "Messages behind",
    badge: "WARN",
    tone: "warn",
    bg: "linear-gradient(135deg,#F0FDFA 0%,#CCFBF1 100%)",
    border: "#99F6E4",
    iconBg: "linear-gradient(135deg,#14B8A6,#0D9488)",
    dot: "#14B8A6",
  },
];

const STAT_ROW_2 = [
  {
    icon: User,
    label: "Active Actors",
    value: "1,204",
    sub: "Unique users today",
    badge: "+8%",
    tone: "up",
    bg: "linear-gradient(135deg,#FEFCE8 0%,#FEF9C3 100%)",
    border: "#FDE68A",
    iconBg: "linear-gradient(135deg,#FACC15,#EAB308)",
    dot: "#EAB308",
  },
  {
    icon: AlertTriangle,
    label: "Critical Alerts",
    value: "2",
    sub: "Needs attention",
    badge: "CRIT",
    tone: "crit",
    bg: "linear-gradient(135deg,#FEF2F2 0%,#FEE2E2 100%)",
    border: "#FECACA",
    iconBg: "linear-gradient(135deg,#EF4444,#DC2626)",
    dot: "#EF4444",
  },
  {
    icon: Activity,
    label: "Events This Hour",
    value: "3,847",
    sub: "Last 60 minutes",
    badge: "+25%",
    tone: "up",
    bg: "linear-gradient(135deg,#FDF2F8 0%,#FCE7F3 100%)",
    border: "#FBCFE8",
    iconBg: "linear-gradient(135deg,#EC4899,#DB2777)",
    dot: "#EC4899",
  },
  {
    icon: Database,
    label: "Audit DB Size",
    value: "2.4 GB",
    sub: "Growing at 180MB/day",
    badge: "+7%",
    tone: "up",
    bg: "linear-gradient(135deg,#ECFEFF 0%,#CFFAFE 100%)",
    border: "#A5F3FC",
    iconBg: "linear-gradient(135deg,#06B6D4,#0891B2)",
    dot: "#06B6D4",
  },
];

// 30-minute buckets, 6:00 AM -> 6:00 PM (25 points)
const TIME_LABELS = [
  "6 AM",
  "6:30",
  "7 AM",
  "7:30",
  "8 AM",
  "8:30",
  "9 AM",
  "9:30",
  "10 AM",
  "10:30",
  "11 AM",
  "11:30",
  "12 PM",
  "12:30",
  "1 PM",
  "1:30",
  "2 PM",
  "2:30",
  "3 PM",
  "3:30",
  "4 PM",
  "4:30",
  "5 PM",
  "5:30",
  "6 PM",
];
const HOUR_TICKS = TIME_LABELS.filter((_, i) => i % 2 === 0);

const AUTH = [
  420, 510, 640, 780, 960, 1120, 1280, 1350, 1480, 1420, 1390, 1310, 1180, 1120,
  1210, 1290, 1340, 1260, 1180, 1090, 980, 890, 760, 640, 560,
];
const PAYMENT = [
  120, 150, 210, 260, 330, 390, 450, 520, 610, 690, 560, 540, 480, 450, 500,
  540, 570, 530, 490, 450, 400, 360, 300, 240, 190,
];
const COURSE = [
  90, 110, 150, 190, 230, 270, 310, 340, 380, 400, 390, 370, 330, 310, 340, 360,
  380, 350, 320, 290, 250, 220, 180, 140, 110,
];
const ASSESS = [
  40, 55, 80, 110, 150, 190, 230, 260, 300, 320, 310, 290, 240, 220, 250, 280,
  300, 270, 240, 210, 170, 140, 110, 80, 60,
];
const FAILS = [
  2, 3, 3, 4, 5, 5, 6, 7, 9, 46, 18, 9, 7, 6, 7, 8, 8, 7, 6, 6, 5, 4, 4, 3, 2,
];

const SERVICE_DATA = TIME_LABELS.map((t, i) => ({
  time: t,
  "auth-service": AUTH[i],
  "payment-service": PAYMENT[i],
  "course-service": COURSE[i],
  assessment: ASSESS[i],
}));

const FAILURE_DATA = TIME_LABELS.map((t, i) => ({
  time: t,
  failures: FAILS[i],
}));

const SERVICE_LINES = [
  { key: "auth-service", color: "#3B82F6" },
  { key: "payment-service", color: "#8B5CF6" },
  { key: "course-service", color: "#14B8A6" },
  { key: "assessment", color: "#F59E0B" },
];

const TOP_ACTIONS = [
  {
    action: "USER_LOGIN",
    count: 18200,
    label: "18.2k",
    tag: "bg-blue-100 text-blue-700",
    bar: "linear-gradient(90deg,#60A5FA,#3B82F6)",
  },
  {
    action: "COURSE_CREATED",
    count: 4100,
    label: "4.1k",
    tag: "bg-teal-100 text-teal-700",
    bar: "linear-gradient(90deg,#2DD4BF,#14B8A6)",
  },
  {
    action: "PAYMENT_SUCCESS",
    count: 3800,
    label: "3.8k",
    tag: "bg-green-100 text-green-700",
    bar: "linear-gradient(90deg,#4ADE80,#22C55E)",
  },
  {
    action: "ASSESSMENT_SUBMITTED",
    count: 2900,
    label: "2.9k",
    tag: "bg-purple-100 text-purple-700",
    bar: "linear-gradient(90deg,#C084FC,#A855F7)",
  },
  {
    action: "VIDEO_UPLOADED",
    count: 1200,
    label: "1.2k",
    tag: "bg-pink-100 text-pink-700",
    bar: "linear-gradient(90deg,#F472B6,#EC4899)",
  },
];

const CRITICAL_EVENTS = [
  {
    time: "10:32 AM",
    service: "payment-service",
    action: "PAYMENT_FAILED",
    actor: "usr_48213",
    result: "FAILURE",
  },
  {
    time: "10:31 AM",
    service: "payment-service",
    action: "REFUND_PROCESSED",
    actor: "admin_sara",
    result: "SUCCESS",
  },
  {
    time: "10:29 AM",
    service: "auth-service",
    action: "ROLE_CHANGED",
    actor: "superadmin_01",
    result: "SUCCESS",
  },
  {
    time: "10:27 AM",
    service: "payment-service",
    action: "GATEWAY_TIMEOUT",
    actor: "system",
    result: "FAILURE",
  },
  {
    time: "10:24 AM",
    service: "course-service",
    action: "COURSE_DELETED",
    actor: "teacher_249",
    result: "SUCCESS",
  },
];

const TONE_STYLES = {
  up: "bg-white/70 text-emerald-700",
  neutral: "bg-white/70 text-slate-600",
  warn: "bg-amber-100 text-amber-700",
  crit: "bg-red-100 text-red-700",
};

const SUB_NAV = [
  "Overview",
  "Audit Logs",
  "Service Health",
  "Alerts",
  "Metrics",
];

/* ------------------------------------------------------------------ */
/* SMALL COMPONENTS                                                    */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  badge,
  tone,
  bg,
  border,
  iconBg,
  dot,
}) {
  return (
    <div
      className="rounded-2xl p-5 shadow-sm"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
          style={{ background: iconBg }}
        >
          <Icon size={22} strokeWidth={2.2} />
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${TONE_STYLES[tone]}`}
        >
          {badge}
        </span>
      </div>
      <div className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">
        {value}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-700">{label}</div>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: dot }}
        />
        {sub}
      </div>
    </div>
  );
}

function Card({ title, subtitle, children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <div className="mb-1 font-semibold text-slate-800">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-slate-600">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: p.color }}
          />
          {p.name}:{" "}
          <span className="font-semibold text-slate-900">
            {p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

// embedded=true hides the standalone navbar so the page can sit inside AuditSection.
export default function AuditOverviewPage({ embedded = false } = {}) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const maxCount = Math.max(...TOP_ACTIONS.map((a) => a.count));

  return (
    <div
      className={`relative bg-white text-slate-900 ${embedded ? "" : "min-h-screen"}`}
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
    >
      {!embedded && (
        <>
          {/* Thin colored sidebar accent */}
          <div
            className="fixed left-0 top-0 z-30 h-full w-1.5"
            style={{
              background:
                "linear-gradient(180deg,#F97316 0%,#22C55E 50%,#3B82F6 100%)",
            }}
          />

          {/* Top navbar */}
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 pl-6 sm:px-8">
              <div className="flex items-center gap-4">
                <div
                  className="text-xl font-black tracking-tight"
                  style={{
                    background: "linear-gradient(90deg,#F97316,#22C55E)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ILM ORA
                </div>
                <div className="hidden h-6 w-px bg-slate-200 sm:block" />
                <div className="hidden text-sm font-semibold text-slate-700 sm:block">
                  Audit &amp; Monitoring
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden items-center gap-3 text-xs font-semibold md:flex">
                  <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />{" "}
                    24 Active
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-amber-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> 7
                    Pending
                  </span>
                </div>
                <button
                  className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>
                <button className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-slate-100">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg,#F97316,#22C55E)",
                    }}
                  >
                    SA
                  </span>
                  <ChevronDown size={16} className="text-slate-500" />
                </button>
              </div>
            </div>

            {/* Section sub-navigation */}
            <nav
              className="flex gap-1 overflow-x-auto px-4 pl-6 sm:px-8"
              aria-label="Audit & Monitoring"
            >
              {SUB_NAV.map((item, i) => (
                <button
                  key={item}
                  className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                    i === 0
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </header>
        </>
      )}

      <main className="space-y-6 px-4 py-6 pl-6 sm:px-8">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Audit Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">{today}</p>
        </div>

        {/* Rows 1 & 2: stat cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STAT_ROW_1.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </section>
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STAT_ROW_2.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </section>

        {/* Row 3: charts */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card
            title="Events by Service"
            subtitle="Last 12 hours, 30-minute intervals"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={SERVICE_DATA}
                  margin={{ top: 5, right: 8, left: -12, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E8F0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    ticks={HOUR_TICKS}
                    tick={{ fontSize: 11, fill: "#64748B" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748B" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                  />
                  {SERVICE_LINES.map((l) => (
                    <Line
                      key={l.key}
                      type="monotone"
                      dataKey={l.key}
                      stroke={l.color}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card
            title="Failure Rate Trend"
            subtitle="Payment failures spiked at 10:30 AM"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={FAILURE_DATA}
                  margin={{ top: 5, right: 8, left: -12, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="failFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#EF4444"
                        stopOpacity={0.28}
                      />
                      <stop
                        offset="100%"
                        stopColor="#EF4444"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E8F0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    ticks={HOUR_TICKS}
                    tick={{ fontSize: 11, fill: "#64748B" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748B" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="failures"
                    name="Failures"
                    stroke="#EF4444"
                    strokeWidth={2.5}
                    fill="url(#failFill)"
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        {/* Row 4: top actions + critical events */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card
            title="Top Actions Today"
            subtitle="Most frequent audit events across services"
          >
            <ul className="space-y-4">
              {TOP_ACTIONS.map((a) => (
                <li
                  key={a.action}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3"
                >
                  <span
                    className={`w-fit shrink-0 rounded-md px-2.5 py-1 text-[11px] font-bold sm:w-48 sm:text-center ${a.tag}`}
                  >
                    {a.action}
                  </span>
                  <div className="flex flex-1 items-center gap-3">
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(a.count / maxCount) * 100}%`,
                          background: a.bar,
                        }}
                      />
                    </div>
                    <span className="w-12 shrink-0 text-right text-sm font-bold text-slate-800">
                      {a.label}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card
            title="Recent Critical Events"
            subtitle="Latest high-severity audit entries"
          >
            <div className="-mx-5 overflow-x-auto px-5">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500">
                    <th className="pb-2 pr-3 font-semibold">Time</th>
                    <th className="pb-2 pr-3 font-semibold">Service</th>
                    <th className="pb-2 pr-3 font-semibold">Action</th>
                    <th className="pb-2 pr-3 font-semibold">Actor</th>
                    <th className="pb-2 font-semibold">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {CRITICAL_EVENTS.map((e, i) => {
                    const failed = e.result === "FAILURE";
                    return (
                      <tr
                        key={i}
                        className={`border-b border-slate-100 last:border-0 ${failed ? "bg-red-50" : ""}`}
                      >
                        <td className="whitespace-nowrap py-2.5 pl-2 pr-3 text-slate-600">
                          {e.time}
                        </td>
                        <td className="whitespace-nowrap py-2.5 pr-3 font-medium text-slate-800">
                          {e.service}
                        </td>
                        <td className="whitespace-nowrap py-2.5 pr-3 font-mono text-xs text-slate-700">
                          {e.action}
                        </td>
                        <td className="whitespace-nowrap py-2.5 pr-3 text-slate-600">
                          {e.actor}
                        </td>
                        <td className="py-2.5 pr-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                              failed
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {e.result}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
