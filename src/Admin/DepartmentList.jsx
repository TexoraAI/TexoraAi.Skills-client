
// import React, { useState } from "react";
// import { Plus, Trash2, Pencil } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// /* ================= MAIN ================= */

// const DepartmentList = () => {
//   const [departments, setDepartments] = useState([
//     { id: 1, name: "Engineering", head: "Rohit Sharma", status: "Active" },
//     { id: 2, name: "Human Resources", head: "Anjali Verma", status: "Active" },
//   ]);

//   const [search, setSearch] = useState("");
//   const [open, setOpen] = useState(false);
//   const [mode, setMode] = useState("create");
//   const [currentId, setCurrentId] = useState(null);

//   const [form, setForm] = useState({
//     name: "",
//     head: "",
//     status: "Active",
//   });

//   const filteredDepartments = departments.filter((d) =>
//     d.name.toLowerCase().includes(search.toLowerCase())
//   );

//   /* ---------- HANDLERS ---------- */

//   const handleAdd = () => {
//     setMode("create");
//     setForm({ name: "", head: "", status: "Active" });
//     setOpen(true);
//   };

//   const handleEdit = (dept) => {
//     setMode("edit");
//     setCurrentId(dept.id);
//     setForm(dept);
//     setOpen(true);
//   };

//   const handleSave = () => {
//     if (!form.name || !form.head) return alert("Please fill all fields");

//     if (mode === "create") {
//       setDepartments((p) => [...p, { ...form, id: Date.now() }]);
//     } else {
//       setDepartments((p) =>
//         p.map((d) => (d.id === currentId ? { ...form, id: currentId } : d))
//       );
//     }
//     setOpen(false);
//   };

//   const handleDelete = (id) => {
//     if (confirm("Delete this department?")) {
//       setDepartments((p) => p.filter((d) => d.id !== id));
//     }
//   };

//   return (
//     <div
//       className="space-y-6 min-h-screen p-6 rounded-xl
//       bg-slate-50 text-slate-900
//       dark:bg-gradient-to-br dark:from-[#05070d] dark:to-[#0b1220] dark:text-white"
//     >
//       {/* ================= HERO ================= */}
//       <div className="rounded-2xl p-6 text-white shadow-lg
//         bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
//         <h1 className="text-2xl font-bold">Departments</h1>
//         <p className="mt-1 text-sm opacity-90">
//           Manage organisational departments and leadership
//         </p>
//       </div>

//       {/* ================= ACTION BAR ================= */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <Button
//           className="bg-gradient-to-r from-cyan-500 to-blue-600 h-9 px-4"
//           onClick={handleAdd}
//         >
//           <Plus className="h-4 w-4 mr-1.5" />
//           Add Department
//         </Button>
        
        
//         <Input
//           placeholder="Search departments..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="md:w-56 h-9"
//         />
//       </div>

//       {/* ================= TABLE ================= */}
//       <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
//         <CardHeader className="py-3">
//           <CardTitle className="text-sm">Department List</CardTitle>
//         </CardHeader>

