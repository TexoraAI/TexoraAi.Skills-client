import { X } from "lucide-react";
import LiveTrainerControlsGrid from "./LiveTrainerControlsGrid.jsx";
import LiveParticipantsPanel from "./LiveParticipantsPanel.jsx";
import "./LiveTrainerSidebar.css";

export default function LiveTrainerSidebar({
  isTrainer,
  activeTab,
  setActiveTab,
  onClose,
  participants,
  flags,
  onCommand,
  onParticipantAction,
}) {
  return (
    <div className="sb-panel glass">
      <div className="sb-tabs">
        {isTrainer && (
          <button
            className={`sb-tab ${activeTab === "controls" ? "sb-tab--active" : ""}`}
            onClick={() => setActiveTab("controls")}
          >
            Trainer Controls
          </button>
        )}
        <button
          className={`sb-tab ${activeTab === "participants" ? "sb-tab--active" : ""}`}
          onClick={() => setActiveTab("participants")}
        >
          Participants {participants.length}
        </button>
        <button className="sb-close" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className="sb-body hide-scrollbar">
        {activeTab === "controls" && isTrainer ? (
          <LiveTrainerControlsGrid flags={flags} onCommand={onCommand} />
        ) : (
          <LiveParticipantsPanel
            participants={participants}
            isTrainer={isTrainer}
            onAction={onParticipantAction}
          />
        )}
      </div>
    </div>
  );
}
