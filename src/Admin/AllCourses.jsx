import { courseService } from "@/services/courseService";
import {
  ArrowLeft, BookOpen, Folder, Mail, Plus,
  Search, Tag, Users, X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Styles ─────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.ac-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}

.ac{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
.ac-inner{max-width:1300px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}

/* header */
.ac-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.ac-hdr-l{display:flex;align-items:center;gap:14px;}
.ac-back{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s;flex-shrink:0;}
.ac-back:hover{border-color:rgba(34,211,238,.35);color:var(--c1);}
.ac-hdr-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.ac-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
.ac-h1{font-size:22px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.ac-sub{font-size:13px;color:var(--mu);margin:0;}
.ac-chips{display:flex;gap:10px;flex-wrap:wrap;}
.ac-chip{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);font-size:13px;font-weight:700;white-space:nowrap;box-shadow:var(--sh);}

/* action bar */
.ac-abar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.ac-search{position:relative;}
.ac-search svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
.ac-search input{padding:10px 14px 10px 38px;border-radius:13px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;width:260px;transition:border-color .2s,box-shadow .2s;}
.ac-search input::placeholder{color:var(--mu);}
.ac-search input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.ac-abar-r{display:flex;gap:8px;}
.ac-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border-radius:13px;border:none;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s;}
.ac-btn:hover{opacity:.87;transform:translateY(-1px);}
.ac-btn-outline{background:var(--card);border:1px solid var(--bd)!important;color:var(--mu);}
.ac-btn-outline:hover{border-color:rgba(34,211,238,.30)!important;color:var(--c1);}
.ac-btn-cyan{background:var(--c1);color:#0a0a0a;}

/* table card */
.ac-tcard{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.ac-thead-row{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-bottom:1px solid var(--bd);background:var(--bg);}
.ac-thead-title{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;}
.ac-thead-sub{font-size:11px;color:var(--mu);margin:0;}

/* skeleton */
.ac-skel-row{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid var(--bd);}
.ac-skel-l{display:flex;align-items:center;gap:12px;}
.ac-skel-sq{width:38px;height:38px;border-radius:12px;background:var(--bd);}
.ac-skel-line{height:10px;border-radius:6px;background:var(--bd);}
.ac-skel-pill{height:22px;width:80px;border-radius:30px;background:var(--bd);}
@keyframes ac-pulse{0%,100%{opacity:1}50%{opacity:.45}}
.ac-skel-row{animation:ac-pulse 1.4s ease-in-out infinite;}

/* empty */
.ac-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 20px;gap:12px;text-align:center;}
.ac-empty-ico{width:56px;height:56px;border-radius:16px;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);}
.ac-empty-t{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 4px;}
.ac-empty-s{font-size:12px;color:var(--mu);margin:0;}

/* table */
table.ac-t{width:100%;border-collapse:collapse;font-size:13px;}
.ac-t thead th{padding:11px 14px;text-align:left;font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.07em;background:var(--bg);border-bottom:1px solid var(--bd);}
.ac-t thead th:first-child{padding-left:22px;}
.ac-t thead th:last-child{text-align:right;padding-right:22px;}
.ac-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
.ac-t tbody tr:last-child{border-bottom:none;}
.ac-t tbody tr:hover{background:rgba(34,211,238,.025);}
.ac-t tbody td{padding:12px 14px;vertical-align:middle;}
.ac-t tbody td:first-child{padding-left:22px;}
.ac-t tbody td:last-child{padding-right:22px;text-align:right;}
.ac-idx{font-size:12px;font-weight:700;color:var(--mu);}
.ac-course-cell{display:flex;align-items:center;gap:12px;}
.ac-course-av{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ac-course-name{font-size:13px;font-weight:700;color:var(--tx);transition:color .15s;}
.ac-t tbody tr:hover .ac-course-name{color:var(--c1);}
.ac-cat-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid;}
.ac-trainer-cell{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--mu);}
.ac-status-ok{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;background:rgba(52,211,153,.10);border:1px solid rgba(52,211,153,.20);color:var(--c3);}
.ac-status-dot{width:6px;height:6px;border-radius:50%;background:var(--c3);animation:ac-blink 1.4s ease-in-out infinite;}
@keyframes ac-blink{0%,100%{opacity:1}50%{opacity:.3}}
.ac-enroll-cell{display:flex;align-items:center;justify-content:flex-end;gap:5px;font-size:13px;font-weight:700;color:var(--tx);}

