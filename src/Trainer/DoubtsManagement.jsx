// import React, { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   X,
//   MessageCircle,
//   Search,
//   Filter,
//   CheckCircle,
//   Clock,
//   AlertCircle,
//   Send,
//   User,
//   Calendar,
//   TrendingUp,
//   BarChart3,
//   Download,
//   Tag,
//   Sparkles,
// } from "lucide-react";

// const DoubtsManagement = () => {
//   const doubts = [
//     {
//       id: 1,
//       student: "Aman Kumar",
//       topic: "React useEffect",
//       status: "Open",
//       priority: "High",
//       category: "React",
//       date: "2025-02-01",
//       time: "10:30 AM",
//       messages: [
//         {
//           sender: "student",
//           text: "I'm confused about useEffect dependencies. When should I include a variable in the dependency array?",
//           time: "10:30 AM",
//         },
//       ],
//     },
//     {
//       id: 2,
//       student: "Neha Sharma",
//       topic: "Promises vs async/await",
//       status: "Resolved",
//       priority: "Medium",
//       category: "JavaScript",
//       date: "2025-01-31",
//       time: "2:15 PM",
//       messages: [
//         {
//           sender: "student",
//           text: "Can you explain the difference between Promises and async/await with examples?",
//           time: "2:15 PM",
//         },
//         {
//           sender: "trainer",
//           text: "Sure! async/await is syntactic sugar over Promises. Let me explain with an example...",
//           time: "2:45 PM",
//         },
//       ],
//     },
//     {
//       id: 3,
//       student: "Raj Patel",
//       topic: "State Management in React",
//       status: "Open",
//       priority: "Low",
//       category: "React",
//       date: "2025-02-01",
//       time: "11:45 AM",
//       messages: [
//         {
//           sender: "student",
//           text: "Should I use Redux or Context API for my project?",
//           time: "11:45 AM",
//         },
//       ],
//     },
//   ];

//   const [activeDoubt, setActiveDoubt] = useState(null);
//   const [reply, setReply] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [filterPriority, setFilterPriority] = useState("All");

//   const handleSendReply = () => {
//     if (reply.trim()) {
//       // Add reply logic here
//       console.log("Sending reply:", reply);
//       setReply("");
//     }
//   };

//   const handleResolve = (doubtId) => {
//     // Mark doubt as resolved
//     console.log("Resolving doubt:", doubtId);
//     setActiveDoubt(null);
//   };

//   // Filter doubts
//   const filteredDoubts = doubts.filter((doubt) => {
//     const matchesSearch =
//       doubt.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       doubt.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       doubt.category.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus =
//       filterStatus === "All" || doubt.status === filterStatus;
//     const matchesPriority =
//       filterPriority === "All" || doubt.priority === filterPriority;
//     return matchesSearch && matchesStatus && matchesPriority;
//   });

//   // Calculate stats
//   const openDoubts = doubts.filter((d) => d.status === "Open").length;
//   const resolvedDoubts = doubts.filter((d) => d.status === "Resolved").length;
//   const highPriority = doubts.filter((d) => d.priority === "High").length;
//   const resolutionRate =
//     doubts.length > 0 ? ((resolvedDoubts / doubts.length) * 100).toFixed(0) : 0;

//   const statusClasses = {
//     Open: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
//     Resolved:
//       "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
//   };

//   const priorityClasses = {
//     High: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
//     Medium:
//       "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
//     Low: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       {/* Premium Hero Header */}
//       <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-900 dark:via-purple-900 dark:to-fuchsia-900">
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
//               <MessageCircle className="w-6 h-6 text-white" />
//             </div>
//             <p className="text-xs font-semibold tracking-wide text-violet-100 uppercase">
//               Student Support
//             </p>
//           </div>
//           <h1 className="text-3xl font-bold text-white mb-2">
//             Doubts Management
//           </h1>
//           <p className="text-violet-100">
//             Track and resolve student queries from all batches
//           </p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Stats Dashboard */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
//                 <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-amber-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">{openDoubts}</p>
//             <p className="text-sm text-muted-foreground">Open Doubts</p>
//           </Card>

//           <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
//                 <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-emerald-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">
//               {resolvedDoubts}
//             </p>
//             <p className="text-sm text-muted-foreground">Resolved</p>
//           </Card>

