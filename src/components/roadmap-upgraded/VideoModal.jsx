/**
 * Renders a YouTube video inline (never a redirect/new tab) as a modal.
 * Mirrors QuizModal's overlay/shell pattern for visual consistency.
 *
 * Unlike the quiz flow (which grades and submits automatically), a video
 * has no auto-detectable "finished" signal, so completion here is an
 * explicit "Mark done" button inside the modal - wired to the exact same
 * onCompleteResource(resourceId) call ModuleTree's plain "Mark done" button
 * used before this modal existed.
 *
 * Props:
 *   title      - resource title, shown in the modal header
 *   videoId    - bare YouTube video ID (resource.sourceUrl), NOT a full URL
 *   completed  - bool, whether this resource is already marked done
 *   pending    - bool, disables the Mark done button while saving
 *   onComplete - () => Promise, marks the resource done (no quiz score)
 *   onClose    - () => void
 */
export default function VideoModal({
  title,
  videoId,
  completed,
  pending,
  onComplete,
  onClose,
}) {
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
          width: "min(720px, 92vw)",
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

        {!videoId ? (
          <div className="ru-mh-sub">
            This video couldn't be loaded. Try marking it done manually, or
            regenerate the roadmap.
          </div>
        ) : (
          <>
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingTop: "56.25%" /* 16:9 */,
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={title}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                  borderRadius: 8,
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
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
