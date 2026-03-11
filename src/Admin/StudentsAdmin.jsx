








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









import axios from "axios";
import { RefreshCcw, Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_BASE =  import.meta.env.VITE_API_BASE_URL ||"http://localhost:9000/api";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});

const StudentsAdmin = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOAD ================= */
  const loadStudents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/students`, {
        headers: authHeaders(),
      });

      const data = res?.data;

      setStudents(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Unauthorized. Please login again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  /* ================= ADD ================= */
  const addStudent = async () => {
    if (!userId || !email) {
      alert("Enter User ID and Email");
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/students`,
        { userId: Number(userId), email },
        { headers: authHeaders() }
      );

      setUserId("");
      setEmail("");

      loadStudents();
    } catch {
      alert("Student already exists or error occurred");
    }
  };

  /* ================= STATUS ================= */
  const toggleStatus = async (id, status) => {
    const next = status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

    try {
      await axios.put(
        `${API_BASE}/students/${id}/status`,
        null,
        { params: { status: next }, headers: authHeaders() }
      );

      loadStudents();
    } catch {
      alert("Failed to update status");
    }
  };

  /* ================= DELETE ================= */
  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await axios.delete(`${API_BASE}/students/${id}`, {
        headers: authHeaders(),
      });

      loadStudents();
    } catch {
      alert("Failed to delete student");
    }
  };

  const filtered = Array.isArray(students)
    ? students.filter((s) =>
        s?.userId?.toString().includes(search)
      )
    : [];

  return (
    <div
      className="space-y-6 min-h-screen p-6
      bg-slate-50 dark:bg-gradient-to-br dark:from-[#05070d] dark:to-[#0b1220]"
    >
      <div
        className="rounded-2xl p-6 text-white shadow-lg
        bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600"
      >
        <h1 className="text-2xl font-bold">Students</h1>
        <p className="mt-1 text-sm opacity-90">
          Manage student access, status and activity
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <Input
          placeholder="Search by User ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="lg:w-64 h-9"
        />

        <div className="flex flex-wrap gap-2">
          <Input
            type="number"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-28 h-9"
          />

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-56 h-9"
          />

          <Button
            className="h-9 px-4 bg-gradient-to-r from-cyan-500 to-blue-600"
            onClick={addStudent}
          >
            <UserPlus className="h-4 w-4 mr-1.5" />
            Add
          </Button>
        </div>
      </div>

      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader className="py-3">
          <CardTitle className="text-sm">Student List</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <p className="p-4 text-sm text-muted-foreground">
              Loading...
            </p>
          ) : filtered.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              No students found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead>User ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id} className="text-sm">
                    <TableCell>{s.userId}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>
                      {new Date(s.joinedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {s.lastActiveAt
                        ? new Date(s.lastActiveAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          s.status === "ACTIVE"
                            ? "secondary"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {s.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right space-x-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          toggleStatus(s.id, s.status)
                        }
                      >
                        <RefreshCcw className="h-4 w-4 text-blue-600" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteStudent(s.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
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