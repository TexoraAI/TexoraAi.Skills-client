import React, { useEffect, useState } from "react";
import { Camera } from "lucide-react";

const SuperAdminProfile = () => {
  const [profile, setProfile] = useState({
    name: "Super Admin",
    email: "superadmin@texora.ai",
    role: "SUPER_ADMIN",
    phone: "+91 98765 43210",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
  });

  /* 🔹 Load saved data */
  useEffect(() => {
    const savedProfile = localStorage.getItem("superAdminProfile");
    const savedImage = localStorage.getItem("superAdminAvatar");

    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedImage) setProfileImage(savedImage);
  }, []);

  /* 🔹 Profile change */
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  /* 🔹 Save profile */
  const handleSaveProfile = () => {
    localStorage.setItem("superAdminProfile", JSON.stringify(profile));
    alert("✅ Profile updated successfully");
  };

  /* 🔹 Image upload (REAL FIX) */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
    localStorage.setItem("superAdminAvatar", imageUrl);

    // 🔥 notify header instantly
    window.dispatchEvent(new Event("super-admin-avatar-updated"));
  };

  /* 🔹 Password logic */
  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.new) {
      alert("❌ Please fill both password fields");
      return;
    }

    if (passwords.new.length < 6) {
      alert("❌ New password must be at least 6 characters");
      return;
    }

    alert("🔐 Password updated successfully");
    setPasswords({ current: "", new: "" });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Super Admin Profile
      </h1>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="flex flex-col items-center justify-center border-r">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                "SA"
              )}
            </div>

            {/* REAL CAMERA ICON */}
            <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-100 transition">
              <Camera size={18} className="text-indigo-600" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <p className="mt-3 font-medium">{profile.name}</p>
          <span className="text-xs text-gray-500">{profile.role}</span>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="px-3 py-2 border rounded-lg"
            />
            <input
              value={profile.email}
              disabled
              className="px-3 py-2 border rounded-lg bg-gray-100"
            />
            <input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="px-3 py-2 border rounded-lg"
            />
            <input
              value={profile.role}
              disabled
              className="px-3 py-2 border rounded-lg bg-gray-100"
            />
          </div>

          <div className="text-right">
            <button
              onClick={handleSaveProfile}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* SECURITY */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Security Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="password"
            placeholder="Current Password"
            value={passwords.current}
            onChange={(e) =>
              setPasswords({ ...passwords, current: e.target.value })
            }
            className="px-3 py-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwords.new}
            onChange={(e) =>
              setPasswords({ ...passwords, new: e.target.value })
            }
            className="px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="mt-4 text-right">
          <button
            onClick={handlePasswordChange}
            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminProfile;
