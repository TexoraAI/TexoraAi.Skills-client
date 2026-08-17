import { createPortal } from "react-dom";
import {
  Captions,
  Clock,
  Disc2,
  Hand,
  LayoutGrid,
  MessageSquare,
  MonitorOff,
  MonitorUp,
  PhoneOff,
  PictureInPicture2,
  Settings,
  User,
  Users,
} from "lucide-react";

export function MobileMoreSheet({
  open,
  onClose,
  handRaised,
  onToggleHand,
  screenOn,
  screenShareSupport,
  onToggleScreen,
  captionsOn,
  onToggleCaptions,
  pipOn,
  onTogglePip,
  onOpenPeople,
  onOpenChat,
  isHost,
  waitingCount,
  onOpenWaiting,
  recording,
  onToggleRecording,
  onOpenSettings,
  gridView,
  onToggleLayout,
  onLeave,
  isEnding,
  S,
}) {
  if (!open) return null;
  return createPortal(
    <>
      <div style={S.mobileSheetBackdrop} onClick={onClose} />
      <div style={S.mobileSheet} role="dialog" aria-label="More options">
        <div style={S.mobileSheetHandle} />

        <button
          style={{
            ...S.mobileSheetPillWide,
            ...(handRaised ? S.mobileSheetPillActive : null),
          }}
          onClick={onToggleHand}
        >
          <Hand size={17} />
          {handRaised ? "Lower hand" : "Raise hand"}
        </button>

        <div style={S.mobileSheetIconRow}>
          <button
            style={{
              ...S.mobileSheetIconBtn,
              ...(screenOn ? S.mobileSheetIconBtnActive : null),
              opacity: !screenOn && !screenShareSupport.supported ? 0.5 : 1,
            }}
            onClick={onToggleScreen}
            disabled={!screenOn && !screenShareSupport.supported}
            title={
              !screenOn && !screenShareSupport.supported
                ? screenShareSupport.message
                : undefined
            }
          >
            {screenOn ? <MonitorOff size={19} /> : <MonitorUp size={19} />}
            <span>
              {!screenShareSupport.supported ? "Unsupported" : "Present"}
            </span>
          </button>
          <button
            style={{
              ...S.mobileSheetIconBtn,
              ...(captionsOn ? S.mobileSheetIconBtnActive : null),
            }}
            onClick={onToggleCaptions}
          >
            <Captions size={19} />
            <span>Captions</span>
          </button>
          <button
            style={{
              ...S.mobileSheetIconBtn,
              ...(pipOn ? S.mobileSheetIconBtnActive : null),
            }}
            onClick={onTogglePip}
          >
            <PictureInPicture2 size={19} />
            <span>Pop out</span>
          </button>
          <button style={S.mobileSheetIconBtn} onClick={onToggleLayout}>
            {gridView ? <User size={19} /> : <LayoutGrid size={19} />}
            <span>{gridView ? "Speaker" : "Grid"}</span>
          </button>
        </div>

        <div style={S.mobileSheetRow2}>
          <button style={S.mobileSheetPillHalf} onClick={onOpenPeople}>
            <Users size={16} />
            People
          </button>
          <button style={S.mobileSheetPillHalf} onClick={onOpenChat}>
            <MessageSquare size={16} />
            Chat
          </button>
        </div>

        {isHost && (
          <div style={S.mobileSheetRow2}>
            <button style={S.mobileSheetPillHalf} onClick={onOpenWaiting}>
              <Clock size={16} />
              Waiting{waitingCount > 0 ? ` (${waitingCount})` : ""}
            </button>
            <button
              style={{
                ...S.mobileSheetPillHalf,
                ...(recording ? S.mobileSheetPillActive : null),
              }}
              onClick={onToggleRecording}
            >
              <Disc2 size={16} />
              {recording ? "Stop rec" : "Record"}
            </button>
          </div>
        )}

        <button style={S.mobileSheetPillWide} onClick={onOpenSettings}>
          <Settings size={16} />
          Settings
        </button>

        <button
          style={{ ...S.mobileSheetPillWide, ...S.mobileSheetLeaveBtn }}
          onClick={onLeave}
          disabled={isHost && isEnding}
        >
          <PhoneOff size={16} />
          {isHost ? (isEnding ? "Ending…" : "End meeting") : "Leave meeting"}
        </button>
      </div>
    </>,
    document.body,
  );
}
