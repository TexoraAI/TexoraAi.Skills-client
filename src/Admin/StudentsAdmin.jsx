








// import axios from "axios";
// import { RefreshCcw, Trash2, UserPlus } from "lucide-react";
// import { useEffect, useState } from "react";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// const API_BASE = "http://localhost:9000/api";

// const authHeaders = () => ({
//   Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
// });

// const StudentsAdmin = () => {
//   const [students, setStudents] = useState([]);
//   const [search, setSearch] = useState("");
//   const [userId, setUserId] = useState("");
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ================= LOAD ================= */
//   const loadStudents = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(API_BASE/students, { headers: authHeaders() });
//       setStudents(res.data);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         alert("Unauthorized. Please login again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadStudents();
//   }, []);

//   /* ================= ADD ================= */
//   const addStudent = async () => {
//     if (!userId || !email) {
//       alert("Enter User ID and Email");
//       return;
//     }

//     try {
//       await axios.post(
//         API_BASE/students,
//         { userId: Number(userId), email },
//         { headers: authHeaders() }
//       );

//       setUserId("");
//       setEmail("");
//       loadStudents();
//     } catch {
//       alert("Student already exists or error occurred");
//     }
//   };

//   /* ================= STATUS ================= */
//   const toggleStatus = async (id, status) => {
//     const next = status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

//     try {
//       await axios.put(
//         `${API_BASE}/students/${id}/status`,
//         null,
//         { params: { status: next }, headers: authHeaders() }
//       );
//       loadStudents();
//     } catch {
//       alert("Failed to update status");
//     }
//   };

//   /* ================= DELETE ================= */
//   const deleteStudent = async (id) => {
//     if (!window.confirm("Delete this student?")) return;

//     try {
//       await axios.delete(`${API_BASE}/students/${id}`, {
//         headers: authHeaders(),
//       });
//       loadStudents();
//     } catch {
//       alert("Failed to delete student");
//     }
//   };

//   const filtered = students.filter((s) =>
//     s.userId.toString().includes(search)
//   );

//   return (
//     <div
//       className="space-y-6 min-h-screen p-6
//       bg-slate-50 dark:bg-gradient-to-br dark:from-[#05070d] dark:to-[#0b1220]"
//     >
//       {/* ================= HERO ================= */}
//       <div
//         className="rounded-2xl p-6 text-white shadow-lg
//         bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600"
//       >
//         <h1 className="text-2xl font-bold">Students</h1>
//         <p className="mt-1 text-sm opacity-90">
//           Manage student access, status and activity
//         </p>
//       </div>

//       {/* ================= ACTION BAR ================= */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
//         <Input
//           placeholder="Search by User ID..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="lg:w-64 h-9"
//         />

//         <div className="flex flex-wrap gap-2">
//           <Input
//             type="number"
//             placeholder="User ID"
//             value={userId}
//             onChange={(e) => setUserId(e.target.value)}
//             className="w-28 h-9"
//           />

//           <Input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-56 h-9"
//           />

//           <Button
//             className="h-9 px-4 bg-gradient-to-r from-cyan-500 to-blue-600"
//             onClick={addStudent}
//           >
//             <UserPlus className="h-4 w-4 mr-1.5" />
//             Add
//           </Button>
//         </div>
//       </div>

//       {/* ================= TABLE ================= */}
//       <Card className="border border-slate-200 dark:border-slate-800">
//         <CardHeader className="py-3">
//           <CardTitle className="text-sm">Student List</CardTitle>
//         </CardHeader>

