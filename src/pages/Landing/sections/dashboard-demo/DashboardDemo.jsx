import { useCallback, useRef, useState } from "react";
import { Lock, CheckCircle2 } from "lucide-react";
import { DASHBOARD_DEMO_CSS } from "./dashboardDemo.styles";
import DemoSidebar from "./DemoSidebar";
import DemoTopBar from "./DemoTopBar";
import DemoOverview from "./DemoOverview";
import DemoEvents from "./DemoEvents";
import DemoCalendar from "./DemoCalendar";
import DemoContacts from "./DemoContacts";
import DemoAvailability from "./DemoAvailability";
import DemoIntegrations from "./DemoIntegrations";
import DemoSettings from "./DemoSettings";
import DemoInstantMeeting from "./DemoInstantMeeting";
import DemoTaskOrbit from "./DemoTaskOrbit";
import DemoSummaries from "./DemoSummaries";
import DemoCalendarSync from "./DemoCalendarSync";
import DemoEmail from "./DemoEmail";
import DemoMySchedules from "./DemoMySchedules";
import DemoSharedWithMe from "./DemoSharedWithMe";
import DemoReminders from "./DemoReminders";

const SEARCH_PLACEHOLDER = {
  events: "Search events…",
  contacts: "Search contacts…",
  summaries: "Search summaries…",
  email: "Search mail…",
  shared: "Search shared items…",
};

/* ─────────────────────────────────────────────────────────────────
   DASHBOARD DEMO — self-contained, frontend-only interactive preview
   of the real Workspace product, embedded on the landing page.

   No backend, no API, no auth: every "Create", "Connect", "Sign out"
   etc. either updates local component state or surfaces a small toast
   explaining that it's a demo action. Visual language (colors, radii,
   spacing, component classes) is ported 1:1 from the real Dashboard
   project's workspace-styles.css — see dashboardDemo.styles.js.
───────────────────────────────────────────────────────────────── */
export default function DashboardDemo() {
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState(null); // "notif" | "profile" | null
  const [isDark, setIsDark] = useState(false);
  const [query, setQuery] = useState("");
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  const showToast = useCallback((message) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const handleNavigate = (id) => {
    setTab(id);
    setSidebarOpen(false);
    setOpenPanel(null);
    setQuery("");
  };

  const renderPage = () => {
    switch (tab) {
      case "overview":
        return <DemoOverview onNavigate={handleNavigate} onToast={showToast} />;
      case "events":
        return <DemoEvents query={query} onToast={showToast} />;
      case "instant-meeting":
        return <DemoInstantMeeting onToast={showToast} />;
      case "task-orbit":
        return <DemoTaskOrbit onToast={showToast} />;
      case "summaries":
        return <DemoSummaries query={query} onToast={showToast} />;
      case "calendar":
        return <DemoCalendar onToast={showToast} />;
      case "calendar-sync":
        return <DemoCalendarSync onToast={showToast} />;
      case "email":
        return <DemoEmail query={query} onToast={showToast} />;
      case "my-schedules":
        return <DemoMySchedules onToast={showToast} />;
      case "shared":
        return <DemoSharedWithMe query={query} onToast={showToast} />;
      case "reminders":
        return <DemoReminders onToast={showToast} />;
      case "contacts":
        return <DemoContacts query={query} onQueryChange={setQuery} onToast={showToast} />;
      case "availability":
        return <DemoAvailability onToast={showToast} />;
      case "integrations":
        return <DemoIntegrations onToast={showToast} />;
      case "settings":
        return (
          <DemoSettings
            isDark={isDark}
            onToggleDark={() => setIsDark((d) => !d)}
            onToast={showToast}
          />
        );
      default:
        return <DemoOverview onNavigate={handleNavigate} onToast={showToast} />;
    }
  };

  return (
    <div className={`ws-demo-scope ${isDark ? "ws-demo-dark" : ""}`}>
      <style>{DASHBOARD_DEMO_CSS}</style>

      <div className="ws-demo-frame">
        <div className="ws-demo-titlebar">
          <div className="ws-demo-dots">
            <span />
            <span />
            <span />
          </div>
          <div className="ws-demo-url">
            <Lock size={11} />
            <span className="ws-demo-url-text">app.ilmora.ai/workspace</span>
          </div>
          <span className="ws-demo-live-badge">
            <span className="dot" /> Interactive Demo
          </span>
        </div>

        <div className="ws-demo-body">
          <button
            type="button"
            className="ws-demo-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            ☰ Menu
          </button>

          {sidebarOpen && (
            <div className="ws-demo-backdrop" onMouseDown={() => setSidebarOpen(false)} />
          )}

          <DemoSidebar
            active={tab}
            onSelect={handleNavigate}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div className="ws-demo-main">
            <DemoTopBar
              query={query}
              onQueryChange={setQuery}
              searchPlaceholder={SEARCH_PLACEHOLDER[tab] || "Search workspace…"}
              openPanel={openPanel}
              setOpenPanel={setOpenPanel}
              onToast={showToast}
              isDark={isDark}
              onToggleDark={() => setIsDark((d) => !d)}
            />
            <div className="ws-demo-scroll">
              <div className="ws-demo-page-enter" key={tab}>
                {renderPage()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div className="toast-item" key={t.id}>
            <CheckCircle2 size={16} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
