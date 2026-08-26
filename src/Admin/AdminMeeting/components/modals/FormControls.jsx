import React, { useState } from "react";
import { X as XIcon } from "lucide-react";

/* -----------------------------------------------------------------------
 * Small, reusable building blocks shared by every Workspace modal form
 * (EventForm, ScheduleForm, EmailComposer, ContactForm, MeetingSetup).
 * Kept in one file so every form field looks and behaves identically.
 * ----------------------------------------------------------------------- */

export function Field({ label, required, hint, children, id }) {
  return (
    <div className="wm-field">
      {label && (
        <label className="wm-label" htmlFor={id}>
          {label} {required && <span className="wm-required">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="wm-hint">{hint}</p>}
    </div>
  );
}

export function Row({ children, cols = 2 }) {
  return (
    <div className="wm-row" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {children}
    </div>
  );
}

export function Section({ title, children }) {
  return (
    <div className="wm-section">
      {title && <div className="wm-section-title">{title}</div>}
      {children}
    </div>
  );
}

let tagInputSeq = 0;

export function TagInput({ value, onChange, placeholder, suggestions = [] }) {
  const [draft, setDraft] = useState("");
  const [listId] = useState(() => `wm-taginput-list-${++tagInputSeq}`);

  const commit = () => {
    const v = draft.trim().replace(/,$/, "");
    if (v && !value.includes(v)) onChange([...value, v]);
    setDraft("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="wm-taginput">
      {value.map((v) => (
        <span className="wm-tag" key={v}>
          {v}
          <button type="button" onClick={() => onChange(value.filter((x) => x !== v))} aria-label={`Remove ${v}`}>
            <XIcon size={11} />
          </button>
        </span>
      ))}
      <input
        list={listId}
        value={draft}
        placeholder={value.length ? "" : placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
      />
      {suggestions.length > 0 && (
        <datalist id={listId}>
          {suggestions.map((s) => (
            <option value={s} key={s} />
          ))}
        </datalist>
      )}
    </div>
  );
}

export function Switch({ checked, onChange, label, hint }) {
  return (
    <div className="wm-switch-row">
      <div>
        <div className="wm-switch-label">{label}</div>
        {hint && <div className="wm-switch-hint">{hint}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`wm-switch ${checked ? "is-on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span className="wm-switch-knob" />
      </button>
    </div>
  );
}

export function SegmentedToggle({ options, value, onChange }) {
  return (
    <div className="wm-segmented">
      {options.map((opt) => (
        <button
          type="button"
          key={opt}
          className={`wm-segment ${value === opt ? "is-active" : ""}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function CheckOption({ checked, onChange, label, hint }) {
  return (
    <label className="wm-check-option">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        <span className="wm-check-label">{label}</span>
        {hint && <span className="wm-check-hint">{hint}</span>}
      </span>
    </label>
  );
}
