/**
 * CodingLabLanding.jsx
 * ──────────────────────────────────────────────────────────────────────
 * Premium, animated product-showcase page for ILM ORA's "Coding Lab".
 *
 * IMPORTANT — source of truth
 * Every feature shown on this page (5 languages, custom code editor,
 * Run/Submit, custom stdin, Problems, sample + hidden test cases, the
 * judge/verdict flow, submission History, saved Files, the MySQL table
 * explorer + DB reset, and Playground mode) was verified against the
 * actual product component `StudentCompilerPage.jsx`. Nothing here is
 * invented — there is intentionally NO AI, dashboard, achievements,
 * settings, or file/folder-tree section, because those don't exist in
 * the real Coding Lab yet.
 *
 * This component now uses the same shared `PublicLayout` shell as
 * `StudentHub.jsx` (AnnouncementBanner → Navbar → content → Footer).
 * It does not render its own Navbar/Footer/theme system — theme and
 * scroll behavior are wired up locally and handed to `PublicLayout`
 * exactly the way `StudentHub.jsx` does it.
 *
 * `studentRoute` should point at wherever StudentCompilerPage is
 * actually mounted in your router — swap the default below to match.
 *
 * Design tokens follow the ILM ORA system: Sora for headings, Plus
 * Jakarta Sans for body, brand orange #F97316 / green #16A34A / dark
 * #0F172A, and Tailwind's `dark:` variant (class-based) for theming.
 * If your Tailwind config already exposes semantic tokens (e.g.
 * `bg-surface`, `text-foreground`), swap them in for the neutral
 * slate/white pairs used here — those weren't available to inspect.
 * ────────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Code2, Terminal, Database, Coffee, Braces, Play, Save, FolderOpen,
  Trophy, FlaskConical, RotateCcw, Table2, History, Gamepad2, LayoutGrid,
  Hash, CheckCircle2, XCircle, Clock, Eye, EyeOff, ChevronDown, ChevronUp,
  ChevronRight, ArrowRight, Sun, Moon, Monitor, Laptop, Tablet, Smartphone,
  BookOpen, PanelLeft, Zap, X, Rocket, Cpu,
} from "lucide-react";
import PublicLayout from "./components/PublicLayout";
import authService from "../../services/authService";
import { registerFcmToken } from "../../services/firebaseService";
/* ────────────────────────────────────────────────────────────────
   Self-contained styles (fonts, keyframes, reveal utilities).
   Injected once, same pattern the real Coding Lab editor uses.
──────────────────────────────────────────────────────────────── */
const CL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .cl-root { font-family: 'Plus Jakarta Sans', sans-serif; }
  .cl-heading { font-family: 'Sora', sans-serif; }
  .cl-mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; }

  .cl-reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1);
  }
  .cl-reveal.cl-in { opacity: 1; transform: translateY(0); }

  @keyframes cl-blink { 0%, 45% { opacity: 1; } 50%, 95% { opacity: 0; } 100% { opacity: 1; } }
  .cl-caret {
    display: inline-block; width: 8px; height: 1.1em; margin-left: 1px;
    background: currentColor; vertical-align: text-bottom;
    animation: cl-blink 1s step-end infinite;
  }

  @keyframes cl-spin { to { transform: rotate(360deg); } }
  .cl-spin { animation: cl-spin .8s linear infinite; }

  @keyframes cl-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  .cl-float { animation: cl-float 5s ease-in-out infinite; }

  .cl-scrollbar-none::-webkit-scrollbar { display: none; }

  @media (prefers-reduced-motion: reduce) {
    .cl-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
    .cl-caret, .cl-spin, .cl-float { animation: none !important; }
  }
