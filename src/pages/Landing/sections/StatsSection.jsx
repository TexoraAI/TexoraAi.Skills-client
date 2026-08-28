export default function StatsSection() {
  return (
    <section id="stats-section">
      <div className="section-head">
        <h2 className="heading-nowrap">Built for how <em className="word-orange">batches</em> actually <em className="word-green">run</em></h2>
        <p>Numbers from organizations already running sessions through ILMORA Meetings.</p>
      </div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">1-click</div>
          <div className="stat-label">Session start</div>
          <div className="stat-underline"></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">100%</div>
          <div className="stat-label">Join-code verified</div>
          <div className="stat-underline"></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">0</div>
          <div className="stat-label">Manual roll calls</div>
          <div className="stat-underline"></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Auto</div>
          <div className="stat-label">Calendar sync</div>
          <div className="stat-underline"></div>
        </div>
      </div>
    </section>
  );
}
