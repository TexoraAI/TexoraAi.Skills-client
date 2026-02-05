
import React, { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  BarChart3,
  ChevronDown,
} from "lucide-react";
import attendanceService from "../services/attendanceService";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const monthMap = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const Attendance = () => {
  const [month, setMonth] = useState("January");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const year = new Date().getFullYear();

  // ================= LOAD ATTENDANCE =================
  useEffect(() => {
    loadAttendance();
  }, [month]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.getMonthlyAttendance(
        year,
        monthMap[month]
      );

      const formatted = res.data.map((a) => ({
        date: a.date,
        status:
          a.status === "PRESENT"
            ? "Present"
            : a.status === "ABSENT"
            ? "Absent"
            : "Late",
      }));

      setAttendanceData(formatted);
    } catch (err) {
      console.error("Failed to load attendance", err);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= CALCULATE STATS =================
  const totalDays = attendanceData.length;
  const presentDays = attendanceData.filter(a => a.status === "Present").length;
  const lateDays = attendanceData.filter(a => a.status === "Late").length;
  const absentDays = attendanceData.filter(a => a.status === "Absent").length;
  const attendancePercentage = totalDays > 0 ? ((presentDays + lateDays) / totalDays * 100).toFixed(1) : 0;

  // ================= UI HELPERS =================
  const statusBadge = (status) => {
    if (status === "Present") 
      return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">Present</Badge>;
    if (status === "Late") 
      return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">Late</Badge>;
    return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800">Absent</Badge>;
  };

  const statusIcon = (status) => {
    if (status === "Present")
      return <CheckCircle className="text-emerald-500" size={20} />;
    if (status === "Late")
      return <AlertCircle className="text-amber-500" size={20} />;
    return <XCircle className="text-red-500" size={20} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* ================= MODERN HERO BANNER ================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 dark:from-teal-900 dark:via-cyan-900 dark:to-blue-900">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Floating orbs */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        
        {/* Content */}
        <div className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left side - Text content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Calendar className="h-4 w-4 text-teal-300" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Attendance Tracker
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                Attendance
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                Track your attendance record and monitor your presence throughout the month
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <CheckCircle className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{presentDays}</p>
                    <p className="text-xs text-white/70">Present Days</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <XCircle className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{absentDays}</p>
                    <p className="text-xs text-white/70">Absent Days</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <TrendingUp className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{attendancePercentage}%</p>
                    <p className="text-xs text-white/70">Attendance Rate</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-64 h-64 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center overflow-hidden">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                      <Calendar className="h-24 w-24 text-white/80" strokeWidth={1.5} />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-teal-400/20 blur-xl animate-pulse" />
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-blue-400/20 backdrop-blur-sm flex items-center justify-center animate-bounce">
                  <BarChart3 className="h-10 w-10 text-blue-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
        {/* Month Selector Card */}
        <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
                <Calendar className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Select Month
              </span>
            </div>

            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-full sm:w-[220px] border-2 border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(monthMap).map((m) => (
                  <SelectItem key={m} value={m}>
                    {m} {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Present</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{presentDays}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                  <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Late</p>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{lateDays}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/40">
                  <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Absent</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{absentDays}</p>
                </div>
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/40">
                  <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Days</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalDays}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/40">
                  <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg">
          <CardHeader className="border-b-2 border-slate-200 dark:border-slate-700 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20">
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Calendar className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              Monthly Attendance Record
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <TableHead className="font-bold text-slate-900 dark:text-slate-100">Date</TableHead>
                    <TableHead className="font-bold text-slate-900 dark:text-slate-100">Status</TableHead>
                    <TableHead className="font-bold text-slate-900 dark:text-slate-100">Indicator</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-slate-600 dark:text-slate-400">Loading attendance...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && attendanceData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <Calendar className="h-8 w-8 text-slate-400" />
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 font-medium">No attendance records found for {month}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading &&
                    attendanceData.map((att, idx) => (
                      <TableRow key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                          {att.date}
                        </TableCell>
                        <TableCell>{statusBadge(att.status)}</TableCell>
                        <TableCell>{statusIcon(att.status)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Attendance;