import { useState, useEffect } from "react";
import {
  getMyProblems,
  createCodingProblem,
  updateCodingProblem,
  deleteCodingProblem,
  addTestCase,
  getTestCases,
  assignProblemToBatch,
  getAssignmentsByBatchForTrainer,
  unassignProblem,
  getBatchCodeSubmissions,
} from "../services/assessmentService";
import { getTrainerBatches } from "../services/batchService";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];

const emptyProblem = {
  title: "",
  description: "",
  inputFormat: "",
  outputFormat: "",
  constraints: "",
  sampleInput: "",
  sampleOutput: "",
  difficulty: "EASY",
  totalMarks: 10,
  testCases: [],
};
const emptyTC = {
  input: "",
  expectedOutput: "",
  isHidden: false,
  weightage: 1,
};

/* ─────────────────────────────────────────────
   Real (SVG) tab icons — replaces emoji so the
   header renders consistently on every device
   instead of falling back to a "dummy"/tofu box
   on systems without full emoji font support.
   ───────────────────────────────────────────── */
const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const IconProblems = () => (
  <svg {...iconProps}>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const IconCreate = () => (
  <svg {...iconProps}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="13" y2="17" />
  </svg>
);

const IconEdit = () => (
  <svg {...iconProps}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconAssign = () => (
  <svg {...iconProps}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconSubmissions = () => (
  <svg {...iconProps}>
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    <polyline points="9 15.5 11 17.5 15 12.5" />
  </svg>
);

/* Larger page-title icons (20px) — real SVG replacing the
   emoji that were rendering as blank "dummy" boxes on some
   devices (📋 📊 🎯 ➕ ✏️ 📌 🧪 🗑 ⚡). */
const titleIconProps = { ...iconProps, width: 20, height: 20 };

const IconTarget = () => (
  <svg {...titleIconProps}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const IconBarChart = () => (
  <svg {...titleIconProps}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const IconPlusCircle = () => (
  <svg {...titleIconProps}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const IconPencil = (props) => (
  <svg {...titleIconProps} {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const IconList = () => (
  <svg {...titleIconProps}>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const IconInfo = (props) => (
  <svg {...iconProps} width={15} height={15} {...props}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="11" x2="12" y2="16" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const IconFlask = (props) => (
  <svg {...iconProps} width={13} height={13} {...props}>
    <path d="M9 2v6.5L4 18a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3l-5-9.5V2" />
    <line x1="8" y1="2" x2="16" y2="2" />
    <line x1="6.5" y1="14" x2="17.5" y2="14" />
  </svg>
);

const IconTrash = (props) => (
  <svg {...iconProps} width={13} height={13} {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const IconBolt = (props) => (
  <svg {...iconProps} width={13} height={13} fill="currentColor" stroke="none" {...props}>
    <polygon points="13 2 3 14 11 14 9 22 21 10 13 10 13 2" />
  </svg>
);

/* ─────────────────────────────────────────────
   Responsive CSS — covers phones (iPhone/Pixel/
   Android, incl. small 320–375px widths), tablets
   (iPad, iPad Mini, Android tablets), laptops and
   desktops/Mac. Pure CSS, no layout logic changed.
   ───────────────────────────────────────────── */
const RESPONSIVE_CSS = `
  .clab-root { box-sizing: border-box; }
  .clab-root *, .clab-root *::before, .clab-root *::after { box-sizing: border-box; }

  .clab-header { flex-wrap: wrap; height: auto; min-height: 56px; row-gap: 8px; }
  .clab-headerLeft { flex-wrap: wrap; }
  .clab-tabs { flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: thin; max-width: 100%; }
  .clab-tabs::-webkit-scrollbar { height: 4px; }
  .clab-tabBtn { flex-shrink: 0; }
  .clab-tabIcon { display: inline-flex; align-items: center; }

  .clab-content { box-sizing: border-box; }

  .clab-table { width: 100%; }
  .clab-tableRow { flex-wrap: wrap; }

  .clab-formGrid { }
  .clab-pageTitle { flex-wrap: wrap; row-gap: 10px; }
  .clab-guideGrid { }
  .clab-tcRow { }
  .clab-tcControls { flex-wrap: wrap; row-gap: 10px; }
  .clab-card { }
  .clab-assignRow { }

  .clab-fieldRow > div { flex: 1 1 200px; min-width: 160px; }
  .clab-fieldRow > select { flex: 1 1 200px; min-width: 160px; }
  .clab-fieldRow > button { flex-shrink: 0; }

  .clab-modal { max-height: 90vh; overflow-y: auto; }

  /* ═════════════════════════════════════════════════
     BREAKPOINT MAP (mobile-first cascade, widest → narrowest)
     ≥1600  Large desktop / iMac / wide monitors
     1281–1600  Laptop / MacBook Pro-Air / standard desktop
     1025–1280  Small laptop / MacBook Air 13" / laptop windows
     835–1024   iPad / iPad Air / tablets landscape
     769–834    iPad Mini / tablets portrait
     681–768    Small tablets / large phones landscape (Pixel Fold outer etc.)
     481–680    Phones landscape / phablets (Pixel, Galaxy, iPhone Plus/Max landscape)
     391–480    Standard phones portrait (iPhone 12–16, Pixel 6–9, Galaxy S)
     361–390    Compact phones (iPhone SE 2/3, small Android)
     ≤360       Very small / older phones (Galaxy Fold cover, iPhone SE 1st gen)
     ═════════════════════════════════════════════════ */

  /* ── Large desktop / iMac / wide monitors ── */
  @media (min-width: 1600px) {
    .clab-content { max-width: 1320px !important; }
  }

  /* ── Laptops / MacBook Pro / Air / standard desktops ── */
  @media (max-width: 1280px) {
    .clab-content { max-width: 100% !important; padding: 24px 20px !important; }
  }

  /* ── Small laptops (MacBook Air 13", 1024–1120 windows) ── */
  @media (max-width: 1120px) {
    .clab-guideGrid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important; }
  }

  /* ── Tablets landscape (iPad, iPad Air/Pro landscape) ── */
  @media (max-width: 1024px) {
    .clab-header { padding: 10px 18px !important; }
    .clab-content { padding: 20px 16px !important; }
  }

  /* ── Tablets portrait (iPad, iPad Mini portrait) ── */
  @media (max-width: 834px) {
    .clab-formGrid { grid-template-columns: 1fr !important; }
    .clab-guideGrid { grid-template-columns: 1fr !important; }
    .clab-tabBtn { padding: 7px 12px !important; font-size: 12px !important; }
  }

  /* ── iPad Mini portrait / small tablets ── */
  @media (max-width: 768px) {
    .clab-card { padding: 18px !important; }
  }

  /* ── Large phones / small tablets landscape ── */
  @media (max-width: 680px) {
    .clab-header { justify-content: flex-start !important; gap: 10px; flex-wrap: wrap !important; }
    .clab-headerLeft { width: 100%; }

    /* Tab bar: icon-on-top, label-below, evenly spread across full width,
       active tab shown with an accent underline (matches target design) —
       no more horizontal icon-only scroll strip. */
    .clab-tabs {
      width: 100%;
      justify-content: space-between !important;
      gap: 0 !important;
      overflow-x: visible !important;
      border-top: 1px solid rgba(148,163,184,0.15);
      padding-top: 6px;
    }
    .clab-tabBtn {
      flex: 1 1 0 !important;
      flex-direction: column !important;
      gap: 6px !important;
      padding: 10px 4px 12px !important;
      background: transparent !important;
      border-radius: 0 !important;
      border-bottom: 3px solid transparent !important;
      font-size: 12px !important;
    }
    .clab-tabBtn.clab-tabActive {
      background: transparent !important;
      color: #f59e0b !important;
      border-bottom-color: #f59e0b !important;
      font-weight: 700 !important;
    }
    .clab-tabIcon svg { width: 22px !important; height: 22px !important; }

    .clab-content { padding: 16px 12px !important; }

    .clab-tableHead { display: none !important; }
    .clab-tableRow {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 6px !important;
      padding: 12px 14px !important;
    }
    .clab-tableRow > span { flex: unset !important; width: 100% !important; }
    .clab-tableRow > span[data-label]::before {
      content: attr(data-label);
      display: block;
      font-size: 10px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 2px;
    }
    .clab-rowActions { justify-content: flex-start !important; flex-wrap: wrap; }

    .clab-pageTitle { font-size: 20px !important; gap: 10px !important; justify-content: space-between !important; flex-wrap: nowrap !important; }
    .clab-pageTitle button { margin-left: 0 !important; flex-shrink: 0; }

    .clab-assignRow { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
    .clab-assignRow button { width: 100%; }

    .clab-tcRow { flex-direction: column !important; }
  }

  /* ── Phones portrait (iPhone 12–16, Pixel 6–9, Galaxy S) ── */
  @media (max-width: 480px) {
    .clab-content { padding: 14px 10px !important; }
    .clab-modal { width: 92% !important; padding: 20px !important; }
    .clab-fieldRow { flex-direction: column !important; align-items: stretch !important; }
    .clab-fieldRow > div, .clab-fieldRow > select, .clab-fieldRow > button { width: 100% !important; max-width: 100% !important; }
    .clab-formActions { justify-content: stretch !important; }
    .clab-formActions > button { flex: 1 1 auto; }

    .clab-guideGrid { grid-template-columns: 1fr !important; gap: 12px !important; }
    .clab-card { padding: 16px !important; }
    .clab-tcControls { flex-direction: column !important; align-items: stretch !important; }
    .clab-tcControls label, .clab-tcControls > div, .clab-tcControls > button, .clab-tcControls > input {
      width: 100% !important;
    }
  }

  /* ── Compact phones (iPhone SE 2/3, small Android, ~375px and below) ── */
  @media (max-width: 390px) {
    .clab-content { padding: 12px 8px !important; }
    .clab-pageTitle { font-size: 18px !important; }
    .clab-newBtn { padding: 8px 14px !important; font-size: 12px !important; }
  }

  /* ── Very small / legacy phones ── */
  @media (max-width: 360px) {
    .clab-header { padding: 8px 10px !important; }
    .clab-content { padding: 12px 8px !important; }
    .clab-logo { font-size: 18px !important; }
  }

  /* ── Landscape orientation on short-height devices (phones rotated) ── */
  @media (max-height: 480px) and (orientation: landscape) {
    .clab-header { min-height: 46px !important; }
    .clab-modal { max-height: 85vh !important; }
  }
`;

/* ─────────────────────────────────────────────
   THEME — same light/dark concept used across the
   rest of the app (Dashboard.jsx): detect the
   `dark` class / `data-theme="dark"` attribute on
   <html> via a MutationObserver, then swap a single
   palette object. Everything below just reads from
   `palette` instead of hardcoded hex values.
   ───────────────────────────────────────────── */
const LIGHT_PALETTE = {
  pageBg: "#f8fafc",
  cardBg: "#ffffff",
  cardBorder: "#e2e8f0",
  shadow: "0 1px 3px rgba(0,0,0,0.06)",
  text: "#1e293b",
  textStrong: "#0f172a",
  textSoft: "#374151",
  textMuted: "#64748b",
  textFaint: "#94a3b8",
  inputBg: "#f8fafc",
  inputBorder: "#e2e8f0",
  tableHeadBg: "#f8fafc",
  tableRowBorder: "#f1f5f9",
  countBadgeBg: "#e2e8f0",
  countBadgeText: "#64748b",
  cancelBg: "#f1f5f9",
  cancelText: "#475569",
  cancelBorder: "#e2e8f0",
  actBtnBg: "#f1f5f9",
  actBtnBorder: "#e2e8f0",
  actBtnText: "#475569",
  delBtnBg: "#fef2f2",
  delBtnBorder: "#fecaca",
  diffBtnBg: "#f1f5f9",
  diffBtnBorder: "#e2e8f0",
  diffBtnText: "#64748b",
  sampleBoxBg: "#eff6ff",
  sampleBoxBorder: "#bfdbfe",
  sampleTitleText: "#1d4ed8",
  sampleBodyText: "#1e40af",
  sampleCellBg: "#ffffff",
  guideBoxBg: "#f0f9ff",
  guideBoxBorder: "#bae6fd",
  guideTitleText: "#0369a1",
  guideNumBg: "#0369a1",
  guideNoteBg: "#fef3c7",
  guideNoteText: "#92400e",
  tcItemBg: "#f8fafc",
  tcItemBorder: "#e2e8f0",
  addTCFormBg: "#f8fafc",
  addTCFormBorder: "#e2e8f0",
  hiddenBadgeBg: "#fee2e2",
  hiddenBadgeBorder: "#fecaca",
  weightBadgeBg: "#fef3c7",
  weightBadgeBorder: "#fde68a",
  primaryBtnBg: "#0f172a",
  primaryBtnText: "#ffffff",
  flashOkBg: "#dcfce7",
  flashOkBorder: "#bbf7d0",
  flashErrBg: "#fee2e2",
  flashErrBorder: "#fecaca",
  modalOverlay: "rgba(0,0,0,0.5)",
  modalBg: "#ffffff",
  emptyText: "#94a3b8",
};

const DARK_PALETTE = {
  // True near-black theme — matches the Dashboard's dark mode (image 2)
  // exactly: black page background, slightly-lighter-black cards, neutral
  // grey borders. No navy/blue tint anywhere.
  pageBg: "#000000",
  cardBg: "#0a0a0a",
  cardBorder: "#262626",
  shadow: "0 1px 3px rgba(0,0,0,0.6)",
  text: "#e5e5e5",
  textStrong: "#f5f5f5",
  textSoft: "#d4d4d4",
  textMuted: "#a3a3a3",
  textFaint: "#737373",
  inputBg: "#0a0a0a",
  inputBorder: "#262626",
  tableHeadBg: "#0a0a0a",
  tableRowBorder: "#1f1f1f",
  countBadgeBg: "#171717",
  countBadgeText: "#a3a3a3",
  cancelBg: "#171717",
  cancelText: "#d4d4d4",
  cancelBorder: "#262626",
  actBtnBg: "#171717",
  actBtnBorder: "#262626",
  actBtnText: "#d4d4d4",
  delBtnBg: "rgba(220,38,38,0.12)",
  delBtnBorder: "rgba(248,113,113,0.35)",
  diffBtnBg: "#171717",
  diffBtnBorder: "#262626",
  diffBtnText: "#a3a3a3",
  sampleBoxBg: "#0a0a0a",
  sampleBoxBorder: "#262626",
  sampleTitleText: "#60a5fa",
  sampleBodyText: "#93c5fd",
  sampleCellBg: "#111111",
  guideBoxBg: "#0a0a0a",
  guideBoxBorder: "#262626",
  guideTitleText: "#60a5fa",
  guideNumBg: "#2563eb",
  guideNoteBg: "rgba(217,119,6,0.15)",
  guideNoteText: "#fbbf24",
  tcItemBg: "#111111",
  tcItemBorder: "#262626",
  addTCFormBg: "#111111",
  addTCFormBorder: "#262626",
  hiddenBadgeBg: "rgba(220,38,38,0.15)",
  hiddenBadgeBorder: "rgba(248,113,113,0.35)",
  weightBadgeBg: "rgba(217,119,6,0.15)",
  weightBadgeBorder: "rgba(251,191,36,0.35)",
  primaryBtnBg: "#f59e0b",
  primaryBtnText: "#0a0a0a",
  flashOkBg: "rgba(22,163,74,0.15)",
  flashOkBorder: "rgba(74,222,128,0.35)",
  flashErrBg: "rgba(220,38,38,0.15)",
  flashErrBorder: "rgba(248,113,113,0.35)",
  modalOverlay: "rgba(0,0,0,0.75)",
  modalBg: "#0a0a0a",
  emptyText: "#737373",
};

export default function TrainerCompilerPage() {
  // ── dark-mode detection — same concept/pattern as Dashboard.jsx:
  // watch <html> for the `dark` class or `data-theme="dark"` attribute
  // so this page always matches the app-wide theme toggle.
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"),
  );
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark",
      );
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;
  const T = buildStyles(palette);

  const [tab, setTab] = useState("problems");
  const [problems, setProblems] = useState([]);
  const [formData, setFormData] = useState(emptyProblem);
  const [tcForm, setTcForm] = useState(emptyTC);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tcProblemId, setTcProblemId] = useState(null);
  const [existingTCs, setExistingTCs] = useState([]);
  const [assignProblemId, setAssignProblemId] = useState("");
  const [assignBatchId, setAssignBatchId] = useState("");
  const [assignDueDate, setAssignDueDate] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [assignBatchQuery, setAssignBatchQuery] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [submissionBatchId, setSubmissionBatchId] = useState("");
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [trainerBatches, setTrainerBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // problemId pending delete

  useEffect(() => {
    fetchProblems();
    fetchBatches();
  }, []);

  const flash = (msg, isError = false) => {
    if (isError) setErrorMsg(msg);
    else setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg("");
      setErrorMsg("");
    }, 3500);
  };

  const fetchProblems = async () => {
    try {
      const res = await getMyProblems();
      setProblems(res.data || []);
    } catch {
      setProblems([]);
    }
  };

  const fetchBatches = async () => {
    setLoadingBatches(true);
    try {
      const data = await getTrainerBatches();
      setTrainerBatches(Array.isArray(data) ? data : []);
    } catch {
      setTrainerBatches([]);
    } finally {
      setLoadingBatches(false);
    }
  };

  const formChange = (f, v) => setFormData((p) => ({ ...p, [f]: v }));
  const tcChange = (f, v) => setTcForm((p) => ({ ...p, [f]: v }));

  const addTCToForm = () => {
    if (!tcForm.expectedOutput.trim()) {
      flash("Expected output is required.", true);
      return;
    }
    setFormData((p) => ({ ...p, testCases: [...p.testCases, { ...tcForm }] }));
    setTcForm(emptyTC);
  };

  const removeTCFromForm = (idx) =>
    setFormData((p) => ({
      ...p,
      testCases: p.testCases.filter((_, i) => i !== idx),
    }));

  // CREATE or UPDATE via PUT
  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      flash("Title and description are required.", true);
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        // PUT /api/v1/problems/{id}
        await updateCodingProblem(editingId, formData);
        flash("Problem updated!");
      } else {
        // POST /api/v1/problems
        await createCodingProblem(formData);
        flash("Problem created!");
      }
      setFormData(emptyProblem);
      setEditingId(null);
      setTab("problems");
      fetchProblems();
    } catch (e) {
      flash(e.response?.data?.message || "Save failed.", true);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p) => {
    setFormData({
      title: p.title || "",
      description: p.description || "",
      inputFormat: p.inputFormat || "",
      outputFormat: p.outputFormat || "",
      constraints: p.constraints || "",
      sampleInput: p.sampleInput || "",
      sampleOutput: p.sampleOutput || "",
      difficulty: p.difficulty || "EASY",
      totalMarks: p.totalMarks || 10,
      testCases: [],
    });
    setEditingId(p.id);
    setTab("create");
  };

  // Hard delete via DELETE /api/v1/problems/{id}
  const confirmDelete = (id) => setDeleteConfirm(id);
  const cancelDelete = () => setDeleteConfirm(null);
  const executeDelete = async () => {
    try {
      await deleteCodingProblem(deleteConfirm);
      flash("Problem deleted.");
      fetchProblems();
    } catch {
      flash("Delete failed.", true);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const openTCManager = async (id) => {
    setTcProblemId(id);
    try {
      const res = await getTestCases(id);
      setExistingTCs(res.data || []);
    } catch {
      setExistingTCs([]);
    }
  };

  const addTCToExisting = async () => {
    if (!tcProblemId || !tcForm.expectedOutput.trim()) {
      flash("Expected output required.", true);
      return;
    }
    try {
      await addTestCase(tcProblemId, tcForm);
      flash("Test case added!");
      setTcForm(emptyTC);
      const res = await getTestCases(tcProblemId);
      setExistingTCs(res.data || []);
    } catch {
      flash("Failed to add test case.", true);
    }
  };

  const handleAssign = async () => {
    if (!assignProblemId || !assignBatchId.trim()) {
      flash("Problem and batch required.", true);
      return;
    }
    try {
      await assignProblemToBatch({
        problemId: Number(assignProblemId),
        batchId: assignBatchId.trim(),
        dueDate: assignDueDate || null,
      });
      flash("Problem assigned!");
      setAssignProblemId("");
      setAssignBatchId("");
      setAssignDueDate("");
    } catch (e) {
      flash(e.response?.data?.message || "Assignment failed.", true);
    }
  };

  const fetchAssignments = async () => {
    if (!assignBatchQuery.trim()) return;
    try {
      const res = await getAssignmentsByBatchForTrainer(
        assignBatchQuery.trim(),
      );
      setAssignments(res.data || []);
    } catch {
      setAssignments([]);
    }
  };

  const handleUnassign = async (id) => {
    try {
      await unassignProblem(id);
      flash("Removed.");
      fetchAssignments();
    } catch {
      flash("Failed to remove.", true);
    }
  };

  const fetchSubmissions = async () => {
    if (!submissionBatchId.trim()) return;
    setLoadingSubmissions(true);
    try {
      const res = await getBatchCodeSubmissions(submissionBatchId.trim());
      setSubmissions(res.data || []);
    } catch {
      setSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const statusColor = (s) =>
    s === "SUCCESS" ? "#16a34a" : s === "COMPILE_ERROR" ? "#d97706" : "#dc2626";

  // Difficulty / status badges keep their accent hue in both themes, but
  // switch from pastel-solid backgrounds (light) to soft translucent
  // backgrounds (dark) so they don't glare against a dark card.
  const diffColor = (d) =>
    d === "EASY" ? "#22c55e" : d === "MEDIUM" ? "#f59e0b" : "#ef4444";
  const diffBg = (d) => {
    if (isDark) {
      return d === "EASY"
        ? "rgba(34,197,94,0.15)"
        : d === "MEDIUM"
          ? "rgba(245,158,11,0.15)"
          : "rgba(239,68,68,0.15)";
    }
    return d === "EASY" ? "#dcfce7" : d === "MEDIUM" ? "#fef3c7" : "#fee2e2";
  };
  const activeBadgeBg = (active) =>
    active ? (isDark ? "rgba(34,197,94,0.15)" : "#dcfce7") : (isDark ? "rgba(239,68,68,0.15)" : "#fee2e2");
  const activeBadgeColor = (active) => (active ? "#22c55e" : "#ef4444");

  return (
    <div className="clab-root" style={T.root}>
      <style>{RESPONSIVE_CSS}</style>
      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirm && (
        <div style={T.modalOverlay}>
          <div className="clab-modal" style={T.modal}>
            <div style={T.modalTitle}>Delete Problem?</div>
            <div style={T.modalBody}>
              This will permanently delete the problem and all its test cases.
              This action cannot be undone.
            </div>
            <div className="clab-modalActions" style={T.modalActions}>
              <button style={T.cancelBtn} onClick={cancelDelete}>
                Cancel
              </button>
              <button style={T.dangerBtn} onClick={executeDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="clab-header" style={T.header}>
        <div className="clab-headerLeft" style={T.headerLeft}>
          <span style={T.logo}>{"</>"}</span>
          <span className="clab-logoText" style={T.logoText}>CodeLab</span>
          <span className="clab-trainerBadge" style={T.trainerBadge}>Trainer</span>
        </div>
        <div className="clab-tabs" style={T.tabs}>
          {[
            { key: "problems", label: "Problems", icon: <IconProblems /> },
            {
              key: "create",
              label: editingId ? "Edit" : "Create",
              icon: editingId ? <IconEdit /> : <IconCreate />,
            },
            { key: "assign", label: "Assign", icon: <IconAssign /> },
            { key: "submissions", label: "Submissions", icon: <IconSubmissions /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="clab-tabBtn"
              style={{ ...T.tabBtn, ...(tab === key ? T.tabActive : {}) }}
            >
              <span className="clab-tabIcon">{icon}</span>
              <span className="clab-tabLabel">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FLASH */}
      {successMsg && <div style={T.flashOk}>{successMsg}</div>}
      {errorMsg && <div style={T.flashErr}>{errorMsg}</div>}

      {/* ══════════════════════════════════════ */}
      {/* TAB: PROBLEMS                         */}
      {/* ══════════════════════════════════════ */}
      {tab === "problems" && (
        <div className="clab-content" style={T.content}>
          <div className="clab-pageTitle" style={T.pageTitle}>
            My Problems
            <span style={T.countBadge}>{problems.length}</span>
            <button
              style={T.newBtn}
              onClick={() => {
                setFormData(emptyProblem);
                setEditingId(null);
                setTab("create");
              }}
            >
              + New Problem
            </button>
          </div>

          {problems.length === 0 ? (
            <div style={T.empty}>
              No problems yet. Create your first problem!
            </div>
          ) : (
            <div className="clab-table" style={T.table}>
              <div className="clab-tableHead" style={T.tableHead}>
                <span style={{ flex: 3 }}>Title</span>
                <span style={{ flex: 1 }}>Difficulty</span>
                <span style={{ flex: 1 }}>Marks</span>
                <span style={{ flex: 1 }}>Status</span>
                <span style={{ flex: 2, textAlign: "right" }}>Actions</span>
              </div>
              {problems.map((p) => (
                <div key={p.id} className="clab-tableRow" style={T.tableRow}>
                  <span
                    data-label="Title"
                    style={{ flex: 3, fontWeight: 600, color: palette.textStrong }}
                  >
                    {p.title}
                  </span>
                  <span data-label="Difficulty" style={{ flex: 1 }}>
                    <span
                      style={{
                        background: diffBg(p.difficulty),
                        color: diffColor(p.difficulty),
                        borderRadius: 20,
                        padding: "2px 10px",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {p.difficulty}
                    </span>
                  </span>
                  <span
                    data-label="Marks"
                    style={{ flex: 1, color: "#d97706", fontWeight: 600 }}
                  >
                    {p.totalMarks}
                  </span>
                  <span data-label="Status" style={{ flex: 1 }}>
                    <span
                      style={{
                        background: activeBadgeBg(p.isActive),
                        color: activeBadgeColor(p.isActive),
                        borderRadius: 20,
                        padding: "2px 10px",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </span>
                  <span
                    data-label="Actions"
                    className="clab-rowActions"
                    style={{
                      flex: 2,
                      display: "flex",
                      gap: 8,
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      style={{ ...T.actBtn, ...T.actBtnInner }}
                      onClick={() => openTCManager(p.id)}
                    >
                      <IconFlask /> Tests
                    </button>
                    <button
                      style={{ ...T.actBtn, ...T.actBtnInner }}
                      onClick={() => startEdit(p)}
                    >
                      <IconPencil width={13} height={13} /> Edit
                    </button>
                    <button
                      style={{ ...T.actBtn, ...T.delActBtn, ...T.actBtnInner }}
                      onClick={() => confirmDelete(p.id)}
                    >
                      <IconTrash /> Delete
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TEST CASE MANAGER */}
          {tcProblemId && (
            <div style={T.tcPanel}>
              <div style={T.tcPanelHead}>
                <span style={{ fontWeight: 700 }}>
                  Test Cases — Problem #{tcProblemId}
                </span>
                <button style={T.closeBtn} onClick={() => setTcProblemId(null)}>
                  ✕
                </button>
              </div>

              {/* Sample explanation box */}
              <div style={T.sampleBox}>
                <div style={T.sampleTitle}>
                  <IconInfo /> How Test Cases Work
                </div>
                <div style={T.sampleText}>
                  Each test case has an <b>Input</b> and <b>Expected Output</b>.
                  When a student submits code, the judge runs their code with
                  each input and compares the actual output to the expected
                  output.
                  <br />
                  <br />
                  <b>Example for "Print Hello World":</b>
                </div>
                <div style={T.sampleRow}>
                  <div style={T.sampleCell}>
                    <div style={T.sampleCellLabel}>Input</div>
                    <code style={T.sampleCode}>(empty — no input needed)</code>
                  </div>
                  <div style={T.sampleArrow}>→</div>
                  <div style={T.sampleCell}>
                    <div style={T.sampleCellLabel}>Expected Output</div>
                    <code style={T.sampleCode}>Hello World</code>
                  </div>
                  <div style={T.sampleArrow}>→</div>
                  <div style={T.sampleCell}>
                    <div style={T.sampleCellLabel}>Student code prints</div>
                    <code style={{ ...T.sampleCode, color: "#16a34a" }}>
                      Hello World ✓ PASS
                    </code>
                  </div>
                </div>
                <div style={T.sampleText}>
                  <b>Hidden test cases</b> are used for scoring — students see
                  verdict (PASS/FAIL) but not the input/output. Visible test
                  cases act as examples shown to students.
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                {existingTCs.length === 0 ? (
                  <div
                    style={{
                      color: T.empty.color,
                      padding: "20px 0",
                      textAlign: "center",
                    }}
                  >
                    No test cases yet. Add one below.
                  </div>
                ) : (
                  existingTCs.map((tc, i) => (
                    <div key={tc.id} style={T.tcItem}>
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            color: palette.textFaint,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          #{i + 1}
                        </span>
                        {tc.isHidden && (
                          <span style={T.hiddenBadge}>Hidden</span>
                        )}
                        <span style={T.weightBadge}>{tc.weightage}pt</span>
                      </div>
                      <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
                        <span style={{ color: palette.textFaint, minWidth: 72 }}>
                          Input:
                        </span>
                        <code style={{ color: "#0ea5e9" }}>
                          {tc.input || "(none)"}
                        </code>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          fontSize: 12,
                          marginTop: 3,
                        }}
                      >
                        <span style={{ color: palette.textFaint, minWidth: 72 }}>
                          Expected:
                        </span>
                        <code style={{ color: "#22c55e", fontWeight: 600 }}>
                          {tc.expectedOutput}
                        </code>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={T.addTCForm}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: palette.textStrong,
                    marginBottom: 10,
                  }}
                >
                  + Add Test Case
                </div>
                <div className="clab-tcRow" style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <textarea
                    style={T.tcInput}
                    placeholder="Input (leave empty if no input needed)"
                    value={tcForm.input}
                    onChange={(e) => tcChange("input", e.target.value)}
                    rows={2}
                  />
                  <textarea
                    style={T.tcInput}
                    placeholder="Expected output *"
                    value={tcForm.expectedOutput}
                    onChange={(e) => tcChange("expectedOutput", e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="clab-tcControls" style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <label
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      fontSize: 13,
                      color: palette.textSoft,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={tcForm.isHidden}
                      onChange={(e) => tcChange("isHidden", e.target.checked)}
                    />
                    Hidden (not shown to student)
                  </label>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <span style={{ fontSize: 13, color: palette.textSoft }}>
                      Points:
                    </span>
                    <input
                      style={{ ...T.smallInput }}
                      type="number"
                      min={1}
                      value={tcForm.weightage}
                      onChange={(e) =>
                        tcChange("weightage", Number(e.target.value))
                      }
                    />
                  </div>
                  <button style={T.addBtn} onClick={addTCToExisting}>
                    + Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════ */}
      {/* TAB: CREATE / EDIT                    */}
      {/* ══════════════════════════════════════ */}
      {tab === "create" && (
        <div className="clab-content" style={T.content}>
          <div className="clab-pageTitle" style={T.pageTitle}>
            {editingId ? <IconPencil /> : <IconPlusCircle />}
            {editingId ? "Edit Problem" : "Create New Problem"}
          </div>

          {/* SAMPLE GUIDE */}
          {!editingId && (
            <div style={T.guideBox}>
              <div style={T.guideTitle}>
                📘 Quick Guide — Creating a Problem
              </div>
              <div className="clab-guideGrid" style={T.guideGrid}>
                <div style={T.guideStep}>
                  <div style={T.guideNum}>1</div>
                  <div>
                    <b>Write the Problem</b>
                    <br />
                    <span style={{ color: palette.textMuted, fontSize: 12 }}>
                      Fill in Title, Description, Input/Output format. Be clear
                      so students understand exactly what to code.
                    </span>
                  </div>
                </div>
                <div style={T.guideStep}>
                  <div style={T.guideNum}>2</div>
                  <div>
                    <b>Add Sample Test Cases</b>
                    <br />
                    <span style={{ color: palette.textMuted, fontSize: 12 }}>
                      Add visible test cases students can see as examples. Add
                      hidden ones for actual scoring.
                    </span>
                  </div>
                </div>
                <div style={T.guideStep}>
                  <div style={T.guideNum}>3</div>
                  <div>
                    <b>Assign to Batch</b>
                    <br />
                    <span style={{ color: palette.textMuted, fontSize: 12 }}>
                      After creating, go to the Assign tab and assign this
                      problem to your batch so students can see it.
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: 12,
                  padding: "10px 14px",
                  background: palette.guideNoteBg,
                  borderRadius: 8,
                  fontSize: 12,
                  color: palette.guideNoteText,
                }}
              >
                <b>Example:</b> Problem = "Print sum of two numbers" · Input =
                "3 5" · Expected Output = "8" · Student writes code that reads
                two numbers and prints their sum.
              </div>
            </div>
          )}

          <div style={T.form}>
            <div className="clab-formGrid" style={T.formGrid}>
              <div style={{ ...T.formGroup, gridColumn: "1 / -1" }}>
                <label style={T.formLabel}>Title *</label>
                <input
                  style={T.formInput}
                  value={formData.title}
                  onChange={(e) => formChange("title", e.target.value)}
                  placeholder="e.g. Print Sum of Two Numbers"
                />
              </div>

              <div style={T.formGroup}>
                <label style={T.formLabel}>Difficulty *</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      onClick={() => formChange("difficulty", d)}
                      style={{
                        ...T.diffBtn,
                        ...(formData.difficulty === d
                          ? {
                              background: diffBg(d),
                              color: diffColor(d),
                              border: `1px solid ${diffColor(d)}`,
                            }
                          : {}),
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div style={T.formGroup}>
                <label style={T.formLabel}>Total Marks *</label>
                <input
                  style={T.formInput}
                  type="number"
                  min={1}
                  value={formData.totalMarks}
                  onChange={(e) =>
                    formChange("totalMarks", Number(e.target.value))
                  }
                />
              </div>

              <div style={{ ...T.formGroup, gridColumn: "1 / -1" }}>
                <label style={T.formLabel}>
                  Description *{" "}
                  <span
                    style={{
                      color: palette.textFaint,
                      fontWeight: 400,
                      fontSize: 11,
                      textTransform: "none",
                    }}
                  >
                    — Explain what the student needs to code
                  </span>
                </label>
                <textarea
                  style={{ ...T.formInput, resize: "vertical" }}
                  rows={4}
                  value={formData.description}
                  onChange={(e) => formChange("description", e.target.value)}
                  placeholder="e.g. Write a program that reads two integers and prints their sum."
                />
              </div>

              <div style={T.formGroup}>
                <label style={T.formLabel}>Input Format</label>
                <textarea
                  style={{ ...T.formInput, resize: "vertical" }}
                  rows={3}
                  value={formData.inputFormat}
                  onChange={(e) => formChange("inputFormat", e.target.value)}
                  placeholder="e.g. First line contains two space-separated integers A and B."
                />
              </div>
              <div style={T.formGroup}>
                <label style={T.formLabel}>Output Format</label>
                <textarea
                  style={{ ...T.formInput, resize: "vertical" }}
                  rows={3}
                  value={formData.outputFormat}
                  onChange={(e) => formChange("outputFormat", e.target.value)}
                  placeholder="e.g. Print a single integer — the sum of A and B."
                />
              </div>

              <div style={T.formGroup}>
                <label style={T.formLabel}>Constraints</label>
                <textarea
                  style={{
                    ...T.formInput,
                    resize: "vertical",
                    fontFamily: "monospace",
                  }}
                  rows={3}
                  value={formData.constraints}
                  onChange={(e) => formChange("constraints", e.target.value)}
                  placeholder="e.g. 1 ≤ A, B ≤ 10^9"
                />
              </div>
              <div style={T.formGroup}>
                <label style={T.formLabel}>Sample Input</label>
                <textarea
                  style={{
                    ...T.formInput,
                    resize: "vertical",
                    fontFamily: "monospace",
                  }}
                  rows={3}
                  value={formData.sampleInput}
                  onChange={(e) => formChange("sampleInput", e.target.value)}
                  placeholder="e.g. 3 5"
                />
              </div>
              <div style={{ ...T.formGroup, gridColumn: "1 / -1" }}>
                <label style={T.formLabel}>Sample Output</label>
                <textarea
                  style={{
                    ...T.formInput,
                    resize: "vertical",
                    fontFamily: "monospace",
                  }}
                  rows={2}
                  value={formData.sampleOutput}
                  onChange={(e) => formChange("sampleOutput", e.target.value)}
                  placeholder="e.g. 8"
                />
              </div>
            </div>

            {/* INLINE TEST CASES */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: palette.textStrong,
                  marginBottom: 12,
                }}
              >
                Test Cases
              </div>
              {formData.testCases.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  {formData.testCases.map((tc, i) => (
                    <div key={i} style={T.tcItem}>
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            color: palette.textFaint,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          #{i + 1}
                        </span>
                        {tc.isHidden && (
                          <span style={T.hiddenBadge}>Hidden</span>
                        )}
                        <span style={T.weightBadge}>{tc.weightage}pt</span>
                        <button
                          style={{
                            marginLeft: "auto",
                            background: "none",
                            border: "none",
                            color: "#dc2626",
                            cursor: "pointer",
                            fontSize: 14,
                          }}
                          onClick={() => removeTCFromForm(i)}
                        >
                          ✕
                        </button>
                      </div>
                      <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
                        <span style={{ color: palette.textFaint, minWidth: 72 }}>
                          Input:
                        </span>
                        <code style={{ color: "#0ea5e9" }}>
                          {tc.input || "(none)"}
                        </code>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          fontSize: 12,
                          marginTop: 3,
                        }}
                      >
                        <span style={{ color: palette.textFaint, minWidth: 72 }}>
                          Expected:
                        </span>
                        <code style={{ color: "#22c55e", fontWeight: 600 }}>
                          {tc.expectedOutput}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={T.addTCForm}>
                <div className="clab-tcRow" style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <textarea
                    style={T.tcInput}
                    placeholder="Input (optional)"
                    value={tcForm.input}
                    onChange={(e) => tcChange("input", e.target.value)}
                    rows={2}
                  />
                  <textarea
                    style={T.tcInput}
                    placeholder="Expected output *"
                    value={tcForm.expectedOutput}
                    onChange={(e) => tcChange("expectedOutput", e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="clab-tcControls" style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <label
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      fontSize: 13,
                      color: palette.textSoft,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={tcForm.isHidden}
                      onChange={(e) => tcChange("isHidden", e.target.checked)}
                    />
                    Hidden test case
                  </label>
                  <input
                    style={T.smallInput}
                    type="number"
                    min={1}
                    placeholder="Points"
                    value={tcForm.weightage}
                    onChange={(e) =>
                      tcChange("weightage", Number(e.target.value))
                    }
                  />
                  <button style={T.addBtn} onClick={addTCToForm}>
                    + Add
                  </button>
                </div>
              </div>
            </div>

            <div
              className="clab-formActions"
              style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}
            >
              <button
                style={T.cancelBtn}
                onClick={() => {
                  setTab("problems");
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
              <button style={T.saveBtn} onClick={handleSave} disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Problem"
                    : "Create Problem"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════ */}
      {/* TAB: ASSIGN                           */}
      {/* ══════════════════════════════════════ */}
      {tab === "assign" && (
        <div className="clab-content" style={T.content}>
          <div className="clab-pageTitle" style={T.pageTitle}>
            <IconTarget /> Assign Problems to Batches
          </div>

          <div className="clab-card" style={T.card}>
            <div style={T.cardTitle}>Assign a Problem to a Batch</div>
            <div
              className="clab-fieldRow"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                marginTop: 16,
                alignItems: "flex-end",
              }}
            >
              <div style={T.formGroup}>
                <label style={T.formLabel}>Select Problem</label>
                <select
                  style={T.formInput}
                  value={assignProblemId}
                  onChange={(e) => setAssignProblemId(e.target.value)}
                >
                  <option value="">-- Select Problem --</option>
                  {problems.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.difficulty})
                    </option>
                  ))}
                </select>
              </div>
              <div style={T.formGroup}>
                <label style={T.formLabel}>Select Batch *</label>
                <select
                  style={T.formInput}
                  value={assignBatchId}
                  onChange={(e) => setAssignBatchId(e.target.value)}
                  disabled={loadingBatches}
                >
                  <option value="">
                    {loadingBatches ? "Loading..." : "-- Select Batch --"}
                  </option>
                  {trainerBatches.map((b) => (
                    <option key={b.batchId || b.id} value={b.batchId || b.id}>
                      {b.batchName || b.name || b.batchId || b.id}
                    </option>
                  ))}
                </select>
              </div>
              <div style={T.formGroup}>
                <label style={T.formLabel}>Due Date (optional)</label>
                <input
                  style={T.formInput}
                  type="datetime-local"
                  value={assignDueDate}
                  onChange={(e) => setAssignDueDate(e.target.value)}
                />
              </div>
              <button
                style={{ ...T.saveBtn, ...T.actBtnInner }}
                onClick={handleAssign}
              >
                <IconBolt /> Assign
              </button>
            </div>
          </div>

          <div className="clab-card" style={{ ...T.card, marginTop: 24 }}>
            <div style={T.cardTitle}>View Assignments for a Batch</div>
            <div
              className="clab-fieldRow"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 16,
                marginBottom: 16,
                alignItems: "flex-end",
              }}
            >
              <select
                style={{ ...T.formInput, flex: 1 }}
                value={assignBatchQuery}
                onChange={(e) => setAssignBatchQuery(e.target.value)}
              >
                <option value="">-- Select Batch to View --</option>
                {trainerBatches.map((b) => (
                  <option key={b.batchId || b.id} value={b.batchId || b.id}>
                    {b.batchName || b.name || b.batchId || b.id}
                  </option>
                ))}
              </select>
              <button style={T.saveBtn} onClick={fetchAssignments}>
                Search
              </button>
            </div>
            {assignments.length > 0 ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {assignments.map((a) => (
                  <div
                    key={a.assignmentId}
                    className="clab-assignRow"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: palette.tcItemBg,
                      border: `1px solid ${palette.tcItemBorder}`,
                      borderRadius: 8,
                      padding: "12px 16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: palette.textStrong,
                        }}
                      >
                        {a.problemTitle}
                      </span>
                      <span style={{ fontSize: 12, color: palette.textFaint }}>
                        Batch: {a.batchId}
                      </span>
                      {a.dueDate && (
                        <span style={{ fontSize: 12, color: palette.textFaint }}>
                          Due: {new Date(a.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <button
                      style={{ ...T.actBtn, ...T.delActBtn }}
                      onClick={() => handleUnassign(a.assignmentId)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : assignBatchQuery ? (
              <div style={T.empty}>No assignments found.</div>
            ) : null}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════ */}
      {/* TAB: SUBMISSIONS                      */}
      {/* ══════════════════════════════════════ */}
      {tab === "submissions" && (
        <div className="clab-content" style={T.content}>
          <div className="clab-pageTitle" style={T.pageTitle}>
            <IconBarChart /> Student Submissions
          </div>
          <div
            className="clab-fieldRow"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 24,
              alignItems: "flex-end",
            }}
          >
            <select
              style={{ ...T.formInput, flex: 1, minWidth: 220, maxWidth: 360 }}
              value={submissionBatchId}
              onChange={(e) => setSubmissionBatchId(e.target.value)}
            >
              <option value="">-- Select Batch --</option>
              {trainerBatches.map((b) => (
                <option key={b.batchId || b.id} value={b.batchId || b.id}>
                  {b.batchName || b.name || b.batchId || b.id}
                </option>
              ))}
            </select>
            <button style={T.saveBtn} onClick={fetchSubmissions}>
              {loadingSubmissions ? "Loading..." : "Load Submissions"}
            </button>
          </div>

          {submissions.length === 0 && submissionBatchId ? (
            <div style={T.empty}>No submissions found for this batch.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {submissions.map((s) => (
                <div
                  key={s.submissionId}
                  style={{
                    ...T.subCard,
                    ...(expandedSubmission === s.submissionId
                      ? { borderColor: "#f59e0b" }
                      : {}),
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      padding: "14px 18px",
                      alignItems: "center",
                      cursor: "pointer",
                      flexWrap: "wrap",
                    }}
                    onClick={() =>
                      setExpandedSubmission(
                        expandedSubmission === s.submissionId
                          ? null
                          : s.submissionId,
                      )
                    }
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        flex: 1,
                        minWidth: 180,
                        color: palette.textStrong,
                      }}
                    >
                      {s.studentEmail}
                    </span>
                    <span
                      style={{
                        background: isDark ? "rgba(14,165,233,0.15)" : "#e0f2fe",
                        color: isDark ? "#38bdf8" : "#0369a1",
                        borderRadius: 6,
                        padding: "2px 10px",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {s.language}
                    </span>
                    <span
                      style={{ color: statusColor(s.status), fontWeight: 700 }}
                    >
                      {s.status}
                    </span>
                    <span style={{ color: palette.textFaint, fontSize: 12 }}>
                      {s.executionTimeMs}ms
                    </span>
                    <span
                      style={{
                        color: palette.textFaint,
                        fontSize: 12,
                        marginLeft: "auto",
                      }}
                    >
                      {new Date(s.timestamp).toLocaleString()}
                    </span>
                    <span style={{ color: palette.textFaint, fontSize: 12 }}>
                      {expandedSubmission === s.submissionId ? "▲" : "▼"}
                    </span>
                  </div>
                  {expandedSubmission === s.submissionId && (
                    <div style={{ padding: "0 18px 18px" }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#0ea5e9",
                          marginBottom: 6,
                          textTransform: "uppercase",
                        }}
                      >
                        Output
                      </div>
                      <pre
                        style={{
                          background: palette.tcItemBg,
                          border: `1px solid ${palette.tcItemBorder}`,
                          borderRadius: 6,
                          padding: "10px 14px",
                          fontSize: 12,
                          color: palette.textSoft,
                          whiteSpace: "pre-wrap",
                          margin: 0,
                        }}
                      >
                        {s.output || "(no output)"}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* Builds the full style map for a given palette — same shape as the
   original static style object, just parameterized by theme so the page
   follows the app-wide light/dark toggle the same way Dashboard.jsx does.
   The top "CodeLab" nav bar stays a fixed dark editor-style chrome bar in
   both themes (unchanged), matching the original design intent. */
function buildStyles(palette) {
  return {
    root: {
      minHeight: "100vh",
      background: palette.pageBg,
      color: palette.text,
      fontFamily: "'JetBrains Mono','Fira Code',monospace",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 24px",
      minHeight: 56,
      background: "#0a0a0a",
      borderBottom: "1px solid #262626",
      flexShrink: 0,
    },
    headerLeft: { display: "flex", alignItems: "center", gap: 12 },
    logo: { fontSize: 22, color: "#f59e0b", fontWeight: 900 },
    logoText: {
      fontSize: 16,
      fontWeight: 700,
      color: "#f1f5f9",
      letterSpacing: 1,
    },
    trainerBadge: {
      fontSize: 11,
      background: "#f59e0b22",
      color: "#f59e0b",
      border: "1px solid #f59e0b",
      borderRadius: 20,
      padding: "2px 10px",
      fontWeight: 600,
    },
    tabs: { display: "flex", gap: 4 },
    tabBtn: {
      background: "none",
      border: "none",
      color: "#94a3b8",
      padding: "9px 18px",
      borderRadius: 8,
      cursor: "pointer",
      fontSize: 13.5,
      fontFamily: "inherit",
      display: "flex",
      alignItems: "center",
      gap: 8,
      whiteSpace: "nowrap",
      transition: "background 0.15s ease, color 0.15s ease",
    },
    tabActive: { background: "#262626", color: "#f8fafc", fontWeight: 600 },
    flashOk: {
      background: palette.flashOkBg,
      color: "#16a34a",
      border: `1px solid ${palette.flashOkBorder}`,
      padding: "10px 24px",
      fontSize: 13,
      textAlign: "center",
    },
    flashErr: {
      background: palette.flashErrBg,
      color: "#dc2626",
      border: `1px solid ${palette.flashErrBorder}`,
      padding: "10px 24px",
      fontSize: 13,
      textAlign: "center",
    },
    content: {
      flex: 1,
      padding: "28px 32px",
      maxWidth: 1200,
      width: "100%",
      margin: "0 auto",
    },
    pageTitle: {
      fontSize: 20,
      fontWeight: 700,
      marginBottom: 24,
      display: "flex",
      alignItems: "center",
      gap: 12,
      color: palette.textStrong,
    },
    countBadge: {
      background: palette.countBadgeBg,
      color: palette.countBadgeText,
      borderRadius: 20,
      padding: "2px 12px",
      fontSize: 13,
      fontWeight: 600,
    },
    newBtn: {
      marginLeft: "auto",
      background: palette.primaryBtnBg,
      color: palette.primaryBtnText,
      border: "none",
      borderRadius: 8,
      padding: "8px 18px",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 13,
      fontFamily: "inherit",
    },
    empty: {
      color: palette.emptyText,
      textAlign: "center",
      padding: "60px 0",
      fontSize: 15,
    },
    table: {
      border: `1px solid ${palette.cardBorder}`,
      borderRadius: 12,
      overflow: "hidden",
      background: palette.cardBg,
      boxShadow: palette.shadow,
    },
    tableHead: {
      display: "flex",
      gap: 16,
      padding: "12px 18px",
      background: palette.tableHeadBg,
      borderBottom: `1px solid ${palette.cardBorder}`,
      fontSize: 11,
      color: palette.textMuted,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    tableRow: {
      display: "flex",
      gap: 16,
      padding: "14px 18px",
      borderBottom: `1px solid ${palette.tableRowBorder}`,
      alignItems: "center",
      fontSize: 13,
    },
    actBtn: {
      background: palette.actBtnBg,
      color: palette.actBtnText,
      border: `1px solid ${palette.actBtnBorder}`,
      padding: "5px 12px",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: 12,
      fontFamily: "inherit",
    },
    actBtnInner: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
    },
    delActBtn: {
      color: "#ef4444",
      borderColor: palette.delBtnBorder,
      background: palette.delBtnBg,
    },
    // TC Panel
    tcPanel: {
      marginTop: 28,
      background: palette.cardBg,
      border: `1px solid ${palette.cardBorder}`,
      borderRadius: 12,
      padding: 24,
      boxShadow: palette.shadow,
    },
    tcPanelHead: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      color: palette.textStrong,
    },
    closeBtn: {
      background: "none",
      border: "none",
      color: palette.textFaint,
      cursor: "pointer",
      fontSize: 18,
      fontFamily: "inherit",
    },
    sampleBox: {
      background: palette.sampleBoxBg,
      border: `1px solid ${palette.sampleBoxBorder}`,
      borderRadius: 10,
      padding: 16,
      marginBottom: 16,
    },
    sampleTitle: {
      fontWeight: 700,
      fontSize: 13,
      color: palette.sampleTitleText,
      marginBottom: 8,
      display: "flex",
      alignItems: "center",
      gap: 6,
    },
    sampleText: {
      fontSize: 12,
      color: palette.sampleBodyText,
      lineHeight: 1.6,
      marginBottom: 8,
    },
    sampleRow: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      flexWrap: "wrap",
      marginBottom: 10,
    },
    sampleCell: {
      background: palette.sampleCellBg,
      border: `1px solid ${palette.sampleBoxBorder}`,
      borderRadius: 8,
      padding: "8px 12px",
      flex: 1,
      minWidth: 120,
    },
    sampleCellLabel: {
      fontSize: 10,
      fontWeight: 700,
      color: palette.textMuted,
      textTransform: "uppercase",
      marginBottom: 4,
    },
    sampleCode: { fontSize: 12, color: "#0ea5e9", fontFamily: "monospace" },
    sampleArrow: { color: palette.sampleBoxBorder, fontWeight: 700, fontSize: 18 },
    tcItem: {
      background: palette.tcItemBg,
      border: `1px solid ${palette.tcItemBorder}`,
      borderRadius: 8,
      padding: "12px 14px",
    },
    hiddenBadge: {
      background: palette.hiddenBadgeBg,
      color: "#ef4444",
      border: `1px solid ${palette.hiddenBadgeBorder}`,
      borderRadius: 10,
      padding: "1px 8px",
      fontSize: 10,
      fontWeight: 700,
    },
    weightBadge: {
      background: palette.weightBadgeBg,
      color: "#f59e0b",
      border: `1px solid ${palette.weightBadgeBorder}`,
      borderRadius: 10,
      padding: "1px 8px",
      fontSize: 10,
      fontWeight: 700,
    },
    addTCForm: {
      background: palette.addTCFormBg,
      border: `1px solid ${palette.addTCFormBorder}`,
      borderRadius: 8,
      padding: 14,
    },
    tcInput: {
      flex: 1,
      background: palette.inputBg,
      border: `1px solid ${palette.inputBorder}`,
      color: palette.text,
      borderRadius: 6,
      padding: "8px 10px",
      fontSize: 12,
      fontFamily: "inherit",
      resize: "vertical",
      outline: "none",
    },
    smallInput: {
      width: 80,
      background: palette.inputBg,
      border: `1px solid ${palette.inputBorder}`,
      color: palette.text,
      borderRadius: 6,
      padding: "6px 10px",
      fontSize: 13,
      fontFamily: "inherit",
      outline: "none",
    },
    addBtn: {
      background: palette.primaryBtnBg,
      color: palette.primaryBtnText,
      border: "none",
      borderRadius: 6,
      padding: "7px 18px",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 13,
      fontFamily: "inherit",
    },
    // Guide box
    guideBox: {
      background: palette.guideBoxBg,
      border: `1px solid ${palette.guideBoxBorder}`,
      borderRadius: 12,
      padding: 20,
      marginBottom: 24,
    },
    guideTitle: {
      fontWeight: 700,
      fontSize: 14,
      color: palette.guideTitleText,
      marginBottom: 14,
    },
    guideGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: 16,
      marginBottom: 12,
    },
    guideStep: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
      fontSize: 13,
      color: palette.textStrong,
    },
    guideNum: {
      background: palette.guideNumBg,
      color: "#fff",
      borderRadius: "50%",
      width: 24,
      height: 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      fontWeight: 700,
      flexShrink: 0,
    },
    // Form
    form: {
      background: palette.cardBg,
      border: `1px solid ${palette.cardBorder}`,
      borderRadius: 12,
      padding: 28,
      boxShadow: palette.shadow,
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 20,
      marginBottom: 24,
    },
    formGroup: { display: "flex", flexDirection: "column", gap: 6 },
    formLabel: {
      fontSize: 11,
      fontWeight: 700,
      color: palette.textMuted,
      letterSpacing: 0.8,
      textTransform: "uppercase",
    },
    formInput: {
      background: palette.inputBg,
      border: `1px solid ${palette.inputBorder}`,
      color: palette.text,
      borderRadius: 8,
      padding: "10px 12px",
      fontSize: 13,
      fontFamily: "inherit",
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
    },
    diffBtn: {
      background: palette.diffBtnBg,
      border: `1px solid ${palette.diffBtnBorder}`,
      color: palette.diffBtnText,
      padding: "7px 16px",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 13,
      fontFamily: "inherit",
    },
    formActions: { display: "flex", gap: 12, justifyContent: "flex-end" },
    cancelBtn: {
      background: palette.cancelBg,
      color: palette.cancelText,
      border: `1px solid ${palette.cancelBorder}`,
      padding: "10px 24px",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 14,
      fontFamily: "inherit",
    },
    saveBtn: {
      background: palette.primaryBtnBg,
      color: palette.primaryBtnText,
      border: "none",
      padding: "10px 24px",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 14,
      fontFamily: "inherit",
    },
    // Cards
    card: {
      background: palette.cardBg,
      border: `1px solid ${palette.cardBorder}`,
      borderRadius: 12,
      padding: 24,
      boxShadow: palette.shadow,
    },
    cardTitle: { fontWeight: 700, fontSize: 15, color: palette.textStrong },
    // Submissions
    subCard: {
      background: palette.cardBg,
      border: `1px solid ${palette.cardBorder}`,
      borderRadius: 10,
      overflow: "hidden",
      boxShadow: palette.shadow,
    },
    // Delete modal
    modalOverlay: {
      position: "fixed",
      inset: 0,
      background: palette.modalOverlay,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modal: {
      background: palette.modalBg,
      borderRadius: 12,
      padding: 28,
      maxWidth: 420,
      width: "90%",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 800,
      color: "#dc2626",
      marginBottom: 12,
    },
    modalBody: {
      fontSize: 14,
      color: palette.textSoft,
      lineHeight: 1.6,
      marginBottom: 24,
    },
    modalActions: { display: "flex", gap: 12, justifyContent: "flex-end" },
    dangerBtn: {
      background: "#dc2626",
      color: "#fff",
      border: "none",
      padding: "10px 24px",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 14,
      fontFamily: "inherit",
    },
  };
}