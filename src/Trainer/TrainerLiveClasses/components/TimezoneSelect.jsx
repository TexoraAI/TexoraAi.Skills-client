import { ChevronDown } from "lucide-react";
import { TIMEZONES } from "../data/theme";
import { getTzOffsetMinutes, formatTzOffset } from "../data/utils";

export default function TimezoneSelect({ t, value, onChange }) {
  return (
    <div style={{ position: "relative" }}>
      <select
        className="sls-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ cursor: "pointer", paddingRight: 30 }}
      >
        {TIMEZONES.map((tz) => (
          <option key={tz.id} value={tz.id}>
            {tz.label} ({formatTzOffset(getTzOffsetMinutes(tz.id))})
          </option>
        ))}
      </select>
      <ChevronDown
        size={11}
        color={t.textMuted}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
