// import { Video, Circle, CalendarDays, ShieldCheck } from "lucide-react";
// import Reveal from "./Reveal";
// import DashboardDemo from "./dashboard-demo/DashboardDemo";

// const WF_DASH_STATS = [
//   { icon: Video, tone: "", value: "248", label: "Total sessions", delta: "↑ 18% this month" },
//   { icon: Circle, tone: "wf-tone-live", value: "3", label: "Live right now", delta: "Across 3 batches" },
//   { icon: CalendarDays, tone: "", value: "17", label: "Scheduled today", delta: "Next in 24 min" },
//   { icon: ShieldCheck, tone: "wf-tone-amber", value: "96%", label: "Attendance rate", delta: "↑ 4% vs last week" },
// ];

// export default function DashboardSection() {
//   return (
//     <div className="wf-band wf-band-light" id="wf-dashboard">
//       <div className="wf-band-inner">
//         <div className="wf-eyebrow" style={{ color: "#4C6EF5" }}>Dashboard</div>
//         <h3 className="wf-h3">See Workspace in action.</h3>
//         <p className="wf-lead">
//           This isn't a screenshot — it's the actual Workspace admin dashboard.
//           Click through Overview, Events, Calendar, Contacts, Availability and
//           more, exactly like you would after signing in.
//         </p>

//         <Reveal>
//           <div className="wf-dash-stat-grid">
//             {WF_DASH_STATS.map((s, i) => (
//               <Reveal key={s.label} delay={i * 60} className="wf-dash-stat-reveal">
//                 <div className={`wf-dash-stat-card ${s.tone}`}>
//                   <div className="wf-dash-stat-icon">
//                     <s.icon size={16} />
//                   </div>
//                   <div className="wf-dash-stat-value">{s.value}</div>
//                   <div className="wf-dash-stat-label">{s.label}</div>
//                   <div className="wf-dash-stat-delta">{s.delta}</div>
//                 </div>
//               </Reveal>
//             ))}
//           </div>
//         </Reveal>

//         <Reveal delay={80}>
//           <div style={{ paddingTop: 28 }}>
//             <DashboardDemo />
//           </div>
//         </Reveal>
//       </div>
//     </div>
//   );
// }






























import { useEffect, useRef, useState } from "react";
import { Video, Circle, CalendarDays, ShieldCheck, LayoutDashboard } from "lucide-react";
import Reveal from "./Reveal";
import DashboardDemo from "./dashboard-demo/DashboardDemo";

const WF_DASH_STATS = [
  { icon: Video, tone: "", value: "248", label: "Total sessions", delta: "↑ 18% this month" },
  { icon: Circle, tone: "wf-tone-live", value: "3", label: "Live right now", delta: "Across 3 batches", pulse: true },
  { icon: CalendarDays, tone: "", value: "17", label: "Scheduled today", delta: "Next in 24 min" },
  { icon: ShieldCheck, tone: "wf-tone-amber", value: "96%", label: "Attendance rate", delta: "↑ 4% vs last week" },
];

/* Fires once a ref scrolls into view — same IntersectionObserver pattern
   as Reveal.jsx, kept local so the count-up below doesn't depend on
   Reveal's internal state. */
function useInView(threshold = 0.4) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

/* Animates "248" -> counts up 0→248, "96%" -> 0%→96% etc. Purely
   presentational — parses the leading number, keeps whatever suffix
   (e.g. "%") follows it, and eases in over ~1.1s once visible. */
function CountUpValue({ value, duration = 1100 }) {
  const match = /^(-?\d+(?:\.\d+)?)(.*)$/.exec(value);
  const target = match ? parseFloat(match[1]) : null;
  const suffix = match ? match[2] : "";
  const isInt = target !== null && Number.isInteger(target);
  const [ref, inView] = useInView(0.4);
  const [display, setDisplay] = useState(target === null ? value : isInt ? "0" : "0.0");

  useEffect(() => {
    if (!inView || target === null) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const cur = target * eased;
      setDisplay(isInt ? String(Math.round(cur)) : cur.toFixed(1));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, isInt]);

  return <span ref={ref}>{target === null ? value : `${display}${suffix}`}</span>;
}

export default function DashboardSection() {
  return (
    <div className="wf-band wf-band-light wf-dash-hero" id="wf-dashboard">
      <div className="wf-dash-hero-glow" aria-hidden="true" />
      <div className="wf-band-inner">
        <Reveal>
          <div className="wf-dash-eyebrow">
            <LayoutDashboard size={13} /> Dashboard
          </div>
        </Reveal>
        <Reveal delay={40}>
          <h3 className="wf-h3">
            See your whole workspace <span className="wf-dash-heading-accent">come alive</span>.
          </h3>
        </Reveal>
        <Reveal delay={80}>
          <p className="wf-lead">
            This isn't a screenshot — it's the actual Workspace admin dashboard.
            Click through Overview, Events, Calendar, Contacts, Availability and
            more, exactly like you would after signing in.
          </p>
        </Reveal>

        <div className="wf-dash-stat-grid">
          {WF_DASH_STATS.map((s, i) => (
            <Reveal key={s.label} delay={140 + i * 90} className="wf-dash-stat-reveal">
              <div className={`wf-dash-stat-card ${s.tone}`}>
                <div className={`wf-dash-stat-icon ${s.pulse ? "wf-dash-icon-pulse" : ""}`}>
                  <s.icon size={16} />
                </div>
                <div className="wf-dash-stat-value">
                  <CountUpValue value={s.value} />
                </div>
                <div className="wf-dash-stat-label">{s.label}</div>
                <div className="wf-dash-stat-delta">{s.delta}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={480}>
          <div style={{ paddingTop: 28 }}>
            <DashboardDemo />
          </div>
        </Reveal>
      </div>
    </div>
  );
}