import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import BannerCard from './BannerCard.jsx';
import { Icon } from './Icons.jsx';

const TABS = [
  { key: 'all', label: 'All Banners' },
  { key: 'active', label: 'Active' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'draft', label: 'Drafts' },
];

export default function BannerGrid({
  banners,
  loading,
  filter,
  onFilterChange,
  onEdit,
  onDuplicate,
  onDelete,
  onCreate,
}) {
  const tabRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const moveIndicator = () => {
    const el = tabRefs.current[filter];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  };

  useLayoutEffect(() => {
    moveIndicator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    window.addEventListener('resize', moveIndicator);
    return () => window.removeEventListener('resize', moveIndicator);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <section className="section">
      <div className="tabs-row">
        <div className="tabs-pill">
          <div className="tab-indicator" style={{ left: indicator.left, width: indicator.width }} />
          {TABS.map((tab) => (
            <button
              key={tab.key}
              ref={(el) => (tabRefs.current[tab.key] = el)}
              className={`tab ${filter === tab.key ? 'active' : ''}`}
              onClick={() => onFilterChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="tabs-meta">
          Showing {banners.length} banner{banners.length !== 1 ? 's' : ''}
        </div>
      </div>

      {loading ? (
        <div className="banner-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="skeleton-card" key={i}>
              <div className="sk sk-thumb" />
              <div className="sk sk-line w60" />
              <div className="sk sk-line w40" />
            </div>
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Icon.Layout size={30} />
          </div>
          <h3>No banners here yet</h3>
          <p>This is where your {filter !== 'all' ? filter : ''} banners will show up once you create one.</p>
          <button className="btn btn-primary" onClick={onCreate}>
            <Icon.Plus size={16} /> Create your first banner
          </button>
        </div>
      ) : (
        <div className="banner-grid">
          {banners.map((b) => (
            <BannerCard
              key={b.id}
              banner={b}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
