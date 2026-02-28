import React, { useEffect, useState } from "react";
import { getTrainerBatches } from "../services/batchService";
import {
  Loader2,
  Users,
  Clock,
  Search,
  Grid3x3,
  List,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ===== Status Config ===== */
const statusVariant = {
  RUNNING: "default",
  UPCOMING: "secondary",
  COMPLETED: "outline",
};

const statusConfig = {
  RUNNING: {
    icon: PlayCircle,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    gradient: "from-emerald-500 to-teal-600",
  },
  UPCOMING: {
    icon: Clock,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/40",
    gradient: "from-blue-500 to-indigo-600",
  },
  COMPLETED: {
    icon: CheckCircle,
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800",
    gradient: "from-slate-500 to-slate-600",
  },
};

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    getTrainerBatches()
      .then((res) => setBatches(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.batchCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: batches.length,
    running: batches.filter((b) => b.status === "RUNNING").length,
    upcoming: batches.filter((b) => b.status === "UPCOMING").length,
    completed: batches.filter((b) => b.status === "COMPLETED").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b1220]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50 dark:bg-[#0b1220]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ================= HERO (REAL ICON + DARK FIX) ================= */}
        <div
          className="
          relative overflow-hidden rounded-3xl
          bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500
          p-6 shadow-xl
        "
        >
          <div className="relative z-10 flex items-center gap-4">
            {/* REAL ICON */}
            <div
              className="
              p-3 rounded-2xl
              bg-white
              shadow-lg
            "
            >
              <Users className="w-6 h-6 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">
                Batch Management
              </h1>
              <p className="text-sm text-white/90">
                Manage and monitor your training batches
              </p>
            </div>
          </div>

          {/* subtle glow */}
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-white/20 rounded-full blur-3xl" />
        </div>
        {/* ============================================================= */}

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total" value={stats.total} icon={Users} />
          <StatCard label="Running" value={stats.running} icon={PlayCircle} />
          <StatCard label="Upcoming" value={stats.upcoming} icon={Clock} />
          <StatCard
            label="Completed"
            value={stats.completed}
            icon={CheckCircle}
          />
        </div>

        {/* ================= FILTERS ================= */}
        <div className="bg-white dark:bg-[#0f1c3a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search batch..."
                className="
                  w-full pl-9 pr-3 py-2.5 rounded-xl border
                  bg-slate-50 dark:bg-[#0b1220]
                  text-slate-900 dark:text-slate-100
                  border-slate-300 dark:border-slate-700
                "
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {["ALL", "RUNNING", "UPCOMING", "COMPLETED"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                    statusFilter === s
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-[#0b1220] text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex bg-slate-100 dark:bg-[#0b1220] p-1.5 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid" && "bg-white dark:bg-[#162c63] shadow"
                }`}
              >
                <Grid3x3 className="w-4 h-4 text-slate-700 dark:text-slate-200" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg ${
                  viewMode === "table" && "bg-white dark:bg-[#162c63] shadow"
                }`}
              >
                <List className="w-4 h-4 text-slate-700 dark:text-slate-200" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= EMPTY ================= */}
        {filteredBatches.length === 0 && (
          <div className="bg-white dark:bg-[#0f1c3a] border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
            <AlertCircle className="w-10 h-10 mx-auto text-slate-400 mb-3" />
            <p className="text-slate-600 dark:text-slate-300">
              No batches found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ===== STAT CARD ===== */
const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white dark:bg-[#0f1c3a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between">
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {value}
      </p>
    </div>
    <Icon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
  </div>
);

export default Batches;
