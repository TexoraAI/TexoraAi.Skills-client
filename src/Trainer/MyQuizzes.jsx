
// src/trainer/MyQuizzes.jsx
import axios from "axios";
import {
  AlertCircle, Award, Calendar, CheckCircle, Clock, Copy,
  Download, Edit, Eye, FileText, Filter, Percent,
  Search, Trash2, Users, X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { deleteQuiz } from "../services/assessmentService";
import {
  useTrainerTheme, PageShell, PageHero, ThemedCard, CardHeader,
  ThemedInput, PrimaryButton, SecondaryButton,
  EmptyState, StatMiniCard, Pill,
} from "./trainerTheme";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

export default function MyQuizzes() {
  const { t, isDark } = useTrainerTheme();

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAttempts, setShowAttempts] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [durationFilter, setDurationFilter] = useState("All");

  useEffect(() => { loadQuizzes(); }, []);

  const loadQuizzes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/quizzes/trainer`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("lms_token")}` },
      });
      setQuizzes(res.data || []);
    } finally { setLoading(false); }
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
    const matchesSearch = q.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDuration =
      durationFilter === "All" ? true
      : durationFilter === "Short" ? (q.duration || 30) <= 20
      : durationFilter === "Medium" ? (q.duration || 30) > 20 && (q.duration || 30) <= 40
      : (q.duration || 30) > 40;
    return matchesSearch && matchesDuration;
  });

  const exportQuizzes = () => {
    if (!filteredQuizzes.length) return;
    const headers = ["Title", "Duration", "Questions", "Marks"];
    const rows = filteredQuizzes.map((q) => [q.title, q.duration || 30, q.questionCount || 10, q.totalMarks || 100]);
    const csv = "data:text/csv;charset=utf-8," + [headers, ...rows].map((r) => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "my-quizzes.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const avgScore = attempts.length
    ? (attempts.reduce((s, a) => s + a.score, 0) / attempts.length).toFixed(1) + "%"
    : "0%";

  return (
    <PageShell t={t}>
      {/* HERO */}
      <PageHero
        t={t} isDark={isDark}
        icon={FileText}
        badge="Assessment Center"
        title="My Quizzes"
        subtitle="Manage and track all your created quizzes."
        color="#22d3ee"
      />

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 20 }}>
        <StatMiniCard t={t} icon={FileText} color="#22d3ee" value={quizzes.length} label="Total Quizzes" />
        <StatMiniCard t={t} icon={Users}    color="#7c3aed" value={attempts.length} label="Total Attempts" />
        <StatMiniCard t={t} icon={Award}    color="#34d399" value={avgScore}        label="Avg Score" />
      </div>

      {/* SEARCH + FILTER */}
      <ThemedCard t={t} style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={14} color={t.textMuted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <ThemedInput
              t={t}
              placeholder="Search quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowFilter(!showFilter)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "10px 16px", borderRadius: 12, cursor: "pointer",
                fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 600,
                background: showFilter ? "#22d3ee" : "transparent",
                color: showFilter ? "#fff" : t.textMuted,
                border: `1px solid ${showFilter ? "#22d3ee" : t.border}`,
                transition: "all 0.2s",
              }}
            >
              <Filter size={13} /> Filter
            </button>
            <button
              onClick={exportQuizzes}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "10px 16px", borderRadius: 12, cursor: "pointer",
                fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 600,
                background: "transparent", color: t.textMuted,
                border: `1px solid ${t.border}`, transition: "all 0.2s",
              }}
            >
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        {showFilter && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${t.border}`, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["All", "Short", "Medium", "Long"].map((d) => (
              <button key={d} onClick={() => setDurationFilter(d)} style={{
                padding: "6px 14px", borderRadius: 999, cursor: "pointer",
                fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 700,
                background: durationFilter === d ? "#22d3ee" : "transparent",
                color: durationFilter === d ? "#fff" : t.textMuted,
                border: `1px solid ${durationFilter === d ? "#22d3ee" : t.border}`,
                transition: "all 0.2s",
              }}>{d}</button>
            ))}
          </div>
        )}
      </ThemedCard>

      {/* QUIZ LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {loading ? (
          <ThemedCard t={t}>
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
              <div style={{ width: 32, height: 32, border: "3px solid rgba(34,211,238,0.3)", borderTop: "3px solid #22d3ee", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            </div>
          </ThemedCard>
        ) : filteredQuizzes.length === 0 ? (
          <ThemedCard t={t}>
            <EmptyState t={t} icon={FileText} text="No quizzes found" />
          </ThemedCard>
        ) : (
          filteredQuizzes.map((quiz) => (
            <div key={quiz.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 12,
              background: t.cardBg, border: `1px solid ${t.border}`,
              borderRadius: 16, padding: "14px 18px",
              boxShadow: t.shadow, transition: "all 0.2s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)",
                }}>
                  <FileText size={18} color="#22d3ee" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{quiz.title}</p>
                  <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
                      <Clock size={11} /> {quiz.duration || 30} min
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
                      <Award size={11} /> {quiz.totalMarks || 100} marks
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {[
                  { icon: Eye,   color: "#22d3ee", onClick: () => loadAttempts(quiz.id, quiz.title), title: "View Attempts" },
                  { icon: Edit,  color: "#7c3aed", onClick: () => {}, title: "Edit" },
                  { icon: Copy,  color: "#fb923c", onClick: () => {}, title: "Duplicate" },
                ].map(({ icon: Icon, color, onClick, title }) => (
                  <button key={title} onClick={onClick} title={title} style={{
                    width: 34, height: 34, borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${color}18`, border: `1px solid ${color}30`,
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                    <Icon size={14} color={color} />
                  </button>
                ))}
                <button onClick={() => handleDelete(quiz.id, quiz.title)} title="Delete" style={{
                  width: 34, height: 34, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)",
                  cursor: "pointer", transition: "all 0.2s",
                }}>
                  <Trash2 size={14} color="#f87171" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ATTEMPTS MODAL */}
      {showAttempts && selectedQuiz && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 16,
        }}>
          <div style={{
            width: "100%", maxWidth: 720, maxHeight: "90vh",
            background: t.cardBg, border: `1px solid ${t.border}`,
            borderRadius: 24, boxShadow: t.shadowHov,
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            {/* modal header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "16px 20px", borderBottom: `1px solid ${t.border}`,
              background: t.inputBg,
            }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>Attempts</p>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: "3px 0 0", fontFamily: "'Poppins',sans-serif" }}>{selectedQuiz.title}</h2>
              </div>
              <button onClick={() => setShowAttempts(false)} style={{
                width: 32, height: 32, borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: t.actBg, border: `1px solid ${t.border}`,
                cursor: "pointer", color: t.textMuted,
              }}>
                <X size={14} />
              </button>
            </div>

            <div style={{ padding: 20, overflowY: "auto" }}>
              {attempts.length === 0 ? (
                <EmptyState t={t} icon={Users} text="No attempts yet" />
              ) : (
                <div style={{ borderRadius: 14, border: `1px solid ${t.border}`, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: t.inputBg }}>
                        {["Student", "Score", "Status", "Date"].map((h) => (
                          <th key={h} style={{
                            padding: "10px 16px", textAlign: "left",
                            fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                            letterSpacing: "0.08em", color: t.textMuted,
                            fontFamily: "'Poppins',sans-serif",
                            borderBottom: `1px solid ${t.border}`,
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {attempts.map((a) => (
                        <tr key={a.id} style={{ borderBottom: `1px solid ${t.border}` }}>
                          <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 500, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{a.userEmail}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <Percent size={11} color={t.textMuted} />{a.score}%
                            </span>
                          </td>
                          <td style={{ padding: "10px 16px" }}>
                            {a.score >= 70 ? (
                              <span style={{
                                display: "inline-flex", alignItems: "center", gap: 5,
                                padding: "3px 10px", borderRadius: 999,
                                background: "rgba(52,211,153,0.1)", color: "#34d399",
                                border: "1px solid rgba(52,211,153,0.2)",
                                fontSize: 11, fontWeight: 700, fontFamily: "'Poppins',sans-serif",
                              }}>
                                <CheckCircle size={11} /> Pass
                              </span>
                            ) : (
                              <span style={{
                                display: "inline-flex", alignItems: "center", gap: 5,
                                padding: "3px 10px", borderRadius: 999,
                                background: "rgba(248,113,113,0.1)", color: "#f87171",
                                border: "1px solid rgba(248,113,113,0.2)",
                                fontSize: 11, fontWeight: 700, fontFamily: "'Poppins',sans-serif",
                              }}>
                                <AlertCircle size={11} /> Fail
                              </span>
                            )}
                          </td>
                          <td style={{ padding: "10px 16px", fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <Calendar size={11} />
                              {new Date(a.submittedAt).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}