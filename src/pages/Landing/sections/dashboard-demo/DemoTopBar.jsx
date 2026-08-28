import { useEffect, useRef } from "react";
import { Search, Bell, ChevronDown, LogOut, UserCog, Moon, Sun } from "lucide-react";
import { demoUser, notifications } from "./demoData";

export default function DemoTopBar({
  query,
  onQueryChange,
  searchPlaceholder,
  openPanel,
  setOpenPanel,
  onToast,
  isDark,
  onToggleDark,
}) {
  const wrapRef = useRef(null);

  // Close whichever dropdown is open on outside click — same UX as a real
  // product header, kept local to this component so it never depends on
  // anything outside the demo frame.
  useEffect(() => {
    if (!openPanel) return undefined;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpenPanel(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openPanel, setOpenPanel]);

  return (
    <div className="ws-demo-topbar" ref={wrapRef}>
      <div className="ws-demo-topbar-search">
        <Search size={14} />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={searchPlaceholder}
        />
      </div>

      <div className="ws-demo-topbar-actions">
        <button
          type="button"
          className="ws-demo-icon-btn"
          aria-label="Notifications"
          onClick={() => setOpenPanel(openPanel === "notif" ? null : "notif")}
        >
          <Bell size={16} />
          <span className="ws-demo-badge-dot" />
        </button>
        {openPanel === "notif" && (
          <div className="ws-demo-dropdown">
            <div className="ws-demo-dropdown-head">Notifications</div>
            {notifications.map((n) => (
              <div
                className="ws-demo-notif-row"
                key={n.id}
                onClick={() => {
                  onToast("Notification opened (demo)");
                  setOpenPanel(null);
                }}
              >
                <span className="ws-demo-notif-dot" />
                <div>
                  <p>{n.text}</p>
                  <span>{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          className="ws-demo-profile-btn"
          onClick={() => setOpenPanel(openPanel === "profile" ? null : "profile")}
        >
          <span className="avatar-sm">{demoUser.initials}</span>
          {demoUser.name.split(" ")[0]}
          <ChevronDown size={13} />
        </button>
        {openPanel === "profile" && (
          <div className="ws-demo-dropdown ws-demo-profile-panel">
            <div className="ws-demo-profile-info">
              <span className="avatar-sm">{demoUser.initials}</span>
              <div>
                <b>{demoUser.name}</b>
                <span>{demoUser.email}</span>
              </div>
            </div>
            <button
              type="button"
              className="ws-demo-menu-item"
              onClick={() => {
                onToggleDark();
                setOpenPanel(null);
              }}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
              {isDark ? "Light theme" : "Dark theme"}
            </button>
            <button
              type="button"
              className="ws-demo-menu-item"
              onClick={() => {
                onToast("This is a demo workspace — sign up to make it yours");
                setOpenPanel(null);
              }}
            >
              <UserCog size={14} />
              Account settings
            </button>
            <button
              type="button"
              className="ws-demo-menu-item"
              onClick={() => {
                onToast("You're viewing a demo — no account to sign out of");
                setOpenPanel(null);
              }}
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
