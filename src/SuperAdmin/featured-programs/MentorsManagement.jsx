import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  Star,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import MentorTable from "./components/MentorTable";
import MentorDrawer from "./components/MentorDrawer";
import { courseService } from "../../services/courseService"; // adjust path to match your project

const PAGE_SIZE_OPTIONS = [10, 25, 50];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, dark, accent }) => {
  const accentMap = {
    blue: {
      iconBg: dark ? "bg-blue-300/20" : "bg-white/40",
      gradient: dark
        ? "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 60%, #2563eb 100%)"
        : "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)",
      border: dark ? "rgba(96,165,250,0.35)" : "rgba(59,130,246,0.4)",
      val: dark ? "text-white" : "text-blue-900",
      sub: dark ? "text-blue-200" : "text-blue-700",
      iconColor: dark ? "text-blue-300" : "text-blue-600",
    },
    emerald: {
      iconBg: dark ? "bg-emerald-300/20" : "bg-white/40",
      gradient: dark
        ? "linear-gradient(135deg, #065f46 0%, #059669 60%, #10b981 100%)"
        : "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)",
      border: dark ? "rgba(52,211,153,0.35)" : "rgba(16,185,129,0.4)",
      val: dark ? "text-white" : "text-emerald-900",
      sub: dark ? "text-emerald-200" : "text-emerald-700",
      iconColor: dark ? "text-emerald-300" : "text-emerald-600",
    },
    red: {
      iconBg: dark ? "bg-red-300/20" : "bg-white/40",
      gradient: dark
        ? "linear-gradient(135deg, #7f1d1d 0%, #dc2626 60%, #ef4444 100%)"
        : "linear-gradient(135deg, #fee2e2 0%, #fecaca 50%, #fca5a5 100%)",
      border: dark ? "rgba(248,113,113,0.35)" : "rgba(239,68,68,0.4)",
      val: dark ? "text-white" : "text-red-900",
      sub: dark ? "text-red-200" : "text-red-700",
      iconColor: dark ? "text-red-300" : "text-red-600",
    },
    amber: {
      iconBg: dark ? "bg-amber-300/20" : "bg-white/40",
      gradient: dark
        ? "linear-gradient(135deg, #78350f 0%, #d97706 60%, #f59e0b 100%)"
        : "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)",
      border: dark ? "rgba(251,191,36,0.35)" : "rgba(245,158,11,0.4)",
      val: dark ? "text-white" : "text-amber-900",
      sub: dark ? "text-amber-200" : "text-amber-800",
      iconColor: dark ? "text-amber-300" : "text-amber-600",
    },
    violet: {
      iconBg: dark ? "bg-violet-300/20" : "bg-white/40",
      gradient: dark
        ? "linear-gradient(135deg, #3b0764 0%, #7c3aed 60%, #8b5cf6 100%)"
        : "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 50%, #c4b5fd 100%)",
      border: dark ? "rgba(167,139,250,0.35)" : "rgba(139,92,246,0.4)",
      val: dark ? "text-white" : "text-violet-900",
      sub: dark ? "text-violet-200" : "text-violet-700",
      iconColor: dark ? "text-violet-300" : "text-violet-600",
    },
  };
  const a = accentMap[accent] || accentMap.blue;
  return (
    <div
      className="rounded-xl border p-4 flex items-center gap-3 transition-all hover:scale-[1.02] hover:shadow-lg"
      style={{ background: a.gradient, borderColor: a.border }}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm ${a.iconBg}`}
      >
        <Icon size={20} className={a.iconColor} />
      </div>
      <div>
        <div className={`text-2xl font-bold leading-none mb-0.5 ${a.val}`}>
          {value}
        </div>
        <div className={`text-xs font-medium ${a.sub}`}>{label}</div>
      </div>
    </div>
  );
};

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
const DeleteModal = ({ mentor, onConfirm, onCancel, dark }) => {
  if (!mentor) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden ${
          dark ? "bg-[#0f0f1a] border border-white/10" : "bg-white"
        }`}
      >
        <div
          className={`px-6 pt-6 pb-4 flex flex-col items-center text-center ${dark ? "bg-red-500/5" : "bg-red-50"}`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
              dark ? "bg-red-500/10 text-red-400" : "bg-red-100 text-red-600"
            }`}
          >
            <AlertTriangle size={22} />
          </div>
          <h3
            className={`font-bold text-base ${dark ? "text-white" : "text-gray-900"}`}
          >
            Delete Feedback?
          </h3>
          <p
            className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-gray-500"}`}
          >
            This action cannot be undone.
          </p>
        </div>
        <div className="px-6 py-4">
          <p
            className={`text-sm text-center ${dark ? "text-slate-300" : "text-gray-700"}`}
          >
            Are you sure you want to delete feedback from{" "}
            <span
              className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}
            >
              {mentor.candidateName}
            </span>
            ? This will remove it from the landing page.
          </p>
        </div>
        <div className="flex gap-3 px-6 pb-5">
          <button
            onClick={onCancel}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              dark
                ? "border border-white/10 text-slate-300 hover:bg-white/5"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-medium ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  dark,
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Page numbers to show (max 5 visible)
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) range.unshift("...");
    if (currentPage + delta < totalPages - 1) range.push("...");

    range.unshift(1);
    if (totalPages !== 1) range.push(totalPages);

    for (const i of range) {
      if (l) {
        if (i === "..." && l !== "...") rangeWithDots.push("...");
        else if (i !== "...") rangeWithDots.push(i);
      } else {
        rangeWithDots.push(i);
      }
      l = i;
    }
    return rangeWithDots;
  };

  const btnBase = `h-8 min-w-[2rem] px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center`;
  const btnActive = dark
    ? "bg-violet-600 text-white shadow-md"
    : "bg-purple-600 text-white shadow-md";
  const btnInactive = dark
    ? "text-slate-400 hover:bg-white/[0.06] hover:text-white"
    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900";
  const btnDisabled = dark
    ? "text-slate-700 cursor-not-allowed"
    : "text-gray-300 cursor-not-allowed";
  const selectCls = dark
    ? "bg-white/[0.04] border border-white/8 text-white text-xs rounded-lg px-2 py-1 outline-none"
    : "bg-white border border-gray-200 text-gray-700 text-xs rounded-lg px-2 py-1 outline-none";

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t ${
        dark ? "border-white/8" : "border-gray-100"
      }`}
    >
      {/* Left: showing x–y of z */}
      <div className="flex items-center gap-3">
        <span
          className={`text-xs ${dark ? "text-slate-500" : "text-gray-500"}`}
        >
          Showing{" "}
          <span
            className={`font-semibold ${dark ? "text-slate-300" : "text-gray-700"}`}
          >
            {startItem}–{endItem}
          </span>{" "}
          of{" "}
          <span
            className={`font-semibold ${dark ? "text-slate-300" : "text-gray-700"}`}
          >
            {totalItems}
          </span>{" "}
          results
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs ${dark ? "text-slate-500" : "text-gray-500"}`}
          >
            Per page:
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className={selectCls}
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: page buttons */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* First */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}`}
            title="First page"
          >
            <ChevronsLeft size={13} />
          </button>
          {/* Prev */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}`}
          >
            <ChevronLeft size={13} />
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((page, idx) =>
            page === "..." ? (
              <span
                key={`dots-${idx}`}
                className={`h-8 px-1 flex items-center text-xs ${dark ? "text-slate-600" : "text-gray-400"}`}
              >
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`${btnBase} ${page === currentPage ? btnActive : btnInactive}`}
              >
                {page}
              </button>
            ),
          )}

          {/* Next */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnInactive}`}
          >
            <ChevronRight size={13} />
          </button>
          {/* Last */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnInactive}`}
            title="Last page"
          >
            <ChevronsRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const MentorsManagement = () => {
  // Dark mode
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark")),
    );
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  // ── Data state (now backend-driven) ──
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverPagination, setServerPagination] = useState({
    totalItems: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [selectedMentor, setSelectedMentor] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });

  // ── Stats (backend-driven) ──
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    featured: 0,
    avg: "0.0",
  });

  // Theme tokens
  const pageBg = dark ? "bg-[#0a0a14]" : "bg-gray-50";
  const headerBg = dark
    ? "bg-[#0f0f1a] border-white/8"
    : "bg-white border-gray-100";
  const cardBg = dark
    ? "bg-white/[0.03] border-white/8"
    : "bg-white border-gray-200";
  const titleText = dark ? "text-white" : "text-gray-900";
  const subText = dark ? "text-slate-400" : "text-gray-500";
  const mutedText = dark ? "text-slate-500" : "text-gray-400";
  const inputCls = dark
    ? "bg-white/[0.04] border-white/8 text-white placeholder-slate-600 focus:border-violet-500/60 focus:ring-violet-500/20"
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-400 focus:ring-purple-100";
  const selectCls = dark
    ? "bg-white/[0.04] border-white/8 text-white focus:border-violet-500/60"
    : "bg-white border-gray-200 text-gray-900 focus:border-purple-400";

  // ── Fetch mentors from backend ──
  const fetchMentors = async () => {
    setLoading(true);
    try {
      const { data } = await courseService.getAllMentorFeedbacks({
        search: search || undefined,
        status: statusFilter,
        rating: ratingFilter !== "all" ? ratingFilter : undefined,
        page: currentPage,
        size: pageSize,
      });
      setMentors(data.content || []);
      setServerPagination({
        totalItems: data.totalElements ?? 0,
        totalPages: data.totalPages ?? 1,
      });
    } catch (err) {
      console.error("Failed to fetch mentors", err);
      showToast("Failed to load mentor feedbacks.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch stats from backend ──
  const fetchStats = async () => {
    try {
      const { data } = await courseService.getMentorFeedbackStats();
      setStats({
        total: data.total,
        active: data.active,
        inactive: data.inactive,
        featured: data.featured,
        avg: Number(data.avgRating || 0).toFixed(1),
      });
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, ratingFilter]);

  // Re-fetch whenever filters / pagination change
  useEffect(() => {
    fetchMentors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, ratingFilter, currentPage, pageSize]);

  // Fetch stats once on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const totalPages = serverPagination.totalPages;
  const paginated = mentors; // backend already paginates

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  const openAdd = () => {
    setSelectedMentor(null);
    setDrawerMode("add");
    setDrawerOpen(true);
  };
  const openEdit = (mentor) => {
    setSelectedMentor(mentor);
    setDrawerMode("edit");
    setDrawerOpen(true);
  };
  const openView = (mentor) => {
    setSelectedMentor(mentor);
    setDrawerMode("view");
    setDrawerOpen(true);
  };
  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedMentor(null), 300);
  };

  // ── Create / Update ──
  const handleSubmit = async (formData) => {
    try {
      if (drawerMode === "add") {
        await courseService.createMentorFeedback(formData);
        showToast("Mentor feedback added successfully!");
      } else if (drawerMode === "edit") {
        await courseService.updateMentorFeedback(selectedMentor.id, formData);
        showToast("Mentor feedback updated successfully!");
      }
      closeDrawer();
      fetchMentors();
      fetchStats();
    } catch (err) {
      console.error("Save failed", err);
      showToast("Failed to save mentor feedback.", "error");
    }
  };

  // ── Toggle Active / Inactive ──
  const handleToggleStatus = async (mentor) => {
    try {
      const { data } = await courseService.toggleMentorFeedbackStatus(
        mentor.id,
      );
      showToast(
        `Feedback marked as ${data.status === "active" ? "Active" : "Inactive"}.`,
      );
      fetchMentors();
      fetchStats();
    } catch (err) {
      console.error("Toggle status failed", err);
      showToast("Failed to update status.", "error");
    }
  };

  // ── Delete ──
  const handleDeleteConfirm = async () => {
    try {
      await courseService.deleteMentorFeedback(deleteTarget.id);
      showToast("Mentor feedback deleted successfully.");
      setDeleteTarget(null);

      const newTotal = serverPagination.totalItems - 1;
      const newMaxPage = Math.max(1, Math.ceil(newTotal / pageSize));
      if (currentPage > newMaxPage) {
        setCurrentPage(newMaxPage); // triggers refetch via useEffect
      } else {
        fetchMentors();
      }
      fetchStats();
    } catch (err) {
      console.error("Delete failed", err);
      showToast("Failed to delete mentor feedback.", "error");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setRatingFilter("all");
  };

  const hasActiveFilters =
    search || statusFilter !== "all" || ratingFilter !== "all";

  return (
    <div className={`min-h-screen flex ${pageBg}`}>
      {/* ── LEFT: Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Page Header */}
        <div className={`border-b px-6 py-5 md:px-8 flex-shrink-0 ${headerBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`text-2xl font-bold ${titleText}`}>
                Mentors Management
              </h1>
              <p className={`text-sm mt-1 ${subText}`}>
                Manage landing page testimonials and mentor feedback cards.
              </p>
            </div>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-200/40 whitespace-nowrap self-start sm:self-auto"
            >
              <Plus size={17} /> Add Feedback
            </button>
          </div>
        </div>

        <div className="px-5 py-5 md:px-8 space-y-5 overflow-auto">
          {/* Stats — 5 cards (added Featured) */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <StatCard
              dark={dark}
              accent="blue"
              icon={Users}
              value={stats.total}
              label="Total Feedbacks"
            />
            <StatCard
              dark={dark}
              accent="emerald"
              icon={CheckCircle}
              value={stats.active}
              label="Active"
            />
            <StatCard
              dark={dark}
              accent="red"
              icon={XCircle}
              value={stats.inactive}
              label="Inactive"
            />
            <StatCard
              dark={dark}
              accent="violet"
              icon={Star}
              value={stats.featured}
              label="Featured"
            />
            <StatCard
              dark={dark}
              accent="amber"
              icon={Star}
              value={`${stats.avg}★`}
              label="Avg Rating"
            />
          </div>

          {/* Filters */}
          <div className={`rounded-xl border px-3 py-2.5 ${cardBg}`}>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex-1 min-w-[180px] relative">
                <Search
                  size={15}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedText}`}
                />
                <input
                  type="text"
                  placeholder="Search name, company, feedback..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 text-sm border rounded-lg outline-none focus:ring-2 transition-colors ${inputCls}`}
                />
              </div>

              <Filter size={15} className={`flex-shrink-0 ${mutedText}`} />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-2.5 py-2 text-sm border rounded-lg outline-none transition-colors ${selectCls}`}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className={`px-2.5 py-2 text-sm border rounded-lg outline-none transition-colors ${selectCls}`}
              >
                <option value="all">All Ratings</option>
                <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                <option value="3">⭐⭐⭐ 3 Stars</option>
                <option value="2">⭐⭐ 2 Stars</option>
                <option value="1">⭐ 1 Star</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className={`flex items-center gap-1 px-2.5 py-2 text-sm border rounded-lg transition-colors ${
                    dark
                      ? "border-white/8 text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <X size={14} /> Clear
                </button>
              )}

              <span className={`text-xs ml-auto ${mutedText}`}>
                {serverPagination.totalItems} result
                {serverPagination.totalItems !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Table + Pagination */}
          <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
            {loading ? (
              <div className={`py-16 text-center text-sm ${mutedText}`}>
                Loading mentor feedbacks...
              </div>
            ) : (
              <MentorTable
                mentors={paginated}
                onView={openView}
                onEdit={openEdit}
                onDelete={(mentor) => setDeleteTarget(mentor)}
                onToggleStatus={handleToggleStatus}
                dark={dark}
              />
            )}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={serverPagination.totalItems}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              dark={dark}
            />
          </div>

          {/* Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Star size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">
                Landing Page Connection
              </p>
              <p className="text-purple-200 text-sm mt-0.5">
                Only <strong className="text-white">Active</strong> feedbacks
                are shown in the <em>"Learn From Industry Experts"</em> section.
                Currently{" "}
                <strong className="text-white">
                  {stats.active} feedback(s)
                </strong>{" "}
                are live.
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-white text-xs font-semibold rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {stats.active} Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Drawer ── */}
      <MentorDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        onSubmit={handleSubmit}
        editData={selectedMentor}
        mode={drawerMode}
        dark={dark}
      />

      {/* Delete Modal */}
      <DeleteModal
        mentor={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        dark={dark}
      />

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
};

export default MentorsManagement;
