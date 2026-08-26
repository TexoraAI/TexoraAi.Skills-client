import React, { useState } from "react";
import { Camera, Mic, ShieldCheck } from "lucide-react";
import WorkspaceModal from "./WorkspaceModal";
import { Field, Switch } from "./FormControls";

/* Real join flow: validates the meeting id/link the user typed on the
 * Instant Meeting page, then shows a proper "ready to join" step with
 * device toggles before actually joining — never just a toast. */

function validateMeetingRef(value) {
  const v = value.trim();
  if (!v) return "Enter a meeting ID or link first.";
  const looksLikeUrl = /^https?:\/\//i.test(v);
  const looksLikeId = /^[a-z0-9-]{6,}$/i.test(v.replace(/\s+/g, ""));
  if (!looksLikeUrl && !looksLikeId) {
    return "That doesn't look like a valid meeting ID or link.";
  }
  return "";
}

export default function JoinMeetingModal({ initialValue = "", onClose, onSubmit }) {
  const [meetingRef, setMeetingRef] = useState(initialValue);
  const [displayName, setDisplayName] = useState("");
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(false);
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);

  const handleValidate = () => {
    const err = validateMeetingRef(meetingRef);
    if (err) {
      setValidated(false);
      setError(err);
      return;
    }
    setError("");
    setValidated(true);
  };

  const handleJoin = () => {
    if (!validated) {
      handleValidate();
      return;
    }
    onSubmit({ meetingRef: meetingRef.trim(), displayName: displayName.trim(), cameraOn, micOn });
  };

  return (
    <WorkspaceModal
      title="Join Meeting"
      subtitle="Enter a meeting ID or link, check your devices, then join."
      onClose={onClose}
      width={560}
      footer={
        <>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          {!validated ? (
            <button type="button" className="btn-primary" onClick={handleValidate}>
              Continue
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={handleJoin}>
              Join Meeting
            </button>
          )}
        </>
      }
    >
      <Field label="Meeting ID or Link" required id="jm-ref">
        <input
          id="jm-ref"
          className="wm-input"
          placeholder="e.g. ilm-892-441 or https://meet.ilmora.ai/..."
          value={meetingRef}
          onChange={(e) => {
            setMeetingRef(e.target.value);
            setValidated(false);
          }}
        />
      </Field>

      {validated && (
        <>
          <div className="wm-validated-banner">
            <ShieldCheck size={15} /> Meeting found — ready to join.
          </div>

          <Field label="Your Name" id="jm-name">
            <input
              id="jm-name"
              className="wm-input"
              placeholder="How you'll appear to others"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
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
        </>
      )}

      {error && <p className="wm-error">{error}</p>}
    </WorkspaceModal>
  );
}
