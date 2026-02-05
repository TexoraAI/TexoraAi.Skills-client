
import React, { useEffect, useState } from "react";
import { getTrainerBatches } from "../services/batchService";
import { 
  Loader2, 
  Users, 
  Calendar, 
  Clock, 
  Search,
  Filter,
  Grid3x3,
  List,
  TrendingUp,
  Award,
  BookOpen,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ===== Status → shadcn variants ===== */
const statusVariant = {
  RUNNING: "default",
  UPCOMING: "secondary",
  COMPLETED: "outline",
};

const statusConfig = {
  RUNNING: {
    icon: PlayCircle,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-950/30",
    gradient: "from-emerald-500 to-teal-600",
  },
  UPCOMING: {
    icon: Clock,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950/30",
    gradient: "from-blue-500 to-indigo-600",
  },
  COMPLETED: {
    icon: CheckCircle,
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-700/30",
    gradient: "from-slate-500 to-slate-600",
  },
};

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

  useEffect(() => {
    getTrainerBatches()
      .then((res) => setBatches(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  // Filter batches
  const filteredBatches = batches.filter((batch) => {
    const matchesSearch = 
      batch.batchCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || batch.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: batches.length,
    running: batches.filter(b => b.status === "RUNNING").length,
    upcoming: batches.filter(b => b.status === "UPCOMING").length,
    completed: batches.filter(b => b.status === "COMPLETED").length,
  };

  /* ===== Loading ===== */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 rounded-full" />
            <Loader2 className="w-16 h-16 text-indigo-600 dark:text-indigo-400 animate-spin absolute inset-0" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading batches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">Batch Management</h1>
            </div>
            <p className="text-lg text-white/90">
              Manage and monitor all your assigned training batches
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Total Batches
                </p>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-4xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
            </div>
          </div>

          <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Running
                </p>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-4xl font-bold text-slate-900 dark:text-white">{stats.running}</p>
            </div>
          </div>

          <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Upcoming
                </p>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-4xl font-bold text-slate-900 dark:text-white">{stats.upcoming}</p>
            </div>
          </div>

          <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500 to-slate-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Completed
                </p>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-4xl font-bold text-slate-900 dark:text-white">{stats.completed}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by batch code or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {["ALL", "RUNNING", "UPCOMING", "COMPLETED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    statusFilter === status
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 p-1.5 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-600 shadow-md"
                    : "hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                <Grid3x3 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-600 shadow-md"
                    : "hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                <List className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredBatches.length}</span> of {batches.length} batches
          </p>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBatches.map((batch) => {
              const config = statusConfig[batch.status] || statusConfig.RUNNING;
              const StatusIcon = config.icon;
              
              return (
                <div
                  key={batch.batchCode}
                  className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />
                  
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg`}>
                        <StatusIcon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant={statusVariant[batch.status] || "outline"} className="text-xs">
                        {batch.status}
                      </Badge>
                    </div>

                    {/* Batch Info */}
                    <div>
                      <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">
                        {batch.name || "Untitled Batch"}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                        {batch.batchCode}
                      </p>
                    </div>

                    {/* Mock Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Students</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">32</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Progress</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">65%</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r ${config.gradient} text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300`}>
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <Card className="overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                  <tr className="text-slate-700 dark:text-slate-300">
                    <th className="py-4 px-6 text-left font-semibold">Batch Code</th>
                    <th className="py-4 px-6 text-left font-semibold">Batch Name</th>
                    <th className="py-4 px-6 text-left font-semibold">Status</th>
                    <th className="py-4 px-6 text-left font-semibold">Students</th>
                    <th className="py-4 px-6 text-left font-semibold">Progress</th>
                    <th className="py-4 px-6 text-left font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredBatches.map((batch) => {
                    const config = statusConfig[batch.status] || statusConfig.RUNNING;
                    const StatusIcon = config.icon;
                    
                    return (
                      <tr
                        key={batch.batchCode}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <span className="font-mono font-semibold text-slate-900 dark:text-white">
                            {batch.batchCode}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <span className="font-medium text-slate-900 dark:text-white">
                            {batch.name || "Untitled Batch"}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${config.bg}`}>
                              <StatusIcon className={`w-4 h-4 ${config.color}`} />
                            </div>
                            <Badge variant={statusVariant[batch.status] || "outline"}>
                              {batch.status}
                            </Badge>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="text-slate-700 dark:text-slate-300">32</span>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-2 bg-gradient-to-r ${config.gradient} rounded-full`}
                                style={{ width: "65%" }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-12">
                              65%
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors">
                            View
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {filteredBatches.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No batches found</h3>
              <p className="text-slate-600 dark:text-slate-400">
                {searchQuery || statusFilter !== "ALL"
                  ? "Try adjusting your search or filters"
                  : "You don't have any batches assigned yet"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Batches;