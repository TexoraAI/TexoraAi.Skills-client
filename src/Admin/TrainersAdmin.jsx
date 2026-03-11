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

const TrainersAdmin = () => {
  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    expertise: "",
  });

  const loadTrainers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/trainers`, {
        headers: authHeaders(),
      });

      const data = res?.data;

      setTrainers(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Unauthorized. Please login again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  const addTrainer = async () => {
    if (!form.name || !form.email || !form.expertise) {
      alert("Fill all fields");
      return;
    }

    try {
      await axios.post(`${API_BASE}/trainers`, form, {
        headers: authHeaders(),
      });

      setForm({ name: "", email: "", expertise: "" });

      loadTrainers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add trainer");
    }
  };

  const toggleStatus = async (id, status) => {
    const next = status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

    try {
      await axios.put(
        `${API_BASE}/trainers/${id}/status`,
        null,
        { params: { status: next }, headers: authHeaders() }
      );

      loadTrainers();
    } catch {
      alert("Failed to update status");
    }
  };

  const deleteTrainer = async (id) => {
    if (!window.confirm("Delete trainer?")) return;

    try {
      await axios.delete(`${API_BASE}/trainers/${id}`, {
        headers: authHeaders(),
      });

      loadTrainers();
    } catch {
      alert("Failed to delete trainer");
    }
  };

  const filtered = Array.isArray(trainers)
    ? trainers.filter((t) =>
        t?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-8">
      <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
        <h1 className="text-3xl font-bold">Trainers</h1>
        <p className="mt-2 text-sm opacity-90">
          Manage trainers, expertise and access status
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <Input
          placeholder="Search trainers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="lg:w-64"
        />

        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-40"
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-56"
          />
          <Input
            placeholder="Expertise"
            value={form.expertise}
            onChange={(e) =>
              setForm({ ...form, expertise: e.target.value })
            }
            className="w-40"
          />

          <Button
            onClick={addTrainer}
            className="bg-indigo-600 hover:bg-indigo-500"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Trainer List</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No trainers found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Expertise</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.name}</TableCell>
                    <TableCell>{t.email}</TableCell>
                    <TableCell>{t.expertise}</TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          t.status === "ACTIVE"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {t.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleStatus(t.id, t.status)}
                      >
                        <RefreshCcw className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteTrainer(t.id)}
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

export default TrainersAdmin;