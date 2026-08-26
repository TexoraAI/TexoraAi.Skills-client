import React from "react";
import { Bell, Moon, Sun } from "lucide-react";
import { currentUser } from "../data/mockData";
import { useToast } from "./Toast";

const LINKS = ["All Courses", "ILM ORA Feature", "Product", "Mentors", "Success Stories"];

export default function TopNav({ dark, onToggleDark }) {
  const showToast = useToast();
  return (
    <div className="top-nav">
      <div className="top-nav-links">
        {LINKS.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
      <div className="top-nav-icons">
        <button
          className="icon-btn"
          aria-label="Notifications"
          title="Notifications"
          onClick={() => showToast("You have 3 new notifications")}
        >
          <Bell size={15} />
        </button>
        <button
          className="icon-btn"
          aria-label="Toggle theme"
          title="Toggle theme"
          onClick={onToggleDark}
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <div className="avatar-sm" title={currentUser.name}>
          {currentUser.initials}
        </div>
      </div>
    </div>
  );
}
