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

// const TrainersAdmin = () => {
//   const [trainers, setTrainers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     expertise: "",
//   });

//   /* ================= LOAD ================= */
//   const loadTrainers = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(API_BASE/trainers, { headers: authHeaders() });
//       setTrainers(res.data);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         alert("Unauthorized. Please login again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadTrainers();
//   }, []);

//   /* ================= ADD ================= */
//   const addTrainer = async () => {
//     if (!form.name || !form.email || !form.expertise) {
//       alert("Fill all fields");
//       return;
//     }

//     try {
//       await axios.post(API_BASE/trainers, form, { headers: authHeaders() });
//       setForm({ name: "", email: "", expertise: "" });
//       loadTrainers();
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to add trainer");
//     }
//   };

//   /* ================= STATUS ================= */
//   const toggleStatus = async (id, status) => {
//     const next = status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

//     try {
//       await axios.put(
//         `${API_BASE}/trainers/${id}/status`,
//         null,
//         { params: { status: next }, headers: authHeaders() }
//       );
//       loadTrainers();
//     } catch {
//       alert("Failed to update status");
//     }
//   };

//   /* ================= DELETE ================= */
//   const deleteTrainer = async (id) => {
//     if (!window.confirm("Delete trainer?")) return;

//     try {
//       await axios.delete(`${API_BASE}/trainers/${id}`, {
//         headers: authHeaders(),
//       });
//       loadTrainers();
//     } catch {
//       alert("Failed to delete trainer");
//     }
//   };

//   const filtered = trainers.filter((t) =>
//     t.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="space-y-8">
//       {/* HERO */}
//       <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
//         <h1 className="text-3xl font-bold">Trainers</h1>
//         <p className="mt-2 text-sm opacity-90">
//           Manage trainers, expertise and access status
//         </p>
//       </div>

//       {/* ACTION BAR */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
//         <Input
//           placeholder="Search trainers..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="lg:w-64"
//         />

//         <div className="flex flex-wrap gap-2">
//           <Input
//             placeholder="Name"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             className="w-40"
//           />
//           <Input
//             placeholder="Email"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//             className="w-56"
//           />
//           <Input
//             placeholder="Expertise"
//             value={form.expertise}
//             onChange={(e) => setForm({ ...form, expertise: e.target.value })}
//             className="w-40"
//           />

//           <Button
//             onClick={addTrainer}
//             className="bg-indigo-600 hover:bg-indigo-500"
//           >
//             <UserPlus className="h-4 w-4 mr-2" />
//             Add
//           </Button>
//         </div>
//       </div>

//       {/* TABLE */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-sm">Trainer List</CardTitle>
//         </CardHeader>

//         <CardContent>
//           {loading ? (
//             <p className="text-sm text-muted-foreground">Loading...</p>
//           ) : filtered.length === 0 ? (
//             <p className="text-sm text-muted-foreground">
//               No trainers found
//             </p>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Email</TableHead>
//                   <TableHead>Expertise</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {filtered.map((t) => (
//                   <TableRow key={t.id}>
//                     <TableCell>{t.name}</TableCell>
//                     <TableCell>{t.email}</TableCell>
//                     <TableCell>{t.expertise}</TableCell>

//                     <TableCell>
//                       <Badge
//                         variant={
//                           t.status === "ACTIVE"
//                             ? "secondary"
//                             : "destructive"
//                         }
//                       >
//                         {t.status}
//                       </Badge>
//                     </TableCell>

//                     <TableCell className="text-right space-x-2">
//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={() => toggleStatus(t.id, t.status)}
//                       >
//                         <RefreshCcw className="h-4 w-4" />
//                       </Button>

//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={() => deleteTrainer(t.id)}
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

// export default TrainersAdmin;





// import axios from "axios";
// import { RefreshCcw, Trash2, UserPlus, ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
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

// const API_BASE =  import.meta.env.VITE_API_BASE_URL ||"http://localhost:9000/api";

// const authHeaders = () => ({
//   Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
// });

// const TrainersAdmin = () => {
//   const navigate = useNavigate(); 
//   const [trainers, setTrainers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     expertise: "",
//   });

//   const loadTrainers = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.get(`${API_BASE}/trainers`, {
//         headers: authHeaders(),
//       });

//       const data = res?.data;

//       setTrainers(Array.isArray(data) ? data : data?.data || []);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         alert("Unauthorized. Please login again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadTrainers();
//   }, []);

//   const addTrainer = async () => {
//     if (!form.name || !form.email || !form.expertise) {
//       alert("Fill all fields");
//       return;
//     }

//     try {
//       await axios.post(`${API_BASE}/trainers`, form, {
//         headers: authHeaders(),
//       });

