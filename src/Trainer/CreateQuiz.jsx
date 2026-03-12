
import { useEffect, useState } from "react";
import {
  addOption,
  addQuestion,
  createQuiz,
} from "../services/assessmentService";

import { getTrainerBatches } from "../services/batchService"; // ⭐ ONLY ADDITION

import {
  ClipboardList,
  HelpCircle,
  Loader2,
  PlusCircle
} from "lucide-react";
import auth from "../auth";

const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [batchId, setBatchId] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  const [batches, setBatches] = useState([]); // ⭐ STORE TRAINER BATCHES

  const [questions, setQuestions] = useState([
    {
      text: "",
      options: { A: "", B: "", C: "", D: "" },
      correctOption: "",
    },
  ]);

  // 🔥 LOAD TRAINER BATCHES (SAME AS VIDEO SERVICE)
  useEffect(() => {
    if (!auth.isAuthenticated()) {
      alert("Please login again");
      return;
    }

    const loadBatches = async () => {
      try {
        const res = await getTrainerBatches();
        setBatches(res || []); // batchService already returns data
      } catch (err) {
        console.error("Failed to load trainer batches", err);
      }
    };

    loadBatches();
  }, []);

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: { A: "", B: "", C: "", D: "" },
        correctOption: "",
      },
    ]);
  };

  const handleSaveQuiz = async () => {
    try {
      for (const q of questions) {
        if (!q.text.trim()) {
          alert("Please enter question text");
          return;
        }
        if (!q.correctOption) {
          alert("Please select correct option for all questions");
          return;
        }
      }

      if (!batchId) {
        alert("Please select a batch");
        return;
      }

      setLoading(true);

      const quizRes = await createQuiz({
        title,
        batchId,
        instructions,
      });

      const quizId = quizRes.data.id;

      for (const q of questions) {
        const qRes = await addQuestion({
          quizId,
          text: q.text,
        });

        const questionId = qRes.data.id;

        for (const key of ["A", "B", "C", "D"]) {
          await addOption({
            questionId,
            text: q.options[key],
            correct: key === q.correctOption,
          });
        }
      }

      alert("✅ Quiz created successfully");

      setTitle("");
      setBatchId("");
      setInstructions("");
      setQuestions([
        {
          text: "",
          options: { A: "", B: "", C: "", D: "" },
          correctOption: "",
        },
      ]);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HERO */}
        <div className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 p-5 text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white shadow flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Quiz Builder</h1>
              <p className="text-sm text-white/90">
                Create assessments for students
              </p>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quiz Title"
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
          />

          {/* ⭐ AUTO LOAD BATCHES */}
          <select
            value={batchId}
            onChange={(e) => setBatchId(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                Batch {b.id}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Quiz instructions"
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
        />

        {/* QUESTIONS UI UNCHANGED */}
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-5 space-y-4"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-semibold">Question {index + 1}</h2>
              </div>

              <input
                value={q.text}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].text = e.target.value;
                  setQuestions(updated);
                }}
                placeholder="Enter question text"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["A", "B", "C", "D"].map((key) => (
                  <div key={key} className="rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        checked={q.correctOption === key}
                        onChange={() => {
                          const updated = [...questions];
                          updated[index].correctOption = key;
                          setQuestions(updated);
                        }}
                      />
                      <input
                        value={q.options[key]}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[index].options[key] = e.target.value;
                          setQuestions(updated);
                        }}
                        placeholder={`Option ${key}`}
                        className="flex-1 bg-transparent outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={addNewQuestion}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
          >
            <PlusCircle className="w-4 h-4" />
            Add Question
          </button>

          <button
            onClick={handleSaveQuiz}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Publish Quiz"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
