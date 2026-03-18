// import { courseService } from "@/services/courseService";
// import { Layers, Search, X } from "lucide-react";
// import { useEffect, useState } from "react";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// const Categories = () => {
//   const [search, setSearch] = useState("");
//   const [open, setOpen] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ===============================
//   // LOAD CATEGORIES FROM COURSES
//   // ===============================
//   useEffect(() => {
//     loadCategories();
//   }, []);

//   const loadCategories = () => {
//     courseService
//       .getAllCoursesForAdmin()
//       .then((res) => {
//         const courses = res.data;

//         // Group courses by category
//         const grouped = {};

//         courses.forEach((course) => {
//           const category = course.category || "Uncategorized";

//           if (!grouped[category]) {
//             grouped[category] = 0;
//           }

//           grouped[category]++;
//         });

//         // Convert to array format for table
//         const formatted = Object.keys(grouped).map((categoryName, index) => ({
//           id: index + 1,
//           name: categoryName,
//           courseCount: grouped[categoryName],
//           active: true, // default since no status column
//         }));

//         setCategories(formatted);
//       })
//       .catch((err) => {
//         console.error("Failed to load categories", err);
//       })
//       .finally(() => setLoading(false));
//   };

//   // ===============================
//   // SEARCH FILTER
//   // ===============================
//   const filteredCategories = categories.filter((c) =>
//     c.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   return (
//     <div className="space-y-8">
//       {/* HERO */}
//       <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
//         <h1 className="text-3xl font-bold">Course Categories</h1>
//         <p className="mt-2 text-sm opacity-90">
//           Organize courses into meaningful categories
//         </p>
//       </div>

//       {/* ACTION BAR */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <div className="relative md:w-72">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search categories..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-9 h-9"
//           />
//         </div>
//       </div>

//       {/* TABLE */}
//       <Card>
//         <CardHeader className="py-3">
//           <CardTitle className="text-sm">Category List</CardTitle>
//         </CardHeader>

//         <CardContent>
//           {loading ? (
//             <div className="text-center py-8 text-muted-foreground">
//               Loading categories...
//             </div>
//           ) : filteredCategories.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
//               <Layers className="h-10 w-10 mb-3 opacity-40" />
//               <p className="text-sm">No categories created</p>
//               <p className="text-xs">Create categories to organize courses</p>
//             </div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Category Name</TableHead>
//                   <TableHead>Total Courses</TableHead>
//                   <TableHead className="text-right">Status</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {filteredCategories.map((c) => (
//                   <TableRow key={c.id}>
//                     <TableCell className="font-medium">{c.name}</TableCell>

//                     <TableCell>{c.courseCount}</TableCell>

//                     <TableCell className="text-right">
//                       <Badge variant={c.active ? "secondary" : "outline"}>
//                         {c.active ? "Active" : "Inactive"}
//                       </Badge>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>

//       {/* ADD CATEGORY MODAL (UI unchanged) */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent
//           className="
//             fixed left-1/2 top-1/2
//             -translate-x-1/2 -translate-y-1/2
//             rounded-2xl max-w-sm w-full
//             bg-white dark:bg-slate-900
//             border border-slate-200 dark:border-slate-700
//             shadow-xl
//           "
//         >
//           <DialogHeader>
//             <DialogTitle>Add Category</DialogTitle>

//             <DialogClose
//               className="
//                 absolute right-4 top-4
//                 rounded-md p-1
//                 text-slate-500 hover:text-slate-900
//                 hover:bg-slate-100
//                 dark:text-slate-400 dark:hover:text-white
//                 dark:hover:bg-slate-800
//                 outline-none ring-0
//                 focus:outline-none focus:ring-0
//                 transition
//               "
//             >
//               <X className="h-4 w-4" />
//             </DialogClose>
//           </DialogHeader>

//           <div className="space-y-4 mt-4">
//             <Input placeholder="Category name" />

//             <div className="flex justify-end gap-2 pt-2">
//               <Button
//                 size="sm"
//                 variant="secondary"
//                 onClick={() => setOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 size="sm"
//                 className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600"
//               >
//                 Create
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Categories;

















// import { courseService } from "@/services/courseService";
// import { Layers, Search, X } from "lucide-react";
// import { useEffect, useState } from "react";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const Categories = () => {
//   const navigate = useNavigate();
//   const [search, setSearch] = useState("");
//   const [open, setOpen] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ===============================
//   // LOAD CATEGORIES FROM COURSES
//   // ===============================
//   useEffect(() => {
//     loadCategories();
//   }, []);

//   const loadCategories = () => {
//     courseService
//       .getAllCoursesForAdmin()
//       .then((res) => {
//         const courses = res.data;

//         // Group courses by category
//         const grouped = {};

