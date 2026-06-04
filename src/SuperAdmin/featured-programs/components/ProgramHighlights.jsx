// import { useState } from "react";

// const ICONS = ["⭐", "📚", "🎯", "🏆", "💡", "🔥", "✅", "🎓", "📹", "🛠", "📝", "🤝"];

// const examples = [
//   "81 Lessons", "5 Live Sessions", "3 Industry Projects",
//   "Certificate of Completion", "Lifetime Access", "Community Support",
//   "Expert Mentorship", "Job Assistance"
// ];

// export default function ProgramHighlights({ data, onChange }) {
//   const [adding, setAdding] = useState(false);
//   const [newText, setNewText] = useState("");
//   const [newIcon, setNewIcon] = useState("⭐");
//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState("");
//   const [editIcon, setEditIcon] = useState("⭐");
//   const [dragging, setDragging] = useState(null);
//   const [over, setOver] = useState(null);

//   const items = data.highlights || [];
//   const setItems = (updated) => onChange({ ...data, highlights: updated });

//   const handleAdd = () => {
//     if (!newText.trim()) return;
//     setItems([...items, { id: Date.now(), text: newText.trim(), icon: newIcon }]);
//     setNewText("");
//     setNewIcon("⭐");
//     setAdding(false);
//   };

//   const handleSaveEdit = (id) => {
//     if (!editText.trim()) return;
//     setItems(items.map(i => i.id === id ? { ...i, text: editText.trim(), icon: editIcon } : i));
//     setEditingId(null);
//   };

//   const handleDelete = (id) => setItems(items.filter(i => i.id !== id));

//   const handleDragEnd = () => {
//     if (dragging !== null && over !== null && dragging !== over) {
//       const reordered = [...items];
//       const [moved] = reordered.splice(dragging, 1);
//       reordered.splice(over, 0, moved);
//       setItems(reordered);
//     }
//     setDragging(null);
//     setOver(null);
//   };

//   const addExample = (text) => {
//     if (!items.find(i => i.text === text)) {
//       setItems([...items, { id: Date.now(), text, icon: ICONS[Math.floor(Math.random() * ICONS.length)] }]);
//     }
//   };

//   return (
//     <div className="space-y-5">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-lg font-bold text-gray-900">Program Highlights</h2>
//           <p className="text-sm text-gray-500 mt-0.5">Key features and benefits displayed prominently on the program page</p>
//         </div>
//         <button
//           onClick={() => { setAdding(true); setEditingId(null); }}
//           className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
//         >
//           <span>+</span> Add Highlight
//         </button>
//       </div>

//       {/* Add Form */}
//       {adding && (
//         <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
//           <label className="block text-sm font-medium text-amber-800 mb-3">New Highlight</label>
//           <div className="flex gap-2 flex-wrap">
//             <div className="relative">
//               <select
//                 value={newIcon}
//                 onChange={e => setNewIcon(e.target.value)}
//                 className="appearance-none pl-3 pr-7 py-2.5 border border-amber-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-amber-400"
//               >
//                 {ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
//               </select>
//             </div>
//             <input
//               autoFocus
//               type="text"
//               value={newText}
//               onChange={e => setNewText(e.target.value)}
//               onKeyDown={e => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setAdding(false); }}
//               placeholder="e.g. 5 Live Sessions"
//               className="flex-1 min-w-[180px] px-3 py-2.5 border border-amber-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-white"
//             />
//             <button onClick={handleAdd} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">Add</button>
//             <button onClick={() => { setAdding(false); setNewText(""); }} className="px-4 py-2 border border-amber-200 rounded-lg text-sm text-amber-700 hover:bg-white transition-colors">Cancel</button>
//           </div>
//         </div>
//       )}

//       {/* Grid Display */}
//       {items.length === 0 && !adding ? (
//         <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center">
//           <div className="text-4xl mb-3">⭐</div>
//           <h3 className="font-semibold text-gray-700 mb-1">No highlights yet</h3>
//           <p className="text-sm text-gray-400 mb-4">Add program highlights to showcase key features</p>
//           <button onClick={() => setAdding(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Add First Highlight</button>
//         </div>
//       ) : (
//         <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
//           <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
//             <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Highlights ({items.length})</span>
//             <span className="text-xs text-gray-400">Drag to reorder</span>
//           </div>
//           <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
//             {items.map((item, idx) => (
//               <div
//                 key={item.id}
//                 draggable
//                 onDragStart={() => setDragging(idx)}
//                 onDragEnter={() => setOver(idx)}
//                 onDragEnd={handleDragEnd}
//                 onDragOver={e => e.preventDefault()}
//                 className={`flex items-center gap-3 p-3 rounded-xl border group transition-all cursor-grab active:cursor-grabbing ${over === idx && dragging !== idx ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-gray-50 hover:bg-amber-50/50 hover:border-amber-200"}`}
//               >
//                 <span className="text-gray-300 group-hover:text-gray-400 select-none">⠿</span>
//                 {editingId === item.id ? (
//                   <div className="flex-1 flex gap-2 flex-wrap">
//                     <select value={editIcon} onChange={e => setEditIcon(e.target.value)} className="px-2 py-1 border border-gray-200 rounded-lg text-sm bg-white outline-none">
//                       {ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
//                     </select>
//                     <input
//                       autoFocus
//                       type="text"
//                       value={editText}
//                       onChange={e => setEditText(e.target.value)}
//                       onKeyDown={e => { if (e.key === "Enter") handleSaveEdit(item.id); if (e.key === "Escape") setEditingId(null); }}
//                       className="flex-1 min-w-[100px] px-2 py-1 border border-indigo-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
//                     />
//                     <button onClick={() => handleSaveEdit(item.id)} className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-xs font-medium">Save</button>
//                     <button onClick={() => setEditingId(null)} className="px-2 py-1 border border-gray-200 rounded-lg text-xs text-gray-600">✕</button>
//                   </div>
//                 ) : (
//                   <>
//                     <span className="text-xl">{item.icon || "⭐"}</span>
//                     <span className="flex-1 text-sm text-gray-800 font-medium">{item.text}</span>
//                     <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button onClick={() => { setEditingId(item.id); setEditText(item.text); setEditIcon(item.icon || "⭐"); }} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 text-sm">✏️</button>
//                       <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-100 text-sm">🗑</button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Suggestions */}
//       <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
//         <p className="text-xs font-semibold text-indigo-800 mb-2">💡 Quick Add Suggestions</p>
//         <div className="flex flex-wrap gap-2">
//           {examples.filter(e => !items.find(i => i.text === e)).map(ex => (
//             <button key={ex} onClick={() => addExample(ex)} className="px-3 py-1 bg-white border border-indigo-200 text-indigo-700 rounded-full text-xs font-medium hover:bg-indigo-100 transition-colors">+ {ex}</button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



















