// src/trainer/CreateAssignments.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  ChevronRight,
  FileText,
  Upload,
  X,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Pin,
  AlignLeft,
  Paperclip,
  Settings2,
} from "lucide-react";
import {
  createAssignment,
  uploadAssignmentFile,
  getAssignmentCreateUsage,
} from "@/services/assessmentService";
import { getTrainerBatches } from "@/services/batchService";
import UpgradeModal from "../components/plan/UpgradeModal";
import { parsePlanError } from "../services/planErrorHandler";

// ── Global Design System (Golden Reference: Attendance.jsx) ──
import {
  T,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  RADIUS,
  CARD_PADDING,
  ACCENT_PURPLE,
  PageContainer,
  Hero,
} from "@/design-system";

const isDarkFn = () =>
  typeof document !== "undefined" &&
  (document.documentElement.classList.contains("dark") ||
    document.documentElement.getAttribute("data-theme") === "dark");

const getAuthTokenUserId = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]))?.userId ?? null;
  } catch {
    return null;
  }
};

/* ─── Page-local styled inputs (token-driven, mirrors Attendance.jsx) ─── */
/* ─── Page-local styled inputs (token-driven, mirrors Attendance.jsx) ─── */
const inputStyle = (t) => ({
  width: "100%",
  padding: "11px 14px",
  borderRadius: RADIUS.button,
  border: `1px solid ${t.border}`,
  background: t.pillBg,
  color: t.text,
  fontFamily: FONT_FAMILY,
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color .18s, box-shadow .18s",
});
const selectStyle = (t) => ({
  ...inputStyle(t),
  cursor: "pointer",
  appearance: "none",
});
const onFocusInput = (e, color) => {
  e.target.style.borderColor = color;
  e.target.style.boxShadow = `0 0 0 2px ${color}28`;
};
const onBlurInput = (e, t) => {
  e.target.style.borderColor = t.border;
  e.target.style.boxShadow = "none";
};