//           <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-slate-900">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
//                 <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-rose-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">{highPriority}</p>
//             <p className="text-sm text-muted-foreground">High Priority</p>
//           </Card>

//           <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
//                 <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-purple-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">
//               {resolutionRate}%
//             </p>
//             <p className="text-sm text-muted-foreground">Resolution Rate</p>
//           </Card>
//         </div>

//         {/* Search & Filter Bar */}
//         <Card className="p-4 mb-6 border-slate-200 dark:border-slate-800 shadow-sm">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by topic, student, or category..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 border-slate-300 dark:border-slate-700"
//               />
//             </div>

//             {/* Actions */}
//             <div className="flex gap-2">
//               <Button variant="outline" size="sm" className="gap-2">
//                 <Download className="w-4 h-4" />
//                 Export
//               </Button>
//             </div>
//           </div>

//           {/* Filters */}
//           <div className="flex flex-col sm:flex-row gap-3 mt-4">
//             <div className="flex gap-2 overflow-x-auto pb-2">
//               <span className="text-xs font-medium text-muted-foreground flex items-center">
//                 Status:
//               </span>
//               {["All", "Open", "Resolved"].map((status) => (
//                 <Button
//                   key={status}
//                   size="sm"
//                   variant={filterStatus === status ? "default" : "outline"}
//                   onClick={() => setFilterStatus(status)}
//                   className={
//                     filterStatus === status
//                       ? "bg-purple-600 hover:bg-purple-700 text-white"
//                       : ""
//                   }
//                 >
//                   {status}
//                 </Button>
//               ))}
//             </div>

//             <div className="flex gap-2 overflow-x-auto pb-2">
//               <span className="text-xs font-medium text-muted-foreground flex items-center">
//                 Priority:
//               </span>
//               {["All", "High", "Medium", "Low"].map((priority) => (
//                 <Button
//                   key={priority}
//                   size="sm"
//                   variant={filterPriority === priority ? "default" : "outline"}
//                   onClick={() => setFilterPriority(priority)}
//                   className={
//                     filterPriority === priority
//                       ? "bg-purple-600 hover:bg-purple-700 text-white"
//                       : ""
//                   }
//                 >
//                   {priority}
//                 </Button>
//               ))}
//             </div>
//           </div>
//         </Card>

//         {/* Doubts List */}
//         {filteredDoubts.length === 0 ? (
//           <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
//             <div className="inline-flex p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
//               <MessageCircle className="w-12 h-12 text-purple-600 dark:text-purple-400" />
//             </div>
//             <h3 className="text-xl font-semibold text-foreground mb-2">
//               {doubts.length === 0 ? "No Doubts Yet" : "No Matching Doubts"}
//             </h3>
//             <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
//               {doubts.length === 0
//                 ? "Student doubts and queries will appear here. Students can ask questions through the platform."
//                 : "Try adjusting your search or filter criteria"}
//             </p>
//             {doubts.length === 0 && (
//               <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
//                 <Sparkles className="w-4 h-4" />
//                 <span>Encourage students to ask questions</span>
//               </div>
//             )}
//           </Card>
//         ) : (
//           <Card className="p-4 space-y-3 border-slate-200 dark:border-slate-800 shadow-sm">
//             {filteredDoubts.map((d) => (
//               <div
//                 key={d.id}
//                 className="group rounded-lg border border-slate-200 dark:border-slate-800 bg-background p-5 hover:shadow-md transition-all hover:border-purple-300 dark:hover:border-purple-700"
//               >
//                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                   {/* Left Section */}
//                   <div className="flex-1">
//                     <div className="flex items-start gap-3 mb-3">
//                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
//                         {d.student.charAt(0).toUpperCase()}
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="text-base font-semibold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
//                           {d.topic}
//                         </h3>
//                         <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
//                           <User className="w-3.5 h-3.5" />
//                           {d.student} · #{d.id}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex flex-wrap items-center gap-3 ml-13 text-xs text-muted-foreground">
//                       <span className="flex items-center gap-1.5">
//                         <Calendar className="w-3.5 h-3.5" />
//                         {d.date} at {d.time}
//                       </span>
//                       <span className="flex items-center gap-1.5">
//                         <Tag className="w-3.5 h-3.5" />
//                         {d.category}
//                       </span>
//                       <span className="flex items-center gap-1.5">
//                         <MessageCircle className="w-3.5 h-3.5" />
//                         {d.messages.length} message
//                         {d.messages.length !== 1 ? "s" : ""}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Right Section */}
//                   <div className="flex items-center gap-3 ml-13 lg:ml-0">
//                     <span
//                       className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border ${
//                         priorityClasses[d.priority]
//                       }`}
//                     >
//                       {d.priority === "High" && (
//                         <AlertCircle className="w-3 h-3" />
//                       )}
//                       {d.priority}
//                     </span>

