import {
  Hand,
} from "lucide-react";
import { getAvatarStyle } from "../utils/avatar";

export const PersonRow = ({ name, isHost, self, handRaised, S }) => (
  <div style={S.pRow}>
    <div
      style={{
        ...S.pAv,
        background: getAvatarStyle(self ? "you" : name),
      }}
    >
      {(name || "?")[0]}
    </div>
    <span style={S.pName}>{name}</span>
    {handRaised && <Hand size={13} color="#fdd663" />}
    {isHost && <span style={S.hostTag}>Host</span>}
    {self && <span style={S.youTag}>You</span>}
  </div>
);
