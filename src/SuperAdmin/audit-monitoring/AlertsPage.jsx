import React, { useState, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  Check,
  SlidersHorizontal,
  Settings,
  X,
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

const INITIAL_ALERTS = [
  {
    id: "alert_1",
    severity: "critical",
    title: "High payment failure rate",
    description:
      "89 failures in last 1h on payment-service. Threshold is 20. Possible gateway issue with Razorpay. Immediate action needed.",
    service: "payment-service",
    timeAgo: "7 mins ago",
    resolved: false,
    logFilter: {
      service: "payment-service",
      action: "PAYMENT_FAILED",
      result: "FAILURE",
      range: "Last 1 Hour",
    },
  },
  {
    id: "alert_2",
    severity: "critical",
    title: "Brute force login attempts detected",
    description:
      "43 failed login attempts from IP 45.33.32.156 in 10 minutes on auth-service. Possible brute force attack. Consider blocking IP.",
    service: "auth-service",
    timeAgo: "10 mins ago",
    resolved: false,
    logFilter: {
      service: "auth-service",
      action: "USER_LOGIN",
      result: "FAILURE",
      range: "Last 1 Hour",
      ip: "45.33.32.156",
    },
  },
  {
    id: "alert_3",
    severity: "warning",
    title: "Kafka consumer lag rising — audit-service",
    description:
      "Consumer lag on lms-audit-events topic reached 4,200 messages. Normal threshold is 500. Audit events may be delayed. Check audit-service pod health.",
    service: "audit-service",
    timeAgo: "22 mins ago",
    resolved: false,
    logFilter: {
      service: "audit-service",
      action: "All Actions",
      result: "All Results",
      range: "Last 1 Hour",
    },
  },
  {
    id: "alert_4",
    severity: "info",
    title: "Video transcription slow job — resolved",
    description:
      "Video/vid_08 transcription took 4m 12s. Threshold is 3 minutes. Job completed successfully. No action needed.",
    service: "video-service",
    timeAgo: "47 mins ago",
    resolved: true,
    logFilter: {
      service: "video-service",
      action: "VIDEO_TRANSCRIBED",
      result: "SUCCESS",
      range: "Last 1 Hour",
    },
  },
];

const RULES = [
  {
    rule: "Payment failures > 20/hour",
    severity: "CRITICAL",
    notify: ["Slack", "Email"],
  },
  {
    rule: "Login failures > 30/10min",
    severity: "CRITICAL",
    notify: ["Slack", "Email"],
  },
  { rule: "Kafka lag > 500 messages", severity: "WARNING", notify: ["Slack"] },
  { rule: "Service response > 1000ms", severity: "WARNING", notify: ["Email"] },
  {
    rule: "Any service DOWN",
    severity: "CRITICAL",
    notify: ["Slack", "Email", "SMS"],
  },
];

const HISTORY = [
  {
    date: "Sep 19, 2026",
    alert: "Payment gateway timeout",
    service: "payment-service",
    severity: "CRITICAL",
    duration: "34 min",
    resolved: "Sep 19, 4:12 PM",
  },
  {
    date: "Sep 18, 2026",
    alert: "Kafka consumer lag rising",
    service: "audit-service",
    severity: "WARNING",
    duration: "1h 20m",
    resolved: "Sep 18, 11:50 AM",
  },
  {
    date: "Sep 17, 2026",
    alert: "Service response above 1000ms",
    service: "file-service",
    severity: "WARNING",
    duration: "18 min",
    resolved: "Sep 17, 2:35 PM",
  },
  {
    date: "Sep 15, 2026",
    alert: "Brute force login attempts",
    service: "auth-service",
    severity: "CRITICAL",
    duration: "26 min",
    resolved: "Sep 15, 9:48 PM",
  },
  {
    date: "Sep 14, 2026",
    alert: "Service DOWN",
    service: "notification-service",
    severity: "CRITICAL",
    duration: "6 min",
    resolved: "Sep 14, 8:16 AM",
  },
];

const SEVERITY_STYLES = {
  critical: {
    border: "#EF4444",
    iconBg: "#FEE2E2",
    iconColor: "#DC2626",
    Icon: AlertTriangle,
  },
  warning: {
    border: "#EAB308",
    iconBg: "#FEF9C3",
    iconColor: "#A16207",
    Icon: AlertCircle,
  },
  info: {
    border: "#3B82F6",
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
    Icon: Info,
  },
};

const SEVERITY_PILL = {
  CRITICAL: "bg-red-100 text-red-700",
  WARNING: "bg-yellow-100 text-yellow-800",
};

const CHANNEL_PILL = {
  Slack: "bg-purple-100 text-purple-700",
  Email: "bg-blue-100 text-blue-700",
  SMS: "bg-teal-100 text-teal-700",
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

function CountBadge({ count, label, className }) {
  return (
    <span
      className={`rounded-full px-3.5 py-1.5 text-sm font-bold ${className}`}
    >
      {count} {label}
    </span>
  );
}

function AlertCard({ alert, onViewLogs, onDismiss }) {
  const s = SEVERITY_STYLES[alert.severity];
  const Icon = s.Icon;
  return (
    <article
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${alert.resolved ? "opacity-70" : ""}`}
      style={{ borderLeft: `4px solid ${s.border}` }}
    >
      <div className="flex gap-3.5">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: s.iconBg, color: s.iconColor }}
        >
          <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[14px] font-bold text-slate-900">
              {alert.title}
            </h3>
            {alert.resolved && (
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-bold text-green-700">
                RESOLVED
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
            {alert.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {alert.service}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock size={13} /> {alert.timeAgo}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => onViewLogs(alert)}
                className="h-8 rounded-lg px-3.5 text-xs font-bold text-white shadow-sm transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-orange-300"
                style={{
                  background: "linear-gradient(135deg,#F97316,#EA580C)",
                }}
              >
                View Logs
              </button>
              <button
                onClick={() => onDismiss(alert.id)}
                className="h-8 rounded-lg border border-slate-300 bg-white px-3.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

// Optional prop: onViewLogs(filter) lets you wire real navigation later.
export default function AlertsPage({ onViewLogs, embedded = false } = {}) {
  const [dismissed, setDismissed] = useState([]); // ids
  const [rulesOpen, setRulesOpen] = useState(false);
  const [logFilter, setLogFilter] = useState(null); // filter to pass to AuditLogsPage
  const [toast, setToast] = useState(null);

  const active = INITIAL_ALERTS.filter((a) => !dismissed.includes(a.id));
  const criticalCount = active.filter(
    (a) => a.severity === "critical" && !a.resolved,
  ).length;
  const warningCount = active.filter(
    (a) => a.severity === "warning" && !a.resolved,
  ).length;
  const resolvedCount = active.filter((a) => a.resolved).length;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleViewLogs = (alert) => {
    setLogFilter(alert.logFilter);
    console.log(
      "Navigate to /superadmin/audit-logs with filter:",
      alert.logFilter,
    );
    if (onViewLogs) onViewLogs(alert.logFilter);
    const parts = Object.entries(alert.logFilter)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    setToast(`Opening Audit Logs with filter: ${parts}`);
  };

  const handleDismiss = (id) => setDismissed((d) => [...d, id]);

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
          <AppHeader active="Alerts" />
        </>
      )}

      {/* Toast (stands in for navigation until real routing is wired) */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[70] flex max-w-[92vw] -translate-x-1/2 items-start gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-2xl"
        >
          <span className="break-words">{toast}</span>
          <button
            onClick={() => setToast(null)}
            aria-label="Dismiss message"
            className="shrink-0 text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <main className="space-y-6 px-4 py-6 pl-6 sm:px-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Alerts
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Threshold breaches and anomalies detected in the audit trail
          </p>
        </div>

        {/* Section 1: top bar */}
        <section className="flex flex-wrap items-center gap-3">
          <CountBadge
            count={criticalCount}
            label="critical"
            className="bg-red-100 text-red-700"
          />
          <CountBadge
            count={warningCount}
            label="warning"
            className="bg-yellow-100 text-yellow-800"
          />
          <CountBadge
            count={resolvedCount}
            label="resolved"
            className="bg-green-100 text-green-700"
          />
          <span className="text-sm text-slate-500">All time today</span>

          <div className="ml-auto flex flex-wrap items-center gap-3">
            <button
              onClick={() => setRulesOpen((o) => !o)}
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <SlidersHorizontal size={16} /> Alert Rules
            </button>
            <button
              onClick={() =>
                setToast(
                  "Notification Settings will open here once it is wired up.",
                )
              }
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <Settings size={16} /> Notification Settings
            </button>
          </div>
        </section>

        {/* Section 2: active alerts */}
        <section className="space-y-3" aria-label="Active alerts">
          {active.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Check size={22} />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">
                No active alerts
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Every threshold is within its limit right now.
              </p>
            </div>
          ) : (
            active.map((a) => (
              <AlertCard
                key={a.id}
                alert={a}
                onViewLogs={handleViewLogs}
                onDismiss={handleDismiss}
              />
            ))
          )}
          {dismissed.length > 0 && (
            <button
              onClick={() => setDismissed([])}
              className="text-sm font-semibold text-slate-500 hover:text-slate-800"
            >
              Restore {dismissed.length} dismissed{" "}
              {dismissed.length === 1 ? "alert" : "alerts"}
            </button>
          )}
        </section>

        {/* Section 3: alert rules (collapsible) */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <button
            onClick={() => setRulesOpen((o) => !o)}
            aria-expanded={rulesOpen}
            aria-controls="alert-rules-panel"
            className="flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
          >
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Alert Rules
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {RULES.length} thresholds configured
              </p>
            </div>
            <ChevronDown
              size={20}
              className={`text-slate-500 transition-transform ${rulesOpen ? "rotate-180" : ""}`}
            />
          </button>
          {rulesOpen && (
            <div
              id="alert-rules-panel"
              className="overflow-x-auto border-t border-slate-100 px-5 pb-4"
            >
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500">
                    <th className="py-3 pr-3 font-semibold">Rule</th>
                    <th className="py-3 pr-3 font-semibold">Severity</th>
                    <th className="py-3 font-semibold">Notify</th>
                  </tr>
                </thead>
                <tbody>
                  {RULES.map((r) => (
                    <tr
                      key={r.rule}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="py-3 pr-3 font-medium text-slate-800">
                        {r.rule}
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${SEVERITY_PILL[r.severity]}`}
                        >
                          {r.severity}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {r.notify.map((n) => (
                            <span
                              key={n}
                              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${CHANNEL_PILL[n]}`}
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Section 4: alert history */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">
              Alert History
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">Last 7 days</p>
          </div>
          <div className="-mx-5 overflow-x-auto px-5">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="pb-2 pr-3 font-semibold">Date</th>
                  <th className="pb-2 pr-3 font-semibold">Alert</th>
                  <th className="pb-2 pr-3 font-semibold">Service</th>
                  <th className="pb-2 pr-3 font-semibold">Severity</th>
                  <th className="pb-2 pr-3 font-semibold">Duration</th>
                  <th className="pb-2 font-semibold">Resolved</th>
                </tr>
              </thead>
              <tbody>
                {HISTORY.map((h, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="whitespace-nowrap py-3 pr-3 text-slate-600">
                      {h.date}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-3 font-medium text-slate-800">
                      {h.alert}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-3">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {h.service}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${SEVERITY_PILL[h.severity]}`}
                      >
                        {h.severity}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-3 pr-3 text-slate-600">
                      {h.duration}
                    </td>
                    <td className="whitespace-nowrap py-3">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-green-700">
                        <Check size={14} /> {h.resolved}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
