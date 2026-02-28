// import React, { useEffect, useState } from "react";
// import {
//   MessageCircle,
//   Search,
//   CheckCircle,
//   Clock,
//   AlertCircle,
//   User,
//   Calendar,
//   BarChart3,
//   Sparkles,
// } from "lucide-react";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import { getTrainerInbox } from "@/services/chatService";
// import DoubtsChatModal from "./DoubtsChatModal";

// const DoubtsManagement = () => {
//   const trainerEmail = JSON.parse(localStorage.getItem("lms_user"))?.email;

//   const [doubts, setDoubts] = useState([]);
//   const [activeDoubt, setActiveDoubt] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   // ================= LOAD TRAINER INBOX =================
//   useEffect(() => {
//     getTrainerInbox(trainerEmail).then((res) => {
//       const grouped = {};

//       res.data.forEach((msg) => {
//         const studentEmail =
//           msg.senderRole === "STUDENT" ? msg.senderEmail : msg.receiverEmail;

//         if (!grouped[studentEmail]) {
//           grouped[studentEmail] = {
//             id: Object.keys(grouped).length + 1,
//             student: studentEmail.split("@")[0],
//             studentEmail,
//             status: "Open",
//             priority: "Medium",
//             date: new Date(msg.sentAt).toLocaleDateString(),
//             messages: [],
//           };
//         }

//         grouped[studentEmail].messages.push({
//           sender: msg.senderRole === "TRAINER" ? "trainer" : "student",
//           text: msg.message,
//           time: new Date(msg.sentAt).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//         });
//       });

//       setDoubts(Object.values(grouped));
//     });
//   }, []);

//   // ================= FILTER =================
//   const filteredDoubts = doubts.filter((d) =>
//     d.student.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   // ================= STATS =================
//   const openDoubts = doubts.filter((d) => d.status === "Open").length;
//   const resolvedDoubts = doubts.filter((d) => d.status === "Resolved").length;
//   const resolutionRate =
//     doubts.length > 0
//       ? ((resolvedDoubts / doubts.length) * 100).toFixed(0)
//       : 0;

//   // ================= RESOLVE =================
//   const handleResolve = (id) => {
//     setDoubts((prev) =>
//       prev.map((d) => (d.id === id ? { ...d, status: "Resolved" } : d)),
//     );
//     setActiveDoubt(null);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
//       {/* HEADER */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <h1 className="text-xl font-bold">Doubts Management</h1>
//           <p className="text-sm opacity-90">
//             Track & reply to student queries
//           </p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-6">
//         {/* STATS */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
//           <StatCard
//             icon={Clock}
//             label="Open"
//             value={openDoubts}
//             color="text-amber-500"
//           />
//           <StatCard
//             icon={CheckCircle}
//             label="Resolved"
//             value={resolvedDoubts}
//             color="text-emerald-500"
//           />
//           <StatCard
//             icon={AlertCircle}
//             label="Pending"
//             value={openDoubts}
//             color="text-rose-500"
//           />
//           <StatCard
//             icon={BarChart3}
//             label="Resolution"
//             value={`${resolutionRate}%`}
//             color="text-indigo-500"
//           />
//         </div>

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

//         {/* DOUBTS LIST */}
//         {filteredDoubts.length === 0 ? (
//           <EmptyState />
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
//                     <p className="text-xs text-muted-foreground">
//                       {d.messages.length} messages
//                     </p>
//                   </div>
//                 </div>

//                 <Button
//                   size="sm"
//                   onClick={() => setActiveDoubt(d)}
//                   className="gap-1"
//                 >
//                   <MessageCircle className="w-4 h-4" />
//                   Reply
//                 </Button>
//               </div>
//             ))}
//           </Card>
//         )}
//       </div>

//       {/* CHAT MODAL */}
//       {activeDoubt && (
//         <DoubtsChatModal
//           doubt={activeDoubt}
//           onClose={() => setActiveDoubt(null)}
//           onResolve={handleResolve}
//         />
//       )}
//     </div>
//   );
// };

// // ================= HELPER COMPONENTS =================
// const StatCard = ({ icon: Icon, label, value, color }) => (
//   <Card className="p-3 flex items-center gap-3">
//     <Icon className={`w-5 h-5 ${color}`} />
//     <div>
//       <p className="text-lg font-semibold">{value}</p>
//       <p className="text-xs text-muted-foreground">{label}</p>
//     </div>
//   </Card>
// );

// const EmptyState = () => (
//   <Card className="p-8 text-center">
//     <Sparkles className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
//     <p className="text-sm">No doubts yet</p>
//   </Card>
// );

// export default DoubtsManagement;
import React, { useEffect, useState } from "react";
import { MessageCircle, Search, User, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTrainerStudents } from "@/services/chatService";
import { getTrainerBatches } from "@/services/batchService";
import DoubtsChatModal from "./DoubtsChatModal";

const DoubtsManagement = () => {
  const [batchId, setBatchId] = useState(null);
  const [doubts, setDoubts] = useState([]);
  const [activeDoubt, setActiveDoubt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getTrainerBatches().then((batches) => {
      if (batches?.length > 0) setBatchId(batches[0].id);
    });
  }, []);

  useEffect(() => {
    if (!batchId) return;

    getTrainerStudents(batchId).then((res) => {
      const students = res.data.map((email, index) => ({
        id: index + 1,
        student: email.split("@")[0],
        studentEmail: email,
        batchId,
      }));

      setDoubts(students);
    });
  }, [batchId]);

  const filteredDoubts = doubts.filter((d) =>
    d.student.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-xl font-bold">Doubts Management</h1>
          <p className="text-sm opacity-90">Track & reply to student queries</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <Card className="p-3 mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              className="h-8"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card>

        {filteredDoubts.length === 0 ? (
          <Card className="p-8 text-center">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm">No doubts yet</p>
          </Card>
        ) : (
          <Card className="p-3 space-y-2">
            {filteredDoubts.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between border rounded-md px-3 py-2 hover:bg-muted/50 transition"
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{d.student}</p>
                  </div>
                </div>

                <Button size="sm" onClick={() => setActiveDoubt(d)}>
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Reply
                </Button>
              </div>
            ))}
          </Card>
        )}
      </div>

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
