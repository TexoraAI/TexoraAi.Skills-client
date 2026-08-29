import { useMemo, useState } from "react";

/**
 * Renders quizContentJson (a JSON string of shape
 *   { questions: [{ question, options: string[], correctOptionIndex }] }
 * ) as an inline, answerable quiz. Stays entirely on the page - no redirect.
 *
 * Score is computed client-side from the answer key, then submitted as a
 * normal integer via onSubmit(score), which the caller wires to the
 * existing /resource/{id}/complete endpoint.
 *
 * Props:
 *   title           - resource title, shown in the modal header
 *   quizContentJson - raw JSON string from the resource DTO
 *   onSubmit        - (score:number) => Promise
 *   onClose         - () => void
 *   pending         - bool, disables the submit button while saving
 */
export default function QuizModal({ title, quizContentJson, onSubmit, onClose, pending }) {
  const questions = useMemo(() => {
    try {
      const parsed = JSON.parse(quizContentJson);
      return Array.isArray(parsed?.questions) ? parsed.questions : [];
    } catch {
      return [];
    }
  }, [quizContentJson]);

  const [answers, setAnswers] = useState({}); // { [questionIndex]: optionIndex }
  const [result, setResult] = useState(null); // { correct, total, score } once graded

  const allAnswered = questions.length > 0 && questions.every((_, i) => answers[i] != null);

  function pick(qIndex, oIndex) {
    if (result) return; // locked after grading
    setAnswers((a) => ({ ...a, [qIndex]: oIndex }));
  }

  function grade() {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctOptionIndex) correct += 1;
    });
    const score = Math.round((correct / questions.length) * 100);
    setResult({ correct, total: questions.length, score });
    return score;
  }

  async function handleSubmit() {
    const score = grade();
    await onSubmit(score);
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--ru-bg, #fff)", borderRadius: 12, padding: 24,
          width: "min(560px, 92vw)", maxHeight: "85vh", overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
        </div>

        {questions.length === 0 ? (
          <div className="ru-mh-sub">This quiz couldn't be loaded. Try marking it done manually, or regenerate the roadmap.</div>
        ) : (
          <>
            {questions.map((q, qi) => (
              <div key={qi} style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>{qi + 1}. {q.question}</div>
                {(q.options || []).map((opt, oi) => {
                  const selected = answers[qi] === oi;
                  const showCorrectness = !!result;
                  const isCorrectOption = oi === q.correctOptionIndex;
                  let bg = "transparent";
                  if (showCorrectness && isCorrectOption) bg = "rgba(34,197,94,0.15)";
                  else if (showCorrectness && selected && !isCorrectOption) bg = "rgba(239,68,68,0.15)";
                  else if (selected) bg = "var(--ru-hover, #f2f2f2)";

                  return (
                    <label
                      key={oi}
                      style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                        borderRadius: 8, background: bg, cursor: result ? "default" : "pointer",
                        border: "1px solid var(--ru-line, #e5e5e5)", marginBottom: 6,
                      }}
                    >
                      <input
                        type="radio"
                        name={`q-${qi}`}
                        checked={selected}
                        disabled={!!result}
                        onChange={() => pick(qi, oi)}
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            ))}

            {result ? (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 4 }}>
                  Score: {result.score}%
                </div>
                <div className="ru-mh-sub" style={{ marginBottom: 12 }}>
                  {result.correct} of {result.total} correct
                </div>
                <button className="ru-tool-btn" onClick={onClose}>Close</button>
              </div>
            ) : (
              <button
                className="ru-tool-btn"
                disabled={!allAnswered || pending}
                onClick={handleSubmit}
                style={{ width: "100%", padding: "10px 0", marginTop: 8 }}
              >
                {pending ? "Saving…" : allAnswered ? "Submit Quiz" : `Answer all ${questions.length} questions`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
