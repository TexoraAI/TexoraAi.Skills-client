// import React, { useEffect, useState } from "react";
// import { Menu } from "lucide-react";
// import WorkspaceSidebar from "../components/WorkspaceSidebar";
// import { WorkspaceModalProvider } from "../components/modals/ModalProvider";

// import Overview from "./workspace/Overview";
// import Events from "./workspace/Events";
// import InstantMeeting from "./workspace/InstantMeeting";
// import Calendar from "./workspace/Calendar";
// import CalendarSync from "./workspace/CalendarSync";
// import Email from "./workspace/Email";
// import MySchedules from "./workspace/MySchedules";
// import SharedWithMe from "./workspace/SharedWithMe";
// import Reminders from "./workspace/Reminders";
// import Contacts from "./workspace/Contacts";
// import Availability from "./workspace/Availability";
// import Integrations from "./workspace/Integrations";
// import WorkspaceSettings from "./workspace/WorkspaceSettings";

// export default function WorkspaceApp() {
//   const [tab, setTab] = useState("overview");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Close the mobile drawer automatically whenever a destination is picked,
//   // and lock background scroll while it's open (small/touch screens only —
//   // desktop layout never sets this state to true).
//   const handleNavigate = (id) => {
//     setTab(id);
//     setSidebarOpen(false);
//   };

//   useEffect(() => {
//     if (!sidebarOpen) return undefined;
//     const prevOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = prevOverflow;
//     };
//   }, [sidebarOpen]);

//   const renderPage = () => {
//     switch (tab) {
//       case "overview":
//         return <Overview onNavigate={handleNavigate} />;
//       case "events":
//         return <Events />;
//       case "instant-meeting":
//         return <InstantMeeting />;
//       case "calendar":
//         return <Calendar />;
//       case "calendar-sync":
//         return <CalendarSync />;
//       case "email":
//         return <Email />;
//       case "my-schedules":
//         return <MySchedules />;
//       case "shared-with-me":
//         return <SharedWithMe />;
//       case "reminders":
//         return <Reminders />;
//       case "contacts":
//         return <Contacts />;
//       case "availability":
//         return <Availability />;
//       case "integrations":
//         return <Integrations />;
//       case "workspace-settings":
//         return <WorkspaceSettings />;
//       default:
//         return <Overview onNavigate={handleNavigate} />;
//     }
//   };

//   return (
//     <WorkspaceModalProvider>
//       <div className="workspace-shell">
//         <button
//           type="button"
//           className="ws-mobile-toggle"
//           onClick={() => setSidebarOpen(true)}
//           aria-label="Open navigation menu"
//         >
//           <Menu size={18} />
//           <span>Menu</span>
//         </button>
//         <WorkspaceSidebar active={tab} onSelect={handleNavigate} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
//         {sidebarOpen && (
//           <div className="ws-sidebar-backdrop" onMouseDown={() => setSidebarOpen(false)} aria-hidden="true" />
//         )}
//         {renderPage()}
//       </div>
//     </WorkspaceModalProvider>
//   );
// }



































import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import WorkspaceSidebar from "../components/WorkspaceSidebar";
import { WorkspaceModalProvider } from "../components/modals/ModalProvider";

import Overview from "./workspace/Overview";
import Events from "./workspace/Events";
import InstantMeeting from "./workspace/InstantMeeting";
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

export default function WorkspaceApp() {
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Theme detection (same concept as Dashboard.jsx) ──────────────────────
  // The actual Light/Dark theme toggle lives in the host app (App.jsx),
  // which flips `document.documentElement`'s "dark" class / "data-theme"
  // attribute. Exactly like Dashboard.jsx, the Workspace does not own or
  // receive that toggle — it just reads the current theme off <html> on
  // mount, then watches for future changes with a MutationObserver so it
  // re-renders whenever someone clicks the Light Theme / Dark Theme option.
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"),
  );
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark",
      );
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, []);

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

  const renderPage = () => {
    switch (tab) {
      case "overview":
        return <Overview onNavigate={handleNavigate} />;
      case "events":
        return <Events />;
      case "instant-meeting":
        return <InstantMeeting />;
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
      case "integrations":
        return <Integrations />;
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
        <WorkspaceSidebar active={tab} onSelect={handleNavigate} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {sidebarOpen && (
          <div className="ws-sidebar-backdrop" onMouseDown={() => setSidebarOpen(false)} aria-hidden="true" />
        )}
        {renderPage()}
      </div>
    </WorkspaceModalProvider>
  );
}