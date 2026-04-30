// import { useEffect, useRef, useState } from "react";
// import API, {
//   deleteCodeFile,
//   getCodeFileById,
//   getMyCodeFiles,
//   getMyCodeSubmissions,
//   getMySQLState,
//   getStudentProblemById,
//   getStudentProblems,
//   resetMySQLDatabase,
//   runCode,
//   saveCodeFile,
//   submitCodeForJudge,
// } from "../services/assessmentService"; // ← for profile endpoint only
// import { getStudentClassroom } from "../services/batchService";

// // ── Code File API helpers — now wired to assessmentService correctly ──
// const codeFilesAPI = {
//   save: (data) => saveCodeFile(data),
//   getAll: (_studentEmail, batchId) => getMyCodeFiles(batchId),
//   getById: (id) => getCodeFileById(id),
//   delete: (id) => deleteCodeFile(id),
//   // Profile: assessmentService axios instance re-used
//   getProfile: () =>
//     API.default
//       ? API.default.get?.("/students/profile") // fallback
//       : fetch(
//           (import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api") +
//             "/students/profile",
//           {
//             headers: {
//               Authorization: `Bearer ${
//                 localStorage.getItem("lms_token") ||
//                 localStorage.getItem("token") ||
//                 localStorage.getItem("accessToken") ||
//                 localStorage.getItem("jwt") ||
//                 ""
//               }`,
//             },
//           },
//         ).then((r) => r.json().then((d) => ({ data: d }))),
// };

// const LANGUAGES = ["JAVA", "PYTHON", "JAVASCRIPT", "MYSQL", "BASH"];

// const LANG_LABEL = {
//   JAVA: "☕ Java",
//   PYTHON: "🐍 Python",
//   JAVASCRIPT: "🟨 JS",
//   MYSQL: "🐬 MySQL",
//   BASH: "🖥️ Bash",
// };

// const DEFAULT_CODE = {
//   JAVA: `public class Main {
//     public static void main(String[] args) {
//         System.out.println("Hello, World!");
//     }
// }`,

//   PYTHON: `# Write your solution here
// print("Hello, World!")`,

//   JAVASCRIPT: `// Write your solution here
// process.stdin.resume();
// process.stdin.setEncoding('utf8');
// let input = '';
// process.stdin.on('data', d => input += d);
// process.stdin.on('end', () => {
//     console.log("Hello, World!");
// });`,

//   MYSQL: `-- Your database persists across runs!
// -- Step 1: Create your table (run once)
// CREATE TABLE IF NOT EXISTS students (
//     id     INT PRIMARY KEY AUTO_INCREMENT,
//     name   VARCHAR(100) NOT NULL,
//     age    INT,
//     course VARCHAR(100)
// );

// -- Step 2: Insert data
// INSERT INTO students (name, age, course) VALUES
//     ('Alice', 20, 'Java'),
//     ('Bob',   22, 'Python'),
//     ('Carol', 21, 'MySQL');

// -- Step 3: Query
// SELECT * FROM students;`,

//   BASH: `#!/bin/bash
// echo "=== System Info ==="
// uname -a

// echo ""
// echo "=== Directory Listing ==="
// ls -la

// echo ""
// echo "=== Simple Loop ==="
// for i in 1 2 3 4 5; do
//   echo "Item: $i"
// done

// echo ""
// echo "=== String Operations ==="
// name="CodeLab"
// echo "Name: $name"
// echo "Length: \${#name}"

// echo ""
// echo "=== Math ==="
// echo "5 + 3 = $((5 + 3))"
// echo "10 * 4 = $((10 * 4))"`,
// };

// const NO_INPUT_LANGS = ["MYSQL", "BASH"];

// export default function StudentCompilerPage() {
//   const [mode, setMode] = useState("problems");
//   const [tab, setTab] = useState("problems");
//   const [problems, setProblems] = useState([]);
//   const [selectedProblem, setSelectedProblem] = useState(null);
//   const [language, setLanguage] = useState("PYTHON");
//   const [code, setCode] = useState(DEFAULT_CODE["PYTHON"]);
//   const [output, setOutput] = useState(null);
//   const [judgeResult, setJudgeResult] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [runLoading, setRunLoading] = useState(false);
//   const [problemLoading, setProblemLoading] = useState(false);
//   const [activeHistoryItem, setActiveHistoryItem] = useState(null);
//   const [batchId, setBatchId] = useState(null);
//   const [batchLoading, setBatchLoading] = useState(true);
//   const [batchError, setBatchError] = useState(false);
//   const [customInput, setCustomInput] = useState("");
//   const [showCustomInput, setShowCustomInput] = useState(false);
//   // ── MySQL persistent DB state ──────────────────
//   const [mysqlTables, setMysqlTables] = useState(null);
//   const [mysqlStateLoading, setMysqlStateLoading] = useState(false);
//   const [showDbExplorer, setShowDbExplorer] = useState(false);

//   // ── My Files state ────────────────────────
//   const [showMyFiles, setShowMyFiles] = useState(false);
//   const [myFiles, setMyFiles] = useState([]);
//   const [myFilesLoading, setMyFilesLoading] = useState(false);
//   const [studentEmail, setStudentEmail] = useState(null);
//   const [saveFileModal, setSaveFileModal] = useState(false);
//   const [saveFileName, setSaveFileName] = useState("");
//   const [saveFileLoading, setSaveFileLoading] = useState(false);
//   const [saveFileError, setSaveFileError] = useState("");

//   const textareaRef = useRef(null);

//   useEffect(() => {
//     const initBatch = async () => {
//       setBatchLoading(true);
//       try {
//         const res = await getStudentClassroom();
//         const classroom = res?.data || res;
//         const resolvedId = classroom?.batchId || classroom?.id || null;
//         if (resolvedId) setBatchId(resolvedId);
//         else setBatchError(true);
//       } catch {
//         setBatchError(true);
//       } finally {
//         setBatchLoading(false);
//       }
//     };
//     initBatch();
//   }, []);

//   // ── fetch student email from profile endpoint ──
//   useEffect(() => {
//     const fetchEmail = async () => {
//       try {
//         const res = await codeFilesAPI.getProfile();
//         setStudentEmail(res?.data?.email || null);
//       } catch {
//         // silently ignore — email stays null
//       }
//     };
//     fetchEmail();
//   }, []);

//   useEffect(() => {
//     if (batchId) fetchProblems();
//   }, [batchId]);
//   useEffect(() => {
//     if (tab === "history" && batchId) fetchHistory();
//   }, [tab, batchId]);

//   const fetchProblems = async () => {
//     try {
//       const res = await getStudentProblems(batchId);
//       setProblems(res.data || []);
//     } catch {
//       setProblems([]);
//     }
//   };

//   const fetchHistory = async () => {
//     try {
//       const res = await getMyCodeSubmissions(batchId);
//       setHistory(res.data || []);
//     } catch {
//       setHistory([]);
//     }
//   };

//   // ── MySQL: fetch DB explorer state ────────────
//   const fetchMySQLState = async () => {
//     setMysqlStateLoading(true);
//     try {
//       const res = await getMySQLState();
//       setMysqlTables(res.data);
//     } catch {
//       setMysqlTables({
//         output: "Could not fetch database state.",
//         status: "RUNTIME_ERROR",
//       });
//     } finally {
//       setMysqlStateLoading(false);
//     }
//   };

//   // ── MySQL: reset student DB ───────────────────
//   const handleMySQLReset = async () => {
//     if (
//       !window.confirm(
//         "⚠️ This will DROP your entire database and all tables.\n\nAre you sure?",
//       )
//     )
//       return;
//     setRunLoading(true);
//     setOutput(null);
//     try {
//       const res = await resetMySQLDatabase();
//       setOutput(res.data);
//       setMysqlTables(null);
//       setShowDbExplorer(false);
//     } catch (e) {
//       setOutput({
//         output: e.response?.data?.message || "Reset failed.",
//         status: "RUNTIME_ERROR",
//       });
//     } finally {
//       setRunLoading(false);
//     }
//   };

//   // ── My Files handlers ─────────────────────
//   const fetchMyFiles = async () => {
//     if (!batchId) return;
//     setMyFilesLoading(true);
//     try {
//       // getMyCodeFiles(batchId) — studentEmail not needed, JWT handles identity
//       const res = await codeFilesAPI.getAll(studentEmail, batchId);
//       setMyFiles(res.data || []);
//     } catch {
//       setMyFiles([]);
//     } finally {
//       setMyFilesLoading(false);
//     }
//   };

//   const handleOpenMyFiles = () => {
//     setShowMyFiles(true);
//     fetchMyFiles();
//   };

//   const handleLoadFile = async (file) => {
//     try {
//       const res = await codeFilesAPI.getById(file.id);
//       const f = res.data;
//       const lang = (f.language || file.language || language).toUpperCase();
//       setLanguage(lang);
//       setCode(f.code || f.content || "");
//       setOutput(null);
//       setJudgeResult(null);
//       setShowMyFiles(false);
//     } catch {
//       alert("Could not load file.");
//     }
//   };

//   const handleDeleteFile = async (fileId, e) => {
//     e.stopPropagation();
//     if (!window.confirm("Delete this file?")) return;
//     try {
//       await codeFilesAPI.delete(fileId);
//       setMyFiles((prev) => prev.filter((f) => f.id !== fileId));
//     } catch {
//       alert("Could not delete file.");
//     }
//   };

//   const handleSaveFile = async () => {
//     const trimmed = saveFileName.trim();
//     if (!trimmed) {
//       setSaveFileError("File name is required.");
//       return;
//     }
//     setSaveFileLoading(true);
//     setSaveFileError("");
//     try {
//       // saveCodeFile from assessmentService — JWT carries student identity
//       // batchId is sent so the backend can associate the file
//       await codeFilesAPI.save({
//         fileName: trimmed,
//         language,
//         code,
//         batchId,
//         // studentEmail is optional — only include if your backend needs it
//         ...(studentEmail ? { studentEmail } : {}),
//       });
//       setSaveFileModal(false);
//       setSaveFileName("");
//     } catch (e) {
//       setSaveFileError(
//         e.response?.data?.message || "Save failed. Please try again.",
//       );
//     } finally {
//       setSaveFileLoading(false);
//     }
//   };

//   const openProblem = async (problemId) => {
//     setProblemLoading(true);
//     try {
//       const res = await getStudentProblemById(problemId);
//       setSelectedProblem(res.data);
//       setCode(DEFAULT_CODE[language]);
//       setOutput(null);
//       setJudgeResult(null);
//       setMode("editor");
//       setTab("editor");
//     } catch {
//       alert("Could not load problem.");
//     } finally {
//       setProblemLoading(false);
//     }
//   };

//   const handleLanguageChange = (lang) => {
//     setLanguage(lang);
//     setCode(DEFAULT_CODE[lang]);
//     setOutput(null);
//     setJudgeResult(null);
//     if (NO_INPUT_LANGS.includes(lang)) setShowCustomInput(false);
//     if (lang !== "MYSQL") {
//       setShowDbExplorer(false);
//       setMysqlTables(null);
//     }
//   };

//   const handleRunCode = async () => {
//     setRunLoading(true);
//     setOutput(null);
//     setJudgeResult(null);
//     try {
//       let stdinInput = "";
//       if (!NO_INPUT_LANGS.includes(language)) {
//         stdinInput =
//           mode === "playground"
//             ? customInput
//             : selectedProblem?.sampleInput || "";
//       }
//       const res = await runCode(batchId, language, code, stdinInput);
//       setOutput(res.data);
//     } catch (e) {
//       setOutput({
//         output: e.response?.data?.message || "Run failed.",
//         status: "RUNTIME_ERROR",
//       });
//     } finally {
//       setRunLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!selectedProblem) return;
//     setLoading(true);
//     setJudgeResult(null);
//     setOutput(null);
//     try {
//       const res = await submitCodeForJudge(
//         selectedProblem.id,
//         batchId,
//         language,
//         code,
//       );
//       setJudgeResult(res.data);
//     } catch {
//       setJudgeResult({
//         overallVerdict: "ERROR",
//         marksObtained: 0,
//         totalMarks: 0,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTabKey = (e) => {
//     if (e.key === "Tab") {
//       e.preventDefault();
//       const ta = textareaRef.current;
//       const start = ta.selectionStart;
//       const end = ta.selectionEnd;
//       const newCode = code.substring(0, start) + "    " + code.substring(end);
//       setCode(newCode);
//       setTimeout(() => {
//         ta.selectionStart = ta.selectionEnd = start + 4;
//       }, 0);
//     }
//   };

//   const verdictColor = (v) =>
//     v === "ACCEPTED" ? "#16a34a" : v === "PARTIAL" ? "#d97706" : "#dc2626";
//   const difficultyStyle = (d) =>
//     d === "EASY"
//       ? { color: "#16a34a", background: "#dcfce7", border: "1px solid #bbf7d0" }
//       : d === "MEDIUM"
//         ? {
//             color: "#d97706",
//             background: "#fef3c7",
//             border: "1px solid #fde68a",
//           }
//         : {
//             color: "#dc2626",
//             background: "#fee2e2",
//             border: "1px solid #fecaca",
//           };
//   const statusColor = (s) =>
//     s === "SUCCESS" ? "#16a34a" : s === "COMPILE_ERROR" ? "#d97706" : "#dc2626";
//   const statusBg = (s) =>
//     s === "SUCCESS" ? "#dcfce7" : s === "COMPILE_ERROR" ? "#fef3c7" : "#fee2e2";

//   // ── MySQL toolbar + DB explorer ──
//   const MySQLToolbar = () => (
//     <>
//       <div style={s.mysqlToolbar}>
//         <div style={s.mysqlInfo}>
//           🐬 <strong>MySQL</strong> — Your database persists across runs. CREATE
//           once, INSERT/SELECT in separate runs.
//         </div>
//         <div style={s.mysqlActions}>
//           <button
//             style={s.dbExplorerBtn}
//             onClick={() => {
//               const next = !showDbExplorer;
//               setShowDbExplorer(next);
//               if (next) fetchMySQLState();
//             }}
//           >
//             🗄️ {showDbExplorer ? "Hide Tables" : "Show Tables"}
//           </button>
//           <button style={s.dbResetBtn} onClick={handleMySQLReset}>
//             🗑️ Reset DB
//           </button>
//         </div>
//       </div>
//       {showDbExplorer && (
//         <div style={s.dbExplorerPanel}>
//           <div style={s.dbExplorerHeader}>
//             🗄️ Your Tables
//             <button
//               style={s.refreshBtn}
//               onClick={fetchMySQLState}
//               disabled={mysqlStateLoading}
//             >
//               {mysqlStateLoading ? "..." : "↻ Refresh"}
//             </button>
//           </div>
//           <div style={s.dbExplorerBody}>
//             {mysqlStateLoading ? (
//               <span style={{ color: "#64748b", fontSize: 12 }}>Loading...</span>
//             ) : mysqlTables ? (
//               <pre style={s.sqlOutputPre}>
//                 {mysqlTables.output || "No tables found."}
//               </pre>
//             ) : (
//               <span style={{ color: "#94a3b8", fontSize: 12 }}>
//                 Click Refresh to see your tables.
//               </span>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );

