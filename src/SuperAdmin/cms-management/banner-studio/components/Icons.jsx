import React from 'react';

/**
 * Lightweight inline-SVG icon set — no external icon package required.
 * Matches the reference design's stroke style: 1.8px stroke, round caps/joins.
 * Usage: <Icon.Eye size={16} /> or <Icon.ArrowUp className="growth-icon" />
 */
const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function svg(paths, size, className, style) {
  return (
    <svg {...base} width={size || base.width} height={size || base.height} className={className} style={style}>
      {paths}
    </svg>
  );
}

export const Icon = {
  Layout: (p) => svg(<><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18M9 21V9" /></>, p?.size, p?.className, p?.style),
  Calendar: (p) => svg(<><rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9.5h18M8 2.5v4M16 2.5v4" /></>, p?.size, p?.className, p?.style),
  Eye: (p) => svg(<><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>, p?.size, p?.className, p?.style),
  Click: (p) => svg(<><path d="M9 3.5 20 9l-4.6 1.6L14 15Z" /><path d="M4 4l2 2M3 10h3M9 3v3" /></>, p?.size, p?.className, p?.style),
  Edit: (p) => svg(<><path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" /></>, p?.size, p?.className, p?.style),
  Copy: (p) => svg(<><rect x="9" y="9" width="12" height="12" rx="2.3" /><path d="M5 15H4.5A2.5 2.5 0 0 1 2 12.5v-8A2.5 2.5 0 0 1 4.5 2h8A2.5 2.5 0 0 1 15 4.5V5" /></>, p?.size, p?.className, p?.style),
  Trash: (p) => svg(<><path d="M4 7h16M9 7V4.8c0-.8.6-1.3 1.3-1.3h3.4c.7 0 1.3.5 1.3 1.3V7M6 7l1 12.5A2 2 0 0 0 9 21h6a2 2 0 0 0 2-2L18 7" /></>, p?.size, p?.className, p?.style),
  ArrowUp: (p) => svg(<><path d="M12 19V5M6 11l6-6 6 6" /></>, p?.size, p?.className, p?.style),
  ArrowDown: (p) => svg(<><path d="M12 5v14M6 13l6 6 6-6" /></>, p?.size, p?.className, p?.style),
  Search: (p) => svg(<><circle cx="11" cy="11" r="7.5" /><path d="m21 21-4.4-4.4" /></>, p?.size, p?.className, p?.style),
  Bell: (p) => svg(<><path d="M18 9a6 6 0 0 0-12 0c0 5-2 6-2 6h16s-2-1-2-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></>, p?.size, p?.className, p?.style),
  Plus: (p) => svg(<path d="M12 5v14M5 12h14" />, p?.size, p?.className, p?.style),
  ChevronLeft: (p) => svg(<path d="m15 18-6-6 6-6" />, p?.size, p?.className, p?.style),
  ChevronRight: (p) => svg(<path d="m9 18 6-6-6-6" />, p?.size, p?.className, p?.style),
  Send: (p) => svg(<path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" />, p?.size, p?.className, p?.style),
  Save: (p) => svg(<><path d="M5 3h11l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M8 3v6h8V3M8 21v-7h8v7" /></>, p?.size, p?.className, p?.style),
  Sparkles: (p) => svg(<><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2" /></>, p?.size, p?.className, p?.style),
  Check: (p) => svg(<path d="M20 6 9 17l-5-5" />, p?.size, p?.className, p?.style),
  X: (p) => svg(<path d="M18 6 6 18M6 6l12 12" />, p?.size, p?.className, p?.style),
  Sort: (p) => svg(<><rect x="3" y="4" width="18" height="4" rx="1.2" /><rect x="3" y="10" width="18" height="4" rx="1.2" /><rect x="3" y="16" width="18" height="4" rx="1.2" /></>, p?.size, p?.className, p?.style),
  Upload: (p) => svg(<><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v2.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V16" /></>, p?.size, p?.className, p?.style),
  Palette: (p) => svg(<><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.9 1.8-2 0-.5-.2-.9-.5-1.3-.3-.3-.5-.7-.5-1.2 0-1.1.9-2 2-2h2.4A3.8 3.8 0 0 0 21 10.8C21 6.5 16.9 3 12 3Z" /><circle cx="7.5" cy="11.5" r="1.1" fill="currentColor" stroke="none" /><circle cx="10.5" cy="7.5" r="1.1" fill="currentColor" stroke="none" /><circle cx="15" cy="7.5" r="1.1" fill="currentColor" stroke="none" /></>, p?.size, p?.className, p?.style),
  Monitor: (p) => svg(<><rect x="3" y="4" width="18" height="12.5" rx="2" /><path d="M8 21h8M12 16.5V21" /></>, p?.size, p?.className, p?.style),
  Tablet: (p) => svg(<><rect x="5" y="2.5" width="14" height="19" rx="2.3" /><path d="M11.5 18h1" /></>, p?.size, p?.className, p?.style),
  Mobile: (p) => svg(<><rect x="7" y="2.5" width="10" height="19" rx="2.3" /><path d="M11.5 18h1" /></>, p?.size, p?.className, p?.style),
  Wand: (p) => svg(<><path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M12.2 6.2L11 5M12.2 11.8L11 13" /><path d="M3 21l9-9" /></>, p?.size, p?.className, p?.style),
  Image: (p) => svg(<><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.6" /><path d="M21 15l-5-5L5 21" /></>, p?.size, p?.className, p?.style),
  Type: (p) => svg(<><polyline points="5 6 5 4 19 4 19 6" /><line x1="12" y1="4" x2="12" y2="20" /><line x1="9" y1="20" x2="15" y2="20" /></>, p?.size, p?.className, p?.style),
  Square: (p) => svg(<rect x="4" y="4" width="16" height="16" rx="3" />, p?.size, p?.className, p?.style),
  Star: (p) => svg(<path d="M12 3l2.6 5.5 6 .8-4.4 4.1 1.2 6-5.4-3-5.4 3 1.2-6-4.4-4.1 6-.8z" />, p?.size, p?.className, p?.style),
  Smile: (p) => svg(<><circle cx="12" cy="12" r="9" /><path d="M8 14.2s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9.5" x2="9" y2="9.5" /><line x1="15" y1="9.5" x2="15" y2="9.5" /></>, p?.size, p?.className, p?.style),
  Layers: (p) => svg(<><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></>, p?.size, p?.className, p?.style),
  AlignLeft: (p) => svg(<><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="18" y2="18" /></>, p?.size, p?.className, p?.style),
  AlignCenter: (p) => svg(<><line x1="4" y1="6" x2="20" y2="6" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="5" y1="18" x2="19" y2="18" /></>, p?.size, p?.className, p?.style),
  AlignRight: (p) => svg(<><line x1="4" y1="6" x2="20" y2="6" /><line x1="10" y1="12" x2="20" y2="12" /><line x1="6" y1="18" x2="20" y2="18" /></>, p?.size, p?.className, p?.style),
  Info: (p) => svg(<><circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16.5" /><circle cx="12" cy="7.7" r="0.15" fill="currentColor" stroke="currentColor" strokeWidth="2.4" /></>, p?.size, p?.className, p?.style),
};

export default Icon;
