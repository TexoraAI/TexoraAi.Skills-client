import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Layers, Target, Calendar, Trophy, Check, ChevronRight, ChevronLeft,
  ChevronDown, Play, Zap, FileText, Clock, Code2, Terminal, CircleCheck,
  AlertTriangle, RefreshCw, Users, BarChart2, Award, Sparkles, ArrowRight,
} from "lucide-react";
import PublicLayout from "../Landing/components/PublicLayout";
import authService from "../../services/authService";
import { registerFcmToken } from "../../services/firebaseService";
/* ════════════════════════════════════════════════════════════════════
   SOURCE-OF-TRUTH CONSTANTS
   Mirrors StudentStudyPlanPage.jsx exactly — languages, difficulty
   colors, verdicts and status values are not invented for this page.
   ════════════════════════════════════════════════════════════════════ */
const LANGUAGES = ["JAVA", "PYTHON", "JAVASCRIPT", "BASH"];
const LANG_LABEL = { JAVA: "Java", PYTHON: "Python", JAVASCRIPT: "JavaScript", BASH: "Bash" };
const LANG_ICON = { JAVA: "☕", PYTHON: "🐍", JAVASCRIPT: "⚡", BASH: "🖥" };
const DEMO_CODE = {
  JAVA: `public class Main {\n    public static void main(String[] args) {\n        int[] nums = {2, 7, 11, 15};\n        int target = 9;\n        System.out.println(twoSum(nums, target));\n    }\n}`,
  PYTHON: `def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n\nprint(two_sum([2, 7, 11, 15], 9))`,
  JAVASCRIPT: `function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n}\nconsole.log(twoSum([2, 7, 11, 15], 9));`,
  BASH: `#!/bin/bash\n# Two Sum — sample solution\nnums=(2 7 11 15)\ntarget=9\necho "[0, 1]"`,
};

const diffStyle = (d) =>
  d === "EASY"
    ? { color: "#16A34A", bg: "rgba(22,163,74,0.1)", border: "rgba(22,163,74,0.28)" }
    : d === "MEDIUM"
    ? { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.28)" }
    : { color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.28)" };

const verdictColor = (v) => (v === "ACCEPTED" ? "#16A34A" : v === "PARTIAL" ? "#F59E0B" : "#EF4444");

/* ════════════════════════════════════════════════════════════════════
   THEME TOKENS — ILM ORA brand
   ════════════════════════════════════════════════════════════════════ */
const PRIMARY = "#F97316";
const SECONDARY = "#16A34A";
const DARK = "#0F172A";

const T = {
  dark: {
    pageBg: "#0B0F1A",
    sectionBgAlt: "#131B2E",
    cardBg: "rgba(255,255,255,0.035)",
    cardBorder: "rgba(255,255,255,0.09)",
    text: "#F8FAFC",
    textSub: "#94A3B8",
    textMuted: "#64748B",
    divider: "rgba(255,255,255,0.08)",
    pillBg: "rgba(255,255,255,0.06)",
    pillBorder: "rgba(255,255,255,0.12)",
  },
  light: {
    pageBg: "#FFFFFF",
    sectionBgAlt: "#F5E8D8",
    cardBg: "#FFFFFF",
    cardBorder: "#EFE0CB",
    text: "#0F172A",
    textSub: "#57606F",
    textMuted: "#94A3B8",
    divider: "#EFE0CB",
    pillBg: "#FDEEDD",
    pillBorder: "#F7DBB4",
  },
};

/* ════════════════════════════════════════════════════════════════════
   GLOBAL CSS
   ════════════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

.spl * { box-sizing: border-box; }
.spl { font-family: 'Plus Jakarta Sans', sans-serif; }
.spl h1, .spl h2, .spl h3, .spl .spl-font-display { font-family: 'Sora', sans-serif; }
.spl code, .spl pre, .spl .spl-mono { font-family: 'JetBrains Mono', monospace; }

.spl-reveal { opacity: 0; transform: translateY(26px); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
.spl-reveal.spl-in { opacity: 1; transform: none; }
.spl-scale { opacity: 0; transform: scale(.94); transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1); }
.spl-scale.spl-in { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .spl-reveal, .spl-scale { transition: opacity .3s ease !important; transform: none !important; opacity: 1 !important; }
}

.spl-container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
.spl-slides-rail { scroll-snap-type: y proximity; }
.spl-slide-anchor { scroll-snap-align: start; scroll-margin-top: 90px; }

.spl-card-hover { transition: transform .25s cubic-bezier(.4,0,.2,1), box-shadow .25s ease, border-color .25s ease; }
.spl-card-hover:hover { transform: translateY(-4px); }

.spl-btn { display: inline-flex; align-items: center; gap: 8px; font-family: 'Sora', sans-serif; font-weight: 700; border: none; cursor: pointer; transition: all .18s ease; }
.spl-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
.spl-btn:active { transform: scale(.97); }
.spl-btn:disabled { opacity: .55; cursor: not-allowed; transform: none; filter: none; }

.spl-lang-tab { border: none; cursor: pointer; font-family: 'Sora', sans-serif; font-weight: 700; transition: all .16s ease; }
.spl-sec-header:hover { background: rgba(249,115,22,0.05); }
.spl-item-row:hover { background: rgba(249,115,22,0.04); }

.spl-dot { width: 8px; height: 8px; border-radius: 50%; cursor: pointer; transition: all .25s ease; }
.spl-dot.spl-active { height: 24px; border-radius: 5px; }

@keyframes spl-spin { to { transform: rotate(360deg); } }
@keyframes spl-blink { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }
.spl-spin { animation: spl-spin .8s linear infinite; }

@keyframes spl-modalFadeUp { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.3); border-radius: 10px; }

@media (max-width: 980px) {
  .spl-slide-flex { flex-direction: column !important; }
  .spl-dot-rail { display: none !important; }
  .spl-hero-grid { grid-template-columns: 1fr !important; }
}
@media (max-width: 640px) {
  .spl-container { padding: 0 16px; }
  .spl-h2 { font-size: 26px !important; }
  .spl-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
}
`;
/* ════════════════════════════════════════════════════════════════════
   Reveal-on-scroll primitive
   ════════════════════════════════════════════════════════════════════ */
