import React, { useState } from "react";

function normalizeRole(rawRole) {
  const key = (rawRole || "").toString().trim().toLowerCase();

  if (key === "student") return "student";
  if (key === "trainer") return "trainer";

  const managerAliases = [
    "manager",
    "business",
    "partner",
    "partnership",
    "business & partnership",
    "business and partnership",
    "businesspartnership",
    "admin",
  ];
  if (managerAliases.includes(key)) return "Manager";

  // Unknown role string — fall back to student but don't fail silently.
  if (key && typeof console !== "undefined") {
    console.warn(
      `ProfileDetailsForm: unrecognised role "${rawRole}", defaulting to student form.`,
    );
  }
  return "student";
}

/* ─── Shared option lists ────────────────────────────────────────────────── */
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 45 }, (_, i) =>
  String(CURRENT_YEAR + 1 - i),
);

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Oman",
  "Singapore",
  "Germany",
  "France",
  "Netherlands",
  "Italy",
  "Spain",
  "Sweden",
  "Switzerland",
  "Ireland",
  "New Zealand",
  "Japan",
  "South Korea",
  "China",
  "Hong Kong",
  "Malaysia",
  "Indonesia",
  "Philippines",
  "Thailand",
  "Vietnam",
  "Pakistan",
  "Bangladesh",
  "Sri Lanka",
  "Nepal",
  "Bhutan",
  "Russia",
  "Brazil",
  "Mexico",
  "Argentina",
  "South Africa",
  "Nigeria",
  "Kenya",
  "Egypt",
  "Israel",
  "Turkey",
  "Poland",
];

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const INDIAN_CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Ahmedabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Jaipur",
  "Surat",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Faridabad",
  "Meerut",
  "Rajkot",
  "Varanasi",
  "Amritsar",
  "Ranchi",
  "Chandigarh",
  "Coimbatore",
  "Kochi",
  "Guwahati",
];

const QUALIFICATIONS = [
  "10th / Secondary",
  "12th / Senior Secondary",
  "Diploma",
  "Undergraduate (B.Tech / B.E / B.Sc / B.A / B.Com etc.)",
  "Postgraduate (M.Tech / M.Sc / MBA / M.A etc.)",
  "PhD / Doctorate",
  "ITI / Vocational Training",
];

const DOMAINS = [
  "Web Development",
  "Full Stack Development",
  "Data Science",
  "AI / Machine Learning",
  "Mobile App Development",
  "Cloud Computing",
  "DevOps",
  "Cybersecurity",
  "UI / UX Design",
  "Digital Marketing",
  "Business Analytics",
];

const EXPERIENCE_RANGES = [
  "Fresher / No experience",
  "0–1 year",
  "1–2 years",
  "2–5 years",
  "5–10 years",
  "10+ years",
];