//       setForm({ name: "", email: "", expertise: "" });

//       loadTrainers();
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to add trainer");
//     }
//   };

//   const toggleStatus = async (id, status) => {
//     const next = status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

//     try {
//       await axios.put(
//         `${API_BASE}/trainers/${id}/status`,
//         null,
//         { params: { status: next }, headers: authHeaders() }
//       );

//       loadTrainers();
//     } catch {
//       alert("Failed to update status");
//     }
//   };

//   const deleteTrainer = async (id) => {
//     if (!window.confirm("Delete trainer?")) return;

//     try {
//       await axios.delete(`${API_BASE}/trainers/${id}`, {
//         headers: authHeaders(),
//       });

//       loadTrainers();
//     } catch {
//       alert("Failed to delete trainer");
//     }
//   };

//   const filtered = Array.isArray(trainers)
//     ? trainers.filter((t) =>
//         t?.name?.toLowerCase().includes(search.toLowerCase())
//       )
//     : [];

//   return (
//     <div className="space-y-8">
//      <div className="rounded-2xl p-6 text-white shadow-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
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
//       <h1 className="text-2xl font-bold">Trainers</h1>
//       <p className="text-sm opacity-90">
//         Manage trainers, expertise and access status
//       </p>
//     </div>

//   </div>
// </div>

//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
//         <Input
//           placeholder="Search trainers..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="lg:w-64"
//         />

//         <div className="flex flex-wrap gap-2">
//           <Input
//             placeholder="Name"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             className="w-40"
//           />
//           <Input
//             placeholder="Email"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//             className="w-56"
//           />
//           <Input
//             placeholder="Expertise"
//             value={form.expertise}
//             onChange={(e) =>
//               setForm({ ...form, expertise: e.target.value })
//             }
//             className="w-40"
//           />

//           <Button
//             onClick={addTrainer}
//             className="bg-indigo-600 hover:bg-indigo-500"
//           >
//             <UserPlus className="h-4 w-4 mr-2" />
//             Add
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="text-sm">Trainer List</CardTitle>
//         </CardHeader>

//         <CardContent>
//           {loading ? (
//             <p className="text-sm text-muted-foreground">Loading...</p>
//           ) : filtered.length === 0 ? (
//             <p className="text-sm text-muted-foreground">
//               No trainers found
//             </p>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Email</TableHead>
//                   <TableHead>Expertise</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {filtered.map((t) => (
//                   <TableRow key={t.id}>
//                     <TableCell>{t.name}</TableCell>
//                     <TableCell>{t.email}</TableCell>
//                     <TableCell>{t.expertise}</TableCell>

//                     <TableCell>
//                       <Badge
//                         variant={
//                           t.status === "ACTIVE"
//                             ? "secondary"
//                             : "destructive"
//                         }
//                       >
//                         {t.status}
//                       </Badge>
//                     </TableCell>

//                     <TableCell className="text-right space-x-2">
//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={() => toggleStatus(t.id, t.status)}
//                       >
//                         <RefreshCcw className="h-4 w-4" />
//                       </Button>

//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={() => deleteTrainer(t.id)}
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

// export default TrainersAdmin;






































