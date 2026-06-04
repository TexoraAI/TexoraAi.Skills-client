import React, { useState, useCallback } from "react";
import {
  X, Save, Loader2, CheckCircle2, Pencil,
  BookOpen, ChevronLeft, ChevronRight,
} from "lucide-react";
import ProgramBasicInfo from "../components/ProgramBasicInfo";
import CourseDetailsTab from "../components/CourseDetailsTab";
import ProgramAbout from "../components/ProgramAbout";
import LearningOutcomes from "../components/LearningOutcomes";
import ProgramHighlights from "../components/ProgramHighlights";
import ProgramFaqs from "../components/ProgramFaqs";
import SyllabusManager from "../components/SyllabusManager";

// ─── TAB DEFINITIONS ───────────────────────────────────────────────────────────
const TABS = [
  { id: "basic",      label: "Basic Info",    shortLabel: "Basic" },
  { id: "details",    label: "Course Details", shortLabel: "Details" },
  { id: "about",      label: "About",          shortLabel: "About" },
  { id: "outcomes",   label: "Outcomes",       shortLabel: "Outcomes" },
  { id: "highlights", label: "Highlights",     shortLabel: "Highlights" },
  { id: "faqs",       label: "FAQs",           shortLabel: "FAQs" },
  { id: "syllabus",   label: "Syllabus",       shortLabel: "Syllabus" },
];

// ─── BLANK FORM ────────────────────────────────────────────────────────────────
export const blankForm = () => ({
  title: "", slug: "", thumbnail: null, banner: null,
  categoryId: "", instructorName: "", instructorCompany: "",
  difficultyLevel: "Beginner", durationWeeks: "", lessonsCount: "",
  projectsCount: "", studentsCount: "", rating: "", price: "",
  offerText: "", displayOrder: "", status: "Active",
  shortDescription: "", aboutContent: "",
  learningOutcomes: [], highlights: [], faqs: [],
  programBenefits: [], careerOpportunities: [], detailsLearningOutcomes: [],
  enrollmentButtonText: "Enroll Now", enrollmentUrl: "",
  syllabusButtonText: "Download Syllabus",
  syllabus: { mode: "manual", weeks: [], uploadedFile: null, generatedPreview: null },
});

// ─── VALIDATION ────────────────────────────────────────────────────────────────
const validate = (fd) => {
  const e = {};
  if (!fd.title?.trim())          e.title = "Title is required";
  if (!fd.categoryId)             e.categoryId = "Category is required";
  if (!fd.instructorName?.trim()) e.instructorName = "Instructor name is required";
  return e;
};

const generateSlug = (title) =>
  title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

