import Reveal from "./Reveal";

function WFRecordingVisual() {
  return (
    <div className="wf-visual wf-visual-dark">
      <div className="wf-timeline">
        <div className="wf-timeline-head">
          <span>00:00</span>
          <span>42:18</span>
        </div>
        <div className="wf-timeline-track">
          <div className="wf-seg wf-seg1" />
          <div className="wf-seg wf-seg2" />
          <div className="wf-seg wf-seg3" />
          <div className="wf-seg wf-seg4" />
          <div className="wf-playhead" />
        </div>
        <div className="wf-clip-tags">
          <span>Kickoff</span>
          <span className="wf-hl">Roadmap review</span>
          <span>Q&amp;A</span>
          <span>Wrap-up</span>
        </div>
      </div>
    </div>
  );
}

function WFSummaryVisual() {
  return (
    <div className="wf-visual wf-visual-dark">
      <div className="wf-summary-card">
        <div className="wf-summary-head">
          <span className="wf-ai-badge">SUMMARY</span>
          <h5>Weekly product sync — Mar 5</h5>
        </div>
        <ul>
          <li>Launch date agreed for the 20th, pending design sign-off</li>
          <li>Roadmap for Q2 walked through, no major objections</li>
          <li>Follow-up needed on the pricing page copy</li>
        </ul>
        <div className="wf-action-item">
          <input type="checkbox" defaultChecked readOnly />
          <span>Riya — share final pricing copy by Friday</span>
        </div>
        <div className="wf-action-item">
          <input type="checkbox" readOnly />
          <span>Dev — confirm design sign-off timeline</span>
        </div>
      </div>
    </div>
  );
}

export default function AfterMeetingSection() {
  return (
    <div className="wf-band wf-band-tint" id="wf-after">
      <div className="wf-band-inner">
        <div className="wf-eyebrow">After the call</div>
        <h3 className="wf-h3">The meeting keeps working after everyone leaves.</h3>
        <p className="wf-lead wf-lead-dark">Recordings split by topic, and a summary that turns discussion into action items.</p>

        <Reveal>
          <div className="wf-feat-row">
            <div className="wf-feat-copy">
              <div className="wf-feat-tag">19 · Recording</div>
              <h4>Recordings, split into segments</h4>
              <p>Rather than one long file, Meetings breaks the recording into segments by topic shift, so you can jump straight to the part that matters.</p>
              <ul className="wf-feat-list">
                <li>Auto-detected segment breaks</li>
                <li>Jump to any segment from the transcript</li>
                <li>Download the full recording or a single clip</li>
              </ul>
            </div>
            <WFRecordingVisual />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="wf-feat-row wf-rev">
            <div className="wf-feat-copy">
              <div className="wf-feat-tag">20 · Summary</div>
              <h4>A summary waiting in your inbox</h4>
              <p>Minutes after the call ends, everyone gets the key points and action items — so no one has to take notes during the meeting.</p>
              <ul className="wf-feat-list">
                <li>Key discussion points, condensed</li>
                <li>Action items with the owner tagged</li>
                <li>Sent to every attendee automatically</li>
              </ul>
            </div>
            <WFSummaryVisual />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