/* ─── Field configs per role ─────────────────────────────────────────────── */
const ROLE_FIELDS = {
  /**
   * Keys match StudentDetailsTab in ProfilePage:
   *   mobileNumber, dateOfBirth, gender, city, state, country,
   *   qualification, collegeName, yearOfPassing, domain, experience
   */
  student: [
    {
      key: "mobileNumber",
      label: "Mobile Number",
      type: "tel",
      placeholder: "e.g. +91 9876543210",
      required: false,
      section: "Personal Details",
    },
    {
      key: "dateOfBirth",
      label: "Date of Birth",
      type: "date",
      placeholder: "",
      required: false,
      section: "Personal Details",
    },
    {
      key: "gender",
      label: "Gender",
      type: "select",
      options: ["Male", "Female", "Other", "Prefer not to say"],
      placeholder: "Select gender",
      required: false,
      section: "Personal Details",
    },
    {
      key: "city",
      label: "City",
      type: "select",
      options: INDIAN_CITIES,
      allowOther: true,
      placeholder: "Select your city",
      required: false,
      section: "Location",
    },
    {
      key: "state",
      label: "State",
      type: "select",
      options: INDIAN_STATES,
      allowOther: true,
      placeholder: "Select your state",
      required: false,
      section: "Location",
    },
    {
      key: "country",
      label: "Country",
      type: "select",
      options: COUNTRIES,
      allowOther: true,
      placeholder: "Select your country",
      required: false,
      section: "Location",
    },
    {
      key: "qualification",
      label: "Qualification",
      type: "select",
      options: QUALIFICATIONS,
      allowOther: true,
      placeholder: "Select qualification",
      required: false,
      section: "Education & Experience",
    },
    {
      key: "collegeName",
      label: "College / Institute",
      type: "text",
      placeholder: "e.g. IIT Delhi",
      required: false,
      section: "Education & Experience",
    },
    {
      key: "yearOfPassing",
      label: "Year of Passing",
      type: "select",
      options: YEAR_OPTIONS,
      placeholder: "Select year",
      required: false,
      section: "Education & Experience",
    },
    {
      key: "domain",
      label: "Domain / Area of Interest",
      type: "select",
      options: DOMAINS,
      allowOther: true,
      placeholder: "Select your domain",
      required: false,
      section: "Education & Experience",
    },
    {
      key: "experience",
      label: "Experience",
      type: "select",
      options: EXPERIENCE_RANGES,
      placeholder: "Select experience",
      required: false,
      section: "Education & Experience",
    },
  ],

  /**
   * Keys match TrainerDetailsTab in ProfilePage:
   *   linkedinUrl, country, courseTopic, audienceSize, fullTimeRole, platforms
   *
   * NOTE: `platforms` is collected as a multi-select here and joined into a
   * comma-separated string before sending to the API (see handleSubmit).
   */
  trainer: [
    {
      key: "linkedinUrl",
      label: "LinkedIn URL",
      type: "url",
      placeholder: "https://linkedin.com/in/…",
      required: false,
      section: "Professional Profile",
    },
    {
      key: "country",
      label: "Country",
      type: "select",
      options: COUNTRIES,
      allowOther: true,
      placeholder: "Select your country",
      required: false,
      section: "Professional Profile",
    },
    {
      key: "courseTopic",
      label: "Course Topic(s)",
      type: "text",
      placeholder: "e.g. React, Python, AWS",
      required: false,
      section: "Teaching Details",
    },
    {
      key: "audienceSize",
      label: "Audience Size",
      type: "select",
      options: ["0–1K", "1K–10K", "10K–100K", "100K+"],
      placeholder: "Select range",
      required: false,
      section: "Teaching Details",
    },
    {
      key: "fullTimeRole",
      label: "Is this your full-time role?",
      type: "select",
      options: ["Yes", "No"],
      placeholder: "Select",
      required: false,
      section: "Teaching Details",
    },
    {
      key: "platforms",
      label: "Platforms you teach on",
      type: "multiselect",
      options: [
        "IlmOra",
        "YouTube",
        "Udemy",
        "Coursera",
        "Skillshare",
        "LinkedIn Learning",
        "Other",
      ],
      required: false,
      section: "Teaching Details",
    },
  ],

  /**
   * Keys match AdminDetailsTab (business/Manager) in ProfilePage:
   *   mobileNumber, organizationName, websiteDomain, contactEmail,
   *   location, industry, description
   */
  Manager: [
    {
      key: "mobileNumber",
      label: "Phone Number",
      type: "tel",
      placeholder: "e.g. +91 9876543210",
      required: false,
      section: "Contact Details",
    },
    {
      key: "contactEmail",
      label: "Contact Email",
      type: "email",
      placeholder: "e.g. admin@acme.com",
      required: false,
      section: "Contact Details",
    },
    {
      key: "organizationName",
      label: "Organization Name",
      type: "text",
      placeholder: "e.g. Acme Corp",
      required: true,
      section: "Organization Info",
    },
    {
      key: "domain",
      label: "Website / Domain",
      type: "url",
      placeholder: "https://acme.com",
      required: false,
      section: "Organization Info",
    },
    {
      key: "location",
      label: "Location",
      type: "text",
      placeholder: "e.g. Hyderabad, India",
      required: false,
      section: "Organization Info",
    },
    {
      key: "industry",
      label: "Industry",
      type: "select",
      options: [
        "Technology",
        "Education",
        "Healthcare",
        "Finance",
        "Manufacturing",
        "Retail",
        "Consulting",
        "Government",
        "NGO",
        "Other",
      ],
      placeholder: "Select industry",
      required: false,
      section: "Organization Info",
    },
    {
      key: "description",
      label: "About Your Organization",
      type: "textarea",
      placeholder: "Brief description of what your organization does…",
      required: false,
      section: "Organization Info",
    },
  ],
};

