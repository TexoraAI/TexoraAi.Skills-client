import { useEffect, useRef } from "react";

const STALL_CHECK_INTERVAL_MS = 5000;
const STALL_THRESHOLD_MS = 12000; // no new bytes sent for this long = dead

export function useAudioTrackHealth(audioTrack, isConnected, onTrackDead) {
  const monitorIntervalRef = useRef(null);
  const lastBytesSentRef = useRef(0);
  const lastBytesChangeTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!audioTrack || !isConnected) {
      if (monitorIntervalRef.current) clearInterval(monitorIntervalRef.current);
      lastBytesSentRef.current = 0;
      lastBytesChangeTimeRef.current = Date.now();
      return;
    }

    monitorIntervalRef.current = setInterval(async () => {
      try {
        const mediaStreamTrack = audioTrack?.mediaStreamTrack;
        const readyState = mediaStreamTrack?.readyState;

        if (readyState === "ended") {
          console.error("❌ Audio track appears dead (readyState: ended)");
          if (onTrackDead) onTrackDead();
          return;
        }

        const sender = audioTrack?.sender;
        if (!sender || typeof sender.getStats !== "function") return;

        const stats = await sender.getStats();
        let bytesSent = null;

        stats.forEach((report) => {
          if (report.type === "outbound-rtp" && report.kind === "audio") {
            bytesSent = report.bytesSent;
          }
        });

        if (bytesSent === null) return;

        if (bytesSent !== lastBytesSentRef.current) {
          lastBytesSentRef.current = bytesSent;
          lastBytesChangeTimeRef.current = Date.now();
          return;
        }

        const stalledFor = Date.now() - lastBytesChangeTimeRef.current;
        if (stalledFor >= STALL_THRESHOLD_MS) {
          console.error(
            `❌ Audio track stalled: no new bytes sent for ${stalledFor}ms (readyState still "${readyState}")`,
          );
          if (onTrackDead) onTrackDead();
        }
      } catch (err) {
        console.error("Audio health check error:", err);
      }
    }, STALL_CHECK_INTERVAL_MS);

    return () => {
      if (monitorIntervalRef.current) clearInterval(monitorIntervalRef.current);
    };
  }, [audioTrack, isConnected, onTrackDead]);
}