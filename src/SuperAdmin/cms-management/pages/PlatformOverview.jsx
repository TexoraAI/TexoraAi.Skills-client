import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  Image as ImageIcon,
  Plus,
  RotateCcw,
  Save,
  Search,
  ArrowUp,
  ArrowDown,
  Trash2,
  LayoutGrid,
  TrendingUp,
  Sparkles,
  Briefcase,
  Target,
  Users,
  Trophy,
  Zap,
  Award,
  BookOpen,
  GraduationCap,
  Heart,
  Lightbulb,
  ClipboardList,
  Star,
  Clock,
  Link2,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════
   Design tokens (matches ILM ORA design system)
═══════════════════════════════════════════════════════════════ */
const INK = "#1E293B";
const ORANGE = "#F97316";
const CREAM = "#F6EDE6";
const VIOLET = "#7C3AED";
const VIOLET_DARK = "#6D28D9";

/* Icon library used across Feature / Career cards — same set as the mockup */
const ICONS = {
  target: Target,
  users: Users,
  trophy: Trophy,
  zap: Zap,
  award: Award,
  bookopen: BookOpen,
  gradcap: GraduationCap,
  heart: Heart,
  bulb: Lightbulb,
  clipboard: ClipboardList,
  star: Star,
  clock: Clock,
  trending: TrendingUp,
  sparkles: Sparkles,
  briefcase: Briefcase,
};

function IconGlyph({ name, className = "w-4 h-4", stroke = "#fff" }) {
  const Cmp = ICONS[name] || ICONS.star;
  return <Cmp className={className} style={{ color: stroke }} strokeWidth={2} />;
}

