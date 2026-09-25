
import React, { useState, useEffect, useRef, useCallback } from "react";

// Same shared shell used by every other public page (Careers, ManagerHub,
// About, Pricing, Contact, FAQ, etc). Lives at src/pages/Landing/components/PublicLayout.
// If this file lives somewhere other than alongside those pages, adjust this path.
import PublicLayout from "../Landing/components/PublicLayout";

// Integration logos (from Icon_ilmora_calendry.zip). Copy the "integrations"
// folder into your assets directory and adjust these import paths to match.
// Path matches: src/pages/Landing/ilmorameet.jsx -> ../../assets/integration-icons-webp/
// If you move the folder later (e.g. to src/assets/icons/integrations), update these paths to match.
import zoomIcon from "../../assets/integration-icons-webp/zoom-logo-icon-1.webp";
import googleCalendarIcon from "../../assets/integration-icons-webp/google-calendar-icon.webp";
import gmailIcon from "../../assets/integration-icons-webp/google-gmail-icon.webp";
import hubspotIcon from "../../assets/integration-icons-webp/hubspot.webp";
import slackIcon from "../../assets/integration-icons-webp/slack-logo-icon.webp";
import teamsIcon from "../../assets/integration-icons-webp/microsoft-teams-logo-icon.webp";
import chromeIcon from "../../assets/integration-icons-webp/chrome-logo.webp";
import linkedinIcon from "../../assets/integration-icons-webp/linkedin-logo-icon.webp";
import openaiIcon from "../../assets/integration-icons-webp/openai-icon.webp";
import claudeIcon from "../../assets/integration-icons-webp/claude-icon.webp";
import greenhouseIcon from "../../assets/integration-icons-webp/greenhouse-logo-icon.webp";
import microsoftIcon from "../../assets/integration-icons-webp/microsoft-logo-icon.webp";
import paypalIcon from "../../assets/integration-icons-webp/paypal-icon.webp";
import salesforceIcon from "../../assets/integration-icons-webp/saleforce.webp";
import meetIcon from "../../assets/integration-icons-webp/google-meet-icon.webp";

/**
 * ILM ORA — full landing page, ported from the static HTML build.
 * Nav + footer come from PublicLayout (same as the rest of the site);
 * everything between them is this page's own content and styles, scoped
 * under `.ilmora-landing` so nothing here leaks onto the shared shell.
 */

/* ================= data ================= */

const CHAT_MESSAGES = [
  ["AS", "av-b", "Can you show a real spec, not a template?"],
  ["MR", "av-a", "Sharing one now. Notice how it opens with the decision."],
  ["RK", "av-c", "Posted my draft in the assignment tab."],
  ["DP", "av-d", "Which metric would you pick for onboarding?"],
  ["MR", "av-a", "One you can move within a week. Let\u2019s work through it."],
];

const JOURNEY = [
  {
    title: "Discover",
    desc: "Find the class that fits your goal and your level.",
    steps: [
      "Browse tracks by goal and experience",
      "See the mentor, schedule and syllabus first",
      "Reserve your seat in one tap",
    ],
  },
  {
    title: "Join live",
    desc: "Learn in the room with the mentor, not from a recording.",
    steps: [
      "Join from your phone or laptop",
      "Ask questions and get answers as you go",
      "Rewatch the session whenever you need",
    ],
  },
  {
    title: "Practice",
    desc: "Apply the lesson to a real task the same week.",
    steps: [
      "Get an assignment based on real work",
      "Receive feedback from mentors and Texora AI",
      "Revise and resubmit until it is strong",
    ],
  },
  {
    title: "Get certified",
    desc: "Finish with proof of skill you can show to employers.",
    steps: [
      "Receive your certificate when you complete a track",
      "Share a verifiable link on your profile",
      "Keep your progress across every course",
    ],
  },
];

const TRACKS = [
  {
    id: "t-product",
    nav: "Product",
    cls: "tr-product",
    h: "Product management",
    p: "Learn to find the right problem, write the plan and measure the result.",
    weeks: [
      ["Week 1", "Discovery and problem framing"],
      ["Week 2", "Specs, priorities and roadmaps"],
      ["Week 3", "Metrics and experiments"],
      ["Week 4", "Launch and iterate"],
    ],
    outputs: ["One-page spec", "Roadmap", "Metrics tree"],
  },
  {
    id: "t-design",
    nav: "Design",
    cls: "tr-design",
    h: "UX design",
    p: "Move from research to a clickable prototype you can present with confidence.",
    weeks: [
      ["Week 1", "User research and flows"],
      ["Week 2", "Wireframes and interaction"],
      ["Week 3", "Visual design and systems"],
      ["Week 4", "Usability testing and handoff"],
    ],
    outputs: ["Case study", "Prototype", "Design system starter"],
  },
  {
    id: "t-growth",
    nav: "Growth",
    cls: "tr-growth",
    h: "Growth",
    p: "Understand the funnel, run better experiments and keep users coming back.",
    weeks: [
      ["Week 1", "Funnels and retention"],
      ["Week 2", "Experiment design"],
      ["Week 3", "Lifecycle messaging"],
      ["Week 4", "Attribution and reporting"],
    ],
    outputs: ["Experiment plan", "Funnel report", "Lifecycle map"],
  },
  {
    id: "t-marketing",
    nav: "Marketing",
    cls: "tr-marketing",
    h: "Marketing",
    p: "Say the right thing to the right people, and prove what worked.",
    weeks: [
      ["Week 1", "Positioning and messaging"],
      ["Week 2", "Content and search"],
      ["Week 3", "Paid and performance"],
      ["Week 4", "Brand and community"],
    ],
    outputs: ["Messaging doc", "Content calendar", "Campaign brief"],
  },
];

const STORIES = [
  {
    cls: "s1",
    avatar: "AS",
    av: "av-b",
    metric: "3 interviews in 4 weeks",
    quote:
      "\u201CThe spec I wrote in class became the centrepiece of my interview. I finally had something real to talk about.\u201D",
    who: "Ananya S.",
    role: "Junior product manager, Product track",
  },
  {
    cls: "s2",
    avatar: "RK",
    av: "av-c",
    metric: "Portfolio ready in 6 weeks",
    quote:
      "\u201CWeekly feedback from a working designer changed how I explain my decisions. My case study finally read like a story.\u201D",
    who: "Rahul K.",
    role: "UX designer, Design track",
  },
  {
    cls: "s3",
    avatar: "DP",
    av: "av-d",
    metric: "2\u00D7 signup conversion",
    quote:
      "\u201CI ran the first experiment from the course on our own landing page. The result convinced my team to test every week.\u201D",
    who: "Divya P.",
    role: "Growth associate, Growth track",
  },
  {
    cls: "s4",
    avatar: "IA",
    av: "av-a",
    metric: "Promoted to team lead",
    quote:
      "\u201CThe messaging framework gave my team a shared language. Leadership noticed, and so did our campaign results.\u201D",
    who: "Imran A.",
    role: "Marketing lead, Marketing track",
  },
];

const MARQUEE = [
  { ico: "i-blue", title: "Seat reserved", sub: "Product Strategy Sprint", icon: "calendar" },
  { ico: "i-mint", title: "Session attended", sub: "Live with an industry mentor", icon: "video" },
  { ico: "i-peach", title: "Assignment graded", sub: "Feedback in your inbox", icon: "check" },
  { ico: "i-lav", title: "Certificate earned", sub: "Verifiable link ready to share", icon: "seal" },
  { ico: "i-butter", title: "Portfolio shared", sub: "Case study published", icon: "chart" },
  { ico: "i-blue", title: "Interview booked", sub: "Your next step, scheduled", icon: "briefcase" },
];

// Row 1 / Row 2 layout mirrors the reference (Calendly-style) integrations grid.
const INTEGRATIONS_ROW_1 = [
  { name: "Zoom", icon: zoomIcon },
  { name: "Google Calendar", icon: googleCalendarIcon },
  { name: "Gmail", icon: gmailIcon },
  { name: "HubSpot", icon: hubspotIcon },
  { name: "Slack", icon: slackIcon },
  { name: "Microsoft Teams", icon: teamsIcon },
  { name: "Chrome", icon: chromeIcon },
  { name: "LinkedIn", icon: linkedinIcon },
];
const INTEGRATIONS_ROW_2 = [
  { name: "OpenAI", icon: openaiIcon },
  { name: "Claude", icon: claudeIcon },
  { name: "Greenhouse", icon: greenhouseIcon },
  { name: "Microsoft", icon: microsoftIcon },
  { name: "PayPal", icon: paypalIcon },
  { name: "Salesforce", icon: salesforceIcon },
  { name: "Google Meet", icon: meetIcon },
];

const INTEGRATION_SUITES = [
  {
    icon: googleCalendarIcon,
    title: "Google Workspace",
    desc: "Get your class schedule done faster by connecting ILM ORA to Google Calendar, Meet, Gmail and more.",
  },
  {
    icon: microsoftIcon,
    title: "Microsoft suite",
    desc: "Make live sessions easier with integrations for Microsoft Teams, Outlook and more.",
  },
];

/* ================= small icons ================= */

function CheckIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function SealIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="6" />
      <path d="m8.5 14 -1.5 8 5-3 5 3-1.5-8" />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function VideoIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="6" width="13" height="12" rx="3" /><path d="m16 10 5-3v10l-5-3" />
    </svg>
  );
}
function SparkIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  );
}
function ShieldIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function ChatDotsIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 5h16v11H8l-4 4V5Z" /><path d="M8 10h.01M12 10h.01M16 10h.01" />
    </svg>
  );
}
function ChevronIcon({ dir = "left" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir === "right" ? "rotate(180deg)" : "none" }}>
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}
function marqueeIcon(name) {
  switch (name) {
    case "calendar":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      );
    case "video":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="13" height="12" rx="3" /><path d="m16 10 5-3v10l-5-3" />
        </svg>
      );
    case "check":
      return <CheckIcon width="20" height="20" strokeWidth="2.4" />;
    case "seal":
      return <SealIcon />;
    case "chart":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="3" /><path d="m3 15 5-5 4 4 3-3 6 6" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="7" width="18" height="13" rx="3" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </svg>
      );
  }
}

/* ================= reveal-on-scroll hook ================= */

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ================= main component ================= */

export default function IlmoraMeet({
  // theme / toggleTheme were previously accepted as props and just forwarded
  // to PublicLayout without IlmoraMeet ever using them itself — the page's
  // own CSS never responded to a theme change, so clicking the toggle did
  // nothing here even though it worked on StudentHub. This component now
  // manages dark mode itself, the same way StudentHub does.
  setShowLoginModal,
  scrollToSection,
}) {
  const [reduce, setReduce] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return document.documentElement.classList.contains("dark");
    } catch {
      return false;
    }
  });

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Stay in sync if the theme is changed from another tab/page.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "theme") setDarkMode(e.newValue === "dark");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch {
        // ignore storage errors (e.g. private browsing)
      }
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return (
    <PublicLayout
      theme={darkMode ? "dark" : "light"}
      toggleTheme={toggleTheme}
      setShowLoginModal={setShowLoginModal}
      scrollToSection={scrollToSection}
    >
      <div className={`ilmora-landing${darkMode ? " dark" : ""}`} id="top">
        <style>{CSS}</style>

        <main>
          <Hero reduce={reduce} />
          <BookingShowcase reduce={reduce} />
          <Journey reduce={reduce} />
          <Tracks />
          <Stories />
          <Marquee reduce={reduce} />
          <Integrations />
        </main>
      </div>
    </PublicLayout>
  );
}

/* ---------------- Hero ---------------- */

function Hero({ reduce }) {
  const [chat, setChat] = useState(CHAT_MESSAGES.slice(0, 3));
  const idxRef = useRef(3);
  const [seconds, setSeconds] = useState(42 * 60 + 18);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => {
      const m = CHAT_MESSAGES[idxRef.current % CHAT_MESSAGES.length];
      idxRef.current += 1;
      setChat((prev) => [...prev, m].slice(-3));
    }, 2800);
    return () => clearInterval(t);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [reduce]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <section className="hero">
      <div className="wrap hero-in">
        <div className="hero-copy">
          <h1>Learn live from people who do the work.</h1>
          <p className="lead">
            Master Product, Design, Growth and Marketing in live sessions led by industry experts,
            with real assignments, feedback and a certificate at the end.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#join">Join a live class</a>
            <a className="btn btn-line" href="#tracks">Explore the tracks</a>
          </div>
          <p className="fine">Pick a track, reserve a seat and join from any device.</p>
        </div>

        <div className="hero-stage">
          <div
            className="live"
            role="img"
            aria-label="Preview of a live class with a mentor, learner chat and a graded assignment notification"
          >
            <div className="live-bar" aria-hidden="true">
              <span className="live-tag"><i /> Live</span>
              <span className="live-title">Writing a spec engineers actually read</span>
              <span className="live-time">{mm}:{ss}</span>
            </div>
            <div className="live-video" aria-hidden="true">
              <div className="mentor">
                <span className="avatar lg av-a">MR</span>
                <div className="eq"><i /><i /><i /><i /><i /></div>
              </div>
              <div className="caption">Start with the decision the reader has to make.</div>
              <div className="thumbs">
                <span className="avatar sm av-b">AS</span>
                <span className="avatar sm av-c">RK</span>
                <span className="avatar sm av-d">DP</span>
              </div>
            </div>
            <div className="chat" aria-hidden="true">
              {chat.map((m, i) => (
                <div className="msg" key={`${m[0]}-${i}-${m[2].slice(0, 6)}`}>
                  <span className={`avatar xs ${m[1]}`}>{m[0]}</span>
                  <span className="bubble">{m[2]}</span>
                </div>
              ))}
            </div>
            <div className="live-foot" aria-hidden="true">
              <span>148 learners in the room</span>
              <span className="hand">Hand raised</span>
            </div>
          </div>

          <div className="chip chip-a" aria-hidden="true">
            <span className="ico"><CheckIcon width="18" height="18" /></span>
            <span><b>Assignment graded</b><small>92 out of 100</small></span>
          </div>
          <div className="chip chip-b" aria-hidden="true">
            <span className="ico"><SealIcon /></span>
            <span><b>Certificate ready</b><small>Product Management</small></span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Booking showcase ---------------- */
/* Ported from the Calendly hero: a gradient card peeking with floating
   icon bubbles at the top, a glass info panel on the left and a live
   calendar/time-slot mock on the right. A fake cursor drives the whole
   demo automatically on a loop (pick a date -> pick a slot -> confirm),
   so nothing needs to be clicked for the motion to happen. */

// Each floating icon now drives its OWN panel: its own left-side copy and
// its own right-side mock, not just a shared calendar. `key` matches the
// panel that BookingShowcase renders below. `duration` is how long that
// panel stays on screen during the automatic cycle before advancing to the
// next one (the calendar panel gets more time since it runs its own
// pick-a-date -> pick-a-slot -> confirm animation).
const FEATURES = [
  {
    key: "video",
    Icon: VideoIcon,
    label: "Live sessions",
    badge: "Scheduling",
    heading: "Book a seat with the world\u2019s best mentors",
    desc: "Giving you complete control over your calendar, ILM ORA makes it the easiest and most flexible way to find your next live class.",
    linkText: "Learn more",
    duration: 7200,
  },
  {
    key: "spark",
    Icon: SparkIcon,
    label: "AI-matched mentors",
    badge: "AI matching",
    heading: "Get matched to the right mentor, instantly",
    desc: "Texora AI reads your goal and current level, then recommends the class and mentor most likely to move you forward this week.",
    linkText: "See how matching works",
    duration: 3200,
  },
  {
    key: "shield",
    Icon: ShieldIcon,
    label: "Verified credentials",
    badge: "Credentials",
    heading: "A certificate employers can actually check",
    desc: "Every certificate carries a verifiable link, so anyone you share it with can confirm it in seconds.",
    linkText: "View a sample certificate",
    duration: 3200,
  },
  {
    key: "chat",
    Icon: ChatDotsIcon,
    label: "Live chat support",
    badge: "Support",
    heading: "Help is one message away",
    desc: "Stuck mid-assignment or unsure which track fits? Message a mentor or our support team and get a real answer, fast.",
    linkText: "Message support",
    duration: 3200,
  },
];

const CURSOR_DATE = 24;
const CURSOR_SLOT = "2:00 PM";

