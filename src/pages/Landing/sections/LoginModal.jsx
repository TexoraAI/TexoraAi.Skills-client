import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import auth from "../../../auth";
import authService from "../../../services/authService";
import { registerFcmToken } from "../../../services/firebaseService";

const GOOGLE_CLIENT_ID =
  "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

/* ─────────────────────────────────────────────────────────────────
   Login modal — real Google Sign-In + email/password + role-based
   redirect, same auth flow as LMSHomepage.jsx / TexoraLogin (/login).
   Logic is untouched from the original — only extracted into its own
   file. UI-only pass: no backend/API/business-logic changes.
───────────────────────────────────────────────────────────────── */
export default function LoginModal({ onClose }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const tryRegisterFcm = () => {
    if (Notification.permission === "granted") {
      registerFcmToken().catch(console.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const ok = await auth.login({ email, password });
      if (ok) {
        const role = (auth.getCurrentRole() || "STUDENT").toUpperCase();
        localStorage.setItem("role", role);
        localStorage.setItem(
          "lms_user",
          JSON.stringify({
            email,
            role: ["TENANT_ADMIN", "ADMIN", "BUSINESS"].includes(role)
              ? "admin"
              : role.toLowerCase(),
            profileCompleted: false,
          })
        );
        tryRegisterFcm();
        onClose();
        redirectByRole(role);
      } else {
        alert("Login failed! Check your credentials.");
      }
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (res) => {
    try {
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
      localStorage.removeItem("role");

      const dec = jwtDecode(res.credential);
      const check = await authService.checkGoogleUser({
        idToken: res.credential,
      });

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
          })
        );
        tryRegisterFcm();
        onClose();
        redirectByRole(role);
        return;
      }

      sessionStorage.setItem("ilmora_google_credential", res.credential);
      onClose();
      navigate("/complete-profile", {
        replace: true,
        state: {
          name: dec.name,
          email: dec.email,
          googleCredential: res.credential,
          isGoogleUser: true,
          fromGoogleLogin: true,
        },
      });
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Login failed");
    }
  };

  const handleGoogleError = () => console.error("Google OAuth failed");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div
        className="wsLoginModal"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <style>{LOGIN_MODAL_CSS}</style>
        <div className="wslm-card">
          <button className="wslm-close" onClick={onClose} aria-label="Close">
            ✕
          </button>

          <div className="wslm-logo">
            <span className="wslm-ilm">ILM</span>
            <span className="wslm-ora">ORA</span>
          </div>
          <h2 className="wslm-title">Welcome back!</h2>
          <p className="wslm-sub">Sign in with Google to get started, or use your email below.</p>

          <div className="wslm-google-wrap">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="340"
              auto_select={false}
              cancel_on_tap_outside={true}
            />
          </div>

          <div className="wslm-or-div">
            <div className="wslm-or-line" />
            <span className="wslm-or-text">OR</span>
            <div className="wslm-or-line" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="wslm-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="wslm-field">
              <label>Password</label>
              <div className="wslm-pw-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="wslm-eye-btn"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <EyeOpen size={16} />}
                </button>
              </div>
            </div>
            <div className="wslm-forgot-row">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/forgot-password");
                }}
              >
                Forgot password?
              </button>
            </div>
            <button type="submit" className="wslm-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="wslm-spinner" />
                  Signing in…
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <div className="wslm-back">
            <button onClick={onClose}>← Back to home</button>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

