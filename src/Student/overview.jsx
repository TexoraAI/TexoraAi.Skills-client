

import React from "react";

const Overview = () => {
  return (
    <div className="p-6 space-y-4 bg-background">
      {/* Header */}
      <h1 className="text-2xl font-bold text-foreground">
        Overview
      </h1>

      <p className="text-sm text-muted-foreground">
        Quick summary of your learning progress, upcoming sessions and recent activity.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Courses in progress
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            4
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Upcoming sessions
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            3
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Certificates earned
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            1
          </p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