//   // ── My Files Drawer ───────────────────────
//   const MyFilesDrawer = () => (
//     <div style={s.drawerOverlay} onClick={() => setShowMyFiles(false)}>
//       <div style={s.drawerPanel} onClick={(e) => e.stopPropagation()}>
//         <div style={s.drawerHeader}>
//           <span style={s.drawerTitle}>📁 My Saved Files</span>
//           <button
//             style={s.drawerCloseBtn}
//             onClick={() => setShowMyFiles(false)}
//           >
//             ✕
//           </button>
//         </div>
//         <div style={s.drawerBody}>
//           {myFilesLoading ? (
//             <div style={s.drawerLoading}>
//               <div style={s.outputSpinner} />
//               <span style={{ color: "#64748b", fontSize: 13 }}>
//                 Loading files...
//               </span>
//             </div>
//           ) : myFiles.length === 0 ? (
//             <div style={s.drawerEmpty}>
//               <div style={{ fontSize: 36, marginBottom: 8 }}>📂</div>
//               <div style={{ color: "#94a3b8", fontSize: 13 }}>
//                 No saved files yet.
//               </div>
//               <div style={{ color: "#cbd5e1", fontSize: 12, marginTop: 4 }}>
//                 Use the Save button in the editor to save your code.
//               </div>
//             </div>
//           ) : (
//             <div style={s.fileList}>
//               {myFiles.map((file) => (
//                 <div
//                   key={file.id}
//                   style={s.fileCard}
//                   onClick={() => handleLoadFile(file)}
//                 >
//                   <div style={s.fileCardLeft}>
//                     <span style={s.fileIcon}>
//                       {file.language === "JAVA"
//                         ? "☕"
//                         : file.language === "PYTHON"
//                           ? "🐍"
//                           : file.language === "JAVASCRIPT"
//                             ? "🟨"
//                             : file.language === "MYSQL"
//                               ? "🐬"
//                               : file.language === "BASH"
//                                 ? "🖥️"
//                                 : "📄"}
//                     </span>
//                     <div>
//                       <div style={s.fileName}>{file.fileName || file.name}</div>
//                       <div style={s.fileMeta}>
//                         <span style={s.fileLangBadge}>{file.language}</span>
//                         {file.updatedAt && (
//                           <span style={s.fileDate}>
//                             {new Date(file.updatedAt).toLocaleDateString()}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <button
//                     style={s.fileDeleteBtn}
//                     onClick={(e) => handleDeleteFile(file.id, e)}
//                     title="Delete file"
//                   >
//                     🗑️
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <div style={s.drawerFooter}>
//           <button
//             style={s.drawerRefreshBtn}
//             onClick={fetchMyFiles}
//             disabled={myFilesLoading}
//           >
//             ↻ Refresh
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // ── Save File Modal ───────────────────────
//   const SaveFileModal = () => (
//     <div
//       style={s.drawerOverlay}
//       onClick={() => {
//         setSaveFileModal(false);
//         setSaveFileName("");
//         setSaveFileError("");
//       }}
//     >
//       <div style={s.saveModalBox} onClick={(e) => e.stopPropagation()}>
//         <div style={s.drawerHeader}>
//           <span style={s.drawerTitle}>💾 Save File</span>
//           <button
//             style={s.drawerCloseBtn}
//             onClick={() => {
//               setSaveFileModal(false);
//               setSaveFileName("");
//               setSaveFileError("");
//             }}
//           >
//             ✕
//           </button>
//         </div>
//         <div style={{ padding: "20px 20px 16px" }}>
//           <div style={s.saveLabel}>File Name</div>
//           <input
//             style={s.saveInput}
//             value={saveFileName}
//             onChange={(e) => {
//               setSaveFileName(e.target.value);
//               setSaveFileError("");
//             }}
//             placeholder="e.g. bubble_sort.py"
//             autoFocus
//             onKeyDown={(e) => {
//               if (e.key === "Enter") handleSaveFile();
//             }}
//           />
//           {saveFileError && <div style={s.saveError}>{saveFileError}</div>}
//           <div style={s.saveMetaRow}>
//             <span style={s.fileLangBadge}>{LANG_LABEL[language]}</span>
//             <span style={{ color: "#94a3b8", fontSize: 11 }}>
//               {code.split("\n").length} lines
//             </span>
//           </div>
//         </div>
//         <div style={s.saveModalFooter}>
//           <button
//             style={s.saveCancelBtn}
//             onClick={() => {
//               setSaveFileModal(false);
//               setSaveFileName("");
//               setSaveFileError("");
//             }}
//           >
//             Cancel
//           </button>
//           <button
//             style={s.saveConfirmBtn}
//             onClick={handleSaveFile}
//             disabled={saveFileLoading}
//           >
//             {saveFileLoading ? "Saving..." : "💾 Save"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // ── Loading screen ────────────────────────────
//   if (batchLoading) {
//     return (
//       <div style={s.loadingScreen}>
//         <div style={s.spinner} />
//         <p style={{ color: "#64748b", fontSize: 14, marginTop: 12 }}>
//           Loading your workspace...
//         </p>
//       </div>
//     );
//   }

//   if (batchError || !batchId) {
//     return (
//       <div style={s.loadingScreen}>
//         <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
//         <p style={{ color: "#dc2626", fontSize: 14 }}>
//           Could not load your batch. Please contact your trainer.
//         </p>
//       </div>
//     );
//   }

//   const RunLoadingOverlay = () => (
//     <div style={s.runOverlay}>
//       <div style={s.runOverlayBox}>
//         <div style={s.runSpinner} />
//         <div style={s.runOverlayText}>
//           {language === "MYSQL"
//             ? "⚙️ Running SQL on your database..."
//             : language === "BASH"
//               ? "🖥️ Executing shell script..."
//               : "▶ Running code..."}
//         </div>
//         <div style={s.runOverlaySubText}>
//           {language === "MYSQL"
//             ? "Your data will persist after this run"
//             : language === "BASH"
//               ? "Running in sandbox environment"
//               : "Please wait..."}
//         </div>
//       </div>
//     </div>
//   );

//   // ── PLAYGROUND MODE ───────────────────────────
//   if (mode === "playground") {
//     return (
//       <div style={s.root}>
//         {runLoading && <RunLoadingOverlay />}
//         {showMyFiles && <MyFilesDrawer />}
//         {saveFileModal && <SaveFileModal />}
//         <div style={s.header}>
//           <div style={s.headerLeft}>
//             <button style={s.modeBackBtn} onClick={() => setMode("problems")}>
//               ← Back
//             </button>
//             <div style={s.logoWrap}>
//               <span style={s.logoIcon}>{"</>"}</span>
//               <span style={s.logoText}>CodeLab</span>
//             </div>
//             <span style={s.playgroundBadge}>🎮 Playground</span>
//           </div>
//           <div style={s.headerRight}>
//             <div style={s.langToggle}>
//               {LANGUAGES.map((l) => (
//                 <button
//                   key={l}
//                   onClick={() => handleLanguageChange(l)}
//                   style={{
//                     ...s.langBtn,
//                     ...(language === l ? s.langBtnActive : {}),
//                   }}
//                 >
//                   {LANG_LABEL[l]}
//                 </button>
//               ))}
//             </div>
//             <button style={s.myFilesBtn} onClick={handleOpenMyFiles}>
//               📁 My Files
//             </button>
//             <button
//               style={s.saveBtn}
//               onClick={() => {
//                 setSaveFileName("");
//                 setSaveFileError("");
//                 setSaveFileModal(true);
//               }}
//             >
//               💾 Save
//             </button>
//             <button
//               style={s.runBtnPrimary}
//               onClick={handleRunCode}
//               disabled={runLoading}
//             >
//               {runLoading ? (
//                 <>
//                   <span style={s.btnSpinner} /> Running...
//                 </>
//               ) : (
//                 <>
//                   <span style={{ marginRight: 6 }}>▶</span> Run Code
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         <div style={{ ...s.editorLayout, height: "calc(100vh - 56px)" }}>
//           <div
//             style={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               overflow: "hidden",
//             }}
//           >
//             {language === "MYSQL" && <MySQLToolbar />}
//             {language === "BASH" && (
//               <div
//                 style={{
//                   ...s.langBanner,
//                   background: "#f0fdf4",
//                   borderColor: "#86efac",
//                   color: "#166534",
//                 }}
//               >
//                 🖥️ <strong>Bash Mode</strong> — Your script runs in a sandboxed
//                 shell environment.
//               </div>
//             )}

//             <div style={s.editorAreaWrap}>
//               <div style={s.lineNumbers}>
//                 {code.split("\n").map((_, i) => (
//                   <div key={i} style={s.lineNum}>
//                     {i + 1}
//                   </div>
//                 ))}
//               </div>
//               <textarea
//                 ref={textareaRef}
//                 style={{
//                   ...s.codeTextarea,
//                   ...(language === "MYSQL" ? s.sqlTextarea : {}),
//                 }}
//                 value={code}
//                 onChange={(e) => setCode(e.target.value)}
//                 onKeyDown={handleTabKey}
//                 spellCheck={false}
//                 autoCapitalize="none"
//                 autoCorrect="off"
//                 placeholder={
//                   language === "MYSQL"
//                     ? "-- Write your SQL here..."
//                     : language === "BASH"
//                       ? "#!/bin/bash\n# Write your shell script here..."
//                       : "// Start coding here..."
//                 }
//               />
//             </div>

//             <div style={s.bottomPanel}>
//               <div style={s.bottomTabs}>
//                 <button
//                   style={{
//                     ...s.bottomTab,
//                     ...(!showCustomInput ? s.bottomTabActive : {}),
//                   }}
//                   onClick={() => setShowCustomInput(false)}
//                 >
//                   Output
//                 </button>
//                 {!NO_INPUT_LANGS.includes(language) && (
//                   <button
//                     style={{
//                       ...s.bottomTab,
//                       ...(showCustomInput ? s.bottomTabActive : {}),
//                     }}
//                     onClick={() => setShowCustomInput(true)}
//                   >
//                     Custom Input
//                   </button>
//                 )}
//               </div>

//               <div style={s.bottomContent}>
//                 {showCustomInput ? (
//                   <textarea
//                     style={s.customInputArea}
//                     value={customInput}
//                     onChange={(e) => setCustomInput(e.target.value)}
//                     placeholder="Enter custom input here (stdin)..."
//                   />
//                 ) : (
//                   <>
//                     {runLoading && (
//                       <div style={s.outputRunning}>
//                         <div style={s.outputSpinner} />
//                         <span>
//                           {language === "MYSQL"
//                             ? "Running SQL on your database..."
//                             : language === "BASH"
//                               ? "Executing shell script..."
//                               : "Running code..."}
//                         </span>
//                       </div>
//                     )}
//                     {!output && !runLoading && (
//                       <div style={s.outputPlaceholder}>
//                         Run your code to see output here
//                       </div>
//                     )}
//                     {output && !runLoading && (
//                       <div>
//                         <div
//                           style={{
//                             ...s.statusChip,
//                             background: statusBg(output.status),
//                             color: statusColor(output.status),
//                           }}
//                         >
//                           ● {output.status}
//                           {output.executionTimeMs && (
//                             <span
//                               style={{
//                                 marginLeft: 10,
//                                 color: "#64748b",
//                                 fontWeight: 400,
//                               }}
//                             >
//                               {output.executionTimeMs}ms
//                             </span>
//                           )}
//                         </div>
//                         <pre
//                           style={
//                             language === "MYSQL" ? s.sqlOutputPre : s.outputPre
//                           }
//                         >
//                           {output.output || "(no output)"}
//                         </pre>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── PROBLEMS / HISTORY TABS ───────────────────
//   if (mode === "problems") {
//     return (
//       <div style={s.root}>
//         {showMyFiles && <MyFilesDrawer />}
//         {saveFileModal && <SaveFileModal />}
//         <div style={s.header}>
//           <div style={s.headerLeft}>
//             <div style={s.logoWrap}>
//               <span style={s.logoIcon}>{"</>"}</span>
//               <span style={s.logoText}>CodeLab</span>
//             </div>
//             <span style={s.studentBadge}>Student</span>
//             <span style={s.batchPill}>Batch: {batchId}</span>
//           </div>
//           <div style={s.navTabs}>
//             {["problems", "history"].map((t) => (
//               <button
//                 key={t}
//                 onClick={() => setTab(t)}
//                 style={{ ...s.navTab, ...(tab === t ? s.navTabActive : {}) }}
//               >
//                 {t === "problems" ? "📋 Problems" : "📜 History"}
//               </button>
//             ))}
//           </div>
//           <div style={s.headerRight}>
//             <button style={s.myFilesBtn} onClick={handleOpenMyFiles}>
//               📁 My Files
//             </button>
//             <button
//               style={s.playgroundBtn}
//               onClick={() => {
//                 setMode("playground");
//                 setCode(DEFAULT_CODE[language]);
//                 setOutput(null);
//                 setJudgeResult(null);
//               }}
//             >
//               🎮 Playground
//             </button>
//           </div>
//         </div>

//         <div style={s.mainContent}>
//           {tab === "problems" && (
//             <>
//               <div style={s.pageTitle}>
//                 <span>Assigned Problems</span>
//                 <span style={s.countBadge}>{problems.length} Problems</span>
//               </div>
//               {problems.length === 0 ? (
//                 <div style={s.emptyState}>
//                   <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
//                   <div style={{ color: "#64748b", fontSize: 15 }}>
//                     No problems assigned yet.
//                   </div>
//                 </div>
//               ) : (
//                 <div style={s.problemGrid}>
//                   {problems.map((p, i) => (
//                     <div key={p.id} style={s.problemCard}>
//                       <div style={s.problemCardHeader}>
//                         <span style={s.problemIndex}>#{i + 1}</span>
//                         <span
//                           style={{
//                             ...s.diffChip,
//                             ...difficultyStyle(p.difficulty),
//                           }}
//                         >
//                           {p.difficulty}
//                         </span>
//                       </div>
//                       <div style={s.problemTitle}>{p.title}</div>
//                       <div style={s.problemDesc}>
//                         {p.description?.slice(0, 110)}
//                         {p.description?.length > 110 ? "..." : ""}
//                       </div>
//                       <div style={s.problemFooter}>
//                         <div style={s.problemMeta}>
//                           <span style={s.marksChip}>🏆 {p.totalMarks} pts</span>
//                           <span style={s.testsChip}>
//                             🧪 {p.visibleTestCases?.length || 0} tests
//                           </span>
//                         </div>
//                         <button
//                           style={s.solveBtn}
//                           onClick={() => openProblem(p.id)}
//                           disabled={problemLoading}
//                         >
//                           {problemLoading ? "..." : "Solve →"}
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}

