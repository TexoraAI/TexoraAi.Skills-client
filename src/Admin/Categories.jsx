import { courseService } from "@/services/courseService";
import {
  ArrowLeft, BookOpen, Layers, Plus, Search, Tag, X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Styles ─────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.ca-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}

.ca{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
.ca-inner{max-width:1300px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}

/* header */
.ca-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.ca-hdr-l{display:flex;align-items:center;gap:14px;}
.ca-back{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s;flex-shrink:0;}
.ca-back:hover{border-color:rgba(34,211,238,.35);color:var(--c1);}
.ca-hdr-ico{width:52px;height:52px;border-radius:14px;background:rgba(167,139,250,.10);border:1px solid rgba(167,139,250,.18);display:flex;align-items:center;justify-content:center;color:var(--c4);flex-shrink:0;}
.ca-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(167,139,250,.08);color:var(--c4);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
.ca-h1{font-size:22px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.ca-sub{font-size:13px;color:var(--mu);margin:0;}
.ca-chips{display:flex;gap:10px;flex-wrap:wrap;}
.ca-chip{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);font-size:13px;font-weight:700;white-space:nowrap;box-shadow:var(--sh);}

/* action bar */
.ca-abar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.ca-search{position:relative;}
.ca-search svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
.ca-search input{padding:10px 14px 10px 38px;border-radius:13px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;width:260px;transition:border-color .2s,box-shadow .2s;}
.ca-search input::placeholder{color:var(--mu);}
.ca-search input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}

/* table card */
.ca-tcard{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.ca-thead-row{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-bottom:1px solid var(--bd);background:var(--bg);}
.ca-thead-title{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;}
.ca-thead-sub{font-size:11px;color:var(--mu);margin:0;}

/* skeleton */
.ca-skel-row{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid var(--bd);animation:ca-pulse 1.4s ease-in-out infinite;}
@keyframes ca-pulse{0%,100%{opacity:1}50%{opacity:.45}}
.ca-skel-l{display:flex;align-items:center;gap:12px;}
.ca-skel-sq{width:38px;height:38px;border-radius:12px;background:var(--bd);}
.ca-skel-line{height:10px;border-radius:6px;background:var(--bd);}
.ca-skel-pill{height:22px;width:80px;border-radius:30px;background:var(--bd);}

/* empty */
.ca-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 20px;gap:12px;text-align:center;}
.ca-empty-ico{width:56px;height:56px;border-radius:16px;background:rgba(167,139,250,.08);border:1px solid rgba(167,139,250,.15);display:flex;align-items:center;justify-content:center;color:var(--c4);}
.ca-empty-t{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 4px;}
.ca-empty-s{font-size:12px;color:var(--mu);margin:0;}

/* table */
table.ca-t{width:100%;border-collapse:collapse;font-size:13px;}
.ca-t thead th{padding:11px 14px;text-align:left;font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.07em;background:var(--bg);border-bottom:1px solid var(--bd);}
.ca-t thead th:first-child{padding-left:22px;}
.ca-t thead th:last-child{text-align:right;padding-right:22px;}
.ca-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
.ca-t tbody tr:last-child{border-bottom:none;}
.ca-t tbody tr:hover{background:rgba(167,139,250,.025);}
.ca-t tbody td{padding:12px 14px;vertical-align:middle;}
.ca-t tbody td:first-child{padding-left:22px;}
.ca-t tbody td:last-child{padding-right:22px;text-align:right;}
.ca-idx{font-size:12px;font-weight:700;color:var(--mu);}
.ca-cat-cell{display:flex;align-items:center;gap:12px;}
.ca-cat-av{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ca-cat-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid;}
.ca-course-cnt{display:flex;align-items:center;gap:6px;font-size:13px;}
.ca-cnt-num{font-weight:800;color:var(--tx);}
.ca-cnt-lbl{font-size:11px;color:var(--mu);}
.ca-status-active{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;background:rgba(52,211,153,.10);border:1px solid rgba(52,211,153,.20);color:var(--c3);}
.ca-status-inactive{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;background:var(--bg);border:1px solid var(--bd);color:var(--mu);}
.ca-status-dot-active{width:6px;height:6px;border-radius:50%;background:var(--c3);animation:ca-blink 1.4s ease-in-out infinite;}
.ca-status-dot-inactive{width:6px;height:6px;border-radius:50%;background:var(--mu);}
@keyframes ca-blink{0%,100%{opacity:1}50%{opacity:.3}}

