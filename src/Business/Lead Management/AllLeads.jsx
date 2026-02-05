import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AllLeads = () => {
  // 🔒 Backend se aayega
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔜 REAL API CALL
    // leadService.getLeads().then(res => setLeads(res.data))
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          All Leads
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Track and manage all incoming leads
        </p>
      </div>

      {/* Card */}
      <Card className="bg-black text-white dark:bg-slate-900 border border-slate-700">
        <CardHeader>
          <CardTitle>Leads Overview</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-400">Loading leads...</p>
          ) : leads.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium">
                No leads available
              </p>
              <p className="mt-1 text-xs text-slate-400">
                New leads will appear here once captured.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-2 text-left">Name</th>
                    <th className="py-2 text-left">Source</th>
                    <th className="py-2 text-left">Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr
                      key={l.id}
                      className="border-b border-slate-800 last:border-0"
                    >
                      <td className="py-2 font-medium">{l.name}</td>
                      <td className="py-2 text-slate-400">{l.source}</td>
                      <td className="py-2">
                        <Badge variant="secondary">{l.stage}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllLeads;
