import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

/**
 * SuperAdmin → Business Dashboard Control
 * Purpose:
 * Control existing Business dashboard pages/modules
 * (ON / OFF only – no CRUD here)
 */

const modulesList = [
  {
    key: "overview",
    title: "Dashboard Overview",
    description: "Main overview page for business team",
  },
  {
    key: "leads",
    title: "Leads Management",
    description: "Access to leads & follow-ups",
  },
  {
    key: "enrollments",
    title: "Enrollments",
    description: "New enrollments and renewals",
  },
  {
    key: "finance",
    title: "Finance",
    description: "Invoices, payments & revenue",
  },
  {
    key: "marketing",
    title: "Marketing",
    description: "Campaigns and promotions",
  },
  {
    key: "reports",
    title: "Reports",
    description: "Business performance reports",
  },
];

const BusinessDashboardControl = () => {
  const [modules, setModules] = useState({
    overview: true,
    leads: true,
    enrollments: true,
    finance: false,
    marketing: false,
    reports: true,
  });

  const toggleModule = (key) => {
    setModules((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    console.log("Business Dashboard Settings:", modules);
    alert("Business dashboard settings saved successfully!");
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Business Dashboard Control
        </h1>
        <p className="text-sm text-gray-500">
          Enable or disable Business Team dashboard modules
        </p>
      </div>

      {/* Modules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modulesList.map((module) => (
          <Card
            key={module.key}
            className="p-5 flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium">{module.title}</h3>
              <p className="text-sm text-gray-500">
                {module.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-medium ${
                  modules[module.key]
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {modules[module.key] ? "Enabled" : "Disabled"}
              </span>

              <Switch
                checked={modules[module.key]}
                onCheckedChange={() => toggleModule(module.key)}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-6">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default BusinessDashboardControl;
