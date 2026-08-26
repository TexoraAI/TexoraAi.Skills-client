import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  GitBranch,
  Box,
  Users,
  Database,
  Network,
  Share2,
  Layout,
  Workflow,
  Cpu,
  Monitor,
  BarChart2,
  MousePointer,
  Hand,
  Pen,
  Pencil,
  Highlighter,
  Eraser,
  ArrowRight,
  ArrowUpRight,
  Type,
  Hash,
  StickyNote,
  MessageSquare,
  Frame,
  Image,
  Square,
  Circle,
  Triangle,
  Diamond,
  Hexagon,
  Star,
  Minus,
  FileText,
  Grid,
  Clock,
  Home,
  Trash2,
  Search,
  Plus,
  Copy,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  RotateCw,
  History,
  Play,
  Presentation,
  Moon,
  Sun,
  Wifi,
  Save,
  Layers,
  Lock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Briefcase,
} from "lucide-react";

// ✅ Same shared shell used by every other public page (Careers, ManagerHub,
// ILM ORA Meet, Resume Builder, About, Pricing, Contact, FAQ, etc). Lives at
// src/pages/Landing/components/PublicLayout. If this file lives somewhere
// other than alongside those pages, adjust this relative path.
import PublicLayout from "../Landing/components/PublicLayout";

/* ────────────────────────────────────────────────────────────────────────
   WHITEBOARD — PRODUCT LANDING PAGE
   Every feature shown below is sourced directly from WhiteboardPanel.jsx:
   tool list, shape categories, DIAGRAM_TYPES, TEMPLATES, sidebar items,
   canvas controls, present mode, dark/light mode and live-sync status.
   ──────────────────────────────────────────────────────────────────────── */

/* ── Design tokens (pulled from the app's own palette) ─────────────────── */
const INK = "#0f172a"; // heading / primary text — same as isDark canvas text color
const SLATE = "#475569"; // body text
const MUTED = "#64748b"; // secondary/meta text
const LINE = "#e2e8f0"; // hairline border
const PAPER = "#ffffff";
const CANVAS_DARK = "#0f172a";
const ORANGE = "#f97316"; // primary accent — Workflow / AWS color in-app
const AMBER = "#f59e0b"; // secondary accent — Mind Map color in-app
const BLUE = "#3b82f6"; // Flowchart
const PURPLE = "#8b5cf6"; // UML Class
const PINK = "#ec4899"; // Sequence Diagram
const INDIGO = "#6366f1"; // Use Case
const CYAN = "#06b6d4"; // ER Diagram
const GREEN = "#10b981"; // Network Diagram
const RED = "#ef4444"; // Org Chart
const LIME = "#84cc16"; // System Design
const VIOLET = "#a855f7"; // DSA Visualization

/* ── Data lifted straight from WhiteboardPanel.jsx ──────────────────────── */
const TOOLS = [
  { id: "select", icon: MousePointer, label: "Select", hint: "V" },
  { id: "hand", icon: Hand, label: "Pan", hint: "H" },
  { id: "pen", icon: Pen, label: "Pen", hint: "P" },
  { id: "pencil", icon: Pencil, label: "Pencil" },
  { id: "highlighter", icon: Highlighter, label: "Highlighter" },
  { id: "eraser", icon: Eraser, label: "Eraser", hint: "E" },
  { id: "arrow", icon: ArrowRight, label: "Arrow" },
  { id: "connector", icon: ArrowUpRight, label: "Connector", hint: "C" },
  { id: "line", icon: Minus, label: "Line" },
];

const CONTENT_TOOLS = [
  { id: "text", icon: Type, label: "Text", hint: "T", desc: "Drop in a text block anywhere and start typing — bold, italic and alignment included." },
  { id: "equation", icon: Hash, label: "Equation", desc: "Write formulas with an inline equation editor for math-heavy lessons." },
  { id: "sticky", icon: StickyNote, label: "Sticky Note", hint: "S", desc: "Classic sticky notes for brainstorms, retros and quick call-outs." },
  { id: "comment", icon: MessageSquare, label: "Comment", desc: "Pin threaded comments to any point on the board." },
  { id: "frame", icon: Frame, label: "Frame", hint: "F", desc: "Group work into named frames — perfect for slides and present mode." },
  { id: "image", icon: Image, label: "Upload Image", desc: "Drop reference images straight onto the canvas." },
];

const SHAPES = [
  { id: "rect", label: "Rectangle", icon: Square },
  { id: "circle", label: "Circle", icon: Circle },
  { id: "triangle", label: "Triangle", icon: Triangle },
  { id: "diamond", label: "Diamond", icon: Diamond },
  { id: "pentagon", label: "Pentagon", icon: Hexagon },
  { id: "hexagon", label: "Hexagon", icon: Hexagon },
  { id: "octagon", label: "Octagon", icon: Hexagon },
  { id: "star", label: "Star", icon: Star },
  { id: "line", label: "Line", icon: Minus },
  { id: "arrow", label: "Arrow", icon: ArrowRight },
];

const DIAGRAM_TYPES = [
  { id: "flowchart", label: "Flowchart", icon: GitBranch, color: BLUE },
  { id: "uml_class", label: "UML Class", icon: Box, color: PURPLE },
  { id: "uml_sequence", label: "Sequence Diagram", icon: Users, color: PINK },
  { id: "uml_usecase", label: "Use Case", icon: Users, color: INDIGO },
  { id: "er", label: "ER Diagram", icon: Database, color: CYAN },
  { id: "network", label: "Network Diagram", icon: Network, color: GREEN },
  { id: "mindmap", label: "Mind Map", icon: Share2, color: AMBER },
  { id: "org", label: "Org Chart", icon: Layout, color: RED },
  { id: "workflow", label: "Workflow", icon: Workflow, color: ORANGE },
  { id: "aws", label: "AWS Architecture", icon: Cpu, color: "#ff9900" },
  { id: "system", label: "System Design", icon: Monitor, color: LIME },
  { id: "dsa", label: "DSA Visualization", icon: BarChart2, color: VIOLET },
];

const TEMPLATES = [
  { id: "flowchart", title: "Flowchart", category: "Education", color: BLUE, icon: GitBranch },
  { id: "mindmap", title: "Mind Map", category: "Brainstorming", color: PURPLE, icon: Share2 },
  { id: "kanban", title: "Kanban Board", category: "Agile", color: GREEN, icon: Layout },
  { id: "wireframe", title: "UI Wireframe", category: "Design", color: AMBER, icon: Box },
  { id: "timeline", title: "Timeline", category: "Project Planning", color: RED, icon: FileText },
  { id: "er", title: "ER Diagram", category: "Education", color: CYAN, icon: Database },
  { id: "uml_class", title: "UML Class", category: "UML", color: INDIGO, icon: Layers },
  { id: "sequence", title: "Sequence Diagram", category: "UML", color: PINK, icon: BarChart2 },
  { id: "network", title: "Network Topology", category: "Architecture", color: LIME, icon: Network },
  { id: "system", title: "System Architecture", category: "Architecture", color: ORANGE, icon: Cpu },
  { id: "dsa_tree", title: "BST / Tree", category: "DSA Teaching", color: VIOLET, icon: GitBranch },
  { id: "dsa_graph", title: "Graph Algorithms", category: "DSA Teaching", color: "#14b8a6", icon: Workflow },
  { id: "blank", title: "Blank Canvas", category: "All", color: MUTED, icon: FileText },
  { id: "retro", title: "Retrospective", category: "Agile", color: "#f43f5e", icon: RotateCcw },
  { id: "presentation", title: "Presentation", category: "Presentation", color: "#0ea5e9", icon: Monitor },
];

const SIDEBAR_ITEMS = [
  { label: "All Whiteboards", icon: Grid },
  { label: "Recent", icon: Clock },
  { label: "My Whiteboards", icon: Home },
  { label: "Shared With Me", icon: Users },
  { label: "Starred", icon: Star },
  { label: "Trash", icon: Trash2 },
];

const BOARD_ACTIONS = [
  { label: "Rename", icon: Type },
  { label: "Duplicate", icon: Copy },
  { label: "Export", icon: Download },
  { label: "Star", icon: Star },
  { label: "Move to Trash", icon: Trash2 },
];

const CANVAS_CONTROLS = [
  { label: "Zoom In", icon: ZoomIn },
  { label: "Zoom Out", icon: ZoomOut },
  { label: "Fullscreen", icon: Maximize2 },
  { label: "Undo", icon: RotateCcw },
  { label: "Redo", icon: RotateCw },
  { label: "History", icon: History },
  { label: "Pages", icon: Layers },
  { label: "Present", icon: Presentation },
  { label: "Auto-save", icon: Save },
];

