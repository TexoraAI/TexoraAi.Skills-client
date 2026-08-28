
import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import WorkspaceSidebar from "../components/WorkspaceSidebar";
import { WorkspaceModalProvider } from "../components/modals/ModalProvider";

import Overview from "./workspace/Overview";
import Events from "./workspace/Events";
import InstantMeeting from "./workspace/InstantMeeting";
import Summaries from "./workspace/Summaries";
import Calendar from "./workspace/Calendar";
import CalendarSync from "./workspace/CalendarSync";
import Email from "./workspace/Email";
import MySchedules from "./workspace/MySchedules";
import SharedWithMe from "./workspace/SharedWithMe";
import Reminders from "./workspace/Reminders";
import Contacts from "./workspace/Contacts";
import Availability from "./workspace/Availability";
import Integrations from "./workspace/Integrations";
import WorkspaceSettings from "./workspace/WorkspaceSettings";

export default function WorkspaceApp({ theme } = {}) {
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Theme detection (same concept as Dashboard.jsx) ──────────────────────
  // The actual Light/Dark theme toggle lives in the host app (App.jsx /
  // IlmOraDemoPage), which already computes the correct `theme` value and
  // now passes it straight down as a prop (same convention IlmDemoSidebar
  // already follows). An explicitly-passed `theme` prop always wins — it's
  // the single source of truth and avoids re-deriving it here on a
  // different render/effect timeline. The DOM read + MutationObserver below
  // now only run as a fallback for whenever Workspace is ever mounted
  // without that prop, matching useAutoDarkMode.js's documented pattern.
  const [detectedDark, setDetectedDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"),
  );
  useEffect(() => {
    if (theme !== undefined) return;
    const obs = new MutationObserver(() => {
      setDetectedDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark",
      );
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, [theme]);
  const isDark = theme !== undefined ? theme === "dark" : detectedDark;

  // Close the mobile drawer automatically whenever a destination is picked,
  // and lock background scroll while it's open (small/touch screens only —
  // desktop layout never sets this state to true).
  const handleNavigate = (id) => {
    setTab(id);
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [sidebarOpen]);

  // ── Return from Google Calendar OAuth ──────────────────────────────────
  // After the OAuth round-trip the backend 302-redirects the browser back to
  // the app with ?calendarSync=connected (or =error&reason=...). When we see
  // that flag we jump straight to the Calendar Sync page — instead of leaving
  // the user on the default Overview tab — and strip the flag from the URL so
  // a manual refresh stays clean. Harmless when the flag isn't present.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.get("calendarSync")) return;
    setTab("calendar-sync");
    params.delete("calendarSync");
    params.delete("reason");
    const qs = params.toString();
    window.history.replaceState(
      {},
      "",
      window.location.pathname + (qs ? `?${qs}` : ""),
    );
  }, []);

  const renderPage = () => {
    switch (tab) {
      case "overview":
        return <Overview onNavigate={handleNavigate} />;
      case "events":
        return <Events />;
      case "instant-meeting":
        return <InstantMeeting />;
      case "task-orbit":
        return <TaskOrbit />;
      case "summaries":
        return <Summaries />;
      case "calendar":
        return <Calendar />;
      case "calendar-sync":
        return <CalendarSync />;
      case "email":
        return <Email />;
      case "my-schedules":
        return <MySchedules />;
      case "shared-with-me":
        return <SharedWithMe />;
      case "reminders":
        return <Reminders />;
      case "contacts":
        return <Contacts />;
      case "availability":
        return <Availability />;
      // case "integrations":
      //   return <Integrations />;
      case "integrations":
        return <Integrations onNavigate={handleNavigate} />;
      case "workspace-settings":
        return <WorkspaceSettings />;
      default:
        return <Overview onNavigate={handleNavigate} />;
    }
  };

  return (
    <WorkspaceModalProvider>
      <div className={`workspace-shell${isDark ? " dark" : ""}`}>
        <button
          type="button"
          className="ws-mobile-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
          <span>Menu</span>
        </button>
        <WorkspaceSidebar
          active={tab}
          onSelect={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        {sidebarOpen && (
          <div
            className="ws-sidebar-backdrop"
            onMouseDown={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        {renderPage()}
      </div>
    </WorkspaceModalProvider>
  );
}
