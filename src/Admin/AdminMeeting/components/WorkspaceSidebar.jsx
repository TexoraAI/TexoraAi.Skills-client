import React from "react";
import {
  LayoutGrid,
  CalendarDays,
  Video,
  Calendar as CalendarIcon,
  RefreshCw,
  Mail,
  Clock,
  Share2,
  Bell,
  Contact,
  CalendarCheck2,
  Plug,
  Settings as SettingsIcon,
  X,
} from "lucide-react";

export const WORKSPACE_TABS = [
  {
    group: "Main",
    items: [
      { id: "overview", label: "Overview", icon: LayoutGrid },
      { id: "events", label: "Events", icon: CalendarDays },
      { id: "instant-meeting", label: "Instant Meeting", icon: Video },
      { id: "calendar", label: "Calendar", icon: CalendarIcon },
      { id: "calendar-sync", label: "Calendar Sync", icon: RefreshCw },
      { id: "email", label: "Email", icon: Mail },
    ],
  },
  {
    group: "Manage",
    items: [
      { id: "my-schedules", label: "My Schedules", icon: Clock },
      { id: "shared-with-me", label: "Shared with Me", icon: Share2 },
      { id: "reminders", label: "Reminders", icon: Bell },
      { id: "contacts", label: "Contacts", icon: Contact },
    ],
  },
  {
    group: "Configuration",
    items: [
      { id: "availability", label: "Availability", icon: CalendarCheck2 },
      { id: "integrations", label: "Integrations", icon: Plug },
      { id: "workspace-settings", label: "Workspace Settings", icon: SettingsIcon },
    ],
  },
];

export default function WorkspaceSidebar({ active, onSelect, isOpen = false, onClose }) {
  return (
    <aside className={`ws-sidebar ${isOpen ? "is-open" : ""}`}>
      <div className="ws-sidebar-head">
        <span className="ws-sidebar-head-label">
          <LayoutGrid size={16} color="var(--brand)" />
          Workspace
        </span>
        <button
          type="button"
          className="ws-sidebar-close"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <X size={16} />
        </button>
      </div>
      {WORKSPACE_TABS.map((group) => (
        <div className="ws-group" key={group.group}>
          <div className="ws-group-label">{group.group}</div>
          {group.items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`ws-item ${active === item.id ? "is-active" : ""}`}
              onClick={() => onSelect(item.id)}
            >
              <item.icon size={15} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}
