
// import React, { useEffect, useState } from "react";
// import { ArrowLeft, Edit, GripVertical, Mail, Pencil, Search, Trash2, UserPlus, Users } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

// import userService from "../services/userService";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// /* ── avatar gradient pool ── */
// const GRAD = [
//   "from-violet-500 to-purple-600",
//   "from-cyan-500 to-blue-600",
//   "from-rose-500 to-pink-600",
//   "from-amber-500 to-orange-600",
//   "from-emerald-500 to-teal-600",
//   "from-indigo-500 to-blue-700",
// ];
// const grad = (name) => GRAD[(name?.charCodeAt(0) ?? 0) % GRAD.length];

// /* ── role badge config ── */
// const ROLE_CFG = {
//   ROLE_ADMIN:   { label: "Admin",   cls: "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"         },
//   ROLE_TRAINER: { label: "Trainer", cls: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"   },
//   ROLE_STUDENT: { label: "Student", cls: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700" },
// };

// /* ── nav tabs ── */
// const TABS = [
//   { label: "All Users",     path: "/admin/users"          },
//   { label: "Students",      path: "/admin/students"       },
//   { label: "Trainers",      path: "/admin/trainers"       },
//   { label: "Pending Users", path: "/admin/pending-users"  },
// ];

// /* ================= MAIN ================= */
// const AllUsers = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [users, setUsers]           = useState([]);
//   const [loading, setLoading]       = useState(true);
//   const [error, setError]           = useState(null);
//   const [search, setSearch]         = useState("");
//   const [showModal, setShowModal]   = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [formData, setFormData]     = useState({
//     displayName: "", email: "", password: "", roles: "ROLE_STUDENT",
//   });

//   const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");

//   /* ── LOAD (unchanged) ── */
//   useEffect(() => { fetchUsers(); }, []);

//   const fetchUsers = async () => {
//     try {
//       const res = await userService.getUsers(0, 50);
//       setUsers(res.data.content);
//     } catch {
//       setError("Failed to load users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ── DELETE (unchanged) ── */
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this user?")) return;
//     try {
//       await userService.deleteUser(id);
//       setUsers((p) => p.filter((u) => u.id !== id));
//     } catch { alert("Failed to delete user"); }
//   };

//   /* ── SAVE (unchanged) ── */
//   const handleSave = async (e) => {
//     e.preventDefault();
//     try {
//       let res;
//       if (editingUser) {
//         res = await userService.updateUser(editingUser.id, {
//           displayName: formData.displayName,
//           roles: formData.roles,
//         });
//         setUsers((p) => p.map((u) => (u.id === editingUser.id ? res.data : u)));
//         if (loggedInUser && loggedInUser.email === editingUser.email && loggedInUser.roles !== formData.roles) {
//           alert("Your role has been changed. Please login again.");
//           localStorage.clear();
//           window.location.href = "/login";
//           return;
//         }
//       } else {
//         res = await userService.createUser({
//           email: formData.email,
//           password: formData.password,
//           displayName: formData.displayName,
//           roles: formData.roles,
//           tenantId: "default",
//         });
//         setUsers((p) => [res.data, ...p]);
//       }
//       resetModal();
//     } catch { alert("Failed to save user"); }
//   };

//   const resetModal = () => {
//     setShowModal(false);
//     setEditingUser(null);
//     setFormData({ displayName: "", email: "", password: "", roles: "ROLE_STUDENT" });
//   };

//   /* ── drag end (unchanged) ── */
//   const onDragEnd = (result) => {
//     if (!result.destination) return;
//     const items = Array.from(filteredUsers);
//     const [moved] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, moved);
//     const updatedUsers = users.map((u) => items.find((i) => i.id === u.id) || u);
//     setUsers(updatedUsers);
//   };

//   const filteredUsers = users.filter((u) =>
//     (u.displayName || u.email)?.toLowerCase().includes(search.toLowerCase())
//   );

//   /* ── loading / error states ── */
//   if (loading) return (
//     <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5">
//       <div className="space-y-3">
//         {[1,2,3,4].map((i) => (
//           <div key={i} className="h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse" />
//         ))}
//       </div>
//     </div>
//   );

