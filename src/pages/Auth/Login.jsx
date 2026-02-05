import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import auth from "../../auth";

// Color scheme
const colors = {
  primary: "from-blue-600 to-emerald-600",
  primarySolid: "bg-blue-600",
  accent: "from-yellow-400 to-orange-500",
  muted: "text-gray-600 dark:text-gray-400",
  surface: "bg-white dark:bg-black",
};

const GOOGLE_CLIENT_ID = "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

const TexoraLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectByRole = (role) => {
    const upperRole = role.toUpperCase();
    switch (upperRole) {
      case "ADMIN": navigate("/admin", { replace: true }); break;
      case "TRAINER": navigate("/trainer", { replace: true }); break;
      case "BUSINESS": navigate("/business", { replace: true }); break;
      default: navigate("/student", { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const success = await auth.login({ email, password });
      if (success) {
        const role = auth.getCurrentRole().toUpperCase();
        localStorage.setItem("role", role);
        redirectByRole(role);
      } else {
        alert("Login failed!");
      }
    } catch (error) {
      alert("Login error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const roleGuess = getRoleFromEmail(decoded.email);
      
      const success = await auth.googleLogin({
        idToken: credentialResponse.credential,
        role: roleGuess.toLowerCase()
      });
      
      if (success) {
        const role = auth.getCurrentRole().toUpperCase();
        localStorage.setItem("role", role);
        redirectByRole(role);
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed!");
    }
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");
  };

  const getRoleFromEmail = (email) => {
    if (!email) return "STUDENT";
    const domain = email.toLowerCase();
    if (domain.includes("admin")) return "ADMIN";
    if (domain.includes("trainer")) return "TRAINER";
    if (domain.includes("business")) return "BUSINESS";
    return "STUDENT";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header with Apply buttons */}
      <header className="bg-white dark:bg-black shadow-sm border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className={`w-8 h-8 bg-gradient-to-br ${colors.primary} rounded flex items-center justify-center shadow-md`}>
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">TexoraAi.skills</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className={`${colors.muted} hover:text-gray-900 dark:hover:text-white font-medium transition-colors`} onClick={() => navigate("/apply-admin")}>
              Apply to Admin
            </button>
            <button className={`${colors.muted} hover:text-gray-900 dark:hover:text-white font-medium transition-colors`} onClick={() => navigate("/apply-business")}>
              Apply to Business
            </button>
            <button className={`${colors.muted} hover:text-gray-900 dark:hover:text-white font-medium transition-colors`} onClick={() => navigate("/apply-trainer")}>
              Apply to trainer
            </button>
            <button onClick={() => navigate("/apply-student")} className={`${colors.primarySolid} hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors`}>
              Apply to student
            </button>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Log in to your account
          </h2>

          <div className="bg-white dark:bg-black rounded-lg shadow-md border dark:border-gray-800 p-8">
            <div className="mb-6">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                width="100%"
                text="signin_with"
                disabled={loading}
              />
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-black text-gray-500 dark:text-gray-400">
                  or use email
                </span>
              </div>
            </div>

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
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${colors.primarySolid} hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors shadow-md hover:shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            {/* ✅ Sign up line REMOVED */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Login() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <TexoraLogin />
    </GoogleOAuthProvider>
  );
}
