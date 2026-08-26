import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function PanelSectionHeader({ icon: Icon, color, title, t }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderBottom: `1px solid ${t.panelHeaderBorder}`,
        background: t.panelHeader,
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}18`,
          border: `1px solid ${color}28`,
          flexShrink: 0,
        }}
      >
        <Icon size={13} color={color} />
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: FONT_WEIGHT.bold,
          color: t.text,
          fontFamily: FONT_FAMILY,
        }}
      >
        {title}
      </span>
    </div>
  );
}
