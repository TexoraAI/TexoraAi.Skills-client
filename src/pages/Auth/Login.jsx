
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import auth from "../../auth";

const colors = {
  primary: "from-orange-500 to-orange-600",
  primarySolid: "bg-orange-500",
  accent: "from-orange-400 to-orange-600",
  muted: "text-gray-600 dark:text-gray-400",
  surface: "bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl",
};

const GOOGLE_CLIENT_ID =
  "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

const TexoraLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const redirectByRole = (role) => {
    switch (role.toUpperCase()) {
      case "ADMIN":
        navigate("/admin", { replace: true });
        break;
      case "TRAINER":
        navigate("/trainer", { replace: true });
        break;
      case "BUSINESS":
        navigate("/business", { replace: true });
        break;
      default:
        navigate("/student", { replace: true });
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

  const handleGoogleSuccess = async (res) => {
    try {
      const decoded = jwtDecode(res.credential);
      const roleGuess = getRoleFromEmail(decoded.email);

      const success = await auth.googleLogin({
        idToken: res.credential,
        role: roleGuess.toLowerCase(),
      });

      if (success) {
        const role = auth.getCurrentRole().toUpperCase();
        localStorage.setItem("role", role);
        redirectByRole(role);
      }
    } catch {
      alert("Google login failed!");
    }
  };

  const handleGoogleError = () => {
    alert("Google Login Failed");
  };

  const getRoleFromEmail = (email) => {
    if (!email) return "STUDENT";
    const e = email.toLowerCase();
    if (e.includes("admin")) return "ADMIN";
    if (e.includes("trainer")) return "TRAINER";
    if (e.includes("business")) return "BUSINESS";
    return "STUDENT";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E9E0] via-orange-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">

     {/* HEADER */}
<header className="bg-white/80 dark:bg-black/70 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">

<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

  {/* Logo */}
  <div
    className="flex items-center cursor-pointer"
    onClick={() => navigate("/")}
  >
    <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide font-serif whitespace-nowrap">
      <span className="text-green-600">ILM</span>
      <span className="text-[#F97316] ml-1 sm:ml-2">ORA</span>
    </span>
  </div>

  
{/* Desktop Menu */}
<div className="hidden md:flex items-center gap-8 text-sm font-medium">

  <button
    className={`${colors.muted} hover:text-[#F97316] transition`}
    onClick={() => navigate("/apply-admin")}
  >
    Apply to Admin
  </button>

  <button
    className={`${colors.muted} hover:text-[#F97316] transition`}
    onClick={() => navigate("/apply-business")}
  >
    Apply to Business
  </button>

  <button
    className={`${colors.muted} hover:text-[#F97316] transition`}
    onClick={() => navigate("/apply-trainer")}
  >
    Apply to Trainer
  </button>

  <button
    className={`${colors.muted} hover:text-[#F97316] transition`}
    onClick={() => navigate("/apply-student")}
  >
    Apply to Student
  </button>

</div>

  {/* Mobile Menu Button */}
  <div className="md:hidden">
    <button
      onClick={() => setMobileMenu(!mobileMenu)}
      className="text-gray-700 dark:text-white text-2xl"
    >
      {mobileMenu ? "✕" : "☰"}
    </button>
  </div>

</div>

{/* Mobile Menu */}
{mobileMenu && (
  <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 px-6 py-4 space-y-4">

    <button
      className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-orange-500"
      onClick={() => {
        navigate("/apply-admin");
        setMobileMenu(false);
      }}
    >
      Apply to Admin
    </button>

    <button
      className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-orange-500"
      onClick={() => {
        navigate("/apply-business");
        setMobileMenu(false);
      }}
    >
      Apply to Business
    </button>

    <button
      className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-orange-500"
      onClick={() => {
        navigate("/apply-trainer");
        setMobileMenu(false);
      }}
    >
      Apply to Trainer
    </button>

    <button
      className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-orange-500"
      onClick={() => {
        navigate("/apply-student");
        setMobileMenu(false);
      }}
    >
      Apply to Student
    </button>

  </div>
)}

</header>
      {/* MAIN */}
      <div className="flex items-center justify-center px-4 py-16">

        <div className={`max-w-4xl w-full rounded-3xl shadow-2xl ${colors.surface} border border-gray-200 dark:border-gray-800`}>

          <div className="flex flex-col md:flex-row">

            <div className="flex-1 p-10 md:p-14">

              <div className="max-w-md mx-auto">

              <h1 className="text-3xl md:text-4xl font-semibold text-center leading-tight tracking-tight mb-2">

Welcome back <br className="hidden sm:block" />

<span className="text-3xl sm:text-4xl font-extrabold tracking-wider font-serif">
  <span className="text-green-600">ILM</span>
  <span className="text-[#F97316] ml-2">ORA</span>
</span>

</h1>

                {/* GOOGLE LOGIN */}
                <div className="flex justify-center mb-6">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                    width="320"
                  />
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                  <span className="text-xs text-gray-400">OR CONTINUE WITH EMAIL</span>
                  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                  />

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-sm text-orange-500 hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 text-white py-3 rounded-xl font-semibold shadow-md transition"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>

                </form>

              </div>

            </div>

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