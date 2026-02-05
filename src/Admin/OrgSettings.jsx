
// // src/Admin/OrgSettings.jsx
// import React, { useState } from "react";

// const OrgSettings = () => {
//   // Mode state (view | create | edit)
//   const [mode, setMode] = useState("view");

//   // Form state
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     timezone: "IST",
//     logo: null,
//     primaryColor: "#4F46E5",
//   });

//   const isReadOnly = mode === "view";

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle logo upload
//   const handleLogoUpload = (e) => {
//     const file = e.target.files[0];
//     setFormData((prev) => ({ ...prev, logo: file }));
//   };

//   // Handle save/update
//   const handleSave = (e) => {
//     e.preventDefault();

//     if (mode === "create") {
//       // TODO: API call to create org
//       console.log("Creating organization:", formData);
//       alert("Organisation created successfully!");
//     } else if (mode === "edit") {
//       // TODO: API call to update org
//       console.log("Updating organization:", formData);
//       alert("Settings updated successfully!");
//     } else {
//       // view mode (do nothing)
//       return;
//     }

//     setMode("view");
//   };

//   // Create new org (same page)
//   const handleCreate = () => {
//     setFormData({
//       name: "",
//       email: "",
//       phone: "",
//       timezone: "IST",
//       logo: null,
//       primaryColor: "#4F46E5",
//     });
//     setMode("create");
//   };

//   // Edit org (same page)
//   const handleEdit = () => {
//     setMode("edit");
//   };

//   // Cancel create/edit
//   const handleCancel = () => {
//     setMode("view");
//   };

//   // Handle delete
//   const handleDelete = () => {
//     if (window.confirm("Are you sure you want to delete this organization?")) {
//       // TODO: API call to delete
//       console.log("Deleting organization");
//       alert("Organization deleted!");
//       setMode("view");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Page header */}
//       <div>
//         <h1 className="text-xl font-semibold text-slate-100">
//           Organisation settings
//         </h1>
//         <p className="mt-1 text-sm text-slate-400">
//           Manage institute name, branding, contact details and global
//           configuration for your LMS.
//         </p>
//       </div>

//       {/* Action buttons */}
//       <div className="flex gap-3 justify-end">
//         {mode !== "view" && (
//           <button
//             onClick={handleCancel}
//             className="px-4 py-2 rounded-md bg-slate-700 text-sm font-medium text-white hover:bg-slate-600"
//           >
//             Cancel
//           </button>
//         )}

//         <button
//           onClick={handleCreate}
//           className="px-4 py-2 rounded-md bg-green-600 text-sm font-medium text-white hover:bg-green-500"
//         >
//           Create New Org
//         </button>

//         <button
//           onClick={handleEdit}
//           className="px-4 py-2 rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-500"
//         >
//           Edit Org
//         </button>

//         <button
//           onClick={handleDelete}
//           className="px-4 py-2 rounded-md bg-red-600 text-sm font-medium text-white hover:bg-red-500"
//         >
//           Delete Org
//         </button>
//       </div>

//       {/* Basic info card */}
//       <form onSubmit={handleSave}>
//         <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
//           <h2 className="text-sm font-semibold text-slate-100">Basic info</h2>
//           <div className="grid gap-4 md:grid-cols-2 text-sm">
//             <div className="space-y-1">
//               <label className="text-xs text-slate-400">
//                 Organisation name
//               </label>
//               <input
//                 name="name"
//                 type="text"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 placeholder="Your institute / company name"
//                 disabled={isReadOnly}
//                 className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-60"
//                 required
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs text-slate-400">Support email</label>
//               <input
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 placeholder="support@example.com"
//                 disabled={isReadOnly}
//                 className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-60"
//                 required
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs text-slate-400">Contact number</label>
//               <input
//                 name="phone"
//                 type="text"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 placeholder="+91-98765 43210"
//                 disabled={isReadOnly}
//                 className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-60"
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs text-slate-400">Default timezone</label>
//               <select
//                 name="timezone"
//                 value={formData.timezone}
//                 onChange={handleInputChange}
//                 disabled={isReadOnly}
//                 className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-60"
//               >
//                 <option value="IST">IST (UTC+5:30)</option>
//                 <option value="UTC">UTC</option>
//                 <option value="EST">EST (UTC-5)</option>
//                 <option value="CET">CET (UTC+1)</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Branding card */}
//         <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
//           <h2 className="text-sm font-semibold text-slate-100">Branding</h2>
//           <p className="text-xs text-slate-400">
//             Control how your LMS looks for all users.
//           </p>

//           <div className="grid gap-4 md:grid-cols-2 text-sm">
//             <div className="space-y-2">
//               <p className="text-xs text-slate-400">Logo</p>
//               <div className="flex items-center gap-3">
//                 <div className="h-12 w-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
//                   {formData.logo ? "Logo" : "Logo"}
//                 </div>

//                 <input
//                   type="file"
//                   onChange={handleLogoUpload}
//                   className="hidden"
//                   id="logo-upload"
//                   accept="image/*"
//                   disabled={isReadOnly}
//                 />

