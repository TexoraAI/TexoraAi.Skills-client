// import React, { useState } from "react";
// import WorkspaceModal from "./WorkspaceModal";
// import { Field, Row, TagInput, SegmentedToggle } from "./FormControls";
// import { contacts } from "../../data/mockData";

// const REMINDER_OPTIONS = ["No reminder", "5 minutes before", "10 minutes before", "30 minutes before", "1 hour before", "1 day before"];
// const REPEAT_OPTIONS = ["Does not repeat", "Daily", "Weekly", "Monthly", "Custom..."];
// const AVAILABILITY_OPTIONS = ["Busy", "Free", "Tentative", "Out of office"];
// const contactEmails = contacts.map((c) => c.email);

// export default function EventForm({ onClose, onSubmit }) {
//   const [title, setTitle] = useState("");
//   const [required, setRequired] = useState([]);
//   const [optional, setOptional] = useState([]);
//   const [date, setDate] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [location, setLocation] = useState("");
//   const [mode, setMode] = useState("Online");
//   const [meetingLink, setMeetingLink] = useState("");
//   const [description, setDescription] = useState("");
//   const [reminder, setReminder] = useState(REMINDER_OPTIONS[2]);
//   const [repeat, setRepeat] = useState(REPEAT_OPTIONS[0]);
//   const [availability, setAvailability] = useState(AVAILABILITY_OPTIONS[0]);
//   const [error, setError] = useState("");

//   const handleSave = () => {
//     if (!title.trim()) {
//       setError("Give your event a title before saving.");
//       return;
//     }
//     if (!date || !startTime || !endTime) {
//       setError("Pick a date, start time and end time.");
//       return;
//     }
//     onSubmit({
//       title: title.trim(),
//       required,
//       optional,
//       date,
//       startTime,
//       endTime,
//       location,
//       mode,
//       meetingLink,
//       description,
//       reminder,
//       repeat,
//       availability,
//     });
//   };

//   return (
//     <WorkspaceModal
//       title="Create Event"
//       subtitle="Schedule a live session, workshop or review for your students."
//       onClose={onClose}
//       width={680}
//       footer={
//         <>
//           <button type="button" className="btn-ghost" onClick={onClose}>
//             Cancel
//           </button>
//           <button type="button" className="btn-primary" onClick={handleSave}>
//             Save Event
//           </button>
//         </>
//       }
//     >
//       <Field label="Event Title" required id="ev-title">
//         <input
//           id="ev-title"
//           className="wm-input"
//           placeholder="e.g. Learning React - Live Session"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//       </Field>

//       <Field label="Required Attendees" hint="Press Enter or comma to add an email.">
//         <TagInput value={required} onChange={setRequired} placeholder="Add required attendee email" suggestions={contactEmails} />
//       </Field>

//       <Field label="Optional Attendees" hint="Press Enter or comma to add an email.">
//         <TagInput value={optional} onChange={setOptional} placeholder="Add optional attendee email" suggestions={contactEmails} />
//       </Field>

//       <Row cols={3}>
//         <Field label="Date" required id="ev-date">
//           <input id="ev-date" type="date" className="wm-input" value={date} onChange={(e) => setDate(e.target.value)} />
//         </Field>
//         <Field label="Start Time" required id="ev-start">
//           <input id="ev-start" type="time" className="wm-input" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
//         </Field>
//         <Field label="End Time" required id="ev-end">
//           <input id="ev-end" type="time" className="wm-input" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
//         </Field>
//       </Row>

//       <Field label="Online / In-person">
//         <SegmentedToggle options={["Online", "In-person"]} value={mode} onChange={setMode} />
//       </Field>

//       {mode === "Online" ? (
//         <Field label="Meeting Link" id="ev-link" hint="Leave blank to auto-generate a link when the event is created.">
//           <input
//             id="ev-link"
//             className="wm-input"
//             placeholder="https://meet.ilmora.ai/..."
//             value={meetingLink}
//             onChange={(e) => setMeetingLink(e.target.value)}
//           />
//         </Field>
//       ) : (
//         <Field label="Location" id="ev-location">
//           <input
//             id="ev-location"
//             className="wm-input"
//             placeholder="e.g. ILM ORA Campus, Room 204"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           />
//         </Field>
//       )}