/* ── Scroll-reveal helper (IntersectionObserver, no extra deps) ─────────── */
function Reveal({ children, className = "", style = {}, delay = 0, as: Tag = "div" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`wb-reveal ${shown ? "wb-shown" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

/* ── Small reusable bits ─────────────────────────────────────────────────── */
function Eyebrow({ children }) {
  return <div className="wb-eyebrow">{children}</div>;
}

function SectionHead({ eyebrow, title, accent, sub, center }) {
  return (
    <div className={`wb-section-head ${center ? "wb-center" : ""}`}>
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={60}>
        <h2 className="wb-h2">
          {title} {accent && <span className="wb-accent">{accent}</span>}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={120}>
          <p className="wb-sub">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

/* Live-sync status pill — mirrors the "connected" badge in WhiteboardPanel.jsx */
function LiveBadge({ label = "LIVE SYNC" }) {
  return (
    <span className="wb-live-badge">
      <span className="wb-live-dot" />
      {label}
    </span>
  );
}


/* ── Nav ─────────────────────────────────────────────────────────────────── */
function Nav({ onStart, onLoginClick }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`wb-nav ${scrolled ? "wb-nav-scrolled" : ""}`}>
      <div className="wb-nav-inner">
        <div className="wb-logo">
          <span className="wb-logo-mark">
            <Pen size={16} strokeWidth={2.4} />
          </span>
          Whiteboard
        </div>
        <nav className="wb-nav-links">
          <a href="#drawing">Draw</a>
          <a href="#diagramming">Diagrams</a>
          <a href="#templates">Templates</a>
          <a href="#collaboration">Collaborate</a>
        </nav>
        <div className="wb-nav-actions">
          <button className="wb-btn wb-btn-login wb-btn-sm" onClick={onLoginClick}>
            Log in
          </button>
          <button className="wb-btn wb-btn-primary wb-btn-sm" onClick={onStart}>
            Start Whiteboarding
          </button>
        </div>
      </div>
    </header>
  );
}

/* ── Hero canvas mock: pen drawing a tiny flow, live ────────────────────── */
function HeroCanvas() {
  return (
    <div className="wb-hero-canvas">
      <div className="wb-hero-canvas-topbar">
        <div className="wb-hero-canvas-title">
          <FileText size={13} />
          Untitled Whiteboard
        </div>
        <div className="wb-hero-canvas-status">
          <LiveBadge />
          <span className="wb-saved-pill">
            <Save size={11} /> Auto-saved
          </span>
        </div>
      </div>

      <div className="wb-hero-canvas-body">
        <div className="wb-hero-toolbar">
          {TOOLS.slice(0, 7).map((t, i) => (
            <div
              key={t.id}
              className={`wb-hero-tool ${i === 2 ? "wb-hero-tool-active" : ""}`}
              style={{ animationDelay: `${i * 0.12 + 0.4}s` }}
            >
              <t.icon size={15} strokeWidth={2} />
            </div>
          ))}
        </div>

        <svg viewBox="0 0 520 300" className="wb-hero-svg" aria-hidden="true">
          <defs>
            <pattern id="wbDots" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="1.2" cy="1.2" r="1.2" fill="rgba(15,23,42,0.08)" />
            </pattern>
          </defs>
          <rect width="520" height="300" fill="url(#wbDots)" />

          {/* Start */}
          <rect x="34" y="34" width="118" height="42" rx="21" className="wb-draw-fill wb-fill-blue" style={{ animationDelay: "0.5s" }} />
          <rect x="34" y="34" width="118" height="42" rx="21" className="wb-draw-line wb-stroke-blue" pathLength="1" style={{ animationDelay: "0.5s" }} />
          <text x="93" y="60" textAnchor="middle" className="wb-svg-label wb-fade" style={{ animationDelay: "1s" }}>Start</text>

          {/* connector 1 */}
          <path d="M93 76 L93 108" className="wb-draw-line wb-stroke-muted" pathLength="1" style={{ animationDelay: "1.1s" }} />

          {/* Process */}
          <rect x="34" y="110" width="118" height="42" rx="6" className="wb-draw-fill wb-fill-orange" style={{ animationDelay: "1.3s" }} />
          <rect x="34" y="110" width="118" height="42" rx="6" className="wb-draw-line wb-stroke-orange" pathLength="1" style={{ animationDelay: "1.3s" }} />
          <text x="93" y="136" textAnchor="middle" className="wb-svg-label wb-fade" style={{ animationDelay: "1.8s" }}>Process</text>

          {/* connector 2 */}
          <path d="M93 152 L93 184" className="wb-draw-line wb-stroke-muted" pathLength="1" style={{ animationDelay: "1.9s" }} />

          {/* Decision (diamond) */}
          <polygon points="93,186 152,214 93,242 34,214" className="wb-draw-fill wb-fill-green" style={{ animationDelay: "2.1s" }} />
          <polygon points="93,186 152,214 93,242 34,214" className="wb-draw-line wb-stroke-green" pathLength="1" style={{ animationDelay: "2.1s" }} />
          <text x="93" y="219" textAnchor="middle" className="wb-svg-label wb-fade" style={{ animationDelay: "2.6s" }}>Decision?</text>

          {/* branch to sticky */}
          <path d="M152 214 L290 214" className="wb-draw-line wb-stroke-muted" pathLength="1" style={{ animationDelay: "2.8s" }} />
          <text x="220" y="206" textAnchor="middle" className="wb-svg-label-sm wb-fade" style={{ animationDelay: "3.2s" }}>Yes</text>

          {/* sticky note */}
          <g className="wb-fade" style={{ animationDelay: "3s" }}>
            <rect x="292" y="182" width="96" height="64" rx="4" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" transform="rotate(-3 340 214)" />
            <text x="340" y="210" textAnchor="middle" className="wb-svg-label-sm" transform="rotate(-3 340 214)" fill="#78350f">Ship it 🚀</text>
          </g>

          {/* freehand pen squiggle, drawn last */}
          <path
            d="M300 90 C 330 40, 380 130, 420 70 S 470 40, 486 66"
            className="wb-draw-line wb-stroke-purple wb-pen-path"
            pathLength="1"
            style={{ animationDelay: "3.4s" }}
          />

          {/* moving pen tip */}
          <g className="wb-pen-tip" style={{ animationDelay: "3.4s" }}>
            <circle r="4.5" fill={PURPLE} />
          </g>
        </svg>

        <div className="wb-hero-cursor" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M4 20L6.5 14.5L16.8 4.2C17.6 3.4 18.9 3.4 19.7 4.2C20.5 5 20.5 6.3 19.7 7.1L9.4 17.4L4 20Z" fill="#fff" stroke="#111827" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          <span className="wb-hero-cursor-name">You</span>
        </div>
      </div>
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
function Hero({ onStart, onExplore }) {
  return (
    <section className="wb-hero">
      <div className="wb-hero-glow" aria-hidden="true" />
      <div className="wb-hero-inner">
        <div className="wb-hero-copy">
          <Reveal>
            <div className="wb-eyebrow wb-eyebrow-light">
              <Sparkles size={13} /> Real-time visual workspace
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="wb-h1">Whiteboard</h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="wb-hero-tag">
              Think. Draw. Collaborate. <span className="wb-accent">Build ideas visually.</span>
            </p>
          </Reveal>
          <Reveal delay={240}>
            <p className="wb-hero-sub">
              One canvas for freehand sketches, structured diagrams, sticky-note brainstorms
              and live teaching sessions — with every change synced the instant you make it.
            </p>
          </Reveal>
          <Reveal delay={320}>
            <div className="wb-hero-ctas">
              <button className="wb-btn wb-btn-primary wb-btn-lg" onClick={onStart}>
                Start Whiteboarding <ArrowRight size={17} />
              </button>
              <button className="wb-btn wb-btn-ghost wb-btn-lg" onClick={onExplore}>
                Explore Features
              </button>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div className="wb-hero-stats">
              <div><strong>12+</strong><span>Diagram types</span></div>
              <div><strong>15</strong><span>Ready templates</span></div>
              <div><strong>Live</strong><span>Multi-user sync</span></div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="wb-hero-visual">
          <HeroCanvas />
        </Reveal>
      </div>
    </section>
  );
}

/* ── 2. Drawing & Editing ───────────────────────────────────────────────── */
function ToolDemo({ tool }) {
  const demos = {
    select: (
      <g>
        <rect x="40" y="30" width="60" height="40" rx="4" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" className="wb-marquee" />
        <rect x="20" y="15" width="14" height="14" rx="2" fill={BLUE} className="wb-fade" style={{ animationDelay: "0.4s" }} />
      </g>
    ),
    hand: (
      <g className="wb-pan-group">
        <circle cx="60" cy="45" r="26" fill="none" stroke="#94a3b8" strokeDasharray="3 4" />
        <Hand x="46" y="31" size={28} color={MUTED} />
      </g>
    ),
    pen: (
      <path d="M15 65 C 30 20, 55 75, 75 30 S 105 20, 115 40" className="wb-draw-line wb-stroke-orange" pathLength="1" fill="none" strokeWidth="3" strokeLinecap="round" />
    ),
    pencil: (
      <path d="M15 55 Q 40 20 65 50 T 115 45" className="wb-draw-line wb-stroke-slate" pathLength="1" fill="none" strokeWidth="2" strokeDasharray="0.5 3" strokeLinecap="round" />
    ),
    highlighter: (
      <g>
        <text x="14" y="50" className="wb-svg-label" fontSize="15" fill={INK}>Key Idea</text>
        <rect x="10" y="38" width="0" height="18" fill="#fde047" opacity="0.55" className="wb-highlight-sweep" />
      </g>
    ),
    eraser: (
      <g>
        <path d="M15 55 C 30 20, 55 75, 75 30" fill="none" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
        <rect x="70" y="35" width="30" height="30" rx="3" fill="#f1f5f9" stroke="#94a3b8" className="wb-eraser-move" />
      </g>
    ),
    arrow: (
      <g>
        <path d="M15 60 L 95 30" className="wb-draw-line wb-stroke-blue" pathLength="1" fill="none" strokeWidth="2.5" markerEnd="url(#wbArrowHead)" />
      </g>
    ),
    connector: (
      <g>
        <rect x="10" y="15" width="30" height="24" rx="4" fill={`${GREEN}22`} stroke={GREEN} />
        <rect x="85" y="55" width="30" height="24" rx="4" fill={`${PURPLE}22`} stroke={PURPLE} />
        <path d="M40 27 C 70 27, 60 67, 85 67" className="wb-draw-line wb-stroke-muted" pathLength="1" fill="none" strokeWidth="2" markerEnd="url(#wbArrowHead)" />
      </g>
    ),
    line: (
      <path d="M15 70 L 115 20" className="wb-draw-line wb-stroke-slate" pathLength="1" fill="none" strokeWidth="2.5" strokeLinecap="round" />
    ),
  };
  return (
    <svg viewBox="0 0 130 90" className="wb-tool-demo-svg">
      <defs>
        <marker id="wbArrowHead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={BLUE} />
        </marker>
      </defs>
      {demos[tool.id] || null}
    </svg>
  );
}

function DrawingSection() {
  return (
    <section id="drawing" className="wb-section">
      <div className="wb-container">
        <SectionHead
          eyebrow="Drawing & editing"
          title="Every stroke, exactly the tool you reach for"
          sub="Nine input tools live on the left rail — from free-hand pen work to precise connectors — each with its own cursor and behaviour."
        />
        <div className="wb-tool-grid">
          {TOOLS.map((tool, i) => (
            <Reveal key={tool.id} delay={i * 60} className="wb-tool-card">
              <ToolDemo tool={tool} />
              <div className="wb-tool-card-foot">
                <span className="wb-tool-icon"><tool.icon size={14} /></span>
                <span>{tool.label}</span>
                {tool.hint && <kbd>{tool.hint}</kbd>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 3. Content Creation ─────────────────────────────────────────────────── */
function ContentDemo({ id }) {
  if (id === "text")
    return (
      <div className="wb-mini-canvas">
        <span className="wb-typing-text">Project kickoff notes</span>
        <span className="wb-caret" />
      </div>
    );
  if (id === "equation")
    return (
      <div className="wb-mini-canvas wb-equation-box">
        E = mc<sup>2</sup>
      </div>
    );
  if (id === "sticky")
    return (
      <div className="wb-mini-canvas">
        <div className="wb-sticky wb-sticky-pop">Brainstorm 💡</div>
      </div>
    );
  if (id === "comment")
    return (
      <div className="wb-mini-canvas">
        <div className="wb-comment-pin">
          <MessageSquare size={12} />
        </div>
        <div className="wb-comment-bubble">Can we tighten this up?</div>
      </div>
    );
  if (id === "frame")
    return (
      <div className="wb-mini-canvas">
        <div className="wb-frame-demo">
          <span className="wb-frame-label">Slide 1</span>
          <div className="wb-frame-shape" />
        </div>
      </div>
    );
  if (id === "image")
    return (
      <div className="wb-mini-canvas">
        <div className="wb-image-demo">
          <Image size={22} />
        </div>
      </div>
    );
  return null;
}

function ContentCreationSection() {
  return (
    <section className="wb-section wb-section-alt">
      <div className="wb-container">
        <SectionHead
          eyebrow="Content creation"
          title="More than shapes —"
          accent="real content, in place"
          sub="Text, equations, sticky notes, threaded comments, frames and images all live directly on the canvas."
        />
        <div className="wb-content-grid">
          {CONTENT_TOOLS.map((c, i) => (
            <Reveal key={c.id} delay={i * 90} className="wb-content-card">
              <ContentDemo id={c.id} />
              <div className="wb-content-card-body">
                <div className="wb-content-card-title">
                  <c.icon size={15} />
                  {c.label}
                  {c.hint && <kbd>{c.hint}</kbd>}
                </div>
                <p>{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 4. Shapes & Diagram tools ────────────────────────────────────────────── */
function ShapesSection() {
  return (
    <section className="wb-section">
      <div className="wb-container">
        <SectionHead
          eyebrow="Shapes & diagram tools"
          title="A full shape library, ready to snap in"
          sub="From the basics to flowchart-ready connectors — grouped exactly like the in-app shape picker."
        />
        <div className="wb-shape-grid">
          {SHAPES.map((s, i) => (
            <Reveal key={s.id} delay={i * 45} className="wb-shape-card" style={{ animationDelay: `${i * 0.05}s` }}>
              <span className={`wb-shape-draw wb-shape-draw-${s.id}`}>
                <s.icon size={26} strokeWidth={1.6} />
              </span>
              <span className="wb-shape-label">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 5. Professional Diagramming ─────────────────────────────────────────── */
function DiagrammingSection() {
  const [active, setActive] = useState(DIAGRAM_TYPES[0].id);
  const activeType = DIAGRAM_TYPES.find((d) => d.id === active);
  return (
    <section id="diagramming" className="wb-section wb-section-alt">
      <div className="wb-container">
        <SectionHead
          eyebrow="Professional diagramming"
          title="Twelve diagram languages,"
          accent="one canvas"
          sub="Switch between engineering, teaching and planning diagrams without leaving the board."
        />
        <div className="wb-diagram-layout">
          <Reveal className="wb-diagram-list">
            {DIAGRAM_TYPES.map((d) => (
              <button
                key={d.id}
                className={`wb-diagram-pill ${active === d.id ? "wb-diagram-pill-active" : ""}`}
                style={{ "--pill-color": d.color }}
                onClick={() => setActive(d.id)}
              >
                <d.icon size={15} />
                {d.label}
              </button>
            ))}
          </Reveal>
          <Reveal delay={120} className="wb-diagram-preview" key={active}>
            <DiagramPreview type={active} color={activeType.color} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* Mini animated previews per diagram family — builds itself on mount */
function DiagramPreview({ type, color }) {
  const common = (children, vb = "0 0 460 260") => (
    <svg viewBox={vb} className="wb-diagram-svg" key={type}>
      {children}
    </svg>
  );

  switch (type) {
    case "flowchart":
      return common(
        <>
          <Node x={30} y={20} w={110} h={36} label="Start" color={BLUE} rx={18} delay={0} />
          <Edge x1={85} y1={56} x2={85} y2={92} delay={0.4} />
          <Node x={30} y={94} w={110} h={36} label="Process" color={ORANGE} delay={0.5} />
          <Edge x1={85} y1={130} x2={85} y2={166} delay={0.9} />
          <NodeDiamond x={30} y={168} w={110} h={50} label="Decision?" color={GREEN} delay={1} />
          <Edge x1={140} y1={193} x2={230} y2={193} delay={1.5} label="Yes" />
          <Node x={232} y={168} w={110} h={50} label="Database" color={CYAN} delay={1.7} icon="db" />
        </>,
      );
    case "uml_class":
      return common(
        <>
          <ClassBox x={30} y={20} w={140} h={90} title="Order" fields={["id: int", "total: float"]} methods={["submit()"]} delay={0} />
          <ClassBox x={260} y={20} w={140} h={80} title="Customer" fields={["name: str"]} methods={["checkout()"]} delay={0.6} />
          <Edge x1={170} y1={65} x2={260} y2={55} delay={1.2} />
        </>,
      );
    case "uml_sequence":
      return common(
        <>
          {["User", "App", "API", "DB"].map((a, i) => (
            <g key={a}>
              <rect x={30 + i * 110} y={16} width={90} height={28} rx={4} fill="#fff" stroke={PINK} className="wb-fade" style={{ animationDelay: `${i * 0.15}s` }} />
              <text x={75 + i * 110} y={35} textAnchor="middle" className="wb-svg-label-sm wb-fade" style={{ animationDelay: `${i * 0.15}s` }}>{a}</text>
              <line x1={75 + i * 110} y1={44} x2={75 + i * 110} y2={230} stroke="#cbd5e1" strokeDasharray="3 3" />
            </g>
          ))}
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M75 ${70 + i * 55} L ${75 + (i + 1) * 110} ${70 + i * 55}`}
              className="wb-draw-line wb-stroke-pink"
              pathLength="1"
              fill="none"
              strokeWidth="2"
              markerEnd="url(#wbArrowHead2)"
              style={{ animationDelay: `${0.8 + i * 0.4}s` }}
            />
          ))}
          <defs>
            <marker id="wbArrowHead2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={PINK} />
            </marker>
          </defs>
        </>,
      );
    case "uml_usecase":
      return common(
        <>
          <ActorFig x={30} y={90} delay={0} />
          <ellipse cx={230} cy={60} rx={90} ry={30} fill={`${INDIGO}18`} stroke={INDIGO} className="wb-fade" style={{ animationDelay: "0.4s" }} />
          <text x={230} y={65} textAnchor="middle" className="wb-svg-label-sm wb-fade" style={{ animationDelay: "0.8s" }}>Place Order</text>
          <ellipse cx={230} cy={150} rx={90} ry={30} fill={`${INDIGO}18`} stroke={INDIGO} className="wb-fade" style={{ animationDelay: "0.9s" }} />
          <text x={230} y={155} textAnchor="middle" className="wb-svg-label-sm wb-fade" style={{ animationDelay: "1.3s" }}>Track Order</text>
          <path d="M65 100 L145 65" className="wb-draw-line wb-stroke-muted" pathLength="1" fill="none" style={{ animationDelay: "1.5s" }} />
          <path d="M65 110 L145 145" className="wb-draw-line wb-stroke-muted" pathLength="1" fill="none" style={{ animationDelay: "1.7s" }} />
        </>,
      );
    case "er":
      return common(
        <>
          <EREntity x={30} y={30} title="User" attrs={["id", "email"]} delay={0} />
          <EREntity x={280} y={30} title="Order" attrs={["id", "userId"]} delay={0.5} />
          <path d="M170 55 L280 55" className="wb-draw-line wb-stroke-cyan" pathLength="1" fill="none" strokeWidth="2" style={{ animationDelay: "1s" }} />
          <text x={225} y={48} textAnchor="middle" className="wb-svg-label-sm wb-fade" style={{ animationDelay: "1.3s" }}>1..N</text>
        </>,
      );
    case "network":
      return common(
        <>
          <NetIcon x={20} y={100} label="Client" delay={0} shape="pc" color={GREEN} />
          <NetIcon x={160} y={40} label="Router" delay={0.4} shape="router" color={GREEN} />
          <NetIcon x={160} y={160} label="Firewall" delay={0.6} shape="lock" color={GREEN} />
          <NetIcon x={300} y={100} label="Server" delay={0.9} shape="server" color={GREEN} />
          <Edge x1={70} y1={118} x2={165} y2={70} delay={0.3} thin />
          <Edge x1={70} y1={130} x2={165} y2={185} delay={0.5} thin />
          <Edge x1={215} y1={70} x2={305} y2={110} delay={1} thin />
          <Edge x1={215} y1={185} x2={305} y2={125} delay={1.1} thin />
        </>,
      );
    case "mindmap":
      return common(
        <>
          <circle cx={230} cy={130} r={34} fill={`${AMBER}22`} stroke={AMBER} strokeWidth="2" className="wb-fade" />
          <text x={230} y={135} textAnchor="middle" className="wb-svg-label-sm">Idea</text>
          {[
            { x: 90, y: 50, l: "Research" },
            { x: 380, y: 50, l: "Design" },
            { x: 90, y: 210, l: "Build" },
            { x: 380, y: 210, l: "Launch" },
          ].map((b, i) => (
            <g key={b.l}>
              <path d={`M230 130 L${b.x} ${b.y}`} className="wb-draw-line wb-stroke-amber" pathLength="1" fill="none" strokeWidth="2" style={{ animationDelay: `${0.3 + i * 0.2}s` }} />
              <circle cx={b.x} cy={b.y} r="26" fill="#fff" stroke={AMBER} strokeWidth="1.5" className="wb-fade" style={{ animationDelay: `${0.6 + i * 0.2}s` }} />
              <text x={b.x} y={b.y + 4} textAnchor="middle" className="wb-svg-label-sm wb-fade" style={{ animationDelay: `${0.9 + i * 0.2}s` }}>{b.l}</text>
              {[[-1, -1], [1, -1]].map(([dx, dy], j) => {
                const sx = b.x + dx * 60;
                const sy = b.y + dy * 50;
                return (
                  <g key={j}>
                    <path d={`M${b.x} ${b.y} L${sx} ${sy}`} className="wb-draw-line wb-stroke-muted" pathLength="1" fill="none" strokeWidth="1.4" style={{ animationDelay: `${1.3 + i * 0.25 + j * 0.15}s` }} />
                    <text x={sx} y={sy} textAnchor="middle" className="wb-svg-label-xs wb-fade" style={{ animationDelay: `${1.6 + i * 0.25 + j * 0.15}s` }}>{j === 0 ? "Subtopic" : "Idea"}</text>
                  </g>
                );
              })}
            </g>
          ))}
        </>,
      );
    case "org":
      return common(
        <>
          <Node x={175} y={16} w={110} h={36} label="CEO" color={RED} delay={0} />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Edge x1={230} y1={52} x2={80 + i * 150} y2={90} delay={0.4 + i * 0.15} thin />
              <Node x={30 + i * 150} y={92} w={100} h={34} label={["CTO", "COO", "CFO"][i]} color={RED} delay={0.7 + i * 0.15} />
            </g>
          ))}
        </>,
      );
    case "workflow":
      return common(
        <>
          {["Request", "Review", "Approve", "Deploy"].map((l, i) => (
            <g key={l}>
              <Node x={20 + i * 115} y={112} w={95} h={40} label={l} color={ORANGE} delay={i * 0.3} rx={8} />
              {i < 3 && <Edge x1={115 + i * 115} y1={132} x2={135 + i * 115} y2={132} delay={i * 0.3 + 0.25} thin />}
            </g>
          ))}
        </>,
      );
    case "aws":
      return common(
        <>
          {[
            { l: "EC2", x: 20 },
            { l: "ELB", x: 130 },
            { l: "Lambda", x: 240 },
            { l: "RDS", x: 350 },
          ].map((n, i) => (
            <g key={n.l}>
              <rect x={n.x} y={90} width={90} height={56} rx={8} fill="#fff7ed" stroke="#ff9900" className="wb-fade" style={{ animationDelay: `${i * 0.25}s` }} />
              <text x={n.x + 45} y={122} textAnchor="middle" className="wb-svg-label-sm wb-fade" style={{ animationDelay: `${i * 0.25 + 0.1}s` }}>{n.l}</text>
              {i < 3 && <Edge x1={n.x + 90} y1={118} x2={n.x + 130} y2={118} delay={i * 0.25 + 0.3} thin />}
            </g>
          ))}
          <text x={230} y={70} textAnchor="middle" className="wb-svg-label-sm wb-fade" style={{ animationDelay: "1.1s" }}>S3 (assets)</text>
        </>,
      );
    case "system":
      return common(
        <>
          <Node x={20} y={100} w={90} h={44} label="Client" color={LIME} delay={0} rx={8} />
          <Node x={170} y={40} w={110} h={44} label="Load Balancer" color={LIME} delay={0.3} rx={8} />
          <Node x={170} y={160} w={110} h={44} label="Cache" color={LIME} delay={0.5} rx={8} />
          <Node x={340} y={100} w={100} h={44} label="Database" color={LIME} delay={0.8} rx={8} icon="db" />
          <Edge x1={110} y1={122} x2={170} y2={62} delay={0.2} thin />
          <Edge x1={110} y1={122} x2={170} y2={182} delay={0.4} thin />
          <Edge x1={280} y1={62} x2={340} y2={110} delay={0.7} thin />
          <Edge x1={280} y1={182} x2={340} y2={135} delay={0.9} thin />
        </>,
      );
    case "dsa":
      return common(
        <>
          {[
            { x: 230, y: 30 },
            { x: 130, y: 100 },
            { x: 330, y: 100 },
            { x: 80, y: 180 },
            { x: 180, y: 180 },
          ].map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r="22" fill={`${VIOLET}18`} stroke={VIOLET} strokeWidth="2" className="wb-fade" style={{ animationDelay: `${i * 0.18}s` }} />
          ))}
          <Edge x1={230} y1={50} x2={130} y2={82} delay={0.5} thin />
          <Edge x1={230} y1={50} x2={330} y2={82} delay={0.6} thin />
          <Edge x1={130} y1={120} x2={80} y2={162} delay={0.8} thin />
          <Edge x1={130} y1={120} x2={180} y2={162} delay={0.9} thin />
        </>,
      );
    default:
      return null;
  }
}