// ─── VIEW MODE CONTENT ─────────────────────────────────────────────────────────
const ViewProgramContent = ({ program, categories, onEdit }) => {
  const category = categories.find((c) => String(c.id) === String(program.categoryId));
  const diffColors = {
    Beginner:     "bg-blue-100 text-blue-700",
    Intermediate: "bg-amber-100 text-amber-700",
    Advanced:     "bg-purple-100 text-purple-700",
  };

  return (
    <div className="space-y-4 p-4">
      <div className="w-full h-28 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
        <div className="text-white opacity-80"><BookOpen size={32} /></div>
      </div>

      <div>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-gray-900 text-base leading-snug">{program.title}</h3>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${program.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${program.status === "Active" ? "bg-emerald-500" : "bg-red-400"}`} />
            {program.status}
          </span>
        </div>
        <p className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mb-2">/{program.slug}</p>
        <div className="flex flex-wrap gap-1.5">
          {category && <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">{category.name}</span>}
          {program.difficultyLevel && (
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${diffColors[program.difficultyLevel] || "bg-gray-100 text-gray-600"}`}>
              {program.difficultyLevel}
            </span>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold">
          {(program.instructorName || "?")[0]}
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">{program.instructorName}</p>
          <p className="text-xs text-gray-500">{program.instructorCompany}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Price",    value: `₹${Number(program.price || 0).toLocaleString()}`, sub: program.offerText },
          { label: "Duration", value: `${program.durationWeeks || 0}w` },
          { label: "Lessons",  value: program.lessonsCount || 0 },
          { label: "Projects", value: program.projectsCount || 0 },
          { label: "Students", value: Number(program.studentsCount || 0).toLocaleString() },
          { label: "Rating",   value: program.rating || "N/A" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg px-2 py-2 text-center">
            <div className="text-gray-900 font-bold text-sm">{s.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            {s.sub && <div className="text-xs text-emerald-600 font-medium mt-0.5 leading-tight">{s.sub}</div>}
          </div>
        ))}
      </div>

      {program.shortDescription && (
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">About</p>
          <p className="text-sm text-gray-700">{program.shortDescription}</p>
        </div>
      )}

      {program.learningOutcomes?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Learning Outcomes</p>
          <ul className="space-y-1">
            {program.learningOutcomes.map((item) => (
              <li key={item.id} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs flex-shrink-0">✓</span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {program.highlights?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Highlights</p>
          <div className="grid grid-cols-2 gap-1.5">
            {program.highlights.map((h) => (
              <div key={h.id} className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1.5">
                <span>{h.icon || "⭐"}</span>
                <span className="text-xs text-gray-700">{h.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
        <span>Order: <strong className="text-gray-600">#{program.displayOrder}</strong></span>
        <span>Created: <strong className="text-gray-600">{program.createdAt}</strong></span>
      </div>

      <button
        onClick={() => onEdit(program)}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
      >
        <Pencil size={14} /> Edit Program
      </button>
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function AddEditProgram({
  mode,
  program,
  categories,
  onCategoriesChange,
  onSave,
  onClose,
  onSwitchToEdit,
}) {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState(() =>
    (isEdit || isView) && program ? { ...blankForm(), ...program } : blankForm()
  );
  const [activeTab,  setActiveTab]  = useState("basic");
  const [errors,     setErrors]     = useState({});
  const [errorTabs,  setErrorTabs]  = useState(new Set());
  const [saving,     setSaving]     = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const currentIdx = TABS.findIndex((t) => t.id === activeTab);

  const updateField = useCallback((field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title") next.slug = generateSlug(value);
      return next;
    });
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  }, [errors]);

  const mergeData = useCallback((partial) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleSave = async () => {
    const errs = validate(formData);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setErrorTabs(new Set(["basic"]));
      setActiveTab("basic");
      return;
    }
    setErrorTabs(new Set());
    setSaving(true);
    setSaveStatus("saving");
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setSaveStatus("saved");
    setTimeout(() => { onSave(formData); setSaveStatus(null); }, 400);
  };

  const headerBg = isView ? "bg-gradient-to-r from-indigo-600 to-purple-600"
    : isEdit ? "bg-indigo-700"
    : "bg-indigo-600";

  const headerTitle = isView ? (program?.title || "View Program")
    : isEdit ? "Edit Program"
    : "Add New Program";

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Header ── */}
      <div className={`${headerBg} px-4 py-3 flex items-center justify-between flex-shrink-0`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white flex-shrink-0">
            <BookOpen size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-white/70 font-semibold uppercase tracking-widest leading-none mb-0.5">
              FEATURED PROGRAMS
            </p>
            <h2 className="text-white font-bold text-sm leading-tight truncate max-w-[220px]">{headerTitle}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isView && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" />
                : saveStatus === "saved" ? <CheckCircle2 size={14} />
                : <Save size={14} />}
              {saving ? "Saving…" : saveStatus === "saved" ? "Saved!" : "Save"}
            </button>
          )}
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* ── VIEW MODE ── */}
      {isView ? (
        <div className="flex-1 overflow-y-auto">
          <ViewProgramContent program={program} categories={categories} onEdit={onSwitchToEdit} />
        </div>
      ) : (
        <>
          {/* ── Tab Bar ── */}
          <div className="border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex overflow-x-auto">
              {TABS.map((tab, idx) => {
                const isActive = activeTab === tab.id;
                const hasError = errorTabs.has(tab.id);
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={[
                      "relative flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-all flex-shrink-0",
                      isActive  ? "text-indigo-600 border-indigo-500 bg-indigo-50/60"
                      : hasError ? "text-red-500 border-transparent hover:border-red-300"
                      : "text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300",
                    ].join(" ")}
                  >
                    <span className={[
                      "flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold flex-shrink-0",
                      isActive  ? "bg-indigo-500 text-white"
                      : hasError ? "bg-red-100 text-red-500"
                      : "bg-slate-100 text-slate-400",
                    ].join(" ")}>
                      {hasError ? "!" : idx + 1}
                    </span>
                    <span>{tab.shortLabel}</span>
                    {hasError && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Tab Content (only this scrolls) ── */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {activeTab === "basic" && (
                <ProgramBasicInfo
                  data={formData} categories={categories} errors={errors}
                  onChange={updateField} onCategoriesChange={onCategoriesChange}
                />
              )}
              {activeTab === "details"    && <CourseDetailsTab data={formData} onChange={updateField} />}
              {activeTab === "about"      && (
                <ProgramAbout
                  data={{ shortDescription: formData.shortDescription, aboutContent: formData.aboutContent }}
                  onChange={mergeData}
                />
              )}
              {activeTab === "outcomes"   && <LearningOutcomes  data={{ learningOutcomes: formData.learningOutcomes }} onChange={mergeData} />}
              {activeTab === "highlights" && <ProgramHighlights  data={{ highlights: formData.highlights }}            onChange={mergeData} />}
              {activeTab === "faqs"       && <ProgramFaqs        data={{ faqs: formData.faqs }}                        onChange={mergeData} />}
              {activeTab === "syllabus"   && (
                <SyllabusManager syllabusData={formData.syllabus} onChange={(v) => updateField("syllabus", v)} />
              )}
            </div>
          </div>

          {/* ── Footer Navigation ── */}
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => currentIdx > 0 && setActiveTab(TABS[currentIdx - 1].id)}
                disabled={currentIdx === 0}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              {currentIdx < TABS.length - 1 && (
                <button
                  onClick={() => setActiveTab(TABS[currentIdx + 1].id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-all"
                >
                  {TABS[currentIdx + 1].shortLabel} <ChevronRight size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1">
                {TABS.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} title={tab.label}
                    className={`rounded-full transition-all ${activeTab === tab.id ? "w-4 h-2 bg-indigo-500" : "w-2 h-2 bg-slate-300 hover:bg-slate-400"}`}
                  />
                ))}
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Program"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}