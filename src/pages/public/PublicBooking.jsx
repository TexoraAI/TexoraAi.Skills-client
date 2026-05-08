
// src/pages/public/PublicBooking.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createPublicBooking,
  getPublicSessionDetails,
} from "@/services/publicBookingService";
import {
  ArrowLeft,
  Mail,
  User,
  Phone,
  Globe,
  CheckCircle2,
  AlertCircle,
  Loader,
  Briefcase,
  BookOpen,
  MessageCircle,
  Target,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOPICS = [
  "Java", "Python", "JavaScript", "React", "Node.js",
  "DevOps", "AWS", "Data Science", "Machine Learning",
  "System Design", "DSA", "Full Stack", "Other",
];

const JOB_ROLES = [
  "Student / Fresher",
  "Junior Developer (0–2 yrs)",
  "Mid-level Developer (2–5 yrs)",
  "Senior Developer (5+ yrs)",
  "Team Lead / Manager",
  "Career Switcher",
  "Other",
];

const HOW_HEARD = [
  "WhatsApp",
  "LinkedIn",
  "Instagram",
  "YouTube",
  "Friend / Referral",
  "Google Search",
  "Email",
  "Other",
];

const LEARNING_GOALS = [
  "Get a Job / Job Change",
  "Upskill for Current Role",
  "Freelancing",
  "Build a Product",
  "General Learning",
  "Other",
];

// ─── Component ────────────────────────────────────────────────────────────────

const PublicBooking = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    fullName:         "",
    email:            "",
    phoneNumber:      "",
    country:          "",
    gdprConsent:      false,
    topicsOfInterest: [],
    jobRole:          "",
    howDidYouHear:    "",
    learningGoal:     "",
  });

  const [errors, setErrors] = useState({});

  // ✅ Fetch session details — fallback to minimal object if API requires auth
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await getPublicSessionDetails(sessionId);
        setSession(res.data);
      } catch (err) {
        console.error("Failed to fetch session:", err);
        // ✅ Even if session fetch fails (auth required), still show the form
        setSession({
          id: sessionId,
          title: "Live Session",
          description: "",
          scheduledDate: "",
          scheduledTime: "",
          duration: "",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  // ✅ Toggle topic chip
  const toggleTopic = (topic) => {
    setForm((prev) => {
      const already = prev.topicsOfInterest.includes(topic);
      return {
        ...prev,
        topicsOfInterest: already
          ? prev.topicsOfInterest.filter((t) => t !== topic)
          : [...prev.topicsOfInterest, topic],
      };
    });
    if (errors.topicsOfInterest) {
      setErrors((prev) => ({ ...prev, topicsOfInterest: "" }));
    }
  };

  // ✅ Generic field change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ Validate
  const validateForm = () => {
    const errs = {};
    if (!form.fullName.trim())    errs.fullName    = "Full name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
                                  errs.email       = "Valid email is required";
    if (!form.phoneNumber.trim()) errs.phoneNumber = "Phone number is required";
    if (!form.country)            errs.country     = "Country is required";
    if (form.topicsOfInterest.length === 0)
                                  errs.topicsOfInterest = "Select at least one topic";
    if (!form.jobRole)            errs.jobRole     = "Please select your role";
    if (!form.howDidYouHear)      errs.howDidYouHear = "Please tell us how you heard";
    if (!form.learningGoal)       errs.learningGoal  = "Please select a learning goal";
    if (!form.gdprConsent)        errs.gdprConsent   = "You must accept the privacy policy";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const res = await createPublicBooking({
        sessionId: Number(sessionId),
        ...form,
        topicsOfInterest: form.topicsOfInterest.join(", "),
      });

      console.log("✅ Booking created:", res.data);

      // ✅ Save booking + session info to sessionStorage for confirmation page
      sessionStorage.setItem(
        "lastBooking",
        JSON.stringify({
          ...res.data,
          sessionId: Number(sessionId),
          sessionTitle:    session?.title,
          sessionDate:     session?.scheduledDate,
          sessionTime:     session?.scheduledTime,
          sessionDuration: session?.duration,
        })
      );

      setSuccess(true);

      setTimeout(() => {
        navigate(`/public/booking-confirmation/${res.data.id}`);
      }, 2000);

    } catch (err) {
      console.error("Booking failed:", err);
      setErrors({
        submit: err.response?.data?.error || "Booking failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Loading ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Loader size={40} style={{ color: "#2563eb" }} />
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <AlertCircle size={40} style={{ color: "#ef4444", margin: "0 auto 16px" }} />
          <p style={{ fontSize: 18, fontWeight: 600, color: "#111" }}>Session not found</p>
          <button
            onClick={() => navigate("/")}
            style={{ marginTop: 16, padding: "8px 24px", background: "#2563eb", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600 }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "24px" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#64748b", marginBottom: 24, fontSize: 14, fontWeight: 500 }}
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* ── Session Hero ──────────────────────────────────────────── */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "inline-block", background: "#dbeafe", color: "#1d4ed8", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 999, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Free Live Session
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>{session.title}</h1>
          {session.description && (
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>{session.description}</p>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
            <div>
              <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Date</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{session.scheduledDate || "TBD"}</p>
            </div>
            <div>
              <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Time</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{session.scheduledTime || "TBD"}</p>
            </div>
            <div>
              <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Duration</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{session.duration ? `${session.duration} min` : "TBD"}</p>
            </div>
          </div>
        </div>

        {/* ── Success Banner ────────────────────────────────────────── */}
        {success && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 16, padding: 24, display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <CheckCircle2 size={32} style={{ color: "#16a34a", flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: 700, color: "#14532d", fontSize: 17, margin: 0 }}>Booking Confirmed! 🎉</p>
              <p style={{ fontSize: 13, color: "#16a34a", marginTop: 4 }}>
                Check your email — a confirmation with your join link has been sent. Redirecting...
              </p>
            </div>
          </div>
        )}

        {/* ── Form ─────────────────────────────────────────────────── */}
        {!success && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>Reserve Your Spot</h2>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>
              Fill in the details below — it takes under 2 minutes.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Full Name */}
              <FormField label="Full Name" icon={<User size={15} />} error={errors.fullName} required>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  style={inputStyle(errors.fullName)}
                />
              </FormField>

              {/* Email */}
              <FormField label="Email Address" icon={<Mail size={15} />} error={errors.email} required>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  style={inputStyle(errors.email)}
                />
              </FormField>

              {/* Phone */}
              <FormField label="Phone Number" icon={<Phone size={15} />} error={errors.phoneNumber} required>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  style={inputStyle(errors.phoneNumber)}
                />
              </FormField>

              {/* Country */}
              <FormField label="Country" icon={<Globe size={15} />} error={errors.country} required>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  style={inputStyle(errors.country)}
                >
                  <option value="">Select your country</option>
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>UAE</option>
                  <option>Singapore</option>
                  <option>Other</option>
                </select>
              </FormField>

              {/* Topics of Interest */}
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                  <BookOpen size={15} style={{ color: "#2563eb" }} />
                  Topics of Interest <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {TOPICS.map((topic) => {
                    const active = form.topicsOfInterest.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 999,
                          fontSize: 13,
                          fontWeight: 600,
                          border: `1px solid ${active ? "#2563eb" : "#d1d5db"}`,
                          background: active ? "#2563eb" : "#fff",
                          color: active ? "#fff" : "#374151",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
                {errors.topicsOfInterest && (
                  <p style={{ color: "#ef4444", fontSize: 11, marginTop: 6 }}>{errors.topicsOfInterest}</p>
                )}
              </div>

              {/* Job Role */}
              <FormField label="Current Role / Experience" icon={<Briefcase size={15} />} error={errors.jobRole} required>
                <select name="jobRole" value={form.jobRole} onChange={handleChange} style={inputStyle(errors.jobRole)}>
                  <option value="">Select your role</option>
                  {JOB_ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </FormField>

              {/* How did you hear */}
              <FormField label="How did you hear about us?" icon={<MessageCircle size={15} />} error={errors.howDidYouHear} required>
                <select name="howDidYouHear" value={form.howDidYouHear} onChange={handleChange} style={inputStyle(errors.howDidYouHear)}>
                  <option value="">Select</option>
                  {HOW_HEARD.map((h) => <option key={h}>{h}</option>)}
                </select>
              </FormField>

              {/* Learning Goal */}
              <FormField label="What's your learning goal?" icon={<Target size={15} />} error={errors.learningGoal} required>
                <select name="learningGoal" value={form.learningGoal} onChange={handleChange} style={inputStyle(errors.learningGoal)}>
                  <option value="">Select your goal</option>
                  {LEARNING_GOALS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </FormField>

              {/* GDPR */}
              <div style={{ background: "#f8fafc", borderRadius: 12, padding: 16 }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    name="gdprConsent"
                    checked={form.gdprConsent}
                    onChange={handleChange}
                    style={{ marginTop: 2, width: 16, height: 16, accentColor: "#2563eb" }}
                  />
                  <span style={{ fontSize: 13, color: "#475569" }}>
                    I agree to the{" "}
                    <span style={{ fontWeight: 600, color: "#0f172a" }}>Privacy Policy</span>{" "}
                    and consent to receive session notifications via email.
                  </span>
                </label>
                {errors.gdprConsent && (
                  <p style={{ color: "#ef4444", fontSize: 11, marginTop: 6 }}>{errors.gdprConsent}</p>
                )}
              </div>

              {/* Submit error */}
              {errors.submit && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: 16 }}>
                  <p style={{ color: "#dc2626", fontSize: 13 }}>{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "14px 0",
                  borderRadius: 12,
                  border: "none",
                  background: submitting ? "#94a3b8" : "#2563eb",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.2s",
                }}
              >
                {submitting ? (
                  <>
                    <Loader size={18} style={{ animation: "spin 1s linear infinite" }} /> Processing...
                  </>
                ) : (
                  "Book My Spot →"
                )}
              </button>

              <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8" }}>
                ✅ Confirmation + join link will be emailed to you immediately.
                You'll also get a reminder 15 minutes before the session starts.
              </p>

            </form>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputStyle = (error) => ({
  width: "100%",
  padding: "11px 16px",
  borderRadius: 10,
  border: `1px solid ${error ? "#f87171" : "#e2e8f0"}`,
  background: error ? "#fef2f2" : "#fff",
  fontSize: 13,
  fontWeight: 500,
  outline: "none",
  boxSizing: "border-box",
  color: "#0f172a",
});

const FormField = ({ label, icon, error, required, children }) => (
  <div>
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
      <span style={{ color: "#2563eb" }}>{icon}</span>
      {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
    </label>
    {children}
    {error && <p style={{ color: "#ef4444", fontSize: 11, marginTop: 6 }}>{error}</p>}
  </div>
);

export default PublicBooking;