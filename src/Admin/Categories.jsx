import { courseService } from "@/services/courseService";
import { Layers, Search, X } from "lucide-react";
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

const Categories = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // LOAD CATEGORIES FROM COURSES
  // ===============================
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    courseService
      .getAllCoursesForAdmin()
      .then((res) => {
        const courses = res.data;

        // Group courses by category
        const grouped = {};

        courses.forEach((course) => {
          const category = course.category || "Uncategorized";

          if (!grouped[category]) {
            grouped[category] = 0;
          }

          grouped[category]++;
        });

        // Convert to array format for table
        const formatted = Object.keys(grouped).map((categoryName, index) => ({
          id: index + 1,
          name: categoryName,
          courseCount: grouped[categoryName],
          active: true, // default since no status column
        }));

        setCategories(formatted);
      })
      .catch((err) => {
        console.error("Failed to load categories", err);
      })
      .finally(() => setLoading(false));
  };

  // ===============================
  // SEARCH FILTER
  // ===============================
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

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
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm">Category List</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading categories...
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Layers className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-sm">No categories created</p>
              <p className="text-xs">Create categories to organize courses</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Total Courses</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCategories.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>

                    <TableCell>{c.courseCount}</TableCell>

                    <TableCell className="text-right">
                      <Badge variant={c.active ? "secondary" : "outline"}>
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

      {/* ADD CATEGORY MODAL (UI unchanged) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="
            fixed left-1/2 top-1/2
            -translate-x-1/2 -translate-y-1/2
            rounded-2xl max-w-sm w-full
            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-700
            shadow-xl
          "
        >
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>

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
            <Input placeholder="Category name" />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600"
              >
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;