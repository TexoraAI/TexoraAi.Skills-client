// src/Business/Settings.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const BusinessSettings = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-wide text-indigo-500 uppercase">
          Business
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Business Team Settings
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Configure team notifications and lead preferences.
        </p>
      </div>

      {/* Settings Card */}
      <Card className="bg-black text-white dark:bg-slate-900 border border-slate-700 max-w-3xl">
        <CardHeader>
          <CardTitle>Account & Notifications</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* ACCOUNT */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-200">
              Account Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Manager Name</Label>
                <Input
                  placeholder="Business manager"
                  className="bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <Label>Work Email</Label>
                <Input
                  type="email"
                  placeholder="manager@company.com"
                  className="bg-slate-950 border-slate-700 text-white"
                />
              </div>
            </div>
          </section>

          {/* LEAD ALERTS */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-200">
              Lead Alerts
            </h2>

            <div className="flex items-center justify-between">
              <Label className="text-sm text-slate-300">
                Notify on new leads
              </Label>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm text-slate-300">
                Notify on high-priority leads
              </Label>
              <Switch />
            </div>
          </section>

          {/* ACTION */}
          <div className="flex justify-end pt-4">
            <Button className="bg-emerald-600 hover:bg-emerald-500">
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessSettings;
