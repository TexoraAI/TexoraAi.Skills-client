// src/Admin/OrgReports.jsx
import React, { useState } from "react";
import {
  BarChart3,
  Plus,
  Download,
  FileText,
  X,
} from "lucide-react";

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
import { Input } from "@/components/ui/input";

/* ===== DUMMY DATA ===== */
const reports = [];

const OrgReports = () => {
  const [period, setPeriod] = useState("30");
  const [type, setType] = useState("all");
  const [open, setOpen] = useState(false);

  /* HERO / PRIMARY BUTTON */
  const primaryBtn =
    "h-8 px-3 text-sm bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white hover:opacity-90";

  /* SELECT DROPDOWN FIX (LIGHT + DARK) */
  const selectContentClass = `
    z-50 bg-white text-slate-900
    border border-slate-200 shadow-md
    dark:bg-slate-900 dark:text-slate-100
    dark:border-slate-700
  `;

  return (
    <div className="space-y-6">
      {/* HERO */}
      <div className="rounded-2xl px-6 py-5 text-white shadow-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
        <h1 className="text-2xl font-semibold">
          Organisation Reports
        </h1>
        <p className="mt-1 text-sm opacity-90">
          Download insights for management & stakeholders
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-8 w-36 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">This year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-8 w-40 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="enrollment">Enrollment</SelectItem>
              <SelectItem value="completion">Completion</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className={primaryBtn} onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Create Report
        </Button>
      </div>

      {/* REPORT LIST */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm">
            Generated Reports
          </CardTitle>
        </CardHeader>

        <CardContent>
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <BarChart3 className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm">No reports generated</p>
              <p className="text-xs">
                Reports will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{r.type}</Badge>
                      <Badge variant="secondary">{r.format}</Badge>
                    </div>
                  </div>

                  <Button size="sm" className={primaryBtn}>
                    <Download className="h-4 w-4 mr-1" />
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
        <CardHeader className="py-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            About Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Reports can be generated in CSV / Excel / PDF formats
            and shared with stakeholders.
          </p>
        </CardContent>
      </Card>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-slate-900 p-5 space-y-3">
            <h3 className="text-base font-semibold">
              Create Custom Report
            </h3>

            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-900"
            >
              <X className="h-4 w-4" />
            </button>

            <Input className="h-8 text-sm" placeholder="Report Name" />
            <Input className="h-8 text-sm" placeholder="Description (optional)" />

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" className={primaryBtn}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgReports;
