
import React, { useState, useEffect } from "react";
import {
  createQuiz,
  addQuestion,
  addOption,
} from "../services/assessmentService";
import auth from "../auth";
import {
  PlusCircle,
  CheckCircle,
  ClipboardList,
  HelpCircle,
  Loader2,
} from "lucide-react";

const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [batchId, setBatchId] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState([
    {
      text: "",
      options: { A: "", B: "", C: "", D: "" },
      correctOption: "",
    },
  ]);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      alert("Please login again");
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* ================= HEADER ================= */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-10 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <ClipboardList className="w-10 h-10" />
            <div>
              <h1 className="text-4xl font-bold">Quiz Builder</h1>
              <p className="text-white/80 mt-1">
                Create structured assessments for your students
              </p>
            </div>
          </div>
        </div>

        {/* ================= QUIZ DETAILS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quiz Title"
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-indigo-500 outline-none"
          />

          <input
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            placeholder="Batch ID"
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-indigo-500 outline-none"
          />
        </div>

        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Quiz instructions for students"
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-indigo-500 outline-none"
        />

        {/* ================= QUESTIONS ================= */}
        <div className="space-y-8">
          {questions.map((q, index) => (
            <div
              key={index}
              className="rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-lg space-y-5"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">
                  Question {index + 1}
                </h2>
              </div>

              <input
                value={q.text}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].text = e.target.value;
                  setQuestions(updated);
                }}
                placeholder="Enter question text"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-indigo-500 outline-none"
              />

              {/* OPTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["A", "B", "C", "D"].map((key) => (
                  <div
                    key={key}
                    className={`p-4 rounded-xl border cursor-pointer transition
                      ${
                        q.correctOption === key
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-slate-700 hover:border-indigo-500"
                      }`}
                    onClick={() => {
                      const updated = [...questions];
                      updated[index].correctOption = key;
                      setQuestions(updated);
                    }}
                  >
                    <input
                      value={q.options[key]}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[index].options[key] = e.target.value;
                        setQuestions(updated);
                      }}
                      placeholder={`Option ${key}`}
                      className="w-full bg-transparent outline-none text-white"
                    />
                    {q.correctOption === key && (
                      <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Correct answer
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={addNewQuestion}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            <PlusCircle className="w-5 h-5" />
            Add Another Question
          </button>

          <button
            onClick={handleSaveQuiz}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
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
