
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import auth from "../../auth";

const GOOGLE_CLIENT_ID =
  "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

const TexoraLogin = () => {
  const navigate = useNavigate();
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [loading,      setLoading]      = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* ─── Role-based redirect ────────────────────────── */
  const redirectByRole = (role) => {
    switch ((role || "").toUpperCase()) {
      case "ADMIN":    navigate("/admin",    { replace: true }); break;
      case "TRAINER":  navigate("/trainer",  { replace: true }); break;
      case "BUSINESS": navigate("/business", { replace: true }); break;
      default:         navigate("/student",  { replace: true });
    }
  };

  /* ─── Email / password login ─────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const ok = await auth.login({ email, password });
      if (ok) {
        const role = (auth.getCurrentRole() || "STUDENT").toUpperCase();
        localStorage.setItem("role", role);
        redirectByRole(role);
      } else {
        alert("Login failed! Check your credentials.");
      }
    } catch (err) {
      alert("Login error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ─── Google login ───────────────────────────────── */
  const handleGoogleSuccess = async (res) => {
    try {
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
      localStorage.removeItem("role");

      const dec  = jwtDecode(res.credential);
      const resp = await auth.googleLogin({ idToken: res.credential });

      if (resp?.isNewUser === true) {
        localStorage.setItem("role", "STUDENT");
        localStorage.setItem("lms_user", JSON.stringify({
          name:      dec.name,
          email:     dec.email,
          role:      "student",
          isNewUser: true,
        }));
        navigate("/ilm-demo", { replace: true });
      } else {
        const role = (resp?.role || "STUDENT").toUpperCase();
        localStorage.setItem("role", role);
        localStorage.setItem("lms_user", JSON.stringify({
          name:  dec.name,
          email: dec.email,
          role:  role.toLowerCase(),
        }));
        redirectByRole(role);
      }
    } catch (err) {
      console.error("Google login error:", err);
      try {
        const dec = jwtDecode(res.credential);
        localStorage.setItem("role", "STUDENT");
        localStorage.setItem("lms_user", JSON.stringify({
          name:      dec.name,
          email:     dec.email,
          role:      "student",
          isNewUser: true,
        }));
        navigate("/ilm-demo", { replace: true });
      } catch (_) {
        alert("Google login failed. Please try again.");
      }
    }
  };

  const handleGoogleError = () => console.error("Google OAuth failed");

  /* ─── SVG Icons ──────────────────────────────────── */
  const EyeOpen = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOff = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  /* ══════════════════════════════════════════════════ */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .pg {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f5ece1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 24px 16px;
        }

        .pg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(180,100,30,0.08) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 0;
        }

        .card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          animation: fadeUp 0.55s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── LOGO ── */
        .logo-badge {
          display: inline-flex;
          align-items: center;
          gap: 0;
          margin-bottom: 6px;
          cursor: pointer;
        }
        .logo-ilm {
          font-family: 'Playfair Display', serif;
          font-size: 2.6rem;
          font-weight: 900;
          color: #16a34a;
          line-height: 1;
          letter-spacing: -0.01em;
        }
        .logo-ora {
          font-family: 'Playfair Display', serif;
          font-size: 2.6rem;
          font-weight: 900;
          color: #F97316;
          line-height: 1;
          letter-spacing: -0.01em;
          margin-left: 10px;
        }

        /* ── HEADING ── */
        .heading { text-align: center; }
        .heading h2 {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #1e0e02;
          margin-bottom: 6px;
        }
        .heading p { font-size: 0.84rem; color: #8a6040; }
        .heading p button {
          background: none; border: none; cursor: pointer;
          color: #F97316;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.84rem; font-weight: 700; padding: 0;
        }
        .heading p button:hover { text-decoration: underline; }

        /* ── FORM BOX ── */
        .form-box {
          width: 100%;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(249,115,22,0.16);
          border-radius: 20px;
          padding: 28px 24px;
          backdrop-filter: blur(16px);
          box-shadow: 0 20px 60px rgba(160,80,20,0.12), 0 2px 8px rgba(160,80,20,0.05);
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* ── GOOGLE ── */
        .google-wrap {
          width: 100%;
          margin-bottom: 14px;
          display: flex;
          justify-content: center;
        }
        .google-wrap > div,
        .google-wrap iframe,
        .google-wrap > div > div {
          width: 100% !important;
          max-width: 100% !important;
        }

        /* ── OR divider ── */
        .or-div {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .or-line { flex: 1; height: 1px; background: rgba(180,100,30,0.15); }
        .or-text  { font-size: 0.7rem; color: #b8906a; letter-spacing: 0.1em; text-transform: uppercase; }

        /* ── FIELDS ── */
        .field { margin-bottom: 12px; }
        .field label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          color: #8a6040;
          margin-bottom: 5px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .field input {
          width: 100%;
          padding: 11px 14px;
          background: rgba(255,255,255,0.8);
          border: 1.5px solid rgba(180,120,60,0.2);
          border-radius: 10px;
          color: #1a0e06;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field input::placeholder { color: #c0a070; }
        .field input:focus {
          border-color: #F97316;
          box-shadow: 0 0 0 3px rgba(249,115,22,0.1);
          background: #fff;
        }
        .field input:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── PASSWORD WRAPPER ── */
        .pw-wrap { position: relative; }
        .pw-wrap input { padding-right: 44px; }
        .eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #b8906a;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: color 0.2s;
          line-height: 1;
        }
        .eye-btn:hover { color: #F97316; }

        /* ── SUBMIT ── */
        .sub-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #F97316, #ea580c);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 18px rgba(249,115,22,0.32);
          margin-top: 2px;
        }
        .sub-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .sub-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .spinner {
          display: inline-block;
          width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── FORGOT ── */
        .forgot-row { text-align: right; margin: 6px 0 14px; }
        .forgot-row button {
          background: none; border: none; cursor: pointer;
          color: #F97316;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem; font-weight: 500;
        }
        .forgot-row button:hover { text-decoration: underline; }

        /* ── BACK ── */
        .back-link {
          text-align: center;
          font-size: 0.78rem;
          color: #b8906a;
          margin-top: 16px;
        }
        .back-link button {
          background: none; border: none; cursor: pointer;
          color: #b8906a;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
        }
        .back-link button:hover { color: #8a6040; }
      `}</style>

      <div className="pg">
        <div className="card">

          {/* Logo */}
          <div className="logo-badge" onClick={() => navigate("/")}>
            <span className="logo-ilm">ILM</span>
            <span className="logo-ora">ORA</span>
          </div>

          {/* Heading */}
          <div className="heading">
            <h2>Welcome back!</h2>
            <p>
              Don't have an account?{" "}
              <button onClick={() => navigate("/complete-profile")}>Apply now</button>
            </p>
          </div>

          {/* Form box */}
          <div className="form-box" style={{ width: "100%" }}>

            {/* Google Login */}
            <div className="google-wrap">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                width="372"
                auto_select={false}
                cancel_on_tap_outside={true}
              />
            </div>

            {/* OR divider */}
            <div className="or-div">
              <div className="or-line" />
              <span className="or-text">OR</span>
              <div className="or-line" />
            </div>

            {/* Email / Password form */}
            <form onSubmit={handleSubmit}>

              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="field">
                <label>Password</label>
                <div className="pw-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(p => !p)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
              </div>

              <div className="forgot-row">
                <button type="button" onClick={() => navigate("/forgot-password")}>
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="sub-btn" disabled={loading}>
                {loading ? <><span className="spinner" />Signing in…</> : "Log in"}
              </button>

            </form>

            <div className="back-link">
              <button onClick={() => navigate("/")}>← Back to home</button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default function Login() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <TexoraLogin />
    </GoogleOAuthProvider>
  );
}