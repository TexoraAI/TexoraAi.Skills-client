// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Country, State, City } from "country-state-city";
// import authService from "../../services/authService";

// /* ─────────────────────────────────────────────
//    CONSTANTS
// ───────────────────────────────────────────── */
// const TOTAL_STEPS = 3;

// const ROLES = [
//   {
//     value: "student",
//     label: "Student",
//     desc: "Learn & grow with 300+ courses",
//     color: "#27ae60",
//     bg: "rgba(39,174,96,0.10)",
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
//         <path d="M6 12v5c3 3 9 3 12 0v-5"/>
//       </svg>
//     ),
//   },
//   {
//     value: "trainer",
//     label: "Trainer",
//     desc: "Teach & inspire thousands of learners",
//     color: "#e67e22",
//     bg: "rgba(230,126,34,0.10)",
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e67e22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <rect x="9" y="2" width="6" height="12" rx="3"/>
//         <path d="M19 10a7 7 0 0 1-14 0"/>
//         <line x1="12" y1="19" x2="12" y2="22"/>
//         <line x1="8" y1="22" x2="16" y2="22"/>
//       </svg>
//     ),
//   },
//   {
//     value: "Tenant Admin",
//     label: "Tenant Admin",
//     desc: "Scale your team with structured learning",
//     color: "#8e44ad",
//     bg: "rgba(142,68,173,0.10)",
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8e44ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <rect x="2" y="7" width="20" height="14" rx="2"/>
//         <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
//       </svg>
//     ),
//   },
// ];

// /* ─────────────────────────────────────────────
//    DROPDOWN OPTIONS (10+ each)
// ───────────────────────────────────────────── */
// const EXPERTISE_OPTIONS = [
//   "Product Design","UI/UX Design","Product Management","Software Engineering",
//   "Data Science","Machine Learning","Digital Marketing","Content Strategy",
//   "Business Analytics","DevOps & Cloud","Cybersecurity","Mobile Development",
//   "Blockchain","Finance & Accounting","HR & People Ops","Sales & Growth",
// ];

// const EXPERIENCE_OPTIONS = [
//   "Less than 1","1","2","3","4","5","6","7","8","9","10",
//   "11","12","13","14","15","16-20","20+",
// ];

// const BUSINESS_TYPE_OPTIONS = [
//   "Startup","SME","Enterprise","Individual / Freelancer",
//   "Non-Profit / NGO","Government / Public Sector","Educational Institution",
//   "Agency / Consultancy","Joint Venture","Partnership Firm",
//   "Limited Liability Company (LLC)","Other",
// ];

// const INDUSTRY_OPTIONS = [
//   "IT & Software","Education & EdTech","Finance & Banking","Retail & E-Commerce",
//   "Healthcare & MedTech","Manufacturing","Media & Entertainment",
//   "Logistics & Supply Chain","Real Estate","Legal & Compliance",
//   "Agriculture & Food","Travel & Hospitality","Energy & Utilities","Other",
// ];

// const COMPANY_SIZE_OPTIONS = [
//   "1 (Solo)","2-10","11-50","51-200","201-500","501-1000",
//   "1001-5000","5000+",
// ];

// const YEARS_EXPERIENCE_OPTIONS = [
//   "Less than 1","1","2","3","4","5","6","7","8","9","10",
//   "11","12","13","14","15","15-20","20+",
// ];

// const AUDIENCE_SIZE_OPTIONS = [
//   "0-100","100-500","500-1,000","1,000-2,000","2,000-5,000",
//   "5,000-10,000","10,000-50,000","50,000-100,000","100,000+",
// ];

// /* ─────────────────────────────────────────────
//    ENHANCED SELECT WITH "ADD CUSTOM" OPTION
// ───────────────────────────────────────────── */
// function EnhancedSelect({ value, onChange, options, placeholder = "Select", error, name, label }) {
//   const [showCustomInput, setShowCustomInput] = useState(false);
//   const [customVal, setCustomVal] = useState("");
//   const [localOptions, setLocalOptions] = useState(options);

//   const handleChange = (e) => {
//     const v = e.target.value;
//     if (v === "__add_custom__") {
//       setShowCustomInput(true);
//     } else {
//       onChange({ target: { name, value: v } });
//     }
//   };

//   const handleAddCustom = () => {
//     const trimmed = customVal.trim();
//     if (!trimmed) return;
//     if (!localOptions.includes(trimmed)) setLocalOptions(prev => [...prev, trimmed]);
//     onChange({ target: { name, value: trimmed } });
//     setCustomVal("");
//     setShowCustomInput(false);
//   };

//   return (
//     <div>
//       <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
//         <div className="cp-sel-wrap" style={{ flex: 1 }}>
//           <select
//             className={`cp-input${error ? " cp-input-err" : ""}`}
//             value={value}
//             onChange={handleChange}
//             name={name}
//           >
//             <option value="">{placeholder}</option>
//             {localOptions.map(o => <option key={o} value={o}>{o}</option>)}
//             <option value="__add_custom__">＋ Add custom…</option>
//           </select>
//           <span className="cp-sel-arr"><IChevDown /></span>
//         </div>
//         <button
//           type="button"
//           onClick={() => setShowCustomInput(v => !v)}
//           title="Add custom value"
//           style={{
//             width: 32, height: 36, flexShrink: 0,
//             background: "#fff", border: "1.5px solid #e4dfd8",
//             borderRadius: 8, cursor: "pointer", color: "#e67e22",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             fontSize: 18, fontWeight: 700, transition: "all .16s",
//           }}
//         >＋</button>
//       </div>
//       {showCustomInput && (
//         <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
//           <input
//             className="cp-input"
//             type="text"
//             value={customVal}
//             onChange={e => setCustomVal(e.target.value)}
//             placeholder={`Type custom ${label || "value"}…`}
//             onKeyDown={e => { if (e.key === "Enter") handleAddCustom(); if (e.key === "Escape") setShowCustomInput(false); }}
//             autoFocus
//             style={{ flex: 1 }}
//           />
//           <button
//             type="button"
//             onClick={handleAddCustom}
//             style={{
//               padding: "0 14px", background: "#e67e22", border: "none",
//               borderRadius: 8, color: "#fff", cursor: "pointer",
//               fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13,
//             }}
//           >Add</button>
//           <button
//             type="button"
//             onClick={() => setShowCustomInput(false)}
//             style={{
//               padding: "0 10px", background: "#f5f0eb", border: "1.5px solid #e4dfd8",
//               borderRadius: 8, color: "#888", cursor: "pointer",
//               fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13,
//             }}
//           >✕</button>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    FLAG HELPER  — uses Twemoji CDN (always renders)
// ───────────────────────────────────────────── */
// function CountryFlag({ isoCode, size = 20 }) {
//   if (!isoCode || isoCode.length !== 2) return null;
//   // Convert ISO to Twemoji URL (regional indicator Unicode codepoints)
//   const cp1 = (0x1F1E6 - 65 + isoCode.toUpperCase().charCodeAt(0)).toString(16);
//   const cp2 = (0x1F1E6 - 65 + isoCode.toUpperCase().charCodeAt(1)).toString(16);
//   const src = `https://cdn.jsdelivr.net/npm/twemoji@14.0.2/assets/svg/${cp1}-${cp2}.svg`;
//   return (
//     <img
//       src={src}
//       alt={isoCode}
//       width={size}
//       height={size}
//       style={{ display: "inline-block", verticalAlign: "middle", borderRadius: 3, objectFit: "cover" }}
//       onError={e => { e.target.style.display = "none"; }}
//     />
//   );
// }

// /* ─────────────────────────────────────────────
//    SEARCHABLE CITY DROPDOWN
// ───────────────────────────────────────────── */
// function CitySearchDropdown({ value, onChange, cities, disabled, error }) {
//   const [open, setOpen]   = useState(false);
//   const [query, setQuery] = useState(value || "");
//   const wrapRef           = useRef(null);

//   useEffect(() => { setQuery(value || ""); }, [value]);

//   useEffect(() => {
//     const handler = (e) => {
//       if (wrapRef.current && !wrapRef.current.contains(e.target)) {
//         setOpen(false);
//         if (query.trim() && query !== value) onChange(query.trim());
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, [query, value, onChange]);

//   const filtered   = cities.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 80);
//   const exactMatch = cities.some(c => c.name.toLowerCase() === query.trim().toLowerCase());

//   return (
//     <div ref={wrapRef} style={{ position: "relative" }}>
//       <input
//         className={`cp-input${error ? " cp-input-err" : ""}`}
//         type="text"
//         value={query}
//         onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
//         onFocus={() => !disabled && setOpen(true)}
//         onKeyDown={e => {
//           if (e.key === "Enter" && query.trim()) { onChange(query.trim()); setOpen(false); }
//           if (e.key === "Escape") setOpen(false);
//         }}
//         placeholder={disabled ? "Select State first" : cities.length === 0 ? "Type city name…" : "Search or type city…"}
//         disabled={disabled}
//         autoComplete="off"
//       />
//       {open && !disabled && (
//         <div style={{
//           position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
//           background: "#fff", border: "1px solid #e2d9d0", borderRadius: 10,
//           boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 9999,
//           maxHeight: 200, overflowY: "auto"
//         }}>
//           {query.trim() && !exactMatch && (
//             <div
//               onClick={() => { setQuery(query.trim()); onChange(query.trim()); setOpen(false); }}
//               style={{ padding: "9px 13px", fontSize: 13, fontWeight: 600, color: "#e67e22", cursor: "pointer", borderBottom: "1px solid #f5ece1", background: "#fffaf5" }}
//             >
//               + Use "{query.trim()}"
//             </div>
//           )}
//           {filtered.map((c, i) => (
//             <div
//               key={`${c.name}-${i}`}
//               onClick={() => { setQuery(c.name); onChange(c.name); setOpen(false); }}
//               style={{ padding: "8px 13px", fontSize: 13, cursor: "pointer", color: c.name === value ? "#e67e22" : "#333", fontWeight: c.name === value ? 600 : 400, background: c.name === value ? "#fffaf5" : "transparent", borderBottom: "1px solid #f5f5f5" }}
//               onMouseEnter={e => e.currentTarget.style.background = "#fffaf5"}
//               onMouseLeave={e => e.currentTarget.style.background = c.name === value ? "#fffaf5" : "transparent"}
//             >
//               {c.name}
//             </div>
//           ))}
//           {filtered.length === 0 && query.trim() && (
//             <div style={{ padding: "9px 13px", fontSize: 12, color: "#aaa" }}>Not found — press Enter to use custom</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    ICONS
// ───────────────────────────────────────────── */
// const IEyeOn  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
// const IEyeOff = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
// const ISpinner = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//     <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
//       <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite"/>
//     </path>
//   </svg>
// );
// const ICheck    = ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
// const IMail     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
// const IClose    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
// const IChevDown = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;

// /* ─────────────────────────────────────────────
//    SUB-PANEL TAB ORDER — used by "Continue" inside Step 2
// ───────────────────────────────────────────── */
// const SUB_PANEL_ORDER = {
//   student:        ["account", "location", "education"],
//   trainer:        ["account", "profile", "reach"],
//   "Tenant Admin": ["account", "business", "goals"],
// };

// /* ─────────────────────────────────────────────
//    MAIN COMPONENT
// ───────────────────────────────────────────── */
// export default function CompleteProfile({
//   onSkip,
//   prefillName      = "",
//   prefillEmail     = "",
//   googleCredential = null,
//   isGoogleUser: isGoogleUserProp = false,
// }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const stored   = (() => { try { return JSON.parse(localStorage.getItem("lms_user") || "{}"); } catch { return {}; } })();
//   const isGoogle = isGoogleUserProp || location.state?.isGoogleUser || false;

//   const resolvedName  = prefillName  || location.state?.name  || stored.name  || "";
//   const resolvedEmail = prefillEmail || location.state?.email || stored.email || "";

//   const [step,     setStep]     = useState(location.state?.preSelectedRole ? 2 : 1);
//   const [role,     setRole]     = useState(location.state?.preSelectedRole || "");
//   const [loading,  setLoading]  = useState(false);
//   const [showPw,   setShowPw]   = useState(false);
//   const [errors,   setErrors]   = useState({});
//   const [subPanel, setSubPanel] = useState("account");

//   const [countryCode,   setCountryCode]   = useState("");
//   const [stateCode,     setStateCode]     = useState("");
//   const [taCountryCode, setTaCountryCode] = useState("");
//   const [taStateCode,   setTaStateCode]   = useState("");

//   const allCountries = Country.getAllCountries();
//   const allStates    = countryCode   ? State.getStatesOfCountry(countryCode)   : [];
//   const allCities    = (countryCode && stateCode)     ? City.getCitiesOfState(countryCode, stateCode)     : [];
//   const taAllStates  = taCountryCode ? State.getStatesOfCountry(taCountryCode) : [];
//   const taAllCities  = (taCountryCode && taStateCode) ? City.getCitiesOfState(taCountryCode, taStateCode) : [];

//   const [fd, setFd] = useState({
//     name: resolvedName,
//     email: resolvedEmail,
//     password: "", confirmPassword: "", mobile: "",
//     dob: "", gender: "", city: "", state: "", country: "",
//     qualification: "", collegeName: "", yearOfPassing: "", currentStatus: "",
//     agreeTerms: false, agreePrivacy: false,
//     linkedin: "", shareExpertise: [], audienceSize: "", fullTimeRole: "", expertise: "", experience: "",
//     businessName: "", businessType: "", industry: "", cityState: "", website: "",
//     companySize: "", yearsExperience: "", aboutBusiness: "", expectedOutcome: "", lookingFor: [],
//     taCity: "", taState: "", taCountry: "",
//   });

//   useEffect(() => {
//     setFd(p => ({
//       ...p,
//       name:  prefillName  || p.name,
//       email: prefillEmail || p.email,
//     }));
//   }, [prefillName, prefillEmail]);

//   // Reset subPanel to "account" whenever role changes
//   useEffect(() => { setSubPanel("account"); }, [role]);

//   const set = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFd(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
//     if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
//   };