//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow className="text-xs">
//                 <TableHead>Department</TableHead>
//                 <TableHead>Head</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {filteredDepartments.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={4} className="text-center py-6 text-sm">
//                     No departments found
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredDepartments.map((dept) => (
//                   <TableRow key={dept.id} className="text-sm">
//                     <TableCell className="font-medium">
//                       {dept.name}
//                     </TableCell>

//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <Avatar className="h-7 w-7">
//                           <AvatarFallback className="text-xs">
//                             {dept.head
//                               .split(" ")
//                               .map((n) => n[0])
//                               .join("")}
//                           </AvatarFallback>
//                         </Avatar>
//                         <span>{dept.head}</span>
//                       </div>
//                     </TableCell>

//                     <TableCell>
//                       <Badge variant="secondary" className="text-xs">
//                         {dept.status}
//                       </Badge>
//                     </TableCell>

//                     <TableCell className="text-right space-x-1">
//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={() => handleEdit(dept)}
//                       >
//                         <Pencil className="h-4 w-4 text-blue-600" />
//                       </Button>
//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={() => handleDelete(dept.id)}
//                       >
//                         <Trash2 className="h-4 w-4 text-red-500" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* ================= MODAL ================= */}
//       {open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center
//           bg-black/60 backdrop-blur-sm">

//           <div
//             className="w-full max-w-sm rounded-2xl p-5 space-y-3
//             bg-white dark:bg-slate-950
//             border border-slate-200 dark:border-slate-800 shadow-xl"
//           >
//             <h2 className="text-base font-semibold">
//               {mode === "create" ? "Add Department" : "Edit Department"}
//             </h2>

//             <Input
//               placeholder="Department name"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//             />

//             <Input
//               placeholder="Department head"
//               value={form.head}
//               onChange={(e) => setForm({ ...form, head: e.target.value })}
//             />

//             <div className="flex justify-end gap-2 pt-2">
//               <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 size="sm"
//                 className="bg-gradient-to-r from-blue-500 to-indigo-600"
//                 onClick={handleSave}
//               >
//                 Save
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DepartmentList;




















// import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// /* ================= MAIN ================= */

// const DepartmentList = () => {
//   const navigate = useNavigate();
//   const [departments, setDepartments] = useState([]);
//   const [departmentOptions, setDepartmentOptions] = useState([
//     "Engineering",
//     "Human Resources",
//     "Marketing",
//     "Finance",
//     "Sales",
//     "Customer Support",
//     "IT Services",
//     "Product Management",
//     "Operations",
//     "Research & Development",
//     "Legal",
//     "Procurement",
//     "Quality Assurance",
//     "Administration",
//     "Public Relations",
//     "Business Development",
//     "Security",
//     "Training & Development",
//     "Logistics",
//     "Data Analytics",
//     "Content Management",
//     "Design",
//     "Compliance",
//     "Technical Support",
//     "Strategy & Planning"
//   ]);
//   const [activeTab, setActiveTab] = useState("departments");
//   const [search, setSearch] = useState("");
//   const [open, setOpen] = useState(false);
//   const [mode, setMode] = useState("create");
//   const [currentId, setCurrentId] = useState(null);

//   const [form, setForm] = useState({
//     name: "",
//     head: "",
//     status: "Active",
//   });

//   const filteredDepartments = departments.filter((d) =>
//     d.name.toLowerCase().includes(search.toLowerCase())
//   );

//   /* ---------- HANDLERS ---------- */

//   const handleAdd = () => {
//     setMode("create");
//     setForm({ name: "", head: "", status: "Active" });
//     setOpen(true);
//   };

//   const handleEdit = (dept) => {
//     setMode("edit");
//     setCurrentId(dept.id);
//     setForm(dept);
//     setOpen(true);
//   };

//   const handleSave = () => {
//     if (!form.name || !form.head) return alert("Please fill all fields");

//     if (mode === "create") {
//       setDepartments((p) => [...p, { ...form, id: Date.now() }]);
//     } else {
//       setDepartments((p) =>
//         p.map((d) => (d.id === currentId ? { ...form, id: currentId } : d))
//       );
//     }
//     setOpen(false);
//   };

//   const handleDelete = (id) => {
//     if (confirm("Delete this department?")) {
//       setDepartments((p) => p.filter((d) => d.id !== id));
//     }
//   };
//   const handleAddDepartmentOption = () => {
//     const newDept = prompt("Enter new department name");
  
//     if (newDept && newDept.trim()) {
//       setDepartmentOptions((prev) => [...prev, newDept]);
//       setForm({ ...form, name: newDept });
//     }
//   };

//   return (
//     <div
//       className="space-y-6 min-h-screen p-6 rounded-xl
//       bg-slate-50 text-slate-900
//       dark:bg-gradient-to-br dark:from-[#05070d] dark:to-[#0b1220] dark:text-white"
//     >
     
//       {/* ================= HERO ================= */}
// <div className="rounded-2xl p-6 text-white shadow-lg
// bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">

// <div className="flex items-center gap-3">

// <Button
//   variant="ghost"
//   className="text-white hover:bg-white/20"
//   onClick={() => navigate(-1)}
// >
//   <ArrowLeft className="w-5 h-5 mr-1" />
//   Back
// </Button>

// <div>
//   <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
//   <p className="mt-1 text-sm opacity-90">
//     Manage organisational departments and leadership
//   </p>
// </div>

// </div>

// </div>

//      {/* ================= ACTION BAR ================= */}
// <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

// <div className="flex gap-2">

// <Button
//   className={`${
//     location.pathname === "/admin/departmentlist"
//       ? "bg-blue-600 text-white"
//       : "bg-gray-200 text-black"
//   }`}
//   onClick={() => navigate("/admin/departmentlist")}
// >
//   Departments
// </Button>

// <Button
//   className={`${
//     location.pathname === "/admin/branches"
//       ? "bg-blue-600 text-white"
//       : "bg-gray-200 text-black"
//   }`}
//   onClick={() => navigate("/admin/branches")}
// >
//   Branches
// </Button>

// <Button
//   className={`${
//     location.pathname === "/admin/batches"
//       ? "bg-blue-600 text-white"
//       : "bg-gray-200 text-black"
//   }`}
//   onClick={() => navigate("/admin/batches")}
// >
//   Batches
// </Button>

// </div>

// <Input
//   placeholder="Search..."
//   value={search}
//   onChange={(e) => setSearch(e.target.value)}
//   className="md:w-56 h-9"
// />

// </div>
//     {/* ================= TABLE ================= */}
// <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-lg rounded-xl overflow-hidden">

// {/* HEADER */}
// <CardHeader className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
//   <div className="flex items-center justify-between">

//     <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">
//       Departments List
//     </CardTitle>

//     <Button
//       className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white h-9 px-4 rounded-lg shadow hover:scale-105 transition"
//       onClick={handleAdd}
//     >
//       <Plus className="h-4 w-4 mr-1.5" />
//       Add Department
//     </Button>

//   </div>
// </CardHeader>

// {/* TABLE CONTENT */}
// <CardContent className="p-0">

// <Table>

// <TableHeader>
// <TableRow className="text-xs uppercase tracking-wide bg-slate-100 dark:bg-slate-900">

// <TableHead className="py-3 text-slate-600">Department</TableHead>
// <TableHead className="text-slate-600">Head</TableHead>
// <TableHead className="text-slate-600">Status</TableHead>
// <TableHead className="text-right text-slate-600">Actions</TableHead>

// </TableRow>
// </TableHeader>

// <TableBody>

// {filteredDepartments.length === 0 ? (

// <TableRow>
// <TableCell colSpan={4} className="text-center py-10 text-sm text-slate-500">
// No departments found
// </TableCell>
// </TableRow>

// ) : (

// filteredDepartments.map((dept,index) => (

// <TableRow
// key={dept.id}
// className={`text-sm transition hover:bg-slate-50 dark:hover:bg-slate-900 ${
// index % 2 === 0 ? "bg-white dark:bg-slate-950" : "bg-slate-50/40 dark:bg-slate-900/40"
// }`}
// >

// {/* Department */}
// <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
// {dept.name}
// </TableCell>

// {/* Head */}
// <TableCell>
// <div className="flex items-center gap-3">

// <Avatar className="h-8 w-8 border border-slate-200">
// <AvatarFallback className="text-xs font-medium bg-slate-100 text-slate-700">
// {dept.head
// .split(" ")
// .map((n) => n[0])
// .join("")}
// </AvatarFallback>
// </Avatar>

// <span className="text-slate-700 dark:text-slate-300">
// {dept.head}
// </span>

// </div>
// </TableCell>

// {/* Status */}
// <TableCell>

// <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
// {dept.status}
// </Badge>

// </TableCell>

// {/* Actions */}
// <TableCell className="text-right">

// <div className="flex justify-end gap-2">

// <Button
// size="icon"
// variant="ghost"
// className="hover:bg-blue-50"
// onClick={() => handleEdit(dept)}
// >
// <Pencil className="h-4 w-4 text-blue-600" />
// </Button>

// <Button
// size="icon"
// variant="ghost"
// className="hover:bg-red-50"
// onClick={() => handleDelete(dept.id)}
// >
// <Trash2 className="h-4 w-4 text-red-500" />
// </Button>

// </div>

// </TableCell>

// </TableRow>

// ))

// )}

// </TableBody>

// </Table>

// </CardContent>

// </Card>
//       {/* ================= MODAL ================= */}
// {open && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center
//     bg-black/60 backdrop-blur-sm">

//     <div
//       className="w-full max-w-sm rounded-2xl p-5 space-y-4
//       bg-white dark:bg-slate-950
//       border border-slate-200 dark:border-slate-800 shadow-xl"
//     >

//       <h2 className="text-base font-semibold">
//         {mode === "create" ? "Add Department" : "Edit Department"}
//       </h2>

//       {/* Department Dropdown + Add Button */}
// <div className="flex items-center gap-2">

// <Select
//   value={form.name}
//   onValueChange={(value) => setForm({ ...form, name: value })}
// >

// <SelectTrigger className="flex-1 h-10 rounded-lg">
//   <SelectValue placeholder="Select Department" />
// </SelectTrigger>

// <SelectContent
//   position="popper"
//   className="max-h-64 overflow-y-auto rounded-lg shadow-lg z-[999] bg-white text-black"
// >

// {departmentOptions.map((dept) => (
//   <SelectItem
//     key={dept}
//     value={dept}
//     className="cursor-pointer text-black hover:bg-slate-100"
// >
//     {dept}
//   </SelectItem>
// ))}

// </SelectContent>

// </Select>

// {/* Small Add Button */}
// <Button
//   size="icon"
//   variant="outline"
//   className="h-10 w-10 rounded-lg"
//   onClick={handleAddDepartmentOption}
// >
//   <Plus className="h-4 w-4" />
// </Button>

// </div>

// {/* Department Head */}
// <Input
//   placeholder="Enter the name"
//   value={form.head}
//   onChange={(e) => setForm({ ...form, head: e.target.value })}
//   className="h-10 rounded-lg"
// />

// {/* Buttons */}
// <div className="flex justify-end gap-2 pt-2">

// <Button
//   size="sm"
//   variant="secondary"
//   onClick={() => setOpen(false)}
// >
// Cancel
// </Button>

// <Button
//   size="sm"
//   className="bg-gradient-to-r from-blue-500 to-indigo-600"
//   onClick={handleSave}
// >
// Save
// </Button>

// </div>

//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// export default DepartmentList;

























import { ArrowLeft, Building2, GitBranch, Layers, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ── avatar colour pool ── */
const AVATAR_COLORS = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-indigo-500 to-blue-700",
];
const avatarColor = (name) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

/* ================= MAIN ================= */
const DepartmentList = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([
    "Engineering","Human Resources","Marketing","Finance","Sales",
    "Customer Support","IT Services","Product Management","Operations",
    "Research & Development","Legal","Procurement","Quality Assurance",
    "Administration","Public Relations","Business Development","Security",
    "Training & Development","Logistics","Data Analytics","Content Management",
    "Design","Compliance","Technical Support","Strategy & Planning",
  ]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({ name: "", head: "", status: "Active" });

  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------- HANDLERS (unchanged) ---------- */
  const handleAdd = () => {
    setMode("create");
    setForm({ name: "", head: "", status: "Active" });
    setOpen(true);
  };
  const handleEdit = (dept) => {
    setMode("edit");
    setCurrentId(dept.id);
    setForm(dept);
    setOpen(true);
  };
  const handleSave = () => {
    if (!form.name || !form.head) return alert("Please fill all fields");
    if (mode === "create") {
      setDepartments((p) => [...p, { ...form, id: Date.now() }]);
    } else {
      setDepartments((p) =>
        p.map((d) => (d.id === currentId ? { ...form, id: currentId } : d))
      );
    }
    setOpen(false);
  };
  const handleDelete = (id) => {
    if (confirm("Delete this department?"))
      setDepartments((p) => p.filter((d) => d.id !== id));
  };
  const handleAddDepartmentOption = () => {
    const newDept = prompt("Enter new department name");
    if (newDept && newDept.trim()) {
      setDepartmentOptions((prev) => [...prev, newDept]);
      setForm({ ...form, name: newDept });
    }
  };

  /* ── NAV TABS ── */
  const tabs = [
    { label: "Departments", path: "/admin/departmentlist", icon: Building2 },
    { label: "Branches",    path: "/admin/branches",        icon: GitBranch  },
    { label: "Batches",     path: "/admin/batches",         icon: Layers     },
  ];

  return (
    <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 space-y-5">

      {/* ═══════════════ HERO ═══════════════ */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl
        bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4]">

        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute right-32 bottom-[-30px] h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5
                text-sm font-medium text-white backdrop-blur-sm
                hover:bg-white/25 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Department Management
              </h1>
              <p className="mt-0.5 text-sm text-blue-100/80">
                Manage organisational departments &amp; leadership
              </p>
            </div>
          </div>

          {/* stats pill */}
          <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
            <Users className="h-5 w-5 text-cyan-200" />
            <span className="text-sm font-semibold text-white">
              {departments.length}
              <span className="ml-1 font-normal text-blue-100/80">Departments</span>
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════ ACTION BAR ═══════════════ */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        {/* nav tabs */}
        <div className="flex gap-1.5 rounded-xl bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
          {tabs.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-all
                  ${active
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            );
          })}
        </div>

        {/* search */}
        <div className="relative md:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search departments…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900
              border-slate-200 dark:border-slate-800 text-sm"
          />
        </div>
      </div>

      {/* ═══════════════ TABLE CARD ═══════════════ */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200
        dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

        {/* card header */}
        <CardHeader className="flex flex-row items-center justify-between
          border-b border-slate-100 dark:border-slate-800 bg-slate-50/60
          dark:bg-slate-900/60 px-6 py-4">

          <div>
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              All Departments
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {filteredDepartments.length} record{filteredDepartments.length !== 1 && "s"} found
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 rounded-xl
              bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2
              text-sm font-semibold text-white shadow
              hover:opacity-90 hover:scale-105 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </button>
        </CardHeader>

        {/* table */}
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 dark:bg-slate-800/60 border-b
                border-slate-100 dark:border-slate-800">
                <TableHead className="pl-6 py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">#</TableHead>
                <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Department</TableHead>
                <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Head</TableHead>
                <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Status</TableHead>
                <TableHead className="pr-6 py-3 text-right text-[11px] uppercase tracking-wider font-semibold text-slate-500">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredDepartments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800
                        flex items-center justify-center">
                        <Building2 className="h-7 w-7 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-500">No departments yet</p>
                      <p className="text-xs text-slate-400">Click "Add Department" to get started</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDepartments.map((dept, index) => (
                  <TableRow
                    key={dept.id}
                    className="group border-b border-slate-100 dark:border-slate-800/60
                      hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* # */}
                    <TableCell className="pl-6 py-3.5 text-sm text-slate-400 font-medium w-10">
                      {String(index + 1).padStart(2, "0")}
                    </TableCell>

                    {/* Department */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/60
                          flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {dept.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Head */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${avatarColor(dept.head)}
                          flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
                          {dept.head.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {dept.head}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full
                        bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5
                        text-xs font-semibold text-emerald-700 dark:text-emerald-400
                        border border-emerald-200 dark:border-emerald-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {dept.status}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-6 py-3.5 text-right">
                      <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(dept)}
                          className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50
                            flex items-center justify-center
                            text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900
                            transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(dept.id)}
                          className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-950/50
                            flex items-center justify-center
                            text-red-500 hover:bg-red-100 dark:hover:bg-red-900
                            transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ═══════════════ MODAL ═══════════════ */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center
          bg-black/50 backdrop-blur-md">

          <div className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden
            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-800">

            {/* modal header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
                  {mode === "create"
                    ? <Plus className="h-4 w-4 text-white" />
                    : <Pencil className="h-4 w-4 text-white" />
                  }
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {mode === "create" ? "Add New Department" : "Edit Department"}
                  </h2>
                  <p className="text-[11px] text-blue-100/70">
                    {mode === "create" ? "Fill in the details below" : "Update department details"}
                  </p>
                </div>
              </div>
            </div>

            {/* modal body */}
            <div className="p-5 space-y-4">

              {/* Department select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Department Name
                </label>
                <div className="flex gap-2">
                  <Select
                    value={form.name}
                    onValueChange={(value) => setForm({ ...form, name: value })}
                  >
                    <SelectTrigger className="flex-1 h-10 rounded-xl border-slate-200
                      dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="max-h-64 overflow-y-auto rounded-xl shadow-xl z-[999]
                        bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    >
                      {departmentOptions.map((dept) => (
                        <SelectItem
                          key={dept}
                          value={dept}
                          className="cursor-pointer text-sm"
                        >
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <button
                    onClick={handleAddDepartmentOption}
                    className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700
                      bg-slate-50 dark:bg-slate-800 flex items-center justify-center
                      text-slate-600 hover:bg-blue-50 hover:text-blue-600
                      hover:border-blue-200 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Head input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Department Head
                </label>
                <Input
                  placeholder="Enter full name"
                  value={form.head}
                  onChange={(e) => setForm({ ...form, head: e.target.value })}
                  className="h-10 rounded-xl border-slate-200 dark:border-slate-700
                    bg-slate-50 dark:bg-slate-800"
                />
              </div>

              {/* buttons */}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium
                    bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
                    hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white
                    bg-gradient-to-r from-blue-600 to-cyan-500 shadow
                    hover:opacity-90 hover:scale-105 transition-all"
                >
                  {mode === "create" ? "Add Department" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;