import { courseService } from "@/services/courseService";
import { BookOpen, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AllCourses = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // LOAD ADMIN COURSES
  // ===============================
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    courseService
      .getAllCoursesForAdmin()
      .then((res) => {
        // map backend fields to UI expected fields
        const mapped = res.data.map((c) => ({
          id: c.id,
          name: c.title,
          category: c.category,
          trainerName: c.ownerEmail,
          status: "PUBLISHED", // default (since not in entity yet)
          enrollments: 0, // placeholder until enrollment service added
        }));

        setCourses(mapped);
      })
      .catch((err) => {
        console.error("Failed to load courses", err);
      })
      .finally(() => setLoading(false));
  };

  // ===============================
  // SEARCH FILTER
  // ===============================
  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

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
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Course List</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading courses...
            </div>
          ) : filteredCourses.length === 0 ? (
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
                  <TableHead className="text-right">Enrollments</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCourses.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.category}</TableCell>
                    <TableCell>{c.trainerName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          c.status === "PUBLISHED" ? "secondary" : "outline"
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

      {/* CREATE COURSE MODAL (UI unchanged) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="
            fixed left-1/2 top-1/2
            -translate-x-1/2 -translate-y-1/2
            rounded-2xl max-w-md w-full
            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-700
            shadow-xl
          "
        >
          <DialogHeader>
            <DialogTitle>Create Course</DialogTitle>

            <DialogClose
              className="
                absolute right-4 top-4
                rounded-md p-1
                text-slate-500 hover:text-slate-900
                hover:bg-slate-100
                dark:text-slate-400 dark:hover:text-white
                dark:hover:bg-slate-800
                outline-none ring-0
                focus:outline-none focus:ring-0
                transition
              "
            >
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Input placeholder="Course name" />
            <Input placeholder="Category" />
            <Input placeholder="Trainer name" />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllCourses;