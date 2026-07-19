//src/trainer/attdece-->trainerfile
import { getTrainerStudents } from "@/services/chatService";
import { useEffect, useState } from "react";
import attendanceService from "../services/attendanceService";
import videoService from "../services/videoService";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CalendarCheck,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  Filter,
  Search,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.at-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
.at{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
.at-in{max-width:1300px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}

/* ── HEADER ── */
.at-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:28px 32px;box-shadow:var(--sh);display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
.at-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.at-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}

/* ── HERO TITLE – gradient text (same as TrainerCourseManagement) ── */
.at-h1{font-family:'Poppins',sans-serif;font-weight:700;font-size:clamp(1.3rem,3vw,1.6rem);margin:0 0 2px;line-height:1.1;letter-spacing:-0.02em;color:var(--tx);}
.at-h1-grad{background:linear-gradient(135deg,#a78bfa,#22d3ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

.at-sub{font-size:12px;color:var(--mu);margin:0;display:flex;align-items:center;gap:5px;}
.at-toast{padding:13px 18px;border-radius:14px;background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.20);display:flex;align-items:center;gap:10px;color:var(--c3);font-size:13px;font-weight:600;}

/* ── STAT CARDS ── */
.at-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;}
.at-stat{border-radius:var(--r);padding:20px 22px;color:#fff;position:relative;overflow:hidden;box-shadow:var(--sh);}
.at-stat::before{content:"";position:absolute;right:-12px;top:-12px;width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.10);}
.at-sico{width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;margin-bottom:10px;}
.at-sv{font-size:28px;font-weight:800;line-height:1;margin-bottom:4px;}
.at-sl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;opacity:.65;}

