
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Mail, ArrowRight } from "lucide-react";
import axios from "axios";

// ✅ Backend Base URL (Gateway)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

console.log("API_BASE_URL =>", API_BASE_URL);

// Color scheme
const colors = {
  primary: "from-blue-600 to-emerald-600",
  primarySolid: "bg-blue-600",
  muted: "text-gray-600 dark:text-gray-400",
};

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [verificationStatus, setVerificationStatus] = useState("verifying");
  // verifying | success | error | pending

  const [email, setEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");

  // ✅ Verify token from URL
  useEffect(() => {
    if (token && emailParam) {
      setEmail(emailParam);
      verifyEmailToken(token, emailParam);
    } else if (emailParam) {
      setEmail(emailParam);
      setVerificationStatus("pending");
    } else {
      navigate("/login");
    }
  }, [token, emailParam, navigate]);

  // ✅ Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // ================= VERIFY EMAIL API =================
  const verifyEmailToken = async (token, email) => {
    try {
      setVerificationStatus("verifying");

      const res = await axios.post(
        `${API_BASE_URL}/api/auth/verify-email`,
        {
          token,
          email,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      setVerificationStatus("success");
      setMessage(res?.data?.message || "Email verified successfully!");

      // ✅ redirect after 2 sec
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Verify Email Error:", error);

      const backendMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Invalid or expired verification link.";

      setVerificationStatus("error");
      setMessage(backendMsg);
    }
  };

  // ================= RESEND VERIFICATION API =================
  const handleResendVerification = async () => {
    if (!email) {
      setMessage("Email is missing.");
      return;
    }

    if (resendCooldown > 0) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/resend-verification`,
        { email },
        { headers: { "Content-Type": "application/json" } },
      );

      setMessage(res?.data?.message || "Verification email sent again!");
      setResendCooldown(60);
    } catch (error) {
      console.error("Resend Verification Error:", error);

      const backendMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to resend verification email.";

      setMessage(backendMsg);
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Verifying your email...
            </h2>
            <p className={colors.muted}>
              Please wait while we verify your email address.
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Email Verified!
            </h2>
            <p className={`${colors.muted} mb-6`}>{message}</p>

            <button
              onClick={() => navigate("/login")}
              className={`${colors.primarySolid} hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2`}
            >
              Continue to Login
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-red-100 dark:bg-red-900/30">
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Verification Failed
            </h2>
            <p className={`${colors.muted} mb-6`}>{message}</p>

            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                disabled={resendCooldown > 0}
                className={`w-full ${colors.primarySolid} hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors`}
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend Verification Email"}
              </button>

              <button
                onClick={() => navigate("/login")}
                className="w-full border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        );

      case "pending":
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Check your email
            </h2>

            <p className={`${colors.muted} mb-4`}>
              We've sent a verification link to
            </p>

            <p className="text-gray-900 dark:text-white font-medium mb-6">
              {email}
            </p>

            {message && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  {message}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                disabled={resendCooldown > 0}
                className={`w-full ${colors.primarySolid} hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors`}
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend Verification Email"}
              </button>

              <button
                onClick={() => navigate("/login")}
                className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
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

      {/* Main Content */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-black rounded-lg shadow-md border dark:border-gray-800 p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
