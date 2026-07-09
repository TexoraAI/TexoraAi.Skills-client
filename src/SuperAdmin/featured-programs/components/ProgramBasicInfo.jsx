import { useState, useRef, useEffect } from "react";
import {
  Check,
  ChevronDown,
  Plus,
  Image as ImageIcon,
  User,
  Linkedin,
} from "lucide-react";
import { COMPANIES } from "../pages/FeaturedProgramsList";
import ImageUploadField from "./ImageUploadField";

/* ─── Shared input class ──────────────────────────────────────────────────── */
const inputCls = (err) =>
  `w-full px-2.5 py-2 text-sm border rounded-lg outline-none transition-all
   focus:ring-2 focus:ring-indigo-500 focus:border-transparent
   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
   ${
     err
       ? "border-red-400 bg-red-50 dark:bg-red-900/20"
       : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
   }`;

/* ─── Field wrapper ───────────────────────────────────────────────────────── */
const Field = ({ label, required, children, error }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="mt-0.5 text-xs text-red-500">{error}</p>}
  </div>
);

const generateSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

/* ─── Custom Dropdown with "Add New" at the bottom ───────────────────────── */
function AddableDropdown({
  value,
  options,
  placeholder,
  onSelect,
  onAddNew,
  addLabel,
  error,
}) {
  const [open, setOpen] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [newValue, setNewValue] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus input when add mode opens
  useEffect(() => {
    if (addMode && inputRef.current) inputRef.current.focus();
  }, [addMode]);

  const handleAdd = () => {
    const trimmed = newValue.trim();
    if (!trimmed) return;
    onAddNew(trimmed);
    setNewValue("");
    setAddMode(false);
    setOpen(false);
  };

  const selectedLabel = options.find((o) => {
    const v = typeof o === "string" ? o : String(o.id);
    return v === value || o === value;
  });
  const displayLabel = selectedLabel
    ? typeof selectedLabel === "string"
      ? selectedLabel
      : selectedLabel.name
    : "";

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setAddMode(false);
        }}
        className={[
          "w-full flex items-center justify-between px-2.5 py-2 text-sm border rounded-lg transition-all text-left",
          "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
          open
            ? "ring-2 ring-indigo-500 border-transparent"
            : error
              ? "border-red-400"
              : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500",
        ].join(" ")}
      >
        <span
          className={
            displayLabel
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-400 dark:text-gray-500"
          }
        >
          {displayLabel || placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`flex-shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-52 overflow-y-auto">
            {options.map((opt) => {
              const val = typeof opt === "string" ? opt : String(opt.id);
              const label = typeof opt === "string" ? opt : opt.name;
              const isSelected = val === value || opt === value;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    onSelect(val);
                    setOpen(false);
                  }}
                  className={[
                    "w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors",
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
                  ].join(" ")}
                >
                  {label}
                  {isSelected && <Check size={13} className="flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Divider + Add New */}
          <div className="border-t border-gray-100 dark:border-gray-700">
            {addMode ? (
              <div className="p-2 flex gap-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdd();
                    if (e.key === "Escape") {
                      setAddMode(false);
                      setNewValue("");
                    }
                  }}
                  placeholder={`Enter ${addLabel.toLowerCase()}…`}
                  className="flex-1 px-2.5 py-1.5 text-sm border border-indigo-300 dark:border-indigo-600 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-gray-900 dark:text-gray-100 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={handleAdd}
                  className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1"
                >
                  <Check size={11} /> Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddMode(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
              >
                <Plus size={14} />
                {addLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function ProgramBasicInfo({
  data,
  categories,
  errors,
  onChange,
  onCategoriesChange,
}) {
  const [companies, setCompanies] = useState(COMPANIES);

  const handleTitle = (val) => {
    onChange("title", val);
    onChange("slug", generateSlug(val));
  };

  const handleAddCategory = (name) => {
    const newCat = {
      id: Date.now(),
      name,
      slug: generateSlug(name),
      displayOrder: categories.length + 1,
      status: "active",
    };
    onCategoriesChange([...categories, newCat]);
    onChange("categoryId", String(newCat.id));
  };

  const handleAddCompany = (name) => {
    setCompanies((prev) => [...prev, name]);
    onChange("instructorCompany", name);
  };

  return (
    <div className="space-y-4">
      <div className="pb-2 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
          Basic Information
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Title, category, instructor &amp; status
        </p>
      </div>

      {/* Course Title */}
      <Field label="Course Title" required error={errors.title}>
        <input
          type="text"
          value={data.title}
          onChange={(e) => handleTitle(e.target.value)}
          placeholder="e.g. Product Management Mastery"
          className={inputCls(errors.title)}
        />
      </Field>

      {/* Course Slug */}
      <Field label="Course Slug">
        <input
          type="text"
          value={data.slug}
          onChange={(e) => onChange("slug", e.target.value)}
          placeholder="auto-generated-from-title"
          className={
            inputCls(false) +
            " font-mono text-indigo-600 dark:text-indigo-400 text-xs"
          }
        />
      </Field>

      {/* ── Course Media ─────────────────────────────────────────────── */}
      <div className="pt-3 mt-1 border-t border-gray-100 dark:border-gray-700">
        <h4 className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
          <ImageIcon size={13} /> Course Media
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ImageUploadField
            label="Course Banner Image"
            value={data.bannerUrl}
            onChange={(val) => onChange("bannerUrl", val)}
            aspect="aspect-[3/1]"
            hint="Wide banner shown on the program landing page"
          />
          <ImageUploadField
            label="Course Thumbnail"
            value={data.thumbnailUrl}
            onChange={(val) => onChange("thumbnailUrl", val)}
            aspect="aspect-video"
            hint="Shown on program cards and listings"
          />
        </div>
        <div className="mt-3">
          <Field label="Preview Video URL">
            <input
              type="url"
              value={data.videoUrl || ""}
              onChange={(e) => onChange("videoUrl", e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className={inputCls(false)}
            />
          </Field>
        </div>
      </div>

      {/* Category */}
      <Field label="Category" required error={errors.categoryId}>
        <AddableDropdown
          value={data.categoryId}
          options={categories}
          placeholder="Select Category"
          onSelect={(val) => onChange("categoryId", val)}
          onAddNew={handleAddCategory}
          addLabel="+ Add New Category"
          error={errors.categoryId}
        />
      </Field>

      {/* ── Instructor ───────────────────────────────────────────────── */}
      <div className="pt-3 mt-1 border-t border-gray-100 dark:border-gray-700">
        <h4 className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
          <User size={13} /> Instructor
        </h4>

        <div className="flex gap-3 mb-3">
          <div className="w-24 flex-shrink-0">
            <ImageUploadField
              label="Photo"
              value={data.instructorPhotoUrl}
              onChange={(val) => onChange("instructorPhotoUrl", val)}
              aspect="aspect-square"
            />
          </div>
          <div className="flex-1 grid grid-cols-1 gap-2.5">
            <Field label="Instructor" required error={errors.instructorName}>
              <input
                type="text"
                value={data.instructorName}
                onChange={(e) => onChange("instructorName", e.target.value)}
                placeholder="Full Name"
                className={inputCls(errors.instructorName)}
              />
            </Field>
            <Field label="Designation">
              <input
                type="text"
                value={data.instructorRole || ""}
                onChange={(e) => onChange("instructorRole", e.target.value)}
                placeholder="e.g. Senior Product Manager"
                className={inputCls(false)}
              />
            </Field>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Field label="Company">
            <AddableDropdown
              value={data.instructorCompany}
              options={companies}
              placeholder="Select"
              onSelect={(val) => onChange("instructorCompany", val)}
              onAddNew={handleAddCompany}
              addLabel="+ Add New Company"
              error={false}
            />
          </Field>
          <Field label="Experience">
            <input
              type="text"
              value={data.experience || ""}
              onChange={(e) => onChange("experience", e.target.value)}
              placeholder="e.g. 8+ years"
              className={inputCls(false)}
            />
          </Field>
        </div>

        <div className="mt-2.5">
          <Field label="LinkedIn URL">
            <div className="relative">
              <Linkedin
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="url"
                value={data.instructorLinkedIn || ""}
                onChange={(e) => onChange("instructorLinkedIn", e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className={inputCls(false) + " pl-7"}
              />
            </div>
          </Field>
        </div>
      </div>

      {/* Difficulty Level */}
      <Field label="Difficulty Level">
        <div className="flex gap-1.5">
          {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => onChange("difficultyLevel", lvl)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all
                ${
                  data.difficultyLevel === lvl
                    ? lvl === "Beginner"
                      ? "bg-blue-500 text-white border-blue-500"
                      : lvl === "Intermediate"
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-purple-500 text-white border-purple-500"
                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </Field>

      {/* Status */}
      <Field label="Status">
        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
          {[
            { val: "Active", activeClass: "bg-emerald-500 text-white" },
            { val: "Inactive", activeClass: "bg-red-500 text-white" },
          ].map(({ val, activeClass }) => (
            <button
              key={val}
              type="button"
              onClick={() => onChange("status", val)}
              className={`flex-1 py-2 text-sm font-semibold transition-all
                ${
                  data.status === val
                    ? activeClass
                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
            >
              {val}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}
