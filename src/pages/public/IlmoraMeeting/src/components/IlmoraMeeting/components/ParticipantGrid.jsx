// import { GridTile } from "./GridTile";
// import { OthersTile } from "./OthersTile";
// import { layoutGrid } from "./gridColumns";

// export function ParticipantGrid({
//   participants,
//   raisedHands,
//   handRaised,
//   reactions,
//   S,
//   device,
// }) {
//   const maxCols = device === "phone" ? 3 : device === "tablet" ? 3 : 5;
//   const { cols, visible, others } = layoutGrid(participants, device, maxCols);

//   return (
//     <div
//       style={{
//         ...S.gridWrap,
//         gridTemplateColumns: `repeat(${cols}, 1fr)`,
//       }}
//       className="im-grid"
//     >
//       {visible.map((p) => (
//         <GridTile
//           key={p.identity}
//           p={p}
//           raised={p.isLocal ? handRaised : !!raisedHands[p.identity]}
//           reaction={reactions[p.identity]}
//           S={S}
//         />
//       ))}
//       {others.length > 0 && <OthersTile participants={others} S={S} />}
//     </div>
//   );
// }

































import { GridTile } from "./GridTile";
import { OthersTile } from "./OthersTile";
import { layoutGrid } from "./gridColumns";

export function ParticipantGrid({
  participants,
  raisedHands,
  handRaised,
  reactions,
  S,
  device,
}) {
  // FIX (mobile UI): phone now lays out 2 columns instead of 3 — matches
  // the target reference design (2x2 individual tiles + a full-width
  // "+N others" row). Tablet/desktop are untouched.
  const maxCols = device === "phone" ? 2 : device === "tablet" ? 3 : 5;
  const { cols, visible, others } = layoutGrid(participants, device, maxCols);

  return (
    <div
      style={{
        ...S.gridWrap,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
      className="im-grid"
    >
      {visible.map((p) => (
        <GridTile
          key={p.identity}
          p={p}
          raised={p.isLocal ? handRaised : !!raisedHands[p.identity]}
          reaction={reactions[p.identity]}
          S={S}
        />
      ))}
      {others.length > 0 && (
        <OthersTile participants={others} S={S} device={device} />
      )}
    </div>
  );
}