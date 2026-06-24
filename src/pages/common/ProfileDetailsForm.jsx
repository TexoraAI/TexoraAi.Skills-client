// import React, { useState } from "react";

// function normalizeRole(rawRole) {
//   const key = (rawRole || "").toString().trim().toLowerCase();

//   if (key === "student") return "student";
//   if (key === "trainer") return "trainer";

//   const managerAliases = [
//     "manager",
//     "business",
//     "partner",
//     "partnership",
//     "business & partnership",
//     "business and partnership",
//     "businesspartnership",
//     "admin",
//   ];
//   if (managerAliases.includes(key)) return "Manager";

//   // Unknown role string — fall back to student but don't fail silently.
//   if (key && typeof console !== "undefined") {
//     console.warn(
//       `ProfileDetailsForm: unrecognised role "${rawRole}", defaulting to student form.`,
//     );
//   }
//   return "student";
// }

// /* ─── Shared option lists ────────────────────────────────────────────────── */
// const CURRENT_YEAR = new Date().getFullYear();
// const YEAR_OPTIONS = Array.from({ length: 45 }, (_, i) =>
//   String(CURRENT_YEAR + 1 - i),
// );

// const COUNTRIES = [
//   "India",
//   "United States",
//   "United Kingdom",
//   "Canada",
//   "Australia",
//   "United Arab Emirates",
//   "Saudi Arabia",
//   "Qatar",
//   "Kuwait",
//   "Oman",
//   "Singapore",
//   "Germany",
//   "France",
//   "Netherlands",
//   "Italy",
//   "Spain",
//   "Sweden",
//   "Switzerland",
//   "Ireland",
//   "New Zealand",
//   "Japan",
//   "South Korea",
//   "China",
//   "Hong Kong",
//   "Malaysia",
//   "Indonesia",
//   "Philippines",
//   "Thailand",
//   "Vietnam",
//   "Pakistan",
//   "Bangladesh",
//   "Sri Lanka",
//   "Nepal",
//   "Bhutan",
//   "Russia",
//   "Brazil",
//   "Mexico",
//   "Argentina",
//   "South Africa",
//   "Nigeria",
//   "Kenya",
//   "Egypt",
//   "Israel",
//   "Turkey",
//   "Poland",
// ];

// const INDIAN_STATES = [
//   "Andhra Pradesh",
//   "Arunachal Pradesh",
//   "Assam",
//   "Bihar",
//   "Chhattisgarh",
//   "Goa",
//   "Gujarat",
//   "Haryana",
//   "Himachal Pradesh",
//   "Jharkhand",
//   "Karnataka",
//   "Kerala",
//   "Madhya Pradesh",
//   "Maharashtra",
//   "Manipur",
//   "Meghalaya",
//   "Mizoram",
//   "Nagaland",
//   "Odisha",
//   "Punjab",
//   "Rajasthan",
//   "Sikkim",
//   "Tamil Nadu",
//   "Telangana",
//   "Tripura",
//   "Uttar Pradesh",
//   "Uttarakhand",
//   "West Bengal",
//   "Andaman and Nicobar Islands",
//   "Chandigarh",
//   "Dadra and Nagar Haveli and Daman and Diu",
//   "Delhi (NCT)",
//   "Jammu and Kashmir",
//   "Ladakh",
//   "Lakshadweep",
//   "Puducherry",
// ];

// const INDIAN_CITIES = [
//   "Mumbai",
//   "Delhi",
//   "Bengaluru",
//   "Hyderabad",
//   "Ahmedabad",
//   "Chennai",
//   "Kolkata",
//   "Pune",
//   "Jaipur",
//   "Surat",
//   "Lucknow",
//   "Kanpur",
//   "Nagpur",
//   "Indore",
//   "Thane",
//   "Bhopal",
//   "Visakhapatnam",
//   "Patna",
//   "Vadodara",
//   "Ghaziabad",
//   "Ludhiana",
//   "Agra",
//   "Nashik",
//   "Faridabad",
//   "Meerut",
//   "Rajkot",
//   "Varanasi",
//   "Amritsar",
//   "Ranchi",
//   "Chandigarh",
//   "Coimbatore",
//   "Kochi",
//   "Guwahati",
// ];

// const QUALIFICATIONS = [
//   "10th / Secondary",
//   "12th / Senior Secondary",
//   "Diploma",
//   "Undergraduate (B.Tech / B.E / B.Sc / B.A / B.Com etc.)",
//   "Postgraduate (M.Tech / M.Sc / MBA / M.A etc.)",
//   "PhD / Doctorate",
//   "ITI / Vocational Training",
// ];

// const DOMAINS = [
//   "Web Development",
//   "Full Stack Development",
//   "Data Science",
//   "AI / Machine Learning",
//   "Mobile App Development",
//   "Cloud Computing",
//   "DevOps",
//   "Cybersecurity",
//   "UI / UX Design",
//   "Digital Marketing",
//   "Business Analytics",
// ];

// const EXPERIENCE_RANGES = [
//   "Fresher / No experience",
//   "0–1 year",
//   "1–2 years",
//   "2–5 years",
//   "5–10 years",
//   "10+ years",
// ];

// /* ─── Field configs per role ─────────────────────────────────────────────── */
// const ROLE_FIELDS = {
//   /**
//    * Keys match StudentDetailsTab in ProfilePage:
//    *   mobileNumber, dateOfBirth, gender, city, state, country,
//    *   qualification, collegeName, yearOfPassing, domain, experience
//    */
//   student: [
//     {
//       key: "mobileNumber",
//       label: "Mobile Number",
//       type: "tel",
//       placeholder: "e.g. +91 9876543210",
//       required: false,
//       section: "Personal Details",
//     },
//     {
//       key: "dateOfBirth",
//       label: "Date of Birth",
//       type: "date",
//       placeholder: "",
//       required: false,
//       section: "Personal Details",
//     },
//     {
//       key: "gender",
//       label: "Gender",
//       type: "select",
//       options: ["Male", "Female", "Other", "Prefer not to say"],
//       placeholder: "Select gender",
//       required: false,
//       section: "Personal Details",
//     },
//     {
//       key: "city",
//       label: "City",
//       type: "select",
//       options: INDIAN_CITIES,
//       allowOther: true,
//       placeholder: "Select your city",
//       required: false,
//       section: "Location",
//     },
//     {
//       key: "state",
//       label: "State",
//       type: "select",
//       options: INDIAN_STATES,
//       allowOther: true,
//       placeholder: "Select your state",
//       required: false,
//       section: "Location",
//     },
//     {
//       key: "country",
//       label: "Country",
//       type: "select",
//       options: COUNTRIES,
//       allowOther: true,
//       placeholder: "Select your country",
//       required: false,
//       section: "Location",
//     },
//     {
//       key: "qualification",
//       label: "Qualification",
//       type: "select",
//       options: QUALIFICATIONS,
//       allowOther: true,
//       placeholder: "Select qualification",
//       required: false,
//       section: "Education & Experience",
//     },
//     {
//       key: "collegeName",
//       label: "College / Institute",
//       type: "text",
//       placeholder: "e.g. IIT Delhi",
//       required: false,
//       section: "Education & Experience",
//     },
//     {
//       key: "yearOfPassing",
//       label: "Year of Passing",
//       type: "select",
//       options: YEAR_OPTIONS,
//       placeholder: "Select year",
//       required: false,
//       section: "Education & Experience",
//     },
//     {
//       key: "domain",
//       label: "Domain / Area of Interest",
//       type: "select",
//       options: DOMAINS,
//       allowOther: true,
//       placeholder: "Select your domain",
//       required: false,
//       section: "Education & Experience",
//     },
//     {
//       key: "experience",
//       label: "Experience",
//       type: "select",
//       options: EXPERIENCE_RANGES,
//       placeholder: "Select experience",
//       required: false,
//       section: "Education & Experience",
//     },
//   ],

//   /**
//    * Keys match TrainerDetailsTab in ProfilePage:
//    *   linkedinUrl, country, courseTopic, audienceSize, fullTimeRole, platforms
//    *
//    * NOTE: `platforms` is collected as a multi-select here and joined into a
//    * comma-separated string before sending to the API (see handleSubmit).
//    */
//   trainer: [
//     {
//       key: "linkedinUrl",
//       label: "LinkedIn URL",
//       type: "url",
//       placeholder: "https://linkedin.com/in/…",
//       required: false,
//       section: "Professional Profile",
//     },
//     {
//       key: "country",
//       label: "Country",
//       type: "select",
//       options: COUNTRIES,
//       allowOther: true,
//       placeholder: "Select your country",
//       required: false,
//       section: "Professional Profile",
//     },
//     {
//       key: "courseTopic",
//       label: "Course Topic(s)",
//       type: "text",
//       placeholder: "e.g. React, Python, AWS",
//       required: false,
//       section: "Teaching Details",
//     },
//     {
//       key: "audienceSize",
//       label: "Audience Size",
//       type: "select",
//       options: ["0–1K", "1K–10K", "10K–100K", "100K+"],
//       placeholder: "Select range",
//       required: false,
//       section: "Teaching Details",
//     },
//     {
//       key: "fullTimeRole",
//       label: "Is this your full-time role?",
//       type: "select",
//       options: ["Yes", "No"],
//       placeholder: "Select",
//       required: false,
//       section: "Teaching Details",
//     },
//     {
//       key: "platforms",
//       label: "Platforms you teach on",
//       type: "multiselect",
//       options: [
//         "IlmOra",
//         "YouTube",
//         "Udemy",
//         "Coursera",
//         "Skillshare",
//         "LinkedIn Learning",
//         "Other",
//       ],
//       required: false,
//       section: "Teaching Details",
//     },
//   ],

