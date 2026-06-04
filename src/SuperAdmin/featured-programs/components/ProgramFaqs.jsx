// import { useState } from "react";

// const emptyFaq = { question: "", answer: "" };

// export default function ProgramFaqs({ data, onChange }) {
//   const [adding, setAdding] = useState(false);
//   const [form, setForm] = useState(emptyFaq);
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState(emptyFaq);
//   const [expandedId, setExpandedId] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [dragging, setDragging] = useState(null);
//   const [over, setOver] = useState(null);

//   const items = data.faqs || [];
//   const setItems = (updated) => onChange({ ...data, faqs: updated });

//   const validate = (f) => {
//     const e = {};
//     if (!f.question.trim()) e.question = "Question is required";
//     if (!f.answer.trim()) e.answer = "Answer is required";
//     return e;
//   };

//   const handleAdd = () => {
//     const e = validate(form);
//     if (Object.keys(e).length) { setErrors(e); return; }
//     setItems([...items, { id: Date.now(), ...form }]);
//     setForm(emptyFaq);
//     setErrors({});
//     setAdding(false);
//   };

//   const handleSaveEdit = (id) => {
//     const e = validate(editForm);
//     if (Object.keys(e).length) { setErrors(e); return; }
//     setItems(items.map(i => i.id === id ? { ...i, ...editForm } : i));
//     setEditingId(null);
//     setErrors({});
//   };

//   const handleDelete = (id) => {
//     setItems(items.filter(i => i.id !== id));
//     if (expandedId === id) setExpandedId(null);
//   };

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

//   const inputCls = (err) => `w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${err ? "border-red-400 bg-red-50" : "border-gray-200"}`;

//   return (
//     <div className="space-y-5">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-lg font-bold text-gray-900">FAQ Management</h2>
//           <p className="text-sm text-gray-500 mt-0.5">Answer common questions to help prospective students</p>
//         </div>
//         <button
//           onClick={() => { setAdding(true); setEditingId(null); }}
//           className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
//         >
//           <span>+</span> Add FAQ
//         </button>
//       </div>

//       {/* Add Form */}
//       {adding && (
//         <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
//           <h4 className="font-semibold text-blue-900 mb-4">Add New FAQ</h4>
//           <div className="space-y-3">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Question <span className="text-red-500">*</span></label>
//               <input
//                 autoFocus
//                 type="text"
//                 value={form.question}
//                 onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
//                 placeholder="e.g. Who is this program for?"
//                 className={inputCls(errors.question)}
//               />
//               {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Answer <span className="text-red-500">*</span></label>
//               <textarea
//                 value={form.answer}
//                 onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
//                 placeholder="Provide a detailed, helpful answer..."
//                 rows={3}
//                 className={`${inputCls(errors.answer)} resize-none`}
//               />
//               {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer}</p>}
//             </div>
//           </div>
//           <div className="flex gap-2 mt-4 justify-end">
//             <button onClick={() => { setAdding(false); setForm(emptyFaq); setErrors({}); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-white transition-colors">Cancel</button>
//             <button onClick={handleAdd} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Add FAQ</button>
//           </div>
//         </div>
//       )}

//       {/* FAQ List */}
//       {items.length === 0 && !adding ? (
//         <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center">
//           <div className="text-4xl mb-3">❓</div>
//           <h3 className="font-semibold text-gray-700 mb-1">No FAQs yet</h3>
//           <p className="text-sm text-gray-400 mb-4">Add frequently asked questions to help students decide</p>
//           <button onClick={() => setAdding(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Add First FAQ</button>
//         </div>
//       ) : (
//         <div className="space-y-2">
//           <div className="flex items-center justify-between px-1 mb-1">
//             <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{items.length} FAQ{items.length !== 1 ? "s" : ""}</span>
//             <span className="text-xs text-gray-400">Drag to reorder • Click to expand</span>
//           </div>
//           {items.map((item, idx) => (
//             <div
//               key={item.id}
//               draggable={editingId !== item.id}
//               onDragStart={() => setDragging(idx)}
//               onDragEnter={() => setOver(idx)}
//               onDragEnd={handleDragEnd}
//               onDragOver={e => e.preventDefault()}
//               className={`bg-white border rounded-xl overflow-hidden transition-all ${over === idx && dragging !== idx ? "border-indigo-400 shadow-md" : "border-gray-200"}`}
//             >
//               {editingId === item.id ? (
//                 <div className="p-4 space-y-3 bg-amber-50">
//                   <h4 className="font-semibold text-amber-900 text-sm mb-3">Editing FAQ</h4>
//                   <div>
//                     <label className="block text-xs font-medium text-gray-600 mb-1">Question</label>
//                     <input type="text" value={editForm.question} onChange={e => setEditForm(f => ({ ...f, question: e.target.value }))} className={inputCls(errors.question)} />
//                     {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium text-gray-600 mb-1">Answer</label>
//                     <textarea value={editForm.answer} onChange={e => setEditForm(f => ({ ...f, answer: e.target.value }))} rows={3} className={`${inputCls(errors.answer)} resize-none`} />
//                     {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer}</p>}
//                   </div>
//                   <div className="flex gap-2 justify-end">
//                     <button onClick={() => { setEditingId(null); setErrors({}); }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-white">Cancel</button>
//                     <button onClick={() => handleSaveEdit(item.id)} className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700">Save</button>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <button
//                     onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
//                     className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
//                   >
//                     <span className="text-gray-300 cursor-grab">⠿</span>
//                     <div className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{idx + 1}</div>
//                     <span className="flex-1 font-medium text-gray-900 text-sm">{item.question}</span>
//                     <div className="flex items-center gap-1.5 ml-2" onClick={e => e.stopPropagation()}>
//                       <button onClick={() => { setEditingId(item.id); setEditForm({ question: item.question, answer: item.answer }); setErrors({}); }} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 text-sm transition-colors">✏️</button>
//                       <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-100 text-sm transition-colors">🗑</button>
//                     </div>
//                     <span className={`text-gray-400 ml-1 text-sm transition-transform ${expandedId === item.id ? "rotate-180" : ""}`} style={{ display: "inline-block" }}>▼</span>
//                   </button>
//                   {expandedId === item.id && (
//                     <div className="px-4 pb-4">
//                       <div className="ml-9 pl-3 border-l-2 border-indigo-200">
//                         <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
















