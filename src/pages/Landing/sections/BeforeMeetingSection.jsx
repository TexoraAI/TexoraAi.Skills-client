import { CalendarDays } from "lucide-react";
import Reveal from "./Reveal";

function WFScheduleVisual() {
  const dates = [
    [24, 25, 26, 27, 28, 1, 2],
    [3, 4, 5, 6, 7, 8, 9],
  ];
  return (
    <div className="wf-visual">
      <div className="wf-cal-head">
        <b>March 2026</b>
        <div className="wf-cal-nav">
          <span>‹</span>
          <span>›</span>
        </div>
      </div>
      <div className="wf-cal-days">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="wf-cal-dates">
        {dates.flat().map((d, i) => (
          <div key={i} className={d === 5 && i > 6 ? "wf-active" : ""}>
            {d}
          </div>
        ))}
      </div>
      <div className="wf-slot-card">
        <b>Weekly product sync</b>
        <span>10:00 – 10:30 AM</span>
      </div>
    </div>
  );
}

function WFCalendarSyncVisual() {
  const providers = [
    { name: "Work Calendar", meta: "Synced · 2 min ago", color: "#4C6EF5", connected: true },
    { name: "Team Calendar", meta: "Synced · 2 min ago", color: "#f97316", connected: true },
    { name: "Personal Calendar", meta: "Not connected", color: "#8B94A7", connected: false },
  ];
  return (
    <div className="wf-visual">
      {providers.map((p) => (
        <div className="wf-provider-row" key={p.name}>
          <div className="wf-provider-left">
            <div className="wf-prov-icon" style={{ background: p.color }}>
              <CalendarDays size={16} color="#fff" />
            </div>
            <div>
              <b>{p.name}</b>
              <span>{p.meta}</span>
            </div>
          </div>
          <span className={`wf-pill ${p.connected ? "wf-on" : "wf-off"}`}>{p.connected ? "Connected" : "Connect"}</span>
        </div>
      ))}
    </div>
  );
}

function WFInviteVisual() {
  const guests = [
    { i: "R", email: "riya@company.com", color: "#4C6EF5" },
    { i: "D", email: "dev@company.com", color: "#f97316" },
    { i: "S", email: "sana@company.com", color: "#16a34a" },
  ];
  return (
    <div className="wf-visual">
      <div className="wf-mail-card">
        <div className="wf-mail-field">
          <label>To</label>
          <div className="wf-chips">
            {guests.map((g) => (
              <span className="wf-chip" key={g.email}>
                <span className="wf-dot" style={{ background: g.color }}>
                  {g.i}
                </span>
                {g.email}
              </span>
            ))}
            <span className="wf-chip">+9 more</span>
          </div>
        </div>
        <div className="wf-mail-field">
          <label>Subject</label>
          <span style={{ fontSize: 13 }}>Weekly product sync — Thu, 10:00 AM</span>
        </div>
        <div className="wf-mail-body">
          "Hi team, adding you to our weekly sync. Agenda and join link are attached — see you there."
        </div>
        <div className="wf-mail-foot">
          <button className="wf-btn wf-btn-primary wf-btn-sm" type="button">Send invites</button>
        </div>
      </div>
    </div>
  );
}

function WFLobbyVisual() {
  return (
    <div className="wf-visual">
      <div className="wf-lobby-row">
        <div className="wf-lobby-left">
          <div className="wf-stack">
            <div className="wf-mini-av" style={{ background: "#4C6EF5" }}>R</div>
            <div className="wf-mini-av" style={{ background: "#f97316" }}>D</div>
            <div className="wf-mini-av" style={{ background: "#16a34a" }}>S</div>
          </div>
          <div>
            <b>3 already in the room</b>
            <span>Joined on time</span>
          </div>
        </div>
      </div>
      <div className="wf-lobby-row">
        <div className="wf-lobby-left">
          <div className="wf-mini-av" style={{ background: "#EC6A6A" }}>A</div>
          <div>
            <b>Aman is waiting</b>
            <span>Requested to join · 4s ago</span>
          </div>
        </div>
        <span className="wf-counter-pill">Admit</span>
      </div>
      <div className="wf-lobby-row">
        <div className="wf-lobby-left">
          <div className="wf-mini-av" style={{ background: "#8B94A7" }}>+8</div>
          <div>
            <b>8 more in the lobby</b>
            <span>Auto-admit is off</span>
          </div>
        </div>
        <span className="wf-counter-pill">View all</span>
      </div>
    </div>
  );
}

export default function BeforeMeetingSection() {
  return (
    <div className="wf-band wf-band-light" id="wf-before">
      <div className="wf-band-inner">
        <div className="wf-eyebrow" style={{ color: "#4C6EF5" }}>Before the meeting</div>
        <h3 className="wf-h3">Get the room booked and the right people in it.</h3>
        <p className="wf-lead">Scheduling, calendar sync, invites and the waiting room — sorted before anyone dials in.</p>

        <Reveal>
          <div className="wf-feat-row">
            <div className="wf-feat-copy">
              <div className="wf-feat-tag">04 · Schedule</div>
              <h4>Schedule meetings in seconds</h4>
              <p>Pick a slot, set it to repeat, and Meetings finds a time that works across every guest's calendar.</p>
              <ul className="wf-feat-list">
                <li>One-off or recurring meetings</li>
                <li>Auto-detects each guest's time zone</li>
                <li>Buffer time between back-to-back calls</li>
              </ul>
            </div>
            <WFScheduleVisual />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="wf-feat-row wf-rev">
            <div className="wf-feat-copy">
              <div className="wf-feat-tag">05 · Calendar sync</div>
              <h4>Add it straight to your calendar</h4>
              <p>Every scheduled call is pushed to your calendar automatically, with the join link attached — no separate step.</p>
              <ul className="wf-feat-list">
                <li>Two-way sync, so edits stay in sync both ways</li>
                <li>Works with the calendar apps your team already uses</li>
                <li>Reminder nudges 10 minutes before start</li>
              </ul>
            </div>
            <WFCalendarSyncVisual />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="wf-feat-row">
            <div className="wf-feat-copy">
              <div className="wf-feat-tag">06 · Invites</div>
              <h4>Invite the whole list by email</h4>
              <p>Paste a list of addresses or a distribution group and every guest gets the joining link, agenda and calendar hold in one send.</p>
              <ul className="wf-feat-list">
                <li>Bulk invite from a pasted list or CSV</li>
                <li>Optional message and agenda attached to the invite</li>
                <li>See who's opened and who's still pending</li>
              </ul>
            </div>
            <WFInviteVisual />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="wf-feat-row wf-rev">
            <div className="wf-feat-copy">
              <div className="wf-feat-tag">07 · Joining</div>
              <h4>Everyone joins without the chaos</h4>
              <p>Guests land in a lobby the moment they click the link, and step into the room the second the host lets them in — no app download required.</p>
              <ul className="wf-feat-list">
                <li>Join from a link, no account needed for guests</li>
                <li>Waiting room shows exactly who's arrived</li>
                <li>Handles large groups without lag</li>
              </ul>
            </div>
            <WFLobbyVisual />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
