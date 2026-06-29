import React, { useState } from "react";
import authService from "../../services/authService";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" />
  </svg>
);

// ─── Styles (same compact language as SignupModal) ───────────────────────────
const S = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(5px)",
  },
  modal: {
    background: "#fff",
    borderRadius: "18px",
    width: "100%",
    maxWidth: "420px",
    padding: "26px 28px 22px",
    position: "relative",
    boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
    maxHeight: "94vh",
    overflowY: "auto",
    animation: "forgotFadeUp 0.3s ease both",
  },
  closeBtn: {
    position: "absolute",
    top: "12px",
    right: "14px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#aaa",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    fontSize: "20px",
    lineHeight: 1,
  },
  logoWrap: { textAlign: "center", marginBottom: "4px" },
  logoText: { fontSize: "26px", fontWeight: "700", letterSpacing: "1px" },
  title: { textAlign: "center", fontSize: "20px", fontWeight: "700", color: "#111", margin: "4px 0 4px" },
  subtitle: { textAlign: "center", fontSize: "12px", color: "#ea580c", fontStyle: "italic", marginBottom: "16px" },
  fieldWrap: { marginBottom: "16px" },
  label: { display: "block", fontSize: "10px", fontWeight: "700", color: "#ea580c", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "5px" },
  inputRow: { display: "flex", alignItems: "center", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "0 12px", background: "#fff", gap: "8px", transition: "border-color 0.15s" },
  inputRowFocus: { borderColor: "#ea580c", boxShadow: "0 0 0 3px rgba(234,88,12,0.10)" },
  iconWrap: { color: "#9ca3af", display: "flex", alignItems: "center", flexShrink: 0 },
  input: { flex: 1, border: "none", outline: "none", fontSize: "14px", padding: "10px 0", background: "transparent", color: "#111" },
  submitBtn: { width: "100%", background: "#ea580c", color: "#fff", border: "none", borderRadius: "10px", padding: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer", letterSpacing: "0.02em", transition: "background 0.15s" },
  errorMsg: { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "8px", padding: "9px 12px", fontSize: "12px", marginBottom: "12px" },
  successMsg: { background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "9px 12px", fontSize: "12px", marginBottom: "12px" },
};

const ForgotPasswordModal = ({ onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

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
        onClose();
        onSwitchToLogin();
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
    <>
      <style>{`@keyframes forgotFadeUp { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>

      {/* Backdrop */}
      <div
        style={S.overlay}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div style={S.modal}>

          {/* Close button */}
          <button style={S.closeBtn} onClick={onClose} aria-label="Close">×</button>

          {/* Logo */}
          <div style={S.logoWrap}>
            <span style={S.logoText}>
              <span style={{ color: "#15803d" }}>ILM </span>
              <span style={{ color: "#ea580c" }}>ORA</span>
            </span>
          </div>

          <h1 style={S.title}>Reset Password</h1>
          <p style={S.subtitle}>Enter your registered email to receive reset link</p>

          {/* Error / Success */}
          {error   && <div style={S.errorMsg}>{error}</div>}
          {message && <div style={S.successMsg}>{message}</div>}

          <form onSubmit={handleSubmit}>
            <div style={S.fieldWrap}>
              <label style={S.label}>Email address</label>
              <div style={{ ...S.inputRow, ...(focused ? S.inputRowFocus : {}) }}>
                <span style={S.iconWrap}><IconMail /></span>
                <input
                  style={S.input}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <button
              type="submit"
              style={{ ...S.submitBtn, background: loading ? "#f97316" : "#ea580c", opacity: loading ? 0.85 : 1 }}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Back to login */}
          <div style={{ textAlign: "center", marginTop: "14px" }}>
            <button
              onClick={onSwitchToLogin}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#ea580c", fontSize: "13px", textDecoration: "none" }}
            >
              ← Back to login
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default ForgotPasswordModal;