//           {tab === "history" && (
//             <>
//               <div style={s.pageTitle}>
//                 <span>My Submissions</span>
//                 <span style={s.countBadge}>{history.length} runs</span>
//               </div>
//               {history.length === 0 ? (
//                 <div style={s.emptyState}>
//                   <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
//                   <div style={{ color: "#64748b" }}>No submissions yet.</div>
//                 </div>
//               ) : (
//                 <div style={s.historyList}>
//                   {history.map((h) => (
//                     <div
//                       key={h.submissionId}
//                       style={{
//                         ...s.historyCard,
//                         ...(activeHistoryItem === h.submissionId
//                           ? s.historyCardOpen
//                           : {}),
//                       }}
//                       onClick={() =>
//                         setActiveHistoryItem(
//                           activeHistoryItem === h.submissionId
//                             ? null
//                             : h.submissionId,
//                         )
//                       }
//                     >
//                       <div style={s.historyRow}>
//                         <span style={s.historyLang}>{h.language}</span>
//                         <span
//                           style={{
//                             ...s.historyStatus,
//                             color: statusColor(h.status),
//                             background: statusBg(h.status),
//                           }}
//                         >
//                           {h.status}
//                         </span>
//                         <span style={s.historyTime}>
//                           {new Date(h.timestamp).toLocaleString()}
//                         </span>
//                         <span style={s.historyMs}>{h.executionTimeMs}ms</span>
//                         <span style={s.expandIcon}>
//                           {activeHistoryItem === h.submissionId ? "▲" : "▼"}
//                         </span>
//                       </div>
//                       {activeHistoryItem === h.submissionId && (
//                         <div style={s.historyBody}>
//                           <div style={s.historyOutputLabel}>Output</div>
//                           <pre
//                             style={
//                               h.language === "MYSQL"
//                                 ? s.sqlOutputPre
//                                 : s.outputPre
//                             }
//                           >
//                             {h.output || "(no output)"}
//                           </pre>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // ── EDITOR MODE ───────────────────────────────
//   return (
//     <div style={s.root}>
//       {runLoading && <RunLoadingOverlay />}
//       {showMyFiles && <MyFilesDrawer />}
//       {saveFileModal && <SaveFileModal />}
//       <div style={s.header}>
//         <div style={s.headerLeft}>
//           <button
//             style={s.modeBackBtn}
//             onClick={() => {
//               setMode("problems");
//               setTab("problems");
//             }}
//           >
//             ← Problems
//           </button>
//           <div style={s.logoWrap}>
//             <span style={s.logoIcon}>{"</>"}</span>
//             <span style={s.logoText}>CodeLab</span>
//           </div>
//           {selectedProblem && (
//             <span
//               style={{
//                 ...s.diffChip,
//                 ...difficultyStyle(selectedProblem.difficulty),
//               }}
//             >
//               {selectedProblem.difficulty}
//             </span>
//           )}
//         </div>
//         <div style={s.headerRight}>
//           <div style={s.langToggle}>
//             {LANGUAGES.map((l) => (
//               <button
//                 key={l}
//                 onClick={() => handleLanguageChange(l)}
//                 style={{
//                   ...s.langBtn,
//                   ...(language === l ? s.langBtnActive : {}),
//                 }}
//               >
//                 {LANG_LABEL[l]}
//               </button>
//             ))}
//           </div>
//           <button style={s.myFilesBtn} onClick={handleOpenMyFiles}>
//             📁 My Files
//           </button>
//           <button
//             style={s.saveBtn}
//             onClick={() => {
//               setSaveFileName("");
//               setSaveFileError("");
//               setSaveFileModal(true);
//             }}
//           >
//             💾 Save
//           </button>
//           <button
//             style={s.runBtn}
//             onClick={handleRunCode}
//             disabled={runLoading}
//           >
//             {runLoading ? (
//               <>
//                 <span style={s.btnSpinner} /> Running...
//               </>
//             ) : (
//               "▶ Run"
//             )}
//           </button>
//           {selectedProblem && (
//             <button
//               style={s.submitBtn}
//               onClick={handleSubmit}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span style={{ ...s.btnSpinner, borderTopColor: "#fff" }} />{" "}
//                   Judging...
//                 </>
//               ) : (
//                 "⚡ Submit"
//               )}
//             </button>
//           )}
//         </div>
//       </div>

//       <div
//         style={{
//           display: "flex",
//           height: "calc(100vh - 56px)",
//           overflow: "hidden",
//         }}
//       >
//         {/* Problem Panel */}
//         <div style={s.problemPanel}>
//           {selectedProblem ? (
//             <div style={s.problemDetailWrap}>
//               <h2 style={s.problemDetailTitle}>{selectedProblem.title}</h2>
//               <div style={s.infoRow}>
//                 <span
//                   style={{
//                     ...s.diffChip,
//                     ...difficultyStyle(selectedProblem.difficulty),
//                   }}
//                 >
//                   {selectedProblem.difficulty}
//                 </span>
//                 <span style={s.marksChip}>
//                   🏆 {selectedProblem.totalMarks} pts
//                 </span>
//               </div>
//               <Section label="Description">
//                 <p style={s.descText}>{selectedProblem.description}</p>
//               </Section>
//               {selectedProblem.inputFormat && (
//                 <Section label="Input Format">
//                   <p style={s.descText}>{selectedProblem.inputFormat}</p>
//                 </Section>
//               )}
//               {selectedProblem.outputFormat && (
//                 <Section label="Output Format">
//                   <p style={s.descText}>{selectedProblem.outputFormat}</p>
//                 </Section>
//               )}
//               {selectedProblem.constraints && (
//                 <Section label="Constraints">
//                   <div style={s.monoBlock}>{selectedProblem.constraints}</div>
//                 </Section>
//               )}
//               <div style={s.ioGrid}>
//                 {selectedProblem.sampleInput && (
//                   <div style={s.ioBox}>
//                     <div style={s.ioLabel}>Sample Input</div>
//                     <pre style={s.ioContent}>{selectedProblem.sampleInput}</pre>
//                   </div>
//                 )}
//                 {selectedProblem.sampleOutput && (
//                   <div style={s.ioBox}>
//                     <div style={s.ioLabel}>Sample Output</div>
//                     <pre style={s.ioContent}>
//                       {selectedProblem.sampleOutput}
//                     </pre>
//                   </div>
//                 )}
//               </div>
//               {selectedProblem.visibleTestCases?.filter((tc) => !tc.isHidden)
//                 .length > 0 && (
//                 <Section label="Sample Test Cases">
//                   {selectedProblem.visibleTestCases
//                     .filter((tc) => !tc.isHidden)
//                     .map((tc, i) => (
//                       <div key={tc.id} style={s.testCase}>
//                         <div style={s.testCaseLabel}>Case {i + 1}</div>
//                         {tc.input && (
//                           <div style={s.testCaseRow}>
//                             <span style={s.testKey}>Input</span>
//                             <code style={s.testVal}>{tc.input}</code>
//                           </div>
//                         )}
//                         <div style={s.testCaseRow}>
//                           <span style={s.testKey}>Expected</span>
//                           <code style={s.testVal}>{tc.expectedOutput}</code>
//                         </div>
//                       </div>
//                     ))}
//                 </Section>
//               )}
//             </div>
//           ) : (
//             <div style={s.noProblem}>
//               <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
//               <p style={{ color: "#64748b", fontSize: 14 }}>
//                 Select a problem to start solving
//               </p>
//               <button
//                 style={s.solveBtn}
//                 onClick={() => {
//                   setMode("problems");
//                   setTab("problems");
//                 }}
//               >
//                 Browse Problems
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Editor Panel */}
//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             overflow: "hidden",
//           }}
//         >
//           {language === "MYSQL" && <MySQLToolbar />}
//           {language === "BASH" && (
//             <div
//               style={{
//                 ...s.langBanner,
//                 background: "#f0fdf4",
//                 borderColor: "#86efac",
//                 color: "#166534",
//               }}
//             >
//               🖥️ <strong>Bash Mode</strong> — Runs in a sandboxed shell
//               environment.
//             </div>
//           )}

//           <div style={s.editorAreaWrap}>
//             <div style={s.lineNumbers}>
//               {code.split("\n").map((_, i) => (
//                 <div key={i} style={s.lineNum}>
//                   {i + 1}
//                 </div>
//               ))}
//             </div>
//             <textarea
//               ref={textareaRef}
//               style={{
//                 ...s.codeTextarea,
//                 ...(language === "MYSQL" ? s.sqlTextarea : {}),
//               }}
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//               onKeyDown={handleTabKey}
//               spellCheck={false}
//               autoCapitalize="none"
//               autoCorrect="off"
//             />
//           </div>

