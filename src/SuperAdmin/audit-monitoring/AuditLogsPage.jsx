import React, { useState, useMemo, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  Search,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* CONSTANTS                                                           */
/* ------------------------------------------------------------------ */

const SERVICES = [
  "auth-service",
  "payment-service",
  "course-service",
  "batch-service",
  "assessment",
  "attendance-service",
  "progress-service",
  "file-service",
  "live-session-service",
  "video-service",
  "chat-service",
  "notification-service",
  "user-service",
  "audit-service",
];

const ACTIONS = [
  "USER_LOGIN",
  "USER_LOGOUT",
  "USER_REGISTERED",
  "COURSE_CREATED",
  "COURSE_UPDATED",
  "COURSE_DELETED",
  "PAYMENT_SUCCESS",
  "PAYMENT_FAILED",
  "PAYMENT_REFUNDED",
  "ASSESSMENT_SUBMITTED",
  "ASSESSMENT_GRADED",
  "ATTENDANCE_MARKED",
  "FILE_UPLOADED",
  "FILE_DELETED",
  "LIVE_SESSION_STARTED",
  "LIVE_SESSION_ENDED",
  "VIDEO_UPLOADED",
  "VIDEO_TRANSCRIBED",
  "BATCH_CREATED",
  "BATCH_STUDENT_ADDED",
];

const RESULTS = ["SUCCESS", "FAILURE", "PARTIAL"];
const TIME_RANGES = [
  "Last 1 Hour",
  "Last 6 Hours",
  "Last 24 Hours",
  "Last 7 Days",
  "Last 30 Days",
  "Custom Range",
];
const PAGE_SIZES = [15, 25, 50, 100];
const TOTAL_EVENTS = 48291;
const SUB_NAV = [
  "Overview",
  "Audit Logs",
  "Service Health",
  "Alerts",
  "Metrics",
];

// Base demo rows. Time is "HH:MM:SS" on 2026-09-20.
const BASE_ROWS = [
  [
    "10:42:01",
    "a3f1",
    "b22e",
    "auth-service",
    "USER_LOGIN",
    "student@ilmora.com",
    "Session",
    "103.21.4.8",
    "SUCCESS",
  ],
  [
    "10:41:58",
    "d9c2",
    "91af",
    "payment-service",
    "PAYMENT_FAILED",
    "ravi@ilmora.com",
    "Payment/pay_991",
    "103.21.5.1",
    "FAILURE",
  ],
  [
    "10:41:44",
    "e77a",
    "cc01",
    "course-service",
    "COURSE_CREATED",
    "instructor@ilmora.com",
    "Course/crs_82",
    "192.168.1.5",
    "SUCCESS",
  ],
  [
    "10:41:30",
    "b12d",
    "77fc",
    "assessment",
    "ASSESSMENT_SUBMITTED",
    "student2@ilmora.com",
    "Assessment/asmt_44",
    "103.21.6.2",
    "SUCCESS",
  ],
  [
    "10:41:18",
    "f03c",
    "12ab",
    "auth-service",
    "USER_LOGIN",
    "unknown@test.com",
    "Session",
    "45.33.32.156",
    "FAILURE",
  ],
  [
    "10:40:55",
    "c88e",
    "30bd",
    "batch-service",
    "BATCH_CREATED",
    "admin@ilmora.com",
    "Batch/bat_12",
    "192.168.1.1",
    "SUCCESS",
  ],
  [
    "10:40:44",
    "a90f",
    "44de",
    "video-service",
    "VIDEO_TRANSCRIBED",
    "system",
    "Video/vid_09",
    "—",
    "SUCCESS",
  ],
  [
    "10:40:32",
    "bb3c",
    "91cd",
    "payment-service",
    "PAYMENT_SUCCESS",
    "priya@ilmora.com",
    "Payment/pay_992",
    "103.21.7.3",
    "SUCCESS",
  ],
  [
    "10:40:18",
    "cc4d",
    "22ef",
    "attendance-service",
    "ATTENDANCE_MARKED",
    "instructor2@ilmora.com",
    "Attendance/sess_5",
    "192.168.1.8",
    "SUCCESS",
  ],
  [
    "10:39:55",
    "dd5e",
    "33f0",
    "user-service",
    "USER_PROFILE_UPDATED",
    "student3@ilmora.com",
    "User/usr_301",
    "103.21.8.4",
    "SUCCESS",
  ],
  [
    "10:39:41",
    "ee6f",
    "44a1",
    "live-session-service",
    "LIVE_SESSION_STARTED",
    "instructor@ilmora.com",
    "LiveSession/ls_7",
    "192.168.1.5",
    "SUCCESS",
  ],
  [
    "10:39:28",
    "ff70",
    "55b2",
    "auth-service",
    "USER_LOGIN",
    "blocked@spam.com",
    "Session",
    "45.33.32.156",
    "FAILURE",
  ],
  [
    "10:39:10",
    "aa81",
    "66c3",
    "file-service",
    "FILE_UPLOADED",
    "student@ilmora.com",
    "File/fil_201",
    "103.21.4.8",
    "SUCCESS",
  ],
  [
    "10:38:55",
    "bb92",
    "77d4",
    "course-service",
    "COURSE_UPDATED",
    "instructor@ilmora.com",
    "Course/crs_80",
    "192.168.1.5",
    "SUCCESS",
  ],
  [
    "10:38:40",
    "cca3",
    "88e5",
    "payment-service",
    "PAYMENT_FAILED",
    "kumar@ilmora.com",
    "Payment/pay_990",
    "103.21.9.5",
    "FAILURE",
  ],
];

/* ------------------------------------------------------------------ */
/* DATA HELPERS (demo only)                                            */
/* ------------------------------------------------------------------ */

const pad = (n) => String(n).padStart(2, "0");

// Builds row number `i` (0-based) of the virtual dataset by cycling the base rows.
function makeRow(i) {
  const [time, idStart, idEnd, service, action, actor, resource, ip, result] =
    BASE_ROWS[i % BASE_ROWS.length];
  const cycle = Math.floor(i / BASE_ROWS.length);
  const [h, m, s] = time.split(":").map(Number);
  let secs = h * 3600 + m * 60 + s - cycle * 47; // each cycle steps back ~47s
  if (secs < 0) secs += 86400;
  const ts = `2026-09-20 ${pad(Math.floor(secs / 3600) % 24)}:${pad(Math.floor((secs % 3600) / 60))}:${pad(secs % 60)}`;
  const fill = (((i + 1) * 2654435761) >>> 0).toString(16).padStart(8, "0");
  const mid = cycle === 0 ? "" : cycle.toString(16);
  const shortId = `${idStart}...${cycle === 0 ? idEnd : (idEnd.slice(0, 2) + mid.padStart(2, "0")).slice(0, 4)}`;
  const fullId = `${idStart}${fill}-${fill.slice(0, 4)}-4${fill.slice(1, 4)}-a${fill.slice(2, 5)}-${idEnd}${fill.slice(0, 8)}`;
  return {
    idx: i,
    ts,
    shortId,
    fullId,
    service,
    action,
    actor,
    resource,
    ip,
    result,
  };
}

function actorType(actor) {
  if (actor === "system") return "SYSTEM";
  if (actor.startsWith("admin")) return "ADMIN";
  if (actor.startsWith("instructor")) return "INSTRUCTOR";
  if (actor.startsWith("student")) return "STUDENT";
  if (actor.endsWith("@ilmora.com")) return "STUDENT";
  return "UNKNOWN";
}

function errorReason(row) {
  if (row.action === "PAYMENT_FAILED")
    return {
      code: "GATEWAY_DECLINED",
      message: "Payment gateway declined the transaction",
    };
  if (row.action === "USER_LOGIN")
    return {
      code: "INVALID_CREDENTIALS",
      message: "Email or password did not match",
    };
  return { code: "UNKNOWN_ERROR", message: "Action failed" };
}

function buildMetadata(row) {
  const [resType, resId] = row.resource.includes("/")
    ? row.resource.split("/")
    : [row.resource, null];
  const meta = {
    request_id: `req_${row.fullId.slice(0, 8)}`,
    user_agent:
      row.ip === "—"
        ? "internal-worker/1.4"
        : "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    region: row.ip.startsWith("45.")
      ? "US"
      : row.ip.startsWith("192.168")
        ? "INTERNAL"
        : "IN",
  };
  if (resId) meta.resource_ref = resId;
  if (row.service === "payment-service") {
    meta.amount = row.result === "FAILURE" ? 4999 : 2499;
    meta.currency = "INR";
  }
  if (row.result === "FAILURE") {
    const err = errorReason(row);
    meta.error = { ...err, retryable: row.action === "PAYMENT_FAILED" };
  }
  return meta;
}

/* ------------------------------------------------------------------ */
/* STYLE HELPERS                                                       */
/* ------------------------------------------------------------------ */

function actionTagClass(action) {
  if (action.includes("DELETE") || action.includes("FAIL"))
    return "bg-red-100 text-red-700";
  if (action.includes("CREATED")) return "bg-green-100 text-green-700";
  if (action.includes("UPDATED")) return "bg-slate-100 text-slate-700";
  if (
    action.startsWith("USER_LOGIN") ||
    action.startsWith("USER_LOGOUT") ||
    action === "USER_REGISTERED"
  )
    return "bg-blue-100 text-blue-700";
  if (action.startsWith("PAYMENT")) return "bg-yellow-100 text-yellow-800";
  if (action.startsWith("COURSE")) return "bg-green-100 text-green-700";
  return "bg-purple-100 text-purple-700";
}

function resultClass(result) {
  if (result === "SUCCESS") return "bg-green-100 text-green-700";
  if (result === "FAILURE") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

/* ------------------------------------------------------------------ */
/* SMALL COMPONENTS                                                    */
/* ------------------------------------------------------------------ */

function StatPill({ value, label, bg, border, color, dot }) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 shadow-sm"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: dot }} />
      <span className="text-sm font-extrabold" style={{ color }}>
        {value}
      </span>
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
}

function Select({ value, onChange, options, label }) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-9 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

function DetailRow({ label, children }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 sm:flex-row sm:items-start sm:gap-4">
      <div className="w-32 shrink-0 text-xs font-semibold text-slate-500">
        {label}
      </div>
      <div className="min-w-0 break-words text-sm text-slate-900">
        {children}
      </div>
    </div>
  );
}

