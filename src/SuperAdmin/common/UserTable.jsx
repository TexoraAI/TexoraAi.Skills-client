import React, { useState, useMemo } from "react";
import { USER_STATUS, STATUS_CONFIG } from "../constants/permissions";
import { useUserManagement } from "../context/UserManagementContext";

// ============================================================
// STATUS BADGE
// ============================================================
export const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG[USER_STATUS.INACTIVE];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ============================================================
// ACTION DROPDOWN
// ============================================================
const ActionMenu = ({ user, onAction }) => {
  const [open, setOpen] = useState(false);

  const actions = [
    { label: "View Details", key: "view", icon: "👁" },
    { label: "Edit User", key: "edit", icon: "✏️" },
    user.status === USER_STATUS.ACTIVE
      ? { label: "Deactivate", key: "deactivate", icon: "🚫", danger: false }
      : { label: "Activate", key: "activate", icon: "✅", danger: false },
    user.status === USER_STATUS.SUSPENDED
      ? { label: "Unsuspend", key: "unsuspend", icon: "🔓" }
      : { label: "Suspend", key: "suspend", icon: "⏸️" },
    { label: "Delete User", key: "delete", icon: "🗑️", danger: true },
  ];

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="p-1.5 text-slate-500 hover:text-white hover:bg-white/8 rounded-lg transition-all"
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx={12} cy={5} r={1} fill="currentColor" /><circle cx={12} cy={12} r={1} fill="currentColor" /><circle cx={12} cy={19} r={1} fill="currentColor" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-44 bg-[#13131f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20">
            {actions.map((action) => (
              <button
                key={action.key}
                onClick={() => { onAction(action.key, user); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors
                  ${action.danger ? "text-red-400 hover:bg-red-400/8" : "text-slate-300 hover:bg-white/5"}`}
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ============================================================
// MAIN USER TABLE
// ============================================================
const UserTable = ({
  users = [],
  roleLabel = "Role",
  onAction,
  extraColumns = [],
  searchable = true,
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    let list = [...users];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((u) => u.status === statusFilter);
    }

    list.sort((a, b) => {
      const av = a[sortBy] || "";
      const bv = b[sortBy] || "";
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

    return list;
  }, [users, search, statusFilter, sortBy, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("asc"); }
  };

  const SortIcon = ({ col }) => (
    <span className={`ml-1 text-[10px] ${sortBy === col ? "text-violet-400" : "text-slate-600"}`}>
      {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {searchable && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or email..."
              className="w-full pl-8 pr-4 py-2 bg-white/5 border border-white/8 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white/5 border border-white/8 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-violet-500/50 transition-all"
          >
            <option value="all">All Status</option>
            {Object.values(USER_STATUS).map((s) => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>

          <span className="text-xs text-slate-500">{filtered.length} users</span>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8 bg-white/3">
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("name")}
                    className="text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-white flex items-center"
                  >
                    User <SortIcon col="name" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                {extraColumns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("joinedAt")}
                    className="text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-white flex items-center"
                  >
                    Joined <SortIcon col="joinedAt" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-4 py-3 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6 + extraColumns.length} className="px-4 py-12 text-center text-slate-500 text-sm">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                paginated.map((user) => (
                  <tr key={user.id} className="hover:bg-white/2 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/50 to-indigo-600/50 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {user.name?.[0] || "?"}
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={user.status} />
                    </td>
                    {extraColumns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-sm text-slate-400">
                        {col.render ? col.render(user) : user[col.key] ?? "—"}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {user.lastLogin
                        ? new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
                            Math.round((new Date(user.lastLogin) - Date.now()) / 86400000),
                            "day"
                          )
                        : "Never"}
                    </td>
                    <td className="px-4 py-3">
                      <ActionMenu user={user} onAction={onAction} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 text-xs">
            Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-2 py-1 text-xs text-slate-400 hover:text-white disabled:opacity-30 hover:bg-white/5 rounded transition-all"
            >«</button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2 py-1 text-xs text-slate-400 hover:text-white disabled:opacity-30 hover:bg-white/5 rounded transition-all"
            >‹</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 text-xs rounded transition-all ${page === p ? "bg-violet-500 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                >{p}</button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2 py-1 text-xs text-slate-400 hover:text-white disabled:opacity-30 hover:bg-white/5 rounded transition-all"
            >›</button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="px-2 py-1 text-xs text-slate-400 hover:text-white disabled:opacity-30 hover:bg-white/5 rounded transition-all"
            >»</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;