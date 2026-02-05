// // src/Admin/FeedbackAdmin.jsx
// import React from "react";

// const FeedbackAdmin = () => {
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-xl font-semibold text-slate-100">Feedback</h1>
//         <p className="mt-1 text-sm text-slate-400">
//           View and act on feedback from students and trainers.
//         </p>
//       </div>

//       {/* Summary cards */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <div className="rounded-2xl bg-emerald-900/70 border border-emerald-700 p-4">
//           <p className="text-xs text-emerald-200">Open feedback</p>
//           <p className="mt-2 text-2xl font-semibold text-emerald-50">0</p>
//           <p className="mt-1 text-[11px] text-emerald-200">
//             Items waiting for response.
//           </p>
//         </div>
//         <div className="rounded-2xl bg-amber-900/70 border border-amber-700 p-4">
//           <p className="text-xs text-amber-200">In progress</p>
//           <p className="mt-2 text-2xl font-semibold text-amber-50">0</p>
//           <p className="mt-1 text-[11px] text-amber-200">
//             Being reviewed by support.
//           </p>
//         </div>
//         <div className="rounded-2xl bg-slate-900/80 border border-slate-700 p-4">
//           <p className="text-xs text-slate-300">Resolved</p>
//           <p className="mt-2 text-2xl font-semibold text-slate-50">0</p>
//           <p className="mt-1 text-[11px] text-slate-300">
//             Closed feedback items.
//           </p>
//         </div>
//       </div>

//       {/* Filters row */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <div className="flex gap-2">
//           <select className="rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500">
//             <option value="all">All types</option>
//             <option value="bug">Bug</option>
//             <option value="feature">Feature request</option>
//             <option value="general">General</option>
//           </select>
//           <select className="rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500">
//             <option value="all">All status</option>
//             <option value="open">Open</option>
//             <option value="progress">In progress</option>
//             <option value="closed">Closed</option>
//           </select>
//         </div>
//         <input
//           type="text"
//           placeholder="Search feedback..."
//           className="w-full md:w-72 rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
//         />
//       </div>

//       {/* Feedback list placeholder */}
//       <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
//         <div className="flex text-xs font-semibold text-slate-400 border-b border-slate-800 pb-2 mb-3">
//           <div className="w-3/6">Title</div>
//           <div className="w-1/6">Type</div>
//           <div className="w-1/6">Status</div>
//           <div className="w-1/6 text-right">Last updated</div>
//         </div>

//         <p className="text-sm text-slate-400">
          
//         </p>
//       </div>
//     </div>
//   );
// };

// export default FeedbackAdmin;




// src/Admin/FeedbackAdmin.jsx
import React, { useState } from "react";
import {
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const FeedbackAdmin = () => {
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600">
        <h1 className="text-3xl font-bold">Feedback & Support</h1>
        <p className="mt-2 text-sm opacity-90">
          Review, track and respond to feedback from students and trainers
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Open Feedback
              </p>
              <AlertCircle className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                In Progress
              </p>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-3xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">
              Under review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Resolved
              </p>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">
              Closed items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex gap-2">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="progress">In progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search feedback..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* LIST */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Feedback Items
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* EMPTY STATE */}
          <div className="flex flex-col items-center justify-center py-14 text-muted-foreground">
            <MessageSquare className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">No feedback available</p>
            <p className="text-xs">
              Feedback will appear once users submit it
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackAdmin;