/* modal */
.ca-modal-overlay{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;}
.ca-modal{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);width:100%;max-width:400px;overflow:hidden;box-shadow:var(--shl);}
.ca-modal-head{padding:18px 20px;background:rgba(167,139,250,.06);border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;}
.ca-modal-head-l{display:flex;align-items:center;gap:10px;}
.ca-modal-ico{width:36px;height:36px;border-radius:10px;background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.20);display:flex;align-items:center;justify-content:center;color:var(--c4);}
.ca-modal-title{font-size:14px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.ca-modal-sub{font-size:11px;color:var(--mu);margin:0;}
.ca-modal-close{width:30px;height:30px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
.ca-modal-close:hover{border-color:rgba(248,113,113,.30);color:var(--cr);}
.ca-modal-body{padding:20px;display:flex;flex-direction:column;gap:14px;}
.ca-field label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);margin-bottom:6px;}
.ca-input{width:100%;padding:10px 13px;border-radius:13px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;outline:none;box-sizing:border-box;transition:border-color .2s,box-shadow .2s;}
.ca-input:focus{border-color:var(--c4);box-shadow:0 0 0 3px rgba(167,139,250,.12);}
.ca-input::placeholder{color:var(--mu);}
.ca-modal-footer{display:flex;justify-content:flex-end;gap:8px;}
.ca-cancel{padding:10px 18px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;}
.ca-cancel:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
.ca-submit{padding:10px 22px;border-radius:12px;border:none;background:var(--c4);color:#0a0a0a;font-family:'Poppins',sans-serif;font-size:12px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s;}
.ca-submit:hover{opacity:.87;transform:translateY(-1px);}
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

/* ── category colours ── */
const CAT_COLORS = [
  { bg:"rgba(34,211,238,.10)",  color:"var(--c1)", bd:"rgba(34,211,238,.20)"  },
  { bg:"rgba(167,139,250,.10)", color:"var(--c4)", bd:"rgba(167,139,250,.20)" },
  { bg:"rgba(251,146,60,.10)",  color:"var(--c2)", bd:"rgba(251,146,60,.20)"  },
  { bg:"rgba(52,211,153,.10)",  color:"var(--c3)", bd:"rgba(52,211,153,.20)"  },
  { bg:"rgba(248,113,113,.10)", color:"var(--cr)", bd:"rgba(248,113,113,.20)" },
];
const catColor = val => CAT_COLORS[(String(val)?.charCodeAt(0) ?? 0) % CAT_COLORS.length];

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
const Categories = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(isDark);

  const [search, setSearch]         = useState("");
  const [open, setOpen]             = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const o = new MutationObserver(() => setDark(isDark()));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);

  /* ── LOAD (unchanged) ── */
  useEffect(() => { loadCategories(); }, []);

  const loadCategories = () => {
    courseService
      .getAllCoursesForAdmin()
      .then((res) => {
        const courses = res.data;
        const grouped = {};
        courses.forEach((course) => {
          const category = course.category || "Uncategorized";
          if (!grouped[category]) grouped[category] = 0;
          grouped[category]++;
        });
        const formatted = Object.keys(grouped).map((categoryName, index) => ({
          id:          index + 1,
          name:        categoryName,
          courseCount: grouped[categoryName],
          active:      true,
        }));
        setCategories(formatted);
      })
      .catch((err) => console.error("Failed to load categories", err))
      .finally(() => setLoading(false));
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = categories.filter((c) => c.active).length;

  return (
    <div className={`ca${dark ? " ca-dk" : ""}`}>
      <div className="ca-inner">

        {/* ── Header ── */}
        <div className="ca-hdr">
          <div className="ca-hdr-l">
            <button className="ca-back" onClick={() => navigate("/admin/courses")}>
              <ArrowLeft size={14} /> Back
            </button>
            <div className="ca-hdr-ico"><Layers size={24} /></div>
            <div>
              <div className="ca-bdg"><Layers size={10} /> Content Management</div>
              <h1 className="ca-h1">Course Categories</h1>
              <p className="ca-sub">Organize courses into meaningful categories</p>
            </div>
          </div>
          <div className="ca-chips">
            <div className="ca-chip">
              <Layers size={14} style={{ color: "var(--c4)" }} />
              <span style={{ fontWeight: 800, color: "var(--c4)" }}>{categories.length}</span>
              <span style={{ color: "var(--mu)", fontWeight: 500 }}>Categories</span>
            </div>
            <div className="ca-chip">
              <BookOpen size={14} style={{ color: "var(--c1)" }} />
              <span style={{ fontWeight: 800, color: "var(--c1)" }}>
                {categories.reduce((a, c) => a + c.courseCount, 0)}
              </span>
              <span style={{ color: "var(--mu)", fontWeight: 500 }}>Courses</span>
            </div>
          </div>
        </div>

        {/* ── Action bar ── */}
        <div className="ca-abar">
          <div className="ca-search">
            <Search size={14} />
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
                {filteredCategories.length} categor{filteredCategories.length !== 1 ? "ies" : "y"} found
              </p>
            </div>
          </div>

          {/* skeleton */}
          {loading && [1, 2, 3].map(i => (
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
              <div className="ca-empty-ico"><Layers size={26} /></div>
              <p className="ca-empty-t">No categories yet</p>
              <p className="ca-empty-s">Create categories to organize courses</p>
            </div>
          )}

          {/* table */}
          {!loading && filteredCategories.length > 0 && (
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
                      <td><span className="ca-idx">{String(index + 1).padStart(2, "0")}</span></td>
                      <td>
                        <div className="ca-cat-cell">
                          <div className="ca-cat-av" style={{ background: gradBg(c.name) }}>
                            <Tag size={16} color="white" />
                          </div>
                          <span className="ca-cat-tag" style={{ background: cc.bg, color: cc.color, borderColor: cc.bd }}>
                            {c.name}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="ca-course-cnt">
                          <BookOpen size={13} style={{ color: "var(--mu)" }} />
                          <span className="ca-cnt-num">{c.courseCount}</span>
                          <span className="ca-cnt-lbl">course{c.courseCount !== 1 && "s"}</span>
                        </div>
                      </td>
                      <td>
                        {c.active ? (
                          <span className="ca-status-active">
                            <span className="ca-status-dot-active" /> Active
                          </span>
                        ) : (
                          <span className="ca-status-inactive">
                            <span className="ca-status-dot-inactive" /> Inactive
                          </span>
                        )}
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
        <div className={`ca-modal-overlay${dark ? " ca-dk" : ""}`} onClick={() => setOpen(false)}>
          <div className="ca-modal" onClick={e => e.stopPropagation()}>
            <div className="ca-modal-head">
              <div className="ca-modal-head-l">
                <div className="ca-modal-ico"><Layers size={17} /></div>
                <div>
                  <p className="ca-modal-title">Add Category</p>
                  <p className="ca-modal-sub">Create a new course category</p>
                </div>
              </div>
              <button className="ca-modal-close" onClick={() => setOpen(false)}><X size={14} /></button>
            </div>
            <div className="ca-modal-body">
              <div className="ca-field">
                <label>Category Name</label>
                <input className="ca-input" placeholder="e.g. Web Development" />
              </div>
              <div className="ca-modal-footer">
                <button className="ca-cancel" onClick={() => setOpen(false)}>Cancel</button>
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