function FieldLabel({ t, children }) {
  return (
    <div
      style={{
        fontSize: 10.5,
        fontWeight: 700,
        color: t.textMuted,
        fontFamily: FONT_FAMILY,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

/* ─── text colors for rich editor ─── */
const TX_COLORS = [
  { label: "Default", v: "default", bg: "transparent", bd: "#bbb" },
  { label: "Red", v: "#d93025", bg: "#d93025" },
  { label: "Orange", v: "#e67c00", bg: "#e67c00" },
  { label: "Green", v: "#188038", bg: "#188038" },
  { label: "Blue", v: "#1967d2", bg: "#1967d2" },
  { label: "Purple", v: ACCENT_PURPLE.base, bg: ACCENT_PURPLE.base },
  { label: "Pink", v: "#e52592", bg: "#e52592" },
  { label: "Gray", v: "#6b7280", bg: "#6b7280" },
];

/* ═══ RICH DESCRIPTION EDITOR ═══ */
const RichDescriptionEditor = ({ value, onChange, placeholder, t }) => {
  const [fmt, setFmt] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    h1: false,
    h2: false,
  });
  const [txCol, setTxCol] = useState("default");
  const [cpOpen, setCpOpen] = useState(false);
  const cpRef = useRef();

  useEffect(() => {
    const h = (e) => {
      if (cpRef.current && !cpRef.current.contains(e.target)) setCpOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggle = (k) => setFmt((p) => ({ ...p, [k]: !p[k] }));

  const Btn = ({ k, title, children }) => (
    <button
      type="button"
      className={`rde-btn${fmt[k] ? " active" : ""}`}
      onClick={() => toggle(k)}
      title={title}
      style={{ color: fmt[k] ? ACCENT_PURPLE.base : t.textMuted }}
    >
      {children}
    </button>
  );

  return (
    <div
      className="rde-wrap"
      style={{
        border: `1px solid ${t.border}`,
        background: t.pillBg,
        borderRadius: RADIUS.button,
        overflow: "hidden",
      }}
    >
      <div
        className="rde-toolbar"
        style={{
          borderBottom: `1px solid ${t.border}`,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
          padding: "5px 8px",
        }}
      >
        <button
          type="button"
          className={`rde-btn${fmt.h1 ? " active" : ""}`}
          onClick={() => toggle("h1")}
          style={{ color: fmt.h1 ? ACCENT_PURPLE.base : t.textMuted }}
        >
          <span style={{ fontSize: 11, fontWeight: 800 }}>H1</span>
        </button>
        <button
          type="button"
          className={`rde-btn${fmt.h2 ? " active" : ""}`}
          onClick={() => toggle("h2")}
          style={{ color: fmt.h2 ? ACCENT_PURPLE.base : t.textMuted }}
        >
          <span style={{ fontSize: 11, fontWeight: 800 }}>H2</span>
        </button>
        <button
          type="button"
          className="rde-btn"
          onClick={() =>
            setFmt({
              bold: false,
              italic: false,
              underline: false,
              strike: false,
              h1: false,
              h2: false,
            })
          }
          style={{ color: t.textMuted }}
        >
          <span style={{ fontSize: 11 }}>Aa</span>
        </button>
        <div className="rde-sep" style={{ background: t.border }} />
        <Btn k="bold" title="Bold">
          <Bold size={12} strokeWidth={fmt.bold ? 3 : 2} />
        </Btn>
        <Btn k="italic" title="Italic">
          <Italic size={12} />
        </Btn>
        <Btn k="underline" title="Underline">
          <Underline size={12} />
        </Btn>
        <Btn k="strike" title="Strike">
          <Strikethrough size={12} />
        </Btn>
        <div className="rde-sep" style={{ background: t.border }} />
        <div style={{ position: "relative" }} ref={cpRef}>
          <button
            type="button"
            className="rde-btn"
            onClick={() => setCpOpen((p) => !p)}
            title="Text color"
            style={{ color: t.textMuted }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: txCol !== "default" ? txCol : t.text,
                  lineHeight: 1,
                }}
              >
                A
              </span>
              <div
                style={{
                  width: 14,
                  height: 3,
                  borderRadius: 2,
                  background: txCol !== "default" ? txCol : t.textMuted,
                }}
              />
            </div>
          </button>
          {cpOpen && (
            <div
              style={{
                position: "absolute",
                top: "110%",
                left: 0,
                zIndex: 9999,
                background: t.cardBg,
                border: `1px solid ${t.border}`,
                borderRadius: RADIUS.chip,
                padding: "10px 12px",
                boxShadow: t.shadow,
                minWidth: 220,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: t.textMuted,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                  fontFamily: FONT_FAMILY,
                }}
              >
                Color
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {TX_COLORS.map((c) => (
                  <div
                    key={c.v}
                    className={`rde-swatch${txCol === c.v ? " sel" : ""}`}
                    style={{
                      background: c.bg,
                      border: c.bd
                        ? `2px solid ${c.bd}`
                        : txCol === c.v
                          ? `2px solid ${ACCENT_PURPLE.base}`
                          : "2px solid transparent",
                    }}
                    onClick={() => {
                      setTxCol(c.v);
                      setCpOpen(false);
                    }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button
            type="button"
            className="rde-btn"
            title="Pin"
            style={{ color: t.textMuted }}
          >
            <Pin size={11} />
          </button>
        </div>
      </div>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "9px 12px",
          border: "none",
          outline: "none",
          background: t.pillBg,
          fontFamily: FONT_FAMILY,
          boxSizing: "border-box",
          resize: "vertical",
          fontSize: fmt.h1 ? 18 : fmt.h2 ? 14 : 12.5,
          fontWeight: fmt.bold ? 700 : 400,
          fontStyle: fmt.italic ? "italic" : "normal",
          textDecoration: fmt.underline
            ? "underline"
            : fmt.strike
              ? "line-through"
              : "none",
          color: txCol !== "default" ? txCol : t.text,
        }}
      />
    </div>
  );
};

const PANEL_ICONS = {
  basic: AlignLeft,
  details: Settings2,
  attachments: Paperclip,
};
const PANELS = ["basic", "details", "attachments"];

/* ═══ MAIN ═══ */
const CreateAssignments = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(isDarkFn);
  const t = dark ? T.dark : T.light;

  useEffect(() => {
    const obs = new MutationObserver(() => setDark(isDarkFn()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  const [batches, setBatches] = useState([]);
  const [open, setOpen] = useState("basic");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    batch: "",
    deadline: "",
    maxMarks: "",
    duration: "",
    attachments: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [usage, setUsage] = useState(null);
  const [upgradeConfig, setUpgradeConfig] = useState(null);

  const fetchUsage = () => {
    getAssignmentCreateUsage()
      .then((res) => setUsage(res.data))
      .catch(() => setUsage(null));
  };

  useEffect(() => {
    const loadBatches = async () => {
      try {
        const res = await getTrainerBatches();
        setBatches(res || []);
      } catch (err) {
        console.error("Failed to load trainer batches", err);
      }
    };
    loadBatches();
    fetchUsage();
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, attachments: files }));
  };
  const removeFile = (index) =>
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await createAssignment({
        title: formData.title,
        description: formData.description,
        batchId: Number(formData.batch),
        deadline: formData.deadline,
        maxMarks: Number(formData.maxMarks),
        duration: formData.duration,
      });
      const assignmentId = response.data.id;
      if (formData.attachments.length > 0) {
        for (let file of formData.attachments)
          await uploadAssignmentFile(assignmentId, file);
      }
      setShowSuccess(true);
      setFormData({
        title: "",
        description: "",
        batch: "",
        deadline: "",
        maxMarks: "",
        duration: "",
        attachments: [],
      });
      fetchUsage();
    } catch (error) {
      console.error("Assignment creation error:", error);
      const planError = parsePlanError(error);
      if (planError) {
        setUpgradeConfig({ featureLabel: planError.message });
      } else {
        alert("Failed to create assignment.");
      }
    }
    setIsSubmitting(false);
  };

  const toggle = (panel) => setOpen((prev) => (prev === panel ? null : panel));

  const completedPanels = {
    basic: !!(formData.title && formData.description),
    details: !!(formData.batch && formData.deadline && formData.maxMarks),
    attachments: false,
  };

  const panelMeta = {
    basic: {
      num: 1,
      label: "Basic Information",
      sub: "Title & description",
      color: ACCENT_PURPLE.base,
      nextLabel: "Details →",
    },
    details: {
      num: 2,
      label: "Assignment Details",
      sub: "Batch, deadline & marks",
      color: "#2563eb",
      nextLabel: "Attachments →",
    },
    attachments: {
      num: 3,
      label: "Attachments & Submit",
      sub: `${formData.attachments.length} file${formData.attachments.length !== 1 ? "s" : ""} selected`,
      color: "#059669",
      nextLabel: null,
    },
  };

  return (
    <PageContainer
      mode={dark ? "dark" : "light"}
      pageBg={t.pageBg}
      textColor={t.text}
    >
      <style>{`
        * { box-sizing: border-box; }
        .ca-header { display: flex; align-items: center; gap: 12px; padding: 13px 18px; cursor: pointer; border: none; width: 100%; text-align: left; background: transparent; font-family: ${FONT_FAMILY}; position: relative; overflow: hidden; }
        .ca-step-circle { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 11px; font-weight: 800; font-family: ${FONT_FAMILY}; }
        .ca-body { overflow: hidden; animation: ca-slide-in 0.22s cubic-bezier(0.4,0,0.2,1); }
        @keyframes ca-slide-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .rde-btn { width: 28px; height: 28px; border-radius: 6px; border: none; background: transparent; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: background 0.12s; font-size: 12px; font-weight: 700; font-family: ${FONT_FAMILY}; flex-shrink: 0; }
        .rde-btn:hover { background: rgba(128,128,128,0.12); }
        .rde-btn.active { background: ${ACCENT_PURPLE.base}22; }
        .rde-sep { width: 1px; height: 16px; margin: 0 3px; flex-shrink: 0; }
        .rde-swatch { width: 18px; height: 18px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: transform 0.12s; flex-shrink: 0; }
        .rde-swatch:hover { transform: scale(1.2); }
        .ca-file-row { display: flex; align-items: center; gap: 9px; padding: 8px 12px; transition: background 0.12s; }
        .ca-file-row:hover { background: ${ACCENT_PURPLE.base}0a; }
        .ca-submit { display: inline-flex; align-items: center; gap: 7px; padding: 9px 20px; border-radius: ${RADIUS.button}px; border: none; font-family: ${FONT_FAMILY}; font-size: 12.5px; font-weight: 700; cursor: pointer; transition: all 0.18s; background: ${ACCENT_PURPLE.base}; color: #fff; }
        .ca-submit:hover { transform: translateY(-1px); }
        .ca-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
        .ca-continue { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: ${RADIUS.button}px; border: none; font-family: ${FONT_FAMILY}; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.18s; }
        .ca-continue:hover { transform: translateX(2px); }
        @keyframes ca-spin { to { transform: rotate(360deg); } }
        @media (max-width:600px){ .ca-details-grid { grid-template-columns: 1fr !important; } .ca-summary-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {usage && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 14px",
            borderRadius: RADIUS.chip,
            border: `1px solid ${t.border}`,
            background: t.pillBg,
            marginBottom: 12,
            fontFamily: FONT_FAMILY,
            fontSize: 12,
            fontWeight: 600,
            color: t.textSub,
          }}
        >
          {usage.limit === "unlimited"
            ? "Unlimited assignment creation"
            : `${usage.used}/${usage.limit} assignments created this month`}
        </div>
      )}

      {showSuccess && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "11px 16px",
            borderRadius: RADIUS.chip,
            marginBottom: 16,
            background: "rgba(5,150,105,0.08)",
            border: "1px solid rgba(5,150,105,0.25)",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "rgba(5,150,105,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircle size={13} color="#059669" />
          </div>
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: "#059669",
              fontFamily: FONT_FAMILY,
            }}
          >
            Assignment Created Successfully!
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            borderRadius: RADIUS.standardCard,
            overflow: "hidden",
            border: `1px solid ${t.border}`,
            boxShadow: t.shadow,
            background: t.cardBg,
          }}
        >
          {PANELS.map((key, idx) => {
            const meta = panelMeta[key];
            const isOpen = open === key;
            const isDone = completedPanels[key];
            const isLast = idx === PANELS.length - 1;
            const PanelIcon = PANEL_ICONS[key];
            const stripColor = isDone
              ? "#059669"
              : isOpen
                ? meta.color
                : "transparent";

            return (
              <div
                key={key}
                style={{
                  borderBottom: !isLast ? `1px solid ${t.border}` : "none",
                }}
              >
                <button
                  type="button"
                  className="ca-header"
                  onClick={() => toggle(key)}
                  style={{
                    background: isOpen ? `${meta.color}08` : t.cardBg,
                    borderBottom: isOpen ? `1px solid ${t.border}` : "none",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 3,
                      background: stripColor,
                      borderRadius: "0 2px 2px 0",
                    }}
                  />

                  <div
                    className="ca-step-circle"
                    style={{
                      marginLeft: 8,
                      background: isDone
                        ? "rgba(5,150,105,0.12)"
                        : isOpen
                          ? `${meta.color}18`
                          : t.pillBg,
                      border: `1.5px solid ${isDone ? "rgba(5,150,105,0.35)" : isOpen ? `${meta.color}45` : t.border}`,
                      color: isDone
                        ? "#059669"
                        : isOpen
                          ? meta.color
                          : t.textMuted,
                    }}
                  >
                    {isDone ? (
                      <CheckCircle size={13} color="#059669" />
                    ) : (
                      meta.num
                    )}
                  </div>

                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: RADIUS.chip,
                      flexShrink: 0,
                      background: isOpen ? `${meta.color}12` : t.pillBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PanelIcon
                      size={14}
                      color={isOpen ? meta.color : t.textMuted}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: isOpen ? t.text : t.textSub,
                        fontFamily: FONT_FAMILY,
                        lineHeight: 1.2,
                      }}
                    >
                      {meta.label}
                    </div>
                    <div
                      style={{
                        fontSize: 10.5,
                        color: t.textMuted,
                        fontFamily: FONT_FAMILY,
                        marginTop: 2,
                      }}
                    >
                      {meta.sub}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      alignItems: "center",
                      marginRight: 6,
                    }}
                  >
                    {PANELS.map((p, pi) => (
                      <span
                        key={p}
                        style={{
                          width: p === key ? 16 : 5,
                          height: 4,
                          borderRadius: 999,
                          background:
                            p === key
                              ? meta.color
                              : pi < PANELS.indexOf(key)
                                ? t.textMuted
                                : t.border,
                        }}
                      />
                    ))}
                  </div>

                  <ChevronRight
                    size={14}
                    color={t.textMuted}
                    style={{
                      transform: isOpen ? "rotate(90deg)" : "none",
                      transition: "transform 0.22s",
                      flexShrink: 0,
                    }}
                  />
                </button>

                {isOpen && (
                  <div
                    className="ca-body"
                    style={{
                      background: t.cardBg,
                      padding: "16px 20px 20px 28px",
                    }}
                  >
                    <div style={{ display: "flex", gap: 16 }}>
                      <div
                        style={{
                          width: 2,
                          borderRadius: 999,
                          flexShrink: 0,
                          background: `${meta.color}25`,
                          minHeight: 40,
                        }}
                      />
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 13,
                        }}
                      >
                        {key === "basic" && (
                          <>
                            <div>
                              <FieldLabel t={t}>Assignment Title</FieldLabel>
                              <input
                                style={inputStyle(t)}
                                placeholder="e.g. React Hooks Assignment"
                                value={formData.title}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    title: e.target.value,
                                  })
                                }
                                onFocus={(e) => onFocusInput(e, meta.color)}
                                onBlur={(e) => onBlurInput(e, t)}
                                required
                              />
                            </div>
                            <div>
                              <FieldLabel t={t}>Description</FieldLabel>
                              <RichDescriptionEditor
                                value={formData.description}
                                onChange={(val) =>
                                  setFormData({ ...formData, description: val })
                                }
                                placeholder="Describe the assignment task..."
                                t={t}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <button
                                type="button"
                                className="ca-continue"
                                onClick={() => setOpen("details")}
                                style={{
                                  background: `${meta.color}14`,
                                  color: meta.color,
                                  border: `1px solid ${meta.color}30`,
                                }}
                              >
                                {meta.nextLabel} <ChevronRight size={12} />
                              </button>
                            </div>
                          </>
                        )}

                        {key === "details" && (
                          <>
                            <div
                              className="ca-details-grid"
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 12,
                              }}
                            >
                              <div>
                                <FieldLabel t={t}>Select Batch</FieldLabel>
                                <select
                                  style={selectStyle(t)}
                                  value={formData.batch}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      batch: e.target.value,
                                    })
                                  }
                                  onFocus={(e) => onFocusInput(e, meta.color)}
                                  onBlur={(e) => onBlurInput(e, t)}
                                  required
                                >
                                  <option value="">Select Batch</option>
                                  {batches.map((b) => (
                                    <option key={b.id} value={b.id}>
                                      Batch {b.id}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <FieldLabel t={t}>Deadline</FieldLabel>
                                <input
                                  style={inputStyle(t)}
                                  type="datetime-local"
                                  value={formData.deadline}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      deadline: e.target.value,
                                    })
                                  }
                                  onFocus={(e) => onFocusInput(e, meta.color)}
                                  onBlur={(e) => onBlurInput(e, t)}
                                  required
                                />
                              </div>
                              <div>
                                <FieldLabel t={t}>Max Marks</FieldLabel>
                                <input
                                  style={inputStyle(t)}
                                  type="number"
                                  placeholder="e.g. 100"
                                  value={formData.maxMarks}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      maxMarks: e.target.value,
                                    })
                                  }
                                  onFocus={(e) => onFocusInput(e, meta.color)}
                                  onBlur={(e) => onBlurInput(e, t)}
                                  required
                                />
                              </div>
                              <div>
                                <FieldLabel t={t}>
                                  Duration{" "}
                                  <span
                                    style={{ fontWeight: 400, opacity: 0.6 }}
                                  >
                                    (opt.)
                                  </span>
                                </FieldLabel>
                                <input
                                  style={inputStyle(t)}
                                  placeholder="e.g. 2 hours"
                                  value={formData.duration}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      duration: e.target.value,
                                    })
                                  }
                                  onFocus={(e) => onFocusInput(e, meta.color)}
                                  onBlur={(e) => onBlurInput(e, t)}
                                />
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <button
                                type="button"
                                className="ca-continue"
                                onClick={() => setOpen("attachments")}
                                style={{
                                  background: `${meta.color}14`,
                                  color: meta.color,
                                  border: `1px solid ${meta.color}30`,
                                }}
                              >
                                {meta.nextLabel} <ChevronRight size={12} />
                              </button>
                            </div>
                          </>
                        )}

                        {key === "attachments" && (
                          <>
                            <label
                              style={{ cursor: "pointer", display: "block" }}
                            >
                              <div
                                style={{
                                  border: `1.5px dashed ${t.border}`,
                                  borderRadius: RADIUS.chip,
                                  padding: "20px 16px",
                                  textAlign: "center",
                                  background: t.pillBg,
                                }}
                              >
                                <div
                                  style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 9,
                                    margin: "0 auto 9px",
                                    background: `${meta.color}12`,
                                    border: `1px solid ${meta.color}28`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Upload size={15} color={meta.color} />
                                </div>
                                <div
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: t.textSub,
                                    fontFamily: FONT_FAMILY,
                                    marginBottom: 3,
                                  }}
                                >
                                  Click to upload files
                                </div>
                                <div
                                  style={{
                                    fontSize: 10.5,
                                    color: t.textMuted,
                                    fontFamily: FONT_FAMILY,
                                  }}
                                >
                                  PDF · DOC · DOCX · ZIP · TXT
                                </div>
                                <input
                                  type="file"
                                  multiple
                                  onChange={handleFileChange}
                                  hidden
                                  accept=".pdf,.doc,.docx,.zip,.txt"
                                />
                              </div>
                            </label>

                            {formData.attachments.length > 0 && (
                              <div
                                style={{
                                  borderRadius: RADIUS.chip,
                                  border: `1px solid ${t.border}`,
                                  overflow: "hidden",
                                }}
                              >
                                {formData.attachments.map((file, index) => (
                                  <div
                                    key={index}
                                    className="ca-file-row"
                                    style={{
                                      borderBottom:
                                        index < formData.attachments.length - 1
                                          ? `1px solid ${t.border}`
                                          : "none",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: 6,
                                        background: `${ACCENT_PURPLE.base}18`,
                                        border: `1px solid ${ACCENT_PURPLE.base}30`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                      }}
                                    >
                                      <FileText
                                        size={11}
                                        color={ACCENT_PURPLE.base}
                                      />
                                    </div>
                                    <span
                                      style={{
                                        fontSize: 11.5,
                                        color: t.text,
                                        flex: 1,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        fontFamily: FONT_FAMILY,
                                      }}
                                    >
                                      {file.name}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeFile(index)}
                                      style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: "50%",
                                        border: `1px solid ${t.border}`,
                                        background: t.pillBg,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        flexShrink: 0,
                                      }}
                                    >
                                      <X size={9} color={t.textMuted} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div
                              className="ca-summary-grid"
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3,1fr)",
                                gap: 8,
                              }}
                            >
                              {[
                                {
                                  label: "Title",
                                  val: formData.title || "—",
                                  color: ACCENT_PURPLE.base,
                                },
                                {
                                  label: "Batch",
                                  val: formData.batch
                                    ? `Batch ${formData.batch}`
                                    : "—",
                                  color: "#2563eb",
                                },
                                {
                                  label: "Max Marks",
                                  val: formData.maxMarks || "—",
                                  color: "#059669",
                                },
                              ].map(({ label, val, color }) => (
                                <div
                                  key={label}
                                  style={{
                                    background: t.actBg,
                                    border: `1px solid ${t.border}`,
                                    borderTop: `2px solid ${color}50`,
                                    borderRadius: 9,
                                    padding: "9px 12px",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: 9,
                                      fontWeight: 700,
                                      color: t.textMuted,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.07em",
                                      fontFamily: FONT_FAMILY,
                                      marginBottom: 4,
                                    }}
                                  >
                                    {label}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 12.5,
                                      fontWeight: 700,
                                      color: t.text,
                                      fontFamily: FONT_FAMILY,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {val}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                paddingTop: 2,
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => setOpen("details")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  fontSize: 11.5,
                                  color: t.textMuted,
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  fontFamily: FONT_FAMILY,
                                  fontWeight: 500,
                                }}
                              >
                                <ChevronRight
                                  size={11}
                                  style={{ transform: "rotate(180deg)" }}
                                />{" "}
                                Back
                              </button>
                              <button
                                type="submit"
                                className="ca-submit"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <>
                                    <div
                                      style={{
                                        width: 13,
                                        height: 13,
                                        border:
                                          "2px solid rgba(255,255,255,0.35)",
                                        borderTop: "2px solid #fff",
                                        borderRadius: "50%",
                                        animation:
                                          "ca-spin 0.85s linear infinite",
                                      }}
                                    />
                                    Creating…
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle size={13} />
                                    Create Assignment
                                  </>
                                )}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </form>
      {upgradeConfig && (
        <UpgradeModal
          isOpen={!!upgradeConfig}
          onClose={() => setUpgradeConfig(null)}
          planType="individual"
          userId={getAuthTokenUserId()}
          currentPlan={usage?.tier || "free"}
          availableTargetPlans={["pro", "premium"]}
          featureLabel={upgradeConfig.featureLabel}
          onSuccess={() => {
            setUpgradeConfig(null);
            fetchUsage();
          }}
        />
      )}
    </PageContainer>
  );
};

export default CreateAssignments;
