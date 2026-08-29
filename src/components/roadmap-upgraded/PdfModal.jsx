import { useEffect, useState } from "react";
import roadmapService from "../../services/roadmapService";

/**
 * Fetches the real generated PDF for a PDF resource (GET
 * /resource/{id}/pdf, see RoadmapUpgradedController) using the same auth
 * header as every other call, converts it to a blob, and renders it inline
 * via an <iframe> object URL - never a download or new tab. Mirrors
 * QuizModal/VideoModal/ArticleModal's overlay/shell pattern for visual
 * consistency.
 *
 * Like video/article, a PDF has no auto-detectable "finished" signal, so
 * completion here is the same explicit "Mark done" button pattern - wired
 * to the same onCompleteResource(resourceId) call (no score, plain
 * complete/not-complete).
 *
 * Props:
 *   resourceId - resource.id, used to fetch the PDF bytes
 *   title      - resource title, shown in the modal header
 *   completed  - bool, whether this resource is already marked done
 *   pending    - bool, disables the Mark done button while saving
 *   onComplete - () => Promise, marks the resource done (no quiz score)
 *   onClose    - () => void
 */
export default function PdfModal({
  resourceId,
  title,
  completed,
  pending,
  onComplete,
  onClose,
}) {
  const [objectUrl, setObjectUrl] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let localUrl = null;

    async function load() {
      setLoading(true);
      setError(false);
      try {
        const blob = await roadmapService.getResourcePdfBlob(resourceId);
        if (cancelled) return;
        localUrl = URL.createObjectURL(blob);
        setObjectUrl(localUrl);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (resourceId) {
      load();
    } else {
      setError(true);
      setLoading(false);
    }

    // Revoke the object URL on unmount / resourceId change so we don't leak
    // memory across repeated opens.
    return () => {
      cancelled = true;
      if (localUrl) URL.revokeObjectURL(localUrl);
    };
  }, [resourceId]);

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
          width: "min(820px, 94vw)",
          height: "min(85vh, 900px)",
          display: "flex",
          flexDirection: "column",
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

        {loading ? (
          <div className="ru-mh-sub">Loading document…</div>
        ) : error || !objectUrl ? (
          <div className="ru-mh-sub">
            This document couldn't be loaded. Try marking it done manually, or
            regenerate the roadmap.
          </div>
        ) : (
          <>
            <iframe
              src={objectUrl}
              title={title}
              style={{
                flex: 1,
                width: "100%",
                border: "1px solid var(--ru-line, #e5e5e5)",
                borderRadius: 8,
              }}
            />
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
