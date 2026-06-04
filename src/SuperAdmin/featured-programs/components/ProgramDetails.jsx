import { useState } from "react";

const RepeaterSection = ({ title, items, onAdd, onEdit, onDelete, onReorder, placeholder, icon }) => {
  const [newText, setNewText] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);

  const handleAdd = () => {
    if (!newText.trim()) return;
    onAdd(newText.trim());
    setNewText("");
    setAdding(false);
  };

  const handleDragEnd = () => {
    if (dragging !== null && over !== null && dragging !== over) {
      const reordered = [...items];
      const [moved] = reordered.splice(dragging, 1);
      reordered.splice(over, 0, moved);
      onReorder(reordered);
    }
    setDragging(null);
    setOver(null);
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span>{icon}</span> {title}
          <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">{items.length}</span>
        </span>
        <button onClick={() => setAdding(v => !v)} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
          <span>{adding ? "−" : "+"}</span> {adding ? "Cancel" : "Add"}
        </button>
      </div>

      {adding && (
        <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
          <div className="flex gap-2">
            <input
              autoFocus
              type="text"
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") { setAdding(false); setNewText(""); } }}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 border border-indigo-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <button onClick={handleAdd} className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Add</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="px-4 py-6 text-center text-gray-400 text-sm">
          No items yet. Click <strong className="text-indigo-600">+Add</strong> to add your first item.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragging(idx)}
              onDragEnter={() => setOver(idx)}
              onDragEnd={handleDragEnd}
              onDragOver={e => e.preventDefault()}
              className={`flex items-center gap-3 px-4 py-2.5 group hover:bg-gray-50 cursor-grab ${over === idx && dragging !== idx ? "border-t-2 border-indigo-400" : ""}`}
            >
              <span className="text-gray-300 group-hover:text-gray-400 text-sm select-none">⠿</span>
              <div className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{idx + 1}</div>
              {editingId === item.id ? (
                <div className="flex-1 flex gap-2">
                  <input autoFocus type="text" value={editText} onChange={e => setEditText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { onEdit(item.id, editText); setEditingId(null); } if (e.key === "Escape") setEditingId(null); }} className="flex-1 px-2 py-1 border border-indigo-300 rounded text-sm outline-none focus:ring-2 focus:ring-indigo-400 bg-white" />
                  <button onClick={() => { onEdit(item.id, editText); setEditingId(null); }} className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-medium">Save</button>
                  <button onClick={() => setEditingId(null)} className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-600">✕</button>
                </div>
              ) : (
                <span className="flex-1 text-sm text-gray-800">{item.text}</span>
              )}
              {editingId !== item.id && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingId(item.id); setEditText(item.text); }} className="p-1 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 text-xs">✏️</button>
                  <button onClick={() => onDelete(item.id)} className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-100 text-xs">🗑</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ProgramDetails({ data, onChange }) {
  const set = (field, value) => onChange({ ...data, [field]: value });

  const makeAdder = (field) => (text) => set(field, [...(data[field] || []), { id: Date.now(), text }]);
  const makeEditor = (field) => (id, text) => set(field, (data[field] || []).map(i => i.id === id ? { ...i, text } : i));
  const makeDeleter = (field) => (id) => set(field, (data[field] || []).filter(i => i.id !== id));
  const makeReorder = (field) => (items) => set(field, items);

  return (
    <div className="space-y-6">
      {/* Enrollment CTA */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><span>🔗</span> Enrollment CTA</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Enrollment Button Text</label>
            <input type="text" value={data.enrollmentButtonText || ""} onChange={e => set("enrollmentButtonText", e.target.value)} placeholder="e.g. Enroll Now" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Enrollment URL</label>
            <input type="url" value={data.enrollmentUrl || ""} onChange={e => set("enrollmentUrl", e.target.value)} placeholder="https://..." className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Syllabus Button Text</label>
            <input type="text" value={data.syllabusButtonText || ""} onChange={e => set("syllabusButtonText", e.target.value)} placeholder="e.g. Download Syllabus" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
      </div>

      {/* Repeater Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RepeaterSection
          title="Program Benefits"
          icon="🏆"
          items={data.programBenefits || []}
          onAdd={makeAdder("programBenefits")}
          onEdit={makeEditor("programBenefits")}
          onDelete={makeDeleter("programBenefits")}
          onReorder={makeReorder("programBenefits")}
          placeholder="e.g. Industry-recognized certification"
        />
        <RepeaterSection
          title="Career Opportunities"
          icon="💼"
          items={data.careerOpportunities || []}
          onAdd={makeAdder("careerOpportunities")}
          onEdit={makeEditor("careerOpportunities")}
          onDelete={makeDeleter("careerOpportunities")}
          onReorder={makeReorder("careerOpportunities")}
          placeholder="e.g. Product Manager"
        />
      </div>

      {/* Learning Outcomes for Details Page */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><span>📋</span> Learning Outcomes (Course Details Page)</h3>
        <RepeaterSection
          title="Learning Outcomes"
          icon="🎯"
          items={data.detailsLearningOutcomes || []}
          onAdd={makeAdder("detailsLearningOutcomes")}
          onEdit={makeEditor("detailsLearningOutcomes")}
          onDelete={makeDeleter("detailsLearningOutcomes")}
          onReorder={makeReorder("detailsLearningOutcomes")}
          placeholder="e.g. Master product strategy frameworks"
        />
      </div>
    </div>
  );
}