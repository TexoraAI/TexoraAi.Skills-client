import React, { useEffect, useState } from "react";
import { Play, Pause, Trash2, Video, HardDrive, Film } from "lucide-react";
import videoService from "../services/videoService";

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

const PALETTE = ["#3b82f6", ACCENT_PURPLE.base, "#f59e0b", "#16a34a", "#ef4444"];
const paletteColor = (val) => PALETTE[(String(val ?? "")?.charCodeAt(0) ?? 0) % PALETTE.length];

/* single uploaded-video row, with inline play/pause + delete + player */
function VideoListRow({ t, video, isPlaying, videoUrl, onPlay, onDelete }) {
  const sizeMB = Math.round((video.size || 0) / 1024 / 1024);

  return (
    <div
      style={{
        borderRadius: RADIUS.chip,
        background: t.recentItemBg,
        border: `1px solid ${t.recentItemBorder}`,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", flexWrap: "wrap" }}>
        <IconBadge icon={Film} color={paletteColor(video.originalFileName)} size={34} iconSize={15} />

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
            {video.originalFileName}
          </div>
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
            <HardDrive size={10} /> {sizeMB} MB
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => onPlay(video)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: RADIUS.chip,
              border: "1px solid transparent",
              background: ACCENT_PURPLE.base,
              color: "#ffffff",
              fontFamily: FONT_FAMILY,
              fontSize: 11.5,
              fontWeight: FONT_WEIGHT.bold,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? "Playing" : "Play"}
          </button>
          <button
            onClick={() => onDelete(video.id)}
            title="Delete"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: RADIUS.chip,
              border: `1px solid ${t.recentItemBorder}`,
              background: t.cardBg,
              color: "#ef4444",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {isPlaying && videoUrl && (
        <div style={{ padding: "0 14px 14px" }}>
          <video
            controls
            src={videoUrl}
            style={{
              width: "100%",
              maxHeight: 360,
              borderRadius: RADIUS.chip,
              border: `1px solid ${t.recentItemBorder}`,
              display: "block",
              background: "#000",
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ══ MAIN ══ */
const AdminVideoList = () => {
  const [dark, setDark] = useState(isDark);
  useEffect(() => {
    setDark(isDark());
    const obs = new MutationObserver(() => setDark(isDark()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = dark ? T.dark : T.light;

  const [videos, setVideos] = useState([]);
  const [videoUrls, setVideoUrls] = useState({});
  const [playingId, setPlayingId] = useState(null);

  /* ================= LOAD VIDEOS ================= */
  useEffect(() => {
    videoService
      .getAllVideos()
      .then((res) => setVideos(res.data || []))
      .catch(console.error);
  }, []);

  /* ================= PLAY ================= */
  const playVideo = async (video) => {
    if (!videoUrls[video.id]) {
      const res = await videoService.getVideoBlob(video.storedFileName);
      const blobUrl = URL.createObjectURL(res.data);

      setVideoUrls((prev) => ({
        ...prev,
        [video.id]: blobUrl,
      }));
    }

    setPlayingId(video.id);
  };

  /* ================= DELETE ================= */
  const deleteVideo = async (id) => {
    if (!window.confirm("Delete this video?")) return;

    try {
      await videoService.deleteVideo(id);

      setVideos((prev) => prev.filter((v) => v.id !== id));

      if (videoUrls[id]) {
        URL.revokeObjectURL(videoUrls[id]);
      }
    } catch {
      alert("Delete failed");
    }
  };

  const totalSizeMB = Math.round(videos.reduce((sum, v) => sum + (v.size || 0), 0) / 1024 / 1024);

  const stats = [
    { label: "Total Videos", numericValue: videos.length, icon: Film, colorKey: "blue", change: "Files uploaded by you" },
    { label: "Total Size", numericValue: totalSizeMB, icon: HardDrive, colorKey: "purple", change: "Storage used, in MB" },
  ];

  return (
    <PageContainer mode={dark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
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
            Uploaded Videos
          </h1>
          <p style={{ fontSize: FONT_SIZE.bodySmall, color: t.textSub, margin: 0, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
            Preview and manage your uploaded video files
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
            <span>{totalSizeMB} MB used</span>
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
          <StatCard key={i} stat={s} index={i} loading={false} mode={dark ? "dark" : "light"} />
        ))}
      </div>

      {/* ═══ VIDEO LIST ═══ */}
      <SectionCard t={t}>
        <SectionHeader
          t={t}
          icon={Video}
          color={ACCENT_PURPLE.base}
          title="Video List"
          sub={`${videos.length} video${videos.length !== 1 ? "s" : ""} found`}
        />

        {videos.length === 0 ? (
          <EmptyBlock t={t} icon={Video} title="No videos uploaded yet" sub="Videos you upload will appear here" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {videos.map((v) => (
              <VideoListRow
                key={v.id}
                t={t}
                video={v}
                isPlaying={playingId === v.id}
                videoUrl={videoUrls[v.id]}
                onPlay={playVideo}
                onDelete={deleteVideo}
              />
            ))}
          </div>
        )}
      </SectionCard>
    </PageContainer>
  );
};

export default AdminVideoList;