function EyeOpen({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/* Compact pass: tighter card padding/gaps, unified font stack (Plus Jakarta
   Sans body / Sora logo) — same look, less dead space, fully responsive
   down to small phones (own media query at the bottom). */
const LOGIN_MODAL_CSS = `
  .wsLoginModal{
    position:fixed; inset:0; z-index:1000;
    display:flex; align-items:center; justify-content:center;
    padding:20px 16px;
    background:rgba(0,0,0,0.55);
    backdrop-filter:blur(5px);
  }
  .wsLoginModal *{ box-sizing:border-box; font-family:'Plus Jakarta Sans',sans-serif; }
  .wslm-card{
    position:relative; width:100%; max-width:400px;
    background:rgba(255,255,255,0.97);
    border:1px solid rgba(249,115,22,0.18);
    border-radius:18px;
    padding:22px 22px 18px;
    box-shadow:0 24px 56px rgba(17,17,17,.32);
    animation:wslmFadeUp .3s ease both;
  }
  @keyframes wslmFadeUp{ from{ opacity:0; transform:translateY(16px) scale(.97);} to{ opacity:1; transform:translateY(0) scale(1);} }
  .wslm-close{
    position:absolute; top:10px; right:10px; width:26px; height:26px; border-radius:999px;
    border:none; background:transparent; color:#9ca3af; font-size:15px; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
  }
  .wslm-close:hover{ background:#f3f4f6; color:#374151; }
  .wslm-logo{ text-align:center; font-family:'Sora',sans-serif; font-weight:800; font-size:23px; margin-bottom:4px; }
  .wslm-ilm{ color:#16a34a; }
  .wslm-ora{ color:#f97316; margin-left:6px; }
  .wslm-title{ text-align:center; font-family:'Sora',sans-serif; font-size:15px; font-weight:700; color:#1e0e02; margin:0 0 2px; }
  .wslm-sub{ text-align:center; font-size:12px; color:#8a6040; margin:0 0 14px; }
  .wslm-google-wrap{ display:flex; justify-content:center; margin-bottom:12px; }
  .wslm-google-wrap > div{ width:100% !important; max-width:100% !important; }
  .wslm-or-div{ display:flex; align-items:center; gap:10px; margin-bottom:12px; }
  .wslm-or-line{ flex:1; height:1px; background:rgba(180,100,30,.15); }
  .wslm-or-text{ font-size:10.5px; color:#b8906a; letter-spacing:.1em; text-transform:uppercase; }
  .wslm-field{ margin-bottom:10px; }
  .wslm-field label{ display:block; font-size:10.5px; font-weight:700; color:#8a6040; margin-bottom:5px; letter-spacing:.05em; text-transform:uppercase; }
  .wslm-field input{
    width:100%; padding:10px 13px; border-radius:9px; font-size:13px; outline:none;
    background:rgba(255,255,255,.85); border:1.5px solid rgba(180,120,60,.2); color:#1a0e06;
    transition:border-color .2s, box-shadow .2s;
  }
  .wslm-field input:focus{ border-color:#f97316; box-shadow:0 0 0 3px rgba(249,115,22,.1); background:#fff; }
  .wslm-field input:disabled{ opacity:.5; cursor:not-allowed; }
  .wslm-pw-wrap{ position:relative; }
  .wslm-pw-wrap input{ padding-right:40px; }
  .wslm-eye-btn{ position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; color:#b8906a; cursor:pointer; display:flex; padding:0; }
  .wslm-eye-btn:hover{ color:#f97316; }
  .wslm-forgot-row{ text-align:right; margin:2px 0 12px; }
  .wslm-forgot-row button{ background:none; border:none; color:#f97316; font-size:12px; font-weight:600; cursor:pointer; padding:0; }
  .wslm-forgot-row button:hover{ text-decoration:underline; }
  .wslm-submit{
    width:100%; padding:11px; border:none; border-radius:10px; color:#fff; font-weight:700; font-size:14px;
    background:linear-gradient(135deg,#f97316,#ea580c); box-shadow:0 4px 16px rgba(249,115,22,.32);
    cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
    transition:transform .15s, opacity .2s;
  }
  .wslm-submit:hover:not(:disabled){ transform:translateY(-1px); opacity:.95; }
  .wslm-submit:disabled{ opacity:.55; cursor:not-allowed; }
  .wslm-spinner{ width:13px; height:13px; border-radius:999px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; animation:wslmSpin .7s linear infinite; }
  @keyframes wslmSpin{ to{ transform:rotate(360deg); } }
  .wslm-back{ text-align:center; margin-top:12px; }
  .wslm-back button{ background:none; border:none; color:#8a6040; font-size:11.5px; cursor:pointer; }
  .wslm-back button:hover{ color:#5c4025; }

  @media (max-width:480px){
    .wslm-card{ padding:18px 16px 16px; border-radius:16px; }
    .wslm-logo{ font-size:20px; }
  }
`;
