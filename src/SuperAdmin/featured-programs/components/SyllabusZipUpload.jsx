import { useState, useRef } from "react";
import JSZip from "jszip";

/* ── Helpers ─────────────────────────────────────────────────────────────── */

// Extracts the first number found in a string, for natural sorting
// "Module 21" -> 21, "Module-7" -> 7, "Python-Notes-Topics" -> Infinity (push to end)
const extractNumber = (name) => {
  const m = name.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : Infinity;
};

const naturalSort = (a, b) => {
  const na = extractNumber(a.name);
  const nb = extractNumber(b.name);
  if (na !== nb) return na - nb;
  return a.name.localeCompare(b.name);
};

const SESSION_EXT_MAP = {
  mp4: "Video",
  mov: "Video",
  avi: "Video",
  mkv: "Video",
  webm: "Video",
  pdf: "Reading",
  doc: "Reading",
  docx: "Reading",
  ppt: "Reading",
  pptx: "Reading",
  txt: "Reading",
  zip: "Assignment",
};

const guessSessionType = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  return SESSION_EXT_MAP[ext] || "Reading";
};

const cleanTitle = (name) => {
  // strip extension, replace dashes/underscores with spaces, trim
  return name
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
};

const isJunkPath = (path) => {
  const base = path.split("/").pop();
  return (
    base.startsWith(".") ||
    base === "__MACOSX" ||
    base === "Thumbs.db" ||
    base === ""
  );
};

/**
 * Builds a nested tree from JSZip's flat file list.
 * Returns: { name, type: 'folder'|'file', path, children: [] }
 */
const buildTree = (zipFiles) => {
  const root = { name: "__root__", type: "folder", path: "", children: {} };

  Object.keys(zipFiles).forEach((path) => {
    if (isJunkPath(path)) return;
    const entry = zipFiles[path];
    const parts = path.replace(/\/$/, "").split("/").filter(Boolean);
    let node = root;
    parts.forEach((part, idx) => {
      const isLast = idx === parts.length - 1;
      if (!node.children[part]) {
        node.children[part] = {
          name: part,
          type: isLast && !entry.dir ? "file" : "folder",
          path: parts.slice(0, idx + 1).join("/"),
          children: {},
        };
      }
      node = node.children[part];
    });
  });

  const toArray = (node) => {
    const children = Object.values(node.children)
      .map(toArray)
      .sort(naturalSort);
    return { ...node, children };
  };

  return toArray(root);
};

// If the zip has a single top-level wrapper folder (e.g. "Python/"), unwrap it.
const unwrapSingleRoot = (tree) => {
  let node = tree;
  while (node.children.length === 1 && node.children[0].type === "folder") {
    node = node.children[0];
  }
  return node;
};

const buildSessionsFromFiles = (files) =>
  files
    .filter((f) => f.type === "file")
    .map((f, i) => ({
      id: Date.now() + Math.random() * 1000 + i,
      title: cleanTitle(f.name),
      type: guessSessionType(f.name),
      duration: "",
    }));

/**
 * Turns a folder node (module) into { id, title, sessions }.
 * - If module is a folder with file children -> each file is a session.
 * - If module is a folder with sub-folders -> flatten one level of files inside them too (rare case).
 */
const buildModuleFromNode = (node) => {
  const directFiles = node.children.filter((c) => c.type === "file");
  const subFolders = node.children.filter((c) => c.type === "folder");

  let sessions = buildSessionsFromFiles(directFiles);

  // If module itself has no direct files but has sub-folders (rare), pull files from one level deep
  if (sessions.length === 0 && subFolders.length > 0) {
    subFolders.forEach((sf) => {
      sessions = sessions.concat(buildSessionsFromFiles(sf.children));
    });
  }

  return {
    id: Date.now() + Math.random() * 1000,
    title: cleanTitle(node.name),
    sessions,
  };
};

/**
 * Core detection algorithm.
 * Returns { weeks, stats } in the same shape ManualSyllabusBuilder expects.
 */