//       <Field label="Description" id="ev-desc">
//         <textarea
//           id="ev-desc"
//           className="wm-textarea"
//           rows={4}
//           placeholder="What will this event cover?"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//       </Field>

//       <Row cols={3}>
//         <Field label="Reminder" id="ev-reminder">
//           <select id="ev-reminder" className="wm-input" value={reminder} onChange={(e) => setReminder(e.target.value)}>
//             {REMINDER_OPTIONS.map((o) => (
//               <option key={o} value={o}>
//                 {o}
//               </option>
//             ))}
//           </select>
//         </Field>
//         <Field label="Repeat / Series" id="ev-repeat">
//           <select id="ev-repeat" className="wm-input" value={repeat} onChange={(e) => setRepeat(e.target.value)}>
//             {REPEAT_OPTIONS.map((o) => (
//               <option key={o} value={o}>
//                 {o}
//               </option>
//             ))}
//           </select>
//         </Field>
//         <Field label="Availability" id="ev-availability">
//           <select id="ev-availability" className="wm-input" value={availability} onChange={(e) => setAvailability(e.target.value)}>
//             {AVAILABILITY_OPTIONS.map((o) => (
//               <option key={o} value={o}>
//                 {o}
//               </option>
//             ))}
//           </select>
//         </Field>
//       </Row>

//       {error && <p className="wm-error">{error}</p>}
//     </WorkspaceModal>
//   );
// }





























import React, { useState } from "react";
import WorkspaceModal from "./WorkspaceModal";
import { Field, Row, TagInput, SegmentedToggle } from "./FormControls";
import { contacts } from "../../data/mockData";

const REMINDER_OPTIONS = ["No reminder", "5 minutes before", "10 minutes before", "30 minutes before", "1 hour before", "1 day before"];
const REPEAT_OPTIONS = ["Does not repeat", "Daily", "Weekly", "Monthly", "Custom..."];
const AVAILABILITY_OPTIONS = ["Busy", "Free", "Tentative", "Out of office"];
const contactEmails = contacts.map((c) => c.email);

export default function EventForm({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [required, setRequired] = useState([]);
  const [optional, setOptional] = useState([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState("Online");
  const [meetingLink, setMeetingLink] = useState("");
  const [description, setDescription] = useState("");
  const [reminder, setReminder] = useState(REMINDER_OPTIONS[2]);
  const [repeat, setRepeat] = useState(REPEAT_OPTIONS[0]);
  const [availability, setAvailability] = useState(AVAILABILITY_OPTIONS[0]);
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
    onSubmit({
      title: title.trim(),
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
      title="Create Event"
      subtitle="Schedule a live session, workshop or review for your students."
      onClose={onClose}
      width={520}
      footer={
        <>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            Save Event
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

      <Field label="Required Attendees" hint="Press Enter or comma to add an email.">
        <TagInput value={required} onChange={setRequired} placeholder="Add required attendee email" suggestions={contactEmails} />
      </Field>

      <Field label="Optional Attendees" hint="Press Enter or comma to add an email.">
        <TagInput value={optional} onChange={setOptional} placeholder="Add optional attendee email" suggestions={contactEmails} />
      </Field>

      <Row cols={3}>
        <Field label="Date" required id="ev-date">
          <input id="ev-date" type="date" className="wm-input" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Start Time" required id="ev-start">
          <input id="ev-start" type="time" className="wm-input" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </Field>
        <Field label="End Time" required id="ev-end">
          <input id="ev-end" type="time" className="wm-input" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </Field>
      </Row>

      <Field label="Online / In-person">
        <SegmentedToggle options={["Online", "In-person"]} value={mode} onChange={setMode} />
      </Field>

      {mode === "Online" ? (
        <Field label="Meeting Link" id="ev-link" hint="Leave blank to auto-generate a link when the event is created.">
          <input
            id="ev-link"
            className="wm-input"
            placeholder="https://meet.ilmora.ai/..."
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
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
          <select id="ev-reminder" className="wm-input" value={reminder} onChange={(e) => setReminder(e.target.value)}>
            {REMINDER_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Repeat / Series" id="ev-repeat">
          <select id="ev-repeat" className="wm-input" value={repeat} onChange={(e) => setRepeat(e.target.value)}>
            {REPEAT_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Availability" id="ev-availability">
          <select id="ev-availability" className="wm-input" value={availability} onChange={(e) => setAvailability(e.target.value)}>
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