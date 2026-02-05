
import { Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const ApplyAdmin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    adminType: "",
    department: "",
    cityState: "",
    employeeId: "",
    idProof: null,
    appointmentLetter: null,
    confirmAuth: false,
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      if (!formData.confirmAuth) {
        alert("❌ Please confirm authorization checkbox");
        return;
      }

      if (!formData.idProof || !formData.appointmentLetter) {
        alert("❌ Please upload both ID Proof and Appointment Letter");
        return;
      }

      setLoading(true);

      // ✅ Backend expects: @RequestPart("data") String data
      const adminJsonData = {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        adminType: formData.adminType,
        department: formData.department,
        cityState: formData.cityState,
        employeeId: formData.employeeId,
      };

      // ✅ Backend expects multipart form-data:
      // "data" (string), "idProof" (file), "appointmentLetter" (file)
      const fd = new FormData();
      fd.append("data", JSON.stringify(adminJsonData));
      fd.append("idProof", formData.idProof);
      fd.append("appointmentLetter", formData.appointmentLetter);

      const res = await axios.post(`${API_BASE_URL}/api/admin/apply`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Apply Admin API Response:", res.data);

      alert(
        "✅ Admin Application Submitted!\n\n" +
          "Your request has been sent to Super Admin for verification.\n" +
          "⏳ You will receive access after approval.",
      );

      navigate("/approval-pending");
    } catch (error) {
      console.error("Apply Admin Error:", error);
      alert(
        error?.response?.data?.message || "❌ Failed to submit application",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "bg-gradient-to-br from-blue-50 via-white to-emerald-50"
      }`}
    >
      <header
        className={`border-b backdrop-blur-sm sticky top-0 z-50 transition-all duration-300 ${
          darkMode
            ? "border-gray-700 bg-gray-900/80"
            : "border-gray-200 bg-white/80 shadow-sm"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            TexoraAI.skills
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                darkMode
                  ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              } hover:scale-110`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`max-w-3xl mx-auto rounded-2xl shadow-2xl mt-10 overflow-hidden transition-all duration-300 ${
          darkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-100"
        }`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-8 text-white">
          <h2 className="text-3xl font-bold">Apply for Admin Role</h2>
          <p className="text-blue-100 mt-1">Complete the process in 3 steps</p>
        </div>

        <div
          className={`p-8 transition-colors duration-300 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <h3
                className={`text-xl font-bold transition-colors duration-300 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Basic Details
              </h3>

              <input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    : "border-gray-300 bg-white text-gray-800 placeholder-gray-500"
                }`}
              />

              <input
                name="email"
                type="email"
                placeholder="Official Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    : "border-gray-300 bg-white text-gray-800 placeholder-gray-500"
                }`}
              />

              <input
                name="mobile"
                type="tel"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    : "border-gray-300 bg-white text-gray-800 placeholder-gray-500"
                }`}
              />

              <select
                name="adminType"
                value={formData.adminType}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-white text-gray-800"
                }`}
              >
                <option value="">Select Admin</option>
                <option value="Super Admin">Super Admin</option>
              </select>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-white text-gray-800"
                }`}
              >
                <option value="">Select Department</option>
                <option>Tech</option>
                <option>Operations</option>
                <option>Support</option>
                <option>Finance</option>
              </select>

              <input
                name="cityState"
                placeholder="City & State"
                value={formData.cityState}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    : "border-gray-300 bg-white text-gray-800 placeholder-gray-500"
                }`}
              />

              <button
                onClick={nextStep}
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-transform"
              >
                Next →
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <h3
                className={`text-xl font-bold transition-colors duration-300 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Verification
              </h3>

              <input
                name="employeeId"
                placeholder="Employee ID"
                value={formData.employeeId}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    : "border-gray-300 bg-white text-gray-800 placeholder-gray-500"
                }`}
              />

              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  ID Proof
                </label>
                <input
                  type="file"
                  name="idProof"
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-medium file:cursor-pointer ${
                    darkMode
                      ? "border-gray-600 bg-gray-700 text-white file:bg-blue-900 file:text-blue-300 hover:file:bg-blue-800"
                      : "border-gray-300 bg-white text-gray-800 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Appointment Letter
                </label>
                <input
                  type="file"
                  name="appointmentLetter"
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-medium file:cursor-pointer ${
                    darkMode
                      ? "border-gray-600 bg-gray-700 text-white file:bg-blue-900 file:text-blue-300 hover:file:bg-blue-800"
                      : "border-gray-300 bg-white text-gray-800 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  }`}
                />
              </div>

              <div className="flex justify-between gap-4">
                <button
                  onClick={prevStep}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5">
              <h3
                className={`text-xl font-bold transition-colors duration-300 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Review & Submit
              </h3>

              <div
                className={`p-4 rounded-lg space-y-2 transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-700 border border-gray-600"
                    : "bg-blue-50 border border-blue-100"
                }`}
              >
                <p className={darkMode ? "text-gray-200" : "text-gray-800"}>
                  <strong>Name:</strong> {formData.fullName || "—"}
                </p>
                <p className={darkMode ? "text-gray-200" : "text-gray-800"}>
                  <strong>Email:</strong> {formData.email || "—"}
                </p>
                <p className={darkMode ? "text-gray-200" : "text-gray-800"}>
                  <strong>Mobile:</strong> {formData.mobile || "—"}
                </p>
                <p className={darkMode ? "text-gray-200" : "text-gray-800"}>
                  <strong>Admin Type:</strong> {formData.adminType || "—"}
                </p>
                <p className={darkMode ? "text-gray-200" : "text-gray-800"}>
                  <strong>Department:</strong> {formData.department || "—"}
                </p>
                <p className={darkMode ? "text-gray-200" : "text-gray-800"}>
                  <strong>Location:</strong> {formData.cityState || "—"}
                </p>
                <p className={darkMode ? "text-gray-200" : "text-gray-800"}>
                  <strong>Employee ID:</strong> {formData.employeeId || "—"}
                </p>
              </div>

              <label
                className={`flex gap-3 items-start text-sm cursor-pointer transition-colors duration-300 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  name="confirmAuth"
                  checked={formData.confirmAuth}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 cursor-pointer"
                />
                <span>
                  I confirm this admin role is authorized and all information
                  provided is accurate
                </span>
              </label>

              <div className="flex justify-between gap-4">
                <button
                  onClick={prevStep}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  ← Back
                </button>

                <button
                  disabled={!formData.confirmAuth || loading}
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? "Submitting..." : "✅ Create Admin"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyAdmin;
