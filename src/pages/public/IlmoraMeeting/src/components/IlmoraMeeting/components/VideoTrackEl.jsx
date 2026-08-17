import { useEffect, useRef } from "react";

/* ─── media element wrappers ─────────────────────────────────────── */

export function VideoTrackEl({ track, mirrored, fit = "cover", hidden, videoRef }) {
  const internalRef = useRef(null);
  useEffect(() => {
    const el = internalRef.current;
    if (!track || !el) return undefined;
    track.attach(el);
    return () => {
      try {
        track.detach(el);
      } catch (_) {}
    };
  }, [track]);
  return (
    <video
      ref={(node) => {
        internalRef.current = node;
        if (videoRef) videoRef.current = node;
      }}
      autoPlay
      playsInline
      muted
      style={
        hidden
          ? {
              position: "absolute",
              left: -9999,
              top: -9999,
              width: 2,
              height: 2,
              opacity: 0,
              pointerEvents: "none",
            }
          : {
              width: "100%",
              height: "100%",
              objectFit: fit,
              transform: mirrored ? "scaleX(-1)" : "none",
              display: "block",
              background: "#000",
            }
      }
    />
  );
}
