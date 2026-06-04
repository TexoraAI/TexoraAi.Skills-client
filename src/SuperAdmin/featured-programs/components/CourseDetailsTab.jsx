const inputCls = "w-full px-2.5 py-2 text-sm border border-gray-200 rounded-lg outline-none transition-all focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-300 bg-white";

const Field = ({ label, children, hint }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">{label}</label>
    {children}
    {hint && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
  </div>
);

export default function CourseDetailsTab({ data, onChange }) {
  return (
    <div className="space-y-4">
      <div className="pb-2 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">Course Details</h3>
        <p className="text-xs text-gray-500">Duration, pricing, and enrollment numbers</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {[
          { key: "durationWeeks", label: "Duration (Weeks)", placeholder: "12", hint: "e.g. 12" },
          { key: "lessonsCount",  label: "Lessons",          placeholder: "81" },
          { key: "projectsCount", label: "Projects",         placeholder: "3"  },
          { key: "studentsCount", label: "Students Enrolled",placeholder: "500" },
          { key: "rating",        label: "Rating (0–5)",     placeholder: "4.8", hint: "Between 0 and 5" },
          { key: "displayOrder",  label: "Display Order",    placeholder: "1",  hint: "1 = first" },
        ].map(({ key, label, placeholder, hint }) => (
          <Field key={key} label={label} hint={hint}>
            <input
              type="number"
              value={data[key] || ""}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder={placeholder}
              className={inputCls}
              min="0"
            />
          </Field>
        ))}
      </div>

      <div className="pt-2 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="Price (₹)">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
              <input
                type="number"
                value={data.price || ""}
                onChange={(e) => onChange("price", e.target.value)}
                placeholder="12999"
                className={inputCls + " pl-7"}
                min="0"
              />
            </div>
          </Field>
          <Field label="Offer Text">
            <input
              type="text"
              value={data.offerText || ""}
              onChange={(e) => onChange("offerText", e.target.value)}
              placeholder="50% OFF"
              className={inputCls}
            />
          </Field>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Enrollment CTAs</h4>
        <div className="space-y-2.5">
          <Field label="Enrollment Button Text">
            <input
              type="text"
              value={data.enrollmentButtonText || ""}
              onChange={(e) => onChange("enrollmentButtonText", e.target.value)}
              placeholder="Enroll Now"
              className={inputCls}
            />
          </Field>
          <Field label="Enrollment URL">
            <input
              type="url"
              value={data.enrollmentUrl || ""}
              onChange={(e) => onChange("enrollmentUrl", e.target.value)}
              placeholder="https://..."
              className={inputCls}
            />
          </Field>
          <Field label="Syllabus Button Text">
            <input
              type="text"
              value={data.syllabusButtonText || ""}
              onChange={(e) => onChange("syllabusButtonText", e.target.value)}
              placeholder="Download Syllabus"
              className={inputCls}
            />
          </Field>
        </div>
      </div>

      {/* Preview Card */}
      {(data.price || data.offerText) && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-indigo-700 mb-2 uppercase tracking-wide">Preview</p>
          <div className="flex items-baseline gap-2">
            {data.price && (
              <span className="text-2xl font-bold text-gray-900">₹{Number(data.price).toLocaleString()}</span>
            )}
            {data.offerText && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">{data.offerText}</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            {data.durationWeeks && <span>⏱ {data.durationWeeks} weeks</span>}
            {data.lessonsCount && <span>📚 {data.lessonsCount} lessons</span>}
            {data.projectsCount && <span>🛠 {data.projectsCount} projects</span>}
          </div>
        </div>
      )}
    </div>
  );
}