// src/trainer/CreateAssignments.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ChevronRight, FileText, List, Upload, X } from "lucide-react";
import { createAssignment, uploadAssignmentFile } from "@/services/assessmentService";
import { getTrainerBatches } from "@/services/batchService";
import {
  useTrainerTheme, PageShell, PageHero, ThemedCard,
  ThemedInput, ThemedTextarea, ThemedSelect, FieldLabel,
  PrimaryButton, SecondaryButton,
} from "./trainerTheme";

const PANELS = ["basic", "details", "attachments"];

const CreateAssignments = () => {
  const navigate = useNavigate();
  const { t, isDark } = useTrainerTheme();

  const [batches, setBatches] = useState([]);
  const [open, setOpen] = useState("basic");
  const [formData, setFormData] = useState({
    title: "", description: "", batch: "",
    deadline: "", maxMarks: "", duration: "", attachments: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadBatches = async () => {
      try {
        const res = await getTrainerBatches();
        setBatches(res || []);
      } catch (err) { console.error("Failed to load trainer batches", err); }
    };
    loadBatches();
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, attachments: files }));
  };

  const removeFile = (index) => {
    setFormData((prev) => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await createAssignment({
        title: formData.title, description: formData.description,
        batchId: Number(formData.batch), deadline: formData.deadline,
        maxMarks: Number(formData.maxMarks), duration: formData.duration,
      });
      const assignmentId = response.data.id;
      if (formData.attachments.length > 0) {
        for (let file of formData.attachments) {
          await uploadAssignmentFile(assignmentId, file);
        }
      }
      setShowSuccess(true);
      setFormData({ title: "", description: "", batch: "", deadline: "", maxMarks: "", duration: "", attachments: [] });
    } catch (error) {
      console.error("Assignment creation error:", error);
      alert("Failed to create assignment.");
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
    basic:       { num: 1, label: "Basic Information",    sub: "Title & description",       color: "#7c3aed", next: "details",      nextLabel: "Continue to Details" },
    details:     { num: 2, label: "Assignment Details",   sub: "Batch, deadline & marks",   color: "#2563eb", next: "attachments",  nextLabel: "Continue to Attachments" },
    attachments: { num: 3, label: "Attachments & Submit", sub: `${formData.attachments.length} file${formData.attachments.length !== 1 ? "s" : ""} selected`, color: "#34d399", next: null, nextLabel: null },
  };

  return (
    <PageShell t={t}>
      {/* HERO
      <PageHero
        t={t} isDark={isDark}
        icon={FileText}
        badge="Assessments"
        title="Create Assignment"
        subtitle="Build assignments with attachments for your students."
        color="#7c3aed"
        right={
          <button
            onClick={() => navigate("/trainer/my-assignments")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 16px", borderRadius: 12, cursor: "pointer",
              background: t.actBg, border: `1px solid ${t.border}`,
              color: t.textSub, fontSize: 12, fontWeight: 600,
              fontFamily: "'Poppins',sans-serif", transition: "all 0.2s",
            }}
          >
            <List size={13} /> My Assignments
          </button>
        }
      /> */}

      {/* SUCCESS BANNER */}
      {showSuccess && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 18px", borderRadius: 14, marginBottom: 16,
          background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)",
        }}>
          <CheckCircle size={16} color="#34d399" />
          <p style={{ fontSize: 13, fontWeight: 600, color: "#34d399", margin: 0, fontFamily: "'Poppins',sans-serif" }}>
            Assignment Created Successfully!
          </p>
        </div>
      )}

      {/* STEPPER */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, borderRadius: 20, overflow: "hidden", border: `1px solid ${t.border}`, boxShadow: t.shadow }}>
          {PANELS.map((key, idx) => {
            const meta = panelMeta[key];
            const isOpen = open === key;
            const isCompleted = completedPanels[key];
            const isLast = idx === PANELS.length - 1;

            return (
              <div key={key} style={{ borderBottom: !isLast ? `1px solid ${t.border}` : "none" }}>
                {/* Header */}
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "16px 20px", textAlign: "left",
                    background: isOpen ? `${meta.color}06` : t.cardBg,
                    border: "none", cursor: "pointer", transition: "background 0.2s",
                    borderBottom: isOpen ? `1px solid ${t.border}` : "none",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 999,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isCompleted ? "rgba(52,211,153,0.15)" : isOpen ? `${meta.color}20` : t.inputBg,
                    border: `1px solid ${isCompleted ? "rgba(52,211,153,0.3)" : isOpen ? `${meta.color}40` : t.inputBorder}`,
                    flexShrink: 0, transition: "all 0.2s",
                  }}>
                    {isCompleted
                      ? <CheckCircle size={14} color="#34d399" />
                      : <span style={{ fontSize: 11, fontWeight: 800, color: isOpen ? meta.color : t.textMuted, fontFamily: "'Poppins',sans-serif" }}>{meta.num}</span>
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: isOpen ? t.text : t.textSub, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{meta.label}</p>
                    <p style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{meta.sub}</p>
                  </div>
                  <div style={{ display: "flex", gap: 4, marginRight: 8 }}>
                    {PANELS.map((p, pi) => (
                      <span key={p} style={{
                        borderRadius: 999, transition: "all 0.3s",
                        width: p === key ? 18 : 6, height: 6,
                        background: p === key ? meta.color : pi < PANELS.indexOf(key) ? "#94a3b8" : t.barBg,
                      }} />
                    ))}
                  </div>
                  <ChevronRight size={14} color={t.textMuted} style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                </button>

                {/* Body */}
                {isOpen && (
                  <div style={{ background: t.cardBg, padding: "20px 20px 24px" }}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ width: 1, background: `${meta.color}30`, borderRadius: 999, flexShrink: 0 }} />
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* PANEL 1 */}
                        {key === "basic" && (
                          <>
                            <div>
                              <FieldLabel t={t}>Assignment Title</FieldLabel>
                              <ThemedInput t={t} placeholder="e.g. React Hooks Assignment" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div>
                              <FieldLabel t={t}>Description</FieldLabel>
                              <ThemedTextarea t={t} rows={3} placeholder="Describe the assignment task..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                              <PrimaryButton color={meta.color} type="button" onClick={() => setOpen("details")}>
                                {meta.nextLabel} <ChevronRight size={13} />
                              </PrimaryButton>
                            </div>
                          </>
                        )}

                        {/* PANEL 2 */}
                        {key === "details" && (
                          <>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                              <div>
                                <FieldLabel t={t}>Select Batch</FieldLabel>
                                <ThemedSelect t={t} value={formData.batch} onChange={(e) => setFormData({ ...formData, batch: e.target.value })} required>
                                  <option value="">Select Batch</option>
                                  {batches.map((b) => (<option key={b.id} value={b.id}>Batch {b.id}</option>))}
                                </ThemedSelect>
                              </div>
                              <div>
                                <FieldLabel t={t}>Deadline</FieldLabel>
                                <ThemedInput t={t} type="datetime-local" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required />
                              </div>
                              <div>
                                <FieldLabel t={t}>Maximum Marks</FieldLabel>
                                <ThemedInput t={t} type="number" placeholder="e.g. 100" value={formData.maxMarks} onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })} required />
                              </div>
                              <div>
                                <FieldLabel t={t}>Duration (optional)</FieldLabel>
                                <ThemedInput t={t} placeholder="e.g. 2 hours" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                              </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                              <PrimaryButton color={meta.color} type="button" onClick={() => setOpen("attachments")}>
                                {meta.nextLabel} <ChevronRight size={13} />
                              </PrimaryButton>
                            </div>
                          </>
                        )}

                        {/* PANEL 3 */}
                        {key === "attachments" && (
                          <>
                            <label style={{ cursor: "pointer" }}>
                              <div style={{
                                borderRadius: 16, border: `2px dashed ${t.inputBorder}`,
                                padding: "32px 24px", textAlign: "center", background: t.inputBg,
                                transition: "all 0.2s",
                              }}>
                                <div style={{
                                  width: 40, height: 40, borderRadius: 12,
                                  background: t.actBg, border: `1px solid ${t.border}`,
                                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px",
                                }}>
                                  <Upload size={16} color={t.textMuted} />
                                </div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: t.textSub, margin: "0 0 4px", fontFamily: "'Poppins',sans-serif" }}>Click to upload files</p>
                                <p style={{ fontSize: 11, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>PDF, DOC, DOCX, ZIP, TXT</p>
                                <input type="file" multiple onChange={handleFileChange} hidden accept=".pdf,.doc,.docx,.zip,.txt" />
                              </div>
                            </label>

                            {formData.attachments.length > 0 && (
                              <div style={{ borderRadius: 14, border: `1px solid ${t.border}`, overflow: "hidden" }}>
                                {formData.attachments.map((file, index) => (
                                  <div key={index} style={{
                                    display: "flex", alignItems: "center", gap: 10,
                                    padding: "10px 14px",
                                    borderBottom: index < formData.attachments.length - 1 ? `1px solid ${t.border}` : "none",
                                  }}>
                                    <div style={{
                                      width: 24, height: 24, borderRadius: 7,
                                      background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)",
                                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                    }}>
                                      <FileText size={12} color="#7c3aed" />
                                    </div>
                                    <span style={{ fontSize: 12, color: t.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins',sans-serif" }}>{file.name}</span>
                                    <button type="button" onClick={() => removeFile(index)} style={{
                                      width: 20, height: 20, borderRadius: 999, background: t.actBg,
                                      border: `1px solid ${t.border}`, display: "flex", alignItems: "center",
                                      justifyContent: "center", cursor: "pointer", flexShrink: 0,
                                    }}>
                                      <X size={10} color={t.textMuted} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Summary */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                              {[
                                { label: "Title",     val: formData.title || "—" },
                                { label: "Batch",     val: formData.batch ? `Batch ${formData.batch}` : "—" },
                                { label: "Max Marks", val: formData.maxMarks || "—" },
                              ].map(({ label, val }) => (
                                <div key={label} style={{
                                  background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`,
                                  borderRadius: 12, padding: "10px 14px",
                                }}>
                                  <p style={{ fontSize: 9, color: t.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, fontFamily: "'Poppins',sans-serif" }}>{label}</p>
                                  <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</p>
                                </div>
                              ))}
                            </div>

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <button type="button" onClick={() => setOpen("details")} style={{
                                display: "flex", alignItems: "center", gap: 4,
                                fontSize: 12, color: t.textMuted, background: "none", border: "none",
                                cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontWeight: 500,
                              }}>
                                <ChevronRight size={12} style={{ transform: "rotate(180deg)" }} /> Back to Details
                              </button>
                              <PrimaryButton color="#7c3aed" type="submit" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.6 : 1 }}>
                                {isSubmitting ? (
                                  <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Creating…</>
                                ) : (
                                  <><CheckCircle size={14} /> Create Assignment</>
                                )}
                              </PrimaryButton>
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
    </PageShell>
  );
};

export default CreateAssignments;