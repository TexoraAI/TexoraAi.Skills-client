import React from "react";
import {
  CalendarDays,
  Video,
  Clock,
  Mail,
  ArrowRight,
  PlayCircle,
  RefreshCw,
  MailPlus,
  CalendarPlus,
  CalendarClock,
  Bell,
  Info,
  Users,
  Plus,
} from "lucide-react";
import PageHead from "../../components/PageHead";
import { upcomingEvents, todaySchedule, emailStats } from "../../data/mockData";

const STATS = [
  { icon: CalendarDays, label: "Upcoming Events", value: 12, delta: "↑ 2 this week", tone: "brand" },
  { icon: Video, label: "Instant Meetings", value: 3, delta: "1 active now", tone: "live" },
  { icon: Clock, label: "Scheduled Today", value: 8, delta: "View calendar →", tone: "accent" },
  { icon: Mail, label: "Emails", value: emailStats.unread, delta: `${emailStats.unread} unread`, tone: "pink" },
];

export default function Overview({ onNavigate, user }) {
  return (
    <div className="ws-content">
      <PageHead
        title="Workspace Overview"
        subtitle="Manage your events, meetings, calendar and communications in one place."
        actions={
          <button className="btn-primary" onClick={() => onNavigate("events")}>
            <Plus size={15} /> Create New
          </button>
        }
      />
      <section className="stat-grid">
        {STATS.map((s) => (
          <div className={`stat-card tone-${s.tone}`} key={s.label}>
            <div className="stat-card-top">
              <div className="stat-icon">
                <s.icon size={18} />
              </div>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-delta">{s.delta}</div>
          </div>
        ))}
      </section>

      <div className="content-grid-2">
        <section className="section-card">
          <div className="section-card-head">
            <h2>Upcoming Events</h2>
            <button className="section-link" onClick={() => onNavigate("events")}>
              View all <ArrowRight size={13} />
            </button>
          </div>
          {upcomingEvents.map((e) => (
            <div className={`list-row type-${e.type.toLowerCase()}`} key={e.id}>
              <div className="list-row-date">
                <div className="mon">{e.date.split(" ")[0].toUpperCase()}</div>
                <div className="day">{e.date.split(" ")[1]}</div>
              </div>
              <div className="list-row-main">
                <div className="title">{e.title}</div>
                <div className="meta">
                  {e.time} · {e.mode}
                </div>
              </div>
              <span className="badge">{e.countdown}</span>
            </div>
          ))}
          <div className="section-card-footer">
            <button className="section-link" onClick={() => onNavigate("calendar")}>
              View full calendar <ArrowRight size={13} />
            </button>
          </div>
        </section>

        <div className="workspace-tools-column">
          <section className="section-card instant-hero-card">
            <div className="instant-hero-head">
              <h3>
                Instant Meeting <Info size={13} className="muted" />
              </h3>
            </div>
            <div className="instant-hero-body">
              <p className="muted">Start an instant meeting with your team or students.</p>
              <div className="instant-hero-illustration">
                <span className="ihi-avatar ihi-1">
                  <Users size={14} />
                </span>
                <span className="ihi-avatar ihi-2">
                  <Users size={14} />
                </span>
                <span className="ihi-avatar ihi-3">
                  <Users size={14} />
                </span>
              </div>
            </div>
            <button
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => onNavigate("instant-meeting")}
            >
              <PlayCircle size={16} /> Start Instant Meeting
            </button>
          </section>

          <section className="section-card">
            <div className="section-card-head">
              <h2>Calendar Sync</h2>
            </div>
            <p className="muted" style={{ margin: "0 0 12px" }}>
              Sync your calendar to keep everything up to date.
            </p>
            <div className="calendar-sync-row">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CalendarClock size={16} color="var(--brand)" />
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>Google Calendar</div>
                  <div className="connected-tag">
                    <span className="dot" /> Connected
                  </div>
                </div>
              </div>
              <button className="btn-ghost btn-sm" onClick={() => onNavigate("calendar-sync")}>
                <RefreshCw size={13} /> Sync Now
              </button>
            </div>
          </section>

          <section className="section-card">
            <div className="section-card-head">
              <h2>Email</h2>
            </div>
            <p className="muted" style={{ margin: "0 0 12px" }}>
              Compose and manage your emails.
            </p>
            <button
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => onNavigate("email")}
            >
              <MailPlus size={15} /> Compose Email
            </button>
            <div className="email-stats-row">
              {[
                ["Unread", emailStats.unread],
                ["Sent", emailStats.sent],
                ["Drafts", emailStats.drafts],
              ].map(([label, val]) => (
                <div key={label} className="email-stat">
                  <div className="val">{val}</div>
                  <div className="muted">{label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="section-card">
            <div className="section-card-head">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions-grid">
              <button className="quick-action" onClick={() => onNavigate("events")}>
                <div className="qa-icon">
                  <CalendarPlus size={17} />
                </div>
                <span>Create Event</span>
              </button>
              <button className="quick-action" onClick={() => onNavigate("instant-meeting")}>
                <div className="qa-icon">
                  <Video size={17} />
                </div>
                <span>Schedule Meeting</span>
              </button>
              <button className="quick-action" onClick={() => onNavigate("reminders")}>
                <div className="qa-icon">
                  <Bell size={17} />
                </div>
                <span>Add Reminder</span>
              </button>
              <button className="quick-action" onClick={() => onNavigate("calendar-sync")}>
                <div className="qa-icon">
                  <RefreshCw size={17} />
                </div>
                <span>Sync Calendar</span>
              </button>
            </div>
          </section>
        </div>
      </div>

      <div className="content-grid-2">
        <section className="section-card">
          <div className="section-card-head">
            <h2>Today's Schedule</h2>
            <button className="section-link" onClick={() => onNavigate("calendar")}>
              View calendar <ArrowRight size={13} />
            </button>
          </div>
          {todaySchedule.map((s) => (
            <div className="list-row" key={s.id}>
              <div className="list-row-main">
                <div className="title">
                  {s.time} · {s.title}
                </div>
              </div>
              <span className={`badge ${s.status === "In Progress" ? "live" : ""}`}>{s.status}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}