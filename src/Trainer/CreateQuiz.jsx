
// import React, { useState, useEffect } from "react";
// import {
//   createQuiz,
//   addQuestion,
//   addOption,
// } from "../services/assessmentService";
// import auth from "../auth";
// import {
//   PlusCircle,
//   CheckCircle,
//   ClipboardList,
//   HelpCircle,
//   Loader2,
// } from "lucide-react";

// const CreateQuiz = () => {
//   const [title, setTitle] = useState("");
//   const [batchId, setBatchId] = useState("");
//   const [instructions, setInstructions] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [questions, setQuestions] = useState([
//     {
//       text: "",
//       options: { A: "", B: "", C: "", D: "" },
//       correctOption: "",
//     },
//   ]);

//   useEffect(() => {
//     if (!auth.isAuthenticated()) {
//       alert("Please login again");
//     }
//   }, []);

//   const addNewQuestion = () => {
//     setQuestions([
//       ...questions,
//       {
//         text: "",
//         options: { A: "", B: "", C: "", D: "" },
//         correctOption: "",
//       },
//     ]);
//   };

//   const handleSaveQuiz = async () => {
//     try {
//       // ✅ validation (frontend only)
//       for (const q of questions) {
//         if (!q.text.trim()) {
//           alert("Please enter question text");
//           return;
//         }
//         if (!q.correctOption) {
//           alert("Please select correct option for all questions");
//           return;
//         }
//       }

//       setLoading(true);

//       const quizRes = await createQuiz({
//         title,
//         batchId,
//         instructions,
//       });

//       const quizId = quizRes.data.id;

//       for (const q of questions) {
//         const qRes = await addQuestion({
//           quizId,
//           text: q.text,
//         });

//         const questionId = qRes.data.id;

//         for (const key of ["A", "B", "C", "D"]) {
//           await addOption({
//             questionId,
//             text: q.options[key],
//             correct: key === q.correctOption, // 🔥 backend unchanged
//           });
//         }
//       }

//       alert("✅ Quiz created successfully");

//       setTitle("");
//       setBatchId("");
//       setInstructions("");
//       setQuestions([
//         {
//           text: "",
//           options: { A: "", B: "", C: "", D: "" },
//           correctOption: "",
//         },
//       ]);
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to create quiz");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
//       <div className="max-w-6xl mx-auto space-y-10">

//         {/* ================= HEADER ================= */}
//         <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-10 text-white shadow-xl">
//           <div className="flex items-center gap-4">
//             <ClipboardList className="w-10 h-10" />
//             <div>
//               <h1 className="text-4xl font-bold">Quiz Builder</h1>
//               <p className="text-white/80 mt-1">
//                 Create structured assessments for your students
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* ================= QUIZ DETAILS ================= */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <input
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Quiz Title"
//             className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-indigo-500 outline-none"
//           />

//           <input
//             value={batchId}
//             onChange={(e) => setBatchId(e.target.value)}
//             placeholder="Batch ID"
//             className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-indigo-500 outline-none"
//           />
//         </div>

//         <textarea
//           value={instructions}
//           onChange={(e) => setInstructions(e.target.value)}
//           placeholder="Quiz instructions for students"
//           rows={3}
//           className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-indigo-500 outline-none"
//         />

//         {/* ================= QUESTIONS ================= */}
//         <div className="space-y-8">
//           {questions.map((q, index) => (
//             <div
//               key={index}
//               className="rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-lg space-y-5"
//             >
//               <div className="flex items-center gap-3">
//                 <HelpCircle className="text-indigo-400" />
//                 <h2 className="text-lg font-semibold text-white">
//                   Question {index + 1}
//                 </h2>
//               </div>

//               <input
//                 value={q.text}
//                 onChange={(e) => {
//                   const updated = [...questions];
//                   updated[index].text = e.target.value;
//                   setQuestions(updated);
//                 }}
//                 placeholder="Enter question text"
//                 className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-indigo-500 outline-none"
//               />

