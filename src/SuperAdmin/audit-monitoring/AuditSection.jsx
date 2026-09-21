import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

import AuditOverviewPage from "./AuditOverviewPage";
import AuditLogsPage from "./AuditLogsPage";
import ServiceHealthPage from "./ServiceHealthPage";
import AlertsPage from "./AlertsPage";
import GrafanaMetricsPage from "./GrafanaMetricsPage";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "logs", label: "Audit Logs" },
  { id: "health", label: "Service Health" },
  { id: "alerts", label: "Alerts", badge: 2 },
  { id: "metrics", label: "Metrics" },
];

function timeAgo(seconds) {
  if (seconds < 60) return "just now";
  const m = Math.floor(seconds / 60);
  return `${m} min ago`;
}

// Renders below the main super admin nav when "Audit & Monitoring" is active.
export default function AuditSection() {
  const [activeTab, setActiveTab] = useState("overview");
  const [logFilter, setLogFilter] = useState(null); // filter handed over from an alert
  const [updatedAt, setUpdatedAt] = useState(Date.now());
  const [now, setNow] = useState(Date.now());
  const [spinning, setSpinning] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // remounts the page so it "reloads"

  // Keep the "Last updated" label ticking
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(t);
  }, []);

  const refresh = () => {
    if (spinning) return;
    setSpinning(true);
    setTimeout(() => {
      setUpdatedAt(Date.now());
      setNow(Date.now());
      setRefreshKey((k) => k + 1);
      setSpinning(false);
    }, 600);
  };

  const openLogsWithFilter = (filter) => {
    setLogFilter(filter);
    setActiveTab("logs");
  };

  const selectTab = (id) => {
    if (id !== "logs") setLogFilter(null); // only keep a filter for the jump from Alerts
    setActiveTab(id);
  };

  const renderPage = () => {
    switch (activeTab) {
      case "logs":
        return (
          <AuditLogsPage
            key={`logs-${refreshKey}-${JSON.stringify(logFilter)}`}
            embedded
            initialFilter={logFilter || undefined}
          />
        );
      case "health":
        return <ServiceHealthPage key={`health-${refreshKey}`} embedded />;
      case "alerts":
        return (
          <AlertsPage
            key={`alerts-${refreshKey}`}
            embedded
            onViewLogs={openLogsWithFilter}
          />
        );
      case "metrics":
        return <GrafanaMetricsPage key={`metrics-${refreshKey}`} embedded />;
      default:
        return <AuditOverviewPage key={`overview-${refreshKey}`} embedded />;
    }
  };

  return (
    <div
      className="bg-white text-slate-900"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Sub-navigation */}
      <div className="border-b border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 pl-6 sm:px-8">
          <div className="hidden py-3 text-sm font-bold text-slate-900 lg:block">
            Audit &amp; Monitoring
          </div>

          <nav
            className="-mb-px flex flex-1 gap-1 overflow-x-auto"
            aria-label="Audit & Monitoring sections"
          >
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => selectTab(tab.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:bg-orange-50 ${
                    isActive
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                  {tab.badge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 py-2 text-xs text-slate-500">
            <span>
              Last updated: {timeAgo(Math.floor((now - updatedAt) / 1000))}
            </span>
            <button
              onClick={refresh}
              aria-label="Refresh data"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <RefreshCw size={15} className={spinning ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      {renderPage()}
    </div>
  );
}
