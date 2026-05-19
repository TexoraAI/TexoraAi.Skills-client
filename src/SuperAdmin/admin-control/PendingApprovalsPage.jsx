import React from "react";
import { useUserManagement } from "../context/UserManagementContext";
import { USER_STATUS } from "../constants/permissions";
import { useTheme } from "../context/ThemeContext";
import { StatusBadge } from "../common/UserTable";
import PageHeader from "../common/PageHeader";

const PendingApprovalsPage = () => {
  const { pendingApprovals, approveUser, rejectUser } = useUserManagement();
  const { dark } = useTheme();

  const cardBg    = dark ? "bg-white/[0.03] border-white/8 hover:bg-white/[0.05]" : "bg-gray-50 border-gray-200 hover:bg-gray-100";
  const emptyBg   = dark ? "bg-white/[0.02] border-white/8"                        : "bg-gray-50 border-gray-200";
  const titleText = dark ? "text-white"                                             : "text-gray-800";
  const emailText = dark ? "text-slate-400"                                         : "text-gray-500";
  const dateText  = dark ? "text-slate-500"                                         : "text-gray-400";

  return (
    <div>
      <PageHeader
        title={<span style={{ color: dark ? "#f1f5f9" : "#0f172a" }}>Pending Approvals</span>}
        subtitle="Review and approve new trainer and student applications"
        badge={pendingApprovals.length}
      />

      {pendingApprovals.length === 0 ? (
        <div className={`rounded-xl border p-16 text-center ${emptyBg}`}>
          <div className="text-5xl mb-4">✅</div>
          <p className={`font-semibold ${titleText}`}>All caught up!</p>
          <p className={`text-sm mt-1 ${emailText}`}>No pending approvals at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingApprovals.map((user) => (
            <div
              key={user.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${cardBg}`}
            >
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500/60 to-orange-600/60 flex items-center justify-center text-white font-bold shrink-0 text-base">
                {user.name[0]}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-semibold ${titleText}`}>{user.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize border border-amber-500/20 ${
                    dark ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600"
                  }`}>
                    {user.role}
                  </span>
                  <StatusBadge status={USER_STATUS.PENDING} />
                </div>
                <p className={`text-sm mt-0.5 ${emailText}`}>{user.email}</p>
                <p className={`text-xs mt-1 ${dateText}`}>
                  Applied: {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString("en-IN") : "Recently"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => rejectUser(user.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                    dark
                      ? "text-red-400 hover:text-white hover:bg-red-500/15 border-red-500/20 hover:border-red-500/40"
                      : "text-red-500 hover:text-white hover:bg-red-500 border-red-300"
                  }`}
                >
                  Reject
                </button>
                <button
                  onClick={() => approveUser(user.id)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-all"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingApprovalsPage;