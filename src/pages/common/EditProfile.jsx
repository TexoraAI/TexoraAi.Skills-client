
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Camera, User, Mail, Briefcase, Save, ArrowLeft } from "lucide-react";
import userService from "../../services/userService";

const EditProfile = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isStudent = pathname.startsWith("/student");
  const isTrainer = pathname.startsWith("/trainer");
  const isAdmin = pathname.startsWith("/admin");
  const isBusiness = pathname.startsWith("/business");

  const [formData, setFormData] = useState({
    name: "",
    role: "admin",
    email: "",
    photo: null,
    photoPreview: null,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = React.useRef(null);

  const getLockedRole = () => {
    if (isStudent) return "student";
    if (isTrainer) return "trainer";
    if (isBusiness) return "business";
    if (isAdmin) return "admin";
    return formData.role;
  };

  const getBackPath = () => {
    if (isStudent) return "/student/profile";
    if (isTrainer) return "/trainer/profile";
    if (isAdmin) return "/admin/profile";
    if (isBusiness) return "/business/profile";
    return "/profile";
  };

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await userService.getMyProfile();
        const user = res.data;

        setFormData((prev) => ({
          ...prev,
          name: user?.displayName || "",
          email: user?.email || "",
          role: (user?.roles || getLockedRole()).toLowerCase(),
          photo: null,
          photoPreview: "/default-avatar.png",
        }));
      } catch (error) {
        console.error("Fetch profile error:", error);
        setMessage({
          type: "error",
          text: "Failed to load profile. Please login again.",
        });
      }
    };

    fetchMyProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.match(/\S+@\S+\.\S+/))
      newErrors.email = "Valid email required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, photo: "Photo must be under 2MB." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: file, photoPreview: reader.result });
        if (errors.photo) setErrors({ ...errors, photo: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const lockedRole = getLockedRole();

      const payload = {
        displayName: formData.name,
        roles: lockedRole.toUpperCase(),
      };

      await userService.updateMyProfile(payload);

      setMessage({ type: "success", text: "Profile updated successfully!" });
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate(getBackPath());
      }, 1500);
    } catch (error) {
      console.error("Update profile error:", error);
      setMessage({ type: "error", text: "Update failed. Try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleLabel = () => {
    return formData.role.charAt(0).toUpperCase() + formData.role.slice(1);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(getBackPath())}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-slate-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            Edit Profile
          </h1>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
            Update your account information
          </p>
        </div>
      </div>

      {/* SUCCESS/ERROR MESSAGE */}
      {message.text && (
        <div
          className={`p-4 rounded-xl border ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
          }`}
          role="alert"
        >
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-700/80 rounded-2xl p-6 md:p-8 shadow-sm"
      >
        {/* PHOTO UPLOAD */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 p-1">
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-800">
                {formData.photoPreview ? (
                  <img
                    src={formData.photoPreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400 dark:text-slate-500" />
                  </div>
                )}
              </div>
            </div>
            
            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={triggerFileInput}
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              Change profile photo
            </button>
            <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
              JPG, PNG or GIF (max. 2MB)
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          
          {errors.photo && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.photo}
            </p>
          )}
        </div>

        {/* NAME FIELD */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300"
          >
            <User className="w-4 h-4" />
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.name
                ? "border-red-300 dark:border-red-700"
                : "border-gray-300 dark:border-slate-600"
            } bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        {/* ROLE FIELD (LOCKED) */}
        <div className="space-y-2">
          <label
            htmlFor="role"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300"
          >
            <Briefcase className="w-4 h-4" />
            Role
          </label>
          <div className="relative">
            <input
              type="text"
              value={getRoleLabel()}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 cursor-not-allowed"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400 rounded">
                Locked
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-500">
            Role cannot be changed from this page
          </p>
        </div>

        {/* EMAIL FIELD */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300"
          >
            <Mail className="w-4 h-4" />
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.email
                ? "border-red-300 dark:border-red-700"
                : "border-gray-300 dark:border-slate-600"
            } bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(getBackPath())}
            className="flex-1 px-6 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 font-medium transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 text-white font-medium shadow-sm hover:shadow-md transition-all disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;