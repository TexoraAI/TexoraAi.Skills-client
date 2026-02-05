
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







import React, { useEffect, useState } from "react";
import axios from "axios";
import authService from "../services/authService";
import { Check, X, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

export default function PendingUsers() {
  const [selectedRole, setSelectedRole] = useState("students");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= MAPS ================= */
  const endpointMap = {
    students: "/api/admin/approval/students/pending",
    trainers: "/api/admin/approval/trainers/pending",
    business: "/api/admin/approval/business/pending",
    admins: "/api/admin/approval/admins/pending",
  };

  const approveMap = {
    students: "/api/admin/approval/students/approve",
    trainers: "/api/admin/approval/trainers/approve",
    business: "/api/admin/approval/business/approve",
    admins: "/api/admin/approval/admins/approve",
  };

  const rejectMap = {
    students: "/api/admin/approval/students/reject",
    trainers: "/api/admin/approval/trainers/reject",
    business: "/api/admin/approval/business/reject",
    admins: "/api/admin/approval/admins/reject",
  };

  const titleMap = {
    students: "Students",
    trainers: "Trainers",
    business: "Business Team",
    admins: "Admins",
  };

  /* ================= LOAD ================= */
  const fetchPending = async (roleKey) => {
    try {
      setLoading(true);
      const token = authService.getToken();

      const res = await axios.get(
        `${API_BASE_URL}${endpointMap[roleKey]}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(res.data || []);
    } catch {
      setUsers([]);
      alert("Failed to load pending approvals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending(selectedRole);
  }, [selectedRole]);

  /* ================= ACTIONS ================= */
  const approveUser = async (id) => {
    try {
      const token = authService.getToken();
      await axios.put(
        `${API_BASE_URL}${approveMap[selectedRole]}/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPending(selectedRole);
    } catch {
      alert("Approve failed");
    }
  };

  const rejectUser = async (id) => {
    try {
      const token = authService.getToken();
      await axios.delete(
        `${API_BASE_URL}${rejectMap[selectedRole]}/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPending(selectedRole);
    } catch {
      alert("Reject failed");
    }
  };

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
        <h1 className="text-3xl font-bold">Pending Approvals</h1>
        <p className="mt-2 text-sm opacity-90">
          Review and approve new users
        </p>
      </div>

      {/* FILTER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="font-semibold">
            {titleMap[selectedRole]}
          </span>
          <Badge variant="secondary">{users.length}</Badge>
        </div>

        <Select
          value={selectedRole}
          onValueChange={(v) => setSelectedRole(v)}
        >
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="students">Students</SelectItem>
            <SelectItem value="trainers">Trainers</SelectItem>
            <SelectItem value="business">Business Team</SelectItem>
            <SelectItem value="admins">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* LIST */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            Pending {titleMap[selectedRole]}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {loading && (
            <p className="text-sm text-muted-foreground">
              Loading...
            </p>
          )}

          {!loading && users.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No pending approvals 🎉
            </p>
          )}

          {users.map((u) => (
            <div
              key={u.userId || u.id}
              className="flex items-center justify-between rounded-xl border p-4 hover:shadow-sm transition"
            >
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-muted-foreground">
                  {u.email}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500"
                  onClick={() =>
                    approveUser(u.userId || u.id)
                  }
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    rejectUser(u.userId || u.id)
                  }
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
