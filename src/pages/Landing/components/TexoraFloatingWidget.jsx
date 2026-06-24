// src/pages/Landing/components/TexoraFloatingWidget.jsx

import { ArrowRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import texoraLogo from "../../../assets/texora-logo.png";
import "./texora-floating-widget.css";

const TEXORA_URL = "https://texora.ai/";

const TexoraFloatingWidget = () => {
  const [isOpen, setIsOpen] = useState(true);
  const panelRef = useRef(null);

  const closePanel = () => setIsOpen(false);

  const handleExplore = () => {
    window.open(TEXORA_URL, "_blank", "noopener,noreferrer");
    closePanel();
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (isOpen && window.innerWidth <= 480) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="texora-widget">
      <div
        ref={panelRef}
        className="texora-panel texora-panel--open"
        role="dialog"
        aria-modal="true"
        aria-label="Texora AI"
      >
        {/* Close Button */}
        <button
          type="button"
          className="texora-panel__close"
          onClick={closePanel}
          aria-label="Close panel"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* Real logo image */}
        <div className="texora-panel__logo">
          <img
            src={texoraLogo}
            alt="Texora AI"
            className="texora-panel__logo-image"
          />
        </div>

        {/* Heading */}
        <h3
          className="texora-panel__title"
          style={{ fontWeight: 800 }}
        >
          Simplify HR, Empower Your Workforce
        </h3>

        {/* Short professional summary */}
        <p className="texora-panel__summary">
          All-in-one HR software to manage hiring, payroll, attendance,
          leave, and boost productivity — all from a single platform.
        </p>

        {/* Explore Texora CTA */}
        <button
          type="button"
          className="texora-panel__cta"
          onClick={handleExplore}
        >
          <span>Explore Texora</span>
          <span className="texora-panel__cta-arrow">
            <ArrowRight size={15} strokeWidth={2.5} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default TexoraFloatingWidget;