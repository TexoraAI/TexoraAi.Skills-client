// import { courseService } from "@/services/courseService";
// import { BookOpen, Search, X } from "lucide-react";
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

// const AllCourses = () => {
//   const [search, setSearch] = useState("");
//   const [open, setOpen] = useState(false);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ===============================
//   // LOAD ADMIN COURSES
//   // ===============================
//   useEffect(() => {
//     loadCourses();
//   }, []);

//   const loadCourses = () => {
//     courseService
//       .getAllCoursesForAdmin()
//       .then((res) => {
//         // map backend fields to UI expected fields
//         const mapped = res.data.map((c) => ({
//           id: c.id,
//           name: c.title,
//           category: c.category,
//           trainerName: c.ownerEmail,
//           status: "PUBLISHED", // default (since not in entity yet)
//           enrollments: 0, // placeholder until enrollment service added
//         }));

//         setCourses(mapped);
//       })
//       .catch((err) => {
//         console.error("Failed to load courses", err);
//       })
//       .finally(() => setLoading(false));
//   };

//   // ===============================
//   // SEARCH FILTER
//   // ===============================
//   const filteredCourses = courses.filter((c) =>
//     c.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   return (
//     <div className="space-y-8">
//       {/* HERO */}
//       <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
//         <h1 className="text-3xl font-bold">All Courses</h1>
//         <p className="mt-2 text-sm opacity-90">
//           Approve, publish and manage all courses on the platform
//         </p>
//       </div>

//       {/* ACTION BAR */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <div className="relative md:w-72">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search courses..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-9"
//           />
//         </div>
//       </div>

//       {/* TABLE */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-sm">Course List</CardTitle>
//         </CardHeader>

//         <CardContent>
//           {loading ? (
//             <div className="text-center py-8 text-muted-foreground">
//               Loading courses...
//             </div>
//           ) : filteredCourses.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
//               <BookOpen className="h-10 w-10 mb-3 opacity-40" />
//               <p className="text-sm">No courses available</p>
//               <p className="text-xs">
//                 Courses created by trainers will appear here
//               </p>
//             </div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Course Name</TableHead>
//                   <TableHead>Category</TableHead>
//                   <TableHead>Trainer</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Enrollments</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {filteredCourses.map((c) => (
//                   <TableRow key={c.id}>
//                     <TableCell className="font-medium">{c.name}</TableCell>
//                     <TableCell>{c.category}</TableCell>
//                     <TableCell>{c.trainerName}</TableCell>
//                     <TableCell>
//                       <Badge
//                         variant={
//                           c.status === "PUBLISHED" ? "secondary" : "outline"
//                         }
//                       >
//                         {c.status}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       {c.enrollments}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>

//       {/* CREATE COURSE MODAL (UI unchanged) */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent
//           className="
//             fixed left-1/2 top-1/2
//             -translate-x-1/2 -translate-y-1/2
//             rounded-2xl max-w-md w-full
//             bg-white dark:bg-slate-900
//             border border-slate-200 dark:border-slate-700
//             shadow-xl
//           "
//         >
//           <DialogHeader>
//             <DialogTitle>Create Course</DialogTitle>

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
//             <Input placeholder="Course name" />
//             <Input placeholder="Category" />
//             <Input placeholder="Trainer name" />

//             <div className="flex justify-end gap-2 pt-2">
//               <Button variant="secondary" onClick={() => setOpen(false)}>
//                 Cancel
//               </Button>
//               <Button className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
//                 Create
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default AllCourses;




















// import { courseService } from "@/services/courseService";
// import { BookOpen, Search, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { Folder } from "lucide-react";
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

// const AllCourses = () => {
//   const navigate = useNavigate(); 
//   const [search, setSearch] = useState("");
//   const [open, setOpen] = useState(false);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ===============================
//   // LOAD ADMIN COURSES
//   // ===============================
//   useEffect(() => {
//     loadCourses();
//   }, []);

//   const loadCourses = () => {
//     courseService
//       .getAllCoursesForAdmin()
//       .then((res) => {
//         // map backend fields to UI expected fields
//         const mapped = res.data.map((c) => ({
//           id: c.id,
//           name: c.title,
//           category: c.category,
//           trainerName: c.ownerEmail,
//           status: "PUBLISHED", // default (since not in entity yet)
//           enrollments: 0, // placeholder until enrollment service added
//         }));