//   if (error) return (
//     <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 flex items-center justify-center">
//       <p className="text-red-500 text-sm">{error}</p>
//     </div>
//   );

//   /* ================= RENDER ================= */
//   return (
//     <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 space-y-5">

//       {/* ═══════ HERO ═══════ */}
//       <div className="relative overflow-hidden rounded-2xl shadow-xl
//         bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4]">
//         <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
//         <div className="pointer-events-none absolute right-32 bottom-[-30px] h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
//         <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

//         <div className="relative flex items-center justify-between px-6 py-5">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5
//                 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all"
//             >
//               <ArrowLeft className="h-4 w-4" /> Back
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold tracking-tight text-white">Users</h1>
//               <p className="mt-0.5 text-sm text-blue-100/80">Manage platform users and roles</p>
//             </div>
//           </div>
//           <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
//             <Users className="h-5 w-5 text-cyan-200" />
//             <span className="text-sm font-semibold text-white">
//               {users.length}
//               <span className="ml-1 font-normal text-blue-100/80">Users</span>
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* ═══════ ACTION BAR ═══════ */}
//       <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

//         {/* nav tabs */}
//         <div className="flex flex-wrap gap-1.5 rounded-xl bg-white dark:bg-slate-900
//           border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
//           {TABS.map(({ label, path }) => {
//             const active = location.pathname === path;
//             return (
//               <button
//                 key={path}
//                 onClick={() => navigate(path)}
//                 className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all
//                   ${active
//                     ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow"
//                     : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
//                   }`}
//               >
//                 {label}
//               </button>
//             );
//           })}
//         </div>

//         {/* search */}
//         <div className="relative md:w-60">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//           <Input
//             placeholder="Search users…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900
//               border-slate-200 dark:border-slate-800 text-sm"
//           />
//         </div>
//       </div>

//       {/* ═══════ TABLE CARD ═══════ */}
//       <Card className="overflow-hidden rounded-2xl border border-slate-200
//         dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

//         <CardHeader className="flex flex-row items-center justify-between
//           border-b border-slate-100 dark:border-slate-800
//           bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
//           <div>
//             <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
//               User List
//             </CardTitle>
//             <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
//               {filteredUsers.length} user{filteredUsers.length !== 1 && "s"} found
//             </p>
//           </div>

//           <button
//             onClick={() => setShowModal(true)}
//             className="flex items-center gap-1.5 rounded-xl
//               bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2
//               text-sm font-semibold text-white shadow
//               hover:opacity-90 hover:scale-105 transition-all"
//           >
//             <UserPlus className="h-4 w-4" /> Add User
//           </button>
//         </CardHeader>

//         <CardContent className="p-4">
//           {filteredUsers.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 gap-3">
//               <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
//                 <Users className="h-7 w-7 text-slate-400" />
//               </div>
//               <p className="text-sm font-medium text-slate-500">No users found</p>
//             </div>
//           ) : (
//             <DragDropContext onDragEnd={onDragEnd}>
//               <Droppable droppableId="users">
//                 {(provided) => (
//                   <div
//                     {...provided.droppableProps}
//                     ref={provided.innerRef}
//                     className="space-y-2"
//                   >
//                     {filteredUsers.map((u, index) => {
//                       const role = ROLE_CFG[u.roles] ?? ROLE_CFG.ROLE_STUDENT;
//                       return (
//                         <Draggable key={u.id} draggableId={String(u.id)} index={index}>
//                           {(provided, snapshot) => (
//                             <div
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               className={`group flex items-center justify-between rounded-2xl
//                                 border border-slate-100 dark:border-slate-800 p-3.5
//                                 bg-slate-50/50 dark:bg-slate-800/40
//                                 hover:border-blue-200 dark:hover:border-blue-800
//                                 hover:bg-blue-50/30 dark:hover:bg-slate-800
//                                 hover:shadow-md transition-all duration-200
//                                 ${snapshot.isDragging ? "shadow-xl ring-2 ring-blue-400 scale-[1.01]" : ""}`}
//                             >
//                               {/* drag handle + avatar + info */}
//                               <div className="flex items-center gap-3">
//                                 <div
//                                   {...provided.dragHandleProps}
//                                   className="text-slate-300 dark:text-slate-600
//                                     hover:text-slate-400 cursor-grab active:cursor-grabbing
//                                     opacity-0 group-hover:opacity-100 transition-opacity"
//                                 >
//                                   <GripVertical className="h-4 w-4" />
//                                 </div>

