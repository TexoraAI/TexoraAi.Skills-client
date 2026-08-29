/* ════════════════════════════════════════════════════════════════
   utils/notificationSound.js
   ────────────────────────────────────────────────────────────────
   Short, ORIGINAL notification tones synthesized on the fly with the
   Web Audio API — no audio files, nothing copied or extracted from
   Google Meet or any other product. Each chime below is just a small,
   original sequence of pitches/envelopes tuned to feel like a clean,
   professional "presence" tone (a Meet-style *experience*, not
   Meet's actual audio).

   Design goals (Phase 1 spec):
   - Short, clean, professional, subtle. Never loops, never overlaps
     with itself, never plays continuously.
   - Never throws into the caller and never retries. If the browser
     blocks audio (autoplay policy, no user gesture yet, unsupported
     browser, etc.) we just skip playback silently — the meeting
     keeps working either way.
   - A single shared AudioContext is lazily created and reused/resumed
     rather than recreated per call, so repeated notifications never
     leak contexts or pile up nodes.
   ════════════════════════════════════════════════════════════════ */

let sharedCtx = null;

function getContext() {
  try {
    if (typeof window === "undefined") return null;
    if (!sharedCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      sharedCtx = new Ctx();
    }
    if (sharedCtx.state === "suspended") {
      // Best-effort resume for browsers' autoplay restrictions. If
      // there still hasn't been a user gesture this silently stays
      // suspended and playTones() below will simply produce no sound
      // — we never poll/retry for this.
      sharedCtx.resume().catch(() => {});
    }
    return sharedCtx;
  } catch (_) {
    return null;
  }
}

/**
 * Plays a short, non-looping sequence of tones.
 * notes: [{ freq, start=0, dur=0.16, type="sine" }, ...] — start/dur in seconds.
 */
function playTones(notes, { gain = 0.09 } = {}) {
  const audioCtx = getContext();
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    notes.forEach(({ freq, start = 0, dur = 0.16, type = "sine" }) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + start);
      // Quick fade-in/out envelope keeps every tone clean and subtle —
      // no clicks, no harshness, no sustained/looping tail.
      g.gain.setValueAtTime(0, now + start);
      g.gain.linearRampToValueAtTime(gain, now + start + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      osc.connect(g);
      g.connect(audioCtx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur + 0.02);
    });
  } catch (_) {
    // Autoplay-blocked, context closed, or otherwise unavailable —
    // never surface this to the meeting UI, never retry.
  }
}

/** One participant (or a just-arrived batch) joining the meeting. */
export function playJoinChime() {
  playTones([
    { freq: 587.33, start: 0, dur: 0.14 }, // D5
    { freq: 880.0, start: 0.09, dur: 0.22 }, // A5
  ]);
}

/** Host-only: a new "ask to join" request came in. */
export function playJoinRequestChime() {
  playTones([
    { freq: 523.25, start: 0, dur: 0.12 }, // C5
    { freq: 659.25, start: 0.1, dur: 0.12 }, // E5
    { freq: 783.99, start: 0.2, dur: 0.18 }, // G5
  ]);
}

/** Host admitted a guest (or "Admit all"). */
export function playAdmitChime() {
  playTones([
    { freq: 659.25, start: 0, dur: 0.12 }, // E5
    { freq: 987.77, start: 0.08, dur: 0.16 }, // B5
  ]);
}

/** Host denied a guest — brief, neutral, not harsh. */
export function playDenyChime() {
  playTones([{ freq: 349.23, start: 0, dur: 0.16 }], { gain: 0.07 }); // F4
}

/** A new chat message arrived. */
export function playMessageChime() {
  playTones([{ freq: 740.0, start: 0, dur: 0.1 }], { gain: 0.08 }); // F#5
}