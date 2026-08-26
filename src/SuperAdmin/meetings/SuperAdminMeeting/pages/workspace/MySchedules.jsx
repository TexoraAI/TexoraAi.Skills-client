// import React, { useState } from "react";
// import { Plus, CalendarClock } from "lucide-react";
// import PageHead from "../../components/PageHead";
// import { mySchedules } from "../../data/mockData";
// import { useWorkspaceModal } from "../../components/modals/ModalProvider";

// const TABS = ["Upcoming", "Today", "This Week", "This Month"];

// export default function MySchedules() {
//   const [tab, setTab] = useState("Upcoming");
//   const { openScheduleForm } = useWorkspaceModal();

//   return (
//     <div className="ws-content">
//       <PageHead
//         title="My Schedules"
//         subtitle="View and manage your personal schedules."
//         actions={
//           <button className="btn-primary" onClick={() => openScheduleForm()}>
//             <Plus size={15} /> Add Schedule
//           </button>
//         }
//       />

//       <div className="tab-strip">
//         {TABS.map((t) => (
//           <button key={t} className={`tab ${tab === t ? "is-active" : ""}`} onClick={() => setTab(t)}>
//             {t}
//           </button>
//         ))}
//       </div>

//       <section className="section-card">
//         {mySchedules.length === 0 ? (
//           <div className="empty-state">
//             <CalendarClock size={30} />
//             <h3>No schedules found</h3>
//             <p>Your personal schedule items will appear here.</p>
//           </div>
//         ) : (
//           mySchedules.map((s) => (
//             <div className={`list-row type-${s.type.toLowerCase()}`} key={s.id}>
//               <div className="list-row-date">
//                 <div className="mon">{s.date.split(" ")[0].toUpperCase()}</div>
//                 <div className="day">{s.date.split(" ")[1]}</div>
//               </div>
//               <div className="list-row-main">
//                 <div className="title">{s.title}</div>
//                 <div className="meta">
//                   {s.time} · {s.mode}
//                 </div>
//               </div>
//               <span className="badge">{s.type}</span>
//               <span className="badge info">{s.countdown}</span>
//             </div>
//           ))
//         )}
//       </section>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { Plus, CalendarClock } from "lucide-react";
import PageHead from "../../components/PageHead";
import { useWorkspaceModal } from "../../components/modals/ModalProvider";
import { useToast } from "../../components/Toast";
import { getMySchedules } from "../../../../../services/scheduleService";

const TABS = ["Upcoming", "Today", "This Week", "This Month"];

function formatTimeRange(startTime, endTime) {
  const fmt = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${h12}:${m} ${ampm}`;
  };
  return `${fmt(startTime)} - ${fmt(endTime)}`;
}

function formatDateParts(dateStr) {
  if (!dateStr) return { mon: "", day: "" };
  const d = new Date(dateStr);
  const mon = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = d.getDate();
  return { mon, day };
}
function getScheduleWindow(s) {
  if (!s.date || !s.startTime || !s.endTime) return null;
  const start = new Date(`${s.date}T${s.startTime}`);
  const end = new Date(`${s.date}T${s.endTime}`);
  return { start, end };
}

function renderJoinControl(s) {
  const window = getScheduleWindow(s);
  const now = new Date();

  if (!window) {
    return (
      <a
        href={s.meetingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="badge info"
        onClick={(e) => e.stopPropagation()}
      >
        Join
      </a>
    );
  }

  const { start, end } = window;

  if (now < start) {
    const dateLabel = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const timeLabel = start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    return (
      <span
        className="badge"
        title={`This meeting starts on ${dateLabel} at ${timeLabel}`}
        onClick={(e) => e.stopPropagation()}
      >
        Starts {dateLabel}, {timeLabel}
      </span>
    );
  }

  if (now >= start && now <= end) {
    return (
      <a
        href={s.meetingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="badge info"
        onClick={(e) => e.stopPropagation()}
      >
        Join now
      </a>
    );
  }

  return (
    <span className="badge" onClick={(e) => e.stopPropagation()}>
      Meeting ended
    </span>
  );
}

export default function MySchedules() {
  const [tab, setTab] = useState("Upcoming");
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { openScheduleForm } = useWorkspaceModal();
  const showToast = useToast();

  const loadSchedules = () => {
    setLoading(true);
    setError(null);
    getMySchedules(tab)
      .then((res) => setSchedules(res.data || []))
      .catch((err) => {
        console.error("Failed to load schedules:", err);
        setError("Could not load schedules. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <div className="ws-content">
      <PageHead
        title="My Schedules"
        subtitle="View and manage your personal schedules."
        actions={
          <button
            className="btn-primary"
            onClick={() => openScheduleForm(null, loadSchedules)}
          >
            <Plus size={15} /> Add Schedule
          </button>
        }
      />

      <div className="tab-strip">
        {TABS.map((t) => (
          <button
            key={t}
            className={`tab ${tab === t ? "is-active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <section className="section-card">
        {loading ? (
          <div className="empty-state">
            <p>Loading schedules...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <CalendarClock size={30} />
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button className="btn-ghost btn-sm" onClick={loadSchedules}>
              Retry
            </button>
          </div>
        ) : schedules.length === 0 ? (
          <div className="empty-state">
            <CalendarClock size={30} />
            <h3>No schedules found</h3>
            <p>Your personal schedule items will appear here.</p>
          </div>
        ) : (
          schedules.map((s) => {
            const { mon, day } = formatDateParts(s.date);
            return (
              <div
                className={`list-row type-${(s.type || "").toLowerCase()}`}
                key={s.id}
              >
                <div className="list-row-date">
                  <div className="mon">{mon}</div>
                  <div className="day">{day}</div>
                </div>
                <div className="list-row-main">
                  <div className="title">{s.title}</div>
                  <div className="meta">
                    {formatTimeRange(s.startTime, s.endTime)}
                    {s.location ? ` · ${s.location}` : ""}
                  </div>
                </div>
                {/* <span className="badge">{s.type}</span>
                {s.meetingUrl ? (
                  <a
                    href={s.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge info"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Join
                  </a>
                ) : null}
              </div>
            );
          }) */}
                <span className="badge">{s.type}</span>
                {s.meetingUrl ? renderJoinControl(s) : null}
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
