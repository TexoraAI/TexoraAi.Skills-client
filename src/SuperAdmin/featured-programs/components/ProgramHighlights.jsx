import { useState } from "react";
import ImageUploadField from "./ImageUploadField";

const ICONS = [
  "⭐",
  "📚",
  "🎯",
  "🏆",
  "💡",
  "🔥",
  "✅",
  "🎓",
  "📹",
  "🛠",
  "📝",
  "🤝",
];

const EXAMPLES = [
  "81 Lessons",
  "5 Live Sessions",
  "3 Industry Projects",
  "Certificate of Completion",
  "Lifetime Access",
  "Community Support",
  "Expert Mentorship",
  "Job Assistance",
];

export default function ProgramHighlights({ data, onChange }) {
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newIcon, setNewIcon] = useState("⭐");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editIcon, setEditIcon] = useState("⭐");
  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);

  const items = data.highlights || [];
  const setItems = (updated) => onChange({ ...data, highlights: updated });

  const handleAdd = () => {
    if (!newText.trim()) return;
    setItems([
      ...items,
      { id: Date.now(), text: newText.trim(), icon: newIcon },
    ]);
    setNewText("");
    setNewIcon("⭐");
    setAdding(false);
  };

  const handleSaveEdit = (id) => {
    if (!editText.trim()) return;
    setItems(
      items.map((i) =>
        i.id === id ? { ...i, text: editText.trim(), icon: editIcon } : i,
      ),
    );
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
          <h3 className="text-sm font-bold text-gray-800">
            Program Highlights
          </h3>
          <p className="text-xs text-gray-500">
            Key features shown prominently on the page
          </p>
        </div>
        <button
          onClick={() => {
            setAdding(true);
            setEditingId(null);
          }}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          + Add Highlight
        </button>
      </div>

      {adding && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <div className="flex gap-2 flex-wrap">
            <select
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              className="px-2 py-2 border border-amber-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-amber-400"
            >
              {ICONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
            <input
              autoFocus
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") setAdding(false);
              }}
              placeholder="e.g. 5 Live Sessions"
              className="flex-1 min-w-[140px] px-2.5 py-2 border border-amber-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            />
            <button
              onClick={handleAdd}
              className="px-3 py-2 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600"
            >
              Add
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setNewText("");
              }}
              className="px-3 py-2 border border-amber-200 rounded-lg text-xs text-amber-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {items.length === 0 && !adding ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <div className="text-3xl mb-2">⭐</div>
          <h4 className="font-semibold text-gray-700 mb-1 text-sm">
            No highlights yet
          </h4>
          <p className="text-xs text-gray-400 mb-3">
            Add program highlights to showcase key features
          </p>
          <button
            onClick={() => setAdding(true)}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
          >
            Add First Highlight
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragging(idx)}
              onDragEnter={() => setOver(idx)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`flex items-center gap-3 p-2.5 rounded-xl border group transition-all cursor-grab active:cursor-grabbing
                ${over === idx && dragging !== idx ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-gray-50 hover:bg-amber-50/50 hover:border-amber-200"}`}
            >
              <span className="text-gray-300 group-hover:text-gray-400 select-none">
                ⠿
              </span>
              {editingId === item.id ? (
                <div className="flex-1 flex gap-2 flex-wrap">
                  <select
                    value={editIcon}
                    onChange={(e) => setEditIcon(e.target.value)}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-sm bg-white outline-none"
                  >
                    {ICONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                  <input
                    autoFocus
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(item.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="flex-1 min-w-[100px] px-2 py-1 border border-indigo-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                  <button
                    onClick={() => handleSaveEdit(item.id)}
                    className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-xs font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-xs text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-xl">{item.icon || "⭐"}</span>
                  <span className="flex-1 text-sm text-gray-800 font-medium">
                    {item.text}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditText(item.text);
                        setEditIcon(item.icon || "⭐");
                      }}
                      className="p-1 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 text-xs"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-100 text-xs"
                    >
                      🗑
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
        <p className="text-xs font-semibold text-indigo-800 mb-2">
          💡 Quick Add
        </p>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLES.filter((e) => !items.find((i) => i.text === e)).map(
            (ex) => (
              <button
                key={ex}
                onClick={() =>
                  setItems([
                    ...items,
                    {
                      id: Date.now(),
                      text: ex,
                      icon: ICONS[Math.floor(Math.random() * ICONS.length)],
                    },
                  ])
                }
                className="px-2 py-0.5 bg-white border border-indigo-200 text-indigo-700 rounded-full text-xs font-medium hover:bg-indigo-100"
              >
                + {ex}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Certificate */}
      <div className="pt-3 border-t border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 mb-1">Certificate</h3>
        <p className="text-xs text-gray-500 mb-3">
          Completion certificate details shown to students
        </p>

        <div className="flex gap-3">
          <div className="w-28 flex-shrink-0">
            <ImageUploadField
              label="Certificate Image"
              value={data.certificateImageUrl}
              onChange={(val) =>
                onChange({ ...data, certificateImageUrl: val })
              }
              aspect="aspect-[4/3]"
            />
          </div>
          <div className="flex-1 space-y-2.5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Certificate Title
              </label>
              <input
                type="text"
                value={data.certificateTitle || ""}
                onChange={(e) =>
                  onChange({ ...data, certificateTitle: e.target.value })
                }
                placeholder="e.g. Certificate of Completion"
                className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Verification URL
              </label>
              <input
                type="url"
                value={data.certificateVerificationUrl || ""}
                onChange={(e) =>
                  onChange({
                    ...data,
                    certificateVerificationUrl: e.target.value,
                  })
                }
                placeholder="https://verify.example.com/..."
                className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
