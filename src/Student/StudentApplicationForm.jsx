

// import { useLocation } from "react-router-dom";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import React, { useState } from "react";
// import axios from "axios";
// import {
//   ChevronRight,
//   ChevronLeft,
//   User,
//   GraduationCap,
//   CheckCircle,
// } from "lucide-react";

// export default function StudentApplicationForm() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isGoogleUser = location.state?.isGoogleUser || false;
//   const [currentStep, setCurrentStep] = useState(1);

//   const API_BASE_URL =
//     import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     mobile: "",
//     dob: "",
//     gender: "",
//     city: "",
//     state: "",
//     country: "",
//     qualification: "",
//     collegeName: "",
//     yearOfPassing: "",
//     currentStatus: "",
//     agreeTerms: false,
//     agreePrivacy: false,
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (location.state) {
//       setFormData((prev) => ({
//         ...prev,
//         fullName: location.state.name || "",
//         email: location.state.email || "",
//       }));
//     }
//   }, [location.state]);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const validateStep = (step) => {
//     const newErrors = {};

//     if (step === 1) {
//       if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
//       if (!formData.email.trim()) {
//         newErrors.email = "Email is required";
//       } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//         newErrors.email = "Invalid email format";
//       }
//       if (!isGoogleUser) {
//         if (!formData.password) {
//           newErrors.password = "Password is required";
//         } else if (formData.password.length < 6) {
//           newErrors.password = "Password must be at least 6 characters";
//         }
//       }
//       if (!formData.mobile.trim()) {
//         newErrors.mobile = "Mobile number is required";
//       } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ""))) {
//         newErrors.mobile = "Invalid mobile number";
//       }
//       if (!formData.dob) newErrors.dob = "Date of birth is required";
//       if (!formData.gender) newErrors.gender = "Gender is required";
//       if (!formData.city.trim()) newErrors.city = "City is required";
//       if (!formData.state.trim()) newErrors.state = "State is required";
//       if (!formData.country.trim()) newErrors.country = "Country is required";
//     }

//     if (step === 2) {
//       if (!formData.qualification)
//         newErrors.qualification = "Qualification is required";
//       if (!formData.collegeName.trim())
//         newErrors.collegeName = "College/University name is required";
//       if (!formData.yearOfPassing)
//         newErrors.yearOfPassing = "Year of passing is required";
//       if (!formData.currentStatus)
//         newErrors.currentStatus = "Current status is required";
//     }

//     if (step === 3) {
//       if (!formData.agreeTerms)
//         newErrors.agreeTerms = "You must agree to terms & conditions";
//       if (!formData.agreePrivacy)
//         newErrors.agreePrivacy = "You must agree to privacy policy";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const nextStep = () => {
//     if (validateStep(currentStep)) {
//       setCurrentStep((prev) => Math.min(prev + 1, 3));
//     }
//   };

//   const prevStep = () => {
//     setCurrentStep((prev) => Math.max(prev - 1, 1));
//   };

//   const handleSubmit = async () => {
//     if (!validateStep(3)) return;
//     try {
//       setLoading(true);
//       const payload = {
//         name: formData.fullName,
//         email: formData.email,
//         password: isGoogleUser ? null : formData.password,
//         role: "STUDENT",
//         isGoogleUser: isGoogleUser,
//       };
//       const res = await axios.post(
//         `${API_BASE_URL}/api/auth/register`,
//         payload,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       alert(
//         res?.data?.message ||
//           "✅ Registered Successfully!\n\n📩 Please check your email and verify your account."
//       );
//       setCurrentStep(1);
//       setFormData({
//         fullName: "", email: "", password: "", mobile: "", dob: "",
//         gender: "", city: "", state: "", country: "", qualification: "",
//         collegeName: "", yearOfPassing: "", currentStatus: "",
//         agreeTerms: false, agreePrivacy: false,
//       });
//       navigate("/approval-pending");
//     } catch (err) {
//       alert(
//         err?.response?.data?.message ||
//           "❌ Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Shared input style
//   const input =
//     "w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm";
//   const label = "block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium";
//   const err = "text-red-500 text-xs mt-1";

//   return (
//     <div className="w-full max-w-lg mx-auto py-6 px-4">

//       {/* Progress Steps */}
//       <div className="flex items-center justify-center mb-6">
//         {[1, 2, 3].map((step, idx) => (
//           <React.Fragment key={step}>
//             <div className="flex flex-col items-center">
//               <div
//                 className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
//                   currentStep >= step
//                     ? "bg-orange-500 text-white"
//                     : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
//                 }`}
//               >
//                 {step}
//               </div>
//               <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                 {step === 1 ? "You" : step === 2 ? "Details" : "Submit"}
//               </span>
//             </div>
//             {idx < 2 && (
//               <div
//                 className={`w-16 md:w-20 h-0.5 mx-2 mb-4 transition-colors ${
//                   currentStep > step
//                     ? "bg-orange-500"
//                     : "bg-gray-300 dark:bg-gray-600"
//                 }`}
//               />
//             )}
//           </React.Fragment>
//         ))}
//       </div>

//       {/* Step heading */}
//       <div className="mb-5">
//         <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//           Student Application
//         </h2>
//         <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
//           Fill all details correctly. Your account will be approved by Admin.
//         </p>
//       </div>

//       {/* ── Step 1 ── */}
//       {currentStep === 1 && (
//         <div className="space-y-3">
//           <div className="flex items-center gap-2 mb-3">
//             <User className="text-orange-500" size={18} />
//             <h3 className="text-base font-semibold text-gray-900 dark:text-white">
//               Personal Details
//             </h3>
//           </div>

//           <div>
//             <label className={label}>Your name *</label>
//             <input type="text" name="fullName" value={formData.fullName}
//               onChange={handleInputChange} className={input}
//               placeholder="Enter your full name" />
//             {errors.fullName && <p className={err}>{errors.fullName}</p>}
//           </div>

//           <div>
//             <label className={label}>Your email *</label>
//             <input type="email" name="email" value={formData.email}
//               onChange={handleInputChange} className={input}
//               placeholder="student@gmail.com" />
//             {errors.email && <p className={err}>{errors.email}</p>}
//           </div>

//           {!isGoogleUser && (
//             <div>
//               <label className={label}>Create password *</label>
//               <input type="password" name="password" value={formData.password}
//                 onChange={handleInputChange} className={input}
//                 placeholder="Create a strong password" />
//               {errors.password && <p className={err}>{errors.password}</p>}
//             </div>
//           )}

//           <div>
//             <label className={label}>Mobile Number *</label>
//             <input type="tel" name="mobile" value={formData.mobile}
//               onChange={handleInputChange} className={input}
//               placeholder="+91 1234567890" />
//             {errors.mobile && <p className={err}>{errors.mobile}</p>}
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className={label}>Date of Birth *</label>
//               <input type="date" name="dob" value={formData.dob}
//                 onChange={handleInputChange} className={input} />
//               {errors.dob && <p className={err}>{errors.dob}</p>}
//             </div>
//             <div>
//               <label className={label}>Gender *</label>
//               <select name="gender" value={formData.gender}
//                 onChange={handleInputChange} className={input}>
//                 <option value="">Select</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="other">Other</option>
//               </select>
//               {errors.gender && <p className={err}>{errors.gender}</p>}
//             </div>
//           </div>

//           <div>
//             <label className={label}>City *</label>
//             <input type="text" name="city" value={formData.city}
//               onChange={handleInputChange} className={input}
//               placeholder="Your city" />
//             {errors.city && <p className={err}>{errors.city}</p>}
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className={label}>State *</label>
//               <input type="text" name="state" value={formData.state}
//                 onChange={handleInputChange} className={input}
//                 placeholder="State" />
//               {errors.state && <p className={err}>{errors.state}</p>}
//             </div>
//             <div>
//               <label className={label}>Country *</label>
//               <input type="text" name="country" value={formData.country}
//                 onChange={handleInputChange} className={input}
//                 placeholder="Country" />
//               {errors.country && <p className={err}>{errors.country}</p>}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Step 2 ── */}
//       {currentStep === 2 && (
//         <div className="space-y-3">
//           <div className="flex items-center gap-2 mb-3">
//             <GraduationCap className="text-orange-500" size={18} />
//             <h3 className="text-base font-semibold text-gray-900 dark:text-white">
//               Educational Details
//             </h3>
//           </div>

//           <div>
//             <label className={label}>Highest Qualification *</label>
//             <select name="qualification" value={formData.qualification}
//               onChange={handleInputChange} className={input}>
//               <option value="">Select Qualification</option>
//               <option value="10th">10th</option>
//               <option value="12th">12th</option>
//               <option value="graduation">Graduation</option>
//               <option value="postgraduation">Post-Graduation</option>
//               <option value="phd">PhD</option>
//             </select>
//             {errors.qualification && <p className={err}>{errors.qualification}</p>}
//           </div>

//           <div>
//             <label className={label}>College / University Name *</label>
//             <input type="text" name="collegeName" value={formData.collegeName}
//               onChange={handleInputChange} className={input}
//               placeholder="Enter your institution name" />
//             {errors.collegeName && <p className={err}>{errors.collegeName}</p>}
//           </div>

//           <div>
//             <label className={label}>Year of Passing *</label>
//             <input type="number" name="yearOfPassing" value={formData.yearOfPassing}
//               onChange={handleInputChange} className={input}
//               placeholder="e.g., 2024" min="1950" max="2030" />
//             {errors.yearOfPassing && <p className={err}>{errors.yearOfPassing}</p>}
//           </div>

//           <div>
//             <label className={label}>Current Status *</label>
//             <div className="space-y-2 mt-1">
//               {["Student", "Working Professional", "Fresher"].map((status) => (
//                 <label
//                   key={status}
//                   className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:opacity-80 border border-gray-200 dark:border-gray-600"
//                 >
//                   <input
//                     type="radio"
//                     name="currentStatus"
//                     value={status}
//                     checked={formData.currentStatus === status}
//                     onChange={handleInputChange}
//                     className="w-4 h-4 accent-orange-500"
//                   />
//                   <span className="text-sm text-gray-900 dark:text-white">{status}</span>
//                 </label>
//               ))}
//             </div>
//             {errors.currentStatus && <p className={err}>{errors.currentStatus}</p>}
//           </div>
//         </div>
//       )}

//       {/* ── Step 3 ── */}
//       {currentStep === 3 && (
//         <div className="space-y-4">
//           <div className="flex items-center gap-2 mb-3">
//             <CheckCircle className="text-orange-500" size={18} />
//             <h3 className="text-base font-semibold text-gray-900 dark:text-white">
//               Review & Submit
//             </h3>
//           </div>

//           {/* Summary */}
//           <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 text-sm space-y-1.5">
//             <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Application Summary</h4>
//             {[
//               ["Name", formData.fullName],
//               ["Email", formData.email],
//               ["Mobile", formData.mobile],
//               ["Qualification", formData.qualification],
//               ["Status", formData.currentStatus],
//             ].map(([key, val]) => (
//               <p key={key} className="text-gray-600 dark:text-gray-300">
//                 <span className="font-medium">{key}:</span> {val}
//               </p>
//             ))}
//           </div>

//           {/* Checkboxes */}
//           <div className="space-y-2">
//             <label className="flex items-start gap-3 cursor-pointer">
//               <input type="checkbox" name="agreeTerms"
//                 checked={formData.agreeTerms} onChange={handleInputChange}
//                 className="w-4 h-4 mt-0.5 accent-orange-500" />
//               <span className="text-sm text-gray-600 dark:text-gray-300">
//                 I agree to the{" "}
//                 <span className="text-orange-500 underline">Terms & Conditions</span> *
//               </span>
//             </label>
//             {errors.agreeTerms && <p className={err}>{errors.agreeTerms}</p>}

//             <label className="flex items-start gap-3 cursor-pointer">
//               <input type="checkbox" name="agreePrivacy"
//                 checked={formData.agreePrivacy} onChange={handleInputChange}
//                 className="w-4 h-4 mt-0.5 accent-orange-500" />
//               <span className="text-sm text-gray-600 dark:text-gray-300">
//                 I agree to the{" "}
//                 <span className="text-orange-500 underline">Privacy Policy</span> *
//               </span>
//             </label>
//             {errors.agreePrivacy && <p className={err}>{errors.agreePrivacy}</p>}
//           </div>
//         </div>
//       )}

//       {/* Navigation */}
//       <div className="flex justify-between mt-6">
//         <button
//           onClick={prevStep}
//           disabled={currentStep === 1 || loading}
//           className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition ${
//             currentStep === 1 || loading
//               ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
//               : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
//           }`}
//         >
//           <ChevronLeft size={16} /> Previous
//         </button>

//         {currentStep < 3 ? (
//           <button
//             onClick={nextStep}
//             disabled={loading}
//             className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
//           >
//             Next <ChevronRight size={16} />
//           </button>
//         ) : (
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition"
//           >
//             {loading ? "Submitting..." : "Submit Application"}
//             <CheckCircle size={16} />
//           </button>
//         )}
//       </div>

//       {/* Back to Home */}
//       <div className="text-center mt-5">
//         <button
//           onClick={() => navigate("/")}
//           className="text-orange-500 hover:text-orange-600 underline text-sm font-medium"
//         >
//           ← Back to Home
//         </button>
//       </div>
//     </div>
//   );
// }



















import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  User,
  GraduationCap,
  CheckCircle,
} from "lucide-react";
import authService from "../services/authService";

