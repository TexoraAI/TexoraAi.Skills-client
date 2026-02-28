// import React, { useEffect, useState } from "react";
// import { Edit, Trash2, UserPlus } from "lucide-react";

// import userService from "../services/userService";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";

// const AllUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [showModal, setShowModal] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);

//   const [formData, setFormData] = useState({
//     displayName: "",
//     email: "",
//     password: "",
//     roles: "ROLE_STUDENT",
//   });

//   const loggedInUser = JSON.parse(localStorage.getItem("user"));

//   /* ================= LOAD ================= */
//   useEffect(() => {
//     fetchUsers();
//   }, []);

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

//   const filteredUsers = users.filter((u) =>
//     u.displayName?.toLowerCase().includes(search.toLowerCase())
//   );

//   const roleBadge = (role) => {
//     if (role === "ROLE_ADMIN") return "destructive";
//     if (role === "ROLE_TRAINER") return "outline";
//     return "secondary";
//   };

//   /* ================= DELETE ================= */
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this user?")) return;

//     try {
//       await userService.deleteUser(id);
//       setUsers((p) => p.filter((u) => u.id !== id));
//     } catch {
//       alert("Failed to delete user");
//     }
//   };

//   /* ================= SAVE ================= */
//   const handleSave = async (e) => {
//     e.preventDefault();

//     try {
//       let res;

//       if (editingUser) {
//         res = await userService.updateUser(editingUser.id, {
//           displayName: formData.displayName,
//           roles: formData.roles,
//         });

//         setUsers((p) =>
//           p.map((u) => (u.id === editingUser.id ? res.data : u))
//         );

//         if (
//           loggedInUser &&
//           loggedInUser.email === editingUser.email &&
//           loggedInUser.roles !== formData.roles
//         ) {
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
//     } catch {
//       alert("Failed to save user");
//     }
//   };

//   const resetModal = () => {
//     setShowModal(false);
//     setEditingUser(null);
//     setFormData({
//       displayName: "",
//       email: "",
//       password: "",
//       roles: "ROLE_STUDENT",
//     });
//   };

//   if (loading)
//     return <p className="p-6 text-gray-500">Loading users...</p>;
//   if (error)
//     return <p className="p-6 text-red-500">{error}</p>;

//   return (
//     <div className="bg-gray-50 min-h-screen p-6 space-y-6">
//       {/* HEADER (Udemy / Maven style) */}
//       <div className="bg-white border rounded-xl p-6">
//         <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
//         <p className="mt-1 text-sm text-gray-500">
//           Manage platform users and roles
//         </p>
//       </div>

//       {/* ACTION BAR */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <Button
//           className="bg-black text-white hover:bg-gray-800 w-fit"
//           onClick={() => setShowModal(true)}
//         >
//           <UserPlus className="h-4 w-4 mr-2" />
//           Add User
//         </Button>

//         <Input
//           placeholder="Search users..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="md:w-72 rounded-lg"
//         />
//       </div>

//       {/* TABLE */}
//       <Card className="rounded-xl border shadow-sm">
//         <CardHeader>
//           <CardTitle className="text-sm font-medium text-gray-700">
//             User List
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="text-xs uppercase text-gray-500">
//                   Name
//                 </TableHead>
//                 <TableHead className="text-xs uppercase text-gray-500">
//                   Email
//                 </TableHead>
//                 <TableHead className="text-xs uppercase text-gray-500">
//                   Role
//                 </TableHead>
//                 <TableHead className="text-xs uppercase text-right text-gray-500">
//                   Actions
//                 </TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {filteredUsers.map((u) => (
//                 <TableRow
//                   key={u.id}
//                   className="hover:bg-gray-50 transition"
//                 >
//                   <TableCell className="font-medium text-gray-800">
//                     {u.displayName}
//                   </TableCell>

//                   <TableCell className="text-gray-600">
//                     {u.email}
//                   </TableCell>

//                   <TableCell>
//                     <Badge variant={roleBadge(u.roles)}>
//                       {u.roles.replace("ROLE_", "")}
//                     </Badge>
//                   </TableCell>

//                   <TableCell className="text-right space-x-2">
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       className="hover:bg-gray-100"
//                       onClick={() => {
//                         setEditingUser(u);
//                         setFormData({
//                           displayName: u.displayName,
//                           email: u.email,
//                           password: "",
//                           roles: u.roles,
//                         });
//                         setShowModal(true);
//                       }}
//                     >
//                       <Edit className="h-4 w-4 text-gray-600" />
//                     </Button>

