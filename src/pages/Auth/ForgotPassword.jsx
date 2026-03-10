import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authService from "../../services/authService";

const colors = {
  primary: "from-orange-500 to-orange-600",
  primarySolid: "bg-orange-500",
  accent: "from-orange-400 to-orange-600",
  muted: "text-gray-600 dark:text-gray-400",
  surface: "bg-white dark:bg-black",
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
      const res = await authService.forgotPassword(email);
      setMessage(res?.data?.message || "✅ Reset link sent to your email!");
      setEmail("");

      setTimeout(() => {
        navigate(`/login?role=${role}`);
      }, 2000);
    } catch (err) {
      setError(
        err?.response?.data?.message || "❌ No account found with this email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
      
      {/* HEADER */}
      <header className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-sm border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div
  className="flex items-center cursor-pointer"
  onClick={() => navigate("/")}
>
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
  Reset Password
</h2>

            <p className={`${colors.muted} text-center mb-6`}>
              Enter your registered email to receive reset link
            </p>

            {/* ERROR */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* SUCCESS */}
            {message && (
              <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  {message}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r ${colors.primary} hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg transition duration-300 disabled:opacity-50`}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate(`/login?role=${role}`)}
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

export default ForgotPassword;




