function pageWindow(current, last) {
  const set = new Set([1, last, current - 1, current, current + 1]);
  const pages = [...set]
    .filter((p) => p >= 1 && p <= last)
    .sort((a, b) => a - b);
  const out = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push("gap-" + p);
    out.push(p);
  });
  return out;
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

const DEFAULT_FILTERS = {
  search: "",
  service: "All Services",
  action: "All Actions",
  result: "All Results",
  range: "Last 24 Hours",
  from: "",
  to: "",
};

// embedded=true hides the standalone navbar. initialFilter pre-applies filters (used by Alerts > View Logs).
export default function AuditLogsPage({
  embedded = false,
  initialFilter,
} = {}) {
  const start = { ...DEFAULT_FILTERS, ...(initialFilter || {}) };
  const [draft, setDraft] = useState(start); // what the inputs show
  const [applied, setApplied] = useState(start); // what the table uses
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);

  const setField = (key) => (val) => setDraft((d) => ({ ...d, [key]: val }));

  const isFiltered =
    applied.search.trim() !== "" ||
    applied.service !== "All Services" ||
    applied.action !== "All Actions" ||
    applied.result !== "All Results";

  // Unfiltered: virtual dataset of 48,291 rows. Filtered: search a 600-row demo pool.
  const filteredPool = useMemo(() => {
    if (!isFiltered) return null;
    const q = applied.search.trim().toLowerCase();
    return Array.from({ length: 600 }, (_, i) => makeRow(i)).filter((r) => {
      if (applied.service !== "All Services" && r.service !== applied.service)
        return false;
      if (applied.action !== "All Actions" && r.action !== applied.action)
        return false;
      if (applied.result !== "All Results" && r.result !== applied.result)
        return false;
      if (
        q &&
        !(
          r.actor.toLowerCase().includes(q) ||
          r.resource.toLowerCase().includes(q) ||
          r.fullId.includes(q) ||
          r.shortId.toLowerCase().includes(q)
        )
      )
        return false;
      return true;
    });
  }, [applied, isFiltered]);

  const total = isFiltered ? filteredPool.length : TOTAL_EVENTS;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);

  const rows = useMemo(() => {
    if (isFiltered) return filteredPool.slice(startIdx, endIdx);
    return Array.from({ length: endIdx - startIdx }, (_, i) =>
      makeRow(startIdx + i),
    );
  }, [isFiltered, filteredPool, startIdx, endIdx]);

  const applyFilters = () => {
    setApplied(draft);
    setPage(1);
  };

  const resetFilters = () => {
    setDraft(DEFAULT_FILTERS);
    setApplied(DEFAULT_FILTERS);
    setPage(1);
  };

  const exportCsv = () => {
    const headers = [
      "Timestamp",
      "Event ID",
      "Service",
      "Action",
      "Actor",
      "Resource",
      "IP Address",
      "Result",
    ];
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const lines = [
      headers.map(esc).join(","),
      ...rows.map((r) =>
        [
          r.ts,
          r.fullId,
          r.service,
          r.action,
          r.actor,
          r.resource,
          r.ip,
          r.result,
        ]
          .map(esc)
          .join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyMetadata = async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(buildMetadata(selected), null, 2),
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  // Close drawer with Escape
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const failureCount = rows.filter((r) => r.result === "FAILURE").length;

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
            <nav
              className="flex gap-1 overflow-x-auto px-4 pl-6 sm:px-8"
              aria-label="Audit & Monitoring"
            >
              {SUB_NAV.map((item) => (
                <button
                  key={item}
                  className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                    item === "Audit Logs"
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

      <main className="space-y-5 px-4 py-6 pl-6 sm:px-8">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Audit Logs
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Search and browse every recorded event across all services
          </p>
        </div>

        {/* Section 1: summary pills */}
        <section className="flex flex-wrap gap-3">
          <StatPill
            value="48,291"
            label="total"
            bg="linear-gradient(135deg,#EFF6FF,#DBEAFE)"
            border="#BFDBFE"
            color="#1D4ED8"
            dot="#3B82F6"
          />
          <StatPill
            value="143"
            label="failures"
            bg="linear-gradient(135deg,#FEF2F2,#FEE2E2)"
            border="#FECACA"
            color="#B91C1C"
            dot="#EF4444"
          />
          <StatPill
            value="Today"
            label=""
            bg="linear-gradient(135deg,#F8FAFC,#F1F5F9)"
            border="#E2E8F0"
            color="#334155"
            dot="#94A3B8"
          />
          <StatPill
            value="14"
            label="services"
            bg="linear-gradient(135deg,#F0FDF4,#DCFCE7)"
            border="#BBF7D0"
            color="#15803D"
            dot="#22C55E"
          />
        </section>

        {/* Section 2: search & filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 xl:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={draft.search}
                onChange={(e) => setField("search")(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                placeholder="Search by actor, resource ID, event ID..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:w-[820px]">
              <Select
                label="Service"
                value={draft.service}
                onChange={setField("service")}
                options={["All Services", ...SERVICES]}
              />
              <Select
                label="Action"
                value={draft.action}
                onChange={setField("action")}
                options={["All Actions", ...ACTIONS]}
              />
              <Select
                label="Result"
                value={draft.result}
                onChange={setField("result")}
                options={["All Results", ...RESULTS]}
              />
              <Select
                label="Time range"
                value={draft.range}
                onChange={setField("range")}
                options={TIME_RANGES}
              />
            </div>
          </div>

          {draft.range === "Custom Range" && (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <label className="flex items-center gap-2">
                From
                <input
                  type="datetime-local"
                  value={draft.from}
                  onChange={(e) => setField("from")(e.target.value)}
                  className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </label>
              <label className="flex items-center gap-2">
                To
                <input
                  type="datetime-local"
                  value={draft.to}
                  onChange={(e) => setField("to")(e.target.value)}
                  className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </label>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={applyFilters}
              className="flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-bold text-white shadow-md transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-orange-300"
              style={{ background: "linear-gradient(135deg,#F97316,#EA580C)" }}
            >
              <Search size={16} /> Search
            </button>
            <button
              onClick={exportCsv}
              className="flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <Download size={16} /> Export CSV
            </button>
            {(isFiltered || draft !== DEFAULT_FILTERS) && (
              <button
                onClick={resetFilters}
                className="text-sm font-semibold text-slate-500 hover:text-slate-800"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        {/* Section 3: results table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
                  {[
                    "Timestamp",
                    "Event ID",
                    "Service",
                    "Action",
                    "Actor",
                    "Resource",
                    "IP Address",
                    "Result",
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-16 text-center text-slate-500"
                    >
                      No events match these filters. Try a broader search or
                      clear the filters.
                    </td>
                  </tr>
                )}
                {rows.map((r) => {
                  const failed = r.result === "FAILURE";
                  return (
                    <tr
                      key={r.idx}
                      tabIndex={0}
                      onClick={() => setSelected(r)}
                      onKeyDown={(e) =>
                        (e.key === "Enter" || e.key === " ") &&
                        (e.preventDefault(), setSelected(r))
                      }
                      className={`cursor-pointer border-b border-slate-100 outline-none transition-colors last:border-0 focus:ring-2 focus:ring-inset focus:ring-orange-300 ${
                        failed ? "hover:bg-red-100" : "hover:bg-slate-50"
                      }`}
                      style={failed ? { background: "#FEF2F2" } : undefined}
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-600">
                        {r.ts}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">
                        {r.shortId}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {r.service}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${actionTagClass(r.action)}`}
                        >
                          {r.action}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-800">
                        {r.actor}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {r.resource}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-600">
                        {r.ip}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${resultClass(r.result)}`}
                        >
                          {r.result}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Section 4: pagination */}
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-sm text-slate-600">
              {total === 0 ? (
                "Showing 0 events"
              ) : (
                <>
                  Showing{" "}
                  <span className="font-semibold text-slate-900">
                    {(startIdx + 1).toLocaleString()}-{endIdx.toLocaleString()}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {total.toLocaleString()}
                  </span>{" "}
                  events
                  {failureCount > 0 && (
                    <span className="ml-2 text-red-600">
                      ({failureCount} failed on this page)
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(Math.max(1, safePage - 1))}
                  disabled={safePage === 1}
                  className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                {pageWindow(safePage, totalPages).map((p) =>
                  typeof p === "string" ? (
                    <span key={p} className="px-1.5 text-slate-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      aria-current={p === safePage ? "page" : undefined}
                      className={`h-9 min-w-9 rounded-lg px-2.5 text-sm font-semibold transition ${
                        p === safePage
                          ? "text-white shadow-md"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                      style={
                        p === safePage
                          ? {
                              background:
                                "linear-gradient(135deg,#F97316,#EA580C)",
                            }
                          : undefined
                      }
                    >
                      {p.toLocaleString()}
                    </button>
                  ),
                )}
                <button
                  onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                  disabled={safePage === totalPages}
                  className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>

              <div className="w-36">
                <Select
                  label="Page size"
                  value={`${pageSize} per page`}
                  onChange={(v) => {
                    setPageSize(parseInt(v, 10));
                    setPage(1);
                  }}
                  options={PAGE_SIZES.map((n) => `${n} per page`)}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Drawer overlay */}
      <div
        onClick={() => setSelected(null)}
        className={`fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-[1px] transition-opacity duration-200 ${
          selected ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Event details"
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-xl flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          selected ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selected && (
          <>
            <div
              className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5"
              style={{
                background:
                  selected.result === "FAILURE"
                    ? "linear-gradient(135deg,#FEF2F2,#FEE2E2)"
                    : "linear-gradient(135deg,#F0FDF4,#DCFCE7)",
              }}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Event details
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${resultClass(selected.result)}`}
                  >
                    {selected.result}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-slate-600">
                  {selected.action} · {selected.service}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-full p-2 text-slate-600 hover:bg-white/70"
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <DetailRow label="Event ID">
                <span className="font-mono text-xs">{selected.fullId}</span>
              </DetailRow>
              <DetailRow label="Timestamp">
                <span className="font-mono text-xs">{selected.ts} UTC</span>
              </DetailRow>
              <DetailRow label="Service">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {selected.service}
                </span>
              </DetailRow>
              <DetailRow label="Action">
                <span
                  className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${actionTagClass(selected.action)}`}
                >
                  {selected.action}
                </span>
              </DetailRow>
              <DetailRow label="Actor ID">{selected.actor}</DetailRow>
              <DetailRow label="Actor Type">
                {actorType(selected.actor)}
              </DetailRow>
              <DetailRow label="Resource Type">
                {selected.resource.split("/")[0]}
              </DetailRow>
              <DetailRow label="Resource ID">
                {selected.resource.includes("/")
                  ? selected.resource.split("/")[1]
                  : "—"}
              </DetailRow>
              <DetailRow label="IP Address">
                <span className="font-mono text-xs">{selected.ip}</span>
              </DetailRow>
              <DetailRow label="Result">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${resultClass(selected.result)}`}
                >
                  {selected.result}
                </span>
              </DetailRow>

              {selected.result === "FAILURE" && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="text-sm font-bold text-red-800">
                    {errorReason(selected).code}
                  </div>
                  <div className="mt-0.5 text-sm text-red-700">
                    {errorReason(selected).message}
                  </div>
                </div>
              )}

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Metadata</h3>
                  <button
                    onClick={copyMetadata}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  >
                    {copied ? (
                      <Check size={14} className="text-green-600" />
                    ) : (
                      <Copy size={14} />
                    )}
                    {copied ? "Copied" : "Copy JSON"}
                  </button>
                </div>
                <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
                  {JSON.stringify(buildMetadata(selected), null, 2)}
                </pre>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
