// src/pages/Landing/components/TexoraFloatingCard.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";

/**
 * Renders one row of the mega-menu.
 * variant="default" -> small column item (Candidate / Enterprise tools)
 * variant="full"    -> full-width row (Bench Resource), with trailing arrow
 */
const TexoraFloatingCard = ({ item, onNavigate, variant = "default" }) => {
  const navigate = useNavigate();
  const Icon = item.icon;

  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    }
    navigate(item.route);
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="texora-menu-item texora-menu-item--full"
      >
        <span className="texora-menu-item__icon">
          <Icon size={18} strokeWidth={2} />
        </span>

        <span className="texora-menu-item__content">
          <span className="texora-menu-item__title">{item.title}</span>
          <span className="texora-menu-item__desc">{item.description}</span>
        </span>

        <span className="texora-menu-item__arrow">
          <ArrowRight size={18} strokeWidth={2.2} />
        </span>
      </button>
    );
  }

  return (
    <button type="button" onClick={handleClick} className="texora-menu-item">
      <span className="texora-menu-item__icon">
        <Icon size={18} strokeWidth={2} />
      </span>

      <span className="texora-menu-item__content">
        <span className="texora-menu-item__title">
          {item.title}
          {item.external && (
            <ExternalLink
              size={12}
              strokeWidth={2.5}
              className="texora-menu-item__external"
            />
          )}
        </span>
        <span className="texora-menu-item__desc">{item.description}</span>
      </span>
    </button>
  );
};

export default TexoraFloatingCard;