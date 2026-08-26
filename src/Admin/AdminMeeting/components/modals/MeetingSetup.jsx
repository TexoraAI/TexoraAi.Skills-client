import React, { useState } from "react";
import { Camera, Mic } from "lucide-react";
import WorkspaceModal from "./WorkspaceModal";
import { Field, TagInput, Switch, CheckOption } from "./FormControls";
import { contacts } from "../../data/mockData";

const contactEmails = contacts.map((c) => c.email);

export default function MeetingSetup({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState([]);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [waitingRoom, setWaitingRoom] = useState(true);
  const [muteOnEntry, setMuteOnEntry] = useState(false);
  const [recordMeeting, setRecordMeeting] = useState(false);
  const [allowScreenShare, setAllowScreenShare] = useState(true);
  const [error, setError] = useState("");

  const handleStart = () => {
    if (!title.trim()) {
      setError("Give your meeting a title before starting.");
      return;
    }
    onSubmit({
      title: title.trim(),
      participants,
      cameraOn,
      micOn,
      options: { waitingRoom, muteOnEntry, recordMeeting, allowScreenShare },
    });
  };

  return (
    <WorkspaceModal
      title="Start Instant Meeting"
      subtitle="Set up your camera, microphone and meeting options before you start."
      onClose={onClose}
      width={600}
      footer={
        <>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={handleStart}>
            Start Meeting
          </button>
        </>
      }
    >
      <Field label="Meeting Title" required id="ms-title">
        <input
          id="ms-title"
          className="wm-input"
          placeholder="e.g. Quick sync with mentors"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Field>

      <Field label="Participants" hint="Press Enter or comma to add an email.">
        <TagInput value={participants} onChange={setParticipants} placeholder="Add participant email" suggestions={contactEmails} />
      </Field>

      <div className="wm-device-row">
        <div className="wm-device-tile">
          <Camera size={16} />
          <Switch checked={cameraOn} onChange={setCameraOn} label="Camera" hint={cameraOn ? "On" : "Off"} />
        </div>
        <div className="wm-device-tile">
          <Mic size={16} />
          <Switch checked={micOn} onChange={setMicOn} label="Microphone" hint={micOn ? "On" : "Off"} />
        </div>
      </div>

      <Field label="Meeting Options">
        <div className="wm-check-list">
          <CheckOption checked={waitingRoom} onChange={setWaitingRoom} label="Enable waiting room" hint="Approve participants before they join" />
          <CheckOption checked={muteOnEntry} onChange={setMuteOnEntry} label="Mute participants on entry" />
          <CheckOption checked={allowScreenShare} onChange={setAllowScreenShare} label="Allow screen sharing" />
          <CheckOption checked={recordMeeting} onChange={setRecordMeeting} label="Record this meeting" />
        </div>
      </Field>

      {error && <p className="wm-error">{error}</p>}
    </WorkspaceModal>
  );
}
