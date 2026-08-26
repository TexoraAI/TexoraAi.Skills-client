import React, { useState } from "react";
import WorkspaceModal from "./WorkspaceModal";
import { Field, Row, TagInput, SegmentedToggle } from "./FormControls";
import { contacts } from "../../data/mockData";

const REMINDER_OPTIONS = [
  "No reminder",
  "5 minutes before",
  "10 minutes before",
  "30 minutes before",
  "1 hour before",
  "1 day before",
];
const PURPOSE_OPTIONS = [
  "Live Class / Lecture",
  "Workshop",
  "Doubt Clearing / Q&A",
  "Exam / Assessment",
  "Orientation",
  "Webinar",
  "Review / Feedback Session",
  "Custom...",
];
const REPEAT_OPTIONS = [
  "Does not repeat",
  "Daily",
  "Weekly",
  "Monthly",
  "Custom...",
];
const AVAILABILITY_OPTIONS = ["Busy", "Free", "Tentative", "Out of office"];
const contactEmails = contacts.map((c) => c.email);

export default function EventForm({ onClose, onSubmit, eventToEdit }) {
  const isEdit = Boolean(eventToEdit);

  const [title, setTitle] = useState(eventToEdit?.title || "");
  const [required, setRequired] = useState(
    eventToEdit?.attendees
      ?.filter((a) => a.type === "REQUIRED")
      .map((a) => a.attendeeEmail) || [],
  );
  const [optional, setOptional] = useState(
    eventToEdit?.attendees
      ?.filter((a) => a.type === "OPTIONAL")
      .map((a) => a.attendeeEmail) || [],
  );
  const [date, setDate] = useState(eventToEdit?.date || "");
  const [startTime, setStartTime] = useState(eventToEdit?.startTime || "");
  const [endTime, setEndTime] = useState(eventToEdit?.endTime || "");
  const [purpose, setPurpose] = useState(
    eventToEdit?.purpose || PURPOSE_OPTIONS[0],
  );
  const [customPurpose, setCustomPurpose] = useState("");
  const [location, setLocation] = useState(eventToEdit?.location || "");
  const [mode, setMode] = useState(
    eventToEdit?.mode === "IN_PERSON" ? "In-person" : "Online",
  );
  const [meetingLink, setMeetingLink] = useState(eventToEdit?.meetingUrl || "");
  const [description, setDescription] = useState(
    eventToEdit?.description || "",
  );
  const [reminder, setReminder] = useState(
    eventToEdit?.reminder || REMINDER_OPTIONS[2],
  );
  const [repeat, setRepeat] = useState(
    eventToEdit?.repeat || REPEAT_OPTIONS[0],
  );
  const [availability, setAvailability] = useState(
    eventToEdit?.availability || AVAILABILITY_OPTIONS[0],
  );
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      setError("Give your event a title before saving.");
      return;
    }
    if (!date || !startTime || !endTime) {
      setError("Pick a date, start time and end time.");
      return;
    }
    if (purpose === "Custom..." && !customPurpose.trim()) {
      setError("Enter a custom purpose for this event.");
      return;
    }
    onSubmit({
      title: title.trim(),
      purpose: purpose === "Custom..." ? customPurpose.trim() : purpose,
      required,
      optional,
      date,
      startTime,
      endTime,
      location,
      mode,
      meetingLink,
      description,
      reminder,
      repeat,
      availability,
    });
  };

  return (
    <WorkspaceModal
      title={isEdit ? "Edit Event" : "Create Event"}
      subtitle="Schedule a live session, workshop or review for your students."
      onClose={onClose}
      width={520}
      footer={
        <>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            {isEdit ? "Update Event" : "Save Event"}
          </button>
        </>
      }
    >
      <Field label="Event Title" required id="ev-title">
        <input
          id="ev-title"
          className="wm-input"
          placeholder="e.g. Learning React - Live Session"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Field>
      <Field label="Purpose" id="ev-purpose">
        <select
          id="ev-purpose"
          className="wm-input"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        >
          {PURPOSE_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>

      {purpose === "Custom..." && (
        <Field label="Custom Purpose" id="ev-custom-purpose">
          <input
            id="ev-custom-purpose"
            className="wm-input"
            placeholder="Describe why you're creating this event"
            value={customPurpose}
            onChange={(e) => setCustomPurpose(e.target.value)}
          />
        </Field>
      )}

      <Field
        label="Required Attendees"
        hint="Press Enter or comma to add an email."
      >
        <TagInput
          value={required}
          onChange={setRequired}
          placeholder="Add required attendee email"
          suggestions={contactEmails}
        />
      </Field>

      <Field
        label="Optional Attendees"
        hint="Press Enter or comma to add an email."
      >
        <TagInput
          value={optional}
          onChange={setOptional}
          placeholder="Add optional attendee email"
          suggestions={contactEmails}
        />
      </Field>

      <Row cols={3}>
        <Field label="Date" required id="ev-date">
          <input
            id="ev-date"
            type="date"
            className="wm-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
        <Field label="Start Time" required id="ev-start">
          <input
            id="ev-start"
            type="time"
            className="wm-input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </Field>
        <Field label="End Time" required id="ev-end">
          <input
            id="ev-end"
            type="time"
            className="wm-input"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </Field>
      </Row>

      <Field label="Online / In-person">
        <SegmentedToggle
          options={["Online", "In-person"]}
          value={mode}
          onChange={setMode}
        />
      </Field>

      {mode === "Online" ? (
        <Field label="Meeting Link" id="ev-link">
          <input
            id="ev-link"
            className="wm-input"
            value={
              eventToEdit?.meetingUrl ||
              "Will be generated automatically when you save"
            }
            disabled
            readOnly
          />
        </Field>
      ) : (
        <Field label="Location" id="ev-location">
          <input
            id="ev-location"
            className="wm-input"
            placeholder="e.g. ILM ORA Campus, Room 204"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Field>
      )}

      <Field label="Description" id="ev-desc">
        <textarea
          id="ev-desc"
          className="wm-textarea"
          rows={4}
          placeholder="What will this event cover?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>

      <Row cols={3}>
        <Field label="Reminder" id="ev-reminder">
          <select
            id="ev-reminder"
            className="wm-input"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
          >
            {REMINDER_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Repeat / Series" id="ev-repeat">
          <select
            id="ev-repeat"
            className="wm-input"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
          >
            {REPEAT_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Availability" id="ev-availability">
          <select
            id="ev-availability"
            className="wm-input"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            {AVAILABILITY_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
      </Row>

      {error && <p className="wm-error">{error}</p>}
    </WorkspaceModal>
  );
}
