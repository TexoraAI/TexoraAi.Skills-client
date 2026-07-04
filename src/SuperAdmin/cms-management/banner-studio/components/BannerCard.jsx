import React from 'react';
import { Icon } from './Icons.jsx';

function fmt(n) {
  return Number(n || 0).toLocaleString('en-US');
}

export default function BannerCard({ banner, onEdit, onDuplicate, onDelete }) {
  return (
    <div className="banner-card">
      <div className="banner-thumb" style={{ background: banner.gradient }}>
        <span className={`status-badge ${banner.status}`}>{banner.status}</span>
        <div className="thumb-menu">
          <Icon.Layout size={15} />
        </div>
        <div className="thumb-content">
          <strong>{banner.emoji} ILM ORA</strong>
          <span>Banner preview</span>
        </div>
      </div>
      <div className="banner-body">
        <h3>{banner.name}</h3>
        <div className="banner-meta-row">
          <span>
            <Icon.Calendar size={14} /> {new Date(banner.updatedAt).toLocaleDateString()}
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
          <button className="act-btn dup" onClick={() => onDuplicate(banner.id)}>
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