const detectStructure = (rootNode, modulesPerWeek) => {
  const items = rootNode.children;

  const weekFolders = items.filter(
    (c) => c.type === "folder" && /week/i.test(c.name),
  );

  // CASE A: Explicit Week folders already present in the zip
  if (weekFolders.length > 0) {
    weekFolders.sort(naturalSort);
    const weeks = weekFolders.map((wf, wIdx) => {
      const moduleNodes = wf.children.filter(
        (c) => c.type === "folder" || c.type === "file",
      );
      const modules = moduleNodes
        .filter((m) => m.type === "folder")
        .map(buildModuleFromNode);
      return {
        id: Date.now() + wIdx,
        title: cleanTitle(wf.name) || `Week ${wIdx + 1}`,
        modules,
      };
    });
    return weeks;
  }

  // CASE B: Flat list of Module folders/files at root -> group into weeks automatically
  // A "module" candidate is any top-level folder, OR any top-level file that looks
  // like a standalone module document (e.g. "Module 21-Part1.docx").
  const moduleFolders = items.filter((c) => c.type === "folder");
  const moduleFiles = items.filter((c) => c.type === "file");

  let modules = [];

  if (moduleFolders.length > 0) {
    modules = moduleFolders.map(buildModuleFromNode);

    // Loose top-level files (not inside any module folder) become an "Extra Resources" module
    if (moduleFiles.length > 0) {
      modules.push({
        id: Date.now() + 99999,
        title: "Extra Resources",
        sessions: buildSessionsFromFiles(moduleFiles),
      });
    }
  } else {
    // No folders at all — every file at root is its own "module" with one session,
    // unless multiple files share the same base module number (e.g. Module 21-Part1/2/3),
    // in which case they're grouped into a single module with multiple sessions.
    const groups = {};
    moduleFiles.forEach((f) => {
      const key = (f.name.match(/^(.*?module\s*\d+)/i) || [
        null,
        cleanTitle(f.name),
      ])[1];
      if (!groups[key]) groups[key] = [];
      groups[key].push(f);
    });
    modules = Object.entries(groups)
      .sort((a, b) => extractNumber(a[0]) - extractNumber(b[0]))
      .map(([key, files], idx) => ({
        id: Date.now() + idx,
        title: cleanTitle(key),
        sessions: buildSessionsFromFiles(files),
      }));
  }

  // Group modules into weeks, N modules per week
  const perWeek = Math.max(1, modulesPerWeek || 3);
  const weeks = [];
  for (let i = 0; i < modules.length; i += perWeek) {
    const weekModules = modules.slice(i, i + perWeek);
    weeks.push({
      id: Date.now() + i,
      title: `Week ${weeks.length + 1}`,
      modules: weekModules,
    });
  }

  return weeks;
};

/* ── Component ───────────────────────────────────────────────────────────── */