//         setCourses(mapped);
//       })
//       .catch((err) => {
//         console.error("Failed to load courses", err);
//       })
//       .finally(() => setLoading(false));
//   };

//   // ===============================
//   // SEARCH FILTER
//   // ===============================
//   const filteredCourses = courses.filter((c) =>
//     c.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   return (
//     <div className="space-y-8">
//       {/* HERO */}
//       <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
//         <h1 className="text-3xl font-bold">All Courses</h1>
//         <p className="mt-2 text-sm opacity-90">
//           Approve, publish and manage all courses on the platform
//         </p>
//       </div>

//       {/* ACTION BAR */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

//   {/* LEFT → Search */}
//   <div className="relative md:w-72">
//     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//     <Input
//       placeholder="Search courses..."
//       value={search}
//       onChange={(e) => setSearch(e.target.value)}
//       className="pl-9 bg-white dark:bg-slate-900"
//     />
//   </div>

//   {/* RIGHT → Categories Button */}
//   <Button
//   onClick={() => navigate("/admin/categories")}
//   className="
//     flex items-center gap-2
//     px-5 py-2.5
//     rounded-xl
//     text-white font-medium
//     bg-gradient-to-r from-blue-500 to-indigo-600
//     hover:from-blue-600 hover:to-indigo-700
//     shadow-md hover:shadow-lg
//     transition-all duration-300
//   "
// >
//   <Folder className="h-4 w-4" />
//   Categories
// </Button>

// </div>

//       {/* TABLE */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-sm">Course List</CardTitle>
//         </CardHeader>

//         <CardContent>
//           {loading ? (
//             <div className="text-center py-8 text-muted-foreground">
//               Loading courses...
//             </div>
//           ) : filteredCourses.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
//               <BookOpen className="h-10 w-10 mb-3 opacity-40" />
//               <p className="text-sm">No courses available</p>
//               <p className="text-xs">
//                 Courses created by trainers will appear here
//               </p>
//             </div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Course Name</TableHead>
//                   <TableHead>Category</TableHead>
//                   <TableHead>Trainer</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Enrollments</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {filteredCourses.map((c) => (
//                   <TableRow key={c.id}>
//                     <TableCell className="font-medium">{c.name}</TableCell>
//                     <TableCell>{c.category}</TableCell>
//                     <TableCell>{c.trainerName}</TableCell>
//                     <TableCell>
//                       <Badge
//                         variant={
//                           c.status === "PUBLISHED" ? "secondary" : "outline"
//                         }
//                       >
//                         {c.status}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       {c.enrollments}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>

//       {/* CREATE COURSE MODAL (UI unchanged) */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent
//           className="
//             fixed left-1/2 top-1/2
//             -translate-x-1/2 -translate-y-1/2
//             rounded-2xl max-w-md w-full
//             bg-white dark:bg-slate-900
//             border border-slate-200 dark:border-slate-700
//             shadow-xl
//           "
//         >
//           <DialogHeader>
//             <DialogTitle>Create Course</DialogTitle>

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
//             <Input placeholder="Course name" />
//             <Input placeholder="Category" />
//             <Input placeholder="Trainer name" />

//             <div className="flex justify-end gap-2 pt-2">
//               <Button variant="secondary" onClick={() => setOpen(false)}>
//                 Cancel
//               </Button>
//               <Button className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
//                 Create
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default AllCourses;


















