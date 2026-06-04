import { useState } from "react";

const EXAMPLES = [
  "Product Strategy", "Product Analytics", "Market Research",
  "Product Roadmapping", "User Research", "Agile Methodologies",
  "Stakeholder Management", "Go-to-Market Strategy",
];

export default function LearningOutcomes({ data, onChange }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [newText, setNewText] = useState("");
  const [adding, setAdding] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);

  const items = data.learningOutcomes || [];
  const setItems = (updated) => onChange({ ...data, learningOutcomes: updated });

  const handleAdd = () => {
    if (!newText.trim()) return;
    setItems([...items, { id: Date.now(), text: newText.trim() }]);
    setNewText("");
    setAdding(false);
  };

  const handleSaveEdit = (id) => {
    if (!editText.trim()) return;
    setItems(items.map((i) => (i.id === id ? { ...i, text: editText.trim() } : i)));
    setEditingId(null);
  };

  const handleDelete = (id) => setItems(items.filter((i) => i.id !== id));

  const handleDragEnd = () => {
    if (dragging !== null && over !== null && dragging !== over) {
      const reordered = [...items];
      const [moved] = reordered.splice(dragging, 1);
      reordered.splice(over, 0, moved);
      setItems(reordered);
    }
    setDragging(null);
    setOver(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-bold text-gray-800">Learning Outcomes</h3>
          <p className="text-xs text-gray-500">What students will gain from this program</p>
        </div>
        <button
          onClick={() => { setAdding(true); setEditingId(null); }}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          + Add Point
        </button>
      </div>

      {adding && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
          <div className="flex gap-2">
            <input
              autoFocus type="text" value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") { setAdding(false); setNewText(""); } }}
              placeholder="e.g. Product Strategy"
              className="flex-1 px-2.5 py-2 border border-indigo-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <button onClick={handleAdd} className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700">Add</button>
            <button onClick={() => { setAdding(false); setNewText(""); }} className="px-3 py-2 border border-indigo-200 rounded-lg text-xs text-indigo-600 hover:bg-white">✕</button>
          </div>
          <p className="text-xs text-indigo-400 mt-1.5">Press Enter to add • Escape to cancel</p>
        </div>
      )}

      {items.length === 0 && !adding ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <div className="text-3xl mb-2">🎯</div>
          <h4 className="font-semibold text-gray-700 mb-1 text-sm">No learning points yet</h4>
          <p className="text-xs text-gray-400 mb-3">Add what students will gain from this program</p>
          <button onClick={() => setAdding(true)} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium">Add First Point</button>
        </div>
      ) : (
        <div className="space-y-1.5">
          {items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragging(idx)}
              onDragEnter={() => setOver(idx)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`flex items-center gap-3 p-2.5 bg-gray-50 hover:bg-indigo-50/50 rounded-xl border border-gray-200 group transition-all cursor-grab active:cursor-grabbing
                ${over === idx && dragging !== idx ? "border-t-2 border-indigo-400" : ""}`}
            >
              <span className="text-gray-300 group-hover:text-gray-400 text-base select-none">⠿</span>
              <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">✓</div>
              {editingId === item.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    autoFocus type="text" value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit(item.id); if (e.key === "Escape") setEditingId(null); }}
                    className="flex-1 px-2 py-1 border border-indigo-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                  <button onClick={() => handleSaveEdit(item.id)} className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-xs font-medium">Save</button>
                  <button onClick={() => setEditingId(null)} className="px-2 py-1 border border-gray-200 rounded-lg text-xs text-gray-600">✕</button>
                </div>
              ) : (
                <span className="flex-1 text-sm text-gray-800 font-medium">{item.text}</span>
              )}
              {editingId !== item.id && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingId(item.id); setEditText(item.text); }} className="p-1 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 text-xs">✏️</button>
                  <button onClick={() => handleDelete(item.id)} className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-100 text-xs">🗑</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-xs font-semibold text-amber-800 mb-2">💡 Quick Add</p>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLES.filter((e) => !items.find((i) => i.text === e)).map((ex) => (
            <button
              key={ex}
              onClick={() => setItems([...items, { id: Date.now(), text: ex }])}
              className="px-2 py-0.5 bg-white border border-amber-300 text-amber-700 rounded-full text-xs font-medium hover:bg-amber-100 transition-colors"
            >
              + {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}