/* ─── Role color / label / icon map ──────────────────────────────────────── */
const ROLE_META = {
  student: { color: "#27ae60", label: "Student", icon: "🎓" },
  trainer: { color: "#e67e22", label: "Trainer", icon: "🧑‍🏫" },
  Manager: { color: "#8e44ad", label: "Business & Partnership", icon: "🤝" },
};

const OTHER_SENTINEL = "__OTHER__";

/* ─── Spinner ─────────────────────────────────────────────────────────────── */
const ISpinner = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 12 12"
        to="360 12 12"
        dur="0.7s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
);

/* ─── API helper ─────────────────────────────────────────────────────────── */
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

async function patchAuth(path, token, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json().catch(() => ({}));
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function ProfileDetailsForm({
  role = "student",
  name = "",
  email = "",
  token = "",
  onSuccess,
  onBack,
  isEditMode = false,
}) {
  // THE FIX: look up fields/meta using the normalized role, not the raw prop.
  const normalizedRole = normalizeRole(role);
  const fields = ROLE_FIELDS[normalizedRole] || ROLE_FIELDS.student;
  const meta = ROLE_META[normalizedRole] || ROLE_META.student;

  // Initialise form — multiselect fields start as arrays
  const [form, setForm] = useState(() =>
    Object.fromEntries(
      fields.map((f) => [f.key, f.type === "multiselect" ? [] : ""]),
    ),
  );
  // Tracks which "allowOther" select fields are currently showing the
  // manual text box instead of the dropdown.
  const [customMode, setCustomMode] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key, val) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const toggleMulti = (key, option) =>
    setForm((prev) => {
      const cur = prev[key] || [];
      return {
        ...prev,
        [key]: cur.includes(option)
          ? cur.filter((x) => x !== option)
          : [...cur, option],
      };
    });

  const switchToOther = (key) => {
    setCustomMode((prev) => ({ ...prev, [key]: true }));
    handleChange(key, "");
  };

  const switchToList = (key) => {
    setCustomMode((prev) => ({ ...prev, [key]: false }));
    handleChange(key, "");
  };

  /* ── Build the payload sent to the DTO ── */
  const buildPayload = () => {
    const payload = { role };
    fields.forEach((f) => {
      if (f.type === "multiselect") {
        payload[f.key] = form[f.key] || []; // ← only this line changes
      } else {
        payload[f.key] = form[f.key];
      }
    });
    return payload;
  };
  const handleSubmit = async () => {
    const missing = fields.filter((f) => {
      if (!f.required) return false;
      const v = form[f.key];
      return Array.isArray(v) ? v.length === 0 : !v?.trim();
    });
    if (missing.length) {
      setError(`Please fill in: ${missing.map((f) => f.label).join(", ")}`);
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (normalizedRole === "Manager") {
        // ✅ Manager org fields go directly to Organization table in auth-service
        const orgId = localStorage.getItem("organizationId");
        if (orgId) {
          await fetch(`${API_BASE}/organizations/${orgId}/profile`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              organizationName: form.organizationName,
              domain: form.domain,
              contactEmail: form.contactEmail,
              location: form.location,
              industry: form.industry,
              description: form.description,
              mobileNumber: form.mobileNumber,
            }),
          });
        }
      } else {
        // ✅ Student and Trainer go through auth/me/profile → Kafka → user-service
        await patchAuth("/auth/me/profile", token, buildPayload());
      }

      // ✅ Always mark profile completed regardless of role
      await patchAuth("/auth/me/profile-completed", token, {});
      await new Promise((r) => setTimeout(r, 1200));

      const stored = (() => {
        try {
          return JSON.parse(localStorage.getItem("lms_user") || "{}");
        } catch {
          return {};
        }
      })();
      localStorage.setItem(
        "lms_user",
        JSON.stringify({ ...stored, profileCompleted: true }),
      );
      onSuccess && onSuccess();
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      console.error("ProfileDetailsForm error:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleSkip = async () => {
    setLoading(true);
    try {
      await patchAuth("/auth/me/profile-completed", token, {});
      const stored = (() => {
        try {
          return JSON.parse(localStorage.getItem("lms_user") || "{}");
        } catch {
          return {};
        }
      })();
      localStorage.setItem(
        "lms_user",
        JSON.stringify({ ...stored, profileCompleted: true }),
      );
      onSuccess && onSuccess();
    } catch {
      onSuccess && onSuccess();
    } finally {
      setLoading(false);
    }
  };

  /* ── Field renderer ── */
  const renderField = (f) => {
    if (f.type === "textarea") {
      return (
        <textarea
          className="pdf-input pdf-textarea"
          placeholder={f.placeholder}
          value={form[f.key]}
          onChange={(e) => handleChange(f.key, e.target.value)}
          rows={3}
        />
      );
    }

    if (f.type === "select") {
      const inOtherMode = !!customMode[f.key];

      if (f.allowOther && inOtherMode) {
        return (
          <div className="pdf-other-wrap">
            <input
              className="pdf-input"
              type="text"
              placeholder="Type it manually…"
              value={form[f.key]}
              onChange={(e) => handleChange(f.key, e.target.value)}
              autoFocus
            />
            <button
              type="button"
              className="pdf-other-link"
              onClick={() => switchToList(f.key)}
            >
              ↺ Choose from list instead
            </button>
          </div>
        );
      }

      return (
        <select
          className="pdf-input pdf-select"
          value={form[f.key]}
          onChange={(e) => {
            if (e.target.value === OTHER_SENTINEL) {
              switchToOther(f.key);
            } else {
              handleChange(f.key, e.target.value);
            }
          }}
        >
          <option value="">{f.placeholder || "Select…"}</option>
          {(f.options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
          {f.allowOther && (
            <option value={OTHER_SENTINEL}>Other (type manually)</option>
          )}
        </select>
      );
    }

    if (f.type === "multiselect") {
      return (
        <div className="pdf-multi">
          {(f.options || []).map((opt) => {
            const selected = (form[f.key] || []).includes(opt);
            return (
              <button
                key={opt}
                type="button"
                className={`pdf-multi-chip ${selected ? "pdf-multi-chip--on" : ""}`}
                style={
                  selected
                    ? {
                        borderColor: meta.color,
                        color: meta.color,
                        background: `${meta.color}15`,
                      }
                    : {}
                }
                onClick={() => toggleMulti(f.key, opt)}
              >
                {opt}
              </button>
            );
          })}
        </div>
      );
    }

    return (
      <input
        className="pdf-input"
        type={f.type}
        placeholder={f.placeholder}
        value={form[f.key]}
        onChange={(e) => handleChange(f.key, e.target.value)}
      />
    );
  };

  /* ── Group fields by section, preserving order ── */
  const sections = [];
  fields.forEach((f) => {
    const last = sections[sections.length - 1];
    if (last && last.title === f.section) {
      last.items.push(f);
    } else {
      sections.push({ title: f.section || "Details", items: [f] });
    }
  });

  return (
    <>
      <style>{formStyles}</style>
      <div className="pdf-overlay">
        <div
          className="pdf-modal"
          style={{
            "--role-color": meta.color,
            "--role-color-soft": `${meta.color}26`,
          }}
        >
          {/* Header */}
          <div className="pdf-hdr" style={{ background: meta.color }}>
            <div className="pdf-hdr-top">
              {/* Real ILM ORA brand mark — green ILM + orange ORA + BETA
                  badge on a white pill, same as the homepage logo, so it
                  stays legible and on-brand regardless of role colour. */}
              <div className="pdf-logo">
                <span className="pdf-logo-ilm">ILM</span>
                <span className="pdf-logo-ora">ORA</span>
                <span className="pdf-logo-beta">BETA</span>
              </div>
             
            </div>

            <div className="pdf-role-badge">
              <span className="pdf-role-icon">{meta.icon}</span>
              {meta.label} profile
            </div>
          </div>

          {/* Body */}
          <div className="pdf-body">
            <div className="pdf-greeting">Hey {name || "there"} 👋</div>
            <div className="pdf-title">Complete your profile</div>
            <div className="pdf-sub">
              A few quick details to personalise your{" "}
              <span style={{ color: meta.color, fontWeight: 700 }}>
                {meta.label}
              </span>{" "}
              experience. Most fields are just a tap away.
            </div>

            {sections.map((sec, si) => (
              <div key={sec.title + si} className="pdf-section">
                <div className="pdf-section-hdr">
                  <span
                    className="pdf-section-dot"
                    style={{ background: meta.color }}
                  />
                  {sec.title}
                </div>
                <div className="pdf-section-fields">
                  {sec.items.map((f) => (
                    <div key={f.key} className="pdf-field">
                      <label className="pdf-label">
                        {f.label}
                        {f.required && (
                          <span style={{ color: "#e74c3c" }}> *</span>
                        )}
                      </label>
                      {renderField(f)}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {error && <div className="pdf-error">{error}</div>}
          </div>

          {/* Footer */}
          <div className="pdf-foot">
            {onBack && (
              <button
                className="pdf-btn-back"
                onClick={onBack}
                disabled={loading}
              >
                ← Back
              </button>
            )}
            <button
              className="pdf-btn-submit"
              onClick={handleSubmit}
              disabled={loading}
              style={{ background: meta.color }}
            >
              {loading ? (
                <>
                  <ISpinner /> Saving…
                </>
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                "Save & Go to Dashboard →"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const formStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pdf-overlay {
    position: fixed; inset: 0; z-index: 1100;
    background: rgba(20,16,12,0.55);
    display: flex; align-items: center; justify-content: center;
    padding: 12px;
    font-family: 'Inter', sans-serif;
  }

  .pdf-modal {
    width: 100%; max-width: 440px;
    background: #faf7f4;
    border-radius: 18px;
    box-shadow: 0 28px 70px rgba(0,0,0,0.28);
    display: flex; flex-direction: column;
    max-height: calc(100vh - 24px);
    overflow: hidden;
    animation: pdfIn .22s ease both;
  }
  @keyframes pdfIn {
    from { opacity:0; transform:scale(0.96) translateY(8px); }
    to   { opacity:1; transform:none; }
  }

  /* Header — role-coloured band */
  .pdf-hdr { padding: 14px 18px 16px; flex-shrink: 0; position: relative; }
  .pdf-hdr-top { display: flex; align-items: center; margin-bottom: 12px; }

  /* Brand mark — white pill so green ILM / orange ORA / BETA badge read
     exactly like the homepage logo, regardless of the role colour band
     behind it (green / orange / purple headers). */
  .pdf-logo {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #fff;
    padding: 5px 10px 5px 12px;
    border-radius: 9px;
    box-shadow: 0 1px 5px rgba(0,0,0,0.12);
  }
  .pdf-logo-ilm {
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: -0.3px;
    color: #16a34a;
  }
  .pdf-logo-ora {
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: -0.3px;
    color: #ea580c;
    margin-left: -3px;
  }
  .pdf-logo-beta {
    font-size: 9px;
    font-weight: 700;
    color: #fff;
    background: #f0883e;
    padding: 2px 6px;
    border-radius: 6px;
    letter-spacing: 0.03em;
    margin-left: 3px;
  }

  .pdf-skip-btn {
    margin-left: auto; background: rgba(255,255,255,0.16); border: none;
    cursor: pointer; font-family: 'Inter',sans-serif; font-size: 11px;
    color: #fff; padding: 5px 10px; border-radius: 20px; font-weight: 600;
    transition: background .15s;
  }
  .pdf-skip-btn:hover { background: rgba(255,255,255,0.28); }
  .pdf-role-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.18);
    color: #fff; font-size: 12px; font-weight: 700;
    padding: 6px 12px; border-radius: 20px;
    text-transform: capitalize;
  }
  .pdf-role-icon { font-size: 13px; line-height: 1; }

  .pdf-body { flex:1; overflow-y:auto; padding:18px 18px 6px; background:#faf7f4; }
  .pdf-body::-webkit-scrollbar { width:3px; }
  .pdf-body::-webkit-scrollbar-thumb { background:#ddd5cb; border-radius:3px; }

  .pdf-greeting { font-size: 12.5px; color: #999; font-weight: 500; margin-bottom: 3px; }
  .pdf-title { font-size: 18px; font-weight: 800; color: #111; margin-bottom: 5px; }
  .pdf-sub { font-size: 12px; color: #a39d94; margin-bottom: 18px; line-height: 1.5; }

  /* Sections */
  .pdf-section { margin-bottom: 18px; }
  .pdf-section-hdr {
    display: flex; align-items: center; gap: 7px;
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.07em;
    text-transform: uppercase; color: #b5ada1;
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid #ece5dc;
  }
  .pdf-section-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .pdf-section-fields { display: flex; flex-direction: column; gap: 11px; }

  .pdf-field { display: flex; flex-direction: column; gap: 4px; }
  .pdf-label { font-size: 11.5px; font-weight: 600; color: #555; }

  .pdf-input {
    padding: 9px 11px;
    border: 1.5px solid #e4dfd8;
    border-radius: 9px;
    font-family: 'Inter', sans-serif;
    font-size: 12.5px;
    color: #111;
    background: #fff;
    outline: none;
    transition: border-color .15s, box-shadow .15s;
    width: 100%;
  }
  .pdf-input:focus {
    border-color: var(--role-color, #e67e22);
    box-shadow: 0 0 0 3px var(--role-color-soft, rgba(230,126,34,.12));
  }
  .pdf-textarea { resize: vertical; min-height: 68px; }

  /* Select — custom chevron, looks tap-able */
  .pdf-select {
    appearance: none; -webkit-appearance: none; -moz-appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23999'><path d='M5.5 7.5l4.5 4.5 4.5-4.5'/></svg>");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 16px;
    padding-right: 30px;
    cursor: pointer;
  }

  /* "Other → manual" override */
  .pdf-other-wrap { display: flex; flex-direction: column; gap: 5px; }
  .pdf-other-link {
    align-self: flex-start;
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600;
    color: var(--role-color, #e67e22);
    padding: 0;
  }
  .pdf-other-link:hover { text-decoration: underline; }

  /* Multiselect chip row */
  .pdf-multi { display: flex; flex-wrap: wrap; gap: 6px; }
  .pdf-multi-chip {
    padding: 6px 12px;
    border-radius: 20px;
    border: 1.5px solid #e4dfd8;
    background: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 11.5px;
    font-weight: 600;
    color: #888;
    cursor: pointer;
    transition: all .15s;
  }
  .pdf-multi-chip:hover { border-color: #ccc; color: #555; }
  .pdf-multi-chip--on { font-weight: 700; }

  .pdf-error {
    font-size: 11px; color: #e74c3c; margin-top: 4px; margin-bottom: 12px;
    background: rgba(231,76,60,0.07); border-radius: 8px; padding: 8px 11px;
    font-weight: 500;
  }

  .pdf-foot {
    display: flex; align-items: center; justify-content: flex-end; gap: 8px;
    padding: 12px 18px; border-top: 1px solid #ece7e0;
    background: #faf7f4; flex-shrink: 0;
  }
  .pdf-btn-back {
    padding: 9px 14px; background: #fff; border: 1.5px solid #e4dfd8;
    border-radius: 9px; font-family: 'Inter',sans-serif; font-size: 12px;
    font-weight: 600; color: #888; cursor: pointer; transition: all .16s;
  }
  .pdf-btn-back:hover { background: #f5f0eb; }
  .pdf-btn-submit {
    padding: 10px 22px; border: none; border-radius: 10px;
    font-family: 'Inter',sans-serif; font-size: 12.5px; font-weight: 700;
    color: #fff; cursor: pointer;
    box-shadow: 0 3px 12px rgba(0,0,0,.2);
    transition: opacity .16s, transform .12s;
    display: flex; align-items: center; gap: 5px;
  }
  .pdf-btn-submit:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
  .pdf-btn-submit:disabled { opacity: .45; cursor: not-allowed; transform: none; }
`;