//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       className="hover:bg-red-50"
//                       onClick={() => handleDelete(u.id)}
//                     >
//                       <Trash2 className="h-4 w-4 text-red-500" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* MODAL */}
//       <Dialog open={showModal} onOpenChange={setShowModal}>
//         <DialogContent className="rounded-xl max-w-md">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-semibold">
//               {editingUser ? "Edit User" : "Add User"}
//             </DialogTitle>
//           </DialogHeader>

//           <form onSubmit={handleSave} className="space-y-4">
//             <Input
//               placeholder="Name"
//               value={formData.displayName}
//               onChange={(e) =>
//                 setFormData({ ...formData, displayName: e.target.value })
//               }
//               required
//             />

//             <Input
//               placeholder="Email"
//               disabled={!!editingUser}
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//               required
//             />

//             {!editingUser && (
//               <Input
//                 type="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={(e) =>
//                   setFormData({ ...formData, password: e.target.value })
//                 }
//                 required
//               />
//             )}

//             <Select
//               value={formData.roles}
//               onValueChange={(v) =>
//                 setFormData({ ...formData, roles: v })
//               }
//             >
//               <SelectTrigger className="rounded-lg">
//                 <SelectValue placeholder="Select role" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="ROLE_STUDENT">Student</SelectItem>
//                 <SelectItem value="ROLE_TRAINER">Trainer</SelectItem>
//                 <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
//               </SelectContent>
//             </Select>

//             <DialogFooter className="pt-4">
//               <Button
//                 variant="ghost"
//                 type="button"
//                 onClick={resetModal}
//               >
//                 Cancel
//               </Button>
//               <Button className="bg-black text-white hover:bg-gray-800">
//                 {editingUser ? "Update" : "Create"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
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
    } catch {
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
    if (role === "ROLE_TRAINER") return "outline";
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

  if (loading)
    return <p className="p-6 text-slate-500">Loading users...</p>;
  if (error)
    return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="space-y-6 min-h-screen p-6
      bg-slate-50 dark:bg-gradient-to-br dark:from-[#05070d] dark:to-[#0b1220]">

      {/* ================= HERO ================= */}
      <div className="rounded-2xl p-6 text-white shadow-lg
        bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="mt-1 text-sm opacity-90">
          Manage platform users and roles
        </p>
      </div>

      {/* ================= ACTION BAR ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <Button
          className="h-9 px-4 bg-gradient-to-r from-cyan-500 to-blue-600"
          onClick={() => setShowModal(true)}
        >
          <UserPlus className="h-4 w-4 mr-1.5" />
          Add User
        </Button>

        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-64 h-9"
        />
      </div>

      {/* ================= TABLE ================= */}
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader className="py-3">
          <CardTitle className="text-sm">User List</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id} className="text-sm">
                  <TableCell className="font-medium">
                    {u.displayName}
                  </TableCell>

                  <TableCell>{u.email}</TableCell>

                  <TableCell>
                    <Badge variant={roleBadge(u.roles)} className="text-xs">
                      {u.roles.replace("ROLE_", "")}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right space-x-1">
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
                      <Edit className="h-4 w-4 text-blue-600" />
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

      {/* ================= MODAL ================= */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent
          className="rounded-2xl max-w-sm
          bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-700
          overflow-visible"   /* 🔥 IMPORTANT FIX */
        >
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {editingUser ? "Edit User" : "Add User"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-3">
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

            {/* 🔥 SELECT FIXED */}
            <Select
              value={formData.roles}
              onValueChange={(v) =>
                setFormData({ ...formData, roles: v })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>

              <SelectContent
                position="popper"
                sideOffset={6}
                className="
                  z-[9999]
                  bg-white dark:bg-slate-900
                  border border-slate-200 dark:border-slate-700
                  shadow-xl
                "
              >
                <SelectItem value="ROLE_STUDENT">Student</SelectItem>
                <SelectItem value="ROLE_TRAINER">Trainer</SelectItem>
                <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>

            <DialogFooter className="pt-3">
              <Button
                size="sm"
                variant="secondary"
                type="button"
                onClick={resetModal}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-indigo-600"
              >
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

