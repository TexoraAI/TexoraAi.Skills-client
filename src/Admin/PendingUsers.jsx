
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import authService from "../services/authService";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

// export default function PendingUsers() {
//   const [selectedRole, setSelectedRole] = useState("students"); // students/trainers/business/admins
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ✅ role wise endpoint map
//   const endpointMap = {
//     students: "/api/admin/approval/students/pending",
//     trainers: "/api/admin/approval/trainers/pending",
//     business: "/api/admin/approval/business/pending",
//     admins: "/api/admin/approval/admins/pending",
//   };

//   const approveMap = {
//     students: "/api/admin/approval/students/approve",
//     trainers: "/api/admin/approval/trainers/approve",
//     business: "/api/admin/approval/business/approve",
//     admins: "/api/admin/approval/admins/approve",
//   };

//   const rejectMap = {
//     students: "/api/admin/approval/students/reject",
//     trainers: "/api/admin/approval/trainers/reject",
//     business: "/api/admin/approval/business/reject",
//     admins: "/api/admin/approval/admins/reject",
//   };

//   const fetchPending = async (roleKey) => {
//     try {
//       setLoading(true);

//       const token = authService.getToken();

//       const res = await axios.get(`${API_BASE_URL}${endpointMap[roleKey]}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setUsers(res.data || []);
//     } catch (err) {
//       console.error("❌ fetchPending error:", err);
//       alert("❌ Failed to load pending approvals");
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPending(selectedRole);
//   }, [selectedRole]);

//   const approveUser = async (id) => {
//     try {
//       const token = authService.getToken();

//       await axios.put(
//         `${API_BASE_URL}${approveMap[selectedRole]}/${id}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       alert("✅ Approved Successfully");
//       fetchPending(selectedRole);
//     } catch (err) {
//       console.error("❌ approveUser error:", err);
//       alert("❌ Approve failed");
//     }
//   };

//   const rejectUser = async (id) => {
//     try {
//       const token = authService.getToken();

//       await axios.delete(`${API_BASE_URL}${rejectMap[selectedRole]}/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       alert("❌ Rejected Successfully");
//       fetchPending(selectedRole);
//     } catch (err) {
//       console.error("❌ rejectUser error:", err);
//       alert("❌ Reject failed");
//     }
//   };

//   const titleMap = {
//     students: "Students",
//     trainers: "Trainers",
//     business: "Business Team",
//     admins: "Admins",
//   };

//   return (
//     <div className="p-6">
//       {/* HEADER */}
//       <div className="flex items-center justify-between mb-5">
//         <div>
//           <h1 className="text-2xl font-bold text-white">Pending Approvals</h1>
//           <p className="text-sm text-gray-400">
//             Approve or reject pending users
//           </p>
//         </div>

//         {/* DROPDOWN */}
//         <select
//           value={selectedRole}
//           onChange={(e) => setSelectedRole(e.target.value)}
//           className="px-4 py-2 rounded-lg border border-gray-600 bg-white text-black"
//         >
//           <option value="students">Students</option>
//           <option value="trainers">Trainers</option>
//           <option value="business">Business Team</option>
//           <option value="admins">Admins</option>
//         </select>
//       </div>

//       {/* LOADING */}
//       {loading && <p className="text-gray-300">Loading...</p>}

//       {/* EMPTY */}
//       {!loading && users.length === 0 && (
//         <p className="text-gray-400">No pending {titleMap[selectedRole]} 🎉</p>
//       )}

//       {/* LIST */}
//       <div className="space-y-3">
//         {users.map((u) => (
//           <div
//             key={u.userId || u.id}
//             className="flex items-center justify-between border border-gray-700 p-4 rounded-lg bg-white shadow"
//           >
//             <div>
//               <p className="font-semibold text-black">{u.name}</p>
//               <p className="text-sm text-gray-600">{u.email}</p>
//             </div>

//             <div className="flex gap-2">
//               <button
//                 onClick={() => approveUser(u.userId || u.id)}
//                 className="px-4 py-2 bg-green-600 text-white rounded"
//               >
//                 Approve
//               </button>
//               <button
//                 onClick={() => rejectUser(u.userId || u.id)}
//                 className="px-4 py-2 bg-red-600 text-white rounded"
//               >
//                 Reject
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }







// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Check, Users, X, ArrowLeft } from "lucide-react";
// import { useEffect, useState } from "react";
// import authService from "../services/authService";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// export default function PendingUsers() {
//   const navigate = useNavigate(); 
//   const [selectedRole, setSelectedRole] = useState("students");
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   /* ================= MAPS ================= */
//   const endpointMap = {
//     students: "/admin/approval/students/pending",
//     trainers: "/admin/approval/trainers/pending",
//     business: "/admin/approval/business/pending",
//     admins: "/admin/approval/admins/pending",
//   };

//   const approveMap = {
//     students: "/admin/approval/students/approve",
//     trainers: "/admin/approval/trainers/approve",
//     business: "/admin/approval/business/approve",
//     admins: "/admin/approval/admins/approve",
//   };

//   const rejectMap = {
//     students: "/admin/approval/students/reject",
//     trainers: "/admin/approval/trainers/reject",
//     business: "/admin/approval/business/reject",
//     admins: "/admin/approval/admins/reject",
//   };

//   const titleMap = {
//     students: "Students",
//     trainers: "Trainers",
//     business: "Business Team",
//     admins: "Admins",
//   };

//   /* ================= LOAD ================= */
//   const fetchPending = async (roleKey) => {
//     try {
//       setLoading(true);
//       const token = authService.getToken();

//       const res = await axios.get(
//         `${API_BASE_URL}${endpointMap[roleKey]}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setUsers(res.data || []);
//     } catch {
//       setUsers([]);
//       alert("Failed to load pending approvals");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPending(selectedRole);
//   }, [selectedRole]);

//   /* ================= ACTIONS ================= */
//   const approveUser = async (id) => {
//     try {
//       const token = authService.getToken();
//       await axios.put(
//         `${API_BASE_URL}${approveMap[selectedRole]}/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchPending(selectedRole);
//     } catch {
//       alert("Approve failed");
//     }
//   };

//   const rejectUser = async (id) => {
//     try {
//       const token = authService.getToken();
//       await axios.delete(
//         `${API_BASE_URL}${rejectMap[selectedRole]}/${id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchPending(selectedRole);
//     } catch {
//       alert("Reject failed");
//     }
//   };

//   return (
//     <div className="space-y-8">
//       {/* HERO */}
//       <div className="rounded-2xl p-6 text-white shadow-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
//       <div className="flex items-center gap-3">

//     {/* BACK BUTTON */}
//     <button
//       onClick={() => navigate("/admin/users")}
//       className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
//     >
//       <ArrowLeft className="w-5 h-5" />
//     </button>

//     {/* TITLE */}
//     <div>
//       <h1 className="text-2xl font-bold">Pending Approvals</h1>
//       <p className="text-sm opacity-90">
//         Review and approve new users
//       </p>
//     </div>

//   </div>
// </div>

//       {/* FILTER */}
//       <div className="flex justify-between items-center">
//         <div className="flex items-center gap-3">
//           <Users className="h-5 w-5 text-muted-foreground" />
//           <span className="font-semibold">
//             {titleMap[selectedRole]}
//           </span>
//           <Badge variant="secondary">{users.length}</Badge>
//         </div>

//         <Select
//           value={selectedRole}
//           onValueChange={(v) => setSelectedRole(v)}
//         >
//           <SelectTrigger className="
//   w-56
//   bg-white dark:bg-slate-900
//   border border-slate-300 dark:border-slate-700
//   text-slate-700 dark:text-slate-200
//   shadow-sm
// ">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent className="
//   bg-white dark:bg-slate-900
//   border border-slate-200 dark:border-slate-700
//   shadow-xl rounded-xl
// ">
//             <SelectItem value="students" className="hover:bg-blue-50">
//       Students
//     </SelectItem>
//     <SelectItem value="trainers" className="hover:bg-blue-50">
//       Trainers
//     </SelectItem>
//     <SelectItem value="business" className="hover:bg-blue-50">
//       Business Team
//     </SelectItem>
//     <SelectItem value="admins" className="hover:bg-blue-50">
//       Admins
//       </SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* LIST */}
//       <Card className="
//   border border-slate-200 dark:border-slate-800
//   shadow-md hover:shadow-xl hover:-translate-y-[2px]
//   bg-white dark:bg-slate-900/60
//   rounded-2xl
//   transition-all duration-300
// ">
//         <CardHeader>
//           <CardTitle className="text-sm">
//             Pending {titleMap[selectedRole]}
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-3">
//           {loading && (
//             <p className="text-sm text-muted-foreground">
//               Loading...
//             </p>
//           )}

