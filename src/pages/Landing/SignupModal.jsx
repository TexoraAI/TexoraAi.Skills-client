import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconUser = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const IconMail = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
);
const IconLock = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);
const IconEye = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEyeOff = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const IconGradCap = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#16a34a"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 1.5 9 1.5 12 0v-5" />
  </svg>
);
const IconUsers = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ea580c"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconBriefcase = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#7c3aed"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
    <line x1="10" y1="14" x2="14" y2="14" />
  </svg>
);
const IconCheckCircle = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#16a34a"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" fill="#dcfce7" stroke="#16a34a" />
    <polyline points="9 12 11 14 15 10" stroke="#16a34a" strokeWidth="2" />
  </svg>
);
const IconArrowRight = () => (
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
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconChevronLeft = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

// ─── Role options ─────────────────────────────────────────────────────────────
const ROLES = [
  {
    value: "STUDENT",
    label: "Student",
    desc: "Learn & grow with 1000+ courses",
    icon: <IconGradCap />,
    bg: "#dcfce7",
    border: "#16a34a",
    color: "#16a34a",
  },
  {
    value: "TRAINER",
    label: "Trainer",
    desc: "Teach & inspire thousands",
    icon: <IconUsers />,
    bg: "#fff7ed",
    border: "#ea580c",
    color: "#ea580c",
  },
  {
    value: "BUSINESS",
    label: "Business & Partnership",
    desc: "Scale your team with structured learning",
    icon: <IconBriefcase />,
    bg: "#ede9fe",
    border: "#7c3aed",
    color: "#7c3aed",
  },
];

// ─── Step indicator ───────────────────────────────────────────────────────────
const StepDots = ({ current, total }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: "6px",
      marginBottom: "18px",
    }}
  >
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          width: i === current ? "22px" : "7px",
          height: "7px",
          borderRadius: "4px",
          background:
            i === current ? "#ea580c" : i < current ? "#16a34a" : "#e5e7eb",
          transition: "all 0.3s ease",
        }}
      />
    ))}
  </div>
);

// ─── InputField ───────────────────────────────────────────────────────────────
const InputField = ({
  label,
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  showToggle,
  show,
  onToggle,
  error,
}) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ marginBottom: "10px" }}>
      <label
        style={{
          display: "block",
          fontSize: "10px",
          fontWeight: "700",
          color: "#ea580c",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          marginBottom: "4px",
        }}
      >
        {label}
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: `1.5px solid ${error ? "#dc2626" : focused ? "#ea580c" : "#e5e7eb"}`,
          borderRadius: "10px",
          padding: "0 12px",
          background: "#fff",
          gap: "8px",
          boxShadow: focused ? "0 0 0 3px rgba(234,88,12,0.10)" : "none",
          transition: "all 0.15s",
        }}
      >
        <span
          style={{
            color: "#9ca3af",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
        <input
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "14px",
            padding: "9px 0",
            background: "transparent",
            color: "#111",
          }}
          type={showToggle ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete="off"
        />
        {showToggle && (
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
              padding: "0",
              display: "flex",
              alignItems: "center",
            }}
            type="button"
            onClick={onToggle}
          >
            {show ? <IconEyeOff /> : <IconEye />}
          </button>
        )}
      </div>
      {error && (
        <p style={{ fontSize: "11px", color: "#dc2626", marginTop: "3px" }}>
          {error}
        </p>
      )}
    </div>
  );
};

// ─── Logo ─────────────────────────────────────────────────────────────────────
const Logo = () => (
  <div style={{ textAlign: "center", marginBottom: "2px" }}>
    <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "1px" }}>
      <span style={{ color: "#15803d" }}>ILM </span>
      <span style={{ color: "#ea580c" }}>ORA</span>
    </span>
  </div>
);

// ─── STEP 1: Enter Details ────────────────────────────────────────────────────
const Step1 = ({ form, onChange, showPass, setShowPass, onNext }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email is required.";
    if (form.password.length < 6)
      e.password = "Password must be at least 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <>
      <Logo />
      <h1
        style={{
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "700",
          color: "#111",
          margin: "2px 0 2px",
        }}
      >
        Create Your Account
      </h1>
      <p
        style={{
          textAlign: "center",
          fontSize: "12px",
          color: "#6b7280",
          marginBottom: "14px",
        }}
      >
        Join ILM ORA and start your learning journey
      </p>

      <StepDots current={0} total={3} />

      <InputField
        label="Full Name"
        icon={<IconUser />}
        name="name"
        placeholder="Enter your full name"
        value={form.name}
        onChange={onChange}
        error={errors.name}
      />
      <InputField
        label="Email"
        icon={<IconMail />}
        name="email"
        type="email"
        placeholder="Enter your email address"
        value={form.email}
        onChange={onChange}
        error={errors.email}
      />
      <InputField
        label="Password"
        icon={<IconLock />}
        name="password"
        placeholder="Create a password"
        value={form.password}
        onChange={onChange}
        showToggle
        show={showPass}
        onToggle={() => setShowPass((p) => !p)}
        error={errors.password}
      />

      <button onClick={handleNext} style={btnStyle}>
        Next &nbsp;
        <IconArrowRight />
      </button>
    </>
  );
};

