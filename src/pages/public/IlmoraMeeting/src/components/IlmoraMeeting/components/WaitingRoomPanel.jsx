import {
  Check,
  X,
} from "lucide-react";

/* ═════════════════════════════════════════════════════════════════
   WAITING ROOM PANEL — host-only: admit/deny pending guests
═════════════════════════════════════════════════════════════════ */
export function WaitingRoomPanel({ waiting, onAdmit, onDeny, onAdmitAll, S }) {
  if (!waiting.length) {
    return <p style={S.emptyPpl}>No one is waiting to join.</p>;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "0 2px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 4px",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: "#fdd663" }}>
          {waiting.length} waiting to join
        </span>
        <button
          onClick={onAdmitAll}
          style={{
            background: "rgba(138,180,248,.18)",
            border: "1px solid rgba(138,180,248,.35)",
            color: "#8ab4f8",
            borderRadius: 8,
            padding: "5px 10px",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Admit all
        </button>
      </div>
      {waiting.map((w) => (
        <div key={w.requestId} style={S.pRow}>
          <div
            style={{
              ...S.pAv,
              background: "#e37400",
            }}
          >
            {(w.name || "?")[0]}
          </div>
          <span style={S.pName}>{w.name}</span>
          <button
            onClick={() => onDeny(w.requestId)}
            title="Deny"
            style={{
              background: "rgba(242,139,130,.14)",
              border: "1px solid rgba(242,139,130,.3)",
              color: "#f28b82",
              borderRadius: 8,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={14} />
          </button>
          <button
            onClick={() => onAdmit(w.requestId)}
            title="Admit"
            style={{
              background: "rgba(129,201,149,.16)",
              border: "1px solid rgba(129,201,149,.35)",
              color: "#81c995",
              borderRadius: 8,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Check size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
