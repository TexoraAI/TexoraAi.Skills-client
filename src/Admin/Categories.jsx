// // src/Admin/Categories.jsx
// import React from "react";

// const Categories = () => {
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-xl font-semibold text-slate-100">
//           Course categories
//         </h1>
//         <p className="mt-1 text-sm text-slate-400">
//           Group courses into categories like Web Dev, Data Science, etc.
//         </p>
//       </div>

//       {/* Actions row */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <input
//           type="text"
//           placeholder="Search categories..."
//           className="w-full md:w-72 rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
//         />
//         <button className="px-4 py-2 rounded-md bg-violet-600 text-sm font-medium text-white hover:bg-violet-500">
//           + Add category
//         </button>
//       </div>

//       {/* Table placeholder */}
//       <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
//         <div className="flex text-xs font-semibold text-slate-400 border-b border-slate-800 pb-2 mb-3">
//           <div className="w-3/6">Category name</div>
//           <div className="w-2/6">Total courses</div>
//           <div className="w-1/6 text-right">Actions</div>
//         </div>

//         <p className="text-sm text-slate-400">
          
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Categories;




// src/Admin/Categories.jsx
import React, { useState } from "react";
import { Layers, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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

const Categories = () => {
  // 🔹 dummy state (future backend)
  const [search, setSearch] = useState("");

  const categories = []; // API se aayega

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
        <h1 className="text-3xl font-bold">Course Categories</h1>
        <p className="mt-2 text-sm opacity-90">
          Organize courses into meaningful categories
        </p>
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Button className="bg-indigo-600 hover:bg-indigo-500">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Category List</CardTitle>
        </CardHeader>

        <CardContent>
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Layers className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-sm">No categories created</p>
              <p className="text-xs">
                Create categories to organize courses
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Total Courses</TableHead>
                  <TableHead className="text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {categories.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      {c.name}
                    </TableCell>

                    <TableCell>
                      {c.courseCount}
                    </TableCell>

                    <TableCell className="text-right">
                      <Badge
                        variant={
                          c.active ? "secondary" : "outline"
                        }
                      >
                        {c.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
