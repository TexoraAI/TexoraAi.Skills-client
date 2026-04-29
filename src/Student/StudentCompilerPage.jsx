import { useEffect, useRef, useState } from "react";
import API, {
  deleteCodeFile,
  getCodeFileById,
  getMyCodeFiles,
  getMyCodeSubmissions,
  getMySQLState,
  getStudentProblemById,
  getStudentProblems,
  resetMySQLDatabase,
  runCode,
  saveCodeFile,
  submitCodeForJudge,
} from "../services/assessmentService"; // ← for profile endpoint only
import { getStudentClassroom } from "../services/batchService";

// ── Code File API helpers — now wired to assessmentService correctly ──
const codeFilesAPI = {
  save: (data) => saveCodeFile(data),
  getAll: (_studentEmail, batchId) => getMyCodeFiles(batchId),
  getById: (id) => getCodeFileById(id),
  delete: (id) => deleteCodeFile(id),
  // Profile: assessmentService axios instance re-used
  getProfile: () =>
    API.default
      ? API.default.get?.("/students/profile") // fallback
      : fetch(
          (import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api") +
            "/students/profile",
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("lms_token") ||
                localStorage.getItem("token") ||
                localStorage.getItem("accessToken") ||
                localStorage.getItem("jwt") ||
                ""
              }`,
            },
          },
        ).then((r) => r.json().then((d) => ({ data: d }))),
};

const LANGUAGES = ["JAVA", "PYTHON", "JAVASCRIPT", "MYSQL", "BASH"];

const LANG_LABEL = {
  JAVA: "☕ Java",
  PYTHON: "🐍 Python",
  JAVASCRIPT: "🟨 JS",
  MYSQL: "🐬 MySQL",
  BASH: "🖥️ Bash",
};

const DEFAULT_CODE = {
  JAVA: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,

  PYTHON: `# Write your solution here
print("Hello, World!")`,

  JAVASCRIPT: `// Write your solution here
process.stdin.resume();
process.stdin.setEncoding('utf8');
let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
    console.log("Hello, World!");
});`,

  MYSQL: `-- Your database persists across runs!
-- Step 1: Create your table (run once)
CREATE TABLE IF NOT EXISTS students (
    id     INT PRIMARY KEY AUTO_INCREMENT,
    name   VARCHAR(100) NOT NULL,
    age    INT,
    course VARCHAR(100)
);

-- Step 2: Insert data
INSERT INTO students (name, age, course) VALUES
    ('Alice', 20, 'Java'),
    ('Bob',   22, 'Python'),
    ('Carol', 21, 'MySQL');

-- Step 3: Query
SELECT * FROM students;`,

  BASH: `#!/bin/bash
echo "=== System Info ==="
uname -a

echo ""
echo "=== Directory Listing ==="
ls -la

echo ""
echo "=== Simple Loop ==="
for i in 1 2 3 4 5; do
  echo "Item: $i"
done

echo ""
echo "=== String Operations ==="
name="CodeLab"
echo "Name: $name"
echo "Length: \${#name}"

