import { useEffect, useRef, useState } from "react";
import { ChevronDown, PlayCircle, CalendarClock, CalendarPlus, Copy, CheckCircle2 } from "lucide-react";
import Reveal from "./Reveal";

function WFJoinByCode() {
  const code = "7K3F9Q".split("");
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    if (filled >= code.length) return;
    const t = setTimeout(() => setFilled((f) => f + 1), 220);
    return () => clearTimeout(t);
  }, [filled, code.length]);

  return (
    <div className="wf-visual">
      <div className="wf-join-card">
        <div className="wf-code-row">
          {code.map((c, i) => (
            <span key={i} className={i < filled ? "wf-filled" : ""}>
              {i < filled ? c : ""}
            </span>
          ))}
        </div>
        <div className="wf-join-hint">Enter the code your host sent you</div>
        <button className="wf-btn wf-btn-primary" style={{ width: "100%" }} type="button">
          Join meeting
        </button>
      </div>
    </div>
  );
}

function WFInstantMeetingMenu() {
  const [open, setOpen] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="wf-visual wf-visual-dark" ref={ref}>
      <div className="wf-split-demo">
        <button className="wf-split-main" type="button" onClick={() => setOpen(false)}>
          + New meeting
        </button>
        <button className="wf-split-caret" type="button" onClick={() => setOpen((o) => !o)} aria-label="More options">
          <ChevronDown size={15} />
        </button>
      </div>
      {open && (
        <div className="wf-menu-demo">
          <div className="wf-menu-item">
            <PlayCircle size={16} />
            Start instant session
          </div>
          <div className="wf-menu-item">
            <CalendarClock size={16} />
            Schedule for later
          </div>
          <div className="wf-menu-item">
            <CalendarPlus size={16} />
            Add to calendar
          </div>
        </div>
      )}
    </div>
  );
}

function WFShareableLink() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="wf-visual wf-visual-dark">
      <div className="wf-link-modal">
        <h5>Weekly product sync</h5>
        <div className="wf-link-field">
          <label>SESSION CODE</label>
          <div className="wf-link-input-row">
            <input readOnly value="7K3F9Q" />
          </div>
        </div>
        <div className="wf-link-field">
          <label>SHAREABLE LINK</label>
          <div className="wf-link-input-row">
            <input readOnly value="ilmora.app/j/7k3f9q" />
            <button className="wf-copy-btn" type="button" title="Copy link" onClick={handleCopy}>
              {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
            </button>
          </div>
          {copied && <div className="wf-copy-confirm">Link copied ✓</div>}
        </div>
      </div>
    </div>
  );
}

export default function StartJoinSection() {
  return (
    <div className="wf-band wf-band-tint" id="wf-start">
      <div className="wf-band-inner">
        {/* Shared section intro — kept in this band (not a separate white
            block) so the page doesn't run three white sections in a row. */}
        <div className="section-head wf-features-intro">
          <h2>Everything that happens <em className="word-orange">before</em>, <em className="word-green">during</em> and after</h2>
          <p>Not a bolt-on video tool — Meetings speaks the same language as your batches, trainers and organizations.</p>
        </div>

        <div className="wf-eyebrow">Start &amp; join</div>
        <h3 className="wf-h3">Into a room in one click — from either side.</h3>
        <p className="wf-lead">Join with a code someone shared, or start something right now without ever opening a scheduler.</p>

        <Reveal>
          <div className="wf-feat-row">
            <div className="wf-feat-copy">
              <div className="wf-feat-tag">01 · Join by code</div>
              <h4>Join with a 6-character code</h4>
              <p>No account, no app install — type the code a host shared and you're in the lobby.</p>
              <ul className="wf-feat-list">
                <li>Works from any device with a browser</li>
                <li>Validated instantly, wrong codes are caught before you wait</li>
                <li>Drops you straight into the lobby, ready to be admitted</li>
              </ul>
            </div>
            <WFJoinByCode />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="wf-feat-row wf-rev">
            <div className="wf-feat-copy">
              <div className="wf-feat-tag">02 · Instant meeting</div>
              <h4>Start now, or pick from the menu</h4>
              <p>One button starts a session immediately; the caret next to it opens every other way to create one.</p>
              <ul className="wf-feat-list">
                <li>Start instant session — live in seconds</li>
                <li>Schedule for later — opens the scheduling form</li>
                <li>Add to calendar — without starting the call yet</li>
              </ul>
            </div>
            <WFInstantMeetingMenu />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="wf-feat-row">
            <div className="wf-feat-copy">
              <div className="wf-feat-tag">03 · Shareable link</div>
              <h4>One link, copied in a tap</h4>
              <p>Every meeting gets a join code and a full link — copy either one and drop it wherever your guests already are.</p>
              <ul className="wf-feat-list">
                <li>Session code shown alongside the full URL</li>
                <li>Copy confirmation so you know it landed</li>
                <li>Join now, or send it and join later — your call</li>
              </ul>
            </div>
            <WFShareableLink />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
