// // src/Admin/AllCourses.jsx
// import React from "react";

// const AllCourses = () => {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-xl font-semibold text-slate-100">All courses</h1>
//         <p className="mt-1 text-sm text-slate-400">
//           Approve, publish and manage all courses on the platform.
//         </p>
//       </div>

//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <input
//           type="text"
//           placeholder="Search courses..."
//           className="w-full md:w-72 rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
//         />
//         <button className="px-4 py-2 rounded-md bg-violet-600 text-sm font-medium text-white hover:bg-violet-500">
//           + Create course
//         </button>
//       </div>

//       <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
//         <div className="flex text-xs font-semibold text-slate-400 border-b border-slate-800 pb-2 mb-3">
//           <div className="w-2/6">Course name</div>
//           <div className="w-1/6">Category</div>
//           <div className="w-1/6">Trainer</div>
//           <div className="w-1/6">Status</div>
//           <div className="w-1/6 text-right">Enrollments</div>
//         </div>

//         <p className="text-sm text-slate-400">
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AllCourses;   



// src/Admin/AllCourses.jsx
import React, { useState } from "react";
import { BookOpen, Plus, Search } from "lucide-react";

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

const AllCourses = () => {
  // 🔹 dummy state (future backend)
  const [search, setSearch] = useState("");

  const courses = []; // backend se aayega

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
        <h1 className="text-3xl font-bold">All Courses</h1>
        <p className="mt-2 text-sm opacity-90">
          Approve, publish and manage all courses on the platform
        </p>
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Button className="bg-indigo-600 hover:bg-indigo-500">
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Course List</CardTitle>
        </CardHeader>

        <CardContent>
          {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <BookOpen className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-sm">No courses available</p>
              <p className="text-xs">
                Courses created by trainers will appear here
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">
                    Enrollments
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {courses.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      {c.name}
                    </TableCell>
                    <TableCell>{c.category}</TableCell>
                    <TableCell>{c.trainerName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          c.status === "PUBLISHED"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {c.enrollments}
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

export default AllCourses;
