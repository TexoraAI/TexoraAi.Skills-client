import React, { useState } from 'react';
import { Icon } from './Icons.jsx';

const DEVICES = [
  { key: 'desktop', label: 'Desktop', icon: 'Monitor' },
  { key: 'tablet', label: 'Tablet', icon: 'Tablet' },
  { key: 'mobile', label: 'Mobile', icon: 'Mobile' },
];

/**
 * ResponsiveCheckSection — "Multi-device preview". Shows how the current
 * banner design renders at desktop / tablet / mobile widths side by side
 * with a browser-chrome frame, matching the design reference.
 */
export default function ResponsiveCheckSection() {
  const [device, setDevice] = useState('desktop');

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <div className="eyebrow">
            <Icon.Monitor size={13} /> Responsive Check
          </div>
          <h2>Multi-device preview</h2>
          <div className="sub">See exactly how this banner renders across screen sizes.</div>
        </div>
      </div>

      <div className="bs-panel" style={{ padding: 24 }}>
        <div className="device-switch">
          {DEVICES.map((d) => (
            <button
              key={d.key}
              className={`device-btn ${device === d.key ? 'active' : ''}`}
              onClick={() => setDevice(d.key)}
            >
              {Icon[d.icon]({ size: 15 })}
              {d.label}
            </button>
          ))}
        </div>
        <div className="device-stage">
          <div className={`device-frame ${device !== 'desktop' ? device : ''}`}>
            <div className="device-chrome">
              <span className="chrome-dot" /><span className="chrome-dot" /><span className="chrome-dot" />
            </div>
            <div className="device-screen">
              <div className="ds-eyebrow">ILM ORA · AI Engineering</div>
              <div className="ds-title">Become an AI Engineer</div>
              <div className="ds-sub">Industry-ready training with real projects, mentorship &amp; placement support</div>
              <span className="ds-cta">Enroll Now</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
