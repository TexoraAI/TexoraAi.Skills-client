import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import assessmentService from "../services/assessmentService";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const QUIZ_DURATION_SECONDS = 300;

const AttemptQuiz = () => {
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const timerRef = useRef(null);

  // ================= LOAD QUIZ =================
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);

        const attemptRes = await assessmentService.hasAttempted(quizId);

        if (attemptRes.data === true) {
          setAlreadyAttempted(true);
          setError("You already submitted this quiz. Try again after 24 hours.");
          setLoading(false);
          return;
        }

        const res = await assessmentService.getQuizById(quizId);
        setQuiz(res.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load quiz");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  // ================= TIMER =================
  useEffect(() => {
    if (!quiz || alreadyAttempted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          autoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [quiz, alreadyAttempted]);

  // ================= AUTO SUBMIT =================
  const autoSubmit = async () => {
    if (!quiz || alreadyAttempted) return;

    try {
      const payload = {
        quizId: quiz.id,
        answers: Object.entries(answers).map(([qId, optId]) => ({
          questionId: qId,
          selectedOptionId: optId,
        })),
      };

      const res = await assessmentService.submitQuizAttempt(payload);
      alert(`⏱️ Time up! Score: ${res.data.percentage}%`);
      setAlreadyAttempted(true);
    } catch {
      setError("Auto submission failed");
    }
  };

  // ================= MANUAL SUBMIT =================
  const submitQuiz = async () => {
    try {
      const payload = {
        quizId: quiz.id,
        answers: Object.entries(answers).map(([qId, optId]) => ({
          questionId: qId,
          selectedOptionId: optId,
        })),
      };

      const res = await assessmentService.submitQuizAttempt(payload);
      alert(`Score: ${res.data.percentage}%`);
      setAlreadyAttempted(true);
      clearInterval(timerRef.current);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("You already submitted this quiz. Try again after 24 hours.");
        setAlreadyAttempted(true);
      } else {
        setError("Failed to submit quiz");
      }
    }
  };

  // ================= UI STATES =================
  if (loading) {
    return (
      <p className="p-6 text-muted-foreground">
        Loading quiz...
      </p>
    );
  }

  if (alreadyAttempted) {
    return (
      <div className="p-6 text-center text-destructive">
        {error || "You already submitted this quiz."}
      </div>
    );
  }

  if (!quiz) {
    return (
      <p className="p-6 text-muted-foreground">
        Quiz not found
      </p>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {quiz.title}
        </h1>

        <span className="font-semibold text-yellow-500">
          ⏱ {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>

      {/* Questions */}
      {quiz.questions.map((q, index) => (
        <Card key={q.id}>
          <CardHeader>
            <CardTitle className="text-base">
              {index + 1}. {q.text}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            {q.options.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={answers[q.id] === opt.id}
                  onChange={() =>
                    setAnswers({ ...answers, [q.id]: opt.id })
                  }
                />
                {opt.text}
              </label>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Submit */}
      <div className="pt-4">
        <Button onClick={submitQuiz} size="lg">
          Submit Quiz
        </Button>
      </div>
    </div>
  );
};

export default AttemptQuiz;
