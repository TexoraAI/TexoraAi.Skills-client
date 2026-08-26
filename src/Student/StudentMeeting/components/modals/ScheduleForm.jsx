import React, { useState } from "react";
import WorkspaceModal from "./WorkspaceModal";
import { Field, Row } from "./FormControls";

const TYPE_OPTIONS = ["Session", "Class", "Meeting", "Task", "Personal"];
const REMINDER_OPTIONS = ["No reminder", "5 minutes before", "10 minutes before", "30 minutes before", "1 hour before", "1 day before"];

export default function ScheduleForm({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [type, setType] = useState(TYPE_OPTIONS[0]);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [reminder, setReminder] = useState(REMINDER_OPTIONS[2]);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      setError("Give this schedule item a title before saving.");
      return;
    }
    if (!date || !startTime || !endTime) {
      setError("Pick a date, start time and end time.");
      return;
    }
    onSubmit({ title: title.trim(), date, startTime, endTime, type, location, description, reminder });
  };

  return (
    <WorkspaceModal
      title="Add Schedule"
      subtitle="Add a personal schedule item to your calendar."
      onClose={onClose}
      width={600}
      footer={
        <>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            Save Schedule
          </button>
        </>
      }
    >
      <Field label="Schedule Title" required id="sc-title">
        <input
          id="sc-title"
          className="wm-input"
          placeholder="e.g. Prep for DSA workshop"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Field>

      <Row cols={2}>
        <Field label="Date" required id="sc-date">
          <input id="sc-date" type="date" className="wm-input" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Type" id="sc-type">
          <select id="sc-type" className="wm-input" value={type} onChange={(e) => setType(e.target.value)}>
            {TYPE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
      </Row>

      <Row cols={2}>
        <Field label="Start Time" required id="sc-start">
          <input id="sc-start" type="time" className="wm-input" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </Field>
        <Field label="End Time" required id="sc-end">
          <input id="sc-end" type="time" className="wm-input" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </Field>
      </Row>

      <Field label="Location" id="sc-location">
        <input
          id="sc-location"
          className="wm-input"
          placeholder="e.g. Online, or Room 12"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </Field>

      <Field label="Description" id="sc-desc">
        <textarea
          id="sc-desc"
          className="wm-textarea"
          rows={3}
          placeholder="Add any notes for this schedule item..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>

      <Field label="Reminder" id="sc-reminder">
        <select id="sc-reminder" className="wm-input" value={reminder} onChange={(e) => setReminder(e.target.value)}>
          {REMINDER_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>

      {error && <p className="wm-error">{error}</p>}
    </WorkspaceModal>
  );
}