// ─── STEP 2: Select Role ──────────────────────────────────────────────────────
const Step2 = ({ selectedRole, onSelect, onNext, onBack }) => {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!selectedRole) {
      setError("Please select a role to continue.");
      return;
    }
    onNext();
  };

  return (
    <>
      <Logo />
      <h1
        style={{
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "700",
          color: "#111",
          margin: "2px 0 2px",
        }}
      >
        Choose Your Role
      </h1>
      <p
        style={{
          textAlign: "center",
          fontSize: "12px",
          color: "#6b7280",
          marginBottom: "14px",
        }}
      >
        Select the role that best describes you
      </p>

      <StepDots current={1} total={3} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "14px",
        }}
      >
        {ROLES.map((role) => {
          const isSelected = selectedRole?.value === role.value;
          return (
            <div
              key={role.value}
              onClick={() => {
                onSelect(role);
                setError("");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px 14px",
                borderRadius: "12px",
                cursor: "pointer",
                border: `2px solid ${isSelected ? role.border : "#e5e7eb"}`,
                background: isSelected ? role.bg : "#fafafa",
                transition: "all 0.18s",
                boxShadow: isSelected ? `0 0 0 3px ${role.border}22` : "none",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: role.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1.5px solid ${role.border}44`,
                  flexShrink: 0,
                }}
              >
                {role.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: isSelected ? role.color : "#111",
                  }}
                >
                  {role.label}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#6b7280",
                    marginTop: "2px",
                  }}
                >
                  {role.desc}
                </div>
              </div>
              {isSelected && (
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: role.border,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      <button onClick={handleNext} style={btnStyle}>
        Next &nbsp;
        <IconArrowRight />
      </button>
      <BackBtn onClick={onBack} />
    </>
  );
};

// ─── STEP 3: Review Details ───────────────────────────────────────────────────
const Step3 = ({ form, selectedRole, onSubmit, onBack, loading, error }) => {
  const reviewItems = [
    { icon: <IconUser />, label: "Name", value: form.name },
    { icon: <IconMail />, label: "Email", value: form.email },
    {
      icon: selectedRole?.icon ? (
        React.cloneElement(selectedRole.icon, { size: 16 })
      ) : (
        <IconUser />
      ),
      label: "Role",
      value: selectedRole?.label,
      color: selectedRole?.color,
    },
  ];

  return (
    <>
      <Logo />
      <h1
        style={{
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "700",
          color: "#111",
          margin: "2px 0 2px",
        }}
      >
        Almost Done!
      </h1>
      <p
        style={{
          textAlign: "center",
          fontSize: "12px",
          color: "#6b7280",
          marginBottom: "14px",
        }}
      >
        Review your details before creating account
      </p>

      <StepDots current={2} total={3} />

      <div
        style={{
          border: "1.5px solid #e5e7eb",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "14px",
        }}
      >
        {reviewItems.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "11px 14px",
              borderBottom:
                i < reviewItems.length - 1 ? "1px solid #f3f4f6" : "none",
              background: "#fafafa",
            }}
          >
            <span
              style={{
                color: "#9ca3af",
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {item.icon}
            </span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: item.color || "#111",
                  marginTop: "1px",
                }}
              >
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      <button
        onClick={onSubmit}
        disabled={loading}
        style={{
          ...btnStyle,
          opacity: loading ? 0.8 : 1,
          background: loading ? "#f97316" : "#ea580c",
        }}
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
      <BackBtn onClick={onBack} />
    </>
  );
};

const Step4 = ({ onCompleteProfile }) => (
  <>
    <Logo />
    <div style={{ textAlign: "center", padding: "10px 0 6px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "12px",
        }}
      >
        <IconCheckCircle />
      </div>
      <h1
        style={{
          fontSize: "20px",
          fontWeight: "700",
          color: "#111",
          margin: "0 0 6px",
        }}
      >
        Your Selection
        <br />
        Is Done!
      </h1>
      <p
        style={{
          fontSize: "13px",
          color: "#6b7280",
          margin: "0 0 6px",
          lineHeight: 1.5,
        }}
      >
        Welcome to ILM ORA
        <br />
        Let's complete your onboarding journey for the best experience.
      </p>
    </div>

    <div
      style={{
        border: "1.5px solid #d1fae5",
        background: "#f0fdf4",
        borderRadius: "12px",
        padding: "14px 16px",
        marginBottom: "16px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          fontWeight: "700",
          color: "#15803d",
          marginBottom: "4px",
        }}
      >
        🎓 Complete Your Profile
      </div>
      <div style={{ fontSize: "12px", color: "#6b7280" }}>
        Complete your profile to unlock features tailored just for you.
      </div>
    </div>

    <button
      onClick={onCompleteProfile}
      style={{ ...btnStyle, background: "#15803d" }}
    >
      Click Here
    </button>
  </>
);

// ─── Shared small components ──────────────────────────────────────────────────
const BackBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "4px",
      justifyContent: "center",
      width: "100%",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#9ca3af",
      fontSize: "13px",
      marginTop: "10px",
      padding: "4px",
    }}
  >
    <IconChevronLeft /> Back
  </button>
);

const btnStyle = {
  width: "100%",
  background: "#ea580c",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  padding: "11px",
  fontSize: "15px",
  fontWeight: "700",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  transition: "background 0.15s",
  letterSpacing: "0.02em",
};

const errorStyle = {
  background: "#fef2f2",
  color: "#dc2626",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "12px",
  marginBottom: "10px",
};

// ─── Main SignupModal ─────────────────────────────────────────────────────────
const SignupModal = ({ onClose, onSwitchToLogin }) => {
  const [step, setStep] = useState(0); // 0=Details, 1=Role, 2=Review, 3=Success
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: selectedRole.value,
      });
      const data = res?.data ?? res;
      if (data?.token) {
        localStorage.setItem("lms_token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem(
          "lms_user",
          JSON.stringify({
            name: data.name || form.name,
            email: data.email || form.email,
            role: data.role?.toLowerCase() || selectedRole.value.toLowerCase(),
            profileCompleted: false,
            isGoogleUser: false,
          }),
        );
        setStep(3);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Registration failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };
  const handleCompleteProfile = () => {
    sessionStorage.setItem("signupToast", "true");
    onClose();
    navigate("/complete-profile", {
      state: {
        fromSignup: true,
        role: selectedRole?.value,
        name: form.name,
        email: form.email,
      },
    });
  };

  return (
    <>
      <style>{`
        @keyframes smFadeUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes stepIn {
          from { opacity: 0; transform: translateX(18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(5px)",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget && step < 3) onClose();
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            width: "100%",
            maxWidth: "420px",
            padding: "22px 26px 20px",
            position: "relative",
            boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
            maxHeight: "94vh",
            overflowY: "auto",
            animation: "smFadeUp 0.3s ease both",
          }}
        >
          {/* Close button — hidden on success */}
          {step < 3 && (
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "12px",
                right: "14px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#aaa",
                padding: "4px",
                fontSize: "20px",
                lineHeight: 1,
              }}
              aria-label="Close"
            >
              ×
            </button>
          )}

          {/* Step content */}
          <div key={step} style={{ animation: "stepIn 0.25s ease both" }}>
            {step === 0 && (
              <Step1
                form={form}
                onChange={handleChange}
                showPass={showPass}
                setShowPass={setShowPass}
                onNext={() => setStep(1)}
              />
            )}
            {step === 1 && (
              <Step2
                selectedRole={selectedRole}
                onSelect={setSelectedRole}
                onNext={() => setStep(2)}
                onBack={() => setStep(0)}
              />
            )}
            {step === 2 && (
              <Step3
                form={form}
                selectedRole={selectedRole}
                onSubmit={handleSubmit}
                onBack={() => setStep(1)}
                loading={loading}
                error={error}
              />
            )}
            {step === 3 && <Step4 onCompleteProfile={handleCompleteProfile} />}
          </div>

          {/* Switch to login — shown on first 3 steps */}
          {step < 3 && (
            <div style={{ textAlign: "center", marginTop: "12px" }}>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>
                Already have an account?{" "}
              </span>
              <button
                onClick={onSwitchToLogin}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#ea580c",
                  fontSize: "13px",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SignupModal;
