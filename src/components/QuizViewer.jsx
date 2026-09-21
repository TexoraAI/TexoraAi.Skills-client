import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, ArrowRight } from "lucide-react";

const INJECT_ID = "qzv-styles-v1";
const CSS = `
  .qzv-wrap { display:flex; flex-direction:column; gap:16px; padding:4px 0; font-family:'Inter',sans-serif; }
  .qzv-progress { font-size:11px; font-weight:700; color:var(--text3); letter-spacing:.05em; text-transform:uppercase; }
  .qzv-question { font-size:14px; font-weight:700; color:var(--text); line-height:1.6; }
  .qzv-options { display:flex; flex-direction:column; gap:8px; }
  .qzv-option {
    display:flex; align-items:center; justify-content:space-between; gap:10px;
    padding:11px 14px; border-radius:11px; border:1px solid var(--border2);
    background:var(--surface2); color:var(--text2); font-size:13px; font-weight:500;
    cursor:pointer; text-align:left; transition:background .15s,border-color .15s,transform .1s;
    font-family:'Inter',sans-serif;
  }
  .qzv-option:hover:not(.qzv-answered) { border-color:var(--accent-bdr); background:var(--accent-bg); transform:translateY(-1px); }
  .qzv-option.qzv-correct { border-color:var(--green); background:var(--green-bg); color:var(--green); font-weight:700; }
  .qzv-option.qzv-incorrect { border-color:var(--red); background:var(--red-bg); color:var(--red); font-weight:700; }
  .qzv-option.qzv-dim { opacity:.55; }
  .qzv-option.qzv-answered { cursor:default; }
  .qzv-feedback {
    display:flex; flex-direction:column; gap:6px; padding:12px 14px; border-radius:11px;
    background:var(--surface3); border:1px solid var(--border);
  }
  .qzv-feedback-title { display:flex; align-items:center; gap:6px; font-size:12px; font-weight:800; }
  .qzv-feedback-title.correct { color:var(--green); }
  .qzv-feedback-title.incorrect { color:var(--red); }
  .qzv-feedback-exp { font-size:12px; color:var(--text2); line-height:1.6; }
  .qzv-next-btn {
    align-self:flex-end; display:flex; align-items:center; gap:6px;
    padding:9px 18px; border-radius:10px; border:none; background:var(--accent);
    color:#fff; font-family:'Inter',sans-serif; font-size:12px; font-weight:700; cursor:pointer;
    box-shadow:0 2px 10px var(--accent-sh); transition:background .15s,transform .12s;
  }
  .qzv-next-btn:hover { background:var(--accent2); transform:translateY(-1px); }
  .qzv-result { display:flex; flex-direction:column; align-items:center; gap:8px; padding:28px 12px; text-align:center; }
  .qzv-result-score { font-size:34px; font-weight:800; color:var(--accent); letter-spacing:-1px; }
  .qzv-result-label { font-size:12px; color:var(--text3); font-weight:600; }
  .qzv-retake-btn {
    display:flex; align-items:center; gap:7px; padding:9px 18px; border-radius:10px;
    border:1px solid var(--border2); background:var(--surface2); color:var(--text2);
    font-family:'Inter',sans-serif; font-size:12px; font-weight:700; cursor:pointer;
    transition:background .15s,color .15s,border-color .15s; margin-top:6px;
  }
  .qzv-retake-btn:hover { background:var(--accent-bg2); color:var(--accent); border-color:var(--accent-bdr); }
  .qzv-empty { padding:24px; text-align:center; font-size:12px; color:var(--text3); font-family:'Inter',sans-serif; }
`;

const injectCSS = () => {
  if (document.getElementById(INJECT_ID)) return;
  const el = document.createElement("style");
  el.id = INJECT_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
};

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

/**
 * QuizViewer
 * Props:
 *   questions: [{ question, options: string[], correctIndex, explanation }]
 */
const QuizViewer = ({ questions }) => {
  useEffect(() => {
    injectCSS();
  }, []);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (!Array.isArray(questions) || questions.length === 0) {
    return <div className="qzv-empty">No quiz questions available.</div>;
  }

  const total = questions.length;

  if (done) {
    const pct = total > 0 ? score / total : 0;
    return (
      <div className="qzv-result">
        <div className="qzv-result-score">
          {score} / {total}
        </div>
        <div className="qzv-result-label">
          {pct === 1
            ? "Perfect score!"
            : pct >= 0.5
              ? "Nice work!"
              : "Keep practicing!"}
        </div>
        <button
          className="qzv-retake-btn"
          onClick={() => {
            setIndex(0);
            setSelected(null);
            setScore(0);
            setDone(false);
          }}
        >
          <RotateCcw size={13} strokeWidth={2} /> Retake Quiz
        </button>
      </div>
    );
  }

  const q = questions[index];
  const answered = selected !== null;
  const isCorrect = answered && selected === q.correctIndex;

  const pick = (i) => {
    if (answered) return;
    setSelected(i);
    if (i === q.correctIndex) setScore((s) => s + 1);
  };

  const advance = () => {
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  return (
    <div className="qzv-wrap">
      <div className="qzv-progress">
        Question {index + 1} of {total} · Score: {score}
      </div>
      <div className="qzv-question">{q.question}</div>
      <div className="qzv-options">
        {(q.options || []).map((opt, i) => {
          let cls = "qzv-option";
          if (answered) {
            cls += " qzv-answered";
            if (i === q.correctIndex) cls += " qzv-correct";
            else if (i === selected) cls += " qzv-incorrect";
            else cls += " qzv-dim";
          }
          return (
            <button key={i} className={cls} onClick={() => pick(i)}>
              <span>
                {OPTION_LETTERS[i] || i + 1}. {opt}
              </span>
              {answered && i === q.correctIndex && (
                <CheckCircle2 size={16} strokeWidth={2.2} />
              )}
              {answered && i === selected && i !== q.correctIndex && (
                <XCircle size={16} strokeWidth={2.2} />
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="qzv-feedback">
          <div
            className={`qzv-feedback-title ${isCorrect ? "correct" : "incorrect"}`}
          >
            {isCorrect ? (
              <CheckCircle2 size={14} strokeWidth={2.2} />
            ) : (
              <XCircle size={14} strokeWidth={2.2} />
            )}
            {isCorrect ? "Correct!" : "Not quite"}
          </div>
          {q.explanation && (
            <div className="qzv-feedback-exp">{q.explanation}</div>
          )}
          <button className="qzv-next-btn" onClick={advance}>
            {index + 1 >= total ? "See Results" : "Next Question"}{" "}
            <ArrowRight size={13} strokeWidth={2.2} />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizViewer;
