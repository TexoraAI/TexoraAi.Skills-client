import React, { useEffect, useState } from "react";
import { FileText, ChevronDown, ChevronRight } from "lucide-react";
import PageHead from "../../components/PageHead";
// ⚠️ SAME imports the old production TrainerMeetings.jsx (mirrors SuperAdminMeetings.jsx) used for its
// "Summaries" tab. They live in src/services/ and src/components/ — from this
// file that is five levels up. Adjust the "../" count only if your tree differs.
import { getMyMeetingSummaries } from "../../../../services/chatService";
import { MeetingSummaryView } from "../../../../components/MeetingSummaryView";

export default function Summaries() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    setLoading(true);
    getMyMeetingSummaries()
      .then((res) => setSummaries(res.data || []))
      .catch((err) => console.error("Failed to load summaries", err))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <div className="ws-content">
      <PageHead
        title="Summaries"
        subtitle="AI-generated summaries from your past meetings."
      />

      <section className="section-card">
        <div className="section-card-head">
          <h2>Meeting Summaries</h2>
          <span className="muted">{summaries.length} total</span>
        </div>

        {loading ? (
          <p className="muted" style={{ margin: 0 }}>
            Loading…
          </p>
        ) : summaries.length === 0 ? (
          <div className="empty-state">
            <FileText size={30} />
            <h3>No summaries yet</h3>
            <p>
              Summaries appear here once your meetings end and get processed.
            </p>
          </div>
        ) : (
          summaries.map((sm) => {
            const open = openId === sm.meetingId;
            return (
              <div key={sm.meetingId}>
                <div
                  className="list-row"
                  role="button"
                  tabIndex={0}
                  onClick={() => toggle(sm.meetingId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(sm.meetingId);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="list-row-main">
                    <div className="title">
                      {sm.title || "Untitled meeting"}
                    </div>
                  </div>
                  <span className="badge muted">{sm.status}</span>
                  {open ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
                {open && (
                  <div style={{ padding: "4px 4px 12px" }}>
                    <MeetingSummaryView meetingId={sm.meetingId} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
