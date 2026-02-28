// src/Admin/FeedbackAdmin.jsx
import React, { useState } from "react";
import {
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
} from "lucide-react";

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

  const selectContentClass = `
    z-50 bg-white text-slate-900
    border border-slate-200 shadow-lg
    dark:bg-slate-900 dark:text-slate-100
    dark:border-slate-700
  `;

  return (
    <div className="space-y-6">

      {/* ✅ HERO (IMAGE SAME COLOR) */}
      <div className="rounded-2xl px-6 py-5 text-white shadow-lg
        bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
        <h1 className="text-2xl font-semibold">
          Feedback & Support
        </h1>
        <p className="text-sm opacity-90">
          Review, track and respond to feedback
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Open Feedback
              </p>
              <AlertCircle className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-semibold">0</p>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                In Progress
              </p>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-2xl font-semibold">0</p>
            <p className="text-xs text-muted-foreground">
              Under review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Resolved
              </p>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-semibold">0</p>
            <p className="text-xs text-muted-foreground">
              Closed items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS */}
      <Card>
        <CardContent className="p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex gap-2">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-36 h-8 text-xs">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className={selectContentClass}>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-36 h-8 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className={selectContentClass}>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="progress">In progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 h-8 text-sm"
              placeholder="Search feedback..."
            />
          </div>
        </CardContent>
      </Card>

      {/* LIST */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Feedback Items
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mb-2 opacity-40" />
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
