import { useState, useRef } from "react";
import SyllabusZipUpload from "./SyllabusZipUpload";
import { courseService } from "../../../services/courseService";
const SESSION_TYPES = ["Video", "Live", "Assignment", "Quiz", "Reading"];

const ManualSyllabusBuilder = ({ weeks, onChange }) => {
  const addWeek = () => {
    onChange([
      ...weeks,
      { id: Date.now(), title: `Week ${weeks.length + 1}`, modules: [] },
    ]);
  };

  const updateWeek = (weekId, field, val) => {
    onChange(weeks.map((w) => (w.id === weekId ? { ...w, [field]: val } : w)));
  };

  const deleteWeek = (weekId) => {
    onChange(weeks.filter((w) => w.id !== weekId));
  };

  const addModule = (weekId) => {
    onChange(
      weeks.map((w) =>
        w.id === weekId
          ? {
              ...w,
              modules: [
                ...w.modules,
                {
                  id: Date.now(),
                  title: `Module ${w.modules.length + 1}`,
                  sessions: [],
                },
              ],
            }
          : w,
      ),
    );
  };

  const updateModule = (weekId, modId, field, val) => {
    onChange(
      weeks.map((w) =>
        w.id === weekId
          ? {
              ...w,
              modules: w.modules.map((m) =>
                m.id === modId ? { ...m, [field]: val } : m,
              ),
            }
          : w,
      ),
    );
  };

  const deleteModule = (weekId, modId) => {
    onChange(
      weeks.map((w) =>
        w.id === weekId
          ? { ...w, modules: w.modules.filter((m) => m.id !== modId) }
          : w,
      ),
    );
  };

  const addSession = (weekId, modId) => {
    onChange(
      weeks.map((w) =>
        w.id === weekId
          ? {
              ...w,
              modules: w.modules.map((m) =>
                m.id === modId
                  ? {
                      ...m,
                      sessions: [
                        ...m.sessions,
                        {
                          id: Date.now(),
                          title: `Session ${m.sessions.length + 1}`,
                          type: "Video",
                          duration: "",
                        },
                      ],
                    }
                  : m,
              ),
            }
          : w,
      ),
    );
  };

  const updateSession = (weekId, modId, sessId, field, val) => {
    onChange(
      weeks.map((w) =>
        w.id === weekId
          ? {
              ...w,
              modules: w.modules.map((m) =>
                m.id === modId
                  ? {
                      ...m,
                      sessions: m.sessions.map((s) =>
                        s.id === sessId ? { ...s, [field]: val } : s,
                      ),
                    }
                  : m,
              ),
            }
          : w,
      ),
    );
  };

  const deleteSession = (weekId, modId, sessId) => {
    onChange(
      weeks.map((w) =>
        w.id === weekId
          ? {
              ...w,
              modules: w.modules.map((m) =>
                m.id === modId
                  ? {
                      ...m,
                      sessions: m.sessions.filter((s) => s.id !== sessId),
                    }
                  : m,
              ),
            }
          : w,
      ),
    );
  };

  const typeColors = {
    Video: "bg-blue-100 text-blue-700",
    Live: "bg-emerald-100 text-emerald-700",
    Assignment: "bg-orange-100 text-orange-700",
    Quiz: "bg-purple-100 text-purple-700",
    Reading: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-3">
      {weeks.length === 0 && (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <i
            className="ti ti-calendar-event text-3xl text-gray-300 block mb-2"
            aria-hidden="true"
          />
          <h4 className="font-semibold text-gray-700 mb-1 text-sm">
            No weeks yet
          </h4>
          <p className="text-xs text-gray-400 mb-3">
            Start building your syllabus week by week
          </p>
          <button
            onClick={addWeek}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
          >
            Add First Week
          </button>
        </div>
      )}

      {weeks.map((week, wIdx) => (
        <div
          key={week.id}
          className="border border-gray-200 rounded-xl overflow-hidden"
        >
          {/* Week Header */}
          <div className="bg-indigo-50 border-b border-indigo-100 px-3 py-2.5 flex items-center gap-2.5">
            <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
              {wIdx + 1}
            </span>
            <input
              type="text"
              value={week.title}
              onChange={(e) => updateWeek(week.id, "title", e.target.value)}
              className="flex-1 bg-transparent text-sm font-semibold text-indigo-800 border-none outline-none placeholder-indigo-300"
              placeholder="Week title..."
            />
            <button
              onClick={() => addModule(week.id)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 bg-white border border-indigo-200 rounded-lg transition-colors flex items-center gap-1"
            >
              <i className="ti ti-plus text-xs" aria-hidden="true" /> Module
            </button>
            <button
              onClick={() => deleteWeek(week.id)}
              className="text-red-400 hover:text-red-600 p-1 rounded transition-colors"
              aria-label="Delete week"
            >
              <i className="ti ti-trash text-sm" aria-hidden="true" />
            </button>
          </div>

          {/* Modules */}
          <div className="p-3 space-y-2.5">
            {week.modules.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-2">
                No modules. Click "+ Module" to add one.
              </p>
            )}
            {week.modules.map((mod, mIdx) => (
              <div
                key={mod.id}
                className="border border-gray-100 rounded-lg bg-gray-50 overflow-hidden"
              >
                {/* Module Header */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-b border-gray-200">
                  <span className="w-4 h-4 bg-gray-400 text-white rounded flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {mIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={mod.title}
                    onChange={(e) =>
                      updateModule(week.id, mod.id, "title", e.target.value)
                    }
                    className="flex-1 bg-transparent text-xs font-semibold text-gray-700 border-none outline-none"
                    placeholder="Module title..."
                  />
                  <button
                    onClick={() => addSession(week.id, mod.id)}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium px-1.5 py-0.5 bg-white border border-gray-200 rounded transition-colors flex items-center gap-1"
                  >
                    <i
                      className="ti ti-plus"
                      style={{ fontSize: 10 }}
                      aria-hidden="true"
                    />{" "}
                    Session
                  </button>
                  <button
                    onClick={() => deleteModule(week.id, mod.id)}
                    className="text-red-300 hover:text-red-500"
                    aria-label="Delete module"
                  >
                    <i className="ti ti-x text-xs" aria-hidden="true" />
                  </button>
                </div>

                {/* Sessions */}
                <div className="px-3 py-2 space-y-1.5">
                  {mod.sessions.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-1">
                      No sessions. Click "+ Session".
                    </p>
                  )}
                  {mod.sessions.map((sess, sIdx) => (
                    <div
                      key={sess.id}
                      className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-2 py-1.5"
                    >
                      <span className="text-xs text-gray-400 w-4 text-center">
                        {sIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={sess.title}
                        onChange={(e) =>
                          updateSession(
                            week.id,
                            mod.id,
                            sess.id,
                            "title",
                            e.target.value,
                          )
                        }
                        className="flex-1 text-xs text-gray-700 border-none outline-none bg-transparent"
                        placeholder="Session title..."
                      />
                      <select
                        value={sess.type}
                        onChange={(e) =>
                          updateSession(
                            week.id,
                            mod.id,
                            sess.id,
                            "type",
                            e.target.value,
                          )
                        }
                        className={`text-xs px-1.5 py-0.5 rounded-full font-medium border-none outline-none ${typeColors[sess.type] || "bg-gray-100 text-gray-600"}`}
                      >
                        {SESSION_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={sess.duration}
                        onChange={(e) =>
                          updateSession(
                            week.id,
                            mod.id,
                            sess.id,
                            "duration",
                            e.target.value,
                          )
                        }
                        className="w-14 text-xs text-gray-500 border border-gray-100 rounded px-1.5 py-0.5 outline-none text-center"
                        placeholder="20 min"
                      />
                      <button
                        onClick={() => deleteSession(week.id, mod.id, sess.id)}
                        className="text-red-200 hover:text-red-400"
                        aria-label="Delete session"
                      >
                        <i className="ti ti-x text-xs" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {weeks.length > 0 && (
        <button
          onClick={addWeek}
          className="w-full py-2 border-2 border-dashed border-indigo-200 rounded-xl text-xs font-semibold text-indigo-500 hover:border-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 transition-all flex items-center justify-center gap-1"
        >
          <i className="ti ti-plus text-xs" aria-hidden="true" /> Add Week
        </button>
      )}
    </div>
  );
};

const SyllabusUpload = ({ uploadedFile, onUpload, onGenerate }) => {
  const fileInputRef = useRef(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "doc", "docx"].includes(ext)) {
      alert("Only PDF, DOC, DOCX files are supported.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert("File must be under 20 MB.");
      return;
    }
    setError("");
    onUpload({
      name: file.name,
      size: file.size,
      sizeLabel: `${(file.size / 1024).toFixed(0)} KB`,
      type: ext.toUpperCase(),
      rawFile: file,
    });
  };

  const handleGenerate = async () => {
    if (!uploadedFile?.rawFile) return;
    setGenerating(true);
    setError("");
    try {
      const { data } = await courseService.extractSyllabusFromFile(
        uploadedFile.rawFile,
      );
      const weeks = (data || []).map((w, wIdx) => ({
        id: Date.now() + wIdx,
        title: w.title || `Week ${wIdx + 1}`,
        modules: (w.modules || []).map((m, mIdx) => ({
          id: Date.now() + wIdx * 1000 + mIdx,
          title: m.title || `Module ${mIdx + 1}`,
          sessions: (m.sessions || []).map((s, sIdx) => ({
            id: Date.now() + wIdx * 100000 + mIdx * 1000 + sIdx,
            title: s.title || `Session ${sIdx + 1}`,
            type: s.type || "Reading",
            duration: s.duration || "",
          })),
        })),
      }));
      onGenerate({ weeks });
    } catch (err) {
      console.error("Syllabus extraction failed", err);
      setError(
        "Could not extract a syllabus from this file. Try a more clearly structured PDF/DOCX, or use Manual Builder.",
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${uploadedFile ? "border-emerald-300 bg-emerald-50" : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFile}
          className="hidden"
        />
        {uploadedFile ? (
          <div>
            <i
              className="ti ti-circle-check text-3xl text-emerald-500 block mb-2"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-emerald-700">
              {uploadedFile.name}
            </p>
            <p className="text-xs text-emerald-500 mt-1">
              {uploadedFile.sizeLabel} • {uploadedFile.type}
            </p>
            <p className="text-xs text-gray-400 mt-2">Click to replace file</p>
          </div>
        ) : (
          <div>
            <i
              className="ti ti-file-upload text-3xl text-gray-300 block mb-2"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-gray-700">
              Drop or click to upload
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PDF, DOC, DOCX • Max 20 MB
            </p>
          </div>
        )}
      </div>

      {uploadedFile && (
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          {generating ? (
            <>
              <i
                className="ti ti-refresh animate-spin text-sm"
                aria-hidden="true"
              />{" "}
              Generating Syllabus…
            </>
          ) : (
            <>
              <i className="ti ti-sparkles text-sm" aria-hidden="true" />{" "}
              Auto-Generate from File
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
};

// ─── Syllabus Preview ─────────────────────────────────────────────────────────
const SyllabusPreview = ({ generatedData }) => {
  const [expanded, setExpanded] = useState(new Set([0]));

  const toggle = (idx) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const typeColors = {
    Video: "bg-blue-100 text-blue-700",
    Live: "bg-emerald-100 text-emerald-700",
    Assignment: "bg-orange-100 text-orange-700",
    Quiz: "bg-purple-100 text-purple-700",
    Reading: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-2">
      {(generatedData.weeks || []).map((week, wIdx) => (
        <div
          key={week.id || wIdx}
          className="border border-gray-200 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => toggle(wIdx)}
            className="w-full flex items-center gap-2 px-3 py-2.5 bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            <span className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {wIdx + 1}
            </span>
            <span className="flex-1 text-left text-sm font-semibold text-indigo-800">
              {week.title}
            </span>
            <span className="text-xs text-indigo-500">
              {week.modules?.length || 0} modules
            </span>
            <i
              className="ti ti-chevron-down text-xs text-indigo-500 transition-transform"
              style={{
                transform: expanded.has(wIdx) ? "rotate(180deg)" : "none",
              }}
              aria-hidden="true"
            />
          </button>
          {expanded.has(wIdx) && (
            <div className="p-3 space-y-2">
              {(week.modules || []).map((mod, mIdx) => (
                <div
                  key={mod.id || mIdx}
                  className="bg-gray-50 rounded-lg p-2.5 border border-gray-100"
                >
                  <p className="text-xs font-semibold text-gray-700 mb-1.5">
                    {mod.title}
                  </p>
                  <div className="space-y-1">
                    {(mod.sessions || []).map((sess, sIdx) => (
                      <div
                        key={sess.id || sIdx}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${typeColors[sess.type] || "bg-gray-100 text-gray-600"}`}
                        >
                          {sess.type}
                        </span>
                        <span className="flex-1 text-gray-700">
                          {sess.title}
                        </span>
                        {sess.duration && (
                          <span className="text-gray-400">{sess.duration}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── MAIN SyllabusManager ─────────────────────────────────────────────────────
export default function SyllabusManager({ syllabusData, onChange }) {
  const data = syllabusData || {
    mode: "manual",
    weeks: [],
    uploadedFile: null,
    generatedPreview: null,
  };
  const [showPreview, setShowPreview] = useState(false);

  const emit = (patch) => onChange({ ...data, ...patch });

  const totalModules = (data.weeks || []).reduce(
    (a, w) => a + (w.modules?.length || 0),
    0,
  );
  const totalSessions = (data.weeks || []).reduce(
    (a, w) =>
      a + (w.modules || []).reduce((b, m) => b + (m.sessions?.length || 0), 0),
    0,
  );

  return (
    <div className="space-y-4">
      <div className="pb-2 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">Syllabus Management</h3>
        <p className="text-xs text-gray-500">
          Build week-by-week or upload a file
        </p>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            mode: "manual",
            icon: "ti-tool",
            label: "Manual Builder",
            desc: "Week-by-week builder",
          },
          {
            mode: "upload",
            icon: "ti-cloud-upload",
            label: "Upload File",
            desc: "PDF / DOC / DOCX",
          },
          {
            mode: "zip",
            icon: "ti-archive",
            label: "Upload ZIP",
            desc: "Auto Generate",
          },
        ].map(({ mode, icon, label, desc }) => (
          <button
            key={mode}
            onClick={() => emit({ mode })}
            className={`p-3 rounded-xl border-2 text-left transition-all ${data.mode === mode ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${data.mode === mode ? "border-indigo-500 bg-indigo-500" : "border-gray-300"}`}
              >
                {data.mode === mode && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <i
                className={`ti ${icon} text-sm ${data.mode === mode ? "text-indigo-600" : "text-gray-400"}`}
                aria-hidden="true"
              />
              <span
                className={`text-xs font-semibold ${data.mode === mode ? "text-indigo-700" : "text-gray-600"}`}
              >
                {label}
              </span>
            </div>
            <p className="text-xs text-gray-400 ml-6">{desc}</p>
          </button>
        ))}
      </div>

      {/* Stats */}
      {(data.mode === "manual" || data.mode === "zip") &&
        data.weeks?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {[
              {
                label: "Weeks",
                value: data.weeks.length,
                color: "bg-blue-50 text-blue-700 border-blue-200",
              },
              {
                label: "Modules",
                value: totalModules,
                color: "bg-violet-50 text-violet-700 border-violet-200",
              },
              {
                label: "Sessions",
                value: totalSessions,
                color: "bg-emerald-50 text-emerald-700 border-emerald-200",
              },
            ].map((s) => (
              <span
                key={s.label}
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.color}`}
              >
                <span className="font-bold">{s.value}</span> {s.label}
              </span>
            ))}
          </div>
        )}

      <div className="border-t border-gray-100" />

      {/* Manual Builder */}
      {data.mode === "manual" && (
        <ManualSyllabusBuilder
          weeks={data.weeks || []}
          onChange={(weeks) => emit({ weeks })}
        />
      )}

      {/* Upload Mode
      {data.mode === "upload" && (
        <div className="space-y-4">
          <SyllabusUpload
            uploadedFile={data.uploadedFile}
            onUpload={(file) =>
              emit({ uploadedFile: file, generatedPreview: null })
            }
            onGenerate={(preview) => emit({ generatedPreview: preview })}
          />
          {data.generatedPreview && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Generated Structure
                  </p>
                  <p className="text-xs text-gray-500">
                    Auto-detected from your file
                  </p>
                </div>
                <button
                  onClick={() => setShowPreview((v) => !v)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
              </div>
              {showPreview && (
                <SyllabusPreview generatedData={data.generatedPreview} />
              )}
            </div>
          )}
        </div>
      )} */}
      {data.mode === "upload" && (
        <div className="space-y-4">
          <SyllabusUpload
            uploadedFile={data.uploadedFile}
            onUpload={(file) =>
              emit({ uploadedFile: file, generatedPreview: null })
            }
            onGenerate={(preview) => emit({ generatedPreview: preview })}
          />
          {data.generatedPreview && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Generated Structure
                  </p>
                  <p className="text-xs text-gray-500">
                    Auto-detected from your file
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPreview((v) => !v)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </button>
                  <button
                    onClick={() =>
                      emit({
                        mode: "manual",
                        weeks: data.generatedPreview.weeks,
                        generatedPreview: null,
                      })
                    }
                    className="text-xs text-white font-semibold bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Apply to Syllabus →
                  </button>
                </div>
              </div>
              {showPreview && (
                <SyllabusPreview generatedData={data.generatedPreview} />
              )}
            </div>
          )}
        </div>
      )}

      {/* Upload ZIP Mode */}
      {data.mode === "zip" && (
        <SyllabusZipUpload
          onApply={(generatedWeeks) =>
            emit({ mode: "manual", weeks: generatedWeeks })
          }
        />
      )}

      {/* Tips */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
        <p className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
          <i
            className={`ti ${data.mode === "manual" ? "ti-bulb" : data.mode === "zip" ? "ti-archive" : "ti-info-circle"} text-sm`}
            aria-hidden="true"
          />
          {data.mode === "manual"
            ? "Manual Builder Tips"
            : data.mode === "zip"
              ? "ZIP Upload Tips"
              : "Upload Tips"}
        </p>
        {data.mode === "manual" ? (
          <ul className="text-xs text-slate-500 space-y-0.5 list-disc list-inside">
            <li>Organize content into logical weeks to guide learners.</li>
            <li>
              Use <strong>Live</strong> for interactive sessions and Q&amp;A.
            </li>
            <li>
              Add <strong>Assignment</strong> sessions for practice at end of
              modules.
            </li>
          </ul>
        ) : data.mode === "zip" ? (
          <ul className="text-xs text-slate-500 space-y-0.5 list-disc list-inside">
            <li>
              Folder = Module, files inside = Sessions (videos, PDFs, docs).
            </li>
            <li>
              If your ZIP already has "Week 1", "Week 2" folders, those are used
              directly.
            </li>
            <li>
              Otherwise modules are auto-grouped into weeks using the count you
              set.
            </li>
            <li>
              Applying loads the result into Manual Builder so you can fine-tune
              before saving.
            </li>
          </ul>
        ) : (
          <ul className="text-xs text-slate-500 space-y-0.5 list-disc list-inside">
            <li>
              Upload a structured PDF/DOCX for best auto-detection results.
            </li>
            <li>
              Ensure headings like "Week 1", "Module 1" are clearly formatted.
            </li>
            <li>
              Max file size: <strong>20 MB</strong>. Accepted: PDF, DOC, DOCX.
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
