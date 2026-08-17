import { useEffect, useRef } from "react";

export function AudioTrackEl({ track }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!track || !el) return undefined;
    track.attach(el);
    el.play?.().catch(() => {});
    return () => {
      try {
        track.detach(el);
      } catch (_) {}
    };
  }, [track]);
  return <audio ref={ref} autoPlay data-remote-audio="1" />;
}