//           <div style={s.outputPanel}>
//             {!output && !judgeResult && !runLoading && (
//               <div style={s.outputPlaceholder}>
//                 Click <strong>Run</strong> to test, or <strong>Submit</strong>{" "}
//                 to judge against all test cases.
//               </div>
//             )}
//             {runLoading && (
//               <div style={s.outputRunning}>
//                 <div style={s.outputSpinner} />
//                 <span>
//                   {language === "MYSQL"
//                     ? "Running SQL on your database..."
//                     : language === "BASH"
//                       ? "Running shell script..."
//                       : "Running code..."}
//                 </span>
//               </div>
//             )}
//             {output && !judgeResult && !runLoading && (
//               <div>
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 10,
//                     alignItems: "center",
//                     marginBottom: 10,
//                   }}
//                 >
//                   <span
//                     style={{
//                       ...s.statusChip,
//                       background: statusBg(output.status),
//                       color: statusColor(output.status),
//                     }}
//                   >
//                     ● {output.status}
//                   </span>
//                   {output.executionTimeMs && (
//                     <span style={s.execTime}>{output.executionTimeMs}ms</span>
//                   )}
//                 </div>
//                 <pre
//                   style={language === "MYSQL" ? s.sqlOutputPre : s.outputPre}
//                 >
//                   {output.output || "(no output)"}
//                 </pre>
//               </div>
//             )}
//             {judgeResult && (
//               <div>
//                 <div style={s.judgeHeader}>
//                   <span
//                     style={{
//                       ...s.verdictBig,
//                       color: verdictColor(judgeResult.overallVerdict),
//                     }}
//                   >
//                     {judgeResult.overallVerdict === "ACCEPTED" ? "✓ " : "✗ "}
//                     {judgeResult.overallVerdict}
//                   </span>
//                   <span style={s.scoreChip}>
//                     {judgeResult.marksObtained}/{judgeResult.totalMarks} pts
//                   </span>
//                   <span style={s.execTime}>
//                     {judgeResult.testCasesPassed}/{judgeResult.totalTestCases}{" "}
//                     tests
//                   </span>
//                 </div>
//                 <div style={s.judgeGrid}>
//                   {judgeResult.judgeResults?.map((r, i) => (
//                     <div
//                       key={i}
//                       style={{
//                         ...s.judgeCard,
//                         background: r.passed ? "#f0fdf4" : "#fff5f5",
//                         borderColor: r.passed ? "#86efac" : "#fca5a5",
//                       }}
//                     >
//                       <div style={s.judgeCardTop}>
//                         <span style={{ fontWeight: 700, color: "#374151" }}>
//                           Test {i + 1}
//                         </span>
//                         <span
//                           style={{
//                             color: r.passed ? "#16a34a" : "#dc2626",
//                             fontWeight: 700,
//                           }}
//                         >
//                           {r.verdict}
//                         </span>
//                       </div>
//                       {!r.isHidden && r.actualOutput && (
//                         <div
//                           style={{
//                             marginTop: 4,
//                             fontSize: 12,
//                             color: "#64748b",
//                           }}
//                         >
//                           <span style={{ fontWeight: 600 }}>Output: </span>
//                           <code style={s.testVal}>{r.actualOutput}</code>
//                         </div>
//                       )}
//                       {r.isHidden && (
//                         <div
//                           style={{
//                             color: "#9ca3af",
//                             fontSize: 11,
//                             marginTop: 4,
//                           }}
//                         >
//                           Hidden test case
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Section({ label, children }) {
//   return (
//     <div style={{ marginBottom: 16 }}>
//       <div
//         style={{
//           fontSize: 11,
//           fontWeight: 700,
//           color: "#2563eb",
//           letterSpacing: "0.08em",
//           textTransform: "uppercase",
//           marginBottom: 6,
//           fontFamily: "'JetBrains Mono', monospace",
//         }}
//       >
//         {label}
//       </div>
//       {children}
//     </div>
//   );
// }

// const s = {
//   root: {
//     minHeight: "100vh",
//     background: "#ffffff",
//     color: "#1e293b",
//     fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
//     display: "flex",
//     flexDirection: "column",
//   },
//   loadingScreen: {
//     minHeight: "100vh",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#f8fafc",
//   },
//   spinner: {
//     width: 32,
//     height: 32,
//     border: "3px solid #e2e8f0",
//     borderTop: "3px solid #2563eb",
//     borderRadius: "50%",
//     animation: "spin 0.8s linear infinite",
//   },
//   runOverlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.45)",
//     zIndex: 9999,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   runOverlayBox: {
//     background: "#ffffff",
//     borderRadius: 16,
//     padding: "32px 40px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 12,
//     boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
//     minWidth: 300,
//   },
//   runSpinner: {
//     width: 40,
//     height: 40,
//     border: "4px solid #e2e8f0",
//     borderTop: "4px solid #2563eb",
//     borderRadius: "50%",
//     animation: "spin 0.8s linear infinite",
//   },
//   runOverlayText: {
//     fontSize: 15,
//     fontWeight: 700,
//     color: "#1e293b",
//     fontFamily: "'JetBrains Mono', monospace",
//   },
//   runOverlaySubText: {
//     fontSize: 12,
//     color: "#64748b",
//     fontFamily: "'JetBrains Mono', monospace",
//   },
//   outputRunning: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     padding: "20px 0",
//     color: "#64748b",
//     fontSize: 13,
//   },
//   outputSpinner: {
//     width: 16,
//     height: 16,
//     border: "2px solid #e2e8f0",
//     borderTop: "2px solid #2563eb",
//     borderRadius: "50%",
//     animation: "spin 0.8s linear infinite",
//     flexShrink: 0,
//   },
//   langBanner: {
//     background: "#eff6ff",
//     borderBottom: "1px solid #bfdbfe",
//     color: "#1d4ed8",
//     fontSize: 12,
//     padding: "8px 16px",
//     flexShrink: 0,
//   },
//   mysqlToolbar: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     background: "#eff6ff",
//     borderBottom: "1px solid #bfdbfe",
//     color: "#1d4ed8",
//     fontSize: 12,
//     padding: "8px 16px",
//     flexShrink: 0,
//     gap: 8,
//   },
//   mysqlInfo: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     flexWrap: "wrap",
//   },
//   mysqlActions: { display: "flex", gap: 8, flexShrink: 0 },
//   dbExplorerBtn: {
//     background: "#dbeafe",
//     color: "#1d4ed8",
//     border: "1px solid #93c5fd",
//     borderRadius: 6,
//     padding: "4px 12px",
//     cursor: "pointer",
//     fontSize: 11,
//     fontWeight: 700,
//     fontFamily: "inherit",
//   },
//   dbResetBtn: {
//     background: "#fee2e2",
//     color: "#dc2626",
//     border: "1px solid #fca5a5",
//     borderRadius: 6,
//     padding: "4px 12px",
//     cursor: "pointer",
//     fontSize: 11,
//     fontWeight: 700,
//     fontFamily: "inherit",
//   },
//   dbExplorerPanel: {
//     background: "#f8fafc",
//     borderBottom: "1px solid #e2e8f0",
//     maxHeight: 200,
//     overflowY: "auto",
//     flexShrink: 0,
//   },
//   dbExplorerHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "8px 16px",
//     fontSize: 12,
//     fontWeight: 700,
//     color: "#374151",
//     borderBottom: "1px solid #e2e8f0",
//     background: "#f1f5f9",
//   },
//   dbExplorerBody: { padding: "10px 16px" },
//   refreshBtn: {
//     background: "none",
//     border: "1px solid #e2e8f0",
//     borderRadius: 4,
//     padding: "2px 10px",
//     cursor: "pointer",
//     fontSize: 11,
//     fontFamily: "inherit",
//     color: "#64748b",
//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "0 20px",
//     height: 56,
//     background: "#ffffff",
//     borderBottom: "1px solid #e2e8f0",
//     flexShrink: 0,
//     boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
//   },
//   headerLeft: { display: "flex", alignItems: "center", gap: 12 },
//   headerRight: { display: "flex", alignItems: "center", gap: 8 },
//   logoWrap: { display: "flex", alignItems: "center", gap: 6 },
//   logoIcon: { fontSize: 20, color: "#2563eb", fontWeight: 900 },
//   logoText: {
//     fontSize: 15,
//     fontWeight: 800,
//     color: "#1e293b",
//     letterSpacing: "0.02em",
//   },
//   studentBadge: {
//     fontSize: 11,
//     background: "#eff6ff",
//     color: "#2563eb",
//     border: "1px solid #bfdbfe",
//     borderRadius: 20,
//     padding: "2px 10px",
//     fontWeight: 700,
//   },
//   playgroundBadge: {
//     fontSize: 11,
//     background: "#fdf4ff",
//     color: "#9333ea",
//     border: "1px solid #e9d5ff",
//     borderRadius: 20,
//     padding: "2px 10px",
//     fontWeight: 700,
//   },
//   batchPill: {
//     fontSize: 11,
//     background: "#f1f5f9",
//     color: "#64748b",
//     borderRadius: 20,
//     padding: "2px 10px",
//     fontWeight: 600,
//   },
//   modeBackBtn: {
//     background: "#f1f5f9",
//     border: "1px solid #e2e8f0",
//     color: "#475569",
//     borderRadius: 6,
//     padding: "5px 12px",
//     cursor: "pointer",
//     fontSize: 12,
//     fontWeight: 600,
//     fontFamily: "inherit",
//   },
//   navTabs: { display: "flex", gap: 2 },
//   navTab: {
//     background: "none",
//     border: "none",
//     color: "#64748b",
//     padding: "8px 16px",
//     borderRadius: 6,
//     cursor: "pointer",
//     fontSize: 13,
//     fontFamily: "inherit",
//     fontWeight: 500,
//   },
//   navTabActive: { background: "#eff6ff", color: "#2563eb", fontWeight: 700 },
//   playgroundBtn: {
//     background: "#fdf4ff",
//     color: "#9333ea",
//     border: "1px solid #e9d5ff",
//     borderRadius: 6,
//     padding: "6px 14px",
//     cursor: "pointer",
//     fontSize: 12,
//     fontWeight: 700,
//     fontFamily: "inherit",
//   },
//   myFilesBtn: {
//     background: "#f0fdf4",
//     color: "#16a34a",
//     border: "1px solid #bbf7d0",
//     borderRadius: 6,
//     padding: "6px 14px",
//     cursor: "pointer",
//     fontSize: 12,
//     fontWeight: 700,
//     fontFamily: "inherit",
//   },
//   saveBtn: {
//     background: "#fefce8",
//     color: "#ca8a04",
//     border: "1px solid #fde68a",
//     borderRadius: 6,
//     padding: "6px 14px",
//     cursor: "pointer",
//     fontSize: 12,
//     fontWeight: 700,
//     fontFamily: "inherit",
//   },
//   langToggle: { display: "flex", gap: 4 },
//   langBtn: {
//     background: "#f8fafc",
//     border: "1px solid #e2e8f0",
//     color: "#64748b",
//     padding: "5px 12px",
//     borderRadius: 6,
//     cursor: "pointer",
//     fontSize: 12,
//     fontFamily: "inherit",
//     fontWeight: 600,
//   },
//   langBtnActive: {
//     background: "#eff6ff",
//     color: "#2563eb",
//     border: "1px solid #bfdbfe",
//   },
//   runBtn: {
//     background: "#f1f5f9",
//     color: "#1e293b",
//     border: "1px solid #e2e8f0",
//     borderRadius: 6,
//     padding: "6px 16px",
//     cursor: "pointer",
//     fontWeight: 700,
//     fontSize: 13,
//     fontFamily: "inherit",
//     display: "flex",
//     alignItems: "center",
//     gap: 4,
//   },
//   runBtnPrimary: {
//     background: "#1e293b",
//     color: "#fff",
//     border: "none",
//     borderRadius: 6,
//     padding: "7px 18px",
//     cursor: "pointer",
//     fontWeight: 700,
//     fontSize: 13,
//     fontFamily: "inherit",
//     display: "flex",
//     alignItems: "center",
//     gap: 4,
//   },
//   submitBtn: {
//     background: "#2563eb",
//     color: "#fff",
//     border: "none",
//     borderRadius: 6,
//     padding: "6px 18px",
//     cursor: "pointer",
//     fontWeight: 700,
//     fontSize: 13,
//     fontFamily: "inherit",
//     display: "flex",
//     alignItems: "center",
//     gap: 4,
//   },
//   btnSpinner: {
//     display: "inline-block",
//     width: 12,
//     height: 12,
//     border: "2px solid rgba(0,0,0,0.15)",
//     borderTop: "2px solid #1e293b",
//     borderRadius: "50%",
//   },
//   mainContent: {
//     flex: 1,
//     padding: "28px 36px",
//     maxWidth: 1200,
//     width: "100%",
//     margin: "0 auto",
//     boxSizing: "border-box",
//   },
//   pageTitle: {
//     fontSize: 22,
//     fontWeight: 800,
//     marginBottom: 24,
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     color: "#0f172a",
//   },
//   countBadge: {
//     background: "#f1f5f9",
//     color: "#64748b",
//     borderRadius: 20,
//     padding: "3px 12px",
//     fontSize: 12,
//     fontWeight: 600,
//   },
//   emptyState: { textAlign: "center", padding: "80px 0" },
//   problemGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
//     gap: 16,
//   },
//   problemCard: {
//     background: "#ffffff",
//     border: "1px solid #e2e8f0",
//     borderRadius: 12,
//     padding: 20,
//     display: "flex",
//     flexDirection: "column",
//     gap: 8,
//     boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
//   },
//   problemCardHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   problemIndex: { color: "#94a3b8", fontSize: 12, fontWeight: 600 },
//   diffChip: {
//     fontSize: 11,
//     borderRadius: 20,
//     padding: "2px 10px",
//     fontWeight: 700,
//     letterSpacing: "0.04em",
//   },
//   problemTitle: {
//     fontSize: 15,
//     fontWeight: 800,
//     color: "#0f172a",
//     lineHeight: 1.4,
//   },
//   problemDesc: { fontSize: 12, color: "#64748b", lineHeight: 1.6 },
//   problemFooter: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 4,
//   },
//   problemMeta: { display: "flex", gap: 8 },
//   marksChip: {
//     fontSize: 11,
//     background: "#fefce8",
//     color: "#ca8a04",
//     border: "1px solid #fde68a",
//     borderRadius: 20,
//     padding: "2px 8px",
//     fontWeight: 700,
//   },
//   testsChip: {
//     fontSize: 11,
//     background: "#f0f9ff",
//     color: "#0284c7",
//     border: "1px solid #bae6fd",
//     borderRadius: 20,
//     padding: "2px 8px",
//     fontWeight: 600,
//   },
//   solveBtn: {
//     background: "#2563eb",
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     padding: "7px 16px",
//     cursor: "pointer",
//     fontWeight: 700,
//     fontSize: 12,
//     fontFamily: "inherit",
//   },
//   historyList: { display: "flex", flexDirection: "column", gap: 8 },
//   historyCard: {
//     background: "#ffffff",
//     border: "1px solid #e2e8f0",
//     borderRadius: 10,
//     padding: "12px 16px",
//     cursor: "pointer",
//   },
//   historyCardOpen: { borderColor: "#2563eb", background: "#f8fafc" },
//   historyRow: {
//     display: "flex",
//     gap: 12,
//     alignItems: "center",
//     flexWrap: "wrap",
//   },
//   historyLang: {
//     background: "#f0f9ff",
//     color: "#0369a1",
//     borderRadius: 6,
//     padding: "2px 8px",
//     fontSize: 11,
//     fontWeight: 700,
//   },
//   historyStatus: {
//     borderRadius: 20,
//     padding: "2px 10px",
//     fontSize: 11,
//     fontWeight: 700,
//   },
//   historyTime: { color: "#94a3b8", fontSize: 12, marginLeft: "auto" },
//   historyMs: { color: "#94a3b8", fontSize: 12 },
//   expandIcon: { color: "#94a3b8", fontSize: 11 },
//   historyBody: {
//     marginTop: 12,
//     borderTop: "1px solid #f1f5f9",
//     paddingTop: 10,
//   },
//   historyOutputLabel: {
//     fontSize: 11,
//     fontWeight: 700,
//     color: "#2563eb",
//     textTransform: "uppercase",
//     marginBottom: 6,
//   },
//   editorLayout: { display: "flex", overflow: "hidden" },
//   problemPanel: {
//     width: 380,
//     flexShrink: 0,
//     borderRight: "1px solid #e2e8f0",
//     overflowY: "auto",
//     background: "#fafafa",
//   },
//   problemDetailWrap: { padding: "20px 20px 32px" },
//   problemDetailTitle: {
//     fontSize: 17,
//     fontWeight: 800,
//     color: "#0f172a",
//     margin: "0 0 10px",
//     lineHeight: 1.4,
//   },
//   infoRow: { display: "flex", gap: 8, alignItems: "center", marginBottom: 16 },
//   descText: { fontSize: 13, color: "#475569", lineHeight: 1.7, margin: 0 },
//   monoBlock: {
//     background: "#f1f5f9",
//     border: "1px solid #e2e8f0",
//     borderRadius: 6,
//     padding: "8px 12px",
//     fontSize: 12,
//     color: "#2563eb",
//     fontFamily: "inherit",
//     whiteSpace: "pre-wrap",
//   },
//   ioGrid: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: 10,
//     marginBottom: 16,
//   },
//   ioBox: {
//     background: "#f8fafc",
//     border: "1px solid #e2e8f0",
//     borderRadius: 8,
//     padding: 10,
//   },
//   ioLabel: {
//     fontSize: 10,
//     fontWeight: 700,
//     color: "#94a3b8",
//     textTransform: "uppercase",
//     marginBottom: 6,
//     letterSpacing: "0.06em",
//   },
//   ioContent: {
//     margin: 0,
//     fontSize: 12,
//     color: "#0f172a",
//     fontFamily: "inherit",
//     whiteSpace: "pre-wrap",
//   },
//   testCase: {
//     background: "#f8fafc",
//     border: "1px solid #e2e8f0",
//     borderRadius: 8,
//     padding: "10px 12px",
//     marginBottom: 8,
//   },
//   testCaseLabel: {
//     fontSize: 11,
//     color: "#94a3b8",
//     fontWeight: 700,
//     marginBottom: 6,
//   },
//   testCaseRow: {
//     display: "flex",
//     gap: 8,
//     alignItems: "flex-start",
//     marginBottom: 4,
//   },
//   testKey: {
//     color: "#64748b",
//     fontSize: 11,
//     minWidth: 60,
//     flexShrink: 0,
//     fontWeight: 600,
//   },
//   testVal: {
//     color: "#2563eb",
//     fontSize: 11,
//     background: "#eff6ff",
//     padding: "1px 5px",
//     borderRadius: 4,
//     wordBreak: "break-all",
//     fontFamily: "inherit",
//   },
//   noProblem: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100%",
//     gap: 12,
//     padding: 40,
//   },
//   editorAreaWrap: {
//     flex: 1,
//     display: "flex",
//     overflow: "hidden",
//     background: "#1e293b",
//     minHeight: 0,
//   },
//   lineNumbers: {
//     padding: "16px 0",
//     background: "#1e293b",
//     borderRight: "1px solid #334155",
//     minWidth: 44,
//     textAlign: "right",
//     paddingRight: 12,
//     paddingLeft: 8,
//     userSelect: "none",
//     overflowY: "hidden",
//     flexShrink: 0,
//   },
//   lineNum: { fontSize: 13, lineHeight: "21.5px", color: "#475569" },
//   codeTextarea: {
//     flex: 1,
//     background: "transparent",
//     border: "none",
//     outline: "none",
//     color: "#e2e8f0",
//     fontSize: 13,
//     lineHeight: "21.5px",
//     padding: "16px",
//     resize: "none",
//     fontFamily: "inherit",
//     overflowY: "auto",
//     tabSize: 4,
//   },
//   sqlTextarea: { color: "#7dd3fc" },
//   outputPanel: {
//     height: 220,
//     borderTop: "1px solid #e2e8f0",
//     background: "#ffffff",
//     overflowY: "auto",
//     padding: "14px 18px",
//     flexShrink: 0,
//   },
//   outputPlaceholder: {
//     color: "#94a3b8",
//     fontSize: 13,
//     padding: "20px 0",
//     textAlign: "center",
//   },
//   statusChip: {
//     display: "inline-block",
//     borderRadius: 20,
//     padding: "3px 12px",
//     fontSize: 12,
//     fontWeight: 700,
//     marginBottom: 8,
//   },
//   execTime: { color: "#94a3b8", fontSize: 12 },
//   outputPre: {
//     margin: 0,
//     fontSize: 13,
//     color: "#1e293b",
//     lineHeight: 1.6,
//     whiteSpace: "pre-wrap",
//     wordBreak: "break-all",
//     fontFamily: "inherit",
//   },
//   sqlOutputPre: {
//     margin: 0,
//     fontSize: 12,
//     color: "#1e293b",
//     lineHeight: 1.6,
//     whiteSpace: "pre",
//     fontFamily: "'Courier New', monospace",
//     overflowX: "auto",
//   },
//   judgeHeader: {
//     display: "flex",
//     gap: 16,
//     alignItems: "center",
//     marginBottom: 12,
//     flexWrap: "wrap",
//   },
//   verdictBig: { fontSize: 16, fontWeight: 900 },
//   scoreChip: {
//     background: "#fefce8",
//     color: "#ca8a04",
//     border: "1px solid #fde68a",
//     borderRadius: 20,
//     padding: "3px 12px",
//     fontSize: 12,
//     fontWeight: 700,
//   },
//   judgeGrid: { display: "flex", flexWrap: "wrap", gap: 8 },
//   judgeCard: {
//     border: "1px solid",
//     borderRadius: 8,
//     padding: "8px 12px",
//     minWidth: 130,
//     fontSize: 12,
//   },
//   judgeCardTop: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: 2,
//   },
//   bottomPanel: {
//     height: 220,
//     borderTop: "1px solid #e2e8f0",
//     background: "#ffffff",
//     display: "flex",
//     flexDirection: "column",
//     flexShrink: 0,
//   },
//   bottomTabs: {
//     display: "flex",
//     borderBottom: "1px solid #e2e8f0",
//     flexShrink: 0,
//   },
//   bottomTab: {
//     padding: "8px 16px",
//     fontSize: 12,
//     fontWeight: 600,
//     fontFamily: "inherit",
//     background: "none",
//     border: "none",
//     cursor: "pointer",
//     color: "#64748b",
//     borderBottom: "2px solid transparent",
//   },
//   bottomTabActive: { color: "#2563eb", borderBottom: "2px solid #2563eb" },
//   bottomContent: { flex: 1, padding: "12px 16px", overflowY: "auto" },
//   customInputArea: {
//     width: "100%",
//     height: "100%",
//     background: "#f8fafc",
//     border: "1px solid #e2e8f0",
//     borderRadius: 6,
//     color: "#1e293b",
//     fontSize: 13,
//     fontFamily: "inherit",
//     padding: 10,
//     resize: "none",
//     outline: "none",
//     boxSizing: "border-box",
//   },
//   drawerOverlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.4)",
//     zIndex: 8888,
//     display: "flex",
//     alignItems: "stretch",
//     justifyContent: "flex-end",
//   },
//   drawerPanel: {
//     width: 360,
//     background: "#ffffff",
//     boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
//     display: "flex",
//     flexDirection: "column",
//     height: "100%",
//   },
//   drawerHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "16px 20px",
//     borderBottom: "1px solid #e2e8f0",
//     background: "#f8fafc",
//     flexShrink: 0,
//   },
//   drawerTitle: {
//     fontSize: 14,
//     fontWeight: 800,
//     color: "#0f172a",
//   },
//   drawerCloseBtn: {
//     background: "none",
//     border: "none",
//     cursor: "pointer",
//     fontSize: 16,
//     color: "#94a3b8",
//     padding: "2px 6px",
//     borderRadius: 4,
//     fontFamily: "inherit",
//   },
//   drawerBody: {
//     flex: 1,
//     overflowY: "auto",
//     padding: "12px 0",
//   },
//   drawerLoading: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     padding: "32px 20px",
//     justifyContent: "center",
//   },
//   drawerEmpty: {
//     textAlign: "center",
//     padding: "48px 20px",
//   },
//   drawerFooter: {
//     padding: "12px 20px",
//     borderTop: "1px solid #e2e8f0",
//     flexShrink: 0,
//   },
//   drawerRefreshBtn: {
//     background: "#f1f5f9",
//     border: "1px solid #e2e8f0",
//     borderRadius: 6,
//     padding: "6px 16px",
//     cursor: "pointer",
//     fontSize: 12,
//     fontWeight: 600,
//     fontFamily: "inherit",
//     color: "#475569",
//     width: "100%",
//   },
//   fileList: {
//     display: "flex",
//     flexDirection: "column",
//     gap: 2,
//     padding: "0 8px",
//   },
//   fileCard: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "10px 12px",
//     borderRadius: 8,
//     border: "1px solid #f1f5f9",
//     cursor: "pointer",
//     background: "#ffffff",
//     transition: "background 0.1s",
//   },
//   fileCardLeft: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     minWidth: 0,
//   },
//   fileIcon: { fontSize: 20, flexShrink: 0 },
//   fileName: {
//     fontSize: 13,
//     fontWeight: 700,
//     color: "#0f172a",
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     maxWidth: 200,
//   },
//   fileMeta: {
//     display: "flex",
//     gap: 8,
//     alignItems: "center",
//     marginTop: 2,
//   },
//   fileLangBadge: {
//     fontSize: 10,
//     background: "#eff6ff",
//     color: "#2563eb",
//     border: "1px solid #bfdbfe",
//     borderRadius: 10,
//     padding: "1px 7px",
//     fontWeight: 700,
//   },
//   fileDate: { fontSize: 10, color: "#94a3b8" },
//   fileDeleteBtn: {
//     background: "none",
//     border: "none",
//     cursor: "pointer",
//     fontSize: 14,
//     padding: "4px 6px",
//     borderRadius: 4,
//     flexShrink: 0,
//     opacity: 0.6,
//   },
//   saveModalBox: {
//     width: 360,
//     background: "#ffffff",
//     borderRadius: 14,
//     boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
//     alignSelf: "center",
//     margin: "auto",
//     overflow: "hidden",
//   },
//   saveLabel: {
//     fontSize: 11,
//     fontWeight: 700,
//     color: "#64748b",
//     textTransform: "uppercase",
//     letterSpacing: "0.06em",
//     marginBottom: 6,
//   },
//   saveInput: {
//     width: "100%",
//     border: "1px solid #e2e8f0",
//     borderRadius: 8,
//     padding: "9px 12px",
//     fontSize: 13,
//     fontFamily: "inherit",
//     color: "#1e293b",
//     outline: "none",
//     boxSizing: "border-box",
//     background: "#f8fafc",
//   },
//   saveError: {
//     color: "#dc2626",
//     fontSize: 12,
//     marginTop: 6,
//   },
//   saveMetaRow: {
//     display: "flex",
//     gap: 10,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   saveModalFooter: {
//     display: "flex",
//     gap: 8,
//     padding: "12px 20px 16px",
//     justifyContent: "flex-end",
//   },
//   saveCancelBtn: {
//     background: "#f1f5f9",
//     border: "1px solid #e2e8f0",
//     borderRadius: 7,
//     padding: "7px 18px",
//     cursor: "pointer",
//     fontSize: 12,
//     fontWeight: 600,
//     fontFamily: "inherit",
//     color: "#475569",
//   },
//   saveConfirmBtn: {
//     background: "#2563eb",
//     color: "#fff",
//     border: "none",
//     borderRadius: 7,
//     padding: "7px 18px",
//     cursor: "pointer",
//     fontSize: 12,
//     fontWeight: 700,
//     fontFamily: "inherit",
//   },
// };









































import { useEffect, useRef, useState } from "react";
import {
  Code2, Terminal, Database, Coffee, Braces,
  ChevronLeft, Play, Save, FolderOpen, Trophy,
  FlaskConical, Trash2, RefreshCw, X, FileCode2,
  LayoutGrid, History, Gamepad2, Zap, ChevronDown,
  ChevronUp, AlertTriangle, BookOpen, CheckCircle2,
  XCircle, Clock, Cpu, User, Hash, Eye, EyeOff,
  RotateCcw, Table2, PanelLeft, FileText, Loader2
} from "lucide-react";
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
} from "../services/assessmentService";
import { getStudentClassroom } from "../services/batchService";

