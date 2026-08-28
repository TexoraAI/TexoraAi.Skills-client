import React, { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Paperclip,
  X as XIcon,
} from "lucide-react";
import WorkspaceModal from "./WorkspaceModal";
import { Field, Row, TagInput, Switch } from "./FormControls";
import { contacts, currentUser } from "../../data/mockData";

const contactEmails = contacts.map((c) => c.email);

export default function EmailComposer({ onClose, onSubmit }) {
  const [to, setTo] = useState([]);
  const [cc, setCc] = useState([]);
  const [bcc, setBcc] = useState([]);
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [subject, setSubject] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [scheduleSend, setScheduleSend] = useState(false);
  const [sendAt, setSendAt] = useState("");
  const [error, setError] = useState("");
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const applyFormat = (command) => {
    editorRef.current?.focus();
    document.execCommand(command, false, undefined);
  };
  const handleAttach = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) setAttachments((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeAttachment = (name) =>
    setAttachments((prev) => prev.filter((a) => a.name !== name));

  const collect = () => ({
    from: currentUser.email,
    to,
    cc,
    bcc,
    subject: subject.trim(),
    message: editorRef.current ? editorRef.current.innerHTML : "",
    attachments,
    scheduleSend,
    sendAt: scheduleSend ? sendAt : null,
  });

  const handleSend = () => {
    if (!to.length) {
      setError("Add at least one recipient in To.");
      return;
    }
    if (!subject.trim()) {
      setError("Add a subject before sending.");
      return;
    }
    if (scheduleSend && !sendAt) {
      setError("Pick a date & time to schedule this email.");
      return;
    }
    onSubmit({ action: "send", ...collect() });
  };

  const handleSaveDraft = () => {
    onSubmit({ action: "draft", ...collect() });
  };

  return (
    <WorkspaceModal
      title="Compose Email"
      subtitle="Write and send an email to contacts, mentors or students."
      onClose={onClose}
      width={680}
      footer={
        <>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-ghost" onClick={handleSaveDraft}>
            Save Draft
          </button>
          <button type="button" className="btn-primary" onClick={handleSend}>
            {scheduleSend ? "Schedule Send" : "Send"}
          </button>
        </>
      }
    >
      <Field label="From" id="em-from">
        <input
          id="em-from"
          className="wm-input"
          value={currentUser.email}
          disabled
        />
      </Field>

      <Field label="To" required>
        <TagInput
          value={to}
          onChange={setTo}
          placeholder="Add recipient email"
          suggestions={contactEmails}
        />
      </Field>

      {!showCcBcc ? (
        <button
          type="button"
          className="wm-inline-link"
          onClick={() => setShowCcBcc(true)}
        >
          + Add Cc / Bcc
        </button>
      ) : (
        <Row cols={2}>
          <Field label="Cc">
            <TagInput
              value={cc}
              onChange={setCc}
              placeholder="Add Cc email"
              suggestions={contactEmails}
            />
          </Field>
          <Field label="Bcc">
            <TagInput
              value={bcc}
              onChange={setBcc}
              placeholder="Add Bcc email"
              suggestions={contactEmails}
            />
          </Field>
        </Row>
      )}

      <Field label="Subject" required id="em-subject">
        <input
          id="em-subject"
          className="wm-input"
          placeholder="Email subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </Field>

      <Field label="Message">
        <div className="wm-richtext">
          <div className="wm-richtext-toolbar">
            <button
              type="button"
              title="Bold"
              onClick={() => applyFormat("bold")}
            >
              <Bold size={14} />
            </button>
            <button
              type="button"
              title="Italic"
              onClick={() => applyFormat("italic")}
            >
              <Italic size={14} />
            </button>
            <button
              type="button"
              title="Underline"
              onClick={() => applyFormat("underline")}
            >
              <Underline size={14} />
            </button>
            <button
              type="button"
              title="Bulleted list"
              onClick={() => applyFormat("insertUnorderedList")}
            >
              <List size={14} />
            </button>
            <button
              type="button"
              title="Numbered list"
              onClick={() => applyFormat("insertOrderedList")}
            >
              <ListOrdered size={14} />
            </button>
            <button
              type="button"
              title="Insert link"
              onClick={() => {
                const url = window.prompt("Link URL");
                if (url) {
                  editorRef.current?.focus();
                  document.execCommand("createLink", false, url);
                }
              }}
            >
              <Link2 size={14} />
            </button>
          </div>
          <div
            ref={editorRef}
            className="wm-richtext-area"
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Write your message..."
          />
        </div>
      </Field>

      <Field label="Attachment">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={handleAttach}
        />
        <button
          type="button"
          className="btn-ghost btn-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip size={13} /> Attach files
        </button>
        {attachments.length > 0 && (
          <div className="wm-attachment-list">
            {attachments.map((file) => (
              <span className="wm-attachment-chip" key={file.name}>
                {file.name}
                <button
                  type="button"
                  onClick={() => removeAttachment(file.name)}
                  aria-label={`Remove ${file.name}`}
                >
                  <XIcon size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
      </Field>

      <Switch
        checked={scheduleSend}
        onChange={setScheduleSend}
        label="Schedule Send"
        hint="Send this email automatically at a later time."
      />
      {scheduleSend && (
        <Field label="Send at" id="em-schedule">
          <input
            id="em-schedule"
            type="datetime-local"
            className="wm-input"
            value={sendAt}
            onChange={(e) => setSendAt(e.target.value)}
          />
        </Field>
      )}

      {error && <p className="wm-error">{error}</p>}
    </WorkspaceModal>
  );
}
