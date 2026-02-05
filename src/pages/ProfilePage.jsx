
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, Mail, IdCard, Edit, Lock, LogOut } from "lucide-react";

const ProfilePage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isStudent = pathname.startsWith("/student");
  const isTrainer = pathname.startsWith("/trainer");
  const isAdmin = pathname.startsWith("/admin");
  const isBusiness = pathname.startsWith("/business");

  let user;

  if (isStudent) {
    user = {
      name: "Student User",
      role: "Student",
      email: "student@example.com",
      id: "STU-0012",
    };
  } else if (isTrainer) {
    user = {
      name: "Trainer User",
      role: "Trainer",
      email: "trainer@example.com",
      id: "TRN-0005",
    };
  } else if (isBusiness) {
    user = {
      name: "Business User",
      role: "Business Team",
      email: "business@example.com",
      id: "BUS-0003",
    };
  } else if (isAdmin) {
    user = {
      name: "Admin User",
      role: "Admin",
      email: "admin@example.com",
      id: "ADM-0001",
    };
  } else {
    user = {
      name: "LMS User",
      role: "User",
      email: "user@example.com",
      id: "USR-0001",
    };
  }

  const handleEditProfile = () => {
    if (isStudent) navigate("/student/edit-profile");
    else if (isTrainer) navigate("/trainer/edit-profile");
    else if (isAdmin) navigate("/admin/edit-profile");
    else if (isBusiness) navigate("/business/edit-profile");
    else navigate("/edit-profile");
  };

  const handleChangePassword = () => {
    navigate("/reset-password");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* HEADER WITH AVATAR */}
      <div className="flex items-center gap-5 p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 shadow-lg">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-3xl font-bold text-white shadow-xl">
          {user.name.charAt(0)}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{user.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium text-white">
              {user.role}
            </span>
            <span className="text-sm text-white/80">ID: {user.id}</span>
          </div>
        </div>
      </div>

      {/* ACCOUNT DETAILS CARD */}
      <div className="rounded-2xl border border-gray-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/80 shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-200">
            Account Details
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-500">
            {isStudent && "Student account information for LMS."}
            {isTrainer && "Trainer account information for LMS."}
            {isAdmin && "Admin account information and controls."}
            {isBusiness && "Business team account information."}
            {!isStudent &&
              !isTrainer &&
              !isAdmin &&
              !isBusiness &&
              "User account information."}
          </p>
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-500">
              <User className="w-4 h-4" />
              <p className="text-xs font-medium uppercase tracking-wide">
                Full Name
              </p>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-slate-100 pl-6">
              {user.name}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-500">
              <IdCard className="w-4 h-4" />
              <p className="text-xs font-medium uppercase tracking-wide">
                Role
              </p>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-slate-100 pl-6">
              {user.role}
            </p>
          </div>

          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-500">
              <Mail className="w-4 h-4" />
              <p className="text-xs font-medium uppercase tracking-wide">
                Email Address
              </p>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-slate-100 pl-6">
              {user.email}
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="pt-4 flex flex-wrap gap-3">
          <button
            onClick={handleEditProfile}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-medium text-white shadow-sm transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>

          <button
            onClick={handleChangePassword}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-sm font-medium text-gray-700 dark:text-slate-200 transition-colors"
          >
            <Lock className="w-4 h-4" />
            Change Password
          </button>

          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-red-300 dark:border-red-800 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-medium text-red-600 dark:text-red-400 transition-colors ml-auto">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;