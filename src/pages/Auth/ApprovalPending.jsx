
import React, { useEffect, useState } from "react";
import { Clock, Mail, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

export default function ApprovalPending() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");

  const [status, setStatus] = useState("PENDING"); // PENDING | APPROVED | REJECTED
  const [role, setRole] = useState(""); // STUDENT | TRAINER | ADMIN | BUSINESS
  const [loading, setLoading] = useState(false);

  // ✅ Backend status check
  useEffect(() => {
    const fetchStatus = async () => {
      if (!email) return;

      try {
        setLoading(true);

        // ✅ UPDATED API: /api/auth/status?email=...
        const res = await axios.get(
          `${API_BASE_URL}/api/auth/status?email=${encodeURIComponent(email)}`,
        );

        // expected:
        // { email: "...", role: "STUDENT", status: "PENDING" }
        if (res?.data?.status) {
          setStatus(res.data.status);
        }

        if (res?.data?.role) {
          setRole(res.data.role);
        }
      } catch (err) {
        console.log("❌ Status check error:", err);
        // If API fails, keep default pending
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [email]);

  // ✅ Login redirect based on role
  const handleGoToLogin = () => {
    if (role === "ADMIN") navigate("/admin/login");
    else if (role === "TRAINER") navigate("/trainer/login");
    else if (role === "BUSINESS") navigate("/business/login");
    else navigate("/student/login"); // default
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black">
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            {status === "APPROVED" ? (
              <CheckCircle2 className="text-green-500" size={32} />
            ) : status === "REJECTED" ? (
              <XCircle className="text-red-500" size={32} />
            ) : (
              <Clock className="text-yellow-500" size={32} />
            )}
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {status === "APPROVED"
            ? "Approved ✅"
            : status === "REJECTED"
              ? "Rejected ❌"
              : "Approval Pending"}
        </h1>

        {/* MESSAGE */}
        {status === "PENDING" && (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Your application has been submitted successfully.
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Our team is reviewing your details. You will get access once your
              account is approved.
            </p>
          </>
        )}

        {status === "APPROVED" && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            Your account is approved! You can login now.
          </p>
        )}

        {status === "REJECTED" && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            Your application was rejected. Please contact support.
          </p>
        )}

        {/* INFO */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400">
          <Mail size={16} />
          <span>
            {loading
              ? "Checking status..."
              : email
                ? `Status for: ${email}${role ? ` (${role})` : ""}`
                : "You will be notified via email"}
          </span>
        </div>

        {/* ACTION */}
        <button
          onClick={() => navigate("/")}
          className="mt-8 w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold hover:opacity-90 transition"
        >
          Back to Home
        </button>

        {/* EXTRA LOGIN BUTTON */}
        {status === "APPROVED" && (
          <button
            onClick={handleGoToLogin}
            className="mt-3 w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:opacity-90 transition"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}
