import { useCallback, useRef, useState } from "react";
import { SmilePlus } from "lucide-react";

/* ─── Reaction set (Google Meet's default six) ─────────────────── */
export const REACTIONS = ["👍", "❤️", "😂", "😮", "👏", "🎉"];

/* ─── Hook: owns floater state + send/receive plumbing ─────────── */
export function useEmojiReactions() {
  const [floaters, setFloaters] = useState([]);
  const idRef = useRef(0);

  const spawnFloater = useCallback((emoji, name) => {
    const id = ++idRef.current;
    setFloaters((prev) => [...prev, { id, emoji, name }]);
    // auto-remove after the float animation finishes
    setTimeout(() => {
      setFloaters((prev) => prev.filter((f) => f.id !== id));
    }, 2600);
  }, []);

  // Call this from your existing RoomEvent.DataReceived handler
  const bindDataReceived = useCallback(
    (msg, participant) => {
      if (msg?.type !== "reaction" || !msg?.emoji) return;
      const name = participant?.name || participant?.identity || "Someone";
      spawnFloater(msg.emoji, name);
    },
    [spawnFloater],
  );

  // Call this when the local user taps an emoji
  const sendReaction = useCallback(
    (emoji, room, selfName = "You") => {
      // show it locally right away — don't wait for the round trip
      spawnFloater(emoji, selfName);

      if (!room?.localParticipant) return;
      const payload = new TextEncoder().encode(
        JSON.stringify({ type: "reaction", emoji }),
      );
      try {
        room.localParticipant.publishData(payload, { reliable: false });
      } catch (err) {
        console.error("Failed to send reaction:", err);
      }
    },
    [spawnFloater],
  );

  return { floaters, sendReaction, bindDataReceived };
}

/* ─── Floating emoji layer — overlay this on top of the stage ──── */
export function EmojiFloaters({ floaters }) {
  return (
    <div style={S.floaterLayer}>
      {floaters.map((f, i) => (
        <div
          key={f.id}
          className="er-floater"
          style={{
            ...S.floater,
            left: `${10 + ((i * 13) % 70)}%`,
            animationDelay: `${(i % 4) * 0.08}s`,
          }}
        >
          <span style={S.floaterEmoji}>{f.emoji}</span>
          <span style={S.floaterName}>{f.name}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Reaction button — drop into the control bar ───────────────
   Matches the existing control-bar buttons (Mic / Camera / Chat...)
   visually: icon on top, label below, same hover/active styling. */
export function ReactionButton({ onSend, disabled }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const handlePick = (emoji) => {
    onSend?.(emoji);
    setOpen(false);
  };

  // close the picker when clicking outside it
  const onBlurCapture = (e) => {
    if (!wrapRef.current?.contains(e.relatedTarget)) setOpen(false);
  };

  return (
    <div
      ref={wrapRef}
      style={S.ctrlWrap}
      onBlurCapture={onBlurCapture}
      tabIndex={-1}
    >
      {open && (
        <div style={S.picker} role="menu">
          {REACTIONS.map((e) => (
            <button
              key={e}
              type="button"
              style={S.pickerBtn}
              onClick={() => handlePick(e)}
              onMouseEnter={(ev) =>
                (ev.currentTarget.style.transform = "translateY(-3px) scale(1.15)")
              }
              onMouseLeave={(ev) =>
                (ev.currentTarget.style.transform = "none")
              }
              aria-label={`React with ${e}`}
            >
              {e}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        style={{
          ...S.ctrlBtn,
          ...(open ? S.ctrlBtnActive : null),
        }}
        aria-label="Send a reaction"
        aria-expanded={open}
      >
        <SmilePlus size={20} />
      </button>
      <span style={S.ctrlLabel}>React</span>
    </div>
  );
}

/* ─── Combined default export ───────────────────────────────────
   Convenience wrapper: just the floater layer, in case you want to
   place <EmojiReactions /> once at the top of your stage and keep
   <ReactionButton /> separately in the control bar. */
export default function EmojiReactions({ floaters }) {
  return <EmojiFloaters floaters={floaters} />;
}

/* ─── Styles (kept inline + scoped keyframes, no external CSS file
   needed — mirrors how the rest of the room is styled) ──────────── */
if (typeof document !== "undefined" && !document.getElementById("er-styles")) {
  const tag = document.createElement("style");
  tag.id = "er-styles";
  tag.textContent = `
    @keyframes er-float {
      0%   { transform: translateY(0) scale(0.6);   opacity: 0; }
      10%  { transform: translateY(-10px) scale(1); opacity: 1; }
      80%  { transform: translateY(-160px) scale(1); opacity: 1; }
      100% { transform: translateY(-200px) scale(0.9); opacity: 0; }
    }
    .er-floater { animation: er-float 2.4s ease-out forwards; }
  `;
  document.head.appendChild(tag);
}

const S = {
  floaterLayer: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    overflow: "hidden",
    zIndex: 40,
  },
  floater: {
    position: "absolute",
    bottom: 70,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
  floaterEmoji: {
    fontSize: 34,
    filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.35))",
    lineHeight: 1,
  },
  floaterName: {
    fontSize: 10,
    fontWeight: 700,
    color: "#fff",
    background: "rgba(0,0,0,0.55)",
    padding: "2px 7px",
    borderRadius: 8,
    whiteSpace: "nowrap",
  },

  ctrlWrap: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  ctrlBtn: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.08)",
    color: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.15s, transform 0.15s",
  },
  ctrlBtnActive: {
    background: "#fbbf24",
    color: "#1a1a1a",
  },
  ctrlLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#94a3b8",
  },

  picker: {
    position: "absolute",
    bottom: 58,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 6,
    padding: "10px 12px",
    borderRadius: 999,
    background: "#1c1c1e",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
  },
  pickerBtn: {
    width: 36,
    height: 36,
    border: "none",
    background: "transparent",
    fontSize: 20,
    cursor: "pointer",
    borderRadius: "50%",
    transition: "transform 0.12s",
  },
};