//   const handleCountryChange = (e) => {
//     const iso = e.target.value;
//     setCountryCode(iso); setStateCode("");
//     setFd(p => ({ ...p, country: Country.getCountryByCode(iso)?.name || "", state: "", city: "" }));
//     if (errors.country) setErrors(p => ({ ...p, country: "" }));
//   };
//   const handleStateChange = (e) => {
//     const iso = e.target.value;
//     setStateCode(iso);
//     setFd(p => ({ ...p, state: State.getStateByCodeAndCountry(iso, countryCode)?.name || "", city: "" }));
//     if (errors.state) setErrors(p => ({ ...p, state: "" }));
//   };
//   const handleCityChange = (v) => {
//     setFd(p => ({ ...p, city: v }));
//     if (errors.city) setErrors(p => ({ ...p, city: "" }));
//   };
//   const handleTaCountryChange = (e) => {
//     const iso = e.target.value;
//     setTaCountryCode(iso); setTaStateCode("");
//     setFd(p => ({ ...p, taCountry: Country.getCountryByCode(iso)?.name || "", taState: "", taCity: "", cityState: "" }));
//     if (errors.cityState) setErrors(p => ({ ...p, cityState: "" }));
//   };
//   const handleTaStateChange = (e) => {
//     const iso = e.target.value;
//     setTaStateCode(iso);
//     setFd(p => ({ ...p, taState: State.getStateByCodeAndCountry(iso, taCountryCode)?.name || "", taCity: "", cityState: "" }));
//     if (errors.cityState) setErrors(p => ({ ...p, cityState: "" }));
//   };
//   const handleTaCityChange = (v) => {
//     setFd(p => {
//       const combined = [v, p.taState].filter(Boolean).join(", ");
//       return { ...p, taCity: v, cityState: combined };
//     });
//     if (errors.cityState) setErrors(p => ({ ...p, cityState: "" }));
//   };

//   const toggleArr = (key, val) =>
//     setFd(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val] }));

//   /* ── BUG FIX 2: "Continue" inside Step 2 advances sub-panels ── */
//   const validateCurrentSubPanel = () => {
//     const e = {};
//     if (subPanel === "account") {
//       if (!fd.name.trim())  e.name  = "Name is required";
//       if (!fd.email.trim()) e.email = "Email is required";
//       if (!isGoogle && role === "student" && fd.password && fd.password.length < 6) e.password = "Min 6 characters";
//       if (!isGoogle && (role === "trainer" || role === "Tenant Admin") && fd.password && fd.password.length < 11) e.password = "Min 11 characters";
//       if (!fd.mobile) e.mobile = "Required";
//     }
//     if (role === "student" && subPanel === "location") {
//       if (!fd.country) e.country = "Required";
//       if (!fd.state)   e.state   = "Required";
//       if (!fd.city)    e.city    = "Required";
//       if (!fd.dob)     e.dob     = "Required";
//       if (!fd.gender)  e.gender  = "Required";
//     }
//     if (role === "student" && subPanel === "education") {
//       if (!fd.qualification) e.qualification = "Required";
//       if (!fd.collegeName)   e.collegeName   = "Required";
//       if (!fd.yearOfPassing) e.yearOfPassing = "Required";
//       if (!fd.currentStatus) e.currentStatus = "Required";
//     }
//     if (role === "trainer" && subPanel === "profile") {
//       if (!fd.linkedin)   e.linkedin   = "Required";
//       if (!fd.country)    e.country    = "Required";
//       if (!fd.expertise)  e.expertise  = "Required";
//       if (!fd.experience) e.experience = "Required";
//       if (!fd.fullTimeRole) e.fullTimeRole = "Required";
//     }
//     if (role === "trainer" && subPanel === "reach") {
//       if (!fd.audienceSize)         e.audienceSize  = "Required";
//       if (!fd.shareExpertise.length) e.shareExpertise = "Select at least one";
//     }
//     if (role === "Tenant Admin" && subPanel === "business") {
//       if (!fd.businessName)  e.businessName  = "Required";
//       if (!fd.businessType)  e.businessType  = "Required";
//       if (!fd.industry)      e.industry      = "Required";
//       if (!fd.cityState)     e.cityState     = "Required";
//       if (!fd.companySize)   e.companySize   = "Required";
//     }
//     if (role === "Tenant Admin" && subPanel === "goals") {
//       if (!fd.yearsExperience) e.yearsExperience = "Required";
//       if (!fd.lookingFor.length) e.lookingFor    = "Select at least one";
//       if (!fd.aboutBusiness)   e.aboutBusiness   = "Required";
//     }
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const validate2 = () => {
//     const e = {};
//     if (!fd.name.trim())  e.name  = "Name is required";
//     if (!fd.email.trim()) e.email = "Email is required";
//     if (role === "student") {
//       if (!isGoogle && (!fd.password || fd.password.length < 6)) e.password = "Min 6 characters";
//       if (!fd.mobile)        e.mobile        = "Required";
//       if (!fd.dob)           e.dob           = "Required";
//       if (!fd.gender)        e.gender        = "Required";
//       if (!fd.city)          e.city          = "Required";
//       if (!fd.state)         e.state         = "Required";
//       if (!fd.country)       e.country       = "Required";
//       if (!fd.qualification) e.qualification = "Required";
//       if (!fd.collegeName)   e.collegeName   = "Required";
//       if (!fd.yearOfPassing) e.yearOfPassing = "Required";
//       if (!fd.currentStatus) e.currentStatus = "Required";
//     }
//     if (role === "trainer") {
//       if (!isGoogle) {
//         if (!fd.password || fd.password.length < 11) e.password = "Min 11 characters";
//         if (!fd.confirmPassword) e.confirmPassword = "Required";
//         else if (fd.password !== fd.confirmPassword) e.confirmPassword = "Passwords don't match";
//       }
//       if (!fd.mobile)     e.mobile     = "Required";
//       if (!fd.linkedin)   e.linkedin   = "Required";
//       if (!fd.country)    e.country    = "Required";
//       if (!fd.expertise)  e.expertise  = "Required";
//       if (!fd.experience) e.experience = "Required";
//       if (!fd.audienceSize)  e.audienceSize  = "Required";
//       if (!fd.fullTimeRole)  e.fullTimeRole  = "Required";
//       if (!fd.shareExpertise.length) e.shareExpertise = "Select at least one";
//     }
//     if (role === "Tenant Admin") {
//       if (!isGoogle) {
//         if (!fd.password || fd.password.length < 11) e.password = "Min 11 characters";
//         if (!fd.confirmPassword) e.confirmPassword = "Required";
//         else if (fd.password !== fd.confirmPassword) e.confirmPassword = "Passwords don't match";
//       }
//       if (!fd.businessName)    e.businessName    = "Required";
//       if (!fd.mobile)          e.mobile          = "Required";
//       if (!fd.businessType)    e.businessType    = "Required";
//       if (!fd.industry)        e.industry        = "Required";
//       if (!fd.cityState)       e.cityState       = "Required";
//       if (!fd.companySize)     e.companySize     = "Required";
//       if (!fd.yearsExperience) e.yearsExperience = "Required";
//       if (!fd.lookingFor.length) e.lookingFor    = "Select at least one";
//       if (!fd.aboutBusiness)   e.aboutBusiness   = "Required";
//     }
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const validate3 = () => {
//     const e = {};
//     if (!fd.agreeTerms) e.agreeTerms = "You must agree to terms";
//     if (role === "student" && !fd.agreePrivacy) e.agreePrivacy = "You must agree to privacy policy";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   /* ── BUG FIX 2: "Continue" button logic ─────────────────────────────────
//      - In Step 1: validate role, go to Step 2
//      - In Step 2: advance through sub-panels; only go to Step 3 when on LAST sub-panel
//      - In Step 3: handled by Submit button
//   ── */
//   const next = () => {
//     if (step === 1) {
//       if (!role) { setErrors({ role: "Please select a role" }); return; }
//       setStep(2);
//       setSubPanel("account");
//       setErrors({});
//       return;
//     }
//     if (step === 2) {
//       const panels = SUB_PANEL_ORDER[role] || ["account"];
//       const currentIdx = panels.indexOf(subPanel);
//       const isLastPanel = currentIdx === panels.length - 1;

//       // Only do full validate2 on last sub-panel
//       if (isLastPanel) {
//         if (!validate2()) return;
//         setStep(3);
//         setErrors({});
//       } else {
//         // Soft validate current panel, then advance to next tab
//         if (!validateCurrentSubPanel()) return;
//         setSubPanel(panels[currentIdx + 1]);
//         setErrors({});
//       }
//       return;
//     }
//   };

//   const back = () => {
//     if (step === 2) {
//       const panels = SUB_PANEL_ORDER[role] || ["account"];
//       const currentIdx = panels.indexOf(subPanel);
//       if (currentIdx > 0) {
//         setSubPanel(panels[currentIdx - 1]);
//         setErrors({});
//         return;
//       }
//       // At first sub-panel → go back to step 1
//       setStep(1);
//       setErrors({});
//       return;
//     }
//     setStep(s => s - 1);
//     setErrors({});
//   };

//   const handleSkip = () => {
//     if (onSkip) { onSkip(); } else { navigate("/ilm-demo", { replace: true }); }
//   };

//   const handleSubmit = async () => {
//     if (!validate3()) return;
//     setLoading(true);
//     try {
//       await authService.register({
//         name: fd.name, email: fd.email,
//         password: isGoogle ? null : fd.password,
//         role: role === "student" ? "STUDENT" : role === "trainer" ? "TRAINER" : "TENANT_ADMIN",
//         isGoogleUser: isGoogle,
//         googleCredential: isGoogle ? googleCredential : null,
//         ...fd,
//       });
//       localStorage.setItem("role", role.toUpperCase());
//       localStorage.setItem("lms_user", JSON.stringify({ name: fd.name, email: fd.email, role }));
//       alert("✅ Application submitted!\n\nPlease verify your email.");
//       navigate(`/verify-email?email=${encodeURIComponent(fd.email)}`);
//     } catch (err) {
//       const msg = err?.response?.data?.message || err?.response?.data?.error || "Submission failed";
//       alert(msg);
//       if (msg.toLowerCase().includes("verify")) navigate(`/verify-email?email=${encodeURIComponent(fd.email)}`);
//     } finally { setLoading(false); }
//   };

//   const E = (k) => errors[k]
//     ? <span style={{ fontSize: 11, color: "#e74c3c", marginTop: 2 }}>⚠ {errors[k]}</span>
//     : null;

//   const reviewRows = () => {
//     const base = [["Name", fd.name], ["Email", fd.email]];
//     if (role === "student") return [...base,
//       ["Mobile", fd.mobile], ["Date of Birth", fd.dob], ["Gender", fd.gender],
//       ["City", fd.city], ["State", fd.state], ["Country", fd.country],
//       ["Qualification", fd.qualification], ["College", fd.collegeName],
//       ["Year of Passing", fd.yearOfPassing], ["Current Status", fd.currentStatus],
//     ];
//     if (role === "trainer") return [...base,
//       ["Mobile", fd.mobile], ["LinkedIn", fd.linkedin], ["Country", fd.country],
//       ["Expertise", fd.expertise], ["Experience", fd.experience ? fd.experience + " yrs" : "—"],
//       ["Audience Size", fd.audienceSize], ["Full Time?", fd.fullTimeRole],
//       ["Platforms", fd.shareExpertise.join(", ") || "—"],
//     ];
//     if (role === "Tenant Admin") return [...base,
//       ["Business", fd.businessName], ["Mobile", fd.mobile],
//       ["Type", fd.businessType], ["Industry", fd.industry],
//       ["Location", fd.cityState || "—"], ["Company Size", fd.companySize],
//       ["Experience", fd.yearsExperience ? fd.yearsExperience + " yrs" : "—"],
//       ["Looking For", fd.lookingFor.join(", ") || "—"],
//     ];
//     return base;
//   };

//   const subPanelMap = {
//     student:        [{ id: "account", label: "Account" }, { id: "location", label: "Location" }, { id: "education", label: "Education" }],
//     trainer:        [{ id: "account", label: "Account" }, { id: "profile",  label: "Profile"  }, { id: "reach",     label: "Reach"    }],
//     "Tenant Admin": [{ id: "account", label: "Account" }, { id: "business", label: "Business" }, { id: "goals",     label: "Goals"    }],
//   };

//   /* ── Derive button label ── */
//   const panels = role ? (SUB_PANEL_ORDER[role] || ["account"]) : [];
//   const isLastSubPanel = panels.indexOf(subPanel) === panels.length - 1;
//   const continueLabel  = step === 2 && !isLastSubPanel ? "Next →" : "Continue →";

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         .cp-overlay {
//           position: fixed; inset: 0; z-index: 1000;
//           background: rgba(0,0,0,0.45);
//           display: flex; align-items: center; justify-content: center;
//           padding: 16px;
//           font-family: 'Inter', sans-serif;
//         }
//         .cp-modal {
//           width: 100%; max-width: 440px;
//           background: #faf7f4;
//           border-radius: 18px;
//           box-shadow: 0 24px 64px rgba(0,0,0,0.20);
//           display: flex;
//           flex-direction: column;
//           max-height: 92vh;
//           overflow: hidden;
//           animation: cpIn .25s ease both;
//         }
//         @keyframes cpIn {
//           from { opacity: 0; transform: scale(0.96) translateY(10px); }
//           to   { opacity: 1; transform: scale(1)    translateY(0);    }
//         }
//         .cp-hdr {
//           padding: 16px 22px 0;
//           flex-shrink: 0;
//           background: #faf7f4;
//           border-radius: 18px 18px 0 0;
//         }
//         .cp-hdr-top {
//           display: flex; align-items: center;
//           margin-bottom: 12px; width: 100%;
//         }
//         .cp-logo { font-size: 1.3rem; font-weight: 800; letter-spacing: -0.3px; line-height: 1; }
//         .cp-logo-ilm { color: #27ae60; }
//         .cp-logo-ora { color: #e67e22; }
//         .cp-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
//         .cp-skip-btn {
//           background: none; border: none; cursor: pointer;
//           font-family: 'Inter', sans-serif; font-size: 12.5px; color: #888;
//           font-weight: 500; padding: 0; display: flex; align-items: center;
//           gap: 4px; white-space: nowrap; transition: color .18s; margin-right: 6px;
//         }
//         .cp-skip-btn:hover { color: #555; }
//         .cp-close {
//           width: 24px; height: 24px; border-radius: 50%;
//           border: 1.5px solid #ddd8d2; background: #fff; cursor: pointer;
//           display: flex; align-items: center; justify-content: center;
//           color: #999; transition: all .18s; flex-shrink: 0;
//         }
//         .cp-close:hover { background: #f0ece8; color: #444; border-color: #ccc; }
//         .cp-orange-line { height: 3px; background: #e67e22; border-radius: 0; margin: 0 -20px; }
//         .cp-prog { height: 2px; background: #ece7e1; flex-shrink: 0; }
//         .cp-prog-fill { height: 100%; background: #e67e22; transition: width .4s ease; }
//         .cp-body {
//           flex: 1; overflow-y: auto;
//           padding: 22px 22px 10px; background: #faf7f4;
//         }
//         .cp-body::-webkit-scrollbar { width: 4px; }
//         .cp-body::-webkit-scrollbar-thumb { background: #ddd5cb; border-radius: 4px; }
//         .cp-title { font-size: 19px; font-weight: 700; color: #111; margin-bottom: 5px; }
//         .cp-sub   { font-size: 13px; color: #aaa; margin-bottom: 20px; line-height: 1.4; }

//         /* ── ROLE LIST ── */
//         .cp-roles { display: flex; flex-direction: column; gap: 10px; }
//         .cp-role {
//           display: flex; align-items: center; gap: 13px;
//           padding: 13px 15px; border-radius: 12px;
//           border: 1.5px solid #ede8e0; background: #fff;
//           cursor: pointer; transition: all .16s; user-select: none;
//         }
//         .cp-role:hover { border-color: #d5cdc4; background: #fdfaf7; }
//         .cp-role.sel   { border-color: #e67e22; background: #fff; box-shadow: 0 0 0 3px rgba(230,126,34,.10); }
//         .cp-role-ico {
//           width: 40px; height: 40px; border-radius: 10px;
//           display: flex; align-items: center; justify-content: center; flex-shrink: 0;
//         }
//         .cp-role-info { flex: 1; }
//         .cp-role-name { font-size: 14px; font-weight: 700; color: #111; }
//         .cp-role-desc { font-size: 12px; color: #bbb; margin-top: 2px; }
//         .cp-radio {
//           width: 18px; height: 18px; border-radius: 50%;
//           border: 2px solid #d5cdc5; flex-shrink: 0;
//           display: flex; align-items: center; justify-content: center; transition: border-color .16s;
//         }
//         .cp-radio.sel { border-color: #e67e22; }
//         .cp-radio-dot { width: 8px; height: 8px; border-radius: 50%; background: #e67e22; }

//         /* ── TABS ── */
//         .cp-tabs {
//           display: flex; gap: 4px; padding: 3px;
//           background: #ede8e2; border-radius: 9px; margin-bottom: 16px;
//         }
//         .cp-tab {
//           flex: 1; padding: 7px 4px; border: none; background: transparent;
//           border-radius: 7px; font-family: 'Inter', sans-serif;
//           font-size: 12px; font-weight: 600; color: #aaa; cursor: pointer; transition: all .16s;
//         }
//         .cp-tab.act { background: #fff; color: #e67e22; box-shadow: 0 1px 5px rgba(0,0,0,.07); }

//         /* ── FORM ── */
//         .cp-form  { display: flex; flex-direction: column; gap: 11px; }
//         .cp-field { display: flex; flex-direction: column; gap: 4px; }
//         .cp-lbl   { font-size: 11px; font-weight: 600; color: #888; letter-spacing: .04em; text-transform: uppercase; }
//         .cp-input {
//           width: 100%; padding: 9.5px 12px;
//           border: 1.5px solid #e4dfd8; border-radius: 9px;
//           font-family: 'Inter', sans-serif; font-size: 13.5px; color: #111;
//           background: #fff; outline: none; transition: border-color .16s, box-shadow .16s;
//         }
//         .cp-input::placeholder { color: #c5bdb5; }
//         .cp-input:focus { border-color: #e67e22; box-shadow: 0 0 0 3px rgba(230,126,34,.10); background: #fff; }
//         .cp-input:disabled { opacity: .4; cursor: not-allowed; background: #f5f0eb; }
//         .cp-input-err { border-color: #e74c3c !important; box-shadow: 0 0 0 3px rgba(231,76,60,.08) !important; }
//         .cp-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
//         .cp-pw-wrap { position: relative; }
//         .cp-pw-wrap .cp-input { padding-right: 38px; }
//         .cp-eye {
//           position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
//           background: none; border: none; cursor: pointer; color: #bbb; padding: 0;
//           display: flex; align-items: center; transition: color .16s;
//         }
//         .cp-eye:hover { color: #777; }
//         .cp-pw-hint { font-size: 11px; margin-top: 2px; }
//         .cp-pw-hint.ok  { color: #27ae60; }
//         .cp-pw-hint.bad { color: #e74c3c; }
//         .cp-sel-wrap { position: relative; }
//         .cp-sel-wrap select { appearance: none; padding-right: 32px; }
//         .cp-sel-arr {
//           position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
//           pointer-events: none; color: #bbb; display: flex; align-items: center;
//         }

//         /* ── COUNTRY DISPLAY BADGE ── */
//         .cp-country-badge {
//           display: inline-flex; align-items: center; gap: 7px;
//           font-size: 12px; color: #555; font-weight: 600;
//           background: #f5f0eb; border: 1px solid #e4dfd8;
//           border-radius: 7px; padding: 4px 10px; margin-top: 4px;
//         }

//         .cp-note {
//           display: flex; align-items: flex-start; gap: 8px;
//           background: #eff6ff; border: 1px solid #bfdbfe;
//           border-radius: 8px; padding: 9px 12px;
//           font-size: 12px; color: #1e40af; line-height: 1.5; margin-bottom: 2px;
//         }
//         .cp-ck-lbl {
//           display: flex; align-items: center; gap: 8px;
//           padding: 9px 12px; border: 1.5px solid #e4dfd8;
//           border-radius: 8px; cursor: pointer; font-size: 13px;
//           color: #333; font-weight: 500; transition: all .16s; background: #fff;
//         }
//         .cp-ck-lbl:hover { border-color: #d5cdc4; background: #fdfaf7; }
//         .cp-ck-lbl input { width: 13px; height: 13px; accent-color: #e67e22; flex-shrink: 0; }
//         .cp-ck-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 4px; }
//         .cp-rad-lbl {
//           display: flex; align-items: center; gap: 8px;
//           padding: 9px 12px; border: 1.5px solid #e4dfd8;
//           border-radius: 8px; cursor: pointer; font-size: 13px;
//           color: #333; font-weight: 500; transition: all .16s; background: #fff;
//         }
//         .cp-rad-lbl:hover { border-color: #d5cdc4; }
//         .cp-rad-lbl input { width: 13px; height: 13px; accent-color: #e67e22; }

//         /* ── GOOGLE PREFILL BADGE ── */
//         .cp-google-badge {
//           display: inline-flex; align-items: center; gap: 6px;
//           font-size: 11px; color: #1e40af; font-weight: 600;
//           background: #eff6ff; border: 1px solid #bfdbfe;
//           border-radius: 6px; padding: 2px 8px; margin-top: 3px;
//         }

//         /* ── REVIEW ── */
//         .cp-rev-badge {
//           display: inline-flex; align-items: center; gap: 6px;
//           background: #fff7ed; border: 1px solid #fed7aa;
//           border-radius: 20px; padding: 4px 12px;
//           font-size: 12px; font-weight: 700; color: #c2410c; margin-bottom: 12px;
//         }
//         .cp-rev-table {
//           border: 1px solid #ede8e2; border-radius: 10px;
//           overflow: hidden; margin-bottom: 14px; background: #fff;
//         }
//         .cp-rev-row {
//           display: flex; justify-content: space-between; align-items: center;
//           padding: 8px 12px; border-bottom: 1px solid #f5f2ef;
//         }
//         .cp-rev-row:last-child { border-bottom: none; }
//         .cp-rev-k { font-size: 11.5px; font-weight: 500; color: #aaa; flex-shrink: 0; }
//         .cp-rev-v { font-size: 12.5px; font-weight: 600; color: #111; text-align: right; max-width: 60%; word-break: break-all; }
//         .cp-rev-note {
//           display: flex; align-items: flex-start; gap: 6px;
//           font-size: 11.5px; color: #999; line-height: 1.5; margin-top: 8px;
//         }

//         /* ── FOOTER ── */
//         .cp-foot {
//           display: flex; align-items: center; justify-content: space-between;
//           padding: 14px 22px; border-top: 1px solid #ece7e0;
//           background: #faf7f4; flex-shrink: 0;
//           border-radius: 0 0 18px 18px;
//         }
//         .cp-step-lbl { font-size: 12px; color: #bbb; font-weight: 500; }
//         .cp-foot-r { display: flex; gap: 8px; align-items: center; }
//         .cp-btn-back {
//           padding: 9px 16px; background: #fff;
//           border: 1.5px solid #e4dfd8; border-radius: 9px;
//           font-family: 'Inter', sans-serif; font-size: 13px;
//           font-weight: 600; color: #888; cursor: pointer; transition: all .16s;
//         }
//         .cp-btn-back:hover { background: #f5f0eb; }
//         .cp-btn-next {
//           padding: 10px 24px; background: #e67e22; border: none;
//           border-radius: 10px; font-family: 'Inter', sans-serif;
//           font-size: 13px; font-weight: 700; color: #fff; cursor: pointer;
//           box-shadow: 0 2px 10px rgba(230,126,34,.30);
//           transition: opacity .16s, transform .12s;
//           display: flex; align-items: center; gap: 5px;
//         }
//         .cp-btn-next:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
//         .cp-btn-next:disabled { opacity: .35; cursor: not-allowed; transform: none; }
//         .cp-btn-sub {
//           padding: 10px 22px; background: #27ae60; border: none;
//           border-radius: 10px; font-family: 'Inter', sans-serif;
//           font-size: 13px; font-weight: 700; color: #fff; cursor: pointer;
//           box-shadow: 0 2px 10px rgba(39,174,96,.28);
//           transition: opacity .16s;
//           display: flex; align-items: center; gap: 5px;
//         }
//         .cp-btn-sub:hover:not(:disabled) { opacity: .88; }
//         .cp-btn-sub:disabled { opacity: .40; cursor: not-allowed; }
//         .cp-err-g { font-size: 11px; color: #e74c3c; margin-top: 6px; }

//         @media (max-width: 500px) {
//           .cp-row2    { grid-template-columns: 1fr; }
//           .cp-ck-grid { grid-template-columns: 1fr; }
//           .cp-modal   { border-radius: 14px; max-height: 96vh; }
//         }
//       `}</style>

//       <div className="cp-overlay">
//         <div className="cp-modal">

//           {/* ── Header ── */}
//           <div className="cp-hdr">
//             <div className="cp-hdr-top">
//               <div className="cp-logo">
//                 <span className="cp-logo-ilm">ILM</span>
//                 <span className="cp-logo-ora">ORA</span>
//               </div>
//               <div className="cp-hdr-right">
//                 <button className="cp-skip-btn" onClick={handleSkip}>Skip for now →</button>
//                 <button className="cp-close" onClick={handleSkip} aria-label="Close"><IClose/></button>
//               </div>
//             </div>
//             <div className="cp-orange-line"/>
//           </div>

//           {/* Progress bar */}
//           <div className="cp-prog">
//             <div className="cp-prog-fill" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}/>
//           </div>

//           {/* ── Body ── */}
//           <div className="cp-body">

//             {/* ════ STEP 1 ════ */}
//             {step === 1 && (
//               <>
//                 <div className="cp-title">What's your role?</div>
//                 <div className="cp-sub">Select how you'll use ILM ORA to personalise your experience</div>
//                 <div className="cp-roles">
//                   {ROLES.map(r => (
//                     <div
//                       key={r.value}
//                       className={`cp-role ${role === r.value ? "sel" : ""}`}
//                       onClick={() => { setRole(r.value); setErrors({}); }}
//                     >
//                       <div className="cp-role-ico" style={{ background: r.bg }}>{r.icon}</div>
//                       <div className="cp-role-info">
//                         <div className="cp-role-name">{r.label}</div>
//                         <div className="cp-role-desc">{r.desc}</div>
//                       </div>
//                       <div className={`cp-radio ${role === r.value ? "sel" : ""}`}>
//                         {role === r.value && <div className="cp-radio-dot"/>}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 {errors.role && <p className="cp-err-g">⚠ {errors.role}</p>}
//               </>
//             )}

//             {/* ════ STEP 2 ════ */}
//             {step === 2 && (
//               <>
//                 <div className="cp-title">
//                   {role === "student" ? "Student Details" : role === "trainer" ? "Trainer Details" : "Admin Details"}
//                 </div>
//                 <div className="cp-sub">Fill in your information carefully</div>

//                 {isGoogle && (
//                   <div className="cp-note">
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
//                     Signed in with Google — your name & email are pre-filled. Set a password to also log in via email.
//                   </div>
//                 )}

//                 <div className="cp-tabs">
//                   {(subPanelMap[role] || []).map(sp => (
//                     <button key={sp.id} className={`cp-tab ${subPanel === sp.id ? "act" : ""}`} onClick={() => setSubPanel(sp.id)}>
//                       {sp.label}
//                     </button>
//                   ))}
//                 </div>

//                 <div className="cp-form">

//                   {/* ── Account Tab ── */}
//                   {subPanel === "account" && <>
//                     <div className="cp-row2">
//                       <div className="cp-field">
//                         <label className="cp-lbl">Full Name *</label>
//                         <input className="cp-input" type="text" name="name" value={fd.name} onChange={set} placeholder="Your full name"/>
//                         {E("name")}
//                       </div>
//                       <div className="cp-field">
//                         <label className="cp-lbl">Email *</label>
//                         <input
//                           className={`cp-input${errors.email ? " cp-input-err" : ""}`}
//                           type="email" name="email" value={fd.email} onChange={set}
//                           placeholder="your@email.com"
//                           disabled={isGoogle && !!fd.email}
//                         />
//                         {isGoogle && fd.email && (
//                           <span className="cp-google-badge">
//                             <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
//                             Verified via Google
//                           </span>
//                         )}
//                         {E("email")}
//                       </div>
//                     </div>

//                     <div className="cp-field">
//                       <label className="cp-lbl">
//                         Password {isGoogle ? <span style={{ fontWeight: 400, textTransform: "none", fontSize: 10, color: "#bbb" }}>(optional)</span> : "*"}
//                       </label>
//                       <div className="cp-pw-wrap">
//                         <input className="cp-input" type={showPw ? "text" : "password"}
//                           name="password" value={fd.password} onChange={set}
//                           placeholder={role === "student" ? "Min 6 characters" : "Min 11 characters"}/>
//                         <button type="button" className="cp-eye" onClick={() => setShowPw(p => !p)} tabIndex={-1}>
//                           {showPw ? <IEyeOff/> : <IEyeOn/>}
//                         </button>
//                       </div>
//                       {fd.password && (() => {
//                         const min = role === "student" ? 6 : 11;
//                         return <span className={`cp-pw-hint ${fd.password.length >= min ? "ok" : "bad"}`}>
//                           {fd.password.length >= min ? "✓ Strong enough" : `⚠ Min ${min} chars (${fd.password.length}/${min})`}
//                         </span>;
//                       })()}
//                       {E("password")}
//                     </div>

//                     {(role === "trainer" || role === "Tenant Admin") && (
//                       <div className="cp-field">
//                         <label className="cp-lbl">Confirm Password {isGoogle ? "" : "*"}</label>
//                         <input className="cp-input" type="password" name="confirmPassword" value={fd.confirmPassword} onChange={set} placeholder="Re-enter password"/>
//                         {fd.confirmPassword && fd.password !== fd.confirmPassword && <span className="cp-pw-hint bad">❌ Passwords don't match</span>}
//                         {E("confirmPassword")}
//                       </div>
//                     )}

//                     <div className="cp-field">
//                       <label className="cp-lbl">Mobile *</label>
//                       <input className="cp-input" type="tel" name="mobile" value={fd.mobile} onChange={set} placeholder="+91 9876543210"/>
//                       {E("mobile")}
//                     </div>
//                   </>}

//                   {/* ── Student: Location Tab ── */}
//                   {role === "student" && subPanel === "location" && <>
//                     <div className="cp-row2">
//                       <div className="cp-field">
//                         <label className="cp-lbl">Date of Birth *</label>
//                         <input className="cp-input" type="date" name="dob" value={fd.dob} onChange={set}/>
//                         {E("dob")}
//                       </div>
//                       <div className="cp-field">
//                         <label className="cp-lbl">Gender *</label>
//                         <div className="cp-sel-wrap">
//                           <select className="cp-input" name="gender" value={fd.gender} onChange={set}>
//                             <option value="">Select</option>
//                             {["Male","Female","Non-binary","Prefer not to say","Other"].map(o => <option key={o}>{o}</option>)}
//                           </select>
//                           <span className="cp-sel-arr"><IChevDown/></span>
//                         </div>
//                         {E("gender")}
//                       </div>
//                     </div>

//                     {/* ── BUG FIX 1: Country with real flag image ── */}
//                     <div className="cp-field">
//                       <label className="cp-lbl">Country *</label>
//                       <div className="cp-sel-wrap">
//                         <select className={`cp-input${errors.country ? " cp-input-err" : ""}`} value={countryCode} onChange={handleCountryChange}>
//                           <option value="">— Select Country —</option>
//                           {allCountries.map(c => (
//                             <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
//                           ))}
//                         </select>
//                         <span className="cp-sel-arr"><IChevDown/></span>
//                       </div>
//                       {countryCode && (
//                         <div className="cp-country-badge">
//                           <CountryFlag isoCode={countryCode} size={18}/>
//                           <span>{fd.country}</span>
//                         </div>
//                       )}
//                       {E("country")}
//                     </div>

//                     <div className="cp-field">
//                       <label className="cp-lbl">State *</label>
//                       <div className="cp-sel-wrap">
//                         <select className={`cp-input${errors.state ? " cp-input-err" : ""}`} value={stateCode} onChange={handleStateChange} disabled={!countryCode}>
//                           <option value="">{countryCode ? "— Select State —" : "— Select Country first —"}</option>
//                           {allStates.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
//                         </select>
//                         <span className="cp-sel-arr"><IChevDown/></span>
//                       </div>
//                       {E("state")}
//                     </div>

//                     <div className="cp-field">
//                       <label className="cp-lbl">City *</label>
//                       <CitySearchDropdown value={fd.city} onChange={handleCityChange} cities={allCities} disabled={!stateCode} error={!!errors.city}/>
//                       {E("city")}
//                     </div>
//                   </>}

//                   {/* ── Student: Education Tab ── */}
//                   {role === "student" && subPanel === "education" && <>
//                     <div className="cp-field">
//                       <label className="cp-lbl">Highest Qualification *</label>
//                       <div className="cp-sel-wrap">
//                         <select className="cp-input" name="qualification" value={fd.qualification} onChange={set}>
//                           <option value="">Select</option>
//                           {["10th","12th","Diploma","Graduation","Post-Graduation","MBA","PhD","Other"].map(o => <option key={o}>{o}</option>)}
//                         </select>
//                         <span className="cp-sel-arr"><IChevDown/></span>
//                       </div>
//                       {E("qualification")}
//                     </div>
//                     <div className="cp-row2">
//                       <div className="cp-field">
//                         <label className="cp-lbl">College *</label>
//                         <input className="cp-input" type="text" name="collegeName" value={fd.collegeName} onChange={set} placeholder="Institution name"/>
//                         {E("collegeName")}
//                       </div>
//                       <div className="cp-field">
//                         <label className="cp-lbl">Year of Passing *</label>
//                         <input className="cp-input" type="number" name="yearOfPassing" value={fd.yearOfPassing} onChange={set} placeholder="2024" min="1950" max="2030"/>
//                         {E("yearOfPassing")}
//                       </div>
//                     </div>
//                     <div className="cp-field">
//                       <label className="cp-lbl">Current Status *</label>
//                       <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 2 }}>
//                         {["Student","Working Professional","Fresher","Career Break","Entrepreneur"].map(s => (
//                           <label key={s} className="cp-rad-lbl">
//                             <input type="radio" name="currentStatus" value={s} checked={fd.currentStatus === s} onChange={set}/>{s}
//                           </label>
//                         ))}
//                       </div>
//                       {E("currentStatus")}
//                     </div>
//                   </>}

//                   {/* ── Trainer: Profile Tab ── */}
//                   {role === "trainer" && subPanel === "profile" && <>
//                     <div className="cp-field">
//                       <label className="cp-lbl">LinkedIn Profile *</label>
//                       <input className="cp-input" type="url" name="linkedin" value={fd.linkedin} onChange={set} placeholder="https://linkedin.com/in/..."/>
//                       {E("linkedin")}
//                     </div>

//                     {/* ── BUG FIX 1: Country with real flag ── */}
//                     <div className="cp-field">
//                       <label className="cp-lbl">Country *</label>
//                       <div className="cp-sel-wrap">
//                         <select className={`cp-input${errors.country ? " cp-input-err" : ""}`} value={countryCode} onChange={handleCountryChange}>
//                           <option value="">— Select Country —</option>
//                           {allCountries.map(c => (
//                             <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
//                           ))}
//                         </select>
//                         <span className="cp-sel-arr"><IChevDown/></span>
//                       </div>
//                       {countryCode && (
//                         <div className="cp-country-badge">
//                           <CountryFlag isoCode={countryCode} size={18}/>
//                           <span>{fd.country}</span>
//                         </div>
//                       )}
//                       {E("country")}
//                     </div>

//                     <div className="cp-row2">
//                       <div className="cp-field">
//                         <label className="cp-lbl">Full Time? *</label>
//                         <div className="cp-sel-wrap">
//                           <select className="cp-input" name="fullTimeRole" value={fd.fullTimeRole} onChange={set}>
//                             <option value="">Select</option>
//                             <option>Yes</option><option>No</option><option>Part-time</option>
//                           </select>
//                           <span className="cp-sel-arr"><IChevDown/></span>
//                         </div>
//                         {E("fullTimeRole")}
//                       </div>
//                       <div className="cp-field">
//                         <label className="cp-lbl">Experience (yrs) *</label>
//                         <EnhancedSelect
//                           name="experience"
//                           label="experience"
//                           value={fd.experience}
//                           onChange={set}
//                           options={EXPERIENCE_OPTIONS}
//                           placeholder="Select years"
//                           error={!!errors.experience}
//                         />
//                         {E("experience")}
//                       </div>
//                     </div>

//                     <div className="cp-field">
//                       <label className="cp-lbl">Expertise *</label>
//                       <EnhancedSelect
//                         name="expertise"
//                         label="expertise"
//                         value={fd.expertise}
//                         onChange={set}
//                         options={EXPERTISE_OPTIONS}
//                         placeholder="Select or add expertise"
//                         error={!!errors.expertise}
//                       />
//                       {E("expertise")}
//                     </div>
//                   </>}

//                   {/* ── Trainer: Reach Tab ── */}
//                   {role === "trainer" && subPanel === "reach" && <>
//                     <div className="cp-field">
//                       <label className="cp-lbl">Audience Size *</label>
//                       <EnhancedSelect
//                         name="audienceSize"
//                         label="audience size"
//                         value={fd.audienceSize}
//                         onChange={set}
//                         options={AUDIENCE_SIZE_OPTIONS}
//                         placeholder="Select range"
//                         error={!!errors.audienceSize}
//                       />
//                       {E("audienceSize")}
//                     </div>
//                     <div className="cp-field">
//                       <label className="cp-lbl">Where do you share expertise? *</label>
//                       <div className="cp-ck-grid">
//                         {["Blog","Newsletter","YouTube","Podcast","Social Media","Online courses","Webinars","Books / Writing"].map(item => (
//                           <label key={item} className="cp-ck-lbl">
//                             <input type="checkbox" checked={fd.shareExpertise.includes(item)} onChange={() => toggleArr("shareExpertise", item)}/>{item}
//                           </label>
//                         ))}
//                       </div>
//                       {E("shareExpertise")}
//                     </div>
//                   </>}

//                   {/* ── Tenant Admin: Business Tab ── */}
//                   {role === "Tenant Admin" && subPanel === "business" && <>
//                     <div className="cp-field">
//                       <label className="cp-lbl">Business / Company Name *</label>
//                       <input className="cp-input" type="text" name="businessName" value={fd.businessName} onChange={set} placeholder="Your company"/>
//                       {E("businessName")}
//                     </div>

//                     {/* ── BUG FIX 1: Country with real flag for TA ── */}
//                     <div className="cp-field">
//                       <label className="cp-lbl">Country *</label>
//                       <div className="cp-sel-wrap">
//                         <select className="cp-input" value={taCountryCode} onChange={handleTaCountryChange}>
//                           <option value="">— Select Country —</option>
//                           {allCountries.map(c => (
//                             <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
//                           ))}
//                         </select>
//                         <span className="cp-sel-arr"><IChevDown/></span>
//                       </div>
//                       {taCountryCode && (
//                         <div className="cp-country-badge">
//                           <CountryFlag isoCode={taCountryCode} size={18}/>
//                           <span>{fd.taCountry}</span>
//                         </div>
//                       )}
//                     </div>

//                     <div className="cp-field">
//                       <label className="cp-lbl">State</label>
//                       <div className="cp-sel-wrap">
//                         <select className="cp-input" value={taStateCode} onChange={handleTaStateChange} disabled={!taCountryCode}>
//                           <option value="">{taCountryCode ? "— Select State —" : "— Select Country first —"}</option>
//                           {taAllStates.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
//                         </select>
//                         <span className="cp-sel-arr"><IChevDown/></span>
//                       </div>
//                     </div>

//                     <div className="cp-field">
//                       <label className="cp-lbl">City *</label>
//                       <CitySearchDropdown value={fd.taCity} onChange={handleTaCityChange} cities={taAllCities} disabled={!taStateCode} error={!!errors.cityState}/>
//                       {fd.cityState && (
//                         <span style={{ fontSize: 11, color: "#e67e22", marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
//                           <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
//                           {fd.cityState}
//                         </span>
//                       )}
//                       {E("cityState")}
//                     </div>

//                     <div className="cp-row2">
//                       <div className="cp-field">
//                         <label className="cp-lbl">Business Type *</label>
//                         <EnhancedSelect
//                           name="businessType"
//                           label="business type"
//                           value={fd.businessType}
//                           onChange={set}
//                           options={BUSINESS_TYPE_OPTIONS}
//                           placeholder="Select"
//                           error={!!errors.businessType}
//                         />
//                         {E("businessType")}
//                       </div>
//                       <div className="cp-field">
//                         <label className="cp-lbl">Industry *</label>
//                         <EnhancedSelect
//                           name="industry"
//                           label="industry"
//                           value={fd.industry}
//                           onChange={set}
//                           options={INDUSTRY_OPTIONS}
//                           placeholder="Select"
//                           error={!!errors.industry}
//                         />
//                         {E("industry")}
//                       </div>
//                     </div>

//                     <div className="cp-row2">
//                       <div className="cp-field">
//                         <label className="cp-lbl">Company Size *</label>
//                         <EnhancedSelect
//                           name="companySize"
//                           label="company size"
//                           value={fd.companySize}
//                           onChange={set}
//                           options={COMPANY_SIZE_OPTIONS}
//                           placeholder="Select"
//                           error={!!errors.companySize}
//                         />
//                         {E("companySize")}
//                       </div>
//                       <div className="cp-field">
//                         <label className="cp-lbl">Website <span style={{ fontWeight: 400, textTransform: "none", fontSize: 10, color: "#bbb" }}>(optional)</span></label>
//                         <input className="cp-input" type="url" name="website" value={fd.website} onChange={set} placeholder="https://yourcompany.com"/>
//                       </div>
//                     </div>
//                   </>}

//                   {/* ── Tenant Admin: Goals Tab ── */}
//                   {role === "Tenant Admin" && subPanel === "goals" && <>
//                     <div className="cp-field">
//                       <label className="cp-lbl">Years of Experience *</label>
//                       <EnhancedSelect
//                         name="yearsExperience"
//                         label="years of experience"
//                         value={fd.yearsExperience}
//                         onChange={set}
//                         options={YEARS_EXPERIENCE_OPTIONS}
//                         placeholder="Select years"
//                         error={!!errors.yearsExperience}
//                       />
//                       {E("yearsExperience")}
//                     </div>

//                     <div className="cp-field">
//                       <label className="cp-lbl">What are you looking for? *</label>
//                       <div className="cp-ck-grid">
//                         {["Trainers","Students","Courses","Corporate Training","Certifications","Mentorship","Workshops","Assessments"].map(item => (
//                           <label key={item} className="cp-ck-lbl">
//                             <input type="checkbox" checked={fd.lookingFor.includes(item)} onChange={() => toggleArr("lookingFor", item)}/>{item}
//                           </label>
//                         ))}
//                       </div>
//                       {E("lookingFor")}
//                     </div>

//                     <div className="cp-field">
//                       <label className="cp-lbl">About Business *</label>
//                       <textarea className="cp-input" name="aboutBusiness" value={fd.aboutBusiness} onChange={set} placeholder="Short description…" rows={3} style={{ resize: "none" }}/>
//                       {E("aboutBusiness")}
//                     </div>

//                     <div className="cp-field">
//                       <label className="cp-lbl">Expected Outcome <span style={{ fontWeight: 400, textTransform: "none", fontSize: 10, color: "#bbb" }}>(optional)</span></label>
//                       <textarea className="cp-input" name="expectedOutcome" value={fd.expectedOutcome} onChange={set} placeholder="What do you expect to achieve?" rows={2} style={{ resize: "none" }}/>
//                     </div>
//                   </>}

//                 </div>
//               </>
//             )}

//             {/* ════ STEP 3 ════ */}
//             {step === 3 && (
//               <>
//                 <div className="cp-title">Review & Submit</div>
//                 <div className="cp-sub">Confirm your application details</div>
//                 <div className="cp-rev-badge">
//                   {ROLES.find(r => r.value === role)?.icon}
//                   {ROLES.find(r => r.value === role)?.label}
//                 </div>
//                 <div className="cp-rev-table">
//                   {reviewRows().map(([k, v]) => (
//                     <div className="cp-rev-row" key={k}>
//                       <span className="cp-rev-k">{k}</span>
//                       <span className="cp-rev-v">{v || "—"}</span>
//                     </div>
//                   ))}
//                 </div>
//                 <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
//                   <label className="cp-ck-lbl">
//                     <input type="checkbox" name="agreeTerms" checked={fd.agreeTerms} onChange={set}/>
//                     I agree to the <span style={{ color: "#e67e22", textDecoration: "underline", marginLeft: 4 }}>Terms & Conditions</span>
//                   </label>
//                   {E("agreeTerms")}
//                   {role === "student" && <>
//                     <label className="cp-ck-lbl">
//                       <input type="checkbox" name="agreePrivacy" checked={fd.agreePrivacy} onChange={set}/>
//                       I agree to the <span style={{ color: "#e67e22", textDecoration: "underline", marginLeft: 4 }}>Privacy Policy</span>
//                     </label>
//                     {E("agreePrivacy")}
//                   </>}
//                 </div>
//                 <div className="cp-rev-note" style={{ marginTop: 12 }}>
//                   <IMail/>
//                   After submission, verify your email. Admin will approve your account within 24 hours.
//                 </div>
//               </>
//             )}

//           </div>{/* /cp-body */}

//           {/* ── Footer ── */}
//           <div className="cp-foot">
//             <span className="cp-step-lbl">Step {step} of {TOTAL_STEPS}</span>
//             <div className="cp-foot-r">
//               {/* Show Back on step 2+ */}
//               {(step > 1) && (
//                 <button className="cp-btn-back" onClick={back}>← Back</button>
//               )}
//               {/* Show Continue on steps 1 and 2 */}
//               {step < 3 && (
//                 <button
//                   className="cp-btn-next"
//                   onClick={next}
//                   disabled={step === 1 && !role}
//                 >
//                   {continueLabel}
//                 </button>
//               )}
//               {/* Show Submit only on step 3 */}
//               {step === 3 && (
//                 <button className="cp-btn-sub" onClick={handleSubmit} disabled={loading}>
//                   {loading ? <><ISpinner/> Submitting…</> : <><ICheck s={14}/> Submit</>}
//                 </button>
//               )}
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";

const TOTAL_STEPS = 3;

const ROLES = [
  {
    value: "student",
    label: "Student",
    desc: "Learn & grow with 300+ courses",
    color: "#27ae60",
    bg: "rgba(39,174,96,0.10)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    value: "trainer",
    label: "Trainer",
    desc: "Teach & inspire thousands of learners",
    color: "#e67e22",
    bg: "rgba(230,126,34,0.10)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e67e22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="12" rx="3"/>
        <path d="M19 10a7 7 0 0 1-14 0"/>
        <line x1="12" y1="19" x2="12" y2="22"/>
        <line x1="8" y1="22" x2="16" y2="22"/>
      </svg>
    ),
  },
  {
    value: "Tenant Admin",
    label: "Tenant Admin",
    desc: "Scale your team with structured learning",
    color: "#8e44ad",
    bg: "rgba(142,68,173,0.10)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8e44ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
];

const EXPERTISE_OPTIONS = [
  "Product Design","UI/UX Design","Product Management","Software Engineering",
  "Data Science","Machine Learning","Digital Marketing","Content Strategy",
  "Business Analytics","DevOps & Cloud","Cybersecurity","Mobile Development",
  "Blockchain","Finance & Accounting","HR & People Ops","Sales & Growth",
];

const EXPERIENCE_OPTIONS = [
  "Less than 1","1","2","3","4","5","6","7","8","9","10",
  "11","12","13","14","15","16-20","20+",
];

const BUSINESS_TYPE_OPTIONS = [
  "Startup","SME","Enterprise","Individual / Freelancer",
  "Non-Profit / NGO","Government / Public Sector","Educational Institution",
  "Agency / Consultancy","Joint Venture","Partnership Firm",
  "Limited Liability Company (LLC)","Other",
];

const INDUSTRY_OPTIONS = [
  "IT & Software","Education & EdTech","Finance & Banking","Retail & E-Commerce",
  "Healthcare & MedTech","Manufacturing","Media & Entertainment",
  "Logistics & Supply Chain","Real Estate","Legal & Compliance",
  "Agriculture & Food","Travel & Hospitality","Energy & Utilities","Other",
];

const COMPANY_SIZE_OPTIONS = [
  "1 (Solo)","2-10","11-50","51-200","201-500","501-1000",
  "1001-5000","5000+",
];

const YEARS_EXPERIENCE_OPTIONS = [
  "Less than 1","1","2","3","4","5","6","7","8","9","10",
  "11","12","13","14","15","15-20","20+",
];

const AUDIENCE_SIZE_OPTIONS = [
  "0-100","100-500","500-1,000","1,000-2,000","2,000-5,000",
  "5,000-10,000","10,000-50,000","50,000-100,000","100,000+",
];

const SUB_PANEL_ORDER = {
  student:        ["account", "location", "education"],
  trainer:        ["account", "profile", "reach"],
  "Tenant Admin": ["account", "business", "goals"],
};

function EnhancedSelect({ value, onChange, options, placeholder = "Select", error, name, label }) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customVal, setCustomVal] = useState("");
  const [localOptions, setLocalOptions] = useState(options);

  const handleChange = (e) => {
    const v = e.target.value;
    if (v === "__add_custom__") {
      setShowCustomInput(true);
    } else {
      onChange({ target: { name, value: v } });
    }
  };

  const handleAddCustom = () => {
    const trimmed = customVal.trim();
    if (!trimmed) return;
    if (!localOptions.includes(trimmed)) setLocalOptions(prev => [...prev, trimmed]);
    onChange({ target: { name, value: trimmed } });
    setCustomVal("");
    setShowCustomInput(false);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <div className="cp-sel-wrap" style={{ flex: 1 }}>
          <select
            className={`cp-input${error ? " cp-input-err" : ""}`}
            value={value}
            onChange={handleChange}
            name={name}
          >
            <option value="">{placeholder}</option>
            {localOptions.map(o => <option key={o} value={o}>{o}</option>)}
            <option value="__add_custom__">＋ Add custom…</option>
          </select>
          <span className="cp-sel-arr"><IChevDown /></span>
        </div>
        <button
          type="button"
          onClick={() => setShowCustomInput(v => !v)}
          title="Add custom value"
          style={{
            width: 32, height: 36, flexShrink: 0,
            background: "#fff", border: "1.5px solid #e4dfd8",
            borderRadius: 8, cursor: "pointer", color: "#e67e22",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, transition: "all .16s",
          }}
        >＋</button>
      </div>
      {showCustomInput && (
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <input
            className="cp-input"
            type="text"
            value={customVal}
            onChange={e => setCustomVal(e.target.value)}
            placeholder={`Type custom ${label || "value"}…`}
            onKeyDown={e => { if (e.key === "Enter") handleAddCustom(); if (e.key === "Escape") setShowCustomInput(false); }}
            autoFocus
            style={{ flex: 1 }}
          />
          <button type="button" onClick={handleAddCustom} style={{ padding: "0 14px", background: "#e67e22", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13 }}>Add</button>
          <button type="button" onClick={() => setShowCustomInput(false)} style={{ padding: "0 10px", background: "#f5f0eb", border: "1.5px solid #e4dfd8", borderRadius: 8, color: "#888", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13 }}>✕</button>
        </div>
      )}
    </div>
  );
}

function CountryFlag({ isoCode, size = 20 }) {
  if (!isoCode || isoCode.length !== 2) return null;
  const cp1 = (0x1F1E6 - 65 + isoCode.toUpperCase().charCodeAt(0)).toString(16);
  const cp2 = (0x1F1E6 - 65 + isoCode.toUpperCase().charCodeAt(1)).toString(16);
  const src = `https://cdn.jsdelivr.net/npm/twemoji@14.0.2/assets/svg/${cp1}-${cp2}.svg`;
  return (
    <img src={src} alt={isoCode} width={size} height={size}
      style={{ display: "inline-block", verticalAlign: "middle", borderRadius: 3, objectFit: "cover" }}
      onError={e => { e.target.style.display = "none"; }}
    />
  );
}

function CitySearchDropdown({ value, onChange, cities, disabled, error }) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState(value || "");
  const wrapRef           = useRef(null);

  useEffect(() => { setQuery(value || ""); }, [value]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        if (query.trim() && query !== value) onChange(query.trim());
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [query, value, onChange]);

  const filtered   = cities.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 80);
  const exactMatch = cities.some(c => c.name.toLowerCase() === query.trim().toLowerCase());

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <input
        className={`cp-input${error ? " cp-input-err" : ""}`}
        type="text"
        value={query}
        onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
        onFocus={() => !disabled && setOpen(true)}
        onKeyDown={e => {
          if (e.key === "Enter" && query.trim()) { onChange(query.trim()); setOpen(false); }
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder={disabled ? "Select State first" : cities.length === 0 ? "Type city name…" : "Search or type city…"}
        disabled={disabled}
        autoComplete="off"
      />
      {open && !disabled && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1px solid #e2d9d0", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 9999, maxHeight: 200, overflowY: "auto" }}>
          {query.trim() && !exactMatch && (
            <div onClick={() => { setQuery(query.trim()); onChange(query.trim()); setOpen(false); }}
              style={{ padding: "9px 13px", fontSize: 13, fontWeight: 600, color: "#e67e22", cursor: "pointer", borderBottom: "1px solid #f5ece1", background: "#fffaf5" }}>
              + Use "{query.trim()}"
            </div>
          )}
          {filtered.map((c, i) => (
            <div key={`${c.name}-${i}`}
              onClick={() => { setQuery(c.name); onChange(c.name); setOpen(false); }}
              style={{ padding: "8px 13px", fontSize: 13, cursor: "pointer", color: c.name === value ? "#e67e22" : "#333", fontWeight: c.name === value ? 600 : 400, background: c.name === value ? "#fffaf5" : "transparent", borderBottom: "1px solid #f5f5f5" }}
              onMouseEnter={e => e.currentTarget.style.background = "#fffaf5"}
              onMouseLeave={e => e.currentTarget.style.background = c.name === value ? "#fffaf5" : "transparent"}
            >{c.name}</div>
          ))}
          {filtered.length === 0 && query.trim() && (
            <div style={{ padding: "9px 13px", fontSize: 12, color: "#aaa" }}>Not found — press Enter to use custom</div>
          )}
        </div>
      )}
    </div>
  );
}