//           {!loading && users.length === 0 && (
//             <div className="text-center py-10 text-slate-500">
//             <p className="text-lg font-medium">🎉 All Caught Up!</p>
//             <p className="text-sm">No pending approvals</p>
//           </div>
//           )}

//           {users.map((u) => (
//            <div
//            key={u.userId || u.id}
//            className="
//              flex items-center justify-between
//              p-4 rounded-2xl
//              bg-white dark:bg-slate-800
//              border border-slate-200 dark:border-slate-700
//              hover:shadow-lg hover:-translate-y-[2px]
//              transition-all duration-200
//            "
//          >
//            {/* LEFT */}
//            <div className="flex items-center gap-4">
         
//              {/* Avatar */}
//              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
//                {u.name?.charAt(0) || "U"}
//              </div>
         
//              <div>
//                <p className="font-medium text-sm">{u.name}</p>
//                <p className="text-xs text-slate-500">{u.email}</p>
//              </div>
//            </div>
         
//            {/* RIGHT */}
//            <div className="flex items-center gap-2">
//              <Button
//                size="sm"
//                className="bg-emerald-600 hover:bg-emerald-500 shadow-sm"
//                onClick={() => approveUser(u.userId || u.id)}
//              >
//                <Check className="h-4 w-4 mr-1" />
//                Approve
//              </Button>
         
//              <Button
//                size="sm"
//                variant="destructive"
//                className="shadow-sm"
//                onClick={() => rejectUser(u.userId || u.id)}
//              >
//                <X className="h-4 w-4 mr-1" />
//                Reject
//              </Button>
//            </div>
//          </div>
//           ))}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }























































