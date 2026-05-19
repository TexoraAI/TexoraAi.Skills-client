import React from "react";

const PageHeader = ({ title, subtitle, actions, badge }) => (
  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        {badge !== undefined && (
          <span className="bg-violet-500/15 text-violet-400 text-xs font-bold px-2.5 py-1 rounded-full border border-violet-500/20">
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeader;