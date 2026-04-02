import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: "Role" },
  { id: 2, label: "Details" },
  { id: 3, label: "Review" },
];

const ROLES = [
  { value: "student",      label: "Student",      desc: "Learn & grow with 300+ courses"           },
  { value: "trainer",      label: "Trainer",      desc: "Teach & inspire thousands of learners"    },
  { value: "Tenant Admin", label: "Tenant Admin", desc: "Scale your team with structured learning" },
];

/* ─────────────────────────────────────────────
   SVG ICONS
───────────────────────────────────────────── */
const IUser      = ({ s=18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IClip      = ({ s=18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>;
const ICheck     = ({ s=18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IGrad      = ({ s=22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const IMic       = ({ s=22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10a7 7 0 0 1-14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>;
const IBriefcase = ({ s=22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const ILock      = ({ s=14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IMail      = ({ s=15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IInfo      = ({ s=15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IEyeOn     = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IEyeOff    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const ISpinner   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite"/></path></svg>;
const ITick      = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IChevron   = ({ open }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition:"transform 0.36s cubic-bezier(.4,0,.2,1)", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink:0 }}><polyline points="6 9 12 15 18 9"/></svg>;

const ROLE_ICONS = {
  student:        <IGrad s={22} />,
  trainer:        <IMic  s={22} />,
  "Tenant Admin": <IBriefcase s={22} />,
};

/* ─────────────────────────────────────────────
   SMOOTH ACCORDION PANEL
───────────────────────────────────────────── */
function AccPanel({ open, children }) {
  const ref = useRef(null);
  const [h, setH] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    if (open) {
      const measure = () => setH(ref.current?.scrollHeight || 0);
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(ref.current);
      return () => ro.disconnect();
    } else { setH(0); }
  }, [open, children]);
  return (
    <div style={{ overflow:"hidden", height: open ? h : 0, transition:"height 0.38s cubic-bezier(.4,0,.2,1)" }}>
      <div ref={ref}>{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function CompleteProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const stored   = (() => { try { return JSON.parse(localStorage.getItem("lms_user") || "{}"); } catch { return {}; } })();
  const isGoogle = location.state?.isGoogleUser || false;

  const [step,    setStep]    = useState(1);
  const [role,    setRole]    = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const [errors,  setErrors]  = useState({});

  const [fd, setFd] = useState({
    name: stored.name || location.state?.name || "",
    email: stored.email || location.state?.email || "",
    password: "", confirmPassword: "", mobile: "",
    dob:"", gender:"", city:"", state:"", country:"",
    qualification:"", collegeName:"", yearOfPassing:"", currentStatus:"",
    agreeTerms: false, agreePrivacy: false,
    linkedin:"", shareExpertise:[], audienceSize:"", fullTimeRole:"", expertise:"", experience:"",
    businessName:"", businessType:"", industry:"", cityState:"", website:"",
    companySize:"", yearsExperience:"", aboutBusiness:"", expectedOutcome:"", lookingFor:[],
  });

  useEffect(() => {
    if (location.state?.name || location.state?.email) {
      setFd(p => ({ ...p, name: location.state.name || p.name, email: location.state.email || p.email }));
    }
  }, [location.state]);

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setFd(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const toggleArr = (key, val) => {
    setFd(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val] }));
  };

  const validate2 = () => {
    const e = {};
    if (!fd.name.trim())  e.name  = "Name is required";
    if (!fd.email.trim()) e.email = "Email is required";

    if (role === "student") {
      if (!isGoogle) {
        if (!fd.password)              e.password = "Password is required";
        else if (fd.password.length<6) e.password = "Min 6 characters";
      }
      if (!fd.mobile)         e.mobile         = "Mobile is required";
      if (!fd.dob)            e.dob            = "Date of birth is required";
      if (!fd.gender)         e.gender         = "Gender is required";
      if (!fd.city)           e.city           = "City is required";
      if (!fd.state)          e.state          = "State is required";
      if (!fd.country)        e.country        = "Country is required";
      if (!fd.qualification)  e.qualification  = "Qualification is required";
      if (!fd.collegeName)    e.collegeName    = "College name is required";
      if (!fd.yearOfPassing)  e.yearOfPassing  = "Year of passing is required";
      if (!fd.currentStatus)  e.currentStatus  = "Current status is required";
    }

    if (role === "trainer") {
      if (!isGoogle) {
        if (!fd.password)               e.password = "Password is required";
        else if (fd.password.length<11) e.password = "Min 11 characters";
        if (!fd.confirmPassword)        e.confirmPassword = "Please confirm password";
        else if (fd.password !== fd.confirmPassword) e.confirmPassword = "Passwords do not match";
      }
      if (!fd.mobile)                   e.mobile       = "Mobile is required";
      if (!fd.linkedin)                 e.linkedin     = "LinkedIn URL is required";
      if (!fd.country)                  e.country      = "Country is required";
      if (!fd.expertise)                e.expertise    = "Area of expertise is required";
      if (!fd.experience)               e.experience   = "Years of experience is required";
      if (!fd.audienceSize)             e.audienceSize = "Audience size is required";
      if (!fd.fullTimeRole)             e.fullTimeRole = "Please select";
      if (!fd.shareExpertise.length)    e.shareExpertise = "Select at least one";
    }

    if (role === "Tenant Admin") {
      if (!isGoogle) {
        if (!fd.password)               e.password = "Password is required";
        else if (fd.password.length<11) e.password = "Min 11 characters";
        if (!fd.confirmPassword)        e.confirmPassword = "Please confirm password";
        else if (fd.password !== fd.confirmPassword) e.confirmPassword = "Passwords do not match";
      }
      if (!fd.businessName)    e.businessName    = "Business name is required";
      if (!fd.mobile)          e.mobile          = "Mobile is required";
      if (!fd.businessType)    e.businessType    = "Business type is required";
      if (!fd.industry)        e.industry        = "Industry is required";
      if (!fd.cityState)       e.cityState       = "City & State is required";
      if (!fd.companySize)     e.companySize     = "Company size is required";
      if (!fd.yearsExperience) e.yearsExperience = "Years of experience is required";
      if (!fd.lookingFor.length) e.lookingFor    = "Select at least one";
      if (!fd.aboutBusiness)   e.aboutBusiness   = "About business is required";
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
    if (step === 1 && !role) { setErrors({ role: "Please select a role" }); return; }
    if (step === 2) {
      const valid = validate2();
      if (!valid) {
        // Switch to the tab that contains the first error so user can see it
        const e = {};
        if (!fd.name.trim()) e.name = true;
        if (!fd.mobile) e.mobile = true;
        if (!isGoogle && !fd.password) e.password = true;
        if (!isGoogle && (role === "trainer" || role === "Tenant Admin") && !fd.confirmPassword) e.confirmPassword = true;

        const accountFields = ["name","email","password","confirmPassword","mobile"];
        const locationFields = ["dob","gender","city","state","country"];
        const educationFields = ["qualification","collegeName","yearOfPassing","currentStatus"];
        const profileFields = ["linkedin","country","expertise","experience","fullTimeRole"];
        const reachFields = ["audienceSize","shareExpertise"];
        const businessFields = ["businessName","cityState","businessType","industry","companySize","yearsExperience","website"];
        const goalsFields = ["lookingFor","aboutBusiness"];

        // get all error keys from validate2
        const errKeys = Object.keys((() => {
          const e2 = {};
          if (!fd.name.trim()) e2.name = 1;
          if (!fd.email.trim()) e2.email = 1;
          if (role === "student") {
            if (!isGoogle && !fd.password) e2.password = 1;
            if (!fd.mobile) e2.mobile = 1;
            if (!fd.dob) e2.dob = 1;
            if (!fd.gender) e2.gender = 1;
            if (!fd.city) e2.city = 1;
            if (!fd.state) e2.state = 1;
            if (!fd.country) e2.country = 1;
            if (!fd.qualification) e2.qualification = 1;
            if (!fd.collegeName) e2.collegeName = 1;
            if (!fd.yearOfPassing) e2.yearOfPassing = 1;
            if (!fd.currentStatus) e2.currentStatus = 1;
          }
          if (role === "trainer") {
            if (!isGoogle) { if (!fd.password) e2.password = 1; if (!fd.confirmPassword) e2.confirmPassword = 1; }
            if (!fd.mobile) e2.mobile = 1;
            if (!fd.linkedin) e2.linkedin = 1;
            if (!fd.country) e2.country = 1;
            if (!fd.expertise) e2.expertise = 1;
            if (!fd.experience) e2.experience = 1;
            if (!fd.audienceSize) e2.audienceSize = 1;
            if (!fd.fullTimeRole) e2.fullTimeRole = 1;
            if (!fd.shareExpertise.length) e2.shareExpertise = 1;
          }
          if (role === "Tenant Admin") {
            if (!isGoogle) { if (!fd.password) e2.password = 1; if (!fd.confirmPassword) e2.confirmPassword = 1; }
            if (!fd.businessName) e2.businessName = 1;
            if (!fd.mobile) e2.mobile = 1;
            if (!fd.businessType) e2.businessType = 1;
            if (!fd.industry) e2.industry = 1;
            if (!fd.cityState) e2.cityState = 1;
            if (!fd.companySize) e2.companySize = 1;
            if (!fd.yearsExperience) e2.yearsExperience = 1;
            if (!fd.lookingFor.length) e2.lookingFor = 1;
            if (!fd.aboutBusiness) e2.aboutBusiness = 1;
          }
          return e2;
        })());

        const firstErr = errKeys[0];
        if (firstErr) {
          if (accountFields.includes(firstErr)) setSubPanel("account");
          else if (locationFields.includes(firstErr)) setSubPanel("location");
          else if (educationFields.includes(firstErr)) setSubPanel("education");
          else if (profileFields.includes(firstErr)) setSubPanel("profile");
          else if (reachFields.includes(firstErr)) setSubPanel("reach");
          else if (businessFields.includes(firstErr)) setSubPanel("business");
          else if (goalsFields.includes(firstErr)) setSubPanel("goals");
        }
        return;
      }
    }
    setStep(s => Math.min(s + 1, 3));
    setErrors({});
  };

  const back = () => { setStep(s => s - 1); setErrors({}); };
  const handleSkip = () => navigate("/ilm-demo", { replace: true });

  const handleSubmit = async () => {
    if (!validate3()) return;
    setLoading(true);
    try {
      await authService.register({
        name: fd.name, email: fd.email,
        password: isGoogle ? null : fd.password,
        role: role === "student" ? "STUDENT" : role === "trainer" ? "TRAINER" : "TENANT_ADMIN",
        isGoogleUser: isGoogle,
        ...fd,
      });
      localStorage.setItem("role", role.toUpperCase());
      localStorage.setItem("lms_user", JSON.stringify({ name: fd.name, email: fd.email, role }));
      alert("✅ Application submitted!\n\nPlease verify your email. Admin will approve your account.");
      navigate(`/verify-email?email=${encodeURIComponent(fd.email)}`);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || "Submission failed";
      alert(msg);
      if (msg.toLowerCase().includes("verify")) navigate(`/verify-email?email=${encodeURIComponent(fd.email)}`);
    } finally { setLoading(false); }
  };

  const selectedRole = ROLES.find(r => r.value === role);
  const panelSt = id => id < step ? "done" : id === step ? "active" : "locked";

  const inp = "cp-inp";
  const sel = "cp-inp cp-sel";
  const E   = (k) => errors[k] ? <span className="cp-ferr">⚠ {errors[k]}</span> : null;

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
      ["Business Name", fd.businessName], ["Mobile", fd.mobile],
      ["Business Type", fd.businessType], ["Industry", fd.industry],
      ["City & State", fd.cityState], ["Website", fd.website || "—"],
      ["Company Size", fd.companySize], ["Experience", fd.yearsExperience ? fd.yearsExperience + " yrs" : "—"],
      ["Looking For", fd.lookingFor.join(", ") || "—"], ["About", fd.aboutBusiness],
    ];
    return base;
  };

  /* ── Sub-panels for Details step ── */
  const [subPanel, setSubPanel] = useState("account");

  const subPanels_student = [
    { id: "account",   label: "Account",   icon: <IUser s={15}/> },
    { id: "location",  label: "Location",  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
    { id: "education", label: "Education", icon: <IGrad s={15}/> },
  ];

  const subPanels_trainer = [
    { id: "account",  label: "Account",   icon: <IUser s={15}/> },
    { id: "profile",  label: "Profile",   icon: <IMic s={15}/> },
    { id: "reach",    label: "Reach",     icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> },
  ];

  const subPanels_tenant = [
    { id: "account",  label: "Account",   icon: <IUser s={15}/> },
    { id: "business", label: "Business",  icon: <IBriefcase s={15}/> },
    { id: "goals",    label: "Goals",     icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> },
  ];

  const getSubPanels = () => {
    if (role === "student") return subPanels_student;
    if (role === "trainer") return subPanels_trainer;
    if (role === "Tenant Admin") return subPanels_tenant;
    return [];
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        .cp-pg{font-family:'DM Sans',sans-serif;min-height:100vh;background:#f5ece1;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow-x:hidden;padding:20px 16px}
        .cp-pg::before{content:'';position:fixed;inset:0;z-index:0;background-image:radial-gradient(circle,rgba(180,100,30,.08)1px,transparent 1px);background-size:28px 28px;pointer-events:none}

        /* centered card container */
        .cp-card{position:relative;z-index:10;width:100%;max-width:520px;background:rgba(255,255,255,.92);border-radius:22px;box-shadow:0 24px 64px rgba(160,80,20,.15),0 2px 8px rgba(160,80,20,.06);border:1px solid rgba(249,115,22,.16);overflow:hidden;animation:cpUp .45s ease both}
        @keyframes cpUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

        /* card header */
        .cp-hdr{padding:20px 24px 16px;border-bottom:1px solid rgba(249,115,22,.1);background:rgba(245,236,225,.5)}
        .cp-hdr-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
        .cp-logo{display:flex;align-items:center;gap:2px}
        .cp-ilm{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:900;color:#16a34a}
        .cp-ora{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:900;color:#F97316}
        .cp-skiptop{background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.73rem;color:#b8906a;transition:color .2s;padding:0;font-weight:500}
        .cp-skiptop:hover{color:#F97316}
        .cp-hdr-sub{font-size:.75rem;color:#8a6040;margin-bottom:14px;line-height:1.5}

        /* step bar */
        .cp-bar{display:flex;align-items:center;gap:0}
        .cp-spill{display:flex;align-items:center;gap:6px;padding:5px 11px;border-radius:999px;font-size:.72rem;font-weight:700;transition:all .3s;white-space:nowrap;cursor:default}
        .cp-spill.done{background:rgba(34,197,94,.12);color:#15803d;border:1px solid rgba(34,197,94,.3);cursor:pointer}
        .cp-spill.active{background:rgba(249,115,22,.12);color:#c2410c;border:1px solid rgba(249,115,22,.4)}
        .cp-spill.locked{background:rgba(255,255,255,.6);color:#b8906a;border:1px solid rgba(180,120,60,.15)}
        .cp-snum{width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.58rem;font-weight:800;color:#fff;flex-shrink:0}
        .cp-snum.done{background:#22c55e}.cp-snum.active{background:#F97316}.cp-snum.locked{background:rgba(180,120,60,.25);color:#b8906a}
        .cp-sline{flex:1;height:1px;background:rgba(180,120,60,.18);margin:0 6px}
        .cp-sline.done{background:rgba(34,197,94,.4)}

        /* card body — scrollable */
        .cp-cbody{padding:0;max-height:62vh;overflow-y:auto;overscroll-behavior:contain}
        .cp-cbody::-webkit-scrollbar{width:4px}
        .cp-cbody::-webkit-scrollbar-thumb{background:rgba(249,115,22,.25);border-radius:4px}

        /* section within body */
        .cp-section{padding:16px 24px}
        .cp-section+.cp-section{border-top:1px solid rgba(249,115,22,.08)}

        /* panel header inside body */
        .cp-phd{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
        .cp-phd-l{display:flex;align-items:center;gap:8px}
        .cp-picon{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .cp-picon.active{background:linear-gradient(135deg,#F97316,#ea580c);color:#fff;box-shadow:0 3px 10px rgba(249,115,22,.28)}
        .cp-picon.done{background:rgba(34,197,94,.1);color:#16a34a;border:1px solid rgba(34,197,94,.2)}
        .cp-picon.locked{background:rgba(180,120,60,.07);color:rgba(180,120,60,.3)}
        .cp-ptitle{font-size:.85rem;font-weight:700;color:#1e0e02}
        .cp-psub{font-size:.68rem;color:#b8906a;margin-top:1px}
        .cp-dbadge{display:inline-flex;align-items:center;gap:4px;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.22);border-radius:999px;padding:2px 8px;font-size:.62rem;font-weight:700;color:#15803d;letter-spacing:.04em;text-transform:uppercase}

        /* sub-panel tab nav */
        .cp-tabs{display:flex;gap:6px;margin-bottom:14px;padding:3px;background:rgba(245,236,225,.7);border-radius:10px;border:1px solid rgba(180,120,60,.12)}
        .cp-tab{flex:1;display:flex;align-items:center;justify-content:center;gap:5px;padding:7px 8px;border:none;background:transparent;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:.72rem;font-weight:600;color:#b8906a;cursor:pointer;transition:all .22s;white-space:nowrap}
        .cp-tab.active{background:#fff;color:#c2410c;box-shadow:0 2px 8px rgba(249,115,22,.12);border:1px solid rgba(249,115,22,.2)}
        .cp-tab:hover:not(.active){color:#F97316;background:rgba(255,255,255,.5)}

        /* role grid */
        .cp-rgrid{display:flex;flex-direction:column;gap:8px}
        .cp-ropt{display:flex;align-items:center;gap:10px;padding:10px 13px;background:rgba(255,255,255,.7);border:1.5px solid rgba(180,120,60,.15);border-radius:11px;cursor:pointer;transition:all .2s;box-shadow:0 2px 6px rgba(160,80,20,.04)}
        .cp-ropt:hover{border-color:rgba(249,115,22,.35);background:rgba(249,115,22,.04)}
        .cp-ropt.sel{border-color:rgba(249,115,22,.5);background:rgba(249,115,22,.07);box-shadow:0 3px 12px rgba(249,115,22,.1)}
        .cp-ribox{width:36px;height:36px;border-radius:10px;background:rgba(249,115,22,.08);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#c2410c}
        .cp-rlabel{font-size:.84rem;font-weight:700;color:#1e0e02}
        .cp-rdesc{font-size:.69rem;color:#b8906a;margin-top:1px;line-height:1.4}
        .cp-rradio{margin-left:auto;flex-shrink:0;width:16px;height:16px;border-radius:50%;border:2px solid rgba(180,120,60,.3);display:flex;align-items:center;justify-content:center;transition:border-color .2s}
        .cp-rradio.sel{border-color:#F97316}
        .cp-rdot{width:7px;height:7px;border-radius:50%;background:#F97316}

        /* fields */
        .cp-fstack{display:flex;flex-direction:column;gap:10px}
        .cp-field{display:flex;flex-direction:column;gap:3px}
        .cp-field label{font-size:.65rem;font-weight:700;color:#8a6040;letter-spacing:.06em;text-transform:uppercase}
        .cp-inp{width:100%;padding:9px 12px;background:rgba(255,255,255,.85);border:1.5px solid rgba(180,120,60,.2);border-radius:9px;color:#1a0e06;font-family:'DM Sans',sans-serif;font-size:.855rem;outline:none;transition:border-color .2s,box-shadow .2s}
        .cp-inp::placeholder{color:#c0a070}
        .cp-inp:focus{border-color:#F97316;box-shadow:0 0 0 3px rgba(249,115,22,.1);background:#fff}
        .cp-inp:disabled{opacity:.45;cursor:not-allowed}
        .cp-sel option{background:#fff;color:#1a0e06}
        .cp-ferr{font-size:.65rem;color:#dc2626;margin-top:1px}
        .cp-opt-tag{font-size:.58rem;color:#b8906a;font-weight:500;background:rgba(180,120,60,.1);border-radius:4px;padding:1px 5px;margin-left:4px;text-transform:lowercase;letter-spacing:0}
        .cp-row2{display:grid;grid-template-columns:1fr 1fr;gap:9px}
        .cp-pwrap{position:relative}
        .cp-pwrap .cp-inp{padding-right:40px}
        .cp-eyebtn{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#b8906a;display:flex;align-items:center;padding:0;transition:color .2s}
        .cp-eyebtn:hover{color:#F97316}
        .cp-pwhint{font-size:.64rem;color:#b8906a;margin-top:2px}
        .cp-pwhint.ok{color:#16a34a}.cp-pwhint.bad{color:#dc2626}
        .cp-note{display:flex;align-items:flex-start;gap:6px;background:rgba(59,130,246,.07);border:1px solid rgba(59,130,246,.2);border-radius:8px;padding:8px 12px;font-size:.7rem;color:#1e40af;line-height:1.5;margin-bottom:10px}

        /* checkbox / radio groups */
        .cp-cklabel{display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.7);border:1.5px solid rgba(180,120,60,.13);border-radius:8px;padding:8px 11px;cursor:pointer;font-size:.78rem;color:#1e0e02;transition:all .2s;font-weight:500}
        .cp-cklabel:hover{border-color:rgba(249,115,22,.3);background:rgba(249,115,22,.04)}
        .cp-cklabel input{width:13px;height:13px;accent-color:#F97316;flex-shrink:0}
        .cp-ckgrid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
        .cp-radlabel{display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.7);border:1.5px solid rgba(180,120,60,.13);border-radius:8px;padding:8px 11px;cursor:pointer;font-size:.78rem;color:#1e0e02;font-weight:500;transition:all .2s}
        .cp-radlabel:hover{border-color:rgba(249,115,22,.3);background:rgba(249,115,22,.04)}
        .cp-radlabel input{width:13px;height:13px;accent-color:#F97316;flex-shrink:0}

        /* review table */
        .cp-rbadge{display:inline-flex;align-items:center;gap:6px;background:rgba(249,115,22,.1);border:1px solid rgba(249,115,22,.3);border-radius:8px;padding:4px 12px;font-size:.78rem;font-weight:700;color:#c2410c;margin-bottom:10px}
        .cp-rtable{background:rgba(255,255,255,.6);border:1px solid rgba(180,120,60,.15);border-radius:11px;overflow:hidden}
        .cp-rrow{display:flex;align-items:center;justify-content:space-between;padding:7px 13px;border-bottom:1px solid rgba(180,120,60,.1)}
        .cp-rrow:last-child{border-bottom:none}
        .cp-rkey{font-size:.7rem;font-weight:600;color:#b8906a;flex-shrink:0}
        .cp-rval{font-size:.75rem;font-weight:700;color:#1e0e02;text-align:right;max-width:58%;word-break:break-all}
        .cp-rinfo{font-size:.7rem;color:#8a6040;line-height:1.6;display:flex;align-items:flex-start;gap:6px;margin-top:10px}

        /* card footer */
        .cp-foot{display:flex;align-items:center;justify-content:space-between;padding:12px 24px;border-top:1px solid rgba(249,115,22,.1);background:rgba(245,236,225,.4);gap:10px}
        .cp-skipfoot{background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.73rem;color:#b8906a;padding:0;transition:color .2s}
        .cp-skipfoot:hover{color:#F97316}
        .cp-btnnext{padding:9px 22px;background:linear-gradient(135deg,#F97316,#ea580c);border:none;border-radius:9px;color:#fff;font-family:'DM Sans',sans-serif;font-size:.86rem;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(249,115,22,.28);transition:opacity .2s,transform .15s}
        .cp-btnnext:hover:not(:disabled){opacity:.9;transform:translateY(-1px)}
        .cp-btnnext:disabled{opacity:.45;cursor:not-allowed}
        .cp-btnback{padding:9px 16px;background:rgba(180,120,60,.1);border:1px solid rgba(180,120,60,.2);border-radius:9px;color:#8a6040;font-family:'DM Sans',sans-serif;font-size:.86rem;font-weight:600;cursor:pointer;transition:all .2s}
        .cp-btnback:hover{background:rgba(180,120,60,.16)}
        .cp-btnsubmit{padding:9px 20px;background:linear-gradient(135deg,#22c55e,#16a34a);border:none;border-radius:9px;color:#fff;font-family:'DM Sans',sans-serif;font-size:.86rem;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(34,197,94,.22);transition:opacity .2s;display:flex;align-items:center;justify-content:center;gap:6px}
        .cp-btnsubmit:hover:not(:disabled){opacity:.9}
        .cp-btnsubmit:disabled{opacity:.45;cursor:not-allowed}
        .cp-errg{font-size:.7rem;color:#dc2626;margin-top:4px}

        @media(max-width:520px){
          .cp-row2{grid-template-columns:1fr}
          .cp-ckgrid{grid-template-columns:1fr}
          .cp-card{border-radius:16px}
          .cp-cbody{max-height:55vh}
        }
      `}</style>

      <div className="cp-pg">
        <div className="cp-card">

          {/* ── Card Header ── */}
          <div className="cp-hdr">
            <div className="cp-hdr-top">
              <div className="cp-logo">
                <span className="cp-ilm">ILM</span><span className="cp-ora">ORA</span>
              </div>
              <button className="cp-skiptop" onClick={handleSkip}>Skip for now →</button>
            </div>
            <div className="cp-hdr-sub">Complete your profile to unlock your personalised dashboard.</div>

            {/* Step Bar */}
            <div className="cp-bar">
              {STEPS.map((s, i) => {
                const st = panelSt(s.id);
                return (
                  <React.Fragment key={s.id}>
                    <div className={`cp-spill ${st}`} onClick={() => st === "done" && setStep(s.id)}>
                      <div className={`cp-snum ${st}`}>{st === "done" ? <ITick /> : s.id}</div>
                      {s.label}
                    </div>
                    {i < STEPS.length - 1 && <div className={`cp-sline ${step > s.id ? "done" : ""}`} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* ── Card Body (scrollable) ── */}
          <div className="cp-cbody">

            {/* ════ STEP 1 — Role ════ */}
            {step === 1 && (
              <div className="cp-section">
                <div className="cp-phd">
                  <div className="cp-phd-l">
                    <div className="cp-picon active"><IUser s={16}/></div>
                    <div>
                      <div className="cp-ptitle">Choose your role</div>
                      <div className="cp-psub">Select how you'll use ILM ORA</div>
                    </div>
                  </div>
                </div>
                <div className="cp-rgrid">
                  {ROLES.map(r => (
                    <div key={r.value} className={`cp-ropt ${role===r.value?"sel":""}`}
                      onClick={()=>{setRole(r.value);setErrors({});}}>
                      <div className="cp-ribox">{ROLE_ICONS[r.value]}</div>
                      <div>
                        <div className="cp-rlabel">{r.label}</div>
                        <div className="cp-rdesc">{r.desc}</div>
                      </div>
                      <div className={`cp-rradio ${role===r.value?"sel":""}`}>
                        {role===r.value && <div className="cp-rdot"/>}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.role && <p className="cp-errg">⚠ {errors.role}</p>}
              </div>
            )}

            {/* ════ STEP 2 — Details ════ */}
            {step === 2 && (
              <div className="cp-section">
                <div className="cp-phd">
                  <div className="cp-phd-l">
                    <div className="cp-picon active"><IClip s={16}/></div>
                    <div>
                      <div className="cp-ptitle">{selectedRole ? `${selectedRole.label} Details` : "Your Details"}</div>
                      <div className="cp-psub">Fill your information carefully</div>
                    </div>
                  </div>
                </div>

                {isGoogle && (
                  <div className="cp-note">
                    <IInfo s={14}/>
                    Signed in with Google. Create a password to also log in via email &amp; password.
                  </div>
                )}

                {/* Sub-panel tabs */}
                {role && (
                  <div className="cp-tabs">
                    {getSubPanels().map(sp => (
                      <button key={sp.id} className={`cp-tab ${subPanel===sp.id?"active":""}`}
                        onClick={()=>setSubPanel(sp.id)}>
                        {sp.icon}{sp.label}
                      </button>
                    ))}
                  </div>
                )}

                <div className="cp-fstack">

                  {/* ── Account sub-panel (common across all roles) ── */}
                  {subPanel === "account" && <>
                    <div className="cp-row2">
                      <div className="cp-field">
                        <label>Full Name <span style={{color:"#dc2626"}}>*</span></label>
                        <input className={inp} type="text" name="name" value={fd.name} onChange={set} placeholder="Your full name"/>
                        {E("name")}
                      </div>
                      <div className="cp-field">
                        <label>Email Address</label>
                        <input className={inp} type="email" value={fd.email} disabled/>
                      </div>
                    </div>
                    {!isGoogle && (
                      <div className="cp-field">
                        <label>Create Password <span style={{color:"#dc2626"}}>*</span></label>
                        <div className="cp-pwrap">
                          <input className={inp} type={showPw?"text":"password"} name="password" value={fd.password} onChange={set}
                            placeholder={role==="student"?"Min 6 characters":"Min 11 characters"}/>
                          <button type="button" className="cp-eyebtn" onClick={()=>setShowPw(p=>!p)} tabIndex={-1}>{showPw?<IEyeOff/>:<IEyeOn/>}</button>
                        </div>
                        {fd.password && (() => {
                          const min = role==="student" ? 6 : 11;
                          return <span className={`cp-pwhint ${fd.password.length>=min?"ok":"bad"}`}>
                            {fd.password.length>=min?"✓ Strong enough":`⚠ Min ${min} chars (${fd.password.length}/${min})`}
                          </span>;
                        })()}
                        {E("password")}
                      </div>
                    )}
                    {(role === "trainer" || role === "Tenant Admin") && !isGoogle && (
                      <div className="cp-field">
                        <label>Confirm Password <span style={{color:"#dc2626"}}>*</span></label>
                        <input className={inp} type="password" name="confirmPassword" value={fd.confirmPassword} onChange={set} placeholder="Re-enter password"/>
                        {fd.confirmPassword && fd.password!==fd.confirmPassword && <span className="cp-pwhint bad">❌ Passwords do not match</span>}
                        {E("confirmPassword")}
                      </div>
                    )}
                    <div className="cp-field">
                      <label>Mobile <span style={{color:"#dc2626"}}>*</span></label>
                      <input className={inp} type="tel" name="mobile" value={fd.mobile} onChange={set} placeholder="+91 9876543210"/>
                      {E("mobile")}
                    </div>
                  </>}

                  {/* ══ STUDENT — Location sub-panel ══ */}
                  {role === "student" && subPanel === "location" && <>
                    <div className="cp-row2">
                      <div className="cp-field">
                        <label>Date of Birth <span style={{color:"#dc2626"}}>*</span></label>
                        <input className={inp} type="date" name="dob" value={fd.dob} onChange={set}/>
                        {E("dob")}
                      </div>
                      <div className="cp-field">
                        <label>Gender <span style={{color:"#dc2626"}}>*</span></label>
                        <select className={sel} name="gender" value={fd.gender} onChange={set}>
                          <option value="">Select</option>
                          {["Male","Female","Other"].map(o=><option key={o}>{o}</option>)}
                        </select>
                        {E("gender")}
                      </div>
                    </div>
                    <div className="cp-row2">
                      <div className="cp-field">
                        <label>City <span style={{color:"#dc2626"}}>*</span></label>
                        <input className={inp} type="text" name="city" value={fd.city} onChange={set} placeholder="Your city"/>
                        {E("city")}
                      </div>
                      <div className="cp-field">
                        <label>State <span style={{color:"#dc2626"}}>*</span></label>
                        <input className={inp} type="text" name="state" value={fd.state} onChange={set} placeholder="State"/>
                        {E("state")}
                      </div>
                    </div>
                    <div className="cp-field">
                      <label>Country <span style={{color:"#dc2626"}}>*</span></label>
                      <input className={inp} type="text" name="country" value={fd.country} onChange={set} placeholder="Country"/>
                      {E("country")}
                    </div>
                  </>}

                  {/* ══ STUDENT — Education sub-panel ══ */}
                  {role === "student" && subPanel === "education" && <>
                    <div className="cp-field">
                      <label>Highest Qualification <span style={{color:"#dc2626"}}>*</span></label>
                      <select className={sel} name="qualification" value={fd.qualification} onChange={set}>
                        <option value="">Select Qualification</option>
                        {["10th","12th","Graduation","Post-Graduation","PhD"].map(o=><option key={o}>{o}</option>)}
                      </select>
                      {E("qualification")}
                    </div>
                    <div className="cp-row2">
                      <div className="cp-field">
                        <label>College / University <span style={{color:"#dc2626"}}>*</span></label>
                        <input className={inp} type="text" name="collegeName" value={fd.collegeName} onChange={set} placeholder="Institution name"/>
                        {E("collegeName")}
                      </div>
                      <div className="cp-field">
                        <label>Year of Passing <span style={{color:"#dc2626"}}>*</span></label>
                        <input className={inp} type="number" name="yearOfPassing" value={fd.yearOfPassing} onChange={set} placeholder="e.g. 2024" min="1950" max="2030"/>
                        {E("yearOfPassing")}
                      </div>
                    </div>
                    <div className="cp-field">
                      <label>Current Status <span style={{color:"#dc2626"}}>*</span></label>
                      <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:2}}>
                        {["Student","Working Professional","Fresher"].map(s=>(
                          <label key={s} className="cp-radlabel">
                            <input type="radio" name="currentStatus" value={s} checked={fd.currentStatus===s} onChange={set}/>{s}
                          </label>
                        ))}
                      </div>
                      {E("currentStatus")}
                    </div>
                  </>}

                  {/* ══ TRAINER — Profile sub-panel ══ */}
                  {role === "trainer" && subPanel === "profile" && <>
                    <div className="cp-field">
                      <label>LinkedIn Profile <span style={{color:"#dc2626"}}>*</span></label>
                      <input className={inp} type="url" name="linkedin" value={fd.linkedin} onChange={set} placeholder="https://linkedin.com/in/..."/>
                      {E("linkedin")}
                    </div>
                    <div className="cp-row2">
                      <div className="cp-field">
                        <label>Country <span style={{color:"#dc2626"}}>*</span></label>
                        <select className={sel} name="country" value={fd.country} onChange={set}>
                          <option value="">Select</option>
                          {["India","United States","United Kingdom","Canada","Other"].map(o=><option key={o}>{o}</option>)}
                        </select>
                        {E("country")}
                      </div>
                      <div className="cp-field">
                        <label>Full Time Role? <span style={{color:"#dc2626"}}>*</span></label>
                        <select className={sel} name="fullTimeRole" value={fd.fullTimeRole} onChange={set}>
                          <option value="">Select</option>
                          <option>Yes</option><option>No</option>
                        </select>
                        {E("fullTimeRole")}
                      </div>
                    </div>
                    <div className="cp-row2">
                      <div className="cp-field">
                        <label>Area of Expertise <span style={{color:"#dc2626"}}>*</span></label>
                        <input className={inp} type="text" name="expertise" value={fd.expertise} onChange={set} placeholder="e.g. Product Design"/>
                        {E("expertise")}
                      </div>
                      <div className="cp-field">
                        <label>Years of Experience <span style={{color:"#dc2626"}}>*</span></label>
                        <input className={inp} type="number" name="experience" value={fd.experience} onChange={set} placeholder="e.g. 5" min="0"/>
                        {E("experience")}
                      </div>
                    </div>
                  </>}

                  {/* ══ TRAINER — Reach sub-panel ══ */}
                  {role === "trainer" && subPanel === "reach" && <>
                    <div className="cp-field">
                      <label>Audience Size <span style={{color:"#dc2626"}}>*</span></label>
                      <select className={sel} name="audienceSize" value={fd.audienceSize} onChange={set}>
                        <option value="">Select</option>
                        {["0-500","500-2000","2000-5000","5000+"].map(o=><option key={o}>{o}</option>)}
                      </select>
                      {E("audienceSize")}
                    </div>
                    <div className="cp-field">
                      <label>Where do you share expertise? <span style={{color:"#dc2626"}}>*</span></label>
                      <div className="cp-ckgrid" style={{marginTop:4}}>
                        {["Blog","Newsletter","YouTube","Podcast","Social Media","Online courses"].map(item=>(
                          <label key={item} className="cp-cklabel">
                            <input type="checkbox" checked={fd.shareExpertise.includes(item)} onChange={()=>toggleArr("shareExpertise",item)}/>{item}
                          </label>
                        ))}
                      </div>
                      {E("shareExpertise")}
                    </div>
                  </>}

                  {/* ══ TENANT ADMIN — Business sub-panel ══ */}
                  {role === "Tenant Admin" && subPanel === "business" && <>
                    <div className="cp-row2">
                      <div className="cp-field">
                        <label>Business / Company Name <span style={{color:"#dc2626"}}>*</span></label>
                        <input className={inp} type="text" name="businessName" value={fd.businessName} onChange={set} placeholder="Your company"/>
                        {E("businessName")}
                      </div>
                      <div className="cp-field">
                        <label>City &amp; State <span style={{color:"#dc2626"}}>*</span></label>
                        <input className={inp} type="text" name="cityState" value={fd.cityState} onChange={set} placeholder="Mumbai, Maharashtra"/>
                        {E("cityState")}
                      </div>
                    </div>
                    <div className="cp-row2">
                      <div className="cp-field">
                        <label>Business Type <span style={{color:"#dc2626"}}>*</span></label>
                        <select className={sel} name="businessType" value={fd.businessType} onChange={set}>
                          <option value="">Select</option>
                          {["Startup","SME","Enterprise","Individual"].map(o=><option key={o}>{o}</option>)}
                        </select>
                        {E("businessType")}
                      </div>
                      <div className="cp-field">
                        <label>Industry <span style={{color:"#dc2626"}}>*</span></label>
                        <select className={sel} name="industry" value={fd.industry} onChange={set}>
                          <option value="">Select</option>
                          {["IT","Education","Finance","Retail","Healthcare","Manufacturing","Other"].map(o=><option key={o}>{o}</option>)}
                        </select>
                        {E("industry")}
                      </div>
                    </div>
                    <div className="cp-row2">
                      <div className="cp-field">
                        <label>Company Size <span style={{color:"#dc2626"}}>*</span></label>
                        <select className={sel} name="companySize" value={fd.companySize} onChange={set}>
                          <option value="">Select</option>
                          {["1-10","11-50","50+"].map(o=><option key={o}>{o}</option>)}
                        </select>
                        {E("companySize")}
                      </div>
                      <div className="cp-field">
                        <label>Years of Experience <span style={{color:"#dc2626"}}>*</span></label>
                        <input className={inp} type="text" name="yearsExperience" value={fd.yearsExperience} onChange={set} placeholder="e.g. 5"/>
                        {E("yearsExperience")}
                      </div>
                    </div>
                    <div className="cp-field">
                      <label>Website <span className="cp-opt-tag">optional</span></label>
                      <input className={inp} type="url" name="website" value={fd.website} onChange={set} placeholder="https://yourcompany.com"/>
                    </div>
                  </>}

                  {/* ══ TENANT ADMIN — Goals sub-panel ══ */}
                  {role === "Tenant Admin" && subPanel === "goals" && <>
                    <div className="cp-field">
                      <label>What are you looking for? <span style={{color:"#dc2626"}}>*</span></label>
                      <div className="cp-ckgrid" style={{marginTop:4}}>
                        {["Trainers","Students","Courses","Corporate Training"].map(item=>(
                          <label key={item} className="cp-cklabel">
                            <input type="checkbox" checked={fd.lookingFor.includes(item)} onChange={()=>toggleArr("lookingFor",item)}/>{item}
                          </label>
                        ))}
                      </div>
                      {E("lookingFor")}
                    </div>
                    <div className="cp-field">
                      <label>About Business <span style={{color:"#dc2626"}}>*</span></label>
                      <textarea className={inp} name="aboutBusiness" value={fd.aboutBusiness} onChange={set} placeholder="Short description of your business" rows={3} style={{resize:"none"}}/>
                      {E("aboutBusiness")}
                    </div>
                    <div className="cp-field">
                      <label>Expected Outcome <span className="cp-opt-tag">optional</span></label>
                      <textarea className={inp} name="expectedOutcome" value={fd.expectedOutcome} onChange={set} placeholder="What do you expect to achieve?" rows={2} style={{resize:"none"}}/>
                    </div>
                  </>}

                </div>{/* /cp-fstack */}
              </div>
            )}

            {/* ════ STEP 3 — Review & Submit ════ */}
            {step === 3 && (
              <div className="cp-section">
                <div className="cp-phd">
                  <div className="cp-phd-l">
                    <div className="cp-picon active"><ICheck s={16}/></div>
                    <div>
                      <div className="cp-ptitle">Review &amp; Submit</div>
                      <div className="cp-psub">Confirm your application details</div>
                    </div>
                  </div>
                </div>
                {selectedRole && (
                  <div className="cp-rbadge">
                    <span style={{color:"#c2410c"}}>{ROLE_ICONS[role]}</span>
                    {selectedRole.label}
                  </div>
                )}
                <div className="cp-rtable">
                  {reviewRows().map(([k,v])=>(
                    <div className="cp-rrow" key={k}>
                      <span className="cp-rkey">{k}</span>
                      <span className="cp-rval">{v||"—"}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:7,marginTop:12}}>
                  <label className="cp-cklabel">
                    <input type="checkbox" name="agreeTerms" checked={fd.agreeTerms} onChange={set}/>
                    I agree to the&nbsp;<span style={{color:"#F97316",textDecoration:"underline"}}>Terms &amp; Conditions</span>
                  </label>
                  {E("agreeTerms")}
                  {role === "student" && <>
                    <label className="cp-cklabel">
                      <input type="checkbox" name="agreePrivacy" checked={fd.agreePrivacy} onChange={set}/>
                      I agree to the&nbsp;<span style={{color:"#F97316",textDecoration:"underline"}}>Privacy Policy</span>
                    </label>
                    {E("agreePrivacy")}
                  </>}
                </div>
                <p className="cp-rinfo" style={{marginTop:10}}>
                  <IMail s={13}/>
                  After submission, verify your email. Admin will approve your account within 24 hours.
                </p>
              </div>
            )}

          </div>{/* /cp-cbody */}

          {/* ── Card Footer ── */}
          <div className="cp-foot">
            {step === 1 && (
              <>
                <button className="cp-skipfoot" onClick={handleSkip}>Skip for now</button>
                <button className="cp-btnnext" onClick={next} disabled={!role}>Continue →</button>
              </>
            )}
            {step === 2 && (
              <>
                <button className="cp-btnback" onClick={back}>← Back</button>
                <button className="cp-btnnext" onClick={next}>Continue →</button>
              </>
            )}
            {step === 3 && (
              <>
                <button className="cp-btnback" onClick={back}>← Back</button>
                <button className="cp-btnsubmit" onClick={handleSubmit} disabled={loading}>
                  {loading ? <><ISpinner/> Submitting…</> : <><ICheck s={14}/> Submit Application</>}
                </button>
              </>
            )}
          </div>

        </div>{/* /cp-card */}
      </div>
    </>
  );
}