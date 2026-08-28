// Dashboard Demo — component + shell CSS.
// The bulk of this file is workspace-styles.css from the standalone Dashboard
// project (Overview/Events/Calendar/Contacts/Availability/... pages), copied
// verbatim and mechanically scoped under .ws-demo-scope so every selector,
// button, card, table and badge style is byte-for-byte the same visual
// language as the real product. A second block (search 'FRAME CHROME') adds
// only what the standalone Dashboard never needed: the browser-style title
// bar, a container-query-driven responsive shell (frame width, not viewport
// width, since this now lives inside a landing-page card), and dropdown/
// toast positioning fixes so nothing escapes the demo frame.
export const DASHBOARD_DEMO_CSS = `
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap");
.ws-demo-scope {
  
  --font-family: "Poppins", sans-serif;

  --brand: #7c3aed; 
  --brand-2: #a855f7; 
  --brand-deep: #6d28d9; 
  --live: #16a34a; 
  --accent: #f59e0b; 
  --accent-2: #ec4899;
  --info: #3b82f6; 

  --bg: #f1f5f9; 
  --card: #ffffff; 
  --text: #0f172a; 
  --muted: #64748b; 
  --border: #e2e8f0; 

  --outer-sidebar-bg: #14101f;
  --outer-sidebar-text: #cbc3dd;

  
  --radius-lg: 20px;
  --radius-md: 14px;
  --radius-sm: 10px;

  
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 32px;

  
  --shadow-card: 0 1px 8px rgba(0, 0, 0, 0.07);
  --shadow-card-hover: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  --shadow-dropdown: 0 16px 40px rgba(0, 0, 0, 0.14);
  --shadow-toast: 0 8px 32px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.06);

  
  --tone-purple-solid: #7c3aed;
  --tone-purple-soft: #ede9fe;
  --tone-green-solid: #16a34a;
  --tone-green-soft: #dcfce7;
  --tone-amber-solid: #f59e0b;
  --tone-amber-soft: #fef3c7;
  --tone-red-solid: #ef4444;
  --tone-red-soft: #fee2e2;
  --tone-blue-solid: #3b82f6;
  --tone-blue-soft: #dbeafe;

  color-scheme: light;
}
.ws-demo-scope .workspace-shell.dark {
  --bg: #0a0a0a;
  --card: #111111;
  --text: #f5f5f5;
  --muted: #a1a1aa;
  --border: rgba(255, 255, 255, 0.08);

  --tone-purple-soft: rgba(124, 58, 237, 0.18);
  --tone-green-soft: rgba(22, 163, 74, 0.18);
  --tone-amber-soft: rgba(245, 158, 11, 0.18);
  --tone-red-soft: rgba(239, 68, 68, 0.18);
  --tone-blue-soft: rgba(59, 130, 246, 0.18);

  --shadow-card: 0 1px 8px rgba(0, 0, 0, 0.5);
  --shadow-card-hover: 0 8px 32px rgba(0, 0, 0, 0.65);
  --shadow-dropdown: 0 16px 40px rgba(0, 0, 0, 0.7);
  --shadow-toast: 0 8px 32px rgba(0, 0, 0, 0.6), 0 1px 4px rgba(0, 0, 0, 0.3);

  color-scheme: dark;
}
.ws-demo-scope .workspace-shell.dark .btn-ghost:hover {
  background: #1a1a1a;
}
.ws-demo-scope .workspace-shell.dark .badge.muted {
  background: rgba(255, 255, 255, 0.08);
}
.ws-demo-scope .workspace-shell.dark .wm-error {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.35);
}
.ws-demo-scope * {
  box-sizing: border-box;
}
.ws-demo-scope, .ws-demo-scope, .ws-demo-scope #root {
  height: 100%;
  width: 100%;
}
.ws-demo-scope {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-family);
  letter-spacing: 0.01em; 
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
}
.ws-demo-scope button, .ws-demo-scope input, .ws-demo-scope select, .ws-demo-scope textarea {
  font-family: inherit;
  max-width: 100%;
}
.ws-demo-scope .ws-sidebar, .ws-demo-scope .ws-content, .ws-demo-scope .workspace-shell, .ws-demo-scope .card, .ws-demo-scope .stat-card, .ws-demo-scope .section-card, .ws-demo-scope .quick-action, .ws-demo-scope .contact-card, .ws-demo-scope .integration-card, .ws-demo-scope .full-month-grid, .ws-demo-scope .full-month-cell {
  min-width: 0;
  max-width: 100%;
}
.ws-demo-scope a {
  color: inherit;
  text-decoration: none;
}
.ws-demo-scope .app-shell {
  display: flex;
  min-height: 100vh;
  width: 100%;
}
.ws-demo-scope .outer-rail {
  width: 232px;
  flex-shrink: 0;
  background: var(--outer-sidebar-bg);
  color: var(--outer-sidebar-text);
  display: flex;
  flex-direction: column;
  padding: 18px 12px 16px;
  gap: 14px;
}
.ws-demo-scope .outer-rail.is-collapsed {
  width: 76px;
}
.ws-demo-scope .outer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px 10px;
}
.ws-demo-scope .outer-brand .logo-chip {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  font-weight: 800;
  font-size: 13px;
}
.ws-demo-scope .outer-brand .brand-text {
  min-width: 0;
}
.ws-demo-scope .outer-brand .brand-text .name {
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.01em;
  white-space: nowrap;
}
.ws-demo-scope .outer-brand .brand-text .name .ora {
  color: var(--brand-2);
}
.ws-demo-scope .outer-brand .brand-text .sub {
  font-size: 10px;
  color: #8b83a3;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 1px;
}
.ws-demo-scope .rail-collapse-btn {
  margin-left: auto;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: #cbc3dd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}
.ws-demo-scope .rail-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  flex: 1;
}
.ws-demo-scope .rail-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 12px;
  border-radius: 11px;
  border: none;
  background: transparent;
  color: #b6acd0;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-align: left;
}
.ws-demo-scope .rail-item svg {
  flex-shrink: 0;
}
.ws-demo-scope .rail-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}
.ws-demo-scope .rail-item.is-active {
  background: linear-gradient(135deg, var(--brand), var(--brand-deep));
  color: #fff;
  box-shadow: 0 8px 18px rgba(124, 58, 237, 0.35);
}
.ws-demo-scope .outer-rail.is-collapsed .rail-item span, .ws-demo-scope .outer-rail.is-collapsed .brand-text {
  display: none;
}
.ws-demo-scope .outer-rail.is-collapsed .rail-item {
  justify-content: center;
  padding: 10px;
}
.ws-demo-scope .rail-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.ws-demo-scope .rail-footer .avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--brand-2), var(--accent-2));
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ws-demo-scope .rail-footer .who {
  min-width: 0;
}
.ws-demo-scope .rail-footer .who b {
  display: block;
  font-size: 12.5px;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ws-demo-scope .rail-footer .who span {
  font-size: 10px;
  color: #8b83a3;
}
.ws-demo-scope .outer-rail.is-collapsed .rail-footer .who {
  display: none;
}
.ws-demo-scope .shell-right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.ws-demo-scope .top-nav {
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 0 24px;
  height: 58px;
  background: #14101f;
  color: #cbc3dd;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}
.ws-demo-scope .top-nav-links {
  display: flex;
  align-items: center;
  gap: 22px;
  font-size: 13px;
  font-weight: 600;
  color: #a79bc4;
  flex: 1;
  overflow-x: auto;
  white-space: nowrap;
}
.ws-demo-scope .top-nav-links span {
  cursor: pointer;
}
.ws-demo-scope .top-nav-links span:hover, .ws-demo-scope .top-nav-links span.is-active {
  color: #fff;
}
.ws-demo-scope .top-nav-icons {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}
.ws-demo-scope .top-nav-icons .icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: #cbc3dd;
}
.ws-demo-scope .top-nav-icons .avatar-sm {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--brand-2), var(--accent-2));
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ws-demo-scope .workspace-shell {
  display: grid;
  grid-template-columns: 216px minmax(0, 1fr);
  width: 100%;
  min-width: 0;
  max-width: 100%;
  min-height: 0;
  overflow-x: hidden;
  position: relative;
}
.ws-demo-scope .ws-mobile-toggle {
  display: none;
  align-items: center;
  gap: 8px;
  grid-column: 1 / -1;
  grid-row: 1;
  width: fit-content;
  margin: var(--space-3) 0 0 var(--space-4);
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--card);
  color: var(--text);
  font-size: 12.5px;
  font-weight: 700;
  box-shadow: var(--shadow-card);
  cursor: pointer;
  z-index: 30;
}
.ws-demo-scope .ws-sidebar-backdrop {
  display: none;
}
.ws-demo-scope .ws-sidebar {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  background: var(--card) !important;
  border-right: 1px solid var(--border);
  padding: 18px 14px 16px !important;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}
.ws-demo-scope .ws-sidebar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 6px 14px;
  margin-bottom: 2px;
  font-size: 14px;
  font-weight: 800;
  color: var(--text);
  border-bottom: 1px solid var(--border);
}
.ws-demo-scope .ws-sidebar-head-label {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ws-demo-scope .ws-sidebar-close {
  display: none;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--muted);
  cursor: pointer;
  flex-shrink: 0;
}
.ws-demo-scope .ws-sidebar-close:hover {
  background: rgba(124, 58, 237, 0.08);
  color: var(--brand-deep);
}
.ws-demo-scope .ws-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ws-demo-scope .ws-group-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--muted);
  padding: 10px 10px 6px;
  text-transform: uppercase;
}
.ws-demo-scope .ws-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 11px;
  border-radius: 9px;
  border: none;
  background: transparent;
  color: var(--text);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  text-align: left;
}
.ws-demo-scope .ws-item svg {
  flex-shrink: 0;
  color: var(--muted);
}
.ws-demo-scope .ws-item:hover {
  background: rgba(124, 58, 237, 0.07);
}
.ws-demo-scope .ws-item.is-active {
  background: rgba(124, 58, 237, 0.12);
  color: var(--brand-deep);
}
.ws-demo-scope .ws-item.is-active svg {
  color: var(--brand);
}
.ws-demo-scope .ws-content {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--space-6) var(--space-6) 56px !important;
  background: var(--bg);
  container-type: inline-size;
  container-name: ws;
}
.ws-demo-scope .ws-content > * + * {
  margin-top: var(--space-5) !important;
}
.ws-demo-scope .ws-content > .ws-page-head + * {
  margin-top: var(--space-6) !important;
}
.ws-demo-scope .ws-page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
  width: 100%;
  max-width: 100%;
}
.ws-demo-scope .ws-page-head-title {
  min-width: 0;
  flex: 1 1 260px;
}
.ws-demo-scope .ws-page-head-eyebrow {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
  color: var(--muted);
}
.ws-demo-scope .ws-page-head-eyebrow b {
  color: var(--brand-deep);
  font-weight: 700;
}
.ws-demo-scope .ws-page-head h1 {
  font-size: clamp(24px, 2.2vw, 30px); 
  font-weight: 600; 
  line-height: 1.1; 
  margin: 0 0 8px;
  letter-spacing: -0.02em; 
  overflow-wrap: break-word;
}
.ws-demo-scope .ws-page-head p {
  margin: 0;
  font-size: 14px;
  color: var(--muted);
}
.ws-demo-scope .ws-page-head-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  flex-shrink: 0;
  min-width: 0;
}
.ws-demo-scope .ws-page-head-actions .live-pill, .ws-demo-scope .ws-page-head-actions .date-pill, .ws-demo-scope .ws-page-head-actions .btn-primary, .ws-demo-scope .ws-page-head-actions .btn-ghost {
  height: 34px;
  padding-top: 0;
  padding-bottom: 0;
  box-sizing: border-box;
}
.ws-demo-scope .live-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: var(--live);
  background: var(--tone-green-soft);
  padding: 6px var(--space-3);
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;
}
.ws-demo-scope .live-pill .dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--live);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.25);
  flex-shrink: 0;
}
.ws-demo-scope .date-pill {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  background: var(--card);
  border: 1px solid var(--border);
  padding: 6px var(--space-3);
  border-radius: 10px;
  white-space: nowrap;
  flex-shrink: 0;
}
.ws-demo-scope .btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  background: var(--brand);
  color: #fff;
  border: 1px solid transparent;
  padding: 10px var(--space-4);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  cursor: pointer;
  transition: background 0.15s ease;
  white-space: nowrap;
  flex-shrink: 0;
}
.ws-demo-scope .btn-primary:hover {
  background: var(--brand-deep);
}
.ws-demo-scope .btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.ws-demo-scope .btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 10px var(--space-4);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  cursor: pointer;
  transition: background 0.15s ease;
}
.ws-demo-scope .btn-ghost:hover {
  background: #f8fafc;
}
.ws-demo-scope .btn-sm {
  padding: 7px var(--space-3);
  font-size: 12px;
  border-radius: 8px;
}
.ws-demo-scope .icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  cursor: pointer;
}
.ws-demo-scope .icon-btn:hover {
  background: rgba(124, 58, 237, 0.1);
}
.ws-demo-scope .card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md); 
  padding: var(--space-5);
  box-shadow: var(--shadow-card);
}
.ws-demo-scope .stat-grid {
  display: grid !important;
  width: 100%;
  min-width: 0;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px !important; 
}
.ws-demo-scope .stat-card {
  background: var(--card) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-md); 
  padding: var(--space-5) !important;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  box-shadow: var(--shadow-card) !important;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}
.ws-demo-scope .stat-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-1px);
}
.ws-demo-scope .stat-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ws-demo-scope .stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--tone-purple-soft);
  color: var(--tone-purple-solid);
}
.ws-demo-scope .tone-live .stat-icon {
  background: var(--tone-green-soft);
  color: var(--tone-green-solid);
}
.ws-demo-scope .tone-accent .stat-icon {
  background: var(--tone-amber-soft);
  color: var(--tone-amber-solid);
}
.ws-demo-scope .tone-pink .stat-icon {
  background: var(--tone-red-soft);
  color: var(--tone-red-solid);
}
.ws-demo-scope .tone-info .stat-icon {
  background: var(--tone-blue-soft);
  color: var(--tone-blue-solid);
}
.ws-demo-scope .stat-value {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin-top: var(--space-3);
}
.ws-demo-scope .stat-label {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--muted);
}
.ws-demo-scope .stat-delta {
  font-size: 11px;
  font-weight: 700;
  color: var(--tone-green-solid);
  margin-top: 3px;
}
.ws-demo-scope .stat-delta.muted-delta {
  color: var(--muted);
}
.ws-demo-scope .content-grid-2 {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.72fr);
  gap: var(--space-5) !important;
  align-items: start;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}
.ws-demo-scope .workspace-tools-column {
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}
.ws-demo-scope .workspace-tools-column > * {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}
@container ws (max-width: 700px) {
.ws-demo-scope .content-grid-2 {
    grid-template-columns: minmax(0, 1fr);
  }
.ws-demo-scope .full-month-cell {
    min-height: 74px;
  }
}
@container ws (max-width: 640px) {
.ws-demo-scope .stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@container ws (max-width: 420px) {
.ws-demo-scope .stat-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
.ws-demo-scope .section-card {
  background: var(--card) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-md); 
  padding: var(--space-5) !important;
  box-shadow: var(--shadow-card) !important;
  min-width: 0;
  max-width: 100%;
}
.ws-demo-scope .section-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  gap: var(--space-3);
  flex-wrap: wrap;
}
.ws-demo-scope .section-card-head h2 {
  font-size: 15.5px;
  font-weight: 800;
  margin: 0;
}
.ws-demo-scope .section-link {
  font-size: 12px;
  font-weight: 700;
  color: var(--brand);
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.ws-demo-scope .list-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-3);
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: 3px solid var(--brand);
  margin-bottom: var(--space-2);
  background: rgba(124, 58, 237, 0.03);
  min-width: 0;
  max-width: 100%;
}
.ws-demo-scope .list-row:has(.list-row-date) {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: 12px;
  align-items: center;
}
.ws-demo-scope .list-row:has(.list-row-date) > * {
  min-width: 0;
}
.ws-demo-scope .list-row.type-presentation {
  border-left-color: var(--tone-blue-solid);
}
.ws-demo-scope .list-row.type-review {
  border-left-color: var(--tone-green-solid);
}
.ws-demo-scope .list-row.type-demo {
  border-left-color: var(--tone-amber-solid);
}
.ws-demo-scope .list-row.type-planning {
  border-left-color: var(--tone-red-solid);
}
.ws-demo-scope .list-row-date {
  width: 48px;
  text-align: center;
  flex-shrink: 0;
}
.ws-demo-scope .list-row-date .mon {
  font-size: 10px;
  font-weight: 800;
  color: var(--brand);
  letter-spacing: 0.05em;
}
.ws-demo-scope .list-row-date .day {
  font-size: 16px;
  font-weight: 800;
}
.ws-demo-scope .list-row-main {
  flex: 1;
  min-width: 0;
  max-width: 100%;
}
.ws-demo-scope .list-row-main .title {
  font-size: 13px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ws-demo-scope .list-row-main .meta {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ws-demo-scope .badge {
  font-size: 10px;
  font-weight: 800;
  padding: 5px var(--space-2);
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;
  background: var(--tone-purple-soft);
  color: var(--brand-deep);
}
.ws-demo-scope .badge.info {
  background: var(--tone-blue-soft);
  color: #1d4ed8;
}
.ws-demo-scope .badge.warn {
  background: var(--tone-amber-soft);
  color: #b45309;
}
.ws-demo-scope .badge.live {
  background: var(--tone-green-soft);
  color: #15803d;
}
.ws-demo-scope .badge.muted {
  background: #f1f5f9;
  color: var(--muted);
}
.ws-demo-scope .row-menu-btn {
  border: none;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ws-demo-scope .row-menu-btn:hover {
  background: rgba(124, 58, 237, 0.08);
}
.ws-demo-scope .tab-strip {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
  border-bottom: 1px solid var(--border);
  padding-bottom: 2px;
}
.ws-demo-scope .tab-strip .tab {
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
  padding: var(--space-3) var(--space-1);
  margin-right: var(--space-4);
  cursor: pointer;
  border-bottom: 2px solid transparent;
}
.ws-demo-scope .tab-strip .tab.is-active {
  color: var(--text);
  border-bottom-color: var(--brand);
}
.ws-demo-scope .pill-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.ws-demo-scope .pill-tabs .pill-tab {
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
  padding: 6px var(--space-3);
  border-radius: 999px;
  cursor: pointer;
}
.ws-demo-scope .pill-tabs .pill-tab.is-active {
  background: var(--brand);
  border-color: var(--brand);
  color: #fff;
}
.ws-demo-scope .toolbar-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.ws-demo-scope .search-box {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: var(--space-2) var(--space-3);
  flex: 1;
  min-width: 180px;
}
.ws-demo-scope .search-box input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  width: 100%;
  color: var(--text);
}
.ws-demo-scope .search-box svg {
  color: var(--muted);
  flex-shrink: 0;
}
.ws-demo-scope .empty-state {
  text-align: center;
  padding: 40px 16px;
  color: var(--muted);
}
.ws-demo-scope .empty-state svg {
  color: var(--brand-2);
  margin-bottom: 10px;
}
.ws-demo-scope .empty-state h3 {
  margin: 0 0 4px;
  font-size: 14px;
  color: var(--text);
}
.ws-demo-scope .empty-state p {
  margin: 0;
  font-size: 12.5px;
}
.ws-demo-scope .quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-4);
}
.ws-demo-scope .quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  text-align: center;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-3);
  cursor: pointer;
  color: var(--text);
  box-shadow: var(--shadow-card);
}
.ws-demo-scope .quick-action:hover {
  border-color: var(--brand);
  transform: translateY(-1px);
}
.ws-demo-scope .quick-action .qa-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(124, 58, 237, 0.12);
  color: var(--brand);
}
.ws-demo-scope .quick-action span {
  font-size: 12px;
  font-weight: 700;
}
.ws-demo-scope .im-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: var(--space-5);
  width: 100%;
  min-width: 0;
}
.ws-demo-scope .im-hero {
  background: linear-gradient(135deg, var(--brand), var(--brand-deep));
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
  max-width: 100%;
}
.ws-demo-scope .im-hero h2 {
  margin: 0;
  font-size: 18px;
}
.ws-demo-scope .im-hero p {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  max-width: 380px;
}
.ws-demo-scope .im-hero .btn-primary {
  background: #fff;
  color: var(--brand-deep);
  box-shadow: none;
  align-self: flex-start;
}
.ws-demo-scope .im-join-row {
  display: flex;
  gap: var(--space-2);
  min-width: 0;
  max-width: 100%;
  flex-wrap: wrap;
}
.ws-demo-scope .im-join-row input {
  flex: 1 1 160px;
  min-width: 0;
  border-radius: 10px;
  border: 1px solid var(--border);
  padding: var(--space-3) var(--space-3);
  font-size: 13px;
  outline: none;
}
.ws-demo-scope .im-join-row .btn-primary {
  flex-shrink: 0;
}
.ws-demo-scope .cal-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.ws-demo-scope .cal-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 800;
}
.ws-demo-scope .full-month-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
  min-width: 0;
}
.ws-demo-scope .full-month-grid .dow {
  font-size: 11px;
  font-weight: 800;
  color: var(--muted);
  text-align: center;
  padding-bottom: 6px;
}
.ws-demo-scope .full-month-cell {
  min-height: 88px;
  min-width: 0;
  max-width: 100%;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 6px;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  gap: 3px;
  cursor: pointer;
}
.ws-demo-scope .full-month-cell.is-empty {
  background: transparent;
  border: none;
  cursor: default;
}
.ws-demo-scope .full-month-cell.is-today {
  border-color: var(--brand);
}
.ws-demo-scope .full-month-cell.is-selected {
  background: rgba(124, 58, 237, 0.08);
  border-color: var(--brand);
}
.ws-demo-scope .full-month-cell .num {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
}
.ws-demo-scope .full-month-cell.is-today .num {
  color: var(--brand);
}
.ws-demo-scope .full-month-cell .mini-evt {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 5px;
  background: rgba(124, 58, 237, 0.14);
  color: var(--brand-deep);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}
.ws-demo-scope .cal-day-panel {
  position: sticky;
  top: 0;
  align-self: start;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}
.ws-demo-scope .contact-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}
.ws-demo-scope .contact-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  box-shadow: var(--shadow-card);
}
.ws-demo-scope .contact-avatar {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
  font-size: 13px;
  flex-shrink: 0;
}
.ws-demo-scope .contact-info {
  flex: 1;
  min-width: 0;
}
.ws-demo-scope .contact-info b {
  display: block;
  font-size: 13px;
  font-weight: 700;
}
.ws-demo-scope .contact-info span {
  font-size: 11px;
  color: var(--muted);
}
.ws-demo-scope .contact-actions {
  display: flex;
  gap: 6px;
}
.ws-demo-scope .avail-day-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-1);
  border-bottom: 1px solid var(--border);
}
.ws-demo-scope .avail-day-row:last-child {
  border-bottom: none;
}
.ws-demo-scope .avail-day-name {
  width: 100px;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}
.ws-demo-scope .avail-time-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}
.ws-demo-scope .avail-time-inputs input[type="time"] {
  border: 1px solid var(--border);
  border-radius: 9px;
  padding: 7px 10px;
  font-size: 12.5px;
  outline: none;
  background: var(--bg);
}
.ws-demo-scope .avail-time-inputs span {
  color: var(--muted);
  font-size: 12px;
}
.ws-demo-scope .toggle-switch {
  position: relative;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
}
.ws-demo-scope .toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.ws-demo-scope .toggle-slider {
  position: absolute;
  inset: 0;
  background: rgba(107, 100, 120, 0.25);
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.15s ease;
}
.ws-demo-scope .toggle-slider::before {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  left: 3px;
  top: 3px;
  background: #fff;
  border-radius: 999px;
  transition: transform 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}
.ws-demo-scope .toggle-switch input:checked + .toggle-slider {
  background: var(--brand);
}
.ws-demo-scope .toggle-switch input:checked + .toggle-slider::before {
  transform: translateX(18px);
}
.ws-demo-scope .integrations-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
}
.ws-demo-scope .integration-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  box-shadow: var(--shadow-card);
}
.ws-demo-scope .integration-top {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.ws-demo-scope .integration-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(124, 58, 237, 0.1);
  color: var(--brand);
  flex-shrink: 0;
}
.ws-demo-scope .integration-top b {
  font-size: 13px;
  font-weight: 800;
  display: block;
}
.ws-demo-scope .connected-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  color: var(--tone-green-solid);
}
.ws-demo-scope .connected-tag .dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--tone-green-solid);
}
.ws-demo-scope .settings-tabs {
  display: flex;
  gap: 4px;
  background: var(--bg);
  border-radius: 12px;
  padding: 4px;
  width: fit-content;
  margin-bottom: 18px;
}
.ws-demo-scope .settings-tabs button {
  border: none;
  background: transparent;
  padding: var(--space-2) var(--space-4);
  font-size: 12.5px;
  font-weight: 700;
  color: var(--muted);
  border-radius: 9px;
  cursor: pointer;
}
.ws-demo-scope .settings-tabs button.is-active {
  background: var(--card);
  color: var(--text);
  box-shadow: 0 1px 3px rgba(23, 15, 40, 0.1);
}
.ws-demo-scope .form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}
.ws-demo-scope .form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.ws-demo-scope .form-field label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
}
.ws-demo-scope .form-field input, .ws-demo-scope .form-field select {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: var(--space-3) var(--space-3);
  font-size: 13px;
  outline: none;
  background: var(--bg);
  color: var(--text);
}
.ws-demo-scope .settings-toggle-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--border);
}
.ws-demo-scope .settings-toggle-row:last-child {
  border-bottom: none;
}
.ws-demo-scope .settings-toggle-row b {
  display: block;
  font-size: 13px;
  font-weight: 700;
}
.ws-demo-scope .settings-toggle-row span {
  font-size: 11px;
  color: var(--muted);
}
.ws-demo-scope .sync-history-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--border);
  font-size: 12.5px;
}
.ws-demo-scope .sync-history-row:last-child {
  border-bottom: none;
}
.ws-demo-scope .sync-history-row .t {
  margin-left: auto;
  color: var(--muted);
  font-size: 11px;
}
.ws-demo-scope .instant-hero-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  min-width: 0;
  max-width: 100%;
}
.ws-demo-scope .instant-hero-head {
  flex-shrink: 0;
}
.ws-demo-scope .instant-hero-head h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.ws-demo-scope .instant-hero-body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
.ws-demo-scope .instant-hero-body p {
  margin: 0;
  font-size: 12.5px;
  color: var(--muted);
  max-width: 100%;
}
.ws-demo-scope .instant-hero-illustration {
  display: flex;
  flex-shrink: 0;
}
.ws-demo-scope .instant-hero-card .btn-primary {
  width: 100%;
  justify-content: center;
}
.ws-demo-scope .ihi-avatar {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border: 2px solid var(--card);
  margin-left: -10px;
}
.ws-demo-scope .ihi-avatar:first-child {
  margin-left: 0;
}
.ws-demo-scope .ihi-avatar.ihi-1 {
  background: var(--brand);
}
.ws-demo-scope .ihi-avatar.ihi-2 {
  background: var(--info);
}
.ws-demo-scope .ihi-avatar.ihi-3 {
  background: var(--accent-2);
}
.ws-demo-scope .calendar-sync-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: var(--space-3);
}
.ws-demo-scope .email-stats-row {
  display: flex;
  justify-content: space-around;
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border);
}
.ws-demo-scope .email-stat {
  text-align: center;
}
.ws-demo-scope .email-stat .val {
  font-weight: 800;
  font-size: 15px;
}
.ws-demo-scope .section-card-footer {
  display: flex;
  justify-content: center;
  padding-top: 10px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}
.ws-demo-scope .muted {
  color: var(--muted);
  font-size: 12.5px;
}
.ws-demo-scope .spin {
  animation: ws-spin 0.9s linear infinite;
}
@keyframes ws-spin {
from {
    transform: rotate(0deg);
  }
to {
    transform: rotate(360deg);
  }
}
.ws-demo-scope .row-menu-wrap {
  position: relative;
  flex-shrink: 0;
}
.ws-demo-scope .row-menu-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: var(--shadow-dropdown);
  display: flex;
  flex-direction: column;
  min-width: 150px;
  padding: var(--space-1);
  z-index: 20;
}
.ws-demo-scope .row-menu-dropdown button {
  border: none;
  background: transparent;
  text-align: left;
  padding: var(--space-2) var(--space-3);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text);
  border-radius: 8px;
  cursor: pointer;
}
.ws-demo-scope .row-menu-dropdown button:hover {
  background: rgba(124, 58, 237, 0.08);
}
.ws-demo-scope .toast-stack {
  position: fixed;
  right: var(--space-6);
  bottom: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  z-index: 9999;
  pointer-events: none;
}
.ws-demo-scope .toast-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--text);
  color: #fff;
  padding: var(--space-3) var(--space-4);
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 600;
  box-shadow: var(--shadow-toast);
  animation: ws-toast-in 0.18s ease;
}
.ws-demo-scope .toast-item svg {
  color: var(--tone-green-solid);
  flex-shrink: 0;
}
@keyframes ws-toast-in {
from {
    opacity: 0;
    transform: translateY(6px);
  }
to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (max-width: 1280px) {
.ws-demo-scope .workspace-shell {
    grid-template-columns: 200px minmax(0, 1fr);
  }
}
@media (max-width: 1024px) {
.ws-demo-scope .workspace-shell {
    grid-template-columns: 188px minmax(0, 1fr);
  }
}
@media (max-width: 860px) {
.ws-demo-scope .workspace-shell {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto 1fr;
  }
.ws-demo-scope .ws-mobile-toggle {
    display: inline-flex;
  }
.ws-demo-scope .ws-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    max-width: 84vw;
    z-index: 220;
    transform: translateX(-100%);
    transition: transform 0.22s ease;
    box-shadow: var(--shadow-dropdown);
  }
.ws-demo-scope .ws-sidebar.is-open {
    transform: translateX(0);
  }
.ws-demo-scope .ws-sidebar-close {
    display: inline-flex;
  }
.ws-demo-scope .ws-sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(20, 16, 31, 0.45);
    z-index: 210;
  }
.ws-demo-scope .ws-content {
    grid-column: 1;
    grid-row: 2;
  }
}
@media (max-width: 480px) {
.ws-demo-scope .ws-content {
    padding: var(--space-4) var(--space-4) 48px !important;
  }
.ws-demo-scope .ws-mobile-toggle {
    margin-left: var(--space-3);
  }
}
@media (max-width: 1024px) {
.ws-demo-scope .workspace-shell {
    padding-top: 54px;
  }
}
@container ws (max-width: 640px) {
.ws-demo-scope .quick-actions-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
.ws-demo-scope .integrations-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
.ws-demo-scope .im-grid {
    grid-template-columns: 1fr;
  }
.ws-demo-scope .contact-grid {
    grid-template-columns: 1fr;
  }
.ws-demo-scope .form-grid {
    grid-template-columns: 1fr;
  }
.ws-demo-scope .cal-day-panel {
    position: static;
    max-height: none;
  }
}
@container ws (max-width: 480px) {
.ws-demo-scope .quick-actions-grid {
    grid-template-columns: 1fr;
  }
.ws-demo-scope .integrations-grid {
    grid-template-columns: 1fr;
  }
.ws-demo-scope .email-stats-row {
    flex-wrap: wrap;
    gap: var(--space-3);
  }
.ws-demo-scope .full-month-cell {
    min-height: 60px;
    padding: 4px;
  }
.ws-demo-scope .full-month-cell .mini-evt {
    font-size: 8.5px;
    padding: 1px 4px;
  }
.ws-demo-scope .cal-toolbar {
    justify-content: flex-start;
  }
}
.ws-demo-scope .wm-scrim {
  position: fixed;
  top: var(--wm-top, 0px);
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(15, 23, 42, 0.18);
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  z-index: 9999;
  animation: wm-fade-in 0.15s ease-out;
}
@keyframes wm-fade-in {
from {
    opacity: 0;
  }
to {
    opacity: 1;
  }
}
@keyframes wm-slide-in {
from {
    transform: translateX(24px);
    opacity: 0;
  }
to {
    transform: translateX(0);
    opacity: 1;
  }
}
.ws-demo-scope .wm-panel {
  position: relative;
  width: var(--wm-width, 640px);
  max-width: calc(100vw - 32px);
  height: 100%;
  background: var(--card);
  border-left: 1px solid var(--border);
  box-shadow: var(--shadow-dropdown);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: wm-slide-in 0.18s ease-out;
}
.ws-demo-scope .wm-panel--dragging {
  animation: none;
  transition: none;
}
.ws-demo-scope .wm-resize-handle {
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 100%;
  cursor: ew-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  touch-action: none;
}
.ws-demo-scope .wm-resize-handle::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 100%;
  background: transparent;
  transition: background 0.12s ease;
}
.ws-demo-scope .wm-resize-handle:hover::before, .ws-demo-scope .wm-panel--dragging .wm-resize-handle::before {
  background: var(--brand);
}
.ws-demo-scope .wm-resize-grip {
  width: 4px;
  height: 44px;
  border-radius: 3px;
  background: var(--brand);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.12s ease;
}
.ws-demo-scope .wm-resize-handle:hover .wm-resize-grip, .ws-demo-scope .wm-panel--dragging .wm-resize-grip {
  opacity: 1;
}
.ws-demo-scope .wm-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.ws-demo-scope .wm-header-text h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: var(--text);
}
.ws-demo-scope .wm-header-text p {
  margin: 4px 0 0;
  font-size: 12.5px;
  color: var(--muted);
}
.ws-demo-scope .wm-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--muted);
  cursor: pointer;
  flex-shrink: 0;
}
.ws-demo-scope .wm-close:hover {
  background: rgba(124, 58, 237, 0.08);
  color: var(--brand-deep);
}
.ws-demo-scope .wm-body {
  padding: var(--space-6);
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}
.ws-demo-scope .wm-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border);
  flex-shrink: 0;
  background: var(--bg);
}
.ws-demo-scope .wm-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 0;
}
.ws-demo-scope .wm-label {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text);
}
.ws-demo-scope .wm-required {
  color: var(--accent-2);
}
.ws-demo-scope .wm-hint {
  margin: 0;
  font-size: 11px;
  color: var(--muted);
}
.ws-demo-scope .wm-error {
  margin: 0;
  font-size: 12.5px;
  font-weight: 600;
  color: #ef4444; 
  background: #fef2f2; 
  border: 1px solid #fecaca; 
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
}
.ws-demo-scope .wm-row {
  display: grid;
  gap: var(--space-4);
}
.ws-demo-scope .wm-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.ws-demo-scope .wm-section-title {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted);
}
.ws-demo-scope .wm-input, .ws-demo-scope .wm-textarea, .ws-demo-scope select.wm-input {
  width: 100%;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  border-radius: 10px;
  padding: 9px var(--space-3);
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.12s ease, box-shadow 0.12s ease;
}
.ws-demo-scope .wm-input:focus, .ws-demo-scope .wm-textarea:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.14);
}
.ws-demo-scope .wm-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.ws-demo-scope .wm-textarea {
  resize: vertical;
  min-height: 44px;
  line-height: 1.5;
}
.ws-demo-scope select.wm-input {
  cursor: pointer;
}
.ws-demo-scope .wm-inline-link {
  align-self: flex-start;
  background: none;
  border: none;
  color: var(--brand);
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}
.ws-demo-scope .wm-inline-link:hover {
  color: var(--brand-deep);
  text-decoration: underline;
}
.ws-demo-scope .wm-taginput {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--border);
  background: var(--card);
  border-radius: 10px;
  padding: 7px var(--space-3);
  min-height: 40px;
}
.ws-demo-scope .wm-taginput:focus-within {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.14);
}
.ws-demo-scope .wm-taginput input {
  flex: 1;
  min-width: 120px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: var(--text);
  font-family: inherit;
  padding: 3px 0;
}
.ws-demo-scope .wm-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(124, 58, 237, 0.1);
  color: var(--brand-deep);
  border-radius: 999px;
  padding: 4px 4px 4px 10px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.ws-demo-scope .wm-tag button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: none;
  background: rgba(124, 58, 237, 0.18);
  color: var(--brand-deep);
  cursor: pointer;
}
.ws-demo-scope .wm-tag button:hover {
  background: rgba(124, 58, 237, 0.3);
}
.ws-demo-scope .wm-segmented {
  display: inline-flex;
  padding: 3px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  gap: 2px;
  width: fit-content;
}
.ws-demo-scope .wm-segment {
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: 12.5px;
  font-weight: 700;
  padding: 7px 16px;
  border-radius: 8px;
  cursor: pointer;
}
.ws-demo-scope .wm-segment.is-active {
  background: var(--card);
  color: var(--brand-deep);
  box-shadow: var(--shadow-card);
}
.ws-demo-scope .wm-switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}
.ws-demo-scope .wm-switch-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
}
.ws-demo-scope .wm-switch-hint {
  font-size: 11px;
  color: var(--muted);
  margin-top: 1px;
}
.ws-demo-scope .wm-switch {
  position: relative;
  width: 38px;
  height: 22px;
  border-radius: 999px;
  border: none;
  background: rgba(124, 58, 237, 0.22);
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
}
.ws-demo-scope .wm-switch.is-on {
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
}
.ws-demo-scope .wm-switch-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(23, 15, 40, 0.3);
  transition: left 0.15s ease;
}
.ws-demo-scope .wm-switch.is-on .wm-switch-knob {
  left: 19px;
}
.ws-demo-scope .wm-device-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: var(--space-3);
  min-width: 0;
}
.ws-demo-scope .wm-device-tile {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: var(--space-3) var(--space-4);
  color: var(--brand-deep);
  min-width: 0;
  max-width: 100%;
}
.ws-demo-scope .wm-device-tile .wm-switch-row {
  flex: 1;
}
.ws-demo-scope .wm-check-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.ws-demo-scope .wm-check-option {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-2) 0;
  cursor: pointer;
}
.ws-demo-scope .wm-check-option input {
  margin-top: 2px;
  width: 15px;
  height: 15px;
  accent-color: var(--brand);
  cursor: pointer;
}
.ws-demo-scope .wm-check-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
}
.ws-demo-scope .wm-check-hint {
  display: block;
  font-size: 11px;
  color: var(--muted);
  margin-top: 1px;
}
.ws-demo-scope .wm-richtext {
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
}
.ws-demo-scope .wm-richtext-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}
.ws-demo-scope .wm-richtext-toolbar button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  border: none;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
}
.ws-demo-scope .wm-richtext-toolbar button:hover {
  background: rgba(124, 58, 237, 0.1);
  color: var(--brand-deep);
}
.ws-demo-scope .wm-richtext-area {
  min-height: 130px;
  max-height: 260px;
  overflow-y: auto;
  padding: var(--space-3) var(--space-4);
  font-size: 13px;
  line-height: 1.6;
  color: var(--text);
  outline: none;
}
.ws-demo-scope .wm-richtext-area:empty::before {
  content: attr(data-placeholder);
  color: var(--muted);
}
.ws-demo-scope .wm-attachment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: var(--space-2);
}
.ws-demo-scope .wm-attachment-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 5px 5px 5px 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
}
.ws-demo-scope .wm-attachment-chip button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: none;
  background: rgba(124, 58, 237, 0.14);
  color: var(--brand-deep);
  cursor: pointer;
}
.ws-demo-scope .wm-validated-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--tone-green-soft); 
  border: 1px solid #bbf7d0;
  color: #15803d; 
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  font-size: 12.5px;
  font-weight: 700;
}
@media (max-width: 640px) {
.ws-demo-scope .wm-scrim {
    align-items: flex-end;
    justify-content: center;
  }
.ws-demo-scope .wm-panel {
    width: 100% !important;
    max-width: 100%;
    height: auto;
    max-height: 92vh;
    border-left: none;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    animation: wm-fade-in 0.15s ease-out;
  }
.ws-demo-scope .wm-resize-handle {
    display: none;
  }
.ws-demo-scope .wm-row, .ws-demo-scope .wm-device-row {
    grid-template-columns: 1fr !important;
  }
.ws-demo-scope .wm-header, .ws-demo-scope .wm-body, .ws-demo-scope .wm-footer {
    padding-left: var(--space-4);
    padding-right: var(--space-4);
  }
.ws-demo-scope .wm-footer {
    flex-wrap: wrap;
  }
.ws-demo-scope .wm-footer button {
    flex: 1;
  }
}
@media (max-width: 400px) {
.ws-demo-scope .wm-panel {
    max-height: 94vh;
  }
.ws-demo-scope .wm-header, .ws-demo-scope .wm-body, .ws-demo-scope .wm-footer {
    padding-left: var(--space-3);
    padding-right: var(--space-3);
  }
.ws-demo-scope .wm-body {
    gap: var(--space-4);
    padding-top: var(--space-4);
    padding-bottom: var(--space-4);
  }
.ws-demo-scope .wm-richtext-toolbar {
    flex-wrap: wrap;
  }
.ws-demo-scope .wm-segmented {
    width: 100%;
  }
.ws-demo-scope .wm-segment {
    flex: 1;
    text-align: center;
  }
}/* =============================================================================
 * DASHBOARD DEMO — FRAME CHROME + RESPONSIVE SHELL
 * Everything below is additive, scoped under .ws-demo-scope, and sits after
 * the ported workspace-styles.css rules above so it wins on source order.
 * The original workspace-shell/.ws-sidebar/.ws-mobile-toggle layout classes
 * are intentionally NOT reused for the outer shell: those rely on viewport
 * @media breakpoints, but this demo lives inside a landing-page card whose
 * width has nothing to do with the visitor's actual viewport. Everything
 * here is driven by CONTAINER queries against the frame's own width instead,
 * so the demo adapts correctly whether it's embedded wide on desktop or
 * squeezed into a narrow mobile layout.
 * ========================================================================== */

.ws-demo-scope {
  position: relative;
  isolation: isolate;
}

/* Outer "browser/app window" card the whole demo lives inside */
.ws-demo-frame {
  position: relative;
  container-type: inline-size;
  container-name: wsdemo;
  width: 100%;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--card);
  box-shadow: 0 30px 80px -30px rgba(15, 23, 42, 0.35);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Fake browser titlebar: traffic-light dots + url pill + live-demo badge */
.ws-demo-titlebar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: #14101f;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}
.ws-demo-dots {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
.ws-demo-dots span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  display: inline-block;
}
.ws-demo-dots span:nth-child(1) {
  background: #ff5f57;
}
.ws-demo-dots span:nth-child(2) {
  background: #febc2e;
}
.ws-demo-dots span:nth-child(3) {
  background: #28c840;
}
.ws-demo-url {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(255, 255, 255, 0.08);
  color: #cbc3dd;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ws-demo-url svg {
  flex-shrink: 0;
  color: #16a34a;
}
.ws-demo-live-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  background: rgba(22, 163, 74, 0.16);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.35);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.02em;
  padding: 5px 10px;
  border-radius: 999px;
  white-space: nowrap;
}
.ws-demo-live-badge .dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.25);
  flex-shrink: 0;
}

/* Body: sidebar + main content, container-query responsive */
.ws-demo-body {
  position: relative;
  display: grid;
  grid-template-columns: 216px minmax(0, 1fr);
  min-height: 560px;
  height: min(72vh, 640px);
  background: var(--bg);
}

.ws-demo-toggle {
  display: none;
  align-items: center;
  gap: 8px;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 20;
  padding: 7px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--card);
  color: var(--text);
  font-size: 12px;
  font-weight: 700;
  box-shadow: var(--shadow-card);
  cursor: pointer;
}

.ws-demo-backdrop {
  display: none;
}

.ws-demo-sidebar {
  width: 100%;
  min-width: 0;
  background: var(--card);
  border-right: 1px solid var(--border);
  padding: 16px 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
}

.ws-demo-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ws-demo-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 18px 20px 40px;
  container-type: inline-size;
  container-name: ws;
}
/* Pages render their own .ws-content wrapper (same class the real
   Dashboard pages use) — neutralize its own padding since ws-demo-scroll
   already provides it, so spacing matches the source-of-truth pages
   exactly without doubling up. */
.ws-demo-scroll > .ws-content {
  padding: 0 !important;
}

/* Demo mode watermark strip under the page head, per spec item 10 */
.ws-demo-mode-strip {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--muted);
  background: var(--tone-purple-soft);
  border: 1px dashed rgba(124, 58, 237, 0.35);
  padding: 7px 12px;
  border-radius: 10px;
  margin-bottom: var(--space-5);
}
.ws-demo-mode-strip svg {
  color: var(--brand);
  flex-shrink: 0;
}

/* ── Top bar (search / notifications / profile) ─────────────────────── */
.ws-demo-topbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--card);
  flex-shrink: 0;
}
.ws-demo-topbar-search {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 8px 12px;
}
.ws-demo-topbar-search svg {
  color: var(--muted);
  flex-shrink: 0;
}
.ws-demo-topbar-search input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: var(--text);
  font-family: inherit;
}
.ws-demo-topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  position: relative;
}
.ws-demo-icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  cursor: pointer;
}
.ws-demo-icon-btn:hover {
  background: var(--tone-purple-soft);
  border-color: var(--brand);
  color: var(--brand-deep);
}
.ws-demo-badge-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #ef4444;
  border: 1.5px solid var(--card);
}
.ws-demo-profile-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px 5px 5px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--card);
  cursor: pointer;
  color: var(--text);
  font-size: 12.5px;
  font-weight: 700;
}
.ws-demo-profile-btn:hover {
  border-color: var(--brand);
}

.ws-demo-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 280px;
  max-width: 82vw;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow-dropdown);
  padding: 8px;
  z-index: 40;
  animation: wsDemoDropdownIn 0.14s ease;
}
@keyframes wsDemoDropdownIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.ws-demo-dropdown-head {
  padding: 8px 10px 6px;
  font-size: 12.5px;
  font-weight: 800;
  color: var(--text);
  border-bottom: 1px solid var(--border);
  margin-bottom: 4px;
}
.ws-demo-notif-row {
  display: flex;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 10px;
  cursor: pointer;
  align-items: flex-start;
}
.ws-demo-notif-row:hover {
  background: var(--tone-purple-soft);
}
.ws-demo-notif-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--brand);
  margin-top: 5px;
  flex-shrink: 0;
}
.ws-demo-notif-row p {
  margin: 0;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text);
}
.ws-demo-notif-row span {
  font-size: 11px;
  color: var(--muted);
}
.ws-demo-profile-panel .ws-demo-profile-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px 10px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 6px;
}
.ws-demo-profile-panel .ws-demo-profile-info b {
  display: block;
  font-size: 13px;
  color: var(--text);
}
.ws-demo-profile-panel .ws-demo-profile-info span {
  font-size: 11.5px;
  color: var(--muted);
}
.ws-demo-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
  padding: 9px 10px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: var(--text);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}
.ws-demo-menu-item:hover {
  background: var(--tone-purple-soft);
}
.ws-demo-menu-item svg {
  color: var(--muted);
  flex-shrink: 0;
}

/* Toasts must stay INSIDE the frame, not fixed to the browser viewport */
.ws-demo-scope .toast-stack {
  position: absolute;
  top: auto;
  right: 14px;
  bottom: 14px;
  left: auto;
}

/* ── Container-query responsive collapse ─────────────────────────────
 * Below ~760px of FRAME width (not viewport width) the sidebar goes
 * off-canvas behind a hamburger toggle, same interaction pattern as the
 * original .ws-mobile-toggle / .ws-sidebar-backdrop, just container-driven. */
@container wsdemo (max-width: 760px) {
  .ws-demo-body {
    grid-template-columns: minmax(0, 1fr);
    height: min(78vh, 600px);
  }
  .ws-demo-toggle {
    display: flex;
  }
  .ws-demo-sidebar {
    position: absolute;
    inset: 0 auto 0 0;
    z-index: 25;
    width: 240px;
    max-width: 82vw;
    transform: translateX(-100%);
    transition: transform 0.22s ease;
    box-shadow: var(--shadow-dropdown);
  }
  .ws-demo-sidebar.is-open {
    transform: translateX(0);
  }
  .ws-demo-backdrop {
    display: block;
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.35);
    z-index: 22;
  }
  .ws-demo-main {
    padding-top: 46px;
  }
}

@container wsdemo (max-width: 520px) {
  .ws-demo-topbar-search {
    display: none;
  }
  .ws-demo-titlebar {
    padding: 10px 12px;
  }
  .ws-demo-url span.ws-demo-url-text {
    display: none;
  }
  .ws-demo-scroll {
    padding: 14px 12px 32px;
  }
}

@media (max-width: 640px) {
  .ws-demo-body {
    min-height: 480px;
  }
}

/* ── Local dark mode for the demo shell (Settings → "Dark theme") ────
 * Mirrors the original .workspace-shell.dark variable swap, retargeted
 * at the demo's own wrapper class since the demo does not use (and must
 * not be coupled to) the marketing site's light/dark toggle. */
.ws-demo-scope.ws-demo-dark {
  --bg: #0a0a0a;
  --card: #111111;
  --text: #f5f5f5;
  --muted: #a1a1aa;
  --border: rgba(255, 255, 255, 0.08);

  --tone-purple-soft: rgba(124, 58, 237, 0.18);
  --tone-green-soft: rgba(22, 163, 74, 0.18);
  --tone-amber-soft: rgba(245, 158, 11, 0.18);
  --tone-red-soft: rgba(239, 68, 68, 0.18);
  --tone-blue-soft: rgba(59, 130, 246, 0.18);

  --shadow-card: 0 1px 8px rgba(0, 0, 0, 0.5);
  --shadow-card-hover: 0 8px 32px rgba(0, 0, 0, 0.65);
  --shadow-dropdown: 0 16px 40px rgba(0, 0, 0, 0.7);
  --shadow-toast: 0 8px 32px rgba(0, 0, 0, 0.6), 0 1px 4px rgba(0, 0, 0, 0.3);

  color-scheme: dark;
}
.ws-demo-scope.ws-demo-dark .btn-ghost:hover {
  background: #1a1a1a;
}
.ws-demo-scope.ws-demo-dark .badge.muted {
  background: rgba(255, 255, 255, 0.08);
}

/* Subtle fade when switching demo pages (spec item 15) */
.ws-demo-page-enter {
  animation: wsDemoPageIn 0.18s ease;
}
@keyframes wsDemoPageIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
