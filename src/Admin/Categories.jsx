import { courseService } from "@/services/courseService";
import {
  ArrowLeft,
  BookOpen,
  Layers,
  Search,
  Tag,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Styles (matched to AllCourses.jsx: font, colors, padding, sizes) ─── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap');
:root{
  --bg:#f6f3fb;--card:#ffffff;--tx:#1e1533;--mu:#6b6180;--bd:#e9e2f5;
  --blue:#7c3aed;--blue2:#db2777;
  --c1:#818cf8;--c1b:#4f46e5;
  --c2:#fbbf24;--c2b:#d97706;
  --c3:#34d399;--c3b:#059669;
  --c4:#f472b6;--c4b:#db2777;
  --c5:#60a5fa;--c5b:#2563eb;
  --cr:#f87171;
  --sh:0 4px 20px rgba(30,21,51,.07);--shl:0 10px 40px rgba(30,21,51,.14);--r:20px;--r-sm:14px;
}
.ca-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#a89fc0;--bd:rgba(255,255,255,0.07);
  --sh:0 4px 24px rgba(0,0,0,.45);--shl:0 10px 40px rgba(0,0,0,.6);}

*{box-sizing:border-box;}
.ca{font-family:'Plus Jakarta Sans','Poppins',sans-serif;min-height:100vh;
  background:linear-gradient(180deg,#f6f2fc 0%,#fbf6fb 100%);color:var(--tx);
  padding:24px;}
.ca-dk.ca{background:var(--bg);}
.ca-inner{max-width:1320px;margin:0 auto;display:flex;flex-direction:column;gap:18px;}

/* header — matches AllCourses gradient banner */
.ca-hdr{position:relative;overflow:hidden;background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 55%,#db2777 100%);border:1px solid rgba(124,58,237,.25);border-radius:var(--r);padding:14px 18px;box-shadow:0 12px 32px rgba(124,58,237,.28);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.ca-hdr::after{content:'';position:absolute;top:-60px;right:-40px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,.10);pointer-events:none;}
.ca-hdr::before{content:'';position:absolute;bottom:-70px;left:12%;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,.06);pointer-events:none;}
.ca-dk .ca-hdr{background:linear-gradient(135deg,#3730a3 0%,#6d28d9 55%,#be185d 100%);box-shadow:0 12px 32px rgba(190,24,93,.35);}
.ca-hdr-l{display:flex;align-items:center;gap:12px;min-width:0;position:relative;z-index:1;}
.ca-back{display:inline-flex;align-items:center;gap:5px;padding:7px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.16);color:#fff;font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s,background .2s;flex-shrink:0;backdrop-filter:blur(6px);}
.ca-back:hover{border-color:rgba(255,255,255,.6);background:rgba(255,255,255,.28);color:#fff;}
.ca-hdr-ico{width:38px;height:38px;border-radius:11px;background:rgba(255,255,255,.20);border:1px solid rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;backdrop-filter:blur(6px);}
.ca-bdg{display:inline-flex;align-items:center;gap:6px;padding:3px 9px;border-radius:50px;background:rgba(255,255,255,.22);color:#fff;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;}
.ca-h1{font-size:17px;font-weight:800;color:#fff;margin:0 0 1px;letter-spacing:-.01em;word-break:break-word;}
.ca-sub{font-size:11.5px;color:rgba(255,255,255,.9);margin:0;word-break:break-word;}
.ca-chips{display:flex;gap:8px;flex-wrap:wrap;position:relative;z-index:1;}
.ca-chip{display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:10px;background:rgba(255,255,255,.95);border:1px solid rgba(255,255,255,.5);box-shadow:0 4px 14px rgba(30,21,51,.12);font-size:11.5px;font-weight:700;white-space:nowrap;}
.ca-dk .ca-chip{background:rgba(17,17,17,.85);border-color:rgba(255,255,255,.15);}

/* hero stat cards — sized to match AllCourses */
.ca-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.ca-stat{position:relative;overflow:hidden;border-radius:14px;padding:14px 16px;color:#fff;box-shadow:var(--sh);min-height:78px;display:flex;flex-direction:column;justify-content:space-between;}
.ca-stat::after{content:'';position:absolute;top:-30px;right:-30px;width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,.12);}
.ca-stat-ico{width:26px;height:26px;border-radius:8px;background:rgba(255,255,255,.20);display:flex;align-items:center;justify-content:center;position:relative;z-index:1;}
.ca-stat-num{font-size:20px;font-weight:800;line-height:1;margin-top:6px;position:relative;z-index:1;}
.ca-stat-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;opacity:.9;margin-top:3px;position:relative;z-index:1;}
.ca-stat-c1{background:linear-gradient(135deg,var(--c1),var(--c1b));}
.ca-stat-c4{background:linear-gradient(135deg,var(--c4),var(--c4b));}
.ca-stat-c2{background:linear-gradient(135deg,var(--c2),var(--c2b));}
.ca-stat-c3{background:linear-gradient(135deg,var(--c3),var(--c3b));}

/* action bar — matches AllCourses search + buttons row */
.ca-abar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:10px 12px;box-shadow:var(--sh);}
.ca-search{position:relative;flex:1 1 260px;min-width:0;max-width:280px;display:flex;align-items:center;}
.ca-search svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
.ca-search input{width:100%;min-width:0;box-sizing:border-box;padding:8px 12px 8px 34px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:inherit;font-size:12.5px;font-weight:500;outline:none;transition:border-color .2s,box-shadow .2s;}
.ca-search input::placeholder{color:var(--mu);}
.ca-search input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(129,140,248,.14);}
.ca-abar-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.ca-btn-primary{display:inline-flex;align-items:center;gap:5px;padding:8px 14px;border-radius:11px;border:none;background:linear-gradient(135deg,var(--c1),var(--c1b));color:#fff;font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;box-shadow:0 6px 18px rgba(79,70,229,.30);transition:opacity .2s,transform .15s,box-shadow .2s;white-space:nowrap;}
.ca-btn-primary:hover{opacity:.92;transform:translateY(-1px);box-shadow:0 8px 22px rgba(79,70,229,.40);}
.ca-btn-outline{display:inline-flex;align-items:center;gap:5px;padding:8px 14px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s;white-space:nowrap;}
.ca-btn-outline:hover{border-color:rgba(124,58,237,.30);color:var(--blue);}

/* table card */
.ca-tcard{background:var(--card);border:1px solid var(--bd);border-radius:16px;box-shadow:var(--sh);overflow:hidden;}
.ca-thead-row{display:flex;align-items:center;justify-content:space-between;padding:11px 16px;border-bottom:1px solid var(--bd);background:var(--bg);}
.ca-thead-title{font-size:12px;font-weight:700;color:var(--tx);margin:0 0 1px;}
.ca-thead-sub{font-size:10.5px;color:var(--mu);margin:0;}

/* skeleton */
.ca-skel-row{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--bd);animation:ca-pulse 1.4s ease-in-out infinite;}
@keyframes ca-pulse{0%,100%{opacity:1}50%{opacity:.45}}
.ca-skel-l{display:flex;align-items:center;gap:10px;}
.ca-skel-sq{width:32px;height:32px;border-radius:10px;background:var(--bd);}
.ca-skel-line{height:9px;border-radius:6px;background:var(--bd);}
.ca-skel-pill{height:20px;width:70px;border-radius:30px;background:var(--bd);}

/* empty */
.ca-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:26px 18px;min-height:180px;gap:8px;text-align:center;}
.ca-empty-ico{width:46px;height:46px;border-radius:14px;background:rgba(129,140,248,.10);border:1px solid rgba(129,140,248,.18);display:flex;align-items:center;justify-content:center;color:var(--c1b);}
.ca-empty-t{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 3px;}
.ca-empty-s{font-size:11px;color:var(--mu);margin:0;}

/* table */
.ca-tscroll{width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;}
table.ca-t{width:100%;min-width:520px;border-collapse:collapse;font-size:12px;}
.ca-t thead th{padding:9px 12px;text-align:left;font-size:9.5px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.06em;background:var(--bg);border-bottom:1px solid var(--bd);white-space:nowrap;}
.ca-t thead th:first-child{padding-left:16px;}
.ca-t thead th:last-child{text-align:right;padding-right:16px;}
.ca-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
.ca-t tbody tr:last-child{border-bottom:none;}
.ca-t tbody tr:hover{background:rgba(129,140,248,.05);}
.ca-t tbody td{padding:10px 12px;vertical-align:middle;}
.ca-t tbody td:first-child{padding-left:16px;}
.ca-t tbody td:last-child{padding-right:16px;text-align:right;}
.ca-idx{font-size:11px;font-weight:700;color:var(--mu);}
.ca-cat-cell{display:flex;align-items:center;gap:10px;}
.ca-cat-av{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ca-cat-tag{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:8px;font-size:10.5px;font-weight:700;border:1px solid;white-space:nowrap;}
.ca-course-cnt{display:flex;align-items:center;gap:5px;font-size:12px;white-space:nowrap;}
.ca-cnt-num{font-weight:800;color:var(--tx);}
.ca-cnt-lbl{font-size:10.5px;color:var(--mu);}
.ca-status-active{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:8px;font-size:10.5px;font-weight:700;background:rgba(52,211,153,.10);border:1px solid rgba(52,211,153,.22);color:var(--c3b);white-space:nowrap;}
.ca-status-inactive{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:8px;font-size:10.5px;font-weight:700;background:var(--bg);border:1px solid var(--bd);color:var(--mu);white-space:nowrap;}
.ca-status-dot-active{width:5px;height:5px;border-radius:50%;background:var(--c3);animation:ca-blink 1.4s ease-in-out infinite;}
.ca-status-dot-inactive{width:5px;height:5px;border-radius:50%;background:var(--mu);}
@keyframes ca-blink{0%,100%{opacity:1}50%{opacity:.3}}

/* modal */
.ca-modal-overlay{position:fixed;inset:0;z-index:50;background:rgba(30,21,51,.55);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;}
.ca-modal{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);width:100%;max-width:400px;overflow:hidden;box-shadow:var(--shl);}
.ca-modal-head{padding:18px 20px;background:linear-gradient(180deg,rgba(129,140,248,.08),rgba(129,140,248,.02));border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;}
.ca-modal-head-l{display:flex;align-items:center;gap:10px;}
.ca-modal-ico{width:36px;height:36px;border-radius:11px;background:linear-gradient(145deg,var(--c1),var(--c1b));display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 6px 16px rgba(79,70,229,.32);}
.ca-modal-title{font-size:14px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.ca-modal-sub{font-size:11px;color:var(--mu);margin:0;}
.ca-modal-close{width:30px;height:30px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
.ca-modal-close:hover{border-color:rgba(248,113,113,.30);color:var(--cr);}
.ca-modal-body{padding:20px;display:flex;flex-direction:column;gap:14px;}
.ca-field label{display:block;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--mu);margin-bottom:6px;}
.ca-input{width:100%;padding:11px 13px;border-radius:12px;border:1.5px solid var(--bd);background:var(--bg);color:var(--tx);font-family:inherit;font-size:12.5px;outline:none;box-sizing:border-box;transition:border-color .18s,box-shadow .18s,background .18s;}
.ca-input:focus{border-color:var(--c1);box-shadow:0 0 0 4px rgba(129,140,248,.12);background:var(--card);}
.ca-input::placeholder{color:var(--mu);}
.ca-modal-footer{display:flex;justify-content:flex-end;gap:9px;}
.ca-cancel{padding:9px 17px;border-radius:11px;border:1.5px solid var(--bd);background:var(--bg);color:var(--mu);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;}
.ca-cancel:hover{border-color:rgba(129,140,248,.30);color:var(--c1b);}
.ca-submit{padding:9px 20px;border-radius:11px;border:none;background:linear-gradient(135deg,var(--c1),var(--c1b));color:#fff;font-family:inherit;font-size:12px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s,box-shadow .2s;box-shadow:0 6px 18px rgba(79,70,229,.30);}
.ca-submit:hover{opacity:.92;transform:translateY(-1px);box-shadow:0 8px 22px rgba(79,70,229,.40);}

/* ══════════ RESPONSIVE ══════════ */
@media (max-width:1200px){
  .ca-stats{grid-template-columns:repeat(3,1fr);}
}
@media (max-width:1024px){
  .ca{padding:20px;}
  .ca-hdr{padding:14px 16px;}
  .ca-stats{gap:10px;}
}
@media (max-width:834px){
  .ca-hdr{flex-direction:column;align-items:flex-start;padding:12px 14px;gap:10px;}
  .ca-hdr-l{flex-wrap:wrap;}
  .ca-chips{width:100%;}
  .ca-chip{flex:1 1 auto;justify-content:center;}
  .ca-stats{grid-template-columns:repeat(3,1fr);gap:8px;}
  .ca-abar{flex-direction:column;align-items:stretch;gap:8px;}
  .ca-search{max-width:none;}
  .ca-abar-actions{width:100%;}
  .ca-btn-primary,.ca-btn-outline{flex:1;justify-content:center;}
}
@media (max-width:768px){
  .ca{padding:14px;}
  .ca-inner{gap:12px;}
  .ca-hdr{padding:12px 14px;border-radius:14px;}
  .ca-hdr-ico{width:34px;height:34px;border-radius:10px;}
  .ca-h1{font-size:15px;}
  .ca-sub{display:none;}
  .ca-bdg{font-size:8.5px;padding:2px 7px;}
  .ca-stats{grid-template-columns:repeat(3,1fr);gap:8px;}
  .ca-stat{padding:10px 10px;min-height:66px;border-radius:12px;}
  .ca-stat-ico{width:22px;height:22px;}
  .ca-stat-num{font-size:16px;margin-top:2px;}
  .ca-stat-lbl{font-size:9.5px;}
  .ca-tcard{border-radius:16px;}
  .ca-thead-row{padding:9px 12px;}
  .ca-t thead th:first-child,.ca-t tbody td:first-child{padding-left:16px;}
  .ca-t thead th:last-child,.ca-t tbody td:last-child{padding-right:16px;}
  .ca-t th:first-child,.ca-t td.ca-idx-cell{display:none;}
}
@media (max-width:640px){
  .ca{padding:10px;}
  .ca-inner{gap:8px;}
  .ca-hdr{padding:10px 12px;border-radius:14px;gap:8px;}
  .ca-hdr-l{gap:8px;}
  .ca-hdr-ico{width:32px;height:32px;border-radius:9px;}
  .ca-h1{font-size:14px;}
  .ca-bdg{font-size:8.5px;padding:2px 7px;margin-bottom:3px;}
  .ca-back{padding:6px 9px;font-size:10px;}
  .ca-stats{grid-template-columns:repeat(3,1fr);gap:6px;}
  .ca-stat{padding:8px 8px;min-height:56px;border-radius:11px;}
  .ca-stat-ico{width:20px;height:20px;border-radius:7px;}
  .ca-stat-num{font-size:15px;margin-top:2px;}
  .ca-stat-lbl{font-size:8.5px;margin-top:1px;}
  .ca-tcard{border-radius:14px;}
  .ca-thead-row{padding:8px 10px;}
  .ca-t th:nth-child(1),.ca-t td:nth-child(1),
  .ca-t th:nth-child(4),.ca-t td:nth-child(4){display:none;}
  .ca-abar{gap:6px;flex-direction:column;align-items:stretch;}
  .ca-search{max-width:100%;}
  .ca-search input{padding:7px 10px 7px 32px;border-radius:10px;font-size:11.5px;}
  .ca-abar-actions{width:100%;display:flex;flex-direction:row;flex-wrap:wrap;gap:6px;}
  .ca-btn-primary,.ca-btn-outline{flex:1 1 auto;justify-content:center;padding:8px 10px;font-size:10.5px;border-radius:10px;}
}
@media (max-width:400px){
  .ca-hdr{padding:9px 10px;}
  .ca-hdr-ico{width:28px;height:28px;}
  .ca-stats{grid-template-columns:repeat(3,1fr);}
  .ca-chip{font-size:11px;padding:6px 10px;}
  .ca-h1{font-size:12.5px;}
  .ca-back span{display:none;}
}
`;

if (!document.getElementById("ca-st")) {
  const t = document.createElement("style");
  t.id = "ca-st";
  t.textContent = STYLES;
  document.head.appendChild(t);
}

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

/* ── category colours (matched to AllCourses catColor palette) ── */
const CAT_COLORS = [
  { bg: "rgba(129,140,248,.10)", color: "var(--c1b)", bd: "rgba(129,140,248,.20)" },
  { bg: "rgba(244,114,182,.10)", color: "var(--c4b)", bd: "rgba(244,114,182,.20)" },
  { bg: "rgba(251,191,36,.10)", color: "var(--c2b)", bd: "rgba(251,191,36,.20)" },
  { bg: "rgba(52,211,153,.10)", color: "var(--c3b)", bd: "rgba(52,211,153,.20)" },
  { bg: "rgba(96,165,250,.10)", color: "var(--c5b)", bd: "rgba(96,165,250,.20)" },
];
const catColor = (val) =>
  CAT_COLORS[(String(val)?.charCodeAt(0) ?? 0) % CAT_COLORS.length];

const GRAD_BG = [
  "linear-gradient(135deg,#6d28d9,#4338ca)",
  "linear-gradient(135deg,#db2777,#9d174d)",
  "linear-gradient(135deg,#d97706,#92400e)",
  "linear-gradient(135deg,#059669,#065f46)",
  "linear-gradient(135deg,#2563eb,#1e40af)",
  "linear-gradient(135deg,#7c3aed,#5b21b6)",
];
const gradBg = (val) =>
  GRAD_BG[(String(val)?.charCodeAt(0) ?? 0) % GRAD_BG.length];

/* ════════════════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════════════════ */
const Categories = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(isDark);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const o = new MutationObserver(() => setDark(isDark()));
    o.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);

  /* ── LOAD (unchanged) ── */
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    courseService
      .getOrgAdminCourses()
      .then((res) => {
        const courses = res.data;
        const grouped = {};
        courses.forEach((course) => {
          const category = course.category || "Uncategorized";
          if (!grouped[category]) grouped[category] = 0;
          grouped[category]++;
        });
        const formatted = Object.keys(grouped).map((categoryName, index) => ({
          id: index + 1,
          name: categoryName,
          courseCount: grouped[categoryName],
          active: true,
        }));
        setCategories(formatted);
      })
      .catch((err) => console.error("Failed to load categories", err))
      .finally(() => setLoading(false));
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const activeCount = categories.filter((c) => c.active).length;

  return (
    <div className={`ca${dark ? " ca-dk" : ""}`}>
      <div className="ca-inner">
        {/* ── Header ── */}
        <div className="ca-hdr">
          <div className="ca-hdr-l">
            <button
              className="ca-back"
              onClick={() => navigate("/admin/courses")}
            >
              <ArrowLeft size={13} /> <span>Back</span>
            </button>
            <div className="ca-hdr-ico">
              <Layers size={18} />
            </div>
            <div>
              <div className="ca-bdg">
                <Layers size={9} /> Course Management
              </div>
              <h1 className="ca-h1">Course Categories</h1>
              <p className="ca-sub">
                Organize courses into meaningful categories
              </p>
            </div>
          </div>
          <div className="ca-chips">
            <div className="ca-chip">
              <Layers size={13} style={{ color: "var(--c4b)" }} />
              <span style={{ fontWeight: 800, color: "var(--c4b)" }}>
                {categories.length}
              </span>
              <span style={{ color: "var(--mu)", fontWeight: 500 }}>
                Categories
              </span>
            </div>
            <div className="ca-chip">
              <BookOpen size={13} style={{ color: "var(--c1b)" }} />
              <span style={{ fontWeight: 800, color: "var(--c1b)" }}>
                {categories.reduce((a, c) => a + c.courseCount, 0)}
              </span>
              <span style={{ color: "var(--mu)", fontWeight: 500 }}>
                Courses
              </span>
            </div>
          </div>
        </div>

        {/* ── Hero stat cards ── */}
        <div className="ca-stats">
          <div className="ca-stat ca-stat-c1">
            <div className="ca-stat-ico">
              <Layers size={14} />
            </div>
            <div>
              <div className="ca-stat-num">{categories.length}</div>
              <div className="ca-stat-lbl">Total Categories</div>
            </div>
          </div>
          <div className="ca-stat ca-stat-c3">
            <div className="ca-stat-ico">
              <BookOpen size={14} />
            </div>
            <div>
              <div className="ca-stat-num">
                {categories.reduce((a, c) => a + c.courseCount, 0)}
              </div>
              <div className="ca-stat-lbl">Total Courses</div>
            </div>
          </div>
          <div className="ca-stat ca-stat-c4">
            <div className="ca-stat-ico">
              <Tag size={14} />
            </div>
            <div>
              <div className="ca-stat-num">{activeCount}</div>
              <div className="ca-stat-lbl">Active Categories</div>
            </div>
          </div>
        </div>

        {/* ── Action bar ── */}
        <div className="ca-abar">
          <div className="ca-search">
            <Search size={13} />
            <input
              placeholder="Search categories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Table card ── */}
        <div className="ca-tcard">
          <div className="ca-thead-row">
            <div>
              <p className="ca-thead-title">Category List</p>
              <p className="ca-thead-sub">
                {filteredCategories.length} categor
                {filteredCategories.length !== 1 ? "ies" : "y"} found
              </p>
            </div>
          </div>

          {/* skeleton */}
          {loading &&
            [1, 2, 3].map((i) => (
              <div key={i} className="ca-skel-row">
                <div className="ca-skel-l">
                  <div className="ca-skel-sq" />
                  <div className="ca-skel-line" style={{ width: 140 }} />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div className="ca-skel-pill" />
                  <div className="ca-skel-pill" style={{ width: 60 }} />
                </div>
              </div>
            ))}

          {/* empty */}
          {!loading && filteredCategories.length === 0 && (
            <div className="ca-empty">
              <div className="ca-empty-ico">
                <Layers size={22} />
              </div>
              <p className="ca-empty-t">No categories yet</p>
              <p className="ca-empty-s">
                Create categories to organize courses
              </p>
            </div>
          )}

          {/* table */}
          {!loading && filteredCategories.length > 0 && (
            <div className="ca-tscroll">
              <table className="ca-t">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Category</th>
                    <th>Total Courses</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((c, index) => {
                    const cc = catColor(c.name);
                    return (
                      <tr key={c.id}>
                        <td className="ca-idx-cell">
                          <span className="ca-idx">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </td>
                        <td>
                          <div className="ca-cat-cell">
                            <div
                              className="ca-cat-av"
                              style={{ background: gradBg(c.name) }}
                            >
                              <Tag size={14} color="white" />
                            </div>
                            <span
                              className="ca-cat-tag"
                              style={{
                                background: cc.bg,
                                color: cc.color,
                                borderColor: cc.bd,
                              }}
                            >
                              {c.name}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="ca-course-cnt">
                            <BookOpen
                              size={12}
                              style={{ color: "var(--mu)" }}
                            />
                            <span className="ca-cnt-num">
                              {c.courseCount}
                            </span>
                            <span className="ca-cnt-lbl">
                              course{c.courseCount !== 1 && "s"}
                            </span>
                          </div>
                        </td>
                        <td>
                          {c.active ? (
                            <span className="ca-status-active">
                              <span className="ca-status-dot-active" /> Active
                            </span>
                          ) : (
                            <span className="ca-status-inactive">
                              <span className="ca-status-dot-inactive" />{" "}
                              Inactive
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal (unchanged logic) ── */}
      {open && (
        <div
          className={`ca-modal-overlay${dark ? " ca-dk" : ""}`}
          onClick={() => setOpen(false)}
        >
          <div className="ca-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ca-modal-head">
              <div className="ca-modal-head-l">
                <div className="ca-modal-ico">
                  <Layers size={17} />
                </div>
                <div>
                  <p className="ca-modal-title">Add Category</p>
                  <p className="ca-modal-sub">Create a new course category</p>
                </div>
              </div>
              <button className="ca-modal-close" onClick={() => setOpen(false)}>
                <X size={14} />
              </button>
            </div>
            <div className="ca-modal-body">
              <div className="ca-field">
                <label>Category Name</label>
                <input
                  className="ca-input"
                  placeholder="e.g. Web Development"
                />
              </div>
              <div className="ca-modal-footer">
                <button className="ca-cancel" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button className="ca-submit">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;