export default function FinalCTASection({ personImg }) {
  return (
    <section>
      <div className="cta-band">
        <div className="cta-band-media">
          <img src={personImg} alt="" />
        </div>
        <div className="cta-band-content">
          <h2>
            Bring your first session into <em className="word-green">ILM</em> <em className="word-orange">ORA</em>
          </h2>
          <p>Meetings is live for every organization on your plan — no setup, no separate login.</p>
        </div>
      </div>
    </section>
  );
}