//               {/* ================= OPTIONS ================= */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {["A", "B", "C", "D"].map((key) => (
//                   <div
//                     key={key}
//                     className={`p-4 rounded-xl border transition
//                       ${
//                         q.correctOption === key
//                           ? "border-emerald-500 bg-emerald-500/10"
//                           : "border-slate-700"
//                       }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       {/* RADIO BUTTON */}
//                       <input
//                         type="radio"
//                         name={`correct-${index}`}
//                         checked={q.correctOption === key}
//                         onChange={() => {
//                           const updated = [...questions];
//                           updated[index].correctOption = key;
//                           setQuestions(updated);
//                         }}
//                         className="w-4 h-4 accent-emerald-500 cursor-pointer"
//                       />

//                       {/* OPTION INPUT */}
//                       <input
//                         value={q.options[key]}
//                         onChange={(e) => {
//                           const updated = [...questions];
//                           updated[index].options[key] = e.target.value;
//                           setQuestions(updated);
//                         }}
//                         placeholder={`Option ${key}`}
//                         className="flex-1 bg-transparent outline-none text-white"
//                       />
//                     </div>

//                     {q.correctOption === key && (
//                       <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
//                         <CheckCircle className="w-3 h-3" />
//                         Correct answer selected
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ================= ACTIONS ================= */}
//         <div className="flex flex-col sm:flex-row gap-4">
//           <button
//             onClick={addNewQuestion}
//             className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
//           >
//             <PlusCircle className="w-5 h-5" />
//             Add Another Question
//           </button>

//           <button
//             onClick={handleSaveQuiz}
//             disabled={loading}
//             className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin" />
//                 Saving…
//               </>
//             ) : (
//               "Publish Quiz"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateQuiz;






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

        {/* ================= HERO (SAME COLOR AS UPLOAD DOCS) ================= */}
        <div
          className="
            rounded-2xl
            bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500
            p-5 text-white shadow-md
          "
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white shadow flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-blue-600" />
            </div>

            <div>
              <h1 className="text-lg font-semibold">
                Quiz Builder
              </h1>
              <p className="text-sm text-white/90">
                Create assessments for students
              </p>
            </div>
          </div>
        </div>

        {/* ================= DETAILS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quiz Title"
            className="
              w-full px-3 py-2 rounded-lg
              bg-white dark:bg-slate-900
              border border-slate-300 dark:border-slate-700
              text-slate-900 dark:text-slate-100
              outline-none
            "
          />

          <input
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            placeholder="Batch ID"
            className="
              w-full px-3 py-2 rounded-lg
              bg-white dark:bg-slate-900
              border border-slate-300 dark:border-slate-700
              text-slate-900 dark:text-slate-100
              outline-none
            "
          />
        </div>

        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Quiz instructions"
          rows={3}
          className="
            w-full px-3 py-2 rounded-lg
            bg-white dark:bg-slate-900
            border border-slate-300 dark:border-slate-700
            text-slate-900 dark:text-slate-100
            outline-none
          "
        />

        {/* ================= QUESTIONS ================= */}
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div
              key={index}
              className="
                rounded-2xl
                bg-white dark:bg-slate-900
                border border-slate-200 dark:border-slate-700
                p-5 space-y-4
              "
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
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
                className="
                  w-full px-3 py-2 rounded-lg
                  bg-slate-50 dark:bg-slate-800
                  border border-slate-300 dark:border-slate-700
                  text-slate-900 dark:text-slate-100
                  outline-none
                "
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["A", "B", "C", "D"].map((key) => (
                  <div
                    key={key}
                    className={`
                      rounded-lg border p-3
                      ${
                        q.correctOption === key
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                          : "border-slate-300 dark:border-slate-700"
                      }
                    `}
                  >
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
                        className="accent-emerald-500"
                      />

                      <input
                        value={q.options[key]}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[index].options[key] = e.target.value;
                          setQuestions(updated);
                        }}
                        placeholder={`Option ${key}`}
                        className="flex-1 bg-transparent outline-none text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    {q.correctOption === key && (
                      <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Correct answer
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={addNewQuestion}
            className="
              flex items-center justify-center gap-2
              px-5 py-2.5 rounded-lg
              bg-blue-600 hover:bg-blue-700
              text-white text-sm font-semibold
            "
          >
            <PlusCircle className="w-4 h-4" />
            Add Question
          </button>

          <button
            onClick={handleSaveQuiz}
            disabled={loading}
            className="
              flex items-center justify-center gap-2
              px-5 py-2.5 rounded-lg
              bg-emerald-600 hover:bg-emerald-700
              text-white text-sm font-semibold
            "
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





