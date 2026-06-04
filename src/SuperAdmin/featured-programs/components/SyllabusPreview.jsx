import { useState } from "react";
import { MOCK_GENERATED_WEEKS } from "../constants/featuredProgramConstants";

const stages = ["idle", "detecting", "preview", "editing", "saved"];

export default function SyllabusPreview({ onApply }) {
  const [stage, setStage] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [detectedWeeks, setDetectedWeeks] = useState([]);
  const [editableWeeks, setEditableWeeks] = useState([]);
  const [expandedWeeks, setExpandedWeeks] = useState({});

  const handleGenerate = () => {
    setStage("detecting");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          const weeks = MOCK_GENERATED_WEEKS.map(w => ({ ...w, modules: w.modules.map(m => ({ ...m })) }));
          setDetectedWeeks(weeks);
          setEditableWeeks(JSON.parse(JSON.stringify(weeks)));
          setTimeout(() => setStage("preview"), 300);
          return 100;
        }
        return prev + Math.random() * 18 + 8;
      });
    }, 200);
  };

  const handleApply = () => {
    setStage("saved");
    onApply && onApply(editableWeeks);
  };

  const updateWeekTitle = (id, title) => {
    setEditableWeeks(prev => prev.map(w => w.id === id ? { ...w, title } : w));
  };

  const updateModuleTitle = (weekId, modId, title) => {
    setEditableWeeks(prev => prev.map(w => w.id === weekId ? {
      ...w, modules: w.modules.map(m => m.id === modId ? { ...m, title } : m)
    } : w));
  };

  const toggleWeek = (id) => setExpandedWeeks(prev => ({ ...prev, [id]: !prev[id] }));

  if (stage === "idle") {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">🤖</div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">Smart Syllabus Generation</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          Our AI will analyze your uploaded file and automatically detect weeks, modules, and structure your syllabus. You can review and edit before saving.
        </p>
        <div className="flex items-center justify-center gap-8 mb-8">
          {["Upload File", "Generate", "Preview", "Edit & Save"].map((step, i) => (
            <div key={step} className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</div>
              <span className="text-xs text-gray-500 text-center">{step}</span>
            </div>
          ))}
        </div>
        <button
          onClick={handleGenerate}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg"
        >
          ✨ Generate Structure
        </button>
      </div>
    );
  }

  if (stage === "detecting") {
    const detectedCount = Math.floor((progress / 100) * 4);
    return (
      <div className="py-10">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3 animate-bounce">🔍</div>
          <h3 className="font-bold text-gray-900 text-lg">Analyzing Document...</h3>
          <p className="text-gray-500 text-sm mt-1">Detecting structure and extracting content</p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Scanning document</span>
            <span>{Math.min(100, Math.round(progress))}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-200"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>

        {/* Detected Weeks */}
        <div className="max-w-md mx-auto space-y-2">
          {MOCK_GENERATED_WEEKS.slice(0, detectedCount).map((week, i) => (
            <div key={week.id} className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl animate-pulse-once">
              <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs">✓</div>
              <span className="text-sm font-medium text-emerald-800">Week {week.weekNumber} Detected</span>
              <span className="text-xs text-emerald-600 ml-auto">{week.modules.length} module{week.modules.length !== 1 ? "s" : ""}</span>
            </div>
          ))}
          {detectedCount < 4 && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-indigo-500 animate-spin" />
              <span className="text-sm text-gray-500">Scanning week {detectedCount + 1}...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (stage === "preview") {
    return (
      <div>
        <div className="flex items-center gap-3 mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-emerald-800">Structure Detected Successfully!</p>
            <p className="text-sm text-emerald-600">{detectedWeeks.length} weeks and {detectedWeeks.reduce((a, w) => a + w.modules.length, 0)} modules found. Review below and click Edit to modify before saving.</p>
          </div>
        </div>

        {/* Preview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {detectedWeeks.map(week => (
            <div key={week.id} className="bg-white border border-indigo-200 rounded-xl p-3 text-center">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-bold mx-auto mb-2">W{week.weekNumber}</div>
              <div className="text-xs font-semibold text-gray-800 mb-1 truncate">{week.title}</div>
              <div className="text-xs text-gray-500">{week.modules.length} mod</div>
            </div>
          ))}
        </div>

        {/* Tree Preview */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Structure Preview</h4>
          <div className="space-y-2 font-mono text-sm">
            {detectedWeeks.map(week => (
              <div key={week.id}>
                <div className="text-indigo-700 font-semibold">📅 Week {week.weekNumber}: {week.title}</div>
                {week.modules.map((mod, mi) => (
                  <div key={mod.id} className="ml-6 text-gray-600">
                    {mi === week.modules.length - 1 ? "└" : "├"}─ 📦 {mod.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={() => setStage("idle")} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Regenerate</button>
          <button onClick={() => setStage("editing")} className="px-5 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">✏️ Edit Structure</button>
          <button onClick={handleApply} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Save & Apply →</button>
        </div>
      </div>
    );
  }

  if (stage === "editing") {
    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-gray-900">Edit Generated Structure</h3>
            <p className="text-sm text-gray-500 mt-0.5">Modify week titles and module names before saving</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStage("preview")} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">← Back</button>
            <button onClick={handleApply} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Save & Apply →</button>
          </div>
        </div>

        <div className="space-y-3">
          {editableWeeks.map(week => (
            <div key={week.id} className="border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => toggleWeek(week.id)} className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-50 text-left hover:bg-indigo-100 transition-colors">
                <span className={`text-gray-400 text-sm transition-transform ${expandedWeeks[week.id] ? "rotate-90" : ""}`} style={{ display: "inline-block" }}>▶</span>
                <div className="w-6 h-6 bg-indigo-600 text-white rounded flex items-center justify-center text-xs font-bold">W{week.weekNumber}</div>
                <input
                  type="text"
                  value={week.title}
                  onChange={e => { e.stopPropagation(); updateWeekTitle(week.id, e.target.value); }}
                  onClick={e => e.stopPropagation()}
                  className="flex-1 bg-transparent text-sm font-semibold text-gray-900 outline-none border-b border-dashed border-indigo-300 focus:border-indigo-600 py-0.5"
                />
              </button>
              {expandedWeeks[week.id] && (
                <div className="p-3 space-y-2 bg-white">
                  {week.modules.map(mod => (
                    <div key={mod.id} className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-gray-400 text-xs">└─</span>
                      <div className="w-5 h-5 bg-gray-200 text-gray-600 rounded flex items-center justify-center text-xs font-bold">M</div>
                      <input
                        type="text"
                        value={mod.title}
                        onChange={e => updateModuleTitle(week.id, mod.id, e.target.value)}
                        className="flex-1 bg-transparent text-sm text-gray-800 outline-none border-b border-dashed border-gray-300 focus:border-indigo-400 py-0.5"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stage === "saved") {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="font-bold text-gray-900 text-xl mb-2">Syllabus Applied!</h3>
        <p className="text-gray-500 text-sm mb-5">The generated structure has been applied to your manual syllabus builder. Switch to Manual Builder tab to make further edits.</p>
        <button onClick={() => setStage("idle")} className="text-indigo-600 text-sm font-medium hover:underline">Regenerate from file</button>
      </div>
    );
  }

  return null;
}