//                     <span
//                       className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border ${
//                         statusClasses[d.status]
//                       }`}
//                     >
//                       {d.status === "Open" ? (
//                         <Clock className="w-3 h-3" />
//                       ) : (
//                         <CheckCircle className="w-3 h-3" />
//                       )}
//                       {d.status}
//                     </span>

//                     <Button
//                       size="sm"
//                       onClick={() => setActiveDoubt(d)}
//                       className="gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white"
//                     >
//                       <MessageCircle className="w-3.5 h-3.5" />
//                       {d.status === "Open" ? "Reply" : "View"}
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </Card>
//         )}
//       </div>

//       {/* ================= CHAT MODAL ================= */}
//       {activeDoubt && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           {/* Overlay */}
//           <div
//             className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//             onClick={() => setActiveDoubt(null)}
//           />

//           {/* Modal */}
//           <div className="relative z-50 w-full max-w-2xl rounded-xl border border-slate-200 dark:border-slate-800 bg-background shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
//             {/* Header */}
//             <div className="p-6 border-b border-slate-200 dark:border-slate-800">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-start gap-3 flex-1">
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
//                     {activeDoubt.student.charAt(0).toUpperCase()}
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold text-foreground">
//                       {activeDoubt.topic}
//                     </h3>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       {activeDoubt.student} · #{activeDoubt.id}
//                     </p>
//                   </div>
//                 </div>

//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setActiveDoubt(null)}
//                 >
//                   <X className="w-5 h-5" />
//                 </Button>
//               </div>

//               <div className="flex flex-wrap items-center gap-2">
//                 <span
//                   className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border ${
//                     statusClasses[activeDoubt.status]
//                   }`}
//                 >
//                   {activeDoubt.status === "Open" ? (
//                     <Clock className="w-3 h-3" />
//                   ) : (
//                     <CheckCircle className="w-3 h-3" />
//                   )}
//                   {activeDoubt.status}
//                 </span>
//                 <span
//                   className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border ${
//                     priorityClasses[activeDoubt.priority]
//                   }`}
//                 >
//                   {activeDoubt.priority}
//                 </span>
//                 <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
//                   <Tag className="w-3 h-3" />
//                   {activeDoubt.category}
//                 </span>
//               </div>
//             </div>

//             {/* Chat Messages */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-900/50">
//               {activeDoubt.messages.map((msg, index) => (
//                 <div
//                   key={index}
//                   className={`flex ${
//                     msg.sender === "trainer" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-[75%] rounded-lg p-4 ${
//                       msg.sender === "trainer"
//                         ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white"
//                         : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
//                     }`}
//                   >
//                     <p className="text-xs font-semibold mb-2 opacity-90">
//                       {msg.sender === "trainer" ? "You" : activeDoubt.student}
//                     </p>
//                     <p className="text-sm leading-relaxed">{msg.text}</p>
//                     <p
//                       className={`text-xs mt-2 ${
//                         msg.sender === "trainer"
//                           ? "text-white/70"
//                           : "text-muted-foreground"
//                       }`}
//                     >
//                       {msg.time}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Reply Box */}
//             <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
//               <div className="flex gap-3 mb-3">
//                 <Textarea
//                   value={reply}
//                   onChange={(e) => setReply(e.target.value)}
//                   placeholder="Type your reply..."
//                   rows={3}
//                   className="flex-1 resize-none border-slate-300 dark:border-slate-700"
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" && !e.shiftKey) {
//                       e.preventDefault();
//                       handleSendReply();
//                     }
//                   }}
//                 />
//               </div>
//               <div className="flex gap-2 justify-between">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handleResolve(activeDoubt.id)}
//                   className="gap-2"
//                   disabled={activeDoubt.status === "Resolved"}
//                 >
//                   <CheckCircle className="w-4 h-4" />
//                   Mark as Resolved
//                 </Button>
//                 <Button
//                   onClick={handleSendReply}
//                   disabled={!reply.trim()}
//                   className="gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white"
//                 >
//                   <Send className="w-4 h-4" />
//                   Send Reply
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DoubtsManagement;

