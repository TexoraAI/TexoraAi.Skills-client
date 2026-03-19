

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";

export default function ApplyTrainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const isGoogleUser = location.state?.isGoogleUser || false;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    linkedin: "",
    country: "",
    shareExpertise: [],
    audienceSize: "",
    fullTimeRole: "",
    howHeard: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        name: location.state.name || "",
        email: location.state.email || "",
      }));
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      shareExpertise: prev.shareExpertise.includes(value)
        ? prev.shareExpertise.filter((item) => item !== value)
        : [...prev.shareExpertise, value],
    }));
  };

  const handleNext = () => {
    if (currentPage < 3) setCurrentPage(currentPage + 1);
  };

  const handleBack = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSubmit = async () => {
    if (!isGoogleUser && formData.password !== formData.confirmPassword) {
      alert("❌ Password and Confirm Password do not match");
      return;
    }
    if (!isGoogleUser && formData.password.length < 11) {
      alert("❌ Password must be at least 11 characters");
      return;
    }
    try {
      setLoading(true);
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: isGoogleUser ? null : formData.password,
        role: "TRAINER",
        isGoogleUser: isGoogleUser,
      });
      alert(
        "✅ Application Submitted!\n\n" +
          "Step 1: Verify your email first 📩\n" +
          "Step 2: After verification, admin will approve your account ⏳\n\n" +
          "You can login only after approval."
      );
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      console.log("Trainer apply error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "❌ Failed to submit application";
      alert(msg);
      if (msg.toLowerCase().includes("verify")) {
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        return;
      }
      if (msg.toLowerCase().includes("not approved")) {
        navigate(`/approval-pending?email=${encodeURIComponent(formData.email)}`);
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const isPage1Valid =
    formData.name &&
    formData.email &&
    (isGoogleUser ||
      (formData.password &&
        formData.confirmPassword &&
        formData.password === formData.confirmPassword)) &&
    formData.linkedin &&
    formData.country &&
    formData.shareExpertise.length > 0 &&
    formData.audienceSize &&
    formData.fullTimeRole;

  // Shared styles
  const input =
    "w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition";
  const label = "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";

  return (
    <div className="w-full max-w-lg mx-auto py-6 px-4">

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-5">
        {[1, 2, 3].map((step, idx) => (
          <React.Fragment key={step}>
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                currentPage >= step
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
            >
              {step}
            </div>
            {idx < 2 && (
              <div
                className={`w-16 h-0.5 mx-2 transition-colors ${
                  currentPage > step
                    ? "bg-orange-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step label */}
      <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-5">
        {currentPage === 1 && "1. You"}
        {currentPage === 2 && "2. Your topic"}
        {currentPage === 3 && "3. Submit"}
      </p>

      {/* ── Page 1 ── */}
      {currentPage === 1 && (
        <div className="space-y-4">
          <div className="mb-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Thank you for your interest in teaching!
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Tell us a bit about you and your area of expertise.
            </p>
          </div>

          <div>
            <label className={label}>Your name <span className="text-red-500">*</span></label>
            <input type="text" name="name" value={formData.name}
              onChange={handleInputChange} className={input} />
          </div>

          <div>
            <label className={label}>Your email <span className="text-red-500">*</span></label>
            <input type="email" name="email" value={formData.email}
              onChange={handleInputChange} disabled={isGoogleUser}
              className={`${input} ${isGoogleUser ? "opacity-70 cursor-not-allowed" : ""}`} />
          </div>

          {!isGoogleUser && (
            <>
              <div>
                <label className={label}>Create password <span className="text-red-500">*</span></label>
                <input type="password" name="password"
                  placeholder="Min 11 characters"
                  value={formData.password} onChange={handleInputChange}
                  className={input} />
                {formData.password && formData.password.length < 11 && (
                  <p className="text-orange-500 text-xs mt-1">⚠️ Password must be at least 11 characters</p>
                )}
              </div>
              <div>
                <label className={label}>Confirm password <span className="text-red-500">*</span></label>
                <input type="password" name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleInputChange}
                  className={input} />
              </div>
            </>
          )}

          <div>
            <label className={label}>LinkedIn URL <span className="text-red-500">*</span></label>
            <input type="url" name="linkedin" value={formData.linkedin}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/yourprofile"
              className={input} />
          </div>

          <div>
            <label className={label}>Country <span className="text-red-500">*</span></label>
            <select name="country" value={formData.country}
              onChange={handleInputChange} className={input}>
              <option value="">Select a country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="IN">India</option>
            </select>
          </div>

          <div>
            <label className={label}>
              Where do you share your expertise? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-1 mt-1">
              {["Blog", "Newsletter", "YouTube", "Podcast", "Social Media", "Online courses"].map((option) => (
                <label key={option}
                  className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  <input type="checkbox"
                    checked={formData.shareExpertise.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                    className="w-4 h-4 accent-orange-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={label}>Audience size <span className="text-red-500">*</span></label>
            <select name="audienceSize" value={formData.audienceSize}
              onChange={handleInputChange} className={input}>
              <option value="">Select audience size</option>
              <option value="0-500">0 – 500</option>
              <option value="500-2000">500 – 2,000</option>
              <option value="2000-5000">2,000 – 5,000</option>
              <option value="5000+">5,000+</option>
            </select>
          </div>

          <div>
            <label className={label}>Full time role? <span className="text-red-500">*</span></label>
            <div className="space-y-1 mt-1">
              {["Yes", "No"].map((option) => (
                <label key={option}
                  className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  <input type="radio" name="fullTimeRole" value={option}
                    checked={formData.fullTimeRole === option}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-orange-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button onClick={handleNext} disabled={!isPage1Valid}
              className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition">
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Page 2 ── */}
      {currentPage === 2 && (
        <div className="space-y-4">
          <div className="mb-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tell us about your topic</h2>
          </div>

          <div>
            <label className={label}>Course topic</label>
            <input type="text"
              placeholder="e.g., Product Management, Data Science"
              className={input} />
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <button onClick={handleBack}
              className="flex items-center gap-2 px-5 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-semibold rounded-lg transition">
              <ChevronLeft size={16} /> Back
            </button>
            <button onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition">
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Page 3 ── */}
      {currentPage === 3 && (
        <div className="space-y-4">
          <div className="text-center mb-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Review & Submit</h2>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-3 text-sm">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Name</p>
              <p className="font-medium text-gray-900 dark:text-white">{formData.name || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Email</p>
              <p className="font-medium text-gray-900 dark:text-white">{formData.email || "—"}</p>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <button onClick={handleBack} disabled={loading}
              className={`flex items-center gap-2 px-5 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-semibold rounded-lg transition ${loading ? "opacity-60 cursor-not-allowed" : ""}`}>
              <ChevronLeft size={16} /> Back
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className={`flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition ${loading ? "opacity-60 cursor-not-allowed" : ""}`}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}




























