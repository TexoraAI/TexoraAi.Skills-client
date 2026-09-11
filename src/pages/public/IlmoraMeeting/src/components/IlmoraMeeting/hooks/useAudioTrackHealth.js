import { useEffect, useRef } from "react";

export function useAudioTrackHealth(audioTrack, isConnected, onTrackDead) {
  const monitorIntervalRef = useRef(null);

  useEffect(() => {
    if (!audioTrack || !isConnected) {
      if (monitorIntervalRef.current) clearInterval(monitorIntervalRef.current);
      return;
    }

    monitorIntervalRef.current = setInterval(() => {
      try {
        const readyState = audioTrack?.mediaStreamTrack?.readyState;

        // A muted track is normal and NOT dead — only "ended" means the
        // underlying device/hardware track actually stopped (unplugged,
        // permission revoked, etc). Don't treat isEnabled===false as death.
        if (readyState === "ended") {
          console.error("❌ Audio track appears dead (readyState: ended)");
          if (onTrackDead) onTrackDead();
        }
      } catch (err) {
        console.error("Audio health check error:", err);
      }
    }, 5000);

    return () => {
      if (monitorIntervalRef.current) clearInterval(monitorIntervalRef.current);
    };
  }, [audioTrack, isConnected, onTrackDead]);
}
