import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";

/* ─── Scoped CSS injection (relies on --accent/--border/etc vars from the
       parent .snblm root, so no theme duplication is needed here) ─── */
const INJECT_ID = "fcv-styles-v1";
const CSS = `
  .fcv-wrap { display:flex; flex-direction:column; align-items:center; gap:16px; padding:8px 0 4px; font-family:'Inter',sans-serif; }
  .fcv-counter { font-size:11px; font-weight:700; color:var(--text3); letter-spacing:.06em; text-transform:uppercase; }
  .fcv-card-outer { width:100%; max-width:440px; height:220px; perspective:1200px; cursor:pointer; }
  .fcv-card-inner {
    position:relative; width:100%; height:100%;
    transition:transform .5s cubic-bezier(.4,.2,.2,1);
    transform-style:preserve-3d;
  }
  .fcv-card-inner.flipped { transform:rotateY(180deg); }
  .fcv-face {
    position:absolute; inset:0; backface-visibility:hidden;
    border-radius:16px; border:1px solid var(--border);
    background:var(--surface2); display:flex; align-items:center; justify-content:center;
    text-align:center; padding:26px; font-size:15px; font-weight:700; color:var(--text);
    box-shadow:0 4px 20px rgba(0,0,0,.06); line-height:1.6; overflow-y:auto;
  }
  .fcv-face.back {
    transform:rotateY(180deg);
    background:var(--accent-bg2); color:var(--text); font-weight:500; font-size:13px;
  }
  .fcv-face-label {
    position:absolute; top:10px; left:14px; font-size:9px; font-weight:800;
    letter-spacing:.1em; text-transform:uppercase; color:var(--accent);
  }
  .fcv-hint { font-size:10px; color:var(--text3); font-weight:600; }
  .fcv-controls { display:flex; align-items:center; gap:14px; }
  .fcv-nav-btn {
    width:36px; height:36px; border-radius:10px; border:1px solid var(--border2);
    background:var(--surface2); color:var(--text2); display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:background .15s,color .15s,border-color .15s;
  }
  .fcv-nav-btn:hover:not(:disabled) { background:var(--accent-bg2); color:var(--accent); border-color:var(--accent-bdr); }
  .fcv-nav-btn:disabled { opacity:.35; cursor:not-allowed; }
  .fcv-flip-btn {
    display:flex; align-items:center; gap:6px; padding:8px 16px; border-radius:10px;
    border:1px solid var(--border2); background:var(--surface2); color:var(--text2);
    font-family:'Inter',sans-serif; font-size:12px; font-weight:700; cursor:pointer;
    transition:background .15s,color .15s,border-color .15s;
  }
  .fcv-flip-btn:hover { background:var(--accent-bg2); color:var(--accent); border-color:var(--accent-bdr); }
  .fcv-empty { padding:24px; text-align:center; font-size:12px; color:var(--text3); font-family:'Inter',sans-serif; }
`;

const injectCSS = () => {
  if (document.getElementById(INJECT_ID)) return;
  const el = document.createElement("style");
  el.id = INJECT_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
};

/**
 * FlashcardViewer
 * Props:
 *   cards: [{ front: string, back: string }]
 */
const FlashcardViewer = ({ cards }) => {
  useEffect(() => {
    injectCSS();
  }, []);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!Array.isArray(cards) || cards.length === 0) {
    return <div className="fcv-empty">No flashcards available.</div>;
  }

  const total = cards.length;
  const card = cards[Math.min(index, total - 1)];

  const goNext = () => {
    setFlipped(false);
    setIndex((i) => Math.min(i + 1, total - 1));
  };
  const goPrev = () => {
    setFlipped(false);
    setIndex((i) => Math.max(i - 1, 0));
  };

  return (
    <div className="fcv-wrap">
      <div className="fcv-counter">
        Card {index + 1} of {total}
      </div>

      <div className="fcv-card-outer" onClick={() => setFlipped((f) => !f)}>
        <div className={`fcv-card-inner${flipped ? " flipped" : ""}`}>
          <div className="fcv-face front">
            <span className="fcv-face-label">Question</span>
            {card.front}
          </div>
          <div className="fcv-face back">
            <span className="fcv-face-label">Answer</span>
            {card.back}
          </div>
        </div>
      </div>

      <div className="fcv-hint">Click the card to flip it</div>

      <div className="fcv-controls">
        <button className="fcv-nav-btn" onClick={goPrev} disabled={index === 0}>
          <ChevronLeft size={16} strokeWidth={2.2} />
        </button>
        <button className="fcv-flip-btn" onClick={() => setFlipped((f) => !f)}>
          <RotateCw size={13} strokeWidth={2} /> Flip
        </button>
        <button
          className="fcv-nav-btn"
          onClick={goNext}
          disabled={index === total - 1}
        >
          <ChevronRight size={16} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardViewer;
