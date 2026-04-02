
import { Briefcase } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../services/authService";

const ApplyBusiness = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isGoogleUser = location.state?.isGoogleUser || false;

  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    businessName:    "",
    ownerName:       "",
    businessEmail:   "",
    mobile:          "",
    businessType:    "",
    industry:        "",
    cityState:       "",
    website:         "",
    companySize:     "",
    yearsExperience: "",
    lookingFor:      [],
    aboutBusiness:   "",
    expectedOutcome: "",
    password:        "",
    confirmPassword: "",
    agreeTerms:      false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxGroup = (value) => {
    const current = formData.lookingFor;
    if (current.includes(value)) {
      setFormData((prev) => ({ ...prev, lookingFor: current.filter((i) => i !== value) }));
    } else {
      setFormData((prev) => ({ ...prev, lookingFor: [...current, value] }));
    }
  };

  const nextStep = () => setStep((p) => p + 1);
  const prevStep = () => setStep((p) => p - 1);

  const isStep1Valid =
    formData.businessName && formData.ownerName && formData.businessEmail &&
    formData.mobile && formData.businessType && formData.industry && formData.cityState;

  const isStep2Valid =
    formData.companySize && formData.yearsExperience &&
    formData.lookingFor.length > 0 && formData.aboutBusiness;

  const isStep3Valid =
    isGoogleUser ||
    (formData.password && formData.confirmPassword &&
      formData.password.length >= 11 &&
      formData.password === formData.confirmPassword);

  const handleSubmit = async () => {
    if (!formData.agreeTerms) { alert("Please agree to Terms & Conditions"); return; }
    if (!isGoogleUser && formData.password !== formData.confirmPassword) { alert("❌ Passwords do not match!"); return; }

    try {
      setLoading(true);
      await authService.register({
        name:         formData.ownerName,
        email:        formData.businessEmail,
        password:     isGoogleUser ? null : formData.password,
        role:         "BUSINESS",
        isGoogleUser: isGoogleUser,
      });
      alert("✅ Business Application Submitted!\n\n📩 Please verify your email first.\n⏳ After email verification, Admin will approve your account.\n\nThen you can login.");
      navigate(`/verify-email?email=${encodeURIComponent(formData.businessEmail)}`);
    } catch (err) {
      console.log("Business register error:", err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || "❌ Registration failed";
      alert(msg);
      if (msg.toLowerCase().includes("verify")) {
        navigate(`/verify-email?email=${encodeURIComponent(formData.businessEmail)}`);
        return;
      }
      if (msg.toLowerCase().includes("already")) navigate("/business/login");
    } finally {
      setLoading(false);
    }
  };

  const inputCls    = "w-full px-3 py-2.5 border border-slate-200 dark:border-gray-600 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 bg-slate-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all";
  const selectCls   = "w-full px-3 py-2.5 border border-slate-200 dark:border-gray-600 rounded-xl text-sm text-slate-800 dark:text-white bg-slate-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all";
  const textareaCls = "w-full px-3 py-2.5 border border-slate-200 dark:border-gray-600 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 bg-slate-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all resize-none";

  const STEP_LABELS = ["Business Details", "Profile", "Account", "Review"];

  const Progress = () => (
    <div className="flex items-center gap-1.5 mb-5">
      {[1, 2, 3, 4].map((n) => (
        <React.Fragment key={n}>
          <div className={`flex items-center justify-center h-6 w-6 rounded-full text-[10px] font-bold transition-all shrink-0
            ${step > n ? "bg-green-500 text-white" : step === n ? "bg-[#F97316] text-white" : "bg-slate-200 dark:bg-gray-700 text-slate-400"}`}>
            {step > n ? "✓" : n}
          </div>
          <span className={`text-[11px] font-medium hidden sm:block ${step === n ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-gray-500"}`}>
            {STEP_LABELS[n - 1]}
          </span>
          {n < 4 && <div className={`flex-1 h-0.5 rounded ${step > n ? "bg-green-400" : "bg-slate-200 dark:bg-gray-700"}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  const BackBtn = () => (
    <button onClick={prevStep}
      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-gray-300
        bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors">
      ← Back
    </button>
  );

  return (
    <div className="w-full max-w-lg mx-auto py-6 px-4 space-y-4">

      <div className="flex items-center gap-2.5">
        <Briefcase className="h-5 w-5 text-orange-500" />
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Apply for Business</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Complete the process in 4 steps</p>
        </div>
      </div>

      <Progress />

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-700 dark:text-gray-200 mb-3">Basic Business Details</p>
          <input name="businessName" placeholder="Business / Company Name" value={formData.businessName} onChange={handleChange} className={inputCls} />
          <input name="ownerName" placeholder="Owner / Founder Name" value={formData.ownerName} onChange={handleChange} className={inputCls} />
          <input name="businessEmail" type="email" placeholder="Business Email ID" value={formData.businessEmail} onChange={handleChange} className={inputCls} />
          <input name="mobile" type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} className={inputCls} />
          <select name="businessType" value={formData.businessType} onChange={handleChange} className={selectCls}>
            <option value="">Select Business Type</option>
            <option value="Startup">Startup</option>
            <option value="SME">SME</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Individual">Individual</option>
          </select>
          <select name="industry" value={formData.industry} onChange={handleChange} className={selectCls}>
            <option value="">Select Industry / Domain</option>
            <option value="IT">IT</option>
            <option value="Education">Education</option>
            <option value="Finance">Finance</option>
            <option value="Retail">Retail</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Other">Other</option>
          </select>
          <input name="cityState" placeholder="City & State" value={formData.cityState} onChange={handleChange} className={inputCls} />
          <input name="website" placeholder="Website (optional)" value={formData.website} onChange={handleChange} className={inputCls} />
          <button onClick={nextStep} disabled={!isStep1Valid}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow hover:opacity-90 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
            Next →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-700 dark:text-gray-200 mb-3">Business Profile & Requirements</p>
          <select name="companySize" value={formData.companySize} onChange={handleChange} className={selectCls}>
            <option value="">Select Company Size</option>
            <option value="1-10">1–10</option>
            <option value="11-50">11–50</option>
            <option value="50+">50+</option>
          </select>
          <input name="yearsExperience" placeholder="Years of Experience" value={formData.yearsExperience} onChange={handleChange} className={inputCls} />
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-2">What are you looking for?</p>
            <div className="grid grid-cols-2 gap-2">
              {["Trainers", "Students", "Courses", "Corporate Training"].map((item) => (
                <label key={item}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-800 px-3 py-2 cursor-pointer hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all">
                  <input type="checkbox" checked={formData.lookingFor.includes(item)} onChange={() => handleCheckboxGroup(item)} className="w-3.5 h-3.5 accent-orange-500 cursor-pointer" />
                  <span className="text-xs font-medium text-slate-700 dark:text-gray-300">{item}</span>
                </label>
              ))}
            </div>
          </div>
          <textarea name="aboutBusiness" placeholder="Short Description / About Business" value={formData.aboutBusiness} onChange={handleChange} rows={3} className={textareaCls} />
          <textarea name="expectedOutcome" placeholder="Expected Outcome (optional)" value={formData.expectedOutcome} onChange={handleChange} rows={2} className={textareaCls} />
          <div className="flex gap-3 pt-1">
            <BackBtn />
            <button onClick={nextStep} disabled={!isStep2Valid}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              Next →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-700 dark:text-gray-200 mb-3">Account Setup</p>
          <div className="flex items-start gap-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 px-3 py-2.5">
            <span className="text-base">📧</span>
            <p className="text-xs text-blue-700 dark:text-blue-300">You can log in using this Email ID and Password</p>
          </div>
          <input name="businessEmail" type="email" value={formData.businessEmail} disabled className={`${inputCls} opacity-60 cursor-not-allowed`} />
          {!isGoogleUser && (
            <>
              <input name="password" type="password" placeholder="Password (min 11 characters)" value={formData.password} onChange={handleChange} className={inputCls} />
              <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className={inputCls} />
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500 font-medium">❌ Passwords are not matching</p>
              )}
            </>
          )}
          <div className="flex gap-3 pt-1">
            <BackBtn />
            <button onClick={nextStep} disabled={!isStep3Valid}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              Next →
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-700 dark:text-gray-200 mb-3">Review & Submit</p>
          <div className="rounded-xl border border-slate-100 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 p-4 space-y-2">
            {[
              ["Business Name",  formData.businessName],
              ["Owner Name",     formData.ownerName],
              ["Email",          formData.businessEmail],
              ["Mobile",         formData.mobile],
              ["Business Type",  formData.businessType],
              ["Industry",       formData.industry],
              ["Location",       formData.cityState],
              ["Website",        formData.website],
              ["Company Size",   formData.companySize],
              ["Experience",     formData.yearsExperience],
              ["Looking For",    formData.lookingFor.join(", ")],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between text-xs gap-2">
                <span className="font-semibold text-slate-500 dark:text-gray-400 shrink-0">{label}</span>
                <span className="text-slate-800 dark:text-white font-medium text-right">{val || "—"}</span>
              </div>
            ))}
          </div>
          <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-gray-300 cursor-pointer">
            <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="mt-0.5 w-4 h-4 accent-orange-500 cursor-pointer" />
            <span>I agree to the Terms &amp; Conditions</span>
          </label>
          <div className="flex gap-3 pt-1">
            <BackBtn />
            <button disabled={!formData.agreeTerms || loading} onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Submitting…" : "✅ Submit Application"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyBusiness;