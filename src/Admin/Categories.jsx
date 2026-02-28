// src/Admin/Categories.jsx
import React, { useState } from "react";
import { Layers, Plus, Search, X } from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const Categories = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

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
            className="pl-9 h-9"
          />
        </div>

        {/* ✅ SAME HERO COLOR + COMPACT BUTTON */}
        {/* <Button
          size="sm"
          className="h-9 px-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Category
        </Button> */}
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader className="py-3">
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

                    <TableCell>{c.courseCount}</TableCell>

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

      {/* ================= ADD CATEGORY MODAL ================= */}
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

          {/* UI only */}
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
