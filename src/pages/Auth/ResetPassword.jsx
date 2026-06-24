// import React, { useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import authService from "../../services/authService";

// const ResetPassword = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   // ✅ token comes from URL
//   const token = searchParams.get("token");

//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const validate = () => {
//     if (!token) return "Reset token missing ❌";
//     if (!newPassword) return "New password is required";
//     if (newPassword.length < 8) return "Password must be at least 8 characters";
//     if (newPassword !== confirmPassword) return "Passwords do not match";
//     return "";
//   };

//   const handleReset = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     const validationError = validate();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     try {
//       setLoading(true);

//       // ✅ calling backend
//       await authService.resetPassword(token, newPassword);

//       setMessage("✅ Password reset successful! Please login again.");

//       setTimeout(() => {
//         navigate("/login");
//       }, 2000);
//     } catch (err) {
//       console.error(err);
//       setError(err?.response?.data?.message || "❌ Reset password failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 px-4">
//       <div className="w-full max-w-md bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-8">
//         <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
//           Reset Password
//         </h2>
//         <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-2 mb-6">
//           Enter your new password below
//         </p>

//         {/* ERROR */}
//         {error && (
//           <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
//             <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
//           </div>
//         )}

//         {/* SUCCESS */}
//         {message && (
//           <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
//             <p className="text-sm text-emerald-600 dark:text-emerald-400">
//               {message}
//             </p>
//           </div>
//         )}

//         <form onSubmit={handleReset} className="space-y-4">
//           {/* NEW PASSWORD */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               New Password
//             </label>
//             <input
//               type="password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               placeholder="Enter new password"
//               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
//               required
//             />
//           </div>

//           {/* CONFIRM PASSWORD */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="Confirm new password"
//               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
//           >
//             {loading ? "Resetting..." : "Reset Password"}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <button
//             onClick={() => navigate("/login")}
//             className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
//           >
//             ← Back to Login
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;











































import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authService from "../../services/authService";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Password strength ────────────────────────────────────────────────────
  const getStrength = (pw) => {
    if (!pw) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 2) return { score, label: "Weak", color: "#f43f5e" };
    if (score <= 4) return { score, label: "Fair", color: "#f59e0b" };
    if (score === 5) return { score, label: "Good", color: "#22d3ee" };
    return { score, label: "Strong", color: "#34d399" };
  };
  const strength = getStrength(newPassword);

  const validate = () => {
    if (!token) return "Reset token missing ❌";
    if (!newPassword) return "New password is required";
    if (newPassword.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(newPassword)) return "Must include at least one uppercase letter";
    if (!/[a-z]/.test(newPassword)) return "Must include at least one lowercase letter";
    if (!/[0-9]/.test(newPassword)) return "Must include at least one number";
    if (!/[^A-Za-z0-9]/.test(newPassword)) return "Must include at least one symbol (!@#$…)";
    if (newPassword !== confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    try {
      setLoading(true);
      await authService.resetPassword(token, newPassword);
      setMessage("✅ Password reset successful! Redirecting to login…");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err?.response?.data?.message || "❌ Reset password failed");
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ show }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {show ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </>
      )}
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-black dark:to-gray-800">

      {/* HEADER */}
      <header className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-sm border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <span className="text-4xl font-extrabold tracking-wider font-serif">
              <span className="text-green-600">ILM</span>
              <span className="text-[#F97316] ml-2">ORA</span>
            </span>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-8">

            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-2">
              Set New Password
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-sm">
              Choose a strong password to secure your account
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            {message && (
              <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <p className="text-sm text-emerald-600 dark:text-emerald-400">{message}</p>
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-5">

              {/* NEW PASSWORD */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  {newPassword && (
                    <span className="text-xs font-bold" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 chars, mixed symbols"
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                    tabIndex={-1}
                  >
                    <EyeIcon show={showNew} />
                  </button>
                </div>
                {/* Strength bar */}
                {newPassword && (
                  <div className="flex gap-1 mt-2">
                    {[1,2,3,4,5,6].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength.score ? strength.color : "#e2e8f0" }}
                      />
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Must include uppercase, lowercase, number &amp; symbol
                </p>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                    tabIndex={-1}
                  >
                    <EyeIcon show={showConfirm} />
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
                {confirmPassword && newPassword === confirmPassword && (
                  <p className="text-xs text-emerald-500 mt-1">✓ Passwords match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg transition duration-300 disabled:opacity-50"
              >
                {loading ? "Resetting…" : "Reset Password"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-sm bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent hover:underline"
              >
                ← Back to Login
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;