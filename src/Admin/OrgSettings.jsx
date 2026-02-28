// import React, { useState } from "react";
// import {
//   Users,
//   TrendingUp,
//   Mail,
//   ArrowUp,
//   ArrowDown,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// /* ================= MAIN ================= */

// const OrgSettings = () => {
//   // view | create | edit
//   const [mode, setMode] = useState("view");

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     timezone: "IST",
//     primaryColor: "#4F46E5",
//   });

//   const isReadOnly = mode === "view";

//   /* ---------- STATS ---------- */
//   const stats = [
//     {
//       label: "Active Users",
//       value: 0,
//       trend: "up",
//       change: "0%",
//       icon: Users,
//       gradient: "from-cyan-500 to-blue-600",
//     },
//     {
//       label: "Monthly Growth",
//       value: "0%",
//       trend: "down",
//       change: "0%",
//       icon: TrendingUp,
//       gradient: "from-indigo-500 to-purple-600",
//     },
//     {
//       label: "Support Emails",
//       value: 0,
//       trend: "up",
//       change: "0",
//       icon: Mail,
//       gradient: "from-emerald-500 to-teal-600",
//     },
//   ];

//   const onChange = (e) =>
//     setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

//   /* ---------- BUTTON HANDLERS ---------- */

//   const handleCreate = () => {
//     setFormData({
//       name: "",
//       email: "",
//       phone: "",
//       timezone: "IST",
//       primaryColor: "#4F46E5",
//     });
//     setMode("create");
//   };

//   const handleEdit = () => {
//     // yahan future me API se org data aa sakta hai
//     setMode("edit");
//   };

//   const handleCancel = () => {
//     setMode("view");
//   };

//   const handleDelete = () => {
//     if (confirm("Are you sure you want to delete this organisation?")) {
//       alert("Organisation deleted (UI only)");
//       setMode("view");
//     }
//   };

//   const onSave = (e) => {
//     e.preventDefault();
//     console.log("Saved Data:", formData);
//     alert(
//       mode === "create"
//         ? "Organisation created (UI only)"
//         : "Organisation updated (UI only)"
//     );
//     setMode("view");
//   };

//   return (
//     <div className="space-y-8">

//       {/* ================= HERO ================= */}
//       <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
//         <h1 className="text-3xl font-bold">Organisation Settings</h1>
//         <p className="mt-2 text-sm opacity-90">
//           Manage branding, configuration & organisation health
//         </p>
//         <div className="mt-3">
//           <Badge className="bg-white/20 text-white">
//             Current Mode: {mode.toUpperCase()}
//           </Badge>
//         </div>
//       </div>

//       {/* ================= STATS ================= */}
//       <div className="grid gap-6 md:grid-cols-3">
//         {stats.map((s) => {
//           const Icon = s.icon;
//           const Trend = s.trend === "up" ? ArrowUp : ArrowDown;

//           return (
//             <Card key={s.label} className="relative overflow-hidden">
//               <div
//                 className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-[0.06]`}
//               />
//               <CardContent className="relative p-6 space-y-3">
//                 <div className="flex items-center justify-between">
//                   <p className="text-xs uppercase text-muted-foreground">
//                     {s.label}
//                   </p>
//                   <div
//                     className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center`}
//                   >
//                     <Icon className="h-5 w-5 text-white" />
//                   </div>
//                 </div>

//                 <p className="text-3xl font-bold">{s.value}</p>

//                 <div className="flex items-center gap-1 text-xs">
//                   <Trend
//                     className={`h-3 w-3 ${
//                       s.trend === "up"
//                         ? "text-emerald-500"
//                         : "text-red-500"
//                     }`}
//                   />
//                   <span>{s.change}</span>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {/* ================= ACTION BUTTONS ================= */}
//       <div className="flex justify-end gap-3">
//         {mode !== "view" && (
//           <Button variant="secondary" onClick={handleCancel}>
//             Cancel
//           </Button>
//         )}

//         <Button className="bg-emerald-600" onClick={handleCreate}>
//           Create Org
//         </Button>

//         <Button className="bg-blue-600" onClick={handleEdit}>
//           Edit Org
//         </Button>

//         <Button variant="destructive" onClick={handleDelete}>
//           Delete Org
//         </Button>
//       </div>

//       {/* ================= FORM (ONLY WHEN NOT VIEW) ================= */}
//       {mode !== "view" && (
//         <form onSubmit={onSave} className="space-y-6">

//           {/* BASIC INFO */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-sm">Organisation Details</CardTitle>
//             </CardHeader>
//             <CardContent className="grid gap-4 md:grid-cols-2">
//               <Field
//                 label="Organisation Name"
//                 name="name"
//                 value={formData.name}
//                 onChange={onChange}
//               />
//               <Field
//                 label="Support Email"
//                 name="email"
//                 value={formData.email}
//                 onChange={onChange}
//               />
//               <Field
//                 label="Contact Number"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={onChange}
//               />

