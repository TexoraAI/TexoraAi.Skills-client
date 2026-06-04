import { useState } from "react";
import { SESSION_TYPES } from "../constants/featuredProgramConstants";

const genId = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const emptySession = { title: "", type: "Live", date: "", time: "", duration: 60 };
const emptyModule = { title: "", description: "", sessions: [] };
const emptyWeek = { weekNumber: 1, title: "", startDate: "", endDate: "", modules: [] };

const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white";
const labelCls = "block text-xs font-medium text-gray-600 mb-1";

const sessionTypeColor = { Live: "bg-blue-100 text-blue-700", Recorded: "bg-purple-100 text-purple-700", Assignment: "bg-amber-100 text-amber-700" };

export default function ManualSyllabusBuilder({ weeks, onChange }) {
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [expandedModules, setExpandedModules] = useState({});
  const [editingWeek, setEditingWeek] = useState(null);
  const [editingModule, setEditingModule] = useState(null);
  const [editingSession, setEditingSession] = useState(null);

  // Week modal state
  const [weekForm, setWeekForm] = useState(null);
  const [moduleForm, setModuleForm] = useState(null);
  const [sessionForm, setSessionForm] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const toggleWeek = (id) => setExpandedWeeks(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleModule = (id) => setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));

  // --- WEEK CRUD ---
  const openAddWeek = () => {
    setWeekForm({ ...emptyWeek, id: genId(), weekNumber: weeks.length + 1 });
    setEditingWeek("add");
  };
  const openEditWeek = (week) => { setWeekForm({ ...week }); setEditingWeek(week.id); };
  const saveWeek = () => {
    if (!weekForm.title.trim()) return;
    if (editingWeek === "add") onChange([...weeks, weekForm]);
    else onChange(weeks.map(w => w.id === weekForm.id ? weekForm : w));
    setEditingWeek(null); setWeekForm(null);
  };
  const deleteWeek = (id) => onChange(weeks.filter(w => w.id !== id));

  // --- MODULE CRUD ---
  const openAddModule = (weekId) => { setModuleForm({ ...emptyModule, id: genId(), weekId }); setEditingModule("add"); };
  const openEditModule = (weekId, mod) => { setModuleForm({ ...mod, weekId }); setEditingModule(mod.id); };
  const saveModule = () => {
    if (!moduleForm.title.trim()) return;
    const { weekId, ...mod } = moduleForm;
    onChange(weeks.map(w => {
      if (w.id !== weekId) return w;
      const modules = editingModule === "add"
        ? [...w.modules, mod]
        : w.modules.map(m => m.id === mod.id ? mod : m);
      return { ...w, modules };
    }));
    setEditingModule(null); setModuleForm(null);
  };
  const deleteModule = (weekId, modId) => onChange(weeks.map(w => w.id === weekId ? { ...w, modules: w.modules.filter(m => m.id !== modId) } : w));

  // --- SESSION CRUD ---
  const openAddSession = (weekId, modId) => { setSessionForm({ ...emptySession, id: genId(), weekId, modId }); setEditingSession("add"); };
  const openEditSession = (weekId, modId, sess) => { setSessionForm({ ...sess, weekId, modId }); setEditingSession(sess.id); };
  const saveSession = () => {
    if (!sessionForm.title.trim()) return;
    const { weekId, modId, ...sess } = sessionForm;
    onChange(weeks.map(w => {
      if (w.id !== weekId) return w;
      return {
        ...w, modules: w.modules.map(m => {
          if (m.id !== modId) return m;
          const sessions = editingSession === "add"
            ? [...m.sessions, sess]
            : m.sessions.map(s => s.id === sess.id ? sess : s);
          return { ...m, sessions };
        })
      };
    }));
    setEditingSession(null); setSessionForm(null);
  };
  const deleteSession = (weekId, modId, sessId) => onChange(weeks.map(w => w.id !== weekId ? w : { ...w, modules: w.modules.map(m => m.id !== modId ? m : { ...m, sessions: m.sessions.filter(s => s.id !== sessId) }) }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-500">{weeks.length} Week{weeks.length !== 1 ? "s" : ""} • {weeks.reduce((a, w) => a + w.modules.length, 0)} Modules • {weeks.reduce((a, w) => a + w.modules.reduce((b, m) => b + m.sessions.length, 0), 0)} Sessions</div>
        <button onClick={openAddWeek} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <span>+</span> Add Week
        </button>
      </div>

      {weeks.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="font-semibold text-gray-700 mb-1">No weeks added yet</h3>
          <p className="text-sm text-gray-400 mb-4">Start building your syllabus by adding the first week</p>
          <button onClick={openAddWeek} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Add Week 1</button>
        </div>
      ) : (
        <div className="space-y-3">
          {weeks.map((week, wi) => (
            <div key={week.id} className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Week Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
                <button onClick={() => toggleWeek(week.id)} className="flex items-center gap-2 flex-1 text-left">
                  <span className={`text-gray-400 text-sm transition-transform ${expandedWeeks[week.id] ? "rotate-90" : ""}`} style={{ display: "inline-block" }}>▶</span>
                  <div className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">W{week.weekNumber}</div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{week.title || <span className="text-gray-400 italic">Untitled Week</span>}</div>
                    {(week.startDate || week.endDate) && (
                      <div className="text-xs text-gray-500">{week.startDate} {week.endDate ? `→ ${week.endDate}` : ""}</div>
                    )}
                  </div>
                </button>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-full">{week.modules.length} mod</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openAddModule(week.id)} className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-100 text-xs font-medium transition-colors" title="Add Module">+ Mod</button>
                  <button onClick={() => openEditWeek(week)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 transition-colors text-sm">✏️</button>
                  <button onClick={() => deleteWeek(week.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-100 transition-colors text-sm">🗑</button>
                </div>
              </div>

              {/* Week Body */}
              {expandedWeeks[week.id] && (
                <div className="p-3 space-y-2 bg-white">
                  {week.modules.length === 0 ? (
                    <div className="text-center py-5 text-gray-400 text-sm">
                      No modules. <button onClick={() => openAddModule(week.id)} className="text-indigo-600 font-medium hover:underline">Add Module</button>
                    </div>
                  ) : week.modules.map((mod) => (
                    <div key={mod.id} className="border border-gray-200 rounded-xl overflow-hidden ml-4">
                      {/* Module Header */}
                      <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                        <button onClick={() => toggleModule(mod.id)} className="flex items-center gap-2 flex-1 text-left">
                          <span className={`text-gray-400 text-xs transition-transform ${expandedModules[mod.id] ? "rotate-90" : ""}`} style={{ display: "inline-block" }}>▶</span>
                          <div className="w-5 h-5 bg-gray-200 text-gray-600 rounded flex items-center justify-center text-xs font-bold">M</div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{mod.title || <span className="text-gray-400 italic">Untitled Module</span>}</div>
                            {mod.description && <div className="text-xs text-gray-500 truncate max-w-[250px]">{mod.description}</div>}
                          </div>
                        </button>
                        <span className="text-xs text-gray-500">{mod.sessions.length} sessions</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => openAddSession(week.id, mod.id)} className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 text-xs font-medium transition-colors" title="Add Session">+ Sess</button>
                          <button onClick={() => openEditModule(week.id, mod)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 transition-colors text-xs">✏️</button>
                          <button onClick={() => deleteModule(week.id, mod.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-100 transition-colors text-xs">🗑</button>
                        </div>
                      </div>

                      {/* Sessions */}
                      {expandedModules[mod.id] && (
                        <div className="divide-y divide-gray-100">
                          {mod.sessions.length === 0 ? (
                            <div className="text-center py-4 text-gray-400 text-xs">
                              <button onClick={() => openAddSession(week.id, mod.id)} className="text-indigo-600 font-medium hover:underline">Add Session</button>
                            </div>
                          ) : mod.sessions.map((sess) => (
                            <div key={sess.id} className="flex items-center gap-3 px-4 py-2.5 group hover:bg-gray-50 ml-4">
                              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full flex-shrink-0" />
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${sessionTypeColor[sess.type] || "bg-gray-100 text-gray-600"}`}>{sess.type}</span>
                              <span className="flex-1 text-sm text-gray-800">{sess.title}</span>
                              {sess.date && <span className="text-xs text-gray-400">{sess.date}</span>}
                              {sess.time && <span className="text-xs text-gray-400">{sess.time}</span>}
                              {sess.duration && <span className="text-xs text-gray-400">{sess.duration}min</span>}
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditSession(week.id, mod.id, sess)} className="p-1 rounded text-gray-400 hover:text-indigo-600 text-xs">✏️</button>
                                <button onClick={() => deleteSession(week.id, mod.id, sess.id)} className="p-1 rounded text-gray-400 hover:text-red-600 text-xs">🗑</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Week Modal */}
      {editingWeek && weekForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">{editingWeek === "add" ? "Add Week" : "Edit Week"}</h3>
              <button onClick={() => { setEditingWeek(null); setWeekForm(null); }} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Week Number</label><input type="number" min="1" value={weekForm.weekNumber} onChange={e => setWeekForm(f => ({ ...f, weekNumber: Number(e.target.value) }))} className={inputCls} /></div>
                <div><label className={labelCls}>Week Title *</label><input type="text" value={weekForm.title} onChange={e => setWeekForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Introduction to PM" className={inputCls} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Start Date</label><input type="date" value={weekForm.startDate} onChange={e => setWeekForm(f => ({ ...f, startDate: e.target.value }))} className={inputCls} /></div>
                <div><label className={labelCls}>End Date</label><input type="date" value={weekForm.endDate} onChange={e => setWeekForm(f => ({ ...f, endDate: e.target.value }))} className={inputCls} /></div>
              </div>
            </div>
            <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button onClick={() => { setEditingWeek(null); setWeekForm(null); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={saveWeek} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">{editingWeek === "add" ? "Add Week" : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Module Modal */}
      {editingModule && moduleForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">{editingModule === "add" ? "Add Module" : "Edit Module"}</h3>
              <button onClick={() => { setEditingModule(null); setModuleForm(null); }} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className={labelCls}>Module Title *</label><input type="text" value={moduleForm.title} onChange={e => setModuleForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Product Strategy Deep Dive" className={inputCls} /></div>
              <div><label className={labelCls}>Module Description</label><textarea value={moduleForm.description} onChange={e => setModuleForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Brief description of this module..." className={`${inputCls} resize-none`} /></div>
            </div>
            <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button onClick={() => { setEditingModule(null); setModuleForm(null); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={saveModule} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">{editingModule === "add" ? "Add Module" : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Session Modal */}
      {editingSession && sessionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">{editingSession === "add" ? "Add Session" : "Edit Session"}</h3>
              <button onClick={() => { setEditingSession(null); setSessionForm(null); }} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className={labelCls}>Session Title *</label><input type="text" value={sessionForm.title} onChange={e => setSessionForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Live Q&A with Mentor" className={inputCls} /></div>
                <div>
                  <label className={labelCls}>Session Type</label>
                  <select value={sessionForm.type} onChange={e => setSessionForm(f => ({ ...f, type: e.target.value }))} className={inputCls}>
                    {SESSION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div><label className={labelCls}>Duration (minutes)</label><input type="number" min="1" value={sessionForm.duration} onChange={e => setSessionForm(f => ({ ...f, duration: Number(e.target.value) }))} className={inputCls} /></div>
                <div><label className={labelCls}>Session Date</label><input type="date" value={sessionForm.date} onChange={e => setSessionForm(f => ({ ...f, date: e.target.value }))} className={inputCls} /></div>
                <div><label className={labelCls}>Session Time</label><input type="time" value={sessionForm.time} onChange={e => setSessionForm(f => ({ ...f, time: e.target.value }))} className={inputCls} /></div>
              </div>
            </div>
            <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button onClick={() => { setEditingSession(null); setSessionForm(null); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={saveSession} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">{editingSession === "add" ? "Add Session" : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}