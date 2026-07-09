import { useState } from "react";
import TagInput from "./TagInput";
import ImageUploadField from "./ImageUploadField";

const SKILL_EXAMPLES = ["React", "Node.js", "MongoDB", "Git", "Docker", "TypeScript", "SQL", "AWS"];

const DIFFICULTY_OPTIONS = ["Beginner", "Intermediate", "Advanced"];

const emptyProject = { title: "", description: "", image: null, difficulty: "Beginner" };

const EXAMPLES = [
  "Product Strategy", "Product Analytics", "Market Research",
  "Product Roadmapping", "User Research", "Agile Methodologies",
  "Stakeholder Management", "Go-to-Market Strategy",
];

const ProjectCard = ({ project, onUpdate, onDelete }) => {
  const set = (field, val) => onUpdate({ ...project, [field]: val });
  return (
    <div className="border border-gray-200 rounded-xl p-3 bg-white space-y-2.5">
      <div className="flex gap-3">
        <div className="w-20 flex-shrink-0">
          <ImageUploadField value={project.image} onChange={(val) => set("image", val)} aspect="aspect-square" />
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={project.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Project title"
            className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
          <select
            value={project.difficulty}
            onChange={(e) => set("difficulty", e.target.value)}
            className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {DIFFICULTY_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <textarea
        value={project.description}
        onChange={(e) => set("description", e.target.value)}
        placeholder="Brief project description..."
        rows={2}
        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-white"
      />
      <button onClick={onDelete} className="text-xs text-red-500 hover:text-red-600 font-medium">🗑 Remove Project</button>
    </div>
  );
};

export default function LearningOutcomes({ data, onChange }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [newText, setNewText] = useState("");
  const [adding, setAdding] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);

  const items = data.learningOutcomes || [];
  const setItems = (updated) => onChange({ ...data, learningOutcomes: updated });

  const skills = data.skills || [];
  const setSkills = (updated) => onChange({ ...data, skills: updated });

  const projects = data.projects || [];
  const setProjects = (updated) => onChange({ ...data, projects: updated });
  const addProject = () => setProjects([...projects, { id: Date.now(), ...emptyProject }]);
  const updateProject = (id, project) => setProjects(projects.map((p) => (p.id === id ? project : p)));
  const deleteProject = (id) => setProjects(projects.filter((p) => p.id !== id));

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

      {/* Skills */}
      <div className="pt-3 border-t border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 mb-1">Skills</h3>
        <p className="text-xs text-gray-500 mb-2">Technologies and skills students will practice</p>
        <TagInput
          value={skills}
          onChange={setSkills}
          placeholder="e.g. React"
          suggestions={SKILL_EXAMPLES}
          colorClass="bg-violet-50 text-violet-700 border-violet-200"
        />
      </div>

      {/* Projects */}
      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Projects</h3>
            <p className="text-xs text-gray-500">Hands-on projects included in this program</p>
          </div>
          <button
            onClick={addProject}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          >
            + Add Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
            <div className="text-2xl mb-1.5">🛠</div>
            <p className="text-xs text-gray-400">No projects yet. Add hands-on projects for this program.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onUpdate={(p) => updateProject(project.id, p)}
                onDelete={() => deleteProject(project.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}