/* ── BATCH BOX ── */
.at-box{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:22px 26px;box-shadow:var(--sh);}
.at-bhead{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
.at-bico{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.at-btitle{font-size:13px;font-weight:700;color:var(--tx);}
.at-sel{width:100%;padding:12px 40px 12px 14px;border-radius:13px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;appearance:none;cursor:pointer;transition:border-color .2s,box-shadow .2s;}
.at-sel:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.at-sel-wrap{position:relative;}
.at-sel-wrap svg{position:absolute;right:12px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}

/* ── TABLE WRAPPER ── */
.at-tbl-wrap{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.at-toolbar{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid var(--bd);flex-wrap:wrap;gap:12px;}
.at-tl{display:flex;align-items:center;gap:10px;}
.at-tname{font-size:13px;font-weight:700;color:var(--tx);}
.at-tcnt{font-size:11px;color:var(--mu);}
.at-tr{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.at-srch{position:relative;}
.at-srch svg{position:absolute;left:10px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
.at-srch input{padding:8px 12px 8px 32px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:12px;outline:none;width:130px;transition:border-color .2s;}
.at-srch input:focus{border-color:var(--c1);}
.at-srch input::placeholder{color:var(--mu);}
.at-fpill{padding:7px 14px;border-radius:10px;border:1px solid var(--bd);background:transparent;color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;}
.at-fpill:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
.at-fpill.on{color:white;}
.at-mpill{padding:7px 12px;border-radius:10px;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;border:none;transition:opacity .2s,transform .15s;}
.at-mpill:hover{opacity:.85;transform:translateY(-1px);}

/* ── PROGRESS BAR ── */
.at-prog{display:flex;align-items:center;gap:12px;padding:10px 22px;border-bottom:1px solid var(--bd);}
.at-prog-bar{flex:1;height:6px;border-radius:99px;background:var(--bd);overflow:hidden;display:flex;}
.at-prog-seg{height:100%;transition:width .5s;}
.at-pct{font-size:11px;font-weight:700;color:var(--mu);flex-shrink:0;}

/* ── ROWS ── */
.at-rows{divide-y:1px solid var(--bd);}
.at-row{display:flex;align-items:center;gap:12px;padding:12px 22px;border-bottom:1px solid var(--bd);transition:background .15s;}
.at-row:last-child{border-bottom:none;}
.at-row:hover{background:rgba(34,211,238,.025);}
.at-rav{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:white;flex-shrink:0;}
.at-rname{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;}
.at-remail{font-size:11px;color:var(--mu);margin:0;}
.at-rpill{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:9px;font-size:11px;font-weight:700;border:1px solid;flex-shrink:0;}
.at-rtbtn{width:28px;height:28px;border-radius:9px;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:11px;font-weight:800;font-family:'Poppins',sans-serif;transition:all .15s;}
.at-rtbtn.off{background:var(--bg);border:1px solid var(--bd)!important;color:var(--mu);}
.at-rtbtn.off:hover{background:rgba(34,211,238,.08);}

/* ── FOOTER ── */
.at-foot{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-top:1px solid var(--bd);flex-wrap:wrap;gap:12px;}
.at-fleg{display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
.at-fli{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;}
.at-fdot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.at-sbtn{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:13px;border:none;color:white;font-family:'Poppins',sans-serif;font-size:13px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s;background:linear-gradient(135deg,#1e3a8a,#2563eb);}
.at-sbtn:hover{opacity:.87;transform:translateY(-1px);}
.at-sbtn:disabled{opacity:.5;cursor:not-allowed;transform:none;}

/* ── EMPTY STATE ── */
.at-empty{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 20px;gap:12px;text-align:center;}
.at-eico{width:52px;height:52px;border-radius:15px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);}
.at-et{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 4px;}
.at-es{font-size:12px;color:var(--mu);max-width:260px;line-height:1.6;margin:0;}

/* ── TAB SWITCHER (NEW — additive) ── */
.at-tabs{display:flex;gap:8px;background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:6px;box-shadow:var(--sh);}
.at-tab{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:11px 16px;border-radius:11px;border:none;background:transparent;color:var(--mu);font-family:'Poppins',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .18s;}
.at-tab:hover{color:var(--tx);}
.at-tab.on{background:linear-gradient(135deg,#1e3a8a,#2563eb);color:#fff;}
.at-own-row{display:flex;align-items:center;gap:12px;padding:12px 22px;border-bottom:1px solid var(--bd);}
.at-own-row:last-child{border-bottom:none;}
.at-datepick{padding:11px 14px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;outline:none;transition:border-color .2s;}
.at-datepick:focus{border-color:var(--c1);}
.at-own-btns{display:flex;gap:10px;flex-wrap:wrap;}
.at-own-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 20px;border-radius:13px;border:none;color:#0a0a0a;font-family:'Poppins',sans-serif;font-size:13px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s;}
.at-own-btn:hover{opacity:.85;transform:translateY(-1px);}
.at-own-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.at-hist-empty{padding:40px 20px;text-align:center;color:var(--mu);font-size:13px;font-weight:600;}

/* ════════════════════════════════
   RESPONSIVE BREAKPOINTS
   ════════════════════════════════ */

/* ── TABLET (≤ 900px) ── */
@media(max-width:900px){
  .at{padding:18px;}
  .at-hdr{padding:22px 24px;}
  .at-h1{font-size:clamp(1.2rem,4vw,1.5rem);}
  .at-stats{grid-template-columns:repeat(2,1fr);gap:12px;}
  .at-sv{font-size:24px;}
  .at-box{padding:18px 20px;}
  .at-toolbar{padding:14px 18px;}
  .at-tr{gap:6px;}
  .at-row{padding:10px 18px;}
  .at-foot{padding:12px 18px;}
  .at-prog{padding:10px 18px;}
  .at-empty{padding:60px 20px;}
}

/* ── PHONE (≤ 600px) ── */
@media(max-width:600px){
  .at{padding:12px;}
  .at-in{gap:14px;}
  .at-hdr{padding:18px 18px;flex-direction:row;align-items:flex-start;gap:12px;}
  .at-ico{width:44px;height:44px;border-radius:12px;}
  .at-h1{font-size:clamp(1.1rem,5vw,1.3rem);}
  .at-sub{font-size:11px;}
  .at-stats{grid-template-columns:repeat(2,1fr);gap:10px;}
  .at-stat{padding:14px 16px;}
  .at-sico{width:28px;height:28px;}
  .at-sv{font-size:20px;}
  .at-sl{font-size:9px;}
  .at-box{padding:14px 16px;}
  .at-sel{font-size:12px;padding:10px 36px 10px 12px;}
  .at-toolbar{padding:12px 14px;flex-direction:column;align-items:flex-start;}
  .at-tr{width:100%;gap:6px;}
  .at-srch{width:100%;}
  .at-srch input{width:100%;box-sizing:border-box;}
  .at-fpill{padding:6px 10px;font-size:11px;}
  .at-mpill{padding:6px 10px;font-size:11px;}
  .at-row{padding:10px 14px;gap:8px;}
  .at-rav{width:30px;height:30px;font-size:11px;}
  .at-rname{font-size:12px;}
  .at-remail{font-size:10px;}
  .at-rpill{display:none;}
  .at-rtbtn{width:26px;height:26px;font-size:10px;}
  .at-prog{padding:8px 14px;}
  .at-foot{padding:12px 14px;flex-direction:column;align-items:stretch;gap:10px;}
  .at-fleg{gap:10px;}
  .at-fli{font-size:11px;}
  .at-sbtn{width:100%;justify-content:center;padding:11px 18px;font-size:12px;}
  .at-empty{padding:50px 16px;}
  .at-eico{width:44px;height:44px;}
  .at-et{font-size:13px;}
  .at-es{font-size:11px;}
  .at-tabs{flex-direction:row;}
  .at-tab{padding:10px 10px;font-size:12px;}
  .at-own-row{padding:10px 14px;flex-direction:column;align-items:stretch;gap:10px;}
  .at-own-btns{width:100%;}
  .at-own-btn{flex:1;justify-content:center;}
}

/* ── SMALL PHONE (≤ 380px) ── */
@media(max-width:380px){
  .at{padding:10px;}
  .at-stats{grid-template-columns:1fr 1fr;}
  .at-hdr{padding:14px 14px;}
  .at-bdg{font-size:9px;padding:3px 8px;}
  .at-sv{font-size:18px;}
  .at-fpill{padding:5px 8px;font-size:10px;}
  .at-mpill{padding:5px 8px;font-size:10px;}
  .at-row{gap:6px;}
  .at-rtbtn{width:24px;height:24px;}
}
`;

if (!document.getElementById("at-st")) {
  const t = document.createElement("style");
  t.id = "at-st";
  t.textContent = STYLES;
  document.head.appendChild(t);
}

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const todayISO = new Date().toISOString().split("T")[0];
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const SC = {
  PRESENT: {
    label: "Present",
    icon: CheckCircle,
    pill: {
      background: "rgba(52,211,153,.10)",
      color: "var(--c3)",
      borderColor: "rgba(52,211,153,.20)",
    },
    btnBg: "var(--c3)",
    dot: "#10b981",
  },
  ABSENT: {
    label: "Absent",
    icon: XCircle,
    pill: {
      background: "rgba(248,113,113,.10)",
      color: "var(--cr)",
      borderColor: "rgba(248,113,113,.20)",
    },
    btnBg: "var(--cr)",
    dot: "#f43f5e",
  },
  LATE: {
    label: "Late",
    icon: AlertCircle,
    pill: {
      background: "rgba(251,146,60,.10)",
      color: "var(--c2)",
      borderColor: "rgba(251,146,60,.20)",
    },
    btnBg: "var(--c2)",
    dot: "#f59e0b",
  },
};

const Attendance = () => {
  // ── EXISTING — student attendance marking state (untouched) ──
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showSuccess, setShowSuccess] = useState(false);
  const [dark, setDark] = useState(isDark);

  // ── NEW — "My Attendance" tab (additive, does not touch state above) ──
  const [activeTab, setActiveTab] = useState("students"); // "students" | "mine"
  const [ownBatchId, setOwnBatchId] = useState(null);
  const [ownDate, setOwnDate] = useState(todayISO);
  const [ownSaving, setOwnSaving] = useState(false);
  const [ownHistory, setOwnHistory] = useState([]);
  const [ownHistoryLoading, setOwnHistoryLoading] = useState(false);
  const [ownToast, setOwnToast] = useState(null); // { type: "success"|"error", msg }

  // ── NEW — "History & Reports" tab (additive) ──
  const [histFilterType, setHistFilterType] = useState("THIS_MONTH");
  const [histStartDate, setHistStartDate] = useState("");
  const [histEndDate, setHistEndDate] = useState("");
  const [histBatchId, setHistBatchId] = useState("");
  const [histReportType, setHistReportType] = useState("STUDENT"); // STUDENT | SESSION
  const [histStudentData, setHistStudentData] = useState(null);
  const [histSessionData, setHistSessionData] = useState(null);
  const [histLoading, setHistLoading] = useState(false);
  const [histError, setHistError] = useState(null);
  const [histDownloading, setHistDownloading] = useState(false);

  useEffect(() => {
    const o = new MutationObserver(() => setDark(isDark()));
    o.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await videoService.getTrainerBatches();
        setBatches(r.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!batchId) {
      setStudents([]);
      return;
    }
    const load = async () => {
      try {
        const r = await getTrainerStudents(batchId);
        setStudents(
          r.data.map((email, i) => ({
            userId: i + 1,
            email,
            name: email.split("@")[0],
            status: "PRESENT",
            batchId,
          })),
        );
      } catch (e) {
        console.error(e);
        setStudents([]);
      }
    };
    load();
  }, [batchId]);

  const updateStatus = (i, s) => {
    const c = [...students];
    c[i].status = s;
    setStudents(c);
  };
  const markAll = (s) =>
    setStudents(students.map((st) => ({ ...st, status: s })));
  const submitAttendance = async () => {
    try {
      setSaving(true);
      await attendanceService.markAttendance({
        batchId,
        attendanceDate: todayISO,
        attendances: students.map((s) => ({
          studentUserId: s.userId,
          studentEmail: s.email,
          status: s.status,
        })),
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch {
      alert("Failed to mark attendance");
    } finally {
      setSaving(false);
    }
  };

  const filtered = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      (s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)) &&
      (filterStatus === "All" || s.status === filterStatus)
    );
  });

  const presentCount = students.filter((s) => s.status === "PRESENT").length;
  const absentCount = students.filter((s) => s.status === "ABSENT").length;
  const lateCount = students.filter((s) => s.status === "LATE").length;
  const rate =
    students.length > 0
      ? ((presentCount + lateCount) / students.length) * 100
      : 0;
  const selectedBatch = batches.find((b) => b.id === batchId);

  const statCards = [
    {
      label: "Students",
      value: students.length,
      icon: <Users size={18} />,
      bg: "linear-gradient(135deg,#312e81,#6366f1)",
    },
    {
      label: "Present",
      value: presentCount,
      icon: <CheckCircle size={18} />,
      bg: "linear-gradient(135deg,#064e3b,#059669)",
    },
    {
      label: "Absent",
      value: absentCount,
      icon: <XCircle size={18} />,
      bg: "linear-gradient(135deg,#7f1d1d,#dc2626)",
    },
    {
      label: "Rate",
      value: `${rate.toFixed(0)}%`,
      icon: <BarChart3 size={18} />,
      bg: "linear-gradient(135deg,#78350f,#d97706)",
    },
  ];

  // ── NEW — load calling trainer's own current-month history ──
  const loadOwnHistory = async () => {
    setOwnHistoryLoading(true);
    try {
      const now = new Date();
      const r = await attendanceService.getOwnSessionHistory(
        now.getFullYear(),
        now.getMonth() + 1,
      );
      setOwnHistory(r.data || []);
    } catch (e) {
      console.error(e);
      setOwnHistory([]);
    } finally {
      setOwnHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "mine") {
      loadOwnHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // ── NEW — mark trainer's own attendance for selected batch/date ──
  const markOwnAttendance = async (status) => {
    if (!ownBatchId) {
      setOwnToast({ type: "error", msg: "Select a batch first" });
      setTimeout(() => setOwnToast(null), 3000);
      return;
    }
    try {
      setOwnSaving(true);
      await attendanceService.markOwnSession({
        batchId: ownBatchId,
        date: ownDate,
        status,
      });
      setOwnToast({
        type: "success",
        msg: `Marked ${status.toLowerCase()} for ${ownDate}`,
      });
      setTimeout(() => setOwnToast(null), 3000);
      loadOwnHistory();
    } catch (e) {
      console.error(e);
      setOwnToast({ type: "error", msg: "Failed to mark attendance" });
      setTimeout(() => setOwnToast(null), 3000);
    } finally {
      setOwnSaving(false);
    }
  };

  // ── NEW — fetch trainer's own history (student-marked or own-session) ──
  const buildHistParams = () => ({
    filterType: histFilterType,
    startDate: histFilterType === "CUSTOM" ? histStartDate : undefined,
    endDate: histFilterType === "CUSTOM" ? histEndDate : undefined,
    batchId: histBatchId || undefined,
  });

  const fetchHistoryReport = async () => {
    if (histFilterType === "CUSTOM" && (!histStartDate || !histEndDate)) {
      setHistError("Select both start and end date for a custom range.");
      return;
    }
    setHistLoading(true);
    setHistError(null);
    setHistStudentData(null);
    setHistSessionData(null);
    try {
      if (histReportType === "SESSION") {
        const r =
          await attendanceService.getTrainerSessionHistoryFiltered(
            buildHistParams(),
          );
        setHistSessionData(r.data);
      } else {
        const r = await attendanceService.getTrainerHistory(buildHistParams());
        setHistStudentData(r.data);
      }
    } catch (e) {
      console.error(e);
      setHistError("Failed to load history.");
    } finally {
      setHistLoading(false);
    }
  };

  const handleHistDownload = async () => {
    if (histFilterType === "CUSTOM" && (!histStartDate || !histEndDate)) {
      setHistError("Select both start and end date for a custom range.");
      return;
    }
    setHistDownloading(true);
    setHistError(null);
    try {
      const r = await attendanceService.downloadTrainerReport({
        ...buildHistParams(),
        type: histReportType,
      });
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "trainer-attendance-report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setHistError("Failed to download report.");
    } finally {
      setHistDownloading(false);
    }
  };

  return (
    <div className={`at${dark ? " at-dk" : ""}`}>
      <div className="at-in">
        {/* ── HEADER ── */}
        <div className="at-hdr">
          <div className="at-ico">
            <UserCheck size={24} />
          </div>
          <div>
            <div className="at-bdg">
              <UserCheck size={10} /> Attendance Management
            </div>
            {/* ✅ HERO TITLE – same gradient as TrainerCourseManagement */}
            <h1 className="at-h1">
              Today's <span className="at-h1-grad">Attendance</span>
            </h1>
            <p className="at-sub">
              <Calendar size={12} /> {formatDate(todayISO)}
            </p>
          </div>
        </div>

        {/* ── TAB SWITCHER (NEW) ──
        <div className="at-tabs">
          <button
            className={`at-tab${activeTab === "students" ? " on" : ""}`}
            onClick={() => setActiveTab("students")}
          >
            <Users size={15} /> Student Attendance
          </button>
          <button
            className={`at-tab${activeTab === "mine" ? " on" : ""}`}
            onClick={() => setActiveTab("mine")}
          >
            <CalendarCheck size={15} /> My Attendance
          </button>
        </div> */}
        {/* ── TAB SWITCHER (NEW) ── */}
        <div className="at-tabs">
          <button
            className={`at-tab${activeTab === "students" ? " on" : ""}`}
            onClick={() => setActiveTab("students")}
          >
            <Users size={15} /> Student Attendance
          </button>
          <button
            className={`at-tab${activeTab === "mine" ? " on" : ""}`}
            onClick={() => setActiveTab("mine")}
          >
            <CalendarCheck size={15} /> My Attendance
          </button>
          <button
            className={`at-tab${activeTab === "history" ? " on" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <Filter size={15} /> History & Reports
          </button>
        </div>

        {/* ══════════════════════════════════════════════
            EXISTING TAB — Student attendance marking
            (unchanged logic, only wrapped in a tab guard)
            ══════════════════════════════════════════════ */}
        {activeTab === "students" && (
          <>
            {/* ── SUCCESS TOAST ── */}
            {showSuccess && (
              <div className="at-toast">
                <CheckCircle size={16} /> Attendance submitted successfully!
              </div>
            )}

            {/* ── STAT CARDS ── */}
            <div className="at-stats">
              {statCards.map((s, i) => (
                <div key={i} className="at-stat" style={{ background: s.bg }}>
                  <div className="at-sico">{s.icon}</div>
                  <div className="at-sv">{s.value}</div>
                  <div className="at-sl">{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── BATCH SELECTOR ── */}
            <div className="at-box">
              <div className="at-bhead">
                <div
                  className="at-bico"
                  style={{
                    background: "rgba(34,211,238,.10)",
                    color: "var(--c1)",
                  }}
                >
                  <Users size={16} />
                </div>
                <span className="at-btitle">Select Batch</span>
              </div>
              <div className="at-sel-wrap">
                <select
                  className="at-sel"
                  value={batchId || ""}
                  onChange={(e) => setBatchId(Number(e.target.value))}
                >
                  <option value="">— Choose a batch —</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name || "Batch"} (ID: {b.id})
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} />
              </div>
            </div>

            {/* ── ATTENDANCE TABLE ── */}
            {students.length > 0 && (
              <div className="at-tbl-wrap">
                {/* toolbar */}
                <div className="at-toolbar">
                  <div className="at-tl">
                    <div
                      className="at-bico"
                      style={{
                        background: "rgba(34,211,238,.10)",
                        color: "var(--c1)",
                      }}
                    >
                      <Users size={15} />
                    </div>
                    <div>
                      <div className="at-tname">
                        {selectedBatch?.name || `Batch ${batchId}`}
                      </div>
                      <div className="at-tcnt">{students.length} students</div>
                    </div>
                  </div>
                  <div className="at-tr">
                    <div className="at-srch">
                      <Search size={13} />
                      <input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    {["All", "PRESENT", "ABSENT", "LATE"].map((s) => (
                      <button
                        key={s}
                        className={`at-fpill${filterStatus === s ? " on" : ""}`}
                        style={
                          filterStatus === s
                            ? {
                                background:
                                  "linear-gradient(135deg,#1e3a8a,#2563eb)",
                              }
                            : {}
                        }
                        onClick={() => setFilterStatus(s)}
                      >
                        {s === "All" ? "All" : s[0] + s.slice(1).toLowerCase()}
                      </button>
                    ))}
                    {["PRESENT", "ABSENT", "LATE"].map((s) => (
                      <button
                        key={s}
                        className="at-mpill"
                        style={{ background: SC[s].btnBg, color: "#0a0a0a" }}
                        onClick={() => markAll(s)}
                      >
                        All {s[0] + s.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* progress bar */}
                <div className="at-prog">
                  <div className="at-prog-bar">
                    <div
                      className="at-prog-seg"
                      style={{
                        width: `${students.length ? (presentCount / students.length) * 100 : 0}%`,
                        background: "#10b981",
                      }}
                    />
                    <div
                      className="at-prog-seg"
                      style={{
                        width: `${students.length ? (lateCount / students.length) * 100 : 0}%`,
                        background: "#f59e0b",
                      }}
                    />
                    <div
                      className="at-prog-seg"
                      style={{
                        width: `${students.length ? (absentCount / students.length) * 100 : 0}%`,
                        background: "#f43f5e",
                      }}
                    />
                  </div>
                  <span className="at-pct">{rate.toFixed(0)}% present</span>
                </div>

                {/* rows */}
                <div>
                  {filtered.length === 0 ? (
                    <div
                      style={{
                        padding: "40px 20px",
                        textAlign: "center",
                        color: "var(--mu)",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      No students match your filter
                    </div>
                  ) : (
                    filtered.map((s) => {
                      const cfg = SC[s.status];
                      const Icon = cfg.icon;
                      const ri = students.findIndex(
                        (st) => st.userId === s.userId,
                      );
                      return (
                        <div key={s.userId} className="at-row">
                          <div
                            className="at-rav"
                            style={{ background: `${cfg.dot}cc` }}
                          >
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p className="at-rname">{s.name}</p>
                            <p className="at-remail">{s.email}</p>
                          </div>
                          <span className="at-rpill" style={cfg.pill}>
                            <Icon size={11} />
                            {cfg.label}
                          </span>
                          <div
                            style={{ display: "flex", gap: 4, flexShrink: 0 }}
                          >
                            {["PRESENT", "ABSENT", "LATE"].map((st) => (
                              <button
                                key={st}
                                className={`at-rtbtn${s.status === st ? "" : " off"}`}
                                style={
                                  s.status === st
                                    ? {
                                        background: SC[st].btnBg,
                                        color: "#0a0a0a",
                                        border: "none",
                                      }
                                    : {}
                                }
                                onClick={() => updateStatus(ri, st)}
                                title={st[0] + st.slice(1).toLowerCase()}
                              >
                                {st === "PRESENT"
                                  ? "P"
                                  : st === "ABSENT"
                                    ? "A"
                                    : "L"}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* footer */}
                <div className="at-foot">
                  <div className="at-fleg">
                    <div className="at-fli">
                      <div
                        className="at-fdot"
                        style={{ background: "#10b981" }}
                      />
                      <span style={{ color: "var(--c3)" }}>
                        {presentCount} Present
                      </span>
                    </div>
                    <div className="at-fli">
                      <div
                        className="at-fdot"
                        style={{ background: "#f43f5e" }}
                      />
                      <span style={{ color: "var(--cr)" }}>
                        {absentCount} Absent
                      </span>
                    </div>
                    <div className="at-fli">
                      <div
                        className="at-fdot"
                        style={{ background: "#f59e0b" }}
                      />
                      <span style={{ color: "var(--c2)" }}>
                        {lateCount} Late
                      </span>
                    </div>
                  </div>
                  <button
                    className="at-sbtn"
                    onClick={submitAttendance}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            border: "2px solid rgba(255,255,255,.4)",
                            borderTopColor: "white",
                            borderRadius: "50%",
                            animation: "at-spin 0.8s linear infinite",
                          }}
                        />{" "}
                        Saving…
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} /> Submit Attendance (
                        {students.length})
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── EMPTY STATE ── */}
            {!batchId && (
              <div className="at-empty">
                <div className="at-eico">
                  <UserCheck size={26} />
                </div>
                <p className="at-et">Select a Batch to Begin</p>
                <p className="at-es">
                  Choose a batch from the dropdown above to load students and
                  mark today's attendance.
                </p>
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════
            NEW TAB — Trainer's own session attendance
            (backend-connected: attendanceService.markOwnSession /
            getOwnSessionHistory, per TrainerAttendanceController
            /session/mark and /session/history endpoints)
            ══════════════════════════════════════════════ */}
        {activeTab === "mine" && (
          <>
            {ownToast && (
              <div
                className="at-toast"
                style={
                  ownToast.type === "error"
                    ? {
                        background: "rgba(248,113,113,.08)",
                        borderColor: "rgba(248,113,113,.20)",
                        color: "var(--cr)",
                      }
                    : {}
                }
              >
                {ownToast.type === "error" ? (
                  <XCircle size={16} />
                ) : (
                  <CheckCircle size={16} />
                )}{" "}
                {ownToast.msg}
              </div>
            )}

            {/* ── BATCH + DATE SELECT ── */}
            <div className="at-box">
              <div className="at-bhead">
                <div
                  className="at-bico"
                  style={{
                    background: "rgba(34,211,238,.10)",
                    color: "var(--c1)",
                  }}
                >
                  <CalendarCheck size={16} />
                </div>
                <span className="at-btitle">Mark My Attendance</span>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div className="at-sel-wrap" style={{ flex: "1 1 220px" }}>
                  <select
                    className="at-sel"
                    value={ownBatchId || ""}
                    onChange={(e) => setOwnBatchId(Number(e.target.value))}
                  >
                    <option value="">— Choose a batch —</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name || "Batch"} (ID: {b.id})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} />
                </div>
                <input
                  type="date"
                  className="at-datepick"
                  value={ownDate}
                  max={todayISO}
                  onChange={(e) => setOwnDate(e.target.value)}
                  style={{ flex: "0 0 auto" }}
                />
              </div>
              <div className="at-own-btns" style={{ marginTop: 14 }}>
                <button
                  className="at-own-btn"
                  style={{ background: SC.PRESENT.btnBg }}
                  disabled={ownSaving}
                  onClick={() => markOwnAttendance("PRESENT")}
                >
                  <CheckCircle size={15} /> Mark Present
                </button>
                <button
                  className="at-own-btn"
                  style={{ background: SC.ABSENT.btnBg }}
                  disabled={ownSaving}
                  onClick={() => markOwnAttendance("ABSENT")}
                >
                  <XCircle size={15} /> Mark Absent
                </button>
              </div>
            </div>

            {/* ── OWN HISTORY (THIS MONTH) ── */}
            <div className="at-tbl-wrap">
              <div className="at-toolbar">
                <div className="at-tl">
                  <div
                    className="at-bico"
                    style={{
                      background: "rgba(34,211,238,.10)",
                      color: "var(--c1)",
                    }}
                  >
                    <Clock size={15} />
                  </div>
                  <div>
                    <div className="at-tname">This Month's History</div>
                    <div className="at-tcnt">{ownHistory.length} entries</div>
                  </div>
                </div>
              </div>

              {ownHistoryLoading ? (
                <div className="at-hist-empty">Loading…</div>
              ) : ownHistory.length === 0 ? (
                <div className="at-hist-empty">
                  No attendance marked yet this month
                </div>
              ) : (
                ownHistory
                  .slice()
                  .sort((a, b) => (a.sessionDate < b.sessionDate ? 1 : -1))
                  .map((h) => {
                    const cfg = SC[h.status] || SC.PRESENT;
                    const Icon = cfg.icon;
                    return (
                      <div key={h.id} className="at-own-row">
                        <div
                          className="at-rav"
                          style={{ background: `${cfg.dot}cc` }}
                        >
                          <Icon size={15} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p className="at-rname">
                            {formatDate(h.sessionDate)}
                          </p>
                          <p className="at-remail">Batch ID: {h.batchId}</p>
                        </div>
                        <span className="at-rpill" style={cfg.pill}>
                          <Icon size={11} />
                          {cfg.label}
                        </span>
                      </div>
                    );
                  })
              )}
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes at-spin{to{transform:rotate(360deg)}}`}</style>
      {/* ══════════════════════════════════════════════
            NEW TAB — History & Reports (filters + Excel export)
            ══════════════════════════════════════════════ */}
      {activeTab === "history" && (
        <>
          {histError && (
            <div
              className="at-toast"
              style={{
                background: "rgba(248,113,113,.08)",
                borderColor: "rgba(248,113,113,.20)",
                color: "var(--cr)",
              }}
            >
              <XCircle size={16} /> {histError}
            </div>
          )}

          <div className="at-box">
            <div className="at-bhead">
              <div
                className="at-bico"
                style={{
                  background: "rgba(167,139,250,.10)",
                  color: "#a78bfa",
                }}
              >
                <Filter size={16} />
              </div>
              <span className="at-btitle">Filter Attendance History</span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <select
                className="at-sel"
                style={{ flex: "1 1 160px" }}
                value={histFilterType}
                onChange={(e) => setHistFilterType(e.target.value)}
              >
                <option value="TODAY">Today</option>
                <option value="YESTERDAY">Yesterday</option>
                <option value="LAST_7_DAYS">Last 7 Days</option>
                <option value="LAST_14_DAYS">Last 14 Days</option>
                <option value="LAST_30_DAYS">Last 30 Days</option>
                <option value="THIS_WEEK">This Week</option>
                <option value="THIS_MONTH">This Month</option>
                <option value="CUSTOM">Custom Range</option>
              </select>

              {histFilterType === "CUSTOM" && (
                <>
                  <input
                    type="date"
                    className="at-datepick"
                    value={histStartDate}
                    onChange={(e) => setHistStartDate(e.target.value)}
                  />
                  <input
                    type="date"
                    className="at-datepick"
                    value={histEndDate}
                    onChange={(e) => setHistEndDate(e.target.value)}
                  />
                </>
              )}

              <input
                type="text"
                className="at-datepick"
                placeholder="Batch ID (optional)"
                value={histBatchId}
                onChange={(e) => setHistBatchId(e.target.value)}
                style={{ width: 150 }}
              />

              <select
                className="at-sel"
                style={{ flex: "0 1 180px" }}
                value={histReportType}
                onChange={(e) => setHistReportType(e.target.value)}
              >
                <option value="STUDENT">Student Attendance I Marked</option>
                <option value="SESSION">My Own Session Attendance</option>
              </select>
            </div>

            <div className="at-own-btns" style={{ marginTop: 14 }}>
              <button
                className="at-own-btn"
                style={{ background: "var(--c1)" }}
                disabled={histLoading}
                onClick={fetchHistoryReport}
              >
                <Search size={15} /> {histLoading ? "Loading…" : "Search"}
              </button>
              <button
                className="at-own-btn"
                style={{ background: "#a78bfa" }}
                disabled={histDownloading}
                onClick={handleHistDownload}
              >
                <Download size={15} />{" "}
                {histDownloading ? "Downloading…" : "Download Excel"}
              </button>
            </div>
          </div>

          {/* ANALYTICS SUMMARY */}
          {(histStudentData?.analytics || histSessionData?.analytics) && (
            <div
              className="at-box"
              style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
            >
              {(() => {
                const a =
                  histStudentData?.analytics || histSessionData?.analytics;
                return (
                  <>
                    <span
                      className="at-fpill on"
                      style={{ background: "var(--c1)" }}
                    >
                      Total: {a.totalSessions}
                    </span>
                    <span
                      className="at-fpill on"
                      style={{ background: "var(--c3)" }}
                    >
                      Present: {a.presentCount}
                    </span>
                    <span
                      className="at-fpill on"
                      style={{ background: "var(--cr)" }}
                    >
                      Absent: {a.absentCount}
                    </span>
                    <span
                      className="at-fpill on"
                      style={{ background: "var(--c2)" }}
                    >
                      Late: {a.lateCount}
                    </span>
                    <span
                      className="at-fpill on"
                      style={{ background: "#a78bfa" }}
                    >
                      %: {a.attendancePercentage.toFixed(1)}%
                    </span>
                  </>
                );
              })()}
            </div>
          )}

          {/* STUDENT RECORDS LIST */}
          {histStudentData?.records && (
            <div className="at-tbl-wrap">
              <div className="at-toolbar">
                <div className="at-tl">
                  <div className="at-tname">Student Attendance Records</div>
                  <div className="at-tcnt">
                    {histStudentData.records.length} records
                  </div>
                </div>
              </div>
              {histStudentData.records.length === 0 ? (
                <div className="at-hist-empty">
                  No records found for this filter.
                </div>
              ) : (
                histStudentData.records.map((r, i) => {
                  const cfg = SC[r.status] || SC.PRESENT;
                  const Icon = cfg.icon;
                  return (
                    <div key={i} className="at-own-row">
                      <div
                        className="at-rav"
                        style={{ background: `${cfg.dot}cc` }}
                      >
                        <Icon size={15} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="at-rname">{r.studentEmail}</p>
                        <p className="at-remail">
                          Batch {r.batchId} · {r.attendanceDate}
                        </p>
                      </div>
                      <span className="at-rpill" style={cfg.pill}>
                        <Icon size={11} />
                        {cfg.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* SESSION RECORDS LIST */}
          {histSessionData?.records && (
            <div className="at-tbl-wrap">
              <div className="at-toolbar">
                <div className="at-tl">
                  <div className="at-tname">My Session Records</div>
                  <div className="at-tcnt">
                    {histSessionData.records.length} records
                  </div>
                </div>
              </div>
              {histSessionData.records.length === 0 ? (
                <div className="at-hist-empty">
                  No records found for this filter.
                </div>
              ) : (
                histSessionData.records.map((h) => {
                  const cfg = SC[h.status] || SC.PRESENT;
                  const Icon = cfg.icon;
                  return (
                    <div key={h.id} className="at-own-row">
                      <div
                        className="at-rav"
                        style={{ background: `${cfg.dot}cc` }}
                      >
                        <Icon size={15} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="at-rname">{formatDate(h.sessionDate)}</p>
                        <p className="at-remail">Batch ID: {h.batchId}</p>
                      </div>
                      <span className="at-rpill" style={cfg.pill}>
                        <Icon size={11} />
                        {cfg.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Attendance;
