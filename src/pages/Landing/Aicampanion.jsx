// src/pages/Landing/Aicampanion.jsx
//
// AI Companion — Product Landing Page
// Slide-by-slide showcase of every AI Companion feature, built with the
// actual AI Companion components (real, zero-mock-API pieces are embedded
// live and interactive; API-bound pieces are represented with faithful,
// same-token mockups so the marketing page never fires real network calls).
//
// Visual language matches the ILM ORA site shell exactly: Poppins type,
// orange (#F97316) accent, dark-navy chrome (#0B0F19), warm cream section
// backgrounds (#F6EDE6) — see /student-hub for reference.
//
// Navbar + Footer: this page now uses the same shared PublicLayout
// (src/pages/Landing/components/PublicLayout) that Workspace.jsx and every
// other public page uses, instead of a page-local TopNav/Footer, so the
// header and footer are pixel-identical across the site.

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  PlayCircle,
  ChevronRight,
  CheckCircle2,
  Moon,
  Sun,
  MessageSquare,
  PenLine,
  Video,
  FileText,
  Zap,
  LayoutTemplate,
  Layers,
  Activity,
  Bot,
  Hash,
  Mic,
  Send,
  Plus,
  Copy,
  Check,
  Wand2,
  RefreshCw,
  Users,
  Clock,
  CalendarDays,
  Square,
  BarChart2,
  Bell,
  CheckSquare,
  Play,
  GitBranch,
  Database,
  Mail,
  Award,
  XCircle,
  Loader,
  Menu,
  X,
} from "lucide-react";

import PublicLayout from "./components/PublicLayout";
import authService from "../../services/authService";
import { registerFcmToken } from "../../services/firebaseService";

// ── Real, zero-API AI Companion components — embedded live ──────────────────
import AiModeCards, { MODES_BY_TAB } from "../../Trainer/ai-companion/AiModeCards";
import AiSourceDropdown from "../../Trainer/ai-companion/AiSourceDropdown";
import AiWorkflowTemplates from "../../Trainer/ai-companion/AiWorkflowTemplates";
import AiTemplateGalleryModal from "../../Trainer/ai-companion/AiTemplateGalleryModal";
import AiContextResourceModal from "../../Trainer/ai-companion/AiContextResourceModal";
import AiCompanionSidebar from "../../Trainer/ai-companion/AiCompanionSidebar";

// ─────────────────────────────────────────────────────────────────────────
// Theme tokens — identical palette to the ILM ORA marketing shell
// ─────────────────────────────────────────────────────────────────────────
const T = {
  light: {
    pageBg: "#ffffff",
    altBg: "#FBF7F2",
    cream: "#F6EDE6",
    navBg: "#0B0F19",
    footerBg: "#0B0F19",
    text: "#1E293B",
    textSoft: "#64748B",
    textFaint: "#94A3B8",
    border: "#EEE6DC",
    cardBg: "#ffffff",
    cardBorder: "#F1E7DB",
    orange: "#F97316",
    orangeSoft: "#FFF1E4",
    shadow: "0 20px 45px -20px rgba(30,41,59,0.18)",
  },
  dark: {
    pageBg: "#0B0F19",
    altBg: "#0F1524",
    cream: "#131A2B",
    navBg: "#080B13",
    footerBg: "#080B13",
    text: "#F1F5F9",
    textSoft: "#94A3B8",
    textFaint: "#64748B",
    border: "#1E293B",
    cardBg: "#111827",
    cardBorder: "#1E293B",
    orange: "#FB923C",
    orangeSoft: "rgba(251,146,60,0.12)",
    shadow: "0 20px 45px -20px rgba(0,0,0,0.55)",
  },
};
const getT = (theme) => (theme === "dark" ? T.dark : T.light);

// ─────────────────────────────────────────────────────────────────────────
// Scroll-reveal hook — IntersectionObserver, fires once per element
// ─────────────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.18) {
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
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, visible];
}

// ─────────────────────────────────────────────────────────────────────────
// Shared building blocks
// ─────────────────────────────────────────────────────────────────────────

/** Fades + slides an element up into place the first time it enters view. */
function Reveal({ children, delay = 0, style, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ icon: Icon, label, t }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 16px 7px 12px",
        borderRadius: 999,
        background: t.orangeSoft,
        color: t.orange,
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 20,
      }}
    >
      <Icon size={15} strokeWidth={2.4} />
      {label}
    </div>
  );
}

function BenefitRow({ icon: Icon, children, t }) {
  return (
    <li
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        fontSize: 15,
        color: t.textSoft,
        lineHeight: 1.55,
        listStyle: "none",
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: t.orangeSoft,
          color: t.orange,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        <Icon size={12.5} strokeWidth={3} />
      </span>
      <span>{children}</span>
    </li>
  );
}

/** Frame that every right-hand product mockup sits inside — consistent
 *  card chrome (radius, shadow, border) no matter what's rendered inside. */
