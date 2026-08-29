import { useEffect, useState } from "react";
import roadmapService from "../../services/roadmapService";
import { formatPathType } from "./RoadmapUpgradedDashboard";

/**
 * Renders GET /admin/stats (role="admin") or GET /super-admin/stats
 * (role="superadmin"). Both return usage numbers only — this is visibility,
 * not a gatekeeping/approval UI (there is no approve/reject endpoint on the
 * backend at all).
 */
export default function StatsPanel({ role }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetcher = role === "superadmin" ? roadmapService.getSuperAdminStats : roadmapService.getAdminStats;
    fetcher()
      .then((data) => !cancelled && setStats(data))
      .catch((err) => !cancelled && setError(err.message || "Couldn't load usage stats."));
    return () => {
      cancelled = true;
    };
  }, [role]);

  if (error) return <div className="ru-error" style={{ marginTop: 22 }}>{error}</div>;
  if (!stats) return <div className="ru-loading">Loading usage stats…</div>;

  return role === "superadmin" ? (
    <SuperAdminStats stats={stats} />
  ) : (
    <AdminStats stats={stats} />
  );
}

function AdminStats({ stats }) {
  const maxBreakdown = Math.max(1, ...Object.values(stats.pathTypeBreakdown || {}));
  return (
    <div>
      <div className="ru-stat-row" style={{ marginTop: 34 }}>
        <div className="ru-stat-box"><div className="ru-num">{stats.totalRoadmapsInOrg ?? 0}</div><div className="ru-lbl">Org-wide roadmaps</div></div>
        <div className="ru-stat-box"><div className="ru-num">{stats.totalStudentsInOrg ?? 0}</div><div className="ru-lbl">Students generating</div></div>
        <div className="ru-stat-box"><div className="ru-num">{stats.totalTrainersInOrg ?? 0}</div><div className="ru-lbl">Trainers generating</div></div>
      </div>
      <div className="ru-admin-panel-row">
        <PathTypeBreakdownCard breakdown={stats.pathTypeBreakdown} maxVal={maxBreakdown} />
        <UsageTableCard title="Top students by usage" rows={stats.topStudentsByUsage} />
        <UsageTableCard title="Top trainers by usage" rows={stats.topTrainersByUsage} />
      </div>
    </div>
  );
}

function SuperAdminStats({ stats }) {
  return (
    <div>
      <div className="ru-stat-row" style={{ marginTop: 34 }}>
        <div className="ru-stat-box"><div className="ru-num">{stats.totalOrganizations ?? 0}</div><div className="ru-lbl">Organizations</div></div>
        <div className="ru-stat-box"><div className="ru-num">{stats.totalRoadmapsPlatformWide ?? 0}</div><div className="ru-lbl">Roadmaps platform-wide</div></div>
      </div>

      <div className="ru-admin-panel-row">
        <UsageTableCard title="Top users platform-wide" rows={stats.topUsersPlatformWide} showOrg />
        <UsageTableCard title="Top students (no org)" rows={stats.nullOrgStudents} />
        <UsageTableCard title="Top trainers (no org)" rows={stats.nullOrgTrainers} />
      </div>

      <h3 style={{ marginTop: 34, marginBottom: 6, fontSize: "1.1rem" }}>Per-organization breakdown</h3>
      {(stats.perOrgBreakdown || []).length === 0 && (
        <div className="ru-empty-state">No organizations with roadmap activity yet.</div>
      )}
      {(stats.perOrgBreakdown || []).map((org) => (
        <div key={org.organizationId} className="ru-panel" style={{ marginTop: 16 }}>
          <h3 style={{ fontSize: "1rem" }}>{org.organizationId}</h3>
          <div className="ru-sub" style={{ marginBottom: 12 }}>
            {org.totalRoadmapsInOrg ?? 0} roadmaps · {org.totalStudentsInOrg ?? 0} students · {org.totalTrainersInOrg ?? 0} trainers
          </div>
          <AdminStats stats={org} />
        </div>
      ))}
    </div>
  );
}

function PathTypeBreakdownCard({ breakdown, maxVal }) {
  const entries = Object.entries(breakdown || {});
  return (
    <div className="ru-admin-stat">
      <h4>Path type breakdown</h4>
      {entries.length === 0 && <div className="ru-mh-sub">No data yet.</div>}
      {entries.map(([pathType, count]) => (
        <div className="ru-bar-row" key={pathType}>
          <div className="ru-bar-label">{formatPathType(pathType)}</div>
          <div className="ru-bar-track"><div className="ru-bar-fill" style={{ width: `${(count / maxVal) * 100}%` }} /></div>
          <div className="ru-bar-val">{count}</div>
        </div>
      ))}
    </div>
  );
}

function UsageTableCard({ title, rows, showOrg = false }) {
  return (
    <div className="ru-admin-stat">
      <h4>{title}</h4>
      {(!rows || rows.length === 0) ? (
        <div className="ru-mh-sub">No data yet.</div>
      ) : (
        <table className="ru-usage-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              {showOrg && <th>Org</th>}
              <th>Roadmaps</th>
              <th>Avg %</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.userId}>
                <td>{u.userName || `#${u.userId}`}</td>
                <td>{u.role}</td>
                {showOrg && <td>{u.organizationId || "—"}</td>}
                <td>{u.roadmapsGenerated}</td>
                <td>{Math.round(u.avgCompletionPercent || 0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
