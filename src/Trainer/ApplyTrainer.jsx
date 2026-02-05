

import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

export default function ApplyTrainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

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

  const colors = {
    primary: "from-blue-600 to-emerald-600",
    primarySolid: "bg-blue-600",
    accent: "from-yellow-400 to-orange-500",
    muted: "text-gray-600 dark:text-gray-400",
    surface: "bg-white dark:bg-black",
  };

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
    // ✅ password match check
    if (formData.password !== formData.confirmPassword) {
      alert("❌ Password and Confirm Password do not match");
      return;
    }

    try {
      setLoading(true);

      // ✅ Register trainer using same backend auth register API
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "TRAINER",
      });

      alert(
        "✅ Application Submitted!\n\n" +
          "Step 1: Verify your email first 📩\n" +
          "Step 2: After verification, admin will approve your account ⏳\n\n" +
          "You can login only after approval.",
      );

      // ✅ Redirect to verify email page (email comes from form)
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      console.log("Trainer apply error:", err);

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "❌ Failed to submit application";

      alert(msg);

      // If already registered but not verified
      if (msg.toLowerCase().includes("verify")) {
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        return;
      }

      // If already registered but not approved
      if (msg.toLowerCase().includes("not approved")) {
        navigate(
          `/approval-pending?email=${encodeURIComponent(formData.email)}`,
        );
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const isPage1Valid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.linkedin &&
    formData.country &&
    formData.shareExpertise.length > 0 &&
    formData.audienceSize &&
    formData.fullTimeRole;

  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        className={`min-h-screen ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-black to-gray-900"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
        } transition-colors duration-300`}
      >
        {/* Header */}
        <header
          className={`border-b ${
            darkMode
              ? "border-gray-800 bg-black/50"
              : "border-gray-200 bg-white/50"
          } backdrop-blur`}
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`text-2xl font-bold bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}
              >
                TexoraAI.skills
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-800 text-yellow-400"
                    : "bg-gray-200 text-gray-700"
                } hover:scale-110 transition-transform`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentPage >= 1
                    ? `bg-gradient-to-r ${colors.primary} border-transparent text-white`
                    : darkMode
                      ? "border-gray-700 text-gray-500"
                      : "border-gray-300 text-gray-400"
                }`}
              >
                <span className="font-semibold">1</span>
              </div>
              <div
                className={`h-0.5 w-16 ${
                  currentPage >= 2
                    ? `bg-gradient-to-r ${colors.primary}`
                    : darkMode
                      ? "bg-gray-700"
                      : "bg-gray-300"
                }`}
              />
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentPage >= 2
                    ? `bg-gradient-to-r ${colors.primary} border-transparent text-white`
                    : darkMode
                      ? "border-gray-700 text-gray-500"
                      : "border-gray-300 text-gray-400"
                }`}
              >
                <span className="font-semibold">2</span>
              </div>
              <div
                className={`h-0.5 w-16 ${
                  currentPage >= 3
                    ? `bg-gradient-to-r ${colors.primary}`
                    : darkMode
                      ? "bg-gray-700"
                      : "bg-gray-300"
                }`}
              />
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentPage >= 3
                    ? `bg-gradient-to-r ${colors.primary} border-transparent text-white`
                    : darkMode
                      ? "border-gray-700 text-gray-500"
                      : "border-gray-300 text-gray-400"
                }`}
              >
                <span className="font-semibold">3</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className={`text-sm ${colors.muted} mb-2`}>
              {currentPage === 1 && "1. You"}
              {currentPage === 2 && "2. Your topic"}
              {currentPage === 3 && "3. Submit"}
            </div>
          </div>

          {/* Form Container */}
          <div
            className={`${
              darkMode
                ? "bg-gray-900/50 border-gray-800"
                : "bg-white border-gray-200"
            } backdrop-blur border rounded-2xl p-8 shadow-2xl transition-colors duration-300`}
          >
            {currentPage === 1 && (
              <div>
                <div className="mb-8">
                  <h1
                    className={`text-2xl font-bold mb-3 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Thank you for your interest in teaching on TexoraAI.skills!
                  </h1>
                  <p className={colors.muted}>
                    Tell us a bit about you and your area of expertise.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Your name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 ${
                        darkMode
                          ? "bg-black/50 border-gray-700 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Your email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 ${
                        darkMode
                          ? "bg-black/50 border-gray-700 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Create password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter password (min 11 characters)"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 ${
                        darkMode
                          ? "bg-black/50 border-gray-700 text-white placeholder:text-gray-600"
                          : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
                      } border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                    />
                    {formData.password && formData.password.length < 8 && (
                      <p className="text-orange-500 text-xs mt-1 flex items-center gap-1">
                        <span>⚠️</span> Password must be at least 11 characters
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Confirm password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 ${
                        darkMode
                          ? "bg-black/50 border-gray-700 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Your Linkedin URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className={`w-full px-4 py-3 ${
                        darkMode
                          ? "bg-black/50 border-gray-700 text-white placeholder:text-gray-600"
                          : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
                      } border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      What country do you live in?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 ${
                        darkMode
                          ? "bg-black/50 border-gray-700 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                    >
                      <option value="">Select a country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="IN">India</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-3 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Where do you currently share your expertise?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {[
                        "Blog",
                        "Newsletter",
                        "YouTube",
                        "Podcast",
                        "Social Media",
                        "Online courses",
                      ].map((option) => (
                        <label
                          key={option}
                          className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg ${
                            darkMode
                              ? "hover:bg-gray-800/50"
                              : "hover:bg-gray-100"
                          } transition`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.shareExpertise.includes(option)}
                            onChange={() => handleCheckboxChange(option)}
                            className="w-4 h-4 accent-blue-600"
                          />
                          <span
                            className={
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Audience size <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="audienceSize"
                      value={formData.audienceSize}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 ${
                        darkMode
                          ? "bg-black/50 border-gray-700 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                    >
                      <option value="">Select audience size</option>
                      <option value="0-500">0 - 500</option>
                      <option value="500-2000">500 - 2,000</option>
                      <option value="2000-5000">2,000 - 5,000</option>
                      <option value="5000+">5,000+</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Full time role? <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["Yes", "No"].map((option) => (
                        <label
                          key={option}
                          className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg ${
                            darkMode
                              ? "hover:bg-gray-800/50"
                              : "hover:bg-gray-100"
                          } transition`}
                        >
                          <input
                            type="radio"
                            name="fullTimeRole"
                            value={option}
                            checked={formData.fullTimeRole === option}
                            onChange={handleInputChange}
                            className="w-4 h-4 accent-blue-600"
                          />
                          <span
                            className={
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center justify-end mt-8 pt-6 border-t ${
                    darkMode ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  <button
                    onClick={handleNext}
                    disabled={!isPage1Valid}
                    className={`flex items-center gap-2 px-8 py-3 bg-gradient-to-r ${colors.primary} hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition font-medium text-white`}
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {currentPage === 2 && (
              <div>
                <div className="mb-8">
                  <h1
                    className={`text-2xl font-bold mb-3 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Tell us about your topic
                  </h1>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Course topic
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Product Management, Data Science"
                      className={`w-full px-4 py-3 ${
                        darkMode
                          ? "bg-black/50 border-gray-700 text-white placeholder:text-gray-600"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                    />
                  </div>
                </div>

                <div
                  className={`flex items-center justify-between mt-8 pt-6 border-t ${
                    darkMode ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  <button
                    onClick={handleBack}
                    className={`flex items-center gap-2 px-6 py-3 ${
                      darkMode
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-gray-200 hover:bg-gray-300"
                    } rounded-lg transition ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <ChevronLeft size={18} />
                    Back
                  </button>

                  <button
                    onClick={handleNext}
                    className={`flex items-center gap-2 px-8 py-3 bg-gradient-to-r ${colors.primary} hover:shadow-lg rounded-lg transition font-medium text-white`}
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {currentPage === 3 && (
              <div>
                <div className="mb-8 text-center">
                  <h1
                    className={`text-2xl font-bold mb-3 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Review and Submit
                  </h1>
                </div>

                <div
                  className={`${
                    darkMode ? "bg-black/50" : "bg-gray-50"
                  } rounded-lg p-6 space-y-4 mb-6`}
                >
                  <div>
                    <div className={`text-sm ${colors.muted} mb-1`}>Name</div>
                    <div
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {formData.name || "—"}
                    </div>
                  </div>
                  <div>
                    <div className={`text-sm ${colors.muted} mb-1`}>Email</div>
                    <div
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {formData.email || "—"}
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center justify-between pt-6 border-t ${
                    darkMode ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  <button
                    onClick={handleBack}
                    disabled={loading}
                    className={`flex items-center gap-2 px-6 py-3 ${
                      darkMode
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-gray-200 hover:bg-gray-300"
                    } rounded-lg transition ${
                      darkMode ? "text-white" : "text-gray-900"
                    } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <ChevronLeft size={18} />
                    Back
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`flex items-center gap-2 px-8 py-3 bg-gradient-to-r ${colors.accent} hover:shadow-lg rounded-lg transition font-medium text-white ${
                      loading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
