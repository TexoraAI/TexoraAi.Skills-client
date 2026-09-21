import React, { useState, useMemo, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  Info,
  Plug,
  X,
  Copy,
  Check,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

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
const RANGES = ["1h", "6h", "24h", "7d"];
const RANGE_MS = {
  "1h": 3600e3,
  "6h": 6 * 3600e3,
  "24h": 24 * 3600e3,
  "7d": 7 * 24 * 3600e3,
};

const PANELS = [
  {
    id: "events",
    title: "Audit events per minute",
    subtitle: "Events written to the audit trail across all services",
    kind: "area",
    color: "#3B82F6",
    unit: "",
    series: [
      {
        key: "events",
        name: "Events/min",
        values: [120, 145, 132, 168, 155, 180, 200, 185, 220, 240],
      },
    ],
  },
  {
    id: "failures",
    title: "Failure events per minute",
    subtitle: "Spike matches the payment gateway incident",
    kind: "area",
    color: "#EF4444",
    unit: "",
    series: [
      {
        key: "failures",
        name: "Failures/min",
        values: [2, 3, 2, 4, 3, 85, 92, 88, 90, 87],
      },
    ],
  },
  {
    id: "lag",
    title: "Kafka consumer lag",
    subtitle: "lms-audit-events, messages behind",
    kind: "area",
    color: "#F59E0B",
    unit: "",
    series: [
      {
        key: "lag",
        name: "Lag (msgs)",
        values: [50, 48, 52, 60, 80, 200, 800, 2100, 3500, 4200],
      },
    ],
  },
  {
    id: "p99",
    title: "API response time p99 (ms)",
    subtitle: "Slowest 1% of requests per service",
    kind: "lines",
    unit: "ms",
    statsNote: "All services combined",
    series: [
      {
        key: "auth-service",
        name: "auth-service",
        color: "#3B82F6",
        values: [140, 142, 138, 145, 143, 148, 142, 145, 141, 142],
      },
      {
        key: "payment-service",
        name: "payment-service",
        color: "#8B5CF6",
        values: [200, 220, 210, 890, 850, 870, 860, 880, 890, 870],
      },
      {
        key: "video-service",
        name: "video-service",
        color: "#14B8A6",
        values: [300, 320, 310, 450, 4200, 380, 360, 370, 350, 360],
      },
      {
        key: "audit-service",
        name: "audit-service",
        color: "#F59E0B",
        values: [40, 42, 44, 41, 43, 45, 43, 42, 44, 44],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* HELPERS                                                             */
/* ------------------------------------------------------------------ */

const fmt = (n) =>
  n >= 10000 ? `${(n / 1000).toFixed(1)}k` : Math.round(n).toLocaleString();

// 10 evenly spaced labels ending at 10:42 AM on 2026-09-20
function makeLabels(range) {
  const end = new Date(2026, 8, 20, 10, 42).getTime();
  return Array.from({ length: 10 }, (_, i) => {
    const t = new Date(end - (RANGE_MS[range] * (9 - i)) / 9);
    return range === "7d"
      ? t.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  });
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

function MetricPanel({ panel }) {
  const [range, setRange] = useState("1h");

  const data = useMemo(() => {
    const labels = makeLabels(range);
    return labels.map((time, i) => {
      const row = { time };
      panel.series.forEach((s) => (row[s.key] = s.values[i]));
      return row;
    });
  }, [range, panel]);

  const all = panel.series.flatMap((s) => s.values);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const avg = all.reduce((a, b) => a + b, 0) / all.length;
  const gradId = `grad-${panel.id}`;

  const axes = (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
      <XAxis
        dataKey="time"
        tick={{ fontSize: 11, fill: "#64748B" }}
        axisLine={false}
        tickLine={false}
      />
      <YAxis
        tick={{ fontSize: 11, fill: "#64748B" }}
        axisLine={false}
        tickLine={false}
        tickFormatter={fmt}
      />
      <Tooltip content={<ChartTooltip />} />
    </>
  );

  return (
    <section
      className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      aria-label={panel.title}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-900">{panel.title}</h3>
          <p className="mt-0.5 text-xs text-slate-500">{panel.subtitle}</p>
        </div>
        <div className="relative shrink-0">
          <select
            aria-label={`Time range for ${panel.title}`}
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          >
            {RANGES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          {panel.kind === "area" ? (
            <AreaChart
              data={data}
              margin={{ top: 5, right: 8, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={panel.color} stopOpacity={0.3} />
                  <stop
                    offset="100%"
                    stopColor={panel.color}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              {axes}
              <Area
                type="monotone"
                dataKey={panel.series[0].key}
                name={panel.series[0].name}
                stroke={panel.color}
                strokeWidth={2.5}
                fill={`url(#${gradId})`}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 5, right: 8, left: -12, bottom: 0 }}
            >
              {axes}
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 12, paddingTop: 6 }}
              />
              {panel.series.map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-3 divide-x divide-slate-200 rounded-xl bg-slate-50 py-2.5 text-center">
        {[
          ["Min", min],
          ["Avg", avg],
          ["Max", max],
        ].map(([label, v]) => (
          <div key={label}>
            <div className="text-[11px] font-medium text-slate-500">
              {label}
            </div>
            <div className="text-sm font-bold text-slate-900">
              {fmt(v)}
              {panel.unit && (
                <span className="ml-0.5 text-xs font-medium text-slate-500">
                  {panel.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {panel.statsNote && (
        <p className="mt-1.5 text-center text-[11px] text-slate-400">
          {panel.statsNote}
        </p>
      )}
    </section>
  );
}

function ConnectModal({ onClose, onSave }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const envVar = "GF_SECURITY_ALLOW_EMBEDDING=true";

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(envVar);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const submit = () => {
    const trimmed = url.trim().replace(/\/+$/, "");
    if (!/^https?:\/\/[^\s/]+/i.test(trimmed)) {
      setError("Enter a full URL that starts with http:// or https://");
      return;
    }
    onSave(trimmed);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="connect-title"
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <div
          className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5"
          style={{ background: "linear-gradient(135deg,#FFF7ED,#FFEDD5)" }}
        >
          <div>
            <h2
              id="connect-title"
              className="text-lg font-extrabold text-slate-900"
            >
              Connect Grafana
            </h2>
            <p className="mt-0.5 text-sm text-slate-600">
              Embed live dashboards in place of the simulated charts
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-slate-600 hover:bg-white/70"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              1. Allow embedding in Grafana
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Set this environment variable on your Grafana server, then restart
              it. Without it, browsers block Grafana inside an iframe.
            </p>
            <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-slate-900 px-4 py-3">
              <code className="overflow-x-auto whitespace-nowrap text-xs text-slate-100">
                {envVar}
              </code>
              <button
                onClick={copy}
                aria-label="Copy environment variable"
                className="shrink-0 text-slate-400 hover:text-white"
              >
                {copied ? (
                  <Check size={16} className="text-green-400" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Docker example:{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5">
                docker run -p 3000:3000 -e {envVar} grafana/grafana
              </code>
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Viewers also need access to the dashboards. Sign in to Grafana in
              the same browser, or enable anonymous viewing on the Grafana side.
            </p>
          </div>

          <div>
            <label
              htmlFor="grafana-url"
              className="text-sm font-bold text-slate-900"
            >
              2. Grafana URL
            </label>
            <input
              id="grafana-url"
              type="url"
              autoFocus
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="http://localhost:3000"
              aria-invalid={!!error}
              aria-describedby={error ? "grafana-url-error" : undefined}
              className={`mt-2 h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                error
                  ? "border-red-400 focus:ring-red-100"
                  : "border-slate-200 focus:border-orange-400 focus:ring-orange-100"
              }`}
            />
            {error && (
              <p
                id="grafana-url-error"
                className="mt-1.5 text-xs font-medium text-red-600"
              >
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            className="h-10 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="h-10 rounded-xl px-5 text-sm font-bold text-white shadow-md transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-orange-300"
            style={{ background: "linear-gradient(135deg,#F97316,#EA580C)" }}
          >
            Save &amp; Connect
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

// embedded=true hides the standalone navbar so the page can sit inside AuditSection.
export default function GrafanaMetricsPage({ embedded = false } = {}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [savedUrl, setSavedUrl] = useState(null);

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
          <AppHeader active="Metrics" />
        </>
      )}

      <main className="space-y-5 px-4 py-6 pl-6 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Grafana Metrics
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Throughput, failures, Kafka lag and response times
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-bold text-white shadow-md transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-orange-300"
            style={{ background: "linear-gradient(135deg,#F97316,#EA580C)" }}
          >
            <Plug size={16} /> Connect Grafana
          </button>
        </div>

        {/* Note banner */}
        <div
          role="note"
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm ${
            savedUrl
              ? "border-green-200 bg-green-50 text-green-900"
              : "border-blue-200 bg-blue-50 text-blue-900"
          }`}
        >
          {savedUrl ? (
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-green-600"
            />
          ) : (
            <Info size={18} className="mt-0.5 shrink-0 text-blue-600" />
          )}
          <div>
            {savedUrl ? (
              <>
                Grafana URL saved:{" "}
                <span className="font-semibold">{savedUrl}</span>. The live
                embed isn't wired up yet, so these panels still show simulated
                data.
              </>
            ) : (
              "Grafana live embed will replace these charts once connected. Currently showing simulated data."
            )}
          </div>
        </div>

        {/* 2x2 grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {PANELS.map((p) => (
            <MetricPanel key={p.id} panel={p} />
          ))}
        </div>
      </main>

      {modalOpen && (
        <ConnectModal
          onClose={() => setModalOpen(false)}
          onSave={(url) => {
            setSavedUrl(url);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