echo ""
echo "=== Math ==="
echo "5 + 3 = $((5 + 3))"
echo "10 * 4 = $((10 * 4))"`,
};

const NO_INPUT_LANGS = ["MYSQL", "BASH"];

export default function StudentCompilerPage() {
  const [mode, setMode] = useState("problems");
  const [tab, setTab] = useState("problems");
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [language, setLanguage] = useState("PYTHON");
  const [code, setCode] = useState(DEFAULT_CODE["PYTHON"]);
  const [output, setOutput] = useState(null);
  const [judgeResult, setJudgeResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [problemLoading, setProblemLoading] = useState(false);
  const [activeHistoryItem, setActiveHistoryItem] = useState(null);
  const [batchId, setBatchId] = useState(null);
  const [batchLoading, setBatchLoading] = useState(true);
  const [batchError, setBatchError] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  // ── MySQL persistent DB state ──────────────────
  const [mysqlTables, setMysqlTables] = useState(null);
  const [mysqlStateLoading, setMysqlStateLoading] = useState(false);
  const [showDbExplorer, setShowDbExplorer] = useState(false);

  // ── My Files state ────────────────────────
  const [showMyFiles, setShowMyFiles] = useState(false);
  const [myFiles, setMyFiles] = useState([]);
  const [myFilesLoading, setMyFilesLoading] = useState(false);
  const [studentEmail, setStudentEmail] = useState(null);
  const [saveFileModal, setSaveFileModal] = useState(false);
  const [saveFileName, setSaveFileName] = useState("");
  const [saveFileLoading, setSaveFileLoading] = useState(false);
  const [saveFileError, setSaveFileError] = useState("");

  const textareaRef = useRef(null);

  useEffect(() => {
    const initBatch = async () => {
      setBatchLoading(true);
      try {
        const res = await getStudentClassroom();
        const classroom = res?.data || res;
        const resolvedId = classroom?.batchId || classroom?.id || null;
        if (resolvedId) setBatchId(resolvedId);
        else setBatchError(true);
      } catch {
        setBatchError(true);
      } finally {
        setBatchLoading(false);
      }
    };
    initBatch();
  }, []);

  // ── fetch student email from profile endpoint ──
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await codeFilesAPI.getProfile();
        setStudentEmail(res?.data?.email || null);
      } catch {
        // silently ignore — email stays null
      }
    };
    fetchEmail();
  }, []);

  useEffect(() => {
    if (batchId) fetchProblems();
  }, [batchId]);
  useEffect(() => {
    if (tab === "history" && batchId) fetchHistory();
  }, [tab, batchId]);

  const fetchProblems = async () => {
    try {
      const res = await getStudentProblems(batchId);
      setProblems(res.data || []);
    } catch {
      setProblems([]);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await getMyCodeSubmissions(batchId);
      setHistory(res.data || []);
    } catch {
      setHistory([]);
    }
  };

  // ── MySQL: fetch DB explorer state ────────────
  const fetchMySQLState = async () => {
    setMysqlStateLoading(true);
    try {
      const res = await getMySQLState();
      setMysqlTables(res.data);
    } catch {
      setMysqlTables({
        output: "Could not fetch database state.",
        status: "RUNTIME_ERROR",
      });
    } finally {
      setMysqlStateLoading(false);
    }
  };

  // ── MySQL: reset student DB ───────────────────
  const handleMySQLReset = async () => {
    if (
      !window.confirm(
        "⚠️ This will DROP your entire database and all tables.\n\nAre you sure?",
      )
    )
      return;
    setRunLoading(true);
    setOutput(null);
    try {
      const res = await resetMySQLDatabase();
      setOutput(res.data);
      setMysqlTables(null);
      setShowDbExplorer(false);
    } catch (e) {
      setOutput({
        output: e.response?.data?.message || "Reset failed.",
        status: "RUNTIME_ERROR",
      });
    } finally {
      setRunLoading(false);
    }
  };

  // ── My Files handlers ─────────────────────
  const fetchMyFiles = async () => {
    if (!batchId) return;
    setMyFilesLoading(true);
    try {
      // getMyCodeFiles(batchId) — studentEmail not needed, JWT handles identity
      const res = await codeFilesAPI.getAll(studentEmail, batchId);
      setMyFiles(res.data || []);
    } catch {
      setMyFiles([]);
    } finally {
      setMyFilesLoading(false);
    }
  };

  const handleOpenMyFiles = () => {
    setShowMyFiles(true);
    fetchMyFiles();
  };

  const handleLoadFile = async (file) => {
    try {
      const res = await codeFilesAPI.getById(file.id);
      const f = res.data;
      const lang = (f.language || file.language || language).toUpperCase();
      setLanguage(lang);
      setCode(f.code || f.content || "");
      setOutput(null);
      setJudgeResult(null);
      setShowMyFiles(false);
    } catch {
      alert("Could not load file.");
    }
  };

  const handleDeleteFile = async (fileId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this file?")) return;
    try {
      await codeFilesAPI.delete(fileId);
      setMyFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch {
      alert("Could not delete file.");
    }
  };

  const handleSaveFile = async () => {
    const trimmed = saveFileName.trim();
    if (!trimmed) {
      setSaveFileError("File name is required.");
      return;
    }
    setSaveFileLoading(true);
    setSaveFileError("");
    try {
      // saveCodeFile from assessmentService — JWT carries student identity
      // batchId is sent so the backend can associate the file
      await codeFilesAPI.save({
        fileName: trimmed,
        language,
        code,
        batchId,
        // studentEmail is optional — only include if your backend needs it
        ...(studentEmail ? { studentEmail } : {}),
      });
      setSaveFileModal(false);
      setSaveFileName("");
    } catch (e) {
      setSaveFileError(
        e.response?.data?.message || "Save failed. Please try again.",
      );
    } finally {
      setSaveFileLoading(false);
    }
  };

  const openProblem = async (problemId) => {
    setProblemLoading(true);
    try {
      const res = await getStudentProblemById(problemId);
      setSelectedProblem(res.data);
      setCode(DEFAULT_CODE[language]);
      setOutput(null);
      setJudgeResult(null);
      setMode("editor");
      setTab("editor");
    } catch {
      alert("Could not load problem.");
    } finally {
      setProblemLoading(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang]);
    setOutput(null);
    setJudgeResult(null);
    if (NO_INPUT_LANGS.includes(lang)) setShowCustomInput(false);
    if (lang !== "MYSQL") {
      setShowDbExplorer(false);
      setMysqlTables(null);
    }
  };

  const handleRunCode = async () => {
    setRunLoading(true);
    setOutput(null);
    setJudgeResult(null);
    try {
      let stdinInput = "";
      if (!NO_INPUT_LANGS.includes(language)) {
        stdinInput =
          mode === "playground"
            ? customInput
            : selectedProblem?.sampleInput || "";
      }
      const res = await runCode(batchId, language, code, stdinInput);
      setOutput(res.data);
    } catch (e) {
      setOutput({
        output: e.response?.data?.message || "Run failed.",
        status: "RUNTIME_ERROR",
      });
    } finally {
      setRunLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProblem) return;
    setLoading(true);
    setJudgeResult(null);
    setOutput(null);
    try {
      const res = await submitCodeForJudge(
        selectedProblem.id,
        batchId,
        language,
        code,
      );
      setJudgeResult(res.data);
    } catch {
      setJudgeResult({
        overallVerdict: "ERROR",
        marksObtained: 0,
        totalMarks: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabKey = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
      }, 0);
    }
  };

  const verdictColor = (v) =>
    v === "ACCEPTED" ? "#16a34a" : v === "PARTIAL" ? "#d97706" : "#dc2626";
  const difficultyStyle = (d) =>
    d === "EASY"
      ? { color: "#16a34a", background: "#dcfce7", border: "1px solid #bbf7d0" }
      : d === "MEDIUM"
        ? {
            color: "#d97706",
            background: "#fef3c7",
            border: "1px solid #fde68a",
          }
        : {
            color: "#dc2626",
            background: "#fee2e2",
            border: "1px solid #fecaca",
          };
  const statusColor = (s) =>
    s === "SUCCESS" ? "#16a34a" : s === "COMPILE_ERROR" ? "#d97706" : "#dc2626";
  const statusBg = (s) =>
    s === "SUCCESS" ? "#dcfce7" : s === "COMPILE_ERROR" ? "#fef3c7" : "#fee2e2";

  // ── MySQL toolbar + DB explorer ──
  const MySQLToolbar = () => (
    <>
      <div style={s.mysqlToolbar}>
        <div style={s.mysqlInfo}>
          🐬 <strong>MySQL</strong> — Your database persists across runs. CREATE
          once, INSERT/SELECT in separate runs.
        </div>
        <div style={s.mysqlActions}>
          <button
            style={s.dbExplorerBtn}
            onClick={() => {
              const next = !showDbExplorer;
              setShowDbExplorer(next);
              if (next) fetchMySQLState();
            }}
          >
            🗄️ {showDbExplorer ? "Hide Tables" : "Show Tables"}
          </button>
          <button style={s.dbResetBtn} onClick={handleMySQLReset}>
            🗑️ Reset DB
          </button>
        </div>
      </div>
      {showDbExplorer && (
        <div style={s.dbExplorerPanel}>
          <div style={s.dbExplorerHeader}>
            🗄️ Your Tables
            <button
              style={s.refreshBtn}
              onClick={fetchMySQLState}
              disabled={mysqlStateLoading}
            >
              {mysqlStateLoading ? "..." : "↻ Refresh"}
            </button>
          </div>
          <div style={s.dbExplorerBody}>
            {mysqlStateLoading ? (
              <span style={{ color: "#64748b", fontSize: 12 }}>Loading...</span>
            ) : mysqlTables ? (
              <pre style={s.sqlOutputPre}>
                {mysqlTables.output || "No tables found."}
              </pre>
            ) : (
              <span style={{ color: "#94a3b8", fontSize: 12 }}>
                Click Refresh to see your tables.
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );

  // ── My Files Drawer ───────────────────────
  const MyFilesDrawer = () => (
    <div style={s.drawerOverlay} onClick={() => setShowMyFiles(false)}>
      <div style={s.drawerPanel} onClick={(e) => e.stopPropagation()}>
        <div style={s.drawerHeader}>
          <span style={s.drawerTitle}>📁 My Saved Files</span>
          <button
            style={s.drawerCloseBtn}
            onClick={() => setShowMyFiles(false)}
          >
            ✕
          </button>
        </div>
        <div style={s.drawerBody}>
          {myFilesLoading ? (
            <div style={s.drawerLoading}>
              <div style={s.outputSpinner} />
              <span style={{ color: "#64748b", fontSize: 13 }}>
                Loading files...
              </span>
            </div>
          ) : myFiles.length === 0 ? (
            <div style={s.drawerEmpty}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📂</div>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>
                No saved files yet.
              </div>
              <div style={{ color: "#cbd5e1", fontSize: 12, marginTop: 4 }}>
                Use the Save button in the editor to save your code.
              </div>
            </div>
          ) : (
            <div style={s.fileList}>
              {myFiles.map((file) => (
                <div
                  key={file.id}
                  style={s.fileCard}
                  onClick={() => handleLoadFile(file)}
                >
                  <div style={s.fileCardLeft}>
                    <span style={s.fileIcon}>
                      {file.language === "JAVA"
                        ? "☕"
                        : file.language === "PYTHON"
                          ? "🐍"
                          : file.language === "JAVASCRIPT"
                            ? "🟨"
                            : file.language === "MYSQL"
                              ? "🐬"
                              : file.language === "BASH"
                                ? "🖥️"
                                : "📄"}
                    </span>
                    <div>
                      <div style={s.fileName}>{file.fileName || file.name}</div>
                      <div style={s.fileMeta}>
                        <span style={s.fileLangBadge}>{file.language}</span>
                        {file.updatedAt && (
                          <span style={s.fileDate}>
                            {new Date(file.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    style={s.fileDeleteBtn}
                    onClick={(e) => handleDeleteFile(file.id, e)}
                    title="Delete file"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={s.drawerFooter}>
          <button
            style={s.drawerRefreshBtn}
            onClick={fetchMyFiles}
            disabled={myFilesLoading}
          >
            ↻ Refresh
          </button>
        </div>
      </div>
    </div>
  );

  // ── Save File Modal ───────────────────────
  const SaveFileModal = () => (
    <div
      style={s.drawerOverlay}
      onClick={() => {
        setSaveFileModal(false);
        setSaveFileName("");
        setSaveFileError("");
      }}
    >
      <div style={s.saveModalBox} onClick={(e) => e.stopPropagation()}>
        <div style={s.drawerHeader}>
          <span style={s.drawerTitle}>💾 Save File</span>
          <button
            style={s.drawerCloseBtn}
            onClick={() => {
              setSaveFileModal(false);
              setSaveFileName("");
              setSaveFileError("");
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: "20px 20px 16px" }}>
          <div style={s.saveLabel}>File Name</div>
          <input
            style={s.saveInput}
            value={saveFileName}
            onChange={(e) => {
              setSaveFileName(e.target.value);
              setSaveFileError("");
            }}
            placeholder="e.g. bubble_sort.py"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveFile();
            }}
          />
          {saveFileError && <div style={s.saveError}>{saveFileError}</div>}
          <div style={s.saveMetaRow}>
            <span style={s.fileLangBadge}>{LANG_LABEL[language]}</span>
            <span style={{ color: "#94a3b8", fontSize: 11 }}>
              {code.split("\n").length} lines
            </span>
          </div>
        </div>
        <div style={s.saveModalFooter}>
          <button
            style={s.saveCancelBtn}
            onClick={() => {
              setSaveFileModal(false);
              setSaveFileName("");
              setSaveFileError("");
            }}
          >
            Cancel
          </button>
          <button
            style={s.saveConfirmBtn}
            onClick={handleSaveFile}
            disabled={saveFileLoading}
          >
            {saveFileLoading ? "Saving..." : "💾 Save"}
          </button>
        </div>
      </div>
    </div>
  );

  // ── Loading screen ────────────────────────────
  if (batchLoading) {
    return (
      <div style={s.loadingScreen}>
        <div style={s.spinner} />
        <p style={{ color: "#64748b", fontSize: 14, marginTop: 12 }}>
          Loading your workspace...
        </p>
      </div>
    );
  }

  if (batchError || !batchId) {
    return (
      <div style={s.loadingScreen}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
        <p style={{ color: "#dc2626", fontSize: 14 }}>
          Could not load your batch. Please contact your trainer.
        </p>
      </div>
    );
  }

  const RunLoadingOverlay = () => (
    <div style={s.runOverlay}>
      <div style={s.runOverlayBox}>
        <div style={s.runSpinner} />
        <div style={s.runOverlayText}>
          {language === "MYSQL"
            ? "⚙️ Running SQL on your database..."
            : language === "BASH"
              ? "🖥️ Executing shell script..."
              : "▶ Running code..."}
        </div>
        <div style={s.runOverlaySubText}>
          {language === "MYSQL"
            ? "Your data will persist after this run"
            : language === "BASH"
              ? "Running in sandbox environment"
              : "Please wait..."}
        </div>
      </div>
    </div>
  );

  // ── PLAYGROUND MODE ───────────────────────────
  if (mode === "playground") {
    return (
      <div style={s.root}>
        {runLoading && <RunLoadingOverlay />}
        {showMyFiles && <MyFilesDrawer />}
        {saveFileModal && <SaveFileModal />}
        <div style={s.header}>
          <div style={s.headerLeft}>
            <button style={s.modeBackBtn} onClick={() => setMode("problems")}>
              ← Back
            </button>
            <div style={s.logoWrap}>
              <span style={s.logoIcon}>{"</>"}</span>
              <span style={s.logoText}>CodeLab</span>
            </div>
            <span style={s.playgroundBadge}>🎮 Playground</span>
          </div>
          <div style={s.headerRight}>
            <div style={s.langToggle}>
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  onClick={() => handleLanguageChange(l)}
                  style={{
                    ...s.langBtn,
                    ...(language === l ? s.langBtnActive : {}),
                  }}
                >
                  {LANG_LABEL[l]}
                </button>
              ))}
            </div>
            <button style={s.myFilesBtn} onClick={handleOpenMyFiles}>
              📁 My Files
            </button>
            <button
              style={s.saveBtn}
              onClick={() => {
                setSaveFileName("");
                setSaveFileError("");
                setSaveFileModal(true);
              }}
            >
              💾 Save
            </button>
            <button
              style={s.runBtnPrimary}
              onClick={handleRunCode}
              disabled={runLoading}
            >
              {runLoading ? (
                <>
                  <span style={s.btnSpinner} /> Running...
                </>
              ) : (
                <>
                  <span style={{ marginRight: 6 }}>▶</span> Run Code
                </>
              )}
            </button>
          </div>
        </div>

        <div style={{ ...s.editorLayout, height: "calc(100vh - 56px)" }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {language === "MYSQL" && <MySQLToolbar />}
            {language === "BASH" && (
              <div
                style={{
                  ...s.langBanner,
                  background: "#f0fdf4",
                  borderColor: "#86efac",
                  color: "#166534",
                }}
              >
                🖥️ <strong>Bash Mode</strong> — Your script runs in a sandboxed
                shell environment.
              </div>
            )}

            <div style={s.editorAreaWrap}>
              <div style={s.lineNumbers}>
                {code.split("\n").map((_, i) => (
                  <div key={i} style={s.lineNum}>
                    {i + 1}
                  </div>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                style={{
                  ...s.codeTextarea,
                  ...(language === "MYSQL" ? s.sqlTextarea : {}),
                }}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleTabKey}
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
                placeholder={
                  language === "MYSQL"
                    ? "-- Write your SQL here..."
                    : language === "BASH"
                      ? "#!/bin/bash\n# Write your shell script here..."
                      : "// Start coding here..."
                }
              />
            </div>

            <div style={s.bottomPanel}>
              <div style={s.bottomTabs}>
                <button
                  style={{
                    ...s.bottomTab,
                    ...(!showCustomInput ? s.bottomTabActive : {}),
                  }}
                  onClick={() => setShowCustomInput(false)}
                >
                  Output
                </button>
                {!NO_INPUT_LANGS.includes(language) && (
                  <button
                    style={{
                      ...s.bottomTab,
                      ...(showCustomInput ? s.bottomTabActive : {}),
                    }}
                    onClick={() => setShowCustomInput(true)}
                  >
                    Custom Input
                  </button>
                )}
              </div>

              <div style={s.bottomContent}>
                {showCustomInput ? (
                  <textarea
                    style={s.customInputArea}
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter custom input here (stdin)..."
                  />
                ) : (
                  <>
                    {runLoading && (
                      <div style={s.outputRunning}>
                        <div style={s.outputSpinner} />
                        <span>
                          {language === "MYSQL"
                            ? "Running SQL on your database..."
                            : language === "BASH"
                              ? "Executing shell script..."
                              : "Running code..."}
                        </span>
                      </div>
                    )}
                    {!output && !runLoading && (
                      <div style={s.outputPlaceholder}>
                        Run your code to see output here
                      </div>
                    )}
                    {output && !runLoading && (
                      <div>
                        <div
                          style={{
                            ...s.statusChip,
                            background: statusBg(output.status),
                            color: statusColor(output.status),
                          }}
                        >
                          ● {output.status}
                          {output.executionTimeMs && (
                            <span
                              style={{
                                marginLeft: 10,
                                color: "#64748b",
                                fontWeight: 400,
                              }}
                            >
                              {output.executionTimeMs}ms
                            </span>
                          )}
                        </div>
                        <pre
                          style={
                            language === "MYSQL" ? s.sqlOutputPre : s.outputPre
                          }
                        >
                          {output.output || "(no output)"}
                        </pre>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── PROBLEMS / HISTORY TABS ───────────────────
  if (mode === "problems") {
    return (
      <div style={s.root}>
        {showMyFiles && <MyFilesDrawer />}
        {saveFileModal && <SaveFileModal />}
        <div style={s.header}>
          <div style={s.headerLeft}>
            <div style={s.logoWrap}>
              <span style={s.logoIcon}>{"</>"}</span>
              <span style={s.logoText}>CodeLab</span>
            </div>
            <span style={s.studentBadge}>Student</span>
            <span style={s.batchPill}>Batch: {batchId}</span>
          </div>
          <div style={s.navTabs}>
            {["problems", "history"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{ ...s.navTab, ...(tab === t ? s.navTabActive : {}) }}
              >
                {t === "problems" ? "📋 Problems" : "📜 History"}
              </button>
            ))}
          </div>
          <div style={s.headerRight}>
            <button style={s.myFilesBtn} onClick={handleOpenMyFiles}>
              📁 My Files
            </button>
            <button
              style={s.playgroundBtn}
              onClick={() => {
                setMode("playground");
                setCode(DEFAULT_CODE[language]);
                setOutput(null);
                setJudgeResult(null);
              }}
            >
              🎮 Playground
            </button>
          </div>
        </div>

        <div style={s.mainContent}>
          {tab === "problems" && (
            <>
              <div style={s.pageTitle}>
                <span>Assigned Problems</span>
                <span style={s.countBadge}>{problems.length} Problems</span>
              </div>
              {problems.length === 0 ? (
                <div style={s.emptyState}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                  <div style={{ color: "#64748b", fontSize: 15 }}>
                    No problems assigned yet.
                  </div>
                </div>
              ) : (
                <div style={s.problemGrid}>
                  {problems.map((p, i) => (
                    <div key={p.id} style={s.problemCard}>
                      <div style={s.problemCardHeader}>
                        <span style={s.problemIndex}>#{i + 1}</span>
                        <span
                          style={{
                            ...s.diffChip,
                            ...difficultyStyle(p.difficulty),
                          }}
                        >
                          {p.difficulty}
                        </span>
                      </div>
                      <div style={s.problemTitle}>{p.title}</div>
                      <div style={s.problemDesc}>
                        {p.description?.slice(0, 110)}
                        {p.description?.length > 110 ? "..." : ""}
                      </div>
                      <div style={s.problemFooter}>
                        <div style={s.problemMeta}>
                          <span style={s.marksChip}>🏆 {p.totalMarks} pts</span>
                          <span style={s.testsChip}>
                            🧪 {p.visibleTestCases?.length || 0} tests
                          </span>
                        </div>
                        <button
                          style={s.solveBtn}
                          onClick={() => openProblem(p.id)}
                          disabled={problemLoading}
                        >
                          {problemLoading ? "..." : "Solve →"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === "history" && (
            <>
              <div style={s.pageTitle}>
                <span>My Submissions</span>
                <span style={s.countBadge}>{history.length} runs</span>
              </div>
              {history.length === 0 ? (
                <div style={s.emptyState}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
                  <div style={{ color: "#64748b" }}>No submissions yet.</div>
                </div>
              ) : (
                <div style={s.historyList}>
                  {history.map((h) => (
                    <div
                      key={h.submissionId}
                      style={{
                        ...s.historyCard,
                        ...(activeHistoryItem === h.submissionId
                          ? s.historyCardOpen
                          : {}),
                      }}
                      onClick={() =>
                        setActiveHistoryItem(
                          activeHistoryItem === h.submissionId
                            ? null
                            : h.submissionId,
                        )
                      }
                    >
                      <div style={s.historyRow}>
                        <span style={s.historyLang}>{h.language}</span>
                        <span
                          style={{
                            ...s.historyStatus,
                            color: statusColor(h.status),
                            background: statusBg(h.status),
                          }}
                        >
                          {h.status}
                        </span>
                        <span style={s.historyTime}>
                          {new Date(h.timestamp).toLocaleString()}
                        </span>
                        <span style={s.historyMs}>{h.executionTimeMs}ms</span>
                        <span style={s.expandIcon}>
                          {activeHistoryItem === h.submissionId ? "▲" : "▼"}
                        </span>
                      </div>
                      {activeHistoryItem === h.submissionId && (
                        <div style={s.historyBody}>
                          <div style={s.historyOutputLabel}>Output</div>
                          <pre
                            style={
                              h.language === "MYSQL"
                                ? s.sqlOutputPre
                                : s.outputPre
                            }
                          >
                            {h.output || "(no output)"}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // ── EDITOR MODE ───────────────────────────────
  return (
    <div style={s.root}>
      {runLoading && <RunLoadingOverlay />}
      {showMyFiles && <MyFilesDrawer />}
      {saveFileModal && <SaveFileModal />}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <button
            style={s.modeBackBtn}
            onClick={() => {
              setMode("problems");
              setTab("problems");
            }}
          >
            ← Problems
          </button>
          <div style={s.logoWrap}>
            <span style={s.logoIcon}>{"</>"}</span>
            <span style={s.logoText}>CodeLab</span>
          </div>
          {selectedProblem && (
            <span
              style={{
                ...s.diffChip,
                ...difficultyStyle(selectedProblem.difficulty),
              }}
            >
              {selectedProblem.difficulty}
            </span>
          )}
        </div>
        <div style={s.headerRight}>
          <div style={s.langToggle}>
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => handleLanguageChange(l)}
                style={{
                  ...s.langBtn,
                  ...(language === l ? s.langBtnActive : {}),
                }}
              >
                {LANG_LABEL[l]}
              </button>
            ))}
          </div>
          <button style={s.myFilesBtn} onClick={handleOpenMyFiles}>
            📁 My Files
          </button>
          <button
            style={s.saveBtn}
            onClick={() => {
              setSaveFileName("");
              setSaveFileError("");
              setSaveFileModal(true);
            }}
          >
            💾 Save
          </button>
          <button
            style={s.runBtn}
            onClick={handleRunCode}
            disabled={runLoading}
          >
            {runLoading ? (
              <>
                <span style={s.btnSpinner} /> Running...
              </>
            ) : (
              "▶ Run"
            )}
          </button>
          {selectedProblem && (
            <button
              style={s.submitBtn}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={{ ...s.btnSpinner, borderTopColor: "#fff" }} />{" "}
                  Judging...
                </>
              ) : (
                "⚡ Submit"
              )}
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          height: "calc(100vh - 56px)",
          overflow: "hidden",
        }}
      >
        {/* Problem Panel */}
        <div style={s.problemPanel}>
          {selectedProblem ? (
            <div style={s.problemDetailWrap}>
              <h2 style={s.problemDetailTitle}>{selectedProblem.title}</h2>
              <div style={s.infoRow}>
                <span
                  style={{
                    ...s.diffChip,
                    ...difficultyStyle(selectedProblem.difficulty),
                  }}
                >
                  {selectedProblem.difficulty}
                </span>
                <span style={s.marksChip}>
                  🏆 {selectedProblem.totalMarks} pts
                </span>
              </div>
              <Section label="Description">
                <p style={s.descText}>{selectedProblem.description}</p>
              </Section>
              {selectedProblem.inputFormat && (
                <Section label="Input Format">
                  <p style={s.descText}>{selectedProblem.inputFormat}</p>
                </Section>
              )}
              {selectedProblem.outputFormat && (
                <Section label="Output Format">
                  <p style={s.descText}>{selectedProblem.outputFormat}</p>
                </Section>
              )}
              {selectedProblem.constraints && (
                <Section label="Constraints">
                  <div style={s.monoBlock}>{selectedProblem.constraints}</div>
                </Section>
              )}
              <div style={s.ioGrid}>
                {selectedProblem.sampleInput && (
                  <div style={s.ioBox}>
                    <div style={s.ioLabel}>Sample Input</div>
                    <pre style={s.ioContent}>{selectedProblem.sampleInput}</pre>
                  </div>
                )}
                {selectedProblem.sampleOutput && (
                  <div style={s.ioBox}>
                    <div style={s.ioLabel}>Sample Output</div>
                    <pre style={s.ioContent}>
                      {selectedProblem.sampleOutput}
                    </pre>
                  </div>
                )}
              </div>
              {selectedProblem.visibleTestCases?.filter((tc) => !tc.isHidden)
                .length > 0 && (
                <Section label="Sample Test Cases">
                  {selectedProblem.visibleTestCases
                    .filter((tc) => !tc.isHidden)
                    .map((tc, i) => (
                      <div key={tc.id} style={s.testCase}>
                        <div style={s.testCaseLabel}>Case {i + 1}</div>
                        {tc.input && (
                          <div style={s.testCaseRow}>
                            <span style={s.testKey}>Input</span>
                            <code style={s.testVal}>{tc.input}</code>
                          </div>
                        )}
                        <div style={s.testCaseRow}>
                          <span style={s.testKey}>Expected</span>
                          <code style={s.testVal}>{tc.expectedOutput}</code>
                        </div>
                      </div>
                    ))}
                </Section>
              )}
            </div>
          ) : (
            <div style={s.noProblem}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
              <p style={{ color: "#64748b", fontSize: 14 }}>
                Select a problem to start solving
              </p>
              <button
                style={s.solveBtn}
                onClick={() => {
                  setMode("problems");
                  setTab("problems");
                }}
              >
                Browse Problems
              </button>
            </div>
          )}
        </div>

        {/* Editor Panel */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {language === "MYSQL" && <MySQLToolbar />}
          {language === "BASH" && (
            <div
              style={{
                ...s.langBanner,
                background: "#f0fdf4",
                borderColor: "#86efac",
                color: "#166534",
              }}
            >
              🖥️ <strong>Bash Mode</strong> — Runs in a sandboxed shell
              environment.
            </div>
          )}

          <div style={s.editorAreaWrap}>
            <div style={s.lineNumbers}>
              {code.split("\n").map((_, i) => (
                <div key={i} style={s.lineNum}>
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              style={{
                ...s.codeTextarea,
                ...(language === "MYSQL" ? s.sqlTextarea : {}),
              }}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleTabKey}
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div style={s.outputPanel}>
            {!output && !judgeResult && !runLoading && (
              <div style={s.outputPlaceholder}>
                Click <strong>Run</strong> to test, or <strong>Submit</strong>{" "}
                to judge against all test cases.
              </div>
            )}
            {runLoading && (
              <div style={s.outputRunning}>
                <div style={s.outputSpinner} />
                <span>
                  {language === "MYSQL"
                    ? "Running SQL on your database..."
                    : language === "BASH"
                      ? "Running shell script..."
                      : "Running code..."}
                </span>
              </div>
            )}
            {output && !judgeResult && !runLoading && (
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      ...s.statusChip,
                      background: statusBg(output.status),
                      color: statusColor(output.status),
                    }}
                  >
                    ● {output.status}
                  </span>
                  {output.executionTimeMs && (
                    <span style={s.execTime}>{output.executionTimeMs}ms</span>
                  )}
                </div>
                <pre
                  style={language === "MYSQL" ? s.sqlOutputPre : s.outputPre}
                >
                  {output.output || "(no output)"}
                </pre>
              </div>
            )}
            {judgeResult && (
              <div>
                <div style={s.judgeHeader}>
                  <span
                    style={{
                      ...s.verdictBig,
                      color: verdictColor(judgeResult.overallVerdict),
                    }}
                  >
                    {judgeResult.overallVerdict === "ACCEPTED" ? "✓ " : "✗ "}
                    {judgeResult.overallVerdict}
                  </span>
                  <span style={s.scoreChip}>
                    {judgeResult.marksObtained}/{judgeResult.totalMarks} pts
                  </span>
                  <span style={s.execTime}>
                    {judgeResult.testCasesPassed}/{judgeResult.totalTestCases}{" "}
                    tests
                  </span>
                </div>
                <div style={s.judgeGrid}>
                  {judgeResult.judgeResults?.map((r, i) => (
                    <div
                      key={i}
                      style={{
                        ...s.judgeCard,
                        background: r.passed ? "#f0fdf4" : "#fff5f5",
                        borderColor: r.passed ? "#86efac" : "#fca5a5",
                      }}
                    >
                      <div style={s.judgeCardTop}>
                        <span style={{ fontWeight: 700, color: "#374151" }}>
                          Test {i + 1}
                        </span>
                        <span
                          style={{
                            color: r.passed ? "#16a34a" : "#dc2626",
                            fontWeight: 700,
                          }}
                        >
                          {r.verdict}
                        </span>
                      </div>
                      {!r.isHidden && r.actualOutput && (
                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 12,
                            color: "#64748b",
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>Output: </span>
                          <code style={s.testVal}>{r.actualOutput}</code>
                        </div>
                      )}
                      {r.isHidden && (
                        <div
                          style={{
                            color: "#9ca3af",
                            fontSize: 11,
                            marginTop: 4,
                          }}
                        >
                          Hidden test case
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#2563eb",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 6,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

const s = {
  root: {
    minHeight: "100vh",
    background: "#ffffff",
    color: "#1e293b",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    display: "flex",
    flexDirection: "column",
  },
  loadingScreen: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
  },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  runOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  runOverlayBox: {
    background: "#ffffff",
    borderRadius: 16,
    padding: "32px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    minWidth: 300,
  },
  runSpinner: {
    width: 40,
    height: 40,
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  runOverlayText: {
    fontSize: 15,
    fontWeight: 700,
    color: "#1e293b",
    fontFamily: "'JetBrains Mono', monospace",
  },
  runOverlaySubText: {
    fontSize: 12,
    color: "#64748b",
    fontFamily: "'JetBrains Mono', monospace",
  },
  outputRunning: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "20px 0",
    color: "#64748b",
    fontSize: 13,
  },
  outputSpinner: {
    width: 16,
    height: 16,
    border: "2px solid #e2e8f0",
    borderTop: "2px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    flexShrink: 0,
  },
  langBanner: {
    background: "#eff6ff",
    borderBottom: "1px solid #bfdbfe",
    color: "#1d4ed8",
    fontSize: 12,
    padding: "8px 16px",
    flexShrink: 0,
  },
  mysqlToolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#eff6ff",
    borderBottom: "1px solid #bfdbfe",
    color: "#1d4ed8",
    fontSize: 12,
    padding: "8px 16px",
    flexShrink: 0,
    gap: 8,
  },
  mysqlInfo: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  mysqlActions: { display: "flex", gap: 8, flexShrink: 0 },
  dbExplorerBtn: {
    background: "#dbeafe",
    color: "#1d4ed8",
    border: "1px solid #93c5fd",
    borderRadius: 6,
    padding: "4px 12px",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "inherit",
  },
  dbResetBtn: {
    background: "#fee2e2",
    color: "#dc2626",
    border: "1px solid #fca5a5",
    borderRadius: 6,
    padding: "4px 12px",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "inherit",
  },
  dbExplorerPanel: {
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    maxHeight: 200,
    overflowY: "auto",
    flexShrink: 0,
  },
  dbExplorerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 16px",
    fontSize: 12,
    fontWeight: 700,
    color: "#374151",
    borderBottom: "1px solid #e2e8f0",
    background: "#f1f5f9",
  },
  dbExplorerBody: { padding: "10px 16px" },
  refreshBtn: {
    background: "none",
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    padding: "2px 10px",
    cursor: "pointer",
    fontSize: 11,
    fontFamily: "inherit",
    color: "#64748b",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    height: 56,
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    flexShrink: 0,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  headerRight: { display: "flex", alignItems: "center", gap: 8 },
  logoWrap: { display: "flex", alignItems: "center", gap: 6 },
  logoIcon: { fontSize: 20, color: "#2563eb", fontWeight: 900 },
  logoText: {
    fontSize: 15,
    fontWeight: 800,
    color: "#1e293b",
    letterSpacing: "0.02em",
  },
  studentBadge: {
    fontSize: 11,
    background: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
    borderRadius: 20,
    padding: "2px 10px",
    fontWeight: 700,
  },
  playgroundBadge: {
    fontSize: 11,
    background: "#fdf4ff",
    color: "#9333ea",
    border: "1px solid #e9d5ff",
    borderRadius: 20,
    padding: "2px 10px",
    fontWeight: 700,
  },
  batchPill: {
    fontSize: 11,
    background: "#f1f5f9",
    color: "#64748b",
    borderRadius: 20,
    padding: "2px 10px",
    fontWeight: 600,
  },
  modeBackBtn: {
    background: "#f1f5f9",
    border: "1px solid #e2e8f0",
    color: "#475569",
    borderRadius: 6,
    padding: "5px 12px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "inherit",
  },
  navTabs: { display: "flex", gap: 2 },
  navTab: {
    background: "none",
    border: "none",
    color: "#64748b",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    fontWeight: 500,
  },
  navTabActive: { background: "#eff6ff", color: "#2563eb", fontWeight: 700 },
  playgroundBtn: {
    background: "#fdf4ff",
    color: "#9333ea",
    border: "1px solid #e9d5ff",
    borderRadius: 6,
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "inherit",
  },
  myFilesBtn: {
    background: "#f0fdf4",
    color: "#16a34a",
    border: "1px solid #bbf7d0",
    borderRadius: 6,
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "inherit",
  },
  saveBtn: {
    background: "#fefce8",
    color: "#ca8a04",
    border: "1px solid #fde68a",
    borderRadius: 6,
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "inherit",
  },
  langToggle: { display: "flex", gap: 4 },
  langBtn: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#64748b",
    padding: "5px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "inherit",
    fontWeight: 600,
  },
  langBtnActive: {
    background: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
  },
  runBtn: {
    background: "#f1f5f9",
    color: "#1e293b",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    padding: "6px 16px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  runBtnPrimary: {
    background: "#1e293b",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "7px 18px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  submitBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "6px 18px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  btnSpinner: {
    display: "inline-block",
    width: 12,
    height: 12,
    border: "2px solid rgba(0,0,0,0.15)",
    borderTop: "2px solid #1e293b",
    borderRadius: "50%",
  },
  mainContent: {
    flex: 1,
    padding: "28px 36px",
    maxWidth: 1200,
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 24,
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "#0f172a",
  },
  countBadge: {
    background: "#f1f5f9",
    color: "#64748b",
    borderRadius: 20,
    padding: "3px 12px",
    fontSize: 12,
    fontWeight: 600,
  },
  emptyState: { textAlign: "center", padding: "80px 0" },
  problemGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 16,
  },
  problemCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  problemCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  problemIndex: { color: "#94a3b8", fontSize: 12, fontWeight: 600 },
  diffChip: {
    fontSize: 11,
    borderRadius: 20,
    padding: "2px 10px",
    fontWeight: 700,
    letterSpacing: "0.04em",
  },
  problemTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1.4,
  },
  problemDesc: { fontSize: 12, color: "#64748b", lineHeight: 1.6 },
  problemFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  problemMeta: { display: "flex", gap: 8 },
  marksChip: {
    fontSize: 11,
    background: "#fefce8",
    color: "#ca8a04",
    border: "1px solid #fde68a",
    borderRadius: 20,
    padding: "2px 8px",
    fontWeight: 700,
  },
  testsChip: {
    fontSize: 11,
    background: "#f0f9ff",
    color: "#0284c7",
    border: "1px solid #bae6fd",
    borderRadius: 20,
    padding: "2px 8px",
    fontWeight: 600,
  },
  solveBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "7px 16px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 12,
    fontFamily: "inherit",
  },
  historyList: { display: "flex", flexDirection: "column", gap: 8 },
  historyCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "12px 16px",
    cursor: "pointer",
  },
  historyCardOpen: { borderColor: "#2563eb", background: "#f8fafc" },
  historyRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  historyLang: {
    background: "#f0f9ff",
    color: "#0369a1",
    borderRadius: 6,
    padding: "2px 8px",
    fontSize: 11,
    fontWeight: 700,
  },
  historyStatus: {
    borderRadius: 20,
    padding: "2px 10px",
    fontSize: 11,
    fontWeight: 700,
  },
  historyTime: { color: "#94a3b8", fontSize: 12, marginLeft: "auto" },
  historyMs: { color: "#94a3b8", fontSize: 12 },
  expandIcon: { color: "#94a3b8", fontSize: 11 },
  historyBody: {
    marginTop: 12,
    borderTop: "1px solid #f1f5f9",
    paddingTop: 10,
  },
  historyOutputLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#2563eb",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  editorLayout: { display: "flex", overflow: "hidden" },
  problemPanel: {
    width: 380,
    flexShrink: 0,
    borderRight: "1px solid #e2e8f0",
    overflowY: "auto",
    background: "#fafafa",
  },
  problemDetailWrap: { padding: "20px 20px 32px" },
  problemDetailTitle: {
    fontSize: 17,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 10px",
    lineHeight: 1.4,
  },
  infoRow: { display: "flex", gap: 8, alignItems: "center", marginBottom: 16 },
  descText: { fontSize: 13, color: "#475569", lineHeight: 1.7, margin: 0 },
  monoBlock: {
    background: "#f1f5f9",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    padding: "8px 12px",
    fontSize: 12,
    color: "#2563eb",
    fontFamily: "inherit",
    whiteSpace: "pre-wrap",
  },
  ioGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 16,
  },
  ioBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: 10,
  },
  ioLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 6,
    letterSpacing: "0.06em",
  },
  ioContent: {
    margin: 0,
    fontSize: 12,
    color: "#0f172a",
    fontFamily: "inherit",
    whiteSpace: "pre-wrap",
  },
  testCase: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "10px 12px",
    marginBottom: 8,
  },
  testCaseLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: 700,
    marginBottom: 6,
  },
  testCaseRow: {
    display: "flex",
    gap: 8,
    alignItems: "flex-start",
    marginBottom: 4,
  },
  testKey: {
    color: "#64748b",
    fontSize: 11,
    minWidth: 60,
    flexShrink: 0,
    fontWeight: 600,
  },
  testVal: {
    color: "#2563eb",
    fontSize: 11,
    background: "#eff6ff",
    padding: "1px 5px",
    borderRadius: 4,
    wordBreak: "break-all",
    fontFamily: "inherit",
  },
  noProblem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: 12,
    padding: 40,
  },
  editorAreaWrap: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
    background: "#1e293b",
    minHeight: 0,
  },
  lineNumbers: {
    padding: "16px 0",
    background: "#1e293b",
    borderRight: "1px solid #334155",
    minWidth: 44,
    textAlign: "right",
    paddingRight: 12,
    paddingLeft: 8,
    userSelect: "none",
    overflowY: "hidden",
    flexShrink: 0,
  },
  lineNum: { fontSize: 13, lineHeight: "21.5px", color: "#475569" },
  codeTextarea: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#e2e8f0",
    fontSize: 13,
    lineHeight: "21.5px",
    padding: "16px",
    resize: "none",
    fontFamily: "inherit",
    overflowY: "auto",
    tabSize: 4,
  },
  sqlTextarea: { color: "#7dd3fc" },
  outputPanel: {
    height: 220,
    borderTop: "1px solid #e2e8f0",
    background: "#ffffff",
    overflowY: "auto",
    padding: "14px 18px",
    flexShrink: 0,
  },
  outputPlaceholder: {
    color: "#94a3b8",
    fontSize: 13,
    padding: "20px 0",
    textAlign: "center",
  },
  statusChip: {
    display: "inline-block",
    borderRadius: 20,
    padding: "3px 12px",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
  },
  execTime: { color: "#94a3b8", fontSize: 12 },
  outputPre: {
    margin: 0,
    fontSize: 13,
    color: "#1e293b",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
    fontFamily: "inherit",
  },
  sqlOutputPre: {
    margin: 0,
    fontSize: 12,
    color: "#1e293b",
    lineHeight: 1.6,
    whiteSpace: "pre",
    fontFamily: "'Courier New', monospace",
    overflowX: "auto",
  },
  judgeHeader: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  verdictBig: { fontSize: 16, fontWeight: 900 },
  scoreChip: {
    background: "#fefce8",
    color: "#ca8a04",
    border: "1px solid #fde68a",
    borderRadius: 20,
    padding: "3px 12px",
    fontSize: 12,
    fontWeight: 700,
  },
  judgeGrid: { display: "flex", flexWrap: "wrap", gap: 8 },
  judgeCard: {
    border: "1px solid",
    borderRadius: 8,
    padding: "8px 12px",
    minWidth: 130,
    fontSize: 12,
  },
  judgeCardTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  bottomPanel: {
    height: 220,
    borderTop: "1px solid #e2e8f0",
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  bottomTabs: {
    display: "flex",
    borderBottom: "1px solid #e2e8f0",
    flexShrink: 0,
  },
  bottomTab: {
    padding: "8px 16px",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "inherit",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#64748b",
    borderBottom: "2px solid transparent",
  },
  bottomTabActive: { color: "#2563eb", borderBottom: "2px solid #2563eb" },
  bottomContent: { flex: 1, padding: "12px 16px", overflowY: "auto" },
  customInputArea: {
    width: "100%",
    height: "100%",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    color: "#1e293b",
    fontSize: 13,
    fontFamily: "inherit",
    padding: 10,
    resize: "none",
    outline: "none",
    boxSizing: "border-box",
  },
  drawerOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 8888,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "flex-end",
  },
  drawerPanel: {
    width: 360,
    background: "#ffffff",
    boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #e2e8f0",
    background: "#f8fafc",
    flexShrink: 0,
  },
  drawerTitle: {
    fontSize: 14,
    fontWeight: 800,
    color: "#0f172a",
  },
  drawerCloseBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    color: "#94a3b8",
    padding: "2px 6px",
    borderRadius: 4,
    fontFamily: "inherit",
  },
  drawerBody: {
    flex: 1,
    overflowY: "auto",
    padding: "12px 0",
  },
  drawerLoading: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "32px 20px",
    justifyContent: "center",
  },
  drawerEmpty: {
    textAlign: "center",
    padding: "48px 20px",
  },
  drawerFooter: {
    padding: "12px 20px",
    borderTop: "1px solid #e2e8f0",
    flexShrink: 0,
  },
  drawerRefreshBtn: {
    background: "#f1f5f9",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    padding: "6px 16px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "inherit",
    color: "#475569",
    width: "100%",
  },
  fileList: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: "0 8px",
  },
  fileCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #f1f5f9",
    cursor: "pointer",
    background: "#ffffff",
    transition: "background 0.1s",
  },
  fileCardLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
  },
  fileIcon: { fontSize: 20, flexShrink: 0 },
  fileName: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0f172a",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 200,
  },
  fileMeta: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    marginTop: 2,
  },
  fileLangBadge: {
    fontSize: 10,
    background: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
    borderRadius: 10,
    padding: "1px 7px",
    fontWeight: 700,
  },
  fileDate: { fontSize: 10, color: "#94a3b8" },
  fileDeleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    padding: "4px 6px",
    borderRadius: 4,
    flexShrink: 0,
    opacity: 0.6,
  },
  saveModalBox: {
    width: 360,
    background: "#ffffff",
    borderRadius: 14,
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    alignSelf: "center",
    margin: "auto",
    overflow: "hidden",
  },
  saveLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 6,
  },
  saveInput: {
    width: "100%",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 13,
    fontFamily: "inherit",
    color: "#1e293b",
    outline: "none",
    boxSizing: "border-box",
    background: "#f8fafc",
  },
  saveError: {
    color: "#dc2626",
    fontSize: 12,
    marginTop: 6,
  },
  saveMetaRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveModalFooter: {
    display: "flex",
    gap: 8,
    padding: "12px 20px 16px",
    justifyContent: "flex-end",
  },
  saveCancelBtn: {
    background: "#f1f5f9",
    border: "1px solid #e2e8f0",
    borderRadius: 7,
    padding: "7px 18px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "inherit",
    color: "#475569",
  },
  saveConfirmBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    padding: "7px 18px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "inherit",
  },
};
