// src/trainer/trainerTheme.js
// ─── Shared theme tokens & layout helpers for all Trainer pages ───────────

export const T = {
    dark: {
      pageBg: "#0a0a0a",
      cardBg: "#111111",
      cardBgHov: "#161616",
      heroBg: "#141414",
      border: "rgba(255,255,255,0.12)",
      borderHov: "rgba(255,255,255,0.14)",
      borderHero: "rgba(255,255,255,0.07)",
      text: "#ffffff",
      textSub: "rgba(255,255,255,0.75)",
      textMuted: "rgba(255,255,255,0.6)",
      textLabel: "rgba(255,255,255,0.65)",
      // textSub: "rgba(255,255,255,0.3)",
      // textMuted: "rgba(255,255,255,0.2)",
      // textLabel: "rgba(255,255,255,0.22)",
      pillBg: "rgba(255,255,255,0.04)",
      pillBorder: "rgba(255,255,255,0.07)",
      pillText: "rgba(255,255,255,0.25)",
      iconBg: "rgba(255,255,255,0.05)",
      iconBorder: "rgba(255,255,255,0.08)",
      emptyBorder: "rgba(255,255,255,0.07)",
      emptyBg: "rgba(255,255,255,0.02)",
      emptyIcon: "rgba(255,255,255,0.12)",
      gridLine: "rgba(255,255,255,0.5)",
      barBg: "rgba(255,255,255,0.05)",
      actBar: "rgba(255,255,255,0.5)",
      actIcon: "rgba(255,255,255,0.3)",
      actBg: "rgba(255,255,255,0.04)",
      actBorder: "rgba(255,255,255,0.07)",
      inputBg: "#020617",
      inputBorder: "rgba(255,255,255,0.08)",
      shadow: "0 4px 20px rgba(0,0,0,0.4)",
      shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
      liveColor: "#34d399",
      liveText: "#34d399",
      recentItemBg: "rgba(255,255,255,0.03)",
      recentItemBorder: "rgba(255,255,255,0.05)",
      recentItemBgHov: "rgba(255,255,255,0.06)",
    },
    light: {
      pageBg: "#f1f5f9",
      cardBg: "#ffffff",
      cardBgHov: "#f8fafc",
      heroBg: "#ffffff",
      border: "#e2e8f0",
      borderHov: "#cbd5e1",
      borderHero: "#e2e8f0",
      text: "#0f172a",
      textSub: "#64748b",
      textMuted: "#94a3b8",
      textLabel: "#94a3b8",
      pillBg: "#f1f5f9",
      pillBorder: "#e2e8f0",
      pillText: "#94a3b8",
      iconBg: "#f8fafc",
      iconBorder: "#e2e8f0",
      emptyBorder: "#e2e8f0",
      emptyBg: "#f8fafc",
      emptyIcon: "#cbd5e1",
      gridLine: "rgba(0,0,0,0.12)",
      barBg: "#f1f5f9",
      actBar: "#94a3b8",
      actIcon: "#94a3b8",
      actBg: "#f8fafc",
      actBorder: "#e2e8f0",
      inputBg: "#f8fafc",
      inputBorder: "#e2e8f0",
      shadow: "0 1px 8px rgba(0,0,0,0.07)",
      shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
      liveColor: "#16a34a",
      liveText: "#16a34a",
      recentItemBg: "#f8fafc",
      recentItemBorder: "#e2e8f0",
      recentItemBgHov: "#f1f5f9",
    },
  };
  
  /** useTrainerTheme — detects dark/light from documentElement */
  import { useState, useEffect } from "react";
  export function useTrainerTheme() {
    const [isDark, setIsDark] = useState(
      () =>
        typeof document !== "undefined" &&
        (document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark")
    );
    useEffect(() => {
      const obs = new MutationObserver(() => {
        setIsDark(
          document.documentElement.classList.contains("dark") ||
            document.documentElement.getAttribute("data-theme") === "dark"
        );
      });
      obs.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-theme"],
      });
      return () => obs.disconnect();
    }, []);
    return { t: isDark ? T.dark : T.light, isDark };
  }
  
  /** PageShell — outer wrapper with font + bg */
  export const PageShell = ({ t, children }) => (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
      @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
      .dfade{animation:fadeUp 0.45s ease both}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>
      <div style={{
        minHeight: "100vh",
        background: t.pageBg,
        color: t.text,
        fontFamily: "'Poppins',sans-serif",
        transition: "background 0.3s,color 0.3s",
      }}>
        <div style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: 24,
          paddingBottom: 52,
        }}>
          {children}
        </div>
      </div>
    </>
  );
  
  /** PageHero — standard hero banner */
  export const PageHero = ({ t, isDark, icon: Icon, badge, title, subtitle, color = "#7c3aed", right }) => (
    <div className="dfade" style={{
      borderRadius: 24,
      padding: "28px 36px",
      background: t.heroBg,
      border: `1px solid ${t.borderHero}`,
      position: "relative",
      overflow: "hidden",
      marginBottom: 20,
      boxShadow: t.shadow,
    }}>
      {/* grid overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        opacity: isDark ? 0.04 : 0.025,
        backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />
      {/* glow blobs */}
      <div style={{
        position: "absolute", top: "-30%", left: "40%",
        width: 300, height: 200,
        background: `radial-gradient(ellipse,${color}10,transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-40%", right: "10%",
        width: 250, height: 200,
        background: `radial-gradient(ellipse,${color}08,transparent 70%)`,
        pointerEvents: "none",
      }} />
  
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: `${color}18`, border: `1px solid ${color}30`,
            flexShrink: 0,
          }}>
            <Icon size={22} color={color} />
          </div>
          <div>
            {badge && (
              <p style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.22em",
                textTransform: "uppercase", color: t.textSub,
                fontFamily: "'Poppins',sans-serif", marginBottom: 6,
              }}>{badge}</p>
            )}
            <h1 style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: 900,
              fontSize: "clamp(1.4rem,2.5vw,2rem)", color: t.text,
              margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em",
            }}>{title}</h1>
            {subtitle && (
              <p style={{
                fontSize: 12, color: t.textSub, marginTop: 5,
                fontWeight: 500, fontFamily: "'Poppins',sans-serif",
              }}>{subtitle}</p>
            )}
          </div>
        </div>
        {right && <div style={{ display: "flex", alignItems: "center", gap: 10 }}>{right}</div>}
      </div>
    </div>
  );
  
  /** ThemedCard — standard card */
  export const ThemedCard = ({ t, children, style = {} }) => (
    <div style={{
      background: t.cardBg,
      border: `1px solid ${t.border}`,
      borderRadius: 20,
      padding: 24,
      boxShadow: t.shadow,
      ...style,
    }}>
      {children}
    </div>
  );
  
  /** CardHeader — card section header */
  export const CardHeader = ({ t, icon: Icon, color = "#7c3aed", title, right }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${color}18`, border: `1px solid ${color}30`,
        }}>
          <Icon size={15} color={color} />
        </div>
        <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>{title}</span>
      </div>
      {right}
    </div>
  );
  
  /** ThemedInput — standard text input */
  export const ThemedInput = ({ t, style = {}, ...props }) => (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: 12,
        border: `1px solid ${t.inputBorder}`,
        background: t.inputBg,
        color: t.text,
        fontSize: 13,
        fontFamily: "'Poppins',sans-serif",
        outline: "none",
        transition: "border 0.2s",
        boxSizing: "border-box",
        ...style,
      }}
    />
  );
  
  /** ThemedTextarea */
  export const ThemedTextarea = ({ t, style = {}, ...props }) => (
    <textarea
      {...props}
      style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: 12,
        border: `1px solid ${t.inputBorder}`,
        background: t.inputBg,
        color: t.text,
        fontSize: 13,
        fontFamily: "'Poppins',sans-serif",
        outline: "none",
        resize: "vertical",
        transition: "border 0.2s",
        boxSizing: "border-box",
        ...style,
      }}
    />
  );
  
  /** ThemedSelect */
  export const ThemedSelect = ({ t, style = {}, children, ...props }) => (
    <select
      {...props}
      style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: 12,
        border: `1px solid ${t.inputBorder}`,
        background: t.inputBg,
        color: t.text,
        fontSize: 13,
        fontFamily: "'Poppins',sans-serif",
        outline: "none",
        transition: "border 0.2s",
        boxSizing: "border-box",
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </select>
  );
  
  /** FieldLabel */
  export const FieldLabel = ({ t, children }) => (
    <label style={{
      display: "block",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: t.textMuted,
      fontFamily: "'Poppins',sans-serif",
      marginBottom: 6,
    }}>{children}</label>
  );
  
  /** PrimaryButton */
  export const PrimaryButton = ({ color = "#7c3aed", children, style = {}, ...props }) => (
    <button
      {...props}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 20px",
        borderRadius: 12,
        background: color,
        color: "#fff",
        fontSize: 13,
        fontWeight: 700,
        fontFamily: "'Poppins',sans-serif",
        border: "none",
        cursor: "pointer",
        transition: "opacity 0.2s, transform 0.1s",
        ...style,
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >
      {children}
    </button>
  );
  
  /** SecondaryButton */
  export const SecondaryButton = ({ t, children, style = {}, ...props }) => (
    <button
      {...props}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 20px",
        borderRadius: 12,
        background: "transparent",
        color: t.textMuted,
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "'Poppins',sans-serif",
        border: `1px solid ${t.border}`,
        cursor: "pointer",
        transition: "all 0.2s",
        ...style,
      }}
    >
      {children}
    </button>
  );
  
  /** EmptyState */
  export const EmptyState = ({ t, icon: Icon, text, subText }) => (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "48px 0", gap: 12,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg,
      }}>
        <Icon size={24} color={t.emptyIcon} />
      </div>
      <p style={{ fontSize: 13, color: t.textMuted, fontWeight: 600, fontFamily: "'Poppins',sans-serif", margin: 0 }}>{text}</p>
      {subText && <p style={{ fontSize: 11, color: t.textLabel, fontFamily: "'Poppins',sans-serif", margin: 0, textAlign: "center", maxWidth: 300 }}>{subText}</p>}
    </div>
  );
  
  /** StatMiniCard */
  export const StatMiniCard = ({ t, icon: Icon, color, value, label }) => (
    <div style={{
      background: t.recentItemBg,
      border: `1px solid ${t.recentItemBorder}`,
      borderRadius: 14,
      padding: "14px 16px",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `${color}18`, border: `1px solid ${color}30`, flexShrink: 0,
      }}>
        <Icon size={18} color={color} />
      </div>
      <div>
        <p style={{ fontSize: 22, fontWeight: 800, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 10, color: t.textMuted, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
      </div>
    </div>
  );
  
  /** Pill badge */
  export const Pill = ({ t, children }) => (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
      padding: "4px 10px", borderRadius: 999, background: t.pillBg,
      border: `1px solid ${t.pillBorder}`, color: t.pillText,
      fontFamily: "'Poppins',sans-serif",
    }}>{children}</span>
  );