//                 <label
//                   htmlFor="logo-upload"
//                   className={`px-3 py-1.5 rounded-md bg-slate-800 text-xs text-slate-100 hover:bg-slate-700 cursor-pointer ${
//                     isReadOnly ? "opacity-60 pointer-events-none" : ""
//                   }`}
//                 >
//                   Upload logo
//                 </label>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <p className="text-xs text-slate-400">Primary color</p>
//               <div className="flex items-center gap-3">
//                 <div
//                   className="h-8 w-8 rounded-full"
//                   style={{ backgroundColor: formData.primaryColor }}
//                 />
//                 <input
//                   name="primaryColor"
//                   type="text"
//                   value={formData.primaryColor}
//                   onChange={handleInputChange}
//                   placeholder="#4F46E5"
//                   disabled={isReadOnly}
//                   className="flex-1 rounded-md bg-slate-950 border border-slate-700 px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-60"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Save button */}
//         {mode !== "view" && (
//           <div className="flex justify-end pt-4">
//             <button
//               type="submit"
//               className="px-8 py-2.5 rounded-lg bg-violet-600 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
//             >
//               Save changes
//             </button>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default OrgSettings;




import React, { useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  Users,
  TrendingUp,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const OrgSettings = () => {
  const [mode, setMode] = useState("view");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    timezone: "IST",
    primaryColor: "#4F46E5",
  });

  const isReadOnly = mode === "view";

  /* ---------- STATS (0 STATE) ---------- */
  const stats = [
    {
      label: "Active Users",
      value: 0,
      trend: "up",
      change: "0%",
      icon: Users,
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      label: "Monthly Growth",
      value: "0%",
      trend: "down",
      change: "0%",
      icon: TrendingUp,
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      label: "Support Emails",
      value: 0,
      trend: "up",
      change: "0",
      icon: Mail,
      gradient: "from-emerald-500 to-teal-600",
    },
  ];

  const onChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSave = (e) => {
    e.preventDefault();
    console.log(formData);
    setMode("view");
  };

  return (
    <div className="space-y-8">
      {/* HERO (tweakcn gradient) */}
      <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
        <h1 className="text-3xl font-bold">Organisation Settings</h1>
        <p className="mt-2 text-sm opacity-90">
          Manage branding, configuration & organisation health
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          const Trend = s.trend === "up" ? ArrowUp : ArrowDown;

          return (
            <Card
              key={s.label}
              className="relative overflow-hidden hover:shadow-lg transition"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-[0.06]`}
              />
              <CardContent className="relative p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase text-muted-foreground">
                    {s.label}
                  </p>
                  <div
                    className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>

                <p className="text-3xl font-bold">{s.value}</p>

                <div className="flex items-center gap-1 text-xs">
                  <Trend
                    className={`h-3 w-3 ${
                      s.trend === "up"
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  />
                  <span
                    className={
                      s.trend === "up"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }
                  >
                    {s.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        {mode !== "view" && (
          <Button variant="secondary" onClick={() => setMode("view")}>
            Cancel
          </Button>
        )}
        <Button
          className="bg-emerald-600 hover:bg-emerald-500"
          onClick={() => setMode("create")}
        >
          Create Org
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-500"
          onClick={() => setMode("edit")}
        >
          Edit Org
        </Button>
        <Button variant="destructive">Delete Org</Button>
      </div>

      {/* FORM */}
      <form onSubmit={onSave} className="space-y-6">
        {/* BASIC INFO */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field
              label="Organisation Name"
              name="name"
              value={formData.name}
              onChange={onChange}
              disabled={isReadOnly}
            />
            <Field
              label="Support Email"
              name="email"
              value={formData.email}
              onChange={onChange}
              disabled={isReadOnly}
            />
            <Field
              label="Contact Number"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              disabled={isReadOnly}
            />

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">
                Default Timezone
              </label>
              <Select
                value={formData.timezone}
                onValueChange={(v) =>
                  setFormData((p) => ({ ...p, timezone: v }))
                }
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IST">IST</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">EST</SelectItem>
                  <SelectItem value="CET">CET</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* BRANDING */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Branding</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Logo Preview</p>
              <Avatar className="h-12 w-12">
                <AvatarFallback>ORG</AvatarFallback>
              </Avatar>
              <Badge variant="secondary">Upload later</Badge>
            </div>

            <Field
              label="Primary Color"
              name="primaryColor"
              value={formData.primaryColor}
              onChange={onChange}
              disabled={isReadOnly}
            />
          </CardContent>
        </Card>

        {/* SAVE */}
        {mode !== "view" && (
          <div className="flex justify-end">
            <Button className="px-8 bg-indigo-600 hover:bg-indigo-500">
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

/* ---------- SMALL HELPERS ---------- */

const Field = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs text-muted-foreground">{label}</label>
    <Input {...props} />
  </div>
);

export default OrgSettings;
