import React from "react";
import {
  LayoutDashboard,
  Layers,
  Grid2x2,
  Bot,
  PenTool,
  Code2,
  BookOpenCheck,
  FolderKanban,
  Video,
  BarChart3,
  Settings as SettingsIcon,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { currentUser } from "../data/mockData";

const RAIL_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "batch", label: "Batch Management", icon: Layers },
  { id: "workspace", label: "Workspace", icon: Grid2x2 },
  { id: "ai", label: "AI Companion", icon: Bot },
  { id: "whiteboard", label: "Whiteboard", icon: PenTool },
  { id: "coding", label: "Coding Lab", icon: Code2 },
  { id: "study", label: "Study Plan", icon: BookOpenCheck },
  { id: "content", label: "Content Management", icon: FolderKanban },
  { id: "live", label: "Live Classes", icon: Video },
  { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

export default function OuterRail({ active, onSelect, collapsed, onToggleCollapsed }) {
  return (
    <aside className={`outer-rail ${collapsed ? "is-collapsed" : ""}`}>
      <div className="outer-brand">
        <div className="logo-chip">IO</div>
        <div className="brand-text">
          <div className="name">
            ILM <span className="ora">ORA</span>
          </div>
          <div className="sub">Trainer Portal</div>
        </div>
        <button
          className="rail-collapse-btn"
          onClick={onToggleCollapsed}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
        </button>
      </div>

      <nav className="rail-nav">
        {RAIL_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`rail-item ${active === item.id ? "is-active" : ""}`}
            onClick={() => onSelect(item.id)}
            title={item.label}
          >
            <item.icon size={17} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="rail-footer">
        <div className="avatar">{currentUser.initials}</div>
        <div className="who">
          <b>{currentUser.name}</b>
          <span>{currentUser.email}</span>
        </div>
      </div>
    </aside>
  );
}