`;

if (typeof document !== "undefined" && !document.getElementById("cl-landing-styles")) {
  const tag = document.createElement("style");
  tag.id = "cl-landing-styles";
  tag.textContent = CL_STYLES;
  document.head.appendChild(tag);
}

/* ────────────────────────────────────────────────────────────────
   Real product data — mirrored exactly from StudentCompilerPage.jsx
──────────────────────────────────────────────────────────────── */
const LANGUAGES = [
  {
    key: "JAVA", label: "Java", icon: Coffee, color: "#f97316",
    snippet: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  },
  {
    key: "PYTHON", label: "Python", icon: Code2, color: "#3b82f6",
    snippet: `# Write your solution here\nprint("Hello, World!")`,
  },
  {
    key: "JAVASCRIPT", label: "JavaScript", icon: Braces, color: "#eab308",
    snippet: `// Write your solution here\nconsole.log("Hello, World!");`,
  },
  {
    key: "MYSQL", label: "MySQL", icon: Database, color: "#22d3ee",
    snippet: `-- Your database persists across runs!\nCREATE TABLE IF NOT EXISTS students (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(100),\n  course VARCHAR(100)\n);\n\nSELECT * FROM students;`,
  },
  {
    key: "BASH", label: "Bash", icon: Terminal, color: "#34d399",
    snippet: `#!/bin/bash\necho "=== System Info ==="\nuname -a\n\nfor i in 1 2 3; do\n  echo "Item: $i"\ndone`,
  },
];

const SAMPLE_PROBLEMS = [
  { title: "Two Sum", difficulty: "EASY", marks: 10, tests: 4, desc: "Given an array of integers, return indices of the two numbers that add up to a target." },
  { title: "Reverse Words in a Sentence", difficulty: "MEDIUM", marks: 15, tests: 6, desc: "Reverse the order of words in a given string while preserving spacing rules." },
  { title: "Top Students by Course", difficulty: "HARD", marks: 20, tests: 5, desc: "Write a query that returns the highest scoring student for every course." },
];

const DIFF_COLOR = { EASY: "#16A34A", MEDIUM: "#d97706", HARD: "#dc2626" };
const DIFF_BG = { EASY: "rgba(22,163,74,0.10)", MEDIUM: "rgba(217,119,6,0.10)", HARD: "rgba(220,38,38,0.10)" };

/* ────────────────────────────────────────────────────────────────
   Scroll-reveal primitive
──────────────────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, className = "", delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`cl-reveal ${visible ? "cl-in" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Small shared bits
──────────────────────────────────────────────────────────────── */
function Eyebrow({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#F97316]/25 bg-[#F97316]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#F97316]">
      {Icon && <Icon size={13} strokeWidth={2.5} />}
      {children}
    </span>
  );
}