export default function SyllabusZipUpload({ onApply }) {
  const [stage, setStage] = useState("idle"); // idle | uploading | extracting | grouping | preview | error
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [modulesPerWeek, setModulesPerWeek] = useState(3);
  const [weeks, setWeeks] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const fileRef = useRef(null);

  const stats = {
    weeks: weeks.length,
    modules: weeks.reduce((a, w) => a + w.modules.length, 0),
    sessions: weeks.reduce(
      (a, w) => a + w.modules.reduce((b, m) => b + m.sessions.length, 0),
      0,
    ),
  };

  const processZip = async (file) => {
    if (!file || !file.name.toLowerCase().endsWith(".zip")) {
      setErrorMsg("Only .zip files are accepted.");
      setStage("error");
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      setErrorMsg("File too large. Max 500MB allowed.");
      setStage("error");
      return;
    }

    try {
      setFileName(file.name);
      setStage("uploading");
      setProgress(0);
      setProgressLabel("Uploading ZIP...");

      // Simulated upload progress (instant for local file, but gives UX feedback)
      await new Promise((res) => {
        let p = 0;
        const t = setInterval(() => {
          p += 25;
          setProgress(Math.min(p, 100));
          if (p >= 100) {
            clearInterval(t);
            res();
          }
        }, 80);
      });

      setStage("extracting");
      setProgress(0);
      setProgressLabel("Extracting Files...");

      const zip = await JSZip.loadAsync(file, {
        // gives us incremental feedback while reading large zips
      });
      setProgress(60);

      const tree = unwrapSingleRoot(buildTree(zip.files));
      setProgress(100);

      setStage("grouping");
      setProgress(0);
      setProgressLabel("Generating Weeks...");

      await new Promise((r) => setTimeout(r, 250)); // small UX pause
      const generatedWeeks = detectStructure(tree, modulesPerWeek);
      setProgress(100);

      setWeeks(generatedWeeks);
      setExpandedWeeks({ [generatedWeeks[0]?.id]: true });
      setTimeout(() => setStage("preview"), 200);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Could not read this ZIP file. Please check it's a valid .zip archive.",
      );
      setStage("error");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processZip(e.dataTransfer.files[0]);
  };

  const reset = () => {
    setStage("idle");
    setWeeks([]);
    setProgress(0);
    setFileName("");
    setErrorMsg("");
  };

  const toggleWeek = (id) => setExpandedWeeks((p) => ({ ...p, [id]: !p[id] }));

  const updateWeekTitle = (id, title) =>
    setWeeks((p) => p.map((w) => (w.id === id ? { ...w, title } : w)));

  const updateModuleTitle = (weekId, modId, title) =>
    setWeeks((p) =>
      p.map((w) =>
        w.id === weekId
          ? {
              ...w,
              modules: w.modules.map((m) =>
                m.id === modId ? { ...m, title } : m,
              ),
            }
          : w,
      ),
    );

  const deleteModule = (weekId, modId) =>
    setWeeks((p) =>
      p.map((w) =>
        w.id === weekId
          ? { ...w, modules: w.modules.filter((m) => m.id !== modId) }
          : w,
      ),
    );

  const handleApply = () => {
    onApply && onApply(weeks);
  };

  const typeColors = {
    Video: "bg-blue-100 text-blue-700",
    Reading: "bg-gray-100 text-gray-600",
    Assignment: "bg-orange-100 text-orange-700",
  };

  /* ── IDLE / Drop zone ── */
  if (stage === "idle" || stage === "error") {
    return (
      <div>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
            dragging
              ? "border-indigo-500 bg-indigo-50 scale-[1.01]"
              : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
          }`}
        >
          <div
            className={`text-5xl mb-4 transition-transform ${dragging ? "scale-125" : ""}`}
          >
            {dragging ? "📂" : "📦"}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {dragging ? "Drop your ZIP here" : "Drag & Drop ZIP Here"}
          </h3>
          <p className="text-gray-500 text-sm mb-5">or</p>
          <button
            onClick={() => fileRef.current?.click()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
          >
            Upload ZIP
          </button>
          <p className="text-xs text-gray-400 mt-4">
            Supports .zip • Max 500MB
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".zip"
            onChange={(e) => processZip(e.target.files[0])}
            className="hidden"
          />
        </div>

        <div className="flex items-center gap-3 mt-4">
          <label className="text-xs font-medium text-gray-600 whitespace-nowrap">
            Modules per week:
          </label>
          <input
            type="number"
            min={1}
            max={10}
            value={modulesPerWeek}
            onChange={(e) => setModulesPerWeek(Number(e.target.value) || 1)}
            className="w-16 text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-400"
          />
          <span className="text-xs text-gray-400">
            (used only when no "Week" folders are found in the ZIP)
          </span>
        </div>

        <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">
            Folder structure example
          </p>
          <pre className="text-xs text-gray-500 font-mono leading-relaxed whitespace-pre-wrap">
            {`Python.zip
 ├── Module 1.docx
 ├── Module 2.docx
 ├── Module 7/
 │     ├── Intro.mp4
 │     └── Assignment.pdf
 └── Module 21/
       ├── Module 21-Part1.docx
       ├── Module 21-Part2.docx
       └── Module 21-Part3.docx`}
          </pre>
        </div>

        {stage === "error" && (
          <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            <span>⚠️</span> {errorMsg}
            <button onClick={reset} className="ml-auto text-xs underline">
              Try again
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ── PROGRESS (uploading / extracting / grouping) ── */
  if (stage === "uploading" || stage === "extracting" || stage === "grouping") {
    return (
      <div className="py-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3 animate-bounce">📦</div>
          <h3 className="font-bold text-gray-900 text-base">{progressLabel}</h3>
          <p className="text-gray-400 text-xs mt-1 truncate max-w-xs mx-auto">
            {fileName}
          </p>
        </div>
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{progressLabel}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="max-w-md mx-auto mt-5 space-y-1.5 text-xs">
          {["uploading", "extracting", "grouping"].map((s, i) => {
            const order = ["uploading", "extracting", "grouping"];
            const currentIdx = order.indexOf(stage);
            const done = i < currentIdx;
            const active = i === currentIdx;
            return (
              <div
                key={s}
                className={`flex items-center gap-2 ${done ? "text-emerald-600" : active ? "text-indigo-600" : "text-gray-300"}`}
              >
                <span>{done ? "✓" : active ? "●" : "○"}</span>
                <span className="capitalize">
                  {s === "uploading"
                    ? "Upload ZIP"
                    : s === "extracting"
                      ? "Extract & Parse"
                      : "Group into Weeks"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── PREVIEW / EDIT ── */
  return (
    <div>
      <div className="flex items-center gap-3 mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <span className="text-2xl">✅</span>
        <div className="flex-1">
          <p className="font-semibold text-emerald-800 text-sm">
            Structure Detected Successfully!
          </p>
          <p className="text-xs text-emerald-600">
            {stats.weeks} weeks · {stats.modules} modules · {stats.sessions}{" "}
            sessions found from <strong>{fileName}</strong>
          </p>
        </div>
        <button
          onClick={reset}
          className="text-xs text-emerald-700 underline whitespace-nowrap"
        >
          Upload different ZIP
        </button>
      </div>

      <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
        {weeks.map((week, wIdx) => (
          <div
            key={week.id}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggleWeek(week.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-indigo-50 hover:bg-indigo-100 transition-colors text-left"
            >
              <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                {wIdx + 1}
              </span>
              <input
                type="text"
                value={week.title}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateWeekTitle(week.id, e.target.value)}
                className="flex-1 bg-transparent text-sm font-semibold text-indigo-800 outline-none border-b border-dashed border-indigo-300 focus:border-indigo-600 py-0.5"
              />
              <span className="text-xs text-indigo-500 whitespace-nowrap">
                {week.modules.length} modules
              </span>
              <span
                className={`text-xs text-indigo-400 transition-transform ${expandedWeeks[week.id] ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>

            {expandedWeeks[week.id] && (
              <div className="p-3 space-y-2 bg-white">
                {week.modules.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-2">
                    No modules in this week.
                  </p>
                )}
                {week.modules.map((mod) => (
                  <div
                    key={mod.id}
                    className="bg-gray-50 rounded-lg p-2.5 border border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-gray-400 text-xs">📦</span>
                      <input
                        type="text"
                        value={mod.title}
                        onChange={(e) =>
                          updateModuleTitle(week.id, mod.id, e.target.value)
                        }
                        className="flex-1 bg-transparent text-xs font-semibold text-gray-700 outline-none border-b border-dashed border-gray-300 focus:border-indigo-400 py-0.5"
                      />
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {mod.sessions.length} sessions
                      </span>
                      <button
                        onClick={() => deleteModule(week.id, mod.id)}
                        className="text-red-300 hover:text-red-500 text-xs px-1"
                      >
                        ✕
                      </button>
                    </div>
                    {mod.sessions.length > 0 && (
                      <div className="space-y-1 ml-5">
                        {mod.sessions.map((s) => (
                          <div
                            key={s.id}
                            className="flex items-center gap-2 text-xs"
                          >
                            <span
                              className={`px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${typeColors[s.type] || "bg-gray-100 text-gray-600"}`}
                            >
                              {s.type}
                            </span>
                            <span className="text-gray-600 truncate">
                              {s.title}
                            </span>
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

      <div className="flex gap-3 justify-end mt-5">
        <button
          onClick={reset}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
        >
          Regenerate
        </button>
        <button
          onClick={handleApply}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          Apply to Syllabus →
        </button>
      </div>
    </div>
  );
}
