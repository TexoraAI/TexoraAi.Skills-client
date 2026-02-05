
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API_BASE = "http://localhost:9000/api/trainers";

// // ✅ correct token
// const authHeaders = () => ({
//   Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
// });

// const TrainersAdmin = () => {
//   const [trainers, setTrainers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     expertise: "",
//   });
//   const [loading, setLoading] = useState(false);

//   // ================= LOAD TRAINERS =================
//   const loadTrainers = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(API_BASE, {
//         headers: authHeaders(),
//       });
//       setTrainers(res.data);
//     } catch (err) {
//       console.error("TRAINER LOAD ERROR", err);
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

//   // ================= ADD TRAINER =================
//   const addTrainer = async () => {
//     if (!form.name || !form.email || !form.expertise) {
//       alert("Fill all fields");
//       return;
//     }

//     try {
//       await axios.post(API_BASE, form, {
//         headers: authHeaders(),
//       });

//       setForm({ name: "", email: "", expertise: "" });
//       loadTrainers();
//     } catch (err) {
//       console.error("ADD TRAINER ERROR", err);
//       alert(err.response?.data?.message || "Failed to add trainer");
//     }
//   };

//   // ================= TOGGLE STATUS =================
//   const toggleStatus = async (id, status) => {
//     const next = status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

//     try {
//       await axios.put(`${API_BASE}/${id}/status`, null, {
//         params: { status: next },
//         headers: authHeaders(),
//       });
//       loadTrainers();
//     } catch (err) {
//       console.error("STATUS ERROR", err);
//       alert("Failed to update status");
//     }
//   };

//   // ================= DELETE TRAINER =================
//   const deleteTrainer = async (id) => {
//     if (!window.confirm("Delete trainer?")) return;

//     try {
//       await axios.delete(`${API_BASE}/${id}`, {
//         headers: authHeaders(),
//       });
//       loadTrainers();
//     } catch (err) {
//       console.error("DELETE ERROR", err);
//       alert("Failed to delete trainer");
//     }
//   };

//   const filtered = trainers.filter((t) =>
//     t.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="space-y-6">
//       <h1 className="text-xl font-semibold text-slate-100">Trainers</h1>

//       {/* Search + Add */}
//       <div className="flex flex-wrap gap-2">
//         <input
//           placeholder="Search trainers..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
//         />

//         <input
//           placeholder="Name"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           className="rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
//         />

//         <input
//           placeholder="Email"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//           className="rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
//         />

//         <input
//           placeholder="Expertise"
//           value={form.expertise}
//           onChange={(e) => setForm({ ...form, expertise: e.target.value })}
//           className="rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
//         />

//         <button
//           onClick={addTrainer}
//           className="px-4 py-2 rounded-md bg-violet-600 text-white text-sm"
//         >
//           + Add trainer
//         </button>
//       </div>

//       {/* Table */}
//       <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
//         {loading && <p className="text-slate-400">Loading...</p>}

//         {!loading && filtered.length === 0 && (
//           <p className="text-slate-400">No trainers found</p>
//         )}

//         {filtered.map((t) => (
//           <div
//             key={t.id}
//             className="flex text-sm text-slate-200 py-2 border-b border-slate-800 last:border-0"
//           >
//             <div className="w-2/6">{t.name}</div>
//             <div className="w-2/6">{t.email}</div>
//             <div className="w-1/6">{t.expertise}</div>
//             <div className="w-1/6">
//               <span
//                 className={
//                   t.status === "ACTIVE" ? "text-green-400" : "text-red-400"
//                 }
//               >
//                 {t.status}
//               </span>
//             </div>
//             <div className="w-1/6 flex gap-3 justify-end">
//               <button
//                 onClick={() => toggleStatus(t.id, t.status)}
//                 className="text-violet-400"
//               >
//                 Toggle
//               </button>
//               <button
//                 onClick={() => deleteTrainer(t.id)}
//                 className="text-red-400"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TrainersAdmin;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, RefreshCcw, UserPlus } from "lucide-react";

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

const API_BASE = "http://localhost:9000/api/trainers";

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

  /* ================= LOAD ================= */
  const loadTrainers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE, { headers: authHeaders() });
      setTrainers(res.data);
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

  /* ================= ADD ================= */
  const addTrainer = async () => {
    if (!form.name || !form.email || !form.expertise) {
      alert("Fill all fields");
      return;
    }

    try {
      await axios.post(API_BASE, form, { headers: authHeaders() });
      setForm({ name: "", email: "", expertise: "" });
      loadTrainers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add trainer");
    }
  };

  /* ================= STATUS ================= */
  const toggleStatus = async (id, status) => {
    const next = status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

    try {
      await axios.put(
        `${API_BASE}/${id}/status`,
        null,
        { params: { status: next }, headers: authHeaders() }
      );
      loadTrainers();
    } catch {
      alert("Failed to update status");
    }
  };

  /* ================= DELETE ================= */
  const deleteTrainer = async (id) => {
    if (!window.confirm("Delete trainer?")) return;

    try {
      await axios.delete(`${API_BASE}/${id}`, {
        headers: authHeaders(),
      });
      loadTrainers();
    } catch {
      alert("Failed to delete trainer");
    }
  };

  const filtered = trainers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
        <h1 className="text-3xl font-bold">Trainers</h1>
        <p className="mt-2 text-sm opacity-90">
          Manage trainers, expertise and access status
        </p>
      </div>

      {/* ACTION BAR */}
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
            onChange={(e) => setForm({ ...form, expertise: e.target.value })}
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

      {/* TABLE */}
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