import axios from "axios";
import {
  ArrowLeft, Check, CheckCircle2, Clock, Mail,
  Search, Users, X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../services/authService";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

/* ── nav tabs ── */
const TABS = [
  { label: "All Users",     path: "/admin/users"         },
  { label: "Students",      path: "/admin/students"      },
  { label: "Trainers",      path: "/admin/trainers"      },
  { label: "Pending Users", path: "/admin/pending-users" },
];

/* ── role maps (unchanged) ── */
const endpointMap = {
  students: "/admin/approval/students/pending",
  trainers: "/admin/approval/trainers/pending",
  business: "/admin/approval/business/pending",
  admins:   "/admin/approval/admins/pending",
};
const approveMap = {
  students: "/admin/approval/students/approve",
  trainers: "/admin/approval/trainers/approve",
  business: "/admin/approval/business/approve",
  admins:   "/admin/approval/admins/approve",
};
const rejectMap = {
  students: "/admin/approval/students/reject",
  trainers: "/admin/approval/trainers/reject",
  business: "/admin/approval/business/reject",
  admins:   "/admin/approval/admins/reject",
};
const titleMap = {
  students: "Students",
  trainers: "Trainers",
  business: "Business Team",
  admins:   "Admins",
};

/* ── role badge colours ── */
const ROLE_CFG = {
  students: "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  trainers: "bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800",
  business: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  admins:   "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
};

/* ── gradient pool ── */
const GRAD = [
  "from-violet-500 to-purple-600", "from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600",     "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",  "from-indigo-500 to-blue-700",
];
const grad = (val) => GRAD[(String(val)?.charCodeAt(0) ?? 0) % GRAD.length];

/* ================= MAIN ================= */
export default function PendingUsers() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("students");
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(false);
  const [search, setSearch]             = useState("");

  /* ── LOAD (unchanged) ── */
  const fetchPending = async (roleKey) => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const res   = await axios.get(`${API_BASE_URL}${endpointMap[roleKey]}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch {
      setUsers([]);
      alert("Failed to load pending approvals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(selectedRole); }, [selectedRole]);

  /* ── ACTIONS (unchanged) ── */
  const approveUser = async (id) => {
    try {
      const token = authService.getToken();
      await axios.put(`${API_BASE_URL}${approveMap[selectedRole]}/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPending(selectedRole);
    } catch { alert("Approve failed"); }
  };

  const rejectUser = async (id) => {
    try {
      const token = authService.getToken();
      await axios.delete(`${API_BASE_URL}${rejectMap[selectedRole]}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPending(selectedRole);
    } catch { alert("Reject failed"); }
  };

  const filtered = users.filter((u) =>
    (u.name || u.email)?.toLowerCase().includes(search.toLowerCase())
  );

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
              onClick={() => navigate("/admin/users")}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5
                text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Pending Approvals</h1>
              <p className="mt-0.5 text-sm text-blue-100/80">Review and approve new users</p>
            </div>
          </div>

          {/* stats pill */}
          <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
            <Clock className="h-4 w-4 text-amber-300" />
            <span className="text-sm font-semibold text-white">
              {users.length}
              <span className="ml-1 font-normal text-blue-100/80">Pending</span>
            </span>
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

        {/* search + role filter */}
        <div className="flex gap-2">
          <div className="relative md:w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900
                border-slate-200 dark:border-slate-800 text-sm"
            />
          </div>

          <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v)}>
            <SelectTrigger className="h-9 w-40 rounded-xl bg-white dark:bg-slate-900
              border-slate-200 dark:border-slate-800 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700
              bg-white dark:bg-slate-900 shadow-xl z-50">
              <SelectItem value="students">Students</SelectItem>
              <SelectItem value="trainers">Trainers</SelectItem>
              <SelectItem value="business">Business Team</SelectItem>
              <SelectItem value="admins">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ═══════ LIST CARD ═══════ */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200
        dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

        <CardHeader className="flex flex-row items-center justify-between
          border-b border-slate-100 dark:border-slate-800
          bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Pending {titleMap[selectedRole]}
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {filtered.length} request{filtered.length !== 1 && "s"} awaiting review
            </p>
          </div>

          {/* role badge */}
          <span className={`inline-flex items-center rounded-full border px-3 py-1
            text-xs font-semibold ${ROLE_CFG[selectedRole]}`}>
            {titleMap[selectedRole]}
          </span>
        </CardHeader>

        <CardContent className="p-4 space-y-3">

          {/* skeleton */}
          {loading && [1,2,3].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-2xl
              border border-slate-100 dark:border-slate-800 p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-2">
                  <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-2.5 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              </div>
            </div>
          ))}

          {/* empty state */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40
                flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-emerald-500" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">All Caught Up!</p>
              <p className="text-xs text-slate-400">No pending approvals for {titleMap[selectedRole]}</p>
            </div>
          )}

          {/* user rows */}
          {!loading && filtered.map((u) => (
            <div
              key={u.userId || u.id}
              className="group flex flex-col sm:flex-row sm:items-center sm:justify-between
                gap-4 rounded-2xl border border-slate-100 dark:border-slate-800
                bg-slate-50/50 dark:bg-slate-800/40 p-4
                hover:border-amber-200 dark:hover:border-amber-800
                hover:bg-amber-50/30 dark:hover:bg-slate-800
                hover:shadow-md transition-all duration-200"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3.5">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${grad(u.name || u.email)}
                  flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0`}>
                  {(u.name || u.email)?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {u.name || "—"}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Mail className="h-3 w-3" />
                    {u.email}
                  </div>
                </div>
              </div>

              {/* RIGHT — actions (logic unchanged) */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => approveUser(u.userId || u.id)}
                  className="flex items-center gap-1.5 rounded-xl
                    bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800
                    px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400
                    hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
                >
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>

                <button
                  onClick={() => rejectUser(u.userId || u.id)}
                  className="flex items-center gap-1.5 rounded-xl
                    bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800
                    px-4 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400
                    hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                >
                  <X className="h-3.5 w-3.5" /> Reject
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}