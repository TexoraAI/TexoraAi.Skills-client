
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authService from "../../services/authService"; // ✅ use your authService

// SAME COLOR SCHEME (Login page jaisa)
const colors = {
  primary: "from-blue-600 to-emerald-600",
  primarySolid: "bg-blue-600",
  muted: "text-gray-600 dark:text-gray-400",
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryRole = searchParams.get("role") || "student";
  const role = ["student", "trainer", "admin", "business"].includes(queryRole)
    ? queryRole
    : "student";

  const validateEmail = (value) => {
    if (!value) return "Email is required";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) return "Enter valid email";
    return "";
  };

  // ✅ BACKEND CONNECTED
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      // ✅ Call backend
      const res = await authService.forgotPassword(email);

      setMessage(res?.data?.message || "✅ Reset link sent to your email!");
      setEmail("");

      // Optional: redirect after 2 seconds
      setTimeout(() => {
        navigate(`/login?role=${role}`);
      }, 2000);
    } catch (err) {
      console.error("Forgot Password Error:", err);

      setError(
        err?.response?.data?.message || "❌ No account found with this email",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      {/* ✅ SAME HEADER AS LOGIN */}
      <header className="bg-white dark:bg-black shadow-sm border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div
              className={`w-8 h-8 bg-gradient-to-br ${colors.primary} rounded flex items-center justify-center shadow-md`}
            >
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              TexoraAi.skills
            </span>
          </div>

          
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-black rounded-lg shadow-md border dark:border-gray-800 p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Reset Password
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
              Enter your registered email to reset password
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {message && (
              <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  {message}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${colors.primarySolid} hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors shadow-md disabled:opacity-50`}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate(`/login?role=${role}`)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
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

export default ForgotPassword;