//   /**
//    * Keys match AdminDetailsTab (business/Manager) in ProfilePage:
//    *   mobileNumber, organizationName, websiteDomain, contactEmail,
//    *   location, industry, description
//    */
//   Manager: [
//     {
//       key: "mobileNumber",
//       label: "Phone Number",
//       type: "tel",
//       placeholder: "e.g. +91 9876543210",
//       required: false,
//       section: "Contact Details",
//     },
//     {
//       key: "contactEmail",
//       label: "Contact Email",
//       type: "email",
//       placeholder: "e.g. admin@acme.com",
//       required: false,
//       section: "Contact Details",
//     },
//     {
//       key: "organizationName",
//       label: "Organization Name",
//       type: "text",
//       placeholder: "e.g. Acme Corp",
//       required: true,
//       section: "Organization Info",
//     },
//     {
//       key: "domain",
//       label: "Website / Domain",
//       type: "url",
//       placeholder: "https://acme.com",
//       required: false,
//       section: "Organization Info",
//     },
//     {
//       key: "location",
//       label: "Location",
//       type: "text",
//       placeholder: "e.g. Hyderabad, India",
//       required: false,
//       section: "Organization Info",
//     },
//     {
//       key: "industry",
//       label: "Industry",
//       type: "select",
//       options: [
//         "Technology",
//         "Education",
//         "Healthcare",
//         "Finance",
//         "Manufacturing",
//         "Retail",
//         "Consulting",
//         "Government",
//         "NGO",
//         "Other",
//       ],
//       placeholder: "Select industry",
//       required: false,
//       section: "Organization Info",
//     },
//     {
//       key: "description",
//       label: "About Your Organization",
//       type: "textarea",
//       placeholder: "Brief description of what your organization does…",
//       required: false,
//       section: "Organization Info",
//     },
//   ],
// };

// /* ─── Role color / label / icon map ──────────────────────────────────────── */
// const ROLE_META = {
//   student: { color: "#27ae60", label: "Student", icon: "🎓" },
//   trainer: { color: "#e67e22", label: "Trainer", icon: "🧑‍🏫" },
//   Manager: { color: "#8e44ad", label: "Business & Partnership", icon: "🤝" },
// };

// const OTHER_SENTINEL = "__OTHER__";

// /* ─── Spinner ─────────────────────────────────────────────────────────────── */
// const ISpinner = () => (
//   <svg
//     width="13"
//     height="13"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2.5"
//     strokeLinecap="round"
//   >
//     <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
//       <animateTransform
//         attributeName="transform"
//         type="rotate"
//         from="0 12 12"
//         to="360 12 12"
//         dur="0.7s"
//         repeatCount="indefinite"
//       />
//     </path>
//   </svg>
// );

// /* ─── API helper ─────────────────────────────────────────────────────────── */
// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// async function patchAuth(path, token, body) {
//   const res = await fetch(`${API_BASE}${path}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(body),
//   });
//   if (!res.ok) throw new Error(`HTTP ${res.status}`);
//   return res.json().catch(() => ({}));
// }

// /* ─── Component ──────────────────────────────────────────────────────────── */
// export default function ProfileDetailsForm({
//   role = "student",
//   name = "",
//   email = "",
//   token = "",
//   onSuccess,
//   onBack,
//   isEditMode = false,
// }) {
//   // THE FIX: look up fields/meta using the normalized role, not the raw prop.
//   const normalizedRole = normalizeRole(role);
//   const fields = ROLE_FIELDS[normalizedRole] || ROLE_FIELDS.student;
//   const meta = ROLE_META[normalizedRole] || ROLE_META.student;

//   // Initialise form — multiselect fields start as arrays
//   const [form, setForm] = useState(() =>
//     Object.fromEntries(
//       fields.map((f) => [f.key, f.type === "multiselect" ? [] : ""]),
//     ),
//   );
//   // Tracks which "allowOther" select fields are currently showing the
//   // manual text box instead of the dropdown.
//   const [customMode, setCustomMode] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (key, val) =>
//     setForm((prev) => ({ ...prev, [key]: val }));

//   const toggleMulti = (key, option) =>
//     setForm((prev) => {
//       const cur = prev[key] || [];
//       return {
//         ...prev,
//         [key]: cur.includes(option)
//           ? cur.filter((x) => x !== option)
//           : [...cur, option],
//       };
//     });

//   const switchToOther = (key) => {
//     setCustomMode((prev) => ({ ...prev, [key]: true }));
//     handleChange(key, "");
//   };

//   const switchToList = (key) => {
//     setCustomMode((prev) => ({ ...prev, [key]: false }));
//     handleChange(key, "");
//   };

//   /* ── Build the payload sent to the DTO ── */
//   const buildPayload = () => {
//     const payload = { role };
//     fields.forEach((f) => {
//       if (f.type === "multiselect") {
//         payload[f.key] = form[f.key] || []; // ← only this line changes
//       } else {
//         payload[f.key] = form[f.key];
//       }
//     });
//     return payload;
//   };
//   const handleSubmit = async () => {
//     const missing = fields.filter((f) => {
//       if (!f.required) return false;
//       const v = form[f.key];
//       return Array.isArray(v) ? v.length === 0 : !v?.trim();
//     });
//     if (missing.length) {
//       setError(`Please fill in: ${missing.map((f) => f.label).join(", ")}`);
//       return;
//     }
//     setError("");
//     setLoading(true);

//     try {
//       if (normalizedRole === "Manager") {
//         // ✅ Manager org fields go directly to Organization table in auth-service
//         const orgId = localStorage.getItem("organizationId");
//         if (orgId) {
//           await fetch(`${API_BASE}/organizations/${orgId}/profile`, {
//             method: "PATCH",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//               organizationName: form.organizationName,
//               domain: form.domain,
//               contactEmail: form.contactEmail,
//               location: form.location,
//               industry: form.industry,
//               description: form.description,
//               mobileNumber: form.mobileNumber,
//             }),
//           });
//         }
//       } else {
//         // ✅ Student and Trainer go through auth/me/profile → Kafka → user-service
//         await patchAuth("/auth/me/profile", token, buildPayload());
//       }

//       // ✅ Always mark profile completed regardless of role
//       await patchAuth("/auth/me/profile-completed", token, {});
//       await new Promise((r) => setTimeout(r, 1200));

//       const stored = (() => {
//         try {
//           return JSON.parse(localStorage.getItem("lms_user") || "{}");
//         } catch {
//           return {};
//         }
//       })();
//       localStorage.setItem(
//         "lms_user",
//         JSON.stringify({ ...stored, profileCompleted: true }),
//       );
//       onSuccess && onSuccess();
//     } catch (err) {
//       setError("Failed to save profile. Please try again.");
//       console.error("ProfileDetailsForm error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleSkip = async () => {
//     setLoading(true);
//     try {
//       await patchAuth("/auth/me/profile-completed", token, {});
//       const stored = (() => {
//         try {
//           return JSON.parse(localStorage.getItem("lms_user") || "{}");
//         } catch {
//           return {};
//         }
//       })();
//       localStorage.setItem(
//         "lms_user",
//         JSON.stringify({ ...stored, profileCompleted: true }),
//       );
//       onSuccess && onSuccess();
//     } catch {
//       onSuccess && onSuccess();
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ── Field renderer ── */
//   const renderField = (f) => {
//     if (f.type === "textarea") {
//       return (
//         <textarea
//           className="pdf-input pdf-textarea"
//           placeholder={f.placeholder}
//           value={form[f.key]}
//           onChange={(e) => handleChange(f.key, e.target.value)}
//           rows={3}
//         />
//       );
//     }

//     if (f.type === "select") {
//       const inOtherMode = !!customMode[f.key];

//       if (f.allowOther && inOtherMode) {
//         return (
//           <div className="pdf-other-wrap">
//             <input
//               className="pdf-input"
//               type="text"
//               placeholder="Type it manually…"
//               value={form[f.key]}
//               onChange={(e) => handleChange(f.key, e.target.value)}
//               autoFocus
//             />
//             <button
//               type="button"
//               className="pdf-other-link"
//               onClick={() => switchToList(f.key)}
//             >
//               ↺ Choose from list instead
//             </button>
//           </div>
//         );
//       }

//       return (
//         <select
//           className="pdf-input pdf-select"
//           value={form[f.key]}
//           onChange={(e) => {
//             if (e.target.value === OTHER_SENTINEL) {
//               switchToOther(f.key);
//             } else {
//               handleChange(f.key, e.target.value);
//             }
//           }}
//         >
//           <option value="">{f.placeholder || "Select…"}</option>
//           {(f.options || []).map((opt) => (
//             <option key={opt} value={opt}>
//               {opt}
//             </option>
//           ))}
//           {f.allowOther && (
//             <option value={OTHER_SENTINEL}>Other (type manually)</option>
//           )}
//         </select>
//       );
//     }

//     if (f.type === "multiselect") {
//       return (
//         <div className="pdf-multi">
//           {(f.options || []).map((opt) => {
//             const selected = (form[f.key] || []).includes(opt);
//             return (
//               <button
//                 key={opt}
//                 type="button"
//                 className={`pdf-multi-chip ${selected ? "pdf-multi-chip--on" : ""}`}
//                 style={
//                   selected
//                     ? {
//                         borderColor: meta.color,
//                         color: meta.color,
//                         background: `${meta.color}15`,
//                       }
//                     : {}
//                 }
//                 onClick={() => toggleMulti(f.key, opt)}
//               >
//                 {opt}
//               </button>
//             );
//           })}
//         </div>
//       );
//     }

//     return (
//       <input
//         className="pdf-input"
//         type={f.type}
//         placeholder={f.placeholder}
//         value={form[f.key]}
//         onChange={(e) => handleChange(f.key, e.target.value)}
//       />
//     );
//   };

//   /* ── Group fields by section, preserving order ── */
//   const sections = [];
//   fields.forEach((f) => {
//     const last = sections[sections.length - 1];
//     if (last && last.title === f.section) {
//       last.items.push(f);
//     } else {
//       sections.push({ title: f.section || "Details", items: [f] });
//     }
//   });

//   return (
//     <>
//       <style>{formStyles}</style>
//       <div className="pdf-overlay">
//         <div
//           className="pdf-modal"
//           style={{
//             "--role-color": meta.color,
//             "--role-color-soft": `${meta.color}26`,
//           }}
//         >
//           {/* Header */}
//           <div className="pdf-hdr" style={{ background: meta.color }}>
//             <div className="pdf-hdr-top">
//               {/* Real ILM ORA brand mark — green ILM + orange ORA + BETA
//                   badge on a white pill, same as the homepage logo, so it
//                   stays legible and on-brand regardless of role colour. */}
//               <div className="pdf-logo">
//                 <span className="pdf-logo-ilm">ILM</span>
//                 <span className="pdf-logo-ora">ORA</span>
//                 <span className="pdf-logo-beta">BETA</span>
//               </div>
             
//             </div>

//             <div className="pdf-role-badge">
//               <span className="pdf-role-icon">{meta.icon}</span>
//               {meta.label} profile
//             </div>
//           </div>

//           {/* Body */}
//           <div className="pdf-body">
//             <div className="pdf-greeting">Hey {name || "there"} 👋</div>
//             <div className="pdf-title">Complete your profile</div>
//             <div className="pdf-sub">
//               A few quick details to personalise your{" "}
//               <span style={{ color: meta.color, fontWeight: 700 }}>
//                 {meta.label}
//               </span>{" "}
//               experience. Most fields are just a tap away.
//             </div>

//             {sections.map((sec, si) => (
//               <div key={sec.title + si} className="pdf-section">
//                 <div className="pdf-section-hdr">
//                   <span
//                     className="pdf-section-dot"
//                     style={{ background: meta.color }}
//                   />
//                   {sec.title}
//                 </div>
//                 <div className="pdf-section-fields">
//                   {sec.items.map((f) => (
//                     <div key={f.key} className="pdf-field">
//                       <label className="pdf-label">
//                         {f.label}
//                         {f.required && (
//                           <span style={{ color: "#e74c3c" }}> *</span>
//                         )}
//                       </label>
//                       {renderField(f)}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}

//             {error && <div className="pdf-error">{error}</div>}
//           </div>

//           {/* Footer */}
//           <div className="pdf-foot">
//             {onBack && (
//               <button
//                 className="pdf-btn-back"
//                 onClick={onBack}
//                 disabled={loading}
//               >
//                 ← Back
//               </button>
//             )}
//             <button
//               className="pdf-btn-submit"
//               onClick={handleSubmit}
//               disabled={loading}
//               style={{ background: meta.color }}
//             >
//               {loading ? (
//                 <>
//                   <ISpinner /> Saving…
//                 </>
//               ) : isEditMode ? (
//                 "Save Changes"
//               ) : (
//                 "Save & Go to Dashboard →"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// /* ─── Styles ─────────────────────────────────────────────────────────────── */
// const formStyles = `
//   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   .pdf-overlay {
//     position: fixed; inset: 0; z-index: 1100;
//     background: rgba(20,16,12,0.55);
//     display: flex; align-items: center; justify-content: center;
//     padding: 12px;
//     font-family: 'Inter', sans-serif;
//   }

//   .pdf-modal {
//     width: 100%; max-width: 440px;
//     background: #faf7f4;
//     border-radius: 18px;
//     box-shadow: 0 28px 70px rgba(0,0,0,0.28);
//     display: flex; flex-direction: column;
//     max-height: calc(100vh - 24px);
//     overflow: hidden;
//     animation: pdfIn .22s ease both;
//   }
//   @keyframes pdfIn {
//     from { opacity:0; transform:scale(0.96) translateY(8px); }
//     to   { opacity:1; transform:none; }
//   }

//   /* Header — role-coloured band */
//   .pdf-hdr { padding: 14px 18px 16px; flex-shrink: 0; position: relative; }
//   .pdf-hdr-top { display: flex; align-items: center; margin-bottom: 12px; }

//   /* Brand mark — white pill so green ILM / orange ORA / BETA badge read
//      exactly like the homepage logo, regardless of the role colour band
//      behind it (green / orange / purple headers). */
//   .pdf-logo {
//     display: inline-flex;
//     align-items: center;
//     gap: 5px;
//     background: #fff;
//     padding: 5px 10px 5px 12px;
//     border-radius: 9px;
//     box-shadow: 0 1px 5px rgba(0,0,0,0.12);
//   }
//   .pdf-logo-ilm {
//     font-size: 1.05rem;
//     font-weight: 800;
//     letter-spacing: -0.3px;
//     color: #16a34a;
//   }
//   .pdf-logo-ora {
//     font-size: 1.05rem;
//     font-weight: 800;
//     letter-spacing: -0.3px;
//     color: #ea580c;
//     margin-left: -3px;
//   }
//   .pdf-logo-beta {
//     font-size: 9px;
//     font-weight: 700;
//     color: #fff;
//     background: #f0883e;
//     padding: 2px 6px;
//     border-radius: 6px;
//     letter-spacing: 0.03em;
//     margin-left: 3px;
//   }

//   .pdf-skip-btn {
//     margin-left: auto; background: rgba(255,255,255,0.16); border: none;
//     cursor: pointer; font-family: 'Inter',sans-serif; font-size: 11px;
//     color: #fff; padding: 5px 10px; border-radius: 20px; font-weight: 600;
//     transition: background .15s;
//   }
//   .pdf-skip-btn:hover { background: rgba(255,255,255,0.28); }
//   .pdf-role-badge {
//     display: inline-flex; align-items: center; gap: 6px;
//     background: rgba(255,255,255,0.18);
//     color: #fff; font-size: 12px; font-weight: 700;
//     padding: 6px 12px; border-radius: 20px;
//     text-transform: capitalize;
//   }
//   .pdf-role-icon { font-size: 13px; line-height: 1; }

//   .pdf-body { flex:1; overflow-y:auto; padding:18px 18px 6px; background:#faf7f4; }
//   .pdf-body::-webkit-scrollbar { width:3px; }
//   .pdf-body::-webkit-scrollbar-thumb { background:#ddd5cb; border-radius:3px; }

//   .pdf-greeting { font-size: 12.5px; color: #999; font-weight: 500; margin-bottom: 3px; }
//   .pdf-title { font-size: 18px; font-weight: 800; color: #111; margin-bottom: 5px; }
//   .pdf-sub { font-size: 12px; color: #a39d94; margin-bottom: 18px; line-height: 1.5; }

//   /* Sections */
//   .pdf-section { margin-bottom: 18px; }
//   .pdf-section-hdr {
//     display: flex; align-items: center; gap: 7px;
//     font-size: 10.5px; font-weight: 700; letter-spacing: 0.07em;
//     text-transform: uppercase; color: #b5ada1;
//     margin-bottom: 10px;
//     padding-bottom: 6px;
//     border-bottom: 1px solid #ece5dc;
//   }
//   .pdf-section-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
//   .pdf-section-fields { display: flex; flex-direction: column; gap: 11px; }

//   .pdf-field { display: flex; flex-direction: column; gap: 4px; }
//   .pdf-label { font-size: 11.5px; font-weight: 600; color: #555; }

//   .pdf-input {
//     padding: 9px 11px;
//     border: 1.5px solid #e4dfd8;
//     border-radius: 9px;
//     font-family: 'Inter', sans-serif;
//     font-size: 12.5px;
//     color: #111;
//     background: #fff;
//     outline: none;
//     transition: border-color .15s, box-shadow .15s;
//     width: 100%;
//   }
//   .pdf-input:focus {
//     border-color: var(--role-color, #e67e22);
//     box-shadow: 0 0 0 3px var(--role-color-soft, rgba(230,126,34,.12));
//   }
//   .pdf-textarea { resize: vertical; min-height: 68px; }