/* modal overlay */
.ac-modal-overlay{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;}
.ac-modal{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);width:100%;max-width:400px;overflow:hidden;box-shadow:var(--shl);}
.ac-modal-head{padding:18px 20px;background:rgba(34,211,238,.06);border-bottom:1px solid var(--bd);}
.ac-modal-head-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:0;}
.ac-modal-head-l{display:flex;align-items:center;gap:10px;}
.ac-modal-ico{width:36px;height:36px;border-radius:10px;background:rgba(34,211,238,.12);border:1px solid rgba(34,211,238,.20);display:flex;align-items:center;justify-content:center;color:var(--c1);}
.ac-modal-title{font-size:14px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.ac-modal-sub{font-size:11px;color:var(--mu);margin:0;}
.ac-modal-close{width:30px;height:30px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
.ac-modal-close:hover{border-color:rgba(248,113,113,.30);color:var(--cr);}
.ac-modal-body{padding:20px;display:flex;flex-direction:column;gap:14px;}
.ac-field label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);margin-bottom:6px;}
.ac-input{width:100%;padding:10px 13px;border-radius:13px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;outline:none;box-sizing:border-box;transition:border-color .2s,box-shadow .2s;}
.ac-input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.ac-input::placeholder{color:var(--mu);}
.ac-modal-footer{display:flex;justify-content:flex-end;gap:8px;}
.ac-cancel{padding:10px 18px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;}
.ac-cancel:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
.ac-submit{padding:10px 22px;border-radius:12px;border:none;background:var(--c1);color:#0a0a0a;font-family:'Poppins',sans-serif;font-size:12px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s;}
.ac-submit:hover{opacity:.87;transform:translateY(-1px);}
`;

if (!document.getElementById("ac-st")) {
  const t = document.createElement("style");
  t.id = "ac-st";
  t.textContent = STYLES;
  document.head.appendChild(t);
}

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

/* ── category tag colours ── */
const CAT_COLORS = [
  { bg:"rgba(34,211,238,.10)",  color:"var(--c1)", bd:"rgba(34,211,238,.20)"  },
  { bg:"rgba(167,139,250,.10)", color:"var(--c4)", bd:"rgba(167,139,250,.20)" },
  { bg:"rgba(251,146,60,.10)",  color:"var(--c2)", bd:"rgba(251,146,60,.20)"  },
  { bg:"rgba(52,211,153,.10)",  color:"var(--c3)", bd:"rgba(52,211,153,.20)"  },
  { bg:"rgba(248,113,113,.10)", color:"var(--cr)", bd:"rgba(248,113,113,.20)" },
];
const catColor = val => CAT_COLORS[(String(val)?.charCodeAt(0) ?? 0) % CAT_COLORS.length];

/* ── avatar gradients ── */
const GRAD_BG = [
  "linear-gradient(135deg,#6d28d9,#4338ca)",
  "linear-gradient(135deg,#0891b2,#0e7490)",
  "linear-gradient(135deg,#be123c,#9f1239)",
  "linear-gradient(135deg,#b45309,#92400e)",
  "linear-gradient(135deg,#047857,#065f46)",
  "linear-gradient(135deg,#1d4ed8,#1e40af)",
];
const gradBg = val => GRAD_BG[(String(val)?.charCodeAt(0) ?? 0) % GRAD_BG.length];

/* ════════════════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════════════════ */
const AllCourses = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(isDark);

  const [search, setSearch]   = useState("");
  const [open, setOpen]       = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const o = new MutationObserver(() => setDark(isDark()));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);

  /* ── LOAD (unchanged) ── */
  useEffect(() => { loadCourses(); }, []);

  const loadCourses = () => {
    courseService
      .getAllCoursesForAdmin()
      .then((res) => {
        const mapped = res.data.map((c) => ({
          id:          c.id,
          name:        c.title,
          category:    c.category,
          trainerName: c.ownerEmail,
          status:      "PUBLISHED",
          enrollments: 0,
        }));
        setCourses(mapped);
      })
      .catch((err) => console.error("Failed to load courses", err))
      .finally(() => setLoading(false));
  };

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const publishedCount = courses.filter((c) => c.status === "PUBLISHED").length;

  return (
    <div className={`ac${dark ? " ac-dk" : ""}`}>
      <div className="ac-inner">

        {/* ── Header ── */}
        <div className="ac-hdr">
          <div className="ac-hdr-l">
            <button className="ac-back" onClick={() => navigate(-1)}>
              <ArrowLeft size={14} /> Back
            </button>
            <div className="ac-hdr-ico"><BookOpen size={24} /></div>
            <div>
              <div className="ac-bdg"><BookOpen size={10} /> Course Management</div>
              <h1 className="ac-h1">All Courses</h1>
              <p className="ac-sub">Approve, publish and manage all courses on the platform</p>
            </div>
          </div>
          <div className="ac-chips">
            <div className="ac-chip">
              <BookOpen size={14} style={{ color: "var(--c1)" }} />
              <span style={{ fontWeight: 800, color: "var(--c1)" }}>{courses.length}</span>
              <span style={{ color: "var(--mu)", fontWeight: 500 }}>Courses</span>
            </div>
            <div className="ac-chip">
              <Users size={14} style={{ color: "var(--c3)" }} />
              <span style={{ fontWeight: 800, color: "var(--c3)" }}>{publishedCount}</span>
              <span style={{ color: "var(--mu)", fontWeight: 500 }}>Published</span>
            </div>
          </div>
        </div>

        {/* ── Action bar ── */}
        <div className="ac-abar">
          <div className="ac-search">
            <Search size={14} />
            <input
              placeholder="Search courses…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="ac-abar-r">
            <button className="ac-btn ac-btn-outline" onClick={() => navigate("/admin/categories")}>
              <Folder size={14} style={{ color: "var(--c1)" }} /> Categories
            </button>
          </div>
        </div>

        {/* ── Table card ── */}
        <div className="ac-tcard">
          <div className="ac-thead-row">
            <div>
              <p className="ac-thead-title">Course List</p>
              <p className="ac-thead-sub">
                {filteredCourses.length} course{filteredCourses.length !== 1 && "s"} found
              </p>
            </div>
          </div>

          {/* skeleton */}
          {loading && [1, 2, 3].map(i => (
            <div key={i} className="ac-skel-row">
              <div className="ac-skel-l">
                <div className="ac-skel-sq" />
                <div>
                  <div className="ac-skel-line" style={{ width: 160, marginBottom: 8 }} />
                  <div className="ac-skel-line" style={{ width: 100 }} />
                </div>
              </div>
              <div className="ac-skel-pill" />
            </div>
          ))}

          {/* empty */}
          {!loading && filteredCourses.length === 0 && (
            <div className="ac-empty">
              <div className="ac-empty-ico"><BookOpen size={26} /></div>
              <p className="ac-empty-t">No courses available</p>
              <p className="ac-empty-s">Courses created by trainers will appear here</p>
            </div>
          )}

          {/* table */}
          {!loading && filteredCourses.length > 0 && (
            <table className="ac-t">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Trainer</th>
                  <th>Status</th>
                  <th>Enrollments</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((c, index) => {
                  const cc = catColor(c.category);
                  return (
                    <tr key={c.id}>
                      <td><span className="ac-idx">{String(index + 1).padStart(2, "0")}</span></td>
                      <td>
                        <div className="ac-course-cell">
                          <div className="ac-course-av" style={{ background: gradBg(c.name) }}>
                            <BookOpen size={16} color="white" />
                          </div>
                          <span className="ac-course-name">{c.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="ac-cat-tag" style={{ background: cc.bg, color: cc.color, borderColor: cc.bd }}>
                          <Tag size={11} /> {c.category || "—"}
                        </span>
                      </td>
                      <td>
                        <div className="ac-trainer-cell">
                          <Mail size={12} /> {c.trainerName}
                        </div>
                      </td>
                      <td>
                        <span className="ac-status-ok">
                          <span className="ac-status-dot" /> {c.status}
                        </span>
                      </td>
                      <td>
                        <div className="ac-enroll-cell">
                          <Users size={13} style={{ color: "var(--mu)" }} /> {c.enrollments}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* ── Modal (unchanged logic) ── */}
      {open && (
        <div className={`ac-modal-overlay${dark ? " ac-dk" : ""}`} onClick={() => setOpen(false)}>
          <div className="ac-modal" onClick={e => e.stopPropagation()}>
            <div className="ac-modal-head">
              <div className="ac-modal-head-row">
                <div className="ac-modal-head-l">
                  <div className="ac-modal-ico"><BookOpen size={17} /></div>
                  <div>
                    <p className="ac-modal-title">Create Course</p>
                    <p className="ac-modal-sub">Fill in the details below</p>
                  </div>
                </div>
                <button className="ac-modal-close" onClick={() => setOpen(false)}><X size={14} /></button>
              </div>
            </div>
            <div className="ac-modal-body">
              <div className="ac-field">
                <label>Course Name</label>
                <input className="ac-input" placeholder="e.g. React for Beginners" />
              </div>
              <div className="ac-field">
                <label>Category</label>
                <input className="ac-input" placeholder="e.g. Web Development" />
              </div>
              <div className="ac-field">
                <label>Trainer Name</label>
                <input className="ac-input" placeholder="trainer@example.com" />
              </div>
              <div className="ac-modal-footer">
                <button className="ac-cancel" onClick={() => setOpen(false)}>Cancel</button>
                <button className="ac-submit">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCourses;