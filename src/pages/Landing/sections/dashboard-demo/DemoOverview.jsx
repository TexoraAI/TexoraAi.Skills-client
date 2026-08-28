import { ArrowRight, PlayCircle, Users, Plus, Info } from "lucide-react";
import DemoPageHead from "./DemoPageHead";
import { overviewStats, upcomingEvents, todaySchedule } from "./demoData";

// Matches Overview.jsx's real tone set exactly (stat-icon lives in a
// .stat-card-top wrapper; default/no-class = purple, plus tone-live,
// tone-accent, tone-pink, tone-info).
const TONE_CLASS = { purple: "", green: "tone-live", amber: "tone-accent", blue: "tone-info" };

export default function DemoOverview({ onNavigate, onToast }) {
  return (
    <div className="ws-content">
      <DemoPageHead
        title="Workspace Overview"
        subtitle="Manage your events, meetings, calendar and communications in one place."
        actions={
          <button className="btn-primary" onClick={() => onNavigate("events")}>
            <Plus size={15} /> Create New
          </button>
        }
      />

      <section className="stat-grid">
        {overviewStats.map((s) => (
          <div className={`stat-card ${TONE_CLASS[s.tone] || ""}`} key={s.key}>
            <div className="stat-card-top">
              <div className="stat-icon">
                <Info size={16} />
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
          {upcomingEvents.slice(0, 4).map((e) => (
            <div
              className={`list-row type-${e.type.toLowerCase()}`}
              key={e.id}
              onClick={() => onNavigate("events")}
              style={{ cursor: "pointer" }}
            >
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
              <p>Start an instant meeting with your team or students.</p>
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
              onClick={() => onToast("Demo mode — instant meetings start here in the real product")}
            >
              <PlayCircle size={16} /> Start Instant Meeting
            </button>
          </section>

          <section className="section-card">
            <div className="section-card-head">
              <h2>Today's Schedule</h2>
            </div>
            {todaySchedule.map((t) => (
              <div className="list-row" key={t.id}>
                <div className="list-row-main">
                  <div className="title">{t.title}</div>
                  <div className="meta">{t.time}</div>
                </div>
                <span className={`badge ${t.status === "In Progress" ? "live" : "muted"}`}>
                  {t.status}
                </span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
