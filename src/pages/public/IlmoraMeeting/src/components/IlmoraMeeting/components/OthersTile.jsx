// import { getAvatarCircleStyle } from "../utils/avatar";

// // How many overlapping avatar bubbles to draw before just relying on the
// // "+N others" count text (matches Meet's grouped tile in the reference
// // screenshot: a couple of overlapping avatars + a count label).
// const MAX_STACK = 2;

// export function OthersTile({ participants, S }) {
//   const stack = participants.slice(0, MAX_STACK);
//   const count = participants.length;

//   return (
//     <div style={S.gridCellOuter}>
//       <div
//         style={{ ...S.gridTile, ...S.gridOthersTile }}
//         className="im-grid-tile"
//       >
//         <div style={S.gridOthersStack}>
//           {stack.map((p, i) => {
//             const initial =
//               (p.name || "?").trim().charAt(0).toUpperCase() || "?";
//             return (
//               <div
//                 key={p.identity}
//                 style={{
//                   ...S.gridOthersAvatar,
//                   background: getAvatarCircleStyle(
//                     p.avatarSeed || p.identity || p.name,
//                   ),
//                   marginLeft: i === 0 ? 0 : -14,
//                   zIndex: stack.length - i,
//                 }}
//               >
//                 {initial}
//               </div>
//             );
//           })}
//         </div>
//         <div style={S.gridOthersLabel}>
//           {count} {count === 1 ? "other" : "others"}
//         </div>
//       </div>
//     </div>
//   );
// }












































import { getAvatarCircleStyle } from "../utils/avatar";

// How many overlapping avatar bubbles to draw before just relying on the
// "+N others" count text (matches Meet's grouped tile in the reference
// screenshot: a couple of overlapping avatars + a count label).
const MAX_STACK = 2;

export function OthersTile({ participants, S, device }) {
  const stack = participants.slice(0, MAX_STACK);
  const count = participants.length;
  const isPhone = device === "phone";

  return (
    <div
      style={{
        ...S.gridCellOuter,
        // FIX (mobile UI): on phone the "others" tile spans the full grid
        // row instead of occupying a single cell, matching the target
        // reference design. Tablet/desktop keep the original single-cell
        // sizing untouched.
        ...(isPhone ? { gridColumn: "1 / -1" } : null),
      }}
    >
      <div
        style={{
          ...S.gridTile,
          ...S.gridOthersTile,
          ...(isPhone ? S.gridOthersTileMobile : null),
        }}
        className="im-grid-tile"
      >
        <div style={S.gridOthersStack}>
          {stack.map((p, i) => {
            const initial =
              (p.name || "?").trim().charAt(0).toUpperCase() || "?";
            return (
              <div
                key={p.identity}
                style={{
                  ...S.gridOthersAvatar,
                  ...(isPhone ? S.gridOthersAvatarMobile : null),
                  background: getAvatarCircleStyle(
                    p.avatarSeed || p.identity || p.name,
                  ),
                  marginLeft: i === 0 ? 0 : isPhone ? -18 : -14,
                  zIndex: stack.length - i,
                }}
              >
                {initial}
              </div>
            );
          })}
        </div>
        <div
          style={{
            ...S.gridOthersLabel,
            ...(isPhone ? S.gridOthersLabelMobile : null),
          }}
        >
          {count} {count === 1 ? "other" : "others"}
        </div>
      </div>
    </div>
  );
}