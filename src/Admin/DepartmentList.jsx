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
//     if (!form.name || !form.head) {
//       alert("Please fill all fields");
//       return;
//     }

//     if (mode === "create") {
//       setDepartments((prev) => [...prev, { ...form, id: Date.now() }]);
//     } else {
//       setDepartments((prev) =>
//         prev.map((d) =>
//           d.id === currentId ? { ...form, id: currentId } : d
//         )
//       );
//     }

//     setOpen(false);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Delete this department?")) {
//       setDepartments((prev) => prev.filter((d) => d.id !== id));
//     }
//   };

//   return (
//     <div className="space-y-8 min-h-screen
//       bg-slate-50 text-slate-900
//       dark:bg-gradient-to-br dark:from-[#05070d] dark:to-[#0b1220] dark:text-white
//       p-6 rounded-xl">

//       {/* HERO */}
//       <div className="rounded-3xl p-8 text-white shadow-xl
//         bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
//         <h1 className="text-3xl font-bold">Departments</h1>
//         <p className="mt-2 text-sm opacity-90">
//           Manage organisational departments and leadership
//         </p>
//       </div>

//       {/* ACTION BAR */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <Button
//           className="bg-indigo-600 hover:bg-indigo-500 w-fit"
//           onClick={handleAdd}
//         >
//           <Plus className="h-4 w-4 mr-2" />
//           Add Department
//         </Button>

//         <Input
//           placeholder="Search departments..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="
//             md:w-64
//             bg-white text-slate-900
//             dark:bg-slate-900 dark:text-white
//             border border-slate-300 dark:border-slate-700"
//         />
//       </div>

//       {/* TABLE */}
//       <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md">
//         <CardHeader>
//           <CardTitle className="text-sm">Department List</CardTitle>
//         </CardHeader>

//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Department</TableHead>
//                 <TableHead>Head</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {filteredDepartments.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={4} className="text-center py-6">
//                     No departments found
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredDepartments.map((dept) => (
//                   <TableRow key={dept.id}>
//                     <TableCell className="font-medium">
//                       {dept.name}
//                     </TableCell>

//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <Avatar className="h-8 w-8">
//                           <AvatarFallback>
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
//                       <Badge variant="secondary">{dept.status}</Badge>
//                     </TableCell>

//                     <TableCell className="text-right space-x-2">
//                       <Button size="icon" variant="ghost" onClick={() => handleEdit(dept)}>
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                       <Button size="icon" variant="ghost" onClick={() => handleDelete(dept.id)}>
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

//           <div className="
//             w-full max-w-md rounded-2xl p-6 space-y-4
//             bg-white text-slate-900
//             dark:bg-slate-950 dark:text-white
//             border border-slate-200 dark:border-slate-800
//             shadow-2xl">

//             <h2 className="text-lg font-semibold">
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

//             <div className="flex justify-end gap-3 pt-2">
//               <Button variant="secondary" onClick={() => setOpen(false)}>
//                 Cancel
//               </Button>
//               <Button className="bg-indigo-600 hover:bg-indigo-500" onClick={handleSave}>
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











import React, { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/* ================= MAIN ================= */

const DepartmentList = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: "Engineering", head: "Rohit Sharma", status: "Active" },
    { id: 2, name: "Human Resources", head: "Anjali Verma", status: "Active" },
  ]);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [currentId, setCurrentId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    head: "",
    status: "Active",
  });

  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------- HANDLERS ---------- */

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
    if (confirm("Delete this department?")) {
      setDepartments((p) => p.filter((d) => d.id !== id));
    }
  };

  return (
    <div
      className="space-y-6 min-h-screen p-6 rounded-xl
      bg-slate-50 text-slate-900
      dark:bg-gradient-to-br dark:from-[#05070d] dark:to-[#0b1220] dark:text-white"
    >
      {/* ================= HERO ================= */}
      <div className="rounded-2xl p-6 text-white shadow-lg
        bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
        <h1 className="text-2xl font-bold">Departments</h1>
        <p className="mt-1 text-sm opacity-90">
          Manage organisational departments and leadership
        </p>
      </div>

      {/* ================= ACTION BAR ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <Button
          className="bg-gradient-to-r from-cyan-500 to-blue-600 h-9 px-4"
          onClick={handleAdd}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Department
        </Button>

        <Input
          placeholder="Search departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-56 h-9"
        />
      </div>

      {/* ================= TABLE ================= */}
      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
        <CardHeader className="py-3">
          <CardTitle className="text-sm">Department List</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>Department</TableHead>
                <TableHead>Head</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredDepartments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-sm">
                    No departments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredDepartments.map((dept) => (
                  <TableRow key={dept.id} className="text-sm">
                    <TableCell className="font-medium">
                      {dept.name}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs">
                            {dept.head
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{dept.head}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {dept.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right space-x-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(dept)}
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(dept.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center
          bg-black/60 backdrop-blur-sm">

          <div
            className="w-full max-w-sm rounded-2xl p-5 space-y-3
            bg-white dark:bg-slate-950
            border border-slate-200 dark:border-slate-800 shadow-xl"
          >
            <h2 className="text-base font-semibold">
              {mode === "create" ? "Add Department" : "Edit Department"}
            </h2>

            <Input
              placeholder="Department name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <Input
              placeholder="Department head"
              value={form.head}
              onChange={(e) => setForm({ ...form, head: e.target.value })}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-indigo-600"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