/* Reusable diagram-preview atoms */
function Node({ x, y, w, h, label, color, delay = 0, rx = 6, icon }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={`${color}18`} stroke={color} strokeWidth="1.6" className="wb-fade" style={{ animationDelay: `${delay}s` }} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" className="wb-svg-label-sm wb-fade" style={{ animationDelay: `${delay + 0.2}s`, fill: INK }}>
        {icon === "db" ? "🗄 " : ""}{label}
      </text>
    </g>
  );
}
function NodeDiamond({ x, y, w, h, label, color, delay = 0 }) {
  const pts = `${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}`;
  return (
    <g>
      <polygon points={pts} fill={`${color}18`} stroke={color} strokeWidth="1.6" className="wb-fade" style={{ animationDelay: `${delay}s` }} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" className="wb-svg-label-sm wb-fade" style={{ animationDelay: `${delay + 0.2}s` }}>{label}</text>
    </g>
  );
}
function Edge({ x1, y1, x2, y2, delay = 0, label, thin }) {
  return (
    <g>
      <path d={`M${x1} ${y1} L${x2} ${y2}`} className="wb-draw-line wb-stroke-muted" pathLength="1" fill="none" strokeWidth={thin ? 1.6 : 2} style={{ animationDelay: `${delay}s` }} />
      {label && (
        <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} textAnchor="middle" className="wb-svg-label-sm wb-fade" style={{ animationDelay: `${delay + 0.3}s` }}>{label}</text>
      )}
    </g>
  );
}
function ClassBox({ x, y, w, h, title, fields, methods, delay = 0 }) {
  return (
    <g className="wb-fade" style={{ animationDelay: `${delay}s` }}>
      <rect x={x} y={y} width={w} height={h} fill="#fff" stroke={PURPLE} strokeWidth="1.6" rx="4" />
      <text x={x + w / 2} y={y + 18} textAnchor="middle" className="wb-svg-label-sm" fontWeight="700">{title}</text>
      <line x1={x} y1={y + 26} x2={x + w} y2={y + 26} stroke={PURPLE} strokeWidth="1" />
      {fields.map((f, i) => (
        <text key={f} x={x + 10} y={y + 42 + i * 16} className="wb-svg-label-xs">{f}</text>
      ))}
      <line x1={x} y1={y + 26 + fields.length * 16 + 8} x2={x + w} y2={y + 26 + fields.length * 16 + 8} stroke={PURPLE} strokeWidth="1" />
      {methods.map((m, i) => (
        <text key={m} x={x + 10} y={y + 46 + fields.length * 16 + i * 16} className="wb-svg-label-xs">{m}</text>
      ))}
    </g>
  );
}
function EREntity({ x, y, title, attrs, delay = 0 }) {
  return (
    <g className="wb-fade" style={{ animationDelay: `${delay}s` }}>
      <rect x={x} y={y} width={140} height={26 + attrs.length * 18} fill="#fff" stroke={CYAN} strokeWidth="1.6" rx="4" />
      <rect x={x} y={y} width={140} height={26} fill={`${CYAN}18`} stroke={CYAN} rx="4" />
      <text x={x + 70} y={y + 18} textAnchor="middle" className="wb-svg-label-sm" fontWeight="700">{title}</text>
      {attrs.map((a, i) => (
        <text key={a} x={x + 12} y={y + 44 + i * 18} className="wb-svg-label-xs">{a}</text>
      ))}
    </g>
  );
}
function ActorFig({ x, y, delay = 0 }) {
  return (
    <g className="wb-fade" style={{ animationDelay: `${delay}s` }} stroke={INDIGO} strokeWidth="2" fill="none">
      <circle cx={x + 15} cy={y - 20} r="9" />
      <line x1={x + 15} y1={y - 11} x2={x + 15} y2={y + 15} />
      <line x1={x} y1={y - 2} x2={x + 30} y2={y - 2} />
      <line x1={x + 15} y1={y + 15} x2={x} y2={y + 35} />
      <line x1={x + 15} y1={y + 15} x2={x + 30} y2={y + 35} />
      <text x={x + 15} y={y + 52} textAnchor="middle" className="wb-svg-label-sm" fill={INDIGO} stroke="none">User</text>
    </g>
  );
}
function NetIcon({ x, y, label, delay = 0, shape, color }) {
  const icons = { pc: Monitor, router: Network, lock: Lock, server: Cpu };
  const Icon = icons[shape] || Monitor;
  return (
    <g className="wb-fade" style={{ animationDelay: `${delay}s` }}>
      <rect x={x} y={y} width={50} height={40} rx="8" fill={`${color}18`} stroke={color} strokeWidth="1.6" />
      <foreignObject x={x + 13} y={y + 6} width="24" height="24">
        <Icon size={20} color={color} />
      </foreignObject>
      <text x={x + 25} y={y + 55} textAnchor="middle" className="wb-svg-label-xs">{label}</text>
    </g>
  );
}