//               <div className="space-y-1">
//                 <label className="text-xs text-muted-foreground">
//                   Default Timezone
//                 </label>
//                 <Select
//                   value={formData.timezone}
//                   onValueChange={(v) =>
//                     setFormData((p) => ({ ...p, timezone: v }))
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="IST">IST</SelectItem>
//                     <SelectItem value="UTC">UTC</SelectItem>
//                     <SelectItem value="EST">EST</SelectItem>
//                     <SelectItem value="CET">CET</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardContent>
//           </Card>

//           {/* BRANDING */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-sm">Branding</CardTitle>
//             </CardHeader>
//             <CardContent className="grid md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <p className="text-xs text-muted-foreground">Logo Preview</p>
//                 <Avatar className="h-12 w-12">
//                   <AvatarFallback>ORG</AvatarFallback>
//                 </Avatar>
//                 <Badge variant="secondary">Upload later</Badge>
//               </div>

//               <Field
//                 label="Primary Color"
//                 name="primaryColor"
//                 value={formData.primaryColor}
//                 onChange={onChange}
//               />
//             </CardContent>
//           </Card>

//           {/* SAVE */}
//           <div className="flex justify-end">
//             <Button className="px-8 bg-indigo-600">
//               {mode === "create" ? "Create Organisation" : "Save Changes"}
//             </Button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// /* ================= FIELD ================= */
// const Field = ({ label, ...props }) => (
//   <div className="space-y-1">
//     <label className="text-xs text-muted-foreground">{label}</label>
//     <Input {...props} />
//   </div>
// );

// export default OrgSettings;










import React, { useState } from "react";
import {
  Users,
  TrendingUp,
  Mail,
  ArrowUp,
  ArrowDown,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/* ================= MAIN ================= */

const OrgSettings = () => {
  const [mode, setMode] = useState("view");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    timezone: "IST",
    primaryColor: "#4F46E5",
  });

  /* ---------- STATS ---------- */
  const stats = [
    {
      label: "Active Users",
      value: 0,
      trend: "up",
      change: "0%",
      icon: Users,
      gradient: "from-cyan-400 via-blue-500 to-indigo-500",
    },
    {
      label: "Monthly Growth",
      value: "0%",
      trend: "down",
      change: "0%",
      icon: TrendingUp,
      gradient: "from-blue-500 via-indigo-500 to-violet-500",
    },
    {
      label: "Support Emails",
      value: 0,
      trend: "up",
      change: "0",
      icon: Mail,
      gradient: "from-cyan-500 via-blue-500 to-indigo-600",
    },
  ];

  const onChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="space-y-6">

      {/* ================= HERO ================= */}
      <div className="rounded-3xl p-7 text-white shadow-lg
                      bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
        <h1 className="text-2xl font-bold">Organisation Settings</h1>
        <p className="mt-1 text-sm opacity-90">
          Manage branding, configuration & organisation health
        </p>

        <Badge className="mt-3 bg-white/20 text-white">
          Mode: {mode.toUpperCase()}
        </Badge>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          const Trend = s.trend === "up" ? ArrowUp : ArrowDown;

          return (
            <Card key={s.label} className="relative overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-10`}
              />
              <CardContent className="relative p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase text-muted-foreground">
                    {s.label}
                  </p>
                  <div
                    className={`h-9 w-9 rounded-lg bg-gradient-to-br ${s.gradient}
                                flex items-center justify-center`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </div>

                <p className="text-2xl font-bold">{s.value}</p>

                <div className="flex items-center gap-1 text-xs">
                  <Trend
                    className={`h-3 w-3 ${
                      s.trend === "up"
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  />
                  <span>{s.change}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-end gap-2">
        {mode !== "view" && (
          <Button variant="secondary" onClick={() => setMode("view")}>
            Cancel
          </Button>
        )}

        <Button
          className="bg-gradient-to-r from-cyan-500 to-blue-600"
          onClick={() => setMode("create")}
        >
          Create Org
        </Button>

        <Button
          className="bg-gradient-to-r from-blue-500 to-indigo-600"
          onClick={() => setMode("edit")}
        >
          Edit Org
        </Button>

        <Button variant="destructive">Delete Org</Button>
      </div>

      {/* ================= FORM ================= */}
      {mode !== "view" && (
        <form className="space-y-5">

          {/* BASIC INFO */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Organisation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Field label="Organisation Name" name="name" value={formData.name} onChange={onChange} />
              <Field label="Support Email" name="email" value={formData.email} onChange={onChange} />
              <Field label="Contact Number" name="phone" value={formData.phone} onChange={onChange} />

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  Default Timezone
                </label>
                <Select
                  value={formData.timezone}
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, timezone: v }))
                  }
                >
                  <SelectTrigger />
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
              />
            </CardContent>
          </Card>

          {/* SAVE */}
          <div className="flex justify-end">
            <Button className="px-8 bg-gradient-to-r from-indigo-500 to-violet-600">
              {mode === "create" ? "Create Organisation" : "Save Changes"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

/* ================= FIELD ================= */
const Field = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs text-muted-foreground">{label}</label>
    <Input {...props} />
  </div>
);

export default OrgSettings;
