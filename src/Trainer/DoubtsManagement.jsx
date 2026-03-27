
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { getTrainerStudents } from "@/services/chatService";
// import videoService from "@/services/videoService"; // ⭐ FIXED (was batchService)
// import { MessageCircle, Search, Sparkles, User } from "lucide-react";
// import { useEffect, useState } from "react";
// import DoubtsChatModal from "./DoubtsChatModal";

// const DoubtsManagement = () => {
//   const [batchId, setBatchId] = useState(null);
//   const [batches, setBatches] = useState([]);
//   const [doubts, setDoubts] = useState([]);
//   const [activeDoubt, setActiveDoubt] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   /* ================= LOAD TRAINER BATCHES (FIXED) ================= */
//   useEffect(() => {
//     const loadBatches = async () => {
//       try {
//         const res = await videoService.getTrainerBatches(); // ⭐ SAME AS UPLOAD VIDEOS
//         const list = res.data || [];

//         setBatches(list);

//         if (list.length > 0) {
//           setBatchId(list[0].id);
//         }
//       } catch (e) {
//         console.error("Failed to load batches", e);
//       }
//     };

//     loadBatches();
//   }, []);

//   /* ================= LOAD STUDENTS ================= */
//   useEffect(() => {
//     if (!batchId) return;

//     const loadStudents = async () => {
//       try {
//         const res = await getTrainerStudents(batchId);

//         const students = res.data.map((email, index) => ({
//           id: index + 1,
//           student: email.split("@")[0],
//           studentEmail: email,
//           batchId,
//         }));

//         setDoubts(students);
//       } catch (e) {
//         console.error("Failed to load students", e);
//         setDoubts([]);
//       }
//     };

//     loadStudents();
//   }, [batchId]);

//   const filteredDoubts = doubts.filter((d) =>
//     d.student.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <h1 className="text-xl font-bold">Doubts Management</h1>
//           <p className="text-sm opacity-90">Track & reply to student queries</p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-6">
//         {/* SELECT BATCH DROPDOWN */}
//         <Card className="p-3 mb-4">
//           <select
//             value={batchId || ""}
//             onChange={(e) => setBatchId(Number(e.target.value))}
//             className="w-full h-9 rounded-md border px-3 text-sm"
//           >
//             <option value="">Select Batch</option>
//             {batches.map((b) => (
//               <option key={b.id} value={b.id}>
//                 {b.name || "Batch"} (ID: {b.id})
//               </option>
//             ))}
//           </select>
//         </Card>

//         {/* SEARCH */}
//         <Card className="p-3 mb-4">
//           <div className="flex items-center gap-2">
//             <Search className="w-4 h-4 text-muted-foreground" />
//             <Input
//               className="h-8"
//               placeholder="Search student..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </Card>

//         {/* STUDENT LIST */}
//         {filteredDoubts.length === 0 ? (
//           <Card className="p-8 text-center">
//             <Sparkles className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
//             <p className="text-sm">
//               {batchId
//                 ? "No students in this batch"
//                 : "Please select a batch first"}
//             </p>
//           </Card>
//         ) : (
//           <Card className="p-3 space-y-2">
//             {filteredDoubts.map((d) => (
//               <div
//                 key={d.id}
//                 className="flex items-center justify-between border rounded-md px-3 py-2 hover:bg-muted/50 transition"
//               >
//                 <div className="flex items-center gap-3">
//                   <User className="w-4 h-4 text-muted-foreground" />
//                   <div>
//                     <p className="text-sm font-medium">{d.student}</p>
//                   </div>
//                 </div>

//                 <Button size="sm" onClick={() => setActiveDoubt(d)}>
//                   <MessageCircle className="w-4 h-4 mr-1" />
//                   Reply
//                 </Button>
//               </div>
//             ))}
//           </Card>
//         )}
//       </div>

//       {activeDoubt && (
//         <DoubtsChatModal
//           doubt={activeDoubt}
//           onClose={() => setActiveDoubt(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default DoubtsManagement;





























