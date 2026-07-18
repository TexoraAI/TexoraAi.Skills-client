import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { subscribeNewsletter } from "../../../services/notificationService";
 
const NEWSLETTER_KEY = "ilmora_newsletter_subscribers";
 
function getSubscribers() {
  try {
    return JSON.parse(localStorage.getItem(NEWSLETTER_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveSubscribers(list) {
  localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(list));
}
 
// ─────────────────────────────────────────────────────────────────────────────
// FooterNewsletter
// Subscribe form uses the real backend API (subscribeNewsletter). A hidden
// subscriber-admin panel (callable via openNewsletterAdmin / the hidden
// trigger element) is kept for internal use — it does not alter the visible
// design of the footer.
// ─────────────────────────────────────────────────────────────────────────────
function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
 
  // Hidden subscriber-admin panel state
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminOk, setAdminOk] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [subscribers, setSubscribers] = useState([]);
 
  const isValid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
 
  const handleSubmit = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!isValid(trimmed)) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
      return;
    }
    setStatus("loading");
    try {
      const { ok, status: httpStatus } = await subscribeNewsletter(trimmed);
      if (httpStatus === 409) {
        setStatus("duplicate");
        setTimeout(() => setStatus("idle"), 3000);
        return;
      }
      if (ok) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 3500);
      } else {
        setStatus("apierror");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("apierror");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };
 
  /* ── Hidden subscriber-admin panel ── */
  const openAdmin = () => {
    setSubscribers(getSubscribers());
    setShowAdmin(true);
  };
 
  const unlockAdmin = () => {
    if (adminCode === "ilmora2026") {
      setAdminOk(true);
      setAdminCode("");
    } else {
      alert("Incorrect code");
    }
  };
 
  const deleteSubscriber = (emailToDel) => {
    const updated = subscribers.filter((s) => s.email !== emailToDel);
    saveSubscribers(updated);
    setSubscribers(updated);
  };
 
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
 
  const statusMsg = {
    success: { text: "✓ You're subscribed!", color: "#22c55e" },
    error: { text: "Enter a valid email.", color: "#f87171" },
    duplicate: { text: "Already subscribed.", color: "#fb923c" },
    apierror: { text: "Something went wrong. Try again.", color: "#f87171" },
  }[status];
 
  return (
    <div className="flex flex-col gap-3 w-full">
      <h4 className="text-sm font-bold tracking-widest text-white uppercase">
        Be the first to know
      </h4>
      <div
        style={{
          display: "flex",
          background: status === "error" ? "rgba(248,113,113,0.08)" : "#232323",
          borderRadius: "10px",
          border:
            status === "error"
              ? "1.5px solid #f87171"
              : status === "success"
                ? "1.5px solid #22c55e"
                : "1.5px solid rgba(255,255,255,0.10)",
          overflow: "hidden",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          width: "100%",
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Enter your email"
          disabled={status === "loading" || status === "success"}
          className="placeholder:text-[#9CA3AF]"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#FFFFFF",
            fontSize: "13.5px",
            padding: "12px 14px",
            minWidth: 0,
            width: "100%",
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={status === "loading" || status === "success"}
          style={{
            background: status === "success" ? "#22c55e" : "#F97316",
            border: "none",
            cursor: "pointer",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "46px",
            transition: "background 0.2s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (status !== "success")
              e.currentTarget.style.background = "#EA580C";
          }}
          onMouseLeave={(e) => {
            if (status !== "success")
              e.currentTarget.style.background = "#F97316";
          }}
        >
          {status === "loading" ? (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2.5"
              />
              <path
                d="M10 2a8 8 0 0 1 8 8"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 10 10"
                  to="360 10 10"
                  dur="0.7s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          ) : status === "success" ? (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10l4 4 8-8"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10h12M10 4l6 6-6 6"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
 
      {statusMsg && (
        <p
          style={{
            fontSize: "12px",
            color: statusMsg.color,
            margin: "-6px 0 0",
          }}
        >
          {statusMsg.text}
        </p>
      )}
 
      <div className="pt-1">
        <span
          className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full"
          style={{
            color: "#22C55E",
            background: "rgba(22,163,74,0.12)",
            border: "1px solid rgba(34,197,94,0.35)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Status: Live
        </span>
      </div>
 
      {/* ── Hidden subscriber-admin modal ── */}
      {showAdmin && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAdmin(false);
              setAdminOk(false);
            }
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "1.5rem",
              width: "min(94vw,560px)",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#111",
                }}
              >
                📊 Subscriber Admin
              </h3>
              <button
                onClick={() => {
                  setShowAdmin(false);
                  setAdminOk(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#888",
                }}
              >
                ✕
              </button>
            </div>
 
            {!adminOk ? (
              <div>
                <p
                  style={{
                    color: "#666",
                    fontSize: "14px",
                    marginBottom: "1rem",
                  }}
                >
                  Enter admin code to view subscribers:
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <input
                    type="password"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && unlockAdmin()}
                    placeholder="Admin code"
                    style={{
                      flex: "1 1 160px",
                      minWidth: 0,
                      padding: "10px 14px",
                      border: "1.5px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={unlockAdmin}
                    style={{
                      background: "#F97316",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 20px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    Unlock
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    background: "#f8fffe",
                    border: "1px solid #d4f5e8",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#1a8f3c",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    Total Subscribers: {subscribers.length}
                  </span>
                  <button
                    onClick={() => setSubscribers(getSubscribers())}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#888",
                      fontSize: "13px",
                    }}
                  >
                    ↻ Refresh
                  </button>
                </div>
                <div style={{ overflow: "auto", flex: 1 }}>
                  {subscribers.length === 0 ? (
                    <p
                      style={{
                        color: "#999",
                        textAlign: "center",
                        padding: "2rem",
                        fontSize: "14px",
                      }}
                    >
                      No subscribers yet. Share the page!
                    </p>
                  ) : (
                    <table
                      style={{
                        width: "100%",
                        minWidth: "420px",
                        borderCollapse: "collapse",
                        fontSize: "13px",
                      }}
                    >
                      <thead>
                        <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "8px 12px",
                              color: "#888",
                              fontWeight: 600,
                            }}
                          >
                            #
                          </th>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "8px 12px",
                              color: "#888",
                              fontWeight: 600,
                            }}
                          >
                            Email
                          </th>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "8px 12px",
                              color: "#888",
                              fontWeight: 600,
                            }}
                          >
                            Subscribed
                          </th>
                          <th style={{ padding: "8px 12px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map((sub, i) => (
                          <tr
                            key={sub.email}
                            style={{ borderBottom: "1px solid #f5f5f5" }}
                          >
                            <td style={{ padding: "10px 12px", color: "#bbb" }}>
                              {i + 1}
                            </td>
                            <td
                              style={{
                                padding: "10px 12px",
                                color: "#111",
                                fontWeight: 500,
                              }}
                            >
                              {sub.email}
                            </td>
                            <td style={{ padding: "10px 12px", color: "#888" }}>
                              {formatDate(sub.subscribedAt)}
                            </td>
                            <td
                              style={{
                                padding: "10px 12px",
                                textAlign: "right",
                              }}
                            >
                              <button
                                onClick={() => deleteSubscriber(sub.email)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#fc8181",
                                  fontSize: "16px",
                                }}
                                title="Remove"
                              >
                                🗑
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
 
      {/* hidden admin trigger — callable from outside via openNewsletterAdmin() */}
      <div
        id="newsletter-admin-trigger"
        onClick={openAdmin}
        style={{ display: "none" }}
      />
    </div>
  );
}
 
 
/* ─────────────────────────────────────────────────────────────────
   Footer — site footer used at the bottom of the LMS homepage.
 
   Responsive breakpoints reworked so the 6-column desktop layout
   doesn't get forced too early on tablets/iPads:
     - base   (<640px, phones)          → 2 columns (mobile-only change)
     - sm     (≥640px, large phones)    → 2 columns (unchanged)
     - md     (≥768px, iPad / tablet)   → 2 columns (unchanged, via sm:)
     - lg     (≥1024px, laptop/desktop) → full 6-column custom layout (unchanged)
 
   `scrollToSection` is passed in from LMSHomepage because it also
   drives the course-tab state (`activeTab`) that lives on that page.
───────────────────────────────────────────────────────────────── */
export default function Footer({ scrollToSection }) {
  const navigate = useNavigate();
 
  return (
      <footer className="bg-[#181818] text-[#D1D5DB] border-t border-white/[0.06] font-['Poppins',_sans-serif]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 md:px-10 py-12 md:py-16">
          <div className="grid gap-x-4 gap-y-10 sm:gap-x-8 lg:gap-y-12 grid-cols-2 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr_1.3fr] items-start text-left">
            <div className="flex flex-col gap-3 self-start items-start col-span-2 sm:col-span-2 lg:col-span-1">
              <h3 className="text-3xl font-extrabold leading-none tracking-tight">
                <span className="text-green-500">ILM</span>{" "}
                <span className="text-[#F97316]">ORA</span>
              </h3>
              <p className="text-sm text-[#9CA3AF] leading-relaxed max-w-xs">
                Modern learning platform for ambitious professionals who want to
                break into product, design and growth roles.
              </p>
              <p className="text-sm text-[#D1D5DB] flex items-center gap-2">
                <span className="text-[#F97316]">✉</span>
                <a
                  href="mailto: ilmora@texora.ai"
                  className="hover:text-[#F97316] transition-colors duration-300"
                >
                   ilmora@texora.ai
                </a>
              </p>
 
              <div className="flex items-center justify-start gap-3 pt-2 flex-wrap">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/texora_ai"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white hover:scale-110 hover:-translate-y-0.5 hover:shadow-[0_0_14px_rgba(249,115,22,0.5)] transition-all duration-300"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                  }}
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </a>
 
                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@Texoraai"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-[#FF0000] hover:scale-110 hover:-translate-y-0.5 hover:shadow-[0_0_14px_rgba(249,115,22,0.5)] transition-all duration-300"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
 
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/ilmora-texoraai/"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-[#0A66C2] hover:scale-110 hover:-translate-y-0.5 hover:shadow-[0_0_14px_rgba(249,115,22,0.5)] transition-all duration-300"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
 
                {/* WhatsApp */}
                <a
                  href="https://api.whatsapp.com/send?phone=919205299338"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-[#25D366] hover:scale-110 hover:-translate-y-0.5 hover:shadow-[0_0_14px_rgba(249,115,22,0.5)] transition-all duration-300"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                </a>
 
                {/* X / Twitter */}
                <a
                  href="https://x.com/texoraai"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-black hover:scale-110 hover:-translate-y-0.5 hover:shadow-[0_0_14px_rgba(249,115,22,0.5)] transition-all duration-300"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.062 2.25H8.28l4.259 5.63 5.704-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
 
            <div className="flex flex-col gap-4 items-start">
              <h4 className="text-sm font-bold tracking-widest text-white uppercase relative pb-2">
                Programs
                <span className="absolute left-0 bottom-0 w-6 h-[2px] bg-[#F97316]" />
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-[#D1D5DB]">
                {[
                  {
                    label: "Product Management",
                    action: () => scrollToSection("courses", "product"),
                  },
                  {
                    label: "Growth Marketing",
                    action: () => scrollToSection("courses", "growth"),
                  },
                  {
                    label: "UI / UX Design",
                    action: () => scrollToSection("courses", "design"),
                  },
                ].map((item) => (
                  <li
                    key={item.label}
                    onClick={item.action}
                    className="hover:text-[#F97316] hover:translate-x-1 cursor-pointer transition-all duration-300 flex items-center gap-1.5 group"
                  >
                    <span className="text-[#F97316] opacity-70 group-hover:opacity-100 transition-opacity shrink-0">
                      &rsaquo;
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
 
            <div className="flex flex-col gap-4 items-start">
              <h4 className="text-sm font-bold tracking-widest text-white uppercase relative pb-2">
                Resources
                <span className="absolute left-0 bottom-0 w-6 h-[2px] bg-[#F97316]" />
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-[#D1D5DB]">
                {[
                  {
                    label: "Success Stories",
                    action: () => scrollToSection("successstories"),
                  },
                  {
                    label: "Blogs",
                    action: () =>
                      window.open("https://texora.ai/blogs", "_blank"),
                  },
                  {
                    label: "Use Cases",
                    action: () =>
                      window.open("https://texora.ai/use-cases", "_blank"),
                  },
                ].map((item) => (
                  <li
                    key={item.label}
                    onClick={item.action}
                    className="hover:text-[#F97316] hover:translate-x-1 cursor-pointer transition-all duration-300 flex items-center gap-1.5 group"
                  >
                    <span className="text-[#F97316] opacity-70 group-hover:opacity-100 transition-opacity shrink-0">
                      &rsaquo;
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
 
            <div className="flex flex-col gap-4 self-start items-start">
              <h4 className="text-sm font-bold tracking-widest text-white uppercase relative pb-2">
                Company
                <span className="absolute left-0 bottom-0 w-6 h-[2px] bg-[#F97316]" />
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-[#D1D5DB]">
                {[
                  { label: "About Us", action: () => navigate("/about") },
                  { label: "Careers", action: () => navigate("/careers") },
                  {
                    label: "Pricing",
                    action: () => navigate("/pricing"),
                    highlight: true,
                  },
                  { label: "FAQ", action: () => navigate("/faq") },
                ].map((item) => (
                  <li
                    key={item.label}
                    onClick={item.action}
                    className={`hover:text-[#F97316] hover:translate-x-1 cursor-pointer transition-all duration-300 flex items-center gap-1.5 group ${
                      item.highlight ? "text-[#F97316]" : ""
                    }`}
                  >
                    <span className="text-[#F97316] opacity-70 group-hover:opacity-100 transition-opacity shrink-0">
                      &rsaquo;
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
 
            <div className="flex flex-col gap-4 self-start items-start">
              <h4 className="text-sm font-bold tracking-widest text-white uppercase relative pb-2">
                Supports
                <span className="absolute left-0 bottom-0 w-6 h-[2px] bg-[#F97316]" />
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-[#D1D5DB]">
                {[
                  {
                    label: "Privacy Policy",
                    action: () => navigate("/privacy-policy"),
                  },
                  {
                  label: "Terms of Service",
                  action: () => navigate("/terms-of-service"),
                  },
                  {
                    label: "Help Center",
                    action: () => navigate("/help-center"),
                  },
                  {
                  label: "Contact Us",
                 action: () => navigate("/contact"),
                },
                ].map((item) => (
                  <li
                    key={item.label}
                    onClick={item.action}
                    className="hover:text-[#F97316] hover:translate-x-1 cursor-pointer transition-all duration-300 flex items-center gap-1.5 group"
                  >
                    <span className="text-[#F97316] opacity-70 group-hover:opacity-100 transition-opacity shrink-0">
                      &rsaquo;
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
 
            <div className="flex flex-col items-start w-full col-span-2 sm:col-span-2 lg:col-span-1 max-w-[320px] sm:max-w-none lg:max-w-[260px] mx-0">
              <FooterNewsletter />
            </div>
          </div>
 
          <div className="border-t border-white/[0.08] mt-10 md:mt-12 pt-6 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-3 text-sm text-[#9CA3AF] text-center">
            <span>
              © {new Date().getFullYear()} ILM ORA All rights reserved.
            </span>
            <div className="flex items-center flex-wrap justify-center gap-2">
              <span className="text-[#D1D5DB]">ILM ORA</span>
              <span className="text-red-500 text-base leading-none">❤️</span>
              <span className="text-[#9CA3AF]">Powered by</span>
              <span className="text-[#F97316] font-medium">Texora AI</span>
            </div>
          </div>
        </div>
      </footer>
  );
}