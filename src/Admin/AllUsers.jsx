
// import React, { useEffect, useState } from "react";
// import { Edit, Search, Trash, UserPlus } from "lucide-react";
// import userService from "../services/userService";

// const AllUsers = () => {
//   const [search, setSearch] = useState("");
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ✅ modal + form
//   const [showAddUser, setShowAddUser] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);

//   const [formData, setFormData] = useState({
//     displayName: "",
//     email: "",
//     password: "",
//     roles: "ROLE_STUDENT",
//   });

//   // ✅ LOGGED IN USER (ADDED)
//   const loggedInUser = JSON.parse(localStorage.getItem("user"));

//   // ✅ FETCH USERS
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await userService.getUsers(0, 50);
//         setUsers(res.data.content);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load users");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // ✅ SEARCH
//   const filteredUsers = users.filter((u) =>
//     u.displayName?.toLowerCase().includes(search.toLowerCase()),
//   );

//   const roleColor = (role) => {
//     if (role === "ROLE_ADMIN") return "bg-red-100 text-red-600";
//     if (role === "ROLE_TRAINER") return "bg-blue-100 text-blue-600";
//     return "bg-green-100 text-green-600";
//   };

//   // ✅ DELETE USER
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this user?")) return;

//     try {
//       await userService.deleteUser(id);
//       setUsers((prev) => prev.filter((u) => u.id !== id));
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete user");
//     }
//   };

//   // ✅ CREATE + EDIT (SAME MODAL)
//   const handleAddUser = async (e) => {
//     e.preventDefault();

//     try {
//       let res;

//       if (editingUser) {
//         // ✅ EDIT USER
//         res = await userService.updateUser(editingUser.id, {
//           displayName: formData.displayName,
//           roles: formData.roles,
//         });

//         setUsers((prev) =>
//           prev.map((u) => (u.id === editingUser.id ? res.data : u)),
//         );

//         // 🔥 FORCE RE-LOGIN IF CURRENT USER ROLE CHANGED (ONLY ADDITION)
//         if (
//           loggedInUser &&
//           loggedInUser.email === editingUser.email &&
//           loggedInUser.roles !== formData.roles
//         ) {
//           alert("Your role has been changed. Please login again.");

//           localStorage.removeItem("token");
//           localStorage.removeItem("user");

//           window.location.href = "/login";
//           return;
//         }
//       } else {
//         // ✅ CREATE USER
//         res = await userService.createUser({
//           email: formData.email,
//           password: formData.password,
//           displayName: formData.displayName,
//           roles: formData.roles,
//           tenantId: "default",
//         });

//         setUsers((prev) => [res.data, ...prev]);
//       }

//       // ✅ RESET
//       setShowAddUser(false);
//       setEditingUser(null);
//       setFormData({
//         displayName: "",
//         email: "",
//         password: "",
//         roles: "ROLE_STUDENT",
//       });
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save user");
//     }
//   };

//   if (loading) return <p className="p-6 text-slate-300">Loading users...</p>;
//   if (error) return <p className="p-6 text-red-400">{error}</p>;

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-slate-100">Users</h1>
//         <button
//           onClick={() => {
//             setEditingUser(null);
//             setFormData({
//               displayName: "",
//               email: "",
//               password: "",
//               roles: "ROLE_STUDENT",
//             });
//             setShowAddUser(true);
//           }}
//           className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-500 transition"
//         >
//           <UserPlus size={18} />
//           Add user
//         </button>
//       </div>

//       {/* Search */}
//       <div className="relative w-full md:w-1/3">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search users..."
//           className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse bg-slate-900/80 rounded-xl overflow-hidden border border-slate-800 text-sm">
//           <thead className="bg-slate-900">
//             <tr>
//               <th className="p-4 text-left text-slate-300">Name</th>
//               <th className="p-4 text-left text-slate-300">Email</th>
//               <th className="p-4 text-left text-slate-300">Role</th>
//               <th className="p-4 text-left text-slate-300">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.map((user) => (
//               <tr
//                 key={user.id}
//                 className="border-t border-slate-800 hover:bg-slate-800/70 transition"
//               >
//                 <td className="p-4 text-slate-100">{user.displayName}</td>
//                 <td className="p-4 text-slate-300">{user.email}</td>
//                 <td className="p-4">
//                   <span
//                     className={`px-3 py-1 text-xs rounded-full font-medium ${roleColor(
//                       user.roles,
//                     )}`}
//                   >
//                     {user.roles?.replace("ROLE_", "")}
//                   </span>
//                 </td>
//                 <td className="p-4 flex gap-3">
//                   <button
//                     className="text-blue-400 hover:text-blue-300"
//                     onClick={() => {
//                       setEditingUser(user);
//                       setFormData({
//                         displayName: user.displayName,
//                         email: user.email,
//                         password: "",
//                         roles: user.roles,
//                       });
//                       setShowAddUser(true);
//                     }}
//                   >
//                     <Edit size={18} />
//                   </button>