//                                 <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${grad(u.displayName)}
//                                   flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0`}>
//                                   {u.displayName?.charAt(0)?.toUpperCase() ?? "?"}
//                                 </div>

//                                 <div className="space-y-0.5">
//                                   <p className="text-sm font-bold text-slate-800 dark:text-slate-100
//                                     group-hover:text-blue-600 transition-colors">
//                                     {u.displayName}
//                                   </p>
//                                   <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
//                                     <Mail className="h-3 w-3" />
//                                     {u.email}
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* role + actions */}
//                               <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
//                                 <span className={`inline-flex items-center rounded-full border
//                                   px-2.5 py-0.5 text-[11px] font-semibold ${role.cls}`}>
//                                   {role.label}
//                                 </span>

//                                 <button
//                                   onClick={() => {
//                                     setEditingUser(u);
//                                     setFormData({ displayName: u.displayName, email: u.email, password: "", roles: u.roles });
//                                     setShowModal(true);
//                                   }}
//                                   className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50
//                                     flex items-center justify-center text-blue-600
//                                     hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
//                                 >
//                                   <Pencil className="h-3.5 w-3.5" />
//                                 </button>

//                                 <button
//                                   onClick={() => handleDelete(u.id)}
//                                   className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-950/50
//                                     flex items-center justify-center text-red-500
//                                     hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
//                                 >
//                                   <Trash2 className="h-3.5 w-3.5" />
//                                 </button>
//                               </div>
//                             </div>
//                           )}
//                         </Draggable>
//                       );
//                     })}
//                     {provided.placeholder}
//                   </div>
//                 )}
//               </Droppable>
//             </DragDropContext>
//           )}
//         </CardContent>
//       </Card>

//       {/* ═══════ MODAL ═══════ */}
//       <Dialog open={showModal} onOpenChange={setShowModal}>
//         <DialogContent className="max-w-sm p-0 rounded-2xl overflow-hidden
//           bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-visible">

//           {/* modal header */}
//           <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4">
//             <div className="flex items-center gap-2.5">
//               <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
//                 {editingUser ? <Pencil className="h-4 w-4 text-white" /> : <UserPlus className="h-4 w-4 text-white" />}
//               </div>
//               <div>
//                 <DialogTitle className="text-sm font-bold text-white">
//                   {editingUser ? "Edit User" : "Add New User"}
//                 </DialogTitle>
//                 <p className="text-[11px] text-blue-100/70">
//                   {editingUser ? "Update user details" : "Fill in the details below"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* modal body */}
//           <form onSubmit={handleSave} className="p-5 space-y-4">

//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Full Name</label>
//               <Input
//                 placeholder="e.g. Raghib Khan"
//                 value={formData.displayName}
//                 onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
//                 required
//                 className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
//               />
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email</label>
//               <Input
//                 placeholder="user@example.com"
//                 disabled={!!editingUser}
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 required
//                 className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 disabled:opacity-50"
//               />
//             </div>

//             {!editingUser && (
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Password</label>
//                 <Input
//                   type="password"
//                   placeholder="••••••••"
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   required
//                   className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
//                 />
//               </div>
//             )}

