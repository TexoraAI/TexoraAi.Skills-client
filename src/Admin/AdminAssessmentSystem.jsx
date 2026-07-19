import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  getQuizAdminReport,
  getAssignmentAdminReport,
  getCodingProblemAdminReport,
  getStudyPlanAdminReport,
  getQuizAttemptsByQuizId,
  getSubmissionsByAssignment,
  getAssignmentsByProblemId,
  getStudyPlanItemsAdmin,
} from "../services/assessmentService";
import {
  FileQuestion,
  ClipboardList,
  Code2,
  BookOpen,
  Search,
  ChevronDown,
  ChevronRight,
  Inbox,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/* =====================================================================
   NOTE ON ASSUMPTIONS
   - Import path "../services/assessmentService" assumes this file lives
     one level below the folder that holds assessmentService.js (e.g.
     src/pages/AdminAssessmentSystem.jsx + src/services/assessmentService.js).
     Adjust the path to match your actual project structure.
   - Styling uses Tailwind utility classes (no dynamic class-name
     interpolation, so nothing gets purged in production builds).
   - No design-tokens file was supplied, so accent colors below are a
     self-contained palette. Swap the ACCENTS map if you want this to
     match an existing theme file exactly.
===================================================================== */

const TABS = [
  { key: "quiz", label: "Quiz", icon: FileQuestion, accent: "indigo" },
  {
    key: "assignment",
    label: "Assignment",
    icon: ClipboardList,
    accent: "amber",
  },
  { key: "problem", label: "Coding Problem", icon: Code2, accent: "emerald" },
  { key: "studyplan", label: "Study Plan", icon: BookOpen, accent: "rose" },
];

const ACCENTS = {
  indigo: {
    text: "text-indigo-600",
    bgSoft: "bg-indigo-50",
    bgSolid: "bg-indigo-600",
    border: "border-indigo-600",
    ring: "focus:ring-indigo-500",
    badgeBg: "bg-indigo-100",
    badgeText: "text-indigo-700",
    iconBg: "bg-indigo-100",
  },
  amber: {
    text: "text-amber-600",
    bgSoft: "bg-amber-50",
    bgSolid: "bg-amber-500",
    border: "border-amber-500",
    ring: "focus:ring-amber-500",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    iconBg: "bg-amber-100",
  },
  emerald: {
    text: "text-emerald-600",
    bgSoft: "bg-emerald-50",
    bgSolid: "bg-emerald-600",
    border: "border-emerald-600",
    ring: "focus:ring-emerald-500",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
    iconBg: "bg-emerald-100",
  },
  rose: {
    text: "text-rose-600",
    bgSoft: "bg-rose-50",
    bgSolid: "bg-rose-600",
    border: "border-rose-600",
    ring: "focus:ring-rose-500",
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-700",
    iconBg: "bg-rose-100",
  },
};

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function sum(list, key) {
  return list.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
}

/* --------------------------- small pieces --------------------------- */

function StatCard({ icon: Icon, label, value, accent, hint }) {
  const a = ACCENTS[accent];
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${a.iconBg}`}
      >
        <Icon className={`h-6 w-6 ${a.text}`} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold leading-tight text-slate-900">
          {value}
        </p>
        <p className="truncate text-sm text-slate-500">{label}</p>
        {hint ? (
          <p className="mt-0.5 truncate text-xs text-slate-400">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <Icon className="h-7 w-7 text-slate-400" />
      </div>
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}

function StatusBadge({ active }) {
  return active ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
      <CheckCircle2 className="h-3.5 w-3.5" /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
      <XCircle className="h-3.5 w-3.5" /> Inactive
    </span>
  );
}

function SearchBar({ value, onChange, placeholder, accent }) {
  const a = ACCENTS[accent];
  return (
    <div className="relative w-full max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-transparent focus:ring-2 ${a.ring}`}
      />
    </div>
  );
}

/* ----------------------- row-expand drill-downs ---------------------- */

