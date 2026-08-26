import { useState } from "react";
import { Video, Clock, Play, Eye } from "lucide-react";
import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function RecordedVideoCard({ video, t, isDark, index, onEdit }) {
  const [hov, setHov] = useState(false);
  const statusStyle =
    video.status === "READY"
      ? t.statusReady
      : video.status === "PROCESSING"
        ? t.statusProcessing
        : t.statusFailed;
  return (
    <div
      onClick={() => onEdit(video.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="dfade"
      style={{
        animationDelay: `${index * 50}ms`,
        background: hov ? t.cardBgHov : t.cardBg,
        border: `1px solid ${hov ? t.borderHov : t.border}`,
        boxShadow: hov
          ? `${t.shadowHov},0 0 40px rgba(244,63,94,0.08)`
          : t.shadow,
        borderRadius: 20,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.25s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          height: 160,
          background: t.thumbBg,
          overflow: "hidden",
        }}
      >
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.4s ease",
              transform: hov ? "scale(1.04)" : "scale(1)",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isDark
                ? "linear-gradient(135deg,rgba(244,63,94,0.08),rgba(167,139,250,0.08))"
                : "linear-gradient(135deg,rgba(244,63,94,0.05),rgba(167,139,250,0.05))",
            }}
          >
            <Video size={32} color={t.emptyIcon} />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hov ? 1 : 0,
            transition: "opacity 0.25s",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Play size={18} color="#0f172a" style={{ marginLeft: 2 }} />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            fontSize: 8,
            fontWeight: FONT_WEIGHT.extrabold,
            letterSpacing: "0.08em",
            color: statusStyle.color,
            background: statusStyle.bg,
            border: `1px solid ${statusStyle.border}`,
            padding: "3px 8px",
            borderRadius: 999,
            fontFamily: FONT_FAMILY,
          }}
        >
          {video.status}
        </div>
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <h3
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 13,
            fontWeight: FONT_WEIGHT.bold,
            color: t.text,
            margin: "0 0 4px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {video.title}
        </h3>
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 11,
            color: t.textMuted,
            margin: "0 0 10px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {video.description || "No description"}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: FONT_WEIGHT.bold,
              letterSpacing: "0.08em",
              color: "#f43f5e",
              background: "rgba(244,63,94,0.1)",
              border: "1px solid rgba(244,63,94,0.2)",
              padding: "3px 8px",
              borderRadius: 999,
              fontFamily: FONT_FAMILY,
            }}
          >
            {video.batchName || "No batch"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {video.durationMinutes && (
              <span
                style={{
                  fontSize: 10,
                  color: t.textMuted,
                  fontFamily: FONT_FAMILY,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Clock size={10} /> {video.durationMinutes}m
              </span>
            )}
            <span
              style={{
                fontSize: 10,
                color: t.textMuted,
                fontFamily: FONT_FAMILY,
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Eye size={10} /> {video.viewCount ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