//         <CardContent className="p-0">
//           {loading ? (
//             <p className="p-4 text-sm text-muted-foreground">
//               Loading...
//             </p>
//           ) : filtered.length === 0 ? (
//             <p className="p-4 text-sm text-muted-foreground">
//               No students found
//             </p>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow className="text-xs">
//                   <TableHead>User ID</TableHead>
//                   <TableHead>Email</TableHead>
//                   <TableHead>Joined</TableHead>
//                   <TableHead>Last Active</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {filtered.map((s) => (
//                   <TableRow key={s.id} className="text-sm">
//                     <TableCell>{s.userId}</TableCell>
//                     <TableCell>{s.email}</TableCell>
//                     <TableCell>
//                       {new Date(s.joinedAt).toLocaleDateString()}
//                     </TableCell>
//                     <TableCell>
//                       {s.lastActiveAt
//                         ? new Date(s.lastActiveAt).toLocaleDateString()
//                         : "—"}
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         variant={
//                           s.status === "ACTIVE"
//                             ? "secondary"
//                             : "destructive"
//                         }
//                         className="text-xs"
//                       >
//                         {s.status}
//                       </Badge>
//                     </TableCell>

//                     <TableCell className="text-right space-x-1">
//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={() =>
//                           toggleStatus(s.id, s.status)
//                         }
//                       >
//                         <RefreshCcw className="h-4 w-4 text-blue-600" />
//                       </Button>

//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={() => deleteStudent(s.id)}
//                       >
//                         <Trash2 className="h-4 w-4 text-red-500" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default StudentsAdmin;









// import axios from "axios";
// import { RefreshCcw, Trash2, UserPlus } from "lucide-react";
// import { useEffect, useState } from "react";
// import { ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// const API_BASE =  import.meta.env.VITE_API_BASE_URL ||"http://localhost:9000/api";

// const authHeaders = () => ({
//   Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
// });

// const StudentsAdmin = () => {
//   const navigate = useNavigate();   
//   const [students, setStudents] = useState([]);
//   const [search, setSearch] = useState("");
//   const [userId, setUserId] = useState("");
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ================= LOAD ================= */
//   const loadStudents = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.get(`${API_BASE}/students`, {
//         headers: authHeaders(),
//       });

//       const data = res?.data;

//       setStudents(Array.isArray(data) ? data : data?.data || []);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         alert("Unauthorized. Please login again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadStudents();
//   }, []);

//   /* ================= ADD ================= */
//   const addStudent = async () => {
//     if (!userId || !email) {
//       alert("Enter User ID and Email");
//       return;
//     }

//     try {
//       await axios.post(
//         `${API_BASE}/students`,
//         { userId: Number(userId), email },
//         { headers: authHeaders() }
//       );

//       setUserId("");
//       setEmail("");

//       loadStudents();
//     } catch {
//       alert("Student already exists or error occurred");
//     }
//   };

//   /* ================= STATUS ================= */
//   const toggleStatus = async (id, status) => {
//     const next = status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

//     try {
//       await axios.put(
//         `${API_BASE}/students/${id}/status`,
//         null,
//         { params: { status: next }, headers: authHeaders() }
//       );

//       loadStudents();
//     } catch {
//       alert("Failed to update status");
//     }
//   };

//   /* ================= DELETE ================= */
//   const deleteStudent = async (id) => {
//     if (!window.confirm("Delete this student?")) return;

//     try {
//       await axios.delete(`${API_BASE}/students/${id}`, {
//         headers: authHeaders(),
//       });

//       loadStudents();
//     } catch {
//       alert("Failed to delete student");
//     }
//   };

//   const filtered = Array.isArray(students)
//     ? students.filter((s) =>
//         s?.userId?.toString().includes(search)
//       )
//     : [];

//   return (
//     <div
//       className="space-y-6 min-h-screen p-6
//       bg-slate-50 dark:bg-gradient-to-br dark:from-[#05070d] dark:to-[#0b1220]"
//     >
//       <div
//   className="rounded-2xl p-6 text-white shadow-lg
//   bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600"
// >
//   <div className="flex items-center gap-3">

//     {/* BACK BUTTON */}
//     <button
//       onClick={() => navigate(-1)}
//       className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
//     >
//       <ArrowLeft className="w-5 h-5" />
//     </button>

//     {/* TITLE */}
//     <div>
//       <h1 className="text-2xl font-bold">Students</h1>
//       <p className="text-sm opacity-90">
//         Manage student access, status and activity
//       </p>
//     </div>

//   </div>
// </div>

//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
//         <Input
//           placeholder="Search by User ID..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="lg:w-64 h-9"
//         />

//         <div className="flex flex-wrap gap-2">
//           <Input
//             type="number"
//             placeholder="User ID"
//             value={userId}
//             onChange={(e) => setUserId(e.target.value)}
//             className="w-28 h-9"
//           />

//           <Input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-56 h-9"
//           />

//           <Button
//             className="h-9 px-4 bg-gradient-to-r from-cyan-500 to-blue-600"
//             onClick={addStudent}
//           >
//             <UserPlus className="h-4 w-4 mr-1.5" />
//             Add
//           </Button>
//         </div>
//       </div>

//       <Card className="border border-slate-200 dark:border-slate-800">
//         <CardHeader className="py-3">
//           <CardTitle className="text-sm">Student List</CardTitle>
//         </CardHeader>

//         <CardContent className="p-0">
//           {loading ? (
//             <p className="p-4 text-sm text-muted-foreground">
//               Loading...
//             </p>
//           ) : filtered.length === 0 ? (
//             <p className="p-4 text-sm text-muted-foreground">
//               No students found
//             </p>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow className="text-xs">
//                   <TableHead>User ID</TableHead>
//                   <TableHead>Email</TableHead>
//                   <TableHead>Joined</TableHead>
//                   <TableHead>Last Active</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {filtered.map((s) => (
//                   <TableRow key={s.id} className="text-sm">
//                     <TableCell>{s.userId}</TableCell>
//                     <TableCell>{s.email}</TableCell>
//                     <TableCell>
//                       {new Date(s.joinedAt).toLocaleDateString()}
//                     </TableCell>
//                     <TableCell>
//                       {s.lastActiveAt
//                         ? new Date(s.lastActiveAt).toLocaleDateString()
//                         : "—"}
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         variant={
//                           s.status === "ACTIVE"
//                             ? "secondary"
//                             : "destructive"
//                         }
//                         className="text-xs"
//                       >
//                         {s.status}
//                       </Badge>
//                     </TableCell>

//                     <TableCell className="text-right space-x-1">
//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={() =>
//                           toggleStatus(s.id, s.status)
//                         }
//                       >
//                         <RefreshCcw className="h-4 w-4 text-blue-600" />
//                       </Button>

//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={() => deleteStudent(s.id)}
//                       >
//                         <Trash2 className="h-4 w-4 text-red-500" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default StudentsAdmin;






















import axios from "axios";
import {
  ArrowLeft, CalendarDays, Clock, Mail, RefreshCcw,
  Search, Shield, ShieldOff, Trash2, UserPlus, Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("lms_token")}` });

/* ── nav tabs (same as AllUsers) ── */
const TABS = [
  { label: "All Users",     path: "/admin/users"         },
  { label: "Students",      path: "/admin/students"      },
  { label: "Trainers",      path: "/admin/trainers"      },
  { label: "Pending Users", path: "/admin/pending-users" },
];

/* ── gradient pool ── */
const GRAD = [
  "from-violet-500 to-purple-600", "from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600",     "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",  "from-indigo-500 to-blue-700",
];
const grad = (val) => GRAD[(String(val)?.charCodeAt(0) ?? 0) % GRAD.length];

/* ================= MAIN ================= */
const StudentsAdmin = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch]     = useState("");
  const [userId, setUserId]     = useState("");
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);

  /* ── LOAD (unchanged) ── */
  const loadStudents = async () => {
    try {
      setLoading(true);
      const res  = await axios.get(`${API_BASE}/students`, { headers: authHeaders() });
      const data = res?.data;
      setStudents(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      if (err.response?.status === 401) alert("Unauthorized. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStudents(); }, []);

  /* ── ADD (unchanged) ── */
  const addStudent = async () => {
    if (!userId || !email) { alert("Enter User ID and Email"); return; }
    try {
      await axios.post(`${API_BASE}/students`, { userId: Number(userId), email }, { headers: authHeaders() });
      setUserId(""); setEmail("");
      loadStudents();
    } catch { alert("Student already exists or error occurred"); }
  };

  /* ── TOGGLE STATUS (unchanged) ── */
  const toggleStatus = async (id, status) => {
    const next = status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    try {
      await axios.put(`${API_BASE}/students/${id}/status`, null, { params: { status: next }, headers: authHeaders() });
      loadStudents();
    } catch { alert("Failed to update status"); }
  };

  /* ── DELETE (unchanged) ── */
  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await axios.delete(`${API_BASE}/students/${id}`, { headers: authHeaders() });
      loadStudents();
    } catch { alert("Failed to delete student"); }
  };

  const filtered = Array.isArray(students)
    ? students.filter((s) => s?.userId?.toString().includes(search) || s?.email?.toLowerCase().includes(search.toLowerCase()))
    : [];

  const activeCount  = students.filter((s) => s.status === "ACTIVE").length;
  const blockedCount = students.filter((s) => s.status === "BLOCKED").length;

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
              <h1 className="text-2xl font-bold tracking-tight text-white">Students</h1>
              <p className="mt-0.5 text-sm text-blue-100/80">Manage student access, status and activity</p>
            </div>
          </div>

          {/* stats pills */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
              <Users className="h-4 w-4 text-cyan-200" />
              <span className="text-sm font-semibold text-white">
                {students.length}
                <span className="ml-1 font-normal text-blue-100/80">Total</span>
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
              <Shield className="h-4 w-4 text-emerald-300" />
              <span className="text-sm font-semibold text-white">
                {activeCount}
                <span className="ml-1 font-normal text-blue-100/80">Active</span>
              </span>
            </div>
            {blockedCount > 0 && (
              <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
                <ShieldOff className="h-4 w-4 text-red-300" />
                <span className="text-sm font-semibold text-white">
                  {blockedCount}
                  <span className="ml-1 font-normal text-blue-100/80">Blocked</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════ ACTION BAR ═══════ */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        {/* nav tabs */}
        <div className="flex flex-wrap gap-1.5 rounded-xl bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
          {TABS.map(({ label, path }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all
                  ${active
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* search */}
        <div className="relative md:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by ID or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900
              border-slate-200 dark:border-slate-800 text-sm"
          />
        </div>
      </div>

      {/* ═══════ ADD STUDENT CARD ═══════ */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200
        dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

        <CardHeader className="border-b border-slate-100 dark:border-slate-800
          bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-blue-500" />
            </div>
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Add Student
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="px-6 py-4">
          <div className="flex flex-wrap gap-2 items-end">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">User ID</label>
              <Input
                type="number"
                placeholder="e.g. 1042"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-32 h-10 rounded-xl border-slate-200 dark:border-slate-700
                  bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email</label>
              <Input
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-xl border-slate-200 dark:border-slate-700
                  bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <button
              onClick={addStudent}
              className="flex items-center gap-1.5 rounded-xl h-10
                bg-gradient-to-r from-blue-600 to-cyan-500 px-5
                text-sm font-semibold text-white shadow
                hover:opacity-90 hover:scale-105 transition-all"
            >
              <UserPlus className="h-4 w-4" /> Add Student
            </button>
          </div>
        </CardContent>
      </Card>

      {/* ═══════ TABLE CARD ═══════ */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200
        dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

        <CardHeader className="border-b border-slate-100 dark:border-slate-800
          bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Student List
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {filtered.length} record{filtered.length !== 1 && "s"} found
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-2">
              {[1,2,3].map((i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl
                  border border-slate-100 dark:border-slate-800 p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                      <div className="h-2.5 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                  </div>
                  <div className="h-7 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Users className="h-7 w-7 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">No students found</p>
              <p className="text-xs text-slate-400">Add a student using the form above</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 dark:bg-slate-800/60
                  border-b border-slate-100 dark:border-slate-800">
                  <TableHead className="pl-6 py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Student</TableHead>
                  <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">User ID</TableHead>
                  <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Joined</TableHead>
                  <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Last Active</TableHead>
                  <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Status</TableHead>
                  <TableHead className="pr-6 py-3 text-right text-[11px] uppercase tracking-wider font-semibold text-slate-500">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((s) => (
                  <TableRow
                    key={s.id}
                    className="group border-b border-slate-100 dark:border-slate-800/60
                      hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Student */}
                    <TableCell className="pl-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${grad(s.email)}
                          flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0`}>
                          {s.email?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <Mail className="h-3 w-3" />
                          <span className="font-medium text-slate-700 dark:text-slate-300">{s.email}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* User ID */}
                    <TableCell className="py-3.5">
                      <span className="inline-flex items-center rounded-lg
                        bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5
                        text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">
                        #{s.userId}
                      </span>
                    </TableCell>

                    {/* Joined */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(s.joinedAt).toLocaleDateString()}
                      </div>
                    </TableCell>

                    {/* Last Active */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        {s.lastActiveAt ? new Date(s.lastActiveAt).toLocaleDateString() : "—"}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3.5">
                      {s.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border
                          bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800
                          px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border
                          bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800
                          px-2.5 py-0.5 text-[11px] font-semibold text-red-600 dark:text-red-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          Blocked
                        </span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-6 py-3.5 text-right">
                      <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleStatus(s.id, s.status)}
                          title={s.status === "ACTIVE" ? "Block student" : "Unblock student"}
                          className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors
                            ${s.status === "ACTIVE"
                              ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900"
                              : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                            }`}
                        >
                          <RefreshCcw className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => deleteStudent(s.id)}
                          className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-950/50
                            flex items-center justify-center text-red-500
                            hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
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

export default StudentsAdmin;