import React from "react";
import { Icon } from "./Icons.jsx";

function fmt(n) {
  return Number(n || 0).toLocaleString("en-US");
}

export default function BannerCard({ banner, onEdit, onDuplicate, onDelete }) {
  return (
    <div className="banner-card">
      {/* <div
        className="banner-thumb"
        style={
          banner.desktopImageUrl
            ? {
                backgroundImage: `url(${banner.desktopImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : { background: banner.gradient }
        }
      >
        <span className={`status-badge ${banner.status}`}>{banner.status}</span>
        <div className="thumb-menu">
          <Icon.Layout size={15} />
        </div>
        {!banner.desktopImageUrl && (
          <div className="thumb-content">
            <strong>{banner.emoji} ILM ORA</strong>
            <span>Banner preview</span>
          </div>
        )}
      </div> */}
      <div
        className="banner-thumb"
        style={
          banner.desktopImageUrl
            ? {
                backgroundImage: `url(${banner.desktopImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : { background: banner.gradient }
        }
      >
        <span className={`status-badge ${banner.status}`}>{banner.status}</span>
        <div className="thumb-menu">
          <Icon.Layout size={15} />
        </div>

        {!banner.desktopImageUrl && banner.aiGenerated ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "18px 20px",
              color: "#fff",
              zIndex: 1,
            }}
          >
            {banner.eyebrow && (
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: 0.4,
                  textTransform: "uppercase",
                  opacity: 0.85,
                  marginBottom: 6,
                }}
              >
                {banner.eyebrow}
              </span>
            )}
            <strong
              style={{
                fontSize: 17,
                fontWeight: 800,
                lineHeight: 1.25,
                marginBottom: 4,
              }}
            >
              {banner.emoji} {banner.title || banner.name}
            </strong>
            {banner.subtitle && (
              <span
                style={{
                  fontSize: 11.5,
                  opacity: 0.9,
                  marginBottom: 8,
                  lineHeight: 1.4,
                }}
              >
                {banner.subtitle}
              </span>
            )}
            {banner.ctaText && (
              <span
                style={{
                  alignSelf: "flex-start",
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontSize: 10.5,
                  fontWeight: 700,
                }}
              >
                {banner.ctaText}
              </span>
            )}
          </div>
        ) : (
          !banner.desktopImageUrl && (
            <div className="thumb-content">
              <strong>{banner.emoji} ILM ORA</strong>
              <span>Banner preview</span>
            </div>
          )
        )}
      </div>
      <div className="banner-body">
        <h3>{banner.name}</h3>
        <div className="banner-meta-row">
          <span>
            <Icon.Calendar size={14} />{" "}
            {new Date(banner.updatedAt).toLocaleDateString()}
          </span>
          <span>
            <Icon.Eye size={14} /> {fmt(banner.views)}
          </span>
          <span>
            <Icon.Click size={14} /> {fmt(banner.clicks)}
          </span>
        </div>
        <div className="banner-actions">
          <button className="act-btn edit" onClick={() => onEdit(banner)}>
            <Icon.Edit size={14} /> Edit
          </button>
          <button
            className="act-btn dup"
            onClick={() => onDuplicate(banner.id)}
          >
            <Icon.Copy size={14} /> Duplicate
          </button>
          <button className="act-btn del" onClick={() => onDelete(banner.id)}>
            <Icon.Trash size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