//         courses.forEach((course) => {
//           const category = course.category || "Uncategorized";

//           if (!grouped[category]) {
//             grouped[category] = 0;
//           }

//           grouped[category]++;
//         });

//         // Convert to array format for table
//         const formatted = Object.keys(grouped).map((categoryName, index) => ({
//           id: index + 1,
//           name: categoryName,
//           courseCount: grouped[categoryName],
//           active: true, // default since no status column
//         }));

//         setCategories(formatted);
//       })
//       .catch((err) => {
//         console.error("Failed to load categories", err);
//       })
//       .finally(() => setLoading(false));
//   };

//   // ===============================
//   // SEARCH FILTER
//   // ===============================
//   const filteredCategories = categories.filter((c) =>
//     c.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   return (
//     <div className="space-y-8">
//       {/* HERO */}
//       <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
//   <div className="flex items-center gap-3">

//     {/* BACK BUTTON */}
//     <button
//       onClick={() => navigate("/admin/courses")}
//       className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
//     >
//       <ArrowLeft className="w-5 h-5" />
//     </button>

//     {/* TITLE */}
//     <div>
//       <h1 className="text-3xl font-bold">Course Categories</h1>
//       <p className="text-sm opacity-90">
//         Organize courses into meaningful categories
//       </p>
//     </div>

//   </div>
// </div>

//       {/* ACTION BAR */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <div className="relative md:w-72">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search categories..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-9 h-9"
//           />
//         </div>
//       </div>

//       {/* TABLE */}
//       <Card>
//         <CardHeader className="py-3">
//           <CardTitle className="text-sm">Category List</CardTitle>
//         </CardHeader>

//         <CardContent>
//           {loading ? (
//             <div className="text-center py-8 text-muted-foreground">
//               Loading categories...
//             </div>
//           ) : filteredCategories.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
//               <Layers className="h-10 w-10 mb-3 opacity-40" />
//               <p className="text-sm">No categories created</p>
//               <p className="text-xs">Create categories to organize courses</p>
//             </div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Category Name</TableHead>
//                   <TableHead>Total Courses</TableHead>
//                   <TableHead className="text-right">Status</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {filteredCategories.map((c) => (
//                   <TableRow key={c.id}>
//                     <TableCell className="font-medium">{c.name}</TableCell>

//                     <TableCell>{c.courseCount}</TableCell>

//                     <TableCell className="text-right">
//                       <Badge variant={c.active ? "secondary" : "outline"}>
//                         {c.active ? "Active" : "Inactive"}
//                       </Badge>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>

//       {/* ADD CATEGORY MODAL (UI unchanged) */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent
//           className="
//             fixed left-1/2 top-1/2
//             -translate-x-1/2 -translate-y-1/2
//             rounded-2xl max-w-sm w-full
//             bg-white dark:bg-slate-900
//             border border-slate-200 dark:border-slate-700
//             shadow-xl
//           "
//         >
//           <DialogHeader>
//             <DialogTitle>Add Category</DialogTitle>

//             <DialogClose
//               className="
//                 absolute right-4 top-4
//                 rounded-md p-1
//                 text-slate-500 hover:text-slate-900
//                 hover:bg-slate-100
//                 dark:text-slate-400 dark:hover:text-white
//                 dark:hover:bg-slate-800
//                 outline-none ring-0
//                 focus:outline-none focus:ring-0
//                 transition
//               "
//             >
//               <X className="h-4 w-4" />
//             </DialogClose>
//           </DialogHeader>

//           <div className="space-y-4 mt-4">
//             <Input placeholder="Category name" />

//             <div className="flex justify-end gap-2 pt-2">
//               <Button
//                 size="sm"
//                 variant="secondary"
//                 onClick={() => setOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 size="sm"
//                 className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600"
//               >
//                 Create
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Categories;




