import React, { useEffect, useState } from "react";
import {
  MessageCircle,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  TrendingUp,
  BarChart3,
  Download,
  Tag,
  Sparkles,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { getTrainerInbox } from "@/services/chatService";
import DoubtsChatModal from "./DoubtsChatModal";

const DoubtsManagement = () => {
  const trainerEmail = localStorage.getItem("email");

  const [doubts, setDoubts] = useState([]);
  const [activeDoubt, setActiveDoubt] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  // ================= LOAD TRAINER INBOX =================
  useEffect(() => {
    getTrainerInbox(trainerEmail).then((res) => {
      // Group messages by student
      const grouped = {};

      res.data.forEach((msg) => {
        const studentEmail =
          msg.senderRole === "STUDENT" ? msg.senderEmail : msg.receiverEmail;

        if (!grouped[studentEmail]) {
          grouped[studentEmail] = {
            id: Object.keys(grouped).length + 1,
            student: studentEmail.split("@")[0],
            studentEmail,
            topic: "Student Doubt",
            status: "Open",
            priority: "Medium",
            category: "General",
            date: new Date(msg.sentAt).toLocaleDateString(),
            time: new Date(msg.sentAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            messages: [],
          };
        }

        grouped[studentEmail].messages.push({
          sender: msg.senderRole === "TRAINER" ? "trainer" : "student",
          text: msg.message,
          time: new Date(msg.sentAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      });

      setDoubts(Object.values(grouped));
    });
  }, []);

  // ================= FILTER LOGIC (UNCHANGED) =================
  const filteredDoubts = doubts.filter((doubt) => {
    const matchesSearch =
      doubt.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doubt.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doubt.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || doubt.status === filterStatus;

    const matchesPriority =
      filterPriority === "All" || doubt.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // ================= STATS =================
  const openDoubts = doubts.filter((d) => d.status === "Open").length;
  const resolvedDoubts = doubts.filter((d) => d.status === "Resolved").length;
  const highPriority = doubts.filter((d) => d.priority === "High").length;
  const resolutionRate =
    doubts.length > 0 ? ((resolvedDoubts / doubts.length) * 100).toFixed(0) : 0;

  // ================= RESOLVE =================
  const handleResolve = (id) => {
    setDoubts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Resolved" } : d)),
    );
    setActiveDoubt(null);
  };

  // ================= UI (UNCHANGED) =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-white">Doubts Management</h1>
          <p className="text-violet-100">Track and resolve student queries</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Clock} label="Open Doubts" value={openDoubts} />
          <StatCard
            icon={CheckCircle}
            label="Resolved"
            value={resolvedDoubts}
          />
          <StatCard
            icon={AlertCircle}
            label="High Priority"
            value={highPriority}
          />
          <StatCard
            icon={BarChart3}
            label="Resolution Rate"
            value={`${resolutionRate}%`}
          />
        </div>

        {/* SEARCH */}
        <Card className="p-4 mb-6">
          <Input
            placeholder="Search by student or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Card>

        {/* LIST */}
        {filteredDoubts.length === 0 ? (
          <EmptyState />
        ) : (
          <Card className="p-4 space-y-3">
            {filteredDoubts.map((d) => (
              <div
                key={d.id}
                className="border p-5 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{d.student}</h3>
                  <p className="text-sm text-muted-foreground">
                    {d.messages.length} messages
                  </p>
                </div>
                <Button
                  onClick={() => setActiveDoubt(d)}
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
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
          onResolve={handleResolve}
        />
      )}
    </div>
  );
};

// ===== helper components =====
const StatCard = ({ icon: Icon, label, value }) => (
  <Card className="p-6">
    <Icon className="w-5 h-5 mb-2" />
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </Card>
);

const EmptyState = () => (
  <Card className="p-12 text-center">
    <Sparkles className="w-10 h-10 mx-auto mb-4" />
    <p>No doubts yet</p>
  </Card>
);

export default DoubtsManagement;
