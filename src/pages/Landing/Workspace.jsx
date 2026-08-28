import { useState } from "react";

// ✅ Same shared shell used by every other public page (Careers, ManagerHub,
// ILM ORA Meet, About, Pricing, Contact, FAQ, ResumeBuilderLanding,
// StudentHub, etc).
import PublicLayout from "./components/PublicLayout";

import ctaPersonImg from "../../assets/cta-photo.webp";


import { CSS, THEME_VARS } from "./sections/workspace.styles";
import LoginModal from "./sections/LoginModal";

import StatsSection from "./sections/StatsSection";
import StartJoinSection from "./sections/StartJoinSection";
import BeforeMeetingSection from "./sections/BeforeMeetingSection";
import DuringMeetingSection from "./sections/DuringMeetingSection";
import HostControlsSection from "./sections/HostControlsSection";
import DashboardSection from "./sections/DashboardSection";
import AfterMeetingSection from "./sections/AfterMeetingSection";
import FinalCTASection from "./sections/FinalCTASection";

/* ─────────────────────────────────────────────────────────────────
   ILMORA MEETINGS — LANDING PAGE (workspace.jsx)
   UI-only compaction + consistency + responsive pass. No backend,
   API, state-management, or business-logic changes — every section
   below is now its own file under ./workspace/, all styles live in
   ./workspace/workspace.styles.js, and the band colors + spacing were
   reworked so the page reads as one deliberate design instead of
   stitched-together sections. See README.md in this zip for the
   full list of what changed and why.
───────────────────────────────────────────────────────────────── */
export default function Workspace({ theme, toggleTheme, scrollToSection }) {
  // Falls back to its own light/dark state if no theme is passed down from
  // App.jsx, so this page still works if it's ever mounted standalone.
  const [localTheme, setLocalTheme] = useState("light");
  const activeTheme = theme || localTheme;
  const handleToggleTheme =
    toggleTheme || (() => setLocalTheme((t) => (t === "dark" ? "light" : "dark")));

  // Same as every other public page: own this bit of state and hand the
  // setter down to PublicLayout, which owns the actual "Get Started" login
  // modal (Google + email/password) — same modal StudentHub.jsx's "Get
  // Started" button opens. No modal markup lives in this file.
  const [showLoginModal, setShowLoginModal] = useState(false);
  const openLoginModal = () => setShowLoginModal(true);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const vars = THEME_VARS[activeTheme] || THEME_VARS.light;

  return (
    <PublicLayout
      theme={activeTheme}
      toggleTheme={handleToggleTheme}
      setShowLoginModal={setShowLoginModal}
      scrollToSection={scrollToSection || scrollTo}
    >
      <div className="ilmoraMeetingsPage" style={vars}>
        <style>{CSS}</style>

               <DashboardSection />

        {/* "Before / during / after" — the features intro heading now lives
            inside StartJoinSection so it shares one continuous cream band
            instead of sitting in its own duplicate white section. */}
        <section id="features-section" style={{ padding: 0 }}>
          <StartJoinSection />
          <BeforeMeetingSection />
          <DuringMeetingSection />
          <HostControlsSection />
          
          <AfterMeetingSection />
        </section>

        <FinalCTASection personImg={ctaPersonImg} />

        {/* Real login modal — Navbar's "Get Started" button (via PublicLayout's
            setShowLoginModal) flips this on, same as LMSHomepage.jsx. */}
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
    </PublicLayout>
  );
}