const codeFilesAPI = {
  save: (data) => saveCodeFile(data),
  getAll: (_studentEmail, batchId) => getMyCodeFiles(batchId),
  getById: (id) => getCodeFileById(id),
  delete: (id) => deleteCodeFile(id),
  getProfile: () =>
    API.default
      ? API.default.get?.("/students/profile")
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

/* ── Inject global styles once ── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');

  :root {
    --bg:          #f1f5f9;
    --card:        #ffffff;
    --text:        #0f172a;
    --text-muted:  #64748b;
    --border:      #e2e8f0;
    --accent1:     #22d3ee;
    --accent2:     #fb923c;
    --accent3:     #34d399;
    --accent4:     #a78bfa;
    --accent-blue: #2563eb;
    --shadow:      0 4px 24px rgba(0,0,0,0.06);
    --shadow-lg:   0 8px 40px rgba(0,0,0,0.10);
    --radius:      20px;
    --radius-sm:   12px;
    --radius-xs:   8px;
  }

  .sc-dark {
    --bg:          #0a0a0a;
    --card:        #111111;
    --text:        #f1f5f9;
    --text-muted:  #94a3b8;
    --border:      rgba(255,255,255,0.07);
    --shadow:      0 4px 24px rgba(0,0,0,0.40);
    --shadow-lg:   0 8px 40px rgba(0,0,0,0.60);
  }

  .sc-root {
    font-family: 'Poppins', sans-serif;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    display: flex;
    flex-direction: column;
    transition: background 0.3s, color 0.3s;
  }

  .sc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    height: 60px;
    background: var(--card);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
    box-shadow: var(--shadow);
    gap: 16px;
    flex-wrap: wrap;
  }

  .sc-header-left  { display: flex; align-items: center; gap: 14px; }
  .sc-header-right { display: flex; align-items: center; gap: 8px; }

  .sc-logo-wrap { display: flex; align-items: center; gap: 8px; }
  .sc-logo-icon {
    display: flex; align-items: center; justify-content: center;
    color: var(--accent1);
  }
  .sc-logo-text {
    font-size: 16px;
    font-weight: 800;
    color: var(--text);
    letter-spacing: 0.02em;
  }

  .sc-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
    border-radius: 50px;
    border: 1px solid var(--border);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }
  .sc-badge-student  { background: rgba(34,211,238,0.10); color: var(--accent1); border-color: rgba(34,211,238,0.20); }
  .sc-badge-play     { background: rgba(167,139,250,0.10); color: var(--accent4); border-color: rgba(167,139,250,0.20); }
  .sc-badge-batch    { background: var(--bg); color: var(--text-muted); }
  .sc-badge-diff-easy   { background: rgba(52,211,153,0.10); color: #16a34a; border-color: rgba(52,211,153,0.25); }
  .sc-badge-diff-medium { background: rgba(251,146,60,0.10);  color: #d97706; border-color: rgba(251,146,60,0.25); }
  .sc-badge-diff-hard   { background: rgba(239,68,68,0.10);   color: #dc2626; border-color: rgba(239,68,68,0.25); }

  .sc-nav-tabs { display: flex; gap: 4px; }
  .sc-nav-tab {
    background: none;
    border: none;
    color: var(--text-muted);
    padding: 8px 18px;
    border-radius: var(--radius-xs);
    cursor: pointer;
    font-size: 13px;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    transition: background 0.18s, color 0.18s;
    display: flex; align-items: center; gap: 6px;
  }
  .sc-nav-tab:hover  { background: var(--bg); color: var(--text); }
  .sc-nav-tab.active { background: rgba(34,211,238,0.12); color: var(--accent1); }

  .sc-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    border-radius: var(--radius-xs);
    border: 1px solid var(--border);
    font-family: 'Poppins', sans-serif;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    background: var(--card);
    color: var(--text);
  }
  .sc-btn:hover { opacity: 0.85; transform: translateY(-1px); }
  .sc-btn:active { transform: translateY(0); }

  .sc-btn-back    { background: var(--bg); color: var(--text-muted); }
  .sc-btn-play    { background: rgba(167,139,250,0.10); color: var(--accent4); border-color: rgba(167,139,250,0.25); }
  .sc-btn-files   { background: rgba(52,211,153,0.10);  color: var(--accent3); border-color: rgba(52,211,153,0.25); }
  .sc-btn-save    { background: rgba(251,146,60,0.10);  color: var(--accent2); border-color: rgba(251,146,60,0.25); }
  .sc-btn-run     { background: var(--bg); color: var(--text); }
  .sc-btn-run-primary { background: var(--text); color: var(--card); border-color: transparent; }
  .sc-btn-submit  { background: var(--accent-blue); color: #fff; border-color: transparent; }
  .sc-btn-solve   { background: var(--accent1); color: #0a0a0a; border-color: transparent; font-size: 12px; padding: 9px 18px; border-radius: var(--radius-xs); }

  .sc-lang-toggle { display: flex; gap: 4px; }
  .sc-lang-btn {
    padding: 5px 12px;
    border-radius: var(--radius-xs);
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text-muted);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.18s;
    display: flex; align-items: center; gap: 5px;
  }
  .sc-lang-btn:hover { border-color: var(--accent1); color: var(--accent1); }
  .sc-lang-btn.active { background: rgba(34,211,238,0.12); color: var(--accent1); border-color: rgba(34,211,238,0.30); }

  .sc-main {
    flex: 1;
    padding: 32px 36px;
    max-width: 1300px;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .sc-page-title {
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 14px;
    color: var(--text);
  }

  .sc-count-badge {
    font-size: 11px;
    font-weight: 700;
    background: var(--bg);
    color: var(--text-muted);
    border: 1px solid var(--border);
    border-radius: 50px;
    padding: 4px 14px;
  }

  .sc-problem-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }

  .sc-problem-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: var(--shadow);
    transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
  }
  .sc-problem-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: rgba(34,211,238,0.25);
  }

  .sc-problem-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sc-problem-index { color: var(--text-muted); font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 4px; }

  .sc-problem-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    line-height: 1.4;
    transition: color 0.2s;
  }
  .sc-problem-card:hover .sc-problem-title { color: var(--accent1); }

  .sc-problem-desc { font-size: 12px; color: var(--text-muted); line-height: 1.7; }

  .sc-problem-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
  }

  .sc-problem-meta { display: flex; gap: 8px; }

  .sc-chip-marks {
    font-size: 11px; font-weight: 700;
    background: rgba(251,146,60,0.10); color: var(--accent2);
    border: 1px solid rgba(251,146,60,0.25);
    border-radius: 50px; padding: 3px 10px;
    display: inline-flex; align-items: center; gap: 4px;
  }
  .sc-chip-tests {
    font-size: 11px; font-weight: 600;
    background: rgba(34,211,238,0.08); color: var(--accent1);
    border: 1px solid rgba(34,211,238,0.20);
    border-radius: 50px; padding: 3px 10px;
    display: inline-flex; align-items: center; gap: 4px;
  }

  .sc-history-list { display: flex; flex-direction: column; gap: 10px; }

  .sc-history-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 14px 20px;
    cursor: pointer;
    box-shadow: var(--shadow);
    transition: border-color 0.2s, background 0.2s;
  }
  .sc-history-card.open { border-color: var(--accent1); background: var(--bg); }

  .sc-history-row {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  .sc-history-lang {
    font-size: 11px; font-weight: 700;
    background: rgba(34,211,238,0.08); color: var(--accent1);
    border-radius: var(--radius-xs); padding: 3px 10px;
    font-family: 'JetBrains Mono', monospace;
    display: inline-flex; align-items: center; gap: 5px;
  }

  .sc-history-time  { color: var(--text-muted); font-size: 12px; margin-left: auto; display: flex; align-items: center; gap: 4px; }
  .sc-history-ms    { color: var(--text-muted); font-size: 12px; display: flex; align-items: center; gap: 4px; }
  .sc-expand-icon   { color: var(--text-muted); font-size: 11px; }

  .sc-history-body  {
    margin-top: 14px;
    border-top: 1px solid var(--border);
    padding-top: 12px;
  }
  .sc-history-out-label {
    font-size: 10px; font-weight: 700; color: var(--accent1);
    text-transform: uppercase; letter-spacing: 0.07em;
    margin-bottom: 8px; display: flex; align-items: center; gap: 5px;
  }

  .sc-empty {
    text-align: center;
    padding: 100px 0;
  }
  .sc-empty-icon { font-size: 52px; margin-bottom: 14px; opacity: 0.5; display: flex; justify-content: center; }
  .sc-empty-text { color: var(--text-muted); font-size: 15px; font-weight: 600; }

  .sc-loading-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    gap: 14px;
  }
  @keyframes sc-spin { to { transform: rotate(360deg); } }
  .sc-spinner {
    width: 36px; height: 36px;
    border: 3px solid var(--border);
    border-top-color: var(--accent1);
    border-radius: 50%;
    animation: sc-spin 0.8s linear infinite;
  }
  .sc-spinner-sm {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(0,0,0,0.15);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: sc-spin 0.8s linear infinite;
    flex-shrink: 0;
  }

  .sc-editor-layout {
    display: flex;
    overflow: hidden;
  }

  .sc-problem-panel {
    width: 380px;
    flex-shrink: 0;
    border-right: 1px solid var(--border);
    overflow-y: auto;
    background: var(--bg);
  }

  .sc-problem-detail { padding: 24px 24px 40px; }

  .sc-problem-detail-title {
    font-size: 17px;
    font-weight: 800;
    color: var(--text);
    margin: 0 0 12px;
    line-height: 1.4;
  }

  .sc-info-row {
    display: flex; gap: 10px; align-items: center; margin-bottom: 20px;
  }

  .sc-section-label {
    font-size: 10px;
    font-weight: 700;
    color: var(--accent1);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 7px;
    display: flex; align-items: center; gap: 5px;
  }

  .sc-desc-text {
    font-size: 13px; color: var(--text-muted); line-height: 1.7; margin: 0;
  }

  .sc-mono-block {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    padding: 10px 14px;
    font-size: 12px;
    color: var(--accent1);
    font-family: 'JetBrains Mono', monospace;
    white-space: pre-wrap;
  }

  .sc-io-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px;
  }
  .sc-io-box {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    padding: 12px;
  }
  .sc-io-label {
    font-size: 10px; font-weight: 700; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 7px;
    display: flex; align-items: center; gap: 4px;
  }
  .sc-io-content {
    margin: 0; font-size: 12px; color: var(--text);
    font-family: 'JetBrains Mono', monospace; white-space: pre-wrap;
  }

  .sc-test-case {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    padding: 12px 14px;
    margin-bottom: 10px;
  }
  .sc-test-case-label { font-size: 11px; color: var(--text-muted); font-weight: 700; margin-bottom: 7px; display: flex; align-items: center; gap: 4px; }
  .sc-test-row { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 5px; }
  .sc-test-key { color: var(--text-muted); font-size: 11px; min-width: 62px; font-weight: 600; }
  .sc-test-val {
    color: var(--accent1); font-size: 11px;
    background: rgba(34,211,238,0.08); padding: 1px 7px;
    border-radius: 5px; word-break: break-all;
    font-family: 'JetBrains Mono', monospace;
    border: 1px solid rgba(34,211,238,0.18);
  }

  .sc-no-problem {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; height: 100%; gap: 14px; padding: 40px;
    text-align: center;
  }

  .sc-editor-area-wrap {
    flex: 1; display: flex; overflow: hidden;
    background: #0f172a; min-height: 0;
  }
  .sc-dark .sc-editor-area-wrap { background: #090e1a; }

  .sc-line-numbers {
    padding: 16px 12px 16px 10px;
    background: transparent;
    border-right: 1px solid rgba(255,255,255,0.06);
    min-width: 46px;
    text-align: right;
    user-select: none;
    overflow-y: hidden;
    flex-shrink: 0;
  }
  .sc-line-num {
    font-size: 12px;
    line-height: 21.5px;
    color: #475569;
    font-family: 'JetBrains Mono', monospace;
  }

  .sc-code-textarea {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #e2e8f0;
    font-size: 13px;
    line-height: 21.5px;
    padding: 16px;
    resize: none;
    font-family: 'JetBrains Mono', monospace;
    overflow-y: auto;
    tab-size: 4;
  }
  .sc-sql-textarea { color: #7dd3fc; }

  .sc-output-panel {
    height: 220px;
    border-top: 1px solid var(--border);
    background: var(--card);
    overflow-y: auto;
    padding: 16px 20px;
    flex-shrink: 0;
  }

  .sc-output-placeholder {
    color: var(--text-muted); font-size: 13px;
    padding: 24px 0; text-align: center;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }

  .sc-output-running {
    display: flex; align-items: center; gap: 10px;
    padding: 20px 0; color: var(--text-muted); font-size: 13px;
  }

  .sc-status-chip {
    display: inline-flex; align-items: center; gap: 5px;
    border-radius: 50px;
    padding: 4px 14px; font-size: 11px; font-weight: 700; margin-bottom: 10px;
  }
  .sc-exec-time { color: var(--text-muted); font-size: 12px; display: flex; align-items: center; gap: 4px; }

  .sc-output-pre {
    margin: 0; font-size: 13px; color: var(--text); line-height: 1.6;
    white-space: pre-wrap; word-break: break-all;
    font-family: 'JetBrains Mono', monospace;
  }
  .sc-sql-output-pre {
    margin: 0; font-size: 12px; color: var(--text); line-height: 1.6;
    white-space: pre; font-family: 'Courier New', monospace; overflow-x: auto;
  }

  .sc-judge-header {
    display: flex; gap: 16px; align-items: center;
    margin-bottom: 14px; flex-wrap: wrap;
  }
  .sc-verdict-big { font-size: 16px; font-weight: 900; display: flex; align-items: center; gap: 6px; }
  .sc-score-chip {
    background: rgba(251,146,60,0.10); color: var(--accent2);
    border: 1px solid rgba(251,146,60,0.25);
    border-radius: 50px; padding: 4px 14px; font-size: 12px; font-weight: 700;
    display: inline-flex; align-items: center; gap: 5px;
  }
  .sc-judge-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .sc-judge-card {
    border: 1px solid;
    border-radius: var(--radius-xs);
    padding: 10px 14px;
    min-width: 130px;
    font-size: 12px;
    font-family: 'Poppins', sans-serif;
  }
  .sc-judge-card-top { display: flex; justify-content: space-between; margin-bottom: 4px; font-weight: 700; align-items: center; }

  .sc-bottom-panel {
    height: 220px;
    border-top: 1px solid var(--border);
    background: var(--card);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }
  .sc-bottom-tabs {
    display: flex; border-bottom: 1px solid var(--border); flex-shrink: 0;
  }
  .sc-bottom-tab {
    padding: 10px 18px; font-size: 12px; font-weight: 600;
    font-family: 'Poppins', sans-serif;
    background: none; border: none; cursor: pointer;
    color: var(--text-muted);
    border-bottom: 2px solid transparent;
    transition: color 0.18s, border-color 0.18s;
    display: flex; align-items: center; gap: 6px;
  }
  .sc-bottom-tab.active { color: var(--accent1); border-bottom-color: var(--accent1); }
  .sc-bottom-content { flex: 1; padding: 14px 18px; overflow-y: auto; }

  .sc-custom-input-area {
    width: 100%; height: 100%;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius-xs); color: var(--text);
    font-size: 13px; font-family: 'JetBrains Mono', monospace;
    padding: 10px; resize: none; outline: none; box-sizing: border-box;
  }

  .sc-mysql-toolbar {
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(34,211,238,0.06); border-bottom: 1px solid rgba(34,211,238,0.15);
    color: var(--accent1); font-size: 12px; font-weight: 600;
    padding: 9px 18px; flex-shrink: 0; gap: 10px;
  }
  .sc-mysql-toolbar-left { display: flex; align-items: center; gap: 7px; }
  .sc-mysql-actions { display: flex; gap: 8px; flex-shrink: 0; }
  .sc-db-explorer-btn {
    background: rgba(34,211,238,0.10); color: var(--accent1);
    border: 1px solid rgba(34,211,238,0.25);
    border-radius: var(--radius-xs); padding: 5px 14px;
    cursor: pointer; font-size: 11px; font-weight: 700;
    font-family: 'Poppins', sans-serif;
    display: flex; align-items: center; gap: 5px;
  }
  .sc-db-reset-btn {
    background: rgba(239,68,68,0.10); color: #dc2626;
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: var(--radius-xs); padding: 5px 14px;
    cursor: pointer; font-size: 11px; font-weight: 700;
    font-family: 'Poppins', sans-serif;
    display: flex; align-items: center; gap: 5px;
  }
  .sc-db-explorer-panel {
    background: var(--bg); border-bottom: 1px solid var(--border);
    max-height: 200px; overflow-y: auto; flex-shrink: 0;
  }
  .sc-db-explorer-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 9px 18px; font-size: 12px; font-weight: 700; color: var(--text);
    border-bottom: 1px solid var(--border); background: var(--card);
    gap: 8px;
  }
  .sc-db-explorer-header-left { display: flex; align-items: center; gap: 6px; }
  .sc-db-explorer-body { padding: 12px 18px; }
  .sc-refresh-btn {
    background: none; border: 1px solid var(--border); border-radius: 5px;
    padding: 3px 12px; cursor: pointer; font-size: 11px;
    font-family: 'Poppins', sans-serif; color: var(--text-muted);
    display: flex; align-items: center; gap: 4px;
  }

  .sc-lang-banner {
    font-size: 12px; font-weight: 600;
    padding: 9px 18px; flex-shrink: 0; border-bottom: 1px solid;
    display: flex; align-items: center; gap: 7px;
  }

  .sc-run-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.50);
    z-index: 9999; display: flex;
    align-items: center; justify-content: center;
  }
  .sc-run-overlay-box {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 36px 44px;
    display: flex; flex-direction: column;
    align-items: center; gap: 14px;
    box-shadow: var(--shadow-lg); min-width: 300px;
  }
  .sc-run-spinner {
    width: 44px; height: 44px;
    border: 4px solid var(--border);
    border-top-color: var(--accent1);
    border-radius: 50%;
    animation: sc-spin 0.8s linear infinite;
  }
  .sc-run-overlay-text { font-size: 15px; font-weight: 700; color: var(--text); font-family: 'Poppins', sans-serif; display: flex; align-items: center; gap: 8px; }
  .sc-run-overlay-sub  { font-size: 12px; color: var(--text-muted); }

  .sc-drawer-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 8888; display: flex;
    align-items: stretch; justify-content: flex-end;
  }
  .sc-drawer-panel {
    width: 370px;
    background: var(--card);
    box-shadow: -4px 0 30px rgba(0,0,0,0.15);
    display: flex; flex-direction: column; height: 100%;
    border-left: 1px solid var(--border);
  }
  .sc-drawer-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 18px 22px;
    border-bottom: 1px solid var(--border);
    background: var(--bg); flex-shrink: 0;
  }
  .sc-drawer-title { font-size: 14px; font-weight: 800; color: var(--text); display: flex; align-items: center; gap: 8px; }
  .sc-drawer-close {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted);
    padding: 4px; border-radius: 5px;
    display: flex; align-items: center; justify-content: center;
    transition: color 0.2s;
  }
  .sc-drawer-close:hover { color: var(--text); }
  .sc-drawer-body { flex: 1; overflow-y: auto; padding: 14px 0; }
  .sc-drawer-footer {
    padding: 14px 22px;
    border-top: 1px solid var(--border);
    flex-shrink: 0;
  }
  .sc-drawer-refresh {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius-xs); padding: 8px 0;
    cursor: pointer; font-size: 12px; font-weight: 700;
    font-family: 'Poppins', sans-serif; color: var(--text-muted);
    width: 100%;
    transition: background 0.18s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .sc-drawer-refresh:hover { background: var(--border); }
  .sc-drawer-loading {
    display: flex; align-items: center; gap: 12px;
    padding: 36px 22px; justify-content: center; color: var(--text-muted); font-size: 13px;
  }
  .sc-drawer-empty { text-align: center; padding: 56px 22px; }

  .sc-file-list { display: flex; flex-direction: column; gap: 4px; padding: 0 10px; }
  .sc-file-card {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 14px; border-radius: var(--radius-xs);
    border: 1px solid var(--border); cursor: pointer;
    background: var(--card); transition: background 0.15s, border-color 0.15s;
  }
  .sc-file-card:hover { background: var(--bg); border-color: rgba(34,211,238,0.25); }
  .sc-file-card-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .sc-file-icon { flex-shrink: 0; display: flex; align-items: center; }
  .sc-file-name {
    font-size: 13px; font-weight: 700; color: var(--text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;
  }
  .sc-file-meta { display: flex; gap: 8px; align-items: center; margin-top: 3px; }
  .sc-file-lang-badge {
    font-size: 10px; background: rgba(34,211,238,0.08); color: var(--accent1);
    border: 1px solid rgba(34,211,238,0.20); border-radius: 50px;
    padding: 2px 8px; font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    display: inline-flex; align-items: center; gap: 4px;
  }
  .sc-file-date { font-size: 10px; color: var(--text-muted); display: flex; align-items: center; gap: 3px; }
  .sc-file-delete {
    background: none; border: none; cursor: pointer;
    padding: 4px 6px; border-radius: 5px; flex-shrink: 0; opacity: 0.5;
    transition: opacity 0.2s; display: flex; align-items: center; color: #dc2626;
  }
  .sc-file-delete:hover { opacity: 1; }

  .sc-save-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 8888; display: flex;
    align-items: center; justify-content: center;
  }
  .sc-save-modal {
    width: 380px; background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); box-shadow: var(--shadow-lg); overflow: hidden;
  }
  .sc-save-body { padding: 22px 22px 16px; }
  .sc-save-label {
    font-size: 10px; font-weight: 700; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 8px;
  }
  .sc-save-input {
    width: 100%; border: 1px solid var(--border); border-radius: var(--radius-xs);
    padding: 10px 14px; font-size: 13px; font-family: 'Poppins', sans-serif;
    color: var(--text); outline: none; box-sizing: border-box;
    background: var(--bg); transition: border-color 0.2s, box-shadow 0.2s;
  }
  .sc-save-input:focus {
    border-color: var(--accent1);
    box-shadow: 0 0 0 3px rgba(34,211,238,0.12);
  }
  .sc-save-error { color: #dc2626; font-size: 12px; margin-top: 7px; font-weight: 500; display: flex; align-items: center; gap: 5px; }
  .sc-save-meta-row { display: flex; gap: 12px; align-items: center; margin-top: 12px; }
  .sc-save-footer {
    display: flex; gap: 10px; padding: 14px 22px 20px;
    justify-content: flex-end;
  }
  .sc-save-cancel {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius-xs); padding: 8px 20px; cursor: pointer;
    font-size: 12px; font-weight: 700; font-family: 'Poppins', sans-serif;
    color: var(--text-muted);
  }
  .sc-save-confirm {
    background: var(--accent1); color: #0a0a0a;
    border: none; border-radius: var(--radius-xs);
    padding: 8px 20px; cursor: pointer;
    font-size: 12px; font-weight: 700; font-family: 'Poppins', sans-serif;
    transition: opacity 0.2s; display: flex; align-items: center; gap: 6px;
  }
  .sc-save-confirm:hover { opacity: 0.85; }
`;

if (!document.getElementById("sc-styles")) {
  const tag = document.createElement("style");
  tag.id = "sc-styles";
  tag.textContent = STYLES;
  document.head.appendChild(tag);
}

const LANGUAGES = ["JAVA", "PYTHON", "JAVASCRIPT", "MYSQL", "BASH"];

/* ── Language icons using Lucide ── */
const LangIcon = ({ lang, size = 12 }) => {
  const props = { size, strokeWidth: 2.2 };
  switch (lang) {
    case "JAVA":       return <Coffee {...props} />;
    case "PYTHON":     return <Code2 {...props} />;
    case "JAVASCRIPT": return <Braces {...props} />;
    case "MYSQL":      return <Database {...props} />;
    case "BASH":       return <Terminal {...props} />;
    default:           return <FileCode2 {...props} />;
  }
};

const LANG_LABEL = {
  JAVA:       "Java",
  PYTHON:     "Python",
  JAVASCRIPT: "JS",
  MYSQL:      "MySQL",
  BASH:       "Bash",
};

/* ── File icon by language ── */
const FileIcon = ({ lang }) => {
  const size = 22;
  switch (lang) {
    case "JAVA":       return <Coffee size={size} color="#f97316" strokeWidth={1.8} />;
    case "PYTHON":     return <Code2 size={size} color="#3b82f6" strokeWidth={1.8} />;
    case "JAVASCRIPT": return <Braces size={size} color="#eab308" strokeWidth={1.8} />;
    case "MYSQL":      return <Database size={size} color="#22d3ee" strokeWidth={1.8} />;
    case "BASH":       return <Terminal size={size} color="#34d399" strokeWidth={1.8} />;
    default:           return <FileText size={size} color="#94a3b8" strokeWidth={1.8} />;
  }
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
CREATE TABLE IF NOT EXISTS students (
    id     INT PRIMARY KEY AUTO_INCREMENT,
    name   VARCHAR(100) NOT NULL,
    age    INT,
    course VARCHAR(100)
);

INSERT INTO students (name, age, course) VALUES
    ('Alice', 20, 'Java'),
    ('Bob',   22, 'Python'),
    ('Carol', 21, 'MySQL');

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
echo "=== Math ==="
echo "5 + 3 = $((5 + 3))"
echo "10 * 4 = $((10 * 4))"`,
};

const NO_INPUT_LANGS = ["MYSQL", "BASH"];

const isDarkMode = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

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
  const [mysqlTables, setMysqlTables] = useState(null);
  const [mysqlStateLoading, setMysqlStateLoading] = useState(false);
  const [showDbExplorer, setShowDbExplorer] = useState(false);
  const [showMyFiles, setShowMyFiles] = useState(false);
  const [myFiles, setMyFiles] = useState([]);
  const [myFilesLoading, setMyFilesLoading] = useState(false);
  const [studentEmail, setStudentEmail] = useState(null);
  const [saveFileModal, setSaveFileModal] = useState(false);
  const [saveFileName, setSaveFileName] = useState("");
  const [saveFileLoading, setSaveFileLoading] = useState(false);
  const [saveFileError, setSaveFileError] = useState("");
  const [dark, setDark] = useState(isDarkMode);

  const textareaRef = useRef(null);

  useEffect(() => {
    const observer = new MutationObserver(() => setDark(isDarkMode()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

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

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await codeFilesAPI.getProfile();
        setStudentEmail(res?.data?.email || null);
      } catch {}
    };
    fetchEmail();
  }, []);

  useEffect(() => { if (batchId) fetchProblems(); }, [batchId]);
  useEffect(() => { if (tab === "history" && batchId) fetchHistory(); }, [tab, batchId]);

  const fetchProblems = async () => {
    try { const res = await getStudentProblems(batchId); setProblems(res.data || []); }
    catch { setProblems([]); }
  };

  const fetchHistory = async () => {
    try { const res = await getMyCodeSubmissions(batchId); setHistory(res.data || []); }
    catch { setHistory([]); }
  };

  const fetchMySQLState = async () => {
    setMysqlStateLoading(true);
    try { const res = await getMySQLState(); setMysqlTables(res.data); }
    catch { setMysqlTables({ output: "Could not fetch database state.", status: "RUNTIME_ERROR" }); }
    finally { setMysqlStateLoading(false); }
  };

  const handleMySQLReset = async () => {
    if (!window.confirm("⚠️ This will DROP your entire database and all tables.\n\nAre you sure?")) return;
    setRunLoading(true); setOutput(null);
    try { const res = await resetMySQLDatabase(); setOutput(res.data); setMysqlTables(null); setShowDbExplorer(false); }
    catch (e) { setOutput({ output: e.response?.data?.message || "Reset failed.", status: "RUNTIME_ERROR" }); }
    finally { setRunLoading(false); }
  };

  const fetchMyFiles = async () => {
    if (!batchId) return;
    setMyFilesLoading(true);
    try { const res = await codeFilesAPI.getAll(studentEmail, batchId); setMyFiles(res.data || []); }
    catch { setMyFiles([]); }
    finally { setMyFilesLoading(false); }
  };

  const handleOpenMyFiles = () => { setShowMyFiles(true); fetchMyFiles(); };

  const handleLoadFile = async (file) => {
    try {
      const res = await codeFilesAPI.getById(file.id);
      const f = res.data;
      const lang = (f.language || file.language || language).toUpperCase();
      setLanguage(lang); setCode(f.code || f.content || "");
      setOutput(null); setJudgeResult(null); setShowMyFiles(false);
    } catch { alert("Could not load file."); }
  };

  const handleDeleteFile = async (fileId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this file?")) return;
    try { await codeFilesAPI.delete(fileId); setMyFiles((prev) => prev.filter((f) => f.id !== fileId)); }
    catch { alert("Could not delete file."); }
  };

  const handleSaveFile = async () => {
    const trimmed = saveFileName.trim();
    if (!trimmed) { setSaveFileError("File name is required."); return; }
    setSaveFileLoading(true); setSaveFileError("");
    try {
      await codeFilesAPI.save({ fileName: trimmed, language, code, batchId, ...(studentEmail ? { studentEmail } : {}) });
      setSaveFileModal(false); setSaveFileName("");
    } catch (e) { setSaveFileError(e.response?.data?.message || "Save failed. Please try again."); }
    finally { setSaveFileLoading(false); }
  };

  const openProblem = async (problemId) => {
    setProblemLoading(true);
    try {
      const res = await getStudentProblemById(problemId);
      setSelectedProblem(res.data); setCode(DEFAULT_CODE[language]);
      setOutput(null); setJudgeResult(null); setMode("editor"); setTab("editor");
    } catch { alert("Could not load problem."); }
    finally { setProblemLoading(false); }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang); setCode(DEFAULT_CODE[lang]);
    setOutput(null); setJudgeResult(null);
    if (NO_INPUT_LANGS.includes(lang)) setShowCustomInput(false);
    if (lang !== "MYSQL") { setShowDbExplorer(false); setMysqlTables(null); }
  };

  const handleRunCode = async () => {
    setRunLoading(true); setOutput(null); setJudgeResult(null);
    try {
      let stdinInput = "";
      if (!NO_INPUT_LANGS.includes(language)) {
        stdinInput = mode === "playground" ? customInput : selectedProblem?.sampleInput || "";
      }
      const res = await runCode(batchId, language, code, stdinInput);
      setOutput(res.data);
    } catch (e) { setOutput({ output: e.response?.data?.message || "Run failed.", status: "RUNTIME_ERROR" }); }
    finally { setRunLoading(false); }
  };

  const handleSubmit = async () => {
    if (!selectedProblem) return;
    setLoading(true); setJudgeResult(null); setOutput(null);
    try { const res = await submitCodeForJudge(selectedProblem.id, batchId, language, code); setJudgeResult(res.data); }
    catch { setJudgeResult({ overallVerdict: "ERROR", marksObtained: 0, totalMarks: 0 }); }
    finally { setLoading(false); }
  };

  const handleTabKey = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart; const end = ta.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 4; }, 0);
    }
  };

  const verdictColor = (v) => v === "ACCEPTED" ? "#16a34a" : v === "PARTIAL" ? "#d97706" : "#dc2626";
  const diffClass = (d) => d === "EASY" ? "sc-badge-diff-easy" : d === "MEDIUM" ? "sc-badge-diff-medium" : "sc-badge-diff-hard";
  const statusColor = (s) => s === "SUCCESS" ? "#16a34a" : s === "COMPILE_ERROR" ? "#d97706" : "#dc2626";
  const statusBg = (s) => s === "SUCCESS" ? "rgba(52,211,153,0.10)" : s === "COMPILE_ERROR" ? "rgba(251,146,60,0.10)" : "rgba(239,68,68,0.10)";

  const rootClass = `sc-root${dark ? " sc-dark" : ""}`;

  /* ── Sub-components ── */
  const MySQLToolbar = () => (
    <>
      <div className="sc-mysql-toolbar">
        <div className="sc-mysql-toolbar-left">
          <Database size={14} strokeWidth={2} />
          <strong>MySQL</strong>
          <span style={{ fontWeight: 400, opacity: 0.8 }}>— Your database persists across runs. CREATE once, INSERT/SELECT in separate runs.</span>
        </div>
        <div className="sc-mysql-actions">
          <button className="sc-db-explorer-btn" onClick={() => { const next = !showDbExplorer; setShowDbExplorer(next); if (next) fetchMySQLState(); }}>
            <Table2 size={12} strokeWidth={2} />
            {showDbExplorer ? "Hide Tables" : "Show Tables"}
          </button>
          <button className="sc-db-reset-btn" onClick={handleMySQLReset}>
            <RotateCcw size={12} strokeWidth={2} />
            Reset DB
          </button>
        </div>
      </div>
      {showDbExplorer && (
        <div className="sc-db-explorer-panel">
          <div className="sc-db-explorer-header">
            <span className="sc-db-explorer-header-left">
              <Table2 size={13} strokeWidth={2} /> Your Tables
            </span>
            <button className="sc-refresh-btn" onClick={fetchMySQLState} disabled={mysqlStateLoading}>
              <RefreshCw size={11} strokeWidth={2} />
              {mysqlStateLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
          <div className="sc-db-explorer-body">
            {mysqlStateLoading ? (
              <span style={{ color: "var(--text-muted)", fontSize: 12 }}>Loading...</span>
            ) : mysqlTables ? (
              <pre className="sc-sql-output-pre">{mysqlTables.output || "No tables found."}</pre>
            ) : (
              <span style={{ color: "var(--text-muted)", fontSize: 12 }}>Click Refresh to see your tables.</span>
            )}
          </div>
        </div>
      )}
    </>
  );

  const RunLoadingOverlay = () => (
    <div className="sc-run-overlay">
      <div className="sc-run-overlay-box">
        <div className="sc-run-spinner" />
        <div className="sc-run-overlay-text">
          {language === "MYSQL"
            ? <><Database size={16} strokeWidth={2} /> Running SQL on your database...</>
            : language === "BASH"
            ? <><Terminal size={16} strokeWidth={2} /> Executing shell script...</>
            : <><Play size={16} strokeWidth={2} /> Running code...</>}
        </div>
        <div className="sc-run-overlay-sub">
          {language === "MYSQL"
            ? "Your data will persist after this run"
            : language === "BASH"
            ? "Running in sandbox environment"
            : "Please wait..."}
        </div>
      </div>
    </div>
  );

  const MyFilesDrawer = () => (
    <div className="sc-drawer-overlay" onClick={() => setShowMyFiles(false)}>
      <div className="sc-drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="sc-drawer-header">
          <span className="sc-drawer-title"><FolderOpen size={16} strokeWidth={2} /> My Saved Files</span>
          <button className="sc-drawer-close" onClick={() => setShowMyFiles(false)}><X size={16} strokeWidth={2} /></button>
        </div>
        <div className="sc-drawer-body">
          {myFilesLoading ? (
            <div className="sc-drawer-loading">
              <div className="sc-spinner" />
              <span>Loading files...</span>
            </div>
          ) : myFiles.length === 0 ? (
            <div className="sc-drawer-empty">
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10, opacity: 0.4 }}>
                <FolderOpen size={40} strokeWidth={1.5} />
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>No saved files yet.</div>
              <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 6, opacity: 0.7 }}>
                Use the Save button in the editor to save your code.
              </div>
            </div>
          ) : (
            <div className="sc-file-list">
              {myFiles.map((file) => (
                <div key={file.id} className="sc-file-card" onClick={() => handleLoadFile(file)}>
                  <div className="sc-file-card-left">
                    <span className="sc-file-icon">
                      <FileIcon lang={file.language} />
                    </span>
                    <div>
                      <div className="sc-file-name">{file.fileName || file.name}</div>
                      <div className="sc-file-meta">
                        <span className="sc-file-lang-badge">
                          <LangIcon lang={file.language} size={10} />
                          {file.language}
                        </span>
                        {file.updatedAt && (
                          <span className="sc-file-date">
                            <Clock size={10} strokeWidth={2} />
                            {new Date(file.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="sc-file-delete" onClick={(e) => handleDeleteFile(file.id, e)} title="Delete file">
                    <Trash2 size={15} strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="sc-drawer-footer">
          <button className="sc-drawer-refresh" onClick={fetchMyFiles} disabled={myFilesLoading}>
            <RefreshCw size={13} strokeWidth={2} /> Refresh
          </button>
        </div>
      </div>
    </div>
  );

  const SaveFileModal = () => (
    <div className="sc-save-modal-overlay" onClick={() => { setSaveFileModal(false); setSaveFileName(""); setSaveFileError(""); }}>
      <div className="sc-save-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sc-drawer-header">
          <span className="sc-drawer-title"><Save size={16} strokeWidth={2} /> Save File</span>
          <button className="sc-drawer-close" onClick={() => { setSaveFileModal(false); setSaveFileName(""); setSaveFileError(""); }}>
            <X size={16} strokeWidth={2} />
          </button>
        </div>
        <div className="sc-save-body">
          <div className="sc-save-label">File Name</div>
          <input
            className="sc-save-input"
            value={saveFileName}
            onChange={(e) => { setSaveFileName(e.target.value); setSaveFileError(""); }}
            placeholder="e.g. bubble_sort.py"
            autoFocus
            onKeyDown={(e) => { if (e.key === "Enter") handleSaveFile(); }}
          />
          {saveFileError && (
            <div className="sc-save-error">
              <AlertTriangle size={12} strokeWidth={2} /> {saveFileError}
            </div>
          )}
          <div className="sc-save-meta-row">
            <span className="sc-file-lang-badge">
              <LangIcon lang={language} size={10} />
              {LANG_LABEL[language]}
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{code.split("\n").length} lines</span>
          </div>
        </div>
        <div className="sc-save-footer">
          <button className="sc-save-cancel" onClick={() => { setSaveFileModal(false); setSaveFileName(""); setSaveFileError(""); }}>Cancel</button>
          <button className="sc-save-confirm" onClick={handleSaveFile} disabled={saveFileLoading}>
            {saveFileLoading
              ? <><Loader2 size={13} strokeWidth={2} style={{ animation: "sc-spin 0.8s linear infinite" }} /> Saving...</>
              : <><Save size={13} strokeWidth={2} /> Save</>}
          </button>
        </div>
      </div>
    </div>
  );

  /* ── Loading screens ── */
  if (batchLoading) {
    return (
      <div className={rootClass}>
        <div className="sc-loading-screen">
          <div className="sc-spinner" />
          <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (batchError || !batchId) {
    return (
      <div className={rootClass}>
        <div className="sc-loading-screen">
          <AlertTriangle size={36} color="#dc2626" strokeWidth={1.8} />
          <p style={{ color: "#dc2626", fontSize: 14, margin: 0 }}>Could not load your batch. Please contact your trainer.</p>
        </div>
      </div>
    );
  }

  /* ── Lang toggle shared ── */
  const LangToggle = () => (
    <div className="sc-lang-toggle">
      {LANGUAGES.map((l) => (
        <button key={l} className={`sc-lang-btn${language === l ? " active" : ""}`} onClick={() => handleLanguageChange(l)}>
          <LangIcon lang={l} size={12} />
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );

  /* ── Output section shared ── */
  const OutputSection = ({ isPlayground }) => (
    <>
      {runLoading && (
        <div className="sc-output-running">
          <div className="sc-spinner-sm" />
          <span>
            {language === "MYSQL" ? "Running SQL on your database..." : language === "BASH" ? "Executing shell script..." : "Running code..."}
          </span>
        </div>
      )}
      {!output && !runLoading && (
        <div className="sc-output-placeholder">
          <Terminal size={14} strokeWidth={2} style={{ opacity: 0.5 }} />
          {isPlayground
            ? "Run your code to see output here"
            : <>Click <strong>Run</strong> to test, or <strong>Submit</strong> to judge against all test cases.</>}
        </div>
      )}
      {output && !runLoading && (
        <div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <span className="sc-status-chip" style={{ background: statusBg(output.status), color: statusColor(output.status) }}>
              {output.status === "SUCCESS"
                ? <CheckCircle2 size={11} strokeWidth={2.5} />
                : <XCircle size={11} strokeWidth={2.5} />}
              {output.status}
            </span>
            {output.executionTimeMs && (
              <span className="sc-exec-time">
                <Clock size={11} strokeWidth={2} />
                {output.executionTimeMs}ms
              </span>
            )}
          </div>
          <pre className={language === "MYSQL" ? "sc-sql-output-pre" : "sc-output-pre"}>
            {output.output || "(no output)"}
          </pre>
        </div>
      )}
    </>
  );

  /* ── PLAYGROUND MODE ── */
  if (mode === "playground") {
    return (
      <div className={rootClass}>
        {runLoading && <RunLoadingOverlay />}
        {showMyFiles && <MyFilesDrawer />}
        {saveFileModal && <SaveFileModal />}

        <div className="sc-header">
          <div className="sc-header-left">
            <button className="sc-btn sc-btn-back" onClick={() => setMode("problems")}>
              <ChevronLeft size={14} strokeWidth={2.5} /> Back
            </button>
            <div className="sc-logo-wrap">
              <span className="sc-logo-icon"><Code2 size={20} strokeWidth={2.5} /></span>
              <span className="sc-logo-text">CodeLab</span>
            </div>
            <span className="sc-badge sc-badge-play">
              <Gamepad2 size={10} strokeWidth={2.5} /> Playground
            </span>
          </div>
          <div className="sc-header-right">
            <LangToggle />
            <button className="sc-btn sc-btn-files" onClick={handleOpenMyFiles}>
              <FolderOpen size={13} strokeWidth={2} /> My Files
            </button>
            <button className="sc-btn sc-btn-save" onClick={() => { setSaveFileName(""); setSaveFileError(""); setSaveFileModal(true); }}>
              <Save size={13} strokeWidth={2} /> Save
            </button>
            <button className="sc-btn sc-btn-run-primary" onClick={handleRunCode} disabled={runLoading}>
              {runLoading
                ? <><span className="sc-spinner-sm" /> Running...</>
                : <><Play size={13} strokeWidth={2.5} fill="currentColor" /> Run Code</>}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)", overflow: "hidden" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {language === "MYSQL" && <MySQLToolbar />}
            {language === "BASH" && (
              <div className="sc-lang-banner" style={{ background: "rgba(52,211,153,0.06)", borderColor: "rgba(52,211,153,0.20)", color: "var(--accent3)" }}>
                <Terminal size={13} strokeWidth={2} />
                <strong>Bash Mode</strong> — Your script runs in a sandboxed shell environment.
              </div>
            )}
            <div className="sc-editor-area-wrap">
              <div className="sc-line-numbers">
                {code.split("\n").map((_, i) => <div key={i} className="sc-line-num">{i + 1}</div>)}
              </div>
              <textarea
                ref={textareaRef}
                className={`sc-code-textarea${language === "MYSQL" ? " sc-sql-textarea" : ""}`}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleTabKey}
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
                placeholder={language === "MYSQL" ? "-- Write your SQL here..." : language === "BASH" ? "#!/bin/bash\n# Write your shell script here..." : "// Start coding here..."}
              />
            </div>

            <div className="sc-bottom-panel">
              <div className="sc-bottom-tabs">
                <button className={`sc-bottom-tab${!showCustomInput ? " active" : ""}`} onClick={() => setShowCustomInput(false)}>
                  <Terminal size={13} strokeWidth={2} /> Output
                </button>
                {!NO_INPUT_LANGS.includes(language) && (
                  <button className={`sc-bottom-tab${showCustomInput ? " active" : ""}`} onClick={() => setShowCustomInput(true)}>
                    <PanelLeft size={13} strokeWidth={2} /> Custom Input
                  </button>
                )}
              </div>
              <div className="sc-bottom-content">
                {showCustomInput ? (
                  <textarea
                    className="sc-custom-input-area"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter custom input here (stdin)..."
                  />
                ) : (
                  <OutputSection isPlayground />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── PROBLEMS / HISTORY MODE ── */
  if (mode === "problems") {
    return (
      <div className={rootClass}>
        {showMyFiles && <MyFilesDrawer />}
        {saveFileModal && <SaveFileModal />}

        <div className="sc-header">
          <div className="sc-header-left">
            <div className="sc-logo-wrap">
              <span className="sc-logo-icon"><Code2 size={20} strokeWidth={2.5} /></span>
              <span className="sc-logo-text">CodeLab</span>
            </div>
            <span className="sc-badge sc-badge-student">
              <User size={9} strokeWidth={2.5} /> Student
            </span>
            <span className="sc-badge sc-badge-batch">
              <Hash size={9} strokeWidth={2.5} /> Batch: {batchId}
            </span>
          </div>
          <div className="sc-nav-tabs">
            <button className={`sc-nav-tab${tab === "problems" ? " active" : ""}`} onClick={() => setTab("problems")}>
              <LayoutGrid size={13} strokeWidth={2} /> Problems
            </button>
            <button className={`sc-nav-tab${tab === "history" ? " active" : ""}`} onClick={() => setTab("history")}>
              <History size={13} strokeWidth={2} /> History
            </button>
          </div>
          <div className="sc-header-right">
            <button className="sc-btn sc-btn-files" onClick={handleOpenMyFiles}>
              <FolderOpen size={13} strokeWidth={2} /> My Files
            </button>
            <button className="sc-btn sc-btn-play" onClick={() => { setMode("playground"); setCode(DEFAULT_CODE[language]); setOutput(null); setJudgeResult(null); }}>
              <Gamepad2 size={13} strokeWidth={2} /> Playground
            </button>
          </div>
        </div>

        <div className="sc-main">
          {tab === "problems" && (
            <>
              <div className="sc-page-title">
                <span>Assigned Problems</span>
                <span className="sc-count-badge">{problems.length} Problems</span>
              </div>
              {problems.length === 0 ? (
                <div className="sc-empty">
                  <div className="sc-empty-icon"><BookOpen size={52} strokeWidth={1.2} /></div>
                  <p className="sc-empty-text">No problems assigned yet.</p>
                </div>
              ) : (
                <div className="sc-problem-grid">
                  {problems.map((p, i) => (
                    <div key={p.id} className="sc-problem-card">
                      <div className="sc-problem-card-header">
                        <span className="sc-problem-index">
                          <Hash size={10} strokeWidth={2.5} />{i + 1}
                        </span>
                        <span className={`sc-badge ${diffClass(p.difficulty)}`}>{p.difficulty}</span>
                      </div>
                      <div className="sc-problem-title">{p.title}</div>
                      <div className="sc-problem-desc">
                        {p.description?.slice(0, 110)}{p.description?.length > 110 ? "..." : ""}
                      </div>
                      <div className="sc-problem-footer">
                        <div className="sc-problem-meta">
                          <span className="sc-chip-marks"><Trophy size={11} strokeWidth={2} /> {p.totalMarks} pts</span>
                          <span className="sc-chip-tests"><FlaskConical size={11} strokeWidth={2} /> {p.visibleTestCases?.length || 0} tests</span>
                        </div>
                        <button className="sc-btn sc-btn-solve" onClick={() => openProblem(p.id)} disabled={problemLoading}>
                          {problemLoading ? "..." : <><Play size={11} strokeWidth={2.5} fill="currentColor" /> Solve</>}
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
              <div className="sc-page-title">
                <span>My Submissions</span>
                <span className="sc-count-badge">{history.length} runs</span>
              </div>
              {history.length === 0 ? (
                <div className="sc-empty">
                  <div className="sc-empty-icon"><History size={52} strokeWidth={1.2} /></div>
                  <p className="sc-empty-text">No submissions yet.</p>
                </div>
              ) : (
                <div className="sc-history-list">
                  {history.map((h) => (
                    <div
                      key={h.submissionId}
                      className={`sc-history-card${activeHistoryItem === h.submissionId ? " open" : ""}`}
                      onClick={() => setActiveHistoryItem(activeHistoryItem === h.submissionId ? null : h.submissionId)}
                    >
                      <div className="sc-history-row">
                        <span className="sc-history-lang">
                          <LangIcon lang={h.language} size={11} />
                          {h.language}
                        </span>
                        <span className="sc-status-chip" style={{ background: statusBg(h.status), color: statusColor(h.status), fontSize: 11, padding: "3px 12px", borderRadius: 50 }}>
                          {h.status === "SUCCESS"
                            ? <CheckCircle2 size={10} strokeWidth={2.5} />
                            : <XCircle size={10} strokeWidth={2.5} />}
                          {h.status}
                        </span>
                        <span className="sc-history-time">
                          <Clock size={11} strokeWidth={2} />
                          {new Date(h.timestamp).toLocaleString()}
                        </span>
                        <span className="sc-history-ms">
                          <Cpu size={11} strokeWidth={2} />
                          {h.executionTimeMs}ms
                        </span>
                        <span className="sc-expand-icon">
                          {activeHistoryItem === h.submissionId
                            ? <ChevronUp size={14} strokeWidth={2} />
                            : <ChevronDown size={14} strokeWidth={2} />}
                        </span>
                      </div>
                      {activeHistoryItem === h.submissionId && (
                        <div className="sc-history-body">
                          <div className="sc-history-out-label">
                            <Terminal size={11} strokeWidth={2} /> Output
                          </div>
                          <pre className={h.language === "MYSQL" ? "sc-sql-output-pre" : "sc-output-pre"}>
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

  /* ── EDITOR MODE ── */
  return (
    <div className={rootClass}>
      {runLoading && <RunLoadingOverlay />}
      {showMyFiles && <MyFilesDrawer />}
      {saveFileModal && <SaveFileModal />}

      <div className="sc-header">
        <div className="sc-header-left">
          <button className="sc-btn sc-btn-back" onClick={() => { setMode("problems"); setTab("problems"); }}>
            <ChevronLeft size={14} strokeWidth={2.5} /> Problems
          </button>
          <div className="sc-logo-wrap">
            <span className="sc-logo-icon"><Code2 size={20} strokeWidth={2.5} /></span>
            <span className="sc-logo-text">CodeLab</span>
          </div>
          {selectedProblem && (
            <span className={`sc-badge ${diffClass(selectedProblem.difficulty)}`}>{selectedProblem.difficulty}</span>
          )}
        </div>
        <div className="sc-header-right">
          <LangToggle />
          <button className="sc-btn sc-btn-files" onClick={handleOpenMyFiles}>
            <FolderOpen size={13} strokeWidth={2} /> My Files
          </button>
          <button className="sc-btn sc-btn-save" onClick={() => { setSaveFileName(""); setSaveFileError(""); setSaveFileModal(true); }}>
            <Save size={13} strokeWidth={2} /> Save
          </button>
          <button className="sc-btn sc-btn-run" onClick={handleRunCode} disabled={runLoading}>
            {runLoading
              ? <><span className="sc-spinner-sm" /> Running...</>
              : <><Play size={13} strokeWidth={2.5} fill="currentColor" /> Run</>}
          </button>
          {selectedProblem && (
            <button className="sc-btn sc-btn-submit" onClick={handleSubmit} disabled={loading}>
              {loading
                ? <><span className="sc-spinner-sm" style={{ borderTopColor: "#fff" }} /> Judging...</>
                : <><Zap size={13} strokeWidth={2.5} fill="currentColor" /> Submit</>}
            </button>
          )}
        </div>
      </div>

      <div className="sc-editor-layout" style={{ height: "calc(100vh - 60px)" }}>
        {/* Problem Panel */}
        <div className="sc-problem-panel">
          {selectedProblem ? (
            <div className="sc-problem-detail">
              <h2 className="sc-problem-detail-title">{selectedProblem.title}</h2>
              <div className="sc-info-row">
                <span className={`sc-badge ${diffClass(selectedProblem.difficulty)}`}>{selectedProblem.difficulty}</span>
                <span className="sc-chip-marks"><Trophy size={11} strokeWidth={2} /> {selectedProblem.totalMarks} pts</span>
              </div>

              <Section label="Description" icon={<BookOpen size={10} strokeWidth={2.5} />}>
                <p className="sc-desc-text">{selectedProblem.description}</p>
              </Section>
              {selectedProblem.inputFormat && (
                <Section label="Input Format" icon={<PanelLeft size={10} strokeWidth={2.5} />}>
                  <p className="sc-desc-text">{selectedProblem.inputFormat}</p>
                </Section>
              )}
              {selectedProblem.outputFormat && (
                <Section label="Output Format" icon={<Terminal size={10} strokeWidth={2.5} />}>
                  <p className="sc-desc-text">{selectedProblem.outputFormat}</p>
                </Section>
              )}
              {selectedProblem.constraints && (
                <Section label="Constraints" icon={<Cpu size={10} strokeWidth={2.5} />}>
                  <div className="sc-mono-block">{selectedProblem.constraints}</div>
                </Section>
              )}
              <div className="sc-io-grid">
                {selectedProblem.sampleInput && (
                  <div className="sc-io-box">
                    <div className="sc-io-label">
                      <Eye size={10} strokeWidth={2} /> Sample Input
                    </div>
                    <pre className="sc-io-content">{selectedProblem.sampleInput}</pre>
                  </div>
                )}
                {selectedProblem.sampleOutput && (
                  <div className="sc-io-box">
                    <div className="sc-io-label">
                      <CheckCircle2 size={10} strokeWidth={2} /> Sample Output
                    </div>
                    <pre className="sc-io-content">{selectedProblem.sampleOutput}</pre>
                  </div>
                )}
              </div>
              {selectedProblem.visibleTestCases?.filter((tc) => !tc.isHidden).length > 0 && (
                <Section label="Sample Test Cases" icon={<FlaskConical size={10} strokeWidth={2.5} />}>
                  {selectedProblem.visibleTestCases.filter((tc) => !tc.isHidden).map((tc, i) => (
                    <div key={tc.id} className="sc-test-case">
                      <div className="sc-test-case-label">
                        <Hash size={10} strokeWidth={2.5} /> Case {i + 1}
                      </div>
                      {tc.input && (
                        <div className="sc-test-row">
                          <span className="sc-test-key">Input</span>
                          <code className="sc-test-val">{tc.input}</code>
                        </div>
                      )}
                      <div className="sc-test-row">
                        <span className="sc-test-key">Expected</span>
                        <code className="sc-test-val">{tc.expectedOutput}</code>
                      </div>
                    </div>
                  ))}
                </Section>
              )}
            </div>
          ) : (
            <div className="sc-no-problem">
              <LayoutGrid size={44} strokeWidth={1.5} style={{ opacity: 0.3 }} />
              <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>Select a problem to start solving</p>
              <button className="sc-btn sc-btn-solve" onClick={() => { setMode("problems"); setTab("problems"); }}>
                <LayoutGrid size={12} strokeWidth={2} /> Browse Problems
              </button>
            </div>
          )}
        </div>

        {/* Editor Panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {language === "MYSQL" && <MySQLToolbar />}
          {language === "BASH" && (
            <div className="sc-lang-banner" style={{ background: "rgba(52,211,153,0.06)", borderColor: "rgba(52,211,153,0.20)", color: "var(--accent3)" }}>
              <Terminal size={13} strokeWidth={2} />
              <strong>Bash Mode</strong> — Runs in a sandboxed shell environment.
            </div>
          )}
          <div className="sc-editor-area-wrap">
            <div className="sc-line-numbers">
              {code.split("\n").map((_, i) => <div key={i} className="sc-line-num">{i + 1}</div>)}
            </div>
            <textarea
              ref={textareaRef}
              className={`sc-code-textarea${language === "MYSQL" ? " sc-sql-textarea" : ""}`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleTabKey}
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div className="sc-output-panel">
            {!judgeResult ? (
              <OutputSection isPlayground={false} />
            ) : (
              <div>
                <div className="sc-judge-header">
                  <span className="sc-verdict-big" style={{ color: verdictColor(judgeResult.overallVerdict) }}>
                    {judgeResult.overallVerdict === "ACCEPTED"
                      ? <CheckCircle2 size={18} strokeWidth={2.5} />
                      : <XCircle size={18} strokeWidth={2.5} />}
                    {judgeResult.overallVerdict}
                  </span>
                  <span className="sc-score-chip">
                    <Trophy size={11} strokeWidth={2} />
                    {judgeResult.marksObtained}/{judgeResult.totalMarks} pts
                  </span>
                  <span className="sc-exec-time">
                    <FlaskConical size={11} strokeWidth={2} />
                    {judgeResult.testCasesPassed}/{judgeResult.totalTestCases} tests
                  </span>
                </div>
                <div className="sc-judge-grid">
                  {judgeResult.judgeResults?.map((r, i) => (
                    <div key={i} className="sc-judge-card" style={{ background: r.passed ? "rgba(52,211,153,0.08)" : "rgba(239,68,68,0.08)", borderColor: r.passed ? "rgba(52,211,153,0.25)" : "rgba(239,68,68,0.25)" }}>
                      <div className="sc-judge-card-top">
                        <span style={{ color: "var(--text)", display: "flex", alignItems: "center", gap: 4 }}>
                          <Hash size={10} strokeWidth={2.5} /> Test {i + 1}
                        </span>
                        <span style={{ color: r.passed ? "#16a34a" : "#dc2626", display: "flex", alignItems: "center", gap: 4 }}>
                          {r.passed
                            ? <CheckCircle2 size={12} strokeWidth={2.5} />
                            : <XCircle size={12} strokeWidth={2.5} />}
                          {r.verdict}
                        </span>
                      </div>
                      {!r.isHidden && r.actualOutput && (
                        <div style={{ marginTop: 5, fontSize: 12, color: "var(--text-muted)" }}>
                          <span style={{ fontWeight: 600 }}>Output: </span>
                          <code className="sc-test-val">{r.actualOutput}</code>
                        </div>
                      )}
                      {r.isHidden && (
                        <div style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
                          <EyeOff size={10} strokeWidth={2} /> Hidden test case
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

function Section({ label, icon, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div className="sc-section-label">
        {icon && icon}
        {label}
      </div>
      {children}
    </div>
  );
}
