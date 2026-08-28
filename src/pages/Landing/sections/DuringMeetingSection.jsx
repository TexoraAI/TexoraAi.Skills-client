import { useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import Reveal from "./Reveal";

function WFShareScreenVisual() {
  return (
    <div className="wf-visual wf-visual-dark">
      <div className="wf-frame">
        <div className="wf-frame-inner" />
        <div className="wf-frame-topbar">
          <span>Screen share · Live</span>
          <span>08:14</span>
        </div>
        <div className="wf-share-window">
          <div className="wf-share-topbar">
            <span />
            <span />
            <span />
          </div>
          <div className="wf-share-bars">
            {[40, 70, 50, 90, 35, 65, 45].map((h, i) => (
              <div key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="wf-presenter-chip">
          <span className="wf-mini-av" style={{ background: "#4C6EF5", width: 18, height: 18, fontSize: 9 }}>R</span>
          Riya is presenting
        </div>
      </div>
    </div>
  );
}

function WFChatVisual() {
  return (
    <div className="wf-visual wf-visual-dark">
      <div className="wf-frame">
        <div className="wf-frame-inner" />
        <div className="wf-chat-panel">
          <div className="wf-chat-head">Chat · Everyone</div>
          <div className="wf-chat-msgs">
            <div className="wf-msg">
              <b>Dev K.</b>
              <span>Can we push the demo to slide 12?</span>
            </div>
            <div className="wf-msg">
              <b>Sana M.</b>
              <span>Sharing the doc link now 👇</span>
            </div>
            <div className="wf-msg">
              <b>You</b>
              <span>Got it, one sec</span>
            </div>
          </div>
          <div className="wf-chat-input">Type a message…</div>
        </div>
      </div>
    </div>
  );
}

function WFEmojiVisual() {
  const [floaters, setFloaters] = useState([
    { id: 1, emoji: "🎉", left: 30, delay: 0 },
    { id: 2, emoji: "👍", left: 55, delay: 0.8 },
    { id: 3, emoji: "😂", left: 70, delay: 1.6 },
  ]);
  const nextId = useRef(4);

  const react = (emoji) => {
    const id = nextId.current++;
    const left = 20 + Math.random() * 60;
    setFloaters((f) => [...f, { id, emoji, left, delay: 0 }]);
    setTimeout(() => {
      setFloaters((f) => f.filter((x) => x.id !== id));
    }, 2400);
  };

  return (
    <div className="wf-visual wf-visual-dark">
      <div className="wf-frame">
        <div className="wf-frame-inner" />
        <div className="wf-frame-topbar">
          <span>Reactions</span>
          <span>Live</span>
        </div>
        {floaters.map((f) => (
          <div key={f.id} className="wf-emoji-float" style={{ left: `${f.left}%`, bottom: 70, animationDelay: `${f.delay}s` }}>
            {f.emoji}
          </div>
        ))}
        <div className="wf-reaction-bar">
          {["👏", "👍", "🎉", "😂", "❤️"].map((e) => (
            <span key={e} title="React" onClick={() => react(e)}>
              {e}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function WFRaiseHandVisual() {
  return (
    <div className="wf-visual wf-visual-dark">
      <div className="wf-frame">
        <div className="wf-frame-inner" />
        <div className="wf-hand-toast">✋ You raised your hand</div>
        <div className="wf-queue">
          {[
            { n: "Riya", c: "#4C6EF5", i: "R" },
            { n: "Dev", c: "#f97316", i: "D" },
            { n: "You", c: "#16a34a", i: "S" },
          ].map((q, idx) => (
            <div className="wf-queue-row" key={q.n}>
              <span className="wf-mini-av" style={{ width: 20, height: 20, fontSize: 9, background: q.c }}>{q.i}</span>
              <span>{idx + 1}. {q.n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WFCaptionVisual() {
  return (
    <div className="wf-visual wf-visual-dark">
      <div className="wf-frame">
        <div className="wf-frame-inner" />
        <div className="wf-cap-toggle">CC · ON</div>
        <div className="wf-cap-line">
          <div className="wf-who">Sana M.</div>
          <div className="wf-txt">"…so if everyone's aligned, let's finalize the launch date by Friday."</div>
        </div>
      </div>
    </div>
  );
}

function WFMicCameraVisual() {
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  return (
    <div className="wf-visual wf-visual-dark">
      <div className="wf-frame">
        <div className="wf-frame-inner" />
        <div className="wf-toggle-demo">
          <div className="wf-toggle-item">
            <button className={`wf-toggle-circle ${mic ? "wf-active" : ""}`} type="button" onClick={() => setMic((m) => !m)}>
              {mic ? <Mic size={22} /> : <MicOff size={22} />}
            </button>
            <span>{mic ? "MIC ON" : "MIC OFF"}</span>
          </div>
          <div className="wf-toggle-item">
            <button className={`wf-toggle-circle ${cam ? "wf-active" : ""}`} type="button" onClick={() => setCam((c) => !c)}>
              {cam ? <Video size={22} /> : <VideoOff size={22} />}
            </button>
            <span>{cam ? "CAMERA ON" : "CAMERA OFF"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WFPeopleListVisual() {
  return (
    <div className="wf-visual wf-visual-dark">
      <div className="wf-people-panel">
        <div className="wf-people-search">🔍 Search participants</div>
        <div className="wf-person-row">
          <div className="wf-person-left">
            <span className="wf-mini-av" style={{ background: "#4C6EF5" }}>R</span>
            <b>Riya A.<span className="wf-role-tag">HOST</span></b>
          </div>
          <div className="wf-person-icons">
            <Mic size={14} />
            <Video size={14} />
          </div>
        </div>
        <div className="wf-person-row">
          <div className="wf-person-left">
            <span className="wf-mini-av" style={{ background: "#f97316" }}>D</span>
            <b>Dev K.</b>
          </div>
          <div className="wf-person-icons">
            <MicOff size={14} className="wf-icon-off" />
            <Video size={14} />
          </div>
        </div>
        <div className="wf-person-row">
          <div className="wf-person-left">
            <span className="wf-mini-av" style={{ background: "#16a34a" }}>S</span>
            <b>Sana M.</b>
          </div>
          <div className="wf-person-icons">
            <Mic size={14} />
            <VideoOff size={14} className="wf-icon-off" />
          </div>
        </div>
        <div className="wf-person-row">
          <div className="wf-person-left">
            <span className="wf-mini-av" style={{ background: "#8B94A7" }}>+8</span>
            <b>8 others</b>
          </div>
          <div className="wf-person-icons" />
        </div>
      </div>
    </div>
  );
}

export default function DuringMeetingSection() {
  return (
    <div className="wf-band wf-band-tint" id="wf-during">
      <div className="wf-band-inner">
        <div className="wf-eyebrow">During the meeting</div>
        <h3 className="wf-h3">Everything you'd reach for, right in the call.</h3>
        <p className="wf-lead wf-lead-dark">Share your screen, react, ask to speak, and read along with captions — without leaving the window.</p>

        <Reveal>
          <div className="wf-feat-row">
            <div className="wf-feat-copy">
              <div className="wf-feat-tag">08 · Share screen</div>
              <h4>Share your screen or a single window</h4>
              <p>Present a slide deck, a browser tab, or your whole desktop, and hand control to anyone else in one click.</p>
              <ul className="wf-feat-list">
                <li>Share full screen, a window, or a browser tab</li>
                <li>System audio shares along with video</li>
                <li>Pass presenter control mid-share</li>
              </ul>
            </div>
            <WFShareScreenVisual />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="wf-feat-row wf-rev">
            <div className="wf-feat-copy">
              <div className="wf-feat-tag">09 · Chat</div>
              <h4>Chat without breaking the flow</h4>
              <p>Drop a link, ask a quick question, or message one person privately — the transcript stays with the meeting afterwards.</p>
              <ul className="wf-feat-list">
                <li>Meeting-wide or private messages</li>
                <li>Files and links shared inline</li>
                <li>Saved to the meeting summary after the call</li>
              </ul>
            </div>
            <WFChatVisual />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="wf-feat-row">
            <div className="wf-feat-copy">
              <div className="wf-feat-tag">10 · Reactions</div>
              <h4>React without unmuting</h4>
              <p>A quick 👍 or 🎉 lands on screen for everyone for a couple of seconds — tap one below to try it.</p>
              <ul className="wf-feat-list">
                <li>Tap a reaction, it floats and fades</li>
                <li>Visible to the whole room instantly</li>
                <li>No mic or camera needed to respond</li>
              </ul>
            </div>
            <WFEmojiVisual />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="wf-feat-row wf-rev">
            <div className="wf-feat-copy">
              <div className="wf-feat-tag">11 · Raise hand</div>
              <h4>Ask to speak, and keep your place in line</h4>
              <p>Raise a hand instead of talking over someone. The host sees a queue in the order people asked.</p>
              <ul className="wf-feat-list">
                <li>One tap to raise, one tap to lower</li>
                <li>Host sees a first-asked, first-called queue</li>
                <li>Badge shows on your tile so the room can see too</li>
              </ul>
            </div>
            <WFRaiseHandVisual />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="wf-feat-row">
            <div className="wf-feat-copy">
              <div className="wf-feat-tag">12 · Live captions</div>
              <h4>Follow along with live captions</h4>
              <p>Real-time captions appear under the speaker as they talk — useful in a loud room or when someone joins muted-by-accident.</p>
              <ul className="wf-feat-list">
                <li>Toggle captions on or off any time</li>
                <li>Labelled by speaker</li>
                <li>Saved into the transcript after the call</li>
              </ul>
            </div>
            <WFCaptionVisual />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="wf-feat-row wf-rev">
            <div className="wf-feat-copy">
              <div className="wf-feat-tag">13–14 · Mic &amp; camera</div>
              <h4>Mic and camera, exactly where you'd expect them</h4>
              <p>Mute, unmute, or turn your camera off in one tap — try the buttons on the right.</p>
              <ul className="wf-feat-list">
                <li>Push-to-talk while muted, hold spacebar</li>
                <li>Background blur and virtual backgrounds</li>
                <li>Visual indicator when you're live on either</li>
              </ul>
            </div>
            <WFMicCameraVisual />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="wf-feat-row">
            <div className="wf-feat-copy">
              <div className="wf-feat-tag">15 · People list</div>
              <h4>See who's in the room, at a glance</h4>
              <p>The participant panel lists everyone present, their mic and camera state, and gives quick actions without hunting through menus.</p>
              <ul className="wf-feat-list">
                <li>Search participants in a large call</li>
                <li>See mute state and hand-raise status per person</li>
                <li>Quick actions: pin, mute, message, remove</li>
              </ul>
            </div>
            <WFPeopleListVisual />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
