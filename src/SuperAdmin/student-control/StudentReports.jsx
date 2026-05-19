import React, { useState, useMemo } from "react";
import { useUserManagement } from "../context/UserManagementContext";
// import { USER_STATUS, STATUS_CONFIG } from "../../constants/permissions";
import { USER_STATUS, STATUS_CONFIG } from "../constants/permissions";
// ─── Report Type Config ───────────────────────────────────────
const REPORT_TYPES = [
  { key: "enrollment", label: "Enrollment Report", desc: "Students, courses, join dates" },
  { key: "progress", label: "Progress Report", desc: "Completion rates and progress" },
  { key: "attendance", label: "Attendance Report", desc: "Session attendance data" },
  { key: "performance", label: "Performance Report", desc: "Quiz scores and assignments" },
];

// ─── Export Button ────────────────────────────────────────────
const ExportBtn = ({ label, icon, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/8 border border-white/8 rounded-lg transition-all disabled:opacity-40"
  >
    {icon}
    {label}
  </button>
);

// ─── Column Definitions per Report ───────────────────────────
const COLUMNS = {
  enrollment: [
    { key: "name", label: "Student Name" },
    { key: "email", label: "Email" },
    { key: "enrolledCourses", label: "Enrolled Courses", render: (v) => <span className="font-semibold text-white">{v ?? 1}</span> },
    { key: "joinedAt", label: "Join Date", render: (v) => v ? new Date(v).toLocaleDateString("en-IN") : "—" },
    { key: "status", label: "Status", render: (v) => {
      const c = STATUS_CONFIG[v];
      return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c?.bg} ${c?.color}`}>{c?.label}</span>;
    }},
  ],
  progress: [
    { key: "name", label: "Student Name" },
    { key: "email", label: "Email" },
    { key: "progress", label: "Progress", render: (v) => (
      <div className="flex items-center gap-2 min-w-28">
        <div className="flex-1 bg-white/8 rounded-full h-1.5">
          <div className={`h-1.5 rounded-full ${v >= 75 ? "bg-emerald-500" : v >= 40 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${v}%` }} />
        </div>
        <span className="text-xs font-bold tabular-nums text-white w-8 text-right">{v}%</span>
      </div>
    )},
    { key: "enrolledCourses", label: "Courses", render: (v) => v ?? 1 },
    { key: "status", label: "Status", render: (v) => {
      const c = STATUS_CONFIG[v];
      return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c?.bg} ${c?.color}`}>{c?.label}</span>;
    }},
  ],
  attendance: [
    { key: "name", label: "Student Name" },
    { key: "email", label: "Email" },
    { key: "_attendance", label: "Attendance %", render: (_, row) => {
      const pct = 60 + Math.floor((parseInt(row.id?.slice(-3) || "0") % 40));
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-white/8 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full ${pct >= 75 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs font-semibold text-white">{pct}%</span>
        </div>
      );
    }},
    { key: "_sessions", label: "Sessions", render: (_, row) => Math.floor(Math.random() * 20) + 5 },
    { key: "_missed", label: "Missed", render: (_, row) => Math.floor(Math.random() * 5) },
    { key: "lastLogin", label: "Last Seen", render: (v) => v ? new Date(v).toLocaleDateString("en-IN") : "—" },
  ],
  performance: [
    { key: "name", label: "Student Name" },
    { key: "email", label: "Email" },
    { key: "_quizAvg", label: "Quiz Avg", render: (_, row) => {
      const score = 50 + Math.floor((parseInt(row.id?.slice(-3) || "0") % 50));
      return <span className={`font-bold ${score >= 75 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400"}`}>{score}%</span>;
    }},
    { key: "_assignments", label: "Assignments", render: () => `${Math.floor(Math.random() * 8) + 2}/10` },
    { key: "progress", label: "Course Progress", render: (v) => `${v}%` },
    { key: "status", label: "Status", render: (v) => {
      const c = STATUS_CONFIG[v];
      return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c?.bg} ${c?.color}`}>{c?.label}</span>;
    }},
  ],
};

// ─── Main Component ───────────────────────────────────────────
const StudentReports = () => {
  const { students } = useUserManagement();
  const [reportType, setReportType] = useState("enrollment");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const filtered = useMemo(() => {
    let list = [...students];
    if (statusFilter !== "all") list = list.filter((s) => s.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
    }
    return list;
  }, [students, statusFilter, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const columns = COLUMNS[reportType];

  const handleExportCSV = () => {
    const headers = columns.map((c) => c.label).join(",");
    const rows = filtered.map((row) =>
      columns.map((col) => {
        const val = row[col.key] ?? "";
        return typeof val === "string" ? `"${val}"` : val;
      }).join(",")
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student_${reportType}_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Student Reports</h2>
          <p className="text-slate-400 text-sm mt-0.5">Generate and export detailed student data reports</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportBtn
            label="Export CSV"
            icon={<svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>}
            onClick={handleExportCSV}
          />
          <ExportBtn
            label="Print"
            icon={<svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x={6} y={14} width={12} height={8}/></svg>}
            onClick={() => window.print()}
          />
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {REPORT_TYPES.map((rt) => (
          <button
            key={rt.key}
            onClick={() => { setReportType(rt.key); setPage(1); }}
            className={`text-left rounded-xl border px-4 py-3 transition-all
              ${reportType === rt.key ? "border-violet-500/40 bg-violet-500/10" : "border-white/8 bg-white/3 hover:bg-white/5"}`}
          >
            <p className={`text-sm font-semibold ${reportType === rt.key ? "text-violet-300" : "text-white"}`}>{rt.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{rt.desc}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={11} cy={11} r={8}/><path d="m21 21-4.35-4.35"/></svg>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search students..."
            className="w-full pl-8 pr-4 py-2 bg-white/5 border border-white/8 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-white/5 border border-white/8 rounded-lg text-sm text-slate-300 focus:outline-none"
        >
          <option value="all">All Status</option>
          {Object.values(USER_STATUS).map((s) => (
            <option key={s} value={s} className="bg-[#13131f] capitalize">{STATUS_CONFIG[s]?.label}</option>
          ))}
        </select>
        <span className="text-xs text-slate-500 ml-auto">{filtered.length} records</span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8 bg-white/3">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-10">#</th>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginated.map((row, i) => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-xs text-slate-500">{(page - 1) * PER_PAGE + i + 1}</td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-slate-300">
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            {[...Array(Math.min(totalPages, 7))].map((_, i) => {
              const p = i + 1;
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 text-xs rounded transition-all ${page === p ? "bg-violet-500 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                >{p}</button>
              );
            })}
            {totalPages > 7 && <span className="text-slate-600 px-1">…</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentReports;