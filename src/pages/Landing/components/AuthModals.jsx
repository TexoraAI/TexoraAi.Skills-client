import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import auth from "../../../auth";
import authService from "../../../services/authService";
import SignupModal from "../SignupModal";
import ForgotPasswordModal from "../ForgotPasswordModal";

const GOOGLE_CLIENT_ID =
  "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

/* ─────────────────────────────────────────────────────────────────
   AuthModals — shared Login / Signup / Forgot-password modal set.

   This is the SAME modal that already lived (and worked) only
   inside LMSHomepage.jsx. It has been extracted here so it can be
   mounted ONCE, at the App.jsx level, and reused by every public
   page (About, Careers, Pricing, Contact, etc.) that calls the
   `setShowLoginModal` prop — previously those pages only flipped a
   piece of state with nothing listening to it, so "Get Started" /
   "Login" appeared to do nothing.

   Props:
     showLogin    – boolean, controls the Login modal's visibility
                    (owned by the parent, e.g. App.jsx's
                    `showLoginModal` state)
     onCloseLogin – call to close the Login modal
     onOpenLogin  – call to (re)open the Login modal, used when the
                    Signup/Forgot modals hand control back to Login
───────────────────────────────────────────────────────────────── */
export default function AuthModals({ showLogin, onCloseLogin, onOpenLogin }) {
  const navigate = useNavigate();

  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [showModalPw, setShowModalPw] = useState(false);

  // Close on Escape while the login modal is open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onCloseLogin();
    };
    if (showLogin) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showLogin, onCloseLogin]);

  const redirectByRole = (role) => {
    switch ((role || "").toUpperCase()) {
      case "SUPER_ADMIN":
        navigate("/superadmin", { replace: true });
        break;
      case "ADMIN":
        navigate("/admin", { replace: true });
        break;
      case "TENANT_ADMIN":
        navigate("/admin", { replace: true });
        break;
      case "BUSINESS":
        navigate("/admin", { replace: true });
        break;
      case "TRAINER":
        navigate("/trainer", { replace: true });
        break;
      default:
        navigate("/student", { replace: true });
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (modalLoading) return;
    setModalLoading(true);
    try {
      const ok = await auth.login({
        email: modalEmail,
        password: modalPassword,
      });
      if (ok) {
        const role = (auth.getCurrentRole() || "STUDENT").toUpperCase();
        localStorage.setItem("role", role);
        onCloseLogin();
        redirectByRole(role);
      } else {
        alert("Login failed! Check your credentials.");
      }
    } catch (err) {
      alert("Login error: " + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalGoogle = async (res) => {
    try {
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
      localStorage.removeItem("role");

      const dec = jwtDecode(res.credential);

      const check = await authService.checkGoogleUser({
        idToken: res.credential,
      });

      // ── EXISTING USER ──────────────────────────────────────────
      if (check.isNewUser === false && check.token && check.role) {
        const role = check.role.toUpperCase();
        localStorage.setItem("lms_token", check.token);
        localStorage.setItem("role", role);

        if (check.organizationId) {
          localStorage.setItem("organizationId", check.organizationId);
        } else {
          localStorage.removeItem("organizationId");
        }

        localStorage.setItem(
          "lms_user",
          JSON.stringify({
            name: check.name || dec.name,
            email: check.email || dec.email,
            role: ["TENANT_ADMIN", "ADMIN", "BUSINESS"].includes(role)
              ? "admin"
              : role.toLowerCase(),
            isGoogleUser: true,
            profileCompleted: true,
            organizationId: check.organizationId || null,
          }),
        );
        onCloseLogin();
        redirectByRole(role);
        return;
      }

      // ── BRAND NEW USER ─────────────────────────────────────────
      sessionStorage.setItem("ilmora_google_credential", res.credential);
      onCloseLogin();
      navigate("/complete-profile", {
        replace: true,
        state: {
          name: dec.name,
          email: dec.email,
          googleCredential: res.credential,
        },
      });
    } catch (err) {
      alert("Google sign-in error: " + err.message);
    }
  };

  if (!showLogin && !showSignupModal && !showForgotModal) return null;

  return (
    <>
      {showLogin && (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(5px)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) onCloseLogin();
            }}
          >
            <div
              className="relative w-full max-w-md rounded-2xl shadow-2xl"
              style={{
                background: "rgba(255,255,255,0.97)",
                border: "1px solid rgba(249,115,22,0.18)",
                padding: "20px 26px 18px",
                animation: "modalFadeUp 0.3s ease both",
              }}
            >
              <style>{`@keyframes modalFadeUp { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>

              <button
                onClick={onCloseLogin}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition text-xl font-bold leading-none"
                aria-label="Close"
              >
                ×
              </button>

              <div className="flex justify-center mb-2">
                <span className="text-3xl font-extrabold font-serif tracking-wide">
                  <span className="text-green-600">ILM</span>
                  <span className="text-[#F97316] ml-2">ORA</span>
                </span>
              </div>

              <div className="text-center mb-3">
                <h2 className="text-lg font-bold text-[#1e0e02] mb-0.5">
                  Welcome back!
                </h2>
              </div>

              <div className="flex justify-center mb-3">
                <GoogleLogin
                  onSuccess={handleModalGoogle}
                  onError={() => console.error("Google OAuth failed")}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="360"
                  auto_select={false}
                  cancel_on_tap_outside={true}
                />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(180,100,30,0.15)" }}
                />
                <span className="text-xs text-[#b8906a] uppercase tracking-widest font-medium">
                  OR
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(180,100,30,0.15)" }}
                />
              </div>

              <form onSubmit={handleModalSubmit}>
                <div className="mb-2">
                  <label className="block text-xs font-bold text-[#8a6040] mb-1 uppercase tracking-widest">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={modalEmail}
                    onChange={(e) => setModalEmail(e.target.value)}
                    required
                    disabled={modalLoading}
                    className="w-full px-3.5 py-2 rounded-xl text-sm text-[#1a0e06] placeholder-[#c0a070] outline-none transition-all disabled:opacity-50"
                    style={{
                      background: "rgba(255,255,255,0.8)",
                      border: "1.5px solid rgba(180,120,60,0.2)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#F97316";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(249,115,22,0.1)";
                      e.target.style.background = "#fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(180,120,60,0.2)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <div className="mb-1.5">
                  <label className="block text-xs font-bold text-[#8a6040] mb-1 uppercase tracking-widest">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showModalPw ? "text" : "password"}
                      placeholder="Enter your password"
                      value={modalPassword}
                      onChange={(e) => setModalPassword(e.target.value)}
                      required
                      disabled={modalLoading}
                      className="w-full px-3.5 py-2 pr-11 rounded-xl text-sm text-[#1a0e06] placeholder-[#c0a070] outline-none transition-all disabled:opacity-50"
                      style={{
                        background: "rgba(255,255,255,0.8)",
                        border: "1.5px solid rgba(180,120,60,0.2)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#F97316";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(249,115,22,0.1)";
                        e.target.style.background = "#fff";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(180,120,60,0.2)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowModalPw((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b8906a] hover:text-[#F97316] transition p-0 bg-transparent border-none cursor-pointer"
                      tabIndex={-1}
                    >
                      {showModalPw ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="text-right mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      onCloseLogin();
                      setShowForgotModal(true);
                    }}
                    className="text-xs text-[#F97316] hover:underline bg-transparent border-none cursor-pointer font-medium p-0"
                  >
                    Forgot password?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="w-full py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg,#F97316,#ea580c)",
                    boxShadow: "0 4px 18px rgba(249,115,22,0.32)",
                  }}
                >
                  {modalLoading ? (
                    <>
                      <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    "Log in"
                  )}
                </button>
              </form>
              <button
                type="button"
                onClick={() => {
                  onCloseLogin();
                  setShowSignupModal(true);
                }}
                className="w-full mt-2.5 py-2.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                style={{
                  background: "transparent",
                  border: "2px solid #16a34a",
                  color: "#16a34a",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#16a34a";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#16a34a";
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  <path d="M2 12h20" />
                </svg>
                Sign up
              </button>

              <div className="text-center mt-3">
                <button
                  onClick={onCloseLogin}
                  className="text-xs text-[#b8906a] hover:text-[#8a6040] bg-transparent border-none cursor-pointer transition-colors"
                >
                  ← Back to home
                </button>
              </div>
            </div>
          </div>
        </GoogleOAuthProvider>
      )}
      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onSwitchToLogin={() => {
            setShowSignupModal(false);
            onOpenLogin();
          }}
        />
      )}
      {showForgotModal && (
        <ForgotPasswordModal
          onClose={() => setShowForgotModal(false)}
          onSwitchToLogin={() => {
            setShowForgotModal(false);
            onOpenLogin();
          }}
        />
      )}
    </>
  );
}