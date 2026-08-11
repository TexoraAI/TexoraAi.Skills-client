import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import videoService from "@/services/videoService";
import {
  BookOpen,
  Film,
  HardDrive,
  Link as LinkIcon,
  Mail,
  Search,
  Tag,
  UploadCloud,
  Video as VideoIcon,
} from "lucide-react";

// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page must not
// redeclare tokens or components that already live there (see
// AdminDashboard.jsx, the Golden Reference, which this page now visually
// matches).
import {
  T,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  RADIUS,
  CARD_PADDING,
  ACCENT_PURPLE,
  PageContainer,
  Hero,
  StatCard,
} from "@/design-system";

/* ─────────────────────────────────────────────────────────────────────────
   Page-local layout helpers only — no color/spacing/radius values are
   invented here, everything is sourced from the theme token object (t)
   or the shared FONT_FAMILY / FONT_WEIGHT / RADIUS / CARD_PADDING tokens,
   exactly the same way AdminDashboard.jsx's SectionCard / SectionHeader /
   EmptyBlock are page-local but token-driven.
───────────────────────────────────────────────────────────────────────── */

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.documentElement.getAttribute("data-theme") === "dark";

function IconBadge({ icon: Icon, color, size = 34, iconSize = 15 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: RADIUS.chip,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `${color}18`,
        border: `1px solid ${color}30`,
        flexShrink: 0,
      }}
    >
      <Icon size={iconSize} color={color} />
    </div>
  );
}