function QuizAttemptsPanel({ quizId }) {
  const [state, setState] = useState({ loading: true, error: null, rows: [] });

  useEffect(() => {
    let alive = true;
    setState({ loading: true, error: null, rows: [] });
    getQuizAttemptsByQuizId(quizId)
      .then((res) => {
        if (!alive) return;
        const rows = Array.isArray(res.data) ? res.data : [];
        setState({ loading: false, error: null, rows });
      })
      .catch(() => {
        if (!alive) return;
        setState({
          loading: false,
          error: "Couldn't load attempts for this quiz.",
          rows: [],
        });
      });
    return () => {
      alive = false;
    };
  }, [quizId]);

  if (state.loading) return <InlineLoading label="Loading attempts…" />;
  if (state.error) return <InlineError message={state.error} />;
  if (state.rows.length === 0)
    return <InlineEmpty message="No attempts yet for this quiz." />;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-2 font-medium">Student</th>
            <th className="px-4 py-2 font-medium">Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {state.rows.map((row, i) => (
            <tr key={row.id ?? i}>
              <td className="px-4 py-2 text-slate-700">
                {row.userEmail ?? "—"}
              </td>
              <td className="px-4 py-2 text-slate-700">{row.score ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AssignmentSubmissionsPanel({ assignmentId }) {
  const [state, setState] = useState({ loading: true, error: null, rows: [] });

  useEffect(() => {
    let alive = true;
    setState({ loading: true, error: null, rows: [] });
    getSubmissionsByAssignment(assignmentId)
      .then((res) => {
        if (!alive) return;
        const rows = Array.isArray(res.data) ? res.data : [];
        setState({ loading: false, error: null, rows });
      })
      .catch(() => {
        if (!alive) return;
        setState({
          loading: false,
          error: "Couldn't load submissions for this assignment.",
          rows: [],
        });
      });
    return () => {
      alive = false;
    };
  }, [assignmentId]);

  if (state.loading) return <InlineLoading label="Loading submissions…" />;
  if (state.error) return <InlineError message={state.error} />;
  if (state.rows.length === 0)
    return <InlineEmpty message="No submissions yet for this assignment." />;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-2 font-medium">Student</th>
            <th className="px-4 py-2 font-medium">Status</th>
            <th className="px-4 py-2 font-medium">Marks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {state.rows.map((row, i) => (
            <tr key={row.id ?? i}>
              <td className="px-4 py-2 text-slate-700">
                {row.studentEmail ?? "—"}
              </td>
              <td className="px-4 py-2 text-slate-700">{row.status ?? "—"}</td>
              <td className="px-4 py-2 text-slate-700">{row.marks ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

//
function CodingProblemAssignmentsPanel({ problemId }) {
  const [state, setState] = useState({ loading: true, error: null, rows: [] });

  useEffect(() => {
    let alive = true;
    setState({ loading: true, error: null, rows: [] });
    getAssignmentsByProblemId(problemId)
      .then((res) => {
        if (!alive) return;
        setState({
          loading: false,
          error: null,
          rows: Array.isArray(res.data) ? res.data : [],
        });
      })
      .catch(() => {
        if (!alive) return;
        setState({
          loading: false,
          error: "Couldn't load assigned batches.",
          rows: [],
        });
      });
    return () => {
      alive = false;
    };
  }, [problemId]);

  if (state.loading) return <InlineLoading label="Loading assigned batches…" />;
  if (state.error) return <InlineError message={state.error} />;
  if (state.rows.length === 0)
    return <InlineEmpty message="Not assigned to any batch yet." />;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-2 font-medium">Batch</th>
            <th className="px-4 py-2 font-medium">Assigned By</th>
            <th className="px-4 py-2 font-medium">Due Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {state.rows.map((row) => (
            <tr key={row.assignmentId}>
              <td className="px-4 py-2 text-slate-700">{row.batchId}</td>
              <td className="px-4 py-2 text-slate-700">
                {row.assignedByEmail}
              </td>
              <td className="px-4 py-2 text-slate-700">
                {formatDate(row.dueDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StudyPlanItemsPanel({ planId }) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    sections: [],
  });

  useEffect(() => {
    let alive = true;
    setState({ loading: true, error: null, sections: [] });
    getStudyPlanItemsAdmin(planId)
      .then((res) => {
        if (!alive) return;
        setState({
          loading: false,
          error: null,
          sections: res.data?.sections ?? [],
        });
      })
      .catch(() => {
        if (!alive) return;
        setState({
          loading: false,
          error: "Couldn't load items for this study plan.",
          sections: [],
        });
      });
    return () => {
      alive = false;
    };
  }, [planId]);

  if (state.loading) return <InlineLoading label="Loading items…" />;
  if (state.error) return <InlineError message={state.error} />;

  const allItems = state.sections.flatMap((s) => s.items ?? []);
  if (allItems.length === 0)
    return <InlineEmpty message="No items in this study plan." />;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-2 font-medium">Problem</th>
            <th className="px-4 py-2 font-medium">Difficulty</th>
            <th className="px-4 py-2 font-medium">Marks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {allItems.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-2 text-slate-700">{item.problemTitle}</td>
              <td className="px-4 py-2 text-slate-700">
                {item.problemDifficulty ?? "—"}
              </td>
              <td className="px-4 py-2 text-slate-700">
                {item.problemTotalMarks ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InlineLoading({ label }) {
  return (
    <div className="flex items-center gap-2 px-4 py-4 text-sm text-slate-500">
      <Loader2 className="h-4 w-4 animate-spin" /> {label}
    </div>
  );
}

function InlineError({ message }) {
  return (
    <div className="flex items-center gap-2 px-4 py-4 text-sm text-rose-600">
      <AlertTriangle className="h-4 w-4" /> {message}
    </div>
  );
}

function InlineEmpty({ message }) {
  return <div className="px-4 py-4 text-sm text-slate-400">{message}</div>;
}

/* ------------------------------ tables ------------------------------- */

function QuizTable({ rows, expandedId, onToggle }) {
  if (rows.length === 0)
    return <EmptyState icon={FileQuestion} message="No quizzes found." />;
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="w-10 px-4 py-3" />
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Creator</th>
            <th className="px-4 py-3 font-medium">Batch</th>
            <th className="px-4 py-3 font-medium">Questions</th>
            <th className="px-4 py-3 font-medium">Attempts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => {
            const isOpen = expandedId === row.id;
            return (
              <React.Fragment key={row.id ?? i}>
                <tr
                  onClick={() => onToggle(row.id)}
                  className="cursor-pointer transition hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-slate-400">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {row.title}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.trainerEmail}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.batchId ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.questionCount ?? 0}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.attemptCount ?? 0}
                  </td>
                </tr>
                {isOpen && (
                  <tr>
                    <td colSpan={7} className="bg-slate-50 px-4 py-3">
                      <QuizAttemptsPanel quizId={row.id} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AssignmentTable({ rows, expandedId, onToggle }) {
  if (rows.length === 0)
    return <EmptyState icon={ClipboardList} message="No assignments found." />;
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="w-10 px-4 py-3" />
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Creator</th>
            <th className="px-4 py-3 font-medium">Batch</th>
            <th className="px-4 py-3 font-medium">Deadline</th>
            <th className="px-4 py-3 font-medium">Submissions</th>
            <th className="px-4 py-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => {
            const isOpen = expandedId === row.id;
            return (
              <React.Fragment key={row.id ?? i}>
                <tr
                  onClick={() => onToggle(row.id)}
                  className="cursor-pointer transition hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-slate-400">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {row.title}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.trainerEmail}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.batchId ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(row.deadline)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.submissionCount ?? 0}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(row.createdAt)}
                  </td>
                </tr>
                {isOpen && (
                  <tr>
                    <td colSpan={8} className="bg-slate-50 px-4 py-3">
                      <AssignmentSubmissionsPanel assignmentId={row.id} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ProblemTable({ rows, expandedId, onToggle }) {
  if (rows.length === 0)
    return <EmptyState icon={Code2} message="No coding problems found." />;
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="w-10 px-4 py-3" />
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Creator</th>
            <th className="px-4 py-3 font-medium">Difficulty</th>
            <th className="px-4 py-3 font-medium">Total Marks</th>
            <th className="px-4 py-3 font-medium">Assigned Batches</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => {
            const isOpen = expandedId === row.id;
            return (
              <React.Fragment key={row.id ?? i}>
                <tr
                  onClick={() => onToggle(row.id)}
                  className="cursor-pointer transition hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-slate-400">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {row.title}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.trainerEmail}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.difficulty ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.totalMarks ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.assignedBatchCount ?? 0}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(row.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge active={!!row.isActive} />
                  </td>
                </tr>
                {isOpen && (
                  <tr>
                    <td colSpan={9} className="bg-slate-50 px-4 py-3">
                      <CodingProblemAssignmentsPanel problemId={row.id} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StudyPlanTable({ rows, expandedId, onToggle }) {
  if (rows.length === 0)
    return <EmptyState icon={BookOpen} message="No study plans found." />;
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="w-10 px-4 py-3" />
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Creator</th>
            <th className="px-4 py-3 font-medium">Batch</th>
            <th className="px-4 py-3 font-medium">Items</th>
            <th className="px-4 py-3 font-medium">Due Date</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => {
            const isOpen = expandedId === row.id;
            return (
              <React.Fragment key={row.id ?? i}>
                <tr
                  onClick={() => onToggle(row.id)}
                  className="cursor-pointer transition hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-slate-400">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {row.title}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.trainerEmail}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.batchId ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.itemCount ?? 0}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(row.dueDate)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(row.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge active={!!row.active} />
                  </td>
                </tr>
                {isOpen && (
                  <tr>
                    <td colSpan={9} className="bg-slate-50 px-4 py-3">
                      <StudyPlanItemsPanel planId={row.id} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------- page -------------------------------- */

export default function AdminAssessmentSystem() {
  const [activeTab, setActiveTab] = useState("quiz");
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerms, setSearchTerms] = useState({
    quiz: "",
    assignment: "",
    problem: "",
    studyplan: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    quiz: [],
    assignment: [],
    problem: [],
    studyplan: [],
  });

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    Promise.all([
      getQuizAdminReport(),
      getAssignmentAdminReport(),
      getCodingProblemAdminReport(),
      getStudyPlanAdminReport(),
    ])
      .then(([quizRes, assignmentRes, problemRes, studyPlanRes]) => {
        if (!alive) return;
        setData({
          quiz: Array.isArray(quizRes.data) ? quizRes.data : [],
          assignment: Array.isArray(assignmentRes.data)
            ? assignmentRes.data
            : [],
          problem: Array.isArray(problemRes.data) ? problemRes.data : [],
          studyplan: Array.isArray(studyPlanRes.data) ? studyPlanRes.data : [],
        });
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setError("Couldn't load the assessment system data. Please try again.");
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const handleTabChange = useCallback((key) => {
    setActiveTab(key);
    setExpandedId(null);
  }, []);

  const handleToggleRow = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerms[activeTab].trim().toLowerCase();
    const rows = data[activeTab] || [];
    if (!term) return rows;
    return rows.filter((row) => {
      const title = (row.title || "").toLowerCase();
      const creator = (row.trainerEmail || "").toLowerCase();
      return title.includes(term) || creator.includes(term);
    });
  }, [data, activeTab, searchTerms]);

  const summaryLine = useMemo(() => {
    const rows = data[activeTab] || [];
    if (rows.length === 0) return null;
    switch (activeTab) {
      case "quiz": {
        const batches = new Set(rows.map((r) => r.batchId).filter(Boolean))
          .size;
        const attempts = sum(rows, "attemptCount");
        return `${rows.length} quiz${rows.length === 1 ? "" : "zes"} across ${batches} batch${batches === 1 ? "" : "es"}, ${attempts} total attempt${attempts === 1 ? "" : "s"}`;
      }
      case "assignment": {
        const batches = new Set(rows.map((r) => r.batchId).filter(Boolean))
          .size;
        const submissions = sum(rows, "submissionCount");
        return `${rows.length} assignment${rows.length === 1 ? "" : "s"} across ${batches} batch${batches === 1 ? "" : "es"}, ${submissions} total submission${submissions === 1 ? "" : "s"}`;
      }
      case "problem": {
        const active = rows.filter((r) => r.isActive).length;
        return `${rows.length} coding problem${rows.length === 1 ? "" : "s"}, ${active} currently active`;
      }
      case "studyplan": {
        const items = sum(rows, "itemCount");
        return `${rows.length} study plan${rows.length === 1 ? "" : "s"} with ${items} item${items === 1 ? "" : "s"} total`;
      }
      default:
        return null;
    }
  }, [data, activeTab]);

  const activeMeta = TABS.find((t) => t.key === activeTab);
  const activeAccent = ACCENTS[activeMeta.accent];

  const searchPlaceholders = {
    quiz: "Search quizzes by title or creator…",
    assignment: "Search assignments by title or creator…",
    problem: "Search problems by title or creator…",
    studyplan: "Search study plans by title or creator…",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Assessment System
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Quizzes, assignments, coding problems, and study plans across your
          organization
        </p>
      </div>

      {/* stat cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FileQuestion}
          label="Quizzes"
          value={data.quiz.length}
          accent="indigo"
        />
        <StatCard
          icon={ClipboardList}
          label="Assignments"
          value={data.assignment.length}
          accent="amber"
        />
        <StatCard
          icon={Code2}
          label="Coding Problems"
          value={data.problem.length}
          accent="emerald"
        />
        <StatCard
          icon={BookOpen}
          label="Study Plans"
          value={data.studyplan.length}
          accent="rose"
        />
      </div>

      {/* tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200">
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          const a = ACCENTS[tab.accent];
          const Icon = tab.icon;
          const count = data[tab.key].length;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? `${a.border} ${a.text}`
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon
                className={`h-4 w-4 transition-colors duration-150 ${isActive ? a.text : "text-slate-400"}`}
              />
              {tab.label}
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold transition-colors duration-150 ${
                  isActive
                    ? `${a.badgeBg} ${a.badgeText}`
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* body */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading assessment data…
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
          <AlertTriangle className="h-8 w-8 text-rose-500" />
          <p className="text-sm font-medium text-slate-600">{error}</p>
        </div>
      ) : (
        <div key={activeTab} className="assessment-tab-fade">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {summaryLine ?? "No data yet."}
            </p>
            <SearchBar
              value={searchTerms[activeTab]}
              onChange={(val) =>
                setSearchTerms((prev) => ({ ...prev, [activeTab]: val }))
              }
              placeholder={searchPlaceholders[activeTab]}
              accent={activeMeta.accent}
            />
          </div>

          {activeTab === "quiz" && (
            <QuizTable
              rows={filtered}
              expandedId={expandedId}
              onToggle={handleToggleRow}
            />
          )}
          {activeTab === "assignment" && (
            <AssignmentTable
              rows={filtered}
              expandedId={expandedId}
              onToggle={handleToggleRow}
            />
          )}
          {activeTab === "problem" && (
            <ProblemTable
              rows={filtered}
              expandedId={expandedId}
              onToggle={handleToggleRow}
            />
          )}
          {activeTab === "studyplan" && (
            <StudyPlanTable
              rows={filtered}
              expandedId={expandedId}
              onToggle={handleToggleRow}
            />
          )}
        </div>
      )}

      <style>{`
        .assessment-tab-fade {
          animation: assessmentTabFade 180ms ease-out;
        }
        @keyframes assessmentTabFade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .assessment-tab-fade { animation: none; }
        }
      `}</style>
    </div>
  );
}