function MockFrame({ children, t, theme, pad = 22, height }) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 22,
        background: t.cardBg,
        border: `1px solid ${t.cardBorder}`,
        boxShadow: t.shadow,
        padding: pad,
        overflow: "hidden",
        height,
      }}
    >
      {/* faint ambient orange glow, matches hero card language */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background:
            theme === "dark"
              ? "rgba(251,146,60,0.08)"
              : "rgba(249,115,22,0.07)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

/** Two-column feature slide — left copy, right live/mock product panel. */
function FeatureSection({
  id,
  index,
  icon: Icon,
  title,
  description,
  benefits,
  t,
  theme,
  alt,
  right,
}) {
  return (
    <section
      id={id}
      style={{
        scrollMarginTop: 92,
        padding: "88px 24px",
        background: alt ? t.altBg : t.pageBg,
        borderTop: `1px solid ${t.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0,0.85fr) minmax(0,1.15fr)",
          gap: 64,
          alignItems: "center",
        }}
        className="ac-feature-grid"
      >
        <Reveal>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: t.textFaint,
              marginBottom: 14,
            }}
          >
            {String(index).padStart(2, "0")} · AI COMPANION
          </div>

          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: t.orangeSoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 22,
            }}
          >
            <Icon size={24} color={t.orange} strokeWidth={2.2} />
          </div>

          <h2
            style={{
              fontSize: "clamp(26px, 3vw, 36px)",
              fontWeight: 700,
              color: t.text,
              lineHeight: 1.2,
              marginBottom: 16,
              fontFamily: "'Plus Jakarta Sans', 'Poppins', sans-serif",
            }}
          >
            {title}
          </h2>

          <p
            style={{
              fontSize: 16,
              color: t.textSoft,
              lineHeight: 1.7,
              marginBottom: 26,
              maxWidth: 460,
            }}
          >
            {description}
          </p>

          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              padding: 0,
              margin: 0,
            }}
          >
            {benefits.map((b, i) => (
              <BenefitRow key={i} icon={CheckCircle2} t={t}>
                {b}
              </BenefitRow>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={140}>{right}</Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────────
const HERO_STATS = [
  { icon: MessageSquare, value: "10+", label: "AI Modes" },
  { icon: Zap, value: "24/7", label: "Automated Workflows" },
  { icon: LayoutTemplate, value: "8+", label: "Ready Templates" },
];

const HERO_FLOATERS = [
  { icon: Video, label: "Meeting summarized", top: "6%", left: "-6%" },
  { icon: Zap, label: "Workflow triggered", top: "62%", left: "-9%" },
  { icon: PenLine, label: "Draft generated", top: "18%", right: "-8%" },
];

function Hero({ t, theme, scrollTo }) {
  const [ref, visible] = useReveal(0.05);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        padding: "72px 24px 96px",
        background: t.pageBg,
        overflow: "hidden",
      }}
    >
      {/* subtle animated background wash */}
      <div
        aria-hidden
        className="ac-hero-bg"
        style={{
          position: "absolute",
          inset: 0,
          background:
            theme === "dark"
              ? "radial-gradient(60% 50% at 80% 0%, rgba(251,146,60,0.10), transparent), radial-gradient(50% 40% at 0% 20%, rgba(56,189,248,0.06), transparent)"
              : "radial-gradient(60% 50% at 80% 0%, rgba(249,115,22,0.09), transparent), radial-gradient(50% 40% at 0% 20%, rgba(59,130,246,0.05), transparent)",
          pointerEvents: "none",
        }}
      />

      <div
        ref={ref}
        style={{
          position: "relative",
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0,0.95fr) minmax(0,1.05fr)",
          gap: 56,
          alignItems: "center",
        }}
        className="ac-feature-grid"
      >
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <Eyebrow icon={Sparkles} label="AI Companion" t={t} />

          <h1
            style={{
              fontSize: "clamp(34px, 4.4vw, 54px)",
              fontWeight: 700,
              lineHeight: 1.12,
              color: t.text,
              marginBottom: 20,
              fontFamily: "'Plus Jakarta Sans', 'Poppins', sans-serif",
            }}
          >
            Your intelligent
            <br />
            <span style={{ color: t.orange }}>workspace companion</span>
          </h1>

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              color: t.textSoft,
              marginBottom: 32,
              maxWidth: 480,
            }}
          >
            Chat, write, run meetings, capture notes, and automate your
            workflows — all in one AI-powered panel built right into ILM
            ORA. Every feature you're about to see is real and ready to use.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 40 }}>
            <button
              onClick={() => scrollTo("chat")}
              className="ac-btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: "none",
                cursor: "pointer",
                background: t.orange,
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                padding: "13px 24px",
                borderRadius: 999,
                boxShadow: "0 12px 24px -10px rgba(249,115,22,0.55)",
              }}
            >
              Explore AI Companion
              <ArrowRight size={17} />
            </button>
            <button
              onClick={() => scrollTo("workflows")}
              className="ac-btn-secondary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                background: "transparent",
                color: t.text,
                fontWeight: 600,
                fontSize: 15,
                padding: "13px 22px",
                borderRadius: 999,
                border: `1.5px solid ${t.text}`,
              }}
            >
              <PlayCircle size={17} />
              See How It Works
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
            {HERO_STATS.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: t.orangeSoft,
                    color: t.orange,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <s.icon size={17} />
                </span>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: t.text, lineHeight: 1.1 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12.5, color: t.textFaint }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right: product preview */}
        <div
          className="ac-hero-preview"
          style={{
            position: "relative",
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0.94)",
            transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s",
          }}
        >
          {HERO_FLOATERS.map((f, i) => (
            <div
              key={i}
              className="ac-floater"
              style={{
                position: "absolute",
                top: f.top,
                left: f.left,
                right: f.right,
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
                boxShadow: t.shadow,
                borderRadius: 14,
                padding: "10px 14px",
                fontSize: 12.5,
                fontWeight: 600,
                color: t.text,
                zIndex: 3,
                animation: `ac-float 5s ease-in-out ${i * 0.6}s infinite`,
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  background: t.orangeSoft,
                  color: t.orange,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <f.icon size={13} />
              </span>
              {f.label}
            </div>
          ))}

          <MockFrame t={t} theme={theme} pad={0}>
            <div
              style={{
                background: theme === "dark" ? "#0d1117" : "#f8fafc",
                display: "flex",
              }}
            >
              {/* mini sidebar strip */}
              <div
                style={{
                  width: 64,
                  padding: "18px 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  borderRight: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.07)" : "#e5e7eb"}`,
                }}
              >
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: "linear-gradient(135deg,#2563eb,#60a5fa)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Bot size={16} color="#fff" />
                </span>
                {[MessageSquare, PenLine, Video, Zap, FileText].map((I, i) => (
                  <span
                    key={i}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 9,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: i === 0 ? "rgba(37,99,235,0.15)" : "transparent",
                      color: i === 0 ? "#2563eb" : theme === "dark" ? "rgba(255,255,255,0.4)" : "#6b7280",
                    }}
                  >
                    <I size={15} />
                  </span>
                ))}
              </div>

              {/* chat preview */}
              <div style={{ flex: 1, padding: "22px 22px 24px", minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: theme === "dark" ? "#f9fafb" : "#111827", marginBottom: 16 }}>
                  AI Companion Chat
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                  <div
                    style={{
                      maxWidth: "78%",
                      background: "linear-gradient(135deg,#2563eb,#3b82f6)",
                      color: "#fff",
                      borderRadius: "14px 14px 3px 14px",
                      padding: "10px 14px",
                      fontSize: 12.5,
                    }}
                  >
                    Summarize today's mentor session and list action items.
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#2563eb,#60a5fa)",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Bot size={13} color="#fff" />
                  </span>
                  <div
                    style={{
                      background: theme === "dark" ? "#1f2937" : "#fff",
                      border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.07)" : "#e5e7eb"}`,
                      borderRadius: "14px 14px 14px 3px",
                      padding: "10px 14px",
                      fontSize: 12.5,
                      color: theme === "dark" ? "#e5e7eb" : "#374151",
                      maxWidth: "82%",
                      lineHeight: 1.6,
                    }}
                  >
                    Here's the summary — 3 action items assigned, 92% quiz
                    average discussed, next session set for Friday.
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "#e5e7eb"}`,
                    borderRadius: 12,
                    padding: "8px 10px",
                    background: theme === "dark" ? "#0d1117" : "#fff",
                  }}
                >
                  <Plus size={14} color={theme === "dark" ? "#94a3b8" : "#9ca3af"} />
                  <span style={{ fontSize: 12, color: theme === "dark" ? "#64748b" : "#9ca3af", flex: 1 }}>
                    Ask AI Companion anything…
                  </span>
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      background: "#2563eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Send size={12} color="#fff" />
                  </span>
                </div>
              </div>
            </div>
          </MockFrame>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Section 02 — AI Chat Panel (mock thread + live AiSourceDropdown)
// ─────────────────────────────────────────────────────────────────────────
function ChatPanelPreview({ t, theme }) {
  const [sending, setSending] = useState(false);

  const send = () => {
    setSending(true);
    setTimeout(() => setSending(false), 1400);
  };

  const panelBg = theme === "dark" ? "#0d1117" : "#f8fafc";
  const bubbleBg = theme === "dark" ? "#1f2937" : "#fff";
  const bubbleBorder = theme === "dark" ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const textPrimary = theme === "dark" ? "#f9fafb" : "#111827";
  const textSecondary = theme === "dark" ? "rgba(255,255,255,0.5)" : "#6b7280";

  return (
    <MockFrame t={t} theme={theme} pad={0}>
      <div style={{ background: panelBg, padding: "20px 20px 18px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: "linear-gradient(135deg,#2563eb,#60a5fa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bot size={15} color="#fff" />
            </span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary }}>
                AI Companion
              </div>
              <div style={{ fontSize: 11, color: textSecondary }}>
                Chat · Live Session
              </div>
            </div>
          </div>
          <AiSourceDropdown isDark={theme === "dark"} onChange={() => {}} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div
              style={{
                maxWidth: "80%",
                background: "linear-gradient(135deg,#2563eb,#3b82f6)",
                color: "#fff",
                borderRadius: "14px 14px 3px 14px",
                padding: "10px 14px",
                fontSize: 13,
              }}
            >
              Give me the top 5 things from this week's classes.
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#2563eb,#60a5fa)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 2,
              }}
            >
              <Bot size={13} color="#fff" />
            </span>
            <div
              style={{
                background: bubbleBg,
                border: `1px solid ${bubbleBorder}`,
                borderRadius: "14px 14px 14px 3px",
                padding: "12px 14px",
                fontSize: 13,
                color: theme === "dark" ? "#e5e7eb" : "#374151",
                maxWidth: "84%",
                lineHeight: 1.7,
              }}
            >
              {sending ? (
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: textSecondary }}>
                  <Sparkles size={13} className="ac-spin-slow" /> Thinking…
                </span>
              ) : (
                <>
                  1. Live class attendance up 12% · 2. Quiz average 92/100 ·
                  3. Two doubts flagged in DSA · 4. Assignment due Friday ·
                  5. Certificate earned by 8 learners.
                </>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: `1px solid ${bubbleBorder}`,
            borderRadius: 12,
            padding: "9px 10px",
            background: theme === "dark" ? "#0d1117" : "#fff",
          }}
        >
          <Plus size={14} color={textSecondary} />
          <span style={{ fontSize: 12.5, color: textSecondary, flex: 1 }}>
            Ask AI Companion anything…
          </span>
          <button
            onClick={send}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Send size={13} color="#fff" />
          </button>
        </div>
      </div>
    </MockFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Section 03 — AI Help Me Write
// ─────────────────────────────────────────────────────────────────────────
const WRITE_DOC_TYPES = ["Announcement", "Email", "Lesson Plan", "Feedback"];

function HelpMeWritePreview({ t, theme }) {
  const [docType, setDocType] = useState(WRITE_DOC_TYPES[0]);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const bg = theme === "dark" ? "#111827" : "#ffffff";
  const border = theme === "dark" ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const textPrimary = theme === "dark" ? "#f9fafb" : "#111827";
  const textSecondary = theme === "dark" ? "rgba(255,255,255,0.45)" : "#6b7280";

  const regenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 1200);
  };

  return (
    <MockFrame t={t} theme={theme} pad={0}>
      <div style={{ background: bg, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: "rgba(37,99,235,0.12)",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PenLine size={15} />
          </span>
          <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary }}>
            Help Me Write
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {WRITE_DOC_TYPES.map((d) => (
            <button
              key={d}
              onClick={() => setDocType(d)}
              style={{
                border: `1px solid ${d === docType ? "#2563eb" : border}`,
                background: d === docType ? "rgba(37,99,235,0.1)" : "transparent",
                color: d === docType ? "#2563eb" : textSecondary,
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: 999,
                cursor: "pointer",
              }}
            >
              {d}
            </button>
          ))}
        </div>

        <div
          style={{
            border: `1px solid ${border}`,
            borderRadius: 12,
            padding: 14,
            background: theme === "dark" ? "#1f2937" : "#f9fafb",
            fontSize: 12.5,
            lineHeight: 1.7,
            color: theme === "dark" ? "#e5e7eb" : "#374151",
            minHeight: 96,
            marginBottom: 14,
          }}
        >
          {generating ? (
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: textSecondary }}>
              <RefreshCw size={13} className="ac-spin" /> Drafting your {docType.toLowerCase()}…
            </span>
          ) : (
            <>
              Subject: {docType} — Upcoming Session Update
              <br />
              <br />
              Hi everyone, quick heads up — our next live session moves to
              Friday 6 PM. Please review the pre-read before joining. Reach
              out with any questions!
            </>
          )}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={regenerate}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: "none",
              cursor: "pointer",
              background: "#2563eb",
              color: "#fff",
              fontSize: 12.5,
              fontWeight: 600,
              padding: "8px 14px",
              borderRadius: 9,
            }}
          >
            <Wand2 size={13} /> Regenerate
          </button>
          <button
            onClick={() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: `1px solid ${border}`,
              cursor: "pointer",
              background: "transparent",
              color: textSecondary,
              fontSize: 12.5,
              fontWeight: 600,
              padding: "8px 14px",
              borderRadius: 9,
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </MockFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Section 04 — AI Meetings
// ─────────────────────────────────────────────────────────────────────────
const MEETING_ROWS = [
  { title: "Mentor Sync — DSA Batch 4", time: "Live now", state: "live" },
  { title: "Weekly Standup — Trainers", time: "3:00 PM", state: "upcoming" },
  { title: "Career Guidance Q&A", time: "Tomorrow, 11:00 AM", state: "upcoming" },
];

function MeetingsPreview({ t, theme }) {
  const bg = theme === "dark" ? "#111827" : "#ffffff";
  const border = theme === "dark" ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const textPrimary = theme === "dark" ? "#f9fafb" : "#111827";
  const textSecondary = theme === "dark" ? "rgba(255,255,255,0.45)" : "#6b7280";

  return (
    <MockFrame t={t} theme={theme} pad={0}>
      <div style={{ background: bg, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span
              style={{
                width: 30, height: 30, borderRadius: 9,
                background: "rgba(37,99,235,0.12)", color: "#2563eb",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Video size={15} />
            </span>
            <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary }}>Meetings</div>
          </div>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: textSecondary }}>
            <CalendarDays size={13} /> This week
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MEETING_ROWS.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                border: `1px solid ${border}`, borderRadius: 12, padding: "12px 14px",
                background: m.state === "live" ? "rgba(37,99,235,0.06)" : "transparent",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <span
                  style={{
                    width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                    background: m.state === "live" ? "#2563eb" : (theme === "dark" ? "#1f2937" : "#f3f4f6"),
                    color: m.state === "live" ? "#fff" : textSecondary,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {m.state === "live" ? <Mic size={14} /> : <Users size={14} />}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: 11, color: textSecondary, display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={10} /> {m.time}
                  </div>
                </div>
              </div>
              {m.state === "live" ? (
                <span
                  style={{
                    fontSize: 11, fontWeight: 700, color: "#2563eb",
                    display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
                  }}
                >
                  <span className="ac-live-dot" /> LIVE
                </span>
              ) : (
                <ExternalLinkIcon textSecondary={textSecondary} />
              )}
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}
function ExternalLinkIcon({ textSecondary }) {
  return <ChevronRight size={15} color={textSecondary} style={{ flexShrink: 0 }} />;
}

// ─────────────────────────────────────────────────────────────────────────
// Section 05 — AI In-Person Notes
// ─────────────────────────────────────────────────────────────────────────
function InPersonNotesPreview({ t, theme }) {
  const [recording, setRecording] = useState(true);
  const bg = theme === "dark" ? "#111827" : "#ffffff";
  const border = theme === "dark" ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const textPrimary = theme === "dark" ? "#f9fafb" : "#111827";
  const textSecondary = theme === "dark" ? "rgba(255,255,255,0.45)" : "#6b7280";

  return (
    <MockFrame t={t} theme={theme} pad={0}>
      <div style={{ background: bg, padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="ac-notes-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: textPrimary, display: "flex", alignItems: "center", gap: 6 }}>
              <Mic size={13} /> Transcript
            </span>
            <button
              onClick={() => setRecording((r) => !r)}
              style={{
                display: "flex", alignItems: "center", gap: 5, border: "none", cursor: "pointer",
                background: recording ? "#dc2626" : "#2563eb", color: "#fff",
                fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 999,
              }}
            >
              {recording ? <Square size={10} /> : <Mic size={10} />}
              {recording ? "Recording" : "Start"}
            </button>
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: textSecondary, border: `1px solid ${border}`, borderRadius: 10, padding: 12, height: 130, overflow: "hidden" }}>
            <strong style={{ color: textPrimary }}>Mentor:</strong> Let's walk
            through recursion with a quick example…
            <br />
            <strong style={{ color: textPrimary }}>Student:</strong> Can we
            revisit the base case rule again?
            <br />
            <strong style={{ color: textPrimary }}>Mentor:</strong> Sure —
            every recursive call needs a stopping condition…
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: textPrimary, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <FileText size={13} /> AI Notes
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["Base case defined for recursion", "Doubt raised: stopping condition", "Follow-up example assigned"].map((n, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, color: textSecondary, border: `1px solid ${border}`, borderRadius: 10, padding: "8px 10px" }}>
                <MessageSquare size={12} style={{ marginTop: 2, flexShrink: 0, color: "#2563eb" }} />
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Section 06 — AI Workflows (home dashboard)
// ─────────────────────────────────────────────────────────────────────────
const WORKFLOW_STATS = [
  { icon: Zap, label: "Active Workflows", value: "6" },
  { icon: Activity, label: "Runs This Week", value: "128" },
  { icon: BarChart2, label: "Success Rate", value: "98%" },
];
const WORKFLOW_QUICK_ACTIONS = [
  { icon: Bell, label: "Pre-meeting reminder" },
  { icon: CheckSquare, label: "Post-meeting action tracker" },
  { icon: FileText, label: "Daily chat summary" },
];

function WorkflowsHomePreview({ t, theme }) {
  const bg = theme === "dark" ? "#0d1117" : "#f8fafc";
  const border = theme === "dark" ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const textPrimary = theme === "dark" ? "#f9fafb" : "#111827";
  const textSecondary = theme === "dark" ? "rgba(255,255,255,0.45)" : "#6b7280";
  const cardBg = theme === "dark" ? "#111827" : "#fff";

  return (
    <MockFrame t={t} theme={theme} pad={0}>
      <div style={{ background: bg, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary, display: "flex", alignItems: "center", gap: 8 }}>
            <Zap size={15} color="#2563eb" /> AI Workflows
          </div>
          <button
            style={{
              display: "flex", alignItems: "center", gap: 5, border: "none", cursor: "pointer",
              background: "#2563eb", color: "#fff", fontSize: 11.5, fontWeight: 600,
              padding: "6px 12px", borderRadius: 8,
            }}
          >
            <Plus size={12} /> New
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
          {WORKFLOW_STATS.map((s, i) => (
            <div key={i} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: "12px 10px" }}>
              <s.icon size={14} color="#2563eb" />
              <div style={{ fontSize: 17, fontWeight: 700, color: textPrimary, marginTop: 6 }}>{s.value}</div>
              <div style={{ fontSize: 10.5, color: textSecondary }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11.5, fontWeight: 700, color: textSecondary, marginBottom: 8, letterSpacing: "0.04em" }}>
          QUICK START
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {WORKFLOW_QUICK_ACTIONS.map((a, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: cardBg, border: `1px solid ${border}`, borderRadius: 10, padding: "10px 12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(37,99,235,0.1)", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <a.icon size={13} />
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: textPrimary }}>{a.label}</span>
              </div>
              <ChevronRight size={14} color={textSecondary} />
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Section 07 — Workflow Creation (builder canvas)
// ─────────────────────────────────────────────────────────────────────────
const BUILDER_NODES = [
  { icon: Bell, label: "Trigger", sub: "New meeting scheduled", kind: "trigger" },
  { icon: GitBranch, label: "Condition", sub: "If attendees > 5", kind: "step" },
  { icon: Mail, label: "Action", sub: "Send prep email", kind: "step" },
  { icon: Database, label: "Action", sub: "Log to activity feed", kind: "step" },
];

function WorkflowCreatePreview({ t, theme }) {
  const bg = theme === "dark" ? "#111827" : "#ffffff";
  const border = theme === "dark" ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const textPrimary = theme === "dark" ? "#f9fafb" : "#111827";
  const textSecondary = theme === "dark" ? "rgba(255,255,255,0.45)" : "#6b7280";

  return (
    <MockFrame t={t} theme={theme} pad={0}>
      <div style={{ background: bg, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary, display: "flex", alignItems: "center", gap: 8 }}>
            <Layers size={15} color="#2563eb" /> Build Workflow
          </div>
          <button
            style={{
              display: "flex", alignItems: "center", gap: 5, border: "none", cursor: "pointer",
              background: "#059669", color: "#fff", fontSize: 11.5, fontWeight: 600,
              padding: "6px 12px", borderRadius: 8,
            }}
          >
            <Play size={11} /> Test Run
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {BUILDER_NODES.map((n, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  border: `1.5px solid ${n.kind === "trigger" ? "#2563eb" : border}`,
                  background: n.kind === "trigger" ? "rgba(37,99,235,0.06)" : (theme === "dark" ? "#1f2937" : "#f9fafb"),
                  borderRadius: 12, padding: "10px 12px",
                }}
              >
                <span
                  style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: n.kind === "trigger" ? "#2563eb" : (theme === "dark" ? "#374151" : "#e5e7eb"),
                    color: n.kind === "trigger" ? "#fff" : textSecondary,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <n.icon size={13} />
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: n.kind === "trigger" ? "#2563eb" : textSecondary, letterSpacing: "0.04em" }}>
                    {n.label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: textPrimary }}>{n.sub}</div>
                </div>
              </div>
              {i < BUILDER_NODES.length - 1 && (
                <div style={{ width: 2, height: 14, background: border, marginLeft: 24 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Section 08 — Workflow Templates (real, live AiWorkflowTemplates component)
// ─────────────────────────────────────────────────────────────────────────
function WorkflowTemplatesPreview({ t, theme }) {
  return (
    <MockFrame t={t} theme={theme} pad={0} height={420}>
      <div style={{ height: 420, overflow: "hidden" }}>
        <AiWorkflowTemplates
          isDark={theme === "dark"}
          onSelectTemplate={() => {}}
          onBack={() => {}}
        />
      </div>
    </MockFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Section 09 — Template Gallery (real, live AiTemplateGalleryModal on demand)
// ─────────────────────────────────────────────────────────────────────────
const GALLERY_PEEK = [
  { name: "Email Template", category: "Communication" },
  { name: "Lesson Plan", category: "Education" },
  { name: "Blog Post", category: "Content" },
  { name: "Project Proposal", category: "Business" },
];

function TemplateGalleryPreview({ t, theme }) {
  const [open, setOpen] = useState(false);
  const bg = theme === "dark" ? "#111827" : "#ffffff";
  const border = theme === "dark" ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const textPrimary = theme === "dark" ? "#f9fafb" : "#111827";
  const textSecondary = theme === "dark" ? "rgba(255,255,255,0.45)" : "#6b7280";

  return (
    <>
      <MockFrame t={t} theme={theme} pad={0}>
        <div style={{ background: bg, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary, display: "flex", alignItems: "center", gap: 8 }}>
              <LayoutTemplate size={15} color="#2563eb" /> Template Gallery
            </div>
            <button
              onClick={() => setOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: 6, border: "none", cursor: "pointer",
                background: "#2563eb", color: "#fff", fontSize: 11.5, fontWeight: 600,
                padding: "7px 13px", borderRadius: 8,
              }}
            >
              <Sparkles size={12} /> Open Gallery
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {GALLERY_PEEK.map((g, i) => (
              <div
                key={i}
                onClick={() => setOpen(true)}
                style={{
                  border: `1px solid ${border}`, borderRadius: 12, padding: 12, cursor: "pointer",
                  background: theme === "dark" ? "#1f2937" : "#f9fafb",
                }}
              >
                <FileText size={15} color="#2563eb" />
                <div style={{ fontSize: 12, fontWeight: 600, color: textPrimary, marginTop: 8 }}>{g.name}</div>
                <div style={{ fontSize: 10.5, color: textSecondary }}>{g.category}</div>
              </div>
            ))}
          </div>
        </div>
      </MockFrame>

      {open && (
        <AiTemplateGalleryModal
          isDark={theme === "dark"}
          onClose={() => setOpen(false)}
          onSelectTemplate={() => setOpen(false)}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Section 10 — AI Context / Resources (real, live AiContextResourceModal)
// ─────────────────────────────────────────────────────────────────────────
function ContextResourcePreview({ t, theme }) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(null);
  const bg = theme === "dark" ? "#111827" : "#ffffff";
  const border = theme === "dark" ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const textPrimary = theme === "dark" ? "#f9fafb" : "#111827";
  const textSecondary = theme === "dark" ? "rgba(255,255,255,0.45)" : "#6b7280";

  return (
    <>
      <MockFrame t={t} theme={theme} pad={0}>
        <div style={{ background: bg, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
            <span style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(37,99,235,0.12)", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Hash size={15} />
            </span>
            <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary }}>Context & Resources</div>
          </div>

          <div style={{ border: `1px dashed ${border}`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: textSecondary, lineHeight: 1.7 }}>
              {saved?.additionalContext ||
                "Add extra context so AI Companion tailors every answer to your batch, syllabus, or team."}
            </div>
            {saved?.resourceIds?.length ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {saved.resourceIds.map((r, i) => (
                  <span key={i} style={{ fontSize: 10.5, fontWeight: 600, color: "#2563eb", background: "rgba(37,99,235,0.1)", padding: "3px 8px", borderRadius: 999 }}>
                    #{r}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <button
            onClick={() => setOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: 7, border: "none", cursor: "pointer",
              background: "#2563eb", color: "#fff", fontSize: 12.5, fontWeight: 600,
              padding: "9px 15px", borderRadius: 9,
            }}
          >
            <Plus size={13} /> Add Context & Resources
          </button>
        </div>
      </MockFrame>

      {open && (
        <AiContextResourceModal
          isDark={theme === "dark"}
          onClose={() => setOpen(false)}
          onSave={(data) => setSaved(data)}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Section 11 — AI Modes (real, live AiModeCards with tab switcher)
// ─────────────────────────────────────────────────────────────────────────
const MODE_TABS = [
  { id: "suggested", label: "Suggested", icon: Sparkles },
  { id: "meeting", label: "Meeting", icon: Video },
  { id: "coaching", label: "Coaching", icon: Award },
];

function ModesPreview({ t, theme }) {
  const [tab, setTab] = useState("suggested");
  const bg = theme === "dark" ? "#0d1117" : "#f8fafc";
  const border = theme === "dark" ? "rgba(255,255,255,0.07)" : "#e5e7eb";

  return (
    <MockFrame t={t} theme={theme} pad={0} height={420}>
      <div style={{ background: bg, padding: "16px 16px 0", height: 420, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 4, flexShrink: 0 }}>
          {MODE_TABS.map((m) => (
            <button
              key={m.id}
              onClick={() => setTab(m.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
                border: `1px solid ${tab === m.id ? "#2563eb" : border}`,
                background: tab === m.id ? "rgba(37,99,235,0.1)" : "transparent",
                color: tab === m.id ? "#2563eb" : (theme === "dark" ? "rgba(255,255,255,0.5)" : "#6b7280"),
                fontSize: 11.5, fontWeight: 600, padding: "7px 12px", borderRadius: 999,
              }}
            >
              <m.icon size={12} /> {m.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <AiModeCards isDark={theme === "dark"} activeTab={tab} onSelectMode={() => {}} />
        </div>
      </div>
    </MockFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Section 12 — AI Activity Logs
// ─────────────────────────────────────────────────────────────────────────
const ACTIVITY_ROWS = [
  { icon: CheckCircle2, label: "Post-Meeting Action Tracker ran", time: "2 min ago", state: "ok" },
  { icon: Loader, label: "Daily Chat Summary running…", time: "Just now", state: "running" },
  { icon: CheckCircle2, label: "Pre-meeting reminder sent", time: "18 min ago", state: "ok" },
  { icon: XCircle, label: "Zoom status alert failed — retrying", time: "1 hr ago", state: "error" },
];

function ActivityLogsPreview({ t, theme }) {
  const bg = theme === "dark" ? "#111827" : "#ffffff";
  const border = theme === "dark" ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const textPrimary = theme === "dark" ? "#f9fafb" : "#111827";
  const textSecondary = theme === "dark" ? "rgba(255,255,255,0.45)" : "#6b7280";
  const colorFor = { ok: "#059669", running: "#2563eb", error: "#dc2626" };

  return (
    <MockFrame t={t} theme={theme} pad={0}>
      <div style={{ background: bg, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary, display: "flex", alignItems: "center", gap: 8 }}>
            <Activity size={15} color="#2563eb" /> Activity Logs
          </div>
          <RefreshCw size={13} color={textSecondary} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {ACTIVITY_ROWS.map((a, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                borderBottom: i < ACTIVITY_ROWS.length - 1 ? `1px solid ${border}` : "none",
              }}
            >
              <a.icon
                size={15}
                color={colorFor[a.state]}
                className={a.state === "running" ? "ac-spin" : ""}
              />
              <span style={{ fontSize: 12.5, color: textPrimary, flex: 1 }}>{a.label}</span>
              <span style={{ fontSize: 11, color: textSecondary, display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <Clock size={10} /> {a.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Section 13 — AI Companion Sidebar (real, live AiCompanionSidebar)
// ─────────────────────────────────────────────────────────────────────────
const SAMPLE_CONVERSATIONS = [
  { id: "c1", title: "Weekly progress summary" },
  { id: "c2", title: "Doubt: recursion base case" },
  { id: "c3", title: "Draft — parent update email" },
];

function SidebarPreview({ t, theme }) {
  const [activeView, setActiveView] = useState("home");

  return (
    <MockFrame t={t} theme={theme} pad={0} height={420}>
      <div style={{ height: 420, display: "flex" }}>
        <AiCompanionSidebar
          isDark={theme === "dark"}
          activeView={activeView}
          onNavigate={setActiveView}
          onNewChat={() => setActiveView("home")}
          conversations={SAMPLE_CONVERSATIONS}
          conversationsLoading={false}
          onSelectConversation={() => {}}
          onDeleteConversation={() => {}}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme === "dark" ? "rgba(255,255,255,0.3)" : "#cbd5e1",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Select a feature from the sidebar →
        </div>
      </div>
    </MockFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Final CTA
// ─────────────────────────────────────────────────────────────────────────
function FinalCta({ t, theme }) {
  const [ref, visible] = useReveal(0.25);
  return (
    <section
      id="cta"
      style={{
        scrollMarginTop: 92,
        padding: "96px 24px",
        background: t.navBg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(50% 60% at 50% 0%, rgba(249,115,22,0.16), transparent)",
          pointerEvents: "none",
        }}
      />
      <div
        ref={ref}
        style={{
          position: "relative",
          maxWidth: 760,
          margin: "0 auto",
          textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <Eyebrow icon={Sparkles} label="Ready when you are" t={{ ...t, orangeSoft: "rgba(249,115,22,0.14)", orange: "#FB923C" }} />
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.2,
            marginBottom: 18,
            fontFamily: "'Plus Jakarta Sans', 'Poppins', sans-serif",
          }}
        >
          Work smarter with AI Companion.
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 36, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
          Chat, write, meet, and automate — everything you just saw is
          already built into your ILM ORA workspace.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Global styles — keyframes + responsive rules (scoped, injected once)
// ─────────────────────────────────────────────────────────────────────────
function GlobalStyle() {
  return (
    <style>{`
      @keyframes ac-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-9px); }
      }
      @keyframes ac-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.35; }
      }
      @keyframes ac-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .ac-spin { animation: ac-spin 1.1s linear infinite; }
      .ac-spin-slow { animation: ac-spin 2.2s linear infinite; }
      .ac-live-dot {
        width: 7px; height: 7px; border-radius: 50%;
        background: #2563eb; display: inline-block;
        animation: ac-pulse 1.4s ease-in-out infinite;
      }

      @media (max-width: 1400px) {
        .ac-hero-preview .ac-floater { display: none; }
      }

      @media (max-width: 980px) {
        .ac-feature-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
      }

      @media (max-width: 640px) {
        .ac-notes-grid { grid-template-columns: 1fr !important; }
        .ac-btn-primary, .ac-btn-secondary { width: 100%; justify-content: center; }
      }

      @media (prefers-reduced-motion: reduce) {
        .ac-live-dot, .ac-spin, .ac-spin-slow, .ac-floater { animation: none !important; }
      }
    `}</style>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Feature section definitions — order matches the product tour
// ─────────────────────────────────────────────────────────────────────────
function buildFeatureSections(t, theme) {
  return [
    {
      id: "chat",
      icon: MessageSquare,
      title: "AI Chat Panel",
      description:
        "A focused chat surface that understands your session context — ask questions, pull summaries, and get answers sourced from your meetings, docs, and recordings.",
      benefits: [
        "Multi-source context — meetings, chat, whiteboard, recordings, docs",
        "Threaded conversations you can revisit anytime",
        "Streaming responses with copy-to-clipboard in one tap",
      ],
      right: <ChatPanelPreview t={t} theme={theme} />,
    },
    {
      id: "write",
      icon: PenLine,
      title: "AI Help Me Write",
      description:
        "Draft announcements, emails, lesson plans, and feedback in seconds — pick a document type, generate a first pass, and refine until it sounds like you.",
      benefits: [
        "Purpose-built templates for common trainer & admin docs",
        "One-click regenerate when the tone isn't quite right",
        "Copy straight into email, chat, or your LMS post",
      ],
      right: <HelpMeWritePreview t={t} theme={theme} />,
    },
    {
      id: "meetings",
      icon: Video,
      title: "AI Meetings",
      description:
        "See every live and upcoming session in one list, join with a click, and let AI Companion start capturing the moment it begins.",
      benefits: [
        "Live status at a glance — no tab switching",
        "One click from meeting list to transcript capture",
        "Automatic hand-off into In-Person Notes",
      ],
      right: <MeetingsPreview t={t} theme={theme} />,
    },
    {
      id: "notes",
      icon: Mic,
      title: "AI In-Person Notes",
      description:
        "Record the room, not just the call. AI Companion transcribes in-person sessions live and turns the conversation into structured, shareable notes.",
      benefits: [
        "Live transcript with speaker context",
        "Notes generated as the conversation happens",
        "Doubts and follow-ups flagged automatically",
      ],
      right: <InPersonNotesPreview t={t} theme={theme} />,
    },
    {
      id: "workflows",
      icon: Zap,
      title: "AI Workflows",
      description:
        "Your automation home base — see what's running, how it's performing, and jump straight into a ready-made quick start.",
      benefits: [
        "Live health at a glance — runs, success rate, active count",
        "Quick-start actions for the most common automations",
        "One place to manage everything AI Companion automates for you",
      ],
      right: <WorkflowsHomePreview t={t} theme={theme} />,
    },
    {
      id: "workflow-create",
      icon: Layers,
      title: "Workflow Creation",
      description:
        "Build automations visually — chain a trigger to conditions and actions, then test the run before it ever touches production.",
      benefits: [
        "Drag-simple trigger → condition → action canvas",
        "Test Run before publishing, every time",
        "Reusable across meetings, chat, and workflow templates",
      ],
      right: <WorkflowCreatePreview t={t} theme={theme} />,
    },
    {
      id: "templates",
      icon: LayoutTemplate,
      title: "AI Workflow Templates",
      description:
        "Skip the blank canvas. Browse ready-made automations — from pre-meeting reminders to cross-platform knowledge retrieval — and launch in one click.",
      benefits: [
        "15+ ready-made workflow templates, searchable instantly",
        "Covers meetings, chat, docs, and service alerts",
        "This panel is the real, live AI Workflow Templates component",
      ],
      right: <WorkflowTemplatesPreview t={t} theme={theme} />,
    },
    {
      id: "gallery",
      icon: Sparkles,
      title: "Template Gallery",
      description:
        "A curated library of writing templates — organized by category, previewed instantly, and ready to drop into AI Help Me Write.",
      benefits: [
        "Categorized by Communication, Education, Business & more",
        "Click any card to open the real, live gallery modal",
        "Selecting a template hands off straight into your draft",
      ],
      right: <TemplateGalleryPreview t={t} theme={theme} />,
    },
    {
      id: "context",
      icon: Hash,
      title: "AI Context & Resources",
      description:
        "Tell AI Companion what matters — syllabus notes, team context, or linked resource IDs — so every answer it gives is tailored, not generic.",
      benefits: [
        "Freeform context that shapes every AI response",
        "Attach resource IDs to ground answers in real material",
        "Try it live — open the real Context & Resources panel",
      ],
      right: <ContextResourcePreview t={t} theme={theme} />,
    },
    {
      id: "modes",
      icon: Award,
      title: "AI Modes",
      description:
        "Switch between Suggested, Meeting, and Coaching modes to get purpose-built AI actions — from action items to coaching insights — without hunting for the right prompt.",
      benefits: [
        "Modes tuned for meetings, coaching, and everyday suggestions",
        "One tap from mode card to generated output",
        "This panel is the real, live AI Modes component",
      ],
      right: <ModesPreview t={t} theme={theme} />,
    },
    {
      id: "activity",
      icon: Activity,
      title: "AI Activity Logs",
      description:
        "Full visibility into every automation — what ran, what's running, and what needs a second look — in a clean, live timeline.",
      benefits: [
        "Real-time status for every workflow run",
        "Errors surfaced immediately, not buried in a report",
        "One glance tells you if everything is healthy",
      ],
      right: <ActivityLogsPreview t={t} theme={theme} />,
    },
    {
      id: "sidebar",
      icon: Bot,
      title: "AI Companion Sidebar",
      description:
        "Every feature you just saw lives behind one consistent sidebar — search past conversations, jump between tools, and start fresh in a click.",
      benefits: [
        "Unified navigation across chat, write, meetings & workflows",
        "Searchable conversation history",
        "This panel is the real, live AI Companion Sidebar component",
      ],
      right: <SidebarPreview t={t} theme={theme} />,
    },
  ];
}

export default function AiCompanionLanding({
  theme = "light",
  toggleTheme,
  setShowLoginModal,
}) {
  const t = getT(theme);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const featureSections = buildFeatureSections(t, theme);

  return (
    <PublicLayout
      theme={theme}
      toggleTheme={toggleTheme}
      setShowLoginModal={setShowLoginModal}
      scrollToSection={scrollTo}
    >
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          background: t.pageBg,
          color: t.text,
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <GlobalStyle />

        <Hero t={t} theme={theme} scrollTo={scrollTo} />

        {featureSections.map((s, i) => (
          <FeatureSection
            key={s.id}
            id={s.id}
            index={i + 1}
            icon={s.icon}
            title={s.title}
            description={s.description}
            benefits={s.benefits}
            t={t}
            theme={theme}
            alt={i % 2 === 1}
            right={s.right}
          />
        ))}
                <FinalCta t={t} theme={theme} />
      </div>
    </PublicLayout>
  );
}