function Reveal({ children, as: Tag = "div", className = "", style = {}, delay = 0, scale = false }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setInView(true)),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={`${scale ? "spl-scale" : "spl-reveal"} ${inView ? "spl-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Small visual primitives (adapted from StudentStudyPlanPage)
   ════════════════════════════════════════════════════════════════════ */
function ArcProgress({ pct, size = 84, color = PRIMARY, track = "rgba(255,255,255,0.15)", textColor = "#fff" }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ filter: `drop-shadow(0 0 8px ${color}55)` }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={7} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" style={{ fontSize: size * 0.2, fontWeight: 800, fill: textColor, fontFamily: "'Sora', sans-serif" }}>
        {pct}%
      </text>
    </svg>
  );
}

function Chip({ icon, label, color, bg, border }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color, background: bg, border: `1px solid ${border}`, borderRadius: 20, padding: "3px 10px" }}>
      {icon} {label}
    </span>
  );
}

function SlideNumber({ n, color }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", color, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <span style={{ width: 26, height: 2, background: color, display: "inline-block", borderRadius: 2 }} />
      Slide {n}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Generic feature-slide layout
   ════════════════════════════════════════════════════════════════════ */
function FeatureSlide({ id, num, eyebrow, title, description, mockup, reverse, t, isDark, anchorRef, alt }) {
  return (
    <section
      id={id}
      ref={anchorRef}
      className="spl-slide-anchor"
      style={{ padding: "88px 0", borderBottom: `1px solid ${t.divider}`, background: alt ? t.sectionBgAlt : t.pageBg, transition: "background .3s ease" }}
    >
      <div className="spl-container">
        <div className="spl-slide-flex" style={{ display: "flex", flexDirection: reverse ? "row-reverse" : "row", gap: 56, alignItems: "center" }}>
          <Reveal className="spl-slide-text" style={{ flex: "1 1 420px", minWidth: 0 }}>
            {num && <SlideNumber n={num} color={PRIMARY} />}
            <div style={{ fontSize: 12, fontWeight: 800, color: SECONDARY, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>{eyebrow}</div>
            <h2 className="spl-h2" style={{ fontSize: 34, fontWeight: 800, color: t.text, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 16 }}>{title}</h2>
            <p style={{ fontSize: 15.5, color: t.textSub, lineHeight: 1.75, maxWidth: 460 }}>{description}</p>
          </Reveal>
          <Reveal className="spl-slide-mock" delay={120} scale style={{ flex: "1 1 480px", minWidth: 0, width: "100%" }}>
            {mockup}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SLIDE 01 — STUDY PLANS
   ════════════════════════════════════════════════════════════════════ */
function PlanCard({ t, isDark, icon, title, desc, color, problems, done, due, pct, delay = 0 }) {
  return (
    <Reveal delay={delay} className="spl-card-hover" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 16, overflow: "hidden", boxShadow: isDark ? "0 8px 26px rgba(0,0,0,0.35)" : "0 4px 16px rgba(15,23,42,0.06)" }}>
      <div style={{ height: 92, background: `linear-gradient(140deg, ${color} 0%, ${color}cc 100%)`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.18) 0%, transparent 65%)" }} />
        <div style={{ position: "relative", fontSize: 34, filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.3))" }}>{icon}</div>
        <div style={{ position: "relative" }}><ArcProgress pct={pct} size={62} color="rgba(255,255,255,0.95)" track="rgba(255,255,255,0.28)" /></div>
      </div>
      <div style={{ padding: "16px 18px 12px" }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: t.text, marginBottom: 5 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: t.textSub, lineHeight: 1.55, marginBottom: 12 }}>{desc}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          <Chip icon={<Target size={10} />} label={`${problems} problems`} color={t.textSub} bg={t.pillBg} border={t.pillBorder} />
          <Chip icon={<Calendar size={10} />} label={`Due ${due}`} color="#F59E0B" bg="rgba(245,158,11,0.1)" border="rgba(245,158,11,0.25)" />
        </div>
        <div style={{ height: 4, background: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", background: `linear-gradient(90deg, ${color}, ${color}cc)`, width: `${pct}%`, borderRadius: 4, transition: "width 1s cubic-bezier(.4,0,.2,1)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 600 }}>{pct}% complete</span>
          <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 600 }}>{done}/{problems}</span>
        </div>
      </div>
      <div style={{ padding: "10px 18px", borderTop: `1px solid ${t.divider}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11.5, color: t.textMuted, fontWeight: 500 }}>{pct === 100 ? "Completed" : pct > 0 ? "In progress" : "Not started"}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700, color }}>Open Plan <ChevronRight size={13} /></span>
        </div>
      </div>
    </Reveal>
  );
}

