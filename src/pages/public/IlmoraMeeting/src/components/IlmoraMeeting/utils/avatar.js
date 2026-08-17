/* ─── deterministic abstract avatar (not a photo, not just a letter) ─
   Seeded off the person's stable name/identity so the same person
   always gets the same look across tiles/panels in a session.
   Google Meet uses flat, solid avatar colors (no gradients) — this
   palette mirrors that: one solid fill per person, chosen from a
   small rotating set of Meet-like hues. */
// Each entry is [tileBackdrop, avatarCircle] — a dark, muted backdrop so
// the tile recedes, paired with a brighter, more saturated version of the
// same hue so the avatar circle actually pops forward off it.
export const AVATAR_PALETTES = [
  ["#17301f", "#34a853"],
  ["#122a4a", "#4285f4"],
  ["#3a1f14", "#e8703a"],
  ["#2a2f38", "#8a97ab"],
  ["#2a1f38", "#9d6fd1"],
  ["#123030", "#20b2aa"],
  ["#3a2e0f", "#d1a53a"],
  ["#3a1818", "#c0554f"],
  ["#141f18", "#3f8f5f"],
  ["#1e1a38", "#7266c9"],
];

export function hashSeed(str) {
  let h = 0;
  const s = String(str || "?");
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function getAvatarStyle(seed) {
  const h = hashSeed(seed);
  return AVATAR_PALETTES[h % AVATAR_PALETTES.length][0];
}

export function getAvatarCircleStyle(seed) {
  const h = hashSeed(seed);
  return AVATAR_PALETTES[h % AVATAR_PALETTES.length][1];
}
