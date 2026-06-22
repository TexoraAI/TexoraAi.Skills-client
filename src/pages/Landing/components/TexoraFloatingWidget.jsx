// src/pages/Landing/components/TexoraFloatingWidget.jsx

import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import texoraLogo from "../../../assets/texora-logo.png";
import TexoraFloatingCard from "./TexoraFloatingCard";
import "./texora-floating-widget.css";
import {
  TEXORA_BENCH_RESOURCE,
  TEXORA_CTA,
  TEXORA_HEADER,
  TEXORA_TOOL_GROUPS,
} from "./texoraData";

const TexoraFloatingWidget = () => {
  const [isOpen, setIsOpen] = useState(true);
  const panelRef = useRef(null);
  

  const togglePanel = () => setIsOpen((prev) => !prev);
  const closePanel = () => setIsOpen(false);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target)
      )
       {
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

  return (
    <div className="texora-widget">
      {isOpen && (
        <div
          ref={panelRef}
          className="texora-panel texora-panel--open"
          role="dialog"
          aria-modal="true"
          aria-label="Texora AI tools menu"
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

          {/* Header */}
          <div className="texora-panel__header">
            <div className="texora-panel__header-text">
            <div className="texora-panel__logo">
  <img
    src={texoraLogo}
    alt="Texora AI"
    className="texora-panel__logo-image"
  />
</div>      
            </div>    
          </div>
          {/* Candidate / Enterprise tool sections */}
          {TEXORA_TOOL_GROUPS.map((group) => (
            <div className="texora-menu-section" key={group.id}>
              <div className="texora-menu-section__label">
                <span>{group.label}</span>
              </div>
              <div className="texora-menu-list">
                {group.items.map((item) => (
                  <TexoraFloatingCard
                    key={item.id}
                    item={item}
                    onNavigate={closePanel}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Bench Resource — extra row, no section label */}
          <div className="texora-menu-section texora-menu-section--plain">
            <div className="texora-menu-list">
              <TexoraFloatingCard
                item={TEXORA_BENCH_RESOURCE}
                onNavigate={closePanel}
              />
            </div>
          </div>

          {/* CTA Section */}
          <button
            type="button"
            onClick={() => {
              window.open(TEXORA_CTA.url, "_blank", "noopener,noreferrer");
            }}
            className="texora-panel__cta"
          >
            {TEXORA_CTA.text}
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TexoraFloatingWidget;