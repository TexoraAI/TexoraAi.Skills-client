/**
 * Renders an AI-generated article body inline (never a redirect) as a
 * modal. Mirrors QuizModal/VideoModal's overlay/shell pattern for visual
 * consistency.
 *
 * Like video, an article has no auto-detectable "finished" signal, so
 * completion here is the same explicit "Mark done" button VideoModal uses -
 * wired to the same onCompleteResource(resourceId) call (no score, plain
 * complete/not-complete).
 *
 * Props:
 *   title       - resource title, shown in the modal header
 *   contentBody - full AI-generated article text (resource.contentBody)
 *   completed   - bool, whether this resource is already marked done
 *   pending     - bool, disables the Mark done button while saving
 *   onComplete  - () => Promise, marks the resource done (no quiz score)
 *   onClose     - () => void
 */
export default function ArticleModal({
  title,
  contentBody,
  completed,
  pending,
  onComplete,
  onClose,
}) {
  // Split on blank lines so the AI's paragraphs render as separate <p>
  // tags instead of one dense block. Falls back gracefully if the model
  // wrote it as a single block with no blank-line breaks.
  const paragraphs = (contentBody || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--ru-bg, #fff)",
          borderRadius: 12,
          padding: 24,
          width: "min(680px, 92vw)",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.1rem",
            }}
          >
            ✕
          </button>
        </div>

        {paragraphs.length === 0 ? (
          <div className="ru-mh-sub">
            This article couldn't be loaded. Try marking it done manually, or
            regenerate the roadmap.
          </div>
        ) : (
          <>
            <div style={{ lineHeight: 1.7, fontSize: "0.95rem" }}>
              {paragraphs.map((p, i) => (
                <p key={i} style={{ marginBottom: 14 }}>
                  {p}
                </p>
              ))}
            </div>

            <div style={{ marginTop: 16, textAlign: "center" }}>
              {completed ? (
                <span className="ru-res-check">✓ DONE</span>
              ) : (
                <button
                  className="ru-tool-btn"
                  disabled={pending}
                  onClick={onComplete}
                  style={{ width: "100%", padding: "10px 0" }}
                >
                  {pending ? "Saving…" : "Mark done"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
