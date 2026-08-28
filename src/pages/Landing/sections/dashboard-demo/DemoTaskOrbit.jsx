import { useState } from "react";
import { Layers, Plus, Users, Video } from "lucide-react";
import DemoPageHead from "./DemoPageHead";
import { taskOrbitRooms } from "./demoData";

const TABS = ["Active", "Scheduled", "Archived"];
const STATUS_BADGE = { Active: "live", Scheduled: "info", Archived: "muted" };

export default function DemoTaskOrbit({ onToast }) {
  const [tab, setTab] = useState("Active");
  const rooms = taskOrbitRooms.filter((r) => r.status === tab);

  return (
    <div className="ws-content">
      <DemoPageHead
        eyebrow="Focused breakout rooms"
        title="Task Orbit Meeting"
        subtitle="Small, task-linked rooms that orbit around a bigger meeting or project."
        actions={
          <button
            className="btn-primary"
            onClick={() => onToast("Demo mode — 'New Orbit Room' opens a form in the real product")}
          >
            <Plus size={15} /> New Orbit Room
          </button>
        }
      />

      <div className="toolbar-row">
        <div className="pill-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`pill-tab ${tab === t ? "is-active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {rooms.length === 0 ? (
        <div className="section-card empty-state">
          <Layers size={26} />
          <h3>No {tab.toLowerCase()} orbit rooms</h3>
          <p>Task Orbit rooms let a small group split off to work a task, then rejoin the main meeting.</p>
        </div>
      ) : (
        <section className="section-card">
          {rooms.map((r) => (
            <div className="list-row" key={r.id}>
              <div className="list-row-main">
                <div className="title">{r.task}</div>
                <div className="meta">
                  Linked to "{r.parentMeeting}" ·{" "}
                  <Users size={11} style={{ verticalAlign: "-2px" }} /> {r.members} members
                </div>
              </div>
              <span className={`badge ${STATUS_BADGE[r.status]}`}>
                {r.status === "Active" ? "Orbiting now" : r.status}
              </span>
              <button
                className="btn-ghost btn-sm"
                onClick={() => onToast(`Opening "${r.task}" orbit room (demo)`)}
              >
                <Video size={13} /> Enter
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