const IEyeOn  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IEyeOff = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const ISpinner = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite"/>
    </path>
  </svg>
);
const ICheck    = ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IMail     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IClose    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IChevDown = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;

export default function CompleteProfile({
  onSkip,
  prefillName      = "",
  prefillEmail     = "",
  googleCredential = null,
  isGoogleUser: isGoogleUserProp = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const stored   = (() => { try { return JSON.parse(localStorage.getItem("lms_user") || "{}"); } catch { return {}; } })();
  const isGoogle = isGoogleUserProp || location.state?.isGoogleUser || false;

  const resolvedName  = prefillName  || location.state?.name  || stored.name  || "";
  const resolvedEmail = prefillEmail || location.state?.email || stored.email || "";

  // ── ONLY CHANGE: dynamic import of country-state-city ──
  const [csc, setCsc] = useState(null);
  useEffect(() => {
    import("country-state-city").then((mod) => setCsc(mod));
  }, []);

  const [step,     setStep]     = useState(location.state?.preSelectedRole ? 2 : 1);
  const [role,     setRole]     = useState(location.state?.preSelectedRole || "");
  const [loading,  setLoading]  = useState(false);
  const [showPw,   setShowPw]   = useState(false);
  const [errors,   setErrors]   = useState({});
  const [subPanel, setSubPanel] = useState("account");

  const [countryCode,   setCountryCode]   = useState("");
  const [stateCode,     setStateCode]     = useState("");
  const [taCountryCode, setTaCountryCode] = useState("");
  const [taStateCode,   setTaStateCode]   = useState("");

  // ── ONLY CHANGE: csc? prefix instead of direct Country/State/City ──
  const allCountries = csc ? csc.Country.getAllCountries() : [];
  const allStates    = (csc && countryCode) ? csc.State.getStatesOfCountry(countryCode) : [];
  const allCities    = (csc && countryCode && stateCode) ? csc.City.getCitiesOfState(countryCode, stateCode) : [];
  const taAllStates  = (csc && taCountryCode) ? csc.State.getStatesOfCountry(taCountryCode) : [];
  const taAllCities  = (csc && taCountryCode && taStateCode) ? csc.City.getCitiesOfState(taCountryCode, taStateCode) : [];

  const [fd, setFd] = useState({
    name: resolvedName,
    email: resolvedEmail,
    password: "", confirmPassword: "", mobile: "",
    dob: "", gender: "", city: "", state: "", country: "",
    qualification: "", collegeName: "", yearOfPassing: "", currentStatus: "",
    agreeTerms: false, agreePrivacy: false,
    linkedin: "", shareExpertise: [], audienceSize: "", fullTimeRole: "", expertise: "", experience: "",
    businessName: "", businessType: "", industry: "", cityState: "", website: "",
    companySize: "", yearsExperience: "", aboutBusiness: "", expectedOutcome: "", lookingFor: [],
    taCity: "", taState: "", taCountry: "",
  });

  useEffect(() => {
    setFd(p => ({
      ...p,
      name:  prefillName  || p.name,
      email: prefillEmail || p.email,
    }));
  }, [prefillName, prefillEmail]);

  useEffect(() => { setSubPanel("account"); }, [role]);

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setFd(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  // ── ONLY CHANGE: csc?.Country / csc?.State instead of Country / State ──
  const handleCountryChange = (e) => {
    const iso = e.target.value;
    setCountryCode(iso); setStateCode("");
    setFd(p => ({ ...p, country: csc?.Country.getCountryByCode(iso)?.name || "", state: "", city: "" }));
    if (errors.country) setErrors(p => ({ ...p, country: "" }));
  };
  const handleStateChange = (e) => {
    const iso = e.target.value;
    setStateCode(iso);
    setFd(p => ({ ...p, state: csc?.State.getStateByCodeAndCountry(iso, countryCode)?.name || "", city: "" }));
    if (errors.state) setErrors(p => ({ ...p, state: "" }));
  };
  const handleCityChange = (v) => {
    setFd(p => ({ ...p, city: v }));
    if (errors.city) setErrors(p => ({ ...p, city: "" }));
  };
  const handleTaCountryChange = (e) => {
    const iso = e.target.value;
    setTaCountryCode(iso); setTaStateCode("");
    setFd(p => ({ ...p, taCountry: csc?.Country.getCountryByCode(iso)?.name || "", taState: "", taCity: "", cityState: "" }));
    if (errors.cityState) setErrors(p => ({ ...p, cityState: "" }));
  };
  const handleTaStateChange = (e) => {
    const iso = e.target.value;
    setTaStateCode(iso);
    setFd(p => ({ ...p, taState: csc?.State.getStateByCodeAndCountry(iso, taCountryCode)?.name || "", taCity: "", cityState: "" }));
    if (errors.cityState) setErrors(p => ({ ...p, cityState: "" }));
  };
  const handleTaCityChange = (v) => {
    setFd(p => {
      const combined = [v, p.taState].filter(Boolean).join(", ");
      return { ...p, taCity: v, cityState: combined };
    });
    if (errors.cityState) setErrors(p => ({ ...p, cityState: "" }));
  };

  const toggleArr = (key, val) =>
    setFd(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val] }));

  const validateCurrentSubPanel = () => {
    const e = {};
    if (subPanel === "account") {
      if (!fd.name.trim())  e.name  = "Name is required";
      if (!fd.email.trim()) e.email = "Email is required";
      if (!isGoogle && role === "student" && fd.password && fd.password.length < 6) e.password = "Min 6 characters";
      if (!isGoogle && (role === "trainer" || role === "Tenant Admin") && fd.password && fd.password.length < 11) e.password = "Min 11 characters";
      if (!fd.mobile) e.mobile = "Required";
    }
    if (role === "student" && subPanel === "location") {
      if (!fd.country) e.country = "Required";
      if (!fd.state)   e.state   = "Required";
      if (!fd.city)    e.city    = "Required";
      if (!fd.dob)     e.dob     = "Required";
      if (!fd.gender)  e.gender  = "Required";
    }
    if (role === "student" && subPanel === "education") {
      if (!fd.qualification) e.qualification = "Required";
      if (!fd.collegeName)   e.collegeName   = "Required";
      if (!fd.yearOfPassing) e.yearOfPassing = "Required";
      if (!fd.currentStatus) e.currentStatus = "Required";
    }
    if (role === "trainer" && subPanel === "profile") {
      if (!fd.linkedin)   e.linkedin   = "Required";
      if (!fd.country)    e.country    = "Required";
      if (!fd.expertise)  e.expertise  = "Required";
      if (!fd.experience) e.experience = "Required";
      if (!fd.fullTimeRole) e.fullTimeRole = "Required";
    }
    if (role === "trainer" && subPanel === "reach") {
      if (!fd.audienceSize)          e.audienceSize   = "Required";
      if (!fd.shareExpertise.length) e.shareExpertise = "Select at least one";
    }
    if (role === "Tenant Admin" && subPanel === "business") {
      if (!fd.businessName)  e.businessName  = "Required";
      if (!fd.businessType)  e.businessType  = "Required";
      if (!fd.industry)      e.industry      = "Required";
      if (!fd.cityState)     e.cityState     = "Required";
      if (!fd.companySize)   e.companySize   = "Required";
    }
    if (role === "Tenant Admin" && subPanel === "goals") {
      if (!fd.yearsExperience)       e.yearsExperience = "Required";
      if (!fd.lookingFor.length)     e.lookingFor      = "Select at least one";
      if (!fd.aboutBusiness)         e.aboutBusiness   = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validate2 = () => {
    const e = {};
    if (!fd.name.trim())  e.name  = "Name is required";
    if (!fd.email.trim()) e.email = "Email is required";
    if (role === "student") {
      if (!isGoogle && (!fd.password || fd.password.length < 6)) e.password = "Min 6 characters";
      if (!fd.mobile)        e.mobile        = "Required";
      if (!fd.dob)           e.dob           = "Required";
      if (!fd.gender)        e.gender        = "Required";
      if (!fd.city)          e.city          = "Required";
      if (!fd.state)         e.state         = "Required";
      if (!fd.country)       e.country       = "Required";
      if (!fd.qualification) e.qualification = "Required";
      if (!fd.collegeName)   e.collegeName   = "Required";
      if (!fd.yearOfPassing) e.yearOfPassing = "Required";
      if (!fd.currentStatus) e.currentStatus = "Required";
    }
    if (role === "trainer") {
      if (!isGoogle) {
        if (!fd.password || fd.password.length < 11) e.password = "Min 11 characters";
        if (!fd.confirmPassword) e.confirmPassword = "Required";
        else if (fd.password !== fd.confirmPassword) e.confirmPassword = "Passwords don't match";
      }
      if (!fd.mobile)                e.mobile        = "Required";
      if (!fd.linkedin)              e.linkedin      = "Required";
      if (!fd.country)               e.country       = "Required";
      if (!fd.expertise)             e.expertise     = "Required";
      if (!fd.experience)            e.experience    = "Required";
      if (!fd.audienceSize)          e.audienceSize  = "Required";
      if (!fd.fullTimeRole)          e.fullTimeRole  = "Required";
      if (!fd.shareExpertise.length) e.shareExpertise = "Select at least one";
    }
    if (role === "Tenant Admin") {
      if (!isGoogle) {
        if (!fd.password || fd.password.length < 11) e.password = "Min 11 characters";
        if (!fd.confirmPassword) e.confirmPassword = "Required";
        else if (fd.password !== fd.confirmPassword) e.confirmPassword = "Passwords don't match";
      }
      if (!fd.businessName)          e.businessName    = "Required";
      if (!fd.mobile)                e.mobile          = "Required";
      if (!fd.businessType)          e.businessType    = "Required";
      if (!fd.industry)              e.industry        = "Required";
      if (!fd.cityState)             e.cityState       = "Required";
      if (!fd.companySize)           e.companySize     = "Required";
      if (!fd.yearsExperience)       e.yearsExperience = "Required";
      if (!fd.lookingFor.length)     e.lookingFor      = "Select at least one";
      if (!fd.aboutBusiness)         e.aboutBusiness   = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validate3 = () => {
    const e = {};
    if (!fd.agreeTerms) e.agreeTerms = "You must agree to terms";
    if (role === "student" && !fd.agreePrivacy) e.agreePrivacy = "You must agree to privacy policy";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1) {
      if (!role) { setErrors({ role: "Please select a role" }); return; }
      setStep(2); setSubPanel("account"); setErrors({});
      return;
    }
    if (step === 2) {
      const panels = SUB_PANEL_ORDER[role] || ["account"];
      const currentIdx = panels.indexOf(subPanel);
      const isLastPanel = currentIdx === panels.length - 1;
      if (isLastPanel) {
        if (!validate2()) return;
        setStep(3); setErrors({});
      } else {
        if (!validateCurrentSubPanel()) return;
        setSubPanel(panels[currentIdx + 1]); setErrors({});
      }
    }
  };

  const back = () => {
    if (step === 2) {
      const panels = SUB_PANEL_ORDER[role] || ["account"];
      const currentIdx = panels.indexOf(subPanel);
      if (currentIdx > 0) { setSubPanel(panels[currentIdx - 1]); setErrors({}); return; }
      setStep(1); setErrors({});
      return;
    }
    setStep(s => s - 1); setErrors({});
  };

  const handleSkip = () => {
    if (onSkip) { onSkip(); } else { navigate("/ilm-demo", { replace: true }); }
  };

  // const handleSubmit = async () => {
  //   if (!validate3()) return;
  //   setLoading(true);
  //   try {
  //     await authService.register({
  //       name: fd.name, email: fd.email,
  //       password: isGoogle ? null : fd.password,
  //       role: role === "student" ? "STUDENT" : role === "trainer" ? "TRAINER" : "TENANT_ADMIN",
  //       isGoogleUser: isGoogle,
  //       googleCredential: isGoogle ? googleCredential : null,
  //       ...fd,
  //     });
  //     localStorage.setItem("role", role.toUpperCase());
  //     localStorage.setItem("lms_user", JSON.stringify({ name: fd.name, email: fd.email, role }));
  //     alert("✅ Application submitted!\n\nPlease verify your email.");
  //     navigate(`/verify-email?email=${encodeURIComponent(fd.email)}`);
  //   } catch (err) {
  //     const msg = err?.response?.data?.message || err?.response?.data?.error || "Submission failed";
  //     alert(msg);
  //     if (msg.toLowerCase().includes("verify")) navigate(`/verify-email?email=${encodeURIComponent(fd.email)}`);
  //   } finally { setLoading(false); }
  // };

  const handleSubmit = async () => {
    if (!validate3()) return;
    setLoading(true);
    try {
      if (isGoogle && googleCredential) {
        // Google user: call /api/auth/google which does upsert safely
        const res = await authService.googleLogin({ 
          idToken: googleCredential, 
          role: role === "student" ? "STUDENT" : role === "trainer" ? "TRAINER" : "TENANT_ADMIN"
        });
        const data = res.data;
        localStorage.setItem("lms_token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("lms_user", JSON.stringify({ name: fd.name, email: fd.email, role: data.role }));
      } else {
        // Manual registration: call /api/auth/register
        await authService.register({
          name: fd.name, email: fd.email,
          password: fd.password,
          role: role === "student" ? "STUDENT" : role === "trainer" ? "TRAINER" : "TENANT_ADMIN",
        });
      }
      alert("✅ Application submitted!\n\nPlease verify your email.");
      navigate(`/verify-email?email=${encodeURIComponent(fd.email)}`);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || "Submission failed";
      alert(msg);
    } finally { 
      setLoading(false); 
    }
};

  const E = (k) => errors[k]
    ? <span style={{ fontSize: 11, color: "#e74c3c", marginTop: 2 }}>⚠ {errors[k]}</span>
    : null;

  const reviewRows = () => {
    const base = [["Name", fd.name], ["Email", fd.email]];
    if (role === "student") return [...base,
      ["Mobile", fd.mobile], ["Date of Birth", fd.dob], ["Gender", fd.gender],
      ["City", fd.city], ["State", fd.state], ["Country", fd.country],
      ["Qualification", fd.qualification], ["College", fd.collegeName],
      ["Year of Passing", fd.yearOfPassing], ["Current Status", fd.currentStatus],
    ];
    if (role === "trainer") return [...base,
      ["Mobile", fd.mobile], ["LinkedIn", fd.linkedin], ["Country", fd.country],
      ["Expertise", fd.expertise], ["Experience", fd.experience ? fd.experience + " yrs" : "—"],
      ["Audience Size", fd.audienceSize], ["Full Time?", fd.fullTimeRole],
      ["Platforms", fd.shareExpertise.join(", ") || "—"],
    ];
    if (role === "Tenant Admin") return [...base,
      ["Business", fd.businessName], ["Mobile", fd.mobile],
      ["Type", fd.businessType], ["Industry", fd.industry],
      ["Location", fd.cityState || "—"], ["Company Size", fd.companySize],
      ["Experience", fd.yearsExperience ? fd.yearsExperience + " yrs" : "—"],
      ["Looking For", fd.lookingFor.join(", ") || "—"],
    ];
    return base;
  };

  const subPanelMap = {
    student:        [{ id: "account", label: "Account" }, { id: "location", label: "Location" }, { id: "education", label: "Education" }],
    trainer:        [{ id: "account", label: "Account" }, { id: "profile",  label: "Profile"  }, { id: "reach",     label: "Reach"    }],
    "Tenant Admin": [{ id: "account", label: "Account" }, { id: "business", label: "Business" }, { id: "goals",     label: "Goals"    }],
  };

  const panels = role ? (SUB_PANEL_ORDER[role] || ["account"]) : [];
  const isLastSubPanel = panels.indexOf(subPanel) === panels.length - 1;
  const continueLabel  = step === 2 && !isLastSubPanel ? "Next →" : "Continue →";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .cp-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; padding: 16px; font-family: 'Inter', sans-serif; }
        .cp-modal { width: 100%; max-width: 440px; background: #faf7f4; border-radius: 18px; box-shadow: 0 24px 64px rgba(0,0,0,0.20); display: flex; flex-direction: column; max-height: 92vh; overflow: hidden; animation: cpIn .25s ease both; }
        @keyframes cpIn { from { opacity: 0; transform: scale(0.96) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .cp-hdr { padding: 16px 22px 0; flex-shrink: 0; background: #faf7f4; border-radius: 18px 18px 0 0; }
        .cp-hdr-top { display: flex; align-items: center; margin-bottom: 12px; width: 100%; }
        .cp-logo { font-size: 1.3rem; font-weight: 800; letter-spacing: -0.3px; line-height: 1; }
        .cp-logo-ilm { color: #27ae60; }
        .cp-logo-ora { color: #e67e22; }
        .cp-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
        .cp-skip-btn { background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 12.5px; color: #888; font-weight: 500; padding: 0; display: flex; align-items: center; gap: 4px; white-space: nowrap; transition: color .18s; margin-right: 6px; }
        .cp-skip-btn:hover { color: #555; }
        .cp-close { width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid #ddd8d2; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #999; transition: all .18s; flex-shrink: 0; }
        .cp-close:hover { background: #f0ece8; color: #444; border-color: #ccc; }
        .cp-orange-line { height: 3px; background: #e67e22; border-radius: 0; margin: 0 -20px; }
        .cp-prog { height: 2px; background: #ece7e1; flex-shrink: 0; }
        .cp-prog-fill { height: 100%; background: #e67e22; transition: width .4s ease; }
        .cp-body { flex: 1; overflow-y: auto; padding: 22px 22px 10px; background: #faf7f4; }
        .cp-body::-webkit-scrollbar { width: 4px; }
        .cp-body::-webkit-scrollbar-thumb { background: #ddd5cb; border-radius: 4px; }
        .cp-title { font-size: 19px; font-weight: 700; color: #111; margin-bottom: 5px; }
        .cp-sub { font-size: 13px; color: #aaa; margin-bottom: 20px; line-height: 1.4; }
        .cp-roles { display: flex; flex-direction: column; gap: 10px; }
        .cp-role { display: flex; align-items: center; gap: 13px; padding: 13px 15px; border-radius: 12px; border: 1.5px solid #ede8e0; background: #fff; cursor: pointer; transition: all .16s; user-select: none; }
        .cp-role:hover { border-color: #d5cdc4; background: #fdfaf7; }
        .cp-role.sel { border-color: #e67e22; background: #fff; box-shadow: 0 0 0 3px rgba(230,126,34,.10); }
        .cp-role-ico { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .cp-role-info { flex: 1; }
        .cp-role-name { font-size: 14px; font-weight: 700; color: #111; }
        .cp-role-desc { font-size: 12px; color: #bbb; margin-top: 2px; }
        .cp-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #d5cdc5; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: border-color .16s; }
        .cp-radio.sel { border-color: #e67e22; }
        .cp-radio-dot { width: 8px; height: 8px; border-radius: 50%; background: #e67e22; }
        .cp-tabs { display: flex; gap: 4px; padding: 3px; background: #ede8e2; border-radius: 9px; margin-bottom: 16px; }
        .cp-tab { flex: 1; padding: 7px 4px; border: none; background: transparent; border-radius: 7px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; color: #aaa; cursor: pointer; transition: all .16s; }
        .cp-tab.act { background: #fff; color: #e67e22; box-shadow: 0 1px 5px rgba(0,0,0,.07); }
        .cp-form { display: flex; flex-direction: column; gap: 11px; }
        .cp-field { display: flex; flex-direction: column; gap: 4px; }
        .cp-lbl { font-size: 11px; font-weight: 600; color: #888; letter-spacing: .04em; text-transform: uppercase; }
        .cp-input { width: 100%; padding: 9.5px 12px; border: 1.5px solid #e4dfd8; border-radius: 9px; font-family: 'Inter', sans-serif; font-size: 13.5px; color: #111; background: #fff; outline: none; transition: border-color .16s, box-shadow .16s; }
        .cp-input::placeholder { color: #c5bdb5; }
        .cp-input:focus { border-color: #e67e22; box-shadow: 0 0 0 3px rgba(230,126,34,.10); background: #fff; }
        .cp-input:disabled { opacity: .4; cursor: not-allowed; background: #f5f0eb; }
        .cp-input-err { border-color: #e74c3c !important; box-shadow: 0 0 0 3px rgba(231,76,60,.08) !important; }
        .cp-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .cp-pw-wrap { position: relative; }
        .cp-pw-wrap .cp-input { padding-right: 38px; }
        .cp-eye { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #bbb; padding: 0; display: flex; align-items: center; transition: color .16s; }
        .cp-eye:hover { color: #777; }
        .cp-pw-hint { font-size: 11px; margin-top: 2px; }
        .cp-pw-hint.ok { color: #27ae60; }
        .cp-pw-hint.bad { color: #e74c3c; }
        .cp-sel-wrap { position: relative; }
        .cp-sel-wrap select { appearance: none; padding-right: 32px; }
        .cp-sel-arr { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #bbb; display: flex; align-items: center; }
        .cp-country-badge { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; color: #555; font-weight: 600; background: #f5f0eb; border: 1px solid #e4dfd8; border-radius: 7px; padding: 4px 10px; margin-top: 4px; }
        .cp-note { display: flex; align-items: flex-start; gap: 8px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 9px 12px; font-size: 12px; color: #1e40af; line-height: 1.5; margin-bottom: 2px; }
        .cp-ck-lbl { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border: 1.5px solid #e4dfd8; border-radius: 8px; cursor: pointer; font-size: 13px; color: #333; font-weight: 500; transition: all .16s; background: #fff; }
        .cp-ck-lbl:hover { border-color: #d5cdc4; background: #fdfaf7; }
        .cp-ck-lbl input { width: 13px; height: 13px; accent-color: #e67e22; flex-shrink: 0; }
        .cp-ck-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 4px; }
        .cp-rad-lbl { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border: 1.5px solid #e4dfd8; border-radius: 8px; cursor: pointer; font-size: 13px; color: #333; font-weight: 500; transition: all .16s; background: #fff; }
        .cp-rad-lbl:hover { border-color: #d5cdc4; }
        .cp-rad-lbl input { width: 13px; height: 13px; accent-color: #e67e22; }
        .cp-google-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: #1e40af; font-weight: 600; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 2px 8px; margin-top: 3px; }
        .cp-rev-badge { display: inline-flex; align-items: center; gap: 6px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 700; color: #c2410c; margin-bottom: 12px; }
        .cp-rev-table { border: 1px solid #ede8e2; border-radius: 10px; overflow: hidden; margin-bottom: 14px; background: #fff; }
        .cp-rev-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-bottom: 1px solid #f5f2ef; }
        .cp-rev-row:last-child { border-bottom: none; }
        .cp-rev-k { font-size: 11.5px; font-weight: 500; color: #aaa; flex-shrink: 0; }
        .cp-rev-v { font-size: 12.5px; font-weight: 600; color: #111; text-align: right; max-width: 60%; word-break: break-all; }
        .cp-rev-note { display: flex; align-items: flex-start; gap: 6px; font-size: 11.5px; color: #999; line-height: 1.5; margin-top: 8px; }
        .cp-foot { display: flex; align-items: center; justify-content: space-between; padding: 14px 22px; border-top: 1px solid #ece7e0; background: #faf7f4; flex-shrink: 0; border-radius: 0 0 18px 18px; }
        .cp-step-lbl { font-size: 12px; color: #bbb; font-weight: 500; }
        .cp-foot-r { display: flex; gap: 8px; align-items: center; }
        .cp-btn-back { padding: 9px 16px; background: #fff; border: 1.5px solid #e4dfd8; border-radius: 9px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; color: #888; cursor: pointer; transition: all .16s; }
        .cp-btn-back:hover { background: #f5f0eb; }
        .cp-btn-next { padding: 10px 24px; background: #e67e22; border: none; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; box-shadow: 0 2px 10px rgba(230,126,34,.30); transition: opacity .16s, transform .12s; display: flex; align-items: center; gap: 5px; }
        .cp-btn-next:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
        .cp-btn-next:disabled { opacity: .35; cursor: not-allowed; transform: none; }
        .cp-btn-sub { padding: 10px 22px; background: #27ae60; border: none; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; box-shadow: 0 2px 10px rgba(39,174,96,.28); transition: opacity .16s; display: flex; align-items: center; gap: 5px; }
        .cp-btn-sub:hover:not(:disabled) { opacity: .88; }
        .cp-btn-sub:disabled { opacity: .40; cursor: not-allowed; }
        .cp-err-g { font-size: 11px; color: #e74c3c; margin-top: 6px; }
        @media (max-width: 500px) { .cp-row2 { grid-template-columns: 1fr; } .cp-ck-grid { grid-template-columns: 1fr; } .cp-modal { border-radius: 14px; max-height: 96vh; } }
      `}</style>

      <div className="cp-overlay">
        <div className="cp-modal">
          <div className="cp-hdr">
            <div className="cp-hdr-top">
              <div className="cp-logo"><span className="cp-logo-ilm">ILM</span><span className="cp-logo-ora">ORA</span></div>
              <div className="cp-hdr-right">
                <button className="cp-skip-btn" onClick={handleSkip}>Skip for now →</button>
                <button className="cp-close" onClick={handleSkip} aria-label="Close"><IClose/></button>
              </div>
            </div>
            <div className="cp-orange-line"/>
          </div>

          <div className="cp-prog">
            <div className="cp-prog-fill" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}/>
          </div>

          <div className="cp-body">

            {step === 1 && (
              <>
                <div className="cp-title">What's your role?</div>
                <div className="cp-sub">Select how you'll use ILM ORA to personalise your experience</div>
                <div className="cp-roles">
                  {ROLES.map(r => (
                    <div key={r.value} className={`cp-role ${role === r.value ? "sel" : ""}`} onClick={() => { setRole(r.value); setErrors({}); }}>
                      <div className="cp-role-ico" style={{ background: r.bg }}>{r.icon}</div>
                      <div className="cp-role-info">
                        <div className="cp-role-name">{r.label}</div>
                        <div className="cp-role-desc">{r.desc}</div>
                      </div>
                      <div className={`cp-radio ${role === r.value ? "sel" : ""}`}>
                        {role === r.value && <div className="cp-radio-dot"/>}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.role && <p className="cp-err-g">⚠ {errors.role}</p>}
              </>
            )}

            {step === 2 && (
              <>
                <div className="cp-title">{role === "student" ? "Student Details" : role === "trainer" ? "Trainer Details" : "Admin Details"}</div>
                <div className="cp-sub">Fill in your information carefully</div>
                {isGoogle && (
                  <div className="cp-note">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Signed in with Google — your name & email are pre-filled. Set a password to also log in via email.
                  </div>
                )}
                <div className="cp-tabs">
                  {(subPanelMap[role] || []).map(sp => (
                    <button key={sp.id} className={`cp-tab ${subPanel === sp.id ? "act" : ""}`} onClick={() => setSubPanel(sp.id)}>{sp.label}</button>
                  ))}
                </div>
                <div className="cp-form">

                  {subPanel === "account" && <>
                    <div className="cp-row2">
                      <div className="cp-field">
                        <label className="cp-lbl">Full Name *</label>
                        <input className="cp-input" type="text" name="name" value={fd.name} onChange={set} placeholder="Your full name"/>
                        {E("name")}
                      </div>
                      <div className="cp-field">
                        <label className="cp-lbl">Email *</label>
                        <input className={`cp-input${errors.email ? " cp-input-err" : ""}`} type="email" name="email" value={fd.email} onChange={set} placeholder="your@email.com" disabled={isGoogle && !!fd.email}/>
                        {isGoogle && fd.email && (
                          <span className="cp-google-badge">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            Verified via Google
                          </span>
                        )}
                        {E("email")}
                      </div>
                    </div>
                    <div className="cp-field">
                      <label className="cp-lbl">Password {isGoogle ? <span style={{ fontWeight: 400, textTransform: "none", fontSize: 10, color: "#bbb" }}>(optional)</span> : "*"}</label>
                      <div className="cp-pw-wrap">
                        <input className="cp-input" type={showPw ? "text" : "password"} name="password" value={fd.password} onChange={set} placeholder={role === "student" ? "Min 6 characters" : "Min 11 characters"}/>
                        <button type="button" className="cp-eye" onClick={() => setShowPw(p => !p)} tabIndex={-1}>{showPw ? <IEyeOff/> : <IEyeOn/>}</button>
                      </div>
                      {fd.password && (() => { const min = role === "student" ? 6 : 11; return <span className={`cp-pw-hint ${fd.password.length >= min ? "ok" : "bad"}`}>{fd.password.length >= min ? "✓ Strong enough" : `⚠ Min ${min} chars (${fd.password.length}/${min})`}</span>; })()}
                      {E("password")}
                    </div>
                    {(role === "trainer" || role === "Tenant Admin") && (
                      <div className="cp-field">
                        <label className="cp-lbl">Confirm Password {isGoogle ? "" : "*"}</label>
                        <input className="cp-input" type="password" name="confirmPassword" value={fd.confirmPassword} onChange={set} placeholder="Re-enter password"/>
                        {fd.confirmPassword && fd.password !== fd.confirmPassword && <span className="cp-pw-hint bad">❌ Passwords don't match</span>}
                        {E("confirmPassword")}
                      </div>
                    )}
                    <div className="cp-field">
                      <label className="cp-lbl">Mobile *</label>
                      <input className="cp-input" type="tel" name="mobile" value={fd.mobile} onChange={set} placeholder="+91 9876543210"/>
                      {E("mobile")}
                    </div>
                  </>}

                  {role === "student" && subPanel === "location" && <>
                    <div className="cp-row2">
                      <div className="cp-field">
                        <label className="cp-lbl">Date of Birth *</label>
                        <input className="cp-input" type="date" name="dob" value={fd.dob} onChange={set}/>
                        {E("dob")}
                      </div>
                      <div className="cp-field">
                        <label className="cp-lbl">Gender *</label>
                        <div className="cp-sel-wrap">
                          <select className="cp-input" name="gender" value={fd.gender} onChange={set}>
                            <option value="">Select</option>
                            {["Male","Female","Non-binary","Prefer not to say","Other"].map(o => <option key={o}>{o}</option>)}
                          </select>
                          <span className="cp-sel-arr"><IChevDown/></span>
                        </div>
                        {E("gender")}
                      </div>
                    </div>
                    <div className="cp-field">
                      <label className="cp-lbl">Country *</label>
                      <div className="cp-sel-wrap">
                        <select className={`cp-input${errors.country ? " cp-input-err" : ""}`} value={countryCode} onChange={handleCountryChange}>
                          <option value="">— Select Country —</option>
                          {allCountries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                        </select>
                        <span className="cp-sel-arr"><IChevDown/></span>
                      </div>
                      {countryCode && <div className="cp-country-badge"><CountryFlag isoCode={countryCode} size={18}/><span>{fd.country}</span></div>}
                      {E("country")}
                    </div>
                    <div className="cp-field">
                      <label className="cp-lbl">State *</label>
                      <div className="cp-sel-wrap">
                        <select className={`cp-input${errors.state ? " cp-input-err" : ""}`} value={stateCode} onChange={handleStateChange} disabled={!countryCode}>
                          <option value="">{countryCode ? "— Select State —" : "— Select Country first —"}</option>
                          {allStates.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                        </select>
                        <span className="cp-sel-arr"><IChevDown/></span>
                      </div>
                      {E("state")}
                    </div>
                    <div className="cp-field">
                      <label className="cp-lbl">City *</label>
                      <CitySearchDropdown value={fd.city} onChange={handleCityChange} cities={allCities} disabled={!stateCode} error={!!errors.city}/>
                      {E("city")}
                    </div>
                  </>}

                  {role === "student" && subPanel === "education" && <>
                    <div className="cp-field">
                      <label className="cp-lbl">Highest Qualification *</label>
                      <div className="cp-sel-wrap">
                        <select className="cp-input" name="qualification" value={fd.qualification} onChange={set}>
                          <option value="">Select</option>
                          {["10th","12th","Diploma","Graduation","Post-Graduation","MBA","PhD","Other"].map(o => <option key={o}>{o}</option>)}
                        </select>
                        <span className="cp-sel-arr"><IChevDown/></span>
                      </div>
                      {E("qualification")}
                    </div>
                    <div className="cp-row2">
                      <div className="cp-field">
                        <label className="cp-lbl">College *</label>
                        <input className="cp-input" type="text" name="collegeName" value={fd.collegeName} onChange={set} placeholder="Institution name"/>
                        {E("collegeName")}
                      </div>
                      <div className="cp-field">
                        <label className="cp-lbl">Year of Passing *</label>
                        <input className="cp-input" type="number" name="yearOfPassing" value={fd.yearOfPassing} onChange={set} placeholder="2024" min="1950" max="2030"/>
                        {E("yearOfPassing")}
                      </div>
                    </div>
                    <div className="cp-field">
                      <label className="cp-lbl">Current Status *</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 2 }}>
                        {["Student","Working Professional","Fresher","Career Break","Entrepreneur"].map(s => (
                          <label key={s} className="cp-rad-lbl"><input type="radio" name="currentStatus" value={s} checked={fd.currentStatus === s} onChange={set}/>{s}</label>
                        ))}
                      </div>
                      {E("currentStatus")}
                    </div>
                  </>}

                  {role === "trainer" && subPanel === "profile" && <>
                    <div className="cp-field">
                      <label className="cp-lbl">LinkedIn Profile *</label>
                      <input className="cp-input" type="url" name="linkedin" value={fd.linkedin} onChange={set} placeholder="https://linkedin.com/in/..."/>
                      {E("linkedin")}
                    </div>
                    <div className="cp-field">
                      <label className="cp-lbl">Country *</label>
                      <div className="cp-sel-wrap">
                        <select className={`cp-input${errors.country ? " cp-input-err" : ""}`} value={countryCode} onChange={handleCountryChange}>
                          <option value="">— Select Country —</option>
                          {allCountries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                        </select>
                        <span className="cp-sel-arr"><IChevDown/></span>
                      </div>
                      {countryCode && <div className="cp-country-badge"><CountryFlag isoCode={countryCode} size={18}/><span>{fd.country}</span></div>}
                      {E("country")}
                    </div>
                    <div className="cp-row2">
                      <div className="cp-field">
                        <label className="cp-lbl">Full Time? *</label>
                        <div className="cp-sel-wrap">
                          <select className="cp-input" name="fullTimeRole" value={fd.fullTimeRole} onChange={set}>
                            <option value="">Select</option>
                            <option>Yes</option><option>No</option><option>Part-time</option>
                          </select>
                          <span className="cp-sel-arr"><IChevDown/></span>
                        </div>
                        {E("fullTimeRole")}
                      </div>
                      <div className="cp-field">
                        <label className="cp-lbl">Experience (yrs) *</label>
                        <EnhancedSelect name="experience" label="experience" value={fd.experience} onChange={set} options={EXPERIENCE_OPTIONS} placeholder="Select years" error={!!errors.experience}/>
                        {E("experience")}
                      </div>
                    </div>
                    <div className="cp-field">
                      <label className="cp-lbl">Expertise *</label>
                      <EnhancedSelect name="expertise" label="expertise" value={fd.expertise} onChange={set} options={EXPERTISE_OPTIONS} placeholder="Select or add expertise" error={!!errors.expertise}/>
                      {E("expertise")}
                    </div>
                  </>}

                  {role === "trainer" && subPanel === "reach" && <>
                    <div className="cp-field">
                      <label className="cp-lbl">Audience Size *</label>
                      <EnhancedSelect name="audienceSize" label="audience size" value={fd.audienceSize} onChange={set} options={AUDIENCE_SIZE_OPTIONS} placeholder="Select range" error={!!errors.audienceSize}/>
                      {E("audienceSize")}
                    </div>
                    <div className="cp-field">
                      <label className="cp-lbl">Where do you share expertise? *</label>
                      <div className="cp-ck-grid">
                        {["Blog","Newsletter","YouTube","Podcast","Social Media","Online courses","Webinars","Books / Writing"].map(item => (
                          <label key={item} className="cp-ck-lbl"><input type="checkbox" checked={fd.shareExpertise.includes(item)} onChange={() => toggleArr("shareExpertise", item)}/>{item}</label>
                        ))}
                      </div>
                      {E("shareExpertise")}
                    </div>
                  </>}

                  {role === "Tenant Admin" && subPanel === "business" && <>
                    <div className="cp-field">
                      <label className="cp-lbl">Business / Company Name *</label>
                      <input className="cp-input" type="text" name="businessName" value={fd.businessName} onChange={set} placeholder="Your company"/>
                      {E("businessName")}
                    </div>
                    <div className="cp-field">
                      <label className="cp-lbl">Country *</label>
                      <div className="cp-sel-wrap">
                        <select className="cp-input" value={taCountryCode} onChange={handleTaCountryChange}>
                          <option value="">— Select Country —</option>
                          {allCountries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                        </select>
                        <span className="cp-sel-arr"><IChevDown/></span>
                      </div>
                      {taCountryCode && <div className="cp-country-badge"><CountryFlag isoCode={taCountryCode} size={18}/><span>{fd.taCountry}</span></div>}
                    </div>
                    <div className="cp-field">
                      <label className="cp-lbl">State</label>
                      <div className="cp-sel-wrap">
                        <select className="cp-input" value={taStateCode} onChange={handleTaStateChange} disabled={!taCountryCode}>
                          <option value="">{taCountryCode ? "— Select State —" : "— Select Country first —"}</option>
                          {taAllStates.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                        </select>
                        <span className="cp-sel-arr"><IChevDown/></span>
                      </div>
                    </div>
                    <div className="cp-field">
                      <label className="cp-lbl">City *</label>
                      <CitySearchDropdown value={fd.taCity} onChange={handleTaCityChange} cities={taAllCities} disabled={!taStateCode} error={!!errors.cityState}/>
                      {fd.cityState && (
                        <span style={{ fontSize: 11, color: "#e67e22", marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {fd.cityState}
                        </span>
                      )}
                      {E("cityState")}
                    </div>
                    <div className="cp-row2">
                      <div className="cp-field">
                        <label className="cp-lbl">Business Type *</label>
                        <EnhancedSelect name="businessType" label="business type" value={fd.businessType} onChange={set} options={BUSINESS_TYPE_OPTIONS} placeholder="Select" error={!!errors.businessType}/>
                        {E("businessType")}
                      </div>
                      <div className="cp-field">
                        <label className="cp-lbl">Industry *</label>
                        <EnhancedSelect name="industry" label="industry" value={fd.industry} onChange={set} options={INDUSTRY_OPTIONS} placeholder="Select" error={!!errors.industry}/>
                        {E("industry")}
                      </div>
                    </div>
                    <div className="cp-row2">
                      <div className="cp-field">
                        <label className="cp-lbl">Company Size *</label>
                        <EnhancedSelect name="companySize" label="company size" value={fd.companySize} onChange={set} options={COMPANY_SIZE_OPTIONS} placeholder="Select" error={!!errors.companySize}/>
                        {E("companySize")}
                      </div>
                      <div className="cp-field">
                        <label className="cp-lbl">Website <span style={{ fontWeight: 400, textTransform: "none", fontSize: 10, color: "#bbb" }}>(optional)</span></label>
                        <input className="cp-input" type="url" name="website" value={fd.website} onChange={set} placeholder="https://yourcompany.com"/>
                      </div>
                    </div>
                  </>}

                  {role === "Tenant Admin" && subPanel === "goals" && <>
                    <div className="cp-field">
                      <label className="cp-lbl">Years of Experience *</label>
                      <EnhancedSelect name="yearsExperience" label="years of experience" value={fd.yearsExperience} onChange={set} options={YEARS_EXPERIENCE_OPTIONS} placeholder="Select years" error={!!errors.yearsExperience}/>
                      {E("yearsExperience")}
                    </div>
                    <div className="cp-field">
                      <label className="cp-lbl">What are you looking for? *</label>
                      <div className="cp-ck-grid">
                        {["Trainers","Students","Courses","Corporate Training","Certifications","Mentorship","Workshops","Assessments"].map(item => (
                          <label key={item} className="cp-ck-lbl"><input type="checkbox" checked={fd.lookingFor.includes(item)} onChange={() => toggleArr("lookingFor", item)}/>{item}</label>
                        ))}
                      </div>
                      {E("lookingFor")}
                    </div>
                    <div className="cp-field">
                      <label className="cp-lbl">About Business *</label>
                      <textarea className="cp-input" name="aboutBusiness" value={fd.aboutBusiness} onChange={set} placeholder="Short description…" rows={3} style={{ resize: "none" }}/>
                      {E("aboutBusiness")}
                    </div>
                    <div className="cp-field">
                      <label className="cp-lbl">Expected Outcome <span style={{ fontWeight: 400, textTransform: "none", fontSize: 10, color: "#bbb" }}>(optional)</span></label>
                      <textarea className="cp-input" name="expectedOutcome" value={fd.expectedOutcome} onChange={set} placeholder="What do you expect to achieve?" rows={2} style={{ resize: "none" }}/>
                    </div>
                  </>}

                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="cp-title">Review & Submit</div>
                <div className="cp-sub">Confirm your application details</div>
                <div className="cp-rev-badge">{ROLES.find(r => r.value === role)?.icon}{ROLES.find(r => r.value === role)?.label}</div>
                <div className="cp-rev-table">
                  {reviewRows().map(([k, v]) => (
                    <div className="cp-rev-row" key={k}>
                      <span className="cp-rev-k">{k}</span>
                      <span className="cp-rev-v">{v || "—"}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <label className="cp-ck-lbl"><input type="checkbox" name="agreeTerms" checked={fd.agreeTerms} onChange={set}/>I agree to the <span style={{ color: "#e67e22", textDecoration: "underline", marginLeft: 4 }}>Terms & Conditions</span></label>
                  {E("agreeTerms")}
                  {role === "student" && <>
                    <label className="cp-ck-lbl"><input type="checkbox" name="agreePrivacy" checked={fd.agreePrivacy} onChange={set}/>I agree to the <span style={{ color: "#e67e22", textDecoration: "underline", marginLeft: 4 }}>Privacy Policy</span></label>
                    {E("agreePrivacy")}
                  </>}
                </div>
                <div className="cp-rev-note" style={{ marginTop: 12 }}>
                  <IMail/>After submission, verify your email. Admin will approve your account within 24 hours.
                </div>
              </>
            )}

          </div>

          <div className="cp-foot">
            <span className="cp-step-lbl">Step {step} of {TOTAL_STEPS}</span>
            <div className="cp-foot-r">
              {step > 1 && <button className="cp-btn-back" onClick={back}>← Back</button>}
              {step < 3 && <button className="cp-btn-next" onClick={next} disabled={step === 1 && !role}>{continueLabel}</button>}
              {step === 3 && (
                <button className="cp-btn-sub" onClick={handleSubmit} disabled={loading}>
                  {loading ? <><ISpinner/> Submitting…</> : <><ICheck s={14}/> Submit</>}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}