import { useState } from "react";

const ICONS = ["⭐", "📚", "🎯", "🏆", "💡", "🔥", "✅", "🎓", "📹", "🛠", "📝", "🤝"];

const EXAMPLES = [
  "81 Lessons", "5 Live Sessions", "3 Industry Projects",
  "Certificate of Completion", "Lifetime Access", "Community Support",
  "Expert Mentorship", "Job Assistance",
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
    setItems([...items, { id: Date.now(), text: newText.trim(), icon: newIcon }]);
    setNewText("");
    setNewIcon("⭐");
    setAdding(false);
  };

  const handleSaveEdit = (id) => {
    if (!editText.trim()) return;
    setItems(items.map((i) => (i.id === id ? { ...i, text: editText.trim(), icon: editIcon } : i)));
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
          <h3 className="text-sm font-bold text-gray-800">Program Highlights</h3>
          <p className="text-xs text-gray-500">Key features shown prominently on the page</p>
        </div>
        <button
          onClick={() => { setAdding(true); setEditingId(null); }}
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
              {ICONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
            </select>
            <input
              autoFocus type="text" value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setAdding(false); }}
              placeholder="e.g. 5 Live Sessions"
              className="flex-1 min-w-[140px] px-2.5 py-2 border border-amber-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            />
            <button onClick={handleAdd} className="px-3 py-2 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600">Add</button>
            <button onClick={() => { setAdding(false); setNewText(""); }} className="px-3 py-2 border border-amber-200 rounded-lg text-xs text-amber-700">✕</button>
          </div>
        </div>
      )}

      {items.length === 0 && !adding ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <div className="text-3xl mb-2">⭐</div>
          <h4 className="font-semibold text-gray-700 mb-1 text-sm">No highlights yet</h4>
          <p className="text-xs text-gray-400 mb-3">Add program highlights to showcase key features</p>
          <button onClick={() => setAdding(true)} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium">Add First Highlight</button>
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
              <span className="text-gray-300 group-hover:text-gray-400 select-none">⠿</span>
              {editingId === item.id ? (
                <div className="flex-1 flex gap-2 flex-wrap">
                  <select value={editIcon} onChange={(e) => setEditIcon(e.target.value)} className="px-2 py-1 border border-gray-200 rounded-lg text-sm bg-white outline-none">
                    {ICONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                  <input
                    autoFocus type="text" value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit(item.id); if (e.key === "Escape") setEditingId(null); }}
                    className="flex-1 min-w-[100px] px-2 py-1 border border-indigo-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                  <button onClick={() => handleSaveEdit(item.id)} className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-xs font-medium">Save</button>
                  <button onClick={() => setEditingId(null)} className="px-2 py-1 border border-gray-200 rounded-lg text-xs text-gray-600">✕</button>
                </div>
              ) : (
                <>
                  <span className="text-xl">{item.icon || "⭐"}</span>
                  <span className="flex-1 text-sm text-gray-800 font-medium">{item.text}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingId(item.id); setEditText(item.text); setEditIcon(item.icon || "⭐"); }} className="p-1 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 text-xs">✏️</button>
                    <button onClick={() => handleDelete(item.id)} className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-100 text-xs">🗑</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
        <p className="text-xs font-semibold text-indigo-800 mb-2">💡 Quick Add</p>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLES.filter((e) => !items.find((i) => i.text === e)).map((ex) => (
            <button
              key={ex}
              onClick={() => setItems([...items, { id: Date.now(), text: ex, icon: ICONS[Math.floor(Math.random() * ICONS.length)] }])}
              className="px-2 py-0.5 bg-white border border-indigo-200 text-indigo-700 rounded-full text-xs font-medium hover:bg-indigo-100"
            >
              + {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}