import { useState } from "react";

const emptyFaq = { question: "", answer: "" };

const inputCls = (err) =>
  `w-full px-2.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${err ? "border-red-400 bg-red-50" : "border-gray-200"}`;

export default function ProgramFaqs({ data, onChange }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyFaq);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyFaq);
  const [expandedId, setExpandedId] = useState(null);
  const [errors, setErrors] = useState({});
  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);

  const items = data.faqs || [];
  const setItems = (updated) => onChange({ ...data, faqs: updated });

  const validate = (f) => {
    const e = {};
    if (!f.question.trim()) e.question = "Question is required";
    if (!f.answer.trim()) e.answer = "Answer is required";
    return e;
  };

  const handleAdd = () => {
    const e = validate(form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setItems([...items, { id: Date.now(), ...form }]);
    setForm(emptyFaq);
    setErrors({});
    setAdding(false);
  };

  const handleSaveEdit = (id) => {
    const e = validate(editForm);
    if (Object.keys(e).length) { setErrors(e); return; }
    setItems(items.map((i) => (i.id === id ? { ...i, ...editForm } : i)));
    setEditingId(null);
    setErrors({});
  };

  const handleDelete = (id) => {
    setItems(items.filter((i) => i.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

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
          <h3 className="text-sm font-bold text-gray-800">FAQ Management</h3>
          <p className="text-xs text-gray-500">Answer common questions for prospective students</p>
        </div>
        <button
          onClick={() => { setAdding(true); setEditingId(null); }}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          + Add FAQ
        </button>
      </div>

      {adding && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 text-sm mb-3">Add New FAQ</h4>
          <div className="space-y-2.5">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Question <span className="text-red-500">*</span></label>
              <input
                autoFocus type="text" value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                placeholder="e.g. Who is this program for?"
                className={inputCls(errors.question)}
              />
              {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Answer <span className="text-red-500">*</span></label>
              <textarea
                value={form.answer}
                onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                placeholder="Provide a helpful answer..."
                rows={3}
                className={`${inputCls(errors.answer)} resize-none`}
              />
              {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer}</p>}
            </div>
          </div>
          <div className="flex gap-2 mt-3 justify-end">
            <button onClick={() => { setAdding(false); setForm(emptyFaq); setErrors({}); }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-white">Cancel</button>
            <button onClick={handleAdd} className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700">Add FAQ</button>
          </div>
        </div>
      )}

      {items.length === 0 && !adding ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <div className="text-3xl mb-2">❓</div>
          <h4 className="font-semibold text-gray-700 mb-1 text-sm">No FAQs yet</h4>
          <p className="text-xs text-gray-400 mb-3">Add frequently asked questions to help students decide</p>
          <button onClick={() => setAdding(true)} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium">Add First FAQ</button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{items.length} FAQ{items.length !== 1 ? "s" : ""}</span>
            <span className="text-xs text-gray-400">Drag to reorder</span>
          </div>
          {items.map((item, idx) => (
            <div
              key={item.id}
              draggable={editingId !== item.id}
              onDragStart={() => setDragging(idx)}
              onDragEnter={() => setOver(idx)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`bg-white border rounded-xl overflow-hidden transition-all ${over === idx && dragging !== idx ? "border-indigo-400 shadow-md" : "border-gray-200"}`}
            >
              {editingId === item.id ? (
                <div className="p-3 space-y-2.5 bg-amber-50">
                  <h4 className="font-semibold text-amber-900 text-xs mb-2">Editing FAQ</h4>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Question</label>
                    <input type="text" value={editForm.question} onChange={(e) => setEditForm((f) => ({ ...f, question: e.target.value }))} className={inputCls(errors.question)} />
                    {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Answer</label>
                    <textarea value={editForm.answer} onChange={(e) => setEditForm((f) => ({ ...f, answer: e.target.value }))} rows={3} className={`${inputCls(errors.answer)} resize-none`} />
                    {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer}</p>}
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => { setEditingId(null); setErrors({}); }} className="px-3 py-1 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-white">Cancel</button>
                    <button onClick={() => handleSaveEdit(item.id)} className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700">Save</button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-300 cursor-grab text-sm">⠿</span>
                    <div className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{idx + 1}</div>
                    <span className="flex-1 font-medium text-gray-900 text-sm">{item.question}</span>
                    <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => { setEditingId(item.id); setEditForm({ question: item.question, answer: item.answer }); setErrors({}); }} className="p-1 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 text-xs transition-colors">✏️</button>
                      <button onClick={() => handleDelete(item.id)} className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-100 text-xs transition-colors">🗑</button>
                    </div>
                    <span className={`text-gray-400 ml-1 text-xs transition-transform inline-block ${expandedId === item.id ? "rotate-180" : ""}`}>▼</span>
                  </button>
                  {expandedId === item.id && (
                    <div className="px-3 pb-3">
                      <div className="ml-8 pl-3 border-l-2 border-indigo-200">
                        <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}