function Slide01({ t, isDark, anchorRef, alt }) {
  return (
    <FeatureSlide
      id="slide-plans" num="01" eyebrow="My Study Plans" title="Every learning goal, organized into one clear plan." t={t} isDark={isDark} anchorRef={anchorRef} alt={alt}
      description="Students see every assigned study plan as a card — title, description, how many problems it holds, how many are solved, the due date, and live completion status at a glance."
      mockup={
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <PlanCard t={t} isDark={isDark} icon="📘" title="Arrays & Strings Mastery" desc="Core patterns for array and string problems." color={PRIMARY} problems={18} done={13} due="Aug 30" pct={72} delay={0} />
          <PlanCard t={t} isDark={isDark} icon="🌳" title="Trees & Graphs" desc="Traversals, recursion and graph search." color="#7C3AED" problems={14} done={4} due="Sep 12" pct={29} delay={90} />
          <PlanCard t={t} isDark={isDark} icon="⚡" title="Dynamic Programming" desc="From memoization to tabulation." color={SECONDARY} problems={10} done={10} due="Aug 18" pct={100} delay={180} />
        </div>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   SLIDE 02 — STRUCTURED SECTIONS
   ════════════════════════════════════════════════════════════════════ */
function Slide02({ t, isDark, anchorRef, alt }) {
  const sections = [
    { title: "Arrays & Strings", desc: "Two-pointer, sliding window and prefix-sum patterns.", total: 8, done: 6 },
    { title: "Searching & Sorting", desc: "Binary search variants and comparison sorts.", total: 6, done: 2 },
    { title: "Dynamic Programming", desc: "1D/2D DP, memoization and state design.", total: 10, done: 0 },
  ];
  const [open, setOpen] = useState(0);
  return (
    <FeatureSlide
      id="slide-sections" num="02" eyebrow="Structured Sections" title="Plans are broken into ordered, focused sections." t={t} isDark={isDark} anchorRef={anchorRef} alt={alt}
      description="Inside a study plan, content is grouped into sections — each with its own title, description and progress. Expand a section to reveal its problems without losing your place."
      mockup={
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sections.map((s, i) => {
            const pct = Math.round((s.done / s.total) * 100);
            const isOpen = open === i;
            return (
              <div key={s.title} style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 14, overflow: "hidden" }}>
                <div className="spl-sec-header" onClick={() => setOpen(isOpen ? -1 : i)} style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 18px", borderLeft: `3px solid ${isOpen ? PRIMARY : "transparent"}`, transition: "background .15s ease" }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: PRIMARY, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Section {i + 1}</div>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: t.text }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>{s.desc}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: t.textSub }}>{s.done}/{s.total}</div>
                      <div style={{ fontSize: 10, color: t.textMuted }}>done</div>
                    </div>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: t.pillBg, border: `1px solid ${t.pillBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ChevronDown size={13} color={t.textMuted} style={{ transition: "transform .2s ease", transform: isOpen ? "rotate(180deg)" : "none" }} />
                    </div>
                  </div>
                </div>
                {isOpen && (
                  <div style={{ padding: "0 18px 16px" }}>
                    <div style={{ height: 4, background: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0", borderRadius: 4, overflow: "hidden", marginBottom: 10 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: PRIMARY, borderRadius: 4, transition: "width .8s ease" }} />
                    </div>
                    <div style={{ fontSize: 12, color: t.textMuted }}>{pct}% of this section complete — expand to solve its problems.</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   SLIDE 03 — CURATED PROBLEMS
   ════════════════════════════════════════════════════════════════════ */
function Slide03({ t, isDark, anchorRef, alt }) {
  const problems = [
    { title: "Two Sum", diff: "EASY", marks: 10, done: true },
    { title: "Longest Substring Without Repeats", diff: "MEDIUM", marks: 20, done: true },
    { title: "Binary Search", diff: "EASY", marks: 10, done: false },
    { title: "Merge Intervals", diff: "HARD", marks: 30, done: false },
  ];
  return (
    <FeatureSlide
      id="slide-problems" num="03" eyebrow="Curated Problems" title="Hand-picked problems, difficulty and marks up front." t={t} isDark={isDark} anchorRef={anchorRef} alt={alt}
      description="Every section holds curated coding problems. Difficulty is color-coded, marks are visible before you start, and completed items are checked off automatically."
      mockup={
        <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 14, overflow: "hidden" }}>
          {problems.map((p, i) => {
            const dc = diffStyle(p.diff);
            return (
              <div key={p.title} className="spl-item-row" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: i < problems.length - 1 ? `1px solid ${t.divider}` : "none", borderLeft: p.done ? `3px solid ${SECONDARY}` : "3px solid transparent", transition: "background .15s ease" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: p.done ? SECONDARY : t.pillBg, border: p.done ? `2px solid ${SECONDARY}` : `2px solid ${t.pillBorder}` }}>
                  {p.done && <Check size={11} color="#fff" strokeWidth={3} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: p.done ? t.textMuted : t.text, textDecoration: p.done ? "line-through" : "none", marginBottom: 5 }}>{p.title}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Chip icon={null} label={p.diff} color={dc.color} bg={dc.bg} border={dc.border} />
                    <Chip icon={<Trophy size={9} />} label={`${p.marks} pts`} color="#F59E0B" bg="rgba(245,158,11,0.08)" border="rgba(245,158,11,0.2)" />
                  </div>
                </div>
                {p.done ? (
                  <Chip icon={<Check size={11} />} label="Done" color={SECONDARY} bg="rgba(22,163,74,0.08)" border="rgba(22,163,74,0.2)" />
                ) : (
                  <button className="spl-btn" style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY}bb)`, color: "#fff", borderRadius: 9, padding: "7px 14px", fontSize: 12.5 }}>
                    Solve <ChevronRight size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   SLIDE 04 — LIVE PROGRESS TRACKING
   ════════════════════════════════════════════════════════════════════ */
function Slide04({ t, isDark, anchorRef, alt }) {
  const wrapRef = useRef(null);
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          let v = 0;
          const iv = setInterval(() => {
            v += 5;
            if (v >= 75) { v = 75; clearInterval(iv); }
            setPct(v);
          }, 45);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <FeatureSlide
      id="slide-progress" num="04" eyebrow="Live Progress Tracking" title="Progress updates the moment you complete a problem." t={t} isDark={isDark} anchorRef={anchorRef} alt={alt}
      description="Overall progress and per-section progress are calculated live from completed items — shown as an animated arc and a linear bar, no manual refresh needed."
      mockup={
        <div ref={wrapRef} style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 16, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <ArcProgress pct={pct} size={100} color={PRIMARY} track={isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0"} textColor={t.text} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Overall Progress</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: t.text }}>{Math.round((pct / 100) * 18)}/18 solved</div>
            </div>
          </div>
          <div>
            {[["Arrays & Strings", Math.min(pct + 20, 100)], ["Searching & Sorting", Math.min(pct - 10 > 0 ? pct - 10 : 0, 100)], ["Dynamic Programming", Math.min(Math.max(pct - 40, 0), 100)]].map(([label, p]) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12.5, color: t.textSub, fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: 12.5, color: t.textMuted, fontWeight: 700 }}>{p}%</span>
                </div>
                <div style={{ height: 6, background: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${p}%`, background: `linear-gradient(90deg, ${SECONDARY}, ${SECONDARY}cc)`, borderRadius: 6, transition: "width 1s cubic-bezier(.4,0,.2,1)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   SLIDE 05 — DEADLINES & BATCHES
   ════════════════════════════════════════════════════════════════════ */
function Slide05({ t, isDark, anchorRef, alt }) {
  return (
    <FeatureSlide
      id="slide-deadlines" num="05" eyebrow="Deadlines & Batches" title="Every plan is anchored to a due date and your batch." t={t} isDark={isDark} anchorRef={anchorRef} alt={alt}
      description="Study plans are assigned to a batch by your trainer, with a clear due date shown on every plan card — so priorities and timelines are never a guessing game."
      mockup={
        <div style={{ background: `linear-gradient(140deg, ${PRIMARY} 0%, ${PRIMARY}cc 100%)`, borderRadius: 16, padding: "26px 24px", position: "relative", overflow: "hidden", boxShadow: "0 12px 30px rgba(249,115,22,0.3)" }}>
          <div style={{ position: "absolute", right: -40, top: -40, width: 180, height: 180, background: "rgba(255,255,255,0.12)", borderRadius: "50%", filter: "blur(30px)" }} />
          <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ fontSize: 34, marginBottom: 10 }}>🌳</div>
              <div style={{ fontSize: 19, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Trees & Graphs</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 20, padding: "4px 11px", display: "flex", alignItems: "center", gap: 5 }}><Calendar size={11} /> Due Aug 30</span>
                <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 20, padding: "4px 11px", display: "flex", alignItems: "center", gap: 5 }}><Users size={11} /> Batch #42</span>
              </div>
            </div>
            <ArcProgress pct={72} size={80} color="#fff" track="rgba(255,255,255,0.28)" />
          </div>
          <div style={{ marginTop: 20, height: 4, background: "rgba(255,255,255,0.22)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "72%", background: "#fff", borderRadius: 4 }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 12.5, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>72% Complete</div>
        </div>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   SLIDE 06 — PROBLEM DETAILS
   ════════════════════════════════════════════════════════════════════ */
function Slide06({ t, isDark, anchorRef, alt }) {
  return (
    <FeatureSlide
      id="slide-details" num="06" eyebrow="Problem Details" title="Every problem opens with everything you need." t={t} isDark={isDark} anchorRef={anchorRef} alt={alt}
      description="Description, input/output format, constraints and sample test cases are all laid out clearly before you write a single line of code."
      mockup={
        <div style={{ background: "#0B1220", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "22px 22px 20px", color: "#E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#F8FAFC" }}>Two Sum</h3>
            <Chip icon={null} label="EASY" color="#16A34A" bg="rgba(22,163,74,0.12)" border="rgba(22,163,74,0.3)" />
            <Chip icon={<Trophy size={10} />} label="10 pts" color="#F59E0B" bg="rgba(245,158,11,0.1)" border="rgba(245,158,11,0.25)" />
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(148,163,184,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Description</div>
          <p style={{ fontSize: 12.5, color: "#94A3B8", lineHeight: 1.7, marginBottom: 16 }}>Given an array of integers and a target, return indices of the two numbers that add up to the target.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(148,163,184,0.5)", textTransform: "uppercase", marginBottom: 6 }}>Input</div>
              <code style={{ fontSize: 12, color: "#E2E8F0" }}>[2,7,11,15], target=9</code>
            </div>
            <div style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.18)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(22,163,74,0.7)", textTransform: "uppercase", marginBottom: 6 }}>Output</div>
              <code style={{ fontSize: 12, color: "#4ADE80" }}>[0, 1]</code>
            </div>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(148,163,184,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Constraints</div>
          <div style={{ background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 9, padding: "9px 12px" }}>
            <code style={{ fontSize: 11.5, color: "#FDBA74" }}>2 ≤ nums.length ≤ 10⁴ · exactly one valid answer</code>
          </div>
        </div>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   SLIDE 07 — IN-BROWSER COMPILER
   ════════════════════════════════════════════════════════════════════ */
function Slide07({ t, isDark, anchorRef, alt }) {
  const code = DEMO_CODE.PYTHON;
  const lines = code.split("\n");
  return (
    <FeatureSlide
      id="slide-compiler" num="07" eyebrow="In-Browser Compiler" title="A full coding workspace, right inside the plan." t={t} isDark={isDark} anchorRef={anchorRef} alt={alt}
      description="Problem panel, code editor with line numbers, language selector, Run, Submit and results all live together — no separate tools, no context switching."
      mockup={
        <div style={{ background: "#0B1220", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ height: 44, background: "rgba(13,19,33,0.98)", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
            <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", fontWeight: 600, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Two Sum</span>
            <span className="spl-lang-tab" style={{ background: PRIMARY, color: "#fff", borderRadius: 7, padding: "4px 10px", fontSize: 11 }}>🐍 Python</span>
            <button className="spl-btn" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderRadius: 7, padding: "5px 10px", fontSize: 11 }}><Play size={11} /> Run</button>
            <button className="spl-btn" style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY}bb)`, color: "#fff", borderRadius: 7, padding: "5px 10px", fontSize: 11 }}><Zap size={11} /> Submit</button>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ padding: "14px 10px", minWidth: 34, textAlign: "right", color: "rgba(148,163,184,0.25)", fontSize: 12, lineHeight: "20px" }}>
              {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <pre style={{ flex: 1, margin: 0, padding: "14px 16px", fontSize: 12.5, lineHeight: "20px", color: "#E2E8F0", overflowX: "auto" }}>{code}</pre>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(22,163,74,0.12)", color: "#4ADE80", border: "1px solid rgba(22,163,74,0.3)", borderRadius: 6, padding: "2px 9px" }}>● SUCCESS</span>
            <span style={{ fontSize: 11, color: "rgba(148,163,184,0.5)", display: "flex", alignItems: "center", gap: 3 }}><Clock size={11} /> 96ms</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(148,163,184,0.5)" }}>Output: [0, 1]</span>
          </div>
        </div>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   SLIDE 08 — MULTI-LANGUAGE CODING
   ════════════════════════════════════════════════════════════════════ */
function Slide08({ t, isDark, anchorRef, alt }) {
  const [lang, setLang] = useState("PYTHON");
  const code = DEMO_CODE[lang];
  const lines = code.split("\n");
  return (
    <FeatureSlide
      id="slide-languages" num="08" eyebrow="Multi-Language Coding" title="Solve every problem in the language you know." t={t} isDark={isDark} anchorRef={anchorRef} alt={alt}
      description="Switch between Java, Python, JavaScript and Bash — the editor and starter code update instantly. Try it: click a language tab."
      mockup={
        <div style={{ background: "#0B1220", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: 6, gap: 4, flexWrap: "wrap" }}>
            {LANGUAGES.map((l) => (
              <button key={l} className="spl-lang-tab" onClick={() => setLang(l)} style={{ background: lang === l ? PRIMARY : "transparent", color: lang === l ? "#fff" : "rgba(255,255,255,0.5)", borderRadius: 8, padding: "6px 13px", fontSize: 12.5, boxShadow: lang === l ? `0 3px 10px ${PRIMARY}55` : "none" }}>
                {LANG_ICON[l]} {LANG_LABEL[l]}
              </button>
            ))}
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ padding: "14px 10px", minWidth: 34, textAlign: "right", color: "rgba(148,163,184,0.25)", fontSize: 12, lineHeight: "20px" }}>
              {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <pre className="spl-mono" style={{ flex: 1, margin: 0, padding: "14px 16px", fontSize: 12, lineHeight: "20px", color: "#E2E8F0", overflowX: "auto", minHeight: 190 }}>{code}</pre>
          </div>
        </div>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   SLIDE 09 — RUN CODE & OUTPUT
   ════════════════════════════════════════════════════════════════════ */
function Slide09({ t, isDark, anchorRef, alt }) {
  const [state, setState] = useState("idle"); // idle | running | success
  const [tab, setTab] = useState("output");
  const run = () => {
    if (state === "running") return;
    setState("running");
    setTimeout(() => setState("success"), 1300);
  };
  return (
    <FeatureSlide
      id="slide-run" num="09" eyebrow="Run Code & Output" title="Test against sample input before you submit." t={t} isDark={isDark} anchorRef={anchorRef} alt={alt}
      description="Run executes your code against the sample input and shows status, execution time and output — a safe check before judging. Click Run to see it happen."
      mockup={
        <div style={{ background: "#0B1220", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ height: 44, display: "flex", alignItems: "center", padding: "0 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", gap: 8 }}>
            <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)", flex: 1 }}>main.py</span>
            <button className="spl-btn" onClick={run} disabled={state === "running"} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)", borderRadius: 7, padding: "5px 12px", fontSize: 11.5 }}>
              {state === "running" ? <RefreshCw size={11} className="spl-spin" /> : <Play size={11} />} {state === "running" ? "Running…" : "Run"}
            </button>
          </div>
          <div style={{ display: "flex", padding: "0 14px", gap: 4, borderBottom: "1px solid rgba(255,255,255,0.07)", height: 36, alignItems: "center" }}>
            {["output", "input"].map((tb) => (
              <button key={tb} onClick={() => setTab(tb)} className="spl-lang-tab" style={{ background: tab === tb ? "rgba(249,115,22,0.14)" : "transparent", border: tab === tb ? "1px solid rgba(249,115,22,0.3)" : "1px solid transparent", color: tab === tb ? "#FDBA74" : "rgba(148,163,184,0.55)", borderRadius: 6, padding: "4px 11px", fontSize: 11.5 }}>
                {tb === "output" ? "Output" : "Custom Input"}
              </button>
            ))}
          </div>
          <div style={{ padding: "16px", minHeight: 120 }}>
            {tab === "output" ? (
              state === "idle" ? (
                <div style={{ color: "rgba(148,163,184,0.4)", fontSize: 12.5, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingTop: 12 }}>
                  <Play size={22} color="rgba(148,163,184,0.25)" />
                  Click Run to test with sample input
                </div>
              ) : state === "running" ? (
                <div style={{ color: "rgba(148,163,184,0.6)", fontSize: 12.5, textAlign: "center", paddingTop: 14 }}>Running code…</div>
              ) : (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
                    <span style={{ borderRadius: 6, padding: "2px 9px", fontSize: 11, fontWeight: 700, background: "rgba(22,163,74,0.12)", color: "#4ADE80", border: "1px solid rgba(22,163,74,0.3)" }}>● SUCCESS</span>
                    <span style={{ color: "rgba(148,163,184,0.5)", fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}><Clock size={11} /> 96ms</span>
                  </div>
                  <code style={{ fontSize: 12.5, color: "#E2E8F0" }}>Output: [0, 1]</code>
                </div>
              )
            ) : (
              <code style={{ fontSize: 12.5, color: "rgba(148,163,184,0.6)" }}>nums = [2, 7, 11, 15]\ntarget = 9</code>
            )}
          </div>
        </div>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   SLIDE 10 — SUBMIT & JUDGE
   ════════════════════════════════════════════════════════════════════ */
function Slide10({ t, isDark, anchorRef, alt }) {
  const [phase, setPhase] = useState("idle"); // idle | judging | done
  const [passedCount, setPassedCount] = useState(0);
  const total = 4;
  const submit = () => {
    if (phase === "judging") return;
    setPhase("judging");
    setPassedCount(0);
    let n = 0;
    const iv = setInterval(() => {
      n += 1;
      setPassedCount(n);
      if (n >= total) { clearInterval(iv); setTimeout(() => setPhase("done"), 250); }
    }, 380);
  };
  return (
    <FeatureSlide
      id="slide-judge" num="10" eyebrow="Submit & Judge" title="Submit runs every test case and returns a verdict." t={t} isDark={isDark} anchorRef={anchorRef} alt={alt}
      description="Submitting judges your solution against the full test suite and reports a verdict — Accepted, Partial or Error — with marks obtained. Click Submit to watch it judge."
      mockup={
        <div style={{ background: "#0B1220", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <button className="spl-btn" onClick={submit} disabled={phase === "judging"} style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY}bb)`, color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 12.5 }}>
              {phase === "judging" ? <RefreshCw size={12} className="spl-spin" /> : <Zap size={12} />} {phase === "judging" ? "Judging…" : "Submit"}
            </button>
            {phase === "done" && (
              <span style={{ fontSize: 12.5, fontWeight: 800, color: verdictColor("ACCEPTED"), padding: "4px 12px", background: `${verdictColor("ACCEPTED")}18`, borderRadius: 7, border: `1px solid ${verdictColor("ACCEPTED")}40` }}>✓ ACCEPTED</span>
            )}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
            {Array.from({ length: total }).map((_, i) => {
              const passed = phase !== "idle" && i < passedCount;
              const pending = phase === "idle" || i >= passedCount;
              return (
                <div key={i} style={{ minWidth: 96, fontSize: 11, borderRadius: 9, padding: "8px 11px", background: passed ? "rgba(22,163,74,0.09)" : "rgba(255,255,255,0.04)", border: `1px solid ${passed ? "rgba(22,163,74,0.28)" : "rgba(255,255,255,0.08)"}`, transition: "all .2s ease" }}>
                  <div style={{ fontWeight: 700, color: "rgba(248,250,252,0.6)", marginBottom: 4 }}>Test {i + 1}</div>
                  <div style={{ color: passed ? "#4ADE80" : "rgba(148,163,184,0.4)", fontWeight: 700 }}>{passed ? "✓ PASSED" : pending && phase === "judging" ? "…" : "—"}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={{ fontSize: 10, color: t.textMuted, width: "100%", marginBottom: 2 }}>Verdicts the judge can return:</div>
            <Chip icon={<CircleCheck size={11} />} label="ACCEPTED" color={verdictColor("ACCEPTED")} bg={`${verdictColor("ACCEPTED")}18`} border={`${verdictColor("ACCEPTED")}40`} />
            <Chip icon={<AlertTriangle size={11} />} label="PARTIAL" color={verdictColor("PARTIAL")} bg={`${verdictColor("PARTIAL")}18`} border={`${verdictColor("PARTIAL")}40`} />
            <Chip icon={<AlertTriangle size={11} />} label="ERROR" color={verdictColor("ERROR")} bg={`${verdictColor("ERROR")}18`} border={`${verdictColor("ERROR")}40`} />
          </div>
        </div>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   SLIDE 11 — MARK DONE
   ════════════════════════════════════════════════════════════════════ */
function Slide11({ t, isDark, anchorRef, alt }) {
  const [done, setDone] = useState(false);
  const [solved, setSolved] = useState(13);
  const markDone = () => {
    if (done) return;
    setDone(true);
    setSolved((s) => s + 1);
  };
  return (
    <FeatureSlide
      id="slide-markdone" num="11" eyebrow="Mark Done" title="One click turns a passed solution into saved progress." t={t} isDark={isDark} anchorRef={anchorRef} alt={alt}
      description="Once a submission passes, Mark Done saves your progress against that problem — instantly reflected in the section and plan. Try clicking it."
      mockup={
        <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 16, padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
            <Chip icon={<Trophy size={11} />} label="10/10 pts" color="#F59E0B" bg="rgba(245,158,11,0.1)" border="rgba(245,158,11,0.25)" />
            <Chip icon={<CircleCheck size={11} />} label="Solution Passed" color={SECONDARY} bg="rgba(22,163,74,0.1)" border="rgba(22,163,74,0.25)" />
          </div>
          <button className="spl-btn" onClick={markDone} disabled={done} style={{ width: "100%", justifyContent: "center", background: done ? "rgba(22,163,74,0.14)" : `linear-gradient(135deg, ${SECONDARY}, #15803D)`, color: done ? SECONDARY : "#fff", border: done ? `1px solid rgba(22,163,74,0.3)` : "none", borderRadius: 10, padding: "12px 18px", fontSize: 13.5 }}>
            {done ? <><Check size={14} /> Problem Completed</> : <><Check size={14} /> Mark Done</>}
          </button>
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: `1px solid ${t.divider}` }}>
            <span style={{ fontSize: 12.5, color: t.textMuted, fontWeight: 600 }}>{done ? "Progress saved" : "Awaiting confirmation"}</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: t.text }}>{solved}<span style={{ fontSize: 12, color: t.textMuted, fontWeight: 600 }}> / 18 solved</span></span>
          </div>
        </div>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   SLIDE 12 — PROGRESS UPDATE
   ════════════════════════════════════════════════════════════════════ */
function Slide12({ t, isDark, anchorRef, alt }) {
  const steps = [
    { label: "Problem completed", icon: <Check size={14} /> },
    { label: "Section progress increases", icon: <Layers size={14} /> },
    { label: "Overall progress increases", icon: <BarChart2 size={14} /> },
    { label: "Solved count updates", icon: <Target size={14} /> },
  ];
  return (
    <FeatureSlide
      id="slide-progressupdate" num="12" eyebrow="Progress Update" title="One completion ripples through the whole plan." t={t} isDark={isDark} anchorRef={anchorRef} alt={alt}
      description="Marking a problem done recalculates section progress, overall plan progress, and the solved count together — always in sync, always live."
      mockup={
        <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 16, padding: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {steps.map((s, i) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>{s.icon}</div>
                  {i < steps.length - 1 && <div style={{ width: 2, height: 30, background: t.divider }} />}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: t.text, paddingBottom: i < steps.length - 1 ? 14 : 0 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   COMPLETE WORKFLOW
   ════════════════════════════════════════════════════════════════════ */
function WorkflowSection({ t, isDark, anchorRef, alt }) {
  const steps = [
    { label: "Study Plan", icon: <BookOpen size={16} /> },
    { label: "Sections", icon: <Layers size={16} /> },
    { label: "Problems", icon: <Target size={16} /> },
    { label: "Solve", icon: <Code2 size={16} /> },
    { label: "Write Code", icon: <Terminal size={16} /> },
    { label: "Run", icon: <Play size={16} /> },
    { label: "Submit", icon: <Zap size={16} /> },
    { label: "Judge", icon: <CircleCheck size={16} /> },
    { label: "Mark Done", icon: <Check size={16} /> },
    { label: "Progress Updated", icon: <BarChart2 size={16} /> },
  ];
  return (
    <section id="slide-workflow" ref={anchorRef} className="spl-slide-anchor" style={{ padding: "96px 0", background: alt ? t.sectionBgAlt : t.pageBg, borderBottom: `1px solid ${t.divider}` }}>
      <div className="spl-container">
        <Reveal style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: SECONDARY, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Complete Workflow</div>
          <h2 className="spl-h2" style={{ fontSize: 34, fontWeight: 800, color: t.text, letterSpacing: "-0.02em", marginBottom: 12 }}>The complete student journey, start to finish.</h2>
          <p style={{ fontSize: 15.5, color: t.textSub, maxWidth: 620, margin: "0 auto", lineHeight: 1.7 }}>Every capability on this page connects into a single loop — from opening a plan to seeing your progress move.</p>
        </Reveal>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 0, rowGap: 22 }}>
          {steps.map((s, i) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center" }}>
              <Reveal delay={i * 60} scale style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 108 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: t.cardBg, border: `1px solid ${t.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: PRIMARY, boxShadow: isDark ? "0 6px 18px rgba(0,0,0,0.3)" : "0 4px 12px rgba(15,23,42,0.06)" }}>{s.icon}</div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: t.textSub, textAlign: "center", lineHeight: 1.3 }}>{s.label}</div>
              </Reveal>
              {i < steps.length - 1 && <ArrowRight size={16} color={t.textMuted} style={{ margin: "0 6px", flexShrink: 0, alignSelf: "center", marginBottom: 26 }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   STATS
   ════════════════════════════════════════════════════════════════════ */
function StatsSection({ t, isDark, alt }) {
  const stats = [
    { icon: <Layers size={20} />, label: "Structured Sections" },
    { icon: <Target size={20} />, label: "Curated Problems" },
    { icon: <BarChart2 size={20} />, label: "Live Progress" },
    { icon: <Zap size={20} />, label: "Instant Judging" },
  ];
  return (
    <section style={{ padding: "72px 0", borderBottom: `1px solid ${t.divider}`, background: alt ? t.sectionBgAlt : t.pageBg }}>
      <div className="spl-container">
        <div className="spl-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="spl-card-hover" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 14, padding: "22px 18px", textAlign: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${PRIMARY}22, ${SECONDARY}22)`, color: PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>{s.icon}</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: t.text }}>{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   HERO
   ════════════════════════════════════════════════════════════════════ */
function Hero({ t, isDark, onExplore, onStart }) {
  return (
    <section style={{ padding: "72px 0 88px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -120, right: -100, width: 420, height: 420, background: `radial-gradient(circle, ${PRIMARY}22 0%, transparent 70%)`, filter: "blur(10px)" }} />
      <div className="spl-container">
        <div className="spl-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 48, alignItems: "center" }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 800, color: PRIMARY, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)", borderRadius: 20, padding: "6px 14px", marginBottom: 22 }}>
              <Sparkles size={13} /> Study Plans
            </div>
            <h1 style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", color: t.text, marginBottom: 20 }}>
              Turn learning goals into a <span style={{ color: PRIMARY }}>clear path forward.</span>
            </h1>
            <p style={{ fontSize: 16, color: t.textSub, lineHeight: 1.75, maxWidth: 480, marginBottom: 30 }}>
              Study Plans bring structured sections, curated problems, deadlines, coding practice, judging, and progress tracking into one focused learning experience.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="spl-btn" onClick={onExplore} style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY}cc)`, color: "#fff", borderRadius: 11, padding: "13px 24px", fontSize: 14, boxShadow: `0 8px 22px ${PRIMARY}45` }}>
                Explore Study Plans <ArrowRight size={15} />
              </button>
              <button className="spl-btn" onClick={onStart} style={{ background: t.pillBg, color: t.text, border: `1px solid ${t.pillBorder}`, borderRadius: 11, padding: "13px 24px", fontSize: 14 }}>
                <Play size={14} /> Start Learning
              </button>
            </div>
          </Reveal>
          <Reveal delay={140} scale>
            <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 18, overflow: "hidden", boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.45)" : "0 16px 40px rgba(15,23,42,0.1)" }}>
              <div style={{ height: 84, background: `linear-gradient(140deg, ${PRIMARY} 0%, ${SECONDARY} 130%)`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Arrays & Strings Mastery</div>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>Batch #42 · Due Aug 30</div>
                </div>
                <ArcProgress pct={72} size={56} color="#fff" track="rgba(255,255,255,0.3)" />
              </div>
              <div style={{ padding: "18px 22px" }}>
                {[["Two Sum", "EASY", true], ["Longest Substring", "MEDIUM", true], ["Merge Intervals", "HARD", false]].map(([title, diff, done], i) => {
                  const dc = diffStyle(diff);
                  return (
                    <div key={title} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < 2 ? `1px solid ${t.divider}` : "none" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: done ? SECONDARY : t.pillBg, border: done ? `2px solid ${SECONDARY}` : `2px solid ${t.pillBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {done && <Check size={10} color="#fff" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: done ? t.textMuted : t.text, textDecoration: done ? "line-through" : "none", flex: 1 }}>{title}</span>
                      <Chip icon={null} label={diff} color={dc.color} bg={dc.bg} border={dc.border} />
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   FINAL CTA
   ════════════════════════════════════════════════════════════════════ */
function FinalCTA({ onExplore, onStart }) {
  return (
    <section style={{ padding: "88px 0" }}>
      <div className="spl-container">
        <Reveal scale style={{ background: `linear-gradient(140deg, ${PRIMARY} 0%, ${SECONDARY} 140%)`, borderRadius: 22, padding: "56px 40px", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: `0 20px 60px ${PRIMARY}35` }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.18) 0%, transparent 60%)" }} />
          <div style={{ position: "relative" }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 14, lineHeight: 1.2 }}>Build your path. Solve with purpose.</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.9)", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.7 }}>Turn structured study plans into measurable progress with focused practice and instant feedback.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="spl-btn" onClick={onExplore} style={{ background: "#fff", color: DARK, borderRadius: 11, padding: "13px 26px", fontSize: 14 }}>
                Explore Study Plans <ArrowRight size={15} />
              </button>
              <button className="spl-btn" onClick={onStart} style={{ background: "rgba(255,255,255,0.16)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 11, padding: "13px 26px", fontSize: 14 }}>
                Start Learning
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   DOT NAVIGATION RAIL
   ════════════════════════════════════════════════════════════════════ */
function DotRail({ ids, labels, active, onJump, t }) {
  return (
    <div className="spl-dot-rail" style={{ position: "fixed", right: 22, top: "50%", transform: "translateY(-50%)", zIndex: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      {ids.map((id, i) => (
        <button
          key={id}
          title={labels[i]}
          onClick={() => onJump(i)}
          className={`spl-dot ${active === i ? "spl-active" : ""}`}
          style={{ background: active === i ? PRIMARY : t.textMuted, border: "none", padding: 0 }}
          aria-label={`Go to ${labels[i]}`}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════════
   ✅ THEME FIX: this page no longer keeps its own local dark-mode state.
   Just like ResumeBuilderLanding.jsx, `theme` and `toggleTheme` now come
   in as props from the parent route/shell, so the navbar's theme toggle
   controls this page too — light/dark stays in sync across every public
   page instead of StudyPlanLanding drifting out of sync with its own
   independent `useState(true)`.

   ✅ LOGIN FIX: "Explore Study Plans" / "Start Learning" no longer call
   `navigate(...)` straight to /student/study-plan or /student-hub (which
   just bounced unauthenticated visitors to a raw login route). They now
   open the same shared LoginModal used on ResumeBuilderLanding — visitors
   log in (or hit "Apply now") right here, then get redirected by role.
   ════════════════════════════════════════════════════════════════════ */
export default function StudyPlanLanding({
  theme = "light",
  toggleTheme,
  scrollToSection,
  setShowLoginModal,
}) {
  const isDark = theme === "dark";
  const t = isDark ? T.dark : T.light;
  const navigate = useNavigate();

  const openLogin = () => setShowLoginModal(true);

  const slideDefs = [
    { id: "slide-plans", label: "Study Plans" },
    { id: "slide-sections", label: "Sections" },
    { id: "slide-problems", label: "Problems" },
    { id: "slide-progress", label: "Progress" },
    { id: "slide-deadlines", label: "Deadlines" },
    { id: "slide-details", label: "Problem Details" },
    { id: "slide-compiler", label: "Compiler" },
    { id: "slide-languages", label: "Languages" },
    { id: "slide-run", label: "Run" },
    { id: "slide-judge", label: "Submit & Judge" },
    { id: "slide-markdone", label: "Mark Done" },
    { id: "slide-progressupdate", label: "Progress Update" },
    { id: "slide-workflow", label: "Complete Workflow" },
  ];

  const refs = useRef(slideDefs.map(() => null));
  const [active, setActive] = useState(0);

  const scrollTo = (id) => {
    const idx = slideDefs.findIndex((s) => s.id === id);
    if (idx >= 0) {
      refs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const jumpTo = (i) => {
    refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Track active slide as the user scrolls
  useEffect(() => {
    const observers = refs.current.map((el, i) => {
      if (!el) return null;
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && setActive(i)),
        { threshold: 0.5 }
      );
      io.observe(el);
      return io;
    });
    return () => observers.forEach((io) => io && io.disconnect());
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        jumpTo(Math.min(active + 1, slideDefs.length - 1));
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        jumpTo(Math.max(active - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <PublicLayout
      theme={theme}
      toggleTheme={toggleTheme}
      setShowLoginModal={setShowLoginModal}
      scrollToSection={scrollToSection || scrollTo}
    >
      <style>{CSS}</style>
            <div className="spl" data-theme={isDark ? "dark" : "light"} style={{ background: t.pageBg, color: t.text, minHeight: "100vh" }}>
        <Hero t={t} isDark={isDark} onExplore={openLogin} onStart={openLogin} />

        <div className="spl-slides-rail">
          <Slide01 t={t} isDark={isDark} anchorRef={(el) => (refs.current[0] = el)} alt={false} />
          <Slide02 t={t} isDark={isDark} anchorRef={(el) => (refs.current[1] = el)} alt={true} />
          <Slide03 t={t} isDark={isDark} anchorRef={(el) => (refs.current[2] = el)} alt={false} />
          <Slide04 t={t} isDark={isDark} anchorRef={(el) => (refs.current[3] = el)} alt={true} />
          <Slide05 t={t} isDark={isDark} anchorRef={(el) => (refs.current[4] = el)} alt={false} />
          <Slide06 t={t} isDark={isDark} anchorRef={(el) => (refs.current[5] = el)} alt={true} />
          <Slide07 t={t} isDark={isDark} anchorRef={(el) => (refs.current[6] = el)} alt={false} />
          <Slide08 t={t} isDark={isDark} anchorRef={(el) => (refs.current[7] = el)} alt={true} />
          <Slide09 t={t} isDark={isDark} anchorRef={(el) => (refs.current[8] = el)} alt={false} />
          <Slide10 t={t} isDark={isDark} anchorRef={(el) => (refs.current[9] = el)} alt={true} />
          <Slide11 t={t} isDark={isDark} anchorRef={(el) => (refs.current[10] = el)} alt={false} />
          <Slide12 t={t} isDark={isDark} anchorRef={(el) => (refs.current[11] = el)} alt={true} />
          <WorkflowSection t={t} isDark={isDark} anchorRef={(el) => (refs.current[12] = el)} alt={false} />
        </div>

        <StatsSection t={t} isDark={isDark} alt={true} />
        <FinalCTA onExplore={openLogin} onStart={openLogin} />

        <DotRail
          ids={slideDefs.map((s) => s.id)}
          labels={slideDefs.map((s) => s.label)}
          active={active}
          onJump={jumpTo}
          t={t}
        />
      </div>
    </PublicLayout>
  );
}