//   /* Select — custom chevron, looks tap-able */
//   .pdf-select {
//     appearance: none; -webkit-appearance: none; -moz-appearance: none;
//     background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23999'><path d='M5.5 7.5l4.5 4.5 4.5-4.5'/></svg>");
//     background-repeat: no-repeat;
//     background-position: right 10px center;
//     background-size: 16px;
//     padding-right: 30px;
//     cursor: pointer;
//   }

//   /* "Other → manual" override */
//   .pdf-other-wrap { display: flex; flex-direction: column; gap: 5px; }
//   .pdf-other-link {
//     align-self: flex-start;
//     background: none; border: none; cursor: pointer;
//     font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600;
//     color: var(--role-color, #e67e22);
//     padding: 0;
//   }
//   .pdf-other-link:hover { text-decoration: underline; }

//   /* Multiselect chip row */
//   .pdf-multi { display: flex; flex-wrap: wrap; gap: 6px; }
//   .pdf-multi-chip {
//     padding: 6px 12px;
//     border-radius: 20px;
//     border: 1.5px solid #e4dfd8;
//     background: #fff;
//     font-family: 'Inter', sans-serif;
//     font-size: 11.5px;
//     font-weight: 600;
//     color: #888;
//     cursor: pointer;
//     transition: all .15s;
//   }
//   .pdf-multi-chip:hover { border-color: #ccc; color: #555; }
//   .pdf-multi-chip--on { font-weight: 700; }

//   .pdf-error {
//     font-size: 11px; color: #e74c3c; margin-top: 4px; margin-bottom: 12px;
//     background: rgba(231,76,60,0.07); border-radius: 8px; padding: 8px 11px;
//     font-weight: 500;
//   }

//   .pdf-foot {
//     display: flex; align-items: center; justify-content: flex-end; gap: 8px;
//     padding: 12px 18px; border-top: 1px solid #ece7e0;
//     background: #faf7f4; flex-shrink: 0;
//   }
//   .pdf-btn-back {
//     padding: 9px 14px; background: #fff; border: 1.5px solid #e4dfd8;
//     border-radius: 9px; font-family: 'Inter',sans-serif; font-size: 12px;
//     font-weight: 600; color: #888; cursor: pointer; transition: all .16s;
//   }
//   .pdf-btn-back:hover { background: #f5f0eb; }
//   .pdf-btn-submit {
//     padding: 10px 22px; border: none; border-radius: 10px;
//     font-family: 'Inter',sans-serif; font-size: 12.5px; font-weight: 700;
//     color: #fff; cursor: pointer;
//     box-shadow: 0 3px 12px rgba(0,0,0,.2);
//     transition: opacity .16s, transform .12s;
//     display: flex; align-items: center; gap: 5px;
//   }
//   .pdf-btn-submit:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
//   .pdf-btn-submit:disabled { opacity: .45; cursor: not-allowed; transform: none; }
// `;











































// ProfileDetailsForm.jsx — Enterprise Redesign (all APIs, routing, logic preserved)
// CHANGES IN THIS PASS:
// 1. QUALIFICATIONS split — B.Tech / B.Sc / B.A / B.Com / M.Tech etc. are now
//    separate selectable entries instead of one combined string.
// 2. COLLEGE/INSTITUTE changed from free-text to a searchable dropdown with
//    ~80 popular Indian colleges pre-loaded + "Add custom" for unlisted ones.
// 3. COMPACT LAYOUT — modal is now smaller on desktop/laptop (max-width reduced,
//    padding trimmed, font-sizes tightened, fields-grid gap reduced). The form
//    fits a 1080p laptop without overflow and still scrolls on short screens.
//    All mobile / iPad / landscape breakpoints preserved and tightened.

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronDown, Search, Plus, CheckCircle, X, AlertCircle,
  User, Mail, Phone, MapPin, Briefcase, BookOpen, Globe,
  TrendingUp, Users, Building2, Award, GraduationCap, Star,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   ROLE NORMALIZER — unchanged
───────────────────────────────────────────────────────────── */
function normalizeRole(rawRole) {
  const key = (rawRole || "").toString().trim().toLowerCase();
  if (key === "student") return "student";
  if (key === "trainer") return "trainer";
  const managerAliases = ["manager", "business", "partner", "partnership", "business & partnership", "business and partnership", "businesspartnership", "admin"];
  if (managerAliases.includes(key)) return "Manager";
  if (key && typeof console !== "undefined") console.warn(`ProfileDetailsForm: unrecognised role "${rawRole}", defaulting to student form.`);
  return "student";
}

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────── */
const T = {
  orange: "#F97316",
  green: "#16A34A",
  purple: "#8B5CF6",
  bg: "#FAFAF9",
  surface: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
  subtle: "#F9FAFB",
  error: "#EF4444",
  errorSoft: "#FEF2F2",
};

/* ─────────────────────────────────────────────────────────────
   OPTION DATA
───────────────────────────────────────────────────────────── */
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 45 }, (_, i) => String(CURRENT_YEAR + 1 - i));

const COUNTRIES = ["India","United States","United Kingdom","Canada","Australia","United Arab Emirates","Saudi Arabia","Qatar","Kuwait","Oman","Singapore","Germany","France","Netherlands","Italy","Spain","Sweden","Switzerland","Ireland","New Zealand","Japan","South Korea","China","Hong Kong","Malaysia","Indonesia","Philippines","Thailand","Vietnam","Pakistan","Bangladesh","Sri Lanka","Nepal","Bhutan","Russia","Brazil","Mexico","Argentina","South Africa","Nigeria","Kenya","Egypt","Israel","Turkey","Poland"];

const INDIAN_STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi (NCT)","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"];

const INDIAN_CITIES = ["Mumbai","Delhi","Bengaluru","Hyderabad","Ahmedabad","Chennai","Kolkata","Pune","Jaipur","Surat","Lucknow","Kanpur","Nagpur","Indore","Thane","Bhopal","Visakhapatnam","Patna","Vadodara","Ghaziabad","Ludhiana","Agra","Nashik","Faridabad","Meerut","Rajkot","Varanasi","Amritsar","Ranchi","Chandigarh","Coimbatore","Kochi","Guwahati"];

// ── SPLIT QUALIFICATIONS ──────────────────────────────────────
// Each degree is now its own entry. Grouped logically.
const QUALIFICATIONS = [
  // School
  "10th / Secondary",
  "12th / Senior Secondary",
  // Diploma / Vocational
  "Diploma",
  "ITI / Vocational Training",
  // Undergraduate — Engineering & Technology
  "B.Tech (Bachelor of Technology)",
  "B.E (Bachelor of Engineering)",
  // Undergraduate — Science
  "B.Sc (Bachelor of Science)",
  // Undergraduate — Arts & Commerce
  "B.A (Bachelor of Arts)",
  "B.Com (Bachelor of Commerce)",
  // Undergraduate — Management & Others
  "BBA (Bachelor of Business Administration)",
  "BCA (Bachelor of Computer Applications)",
  "B.Pharm (Bachelor of Pharmacy)",
  "MBBS",
  "BDS",
  "LLB (Bachelor of Laws)",
  "B.Arch (Bachelor of Architecture)",
  "B.Des (Bachelor of Design)",
  "B.Ed (Bachelor of Education)",
  // Postgraduate — Engineering & Technology
  "M.Tech (Master of Technology)",
  "M.E (Master of Engineering)",
  // Postgraduate — Science & Arts
  "M.Sc (Master of Science)",
  "M.A (Master of Arts)",
  "M.Com (Master of Commerce)",
  // Postgraduate — Management
  "MBA (Master of Business Administration)",
  "MCA (Master of Computer Applications)",
  "M.Pharm (Master of Pharmacy)",
  "LLM (Master of Laws)",
  "M.Arch (Master of Architecture)",
  "M.Des (Master of Design)",
  "M.Ed (Master of Education)",
  // Doctorate
  "PhD / Doctorate",
  "Post-Doctoral Research",
];

// ── COLLEGE / INSTITUTE DROPDOWN ──────────────────────────────
const COLLEGES = [
  // IITs
  "IIT Bombay","IIT Delhi","IIT Madras","IIT Kanpur","IIT Kharagpur",
  "IIT Roorkee","IIT Guwahati","IIT Hyderabad","IIT Indore","IIT Jodhpur",
  "IIT Patna","IIT Varanasi (IIT BHU)","IIT Bhubaneswar","IIT Gandhinagar",
  "IIT Ropar","IIT Mandi","IIT Tirupati","IIT Palakkad","IIT Dhanbad (ISM)",
  // NITs
  "NIT Trichy","NIT Warangal","NIT Surathkal","NIT Calicut","NIT Rourkela",
  "NIT Allahabad (MNNIT)","NIT Jaipur (MNIT)","NIT Durgapur","NIT Silchar",
  "NIT Kurukshetra","NIT Nagpur (VNIT)","NIT Bhopal (MANIT)","NIT Patna",
  // IIMs
  "IIM Ahmedabad","IIM Bangalore","IIM Calcutta","IIM Lucknow","IIM Kozhikode",
  "IIM Indore","IIM Shillong","IIM Rohtak","IIM Raipur","IIM Ranchi","IIM Kashipur",
  // Central Universities & Deemed
  "Delhi University (DU)","JNU (Jawaharlal Nehru University)",
  "BHU (Banaras Hindu University)","AMU (Aligarh Muslim University)",
  "Hyderabad University","Pondicherry University","BITS Pilani","BITS Goa",
  "BITS Hyderabad","Manipal University","SRM University","VIT Vellore",
  "Amity University","Symbiosis International University","Lovely Professional University",
  "Chandigarh University","Thapar University","KIIT University","Jamia Millia Islamia",
  // State Universities & Autonomous
  "Anna University","Osmania University","Pune University (SPPU)","Mumbai University",
  "Calcutta University","Madras University","Bangalore University","Gujarat University",
  "Rajasthan University","Lucknow University","Patna University","Allahabad University",
  "Andhra University","Nagpur University","Mysore University",
  // Medical
  "AIIMS Delhi","AIIMS Bhopal","AIIMS Jodhpur","AIIMS Patna","AIIMS Rishikesh",
  "JIPMER Puducherry","Maulana Azad Medical College","Grant Medical College Mumbai",
  // Law
  "NLSIU Bangalore","NALSAR Hyderabad","NLU Delhi","NLU Jodhpur",
  // Design / Architecture
  "NID Ahmedabad","NID Delhi","NIFT Delhi","NIFT Mumbai","CEPT University Ahmedabad",
  // Open / Distance
  "IGNOU","NSOU","Dr. B.R. Ambedkar Open University",
];