//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Role</label>
//               <Select value={formData.roles} onValueChange={(v) => setFormData({ ...formData, roles: v })}>
//                 <SelectTrigger className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
//                   <SelectValue placeholder="Select role" />
//                 </SelectTrigger>
//                 <SelectContent
//                   position="popper"
//                   sideOffset={6}
//                   className="z-[9999] rounded-xl border border-slate-200 dark:border-slate-700
//                     bg-white dark:bg-slate-900 shadow-xl"
//                 >
//                   <SelectItem value="ROLE_STUDENT">Student</SelectItem>
//                   <SelectItem value="ROLE_TRAINER">Trainer</SelectItem>
//                   <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex justify-end gap-2 pt-1">
//               <button
//                 type="button"
//                 onClick={resetModal}
//                 className="px-4 py-2 rounded-xl text-sm font-medium
//                   bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
//                   hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-5 py-2 rounded-xl text-sm font-semibold text-white
//                   bg-gradient-to-r from-blue-600 to-cyan-500 shadow
//                   hover:opacity-90 hover:scale-105 transition-all"
//               >
//                 {editingUser ? "Update" : "Create User"}
//               </button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default AllUsers;











import React, { useEffect, useState } from "react";
import { ArrowLeft, GripVertical, Mail, Pencil, Plus, Search, Trash2, UserPlus, Users, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

import userService from "../services/userService";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ── avatar gradient pool ── */
const GRAD = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-indigo-500 to-blue-700",
];
const grad = (name) => GRAD[(name?.charCodeAt(0) ?? 0) % GRAD.length];