function SectionHeading({ eyebrow, eyebrowIcon, title, accent, subtitle }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Reveal>
        <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="cl-heading mt-5 text-3xl font-bold text-[#0F172A] dark:text-white sm:text-4xl">
          {title} {accent && <span className="text-[#F97316]">{accent}</span>}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={140}>
          <p className="mt-4 text-base leading-relaxed text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}

function Section({ id, className = "", children }) {
  return (
    <section id={id} className={`px-6 py-20 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function LangIcon({ lang, size = 13 }) {
  const found = LANGUAGES.find((l) => l.key === lang);
  const Icon = found ? found.icon : Code2;
  return <Icon size={size} strokeWidth={2.2} />;
}

/* ────────────────────────────────────────────────────────────────
   Typing code animation (used in Hero + Editor showcase)
──────────────────────────────────────────────────────────────── */
function TypingCode({ code, active, speed = 16 }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    setI(0);
    const id = setInterval(() => {
      setI((prev) => {
        if (prev >= code.length) {
          clearInterval(id);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [active, code, speed]);
  return (
    <>
      {code.slice(0, i)}
      <span className="cl-caret" />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════ */
function Hero({ onStart, onExplore }) {
  const [heroRef, visible] = useReveal();
  const heroSnippet = `class LearningPath:\n    def accelerate(self):\n        return "Master skills fast"\n\nlab = LearningPath()\nprint(lab.accelerate())`;

  return (
    <section ref={heroRef} className="relative overflow-hidden px-6 pb-20 pt-16 sm:pt-20">
      <div
        className="pointer-events-none absolute -top-24 right-[-10%] h-80 w-80 rounded-full bg-[#F97316]/10 blur-3xl cl-float"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-[-10%] h-72 w-72 rounded-full bg-[#16A34A]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <div className={`cl-reveal ${visible ? "cl-in" : ""}`}>
            <Eyebrow icon={Code2}>Coding Lab</Eyebrow>
          </div>

          <h1
            className={`cl-heading cl-reveal ${visible ? "cl-in" : ""} mt-6 text-4xl font-extrabold leading-[1.1] text-[#0F172A] dark:text-white sm:text-5xl lg:text-6xl`}
            style={{ transitionDelay: visible ? "80ms" : "0ms" }}
          >
            Code. Run.
            <br />
            <span className="text-[#F97316]">Learn. Build.</span>
          </h1>

          <p
            className={`cl-reveal ${visible ? "cl-in" : ""} mt-6 max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-300`}
            style={{ transitionDelay: visible ? "150ms" : "0ms" }}
          >
            A real in-browser IDE for students — write, run and submit code
            in five languages, get instantly judged against test cases, and
            keep every attempt saved to your own workspace.
          </p>

          <div
            className={`cl-reveal ${visible ? "cl-in" : ""} mt-8 flex flex-wrap items-center gap-4`}
            style={{ transitionDelay: visible ? "220ms" : "0ms" }}
          >
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F97316]/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#F97316]/30 active:translate-y-0"
            >
              <Rocket size={16} strokeWidth={2.5} /> Start Coding
            </button>
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-7 py-3.5 text-sm font-bold text-[#0F172A] transition hover:border-[#F97316]/40 hover:text-[#F97316] dark:border-white/15 dark:text-white"
            >
              Explore Features <ChevronRight size={15} strokeWidth={2.5} />
            </button>
          </div>

          <div
            className={`cl-reveal ${visible ? "cl-in" : ""} mt-12 grid max-w-md grid-cols-3 gap-6`}
            style={{ transitionDelay: visible ? "280ms" : "0ms" }}
          >
            {[
              ["5", "Languages"],
              ["Live", "Judging"],
              ["Auto", "Save"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="cl-heading text-2xl font-bold text-[#0F172A] dark:text-white">{n}</div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Animated product preview */}
        <div
          className={`cl-reveal ${visible ? "cl-in" : ""} relative`}
          style={{ transitionDelay: visible ? "180ms" : "0ms" }}
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#111111]">
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-white/10">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="cl-mono ml-3 text-xs font-semibold text-slate-400">
                main.py — Coding Lab
              </span>
            </div>
            <pre className="cl-mono min-h-[220px] overflow-x-auto bg-[#0F172A] p-6 text-[13px] leading-relaxed text-slate-200">
              <TypingCode code={heroSnippet} active={visible} speed={22} />
            </pre>
            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 p-4 dark:border-white/10">
              <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/5">
                <div className="text-[11px] font-semibold text-slate-400">Status</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-[#16A34A]">
                  <CheckCircle2 size={14} strokeWidth={2.5} /> SUCCESS
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/5">
                <div className="text-[11px] font-semibold text-slate-400">Runtime</div>
                <div className="mt-0.5 text-sm font-bold text-[#0F172A] dark:text-white">128 ms</div>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/5">
                <div className="text-[11px] font-semibold text-slate-400">Verdict</div>
                <div className="mt-0.5 text-sm font-bold text-[#F97316]">ACCEPTED</div>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/5">
                <div className="text-[11px] font-semibold text-slate-400">Tests</div>
                <div className="mt-0.5 text-sm font-bold text-[#0F172A] dark:text-white">4 / 4</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CODE EDITOR SHOWCASE — line numbers, tab-indent, mono font
═══════════════════════════════════════════════════════════════ */
function EditorShowcase() {
  const [ref, visible] = useReveal();
  const code = `def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i`;
  const lines = code.split("\n");

  return (
    <Section id="editor">
      <SectionHeading
        eyebrowIcon={Code2}
        eyebrow="Code Editor"
        title="A focused editor built for"
        accent="writing real code"
        subtitle="Line numbers, monospace formatting, and Tab-to-indent — a clean workspace with nothing standing between you and your solution."
      />
      <div ref={ref} className={`cl-reveal ${visible ? "cl-in" : ""} mx-auto mt-12 max-w-3xl`}>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-[#0F172A] shadow-xl dark:border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <span className="cl-mono text-xs font-semibold text-slate-400">solution.py</span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold text-slate-300">
              <Code2 size={11} strokeWidth={2.5} /> Python
            </span>
          </div>
          <div className="flex">
            <div className="select-none border-r border-white/5 px-3 py-4 text-right">
              {lines.map((_, i) => (
                <div key={i} className="cl-mono text-xs leading-[22px] text-slate-600">
                  {i + 1}
                </div>
              ))}
            </div>
            <pre className="cl-mono flex-1 overflow-x-auto px-4 py-4 text-[13px] leading-[22px] text-slate-100">
              <TypingCode code={code} active={visible} speed={14} />
            </pre>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ["Line numbers", "Track exactly where you are in every file."],
            ["Tab to indent", "Tab inserts a clean 4-space indent, just like a real IDE."],
            ["Monospace layout", "JetBrains Mono keeps code aligned and easy to scan."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
              <div className="cl-heading text-sm font-bold text-[#0F172A] dark:text-white">{t}</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LANGUAGES SHOWCASE — interactive switcher (5 real languages)
═══════════════════════════════════════════════════════════════ */
function LanguagesShowcase() {
  const [active, setActive] = useState("PYTHON");
  const [ref, visible] = useReveal();
  const lang = LANGUAGES.find((l) => l.key === active);

  return (
    <Section id="languages" className="bg-slate-50 dark:bg-white/[0.03]">
      <SectionHeading
        eyebrowIcon={LayoutGrid}
        eyebrow="Languages"
        title="Five languages,"
        accent="one workspace"
        subtitle="Switch languages and the editor, starter code, and run behavior all update instantly — including a persistent database for MySQL and a sandboxed shell for Bash."
      />

      <div ref={ref} className={`cl-reveal ${visible ? "cl-in" : ""} mx-auto mt-12 max-w-3xl`}>
        <div className="flex flex-wrap justify-center gap-2">
          {LANGUAGES.map((l) => {
            const Icon = l.icon;
            const isActive = l.key === active;
            return (
              <button
                key={l.key}
                onClick={() => setActive(l.key)}
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition"
                style={
                  isActive
                    ? { background: `${l.color}1A`, borderColor: `${l.color}55`, color: l.color }
                    : undefined
                }
                data-inactive={!isActive}
              >
                <Icon size={14} strokeWidth={2.3} />
                {l.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-[#0F172A] shadow-xl dark:border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <span className="cl-mono text-xs font-semibold text-slate-400">
              {active === "MYSQL" ? "query.sql" : active === "BASH" ? "script.sh" : "main"}
            </span>
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold"
              style={{ background: `${lang.color}22`, color: lang.color }}
            >
              <lang.icon size={11} strokeWidth={2.5} />
              {lang.label}
            </span>
          </div>
          <pre key={active} className="cl-mono min-h-[160px] overflow-x-auto px-5 py-5 text-[13px] leading-relaxed text-slate-100">
            <TypingCode code={lang.snippet} active={visible} speed={10} />
          </pre>
          {active === "MYSQL" && (
            <div className="flex items-center gap-2 border-t border-white/10 bg-cyan-400/5 px-5 py-2.5 text-xs font-semibold text-cyan-300">
              <Database size={13} strokeWidth={2} /> Your database persists across runs — CREATE once, query anytime.
            </div>
          )}
          {active === "BASH" && (
            <div className="flex items-center gap-2 border-t border-white/10 bg-emerald-400/5 px-5 py-2.5 text-xs font-semibold text-emerald-300">
              <Terminal size={13} strokeWidth={2} /> Runs inside a sandboxed shell environment.
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RUN + OUTPUT SHOWCASE — including Custom Input tab
═══════════════════════════════════════════════════════════════ */
function RunShowcase() {
  const [ref, visible] = useReveal();
  const [state, setState] = useState("idle"); // idle | running | done
  const [tab, setTab] = useState("output"); // output | input

  const handleRun = useCallback(() => {
    setState("running");
    setTab("output");
    setTimeout(() => setState("done"), 1200);
  }, []);

  return (
    <Section id="run">
      <SectionHeading
        eyebrowIcon={Play}
        eyebrow="Run Code"
        title="Hit Run, see results in"
        accent="real time"
        subtitle="Every run reports a clear status, execution time, and console output — with an optional Custom Input tab to test your own stdin before submitting."
      />

      <div ref={ref} className={`cl-reveal ${visible ? "cl-in" : ""} mx-auto mt-12 max-w-3xl`}>
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-xl dark:border-white/10">
          <div className="flex items-center justify-between bg-[#0F172A] px-5 py-3">
            <span className="cl-mono text-xs font-semibold text-slate-400">solution.py</span>
            <button
              onClick={handleRun}
              disabled={state === "running"}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-1.5 text-xs font-bold text-[#0F172A] transition hover:opacity-85 disabled:opacity-60"
            >
              {state === "running" ? (
                <>
                  <span className="cl-spin h-3 w-3 rounded-full border-2 border-slate-300 border-t-[#0F172A]" />
                  Running...
                </>
              ) : (
                <>
                  <Play size={12} strokeWidth={2.5} fill="currentColor" /> Run
                </>
              )}
            </button>
          </div>

          <div className="border-b border-slate-200 bg-white dark:border-white/10 dark:bg-[#111111]">
            <div className="flex">
              <button
                onClick={() => setTab("output")}
                className={`cl-mono flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold ${
                  tab === "output" ? "border-b-2 border-[#F97316] text-[#F97316]" : "text-slate-400"
                }`}
              >
                <Terminal size={12} strokeWidth={2} /> Output
              </button>
              <button
                onClick={() => setTab("input")}
                className={`cl-mono flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold ${
                  tab === "input" ? "border-b-2 border-[#F97316] text-[#F97316]" : "text-slate-400"
                }`}
              >
                <PanelLeft size={12} strokeWidth={2} /> Custom Input
              </button>
            </div>

            <div className="min-h-[120px] p-5">
              {tab === "input" ? (
                <textarea
                  readOnly
                  value="5 3"
                  className="cl-mono h-24 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                />
              ) : state === "idle" ? (
                <div className="flex h-24 items-center justify-center gap-2 text-sm text-slate-400">
                  <Terminal size={14} strokeWidth={2} /> Click Run to see output here
                </div>
              ) : state === "running" ? (
                <div className="flex h-24 items-center gap-2 text-sm text-slate-400">
                  <span className="cl-spin h-3.5 w-3.5 rounded-full border-2 border-slate-300 border-t-[#F97316]" />
                  Running code...
                </div>
              ) : (
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex items-center gap-1.5 rounded-full bg-[#16A34A]/10 px-3 py-1 text-xs font-bold text-[#16A34A]">
                      <CheckCircle2 size={12} strokeWidth={2.5} /> SUCCESS
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                      <Clock size={12} strokeWidth={2} /> 96 ms
                    </span>
                  </div>
                  <pre className="cl-mono text-sm text-[#0F172A] dark:text-slate-200">8</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROBLEMS + TEST CASES + JUDGE/SUBMIT SHOWCASE
═══════════════════════════════════════════════════════════════ */
function ProblemsShowcase() {
  const [ref, visible] = useReveal();
  const [submitted, setSubmitted] = useState(false);
  const [judging, setJudging] = useState(false);

  const handleSubmit = () => {
    setJudging(true);
    setTimeout(() => {
      setJudging(false);
      setSubmitted(true);
    }, 1100);
  };

  const testResults = [
    { pass: true, hidden: false, out: "[0, 1]" },
    { pass: true, hidden: false, out: "[1, 2]" },
    { pass: true, hidden: true },
    { pass: false, hidden: true },
  ];

  return (
    <Section id="problems" className="bg-slate-50 dark:bg-white/[0.03]">
      <SectionHeading
        eyebrowIcon={BookOpen}
        eyebrow="Problems & Judging"
        title="Solve real problems,"
        accent="get judged instantly"
        subtitle="Each problem ships with a description, input/output format, sample test cases — and hidden ones that only reveal a verdict, not the answer."
      />

      {/* Problem grid */}
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3">
        {SAMPLE_PROBLEMS.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <div className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#111111]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                  <Hash size={11} strokeWidth={2.5} /> {i + 1}
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                  style={{ background: DIFF_BG[p.difficulty], color: DIFF_COLOR[p.difficulty] }}
                >
                  {p.difficulty}
                </span>
              </div>
              <div className="cl-heading text-sm font-bold text-[#0F172A] dark:text-white">{p.title}</div>
              <p className="flex-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{p.desc}</p>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-[#F97316]/10 px-2.5 py-1 text-[11px] font-bold text-[#F97316]">
                    <Trophy size={11} strokeWidth={2} /> {p.marks} pts
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-cyan-500/10 px-2.5 py-1 text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
                    <FlaskConical size={11} strokeWidth={2} /> {p.tests} tests
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Judge demo */}
      <div ref={ref} className={`cl-reveal ${visible ? "cl-in" : ""} mx-auto mt-10 max-w-3xl`}>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#111111]">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/10">
            <div>
              <div className="cl-heading text-sm font-bold text-[#0F172A] dark:text-white">Two Sum</div>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                  style={{ background: DIFF_BG.EASY, color: DIFF_COLOR.EASY }}
                >
                  EASY
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                  <Trophy size={11} strokeWidth={2} /> 10 pts
                </span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={judging}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {judging ? (
                <>
                  <span className="cl-spin h-3 w-3 rounded-full border-2 border-white/40 border-t-white" />
                  Judging...
                </>
              ) : (
                <>
                  <Zap size={12} strokeWidth={2.5} fill="currentColor" /> Submit
                </>
              )}
            </button>
          </div>

          <div className="p-5">
            {!submitted && !judging && (
              <div className="py-6 text-center text-sm text-slate-400">
                Click <strong className="text-slate-500 dark:text-slate-300">Submit</strong> to judge your
                solution against every test case.
              </div>
            )}
            {judging && (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-400">
                <span className="cl-spin h-3.5 w-3.5 rounded-full border-2 border-slate-300 border-t-blue-600" />
                Running all test cases...
              </div>
            )}
            {submitted && !judging && (
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5 text-base font-black text-[#16A34A]">
                    <CheckCircle2 size={18} strokeWidth={2.5} /> ACCEPTED
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-[#F97316]/10 px-3 py-1 text-xs font-bold text-[#F97316]">
                    <Trophy size={11} strokeWidth={2} /> 8 / 10 pts
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                    <FlaskConical size={11} strokeWidth={2} /> 3 / 4 tests
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {testResults.map((t, i) => (
                    <div
                      key={i}
                      className="rounded-xl border p-3 text-xs"
                      style={{
                        background: t.pass ? "rgba(22,163,74,0.07)" : "rgba(220,38,38,0.07)",
                        borderColor: t.pass ? "rgba(22,163,74,0.25)" : "rgba(220,38,38,0.25)",
                      }}
                    >
                      <div className="mb-1 flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1 text-[#0F172A] dark:text-white">
                          <Hash size={10} strokeWidth={2.5} /> {i + 1}
                        </span>
                        {t.pass ? (
                          <CheckCircle2 size={12} strokeWidth={2.5} className="text-[#16A34A]" />
                        ) : (
                          <XCircle size={12} strokeWidth={2.5} className="text-red-500" />
                        )}
                      </div>
                      {t.hidden ? (
                        <span className="flex items-center gap-1 text-slate-400">
                          <EyeOff size={10} strokeWidth={2} /> Hidden
                        </span>
                      ) : (
                        <span className="cl-mono text-slate-500 dark:text-slate-400">{t.out}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBMISSION HISTORY SHOWCASE
═══════════════════════════════════════════════════════════════ */
function HistoryShowcase() {
  const [open, setOpen] = useState(0);
  const [ref, visible] = useReveal();
  const rows = [
    { lang: "PYTHON", status: "SUCCESS", ms: 96, when: "Today, 10:42 AM", out: "8" },
    { lang: "JAVA", status: "COMPILE_ERROR", ms: 41, when: "Today, 10:31 AM", out: "Main.java:4: error: ';' expected" },
    { lang: "MYSQL", status: "SUCCESS", ms: 152, when: "Yesterday, 6:05 PM", out: "3 rows returned" },
  ];
  const statusColor = (s) => (s === "SUCCESS" ? "#16A34A" : s === "COMPILE_ERROR" ? "#d97706" : "#dc2626");

  return (
    <Section id="history">
      <SectionHeading
        eyebrowIcon={History}
        eyebrow="Submission History"
        title="Every run,"
        accent="saved automatically"
        subtitle="Look back at any past run — language, verdict, execution time, and the exact console output — all in one timeline."
      />
      <div ref={ref} className={`cl-reveal ${visible ? "cl-in" : ""} mx-auto mt-12 max-w-2xl space-y-3`}>
        {rows.map((r, i) => (
          <div
            key={i}
            onClick={() => setOpen(open === i ? -1 : i)}
            className={`cursor-pointer rounded-xl border p-4 transition ${
              open === i ? "border-[#F97316]/40 bg-[#F97316]/5" : "border-slate-200 dark:border-white/10"
            }`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2.5 py-1 text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
                <LangIcon lang={r.lang} /> {r.lang}
              </span>
              <span
                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
                style={{ background: `${statusColor(r.status)}1A`, color: statusColor(r.status) }}
              >
                {r.status === "SUCCESS" ? (
                  <CheckCircle2 size={10} strokeWidth={2.5} />
                ) : (
                  <XCircle size={10} strokeWidth={2.5} />
                )}
                {r.status}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                <Cpu size={11} strokeWidth={2} /> {r.ms}ms
              </span>
              <span className="ml-auto flex items-center gap-1 text-xs text-slate-400">
                <Clock size={11} strokeWidth={2} /> {r.when}
              </span>
              {open === i ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
            </div>
            {open === i && (
              <pre className="cl-mono mt-3 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                {r.out}
              </pre>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FILES + MYSQL EXPLORER SHOWCASE
═══════════════════════════════════════════════════════════════ */
function FilesAndDbShowcase() {
  const [ref, visible] = useReveal();
  const [showTables, setShowTables] = useState(false);

  const files = [
    { name: "two_sum.py", lang: "PYTHON", date: "Aug 18" },
    { name: "seed_data.sql", lang: "MYSQL", date: "Aug 17" },
    { name: "sandbox.sh", lang: "BASH", date: "Aug 12" },
  ];

  return (
    <Section id="files" className="bg-slate-50 dark:bg-white/[0.03]">
      <SectionHeading
        eyebrowIcon={FolderOpen}
        eyebrow="Files & Storage"
        title="Save your work,"
        accent="pick up where you left off"
        subtitle="Name and save any file to come back to later, and — for MySQL — inspect your tables or reset the whole database whenever you need a clean slate."
      />

      <div ref={ref} className={`cl-reveal ${visible ? "cl-in" : ""} mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-2`}>
        {/* Saved files drawer */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111111]">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5 dark:border-white/10">
            <FolderOpen size={15} strokeWidth={2} className="text-[#F97316]" />
            <span className="cl-heading text-sm font-bold text-[#0F172A] dark:text-white">My Saved Files</span>
          </div>
          <div className="space-y-2 p-4">
            {files.map((f) => (
              <div
                key={f.name}
                className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5 dark:border-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <LangIcon lang={f.lang} size={16} />
                  <div>
                    <div className="cl-mono text-xs font-bold text-[#0F172A] dark:text-white">{f.name}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock size={9} strokeWidth={2} /> {f.date}
                    </div>
                  </div>
                </div>
                <Save size={13} strokeWidth={2} className="text-slate-300" />
              </div>
            ))}
          </div>
        </div>

        {/* MySQL table explorer */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111111]">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Database size={15} strokeWidth={2} className="text-cyan-500" />
              <span className="cl-heading text-sm font-bold text-[#0F172A] dark:text-white">MySQL Explorer</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTables((v) => !v)}
                className="flex items-center gap-1 rounded-lg bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold text-cyan-600 dark:text-cyan-400"
              >
                <Table2 size={11} strokeWidth={2} /> {showTables ? "Hide Tables" : "Show Tables"}
              </button>
              <button className="flex items-center gap-1 rounded-lg bg-red-500/10 px-2.5 py-1 text-[10px] font-bold text-red-500">
                <RotateCcw size={11} strokeWidth={2} /> Reset DB
              </button>
            </div>
          </div>
          <div className="p-4">
            {showTables ? (
              <table className="cl-mono w-full text-left text-[11px]">
                <thead>
                  <tr className="text-slate-400">
                    <th className="pb-1.5 font-semibold">id</th>
                    <th className="pb-1.5 font-semibold">name</th>
                    <th className="pb-1.5 font-semibold">course</th>
                  </tr>
                </thead>
                <tbody className="text-[#0F172A] dark:text-slate-200">
                  {[
                    [1, "Alice", "Java"],
                    [2, "Bob", "Python"],
                    [3, "Carol", "MySQL"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-slate-100 dark:border-white/10">
                      <td className="py-1.5">{row[0]}</td>
                      <td className="py-1.5">{row[1]}</td>
                      <td className="py-1.5">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex h-24 items-center justify-center text-xs text-slate-400">
                Click "Show Tables" to inspect your database
              </div>
            )}
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
              <Database size={11} strokeWidth={2} /> Your data persists across runs.
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PLAYGROUND vs PROBLEM MODE
═══════════════════════════════════════════════════════════════ */
function PlaygroundShowcase() {
  const [ref, visible] = useReveal();
  return (
    <Section id="playground">
      <SectionHeading
        eyebrowIcon={Gamepad2}
        eyebrow="Two Ways to Code"
        title="Free practice or"
        accent="guided problems"
        subtitle="Jump into Playground for open-ended coding with no problem attached, or work through assigned problems with structured test cases and judging."
      />
      <div ref={ref} className={`cl-reveal ${visible ? "cl-in" : ""} mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2`}>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#111111]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <Gamepad2 size={18} strokeWidth={2} />
          </div>
          <div className="cl-heading mt-4 text-base font-bold text-[#0F172A] dark:text-white">Playground</div>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Open-ended coding across all five languages — write, run, and save
            files freely with no assigned problem attached.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#111111]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
            <BookOpen size={18} strokeWidth={2} />
          </div>
          <div className="cl-heading mt-4 text-base font-bold text-[#0F172A] dark:text-white">Problem Mode</div>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Solve an assigned problem alongside its description, sample
            input/output, and test cases — then submit for judging.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LIGHT / DARK THEME SHOWCASE
═══════════════════════════════════════════════════════════════ */
function ThemeShowcase() {
  const [ref, visible] = useReveal();
  return (
    <Section id="theme" className="bg-slate-50 dark:bg-white/[0.03]">
      <SectionHeading
        eyebrowIcon={Sun}
        eyebrow="Light & Dark Mode"
        title="Comfortable in"
        accent="any light"
        subtitle="Coding Lab follows the same theme as the rest of ILM ORA — switch anytime, and the editor, console, and every panel adapt instantly."
      />
      <div ref={ref} className={`cl-reveal ${visible ? "cl-in" : ""} mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2`}>
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
          <div className="flex items-center gap-2 bg-white px-4 py-3 text-slate-500">
            <Sun size={14} strokeWidth={2} className="text-[#F97316]" />
            <span className="text-xs font-bold">Light</span>
          </div>
          <pre className="cl-mono bg-slate-50 p-5 text-[12px] leading-relaxed text-slate-700">
            {`print("Hello, World!")`}
          </pre>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center gap-2 bg-[#111111] px-4 py-3 text-slate-300">
            <Moon size={14} strokeWidth={2} className="text-[#F97316]" />
            <span className="text-xs font-bold">Dark</span>
          </div>
          <pre className="cl-mono bg-[#0a0a0a] p-5 text-[12px] leading-relaxed text-slate-200">
            {`print("Hello, World!")`}
          </pre>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function CodingLabLanding({
  studentRoute = "/coding-lab/app",
  theme = "light",
  toggleTheme,
  setShowLoginModal,
}) {
  const navigate = useNavigate();
  const darkMode = theme === "dark";

  const handleStart = () => {
    setShowLoginModal(true);
  };

  const scrollToSection = (sectionId) => {
    document.querySelector(`#${sectionId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleExplore = () => scrollToSection("editor");

    return (
    <PublicLayout
      theme={theme}
      toggleTheme={toggleTheme}
      setShowLoginModal={setShowLoginModal}
      scrollToSection={scrollToSection}
    >
      <div className="cl-root bg-white text-[#0F172A] dark:bg-[#0a0a0a] dark:text-white">
        <Hero onStart={handleStart} onExplore={handleExplore} />
        <EditorShowcase />
        <LanguagesShowcase />
        <RunShowcase />
        <ProblemsShowcase />
        <HistoryShowcase />
        <FilesAndDbShowcase />
        <PlaygroundShowcase />
        <ThemeShowcase />
      </div>
    </PublicLayout>
  );
}