function BookingShowcase({ reduce }) {
  const [headRef, headIn] = useReveal();
  const [cardRef, cardIn] = useReveal(0.2);

  const stageRef = useRef(null);
  const dateElRef = useRef(null);
  const slotElRef = useRef(null);
  const confirmElRef = useRef(null);

  const [cursor, setCursor] = useState({ x: 24, y: 24, show: false });
  const [pickedDate, setPickedDate] = useState(19);
  const [pickedSlot, setPickedSlot] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [activeFloat, setActiveFloat] = useState(0);
  const current = FEATURES[activeFloat];
  const isVideoActive = activeFloat === 0;

  // Auto-advance through the four feature panels. Each panel gets its own
  // dwell time (see FEATURES[].duration) before moving to the next one.
  // Clicking an icon jumps straight to that panel and restarts the timer
  // from there, so manual and automatic motion share the same state.
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => {
      setActiveFloat((i) => (i + 1) % FEATURES.length);
    }, FEATURES[activeFloat].duration);
    return () => clearTimeout(t);
  }, [reduce, activeFloat]);

  // The pick-a-date -> pick-a-slot -> confirm cursor demo only plays while
  // the "Live sessions" (calendar) panel is the one on screen. Switching to
  // any other panel resets it so it starts clean the next time it's shown.
  useEffect(() => {
    if (reduce) {
      setPickedDate(CURSOR_DATE);
      setPickedSlot(CURSOR_SLOT);
      return;
    }
    if (!isVideoActive) {
      setPickedDate(19);
      setPickedSlot(null);
      setConfirming(false);
      setCursor((c) => ({ ...c, show: false }));
      return;
    }

    let cancelled = false;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    const moveCursorTo = (el) => {
      if (!el || !stageRef.current) return;
      const target = el.getBoundingClientRect();
      const stage = stageRef.current.getBoundingClientRect();
      setCursor({
        x: target.left - stage.left + target.width / 2,
        y: target.top - stage.top + target.height / 2,
        show: true,
      });
    };

    async function run() {
      setPickedDate(19);
      setPickedSlot(null);
      setConfirming(false);
      setCursor((c) => ({ ...c, x: 24, y: 24, show: false }));
      await wait(500);
      if (cancelled) return;

      moveCursorTo(dateElRef.current);
      await wait(650);
      if (cancelled) return;
      setPickedDate(CURSOR_DATE);
      await wait(550);
      if (cancelled) return;

      moveCursorTo(slotElRef.current);
      await wait(650);
      if (cancelled) return;
      setPickedSlot(CURSOR_SLOT);
      await wait(550);
      if (cancelled) return;

      moveCursorTo(confirmElRef.current);
      await wait(650);
      if (cancelled) return;
      setConfirming(true);
      await wait(900);
      if (cancelled) return;

      setCursor((c) => ({ ...c, show: false }));
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [isVideoActive, reduce]);

  return (
    <section className="section booking" id="booking">
      <div className="wrap">
        <div ref={headRef} className={`sec-head center reveal${headIn ? " in" : ""}`}>
          <h2>Book your next session in seconds</h2>
          <p>One calendar for every mentor, every track, every time zone.</p>
        </div>

        <div ref={cardRef} className={`booking-card reveal${cardIn ? " in" : ""}`}>
          <div className="booking-floaters" role="tablist" aria-label="ILM ORA features">
            {FEATURES.map(({ Icon, label }, i) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={activeFloat === i}
                title={label}
                className={`float-ico${activeFloat === i ? " is-active" : ""}${reduce ? " no-float" : ""}`}
                style={{ animationDelay: `${i * 0.35}s` }}
                onClick={() => setActiveFloat(i)}
              >
                <Icon />
                <span className="float-label">{label}</span>
              </button>
            ))}
          </div>

          <div className="booking-panels" ref={stageRef}>
            <div className="booking-info" key={`info-${current.key}`}>
              <span className="badge">{current.badge}</span>
              <h3>{current.heading}</h3>
              <p>{current.desc}</p>
              <a className="link-underline" href="#tracks">{current.linkText} <ArrowRightIcon /></a>
            </div>

            <div className="booking-visual" key={`visual-${current.key}`} aria-hidden="true">
              {current.key === "video" && (
                <div className="booking-calendar">
                  <div className="bc-head">
                    <span>September 2026</span>
                    <span className="bc-nav">
                      <i><ChevronIcon dir="left" /></i>
                      <i><ChevronIcon dir="right" /></i>
                    </span>
                  </div>
                  <div className="bc-week">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <span key={i}>{d}</span>
                    ))}
                  </div>
                  <div className="bc-days">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                      <span
                        key={d}
                        ref={d === CURSOR_DATE ? dateElRef : null}
                        className={d === 19 ? "is-today" : d === pickedDate ? "is-picked" : ""}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                  <div className="bc-slots">
                    {["10:00 AM", CURSOR_SLOT, "4:30 PM"].map((s) => (
                      <span
                        key={s}
                        ref={s === CURSOR_SLOT ? slotElRef : null}
                        className={`bc-slot${s === pickedSlot ? " is-picked" : ""}`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div
                    ref={confirmElRef}
                    className={`bc-confirm${confirming ? " is-confirming" : ""}`}
                  >
                    {confirming ? "Seat confirmed" : "Confirm seat"}
                  </div>
                </div>
              )}

              {current.key === "spark" && (
                <div className="feature-card match-card">
                  <span className="mini-badge">Texora AI match</span>
                  <div className="match-row">
                    <span className="avatar sm av-a">MR</span>
                    <div>
                      <b>Meera Rao</b>
                      <small>Product mentor &middot; 98% fit for your goal</small>
                    </div>
                  </div>
                  <div className="match-row">
                    <span className="avatar sm av-b">AS</span>
                    <div>
                      <b>Writing Specs Engineers Read</b>
                      <small>Recommended next class, Sunday 11:00</small>
                    </div>
                  </div>
                  <div className="m-btn"><span>View match</span></div>
                </div>
              )}

              {current.key === "shield" && (
                <div className="feature-card cert-mini">
                  <small>Certificate of completion</small>
                  <h4>Product Management</h4>
                  <div className="who">Ananya Sharma</div>
                  <small>completed all sessions and assignments</small>
                  <span className="verified">
                    <CheckIcon width="16" height="16" strokeWidth="2.6" />
                    Verified credential
                  </span>
                </div>
              )}

              {current.key === "chat" && (
                <div className="feature-card chat-mini">
                  <div className="msg">
                    <span className="avatar xs av-c">RK</span>
                    <span className="bubble">Which metric should I pick for onboarding?</span>
                  </div>
                  <div className="msg">
                    <span className="avatar xs av-a">MR</span>
                    <span className="bubble">Start with activation rate in week one.</span>
                  </div>
                  <div className="m-btn"><span>Ask a mentor</span></div>
                </div>
              )}

              {!reduce && isVideoActive && (
                <div
                  className={`fake-cursor${cursor.show ? " is-visible" : ""}${confirming ? " is-clicking" : ""}`}
                  style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
                  aria-hidden="true"
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M2 1.5 19 9.2l-6.9 1.6L9 19 2 1.5Z" fill="#1a1a2e" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Learning journey (accordion + auto-advance) ---------------- */

function Journey({ reduce }) {
  const [headRef, headIn] = useReveal();
  const tabsRef = useRef(null);
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState("idle"); // idle | play | manual
  const [runId, setRunId] = useState(0);

  const setIndex = useCallback((n, manual) => {
    setActive((cur) => {
      const total = JOURNEY.length;
      const next = ((n % total) + total) % total;
      return next;
    });
    if (manual) setMode("manual");
    setRunId((k) => k + 1);
  }, []);

  useEffect(() => {
    if (reduce) {
      setMode("manual");
      return;
    }
    const el = tabsRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          setMode((m) => (m === "manual" ? m : e.isIntersecting ? "play" : "idle"));
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const onBarEnd = () => {
    if (mode === "play") setIndex(active + 1, false);
  };

  const onKeyDown = (e, k) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const t = (k + (e.key === "ArrowDown" ? 1 : -1) + JOURNEY.length) % JOURNEY.length;
      setIndex(t, true);
      requestAnimationFrame(() => {
        document.getElementById(`acc-btn-${t + 1}`)?.focus();
      });
    }
  };

  return (
    <section className="section" id="journey">
      <div className="wrap">
        <div ref={headRef} className={`sec-head reveal${headIn ? " in" : ""}`}>
          <h2>Everything between “I want to learn this” and “I can do this”</h2>
          <p>From choosing a class to holding a certificate, each step happens in one place.</p>
        </div>

        <div className="tabs" id="tabs" ref={tabsRef} data-mode={mode}>
          <div className="acc-list">
            {JOURNEY.map((item, k) => {
              const isActive = k === active;
              return (
                <div className={`acc${isActive ? " is-active" : ""}`} key={item.title}>
                  <button
                    className="acc-btn"
                    id={`acc-btn-${k + 1}`}
                    aria-expanded={isActive}
                    aria-controls={`acc-p-${k + 1}`}
                    onClick={() => setIndex(k, true)}
                    onKeyDown={(e) => onKeyDown(e, k)}
                  >
                    {item.title}
                  </button>
                  <div className="acc-panel" id={`acc-p-${k + 1}`} role="region" aria-labelledby={`acc-btn-${k + 1}`}>
                    <div className="acc-inner">
                      <p className="acc-desc">{item.desc}</p>
                      <div className="steps">
                        {item.steps.map((s) => (
                          <div className="step" key={s}><CheckIcon />{s}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bar">
                    {isActive && (
                      <i
                        key={`${k}-${mode}-${runId}`}
                        className={mode === "play" ? "bar-play" : "bar-full"}
                        onAnimationEnd={onBarEnd}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="stage" aria-hidden="true">
            <div className={`scene sc1${active === 0 ? " is-active" : ""}`}>
              <div className="m-card">
                <div className="m-in"><SearchIcon /> product management</div>
                <div className="m-row"><div><b>Product Strategy Sprint</b><small>Saturday 10:00, 3 sessions</small></div><span className="tag">Product</span></div>
                <div className="m-row sel"><div><b>Writing Specs Engineers Read</b><small>Sunday 11:00, live with Meera Rao</small></div><span className="tag">Product</span></div>
                <div className="m-row"><div><b>Research to Prototype</b><small>Saturday 14:00, 4 sessions</small></div><span className="tag t2">Design</span></div>
                <div className="m-btn"><span>Reserve seat</span></div>
              </div>
            </div>

            <div className={`scene sc2${active === 1 ? " is-active" : ""}`}>
              <div className="m-card">
                <div className="m-grid">
                  <div className="tile big"><div className="eq"><i /><i /><i /><i /><i /></div><small>Meera, mentor</small></div>
                  <div className="tile av-b">AS</div>
                  <div className="tile av-c">RK</div>
                </div>
                <div className="m-cc">\u201CStart with the decision the reader has to make.\u201D</div>
                <div className="m-meta"><span>Live captions on</span><span className="hand">Rahul raised a hand</span></div>
              </div>
            </div>

            <div className={`scene sc3${active === 2 ? " is-active" : ""}`}>
              <div className="m-card">
                <span className="score">92 <small>out of 100</small></span>
                <div className="m-title">Assignment: write a one-page spec for a checkout fix</div>
                <div className="m-prog"><i /></div>
                <div className="m-sub"><span>Draft submitted</span><span>Reviewed</span></div>
                <div className="fb"><span className="avatar sm av-a">MR</span><span className="bubble">Clear problem statement. Add one success metric and it is ready.</span></div>
              </div>
            </div>

            <div className={`scene sc4${active === 3 ? " is-active" : ""}`}>
              <div className="m-card cert">
                <small>Certificate of completion</small>
                <h4>Product Management</h4>
                <div className="who">Ananya Sharma</div>
                <small>completed all sessions and assignments</small>
                <div className="seal">ILM ORA</div>
                <span className="verified"><CheckIcon width="16" height="16" strokeWidth="2.6" />Verified credential</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Tracks (sticky nav + scroll spy) ---------------- */

function Tracks() {
  const [activeId, setActiveId] = useState(TRACKS[0].id);
  const refs = useRef({});

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    Object.values(refs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="section tracks" id="tracks">
      <div className="wrap tracks-in">
        <div className="tracks-side">
          <div className="sticky">
            <h2>Four tracks, one way of learning</h2>
            <p>Every track follows the same rhythm: live session, assignment, feedback, repeat.</p>
            <ul className="track-nav">
              {TRACKS.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className={activeId === t.id ? "is-active" : ""}>{t.nav}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="tracks-list">
          {TRACKS.map((t) => (
            <TrackCard key={t.id} track={t} setRef={(el) => (refs.current[t.id] = el)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrackCard({ track, setRef }) {
  const [revealRef, inView] = useReveal();
  return (
    <article
      className={`track ${track.cls}${inView ? " in" : ""}`}
      id={track.id}
      ref={(el) => {
        setRef(el);
        revealRef.current = el;
      }}
    >
      <h3>{track.h}</h3>
      <p>{track.p}</p>
      <ol className="timeline">
        {track.weeks.map(([wk, label]) => (
          <li key={wk}><small>{wk}</small><b>{label}</b></li>
        ))}
      </ol>
      <div className="outputs">
        {track.outputs.map((o) => (
          <span key={o}>{o}</span>
        ))}
      </div>
    </article>
  );
}

/* ---------------- Learner stories ---------------- */

function Stories() {
  const [headRef, headIn] = useReveal();
  const [active, setActive] = useState(0);

  const open = (i) => setActive(i);

  return (
    <section className="section" id="stories">
      <div className="wrap">
        <div ref={headRef} className={`sec-head reveal${headIn ? " in" : ""}`}>
          <h2>Real learners, real next steps</h2>
          <p>Hover or tap a card to read the story.</p>
        </div>

        <div className="stories">
          {STORIES.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.cls}
                className={`story ${s.cls}${isActive ? " is-active" : ""}`}
                aria-expanded={isActive}
                onClick={() => open(i)}
                onFocus={() => open(i)}
                onMouseEnter={() => {
                  if (window.matchMedia("(hover:hover) and (min-width:821px)").matches) open(i);
                }}
              >
                <span className={`avatar ${s.av}`}>{s.avatar}</span>
                <span className="s-metric">{s.metric}</span>
                <span className="s-detail">
                  <span className="s-quote">{s.quote}</span>
                  <span className="s-who"><b>{s.who}</b> {s.role}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Marquee ---------------- */

function Marquee({ reduce }) {
  const items = [...MARQUEE, ...MARQUEE]; // duplicate for a seamless loop
  return (
    <section className="marquee-sec" aria-label="Moments from the learning journey">
      <div className="marquee">
        <div className={`m-track${reduce ? " no-anim" : ""}`}>
          {items.map((m, i) => (
            <div className="m-item" key={`${m.title}-${i}`} aria-hidden={i >= MARQUEE.length}>
              <span className={`ico ${m.ico}`}>{marqueeIcon(m.icon)}</span>
              <span><b>{m.title}</b><small>{m.sub}</small></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Integrations (replaces the old FinalCta) ---------------- */
/* Layout modeled on the Calendly "Connect Calendly with your favorite tools"
   section: eyebrow label, heading, subtext, a "view all" link, a two-row
   logo grid, then two suite cards underneath. */

function Integrations() {
  const [headRef, headIn] = useReveal();
  const [gridRef, gridIn] = useReveal(0.05);

  return (
    <section className="section integrations" id="join">
      <div className="wrap">
        <div ref={headRef} className={`int-head reveal${headIn ? " in" : ""}`}>
          <span className="int-eyebrow">15+ integrations</span>
          <h2>Connect ILM ORA with your favorite tools</h2>
          <p>Our growing list of integrations makes ILM ORA flexible.</p>
          <a className="int-viewall" href="#join">
            View all integrations <ArrowRightIcon />
          </a>
        </div>

        <div ref={gridRef} className={`int-grid reveal${gridIn ? " in" : ""}`}>
          <div className="int-row">
            {INTEGRATIONS_ROW_1.map((it) => (
              <span className="int-tile" key={it.name} title={it.name}>
                <img src={it.icon} alt={it.name} loading="lazy" />
              </span>
            ))}
          </div>
          <div className="int-row">
            {INTEGRATIONS_ROW_2.map((it) => (
              <span className="int-tile" key={it.name} title={it.name}>
                <img src={it.icon} alt={it.name} loading="lazy" />
              </span>
            ))}
          </div>
        </div>

        <div className="int-suites">
          {INTEGRATION_SUITES.map((s) => (
            <div className="int-suite" key={s.title}>
              <span className="int-suite-ico"><img src={s.icon} alt="" /></span>
              <div>
                <b>{s.title}</b>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= styles ================= */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
.ilmora-landing{
  --ink:#1a1a2e; --ink-2:#666666; --line:#e8ddd0; --bg:#f5ede0; --white:#fff;
  --surface:#fff; --ink-fixed:#1a1a2e;
  --blue:#e87722; --blue-d:#d06a1a; --sky:#FFE3C7; --mint:#FFD9B0; --peach:#FFC7A3;
  --lav:#FFDCC2; --butter:#FFE8A3;
  --ease:cubic-bezier(.22,1,.36,1); --d-fast:200ms; --d-base:600ms; --d-slow:900ms;
  --r-xl:28px; --r-lg:22px; --r-md:14px; --r-sm:10px;
  --shadow-card:0 30px 60px -24px rgba(26,26,46,.28), 0 2px 8px rgba(26,26,46,.06);
  --shadow-soft:0 12px 30px -14px rgba(26,26,46,.20);
  --font-display:"Poppins","Segoe UI",system-ui,sans-serif;
  --font-body:"Poppins","Segoe UI",system-ui,-apple-system,sans-serif;
  font-family:var(--font-body);font-size:1.0625rem;line-height:1.6;color:var(--ink);background:var(--bg);
  -webkit-font-smoothing:antialiased;overflow-x:hidden;position:relative;
  transition:background var(--d-base) var(--ease),color var(--d-base) var(--ease);
}
.ilmora-landing.dark{
  --ink:#f3ede4; --ink-2:rgba(243,237,228,.62); --line:rgba(255,255,255,.12);
  --bg:#0f0f16; --white:#1b1b24; --surface:#1b1b24;
  --shadow-card:0 30px 60px -24px rgba(0,0,0,.6), 0 2px 8px rgba(0,0,0,.4);
  --shadow-soft:0 12px 30px -14px rgba(0,0,0,.5);
}
.ilmora-landing *{box-sizing:border-box}
.ilmora-landing img,.ilmora-landing svg{display:block;max-width:100%}
.ilmora-landing a{color:inherit;text-decoration:none}
.ilmora-landing button{font:inherit;color:inherit}
.ilmora-landing h1,.ilmora-landing h2,.ilmora-landing h3,.ilmora-landing h4{font-family:var(--font-display);font-weight:700;line-height:1.08;letter-spacing:-.025em;margin:0}
.ilmora-landing p{margin:0}
.ilmora-landing :focus-visible{outline:3px solid var(--blue);outline-offset:3px;border-radius:8px}
.ilmora-landing .wrap{width:min(1180px,100% - 48px);margin-inline:auto}

/* buttons */
.ilmora-landing .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 24px;border-radius:999px;font-weight:600;font-size:1rem;border:1.5px solid transparent;cursor:pointer;transition:transform var(--d-fast) var(--ease),box-shadow var(--d-fast) var(--ease),background var(--d-fast) var(--ease),border-color var(--d-fast) var(--ease)}
.ilmora-landing .btn:hover{transform:translateY(-2px)}
.ilmora-landing .btn-primary{background:var(--blue);color:#fff;box-shadow:0 10px 24px -10px rgba(232,119,34,.6)}
.ilmora-landing .btn-primary:hover{background:var(--blue-d);box-shadow:0 14px 28px -10px rgba(232,119,34,.7)}
.ilmora-landing .btn-line{background:rgba(255,255,255,.6);border-color:rgba(14,26,58,.18);color:var(--ink);backdrop-filter:blur(6px)}
.ilmora-landing .btn-line:hover{border-color:var(--ink);background:#fff}
.ilmora-landing .btn-ghost{color:var(--ink)}
.ilmora-landing .btn-ghost:hover{background:rgba(14,26,58,.06)}
.ilmora-landing .btn-white{background:#fff;color:var(--ink)}
.ilmora-landing .btn-white:hover{box-shadow:0 14px 28px -12px rgba(0,0,0,.5)}
.ilmora-landing .btn-outline-w{border-color:rgba(255,255,255,.4);color:#fff}
.ilmora-landing .btn-outline-w:hover{border-color:#fff;background:rgba(255,255,255,.08)}

/* nav */
.ilmora-landing .nav{position:sticky;top:0;z-index:50;transition:background var(--d-base) var(--ease),box-shadow var(--d-base) var(--ease),backdrop-filter var(--d-base) var(--ease)}
.ilmora-landing .nav.scrolled{background:rgba(245,248,254,.78);backdrop-filter:saturate(1.4) blur(14px);-webkit-backdrop-filter:saturate(1.4) blur(14px);box-shadow:0 1px 0 var(--line)}
.ilmora-landing .nav-in{display:flex;align-items:center;justify-content:space-between;height:72px}
.ilmora-landing .logo{display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-weight:800;font-size:1.3rem;letter-spacing:-.02em}
.ilmora-landing .logo-mark{width:30px;height:30px;border-radius:9px;background:conic-gradient(from 210deg,var(--blue),var(--lav),var(--mint),var(--blue));position:relative}
.ilmora-landing .logo-mark::after{content:"";position:absolute;inset:8px;border-radius:50%;background:var(--bg)}
.ilmora-landing .nav-links{display:flex;gap:6px}
.ilmora-landing .nav-links a{padding:8px 16px;border-radius:999px;font-weight:500;color:var(--ink-2);transition:color var(--d-fast),background var(--d-fast)}
.ilmora-landing .nav-links a:hover{color:var(--ink);background:rgba(14,26,58,.06)}
.ilmora-landing .nav-cta{display:flex;gap:8px;align-items:center}

/* hero — flat, no blur/grain */
.ilmora-landing .hero{background:var(--bg);padding:80px 0 90px}
.ilmora-landing .hero-in{display:grid;grid-template-columns:1.02fr 1fr;gap:56px;align-items:center}
.ilmora-landing .hero h1{font-size:clamp(2.3rem,5.3vw,4.1rem);margin-bottom:22px;opacity:0;transform:translateY(22px);animation:im-rise var(--d-slow) var(--ease) .1s forwards}
.ilmora-landing .lead{font-size:clamp(1.02rem,1.5vw,1.2rem);color:var(--ink-2);max-width:34em;opacity:0;transform:translateY(22px);animation:im-rise var(--d-slow) var(--ease) .22s forwards}
.ilmora-landing .hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px;opacity:0;transform:translateY(22px);animation:im-rise var(--d-slow) var(--ease) .34s forwards}
.ilmora-landing .fine{margin-top:18px;font-size:.95rem;color:var(--ink-2);opacity:0;transform:translateY(22px);animation:im-rise var(--d-slow) var(--ease) .46s forwards}
@keyframes im-rise{to{opacity:1;transform:none}}
.ilmora-landing .hero-stage{opacity:0;transform:translateY(30px) scale(.985);animation:im-rise var(--d-slow) var(--ease) .35s forwards;position:relative;padding:18px 0 34px 18px}

.ilmora-landing .live{background:var(--surface);border-radius:var(--r-xl);box-shadow:var(--shadow-card);padding:14px;max-width:560px;margin-left:auto}
.ilmora-landing .live-bar{display:flex;align-items:center;gap:10px;padding:4px 6px 12px}
.ilmora-landing .live-tag{display:inline-flex;align-items:center;gap:6px;background:#FFE7E4;color:#C22B1D;font-weight:600;font-size:.8rem;padding:3px 10px;border-radius:999px}
.ilmora-landing .live-tag i{width:7px;height:7px;border-radius:50%;background:#E5402F;animation:im-pulse 1.6s ease-in-out infinite}
@keyframes im-pulse{50%{transform:scale(1.7);opacity:.4}}
.ilmora-landing .live-title{font-weight:600;font-size:.95rem;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ilmora-landing .live-time{font-variant-numeric:tabular-nums;font-size:.85rem;color:var(--ink-2)}
.ilmora-landing .live-video{position:relative;height:230px;border-radius:var(--r-lg);background:linear-gradient(135deg,#1A2A5E,#3653C7 70%,#5C7BFF);display:grid;place-items:center;overflow:hidden}
.ilmora-landing .live-video::before{content:"";position:absolute;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.22),transparent 65%);top:-80px;right:-60px}
.ilmora-landing .mentor{display:flex;align-items:center;gap:18px}
.ilmora-landing .avatar{display:inline-grid;place-items:center;flex:none;width:64px;height:64px;border-radius:50%;font-weight:600;font-size:1.1rem;color:var(--ink);letter-spacing:.01em}
.ilmora-landing .avatar.sm{width:38px;height:38px;font-size:.8rem}
.ilmora-landing .avatar.xs{width:28px;height:28px;font-size:.68rem}
.ilmora-landing .avatar.lg{width:88px;height:88px;font-size:1.5rem}
.ilmora-landing .av-a{background:linear-gradient(135deg,#FFE8A3,#FFC7B8)}
.ilmora-landing .av-b{background:linear-gradient(135deg,#9BE7D6,#CFE0FF)}
.ilmora-landing .av-c{background:linear-gradient(135deg,#C3B3FF,#CFE0FF)}
.ilmora-landing .av-d{background:linear-gradient(135deg,#FFC7B8,#C3B3FF)}
.ilmora-landing .eq{display:flex;align-items:center;gap:4px;height:34px}
.ilmora-landing .eq i{width:5px;height:100%;background:#fff;border-radius:3px;transform-origin:center;animation:im-eq 1s ease-in-out infinite}
.ilmora-landing .eq i:nth-child(1){animation-duration:.9s}
.ilmora-landing .eq i:nth-child(2){animation-duration:.7s;animation-delay:.1s}
.ilmora-landing .eq i:nth-child(3){animation-duration:1.1s;animation-delay:.2s}
.ilmora-landing .eq i:nth-child(4){animation-duration:.8s;animation-delay:.05s}
.ilmora-landing .eq i:nth-child(5){animation-duration:1s;animation-delay:.3s}
@keyframes im-eq{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
.ilmora-landing .thumbs{position:absolute;right:12px;bottom:12px;display:flex;gap:6px}
.ilmora-landing .thumbs .avatar{border:2px solid rgba(255,255,255,.9)}
.ilmora-landing .caption{position:absolute;left:12px;bottom:12px;max-width:62%;background:rgba(9,18,45,.62);backdrop-filter:blur(6px);color:#fff;font-size:.82rem;line-height:1.35;padding:7px 11px;border-radius:10px}
.ilmora-landing .chat{display:flex;flex-direction:column;justify-content:flex-end;gap:8px;height:138px;overflow:hidden;padding:12px 6px 4px}
.ilmora-landing .msg{display:flex;align-items:flex-end;gap:8px;animation:im-msgin .5s var(--ease) both}
@keyframes im-msgin{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.ilmora-landing .bubble{background:#EEF3FF;border-radius:14px 14px 14px 4px;padding:7px 12px;font-size:.88rem;line-height:1.35;max-width:82%}
.ilmora-landing .msg:nth-child(even) .bubble{background:#E6F8F3}
.ilmora-landing .live-foot{display:flex;justify-content:space-between;align-items:center;padding:10px 6px 2px;border-top:1px solid var(--line);font-size:.85rem;color:var(--ink-2)}
.ilmora-landing .hand{background:var(--butter);color:#6B4E00;font-weight:600;padding:3px 10px;border-radius:999px;font-size:.78rem}
.ilmora-landing .chip{position:absolute;display:flex;align-items:center;gap:10px;background:var(--surface);border-radius:16px;padding:10px 14px 10px 10px;box-shadow:var(--shadow-soft);font-size:.86rem;line-height:1.3;opacity:0;animation:im-chipin .8s var(--ease) forwards}
.ilmora-landing .chip b{display:block;font-weight:600}
.ilmora-landing .chip small{color:var(--ink-2);font-size:.78rem}
.ilmora-landing .chip .ico{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;flex:none}
.ilmora-landing .chip-a{left:-6px;top:170px;animation-delay:1.2s}
.ilmora-landing .chip-b{right:-10px;bottom:0;animation-delay:1.8s}
.ilmora-landing .chip-a .ico{background:#DDF7EF;color:#0E7A5F}
.ilmora-landing .chip-b .ico{background:#E6DEFF;color:#5A3FD1}
@keyframes im-chipin{from{opacity:0;transform:translateY(16px) scale(.94)}to{opacity:1;transform:none}}

/* booking showcase — Calendly-style gradient card with floating icons */
.ilmora-landing .booking{padding:20px 0 100px}
.ilmora-landing .sec-head.center{text-align:center;margin-inline:auto}
.ilmora-landing .booking-card{position:relative;border-radius:36px;padding:56px 40px 40px;background:linear-gradient(150deg,#FFD9B0 0%,var(--blue) 55%,#C9531B 100%);box-shadow:0 40px 80px -30px rgba(208,106,26,.45);overflow:visible}
.ilmora-landing .booking-floaters{position:absolute;left:50%;top:0;transform:translate(-50%,-50%);display:flex;gap:14px;z-index:2}
.ilmora-landing .float-ico{position:relative;width:56px;height:56px;border-radius:50%;background:var(--surface);border:0;display:grid;place-items:center;color:var(--ink-2);box-shadow:var(--shadow-soft);animation:im-float 3.2s ease-in-out infinite;cursor:pointer;transition:background var(--d-fast) var(--ease),color var(--d-fast) var(--ease),width var(--d-fast) var(--ease),height var(--d-fast) var(--ease)}
.ilmora-landing .float-ico:hover{color:var(--ink)}
.ilmora-landing .float-ico.no-float{animation:none}
.ilmora-landing .float-ico.is-active{width:64px;height:64px;background:var(--ink-fixed);color:#fff;box-shadow:0 0 0 5px rgba(255,255,255,.55),var(--shadow-soft)}
.ilmora-landing .float-label{position:absolute;left:50%;top:calc(100% + 10px);transform:translateX(-50%) translateY(4px);white-space:nowrap;background:var(--ink);color:#fff;font-size:.76rem;font-weight:600;padding:5px 10px;border-radius:8px;opacity:0;pointer-events:none;transition:opacity var(--d-fast) var(--ease),transform var(--d-fast) var(--ease)}
.ilmora-landing .float-ico:hover .float-label,.ilmora-landing .float-ico.is-active .float-label{opacity:1;transform:translateX(-50%) translateY(0)}
@keyframes im-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.ilmora-landing .booking-panels{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:28px}
.ilmora-landing .booking-info{background:rgba(255,255,255,.14);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.35);border-radius:var(--r-lg);padding:32px;color:#fff;display:flex;flex-direction:column;justify-content:center}
.ilmora-landing .booking-info .badge{display:inline-flex;align-self:flex-start;background:rgba(255,255,255,.22);font-size:.78rem;font-weight:600;padding:5px 12px;border-radius:999px;margin-bottom:16px}
.ilmora-landing .booking-info h3{font-size:1.6rem;margin-bottom:12px;color:#fff}
.ilmora-landing .booking-info p{color:rgba(255,255,255,.85);margin-bottom:18px;max-width:28em}
.ilmora-landing .link-underline{display:inline-flex;align-items:center;gap:6px;font-weight:600;color:#fff;border-bottom:2px solid rgba(255,255,255,.6);width:fit-content;padding-bottom:2px;transition:border-color var(--d-fast)}
.ilmora-landing .link-underline:hover{border-color:#fff}
.ilmora-landing .booking-calendar{background:var(--surface);border-radius:var(--r-lg);padding:22px;box-shadow:var(--shadow-card)}
.ilmora-landing .bc-head{display:flex;justify-content:space-between;align-items:center;font-weight:600;margin-bottom:14px}
.ilmora-landing .bc-nav{display:flex;gap:6px}
.ilmora-landing .bc-nav i{width:26px;height:26px;border-radius:50%;background:var(--bg);display:grid;place-items:center;color:var(--ink-2)}
.ilmora-landing .bc-week{display:grid;grid-template-columns:repeat(7,1fr);text-align:center;font-size:.72rem;color:var(--ink-2);margin-bottom:6px}
.ilmora-landing .bc-days{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:16px}
.ilmora-landing .bc-days span{aspect-ratio:1;display:grid;place-items:center;border-radius:8px;font-size:.82rem;color:var(--ink);transition:background var(--d-fast) var(--ease),color var(--d-fast) var(--ease)}
.ilmora-landing .bc-days span.is-today{border:1.5px solid var(--blue);font-weight:600}
.ilmora-landing .bc-days span.is-picked{background:var(--blue);color:#fff;font-weight:600}
.ilmora-landing .bc-slots{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
.ilmora-landing .bc-slot{border:1.5px solid var(--line);border-radius:10px;padding:9px 12px;font-size:.86rem;font-weight:500;transition:border-color var(--d-fast) var(--ease),background var(--d-fast) var(--ease),color var(--d-fast) var(--ease)}
.ilmora-landing .bc-slot.is-picked{border-color:var(--blue);background:#FFF1E6;color:var(--blue-d)}
.ilmora-landing .bc-confirm{background:var(--ink-fixed);color:#fff;text-align:center;font-weight:600;padding:12px;border-radius:12px;transition:transform var(--d-fast) var(--ease),background var(--d-fast) var(--ease)}
.ilmora-landing .bc-confirm.is-confirming{background:#0E7A5F;transform:scale(.97)}
.ilmora-landing .booking-info{animation:im-chipin .5s var(--ease) both}
.ilmora-landing .booking-visual{position:relative;animation:im-chipin .5s var(--ease) both}
.ilmora-landing .feature-card{background:var(--surface);border-radius:var(--r-lg);padding:26px;box-shadow:var(--shadow-card);height:100%;display:flex;flex-direction:column;justify-content:center;gap:12px}
.ilmora-landing .mini-badge{display:inline-flex;align-self:flex-start;background:#EEF3FF;color:var(--blue-d);font-size:.76rem;font-weight:600;padding:4px 10px;border-radius:999px;margin-bottom:4px}
.ilmora-landing .match-row{display:flex;align-items:center;gap:12px;border:1.5px solid var(--line);border-radius:12px;padding:12px 14px}
.ilmora-landing .match-row b{display:block;font-weight:600;font-size:.95rem;line-height:1.3}
.ilmora-landing .match-row small{color:var(--ink-2);font-size:.8rem}
.ilmora-landing .cert-mini{text-align:center;align-items:center}
.ilmora-landing .cert-mini small{color:var(--ink-2)}
.ilmora-landing .cert-mini h4{font-family:var(--font-display);font-size:1.3rem;letter-spacing:-.02em;margin:2px 0}
.ilmora-landing .cert-mini .who{font-weight:600;font-size:1.05rem}
.ilmora-landing .chat-mini .msg{align-items:flex-end}
.ilmora-landing .fake-cursor{position:absolute;left:0;top:0;pointer-events:none;opacity:0;transition:transform .65s cubic-bezier(.22,1,.36,1),opacity .3s ease;z-index:5;filter:drop-shadow(0 3px 6px rgba(0,0,0,.35))}
.ilmora-landing .fake-cursor.is-visible{opacity:1}
.ilmora-landing .fake-cursor.is-clicking svg{animation:im-click .5s ease}
@keyframes im-click{0%{transform:scale(1)}35%{transform:scale(.72)}100%{transform:scale(1)}}

/* sections */
.ilmora-landing .section{padding:100px 0}
.ilmora-landing .sec-head{max-width:760px;margin-bottom:56px}
.ilmora-landing .sec-head h2{font-size:clamp(1.9rem,3.9vw,2.9rem);margin-bottom:16px}
.ilmora-landing .sec-head p{color:var(--ink-2);font-size:1.1rem;max-width:36em}
.ilmora-landing .reveal{opacity:0;transform:translateY(24px);transition:opacity var(--d-base) var(--ease),transform var(--d-base) var(--ease)}
.ilmora-landing .reveal.in{opacity:1;transform:none}

/* journey tabs */
.ilmora-landing .tabs{display:grid;grid-template-columns:.9fr 1.1fr;gap:48px;align-items:start}
.ilmora-landing .acc-list{display:flex;flex-direction:column;gap:6px}
.ilmora-landing .acc{position:relative;border-radius:var(--r-lg);padding:0 24px;transition:background var(--d-base) var(--ease),box-shadow var(--d-base) var(--ease)}
.ilmora-landing .acc.is-active{background:var(--surface);box-shadow:var(--shadow-soft)}
.ilmora-landing .acc-btn{display:block;width:100%;text-align:left;background:none;border:0;padding:22px 0;cursor:pointer;font-family:var(--font-display);font-weight:700;font-size:1.35rem;letter-spacing:-.02em;color:var(--ink-2);transition:color var(--d-fast)}
.ilmora-landing .acc:hover .acc-btn,.ilmora-landing .acc.is-active .acc-btn{color:var(--ink)}
.ilmora-landing .acc-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows var(--d-base) var(--ease)}
.ilmora-landing .acc.is-active .acc-panel{grid-template-rows:1fr}
.ilmora-landing .acc-inner{overflow:hidden}
.ilmora-landing .acc-desc{color:var(--ink-2);margin-bottom:14px;max-width:30em}
.ilmora-landing .steps{display:flex;flex-direction:column;gap:10px;padding-bottom:26px}
.ilmora-landing .step{display:flex;gap:12px;align-items:flex-start;font-weight:500}
.ilmora-landing .step svg{flex:none;margin-top:3px;color:var(--blue)}
.ilmora-landing .bar{position:absolute;left:24px;right:24px;bottom:0;height:3px;border-radius:3px;background:var(--line);overflow:hidden;opacity:0;transition:opacity var(--d-base)}
.ilmora-landing .acc.is-active .bar{opacity:1}
.ilmora-landing .bar i{display:block;height:100%;background:var(--blue);transform-origin:left}
.ilmora-landing .bar i.bar-play{animation:im-fill 6.5s linear forwards}
.ilmora-landing .bar i.bar-full{transform:scaleX(1)}
@keyframes im-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}

.ilmora-landing .stage{position:relative;aspect-ratio:1/1.02;border-radius:var(--r-xl);overflow:hidden;background:var(--sky);box-shadow:var(--shadow-soft)}
.ilmora-landing .scene{position:absolute;inset:0;display:grid;place-items:center;padding:8%;opacity:0;transform:scale(.97);transition:opacity var(--d-base) var(--ease),transform var(--d-slow) var(--ease);pointer-events:none}
.ilmora-landing .scene.is-active{opacity:1;transform:none}
.ilmora-landing .sc1{background:radial-gradient(80% 70% at 15% 10%,#9EC5FF,transparent 60%),radial-gradient(70% 60% at 95% 90%,#C3B3FF,transparent 60%),#DCEAFF}
.ilmora-landing .sc2{background:radial-gradient(80% 70% at 90% 10%,#9BE7D6,transparent 60%),radial-gradient(70% 60% at 5% 95%,#9EC5FF,transparent 60%),#DDF6F2}
.ilmora-landing .sc3{background:radial-gradient(80% 70% at 10% 90%,#FFC7B8,transparent 60%),radial-gradient(70% 60% at 95% 5%,#FFE8A3,transparent 60%),#FFF0E6}
.ilmora-landing .sc4{background:radial-gradient(80% 70% at 85% 90%,#C3B3FF,transparent 60%),radial-gradient(70% 60% at 5% 10%,#9BE7D6,transparent 60%),#EDE9FF}
.ilmora-landing .m-card{width:100%;max-width:400px;background:var(--surface);border-radius:20px;padding:18px;box-shadow:var(--shadow-card);position:relative}
.ilmora-landing .m-in{display:flex;align-items:center;gap:10px;background:#F1F5FD;border-radius:12px;padding:10px 14px;color:var(--ink-2);font-size:.92rem;margin-bottom:12px}
.ilmora-landing .m-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;border:1.5px solid var(--line);margin-bottom:8px;font-size:.92rem}
.ilmora-landing .m-row.sel{border-color:var(--blue);background:#EEF3FF}
.ilmora-landing .m-row b{display:block;font-weight:600;line-height:1.25}
.ilmora-landing .m-row small{color:var(--ink-2);font-size:.8rem}
.ilmora-landing .tag{font-size:.74rem;font-weight:600;padding:3px 10px;border-radius:999px;background:#E3ECFF;color:var(--blue-d);flex:none}
.ilmora-landing .tag.t2{background:#EADFFF;color:#5A3FD1}
.ilmora-landing .m-btn{position:relative;display:block;width:100%;margin-top:6px;padding:12px;border-radius:12px;background:var(--blue);color:#fff;text-align:center;font-weight:600}
.ilmora-landing .m-grid{display:grid;grid-template-columns:1.5fr 1fr;grid-template-rows:1fr 1fr;gap:8px;height:190px}
.ilmora-landing .tile{border-radius:12px;display:grid;place-items:center;font-weight:600;position:relative;overflow:hidden}
.ilmora-landing .tile.big{grid-row:span 2;background:linear-gradient(135deg,#1A2A5E,#3653C7)}
.ilmora-landing .tile.big .eq i{background:#fff}
.ilmora-landing .tile small{position:absolute;left:8px;bottom:6px;color:#fff;font-size:.72rem;font-weight:500}
.ilmora-landing .m-meta{display:flex;justify-content:space-between;align-items:center;margin-top:12px;font-size:.85rem;color:var(--ink-2)}
.ilmora-landing .m-cc{margin-top:10px;background:#F1F5FD;border-radius:10px;padding:8px 12px;font-size:.85rem}
.ilmora-landing .m-title{font-weight:600;margin-bottom:12px;line-height:1.3}
.ilmora-landing .m-prog{height:8px;border-radius:8px;background:#EEF1F8;overflow:hidden;margin-bottom:6px}
.ilmora-landing .m-prog i{display:block;height:100%;width:78%;background:linear-gradient(90deg,var(--blue),#FFB37A);border-radius:8px}
.ilmora-landing .m-sub{display:flex;justify-content:space-between;font-size:.8rem;color:var(--ink-2)}
.ilmora-landing .fb{margin-top:16px;display:flex;gap:10px}
.ilmora-landing .fb .bubble{background:#FFF3E9;max-width:none;font-size:.88rem}
.ilmora-landing .score{position:absolute;right:16px;top:-16px;background:var(--ink-fixed);color:#fff;border-radius:14px;padding:8px 14px;font-weight:600}
.ilmora-landing .score small{font-weight:400;opacity:.75}
.ilmora-landing .cert{text-align:center;padding:26px 20px 22px}
.ilmora-landing .cert small{color:var(--ink-2)}
.ilmora-landing .cert h4{font-family:var(--font-display);font-size:1.35rem;letter-spacing:-.02em;margin:6px 0 2px}
.ilmora-landing .cert .who{font-weight:600;margin:10px 0 2px;font-size:1.05rem}
.ilmora-landing .seal{width:64px;height:64px;margin:16px auto 6px;border-radius:50%;background:conic-gradient(from 20deg,var(--blue),var(--lav),var(--mint),var(--blue));display:grid;place-items:center;color:#fff;font-size:.62rem;font-weight:700;letter-spacing:.04em}
.ilmora-landing .verified{position:relative;display:inline-flex;gap:8px;align-items:center;background:var(--surface);border-radius:14px;padding:9px 14px;box-shadow:var(--shadow-soft);font-size:.84rem;font-weight:600;color:#0E7A5F;margin-top:14px}

/* tracks */
.ilmora-landing .tracks{background:var(--surface);border-block:1px solid var(--line)}
.ilmora-landing .tracks-in{display:grid;grid-template-columns:.8fr 1.2fr;gap:64px;align-items:start}
.ilmora-landing .tracks-side .sticky{position:sticky;top:90px}
.ilmora-landing .tracks-side h2{font-size:clamp(1.9rem,3.6vw,2.7rem);margin-bottom:16px}
.ilmora-landing .tracks-side p{color:var(--ink-2);margin-bottom:28px;max-width:26em}
.ilmora-landing .track-nav{list-style:none;display:flex;flex-direction:column;gap:2px;margin:0;padding:0}
.ilmora-landing .track-nav a{display:flex;align-items:center;gap:14px;padding:10px 0;font-family:var(--font-display);font-weight:600;font-size:1.2rem;color:#8A94AD;transition:color var(--d-fast),transform var(--d-base) var(--ease)}
.ilmora-landing .track-nav a::before{content:"";width:0;height:3px;border-radius:3px;background:var(--blue);transition:width var(--d-base) var(--ease)}
.ilmora-landing .track-nav a.is-active{color:var(--ink);transform:translateX(4px)}
.ilmora-landing .track-nav a.is-active::before{width:28px}
.ilmora-landing .tracks-list{display:flex;flex-direction:column;gap:28px}
.ilmora-landing .track{scroll-margin-top:100px;border-radius:var(--r-xl);padding:36px;position:relative;overflow:hidden}
.ilmora-landing .tr-product{background:linear-gradient(140deg,#E3EDFF,#EEE8FF)}
.ilmora-landing .tr-design{background:linear-gradient(140deg,#E8E2FF,#FFE9E3)}
.ilmora-landing .tr-growth{background:linear-gradient(140deg,#DDF6F0,#E3EDFF)}
.ilmora-landing .tr-marketing{background:linear-gradient(140deg,#FFF1D6,#FFE1D8)}
.ilmora-landing .track h3{font-size:1.8rem;margin-bottom:8px}
.ilmora-landing .track>p{color:var(--ink-2);max-width:32em;margin-bottom:26px}
.ilmora-landing .timeline{position:relative;list-style:none;padding-left:34px;margin:0;display:flex;flex-direction:column;gap:18px}
.ilmora-landing .timeline::before{content:"";position:absolute;left:8px;top:8px;bottom:8px;width:2px;background:rgba(14,26,58,.16);transform:scaleY(0);transform-origin:top;transition:transform 1.2s var(--ease) .2s}
.ilmora-landing .track.in .timeline::before{transform:scaleY(1)}
.ilmora-landing .timeline li{position:relative;opacity:0;transform:translateX(-10px);transition:opacity var(--d-base) var(--ease),transform var(--d-base) var(--ease)}
.ilmora-landing .timeline li::before{content:"";position:absolute;left:-34px;top:6px;width:18px;height:18px;border-radius:50%;background:#fff;border:2px solid var(--blue)}
.ilmora-landing .timeline small{display:block;color:var(--ink-2);font-size:.82rem}
.ilmora-landing .timeline b{font-weight:600}
.ilmora-landing .track.in .timeline li{opacity:1;transform:none}
.ilmora-landing .track.in .timeline li:nth-child(1){transition-delay:.25s}
.ilmora-landing .track.in .timeline li:nth-child(2){transition-delay:.45s}
.ilmora-landing .track.in .timeline li:nth-child(3){transition-delay:.65s}
.ilmora-landing .track.in .timeline li:nth-child(4){transition-delay:.85s}
.ilmora-landing .outputs{display:flex;flex-wrap:wrap;gap:8px;margin-top:26px}
.ilmora-landing .outputs span{background:rgba(255,255,255,.75);border-radius:999px;padding:5px 14px;font-size:.88rem;font-weight:500}

/* learner stories */
.ilmora-landing .stories{display:flex;gap:14px;height:470px}
.ilmora-landing .story{position:relative;flex:1;min-width:0;border:0;border-radius:var(--r-xl);overflow:hidden;cursor:pointer;text-align:left;padding:28px;display:block;transition:flex var(--d-slow) var(--ease),transform var(--d-base) var(--ease);color:var(--ink)}
.ilmora-landing .story.is-active{flex:3.3;cursor:default}
.ilmora-landing .s1{background:radial-gradient(90% 70% at 100% 0%,#C3B3FF,transparent 60%),#DCE7FF}
.ilmora-landing .s2{background:radial-gradient(90% 70% at 100% 0%,#9BE7D6,transparent 60%),#DFF3FF}
.ilmora-landing .s3{background:radial-gradient(90% 70% at 100% 0%,#FFE8A3,transparent 60%),#FFE4DA}
.ilmora-landing .s4{background:radial-gradient(90% 70% at 100% 0%,#FFC7B8,transparent 60%),#EDE6FF}
.ilmora-landing .story .avatar{position:absolute;right:24px;top:24px}
.ilmora-landing .s-metric{display:block;font-family:var(--font-display);font-weight:700;font-size:1.5rem;line-height:1.12;letter-spacing:-.02em;max-width:8.5em;transition:font-size var(--d-slow) var(--ease)}
.ilmora-landing .story.is-active .s-metric{font-size:2.4rem}
.ilmora-landing .s-detail{position:absolute;left:28px;bottom:28px;width:min(430px,calc(100% - 56px));opacity:0;transform:translateY(14px);visibility:hidden;transition:opacity var(--d-base) var(--ease),transform var(--d-base) var(--ease),visibility 0s var(--d-base)}
.ilmora-landing .story.is-active .s-detail{opacity:1;transform:none;visibility:visible;transition-delay:.25s,.25s,0s}
.ilmora-landing .s-quote{display:block;font-size:1.1rem;line-height:1.45;margin-bottom:14px}
.ilmora-landing .s-who{display:block;font-size:.92rem;color:var(--ink-2)}
.ilmora-landing .s-who b{color:var(--ink);font-weight:600}

/* marquee */
.ilmora-landing .marquee-sec{padding:20px 0 100px;overflow:hidden}
.ilmora-landing .marquee{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.ilmora-landing .m-track{display:flex;width:max-content;animation:im-marq 42s linear infinite}
.ilmora-landing .m-track.no-anim{animation:none;overflow-x:auto}
.ilmora-landing .marquee:hover .m-track{animation-play-state:paused}
@keyframes im-marq{to{transform:translateX(-50%)}}
.ilmora-landing .m-item{display:flex;align-items:center;gap:14px;margin-right:16px;padding:14px 22px 14px 14px;border-radius:18px;background:#fff;box-shadow:var(--shadow-soft);white-space:nowrap}
.ilmora-landing .m-item .ico{width:42px;height:42px;border-radius:12px;display:grid;place-items:center}
.ilmora-landing .m-item b{display:block;font-weight:600;line-height:1.25}
.ilmora-landing .m-item small{color:var(--ink-2);font-size:.84rem}
.ilmora-landing .i-blue{background:#E3ECFF;color:var(--blue-d)}
.ilmora-landing .i-mint{background:#DDF7EF;color:#0E7A5F}
.ilmora-landing .i-lav{background:#E6DEFF;color:#5A3FD1}
.ilmora-landing .i-peach{background:#FFE6DC;color:#B4471F}
.ilmora-landing .i-butter{background:#FFF1C7;color:#7A5A00}

/* integrations (replaces the old dark final-cta block) */
.ilmora-landing .integrations{background:var(--surface);border-top:1px solid var(--line)}
.ilmora-landing .int-head{text-align:center;max-width:640px;margin:0 auto 48px}
.ilmora-landing .int-eyebrow{display:inline-block;font-size:.8rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--blue-d);margin-bottom:14px}
.ilmora-landing .int-head h2{font-size:clamp(1.8rem,3.6vw,2.5rem);margin-bottom:14px}
.ilmora-landing .int-head p{color:var(--ink-2);font-size:1.05rem}
.ilmora-landing .int-viewall{display:inline-flex;align-items:center;gap:6px;margin-top:20px;font-weight:600;color:var(--ink);border-bottom:2px solid transparent;transition:border-color var(--d-fast)}
.ilmora-landing .int-viewall:hover{border-color:var(--ink)}
.ilmora-landing .int-viewall svg{transition:transform var(--d-fast) var(--ease)}
.ilmora-landing .int-viewall:hover svg{transform:translateX(3px)}
.ilmora-landing .int-grid{display:flex;flex-direction:column;gap:16px;max-width:920px;margin:0 auto 56px}
.ilmora-landing .int-row{display:flex;justify-content:center;flex-wrap:wrap;gap:16px}
.ilmora-landing .int-tile{width:72px;height:72px;border-radius:18px;background:var(--bg);border:1px solid var(--line);display:grid;place-items:center;transition:transform var(--d-fast) var(--ease),box-shadow var(--d-fast) var(--ease),border-color var(--d-fast)}
.ilmora-landing .int-tile:hover{transform:translateY(-4px);box-shadow:var(--shadow-soft);border-color:transparent}
.ilmora-landing .int-tile img{width:34px;height:34px;object-fit:contain}
.ilmora-landing .int-suites{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:920px;margin:0 auto}
.ilmora-landing .int-suite{display:flex;gap:16px;align-items:flex-start;background:var(--bg);border-radius:var(--r-lg);padding:22px;border:1px solid var(--line)}
.ilmora-landing .int-suite-ico{flex:none;width:36px;height:36px;border-radius:10px;background:#fff;display:grid;place-items:center;box-shadow:var(--shadow-soft)}
.ilmora-landing .int-suite-ico img{width:22px;height:22px;object-fit:contain}
.ilmora-landing .int-suite b{display:block;font-family:var(--font-display);font-weight:700;margin-bottom:6px}
.ilmora-landing .int-suite p{color:var(--ink-2);font-size:.92rem;line-height:1.5}

/* footer */
.ilmora-landing .foot{border-top:1px solid var(--line);padding:56px 0 40px;font-size:.95rem;color:var(--ink-2)}
.ilmora-landing .foot-in{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:32px}
.ilmora-landing .foot h4{font-family:var(--font-display);color:var(--ink);font-size:1rem;margin-bottom:12px}
.ilmora-landing .foot ul{list-style:none;display:flex;flex-direction:column;gap:8px;margin:0;padding:0}
.ilmora-landing .foot a:hover{color:var(--blue)}
.ilmora-landing .foot-base{margin-top:40px;padding-top:24px;border-top:1px solid var(--line);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:.88rem}

/* ===================== RESPONSIVE ===================== */
/* Laptops */
@media (max-width:1200px){
  .ilmora-landing .wrap{width:min(1040px,100% - 36px)}
}
/* iPad Pro / small laptops */
@media (max-width:1024px){
  .ilmora-landing .tracks-in{grid-template-columns:1fr;gap:40px}
  .ilmora-landing .tracks-side .sticky{position:static}
}
/* Tablets (iPad / iPad mini) */
@media (max-width:960px){
  .ilmora-landing .hero{padding:64px 0 70px;min-height:0}
  .ilmora-landing .hero-in,.ilmora-landing .tabs{grid-template-columns:1fr;gap:40px}
  .ilmora-landing .hero-stage{padding:0 0 30px}
  .ilmora-landing .live{margin:0 auto}
  .ilmora-landing .chip-a{left:0}
  .ilmora-landing .chip-b{right:0}
  .ilmora-landing .nav-links{display:none}
  .ilmora-landing .section{padding:64px 0}
  .ilmora-landing .stage{aspect-ratio:1/.95}
  .ilmora-landing .foot-in{grid-template-columns:1fr 1fr}
  .ilmora-landing .blob{filter:blur(50px)}
  .ilmora-landing .int-suites{grid-template-columns:1fr}
  .ilmora-landing .booking-panels{grid-template-columns:1fr}
}
/* Large phones / small tablets */
@media (max-width:820px){
  .ilmora-landing .stories{flex-direction:column;height:auto}
  .ilmora-landing .story{flex:none;min-height:130px;padding:22px}
  .ilmora-landing .story.is-active{flex:none}
  .ilmora-landing .s-detail{position:static;width:auto;max-height:0;overflow:hidden;transform:none;margin-top:0}
  .ilmora-landing .story.is-active .s-detail{max-height:280px;margin-top:18px}
  .ilmora-landing .story.is-active .s-metric{font-size:1.85rem}
  .ilmora-landing .story .avatar{width:52px;height:52px;font-size:1rem}
}
/* Phones */
@media (max-width:560px){
  .ilmora-landing .wrap{width:calc(100% - 28px)}
  .ilmora-landing .btn-ghost{display:none}
  .ilmora-landing .track{padding:26px 22px}
  .ilmora-landing .foot-in{grid-template-columns:1fr}
  .ilmora-landing .chip-a{top:150px}
  .ilmora-landing .live-video{height:190px}
  .ilmora-landing .nav-cta .btn{padding:10px 16px;font-size:.9rem}
  .ilmora-landing .int-tile{width:60px;height:60px;border-radius:14px}
  .ilmora-landing .int-tile img{width:28px;height:28px}
  .ilmora-landing .booking-card{padding:44px 20px 28px;border-radius:26px}
  .ilmora-landing .float-ico{width:44px;height:44px}
  .ilmora-landing .float-ico.is-active{width:50px;height:50px}
  .ilmora-landing .booking-floaters{gap:8px}
}
/* Small phones (iPhone SE, older Android) */
@media (max-width:380px){
  .ilmora-landing .hero h1{font-size:1.9rem}
  .ilmora-landing .live{padding:10px}
  .ilmora-landing .chip{font-size:.78rem;padding:8px 10px 8px 8px}
}

@media (prefers-reduced-motion:reduce){
  .ilmora-landing *,.ilmora-landing *::before,.ilmora-landing *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;animation-delay:0s!important;transition-duration:.001ms!important;transition-delay:0s!important}
  .ilmora-landing .hero h1,.ilmora-landing .lead,.ilmora-landing .hero-actions,.ilmora-landing .fine,.ilmora-landing .hero-stage,.ilmora-landing .chip{opacity:1;transform:none}
  .ilmora-landing .m-track{overflow-x:auto}
  .ilmora-landing .float-ico{animation:none!important}
}

/* =====================================================================
   DARK MODE CONTRAST FIX
   A bunch of cards below (chat bubbles, avatars, marquee items, the
   "sel" list row, journey mini tiles, learner-story panels, track
   panels) keep a fixed light background on purpose — it never switches
   with the theme. Their text, though, was inheriting var(--ink)/
   var(--ink-2), which flips to a near-white color in dark mode. Light
   text on a light card = invisible, which is exactly what was showing
   up as "missing" sections. Fix: pin these cards' text to a fixed dark
   ink color whenever .dark is active, so they stay readable regardless
   of the page theme (same idea as .tag / .verified / .mini-badge,
   which already used a fixed color and never had this bug).
   ===================================================================== */
.ilmora-landing.dark .bubble,
.ilmora-landing.dark .avatar,
.ilmora-landing.dark .m-item,
.ilmora-landing.dark .m-row.sel,
.ilmora-landing.dark .m-cc,
.ilmora-landing.dark .tile,
.ilmora-landing.dark .story,
.ilmora-landing.dark .track{
  color:#1a1a2e;
}
.ilmora-landing.dark .m-item small,
.ilmora-landing.dark .m-row.sel small,
.ilmora-landing.dark .story .s-who,
.ilmora-landing.dark .track>p,
.ilmora-landing.dark .timeline small,
.ilmora-landing.dark .outputs span{
  color:rgba(26,26,46,.62);
}
.ilmora-landing.dark .tile.big{
  color:#fff; /* this tile alone has a fixed dark-navy background, so it keeps white text */
}
.ilmora-landing.dark .tile.big small{
  color:#fff;
}
`;