/* ── role badge config ── */
const ROLE_CFG = {
  ROLE_ADMIN:   { label: "Admin",   cls: "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"         },
  ROLE_TRAINER: { label: "Trainer", cls: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"   },
  ROLE_STUDENT: { label: "Student", cls: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700" },
};

/* ── nav tabs ── */
const TABS = [
  { label: "All Users",     path: "/admin/users"         },
  { label: "Students",      path: "/admin/students"      },
  { label: "Trainers",      path: "/admin/trainers"      },
  { label: "Pending Users", path: "/admin/pending-users" },
];

/* ================= MAIN ================= */
const AllUsers = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [search, setSearch]           = useState("");
  const [panelOpen, setPanelOpen]     = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData]       = useState({
    displayName: "", email: "", password: "", roles: "ROLE_STUDENT",
  });

  const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");

  /* ── LOAD (unchanged) ── */
  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await userService.getUsers(0, 50);
      setUsers(res.data.content);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  /* ── DELETE (unchanged) ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await userService.deleteUser(id);
      setUsers((p) => p.filter((u) => u.id !== id));
    } catch { alert("Failed to delete user"); }
  };

  /* ── SAVE (unchanged) ── */
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingUser) {
        res = await userService.updateUser(editingUser.id, {
          displayName: formData.displayName,
          roles: formData.roles,
        });
        setUsers((p) => p.map((u) => (u.id === editingUser.id ? res.data : u)));
        if (loggedInUser && loggedInUser.email === editingUser.email && loggedInUser.roles !== formData.roles) {
          alert("Your role has been changed. Please login again.");
          localStorage.clear();
          window.location.href = "/login";
          return;
        }
      } else {
        res = await userService.createUser({
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName,
          roles: formData.roles,
          tenantId: "default",
        });
        setUsers((p) => [res.data, ...p]);
      }
      resetPanel();
    } catch { alert("Failed to save user"); }
  };

  const resetPanel = () => {
    setPanelOpen(false);
    setEditingUser(null);
    setFormData({ displayName: "", email: "", password: "", roles: "ROLE_STUDENT" });
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setFormData({ displayName: u.displayName, email: u.email, password: "", roles: u.roles });
    setPanelOpen(true);
  };

  /* ── drag end (unchanged) ── */
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(filteredUsers);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    const updatedUsers = users.map((u) => items.find((i) => i.id === u.id) || u);
    setUsers(updatedUsers);
  };

  const filteredUsers = users.filter((u) =>
    (u.displayName || u.email)?.toLowerCase().includes(search.toLowerCase())
  );

  /* ── loading / error states ── */
  if (loading) return (
    <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5">
      <div className="space-y-3">
        {[1,2,3,4].map((i) => (
          <div key={i} className="h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse" />
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 flex items-center justify-center">
      <p className="text-red-500 text-sm">{error}</p>
    </div>
  );

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 space-y-5">

      {/* ═══════ HERO ═══════ */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4]">
        <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute right-32 bottom-[-30px] h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="relative flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Users</h1>
              <p className="mt-0.5 text-sm text-blue-100/80">Manage platform users and roles</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
            <Users className="h-5 w-5 text-cyan-200" />
            <span className="text-sm font-semibold text-white">
              {users.length}<span className="ml-1 font-normal text-blue-100/80">Users</span>
            </span>
          </div>
        </div>
      </div>

      {/* ═══════ ACTION BAR ═══════ */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
          {TABS.map(({ label, path }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative md:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm"
            />
          </div>
          <button
            onClick={() => { setEditingUser(null); setFormData({ displayName: "", email: "", password: "", roles: "ROLE_STUDENT" }); setPanelOpen(true); }}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 hover:scale-105 transition-all whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Add User
          </button>
        </div>
      </div>

      {/* ═══════ MAIN — list + inline panel ═══════ */}
      <div className={`flex gap-4 ${panelOpen ? "items-start" : ""}`}>

        {/* USER LIST CARD */}
        <div className={`transition-all duration-300 ${panelOpen ? "flex-1 min-w-0" : "w-full"}`}>
          <Card className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">User List</CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {filteredUsers.length} user{filteredUsers.length !== 1 && "s"} found
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              {filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Users className="h-7 w-7 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">No users found</p>
                </div>
              ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="users">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {filteredUsers.map((u, index) => {
                          const role = ROLE_CFG[u.roles] ?? ROLE_CFG.ROLE_STUDENT;
                          return (
                            <Draggable key={u.id} draggableId={String(u.id)} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`group flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 ${snapshot.isDragging ? "shadow-xl ring-2 ring-blue-400 scale-[1.01]" : ""}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="text-slate-300 dark:text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <GripVertical className="h-4 w-4" />
                                    </div>
                                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${grad(u.displayName)} flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0`}>
                                      {u.displayName?.charAt(0)?.toUpperCase() ?? "?"}
                                    </div>
                                    <div className="space-y-0.5">
                                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                                        {u.displayName}
                                      </p>
                                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                        <Mail className="h-3 w-3" /> {u.email}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${role.cls}`}>
                                      {role.label}
                                    </span>
                                    <button
                                      onClick={() => openEdit(u)}
                                      className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(u.id)}
                                      className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ═══════ INLINE SLIDE PANEL ═══════ */}
        <div className={`flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${panelOpen ? "w-96 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}>
          <div className="w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">

            {/* panel header */}
            <div className="bg-gradient-to-r from-[#1a56db] to-[#06b6d4] px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
                    {editingUser ? <Pencil className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4 text-white" />}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">{editingUser ? "Edit User" : "New User"}</h2>
                    <p className="text-[11px] text-blue-100/70">{editingUser ? "Update user details" : "Fill in the user details"}</p>
                  </div>
                </div>
                <button
                  onClick={resetPanel}
                  className="h-7 w-7 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* step bar */}
              <div className="flex gap-1.5 mt-4">
                {["User Info", "Role", "Done"].map((step, i) => (
                  <div key={step} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${i === 0 ? "bg-white/20 text-white" : "text-white/40"}`}>
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${i === 0 ? "bg-white text-blue-600" : "bg-white/20 text-white/60"}`}>{i + 1}</div>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* panel body — form */}
            <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto max-h-[calc(100vh-280px)]">

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Full Name</label>
                <Input
                  placeholder="e.g. Raghib Khan"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  required
                  className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email</label>
                <Input
                  placeholder="user@example.com"
                  disabled={!!editingUser}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-50"
                />
              </div>

              {!editingUser && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Role</label>
                <Select value={formData.roles} onValueChange={(v) => setFormData({ ...formData, roles: v })}>
                  <SelectTrigger className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl">
                    <SelectItem value="ROLE_STUDENT">Student</SelectItem>
                    <SelectItem value="ROLE_TRAINER">Trainer</SelectItem>
                    <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetPanel}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow hover:opacity-90 hover:scale-105 transition-all"
                >
                  {editingUser ? "Update" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;