/* ── 6. Flowchart Showcase (dedicated) ───────────────────────────────────── */
function FlowchartShowcase() {
  return (
    <section className="wb-section wb-section-alt">
      <div className="wb-container wb-container-narrow">
        <SectionHead
          eyebrow="Flowchart, front and centre"
          title="Flowcharts that draw themselves"
          sub="Process, decision, database, document and I/O nodes — connected with arrows that animate as you scroll."
        />
        <Reveal delay={100} className="wb-flow-showcase">
          <svg viewBox="0 0 900 300" className="wb-diagram-svg wb-flow-big">
            <defs>
              <marker id="wbFlowArrow" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" fill={MUTED} />
              </marker>
            </defs>
            <Node x={20} y={120} w={120} h={44} label="Start" color={BLUE} rx={22} delay={0} />
            <path d="M140 142 L200 142" className="wb-draw-line wb-stroke-muted" pathLength="1" fill="none" markerEnd="url(#wbFlowArrow)" style={{ animationDelay: "0.4s" }} />
            <Node x={202} y={120} w={130} h={44} label="Input / Output" color={CYAN} delay={0.5} rx={4} />
            <path d="M332 142 L392 142" className="wb-draw-line wb-stroke-muted" pathLength="1" fill="none" markerEnd="url(#wbFlowArrow)" style={{ animationDelay: "1s" }} />
            <NodeDiamond x={394} y={100} w={130} h={84} label="Valid?" color={GREEN} delay={1.1} />
            <path d="M524 142 L584 142" className="wb-draw-line wb-stroke-muted" pathLength="1" fill="none" markerEnd="url(#wbFlowArrow)" style={{ animationDelay: "1.6s" }} />
            <text x="554" y="130" textAnchor="middle" className="wb-svg-label-sm wb-fade" style={{ animationDelay: "2s" }}>Yes</text>
            <Node x={586} y={120} w={130} h={44} label="Process" color={ORANGE} delay={1.7} rx={8} />
            <path d="M716 142 L776 142" className="wb-draw-line wb-stroke-muted" pathLength="1" fill="none" markerEnd="url(#wbFlowArrow)" style={{ animationDelay: "2.2s" }} />
            <Node x={778} y={120} w={100} h={44} label="Database" color={VIOLET} delay={2.3} rx={4} icon="db" />
            <path d="M459 184 L459 240 L586 240" className="wb-draw-line wb-stroke-red" pathLength="1" fill="none" markerEnd="url(#wbFlowArrow)" style={{ animationDelay: "2.7s" }} />
            <text x="459" y="212" textAnchor="middle" className="wb-svg-label-sm wb-fade" style={{ animationDelay: "3s" }}>No</text>
            <Node x={588} y={218} w={130} h={44} label="Document error" color={RED} delay={2.9} rx={4} />
          </svg>
        </Reveal>
        <Reveal delay={200}>
          <div className="wb-flow-legend">
            {["Process", "Decision", "Database", "Document", "Connector", "Input / Output"].map((l) => (
              <span key={l} className="wb-flow-legend-item">{l}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 7. UML / ER / Network deep dive (tabbed) ────────────────────────────── */
function UmlErNetworkSection() {
  const tabs = [
    { id: "uml", label: "UML" },
    { id: "er", label: "ER Diagram" },
    { id: "network", label: "Network" },
  ];
  const [tab, setTab] = useState("uml");
  return (
    <section className="wb-section">
      <div className="wb-container">
        <SectionHead
          eyebrow="Structured modelling"
          title="UML, ER & Network — one toolkit each"
          sub="Purpose-built shapes for software design, data modelling and infrastructure diagrams."
        />
        <Reveal className="wb-tabs">
          {tabs.map((t) => (
            <button key={t.id} className={`wb-tab ${tab === t.id ? "wb-tab-active" : ""}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </Reveal>

        {tab === "uml" && (
          <div className="wb-uen-grid" key="uml">
            <Reveal className="wb-uen-canvas">
              <DiagramPreview type="uml_class" color={PURPLE} />
            </Reveal>
            <Reveal delay={100} className="wb-uen-list">
              {["Class", "Interface", "Actor", "Use Case", "Relationships"].map((l) => (
                <div key={l} className="wb-uen-chip" style={{ "--chip-color": PURPLE }}>{l}</div>
              ))}
            </Reveal>
          </div>
        )}
        {tab === "er" && (
          <div className="wb-uen-grid" key="er">
            <Reveal className="wb-uen-canvas">
              <DiagramPreview type="er" color={CYAN} />
            </Reveal>
            <Reveal delay={100} className="wb-uen-list">
              {["Entities", "Attributes", "Relationships"].map((l) => (
                <div key={l} className="wb-uen-chip" style={{ "--chip-color": CYAN }}>{l}</div>
              ))}
            </Reveal>
          </div>
        )}
        {tab === "network" && (
          <div className="wb-uen-grid" key="network">
            <Reveal className="wb-uen-canvas">
              <DiagramPreview type="network" color={GREEN} />
            </Reveal>
            <Reveal delay={100} className="wb-uen-list">
              {["Server", "Router", "Switch", "Firewall", "PC"].map((l) => (
                <div key={l} className="wb-uen-chip" style={{ "--chip-color": GREEN }}>{l}</div>
              ))}
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── 8. Mind Map & Brainstorming ─────────────────────────────────────────── */
function MindMapSection() {
  return (
    <section className="wb-section wb-section-alt">
      <div className="wb-container wb-container-narrow">
        <SectionHead
          eyebrow="Mind maps & brainstorming"
          title="From one idea to a whole map"
          sub="Branches animate outward from a central node — built for workshops and lesson planning."
        />
        <Reveal delay={100} className="wb-mindmap-showcase">
          <svg viewBox="0 0 620 300" className="wb-diagram-svg">
            <circle cx="310" cy="150" r="42" fill={`${AMBER}20`} stroke={AMBER} strokeWidth="2.2" className="wb-fade wb-pulse-ring" />
            <text x="310" y="156" textAnchor="middle" className="wb-svg-label" fontWeight="700">Main Idea</text>
            {[
              { x: 130, y: 60, l: "Topic A" },
              { x: 490, y: 60, l: "Topic B" },
              { x: 130, y: 240, l: "Topic C" },
              { x: 490, y: 240, l: "Topic D" },
            ].map((b, i) => (
              <g key={b.l}>
                <path d={`M310 150 L${b.x} ${b.y}`} className="wb-draw-line wb-stroke-amber" pathLength="1" fill="none" strokeWidth="2.2" style={{ animationDelay: `${0.3 + i * 0.25}s` }} />
                <circle cx={b.x} cy={b.y} r="34" fill="#fff" stroke={AMBER} strokeWidth="1.8" className="wb-fade" style={{ animationDelay: `${0.7 + i * 0.25}s` }} />
                <text x={b.x} y={b.y + 5} textAnchor="middle" className="wb-svg-label-sm" style={{ animationDelay: `${1 + i * 0.25}s` }}>{b.l}</text>
                {[[-1, -1], [1, -1]].map(([dx, dy], j) => {
                  const sx = b.x + dx * 60;
                  const sy = b.y + dy * 50;
                  return (
                    <g key={j}>
                      <path d={`M${b.x} ${b.y} L${sx} ${sy}`} className="wb-draw-line wb-stroke-muted" pathLength="1" fill="none" strokeWidth="1.4" style={{ animationDelay: `${1.3 + i * 0.25 + j * 0.15}s` }} />
                      <text x={sx} y={sy} textAnchor="middle" className="wb-svg-label-xs wb-fade" style={{ animationDelay: `${1.6 + i * 0.25 + j * 0.15}s` }}>{j === 0 ? "Subtopic" : "Idea"}</text>
                    </g>
                  );
                })}
              </g>
            ))}
          </svg>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 9. DSA Visualization ────────────────────────────────────────────────── */
function DsaSection() {
  const [mode, setMode] = useState("tree");
  return (
    <section className="wb-section">
      <div className="wb-container">
        <SectionHead
          eyebrow="DSA visualization"
          title="Teach data structures visually"
          sub="Binary trees, BSTs and graphs build node-by-node so learners can follow the structure forming."
        />
        <Reveal className="wb-tabs">
          <button className={`wb-tab ${mode === "tree" ? "wb-tab-active" : ""}`} onClick={() => setMode("tree")}>Binary Tree / BST</button>
          <button className={`wb-tab ${mode === "graph" ? "wb-tab-active" : ""}`} onClick={() => setMode("graph")}>Graph Algorithms</button>
        </Reveal>
        <Reveal delay={100} className="wb-dsa-canvas" key={mode}>
          {mode === "tree" ? (
            <svg viewBox="0 0 460 240" className="wb-diagram-svg">
              {[
                { x: 230, y: 30, v: 8 },
                { x: 130, y: 100, v: 4 },
                { x: 330, y: 100, v: 12 },
                { x: 80, y: 180, v: 2 },
                { x: 180, y: 180, v: 6 },
                { x: 280, y: 180, v: 10 },
                { x: 380, y: 180, v: 14 },
              ].map((n, i) => (
                <g key={i}>
                  <circle cx={n.x} cy={n.y} r="22" fill={`${VIOLET}18`} stroke={VIOLET} strokeWidth="2" className="wb-fade" style={{ animationDelay: `${i * 0.15}s` }} />
                  <text x={n.x} y={n.y + 5} textAnchor="middle" className="wb-svg-label-sm wb-fade" style={{ animationDelay: `${i * 0.15 + 0.1}s` }}>{n.v}</text>
                </g>
              ))}
              <Edge x1={230} y1={50} x2={130} y2={82} delay={0.5} thin />
              <Edge x1={230} y1={50} x2={330} y2={82} delay={0.6} thin />
              <Edge x1={130} y1={120} x2={80} y2={162} delay={0.9} thin />
              <Edge x1={130} y1={120} x2={180} y2={162} delay={1} thin />
              <Edge x1={330} y1={120} x2={280} y2={162} delay={1.1} thin />
              <Edge x1={330} y1={120} x2={380} y2={162} delay={1.2} thin />
            </svg>
          ) : (
            <svg viewBox="0 0 460 240" className="wb-diagram-svg">
              {[
                { x: 90, y: 60 }, { x: 250, y: 40 }, { x: 380, y: 110 },
                { x: 200, y: 150 }, { x: 60, y: 180 }, { x: 320, y: 200 },
              ].map((n, i) => (
                <circle key={i} cx={n.x} cy={n.y} r="20" fill={`${VIOLET}18`} stroke={VIOLET} strokeWidth="2" className="wb-fade" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
              {[[0,1],[1,2],[0,3],[1,3],[3,4],[2,5],[3,5]].map(([a,b], i) => {
                const pts = [{x:90,y:60},{x:250,y:40},{x:380,y:110},{x:200,y:150},{x:60,y:180},{x:320,y:200}];
                return <Edge key={i} x1={pts[a].x} y1={pts[a].y} x2={pts[b].x} y2={pts[b].y} delay={0.6 + i * 0.15} thin />;
              })}
            </svg>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ── 10. Templates carousel ──────────────────────────────────────────────── */
function TemplatesSection({ onUseTemplate }) {
  const trackRef = useRef(null);
  const scrollBy = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };
  return (
    <section id="templates" className="wb-section wb-section-alt">
      <div className="wb-container">
        <div className="wb-templates-head">
          <SectionHead
            eyebrow="Templates"
            title="Start from a template, not a blank page"
            sub="Fifteen ready-made boards spanning education, agile, design and architecture."
          />
          <Reveal className="wb-carousel-arrows">
            <button aria-label="Scroll left" onClick={() => scrollBy(-1)}><ChevronLeft size={18} /></button>
            <button aria-label="Scroll right" onClick={() => scrollBy(1)}><ChevronRight size={18} /></button>
          </Reveal>
        </div>
        <div className="wb-template-track" ref={trackRef}>
          {TEMPLATES.map((t, i) => (
            <Reveal as="div" key={t.id} delay={Math.min(i * 40, 300)} className="wb-template-card">
              <div className="wb-template-thumb" style={{ "--tc": t.color }}>
                <t.icon size={30} strokeWidth={1.6} />
              </div>
              <div className="wb-template-info">
                <div className="wb-template-title">{t.title}</div>
                <div className="wb-template-cat">{t.category}</div>
              </div>
              <button className="wb-template-cta" onClick={() => onUseTemplate?.(t)}>
                Use Template <ArrowRight size={13} />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 11. Whiteboard Management dashboard mock ────────────────────────────── */
function ManagementSection() {
  const [activeItem, setActiveItem] = useState("Recent");
  const boards = [
    { title: "Q3 Roadmap Flow", meta: "Edited 2h ago", starred: true },
    { title: "Sprint Retro — Aug", meta: "Edited yesterday", starred: false },
    { title: "System Architecture v2", meta: "Edited 3d ago", starred: true },
    { title: "Onboarding Mind Map", meta: "Edited last week", starred: false },
  ];
  return (
    <section className="wb-section">
      <div className="wb-container">
        <SectionHead
          eyebrow="Whiteboard management"
          title="Every board, organised your way"
          sub="Filter by Recent, My Whiteboards, Shared With Me or Starred — search, rename, duplicate, export or trash in a click."
        />
        <Reveal delay={80} className="wb-dash-mock">
          <div className="wb-dash-sidebar">
            {SIDEBAR_ITEMS.map((s) => (
              <div key={s.label} className={`wb-dash-side-item ${activeItem === s.label ? "wb-dash-side-active" : ""}`} onClick={() => setActiveItem(s.label)}>
                <s.icon size={15} /> {s.label}
              </div>
            ))}
          </div>
          <div className="wb-dash-main">
            <div className="wb-dash-toolbar">
              <div className="wb-dash-search"><Search size={14} /> Search whiteboards…</div>
              <button className="wb-btn wb-btn-primary wb-btn-sm"><Plus size={14} /> Create</button>
            </div>
            <div className="wb-dash-grid">
              {boards.map((b, i) => (
                <div key={b.title} className="wb-dash-card" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="wb-dash-card-thumb">
                    <GitBranch size={22} color={[BLUE, GREEN, LIME, AMBER][i % 4]} />
                    {b.starred && <Star size={12} className="wb-dash-star" fill={AMBER} color={AMBER} />}
                  </div>
                  <div className="wb-dash-card-title">{b.title}</div>
                  <div className="wb-dash-card-meta">{b.meta}</div>
                  <div className="wb-dash-card-actions">
                    {BOARD_ACTIONS.map((a) => (
                      <span key={a.label} title={a.label}><a.icon size={12} /></span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 12. Collaboration ────────────────────────────────────────────────────── */
function CollaborationSection() {
  return (
    <section id="collaboration" className="wb-section wb-section-alt">
      <div className="wb-container">
        <SectionHead
          eyebrow="Collaboration"
          title="Built to be watched, not just used"
          sub="A live-sync connection status, auto-save and threaded comments keep everyone on the same board in real time."
        />
        <div className="wb-collab-grid">
          <Reveal className="wb-collab-card">
            <div className="wb-collab-card-head"><Wifi size={16} /> Connection status</div>
            <div className="wb-collab-canvas">
              <LiveBadge label="LIVE SYNC" />
              <p>Reconnects automatically over WebSocket — the badge flips to <b>OFFLINE</b> the instant the link drops.</p>
            </div>
          </Reveal>
          <Reveal delay={100} className="wb-collab-card">
            <div className="wb-collab-card-head"><Save size={16} /> Auto-save</div>
            <div className="wb-collab-canvas">
              <span className="wb-saved-pill wb-saved-pill-lg"><Save size={12} /> Auto-saved</span>
              <p>Every change is snapshotted automatically, with clear <i>Saving…</i>, <i>Unsaved changes</i> and <i>Save failed</i> states.</p>
            </div>
          </Reveal>
          <Reveal delay={200} className="wb-collab-card">
            <div className="wb-collab-card-head"><MessageSquare size={16} /> Threaded comments</div>
            <div className="wb-collab-canvas">
              <div className="wb-comment-pin wb-comment-pin-static"><MessageSquare size={11} /></div>
              <div className="wb-comment-bubble wb-comment-bubble-static">Looks good — ship it!</div>
            </div>
          </Reveal>
          <Reveal delay={300} className="wb-collab-card">
            <div className="wb-collab-card-head"><Share2 size={16} /> Shared boards</div>
            <div className="wb-collab-canvas">
              <div className="wb-avatar-stack">
                {["A", "R", "S", "+3"].map((a) => (
                  <span key={a} className="wb-avatar">{a}</span>
                ))}
              </div>
              <p>Boards live under <b>Shared With Me</b> the moment a teammate invites you.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── 13. Canvas Controls ──────────────────────────────────────────────────── */
function CanvasControlsSection() {
  const [zoom, setZoom] = useState(100);
  return (
    <section className="wb-section">
      <div className="wb-container wb-container-narrow">
        <SectionHead
          eyebrow="Canvas controls"
          title="Precise control, always within reach"
          sub="Zoom, undo/redo history, multi-page boards and fullscreen — try the zoom control below."
        />
        <Reveal delay={80} className="wb-controls-mock">
          <div className="wb-controls-canvas" style={{ "--z": zoom / 100 }}>
            <div className="wb-controls-canvas-inner">
              <GitBranch size={40} color={BLUE} strokeWidth={1.3} />
            </div>
          </div>
          <div className="wb-controls-bar">
            <button onClick={() => setZoom((z) => Math.max(40, z - 20))}><ZoomOut size={15} /></button>
            <span className="wb-zoom-readout">{zoom}%</span>
            <button onClick={() => setZoom((z) => Math.min(200, z + 20))}><ZoomIn size={15} /></button>
            <span className="wb-controls-divider" />
            {CANVAS_CONTROLS.slice(2).map((c) => (
              <button key={c.label} title={c.label}><c.icon size={15} /></button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 14. Present Mode ─────────────────────────────────────────────────────── */
function PresentModeSection() {
  const [presenting, setPresenting] = useState(false);
  return (
    <section className="wb-section wb-section-alt">
      <div className="wb-container wb-container-narrow">
        <SectionHead
          eyebrow="Present mode"
          title="Turn any board into a presentation"
          sub="One click hides every editor chrome element and takes the canvas fullscreen — perfect for classes and demos."
        />
        <Reveal delay={80} className={`wb-present-mock ${presenting ? "wb-present-active" : ""}`}>
          {!presenting && (
            <div className="wb-present-chrome">
              <div className="wb-present-toolbar">
                {TOOLS.slice(0, 5).map((t) => <t.icon key={t.id} size={13} />)}
              </div>
              <div className="wb-present-sidebar" />
            </div>
          )}
          <div className="wb-present-canvas">
            <GitBranch size={presenting ? 64 : 34} color={BLUE} strokeWidth={1.3} />
          </div>
          <button className="wb-present-toggle" onClick={() => setPresenting((p) => !p)}>
            <Play size={13} /> {presenting ? "Exit Present Mode" : "Present"}
          </button>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 15. Light / Dark mode ───────────────────────────────────────────────── */
function LightDarkSection() {
  const [dark, setDark] = useState(false);
  return (
    <section className="wb-section">
      <div className="wb-container wb-container-narrow">
        <SectionHead
          eyebrow="Light / dark mode"
          title="Comfortable in any light"
          sub="Flip the switch — the whole canvas, toolbar and grid transition smoothly."
        />
        <Reveal delay={80} className={`wb-theme-mock ${dark ? "wb-theme-dark" : ""}`}>
          <div className="wb-theme-topbar">
            <span>Untitled Whiteboard</span>
            <button className="wb-theme-toggle" onClick={() => setDark((d) => !d)} aria-label="Toggle theme">
              {dark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
          <div className="wb-theme-canvas">
            <Node x={40} y={40} w={110} h={38} label="Start" color={dark ? "#93c5fd" : BLUE} rx={19} delay={0} />
            <Node x={40} y={110} w={110} h={38} label="Process" color={dark ? "#fdba74" : ORANGE} delay={0.1} rx={8} />
            <Edge x1={95} y1={78} x2={95} y2={110} delay={0.2} thin />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Final CTA ────────────────────────────────────────────────────────────── */
function FinalCta({ onStart }) {
  return (
    <section className="wb-section wb-final-cta">
      <div className="wb-container wb-container-narrow wb-center">
        <Reveal>
          <h2 className="wb-h2 wb-final-h2">
            Your next idea deserves <span className="wb-accent">a real canvas</span>
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="wb-sub">Every tool above is live in the editor today — free-hand drawing, twelve diagram types, templates and real-time sync.</p>
        </Reveal>
        <Reveal delay={200}>
          <button className="wb-btn wb-btn-primary wb-btn-lg" onClick={onStart}>
            Start Whiteboarding <ArrowRight size={17} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="wb-footer">
      <div className="wb-container wb-footer-inner">
        <div className="wb-logo wb-logo-sm">
          <span className="wb-logo-mark"><Pen size={14} strokeWidth={2.4} /></span>
          Whiteboard
        </div>
        <span className="wb-footer-copy">Draw. Diagram. Present. Together.</span>
      </div>
    </footer>
  );
}

/* ── Root component ───────────────────────────────────────────────────────── */
export default function WhiteboardLandingPage({
  onStartWhiteboarding,
  onUseTemplate,
  editorRoute = "/whiteboard",
  theme = "light",
  toggleTheme,
  scrollToSection,
  setShowLoginModal,
}) {
  const scrollToId = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const goToEditor = useCallback(() => {
    if (onStartWhiteboarding) return onStartWhiteboarding();
    window.location.href = editorRoute;
  }, [onStartWhiteboarding, editorRoute]);

  const useTemplate = useCallback(
    (tpl) => {
      if (onUseTemplate) return onUseTemplate(tpl);
      window.location.href = `${editorRoute}?template=${tpl.id}`;
    },
    [onUseTemplate, editorRoute],
  );

  return (
    <PublicLayout
      theme={theme}
      toggleTheme={toggleTheme}
      setShowLoginModal={setShowLoginModal}
      scrollToSection={scrollToSection || scrollToId}
    >
      <div className="wb-landing">
        <GlobalStyles />
        <Hero onStart={goToEditor} onExplore={() => scrollToId("drawing")} />
        <DrawingSection />
        <ContentCreationSection />
        <ShapesSection />
        <DiagrammingSection />
        <FlowchartShowcase />
        <UmlErNetworkSection />
        <MindMapSection />
        <DsaSection />
        <TemplatesSection onUseTemplate={useTemplate} />
        <ManagementSection />
        <CollaborationSection />
        <CanvasControlsSection />
        <PresentModeSection />
        <LightDarkSection />
        <FinalCta onStart={goToEditor} />
      </div>
    </PublicLayout>
  );
}

/* ── Global styles ─────────────────────────────────────────────────────────
   Self-contained: font import + tokens + every class used above.
   Injected once via a <style> tag so this file can drop into any route
   without a separate CSS file or build-time preprocessor.
   ──────────────────────────────────────────────────────────────────────── */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

      .wb-landing {
        --ink: ${INK};
        --slate: ${SLATE};
        --muted: ${MUTED};
        --line: ${LINE};
        --paper: ${PAPER};
        --orange: ${ORANGE};
        --amber: ${AMBER};
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: var(--ink);
        background: var(--paper);
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
      }
      .wb-landing * { box-sizing: border-box; }
      .wb-landing h1, .wb-landing h2 { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
      .wb-landing kbd {
        font-family: inherit; font-size: 10px; padding: 1px 5px; border-radius: 4px;
        background: rgba(15,23,42,0.06); color: var(--muted); border: 1px solid rgba(15,23,42,0.08);
      }
      .wb-landing button { font-family: inherit; cursor: pointer; }
      .wb-landing a { color: inherit; text-decoration: none; }

      /* Layout helpers */
      .wb-container { max-width: 1180px; margin: 0 auto; padding: 0 28px; }
      .wb-container-narrow { max-width: 860px; }
      .wb-center { text-align: center; }
      .wb-section { padding: 96px 0; }
      .wb-section-alt { background: #f8fafc; }

      /* Reveal-on-scroll */
      .wb-reveal { opacity: 0; transform: translateY(26px); transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1); }
      .wb-reveal.wb-shown { opacity: 1; transform: translateY(0); }
      @media (prefers-reduced-motion: reduce) {
        .wb-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
        .wb-draw-line, .wb-draw-fill, .wb-fade, .wb-pen-tip, .wb-typing-text, .wb-caret, .wb-highlight-sweep { animation: none !important; }
      }

      /* Type */
      .wb-eyebrow {
        display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700;
        letter-spacing: 0.04em; text-transform: uppercase; color: var(--orange);
        background: rgba(249,115,22,0.1); padding: 6px 12px; border-radius: 999px; margin-bottom: 16px;
      }
      .wb-eyebrow-light { color: #ffedd5; background: rgba(255,255,255,0.12); }
      .wb-h1 { font-size: clamp(40px, 7vw, 76px); font-weight: 800; line-height: 1.02; margin: 0 0 14px; letter-spacing: -0.02em; color: #fff; }
      .wb-h2 { font-size: clamp(28px, 3.6vw, 42px); font-weight: 800; line-height: 1.14; margin: 0 0 14px; letter-spacing: -0.01em; }
      .wb-accent { color: var(--orange); }
      .wb-sub { font-size: 17px; line-height: 1.6; color: var(--slate); max-width: 640px; margin: 0 0 8px; }
      .wb-section-head { max-width: 720px; margin-bottom: 52px; }
      .wb-section-head.wb-center { margin-left: auto; margin-right: auto; }
      .wb-section-head .wb-sub { margin-left: 0; }
      .wb-center .wb-sub { margin-left: auto; margin-right: auto; }

      /* Buttons */
      .wb-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: none; border-radius: 12px; font-weight: 700; transition: transform .15s, box-shadow .15s, background .15s; white-space: nowrap; }
      .wb-btn-primary { background: linear-gradient(135deg, ${ORANGE}, ${AMBER}); color: #fff; box-shadow: 0 8px 20px rgba(249,115,22,0.28); }
      .wb-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(249,115,22,0.36); }
      .wb-btn-ghost { background: rgba(255,255,255,0.08); color: #fff; border: 1.5px solid rgba(255,255,255,0.28); }
      .wb-btn-ghost:hover { background: rgba(255,255,255,0.16); }
      .wb-btn-sm { padding: 9px 16px; font-size: 13.5px; }
      .wb-btn-lg { padding: 15px 26px; font-size: 15.5px; }

      /* Nav */
      .wb-nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); border-bottom: 1px solid transparent; transition: border-color .2s, background .2s; }
      .wb-nav-scrolled { background: rgba(255,255,255,0.92); border-bottom-color: var(--line); }
      .wb-nav-inner { max-width: 1180px; margin: 0 auto; padding: 16px 28px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
      .wb-logo { display: flex; align-items: center; gap: 9px; font-weight: 800; font-size: 17px; color: var(--ink); font-family: 'Plus Jakarta Sans', sans-serif; }
      .wb-logo-mark { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 9px; background: linear-gradient(135deg, ${ORANGE}, ${AMBER}); color: #fff; }
      .wb-logo-sm { font-size: 15px; }
      .wb-nav-links { display: flex; gap: 26px; font-size: 14.5px; font-weight: 600; color: var(--slate); }
      .wb-nav-links a:hover { color: var(--orange); }
      .wb-nav-actions { display: flex; align-items: center; gap: 10px; }
      .wb-btn-login { background: transparent; color: var(--ink); border: 1.5px solid var(--line); }
      .wb-btn-login:hover { border-color: var(--orange); color: var(--orange); }

      /* Hero */
      .wb-hero { position: relative; background: radial-gradient(120% 140% at 15% 0%, #1e293b 0%, ${INK} 55%, #0b1120 100%); padding: 90px 0 110px; overflow: hidden; }
      .wb-hero-glow { position: absolute; inset: 0; background: radial-gradient(600px 400px at 78% 18%, rgba(249,115,22,0.28), transparent 60%); pointer-events: none; }
      .wb-hero-inner { position: relative; max-width: 1180px; margin: 0 auto; padding: 0 28px; display: grid; grid-template-columns: 1.05fr 1fr; gap: 56px; align-items: center; }
      .wb-hero-tag { font-size: clamp(19px, 2.4vw, 24px); font-weight: 700; color: #e2e8f0; margin: 0 0 16px; }
      .wb-hero-sub { font-size: 16px; line-height: 1.65; color: #94a3b8; max-width: 480px; margin: 0 0 30px; }
      .wb-hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 40px; }
      .wb-hero-stats { display: flex; gap: 34px; }
      .wb-hero-stats div { display: flex; flex-direction: column; gap: 2px; }
      .wb-hero-stats strong { font-size: 22px; font-weight: 800; color: #fff; }
      .wb-hero-stats span { font-size: 12.5px; color: #94a3b8; }

      /* Hero canvas mock */
      .wb-hero-canvas { background: #fff; border-radius: 18px; box-shadow: 0 30px 70px rgba(0,0,0,0.45); overflow: hidden; border: 1px solid rgba(255,255,255,0.08); animation: wbFloat 6s ease-in-out infinite; }
      @keyframes wbFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      .wb-hero-canvas-topbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--line); background: #fafafa; }
      .wb-hero-canvas-title { display: flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 700; color: var(--ink); }
      .wb-hero-canvas-status { display: flex; align-items: center; gap: 8px; }
      .wb-live-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 10.5px; font-weight: 800; letter-spacing: .04em; color: #16a34a; background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); padding: 4px 9px; border-radius: 999px; }
      .wb-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; animation: wbPulse 1.6s infinite; }
      @keyframes wbPulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .5; transform: scale(1.4); } }
      .wb-saved-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px; font-weight: 700; color: #16a34a; background: rgba(34,197,94,0.08); padding: 4px 8px; border-radius: 999px; }
      .wb-saved-pill-lg { font-size: 12px; padding: 6px 12px; }
      .wb-hero-canvas-body { position: relative; display: flex; }
      .wb-hero-toolbar { display: flex; flex-direction: column; gap: 6px; padding: 12px 8px; border-right: 1px solid var(--line); background: #fcfcfd; }
      .wb-hero-tool { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 8px; color: var(--slate); opacity: 0; animation: wbFadeIn .5s forwards; }
      .wb-hero-tool-active { background: rgba(249,115,22,0.12); color: var(--orange); }
      @keyframes wbFadeIn { to { opacity: 1; } }
      .wb-hero-svg { flex: 1; width: 100%; height: 300px; display: block; background: #fff; }
      .wb-hero-cursor { position: absolute; left: 60%; top: 30%; display: flex; flex-direction: column; align-items: flex-start; animation: wbCursorMove 5s ease-in-out infinite; filter: drop-shadow(0 2px 3px rgba(0,0,0,.25)); }
      .wb-hero-cursor-name { background: #111827; color: #fff; font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 4px; margin-top: -2px; margin-left: 12px; }
      @keyframes wbCursorMove { 0% { left: 12%; top: 18%; } 25% { left: 40%; top: 42%; } 50% { left: 66%; top: 26%; } 75% { left: 78%; top: 60%; } 100% { left: 12%; top: 18%; } }

      /* Draw-on-scroll svg animation utilities */
      .wb-draw-line { stroke-dasharray: 1; stroke-dashoffset: 1; animation: wbDraw 0.9s ease forwards; }
      @keyframes wbDraw { to { stroke-dashoffset: 0; } }
      .wb-draw-fill { opacity: 0; animation: wbFadeIn 0.5s ease forwards; }
      .wb-fade { opacity: 0; animation: wbFadeIn 0.5s ease forwards; }
      .wb-fill-blue { fill: ${BLUE}22; } .wb-stroke-blue { stroke: ${BLUE}; fill: none; }
      .wb-fill-orange { fill: ${ORANGE}22; } .wb-stroke-orange { stroke: ${ORANGE}; fill: none; }
      .wb-fill-green { fill: ${GREEN}22; } .wb-stroke-green { stroke: ${GREEN}; fill: none; }
      .wb-stroke-muted { stroke: #94a3b8; fill: none; }
      .wb-stroke-purple { stroke: ${PURPLE}; fill: none; }
      .wb-stroke-pink { stroke: ${PINK}; fill: none; }
      .wb-stroke-cyan { stroke: ${CYAN}; fill: none; }
      .wb-stroke-amber { stroke: ${AMBER}; fill: none; }
      .wb-stroke-slate { stroke: ${SLATE}; fill: none; }
      .wb-stroke-red { stroke: ${RED}; fill: none; }
      .wb-svg-label { font-size: 13px; font-weight: 700; fill: var(--ink); }
      .wb-svg-label-sm { font-size: 11px; font-weight: 600; fill: var(--ink); }
      .wb-svg-label-xs { font-size: 9px; font-weight: 500; fill: var(--slate); }
      .wb-pen-tip { animation: wbPenMove 3s ease-in-out forwards; opacity: 0; animation-fill-mode: forwards; }
      .wb-pen-tip circle { animation: wbFadeIn .2s forwards; }
      @keyframes wbPenMove {
        0% { opacity: 0; transform: translate(300px, 90px); }
        5% { opacity: 1; }
        30% { transform: translate(330px, 40px); }
        60% { transform: translate(420px, 70px); }
        95% { transform: translate(486px, 66px); }
        100% { opacity: 1; transform: translate(486px, 66px); }
      }

      /* Tools section */
      .wb-tool-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 18px; }
      .wb-tool-card { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 16px; transition: transform .2s, box-shadow .2s; }
      .wb-tool-card:hover { transform: translateY(-4px); box-shadow: 0 14px 28px rgba(15,23,42,0.08); }
      .wb-tool-demo-svg { width: 100%; height: 90px; display: block; }
      .wb-tool-card-foot { display: flex; align-items: center; gap: 7px; margin-top: 10px; font-size: 13.5px; font-weight: 700; color: var(--ink); }
      .wb-tool-icon { display: inline-flex; color: var(--orange); }
      .wb-marquee { animation: wbMarquee 2.4s ease-in-out infinite; }
      @keyframes wbMarquee { 0%,100% { stroke-dashoffset: 0; } 50% { stroke-dashoffset: 14; } }
      .wb-pan-group { animation: wbPan 2.6s ease-in-out infinite; }
      @keyframes wbPan { 0%,100% { transform: translate(0,0); } 50% { transform: translate(6px,-4px); } }
      .wb-highlight-sweep { animation: wbSweep 1.8s ease-in-out infinite; }
      @keyframes wbSweep { 0% { width: 0; } 60% { width: 90px; } 100% { width: 90px; } }
      .wb-eraser-move { animation: wbEraserMove 2.2s ease-in-out infinite; }
      @keyframes wbEraserMove { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-30px, 8px); } }

      /* Content creation */
      .wb-content-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 20px; }
      .wb-content-card { background: #fff; border: 1px solid var(--line); border-radius: 16px; overflow: hidden; transition: transform .2s, box-shadow .2s; }
      .wb-content-card:hover { transform: translateY(-4px); box-shadow: 0 14px 28px rgba(15,23,42,0.08); }
      .wb-mini-canvas { position: relative; height: 110px; background: repeating-linear-gradient(0deg, rgba(15,23,42,0.03) 0 1px, transparent 1px 20px), repeating-linear-gradient(90deg, rgba(15,23,42,0.03) 0 1px, transparent 1px 20px); display: flex; align-items: center; justify-content: center; }
      .wb-typing-text { font-size: 14px; font-weight: 600; color: var(--ink); overflow: hidden; white-space: nowrap; border-right: 2px solid transparent; animation: wbTyping 2.4s steps(22) infinite; }
      @keyframes wbTyping { 0%,10% { width: 0; } 60%,85% { width: 21ch; } 100% { width: 21ch; } }
      .wb-caret { display: none; }
      .wb-equation-box { font-size: 22px; font-style: italic; font-weight: 700; color: var(--ink); font-family: 'Georgia', serif; }
      .wb-sticky { background: #fde68a; color: #78350f; padding: 14px 16px; border-radius: 3px; font-size: 13px; font-weight: 700; box-shadow: 0 8px 16px rgba(0,0,0,0.12); transform: rotate(-3deg); }
      .wb-sticky-pop { animation: wbPop 2.4s ease-in-out infinite; }
      @keyframes wbPop { 0%,100% { transform: rotate(-3deg) scale(1); } 50% { transform: rotate(-1deg) scale(1.04); } }
      .wb-comment-pin { position: absolute; top: 20px; left: 30%; width: 24px; height: 24px; border-radius: 50% 50% 50% 4px; background: var(--orange); color: #fff; display: flex; align-items: center; justify-content: center; transform: rotate(45deg); animation: wbBounceIn .5s; }
      .wb-comment-pin svg { transform: rotate(-45deg); }
      .wb-comment-bubble { position: absolute; bottom: 16px; right: 12px; background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 8px 10px; font-size: 11px; font-weight: 600; color: var(--ink); box-shadow: 0 6px 14px rgba(0,0,0,0.08); max-width: 150px; }
      @keyframes wbBounceIn { 0% { transform: rotate(45deg) scale(0); } 70% { transform: rotate(45deg) scale(1.15); } 100% { transform: rotate(45deg) scale(1); } }
      .wb-frame-demo { position: relative; width: 130px; height: 78px; border: 2px solid ${INDIGO}; border-radius: 6px; background: #fff; }
      .wb-frame-label { position: absolute; top: -20px; left: 0; font-size: 10px; font-weight: 700; color: ${INDIGO}; }
      .wb-frame-shape { position: absolute; inset: 14px; border-radius: 4px; background: ${INDIGO}18; animation: wbFadeIn 1s ease forwards; }
      .wb-image-demo { width: 90px; height: 68px; border-radius: 8px; background: linear-gradient(135deg,#e2e8f0,#cbd5e1); display: flex; align-items: center; justify-content: center; color: var(--muted); animation: wbFloat 3s ease-in-out infinite; }
      .wb-content-card-body { padding: 16px 18px 18px; }
      .wb-content-card-title { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 14px; margin-bottom: 6px; color: var(--ink); }
      .wb-content-card-body p { font-size: 13px; color: var(--slate); line-height: 1.5; margin: 0; }

      /* Shapes */
      .wb-shape-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 14px; }
      .wb-shape-card { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 22px 10px; background: #fff; border: 1px solid var(--line); border-radius: 14px; transition: transform .2s, border-color .2s; }
      .wb-shape-card:hover { transform: translateY(-3px); border-color: var(--orange); }
      .wb-shape-draw { display: inline-flex; color: var(--orange); opacity: 0; transform: scale(0.5) rotate(-8deg); animation: wbShapePop .6s cubic-bezier(.22,1.4,.4,1) forwards; animation-delay: inherit; }
      @keyframes wbShapePop { to { opacity: 1; transform: scale(1) rotate(0); } }
      .wb-shape-label { font-size: 12.5px; font-weight: 700; color: var(--ink); }

      /* Diagramming */
      .wb-diagram-layout { display: grid; grid-template-columns: 260px 1fr; gap: 28px; align-items: start; }
      .wb-diagram-list { display: flex; flex-direction: column; gap: 8px; position: sticky; top: 90px; }
      .wb-diagram-pill { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 11px; border: 1px solid var(--line); background: #fff; font-size: 13.5px; font-weight: 700; color: var(--slate); text-align: left; transition: all .15s; }
      .wb-diagram-pill svg { color: var(--pill-color); }
      .wb-diagram-pill:hover { border-color: var(--pill-color); }
      .wb-diagram-pill-active { background: color-mix(in srgb, var(--pill-color) 12%, white); border-color: var(--pill-color); color: var(--ink); }
      .wb-diagram-preview, .wb-uen-canvas { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 20px; min-height: 300px; display: flex; align-items: center; justify-content: center; }
      .wb-diagram-svg { width: 100%; height: auto; }

      /* Flowchart showcase */
      .wb-flow-showcase { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 20px; overflow-x: auto; }
      .wb-flow-big { min-width: 780px; }
      .wb-flow-legend { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
      .wb-flow-legend-item { font-size: 12.5px; font-weight: 700; color: var(--slate); background: #fff; border: 1px solid var(--line); padding: 6px 12px; border-radius: 999px; }

      /* Tabs */
      .wb-tabs { display: inline-flex; gap: 4px; background: #eef1f5; padding: 5px; border-radius: 12px; margin-bottom: 28px; }
      .wb-tab { padding: 9px 18px; border-radius: 8px; border: none; background: transparent; font-weight: 700; font-size: 13.5px; color: var(--slate); }
      .wb-tab-active { background: #fff; color: var(--ink); box-shadow: 0 2px 8px rgba(15,23,42,0.1); }
      .wb-uen-grid { display: grid; grid-template-columns: 1fr 220px; gap: 24px; }
      .wb-uen-list { display: flex; flex-direction: column; gap: 10px; align-content: flex-start; }
      .wb-uen-chip { padding: 12px 14px; border-radius: 10px; font-weight: 700; font-size: 13.5px; background: color-mix(in srgb, var(--chip-color) 12%, white); color: var(--ink); border: 1px solid color-mix(in srgb, var(--chip-color) 35%, white); }

      /* Mind map */
      .wb-mindmap-showcase { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 20px; }
      .wb-pulse-ring { animation: wbFadeIn .6s forwards, wbRingPulse 2.4s 1s infinite; }
      @keyframes wbRingPulse { 0%,100% { filter: drop-shadow(0 0 0 rgba(245,158,11,0)); } 50% { filter: drop-shadow(0 0 10px rgba(245,158,11,0.35)); } }

      /* DSA */
      .wb-dsa-canvas { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 20px; }

      /* Templates */
      .wb-templates-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 8px; }
      .wb-carousel-arrows { display: flex; gap: 8px; margin-bottom: 52px; }
      .wb-carousel-arrows button { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--line); background: #fff; display: flex; align-items: center; justify-content: center; color: var(--ink); }
      .wb-carousel-arrows button:hover { border-color: var(--orange); color: var(--orange); }
      .wb-template-track { display: flex; gap: 18px; overflow-x: auto; padding: 6px 6px 18px; scroll-snap-type: x mandatory; scrollbar-width: thin; }
      .wb-template-card { scroll-snap-align: start; flex: 0 0 230px; background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 18px; transition: transform .2s, box-shadow .2s; }
      .wb-template-card:hover { transform: translateY(-5px); box-shadow: 0 16px 30px rgba(15,23,42,0.1); }
      .wb-template-thumb { height: 90px; border-radius: 12px; background: color-mix(in srgb, var(--tc) 14%, white); color: var(--tc); display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
      .wb-template-title { font-weight: 700; font-size: 14.5px; color: var(--ink); }
      .wb-template-cat { font-size: 12px; color: var(--muted); margin-top: 2px; }
      .wb-template-cta { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; font-size: 12.5px; font-weight: 700; color: var(--orange); background: none; border: none; padding: 0; }
      .wb-template-card:hover .wb-template-cta { text-decoration: underline; }

      /* Management dashboard */
      .wb-dash-mock { display: grid; grid-template-columns: 200px 1fr; border: 1px solid var(--line); border-radius: 18px; overflow: hidden; background: #fff; box-shadow: 0 20px 45px rgba(15,23,42,0.06); }
      .wb-dash-sidebar { background: #fafafa; border-right: 1px solid var(--line); padding: 16px 10px; display: flex; flex-direction: column; gap: 3px; }
      .wb-dash-side-item { display: flex; align-items: center; gap: 9px; padding: 9px 10px; border-radius: 8px; font-size: 13px; font-weight: 600; color: var(--slate); }
      .wb-dash-side-active { background: rgba(249,115,22,0.1); color: var(--orange); }
      .wb-dash-main { padding: 20px; }
      .wb-dash-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 18px; }
      .wb-dash-search { flex: 1; display: flex; align-items: center; gap: 8px; padding: 9px 12px; border: 1px solid var(--line); border-radius: 9px; color: var(--muted); font-size: 13px; }
      .wb-dash-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; }
      .wb-dash-card { border: 1px solid var(--line); border-radius: 12px; padding: 12px; opacity: 0; animation: wbFadeIn .5s forwards; }
      .wb-dash-card-thumb { position: relative; height: 64px; border-radius: 8px; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
      .wb-dash-star { position: absolute; top: 6px; right: 6px; }
      .wb-dash-card-title { font-size: 12.5px; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
      .wb-dash-card-meta { font-size: 11px; color: var(--muted); margin-bottom: 8px; }
      .wb-dash-card-actions { display: flex; gap: 8px; color: var(--muted); }

      /* Collaboration */
      .wb-collab-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
      .wb-collab-card { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 20px; }
      .wb-collab-card-head { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 14px; margin-bottom: 14px; color: var(--ink); }
      .wb-collab-canvas { min-height: 92px; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 10px; position: relative; }
      .wb-collab-canvas p { font-size: 12.5px; color: var(--slate); line-height: 1.5; margin: 0; }
      .wb-comment-pin-static { position: static; transform: rotate(0); animation: none; }
      .wb-comment-pin-static svg { transform: none; }
      .wb-comment-bubble-static { position: static; max-width: none; }
      .wb-avatar-stack { display: flex; }
      .wb-avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--orange); color: #fff; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; margin-left: -8px; }
      .wb-avatar:first-child { margin-left: 0; }
      .wb-avatar:nth-child(2) { background: ${BLUE}; }
      .wb-avatar:nth-child(3) { background: ${GREEN}; }
      .wb-avatar:nth-child(4) { background: var(--muted); }

      /* Canvas controls */
      .wb-controls-mock { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 24px; }
      .wb-controls-canvas { height: 220px; border-radius: 12px; background: repeating-linear-gradient(0deg, rgba(15,23,42,0.03) 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, rgba(15,23,42,0.03) 0 1px, transparent 1px 22px); display: flex; align-items: center; justify-content: center; margin-bottom: 18px; overflow: hidden; }
      .wb-controls-canvas-inner { transform: scale(var(--z)); transition: transform .25s ease; }
      .wb-controls-bar { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
      .wb-controls-bar button { width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--line); background: #fff; display: flex; align-items: center; justify-content: center; color: var(--slate); }
      .wb-controls-bar button:hover { border-color: var(--orange); color: var(--orange); }
      .wb-zoom-readout { font-size: 12.5px; font-weight: 700; width: 44px; text-align: center; color: var(--ink); }
      .wb-controls-divider { width: 1px; height: 22px; background: var(--line); margin: 0 6px; }

      /* Present mode */
      .wb-present-mock { position: relative; background: #0f172a; border-radius: 18px; overflow: hidden; height: 320px; transition: all .5s ease; }
      .wb-present-chrome { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
      .wb-present-toolbar { position: absolute; top: 14px; left: 14px; display: flex; gap: 8px; background: rgba(255,255,255,0.08); padding: 8px 10px; border-radius: 10px; color: #cbd5e1; }
      .wb-present-sidebar { position: absolute; top: 0; right: 0; bottom: 0; width: 70px; background: rgba(255,255,255,0.04); border-left: 1px solid rgba(255,255,255,0.08); }
      .wb-present-canvas { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; transition: all .5s ease; }
      .wb-present-toggle { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); z-index: 3; background: var(--orange); color: #fff; border: none; padding: 10px 18px; border-radius: 999px; font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; gap: 7px; }
      .wb-present-active .wb-present-canvas { background: #0f172a; }

      /* Light / dark */
      .wb-theme-mock { border-radius: 18px; overflow: hidden; border: 1px solid var(--line); background: #fff; transition: background .5s ease, border-color .5s ease; }
      .wb-theme-topbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; font-size: 13px; font-weight: 700; color: var(--ink); border-bottom: 1px solid var(--line); transition: color .5s, border-color .5s; }
      .wb-theme-toggle { width: 30px; height: 30px; border-radius: 8px; border: 1px solid var(--line); background: #fff; display: flex; align-items: center; justify-content: center; color: var(--ink); }
      .wb-theme-canvas { height: 220px; background: #fff; transition: background .5s ease; position: relative; }
      .wb-theme-canvas svg { width: 100%; height: 100%; }
      .wb-theme-dark { background: #0f172a; border-color: rgba(255,255,255,0.1); }
      .wb-theme-dark .wb-theme-topbar { color: #f1f5f9; border-color: rgba(255,255,255,0.1); }
      .wb-theme-dark .wb-theme-toggle { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.15); color: #f1f5f9; }
      .wb-theme-dark .wb-theme-canvas { background: #0f172a; }

      /* Final CTA */
      .wb-final-cta { background: radial-gradient(120% 160% at 50% 0%, #1e293b, ${INK} 60%); padding: 110px 0; }
      .wb-final-h2 { color: #fff; }
      .wb-final-cta .wb-sub { color: #94a3b8; margin-left: auto; margin-right: auto; }
      .wb-final-cta .wb-btn { margin-top: 12px; }

      /* Footer */
      .wb-footer { padding: 28px 0; border-top: 1px solid var(--line); }
      .wb-footer-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
      .wb-footer-copy { font-size: 13px; color: var(--muted); }

      /* ── Responsive ─────────────────────────────────────────────────────── */
      @media (max-width: 1080px) {
        .wb-hero-inner { grid-template-columns: 1fr; }
        .wb-hero-visual { order: -1; }
        .wb-diagram-layout { grid-template-columns: 1fr; }
        .wb-diagram-list { position: static; flex-direction: row; flex-wrap: wrap; }
        .wb-uen-grid { grid-template-columns: 1fr; }
        .wb-uen-list { flex-direction: row; flex-wrap: wrap; }
      }
      @media (max-width: 900px) {
        .wb-dash-mock { grid-template-columns: 1fr; }
        .wb-dash-sidebar { flex-direction: row; overflow-x: auto; border-right: none; border-bottom: 1px solid var(--line); }
      }
      @media (max-width: 720px) {
        .wb-nav-links { display: none; }
        .wb-section { padding: 64px 0; }
        .wb-container { padding: 0 20px; }
        .wb-hero { padding: 56px 0 72px; }
        .wb-hero-ctas { flex-direction: column; }
        .wb-hero-ctas .wb-btn { width: 100%; }
        .wb-hero-stats { gap: 22px; flex-wrap: wrap; }
        .wb-templates-head { flex-direction: column; align-items: flex-start; }
        .wb-carousel-arrows { display: none; }
        .wb-section-head { margin-bottom: 34px; }
        .wb-flow-legend { justify-content: flex-start; }
        .wb-present-mock { height: 260px; }
      }
      @media (max-width: 480px) {
        .wb-h1 { font-size: 44px; }
        .wb-hero-canvas-body { flex-direction: column; }
        .wb-hero-toolbar { flex-direction: row; border-right: none; border-bottom: 1px solid var(--line); overflow-x: auto; }
        .wb-hero-svg { height: 220px; }
        .wb-tool-grid, .wb-content-grid { grid-template-columns: 1fr 1fr; }
        .wb-shape-grid { grid-template-columns: repeat(3, 1fr); }
      }
    `}</style>
  );
}