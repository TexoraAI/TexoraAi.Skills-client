// // Column count for a given number of GRID TILES (not raw participant count —
// // see layoutGrid below, which accounts for the "+N others" tile taking up
// // one slot).
// export function gridColumns(n, maxCols = 5) {
//   if (n <= 1) return 1;
//   const idealCols = Math.ceil(Math.sqrt(n));
//   return Math.min(idealCols, maxCols);
// }

// // Max individual video tiles rendered before the rest of the participants
// // collapse into a single grouped "+N others" tile — mirrors Google Meet's
// // grid behavior so tiles never shrink past a usable size. Tune per device.
// const MAX_TILES = {
//   phone: 4,
//   tablet: 6,
//   desktop: 9,
// };

// // Splits participants into what's individually visible vs. grouped, and
// // returns the column count for the resulting tile set (visible + 1 "others"
// // tile, when present).
// export function layoutGrid(participants, device = "desktop", maxCols = 5) {
//   const maxTiles = MAX_TILES[device] ?? MAX_TILES.desktop;
//   const showOthers = participants.length > maxTiles;

//   const visible = showOthers
//     ? participants.slice(0, maxTiles - 1)
//     : participants;
//   const others = showOthers ? participants.slice(maxTiles - 1) : [];

//   const tileCount = visible.length + (showOthers ? 1 : 0);
//   const cols = gridColumns(tileCount, maxCols);

//   return { cols, visible, others };
// }


































// Column count for a given number of GRID TILES (not raw participant count —
// see layoutGrid below, which accounts for the "+N others" tile taking up
// one slot).
export function gridColumns(n, maxCols = 5) {
  if (n <= 1) return 1;
  const idealCols = Math.ceil(Math.sqrt(n));
  return Math.min(idealCols, maxCols);
}

// Max individual video tiles rendered before the rest of the participants
// collapse into a single grouped "+N others" tile — mirrors Google Meet's
// grid behavior so tiles never shrink past a usable size.
//
// phone: 5 → 4 individual tiles (2x2) + 1 "others" tile spanning the row
// below it, matching the target mobile reference design.
const MAX_TILES = {
  phone: 5,
  tablet: 6,
  desktop: 9,
};

// Splits participants into what's individually visible vs. grouped, and
// returns the column count for the resulting tile set (visible + 1 "others"
// tile, when present).
export function layoutGrid(participants, device = "desktop", maxCols = 5) {
  const maxTiles = MAX_TILES[device] ?? MAX_TILES.desktop;
  const showOthers = participants.length > maxTiles;

  const visible = showOthers
    ? participants.slice(0, maxTiles - 1)
    : participants;
  const others = showOthers ? participants.slice(maxTiles - 1) : [];

  const tileCount = visible.length + (showOthers ? 1 : 0);
  const cols = gridColumns(tileCount, maxCols);

  return { cols, visible, others };
}