const DOMAINS = ["Web Development","Full Stack Development","Data Science","AI / Machine Learning","Mobile App Development","Cloud Computing","DevOps","Cybersecurity","UI / UX Design","Digital Marketing","Business Analytics"];

const EXPERIENCE_RANGES = ["Fresher / No experience","0–1 year","1–2 years","2–5 years","5–10 years","10+ years"];

const INDUSTRIES = ["Technology","Education","Healthcare","Finance","Manufacturing","Retail","Consulting","Government","NGO","EdTech","FinTech","HealthTech","E-Commerce","Logistics","Media","Real Estate","Other"];

const AUDIENCE_SIZES = ["0–1K","1K–10K","10K–100K","100K+"];
const GENDERS = ["Male","Female","Other","Prefer not to say"];
const YES_NO = ["Yes","No"];
const PLATFORMS = ["IlmOra","YouTube","Udemy","Coursera","Skillshare","LinkedIn Learning","Podcast","Blog","Newsletter","TikTok","Other"];

/* ─────────────────────────────────────────────────────────────
   ROLE FIELDS — collegeName changed to type:"select" with COLLEGES
───────────────────────────────────────────────────────────── */
const ROLE_FIELDS = {
  student: [
    { key: "mobileNumber", label: "Mobile Number", type: "tel", placeholder: "e.g. +91 9876543210", required: false, section: "Personal Details", icon: Phone },
    { key: "dateOfBirth", label: "Date of Birth", type: "date", placeholder: "", required: false, section: "Personal Details", icon: "calendar" },
    { key: "gender", label: "Gender", type: "select", options: GENDERS, placeholder: "Select gender", required: false, section: "Personal Details", icon: Users },
    { key: "city", label: "City", type: "select", options: INDIAN_CITIES, allowOther: true, placeholder: "Select city", required: false, section: "Location", icon: MapPin },
    { key: "state", label: "State", type: "select", options: INDIAN_STATES, allowOther: true, placeholder: "Select state", required: false, section: "Location", icon: MapPin },
    { key: "country", label: "Country", type: "select", options: COUNTRIES, allowOther: true, placeholder: "Select country", required: false, section: "Location", icon: Globe },
    { key: "qualification", label: "Qualification", type: "select", options: QUALIFICATIONS, allowOther: true, placeholder: "Select qualification", required: false, section: "Education & Experience", icon: GraduationCap },
    // ← Changed from text to searchable select with allowOther
    { key: "collegeName", label: "College / Institute", type: "select", options: COLLEGES, allowOther: true, placeholder: "Search college…", required: false, section: "Education & Experience", icon: Building2 },
    { key: "yearOfPassing", label: "Year of Passing", type: "select", options: YEAR_OPTIONS, placeholder: "Select year", required: false, section: "Education & Experience", icon: "calendar" },
    { key: "domain", label: "Domain / Interest", type: "select", options: DOMAINS, allowOther: true, placeholder: "Select domain", required: false, section: "Education & Experience", icon: Briefcase },
    { key: "experience", label: "Experience", type: "select", options: EXPERIENCE_RANGES, placeholder: "Select experience", required: false, section: "Education & Experience", icon: TrendingUp },
  ],
  trainer: [
    { key: "linkedinUrl", label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/in/…", required: false, section: "Professional Profile", icon: Globe },
    { key: "country", label: "Country", type: "select", options: COUNTRIES, allowOther: true, placeholder: "Select country", required: false, section: "Professional Profile", icon: MapPin },
    { key: "courseTopic", label: "Course Topic(s)", type: "text", placeholder: "e.g. React, Python, AWS", required: false, section: "Teaching Details", icon: BookOpen },
    { key: "audienceSize", label: "Audience Size", type: "select", options: AUDIENCE_SIZES, placeholder: "Select range", required: false, section: "Teaching Details", icon: Users },
    { key: "fullTimeRole", label: "Full-time role?", type: "select", options: YES_NO, placeholder: "Select", required: false, section: "Teaching Details", icon: Briefcase },
    { key: "platforms", label: "Platforms you teach on", type: "multiselect", options: PLATFORMS, required: false, section: "Teaching Details", icon: TrendingUp },
  ],
  Manager: [
    { key: "mobileNumber", label: "Phone Number", type: "tel", placeholder: "e.g. +91 9876543210", required: false, section: "Contact Details", icon: Phone },
    { key: "contactEmail", label: "Contact Email", type: "email", placeholder: "e.g. admin@acme.com", required: false, section: "Contact Details", icon: Mail },
    { key: "organizationName", label: "Organization Name", type: "text", placeholder: "e.g. Acme Corp", required: true, section: "Organization Info", icon: Building2 },
    { key: "domain", label: "Website / Domain", type: "url", placeholder: "https://acme.com", required: false, section: "Organization Info", icon: Globe },
    { key: "location", label: "Location", type: "text", placeholder: "e.g. Hyderabad, India", required: false, section: "Organization Info", icon: MapPin },
    { key: "industry", label: "Industry", type: "select", options: INDUSTRIES, placeholder: "Select industry", required: false, section: "Organization Info", icon: Briefcase },
    { key: "description", label: "About Organization", type: "textarea", placeholder: "Brief description…", required: false, section: "Organization Info", icon: BookOpen },
  ],
};

/* ─────────────────────────────────────────────────────────────
   ROLE META
───────────────────────────────────────────────────────────── */
const ROLE_META = {
  student: { color: T.green, label: "Student", icon: "🎓", gradient: "linear-gradient(135deg, #16A34A, #4ADE80)" },
  trainer: { color: T.orange, label: "Trainer", icon: "🧑‍🏫", gradient: "linear-gradient(135deg, #F97316, #FCD34D)" },
  Manager: { color: T.purple, label: "Business & Partnership", icon: "🤝", gradient: "linear-gradient(135deg, #8B5CF6, #C084FC)" },
};

/* ─────────────────────────────────────────────────────────────
   VALIDATION — unchanged behavior
───────────────────────────────────────────────────────────── */
const sanitize = (str) => (str || "").replace(/<[^>]*>/g, "").replace(/[<>"'&]/g, "").trim();

function isSpamValue(val) {
  if (!val || val.length < 2) return false;
  const v = val.toLowerCase().trim();
  return [
    /^(.)\1{3,}$/,
    /^(123|abc|qwerty|asdf|test|xxx|dummy|hello|foo|bar)/i,
    /^[\d\s]+$/,
    /^[^a-zA-Z]+$/,
    /^[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?`~-]+$/,
  ].some((p) => p.test(v));
}

function containsMarkupInjection(raw) {
  if (!raw) return false;
  return /<\s*(script|svg|img|iframe|object|embed|style|link|on\w+)\b/i.test(raw)
    || /<[^>]+>/.test(raw);
}

function validateCustomValue(val, existingOptions = []) {
  if (containsMarkupInjection(val)) return "HTML or script tags are not allowed.";
  const v = sanitize(val);
  if (!v || v.length < 2) return "Minimum 2 characters required.";
  if (v.length > 80) return "Maximum 80 characters allowed.";
  if (/^\d+$/.test(v)) return "Numbers-only values are not allowed.";
  if (/^[^a-zA-Z]+$/.test(v)) return "Must contain at least one letter.";
  if (isSpamValue(v)) return "Please enter a meaningful value.";
  if (existingOptions.map((o) => o.toLowerCase()).includes(v.toLowerCase())) return "This option already exists.";
  return null;
}

function validateMobileField(val) {
  if (!val || !val.trim()) return null;
  let v = val.replace(/\s+/g, "");
  if (/[^+\d]/.test(v)) return "Please enter a valid mobile number.";
  if (!v.startsWith("+") && /^91\d{10}$/.test(v)) v = `+${v}`;
  if (v.startsWith("+91")) {
    const local = v.slice(3);
    if (!/^\d{10}$/.test(local)) return "Please enter a valid 10-digit Indian mobile number.";
    if (/^(\d)\1{9}$/.test(local)) return "Please enter a valid mobile number.";
    if (/^[01234]/.test(local)) return "Please enter a valid mobile number.";
    return null;
  }
  if (v.startsWith("+")) {
    const rest = v.replace(/^\+\d{1,4}/, "");
    if (!/^\d{6,14}$/.test(rest)) return "Please enter a valid mobile number.";
    return null;
  }
  if (!/^\d{10}$/.test(v)) return "Please enter a valid 10-digit mobile number.";
  if (/^(\d)\1{9}$/.test(v)) return "Please enter a valid mobile number.";
  if (/^[01234]/.test(v)) return "Please enter a valid mobile number.";
  return null;
}

function validateEmailField(val) {
  if (!val || !val.trim()) return null;
  const v = val.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Please enter a valid email address.";
  if (isSpamValue(v.split("@")[0])) return "Please enter a valid email address.";
  return null;
}

function validateUrlField(val) {
  if (!val || !val.trim()) return null;
  try {
    const u = new URL(val.trim());
    if (!["http:", "https:"].includes(u.protocol)) return "URL must start with https://.";
    if (!u.hostname.includes(".")) return "Please enter a valid URL.";
    return null;
  } catch {
    return "Please enter a valid URL (e.g. https://example.com).";
  }
}

function validateDobField(val) {
  if (!val) return null;
  const dob = new Date(val);
  if (Number.isNaN(dob.getTime())) return "Please enter a valid date.";
  const now = new Date();
  if (dob >= now) return "Date of birth cannot be in the future.";
  const ageYears = (now - dob) / (365.25 * 24 * 60 * 60 * 1000);
  if (ageYears < 10) return "Age must be at least 10 years.";
  return null;
}

/* ─────────────────────────────────────────────────────────────
   SPINNER
───────────────────────────────────────────────────────────── */
const ISpinner = () => (
  <span style={{
    display: "inline-block", width: 12, height: 12, borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
    animation: "pdfSpin .65s linear infinite", flexShrink: 0,
  }} />
);

/* ─────────────────────────────────────────────────────────────
   API HELPER — unchanged
───────────────────────────────────────────────────────────── */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

async function patchAuth(path, token, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json().catch(() => ({}));
}

/* ─────────────────────────────────────────────────────────────
   PROGRESS BAR
───────────────────────────────────────────────────────────── */
const ProgressBar = ({ fields, form, color }) => {
  const filled = fields.filter((f) => {
    const v = form[f.key];
    return Array.isArray(v) ? v.length > 0 : !!(v || "").trim();
  }).length;
  const pct = fields.length === 0 ? 100 : Math.round((filled / fields.length) * 100);
  const label = pct < 30 ? "Just starting out" : pct < 60 ? "Good progress" : pct < 90 ? "Almost there" : "Profile complete 🎉";

  return (
    <div style={{ padding: "10px 18px", background: `${color}08`, borderBottom: `1.5px solid ${color}22` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color }}>Profile Completion</span>
        <span style={{ fontSize: 18, fontWeight: 900, color, fontFamily: "'Sora', sans-serif", lineHeight: 1 }}>{pct}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 10, background: `${color}20`, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 10, background: color, width: `${pct}%`,
          transition: "width .5s cubic-bezier(.4,0,.2,1)",
          boxShadow: `0 0 6px ${color}60`,
        }} />
      </div>
      <p style={{ fontSize: 10, color: `${color}CC`, marginTop: 4, fontWeight: 500 }}>{label}</p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SEARCHABLE DROPDOWN
───────────────────────────────────────────────────────────── */
const SearchableDropdown = ({ value, onChange, options: initialOptions, placeholder, accentColor, allowAddNew = false }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [opts, setOpts] = useState(initialOptions || []);
  const [addMode, setAddMode] = useState(false);
  const [newVal, setNewVal] = useState("");
  const [addErr, setAddErr] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { setOpts(initialOptions || []); }, [initialOptions]);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);

  const filtered = opts.filter((o) => o.toLowerCase().includes(query.toLowerCase()));
  const select = (opt) => { onChange(opt); setOpen(false); setQuery(""); };
  const clear = (e) => { e.stopPropagation(); onChange(""); };

  const commitAdd = () => {
    const err = validateCustomValue(newVal, opts);
    if (err) { setAddErr(err); return; }
    const v = sanitize(newVal);
    const capitalized = v.charAt(0).toUpperCase() + v.slice(1);
    setOpts((p) => [...p, capitalized]);
    onChange(capitalized);
    setAddMode(false); setNewVal(""); setAddErr(""); setOpen(false); setQuery("");
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen((p) => !p)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 6, padding: "8px 11px",
        borderRadius: 8, border: `1.5px solid ${open ? accentColor : T.border}`,
        background: T.surface, cursor: "pointer",
        boxShadow: open ? `0 0 0 3px ${accentColor}1A` : "0 1px 2px rgba(0,0,0,0.04)",
        transition: "all .18s", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5,
        color: value ? T.text : T.muted, textAlign: "left",
      }}>
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value || placeholder}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
          {value && <X onClick={clear} style={{ width: 11, height: 11, color: T.muted, cursor: "pointer" }} />}
          <ChevronDown style={{ width: 13, height: 13, color: T.muted, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1200,
          background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 10,
          boxShadow: "0 12px 36px rgba(0,0,0,0.13)", overflow: "hidden",
          animation: "pdfDropOpen .15s ease both",
        }}>
          <div style={{ padding: "6px 8px 5px", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ position: "relative" }}>
              <Search style={{ position: "absolute", left: 7, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, color: T.muted }} />
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…"
                style={{ width: "100%", padding: "6px 7px 6px 24px", border: `1px solid ${T.border}`, borderRadius: 7, fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif", color: T.text, background: T.subtle, outline: "none" }} />
            </div>
          </div>

          <div style={{ maxHeight: 176, overflowY: "auto" }}>
            {filtered.length === 0 && !addMode && (
              <p style={{ padding: "10px 12px", fontSize: 12, color: T.muted, textAlign: "center" }}>No results found</p>
            )}
            {filtered.map((opt) => (
              <button key={opt} type="button" onClick={() => select(opt)} style={{
                width: "100%", textAlign: "left", padding: "7px 12px", background: "transparent",
                border: "none", cursor: "pointer", fontSize: 12.5, color: value === opt ? accentColor : T.text,
                fontWeight: value === opt ? 700 : 400, fontFamily: "'Plus Jakarta Sans', sans-serif",
                display: "flex", alignItems: "center", gap: 7, transition: "background .1s",
              }}
                onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.background = T.subtle; }}
                onMouseLeave={(e) => { if (value !== opt) e.currentTarget.style.background = "transparent"; }}
              >
                {value === opt && <CheckCircle style={{ width: 11, height: 11, color: accentColor, flexShrink: 0 }} />}
                {opt}
              </button>
            ))}
          </div>

          {allowAddNew && (
            <div style={{ borderTop: `1px solid ${T.border}`, padding: "6px 8px" }}>
              {!addMode ? (
                <button type="button" onClick={() => setAddMode(true)} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 5, padding: "6px 9px",
                  border: `1.5px dashed ${accentColor}`, borderRadius: 7, background: `${accentColor}0A`,
                  color: accentColor, fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  <Plus style={{ width: 11, height: 11 }} /> Add custom option
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    <input autoFocus value={newVal} onChange={(e) => { setNewVal(e.target.value); setAddErr(""); }}
                      placeholder="Type your option…"
                      onKeyDown={(e) => { if (e.key === "Enter") commitAdd(); if (e.key === "Escape") { setAddMode(false); setNewVal(""); setAddErr(""); } }}
                      style={{ flex: 1, padding: "6px 9px", border: `1.5px solid ${addErr ? T.error : T.border}`, borderRadius: 7, fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif", color: T.text, outline: "none" }} />
                    <button type="button" onClick={commitAdd} style={{ padding: "6px 10px", background: accentColor, border: "none", borderRadius: 7, color: "#fff", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>Add</button>
                    <button type="button" onClick={() => { setAddMode(false); setNewVal(""); setAddErr(""); }} style={{ padding: "6px 9px", background: T.subtle, border: `1px solid ${T.border}`, borderRadius: 7, cursor: "pointer", color: T.muted, fontSize: 11.5 }}>✕</button>
                  </div>
                  {addErr && <p style={{ fontSize: 11, color: T.error, display: "flex", alignItems: "center", gap: 4 }}><AlertCircle style={{ width: 10, height: 10 }} />{addErr}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MULTI-CHIP SELECTOR
───────────────────────────────────────────────────────────── */
const MultiChips = ({ values = [], onChange, options = [], accentColor }) => {
  const toggle = (opt) => onChange(values.includes(opt) ? values.filter((v) => v !== opt) : [...values, opt]);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map((opt) => {
        const on = values.includes(opt);
        return (
          <button key={opt} type="button" onClick={() => toggle(opt)} style={{
            padding: "4px 11px", borderRadius: 20,
            border: `1.5px solid ${on ? accentColor : T.border}`,
            background: on ? `${accentColor}12` : T.surface,
            color: on ? accentColor : T.muted,
            fontSize: 11.5, fontWeight: on ? 700 : 500, cursor: "pointer",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            display: "flex", alignItems: "center", gap: 4, transition: "all .15s",
          }}>
            {on && <CheckCircle style={{ width: 10, height: 10 }} />}
            {opt}
          </button>
        );
      })}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function ProfileDetailsForm({
  role = "student",
  name = "",
  email = "",
  token = "",
  onSuccess,
  onBack,
  isEditMode = false,
}) {
  const normalizedRole = normalizeRole(role);
  const fields = ROLE_FIELDS[normalizedRole] || ROLE_FIELDS.student;
  const meta = ROLE_META[normalizedRole] || ROLE_META.student;

  const [form, setForm] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.key, f.type === "multiselect" ? [] : ""]))
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateSingleField = (f, rawVal) => {
    const v = rawVal;
    if (f.required) {
      const isEmpty = Array.isArray(v) ? v.length === 0 : !v || !v.trim();
      if (isEmpty) return `${f.label} is required.`;
    }
    if (Array.isArray(v) ? v.length === 0 : !v || !v.trim()) return null;
    switch (f.type) {
      case "tel": return validateMobileField(v);
      case "email": return validateEmailField(v);
      case "url": return validateUrlField(v);
      case "date": return validateDobField(v);
      case "text":
      case "textarea": {
        const err = validateCustomValue(v, []);
        return err && !err.includes("already exists") ? err : null;
      }
      default: return null;
    }
  };

  const handleBlur = (f) => {
    const err = validateSingleField(f, form[f.key]);
    setFieldErrors((prev) => ({ ...prev, [f.key]: err || "" }));
  };

  const buildPayload = () => {
    const payload = { role };
    fields.forEach((f) => {
      if (f.type === "multiselect") { payload[f.key] = form[f.key] || []; }
      else { payload[f.key] = f.type === "text" || f.type === "textarea" || f.type === "url" ? sanitize(form[f.key] || "") : form[f.key]; }
    });
    return payload;
  };

  const validateForm = () => {
    const errs = {};
    fields.forEach((f) => {
      const err = validateSingleField(f, form[f.key]);
      if (err) errs[f.key] = err;
    });
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validateForm();
    if (Object.keys(errs).length) { setFieldErrors(errs); setError("Please fix the errors below."); return; }
    setError(""); setLoading(true);
    try {
      if (normalizedRole === "Manager") {
        const orgId = localStorage.getItem("organizationId");
        if (orgId) {
          await fetch(`${API_BASE}/organizations/${orgId}/profile`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              organizationName: sanitize(form.organizationName),
              domain: sanitize(form.domain),
              contactEmail: sanitize(form.contactEmail),
              location: sanitize(form.location),
              industry: form.industry,
              description: sanitize(form.description),
              mobileNumber: sanitize(form.mobileNumber),
            }),
          });
        }
      } else {
        await patchAuth("/auth/me/profile", token, buildPayload());
      }
      await patchAuth("/auth/me/profile-completed", token, {});
      await new Promise((r) => setTimeout(r, 1200));
      const stored = (() => { try { return JSON.parse(localStorage.getItem("lms_user") || "{}"); } catch { return {}; } })();
      localStorage.setItem("lms_user", JSON.stringify({ ...stored, profileCompleted: true }));
      onSuccess && onSuccess();
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      console.error("ProfileDetailsForm error:", err);
    } finally { setLoading(false); }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      await patchAuth("/auth/me/profile-completed", token, {});
      const stored = (() => { try { return JSON.parse(localStorage.getItem("lms_user") || "{}"); } catch { return {}; } })();
      localStorage.setItem("lms_user", JSON.stringify({ ...stored, profileCompleted: true }));
      onSuccess && onSuccess();
    } catch { onSuccess && onSuccess(); }
    finally { setLoading(false); }
  };

  const renderField = (f) => {
    const err = fieldErrors[f.key];

    if (f.type === "textarea") {
      return (
        <div>
          <textarea value={form[f.key]} onChange={(e) => handleChange(f.key, e.target.value)} onBlur={() => handleBlur(f)} placeholder={f.placeholder} rows={3}
            style={{
              width: "100%", padding: "8px 11px", borderRadius: 8, resize: "vertical",
              border: `1.5px solid ${err ? T.error : T.border}`, fontSize: 12.5, color: T.text,
              background: T.surface, fontFamily: "'Plus Jakarta Sans', sans-serif", outline: "none",
              transition: "border-color .18s", minHeight: 70,
            }}
            onFocus={(e) => { e.target.style.borderColor = meta.color; e.target.style.boxShadow = `0 0 0 3px ${meta.color}18`; }}
          />
          {err && <FieldError msg={err} />}
        </div>
      );
    }

    if (f.type === "date") {
      return (
        <div>
          <input type="date" value={form[f.key]} onChange={(e) => handleChange(f.key, e.target.value)} onBlur={() => handleBlur(f)} max={new Date().toISOString().split("T")[0]}
            style={{
              width: "100%", padding: "8px 11px", borderRadius: 8,
              border: `1.5px solid ${err ? T.error : T.border}`, fontSize: 12.5, color: T.text,
              background: T.surface, fontFamily: "'Plus Jakarta Sans', sans-serif", outline: "none",
              transition: "border-color .18s",
            }}
            onFocus={(e) => { e.target.style.borderColor = meta.color; e.target.style.boxShadow = `0 0 0 3px ${meta.color}18`; }}
          />
          {err && <FieldError msg={err} />}
        </div>
      );
    }

    if (f.type === "select") {
      return (
        <div>
          <SearchableDropdown value={form[f.key]} onChange={(v) => handleChange(f.key, v)} options={f.options || []} placeholder={f.placeholder} accentColor={meta.color} allowAddNew={!!f.allowOther} />
          {err && <FieldError msg={err} />}
        </div>
      );
    }

    if (f.type === "multiselect") {
      return (
        <div>
          <MultiChips values={form[f.key] || []} onChange={(vals) => handleChange(f.key, vals)} options={f.options || []} accentColor={meta.color} />
          {err && <FieldError msg={err} />}
        </div>
      );
    }

    // text / tel / url / email
    return (
      <div>
        <input type={f.type} value={form[f.key]} onChange={(e) => handleChange(f.key, e.target.value)} onBlur={() => handleBlur(f)} placeholder={f.placeholder}
          style={{
            width: "100%", padding: "8px 11px", borderRadius: 8,
            border: `1.5px solid ${err ? T.error : T.border}`, fontSize: 12.5, color: T.text,
            background: T.surface, fontFamily: "'Plus Jakarta Sans', sans-serif", outline: "none",
            transition: "border-color .18s",
          }}
          onFocus={(e) => { e.target.style.borderColor = meta.color; e.target.style.boxShadow = `0 0 0 3px ${meta.color}18`; }}
        />
        {err && <FieldError msg={err} />}
      </div>
    );
  };

  const sections = [];
  fields.forEach((f) => {
    const last = sections[sections.length - 1];
    if (last && last.title === f.section) last.items.push(f);
    else sections.push({ title: f.section || "Details", items: [f] });
  });

  const SECTION_ICONS = {
    "Personal Details": User,
    "Location": MapPin,
    "Education & Experience": GraduationCap,
    "Professional Profile": Star,
    "Teaching Details": BookOpen,
    "Contact Details": Phone,
    "Organization Info": Building2,
  };

  return (
    <>
      <style>{FORM_STYLES}</style>
      <div className="pdfx-overlay">
        <div className="pdfx-modal" style={{ "--role-color": meta.color, "--role-color-soft": `${meta.color}20` }}>

          {/* ── Header ── */}
          <div className="pdfx-header" style={{ background: meta.gradient }}>
            <div className="pdfx-header-top">
              <div className="pdfx-logo">
                <span className="pdfx-logo-ilm">ILM</span>
                <span className="pdfx-logo-ora">ORA</span>
                <span className="pdfx-logo-beta">BETA</span>
              </div>
              <div className="pdfx-role-pill">
                <span className="pdfx-role-icon">{meta.icon}</span>
                {meta.label}
              </div>
            </div>
          </div>

          {/* ── Progress ── */}
          <ProgressBar fields={fields} form={form} color={meta.color} />

          {/* ── Body ── */}
          <div className="pdfx-body pdfx-scroll">
            <div className="pdfx-intro">
              <p className="pdfx-greeting">Hey {name || "there"} 👋</p>
              <h2 className="pdfx-title">Complete your profile</h2>
              <p className="pdfx-sub">
                A few quick details to personalise your{" "}
                <span style={{ color: meta.color, fontWeight: 700 }}>{meta.label}</span>{" "}
                experience.
              </p>
            </div>

            {sections.map((sec, si) => {
              const SIcon = SECTION_ICONS[sec.title] || BookOpen;
              return (
                <div key={sec.title + si} className="pdfx-section">
                  <div className="pdfx-section-header">
                    <div className="pdfx-section-icon-wrap" style={{ background: `${meta.color}16` }}>
                      <SIcon style={{ width: 11, height: 11, color: meta.color }} />
                    </div>
                    {sec.title}
                  </div>
                  <div className="pdfx-fields-grid">
                    {sec.items.map((f) => {
                      const fullWidth = f.type === "textarea" || f.type === "multiselect";
                      return (
                        <div key={f.key} className={fullWidth ? "pdfx-field pdfx-field--full" : "pdfx-field"}>
                          <label className="pdfx-label">
                            {f.label}
                            {f.required && <span style={{ color: T.error, marginLeft: 2 }}>*</span>}
                          </label>
                          {renderField(f)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {error && (
              <div className="pdfx-error-banner">
                <AlertCircle style={{ width: 13, height: 13, flexShrink: 0 }} />
                {error}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="pdfx-footer">
            {onBack && (
              <button type="button" className="pdfx-btn-back" onClick={onBack} disabled={loading}>← Back</button>
            )}
            <button type="button" className="pdfx-btn-submit" onClick={handleSubmit} disabled={loading} style={{ background: meta.gradient }}>
              {loading ? <><ISpinner /> Saving…</> : isEditMode ? "Save Changes" : "Save & Continue →"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Inline field error ── */
const FieldError = ({ msg }) => (
  <p style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: T.error, marginTop: 4, fontWeight: 500, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
    <AlertCircle style={{ width: 10, height: 10, flexShrink: 0 }} />{msg}
  </p>
);

/* ─────────────────────────────────────────────────────────────
   STYLES — COMPACT VERSION
   Key changes vs previous version:
   • max-width reduced: 480→420px (desktop), 560→520px (tablet)
   • All padding values reduced by ~20-25%
   • Font sizes tightened (title 18→16px, sub 12→11px)
   • Field gaps reduced (13px→10px)
   • Progress bar slimmed
   • align-items:stretch fix preserved (iPad Mini rotation)
───────────────────────────────────────────────────────────── */
const FORM_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes pdfSpin { to { transform: rotate(360deg); } }
  @keyframes pdfModalIn { from { opacity:0; transform: scale(0.97) translateY(8px); } to { opacity:1; transform: none; } }
  @keyframes pdfDropOpen { from { opacity:0; transform: translateY(-4px) scale(0.98); } to { opacity:1; transform: none; } }

  /* ── Overlay ── */
  .pdfx-overlay {
    position: fixed; inset: 0; z-index: 1100;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: stretch;
    justify-content: center;
    padding: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-sizing: border-box;
  }

  /* ── Modal — compact base ── */
  .pdfx-modal {
    width: 100%;
    max-width: 420px;           /* ← was 480px */
    background: #FAFAFA;
    border-radius: 18px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.12);
    display: flex; flex-direction: column;
    align-self: stretch;
    max-height: 100%;
    overflow: hidden;
    animation: pdfModalIn .22s cubic-bezier(.34,1.56,.64,1) both;
  }

  /* ── Header ── */
  .pdfx-header {
    padding: 11px 16px;
    flex-shrink: 0;
  }
  .pdfx-header-top {
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
  }

  /* ── Logo ── */
  .pdfx-logo {
  display: inline-flex;
  align-items: center;
  background: #fff;
  padding: 6px 12px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.13);
}
  .pdfx-logo-ilm {
    font-size: 0.95rem; font-weight: 900; letter-spacing: -0.4px;
    color: #16A34A; font-family: 'Sora', sans-serif;
  }
  .pdfx-logo-ora {
    font-size: 0.95rem; font-weight: 900; letter-spacing: -0.4px;
    color: #EA580C; font-family: 'Sora', sans-serif;
    margin-left: 4px;
  }
  .pdfx-logo-beta {
  font-size: 8px;
  font-weight: 800;
  color: #fff;
  background: #F97316;
  padding: 2px 6px;
  border-radius: 5px;
  letter-spacing: 0.04em;

  /* Reference image jaisa gap */
  margin-left: 24px;
}

  .pdfx-role-pill {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.35);
    border-radius: 20px; padding: 4px 10px;
    color: #fff; font-size: 11px; font-weight: 700;
    flex-shrink: 0;
  }
  .pdfx-role-icon { font-size: 12px; line-height: 1; }

  /* ── Body ── */
  .pdfx-body {
    flex: 1; overflow-y: auto;
    padding: 12px 16px 4px;
    background: #FAFAFA;
  }
  .pdfx-scroll::-webkit-scrollbar { width: 3px; }
  .pdfx-scroll::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 4px; }

  /* ── Intro block — compact ── */
  .pdfx-intro { margin-bottom: 12px; }
  .pdfx-greeting { font-size: 11px; color: #9CA3AF; font-weight: 500; margin-bottom: 1px; }
  .pdfx-title { font-size: 16px; font-weight: 900; color: #111827; font-family: 'Sora', sans-serif; margin-bottom: 3px; }
  .pdfx-sub { font-size: 11px; color: #9CA3AF; line-height: 1.45; }

  /* ── Sections ── */
  .pdfx-section { margin-bottom: 12px; }
  .pdfx-section-header {
    display: flex; align-items: center; gap: 7px;
    font-size: 9.5px; font-weight: 800; letter-spacing: 0.1em;
    text-transform: uppercase; color: #6B7280;
    margin-bottom: 8px; padding-bottom: 6px;
    border-bottom: 1.5px solid #F3F4F6;
  }
  .pdfx-section-icon-wrap {
    width: 20px; height: 20px; border-radius: 5px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  /* ── Fields grid ──
     auto-fit/minmax: portrait → 1–2 cols, landscape → 2–3 cols.
     Minimum column width reduced to 180px to fit 420px modal.
  ── */
  .pdfx-fields-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 10px;
  }

  /* Narrow phones: force single column */
  @media (max-width: 480px) {
    .pdfx-fields-grid { grid-template-columns: 1fr; }
  }

  .pdfx-field--full { grid-column: 1 / -1; }

  .pdfx-label {
    display: block; font-size: 10.5px; font-weight: 700;
    color: #374151; margin-bottom: 4px; letter-spacing: 0.01em;
  }

  /* ── Error banner ── */
  .pdfx-error-banner {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 12px; border-radius: 9px;
    background: #FEF2F2; border: 1.5px solid #FECACA;
    color: #DC2626; font-size: 11.5px; font-weight: 600;
    margin-top: 4px; margin-bottom: 8px;
  }

  /* ── Footer ── */
  .pdfx-footer {
    display: flex; align-items: center; justify-content: flex-end; gap: 8px;
    padding: 10px 16px; border-top: 1.5px solid #F3F4F6;
    background: #FAFAFA; flex-shrink: 0;
  }

  .pdfx-btn-back {
    padding: 7px 13px; background: #fff;
    border: 1.5px solid #E5E7EB; border-radius: 9px;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px;
    font-weight: 600; color: #6B7280; cursor: pointer;
    transition: all .16s;
  }
  .pdfx-btn-back:hover { background: #F9FAFB; }
  .pdfx-btn-back:disabled { opacity: .5; cursor: not-allowed; }

  .pdfx-btn-submit {
    padding: 8px 18px; border: none; border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12.5px;
    font-weight: 800; color: #fff; cursor: pointer;
    display: flex; align-items: center; gap: 6px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.16);
    transition: opacity .16s, transform .12s;
    letter-spacing: 0.01em;
  }
  .pdfx-btn-submit:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
  .pdfx-btn-submit:disabled { opacity: .45; cursor: not-allowed; transform: none; }

  /* ── Small phones ── */
  @media (max-width: 480px) {
    .pdfx-modal { border-radius: 14px; }
    .pdfx-header { padding: 10px 14px; }
    .pdfx-body { padding: 11px 14px 4px; }
    .pdfx-footer { padding: 8px 14px; }
    .pdfx-title { font-size: 15px; }
  }

  /* ── Tablets / iPad Mini portrait ── */
  @media (min-width: 600px) {
    .pdfx-modal { max-width: 520px; }   /* was 560px */
    .pdfx-fields-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
  }

  /* ── Desktop / Laptop — keeps modal from being too wide ── */
  @media (min-width: 900px) {
    .pdfx-modal { max-width: 480px; }
    .pdfx-overlay { padding: 16px; align-items: center; }
  }

  /* ── iPad Mini landscape / short viewport ── */
  @media (min-width: 600px) and (max-height: 900px) {
    .pdfx-overlay { padding: 8px; align-items: stretch; }
    .pdfx-modal { max-width: 580px; border-radius: 14px; }
    .pdfx-header { padding: 9px 14px; }
    .pdfx-body { padding: 10px 16px 4px; }
    .pdfx-footer { padding: 8px 14px; }
    .pdfx-title { font-size: 15px; }
    .pdfx-sub { margin-bottom: 10px; }
    .pdfx-section { margin-bottom: 10px; }
    .pdfx-section-header { margin-bottom: 6px; padding-bottom: 5px; }
    .pdfx-fields-grid { grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 8px; }
  }

  /* ── Short landscape phones ── */
  @media (max-height: 480px) and (orientation: landscape) {
    .pdfx-overlay { padding: 5px; align-items: stretch; }
    .pdfx-modal { border-radius: 11px; }
    .pdfx-header { padding: 6px 12px; }
    .pdfx-body { padding: 7px 12px 3px; }
    .pdfx-section { margin-bottom: 8px; }
    .pdfx-section-header { margin-bottom: 5px; padding-bottom: 4px; font-size: 9px; }
    .pdfx-footer { padding: 7px 12px; }
    .pdfx-title { font-size: 13px; }
    .pdfx-greeting { display: none; }
    .pdfx-sub { font-size: 10px; }
    .pdfx-fields-grid { gap: 7px; }
  }
`;