export default function StudentApplicationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const isGoogleUser = location.state?.isGoogleUser || false;
  const [currentStep, setCurrentStep] = useState(1);

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

  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        fullName: location.state.name || "",
        email: location.state.email || "",
      }));
    }
  }, [location.state]);

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
      if (!isGoogleUser) {
        if (!formData.password) {
          newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        }
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

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    try {
      setLoading(true);
      await authService.register({
        name: formData.fullName,
        email: formData.email,
        password: isGoogleUser ? null : formData.password,
        role: "STUDENT",
        isGoogleUser: isGoogleUser,
      });
      alert(
        "✅ Application Submitted!\n\n" +
          "Step 1: Verify your email first 📩\n" +
          "Step 2: After verification, admin will approve your account ⏳\n\n" +
          "You can login only after approval."
      );
      setCurrentStep(1);
      setFormData({
        fullName: "", email: "", password: "", mobile: "", dob: "",
        gender: "", city: "", state: "", country: "", qualification: "",
        collegeName: "", yearOfPassing: "", currentStatus: "",
        agreeTerms: false, agreePrivacy: false,
      });
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      console.log("Student apply error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "❌ Something went wrong. Please try again.";
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

  const input =
    "w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm";
  const label = "block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium";
  const err = "text-red-500 text-xs mt-1";

  return (
    <div className="w-full max-w-lg mx-auto py-6 px-4">

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-6">
        {[1, 2, 3].map((step, idx) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  currentStep >= step
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
              >
                {step}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {step === 1 ? "You" : step === 2 ? "Details" : "Submit"}
              </span>
            </div>
            {idx < 2 && (
              <div
                className={`w-16 md:w-20 h-0.5 mx-2 mb-4 transition-colors ${
                  currentStep > step
                    ? "bg-orange-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step heading */}
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Student Application
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Fill all details correctly. Your account will be approved by Admin.
        </p>
      </div>

      {/* ── Step 1 ── */}
      {currentStep === 1 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <User className="text-orange-500" size={18} />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Personal Details
            </h3>
          </div>

          <div>
            <label className={label}>Your name *</label>
            <input type="text" name="fullName" value={formData.fullName}
              onChange={handleInputChange} className={input}
              placeholder="Enter your full name" />
            {errors.fullName && <p className={err}>{errors.fullName}</p>}
          </div>

          <div>
            <label className={label}>Your email *</label>
            <input type="email" name="email" value={formData.email}
              onChange={handleInputChange} className={input}
              placeholder="student@gmail.com"
              disabled={isGoogleUser} />
            {errors.email && <p className={err}>{errors.email}</p>}
          </div>

          {!isGoogleUser && (
            <div>
              <label className={label}>Create password *</label>
              <input type="password" name="password" value={formData.password}
                onChange={handleInputChange} className={input}
                placeholder="Create a strong password" />
              {errors.password && <p className={err}>{errors.password}</p>}
            </div>
          )}

          <div>
            <label className={label}>Mobile Number *</label>
            <input type="tel" name="mobile" value={formData.mobile}
              onChange={handleInputChange} className={input}
              placeholder="+91 1234567890" />
            {errors.mobile && <p className={err}>{errors.mobile}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Date of Birth *</label>
              <input type="date" name="dob" value={formData.dob}
                onChange={handleInputChange} className={input} />
              {errors.dob && <p className={err}>{errors.dob}</p>}
            </div>
            <div>
              <label className={label}>Gender *</label>
              <select name="gender" value={formData.gender}
                onChange={handleInputChange} className={input}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className={err}>{errors.gender}</p>}
            </div>
          </div>

          <div>
            <label className={label}>City *</label>
            <input type="text" name="city" value={formData.city}
              onChange={handleInputChange} className={input}
              placeholder="Your city" />
            {errors.city && <p className={err}>{errors.city}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>State *</label>
              <input type="text" name="state" value={formData.state}
                onChange={handleInputChange} className={input}
                placeholder="State" />
              {errors.state && <p className={err}>{errors.state}</p>}
            </div>
            <div>
              <label className={label}>Country *</label>
              <input type="text" name="country" value={formData.country}
                onChange={handleInputChange} className={input}
                placeholder="Country" />
              {errors.country && <p className={err}>{errors.country}</p>}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2 ── */}
      {currentStep === 2 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="text-orange-500" size={18} />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Educational Details
            </h3>
          </div>

          <div>
            <label className={label}>Highest Qualification *</label>
            <select name="qualification" value={formData.qualification}
              onChange={handleInputChange} className={input}>
              <option value="">Select Qualification</option>
              <option value="10th">10th</option>
              <option value="12th">12th</option>
              <option value="graduation">Graduation</option>
              <option value="postgraduation">Post-Graduation</option>
              <option value="phd">PhD</option>
            </select>
            {errors.qualification && <p className={err}>{errors.qualification}</p>}
          </div>

          <div>
            <label className={label}>College / University Name *</label>
            <input type="text" name="collegeName" value={formData.collegeName}
              onChange={handleInputChange} className={input}
              placeholder="Enter your institution name" />
            {errors.collegeName && <p className={err}>{errors.collegeName}</p>}
          </div>

          <div>
            <label className={label}>Year of Passing *</label>
            <input type="number" name="yearOfPassing" value={formData.yearOfPassing}
              onChange={handleInputChange} className={input}
              placeholder="e.g., 2024" min="1950" max="2030" />
            {errors.yearOfPassing && <p className={err}>{errors.yearOfPassing}</p>}
          </div>

          <div>
            <label className={label}>Current Status *</label>
            <div className="space-y-2 mt-1">
              {["Student", "Working Professional", "Fresher"].map((status) => (
                <label key={status}
                  className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:opacity-80 border border-gray-200 dark:border-gray-600">
                  <input type="radio" name="currentStatus" value={status}
                    checked={formData.currentStatus === status}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-orange-500" />
                  <span className="text-sm text-gray-900 dark:text-white">{status}</span>
                </label>
              ))}
            </div>
            {errors.currentStatus && <p className={err}>{errors.currentStatus}</p>}
          </div>
        </div>
      )}

      {/* ── Step 3 ── */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="text-orange-500" size={18} />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Review & Submit
            </h3>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 text-sm space-y-1.5">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Application Summary</h4>
            {[
              ["Name", formData.fullName],
              ["Email", formData.email],
              ["Mobile", formData.mobile],
              ["Qualification", formData.qualification],
              ["Status", formData.currentStatus],
            ].map(([key, val]) => (
              <p key={key} className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">{key}:</span> {val}
              </p>
            ))}
          </div>

          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="agreeTerms"
                checked={formData.agreeTerms} onChange={handleInputChange}
                className="w-4 h-4 mt-0.5 accent-orange-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                I agree to the{" "}
                <span className="text-orange-500 underline">Terms & Conditions</span> *
              </span>
            </label>
            {errors.agreeTerms && <p className={err}>{errors.agreeTerms}</p>}

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="agreePrivacy"
                checked={formData.agreePrivacy} onChange={handleInputChange}
                className="w-4 h-4 mt-0.5 accent-orange-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                I agree to the{" "}
                <span className="text-orange-500 underline">Privacy Policy</span> *
              </span>
            </label>
            {errors.agreePrivacy && <p className={err}>{errors.agreePrivacy}</p>}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button onClick={prevStep} disabled={currentStep === 1 || loading}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            currentStep === 1 || loading
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}>
          <ChevronLeft size={16} /> Previous
        </button>

        {currentStep < 3 ? (
          <button onClick={nextStep} disabled={loading}
            className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition">
            {loading ? "Submitting..." : "Submit Application"}
            <CheckCircle size={16} />
          </button>
        )}
      </div>

      {/* Back to Home */}
      <div className="text-center mt-5">
        <button onClick={() => navigate("/")}
          className="text-orange-500 hover:text-orange-600 underline text-sm font-medium">
          ← Back to Home
        </button>
      </div>
    </div>
  );
}