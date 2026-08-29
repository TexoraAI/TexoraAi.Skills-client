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
let masterChain = null;

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

// A single shared limiter every tone routes through — lets each chime run
// louder/hotter without clipping or sounding harsh, instead of just raising
// the raw gain values.
function getMasterChain(audioCtx) {
  if (!masterChain) {
    const limiter = audioCtx.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-16, audioCtx.currentTime);
    limiter.knee.setValueAtTime(18, audioCtx.currentTime);
    limiter.ratio.setValueAtTime(8, audioCtx.currentTime);
    limiter.attack.setValueAtTime(0.002, audioCtx.currentTime);
    limiter.release.setValueAtTime(0.12, audioCtx.currentTime);
    limiter.connect(audioCtx.destination);
    masterChain = limiter;
  }
  return masterChain;
}

/**
 * Call as early as possible (e.g. as soon as the meeting room mounts, or on
 * the very first button click) to create/resume the AudioContext ahead of
 * time. Without this the FIRST chime of the call pays the one-time cost of
 * spinning up the audio hardware; priming it early means every real
 * notification — the first one included — plays with no perceptible delay.
 */
export function primeNotificationAudio() {
  getContext();
}

/**
 * Plays a short, non-looping sequence of tones.
 * notes: [{ freq, start=0, dur=0.16, type="sine" }, ...] — start/dur in seconds.
 */
function playTones(notes, { gain = 0.32 } = {}) {
  const audioCtx = getContext();
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const master = getMasterChain(audioCtx);
    notes.forEach(({ freq, start = 0, dur = 0.16, type = "sine" }) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + start);
      // Quick fade-in/out envelope keeps every tone clean — no clicks, no
      // harshness, no sustained/looping tail — even at a louder volume.
      g.gain.setValueAtTime(0, now + start);
      g.gain.linearRampToValueAtTime(gain, now + start + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      osc.connect(g);
      g.connect(master);
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
    { freq: 587.33, start: 0, dur: 0.16 }, // D5
    { freq: 880.0, start: 0.09, dur: 0.26 }, // A5
  ]);
}

/** Host-only: a new "ask to join" request came in. */
export function playJoinRequestChime() {
  playTones([
    { freq: 523.25, start: 0, dur: 0.14 }, // C5
    { freq: 659.25, start: 0.1, dur: 0.14 }, // E5
    { freq: 783.99, start: 0.2, dur: 0.2 }, // G5
  ]);
}

/** Host admitted a guest (or "Admit all"). */
export function playAdmitChime() {
  playTones([
    { freq: 659.25, start: 0, dur: 0.14 }, // E5
    { freq: 987.77, start: 0.08, dur: 0.18 }, // B5
  ]);
}

/** Host denied a guest — brief, neutral, not harsh. */
export function playDenyChime() {
  playTones([{ freq: 349.23, start: 0, dur: 0.18 }], { gain: 0.26 }); // F4
}

/** A new chat message arrived. */
export function playMessageChime() {
  playTones([{ freq: 740.0, start: 0, dur: 0.12 }], { gain: 0.3 }); // F#5
}

/**
 * Phase 2 — a participant raised their hand. This is deliberately the most
 * prominent tone in the set: louder gain than every Phase 1 chime, a
 * brighter "triangle" timbre instead of a plain sine, and a quick, bell-like
 * ascending two-note pattern — closely recreating the *feel* of Google
 * Meet's Raise Hand notification (clear, loud, short, immediately
 * recognizable) without reusing any of Google's actual audio. Still short,
 * clean, and non-looping like the rest of the set.
 */
export function playRaiseHandChime() {
  playTones(
    [
      { freq: 987.77, start: 0, dur: 0.15, type: "triangle" }, // B5
      { freq: 1318.51, start: 0.1, dur: 0.24, type: "triangle" }, // E6
    ],
    { gain: 0.42 },
  );
}