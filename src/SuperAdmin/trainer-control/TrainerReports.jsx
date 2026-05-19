import React, { useState, useMemo } from "react";
import { useUserManagement } from "../context/UserManagementContext";
// import { USER_STATUS, STATUS_CONFIG } from "../../constants/permissions";
import { USER_STATUS, STATUS_CONFIG } from "../constants/permissions";
const REPORT_TYPES = [
  { key: "overview", label: "Overview Report", desc: "Trainer list with status and specialization" },
  { key: "performance", label: "Performance Report", desc: "Ratings, students, session metrics" },
  { key: "content", label: "Content Report", desc: "Videos, assignments, quizzes published" },
  { key: "earnings", label: "Earnings Report", desc: "Revenue attribution per trainer" },
];

const seedVal = (id, min, max) => {
  const n = parseInt((id || "0").replace(/\D/g, "").slice(-3)) || 0;
  return min + (n % (max - min + 1));
};

const COLUMNS = {
  overview: [
    { key: "name", label: "Trainer Name" },
    { key: "email", label: "Email" },
    { key: "specialization", label: "Specialization", render: (v) => (
      <span className="text-xs bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full font-medium">{v || "General"}</span>
    )},
    { key: "status", label: "Status", render: (v) => {
      const c = STATUS_CONFIG[v];
      return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c?.bg} ${c?.color}`}>{c?.label}</span>;
    }},
    { key: "joinedAt", label: "Joined", render: (v) => v ? new Date(v).toLocaleDateString("en-IN") : "—" },
  ],
  performance: [
    { key: "name", label: "Trainer Name" },
    { key: "rating", label: "Rating", render: (v) => (
      <span className="flex items-center gap-1 text-amber-400 font-bold">⭐ {parseFloat(v).toFixed(1)}</span>
    )},
    { key: "totalStudents", label: "Students", render: (v) => <span className="font-bold text-white">{v}</span> },
    { key: "_sessions", label: "Sessions", render: (_, r) => seedVal(r.id, 10, 80) },
    { key: "_quizAvg", label: "Quiz Pass %", render: (_, r) => {
      const v = seedVal(r.id, 60, 95);
      return <span className={v >= 80 ? "text-emerald-400 font-bold" : v >= 65 ? "text-amber-400 font-bold" : "text-red-400 font-bold"}>{v}%</span>;
    }},
    { key: "status", label: "Status", render: (v) => {
      const c = STATUS_CONFIG[v];
      return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c?.bg} ${c?.color}`}>{c?.label}</span>;
    }},
  ],
  content: [
    { key: "name", label: "Trainer Name" },
    { key: "_videos", label: "Videos", render: (_, r) => seedVal(r.id, 5, 60) },
    { key: "_hours", label: "Total Hours", render: (_, r) => `${seedVal(r.id, 10, 120)}h` },
    { key: "_assignments", label: "Assignments", render: (_, r) => seedVal(r.id, 2, 30) },
    { key: "_quizzes", label: "Quizzes", render: (_, r) => seedVal(r.id, 1, 20) },
    { key: "_resources", label: "Resources", render: (_, r) => seedVal(r.id, 5, 50) },
  ],
  earnings: [
    { key: "name", label: "Trainer Name" },
    { key: "totalStudents", label: "Students Taught", render: (v) => <span className="font-bold text-white">{v}</span> },
    { key: "_revenue", label: "Revenue (₹)", render: (_, r) => {
      const v = seedVal(r.id, 5000, 80000);
      return <span className="font-bold text-emerald-400">₹{v.toLocaleString("en-IN")}</span>;
    }},
    { key: "_share", label: "Trainer Share", render: (_, r) => {
      const pct = seedVal(r.id, 40, 70);
      return <span className="text-violet-400 font-semibold">{pct}%</span>;
    }},
    { key: "_payout", label: "Payout (₹)", render: (_, r) => {
      const v = seedVal(r.id, 2000, 50000);
      return <span className="font-bold text-white">₹{v.toLocaleString("en-IN")}</span>;
    }},
  ],
};

const TrainerReports = () => {
  const { trainers } = useUserManagement();
  const [reportType, setReportType] = useState("overview");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    let list = [...trainers];
    if (statusFilter !== "all") list = list.filter((t) => t.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q));
    }
    return list;
  }, [trainers, statusFilter, search]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const columns = COLUMNS[reportType];

  const handleExportCSV = () => {
    const headers = columns.map((c) => c.label).join(",");
    const rows = filtered.map((row) =>
      columns.map((col) => {
        const raw = row[col.key];
        if (typeof raw === "string") return `"${raw}"`;
        if (typeof raw === "number") return raw;
        return `"${seedVal(row.id, 0, 100)}"`;
      }).join(",")
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trainer_${reportType}_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Trainer Reports</h2>
          <p className="text-slate-400 text-sm mt-0.5">Detailed performance, content, and earnings reports</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/8 border border-white/8 rounded-lg transition-all">
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Report Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {REPORT_TYPES.map((rt) => (
          <button key={rt.key} onClick={() => { setReportType(rt.key); setPage(1); }}
            className={`text-left rounded-xl border px-4 py-3 transition-all
              ${reportType === rt.key ? "border-violet-500/40 bg-violet-500/10" : "border-white/8 bg-white/3 hover:bg-white/5"}`}>
            <p className={`text-sm font-semibold ${reportType === rt.key ? "text-violet-300" : "text-white"}`}>{rt.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{rt.desc}</p>
          </button>
        ))}
      </div>

      {/* Summary Row for Earnings */}
      {reportType === "earnings" && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Revenue", value: "₹18,42,000", color: "emerald" },
            { label: "Total Payouts", value: "₹9,84,000", color: "violet" },
            { label: "Platform Cut", value: "₹8,58,000", color: "blue" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl bg-white/3 border border-white/8 px-4 py-3">
              <p className="text-xs text-slate-400">{label}</p>
              <p className={`text-lg font-bold text-${color}-400 mt-1`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={11} cy={11} r={8}/><path d="m21 21-4.35-4.35"/></svg>
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search trainers..."
            className="w-full pl-8 pr-4 py-2 bg-white/5 border border-white/8 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-white/5 border border-white/8 rounded-lg text-sm text-slate-300 focus:outline-none">
          <option value="all">All Status</option>
          {Object.values(USER_STATUS).map((s) => (
            <option key={s} value={s} className="bg-[#13131f] capitalize">{STATUS_CONFIG[s]?.label}</option>
          ))}
        </select>
        <span className="text-xs text-slate-500 ml-auto">{filtered.length} trainers</span>
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
          <span className="text-xs text-slate-500">Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            {[...Array(Math.min(totalPages, 6))].map((_, i) => (
              <button key={i+1} onClick={() => setPage(i+1)}
                className={`w-7 h-7 text-xs rounded transition-all ${page === i+1 ? "bg-violet-500 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
              >{i+1}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerReports;