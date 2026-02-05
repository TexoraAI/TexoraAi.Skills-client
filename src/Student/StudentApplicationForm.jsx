
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import {
  ChevronRight,
  ChevronLeft,
  User,
  GraduationCap,
  CheckCircle,
  Moon,
  Sun,
} from "lucide-react";

export default function StudentApplicationForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [darkMode, setDarkMode] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    dob: "",
    gender: "",
    city: "",
    state: "",
    country: "",
    qualification: "",
    collegeName: "",
    yearOfPassing: "",
    currentStatus: "",
    agreeTerms: false,
    agreePrivacy: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Name is required";

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (!formData.mobile.trim()) {
        newErrors.mobile = "Mobile number is required";
      } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ""))) {
        newErrors.mobile = "Invalid mobile number";
      }

      if (!formData.dob) newErrors.dob = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.country.trim()) newErrors.country = "Country is required";
    }

    if (step === 2) {
      if (!formData.qualification)
        newErrors.qualification = "Qualification is required";
      if (!formData.collegeName.trim())
        newErrors.collegeName = "College/University name is required";
      if (!formData.yearOfPassing)
        newErrors.yearOfPassing = "Year of passing is required";
      if (!formData.currentStatus)
        newErrors.currentStatus = "Current status is required";
    }

    if (step === 3) {
      if (!formData.agreeTerms)
        newErrors.agreeTerms = "You must agree to terms & conditions";
      if (!formData.agreePrivacy)
        newErrors.agreePrivacy = "You must agree to privacy policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // ✅ BACKEND CONNECTED SUBMIT (UPDATED)
  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    try {
      setLoading(true);

      // ✅ IMPORTANT FIX:
      // Instead of /api/student/apply
      // call /api/auth/register so backend sends verification email automatically

      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: "STUDENT",
      };

      const res = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      alert(
        res?.data?.message ||
          "✅ Registered Successfully!\n\n📩 Please check your email and verify your account.",
      );

      // reset form
      setCurrentStep(1);
      setFormData({
        fullName: "",
        email: "",
        password: "",
        mobile: "",
        dob: "",
        gender: "",
        city: "",
        state: "",
        country: "",
        qualification: "",
        collegeName: "",
        yearOfPassing: "",
        currentStatus: "",
        agreeTerms: false,
        agreePrivacy: false,
      });

      navigate("/approval-pending");
    } catch (err) {
      console.log(err);

      alert(
        err?.response?.data?.message ||
          "❌ Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const bgClass = darkMode ? "bg-gray-900" : "bg-gray-50";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const textClass = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-600";
  const inputBg = darkMode
    ? "bg-gray-700 text-white"
    : "bg-gray-100 text-gray-900";
  const borderClass = darkMode ? "border-gray-700" : "border-gray-200";

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {/* Header */}
      <div className={`${cardBg} shadow-sm border-b ${borderClass}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className={`text-2xl md:text-3xl font-bold ${textClass}`}>
            Texora<span className="text-cyan-500">AI</span>.skills
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-gray-700 text-yellow-400"
                  : "bg-gray-200 text-gray-700"
              } hover:opacity-80 transition`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 mt-8">
          {[1, 2, 3].map((step, idx) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= step
                      ? "bg-cyan-500 text-white"
                      : darkMode
                        ? "bg-gray-700 text-gray-400"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                <span className={`text-xs ${textSecondary} mt-2`}>
                  {step === 1 ? "You" : step === 2 ? "Details" : "Submit"}
                </span>
              </div>

              {idx < 2 && (
                <div
                  className={`w-16 md:w-24 h-1 mx-2 ${
                    currentStep > step
                      ? "bg-cyan-500"
                      : darkMode
                        ? "bg-gray-700"
                        : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Card */}
        <div
          className={`${cardBg} rounded-lg shadow-lg p-6 md:p-8 border ${borderClass}`}
        >
          <div>
            {/* Heading */}
            <div className="mb-8">
              <h2
                className={`text-2xl md:text-3xl font-bold ${textClass} mb-2`}
              >
                Student Application Form
              </h2>
              <p className={textSecondary}>
                Fill all details correctly. Your account will be approved by
                Admin.
              </p>
            </div>

            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="text-cyan-500" size={24} />
                  <h3 className={`text-xl font-semibold ${textClass}`}>
                    Personal Details
                  </h3>
                </div>

                <div>
                  <label className={`block ${textSecondary} mb-2 font-medium`}>
                    Your name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full ${inputBg} px-4 py-3 rounded-lg border ${borderClass} focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block ${textSecondary} mb-2 font-medium`}>
                    Your email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full ${inputBg} px-4 py-3 rounded-lg border ${borderClass} focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                    placeholder="Student001@gmail.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className={`block ${textSecondary} mb-2 font-medium`}>
                    Create password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full ${inputBg} px-4 py-3 rounded-lg border ${borderClass} focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                    placeholder="Create a strong password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block ${textSecondary} mb-2 font-medium`}>
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`w-full ${inputBg} px-4 py-3 rounded-lg border ${borderClass} focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                    placeholder="+91 1234567890"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block ${textSecondary} mb-2 font-medium`}
                    >
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className={`w-full ${inputBg} px-4 py-3 rounded-lg border ${borderClass} focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block ${textSecondary} mb-2 font-medium`}
                    >
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full ${inputBg} px-4 py-3 rounded-lg border ${borderClass} focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.gender}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className={`block ${textSecondary} mb-2 font-medium`}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full ${inputBg} px-4 py-3 rounded-lg border ${borderClass} focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                    placeholder="Your city"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block ${textSecondary} mb-2 font-medium`}
                    >
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full ${inputBg} px-4 py-3 rounded-lg border ${borderClass} focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                      placeholder="Your state"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block ${textSecondary} mb-2 font-medium`}
                    >
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`w-full ${inputBg} px-4 py-3 rounded-lg border ${borderClass} focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                      placeholder="Your country"
                    />
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="text-cyan-500" size={24} />
                  <h3 className={`text-xl font-semibold ${textClass}`}>
                    Educational Details
                  </h3>
                </div>

                <div>
                  <label className={`block ${textSecondary} mb-2 font-medium`}>
                    Highest Qualification *
                  </label>
                  <select
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className={`w-full ${inputBg} px-4 py-3 rounded-lg border ${borderClass} focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                  >
                    <option value="">Select Qualification</option>
                    <option value="10th">10th</option>
                    <option value="12th">12th</option>
                    <option value="graduation">Graduation</option>
                    <option value="postgraduation">Post-Graduation</option>
                    <option value="phd">PhD</option>
                  </select>
                  {errors.qualification && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.qualification}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block ${textSecondary} mb-2 font-medium`}>
                    College / University Name *
                  </label>
                  <input
                    type="text"
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleInputChange}
                    className={`w-full ${inputBg} px-4 py-3 rounded-lg border ${borderClass} focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                    placeholder="Enter your institution name"
                  />
                  {errors.collegeName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.collegeName}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block ${textSecondary} mb-2 font-medium`}>
                    Year of Passing *
                  </label>
                  <input
                    type="number"
                    name="yearOfPassing"
                    value={formData.yearOfPassing}
                    onChange={handleInputChange}
                    className={`w-full ${inputBg} px-4 py-3 rounded-lg border ${borderClass} focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                    placeholder="e.g., 2024"
                    min="1950"
                    max="2030"
                  />
                  {errors.yearOfPassing && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.yearOfPassing}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block ${textSecondary} mb-2 font-medium`}>
                    Current Status *
                  </label>
                  <div className="space-y-2">
                    {["Student", "Working Professional", "Fresher"].map(
                      (status) => (
                        <label
                          key={status}
                          className={`flex items-center gap-3 ${inputBg} p-3 rounded-lg cursor-pointer hover:opacity-80 border ${borderClass}`}
                        >
                          <input
                            type="radio"
                            name="currentStatus"
                            value={status}
                            checked={formData.currentStatus === status}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-cyan-500"
                          />
                          <span className={textClass}>{status}</span>
                        </label>
                      ),
                    )}
                  </div>
                  {errors.currentStatus && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.currentStatus}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="text-cyan-500" size={24} />
                  <h3 className={`text-xl font-semibold ${textClass}`}>
                    Review & Submit
                  </h3>
                </div>

                <div
                  className={`${inputBg} p-4 rounded-lg border ${borderClass}`}
                >
                  <h4 className={`${textClass} font-semibold mb-3`}>
                    Application Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className={textSecondary}>
                      <span className="font-semibold">Name:</span>{" "}
                      {formData.fullName}
                    </p>
                    <p className={textSecondary}>
                      <span className="font-semibold">Email:</span>{" "}
                      {formData.email}
                    </p>
                    <p className={textSecondary}>
                      <span className="font-semibold">Mobile:</span>{" "}
                      {formData.mobile}
                    </p>
                    <p className={textSecondary}>
                      <span className="font-semibold">Qualification:</span>{" "}
                      {formData.qualification}
                    </p>
                    <p className={textSecondary}>
                      <span className="font-semibold">Status:</span>{" "}
                      {formData.currentStatus}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="w-5 h-5 mt-1 text-cyan-500"
                    />
                    <span className={textSecondary}>
                      I agree to the{" "}
                      <span className="text-cyan-500 underline">
                        Terms & Conditions
                      </span>{" "}
                      *
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <p className="text-red-500 text-sm">{errors.agreeTerms}</p>
                  )}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreePrivacy"
                      checked={formData.agreePrivacy}
                      onChange={handleInputChange}
                      className="w-5 h-5 mt-1 text-cyan-500"
                    />
                    <span className={textSecondary}>
                      I agree to the{" "}
                      <span className="text-cyan-500 underline">
                        Privacy Policy
                      </span>{" "}
                      *
                    </span>
                  </label>
                  {errors.agreePrivacy && (
                    <p className="text-red-500 text-sm">
                      {errors.agreePrivacy}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1 || loading}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  currentStep === 1 || loading
                    ? darkMode
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : darkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={loading}
                  className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                  <CheckCircle size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-cyan-500 hover:text-cyan-600 underline font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
