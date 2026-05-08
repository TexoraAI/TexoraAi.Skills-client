
// src/pages/public/PublicBookingConfirmation.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Mail,
  ArrowRight,
  Loader,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

const PublicBookingConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        // ✅ Read from sessionStorage saved by PublicBooking.jsx
        const stored = sessionStorage.getItem("lastBooking");

        if (stored) {
          const parsed = JSON.parse(stored);
          setBooking(parsed);

          // ✅ Use data already in sessionStorage — no extra API call needed
          setSession({
            title:         parsed.sessionTitle    || "Live Session",
            scheduledDate: parsed.sessionDate     || "TBD",
            scheduledTime: parsed.sessionTime     || "TBD",
            duration:      parsed.sessionDuration || "TBD",
            description:   "",
          });
        } else {
          // Fallback: no stored data, show generic confirmation
          setBooking({ id, message: "Booking Confirmed!" });
          setSession({
            title:         "Live Session",
            scheduledDate: "TBD",
            scheduledTime: "TBD",
            duration:      "TBD",
            description:   "",
          });
        }
      } catch (err) {
        console.error("Failed to load booking confirmation:", err);
        setError("Could not load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleCopyLink = () => {
    if (booking?.accessToken) {
      navigator.clipboard.writeText(booking.accessToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.centerFull}>
        <Loader size={40} style={{ color: "#1d4ed8", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.centerFull}>
        <div style={{ textAlign: "center" }}>
          <AlertCircle size={48} style={{ color: "#ef4444", margin: "0 auto 16px" }} />
          <p style={{ color: "#374151", fontWeight: 600 }}>{error}</p>
          <button onClick={() => navigate("/")} style={styles.btnPrimary}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ── Top Success Banner ─────────────────────────────────── */}
        <div style={styles.heroBanner}>
          <div style={styles.checkCircle}>
            <CheckCircle2 size={48} style={{ color: "#fff" }} />
          </div>
          <h1 style={styles.heroTitle}>You're In! 🎉</h1>
          <p style={styles.heroSub}>
            Your spot has been confirmed. A confirmation email with your join link
            has been sent to <strong>{booking?.email || "your email"}</strong>.
          </p>
        </div>

        {/* ── Session Info Card ──────────────────────────────────── */}
        {session && (
          <div style={styles.card}>
            <p style={styles.cardLabel}>Session Details</p>
            <h2 style={styles.sessionTitle}>{session.title}</h2>
            {session.description && (
              <p style={styles.sessionDesc}>{session.description}</p>
            )}
            <div style={styles.metaRow}>
              <MetaBadge icon={<Calendar size={14} />} text={session.scheduledDate} />
              <MetaBadge icon={<Clock size={14} />} text={session.scheduledTime} />
              <MetaBadge icon={<Clock size={14} />} text={session.duration !== "TBD" ? `${session.duration} min` : "TBD"} />
            </div>
          </div>
        )}

        {/* ── What Happens Next ──────────────────────────────────── */}
        <div style={styles.card}>
          <p style={styles.cardLabel}>What happens next?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
            <Step
              title="Check your inbox"
              desc="A confirmation email with your unique join link has been sent. Check spam if you don't see it."
              icon={<Mail size={18} style={{ color: "#1d4ed8" }} />}
            />
            <Step
              title="Save your join link"
              desc="The join link is unique to you — don't share it. You'll also receive a reminder 15 minutes before the session."
              icon={<Clock size={18} style={{ color: "#1d4ed8" }} />}
            />
            <Step
              title="Join when it's time"
              desc="Click the join link from your email exactly when the session starts. No account needed."
              icon={<ArrowRight size={18} style={{ color: "#1d4ed8" }} />}
            />
          </div>
        </div>

        {/* ── Booking Reference ─────────────────────────────────── */}
        <div style={{ ...styles.card, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ margin: 0, fontSize: "12px", color: "#16a34a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Booking Reference
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 800, color: "#15803d" }}>
                #{id}
              </p>
            </div>
            {booking?.accessToken && (
              <button onClick={handleCopyLink} style={styles.copyBtn}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy Join Link"}
              </button>
            )}
          </div>
        </div>

        {/* ── Actions ───────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/public/sessions")} style={styles.btnPrimary}>
            Browse More Sessions
          </button>
          <button onClick={() => navigate("/")} style={styles.btnSecondary}>
            Go to Homepage
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>
          Questions? Contact us via email.
        </p>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────────

const MetaBadge = ({ icon, text }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: "6px",
    background: "#eff6ff", color: "#1d4ed8",
    padding: "6px 12px", borderRadius: "999px",
    fontSize: "13px", fontWeight: 600,
  }}>
    {icon} {text}
  </div>
);

const Step = ({ title, desc, icon }) => (
  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
    <div style={{
      width: "36px", height: "36px", borderRadius: "50%",
      background: "#eff6ff", display: "flex", alignItems: "center",
      justifyContent: "center", flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, fontWeight: 700, color: "#111827", fontSize: "14px" }}>{title}</p>
      <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280", lineHeight: 1.5 }}>{desc}</p>
    </div>
  </div>
);

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: "24px 16px 48px",
  },
  container: {
    maxWidth: "580px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  centerFull: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    flexDirection: "column",
    gap: "16px",
  },
  heroBanner: {
    background: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)",
    borderRadius: "16px",
    padding: "36px 28px",
    textAlign: "center",
    color: "#fff",
  },
  checkCircle: {
    width: "72px", height: "72px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 16px",
  },
  heroTitle: {
    margin: "0 0 10px",
    fontSize: "28px",
    fontWeight: 800,
    color: "#fff",
  },
  heroSub: {
    margin: 0,
    fontSize: "15px",
    color: "#bfdbfe",
    lineHeight: 1.6,
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  cardLabel: {
    margin: "0 0 8px",
    fontSize: "11px",
    fontWeight: 700,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  },
  sessionTitle: {
    margin: "0 0 6px",
    fontSize: "20px",
    fontWeight: 800,
    color: "#111827",
  },
  sessionDesc: {
    margin: "0 0 16px",
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.5,
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "4px",
  },
  copyBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "8px 16px",
    background: "#16a34a", color: "#fff",
    border: "none", borderRadius: "8px",
    fontSize: "13px", fontWeight: 700,
    cursor: "pointer",
  },
  btnPrimary: {
    flex: 1,
    padding: "14px 20px",
    background: "#1d4ed8", color: "#fff",
    border: "none", borderRadius: "10px",
    fontSize: "14px", fontWeight: 700,
    cursor: "pointer", textAlign: "center",
  },
  btnSecondary: {
    flex: 1,
    padding: "14px 20px",
    background: "#fff", color: "#374151",
    border: "1.5px solid #e2e8f0", borderRadius: "10px",
    fontSize: "14px", fontWeight: 700,
    cursor: "pointer", textAlign: "center",
  },
};

export default PublicBookingConfirmation;