import {
  LayoutGrid,
  CalendarDays,
  Zap,
  Layers,
  Sparkles,
  Calendar as CalendarIcon,
  RefreshCw,
  Mail,
  CalendarClock,
  Share2,
  Bell,
  Contact,
  CalendarCheck2,
  Plug,
  Settings as SettingsIcon,
  X,
} from "lucide-react";

// Same nav structure/labels/ids as the real product's WorkspaceSidebar
// (Dashboard/components/WorkspaceSidebar.jsx). Now covers all 15 items
// so nothing in the list is a dead click.
export const DEMO_TABS = [
  {
    group: "Main",
    items: [
      { id: "overview", label: "Overview", icon: LayoutGrid },
      { id: "events", label: "Events", icon: CalendarDays },
      { id: "instant-meeting", label: "Instant Meeting", icon: Zap },
      { id: "task-orbit", label: "Task Orbit Meeting", icon: Layers },
      { id: "summaries", label: "Summaries", icon: Sparkles },
      { id: "calendar", label: "Calendar", icon: CalendarIcon },
      { id: "calendar-sync", label: "Calendar Sync", icon: RefreshCw },
      { id: "email", label: "Email", icon: Mail },
    ],
  },
  {
    group: "Manage",
    items: [
      { id: "my-schedules", label: "My Schedules", icon: CalendarClock },
      { id: "shared", label: "Shared with Me", icon: Share2 },
      { id: "reminders", label: "Reminders", icon: Bell },
      { id: "contacts", label: "Contacts", icon: Contact },
    ],
  },
  {
    group: "Configuration",
    items: [
      { id: "availability", label: "Availability", icon: CalendarCheck2 },
      { id: "integrations", label: "Integrations", icon: Plug },
      { id: "settings", label: "Workspace Settings", icon: SettingsIcon },
    ],
  },
];

export default function DemoSidebar({ active, onSelect, isOpen, onClose }) {
  return (
    <aside className={`ws-demo-sidebar ${isOpen ? "is-open" : ""}`}>
      <div className="ws-sidebar-head">
        <span className="ws-sidebar-head-label">
          <LayoutGrid size={16} color="var(--brand)" />
          Workspace
        </span>
        <button
          type="button"
          className="ws-sidebar-close"
          style={{ display: isOpen ? "flex" : undefined }}
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <X size={16} />
        </button>
      </div>
      {DEMO_TABS.map((group) => (
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
