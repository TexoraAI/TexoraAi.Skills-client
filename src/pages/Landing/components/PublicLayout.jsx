import { useNavigate } from "react-router-dom";
import AnnouncementBanner from "./AnnouncementBanner";
import Navbar from "./Navbar";
import Footer from "./Footer";

/* ─────────────────────────────────────────────────────────────────
   PublicLayout — shared shell for all public-facing pages
   (Pricing, Careers, About, Contact, FAQ, Help Center, Privacy
   Policy, Terms of Service, Study Abroad, Student/Trainer/Manager
   Hub, Resume Builder, FDE Academy, etc.)

   Scope:
     AnnouncementBanner → Navbar → {children} → Footer

   This component only composes existing, unmodified pieces
   (AnnouncementBanner.jsx, Navbar.jsx, MobileFullScreenMenu.jsx via
   Navbar, Footer.jsx) — no new UI, no redesign.

   Footer expects a `scrollToSection(sectionId, tabName?)` callback —
   on the LMS homepage this drives the course-tab state (see
   LMSHomepage.jsx). Public pages rendered through this layout don't
   have that homepage section content, so unless a page explicitly
   passes its own `scrollToSection`, clicking a Footer link that
   scrolls to a section (Programs / Success Stories) just sends the
   visitor to the homepage section instead, via `#sectionId`.
───────────────────────────────────────────────────────────────── */
export default function PublicLayout({
  theme,
  toggleTheme,
  setShowLoginModal,
  scrollToSection,
  children,
}) {
  const navigate = useNavigate();

  const handleScrollToSection =
    scrollToSection || ((sectionId) => navigate(`/#${sectionId}`));

  return (
    <>
      <AnnouncementBanner />

      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        setShowLoginModal={setShowLoginModal}
      />

      {/*
        Navbar is `fixed`, so the first in-flow element after it needs
        top spacing to avoid being hidden underneath it.
        AnnouncementBanner already reserves this same 84px internally
        (see its own `pt-[84px]` wrapper) when it renders — so this
        value simply mirrors that existing convention, keeping spacing
        consistent whether or not a banner is currently active.
      */}
      <main className="pt-[84px]">{children}</main>

      <Footer scrollToSection={handleScrollToSection} />
    </>
  );
}







































