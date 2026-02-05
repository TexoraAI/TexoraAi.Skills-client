// src/Business/Marketing/Campaigns.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Campaigns = () => {
  // 🔒 Backend se aayega
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔜 REAL API CALL
    // marketingService.getCampaigns().then(res => setCampaigns(res.data))
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Campaigns
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Track marketing campaigns and generated leads
        </p>
      </div>

      {/* Card */}
      <Card className="bg-black text-white dark:bg-slate-900 border border-slate-700">
        <CardHeader>
          <CardTitle>Marketing Campaigns</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-400">Loading campaigns...</p>
          ) : campaigns.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium">
                No campaigns created
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Campaigns will appear here once you launch them.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.channel}</p>
                  </div>

                  <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    {c.leads} leads
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Campaigns;
