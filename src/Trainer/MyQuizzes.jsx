import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Percent,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { deleteQuiz } from "../services/assessmentService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

export default function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAttempts, setShowAttempts] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [durationFilter, setDurationFilter] = useState("All");

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/quizzes/trainer`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
        },
      });
      setQuizzes(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    await deleteQuiz(id);
    loadQuizzes();
  };

  const loadAttempts = async (quizId, title) => {
    const token = localStorage.getItem("lms_token");
    const res = await axios.get(`${API_BASE_URL}/attempts/quiz/${quizId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAttempts(res.data);
    setSelectedQuiz({ id: quizId, title });
    setShowAttempts(true);
  };

  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSearch = q.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesDuration =
      durationFilter === "All"
        ? true
        : durationFilter === "Short"
          ? (q.duration || 30) <= 20
          : durationFilter === "Medium"
            ? (q.duration || 30) > 20 && (q.duration || 30) <= 40
            : (q.duration || 30) > 40;

    return matchesSearch && matchesDuration;
  });

  const exportQuizzes = () => {
    if (!filteredQuizzes.length) return;

    const headers = ["Title", "Duration", "Questions", "Marks"];
    const rows = filteredQuizzes.map((q) => [
      q.title, q.duration || 30, q.questionCount || 10, q.totalMarks || 100,
    ]);

    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "my-quizzes.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-5">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="rounded-xl bg-gradient-to-r from-[#38BDF8] via-[#3B82F6] to-[#6366F1] p-5 text-white">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6" />
            <div>
              <h1 className="text-xl font-bold">My Quizzes</h1>
              <p className="text-sm opacity-90">Manage quizzes & track performance</p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={FileText} label="Total Quizzes" value={quizzes.length} />
          <StatCard icon={Users} label="Total Attempts" value={attempts.length} />
          <StatCard
            icon={Award}
            label="Avg Score"
            value={
              attempts.length
                ? (attempts.reduce((s, a) => s + a.score, 0) / attempts.length).toFixed(1) + "%"
                : "0%"
            }
          />
        </div>

        {/* SEARCH + FILTER + EXPORT */}
        <Card className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-slate-50 dark:bg-slate-800 outline-none"
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowFilter(!showFilter)}>
                <Filter className="w-4 h-4 mr-1" /> Filter
              </Button>
              <Button size="sm" variant="outline" onClick={exportQuizzes}>
                <Download className="w-4 h-4 mr-1" /> Export
              </Button>
            </div>
          </div>

          {showFilter && (
            <div className="pt-3 border-t flex gap-2 flex-wrap">
              {["All", "Short", "Medium", "Long"].map((d) => (
                <Button
                  key={d}
                  size="sm"
                  variant={durationFilter === d ? "default" : "outline"}
                  onClick={() => setDurationFilter(d)}
                >
                  {d}
                </Button>
              ))}
              <Button size="sm" variant="ghost" onClick={() => setDurationFilter("All")}>
                Clear
              </Button>
            </div>
          )}
        </Card>

        {/* QUIZ LIST */}
        <div className="space-y-3">
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="p-4 flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{quiz.title}</h3>
                  <div className="flex gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {quiz.duration || 30} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" /> {quiz.totalMarks || 100}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => loadAttempts(quiz.id, quiz.title)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline"><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline"><Copy className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDelete(quiz.id, quiz.title)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* ATTEMPTS MODAL */}
        {showAttempts && selectedQuiz && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-bold">{selectedQuiz.title}</h2>
                <Button size="sm" variant="ghost" onClick={() => setShowAttempts(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4 overflow-y-auto">
                {attempts.length === 0 ? (
                  <p className="text-center text-sm text-slate-500">No attempts yet</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="border-b text-slate-500">
                      <tr>
                        <th className="py-2 text-left">Student</th>
                        <th className="py-2 text-center">Score</th>
                        <th className="py-2 text-center">Status</th>
                        <th className="py-2 text-center">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attempts.map((a) => (
                        <tr key={a.id} className="border-b">
                          <td className="py-2">{a.userEmail}</td>
                          <td className="py-2 text-center">
                            <Percent className="inline w-3 h-3 mr-1" />{a.score}%
                          </td>
                          <td className="py-2 text-center">
                            {a.score >= 70 ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600">
                                <CheckCircle className="w-4 h-4" /> Pass
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-600">
                                <AlertCircle className="w-4 h-4" /> Fail
                              </span>
                            )}
                          </td>
                          <td className="py-2 text-center">
                            <Calendar className="inline w-3 h-3 mr-1" />
                            {new Date(a.submittedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, label, value }) => (
  <Card className="p-4 flex items-center gap-3">
    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
      <Icon className="w-5 h-5 text-blue-600" />
    </div>
    <div>
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  </Card>
);