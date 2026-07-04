import React, { useMemo } from 'react';
import { Icon } from './Icons.jsx';

function fmtCompact(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

function sparkPoints(data, w, h) {
  if (data.length < 2) return '';
  const max = Math.max(...data);
  const min = Math.min(...data);
  return data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    })
    .join(' ');
}

function Sparkline({ data, color }) {
  const w = 120;
  const h = 30;
  const pts = sparkPoints(data, w, h);
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {pts && <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

function LineChart({ impressions, clicks }) {
  const W = 560;
  const H = 220;
  const padL = 10;
  const padR = 10;
  const padT = 14;
  const padB = 20;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxI = Math.max(...impressions, 1);

  const toPts = (data) =>
    data.map((v, i) => {
      const x = padL + (data.length > 1 ? (i / (data.length - 1)) * plotW : 0);
      const y = padT + plotH - (v / maxI) * plotH;
      return [x, y];
    });

  const impPts = toPts(impressions);
  const clkPts = toPts(clicks);
  const toStr = (pts) => pts.map((p) => p.join(',')).join(' ');
  const areaStr = (pts) => `${padL},${padT + plotH} ${toStr(pts)} ${padL + plotW},${padT + plotH}`;

  const gridLines = [0, 1, 2, 3].map((i) => padT + (plotH / 3) * i);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="bsGradOrange" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F97316" stopOpacity=".35" />
          <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bsGradGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16A34A" stopOpacity=".3" />
          <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridLines.map((y, i) => (
        <line key={i} x1={padL} y1={y} x2={padL + plotW} y2={y} stroke="var(--bs-line-soft)" strokeWidth="1" />
      ))}
      <polygon points={areaStr(impPts)} fill="url(#bsGradOrange)" />
      <polygon points={areaStr(clkPts)} fill="url(#bsGradGreen)" />
      <polyline points={toStr(impPts)} fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={toStr(clkPts)} fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AnalyticsSection({ banners }) {
  const data = useMemo(() => {
    const sorted = [...banners].sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    const views = sorted.map((b) => b.views || 0);
    const clicks = sorted.map((b) => b.clicks || 0);
    const totalViews = views.reduce((s, v) => s + v, 0);
    const totalClicks = clicks.reduce((s, v) => s + v, 0);
    const ctr = totalViews ? (totalClicks / totalViews) * 100 : 0;
    const avgViews = sorted.length ? Math.round(totalViews / sorted.length) : 0;
    const ctrByBanner = sorted
      .map((b) => ({ name: b.name, ctr: b.views ? (b.clicks / b.views) * 100 : 0 }))
      .sort((a, b) => b.ctr - a.ctr)
      .slice(0, 5);
    return { views, clicks, totalViews, totalClicks, ctr, avgViews, ctrByBanner, count: sorted.length };
  }, [banners]);

  if (data.count === 0) return null;

  const kpis = [
    { label: 'Impressions', value: fmtCompact(data.totalViews), spark: data.views, color: '#F97316' },
    { label: 'Clicks', value: fmtCompact(data.totalClicks), spark: data.clicks, color: '#16A34A' },
    { label: 'Avg. CTR', value: `${data.ctr.toFixed(1)}%`, spark: data.ctrByBanner.map((d) => d.ctr), color: '#F97316' },
    { label: 'Avg. Views / Banner', value: fmtCompact(data.avgViews), spark: data.views, color: '#16A34A' },
  ];

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <div className="eyebrow green">
            <Icon.Layout size={13} /> Performance
          </div>
          <h2>Banner analytics</h2>
          <div className="sub">Across all {data.count} banner{data.count !== 1 ? 's' : ''} in this workspace.</div>
        </div>
      </div>

      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className="kpi-card" key={k.label}>
            <div className="kpi-top">
              <span>{k.label}</span>
            </div>
            <div className="kpi-num">{k.value}</div>
            <Sparkline data={k.spark.length ? k.spark : [0, 0]} color={k.color} />
          </div>
        ))}
      </div>

      {data.count > 1 ? (
        <div className="analytics-grid">
          <div className="chart-card">
            <div className="chart-head">
              <h3>Impressions vs Clicks</h3>
              <div className="legend">
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: 'var(--orange)' }} /> Impressions
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: 'var(--green)' }} /> Clicks
                </div>
              </div>
            </div>
            <div className="chart-wrap">
              <LineChart impressions={data.views} clicks={data.clicks} />
            </div>
          </div>
          <div className="bars-card">
            <h3>CTR by banner</h3>
            {data.ctrByBanner.map((d) => (
              <div className="bar-row" key={d.name}>
                <div className="name" title={d.name}>{d.name}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${Math.min(100, d.ctr * 10)}%` }} />
                </div>
                <div className="val">{d.ctr.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bars-card">
          <p style={{ color: 'var(--bs-muted)', fontSize: '13px' }}>
            Add a couple more banners to unlock the impressions-vs-clicks trend chart.
          </p>
        </div>
      )}
    </section>
  );
}