import { courseService } from "@/services/courseService";
import {
  ArrowLeft, BookOpen, Folder, Mail, Plus,
  Search, Tag, Users, X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/* ── category chip colours ── */
const CHIP = [
  "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
  "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-400 dark:border-violet-800",
  "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
  "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
  "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800",
  "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-800",
];
const chip = (val) => CHIP[(String(val)?.charCodeAt(0) ?? 0) % CHIP.length];

/* ── course avatar gradient ── */
const GRAD = [
  "from-violet-500 to-purple-600", "from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600",     "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",  "from-indigo-500 to-blue-700",
];
const grad = (val) => GRAD[(String(val)?.charCodeAt(0) ?? 0) % GRAD.length];

/* ================= MAIN ================= */
const AllCourses = () => {
  const navigate = useNavigate();

  const [search, setSearch]   = useState("");
  const [open, setOpen]       = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ── LOAD (unchanged) ── */
  useEffect(() => { loadCourses(); }, []);

  const loadCourses = () => {
    courseService
      .getAllCoursesForAdmin()
      .then((res) => {
        const mapped = res.data.map((c) => ({
          id:          c.id,
          name:        c.title,
          category:    c.category,
          trainerName: c.ownerEmail,
          status:      "PUBLISHED",
          enrollments: 0,
        }));
        setCourses(mapped);
      })
      .catch((err) => console.error("Failed to load courses", err))
      .finally(() => setLoading(false));
  };

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const publishedCount = courses.filter((c) => c.status === "PUBLISHED").length;

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
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5
                text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">All Courses</h1>
              <p className="mt-0.5 text-sm text-blue-100/80">
                Approve, publish and manage all courses on the platform
              </p>
            </div>
          </div>

          {/* stats pills */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
              <BookOpen className="h-4 w-4 text-cyan-200" />
              <span className="text-sm font-semibold text-white">
                {courses.length}
                <span className="ml-1 font-normal text-blue-100/80">Courses</span>
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
              <Users className="h-4 w-4 text-cyan-200" />
              <span className="text-sm font-semibold text-white">
                {publishedCount}
                <span className="ml-1 font-normal text-blue-100/80">Published</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ ACTION BAR ═══════ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* search */}
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900
              border-slate-200 dark:border-slate-800 text-sm"
          />
        </div>

        {/* right buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/admin/categories")}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200
              dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2
              text-sm font-medium text-slate-600 dark:text-slate-300
              hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Folder className="h-4 w-4 text-blue-500" /> Categories
          </button>

        
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
              Course List
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {filteredCourses.length} course{filteredCourses.length !== 1 && "s"} found
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
                    <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                    <div className="space-y-2">
                      <div className="h-3 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
                      <div className="h-2.5 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                  </div>
                  <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
              ))}
            </div>
          )}

          {/* empty state */}
          {!loading && filteredCourses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800
                flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">No courses available</p>
              <p className="text-xs text-slate-400">Courses created by trainers will appear here</p>
            </div>
          )}

          {/* table */}
          {!loading && filteredCourses.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 dark:bg-slate-800/60
                  border-b border-slate-100 dark:border-slate-800">
                  <TableHead className="pl-6 py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">#</TableHead>
                  <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Course</TableHead>
                  <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Category</TableHead>
                  <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Trainer</TableHead>
                  <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Status</TableHead>
                  <TableHead className="pr-6 py-3 text-right text-[11px] uppercase tracking-wider font-semibold text-slate-500">Enrollments</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCourses.map((c, index) => (
                  <TableRow
                    key={c.id}
                    className="group border-b border-slate-100 dark:border-slate-800/60
                      hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* # */}
                    <TableCell className="pl-6 py-3.5 text-sm text-slate-400 font-medium w-10">
                      {String(index + 1).padStart(2, "0")}
                    </TableCell>

                    {/* Course */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${grad(c.name)}
                          flex items-center justify-center text-white shrink-0`}>
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100
                          group-hover:text-blue-600 transition-colors">
                          {c.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border
                        px-2.5 py-0.5 text-[11px] font-semibold ${chip(c.category)}`}>
                        <Tag className="h-3 w-3" />
                        {c.category || "—"}
                      </span>
                    </TableCell>

                    {/* Trainer */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Mail className="h-3 w-3 shrink-0" />
                        {c.trainerName}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full border
                        bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800
                        px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {c.status}
                      </span>
                    </TableCell>

                    {/* Enrollments */}
                    <TableCell className="pr-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5
                        text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        {c.enrollments}
                      </div>
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
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-sm font-bold text-white">Create Course</DialogTitle>
                  <p className="text-[11px] text-blue-100/70">Fill in the details below</p>
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
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Course Name</label>
              <Input placeholder="e.g. React for Beginners" className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Category</label>
              <Input placeholder="e.g. Web Development" className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Trainer Name</label>
              <Input placeholder="trainer@example.com" className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
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

export default AllCourses;