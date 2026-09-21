import React, { useState } from "react";
import {
  Bell,
  ChevronDown,
  RefreshCw,
  Timer,
  TrendingUp,
  Activity,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* DEMO DATA                                                           */
/* ------------------------------------------------------------------ */

const SUB_NAV = [
  "Overview",
  "Audit Logs",
  "Service Health",
  "Alerts",
  "Metrics",
];

const ok = (action, actor, time) => ({
  action,
  actor,
  time,
  result: "SUCCESS",
});
const bad = (action, actor, time) => ({
  action,
  actor,
  time,
  result: "FAILURE",
});

const SERVICES = [
  {
    name: "auth-service",
    port: 8081,
    status: "UP",
    response: "142ms",
    uptime: "99.9%",
    events: "18.2k events today",
    issues: "43 failures",
    hasIssues: true,
    lastIssue: "10:41 AM",
    recent: [
      ok("USER_LOGIN", "student@ilmora.com", "10:42 AM"),
      bad("USER_LOGIN", "unknown@test.com", "10:41 AM"),
      ok("USER_LOGOUT", "ravi@ilmora.com", "10:40 AM"),
    ],
  },
  {
    name: "payment-service",
    port: 8082,
    status: "DEGRADED",
    response: "890ms",
    uptime: "97.2%",
    events: "12.4k events today",
    issues: "89 failures",
    hasIssues: true,
    lastIssue: "10:41 AM",
    recent: [
      bad("PAYMENT_FAILED", "ravi@ilmora.com", "10:41 AM"),
      ok("PAYMENT_SUCCESS", "priya@ilmora.com", "10:40 AM"),
      bad("PAYMENT_FAILED", "kumar@ilmora.com", "10:38 AM"),
    ],
  },
  {
    name: "course-service",
    port: 8083,
    status: "UP",
    response: "98ms",
    uptime: "99.8%",
    events: "8.7k events today",
    issues: "0 failures",
    hasIssues: false,
    lastIssue: "None today",
    recent: [
      ok("COURSE_CREATED", "instructor@ilmora.com", "10:41 AM"),
      ok("COURSE_UPDATED", "instructor@ilmora.com", "10:38 AM"),
      ok("COURSE_UPDATED", "instructor2@ilmora.com", "10:33 AM"),
    ],
  },
  {
    name: "batch-service",
    port: 8084,
    status: "UP",
    response: "55ms",
    uptime: "100%",
    events: "2.1k events today",
    issues: "0 failures",
    hasIssues: false,
    lastIssue: "None today",
    recent: [
      ok("BATCH_CREATED", "admin@ilmora.com", "10:40 AM"),
      ok("BATCH_STUDENT_ADDED", "admin@ilmora.com", "10:36 AM"),
      ok("BATCH_STUDENT_ADDED", "admin@ilmora.com", "10:35 AM"),
    ],
  },
  {
    name: "assessment",
    port: 8085,
    status: "UP",
    response: "210ms",
    uptime: "99.5%",
    events: "5.8k events today",
    issues: "0 failures",
    hasIssues: false,
    lastIssue: "None today",
    recent: [
      ok("ASSESSMENT_SUBMITTED", "student2@ilmora.com", "10:41 AM"),
      ok("ASSESSMENT_GRADED", "instructor@ilmora.com", "10:37 AM"),
      ok("ASSESSMENT_SUBMITTED", "student@ilmora.com", "10:34 AM"),
    ],
  },
  {
    name: "attendance-service",
    port: 8086,
    status: "UP",
    response: "77ms",
    uptime: "99.9%",
    events: "3.2k events today",
    issues: "0 failures",
    hasIssues: false,
    lastIssue: "None today",
    recent: [
      ok("ATTENDANCE_MARKED", "instructor2@ilmora.com", "10:40 AM"),
      ok("ATTENDANCE_MARKED", "instructor@ilmora.com", "10:31 AM"),
      ok("ATTENDANCE_MARKED", "instructor2@ilmora.com", "10:22 AM"),
    ],
  },
  {
    name: "file-service",
    port: 8087,
    status: "UP",
    response: "320ms",
    uptime: "99.1%",
    events: "1.8k events today",
    issues: "0 failures",
    hasIssues: false,
    lastIssue: "None today",
    recent: [
      ok("FILE_UPLOADED", "student@ilmora.com", "10:39 AM"),
      ok("FILE_UPLOADED", "student3@ilmora.com", "10:28 AM"),
      ok("FILE_DELETED", "instructor@ilmora.com", "10:15 AM"),
    ],
  },
  {
    name: "live-session-service",
    port: 8088,
    status: "UP",
    response: "88ms",
    uptime: "100%",
    events: "0.9k events today",
    issues: "0 failures",
    hasIssues: false,
    lastIssue: "None today",
    recent: [
      ok("LIVE_SESSION_STARTED", "instructor@ilmora.com", "10:39 AM"),
      ok("LIVE_SESSION_ENDED", "instructor2@ilmora.com", "10:12 AM"),
      ok("LIVE_SESSION_STARTED", "instructor2@ilmora.com", "9:05 AM"),
    ],
  },
  {
    name: "video-service",
    port: 8089,
    status: "UP",
    response: "450ms",
    uptime: "98.8%",
    events: "3.1k events today",
    issues: "11 slow jobs",
    hasIssues: true,
    lastIssue: "10:18 AM (slow job)",
    recent: [
      ok("VIDEO_TRANSCRIBED", "system", "10:40 AM"),
      ok("VIDEO_UPLOADED", "instructor@ilmora.com", "10:29 AM"),
      ok("VIDEO_TRANSCRIBED", "system", "10:18 AM"),
    ],
  },
  {
    name: "audit-service",
    port: 8090,
    status: "DEGRADED",
    response: "44ms",
    uptime: "99.9%",
    events: "— (self)",
    issues: "lag: 4200 msgs",
    hasIssues: true,
    lastIssue: "Lag rising since 10:20 AM",
    recent: [
      ok("AUDIT_EVENT_INGESTED", "system", "10:42 AM"),
      ok("AUDIT_LOGS_EXPORTED", "superadmin_01", "10:30 AM"),
      ok("AUDIT_LOGS_QUERIED", "superadmin_01", "10:26 AM"),
    ],
  },
  {
    name: "notification-service",
    port: 8091,
    status: "UP",
    response: "61ms",
    uptime: "100%",
    events: "0.5k events today",
    issues: "0 failures",
    hasIssues: false,
    lastIssue: "None today",
    recent: [
      ok("NOTIFICATION_SENT", "system", "10:41 AM"),
      ok("NOTIFICATION_SENT", "system", "10:38 AM"),
      ok("NOTIFICATION_SENT", "system", "10:35 AM"),
    ],
  },
  {
    name: "chat-service",
    port: 8092,
    status: "UP",
    response: "44ms",
    uptime: "100%",
    events: "0.7k events today",
    issues: "0 failures",
    hasIssues: false,
    lastIssue: "None today",
    recent: [
      ok("CHAT_MESSAGE_SENT", "student@ilmora.com", "10:40 AM"),
      ok("CHAT_ROOM_CREATED", "instructor@ilmora.com", "10:22 AM"),
      ok("CHAT_MESSAGE_SENT", "priya@ilmora.com", "10:19 AM"),
    ],
  },
  {
    name: "user-service",
    port: 8093,
    status: "UP",
    response: "120ms",
    uptime: "99.7%",
    events: "4.1k events today",
    issues: "0 failures",
    hasIssues: false,
    lastIssue: "None today",
    recent: [
      ok("USER_PROFILE_UPDATED", "student3@ilmora.com", "10:39 AM"),
      ok("USER_REGISTERED", "newuser@ilmora.com", "10:31 AM"),
      ok("USER_PROFILE_UPDATED", "priya@ilmora.com", "10:24 AM"),
    ],
  },
  {
    name: "api-gateway",
    port: 8080,
    status: "UP",
    response: "12ms",
    uptime: "100%",
    events: "all traffic",
    issues: "0 failures",
    hasIssues: false,
    lastIssue: "None today",
    recent: [
      ok("ROUTE_FORWARDED", "system", "10:42 AM"),
      ok("RATE_LIMIT_CHECKED", "system", "10:42 AM"),
      ok("ROUTE_FORWARDED", "system", "10:42 AM"),
    ],
  },
];

const KAFKA_TOPICS = [
  {
    topic: "lms-audit-events",
    partitions: 14,
    rate: "320/sec",
    lag: 4200,
    status: "WARN",
  },
  {
    topic: "lms-notifications",
    partitions: 8,
    rate: "85/sec",
    lag: 0,
    status: "OK",
  },
  {
    topic: "lms-live-session",
    partitions: 4,
    rate: "12/sec",
    lag: 0,
    status: "OK",
  },
  {
    topic: "lms-payment-events",
    partitions: 6,
    rate: "45/sec",
    lag: 0,
    status: "OK",
  },
  {
    topic: "lms-course-events",
    partitions: 6,
    rate: "28/sec",
    lag: 0,
    status: "OK",
  },
];

const STATUS_STYLES = {
  UP: {
    badge: "bg-green-100 text-green-700",
    dot: "#22C55E",
    border: "#E2E8F0",
  },
  DEGRADED: {
    badge: "bg-yellow-100 text-yellow-800",
    dot: "#EAB308",
    border: "#FDE68A",
  },
  DOWN: { badge: "bg-red-100 text-red-700", dot: "#EF4444", border: "#FECACA" },
};

/* ------------------------------------------------------------------ */
/* SMALL COMPONENTS                                                    */
/* ------------------------------------------------------------------ */

function AppHeader({ active }) {
  return (
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
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> 24
              Active
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
              style={{ background: "linear-gradient(135deg,#F97316,#22C55E)" }}
            >
              SA
            </span>
            <ChevronDown size={16} className="text-slate-500" />
          </button>
        </div>
      </div>
      <nav
        className="flex gap-1 overflow-x-auto px-4 pl-6 sm:px-8"
        aria-label="Audit & Monitoring"
      >
        {SUB_NAV.map((item) => (
          <button
            key={item}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              item === active
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
}

function SummaryPill({ count, label, bg, border, color, dot }) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 shadow-sm"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: dot }} />
      <span className="text-sm font-extrabold" style={{ color }}>
        {count}
      </span>
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
}

function Metric({ icon: Icon, value, label }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-slate-400">
        <Icon size={13} />
        <span className="text-[11px] font-medium">{label}</span>
      </div>
      <div className="mt-1 text-sm font-bold text-slate-900">{value}</div>
    </div>
  );
}

function ServiceCard({ svc, expanded, onToggle }) {
  const st = STATUS_STYLES[svc.status];
  const panelId = `panel-${svc.name}`;
  return (
    <div
      className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
      style={{ border: `1px solid ${st.border}` }}
    >
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="w-full p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-300"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-bold text-slate-900">
              {svc.name}
            </div>
            <div className="mt-0.5 text-xs text-slate-500">Port {svc.port}</div>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${st.badge}`}
            >
              {svc.status}
            </span>
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: st.dot }}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <Metric icon={Timer} value={`${svc.response} avg`} label="Response" />
          <Metric icon={TrendingUp} value={svc.uptime} label="Uptime" />
          <Metric
            icon={Activity}
            value={svc.events.replace(" events today", "")}
            label={
              svc.events.includes("events today") ? "Events today" : "Events"
            }
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span
            className={
              svc.hasIssues ? "font-semibold text-red-600" : "text-slate-500"
            }
          >
            {svc.issues}
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            {expanded ? "Hide details" : "View details"}
            <ChevronDown
              size={14}
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </span>
        </div>
      </button>

      {expanded && (
        <div
          id={panelId}
          className="border-t border-slate-100 bg-slate-50/70 px-5 py-4"
        >
          <div className="text-xs font-semibold text-slate-500">
            Recent audit actions
          </div>
          <ul className="mt-2 divide-y divide-slate-200">
            {svc.recent.map((r, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${r.result === "FAILURE" ? "bg-red-500" : "bg-green-500"}`}
                  />
                  <span className="truncate font-mono text-xs font-medium text-slate-800">
                    {r.action}
                  </span>
                  <span className="hidden truncate text-xs text-slate-500 sm:inline">
                    {r.actor}
                  </span>
                </div>
                <span className="shrink-0 text-xs text-slate-500">
                  {r.time}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200">
              <div className="text-[11px] font-medium text-slate-500">
                Issues today
              </div>
              <div
                className={`mt-0.5 text-sm font-bold ${svc.hasIssues ? "text-red-600" : "text-slate-900"}`}
              >
                {svc.issues}
              </div>
            </div>
            <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200">
              <div className="text-[11px] font-medium text-slate-500">
                Last issue
              </div>
              <div className="mt-0.5 text-sm font-bold text-slate-900">
                {svc.lastIssue}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

// embedded=true hides the standalone navbar so the page can sit inside AuditSection.
export default function ServiceHealthPage({ embedded = false } = {}) {
  const [expanded, setExpanded] = useState(null); // service name or null
  const [lastChecked, setLastChecked] = useState("10:42 AM");
  const [refreshing, setRefreshing] = useState(false);

  const healthy = SERVICES.filter((s) => s.status === "UP").length;
  const degraded = SERVICES.filter((s) => s.status === "DEGRADED").length;
  const offline = SERVICES.filter((s) => s.status === "DOWN").length;

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => {
      setLastChecked(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      );
      setRefreshing(false);
    }, 700);
  };

  return (
    <div
      className={`relative bg-white text-slate-900 ${embedded ? "" : "min-h-screen"}`}
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
    >
      {!embedded && (
        <>
          <div
            className="fixed left-0 top-0 z-30 h-full w-1.5"
            style={{
              background:
                "linear-gradient(180deg,#F97316 0%,#22C55E 50%,#3B82F6 100%)",
            }}
          />
          <AppHeader active="Service Health" />
        </>
      )}

      <main className="space-y-6 px-4 py-6 pl-6 sm:px-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Service Health
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Live status of every service that writes to the audit trail
          </p>
        </div>

        {/* Section 1: summary bar */}
        <section className="flex flex-wrap items-center gap-3">
          <SummaryPill
            count={healthy}
            label="healthy"
            bg="linear-gradient(135deg,#F0FDF4,#DCFCE7)"
            border="#BBF7D0"
            color="#15803D"
            dot="#22C55E"
          />
          <SummaryPill
            count={degraded}
            label="degraded"
            bg="linear-gradient(135deg,#FEF2F2,#FEE2E2)"
            border="#FECACA"
            color="#B91C1C"
            dot="#EF4444"
          />
          <SummaryPill
            count={offline}
            label="offline"
            bg="linear-gradient(135deg,#F8FAFC,#F1F5F9)"
            border="#E2E8F0"
            color="#475569"
            dot="#94A3B8"
          />
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-slate-500">
              Last checked: {lastChecked}
            </span>
            <button
              onClick={refresh}
              aria-label="Refresh service status"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
          </div>
        </section>

        {/* Section 2: services grid */}
        <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
          {SERVICES.map((svc) => (
            <ServiceCard
              key={svc.name}
              svc={svc}
              expanded={expanded === svc.name}
              onToggle={() =>
                setExpanded(expanded === svc.name ? null : svc.name)
              }
            />
          ))}
        </section>

        {/* Section 3: Kafka topic health */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">
              Kafka Topic Health
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Consumer lag per topic. Lag above 500 messages raises a warning.
            </p>
          </div>
          <div className="-mx-5 overflow-x-auto px-5">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="pb-2 pr-3 font-semibold">Topic</th>
                  <th className="pb-2 pr-3 font-semibold">Partitions</th>
                  <th className="pb-2 pr-3 font-semibold">Messages/sec</th>
                  <th className="pb-2 pr-3 font-semibold">Consumer Lag</th>
                  <th className="pb-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {KAFKA_TOPICS.map((t) => {
                  const warn = t.status === "WARN";
                  return (
                    <tr
                      key={t.topic}
                      className={`border-b border-slate-100 last:border-0 ${warn ? "bg-yellow-50" : ""}`}
                    >
                      <td className="whitespace-nowrap py-3 pl-2 pr-3 font-mono text-xs font-medium text-slate-800">
                        {t.topic}
                      </td>
                      <td className="py-3 pr-3 text-slate-600">
                        {t.partitions}
                      </td>
                      <td className="py-3 pr-3 text-slate-600">{t.rate}</td>
                      <td
                        className={`py-3 pr-3 font-semibold ${t.lag > 0 ? "text-amber-700" : "text-slate-600"}`}
                      >
                        {t.lag.toLocaleString()}
                      </td>
                      <td className="py-3 pr-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${warn ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-700"}`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
