// import { GridTile } from "./GridTile";
// import { gridColumns } from "./gridColumns";

// export function ParticipantGrid({
//   participants,
//   raisedHands,
//   handRaised,
//   reactions,
//   S,
//   device,
// }) {
//   const maxCols = device === "phone" ? 3 : device === "tablet" ? 3 : 5;
//   const cols = gridColumns(participants.length, maxCols);
//   return (
//     <div style={S.gridWrap} className="im-grid">
//       {participants.map((p) => (
//         <GridTile
//           key={p.identity}
//           p={p}
//           raised={p.isLocal ? handRaised : !!raisedHands[p.identity]}
//           reaction={reactions[p.identity]}
//           S={S}
//           basisPercent={100 / cols}
//         />
//       ))}
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
  const maxCols = device === "phone" ? 3 : device === "tablet" ? 3 : 5;
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
      {others.length > 0 && <OthersTile participants={others} S={S} />}
    </div>
  );
}