function SectionCard({ t, children, style }) {
  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: RADIUS.standardCard,
        padding: CARD_PADDING.standardCard,
        boxShadow: t.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ t, icon: Icon, color, title, sub, right }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <IconBadge icon={Icon} color={color} />
        <div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: FONT_WEIGHT.bold,
              fontSize: 13,
              color: t.text,
            }}
          >
            {title}
          </div>
          {sub && (
            <div
              style={{
                fontSize: 11,
                color: t.textMuted,
                fontFamily: FONT_FAMILY,
                marginTop: 2,
              }}
            >
              {sub}
            </div>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}

function EmptyBlock({ t, icon: Icon, title, sub }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 16px",
        gap: 12,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1.5px dashed ${t.emptyBorder}`,
          background: t.emptyBg,
        }}
      >
        <Icon size={20} color={t.emptyIcon} />
      </div>
      <div>
        <p
          style={{
            fontSize: 13,
            color: t.text,
            fontWeight: FONT_WEIGHT.bold,
            fontFamily: FONT_FAMILY,
            margin: 0,
          }}
        >
          {title}
        </p>
        {sub && (
          <p
            style={{
              fontSize: 11.5,
              color: t.textMuted,
              fontFamily: FONT_FAMILY,
              margin: "4px 0 0",
            }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

/* row skeleton — same visual language as AdminDashboard's RecentPanel loading state */
function RowSkeleton({ t }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: RADIUS.chip,
        background: t.recentItemBg,
        border: `1px solid ${t.recentItemBorder}`,
      }}
    >
      <div style={{ width: 34, height: 34, borderRadius: RADIUS.chip, background: t.barBg, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
        <div style={{ height: 10, borderRadius: 5, background: t.barBg, width: "45%" }} />
        <div style={{ height: 8, borderRadius: 4, background: t.barBg, width: "25%" }} />
      </div>
      <div style={{ height: 20, width: 78, borderRadius: RADIUS.pill, background: t.barBg, flexShrink: 0 }} />
    </div>
  );
}

/* ── colour + label lookups, drawn from the same accent palette used across
   the design system's StatCard colorKeys (blue / green / amber / purple / red) ── */
const PALETTE = ["#3b82f6", ACCENT_PURPLE.base, "#f59e0b", "#16a34a", "#ef4444"];
const paletteColor = (val) => PALETTE[(String(val ?? "")?.charCodeAt(0) ?? 0) % PALETTE.length];

const TYPE_META = {
  UPLOADED_FILE: { label: "Uploaded File", Icon: UploadCloud, color: "#3b82f6" },
  YOUTUBE: { label: "YouTube", Icon: LinkIcon, color: "#ef4444" },
  VIMEO: { label: "Vimeo", Icon: LinkIcon, color: ACCENT_PURPLE.base },
  DIRECT_URL: { label: "Direct URL", Icon: LinkIcon, color: "#f59e0b" },
};

const resolveVideoType = (v) => {
  if (v.videoType && TYPE_META[v.videoType]) return v.videoType;
  // fallback for any payload missing the computed field
  const url = (v.videoUrl || "").toLowerCase();
  if (!url) return "UPLOADED_FILE";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YOUTUBE";
  if (url.includes("vimeo.com")) return "VIMEO";
  return "DIRECT_URL";
};

const TYPE_TABS = [
  { key: "ALL", label: "All Videos" },
  { key: "UPLOADED_FILE", label: "Uploaded Files" },
  { key: "YOUTUBE", label: "YouTube" },
  { key: "VIMEO", label: "Vimeo" },
  { key: "DIRECT_URL", label: "Direct URL" },
];

const formatSize = (video) => {
  const type = resolveVideoType(video);
  if (type !== "UPLOADED_FILE") return "External";
  const mb = Math.round((video.size || 0) / 1024 / 1024);
  return `${mb} MB`;
};

/* badge — small pill, reused for category / type / status */
function Badge({ t, color, Icon, children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 10px",
        borderRadius: RADIUS.pill,
        fontSize: 11,
        fontWeight: FONT_WEIGHT.bold,
        fontFamily: FONT_FAMILY,
        color,
        background: `${color}18`,
        border: `1px solid ${color}30`,
        whiteSpace: "nowrap",
      }}
    >
      {Icon && <Icon size={11} />}
      {children}
    </span>
  );
}

/* single video row */
function VideoRow({ t, video, index }) {
  const type = resolveVideoType(video);
  const tm = TYPE_META[type];
  const title = video.title || video.originalFileName || "Untitled";
  const isPublished = video.status === "published";
  const catColor = paletteColor(video.category);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: RADIUS.chip,
        background: t.recentItemBg,
        border: `1px solid ${t.recentItemBorder}`,
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: FONT_WEIGHT.bold,
          color: t.textMuted,
          fontFamily: FONT_FAMILY,
          width: 20,
          flexShrink: 0,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <IconBadge icon={Film} color={paletteColor(title)} size={34} iconSize={15} />

      <div style={{ flex: "1 1 200px", minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: FONT_WEIGHT.semibold,
            color: t.text,
            fontFamily: FONT_FAMILY,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </div>
        {video.course && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: t.textMuted,
              fontFamily: FONT_FAMILY,
              marginTop: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <BookOpen size={10} /> {video.course}
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            color: t.textMuted,
            fontFamily: FONT_FAMILY,
            marginTop: 2,
          }}
        >
          <Mail size={10} /> {video.uploadedBy || "—"}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", flexShrink: 0 }}>
        <Badge t={t} color={catColor} Icon={Tag}>
          {video.category || "—"}
        </Badge>
        <Badge t={t} color={tm.color} Icon={tm.Icon}>
          {tm.label}
        </Badge>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            borderRadius: RADIUS.pill,
            fontSize: 11,
            fontWeight: FONT_WEIGHT.bold,
            fontFamily: FONT_FAMILY,
            color: isPublished ? "#16a34a" : "#f59e0b",
            background: isPublished ? "#16a34a18" : "#f59e0b18",
            border: `1px solid ${isPublished ? "#16a34a30" : "#f59e0b30"}`,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "currentColor",
              display: "inline-block",
            }}
          />
          {isPublished ? "Published" : "Draft"}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            fontWeight: FONT_WEIGHT.semibold,
            color: t.text,
            fontFamily: FONT_FAMILY,
            whiteSpace: "nowrap",
          }}
        >
          <HardDrive size={11} color={t.textMuted} /> {formatSize(video)}
        </span>
      </div>
    </div>
  );
}

/* ══ MAIN ══ */
const AdminVideos = () => {
  const navigate = useNavigate();

  const [dark, setDark] = useState(isDark);
  useEffect(() => {
    setDark(isDark());
    const obs = new MutationObserver(() => setDark(isDark()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = dark ? T.dark : T.light;

  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("ALL");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos(activeType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType]);

  const loadVideos = (type) => {
    setLoading(true);
    videoService
      .getAllVideos(type)
      .then((res) => setVideos(res.data || []))
      .catch((err) => console.error("Failed to load videos", err))
      .finally(() => setLoading(false));
  };

  const filteredVideos = videos.filter((v) => {
    const q = search.toLowerCase();
    if (!q) return true;
    const title = (v.title || v.originalFileName || "").toLowerCase();
    const trainer = (v.uploadedBy || "").toLowerCase();
    return title.includes(q) || trainer.includes(q);
  });

  const publishedCount = videos.filter((v) => v.status === "published").length;
  const uploadedFileCount = videos.filter((v) => resolveVideoType(v) === "UPLOADED_FILE").length;

  const stats = [
    { label: "Total Videos", numericValue: videos.length, icon: VideoIcon, colorKey: "blue", change: "All uploaded lectures" },
    { label: "Uploaded Files", numericValue: uploadedFileCount, icon: UploadCloud, colorKey: "purple", change: "Direct file uploads" },
    { label: "Published", numericValue: publishedCount, icon: HardDrive, colorKey: "green", change: "Live for students" },
  ];

  const pill = {
    fontSize: 11,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: LETTER_SPACING.eyebrowWide,
    textTransform: "uppercase",
    padding: "4px 10px",
    borderRadius: RADIUS.pill,
    background: t.pillBg,
    border: `1px solid ${t.pillBorder}`,
    color: t.pillText,
    fontFamily: FONT_FAMILY,
  };

  return (
    <PageContainer mode={dark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      <style>{`
        @media (max-width:640px){
          .av-filterbar{flex-direction:column;align-items:stretch;}
          .av-search{max-width:none !important;}
          .av-tabs{overflow-x:auto;-webkit-overflow-scrolling:touch;flex-wrap:nowrap !important;padding-bottom:2px;}
          .av-tabs::-webkit-scrollbar{display:none;}
        }
      `}</style>

      {/* ═══ HERO — shared <Hero> component, matches Admin Dashboard exactly ═══ */}
      <Hero borderHero={t.borderHero}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base }} />
            <span
              style={{
                fontSize: FONT_SIZE.eyebrow,
                fontWeight: FONT_WEIGHT.bold,
                letterSpacing: LETTER_SPACING.eyebrowWide,
                textTransform: "uppercase",
                color: t.textSub,
                fontFamily: FONT_FAMILY,
              }}
            >
              Video Management
            </span>
          </div>
          <h1
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: FONT_WEIGHT.heroTitle,
              fontSize: FONT_SIZE.heroTitle,
              color: ACCENT_PURPLE.base,
              margin: "0 0 6px",
              lineHeight: LINE_HEIGHT.heroTitle,
              letterSpacing: LETTER_SPACING.heroTitle,
            }}
          >
            All Videos
          </h1>
          <p style={{ fontSize: FONT_SIZE.bodySmall, color: t.textSub, margin: 0, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
            Every lecture uploaded by trainers across your organization
          </p>
        </div>

        <div className="hero-badges">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: t.actBg,
              border: `1px solid ${t.actBorder}`,
              borderRadius: RADIUS.chip,
              padding: "8px 16px",
              fontSize: 11,
              fontWeight: FONT_WEIGHT.semibold,
              fontFamily: FONT_FAMILY,
              color: t.textSub,
              flexWrap: "wrap",
            }}
          >
            <span>{videos.length} videos</span>
            <span style={{ width: 1, height: 14, background: t.actBorder }} />
            <span>{publishedCount} published</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: RADIUS.pill,
              padding: "8px 18px",
              color: ACCENT_PURPLE.base,
              fontSize: 11,
              fontWeight: FONT_WEIGHT.bold,
              letterSpacing: LETTER_SPACING.eyebrowWide,
              fontFamily: FONT_FAMILY,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base, display: "inline-block" }} />
            LIVE
          </div>
        </div>
      </Hero>

      {/* ═══ STAT CARDS — shared <StatCard>, via the shared .stat-grid class ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} index={i} loading={loading} mode={dark ? "dark" : "light"} />
        ))}
      </div>

      {/* ═══ FILTER BAR ═══ */}
      <SectionCard t={t} style={{ marginBottom: 14 }}>
        <div className="av-filterbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div className="av-search" style={{ position: "relative", width: "100%", maxWidth: 300 }}>
            <Search size={14} color={t.textMuted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              placeholder="Search by title or trainer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "9px 12px 9px 34px",
                borderRadius: RADIUS.chip,
                border: `1px solid ${t.recentItemBorder}`,
                background: t.recentItemBg,
                color: t.text,
                fontFamily: FONT_FAMILY,
                fontSize: 12.5,
                fontWeight: FONT_WEIGHT.medium,
                outline: "none",
              }}
            />
          </div>

          <div className="av-tabs" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {TYPE_TABS.map((tab) => {
              const active = activeType === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveType(tab.key)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: RADIUS.chip,
                    border: active ? "1px solid transparent" : `1px solid ${t.pillBorder}`,
                    background: active ? ACCENT_PURPLE.base : t.pillBg,
                    color: active ? "#ffffff" : t.pillText,
                    fontFamily: FONT_FAMILY,
                    fontSize: 11,
                    fontWeight: FONT_WEIGHT.bold,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </SectionCard>

      {/* ═══ VIDEO LIST ═══ */}
      <SectionCard t={t}>
        <SectionHeader
          t={t}
          icon={Film}
          color={ACCENT_PURPLE.base}
          title="Video List"
          sub={`${filteredVideos.length} video${filteredVideos.length !== 1 ? "s" : ""} found`}
          right={<span style={pill}>{activeType === "ALL" ? "All Types" : TYPE_TABS.find((tb) => tb.key === activeType)?.label}</span>}
        />

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1, 2, 3].map((i) => (
              <RowSkeleton key={i} t={t} />
            ))}
          </div>
        ) : filteredVideos.length === 0 ? (
          <EmptyBlock t={t} icon={Film} title="No videos found" sub="Videos uploaded by trainers will appear here" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredVideos.map((v, index) => (
              <VideoRow key={v.id} t={t} video={v} index={index} />
            ))}
          </div>
        )}
      </SectionCard>
    </PageContainer>
  );
};

export default AdminVideos;