
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const ApplyAdmin = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const isGoogleUser = location.state?.isGoogleUser || false;

  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName:          "",
    email:             "",
    mobile:            "",
    adminType:         "",
    department:        "",
    cityState:         "",
    employeeId:        "",
    idProof:           null,
    appointmentLetter: null,
    confirmAuth:       false,
  });

  /* ── Google prefill (unchanged) ── */
  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        fullName: location.state.name  || "",
        email:    location.state.email || "",
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const nextStep = () => setStep((p) => p + 1);
  const prevStep = () => setStep((p) => p - 1);

  const isStep1Valid =
    formData.fullName && formData.email && formData.mobile &&
    formData.adminType && formData.department && formData.cityState;

  const isStep2Valid =
    formData.employeeId && formData.idProof && formData.appointmentLetter;

  /* ── Submit (unchanged) ── */
  const handleSubmit = async () => {
    try {
      if (!formData.confirmAuth) { alert("❌ Please confirm authorization checkbox"); return; }
      if (!formData.idProof || !formData.appointmentLetter) { alert("❌ Please upload both ID Proof and Appointment Letter"); return; }

      setLoading(true);

      const adminJsonData = {
        fullName:   formData.fullName,
        email:      formData.email,
        mobile:     formData.mobile,
        adminType:  formData.adminType,
        department: formData.department,
        cityState:  formData.cityState,
        employeeId: formData.employeeId,
      };

      const fd = new FormData();
      fd.append("data", JSON.stringify(adminJsonData));
      fd.append("idProof", formData.idProof);
      fd.append("appointmentLetter", formData.appointmentLetter);

      const res = await axios.post(`${API_BASE_URL}/api/admin/apply`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Apply Admin API Response:", res.data);
      alert("✅ Admin Application Submitted!\n\nYour request has been sent to Super Admin for verification.\n⏳ You will receive access after approval.");
      navigate("/approval-pending");
    } catch (error) {
      console.error("Apply Admin Error:", error);
      alert(error?.response?.data?.message || "❌ Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  /* ── shared styles ── */
  const inputCls  = "w-full px-3 py-2.5 border border-slate-200 dark:border-gray-600 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 bg-slate-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all";
  const selectCls = "w-full px-3 py-2.5 border border-slate-200 dark:border-gray-600 rounded-xl text-sm text-slate-800 dark:text-white bg-slate-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all";

  /* ── step progress bar ── */
  const Progress = () => (
    <div className="flex items-center gap-2 mb-5">
      {[1, 2, 3].map((n) => (
        <React.Fragment key={n}>
          <div className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold transition-all
            ${step > n ? "bg-green-500 text-white" : step === n ? "bg-[#F97316] text-white" : "bg-slate-200 dark:bg-gray-700 text-slate-400"}`}>
            {step > n ? "✓" : n}
          </div>
          <span className={`text-xs font-medium ${step === n ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-gray-500"}`}>
            {n === 1 ? "Basic Details" : n === 2 ? "Verification" : "Review"}
          </span>
          {n < 3 && <div className={`flex-1 h-0.5 rounded ${step > n ? "bg-green-400" : "bg-slate-200 dark:bg-gray-700"}`} />}
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

      {/* ── compact heading ── */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Apply for Admin Role</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Complete the process in 3 steps</p>
      </div>

      <Progress />

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-700 dark:text-gray-200 mb-3">Basic Details</p>

          <input name="fullName" placeholder="Full Name" value={formData.fullName}
            onChange={handleChange} className={inputCls} />

          <input name="email" type="email" placeholder="Email Address"
            value={formData.email} onChange={handleChange}
            disabled={isGoogleUser}
            className={`${inputCls} ${isGoogleUser ? "opacity-60 cursor-not-allowed" : ""}`} />

          <input name="mobile" type="tel" placeholder="Mobile Number"
            value={formData.mobile} onChange={handleChange} className={inputCls} />

          <select name="adminType" value={formData.adminType}
            onChange={handleChange} className={selectCls}>
            <option value="">Select Admin Type</option>
            <option value="Super Admin">Super Admin</option>
          </select>

          <select name="department" value={formData.department}
            onChange={handleChange} className={selectCls}>
            <option value="">Select Department</option>
            <option>Tech</option>
            <option>Operations</option>
            <option>Support</option>
            <option>Finance</option>
          </select>

          <input name="cityState" placeholder="City & State"
            value={formData.cityState} onChange={handleChange} className={inputCls} />

          <button onClick={nextStep} disabled={!isStep1Valid}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white
              bg-gradient-to-r from-orange-500 to-orange-600 shadow
              hover:opacity-90 hover:scale-[1.01] transition-all
              disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
            Next →
          </button>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-700 dark:text-gray-200 mb-3">Verification</p>

          <input name="employeeId" placeholder="Employee ID"
            value={formData.employeeId} onChange={handleChange} className={inputCls} />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">ID Proof</label>
            <input type="file" name="idProof" onChange={handleChange}
              className="w-full text-sm text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-600 rounded-xl
                bg-slate-50 dark:bg-gray-800 px-3 py-2 file:mr-3 file:rounded-lg file:border-0
                file:bg-orange-50 file:text-orange-700 file:text-xs file:font-semibold
                file:px-3 file:py-1.5 hover:file:bg-orange-100 transition-all" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">Appointment Letter</label>
            <input type="file" name="appointmentLetter" onChange={handleChange}
              className="w-full text-sm text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-600 rounded-xl
                bg-slate-50 dark:bg-gray-800 px-3 py-2 file:mr-3 file:rounded-lg file:border-0
                file:bg-orange-50 file:text-orange-700 file:text-xs file:font-semibold
                file:px-3 file:py-1.5 hover:file:bg-orange-100 transition-all" />
          </div>

          <div className="flex gap-3 pt-1">
            <BackBtn />
            <button onClick={nextStep} disabled={!isStep2Valid}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white
                bg-gradient-to-r from-orange-500 to-orange-600 shadow
                hover:opacity-90 transition-all
                disabled:opacity-50 disabled:cursor-not-allowed">
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && (
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-700 dark:text-gray-200 mb-3">Review & Submit</p>

          <div className="rounded-xl border border-slate-100 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 p-4 space-y-2">
            {[
              ["Name",        formData.fullName],
              ["Email",       formData.email],
              ["Mobile",      formData.mobile],
              ["Admin Type",  formData.adminType],
              ["Department",  formData.department],
              ["Location",    formData.cityState],
              ["Employee ID", formData.employeeId],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500 dark:text-gray-400">{label}</span>
                <span className="text-slate-800 dark:text-white font-medium">{val || "—"}</span>
              </div>
            ))}
          </div>

          <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-gray-300 cursor-pointer">
            <input type="checkbox" name="confirmAuth"
              checked={formData.confirmAuth} onChange={handleChange}
              className="mt-0.5 w-4 h-4 accent-orange-500 cursor-pointer" />
            <span>I confirm this admin role is authorized and all information provided is accurate</span>
          </label>

          <div className="flex gap-3 pt-1">
            <BackBtn />
            <button disabled={!formData.confirmAuth || loading} onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white
                bg-gradient-to-r from-orange-500 to-orange-600 shadow
                hover:opacity-90 transition-all
                disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Submitting…" : "✅ Create Admin"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyAdmin;







