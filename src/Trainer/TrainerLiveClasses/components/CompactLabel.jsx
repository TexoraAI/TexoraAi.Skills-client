import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function CompactLabel({ children, t }) {
  return (
    <label
      style={{
        fontSize: 9,
        fontWeight: FONT_WEIGHT.bold,
        color: t.labelColor,
        fontFamily: FONT_FAMILY,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        marginBottom: 4,
        display: "block",
      }}
    >
      {children}
    </label>
  );
}
