// // src/Admin/OrgReports.jsx
// import React from "react";

// const OrgReports = () => {
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-xl font-semibold text-slate-100">
//           Organisation reports
//         </h1>
//         <p className="mt-1 text-sm text-slate-400">
//           Download high‑level reports for management and stakeholders.
//         </p>
//       </div>

//       {/* Quick filters */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <div className="flex gap-2">
//           <select className="rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500">
//             <option>Last 30 days</option>
//             <option>Last 90 days</option>
//             <option>This year</option>
//           </select>
//           <select className="rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500">
//             <option>All types</option>
//             <option>Enrollment</option>
//             <option>Completion</option>
//             <option>Revenue</option>
//           </select>
//         </div>
//         <button className="px-4 py-2 rounded-md bg-violet-600 text-sm font-medium text-white hover:bg-violet-500">
//           + Create custom report
//         </button>
//       </div>

//       {/* Reports list placeholder */}
//       <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
//         <div className="flex text-xs font-semibold text-slate-400 border-b border-slate-800 pb-2 mb-3">
//           <div className="w-2/6">Report name</div>
//           <div className="w-2/6">Type</div>
//           <div className="w-1/6">Format</div>
//           <div className="w-1/6 text-right">Actions</div>
//         </div>

//         <p className="text-sm text-slate-400">
          
//         </p>
//       </div>
//     </div>
//   );
// };

// export default OrgReports;




// src/Admin/OrgReports.jsx
import React, { useState } from "react";
import { BarChart3, Plus, Download, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/* ===== DUMMY DATA (BACKEND READY) ===== */
const reports = [];

const OrgReports = () => {
  const [period, setPeriod] = useState("30");
  const [type, setType] = useState("all");

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
        <h1 className="text-3xl font-bold">Organisation Reports</h1>
        <p className="mt-2 text-sm opacity-90">
          Download high-level insights for management & stakeholders
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">This year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="enrollment">Enrollment</SelectItem>
              <SelectItem value="completion">Completion</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="bg-indigo-600 hover:bg-indigo-500">
          <Plus className="h-4 w-4 mr-2" />
          Create Custom Report
        </Button>
      </div>

      {/* REPORT LIST */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Generated Reports</CardTitle>
        </CardHeader>

        <CardContent>
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <BarChart3 className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-sm">No reports generated yet</p>
              <p className="text-xs">
                Reports created by admins will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border p-4 hover:shadow-sm transition"
                >
                  <div>
                    <p className="font-medium">{r.name}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{r.type}</Badge>
                      <Badge variant="secondary">{r.format}</Badge>
                    </div>
                  </div>

                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* INFO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            About Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Reports can be generated in CSV / Excel / PDF formats
            and shared with management and stakeholders.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgReports;
