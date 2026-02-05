// import React, { useState } from "react";

// const DepartmentList = () => {
//   // Temporary dummy data (future me API se aayega)
//   const [departments, setDepartments] = useState([
//     {
//       id: 1,
//       name: "Engineering",
//       head: "Rohit Sharma",
//     },
//     {
//       id: 2,
//       name: "Human Resources",
//       head: "Anjali Verma",
//     },
//   ]);

//   const [search, setSearch] = useState("");

//   // Filter departments
//   const filteredDepartments = departments.filter((dept) =>
//     dept.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this department?")) {
//       setDepartments(departments.filter((d) => d.id !== id));
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-xl font-semibold text-slate-100">Departments</h1>
//         <p className="mt-1 text-sm text-slate-400">
//           View and manage all departments in your organisation.
//         </p>
//       </div>

//       {/* Actions row */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <button className="px-4 py-2 rounded-md bg-violet-600 text-sm font-medium text-white hover:bg-violet-500">
//           + Add Department
//         </button>

//         <input
//           type="text"
//           placeholder="Search departments..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full md:w-64 rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
//         />
//       </div>

//       {/* Table */}
//       <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
//         <div className="flex text-xs font-semibold text-slate-400 border-b border-slate-800 pb-2 mb-3">
//           <div className="w-2/5">Department name</div>
//           <div className="w-2/5">Head of department</div>
//           <div className="w-1/5 text-right">Actions</div>
//         </div>

//         {filteredDepartments.length === 0 ? (
//           <p className="text-sm text-slate-400 text-center py-6">
//             No departments found
//           </p>
//         ) : (
//           filteredDepartments.map((dept) => (
//             <div
//               key={dept.id}
//               className="flex items-center text-sm text-slate-200 py-3 border-b border-slate-800 last:border-b-0"
//             >
//               <div className="w-2/5">{dept.name}</div>
//               <div className="w-2/5 text-slate-400">{dept.head}</div>
//               <div className="w-1/5 text-right space-x-3">
//                 <button className="text-blue-400 hover:text-blue-300 text-xs">
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(dept.id)}
//                   className="text-red-400 hover:text-red-300 text-xs"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
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

const DepartmentList = () => {
  // Dummy data (backend later)
  const [departments, setDepartments] = useState([
    { id: 1, name: "Engineering", head: "Rohit Sharma", status: "Active" },
    { id: 2, name: "Human Resources", head: "Anjali Verma", status: "Active" },
  ]);

  const [search, setSearch] = useState("");

  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Delete this department?")) {
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
        <h1 className="text-3xl font-bold">Departments</h1>
        <p className="mt-2 text-sm opacity-90">
          Manage organisational departments and leadership
        </p>
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <Button className="bg-indigo-600 hover:bg-indigo-500 w-fit">
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>

        <Input
          placeholder="Search departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-64"
        />
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Department List</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Head</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredDepartments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-6"
                  >
                    No departments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredDepartments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">
                      {dept.name}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
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
                      <Badge variant="secondary">{dept.status}</Badge>
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      <Button size="icon" variant="ghost">
                        <Pencil className="h-4 w-4" />
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
    </div>
  );
};

export default DepartmentList;
