import { useEffect, useRef } from "react";

export function useAudioTrackHealth(audioTrack, isConnected, onTrackDead) {
  const monitorIntervalRef = useRef(null);
  const disabledSinceRef = useRef(null);

  useEffect(() => {
    if (!audioTrack || !isConnected) {
      if (monitorIntervalRef.current) clearInterval(monitorIntervalRef.current);
      disabledSinceRef.current = null;
      return;
    }

    monitorIntervalRef.current = setInterval(() => {
      try {
        const isEnabled = audioTrack?.isEnabled;

        if (isEnabled === false) {
          if (disabledSinceRef.current === null) {
            disabledSinceRef.current = Date.now();
          } else if (Date.now() - disabledSinceRef.current > 30000) {
            console.error("❌ Audio track appears dead (disabled 30+ seconds)");
            disabledSinceRef.current = null;
            if (onTrackDead) onTrackDead();
          }
        } else {
          disabledSinceRef.current = null;
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