import { courseService } from "@/services/courseService";
import {
  ArrowLeft, BookOpen, Layers, Plus, Search, Tag, X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/* ── category colour pool ── */
const CHIP = [
  "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
  "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-400 dark:border-violet-800",
  "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
  "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
  "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800",
  "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-800",
];
const chip = (val) => CHIP[(String(val)?.charCodeAt(0) ?? 0) % CHIP.length];

const GRAD = [
  "from-violet-500 to-purple-600", "from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600",     "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",  "from-indigo-500 to-blue-700",
];
const grad = (val) => GRAD[(String(val)?.charCodeAt(0) ?? 0) % GRAD.length];

/* ================= MAIN ================= */
const Categories = () => {
  const navigate = useNavigate();

  const [search, setSearch]         = useState("");
  const [open, setOpen]             = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  /* ── LOAD (unchanged) ── */
  useEffect(() => { loadCategories(); }, []);

  const loadCategories = () => {
    courseService
      .getAllCoursesForAdmin()
      .then((res) => {
        const courses = res.data;
        const grouped = {};
        courses.forEach((course) => {
          const category = course.category || "Uncategorized";
          if (!grouped[category]) grouped[category] = 0;
          grouped[category]++;
        });
        const formatted = Object.keys(grouped).map((categoryName, index) => ({
          id:          index + 1,
          name:        categoryName,
          courseCount: grouped[categoryName],
          active:      true,
        }));
        setCategories(formatted);
      })
      .catch((err) => console.error("Failed to load categories", err))
      .finally(() => setLoading(false));
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = categories.filter((c) => c.active).length;

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 space-y-5">

      {/* ═══════ HERO ═══════ */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl
        bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4]">
        <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute right-32 bottom-[-30px] h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/courses")}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5
                text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Course Categories</h1>
              <p className="mt-0.5 text-sm text-blue-100/80">Organize courses into meaningful categories</p>
            </div>
          </div>

          {/* stats pills */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
              <Layers className="h-4 w-4 text-cyan-200" />
              <span className="text-sm font-semibold text-white">
                {categories.length}
                <span className="ml-1 font-normal text-blue-100/80">Categories</span>
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
              <BookOpen className="h-4 w-4 text-cyan-200" />
              <span className="text-sm font-semibold text-white">
                {categories.reduce((a, c) => a + c.courseCount, 0)}
                <span className="ml-1 font-normal text-blue-100/80">Courses</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ ACTION BAR ═══════ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900
              border-slate-200 dark:border-slate-800 text-sm"
          />
        </div>

        
      </div>

      {/* ═══════ TABLE CARD ═══════ */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200
        dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

        <CardHeader className="flex flex-row items-center justify-between
          border-b border-slate-100 dark:border-slate-800
          bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Category List
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {filteredCategories.length} categor{filteredCategories.length !== 1 ? "ies" : "y"} found
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">

          {/* skeleton */}
          {loading && (
            <div className="p-4 space-y-2">
              {[1,2,3].map((i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl
                  border border-slate-100 dark:border-slate-800 p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-700" />
                    <div className="h-3 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="flex gap-4">
                    <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    <div className="h-6 w-14 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* empty state */}
          {!loading && filteredCategories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800
                flex items-center justify-center">
                <Layers className="h-7 w-7 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">No categories yet</p>
              <p className="text-xs text-slate-400">Create categories to organize courses</p>
            </div>
          )}

          {/* table */}
          {!loading && filteredCategories.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 dark:bg-slate-800/60
                  border-b border-slate-100 dark:border-slate-800">
                  <TableHead className="pl-6 py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">#</TableHead>
                  <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Category</TableHead>
                  <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Total Courses</TableHead>
                  <TableHead className="pr-6 py-3 text-right text-[11px] uppercase tracking-wider font-semibold text-slate-500">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCategories.map((c, index) => (
                  <TableRow
                    key={c.id}
                    className="group border-b border-slate-100 dark:border-slate-800/60
                      hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* # */}
                    <TableCell className="pl-6 py-3.5 text-sm text-slate-400 font-medium w-10">
                      {String(index + 1).padStart(2, "0")}
                    </TableCell>

                    {/* Category */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${grad(c.name)}
                          flex items-center justify-center shrink-0`}>
                          <Tag className="h-4 w-4 text-white" />
                        </div>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border
                          px-2.5 py-0.5 text-xs font-semibold ${chip(c.name)}`}>
                          {c.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Course Count */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {c.courseCount}
                        </span>
                        <span className="text-xs text-slate-400">
                          course{c.courseCount !== 1 && "s"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="pr-6 py-3.5 text-right">
                      {c.active ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border
                          bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800
                          px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border
                          bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700
                          px-2.5 py-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Inactive
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ═══════ MODAL (unchanged logic) ═══════ */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm p-0 rounded-2xl overflow-hidden
          bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl">

          {/* header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Layers className="h-4 w-4 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-sm font-bold text-white">Add Category</DialogTitle>
                  <p className="text-[11px] text-blue-100/70">Create a new course category</p>
                </div>
              </div>
              <DialogClose className="rounded-lg bg-white/15 p-1.5 text-white
                hover:bg-white/25 transition-colors">
                <X className="h-4 w-4" />
              </DialogClose>
            </div>
          </div>

          {/* body */}
          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Category Name
              </label>
              <Input
                placeholder="e.g. Web Development"
                className="h-10 rounded-xl border-slate-200 dark:border-slate-700
                  bg-slate-50 dark:bg-slate-800"
              />
            </div>

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
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white
                  bg-gradient-to-r from-blue-600 to-cyan-500 shadow
                  hover:opacity-90 hover:scale-105 transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;