//                   <button
//                     className="text-red-400 hover:text-red-300"
//                     onClick={() => handleDelete(user.id)}
//                   >
//                     <Trash size={18} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal */}
//       {showAddUser && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md border border-slate-700">
//             <h2 className="text-xl font-bold text-slate-100 mb-4">
//               {editingUser ? "Edit User" : "Add User"}
//             </h2>

//             <form onSubmit={handleAddUser} className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Name"
//                 className="w-full px-4 py-2 rounded bg-slate-950 border border-slate-700 text-slate-100"
//                 value={formData.displayName}
//                 onChange={(e) =>
//                   setFormData({ ...formData, displayName: e.target.value })
//                 }
//                 required
//               />

//               <input
//                 type="email"
//                 placeholder="Email"
//                 disabled={!!editingUser}
//                 className="w-full px-4 py-2 rounded bg-slate-950 border border-slate-700 text-slate-100"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 required
//               />

//               {!editingUser && (
//                 <input
//                   type="password"
//                   placeholder="Password"
//                   className="w-full px-4 py-2 rounded bg-slate-950 border border-slate-700 text-slate-100"
//                   value={formData.password}
//                   onChange={(e) =>
//                     setFormData({ ...formData, password: e.target.value })
//                   }
//                   required
//                 />
//               )}

//               <select
//                 className="w-full px-4 py-2 rounded bg-slate-950 border border-slate-700 text-slate-100"
//                 value={formData.roles}
//                 onChange={(e) =>
//                   setFormData({ ...formData, roles: e.target.value })
//                 }
//               >
//                 <option value="ROLE_STUDENT">Student</option>
//                 <option value="ROLE_TRAINER">Trainer</option>
//                 <option value="ROLE_ADMIN">Admin</option>
//               </select>

//               <div className="flex justify-end gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowAddUser(false);
//                     setEditingUser(null);
//                   }}
//                   className="px-4 py-2 rounded bg-slate-700 text-slate-200 hover:bg-slate-600"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded bg-violet-600 text-white hover:bg-violet-500"
//                 >
//                   {editingUser ? "Update" : "Create"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllUsers;



import React, { useEffect, useState } from "react";
import { Edit, Trash2, UserPlus } from "lucide-react";

import userService from "../services/userService";

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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    roles: "ROLE_STUDENT",
  });

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  /* ================= LOAD ================= */
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await userService.getUsers(0, 50);
      setUsers(res.data.content);
    } catch (e) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role) => {
    if (role === "ROLE_ADMIN") return "destructive";
    if (role === "ROLE_TRAINER") return "default";
    return "secondary";
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await userService.deleteUser(id);
      setUsers((p) => p.filter((u) => u.id !== id));
    } catch {
      alert("Failed to delete user");
    }
  };

  /* ================= SAVE ================= */
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (editingUser) {
        res = await userService.updateUser(editingUser.id, {
          displayName: formData.displayName,
          roles: formData.roles,
        });

        setUsers((p) =>
          p.map((u) => (u.id === editingUser.id ? res.data : u))
        );

        // 🔥 Force re-login if current user role changed
        if (
          loggedInUser &&
          loggedInUser.email === editingUser.email &&
          loggedInUser.roles !== formData.roles
        ) {
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

      resetModal();
    } catch {
      alert("Failed to save user");
    }
  };

  const resetModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      displayName: "",
      email: "",
      password: "",
      roles: "ROLE_STUDENT",
    });
  };

  if (loading) return <p className="p-6 text-muted-foreground">Loading users...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="mt-2 text-sm opacity-90">
          Manage platform users and roles
        </p>
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <Button
          className="bg-indigo-600 hover:bg-indigo-500 w-fit"
          onClick={() => setShowModal(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>

        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-64"
        />
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">User List</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    {u.displayName}
                  </TableCell>

                  <TableCell>{u.email}</TableCell>

                  <TableCell>
                    <Badge variant={roleBadge(u.roles)}>
                      {u.roles.replace("ROLE_", "")}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingUser(u);
                        setFormData({
                          displayName: u.displayName,
                          email: u.email,
                          password: "",
                          roles: u.roles,
                        });
                        setShowModal(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(u.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODAL */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Add User"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <Input
              placeholder="Name"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              required
            />

            <Input
              placeholder="Email"
              disabled={!!editingUser}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            {!editingUser && (
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            )}

            <Select
              value={formData.roles}
              onValueChange={(v) =>
                setFormData({ ...formData, roles: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ROLE_STUDENT">Student</SelectItem>
                <SelectItem value="ROLE_TRAINER">Trainer</SelectItem>
                <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>

            <DialogFooter>
              <Button variant="secondary" onClick={resetModal}>
                Cancel
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-500">
                {editingUser ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllUsers;

