import { useState } from "react";
import { ShieldCheck, CalendarDays, Check, X } from "lucide-react";
import Reveal from "./Reveal";

const WF_INITIAL_REQUESTS = [
  { id: 1, name: "Aman Verma", meta: "Requesting to join · external guest", color: "#EC6A6A", initial: "A" },
  { id: 2, name: "Priya Nair", meta: "Requesting to join · company account", color: "#4C6EF5", initial: "P" },
  { id: 3, name: "Unknown guest", meta: "Joined without a name", color: "#8B94A7", initial: "?" },
];

const WF_HISTORY = [
  { id: 1, name: "Aman Verma", time: "Requested 10:02 AM", status: "wf-admitted", label: "Joined" },
  { id: 2, name: "Unknown guest", time: "Requested 10:04 AM", status: "wf-denied", label: "Denied" },
  { id: 3, name: "Priya Nair", time: "Requested 10:05 AM", status: "wf-pending", label: "Never responded" },
  { id: 4, name: "Karan Shah", time: "Requested 10:11 AM", status: "wf-admitted", label: "Joined" },
];

function WFJoinRequestsVisual() {
  const [requests, setRequests] = useState(WF_INITIAL_REQUESTS);
  const resolve = (id) => setRequests((r) => r.filter((x) => x.id !== id));

  return (
    <div className="wf-visual wf-visual-dark">
      {requests.length === 0 && <p className="wf-empty">No pending requests — nice and clear.</p>}
      {requests.map((r) => (
        <div className="wf-host-req" key={r.id}>
          <div className="wf-host-req-left">
            <span className="wf-mini-av" style={{ background: r.color }}>{r.initial}</span>
            <div>
              <b>{r.name}</b>
              <span>{r.meta}</span>
            </div>
          </div>
          <div className="wf-host-req-actions">
            <button className="wf-req-btn wf-accept" type="button" title="Accept" onClick={() => resolve(r.id)}>
              <Check size={16} />
            </button>
            <button className="wf-req-btn wf-deny" type="button" title="Deny" onClick={() => resolve(r.id)}>
              <X size={16} />
            </button>
          </div>
        </div>
      ))}

      <div className="wf-trust-row">
        <div className="wf-trust-card">
          <ShieldCheck size={18} />
          <b>Verified, every time</b>
          <span>No one gets in unless invited or admitted by the host.</span>
        </div>
        <div className="wf-trust-card">
          <CalendarDays size={18} />
          <b>Attendance, automatically</b>
          <span>Every join and leave is logged — no manual roll call needed.</span>
        </div>
      </div>
    </div>
  );
}

function WFJoinHistoryVisual() {
  return (
    <div className="wf-visual wf-visual-dark">
      <div className="wf-req-history">
        {WF_HISTORY.map((h) => (
          <div className="wf-req-hist-row" key={h.id}>
            <div className="wf-req-hist-left">
              <b>{h.name}</b>
              <span>{h.time}</span>
            </div>
            <span className={`wf-req-status ${h.status}`}>{h.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HostControlsSection() {
  return (
    <div className="wf-band wf-band-tint" id="wf-host">
      <div className="wf-band-inner">
        <div className="wf-eyebrow" style={{ color: "#f97316" }}>Host controls</div>
        <h3 className="wf-h3">You decide who's in the room.</h3>
        <p className="wf-lead">Approve or turn away join requests one by one — tap accept or deny below to try it.</p>

        <Reveal>
          <div className="wf-feat-row">
            <div className="wf-feat-copy">
              <div className="wf-feat-tag">16 · Accept / deny</div>
              <h4>Every join request needs your say-so</h4>
              <p>When the room is locked, guests wait in the lobby until the host lets them in — one at a time or all together.</p>
              <ul className="wf-feat-list">
                <li>Accept or deny each request individually</li>
                <li>Lock the room once everyone expected has joined</li>
                <li>Hand host controls to a co-host if you step away</li>
              </ul>
            </div>
            <WFJoinRequestsVisual />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="wf-feat-row wf-rev">
            <div className="wf-feat-copy">
              <div className="wf-feat-tag">17 · Join history</div>
              <h4>See who asked, and what happened</h4>
              <p>A full record of every join request for the meeting — who got in, who was turned away, and who never got a response.</p>
              <ul className="wf-feat-list">
                <li>Filter by admitted, denied, or never responded</li>
                <li>Guest name, email, and request time on every entry</li>
                <li>Useful for compliance or just closing the loop later</li>
              </ul>
            </div>
            <WFJoinHistoryVisual />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
