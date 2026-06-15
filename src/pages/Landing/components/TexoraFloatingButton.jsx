// src/pages/Landing/components/TexoraFloatingButton.jsx

import React from "react";
import { Sparkles, X } from "lucide-react";

const TexoraFloatingButton = ({ isOpen, onClick }) => {
  return (
    <button
      type="button"
      className={`texora-fab ${isOpen ? "texora-fab--active" : ""}`}
      onClick={onClick}
      aria-label={isOpen ? "Close Texora AI panel" : "Open Texora AI panel"}
      aria-expanded={isOpen}
    >
      <span className="texora-fab__icon">
        {isOpen ? (
          <X size={26} strokeWidth={2.5} />
        ) : (
          <Sparkles size={26} strokeWidth={2.2} />
        )}
      </span>
      <span className="texora-fab__pulse" aria-hidden="true" />
    </button>
  );
};

export default TexoraFloatingButton;