import axios from "axios";
import {
  ArrowLeft, BookOpen, CalendarDays, Mail, RefreshCcw,
  Search, Shield, ShieldOff, Trash2, UserPlus, Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const API_BASE  = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("lms_token")}` });

/* ── nav tabs ── */
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

/* ── expertise chip colours ── */
const CHIP = [
  "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
  "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-400 dark:border-violet-800",
  "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
  "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
  "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800",
];
const chip = (val) => CHIP[(String(val)?.charCodeAt(0) ?? 0) % CHIP.length];

/* ================= MAIN ================= */
const TrainersAdmin = () => {
  const navigate = useNavigate();

  const [trainers, setTrainers] = useState([]);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [form, setForm]         = useState({ name: "", email: "", expertise: "" });

  /* ── LOAD (unchanged) ── */
  const loadTrainers = async () => {
    try {
      setLoading(true);
      const res  = await axios.get(`${API_BASE}/trainers`, { headers: authHeaders() });
      const data = res?.data;
      setTrainers(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      if (err.response?.status === 401) alert("Unauthorized. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTrainers(); }, []);

  /* ── ADD (unchanged) ── */
  const addTrainer = async () => {
    if (!form.name || !form.email || !form.expertise) { alert("Fill all fields"); return; }
    try {
      await axios.post(`${API_BASE}/trainers`, form, { headers: authHeaders() });
      setForm({ name: "", email: "", expertise: "" });
      loadTrainers();
    } catch (err) { alert(err.response?.data?.message || "Failed to add trainer"); }
  };

  /* ── TOGGLE STATUS (unchanged) ── */
  const toggleStatus = async (id, status) => {
    const next = status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    try {
      await axios.put(`${API_BASE}/trainers/${id}/status`, null, { params: { status: next }, headers: authHeaders() });
      loadTrainers();
    } catch { alert("Failed to update status"); }
  };

  /* ── DELETE (unchanged) ── */
  const deleteTrainer = async (id) => {
    if (!window.confirm("Delete trainer?")) return;
    try {
      await axios.delete(`${API_BASE}/trainers/${id}`, { headers: authHeaders() });
      loadTrainers();
    } catch { alert("Failed to delete trainer"); }
  };

  const filtered = Array.isArray(trainers)
    ? trainers.filter((t) =>
        t?.name?.toLowerCase().includes(search.toLowerCase()) ||
        t?.email?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const activeCount  = trainers.filter((t) => t.status === "ACTIVE").length;
  const blockedCount = trainers.filter((t) => t.status === "BLOCKED").length;

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
              <h1 className="text-2xl font-bold tracking-tight text-white">Trainers</h1>
              <p className="mt-0.5 text-sm text-blue-100/80">Manage trainers, expertise and access status</p>
            </div>
          </div>

          {/* stats pills */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
              <Users className="h-4 w-4 text-cyan-200" />
              <span className="text-sm font-semibold text-white">
                {trainers.length}
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
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900
              border-slate-200 dark:border-slate-800 text-sm"
          />
        </div>
      </div>

      {/* ═══════ ADD TRAINER CARD ═══════ */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200
        dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

        <CardHeader className="border-b border-slate-100 dark:border-slate-800
          bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-indigo-500" />
            </div>
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Add Trainer
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="px-6 py-5">
          <div className="flex flex-wrap gap-3 items-end">

            <div className="space-y-1.5 min-w-[140px]">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Full Name</label>
              <Input
                placeholder="e.g. Arjun Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-10 rounded-xl border-slate-200 dark:border-slate-700
                  bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="space-y-1.5 flex-1 min-w-[180px]">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email</label>
              <Input
                type="email"
                placeholder="trainer@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-10 rounded-xl border-slate-200 dark:border-slate-700
                  bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="space-y-1.5 min-w-[140px]">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Expertise</label>
              <Input
                placeholder="e.g. React, Node.js"
                value={form.expertise}
                onChange={(e) => setForm({ ...form, expertise: e.target.value })}
                className="h-10 rounded-xl border-slate-200 dark:border-slate-700
                  bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <button
              onClick={addTrainer}
              className="flex items-center gap-1.5 h-10 rounded-xl
                bg-gradient-to-r from-blue-600 to-cyan-500 px-5
                text-sm font-semibold text-white shadow
                hover:opacity-90 hover:scale-105 transition-all"
            >
              <UserPlus className="h-4 w-4" /> Add Trainer
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
              Trainer List
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
                      <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                      <div className="h-2.5 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
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
              <p className="text-sm font-medium text-slate-500">No trainers found</p>
              <p className="text-xs text-slate-400">Add a trainer using the form above</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 dark:bg-slate-800/60
                  border-b border-slate-100 dark:border-slate-800">
                  <TableHead className="pl-6 py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">#</TableHead>
                  <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Trainer</TableHead>
                  <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Expertise</TableHead>
                  <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Status</TableHead>
                  <TableHead className="pr-6 py-3 text-right text-[11px] uppercase tracking-wider font-semibold text-slate-500">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((t, index) => (
                  <TableRow
                    key={t.id}
                    className="group border-b border-slate-100 dark:border-slate-800/60
                      hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* # */}
                    <TableCell className="pl-6 py-3.5 text-sm text-slate-400 font-medium w-10">
                      {String(index + 1).padStart(2, "0")}
                    </TableCell>

                    {/* Trainer */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${grad(t.name)}
                          flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0`}>
                          {t.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100
                            group-hover:text-blue-600 transition-colors">
                            {t.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <Mail className="h-3 w-3" />
                            {t.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Expertise */}
                    <TableCell className="py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border
                        px-2.5 py-0.5 text-[11px] font-semibold ${chip(t.expertise)}`}>
                        <BookOpen className="h-3 w-3" />
                        {t.expertise}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3.5">
                      {t.status === "ACTIVE" ? (
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
                          onClick={() => toggleStatus(t.id, t.status)}
                          title={t.status === "ACTIVE" ? "Block trainer" : "Unblock trainer"}
                          className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors
                            ${t.status === "ACTIVE"
                              ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900"
                              : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                            }`}
                        >
                          <RefreshCcw className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => deleteTrainer(t.id)}
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

export default TrainersAdmin;