import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getTrainerStudents } from "@/services/chatService";
import videoService from "@/services/videoService";
import {
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Search,
  Sparkles,
  User,
  Users,
  Filter,
  Inbox,
} from "lucide-react";
import { useEffect, useState } from "react";
import DoubtsChatModal from "./DoubtsChatModal";

/* ─────────────────── Collapsible Section ─────────────────── */
const Section = ({ title, icon: Icon, count, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-3 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
      >
        <div className="flex items-center gap-2.5">
          {open ? (
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          )}
          {Icon && <Icon className="w-4 h-4 text-indigo-500" />}
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wide uppercase">
            {title}
          </span>
          {count !== undefined && (
            <span className="ml-1 text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
      </button>

      {/* Body */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
          {children}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────── Main Component ─────────────────── */
const DoubtsManagement = () => {
  const [batchId, setBatchId] = useState(null);
  const [batches, setBatches] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [activeDoubt, setActiveDoubt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  /* ── Load batches ── */
  useEffect(() => {
    const loadBatches = async () => {
      try {
        const res = await videoService.getTrainerBatches();
        const list = res.data || [];
        setBatches(list);
        if (list.length > 0) setBatchId(list[0].id);
      } catch (e) {
        console.error("Failed to load batches", e);
      }
    };
    loadBatches();
  }, []);

  /* ── Load students ── */
  useEffect(() => {
    if (!batchId) return;
    const loadStudents = async () => {
      try {
        const res = await getTrainerStudents(batchId);
        const students = res.data.map((email, index) => ({
          id: index + 1,
          student: email.split("@")[0],
          studentEmail: email,
          batchId,
        }));
        setDoubts(students);
      } catch (e) {
        console.error("Failed to load students", e);
        setDoubts([]);
      }
    };
    loadStudents();
  }, [batchId]);

  const filteredDoubts = doubts.filter((d) =>
    d.student.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f6fb] dark:bg-[#0d0f1a] font-sans">

      {/* ── Top Header Bar ── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
              <Inbox className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 dark:text-white leading-tight tracking-tight">
                Doubts Management
              </h1>
              <p className="text-xs text-slate-400">Track &amp; reply to student queries</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:block">
              {doubts.length} student{doubts.length !== 1 ? "s" : ""}
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* ── Section 1: Batch Selection ── */}
        <Section title="Batch Selection" icon={Filter} defaultOpen={true}>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Batch
            </label>
            <div className="relative">
              <select
                value={batchId || ""}
                onChange={(e) => setBatchId(Number(e.target.value))}
                className="w-full appearance-none h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 pr-8 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              >
                <option value="">— Select a Batch —</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name || "Batch"} (ID: {b.id})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </Section>

        {/* ── Section 2: Search / Filter ── */}
        <Section title="Search Students" icon={Search} defaultOpen={true}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              className="h-10 pl-9 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-400"
              placeholder="Search by student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Section>

        {/* ── Section 3: Student List ── */}
        <Section
          title="Students"
          icon={Users}
          count={filteredDoubts.length}
          defaultOpen={true}
        >
          {filteredDoubts.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">
                {batchId ? "No students found in this batch" : "Please select a batch first"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDoubts.map((d, i) => (
                <div
                  key={d.id}
                  className="group flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 hover:shadow-sm transition-all duration-150"
                >
                  {/* Left: Avatar + Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm uppercase select-none">
                      {d.student[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize">
                        {d.student}
                      </p>
                      <p className="text-xs text-slate-400">{d.studentEmail}</p>
                    </div>
                  </div>

                  {/* Right: Reply CTA */}
                  <Button
                    size="sm"
                    className="h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm gap-1.5 transition-all"
                    onClick={() => setActiveDoubt(d)}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Reply
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      {/* ── Chat Modal ── */}
      {activeDoubt && (
        <DoubtsChatModal
          doubt={activeDoubt}
          onClose={() => setActiveDoubt(null)}
        />
      )}
    </div>
  );
};

export default DoubtsManagement;