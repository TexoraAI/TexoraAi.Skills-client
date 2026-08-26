import { Radio } from "lucide-react";
import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function HeroBanner({ t, isDark, heroMeta }) {
  return (
    <div
      className="rlc-hero-pad"
      style={{
        position: "relative",
        background: t.heroBannerBg,
        borderBottom: `1px solid ${t.heroBannerBorder}`,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "#a78bfa",
          filter: "blur(80px)",
          opacity: isDark ? 0.07 : 0.1,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -30,
          left: 120,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "#22d3ee",
          filter: "blur(60px)",
          opacity: isDark ? 0.04 : 0.07,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 10,
        }}
      >
        <Radio size={11} color={isDark ? "rgba(255,255,255,0.3)" : "#94a3b8"} />
        <span
          style={{
            fontSize: 10,
            fontWeight: FONT_WEIGHT.bold,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: isDark ? "rgba(255,255,255,0.3)" : "#94a3b8",
            fontFamily: FONT_FAMILY,
          }}
        >
          LIVE STUDIO
        </span>
      </div>
      <h1
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: FONT_WEIGHT.extrabold,
          fontSize: "clamp(1.6rem,3vw,2.4rem)",
          margin: "0 0 6px",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          color: t.text,
        }}
      >
        {heroMeta.title}{" "}
        <span
          style={{
            background: "linear-gradient(135deg, #16a34a, #22c55e, #86efac)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {heroMeta.highlight}
        </span>
      </h1>
      <p
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 12,
          color: t.textSub,
          margin: 0,
          fontWeight: FONT_WEIGHT.medium,
        }}
      >
        {heroMeta.subtitle}
      </p>
    </div>
  );
}