/* ══════════════════════════════════════════════════════════════
   Theme hook — same pattern as FeaturedProgramsList.jsx
   (reads the `dark` class on <html>, tracks live toggles)
═══════════════════════════════════════════════════════════════ */
function useThemeMode() {
  const [dark, setDark] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark"))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

/* ══════════════════════════════════════════════════════════════
   Small shared UI pieces (all theme-aware via a `dark` prop)
═══════════════════════════════════════════════════════════════ */
function StatCard({ tone, icon: Icon, value, label, dark }) {
  const tones = {
    blue: {
      bg: dark ? "rgba(37,99,235,0.12)" : "#EFF6FF",
      stroke: dark ? "#60A5FA" : "#2563EB",
      iconBg: dark ? "#0f172a" : "#fff",
    },
    green: {
      bg: dark ? "rgba(5,150,105,0.12)" : "#ECFDF5",
      stroke: dark ? "#34D399" : "#059669",
      iconBg: dark ? "#0f172a" : "#fff",
    },
    red: {
      bg: dark ? "rgba(220,38,38,0.12)" : "#FEF2F2",
      stroke: dark ? "#F87171" : "#DC2626",
      iconBg: dark ? "#0f172a" : "#fff",
    },
    purple: {
      bg: dark ? "rgba(124,58,237,0.14)" : "#F5F3FF",
      stroke: dark ? "#A78BFA" : "#7C3AED",
      iconBg: dark ? "#0f172a" : "#fff",
    },
    yellow: {
      bg: dark ? "rgba(217,119,6,0.14)" : "#FFFBEB",
      stroke: dark ? "#FBBF24" : "#D97706",
      iconBg: dark ? "#0f172a" : "#fff",
    },
  };
  const t = tones[tone] || tones.blue;
  return (
    <div className="rounded-2xl p-[18px] flex items-center gap-3" style={{ background: t.bg }}>
      <div
        className="w-[42px] h-[42px] rounded-full shadow-sm flex items-center justify-center flex-shrink-0"
        style={{ background: t.iconBg }}
      >
        <Icon className="w-[19px] h-[19px]" style={{ color: t.stroke }} strokeWidth={2} />
      </div>
      <div>
        <div className="text-[22px] font-extrabold leading-none" style={{ color: dark ? "#F1F5F9" : INK }}>
          {value}
        </div>
        <div className={`text-[12.5px] font-semibold mt-[3px] ${dark ? "text-slate-400" : "text-slate-500"}`}>
          {label}
        </div>
      </div>
    </div>
  );
}

function Panel({ title, badge, hint, children, dark }) {
  return (
    <div
      className={`border-[1.5px] rounded-2xl p-[18px] mb-4 last:mb-0 ${
        dark ? "border-white/8 bg-white/[0.03]" : "border-slate-200 bg-[#FAFBFC]"
      }`}
    >
      {title && (
        <h3
          className="m-0 mb-1 text-[13.5px] font-extrabold flex items-center gap-2"
          style={{ color: dark ? "#F1F5F9" : INK }}
        >
          {title}
          {badge && (
            <span
              className="text-[9.5px] font-extrabold uppercase tracking-wide px-2 py-[2px] rounded-full border"
              style={
                dark
                  ? { color: "#C4B5FD", background: "rgba(124,58,237,0.15)", borderColor: "rgba(196,181,253,0.25)" }
                  : { color: VIOLET, background: "#F5F3FF", borderColor: "#E9D5FF" }
              }
            >
              {badge}
            </span>
          )}
        </h3>
      )}
      {hint && (
        <p className={`text-[12px] mt-[2px] mb-3 leading-relaxed ${dark ? "text-slate-500" : "text-slate-400"}`}>
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

function Field({ label, children, dark }) {
  return (
    <div className="mb-3 last:mb-0">
      {label && (
        <label
          className={`block text-[10.5px] font-extrabold uppercase tracking-wide mb-1.5 ${
            dark ? "text-slate-500" : "text-slate-400"
          }`}
        >
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

function getInputCls(dark) {
  return dark
    ? "w-full px-3 py-[9px] rounded-lg border-[1.5px] border-white/10 text-[13px] outline-none bg-white/[0.04] text-slate-100 placeholder-slate-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition"
    : "w-full px-3 py-[9px] rounded-lg border-[1.5px] border-slate-200 text-[13px] outline-none bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition";
}

function ColorField({ label, value, onChange, dark }) {
  const inputCls = getInputCls(dark);
  return (
    <Field label={label} dark={dark}>
      <div className="flex items-center gap-2.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-10 h-9 p-[2px] rounded-lg border-[1.5px] cursor-pointer ${
            dark ? "border-white/10 bg-transparent" : "border-slate-200"
          }`}
        />
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => {
            const hex = e.target.value.trim();
            if (/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(hex)) {
              onChange(hex.length === 4 ? "#" + [...hex.slice(1)].map((c) => c + c).join("") : hex);
            }
          }}
          className={inputCls}
          style={{ maxWidth: 110 }}
        />
      </div>
    </Field>
  );
}

function IconBtn({ children, onClick, disabled, danger = true, dark }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 disabled:opacity-30 disabled:cursor-default ${
        dark ? "text-slate-500 hover:bg-white/[0.06]" : "text-slate-400 hover:bg-slate-100"
      } ${danger ? (dark ? "hover:text-red-400" : "hover:text-red-600") : dark ? "hover:text-violet-400" : "hover:text-violet-600"}`}
    >
      {children}
    </button>
  );
}

function Btn({ variant = "outline", onClick, children, dark }) {
  const base = "inline-flex items-center gap-[7px] font-bold text-[13.5px] px-[18px] py-[10px] rounded-[11px] transition";
  if (variant === "primary")
    return (
      <button
        onClick={onClick}
        className={`${base} text-white`}
        style={{ background: VIOLET, boxShadow: "0 6px 16px rgba(124,58,237,.3)" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = VIOLET_DARK)}
        onMouseLeave={(e) => (e.currentTarget.style.background = VIOLET)}
      >
        {children}
      </button>
    );
  if (variant === "dark")
    return (
      <button
        onClick={onClick}
        className={`${base} text-white ${dark ? "bg-violet-600 hover:bg-violet-700" : "bg-[#1E293B] hover:bg-slate-700"}`}
      >
        {children}
      </button>
    );
  return (
    <button
      onClick={onClick}
      className={`${base} ${
        dark
          ? "bg-white/[0.04] border-[1.5px] border-white/10 text-slate-300 hover:bg-white/[0.08]"
          : "bg-white border-[1.5px] border-slate-200 text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function LandingBanner({ text, pillText, dark }) {
  return (
    <div
      className="rounded-2xl px-5 py-4 flex items-center justify-between gap-3.5 text-white flex-wrap"
      style={{
        background: dark
          ? `linear-gradient(90deg, #4c1d95, #6d28d9)`
          : `linear-gradient(90deg, ${VIOLET}, #9333EA)`,
      }}
    >
      <div className="flex items-start gap-2.5">
        <Link2 className="w-[17px] h-[17px] mt-[2px] flex-shrink-0" />
        <p className="m-0 text-[13px] leading-relaxed">
          <b>Landing Page Connection —</b> {text}
        </p>
      </div>
      <span className="flex-shrink-0 bg-white/[.18] border border-white/30 text-[11.5px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
        {pillText}
      </span>
    </div>
  );
}

function PreviewFrame({ label, deviceToggle, children, dark }) {
  return (
    <div
      className={`border rounded-2xl overflow-hidden ${dark ? "border-white/10" : "border-slate-200"}`}
      style={{ background: dark ? "#0b0b16" : CREAM }}
    >
      <div
        className={`flex items-center justify-between px-3.5 py-2.5 border-b ${
          dark ? "bg-white/[0.03] border-white/8" : "bg-white border-slate-200"
        }`}
      >
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-300" />
          <span className="w-2 h-2 rounded-full bg-yellow-300" />
          <span className="w-2 h-2 rounded-full bg-green-300" />
        </div>
        <div className={`text-[11px] font-bold ${dark ? "text-slate-500" : "text-slate-400"}`}>{label}</div>
        {deviceToggle || <div className="w-10" />}
      </div>
      {children}
    </div>
  );
}

function SearchRow({ value, onChange, placeholder, extra, count, dark }) {
  return (
    <div
      className={`flex items-center gap-2.5 border rounded-2xl px-4 py-[11px] mb-5 ${
        dark ? "bg-white/[0.03] border-white/10" : "bg-white border-slate-200"
      }`}
    >
      <Search className={`w-4 h-4 flex-shrink-0 ${dark ? "text-slate-500" : "text-slate-400"}`} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`border-none outline-none flex-1 text-[13.5px] bg-transparent ${
          dark ? "text-slate-100 placeholder-slate-600" : ""
        }`}
      />
      {extra}
      <span className={`text-[12px] font-semibold whitespace-nowrap ${dark ? "text-slate-500" : "text-slate-400"}`}>
        {count}
      </span>
    </div>
  );
}

function IconPicker({ currentIcon, onSelect, onClose, dark }) {
  const ref = useRef(null);
  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={`absolute top-[42px] left-0 z-[80] rounded-xl shadow-2xl p-2 w-[216px] grid grid-cols-6 gap-[5px] border ${
        dark ? "bg-[#14141f] border-white/10" : "bg-white border-slate-200"
      }`}
    >
      {Object.keys(ICONS).map((name) => {
        const selected = name === currentIcon;
        return (
          <button
            key={name}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(name);
            }}
            className={`w-[31px] h-[31px] rounded-lg flex items-center justify-center border-[1.5px] ${
              selected ? "border-violet-500" : dark ? "border-transparent hover:border-violet-500" : "border-transparent hover:border-violet-500"
            }`}
            style={{ background: selected ? INK : dark ? "#1e293b" : "#F1F5F9" }}
          >
            <IconGlyph name={name} className="w-[15px] h-[15px]" stroke={selected ? "#fff" : dark ? "#CBD5E1" : INK} />
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Tab bar
═══════════════════════════════════════════════════════════════ */
const TABS = [
  { key: "hero", label: "Hero Section", icon: Video },
  { key: "stats", label: "Stats Strip", icon: TrendingUp },
  { key: "features", label: "Why Choose Features", icon: Sparkles },
  { key: "career", label: "Career Support", icon: Briefcase },
];

function TabBar({ active, onChange, dark }) {
  return (
    <div
      className={`border-b px-6 flex gap-1 ${
        dark ? "bg-[#0f0f1a] border-white/8" : "bg-white border-slate-200"
      }`}
    >
      {TABS.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className="px-[18px] py-[14px] text-[13.5px] font-bold flex items-center gap-[7px] border-b-[2.5px] transition-colors"
            style={{
              color: isActive ? (dark ? "#A78BFA" : VIOLET) : dark ? "#64748B" : "#64748B",
              borderColor: isActive ? (dark ? "#A78BFA" : VIOLET) : "transparent",
            }}
          >
            <Icon className="w-[15px] h-[15px]" strokeWidth={2} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO SECTION TAB
═══════════════════════════════════════════════════════════════ */
function HeroTab({ showToast, dark }) {
  const inputCls = getInputCls(dark);
  const [heroMedia, setHeroMedia] = useState([]); // {type:'video'|'image', url, name}
  const [activeIndex, setActiveIndex] = useState(-1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [imgWidth, setImgWidth] = useState(100);
  const [imgHeight, setImgHeight] = useState(100);
  const [line1, setLine1] = useState("Empower Your");
  const [line2, setLine2] = useState("Learning Journey");
  const [split, setSplit] = useState(true);
  const [subText, setSubText] = useState(
    "Master in-demand skills through AI-powered learning, live sessions, certifications, and expert-led programs designed for students, professionals, trainers, and organizations."
  );
  const [badgeText, setBadgeText] = useState("Learn Smarter. Grow Faster. Lead the Future.");
  const [device, setDevice] = useState("desktop");
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const videoCount = heroMedia.filter((m) => m.type === "video").length;
  const imageCount = heroMedia.filter((m) => m.type === "image").length;

  const filtered = heroMedia
    .map((m, i) => ({ ...m, i }))
    .filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) &&
        (typeFilter === "All Types" ||
          (typeFilter === "Videos" && m.type === "video") ||
          (typeFilter === "Images" && m.type === "image"))
    );

  function handleUpload(files, type) {
    const list = Array.from(files || []);
    if (!list.length) return;
    const items = list.map((file) => ({ type, url: URL.createObjectURL(file), name: file.name }));
    setHeroMedia((prev) => {
      const next = [...prev, ...items];
      setActiveIndex(next.length - 1);
      return next;
    });
    showToast(list.length > 1 ? `${list.length} ${type}s added` : `"${list[0].name}" added`);
  }

  function moveItem(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= heroMedia.length) return;
    setHeroMedia((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setActiveIndex((cur) => (cur === i ? j : cur === j ? i : cur));
  }

  function removeItem(i) {
    setHeroMedia((prev) => prev.filter((_, idx) => idx !== i));
    setActiveIndex((cur) => {
      if (cur === i) return heroMedia.length - 1 > 0 ? Math.min(i, heroMedia.length - 2) : -1;
      if (cur > i) return cur - 1;
      return cur;
    });
  }

  const current = heroMedia[activeIndex];
  const titleText = dark ? "text-white" : "";
  const subTextCls = dark ? "text-slate-400" : "text-slate-500";
  const cardBg = dark ? "bg-white/[0.03] border-white/8" : "bg-white border-slate-200";
  const rowBaseCls = dark ? "border-white/8 bg-white/[0.02]" : "border-slate-200 bg-white";
  const rowActiveCls = dark ? "border-violet-500/60 bg-violet-500/[0.08]" : "border-violet-500 bg-violet-50";
  const dropCls = dark
    ? "border-2 border-dashed border-white/10 rounded-xl px-2.5 py-4 text-center cursor-pointer bg-white/[0.02] hover:border-violet-500/60 hover:bg-violet-500/[0.08] block"
    : "border-2 border-dashed border-slate-200 rounded-xl px-2.5 py-4 text-center cursor-pointer bg-white hover:border-violet-500 hover:bg-violet-50 block";

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-[22px]">
        <div>
          <h1 className="text-2xl font-extrabold m-0" style={{ color: dark ? "#F1F5F9" : INK }}>
            Hero Section Management
          </h1>
          <p className={`text-[13.5px] mt-1 mb-0 ${subTextCls}`}>
            Manage the homepage hero video, images, heading, subheading and split-text animation.
          </p>
        </div>
        <div className="flex gap-2.5 relative flex-wrap">
          <Btn dark={dark} onClick={() => window.confirm("Reset Hero Section changes?") && window.location.reload()}>
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </Btn>
          <div className="relative">
            <Btn variant="primary" dark={dark} onClick={() => setAddMenuOpen((o) => !o)}>
              <Plus className="w-3.5 h-3.5" /> Add Media
            </Btn>
            {addMenuOpen && (
              <div
                className={`absolute right-0 top-[calc(100%+6px)] rounded-xl shadow-xl p-1.5 w-[180px] z-40 border ${
                  dark ? "bg-[#14141f] border-white/10" : "bg-white border-slate-200"
                }`}
              >
                <button
                  onClick={() => {
                    videoInputRef.current?.click();
                    setAddMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 text-[13px] font-semibold rounded-lg ${
                    dark ? "text-slate-300 hover:bg-violet-500/10 hover:text-violet-300" : "text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                  }`}
                >
                  <Video className="w-[15px] h-[15px]" /> Add video(s)
                </button>
                <button
                  onClick={() => {
                    imageInputRef.current?.click();
                    setAddMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 text-[13px] font-semibold rounded-lg ${
                    dark ? "text-slate-300 hover:bg-violet-500/10 hover:text-violet-300" : "text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                  }`}
                >
                  <ImageIcon className="w-[15px] h-[15px]" /> Add image(s)
                </button>
              </div>
            )}
          </div>
          <Btn variant="dark" dark={dark} onClick={() => showToast("Hero section saved")}>
            <Save className="w-3.5 h-3.5" /> Save changes
          </Btn>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5">
        <StatCard dark={dark} tone="blue" icon={Video} value={videoCount} label="Videos" />
        <StatCard dark={dark} tone="green" icon={ImageIcon} value={imageCount} label="Images" />
        <StatCard dark={dark} tone="purple" icon={LayoutGrid} value={heroMedia.length} label="Total Slides" />
        <StatCard dark={dark} tone="yellow" icon={Sparkles} value={split ? "On" : "Off"} label="Split Text" />
      </div>

      <SearchRow
        dark={dark}
        value={search}
        onChange={setSearch}
        placeholder="Search media name…"
        count={`${filtered.length} of ${heroMedia.length} item${heroMedia.length === 1 ? "" : "s"}`}
        extra={
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={`border-[1.5px] rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold outline-none ${
              dark ? "border-white/10 bg-white/[0.04] text-slate-300" : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            <option>All Types</option>
            <option>Videos</option>
            <option>Images</option>
          </select>
        }
      />

      <div className={`border rounded-[18px] p-[22px] mb-5 ${cardBg}`}>
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-5 items-start">
          {/* Left: controls */}
          <div>
            <Panel dark={dark} title="Background Media" badge="Videos + Images" hint="Upload as many hero videos/images as needed, then reorder — that order plays live on the homepage.">
              <div className="grid grid-cols-2 gap-2.5">
                <label onClick={() => videoInputRef.current?.click()} className={dropCls}>
                  <Video className="w-[19px] h-[19px] mx-auto mb-1" style={{ color: dark ? "#A78BFA" : VIOLET }} />
                  <div className={`text-[12px] font-bold ${dark ? "text-slate-200" : ""}`}>Add video(s)</div>
                  <div className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>Select multiple</div>
                </label>
                <label onClick={() => imageInputRef.current?.click()} className={dropCls}>
                  <ImageIcon className="w-[19px] h-[19px] mx-auto mb-1" style={{ color: dark ? "#A78BFA" : VIOLET }} />
                  <div className={`text-[12px] font-bold ${dark ? "text-slate-200" : ""}`}>Add image(s)</div>
                  <div className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>Select multiple</div>
                </label>
              </div>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  handleUpload(e.target.files, "video");
                  e.target.value = "";
                }}
              />
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  handleUpload(e.target.files, "image");
                  e.target.value = "";
                }}
              />

              <div className="mt-3">
                {heroMedia.length === 0 ? (
                  <div className={`text-center py-[34px] px-3.5 text-[13px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
                    <LayoutGrid className={`w-[26px] h-[26px] mx-auto mb-2 ${dark ? "text-slate-700" : "text-slate-300"}`} />
                    No media yet — add a video or image above.
                  </div>
                ) : filtered.length === 0 ? (
                  <div className={`text-center py-[34px] px-3.5 text-[13px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
                    No results for this search / filter.
                  </div>
                ) : (
                  filtered.map((m) => (
                    <div
                      key={m.i}
                      className={`flex items-center gap-2 border-[1.5px] rounded-[10px] p-2 mb-2 ${
                        activeIndex === m.i ? rowActiveCls : rowBaseCls
                      }`}
                    >
                      <span className={`text-[11px] font-extrabold w-4 text-center flex-shrink-0 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                        {m.i + 1}
                      </span>
                      {m.type === "video" ? (
                        <div
                          className="w-[42px] h-8 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{ background: dark ? "rgba(124,58,237,0.15)" : "#F5F3FF" }}
                        >
                          <Video className="w-3.5 h-3.5" style={{ color: dark ? "#A78BFA" : VIOLET }} />
                        </div>
                      ) : (
                        <img src={m.url} className={`w-[42px] h-8 rounded-md object-cover flex-shrink-0 ${dark ? "bg-white/10" : "bg-slate-200"}`} />
                      )}
                      <button
                        onClick={() => setActiveIndex(m.i)}
                        className={`flex-1 min-w-0 text-left bg-transparent border-none text-[12px] font-semibold truncate ${
                          dark ? "text-slate-300 hover:text-violet-300" : "text-slate-700 hover:text-violet-600"
                        }`}
                      >
                        {m.name} <span className={dark ? "text-slate-500" : "text-slate-400"}>· {m.type}</span>
                      </button>
                      <IconBtn dark={dark} danger={false} disabled={m.i === 0} onClick={() => moveItem(m.i, -1)}>
                        <ArrowUp className="w-[13px] h-[13px]" />
                      </IconBtn>
                      <IconBtn dark={dark} danger={false} disabled={m.i === heroMedia.length - 1} onClick={() => moveItem(m.i, 1)}>
                        <ArrowDown className="w-[13px] h-[13px]" />
                      </IconBtn>
                      <IconBtn dark={dark} onClick={() => removeItem(m.i)}>
                        <Trash2 className="w-[13px] h-[13px]" />
                      </IconBtn>
                    </div>
                  ))
                )}
              </div>
            </Panel>

            <Panel dark={dark} title="Image Size & Fit">
              <Field dark={dark} label={null}>
                <div className="flex justify-between items-center mb-1.5">
                  <label className={`m-0 text-[13px] font-semibold ${dark ? "text-slate-300" : ""}`}>Image width</label>
                  <span className="text-[11px] font-bold" style={{ color: dark ? "#A78BFA" : VIOLET }}>
                    {imgWidth}%
                  </span>
                </div>
                <input type="range" min={30} max={100} value={imgWidth} onChange={(e) => setImgWidth(+e.target.value)} className="w-full accent-violet-600" />
              </Field>
              <Field dark={dark} label={null}>
                <div className="flex justify-between items-center mb-1.5">
                  <label className={`m-0 text-[13px] font-semibold ${dark ? "text-slate-300" : ""}`}>Image height</label>
                  <span className="text-[11px] font-bold" style={{ color: dark ? "#A78BFA" : VIOLET }}>
                    {imgHeight}%
                  </span>
                </div>
                <input type="range" min={30} max={100} value={imgHeight} onChange={(e) => setImgHeight(+e.target.value)} className="w-full accent-violet-600" />
              </Field>
            </Panel>

            <Panel dark={dark} title="Heading Text">
              <Field dark={dark} label="Line 1">
                <input type="text" value={line1} onChange={(e) => setLine1(e.target.value)} className={inputCls} />
              </Field>
              <Field dark={dark} label="Line 2 (accent color)">
                <input type="text" value={line2} onChange={(e) => setLine2(e.target.value)} className={inputCls} />
              </Field>
              <div className="flex justify-between items-center">
                <div>
                  <div className={`text-[13px] font-bold ${dark ? "text-slate-200" : ""}`}>Split-text animation</div>
                  <div className={`text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>Reveals heading char by char</div>
                </div>
                <input type="checkbox" checked={split} onChange={(e) => setSplit(e.target.checked)} />
              </div>
            </Panel>

            <Panel dark={dark} title="Subheading Text">
              <textarea value={subText} onChange={(e) => setSubText(e.target.value)} className={`${inputCls} min-h-[52px] resize-y`} />
            </Panel>

            <Panel dark={dark} title="Top Badge Text">
              <input type="text" value={badgeText} onChange={(e) => setBadgeText(e.target.value)} className={inputCls} />
            </Panel>
          </div>

          {/* Right: live preview */}
          <div>
            <PreviewFrame
              dark={dark}
              label="Live preview — Hero Section"
              deviceToggle={
                <div className={`flex gap-[3px] p-[3px] rounded-lg ${dark ? "bg-white/[0.06]" : "bg-slate-100"}`}>
                  <button
                    onClick={() => setDevice("desktop")}
                    className="px-2.5 py-1 rounded-md text-[10.5px] font-bold"
                    style={{
                      background: device === "desktop" ? (dark ? "#1e293b" : "#fff") : "transparent",
                      color: device === "desktop" ? (dark ? "#A78BFA" : VIOLET) : "#94A3B8",
                    }}
                  >
                    Desktop
                  </button>
                  <button
                    onClick={() => setDevice("mobile")}
                    className="px-2.5 py-1 rounded-md text-[10.5px] font-bold"
                    style={{
                      background: device === "mobile" ? (dark ? "#1e293b" : "#fff") : "transparent",
                      color: device === "mobile" ? (dark ? "#A78BFA" : VIOLET) : "#94A3B8",
                    }}
                  >
                    Mobile
                  </button>
                </div>
              }
            >
              <div
                className={`relative overflow-hidden bg-[#0f172a] ${device === "mobile" ? "max-w-[340px] mx-auto" : "w-full"}`}
                style={{ aspectRatio: device === "mobile" ? "9/16" : "16/9" }}
              >
                {current?.type === "video" && (
                  <video
                    src={current.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 object-cover"
                    style={{
                      width: `${imgWidth}%`,
                      height: `${imgHeight}%`,
                      left: `${(100 - imgWidth) / 2}%`,
                      top: `${(100 - imgHeight) / 2}%`,
                    }}
                  />
                )}
                {current?.type === "image" && (
                  <img
                    src={current.url}
                    className="absolute inset-0 object-cover"
                    style={{
                      width: `${imgWidth}%`,
                      height: `${imgHeight}%`,
                      left: `${(100 - imgWidth) / 2}%`,
                      top: `${(100 - imgHeight) / 2}%`,
                    }}
                  />
                )}
                {!current && <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#1E293B,#334155)" }} />}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(90deg, rgba(0,0,0,.72), rgba(0,0,0,.48) 55%, rgba(0,0,0,.12))" }}
                />
                <div
                  className={`relative z-[2] h-full flex flex-col justify-center ${
                    device === "mobile" ? "px-[6%] py-[8%] max-w-[92%]" : "px-[7%] py-[6%] max-w-[64%]"
                  }`}
                >
                  <div
                    className="inline-flex items-center gap-1.5 w-fit bg-white/10 border border-white/20 font-bold text-[11px] px-3 py-1.5 rounded-full mb-3"
                    style={{ color: ORANGE }}
                  >
                    <Sparkles className="w-3 h-3" style={{ color: ORANGE }} />
                    {badgeText}
                  </div>
                  <h1 className="text-white font-extrabold leading-[1.1] m-0 mb-2.5" style={{ fontSize: device === "mobile" ? 28 : 40 }}>
                    <span className="block">{split ? <SplitText text={line1} /> : line1}</span>
                    <span className="block" style={{ color: ORANGE }}>
                      {split ? <SplitText text={line2} /> : line2}
                    </span>
                  </h1>
                  <p className="text-slate-200 leading-relaxed m-0 max-w-[480px]">{subText}</p>
                </div>
                {heroMedia.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-[7px] z-[2]">
                    {heroMedia.map((_, i) => (
                      <span
                        key={i}
                        className="h-[7px] rounded-full"
                        style={{ width: i === activeIndex ? 20 : 7, background: i === activeIndex ? ORANGE : "rgba(255,255,255,.4)" }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </PreviewFrame>
          </div>
        </div>
      </div>

      <LandingBanner dark={dark} text="Saving here updates the hero section on the live homepage immediately." pillText={`${heroMedia.length} Live`} />
    </div>
  );
}

function SplitText({ text }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <span key={i} className="inline-block" style={{ opacity: 1, animation: `charIn .5s ease forwards`, animationDelay: `${i * 60}ms` }}>
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   STATS STRIP TAB
═══════════════════════════════════════════════════════════════ */
function StatsTab({ showToast, dark }) {
  const inputCls = getInputCls(dark);
  const [stats, setStats] = useState([
    { value: "50K+", label: "Active Learners" },
    { value: "95%", label: "Success Rate" },
    { value: "100+", label: "Expert Mentors" },
    { value: "4.9★", label: "Average Rating" },
  ]);
  const [bg, setBg] = useState("#F1F5F9");

  const addStat = () => setStats((s) => [...s, { value: "0", label: "New stat" }]);
  const removeStat = (i) => setStats((s) => s.filter((_, idx) => idx !== i));
  const moveStat = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= stats.length) return;
    setStats((s) => {
      const next = [...s];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };
  const updateStat = (i, key, val) => setStats((s) => s.map((st, idx) => (idx === i ? { ...st, [key]: val } : st)));

  const cardBg = dark ? "bg-white/[0.03] border-white/8" : "bg-white border-slate-200";
  const subTextCls = dark ? "text-slate-400" : "text-slate-500";

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-[22px]">
        <div>
          <h1 className="text-2xl font-extrabold m-0" style={{ color: dark ? "#F1F5F9" : INK }}>
            Stats Strip Management
          </h1>
          <p className={`text-[13.5px] mt-1 mb-0 ${subTextCls}`}>Manage the big numbers shown across the homepage (e.g. 50K+ Active Learners).</p>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <Btn dark={dark} onClick={() => window.confirm("Reset Stats changes?") && window.location.reload()}>
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </Btn>
          <Btn variant="primary" dark={dark} onClick={addStat}>
            <Plus className="w-3.5 h-3.5" /> Add Stat
          </Btn>
          <Btn variant="dark" dark={dark} onClick={() => showToast("Stats strip saved")}>
            <Save className="w-3.5 h-3.5" /> Save changes
          </Btn>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5">
        <StatCard dark={dark} tone="blue" icon={TrendingUp} value={stats.length} label="Total Stats" />
        <StatCard dark={dark} tone="green" icon={LayoutGrid} value="Cream" label="Section BG" />
        <StatCard dark={dark} tone="purple" icon={Sparkles} value="Live" label="Status" />
        <StatCard dark={dark} tone="yellow" icon={Clock} value="Now" label="Last Updated" />
      </div>

      <div className={`border rounded-[18px] p-[22px] mb-5 ${cardBg}`}>
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-5 items-start">
          <div>
            <ColorField dark={dark} label="Section background color" value={bg} onChange={setBg} />
            <Panel dark={dark} title="Stat cards" hint="Value + label pairs, in display order.">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 border-[1.5px] rounded-[10px] p-2 mb-2 ${
                    dark ? "border-white/8 bg-white/[0.02]" : "border-slate-200 bg-white"
                  }`}
                >
                  <span className={`text-[11px] font-extrabold w-4 text-center flex-shrink-0 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                    {i + 1}
                  </span>
                  <input type="text" value={s.value} onChange={(e) => updateStat(i, "value", e.target.value)} className={inputCls} style={{ maxWidth: 80 }} />
                  <input type="text" value={s.label} onChange={(e) => updateStat(i, "label", e.target.value)} className={inputCls} />
                  <IconBtn dark={dark} danger={false} disabled={i === 0} onClick={() => moveStat(i, -1)}>
                    <ArrowUp className="w-[13px] h-[13px]" />
                  </IconBtn>
                  <IconBtn dark={dark} danger={false} disabled={i === stats.length - 1} onClick={() => moveStat(i, 1)}>
                    <ArrowDown className="w-[13px] h-[13px]" />
                  </IconBtn>
                  <IconBtn dark={dark} onClick={() => removeStat(i)}>
                    <Trash2 className="w-[13px] h-[13px]" />
                  </IconBtn>
                </div>
              ))}
              <button
                onClick={addStat}
                className={`w-full py-2.5 rounded-[10px] border-[1.5px] border-dashed bg-transparent font-bold text-[12px] ${
                  dark ? "border-white/10 hover:border-violet-500/60 hover:bg-violet-500/[0.08] text-violet-300" : "border-slate-200 hover:border-violet-500 hover:bg-violet-50"
                }`}
                style={!dark ? { color: VIOLET } : undefined}
              >
                + Add stat
              </button>
            </Panel>
          </div>

          <div>
            <PreviewFrame dark={dark} label="Live preview — Stats Strip">
              <div className="p-8 px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 rounded-2xl p-4" style={{ background: bg }}>
                  {stats.map((s, i) => (
                    <div key={i} className="rounded-xl p-3.5 text-center border" style={{ background: CREAM, borderColor: "#EFE2D6" }}>
                      <div className="text-[22px] font-extrabold" style={{ color: ORANGE }}>
                        {s.value}
                      </div>
                      <div className="text-[10.5px] text-slate-500 font-semibold mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </PreviewFrame>
          </div>
        </div>
      </div>

      <LandingBanner dark={dark} text="Saving here updates the Stats Strip on the live homepage immediately." pillText={`${stats.length} Live`} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SHARED "CARD SECTION" TAB — used for both
   Why Choose Features and Career Support (same structure)
═══════════════════════════════════════════════════════════════ */
function CardsSectionTab({
  showToast,
  dark,
  pageTitle,
  pageSub,
  savedMsg,
  addBtnLabel,
  searchLabel,
  cardsLabel,
  cardsHint,
  headingLabel,
  defaultBg,
  defaultCardBg,
  defaultHeadA,
  defaultHeadB,
  defaultSub,
  defaultCards,
  showBrandColors,
  bannerText,
}) {
  const inputCls = getInputCls(dark);
  const [cards, setCards] = useState(defaultCards);
  const [bg, setBg] = useState(defaultBg);
  const [cardBg, setCardBg] = useState(defaultCardBg);
  const [headA, setHeadA] = useState(defaultHeadA);
  const [headB, setHeadB] = useState(defaultHeadB);
  const [sub, setSub] = useState(defaultSub);
  const [colorILM, setColorILM] = useState("#16A34A");
  const [colorORA, setColorORA] = useState("#F97316");
  const [search, setSearch] = useState("");
  const [picker, setPicker] = useState(null); // index of open icon picker

  const filtered = cards.map((c, i) => ({ ...c, i })).filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
  const uniqueIcons = new Set(cards.map((c) => c.icon)).size;

  const addCard = () => setCards((c) => [...c, { icon: "star", title: "New card", desc: "Short description here" }]);
  const removeCard = (i) => setCards((c) => c.filter((_, idx) => idx !== i));
  const moveCard = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= cards.length) return;
    setCards((c) => {
      const next = [...c];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };
  const updateCard = (i, key, val) => setCards((c) => c.map((card, idx) => (idx === i ? { ...card, [key]: val } : card)));

  const outerCardBg = dark ? "bg-white/[0.03] border-white/8" : "bg-white border-slate-200";
  const subTextCls = dark ? "text-slate-400" : "text-slate-500";
  const rowBase = dark ? "border-white/8 bg-white/[0.02]" : "border-slate-200 bg-white";

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-[22px]">
        <div>
          <h1 className="text-2xl font-extrabold m-0" style={{ color: dark ? "#F1F5F9" : INK }}>
            {pageTitle}
          </h1>
          <p className={`text-[13.5px] mt-1 mb-0 ${subTextCls}`}>{pageSub}</p>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <Btn dark={dark} onClick={() => window.confirm(`Reset ${pageTitle} changes?`) && window.location.reload()}>
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </Btn>
          <Btn variant="primary" dark={dark} onClick={addCard}>
            <Plus className="w-3.5 h-3.5" /> {addBtnLabel}
          </Btn>
          <Btn variant="dark" dark={dark} onClick={() => showToast(savedMsg)}>
            <Save className="w-3.5 h-3.5" /> Save changes
          </Btn>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5">
        <StatCard dark={dark} tone="blue" icon={LayoutGrid} value={cards.length} label="Total Cards" />
        <StatCard dark={dark} tone="green" icon={Target} value={uniqueIcons} label="Unique Icons" />
        <StatCard dark={dark} tone="purple" icon={Sparkles} value="Live" label="Status" />
        <StatCard dark={dark} tone="yellow" icon={Clock} value="Now" label="Last Updated" />
      </div>

      <SearchRow dark={dark} value={search} onChange={setSearch} placeholder={searchLabel} count={`${filtered.length} results`} />

      <div className={`border rounded-[18px] p-[22px] mb-5 ${outerCardBg}`}>
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-5 items-start">
          <div>
            <Panel dark={dark} title={headingLabel}>
              <ColorField dark={dark} label="Section background color" value={bg} onChange={setBg} />
              <ColorField dark={dark} label="Card background color" value={cardBg} onChange={setCardBg} />
              <div className="grid grid-cols-2 gap-2.5">
                <Field dark={dark} label={showBrandColors ? '"Why Choose" text' : "Heading (plain part)"}>
                  <input type="text" value={headA} onChange={(e) => setHeadA(e.target.value)} className={inputCls} />
                </Field>
                <Field dark={dark} label={showBrandColors ? "Brand text" : "Heading (accent part)"}>
                  <input type="text" value={headB} onChange={(e) => setHeadB(e.target.value)} className={inputCls} />
                </Field>
              </div>
              {showBrandColors && (
                <div className="grid grid-cols-2 gap-2.5">
                  <ColorField dark={dark} label='"ILM" color' value={colorILM} onChange={setColorILM} />
                  <ColorField dark={dark} label='"ORA" color' value={colorORA} onChange={setColorORA} />
                </div>
              )}
              <Field dark={dark} label="Subheading">
                <input type="text" value={sub} onChange={(e) => setSub(e.target.value)} className={inputCls} />
              </Field>
            </Panel>

            <Panel dark={dark} title={cardsLabel} hint={cardsHint}>
              {cards.length === 0 ? (
                <div className={`text-center py-[34px] px-3.5 text-[13px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
                  No cards yet — add one below.
                </div>
              ) : filtered.length === 0 ? (
                <div className={`text-center py-[34px] px-3.5 text-[13px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
                  No results for this search.
                </div>
              ) : (
                filtered.map((c) => (
                  <div key={c.i} className={`flex items-start gap-2 border-[1.5px] rounded-[10px] p-2 mb-2 ${rowBase}`}>
                    <span className={`text-[11px] font-extrabold w-4 text-center flex-shrink-0 mt-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                      {c.i + 1}
                    </span>
                    <div className="relative flex-shrink-0">
                      <button onClick={() => setPicker(picker === c.i ? null : c.i)} className="w-9 h-9 rounded-[9px] flex items-center justify-center" style={{ background: INK }}>
                        <IconGlyph name={c.icon} className="w-4 h-4" />
                      </button>
                      {picker === c.i && (
                        <IconPicker
                          dark={dark}
                          currentIcon={c.icon}
                          onSelect={(name) => {
                            updateCard(c.i, "icon", name);
                            setPicker(null);
                          }}
                          onClose={() => setPicker(null)}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={c.title}
                        onChange={(e) => updateCard(c.i, "title", e.target.value)}
                        placeholder="Card title"
                        className={`${inputCls} mb-1.5`}
                      />
                      <textarea
                        value={c.desc}
                        onChange={(e) => updateCard(c.i, "desc", e.target.value)}
                        placeholder="Short description"
                        className={`${inputCls} min-h-[40px] resize-y`}
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <IconBtn dark={dark} danger={false} disabled={c.i === 0} onClick={() => moveCard(c.i, -1)}>
                        <ArrowUp className="w-[13px] h-[13px]" />
                      </IconBtn>
                      <IconBtn dark={dark} danger={false} disabled={c.i === cards.length - 1} onClick={() => moveCard(c.i, 1)}>
                        <ArrowDown className="w-[13px] h-[13px]" />
                      </IconBtn>
                      <IconBtn dark={dark} onClick={() => removeCard(c.i)}>
                        <Trash2 className="w-[13px] h-[13px]" />
                      </IconBtn>
                    </div>
                  </div>
                ))
              )}
              <button
                onClick={addCard}
                className={`w-full py-2.5 rounded-[10px] border-[1.5px] border-dashed bg-transparent font-bold text-[12px] ${
                  dark ? "border-white/10 hover:border-violet-500/60 hover:bg-violet-500/[0.08] text-violet-300" : "border-slate-200 hover:border-violet-500 hover:bg-violet-50"
                }`}
                style={!dark ? { color: VIOLET } : undefined}
              >
                + {addBtnLabel === "Add Card" ? "Add card" : addBtnLabel.toLowerCase()}
              </button>
            </Panel>
          </div>

          <div>
            <PreviewFrame dark={dark} label={`Live preview — ${headingLabel}`}>
              <div className="p-6" style={{ background: bg, borderRadius: 14 }}>
                <h2 className="text-center text-[22px] font-extrabold m-0 mb-1.5" style={{ color: INK }}>
                  {showBrandColors ? (
                    <>
                      {headA}{" "}
                      {headB
                        .trim()
                        .split(/\s+/)
                        .map((w, i) => (
                          <span key={i} style={{ color: i === 0 ? colorILM : colorORA }}>
                            {w}{" "}
                          </span>
                        ))}
                    </>
                  ) : (
                    <>
                      {headA} <span style={{ color: ORANGE }}>{headB}</span>
                    </>
                  )}
                </h2>
                <p className="text-center text-[12px] text-slate-500 m-0 mb-5">{sub}</p>
                <div className={`grid gap-3 ${cards.length && showBrandColors ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3"}`}>
                  {cards.map((c, i) => (
                    <div key={i} className="rounded-2xl p-[15px] border shadow-sm" style={{ background: cardBg, borderColor: "#ECECEC" }}>
                      <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center mb-2.5" style={{ background: INK }}>
                        <IconGlyph name={c.icon} className="w-[17px] h-[17px]" />
                      </div>
                      <h4 className="text-[13px] font-extrabold m-0 mb-1">{c.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed m-0">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </PreviewFrame>
          </div>
        </div>
      </div>

      <LandingBanner dark={dark} text={bannerText} pillText={`${cards.length} Live`} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════════ */
function Toast({ message, dark }) {
  if (!message) return null;
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 text-white px-5 py-3 rounded-[10px] text-[13px] font-semibold shadow-2xl z-[999] flex items-center gap-2"
      style={{ background: dark ? "#7C3AED" : INK }}
    >
      <span className="w-[7px] h-[7px] rounded-full bg-green-500" />
      {message}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN EXPORT — PlatformOverview
   SuperAdmin CMS for the homepage's featured content:
   Hero Section, Stats Strip, Why Choose Features, Career Support.
   Follows the same light/dark theme pattern as FeaturedProgramsList.jsx
   (reads the `dark` class on <html>, live-updates via MutationObserver).
═══════════════════════════════════════════════════════════════ */
export default function PlatformOverview() {
  const dark = useThemeMode();
  const [tab, setTab] = useState("hero");
  const [toastMsg, setToastMsg] = useState("");

  function showToast(msg) {
    setToastMsg(msg);
  }
  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(""), 2200);
    return () => clearTimeout(t);
  }, [toastMsg]);

  return (
    <div className={`min-h-screen transition-colors ${dark ? "bg-[#0a0a14]" : "bg-slate-50"}`}>
      <style>{`@keyframes charIn{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}`}</style>

      <TabBar active={tab} onChange={setTab} dark={dark} />

      <div className="max-w-[1400px] mx-auto p-6">
        {tab === "hero" && <HeroTab showToast={showToast} dark={dark} />}
        {tab === "stats" && <StatsTab showToast={showToast} dark={dark} />}
        {tab === "features" && (
          <CardsSectionTab
            showToast={showToast}
            dark={dark}
            pageTitle="Why Choose Features"
            pageSub='Manage the "Why Choose ILM ORA" feature cards shown on the homepage.'
            savedMsg="Features section saved"
            addBtnLabel="Add Card"
            searchLabel="Search card title…"
            cardsLabel="Feature cards"
            cardsHint="Each card needs an icon, title, and short description."
            headingLabel="Why Choose Features"
            defaultBg="#F6EDE6"
            defaultCardBg="#FFFFFF"
            defaultHeadA="Why Choose"
            defaultHeadB="ILM ORA"
            defaultSub="Everything you need to accelerate your career growth"
            defaultCards={[
              { icon: "target", title: "Project-Based Learning", desc: "Build real-world projects that showcase your skills" },
              { icon: "users", title: "Expert Mentorship", desc: "Learn from professionals at top tech companies" },
              { icon: "trophy", title: "Career Support", desc: "Get help with resumes, interviews & job referrals" },
              { icon: "zap", title: "Live Sessions", desc: "Interactive workshops with industry experts" },
            ]}
            showBrandColors
            bannerText="Saving here updates the Why Choose section on the live homepage immediately."
          />
        )}
        {tab === "career" && (
          <CardsSectionTab
            showToast={showToast}
            dark={dark}
            pageTitle="Career Support Management"
            pageSub='Manage the "Career Support That Delivers Results" cards on the homepage.'
            savedMsg="Career Support section saved"
            addBtnLabel="Add Card"
            searchLabel="Search card title…"
            cardsLabel="Career support cards"
            cardsHint="Each card needs an icon, title, and short description."
            headingLabel="Career Support"
            defaultBg="#F6EDE6"
            defaultCardBg="#FFFFFF"
            defaultHeadA="Career Support That"
            defaultHeadB="Delivers Results"
            defaultSub="Get help with interview prep, portfolios, referrals and role mapping"
            defaultCards={[
              { icon: "target", title: "Portfolio Support", desc: "Turn your projects into case studies hiring managers love" },
              { icon: "award", title: "Interview Prep", desc: "Mock interviews, feedback and guidance on role expectations" },
              { icon: "users", title: "Referrals & Network", desc: "Warm intros to hiring teams and community-led referrals" },
            ]}
            showBrandColors={false}
            bannerText="Saving here updates the Career Support section on the live homepage immediately."
          />
        )}
      </div>

      <Toast message={toastMsg} dark={dark} />
    </div>
  );
}