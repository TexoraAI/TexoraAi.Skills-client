import { useMemo, useState } from "react";
import { Clock, Sparkles, Users, ShieldCheck, Shield, X } from "lucide-react";
import { LB2 } from "../styles/lobbyStyles";
import { PJ } from "../styles/prejoinStyles";

/* ═════════════════════════════════════════════════════════════════
   LOBBY SCREEN — guest waiting for host to admit
═════════════════════════════════════════════════════════════════ */
export function LobbyScreen({ meetingInfo, onCancel }) {
  const meetingTitle = meetingInfo?.title || "this meeting";

  // Captured once, on mount, so it reflects the moment the guest
  // actually entered the waiting room.
  const [joinedAt] = useState(() => new Date());
  const joinedAtLabel = useMemo(
    () =>
      joinedAt.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    [joinedAt],
  );

  return (
    <div style={PJ.root}>
      <style>{`
        @keyframes lobbyPulseRing {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.18); opacity: .55; }
        }
        @keyframes lobbySparkleTwinkle {
          0%, 100% { opacity: .35; transform: scale(.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>

      <div style={LB2.wrap}>
        <div style={LB2.iconStage}>
          <div style={LB2.iconGlow} />
          <div style={LB2.iconRing} />
          <div style={LB2.iconCore}>
            <Clock size={28} color="#1a73e8" />
          </div>
          <Sparkles
            size={14}
            color="#1a73e8"
            style={{ ...LB2.sparkle, ...LB2.sparkleA }}
          />
          <Sparkles
            size={10}
            color="#9aa0a6"
            style={{ ...LB2.sparkle, ...LB2.sparkleB }}
          />
          <Sparkles
            size={12}
            color="#34a853"
            style={{ ...LB2.sparkle, ...LB2.sparkleC }}
          />
        </div>

        <h2 style={LB2.title}>Asking to join…</h2>
        <p style={LB2.subtitle}>
          You'll join <strong>{meetingTitle}</strong> as soon as the host
          lets you in.
        </p>

        <div style={LB2.infoBox}>
          <div style={LB2.infoCol}>
            <span style={LB2.infoIconWrap}>
              <Users size={16} color="#1a73e8" />
            </span>
            <span style={LB2.infoTextCol}>
              <span style={LB2.infoLabel}>Meeting</span>
              <span style={LB2.infoValue} title={meetingTitle}>
                {meetingTitle}
              </span>
            </span>
          </div>
          <div style={LB2.infoDivider} />
          <div style={LB2.infoCol}>
            <span style={LB2.infoIconWrap}>
              <Clock size={16} color="#1a73e8" />
            </span>
            <span style={LB2.infoTextCol}>
              <span style={LB2.infoLabel}>Joined at</span>
              <span style={LB2.infoValue}>{joinedAtLabel}</span>
            </span>
          </div>
        </div>

        <div style={LB2.waitingRow}>
          <span style={LB2.waitingIconWrap}>
            <ShieldCheck size={17} color="#1e8e3e" />
          </span>
          <span>
            <p style={LB2.waitingTitle}>You're in the waiting room</p>
            <p style={LB2.waitingSubtitle}>
              The host has been notified of your request. Please wait while
              they let you in.
            </p>
          </span>
        </div>

        <button style={LB2.cancelBtn} onClick={onCancel}>
          <X size={16} />
          Cancel
        </button>

        <div style={LB2.footer}>
          <Shield size={13} />
          <span>Your connection is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
}