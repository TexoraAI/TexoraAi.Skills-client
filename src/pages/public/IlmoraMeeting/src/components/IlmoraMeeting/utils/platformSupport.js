/* ─── screen-share platform support detection ─────────────────────
   Real-world constraints this file now accounts for:
     • iOS Safari / iPadOS Safari (all versions in wide use) does not
       expose getDisplayMedia at all — screen sharing is simply not
       possible from the browser on iPhone/iPad. We detect this and
       disable the button instead of letting it throw at click time.
     • Desktop Chrome/Edge/Firefox/Safari (Mac), and Android Chrome,
       all support getDisplayMedia but differ in what they let you
       pick (window vs. tab vs. entire screen) and whether audio
       capture is possible — we never assume audio capture works.
     • Must be a secure context (HTTPS) — getDisplayMedia is undefined
       on plain HTTP, which otherwise looks identical to "unsupported".
   ──────────────────────────────────────────────────────────────── */
export function detectSpeechRecognitionSupport() {
  if (typeof window === "undefined") return { supported: false };
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  return SR ? { supported: true, SR } : { supported: false };
}

export function detectScreenShareSupport() {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return { supported: false, reason: "unavailable" };
  }
  const ua = navigator.userAgent || "";
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes("Macintosh") && navigator.maxTouchPoints > 1); // iPadOS reports as Mac
  const isSafari =
    /^((?!chrome|android|crios|fxios).)*safari/i.test(ua) || isIOS;
  const hasApi =
    !!navigator.mediaDevices && !!navigator.mediaDevices.getDisplayMedia;
  const isSecure =
    window.isSecureContext !== undefined ? window.isSecureContext : true;

  if (!isSecure) {
    return {
      supported: false,
      reason: "insecure",
      message:
        "Screen sharing needs a secure (HTTPS) connection. Please load this meeting over HTTPS.",
    };
  }
  // iOS/iPadOS Safari (and any iOS browser, since they all use WebKit and
  // inherit the same limitation) cannot capture the screen from the web.
  if (isIOS) {
    return {
      supported: false,
      reason: "ios",
      message:
        "Screen sharing isn't supported by Safari on iPhone/iPad yet. You can still present using a Mac, Windows, Linux, or Android device.",
    };
  }
  if (!hasApi) {
    return {
      supported: false,
      reason: "no-api",
      message: isSafari
        ? "This version of Safari doesn't support screen sharing. Please update Safari or use Chrome/Edge/Firefox."
        : "Screen sharing isn't supported in this browser. Please use an up-to-date Chrome, Edge, Firefox, or Safari.",
    };
  }
  return { supported: true };
}
