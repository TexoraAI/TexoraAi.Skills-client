// import { useState, useEffect, useRef, useCallback } from "react";
// import {
//   ArrowLeft, BookOpen, Calendar, CheckSquare, Clock, Code, Code2,
//   Copy, Download, Edit3, FileText, Folder, Hash, Link, List,
//   ListOrdered, Minus, Plus, Quote, Save, Search, Share2,
//   Strikethrough, Table, Tag, Trash2, X, BookMarked,
//   Bold, Italic, Underline, ChevronRight,
// } from "lucide-react";

// /* ─── Global CSS injection ─── */
// const INJECT_ID = "snb-ilmora-v3";

// const GLOBAL_CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

//   .snb2 *, .snb2 *::before, .snb2 *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   @keyframes snb-fade   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
//   @keyframes snb-pop    { 0%{transform:scale(.94);opacity:0} 100%{transform:scale(1);opacity:1} }
//   @keyframes snb-toast  { from{opacity:0;transform:translateX(-50%) translateY(-8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
//   @keyframes snb-blink  { 0%,100%{opacity:1} 50%{opacity:.25} }
//   @keyframes snb-slide  { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }

//   .snb2-scroll::-webkit-scrollbar { width:4px; height:4px; }
//   .snb2-scroll::-webkit-scrollbar-track { background:transparent; }
//   .snb2-scroll::-webkit-scrollbar-thumb { background:rgba(128,128,128,.2); border-radius:4px; }

//   /* ══════════════════════════════════════
//      CSS VARIABLES — LIGHT (default)
//   ══════════════════════════════════════ */
//   .snb2 {
//     --bg-page:       #f5f7fa;
//     --bg-surface:    #ffffff;
//     --bg-subtle:     #fafbfc;
//     --bg-hover:      rgba(124,58,237,.04);
//     --bg-active:     rgba(124,58,237,.06);
//     --bg-input:      #f8f9fb;
//     --bg-tag-menu:   #ffffff;

//     --border:        #eef0f4;
//     --border-input:  #e2e8f0;
//     --border-focus:  #7c3aed;

//     --text-primary:  #1e293b;
//     --text-secondary:#475569;
//     --text-muted:    #94a3b8;
//     --text-faint:    #c0c8d8;

//     --accent:        #7c3aed;
//     --accent-dark:   #6d28d9;
//     --accent-shadow: rgba(124,58,237,.28);
//     --accent-shadow2:rgba(124,58,237,.35);
//     --accent-bg:     rgba(124,58,237,.06);
//     --accent-bg2:    rgba(124,58,237,.1);
//     --accent-bg3:    rgba(124,58,237,.08);
//     --accent-border: rgba(124,58,237,.15);

//     --pill-bg:       #ffffff;
//     --pill-border:   #eef0f4;
//     --nb-footer-bg:  #fafbfc;
//     --nb-footer-border:#f8f9fb;
//     --add-card-border:#dde1e9;
//     --search-bg:     #f1f5f9;
//     --wc-bg:         #f1f5f9;
//     --toolbar-bg:    #fafbfc;
//     --pg-sidebar-bg: #fafbfc;
//     --toast-bg:      #1e293b;
//     --toast-text:    #f8fafc;

//     --overlay-bg:    rgba(15,23,42,.45);
//     --modal-bg:      #ffffff;

//     --btn-ghost-text:#64748b;
//     --btn-ghost-bdr: #e2e8f0;
//   }

//   /* ══════════════════════════════════════
//      CSS VARIABLES — DARK MODE
//   ══════════════════════════════════════ */
//   .snb2.dark {
//     --bg-page:       #0f1117;
//     --bg-surface:    #1a1d27;
//     --bg-subtle:     #14171f;
//     --bg-hover:      rgba(124,58,237,.08);
//     --bg-active:     rgba(124,58,237,.12);
//     --bg-input:      #1e2130;
//     --bg-tag-menu:   #1e2130;

//     --border:        #252836;
//     --border-input:  #2e3245;
//     --border-focus:  #7c3aed;

//     --text-primary:  #e8eaf0;
//     --text-secondary:#a0a8bf;
//     --text-muted:    #6b7280;
//     --text-faint:    #3d4460;

//     --accent:        #8b5cf6;
//     --accent-dark:   #7c3aed;
//     --accent-shadow: rgba(139,92,246,.3);
//     --accent-shadow2:rgba(139,92,246,.45);
//     --accent-bg:     rgba(139,92,246,.1);
//     --accent-bg2:    rgba(139,92,246,.15);
//     --accent-bg3:    rgba(139,92,246,.08);
//     --accent-border: rgba(139,92,246,.25);

//     --pill-bg:       #1e2130;
//     --pill-border:   #252836;
//     --nb-footer-bg:  #14171f;
//     --nb-footer-border:#252836;
//     --add-card-border:#2e3245;
//     --search-bg:     #1e2130;
//     --wc-bg:         #1e2130;
//     --toolbar-bg:    #14171f;
//     --pg-sidebar-bg: #14171f;
//     --toast-bg:      #e8eaf0;
//     --toast-text:    #0f1117;

//     --overlay-bg:    rgba(0,0,0,.65);
//     --modal-bg:      #1a1d27;

//     --btn-ghost-text:#a0a8bf;
//     --btn-ghost-bdr: #2e3245;
//   }

//   /* ══════════════════════════════════════
//      COMPONENT STYLES (using variables)
//   ══════════════════════════════════════ */

//   .snb2-page {
//     height: 100%; min-height: 100vh;
//     background: var(--bg-page);
//     font-family: 'Poppins', sans-serif;
//     display: flex; flex-direction: column; overflow: hidden;
//     transition: background .25s, color .25s;
//   }

//   .snb2-topbar {
//     display: flex; align-items: center; justify-content: space-between;
//     padding: 0 28px; height: 58px;
//     background: var(--bg-surface);
//     border-bottom: 1px solid var(--border);
//     flex-shrink: 0; gap: 12px;
//     transition: background .25s, border-color .25s;
//   }

//   .snb2-breadcrumb {
//     display: flex; align-items: center; gap: 6px;
//     font-size: 13px; color: var(--text-muted); font-weight: 500;
//   }
//   .snb2-breadcrumb-active { color: var(--text-primary); font-weight: 600; }

//   .snb2-content {
//     flex: 1; overflow-y: auto;
//     padding: 28px 28px 24px;
//     display: flex; flex-direction: column; gap: 20px;
//   }

//   .snb2-section-label {
//     font-size: 10px; font-weight: 700; letter-spacing: .18em;
//     color: var(--accent);
//     display: flex; align-items: center; gap: 6px; margin-bottom: 3px;
//   }
//   .snb2-section-label::before {
//     content:''; width:6px; height:6px; border-radius:50%;
//     background: var(--accent); flex-shrink:0;
//   }
//   .snb2-page-title {
//     font-size: 26px; font-weight: 800; color: var(--text-primary);
//     line-height: 1.15; letter-spacing: -.3px;
//   }
//   .snb2-page-sub {
//     font-size: 13px; color: var(--text-muted);
//     font-weight: 400; margin-top: 3px;
//   }

//   .snb2-stat-pills { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
//   .snb2-stat-pill {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 6px 14px;
//     background: var(--pill-bg);
//     border: 1px solid var(--pill-border);
//     border-radius: 20px; font-size: 12px; font-weight: 600;
//     color: var(--text-secondary); cursor: default;
//     box-shadow: 0 1px 3px rgba(0,0,0,.06);
//     transition: background .25s, border-color .25s, color .25s;
//   }
//   .snb2-stat-pill b { color: var(--accent); }

//   .snb2-btn-primary {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 8px 16px;
//     background: var(--accent); color: #fff;
//     border: none; border-radius: 8px;
//     font-family: 'Poppins', sans-serif;
//     font-size: 12px; font-weight: 700; cursor: pointer;
//     box-shadow: 0 2px 10px var(--accent-shadow);
//     transition: background .15s, box-shadow .15s, transform .12s;
//     white-space: nowrap;
//   }
//   .snb2-btn-primary:hover {
//     background: var(--accent-dark); transform: translateY(-1px);
//     box-shadow: 0 4px 14px var(--accent-shadow2);
//   }
//   .snb2-btn-primary:active { transform: scale(.97); }

//   .snb2-btn-ghost {
//     display: inline-flex; align-items: center; gap: 5px;
//     padding: 7px 13px;
//     background: transparent;
//     border: 1px solid var(--btn-ghost-bdr);
//     border-radius: 8px;
//     font-family: 'Poppins', sans-serif;
//     font-size: 12px; font-weight: 600;
//     color: var(--btn-ghost-text); cursor: pointer;
//     transition: border-color .15s, background .15s, color .15s;
//   }
//   .snb2-btn-ghost:hover { border-color: var(--accent); color: var(--accent); background: var(--bg-hover); }
//   .snb2-btn-ghost:disabled { opacity: .4; cursor: not-allowed; }

//   .snb2-tbtn {
//     width: 28px; height: 28px;
//     display: inline-flex; align-items: center; justify-content: center;
//     border-radius: 6px; border: none; background: transparent;
//     cursor: pointer; color: var(--text-secondary);
//     transition: background .12s, color .12s, transform .1s;
//     flex-shrink: 0; position: relative;
//   }
//   .snb2-tbtn:hover { background: var(--accent-bg2); color: var(--accent); transform: translateY(-1px); }
//   .snb2-tbtn:active { transform: scale(.92); }
//   .snb2-tbtn.active { background: var(--accent-bg2); color: var(--accent); }

//   .snb2-tbtn .tip {
//     position: absolute; bottom: 110%; left: 50%; transform: translateX(-50%);
//     background: var(--text-primary); color: var(--bg-page);
//     font-size: 9px; font-weight: 700; padding: 3px 7px; border-radius: 5px;
//     white-space: nowrap; pointer-events: none; opacity: 0; transition: opacity .15s;
//     font-family: 'Poppins', sans-serif; z-index: 60; letter-spacing: .04em;
//   }
//   .snb2-tbtn:hover .tip { opacity: 1; }

//   .snb2-nb-card {
//     background: var(--bg-surface);
//     border-radius: 14px;
//     border: 1px solid var(--border);
//     overflow: hidden; cursor: pointer;
//     transition: box-shadow .2s, transform .2s, background .25s, border-color .25s;
//     display: flex; flex-direction: column;
//     animation: snb-fade .3s ease both;
//   }
//   .snb2-nb-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,.14); }
//   .snb2-nb-card-stripe { height: 4px; flex-shrink: 0; }
//   .snb2-nb-card-body { padding: 16px 16px 14px; flex: 1; }
//   .snb2-nb-card-icon {
//     width: 36px; height: 36px; border-radius: 10px;
//     display: flex; align-items: center; justify-content: center; margin-bottom: 12px;
//   }
//   .snb2-nb-card-name { font-size: 14px; font-weight: 700; color: var(--text-primary); line-height: 1.3; margin-bottom: 4px; }
//   .snb2-nb-card-meta { font-size: 11px; color: var(--text-muted); font-weight: 400; }
//   .snb2-nb-card-footer {
//     display: flex; align-items: center; justify-content: space-between;
//     padding: 9px 16px;
//     border-top: 1px solid var(--nb-footer-border);
//     background: var(--nb-footer-bg);
//     transition: background .25s, border-color .25s;
//   }

//   .snb2-add-card {
//     background: var(--bg-surface);
//     border-radius: 14px;
//     border: 2px dashed var(--add-card-border);
//     display: flex; flex-direction: column;
//     align-items: center; justify-content: center;
//     gap: 6px; cursor: pointer; min-height: 140px;
//     transition: border-color .2s, background .2s;
//   }
//   .snb2-add-card:hover { border-color: var(--accent); background: var(--bg-hover); }
//   .snb2-add-card span { font-size: 11px; font-weight: 600; color: var(--text-muted); }
//   .snb2-add-card:hover span { color: var(--accent); }

//   .snb2-search-bar {
//     display: flex; align-items: center; gap: 8px;
//     padding: 8px 12px;
//     background: var(--search-bg);
//     border: 1px solid var(--border-input); border-radius: 10px;
//     flex: 1; max-width: 320px;
//     transition: background .25s, border-color .25s;
//   }
//   .snb2-search-bar input {
//     border: none; outline: none; background: transparent;
//     font-family: 'Poppins', sans-serif; font-size: 12px; color: var(--text-primary); flex: 1;
//   }
//   .snb2-search-bar input::placeholder { color: var(--text-muted); }

//   .snb2-search-results {
//     position: absolute; top: 100%; left: 0; right: 0; z-index: 40;
//     background: var(--modal-bg); border: 1px solid var(--border-input);
//     border-radius: 10px; overflow: hidden;
//     box-shadow: 0 8px 24px rgba(0,0,0,.18);
//     margin-top: 4px; animation: snb-pop .15s ease;
//   }
//   .snb2-search-result-item {
//     display: flex; align-items: center; gap: 10px;
//     padding: 10px 14px;
//     background: transparent; border: none; border-bottom: 1px solid var(--border);
//     width: 100%; cursor: pointer;
//     transition: background .12s; text-align: left;
//   }
//   .snb2-search-result-item:hover { background: var(--bg-hover); }
//   .snb2-search-result-item:last-child { border-bottom: none; }

//   .snb2-sec-tabs {
//     display: flex; align-items: flex-end; gap: 0;
//     border-bottom: 1px solid var(--border);
//     background: var(--bg-surface);
//     padding: 0 14px; overflow-x: auto; flex-shrink: 0;
//     transition: background .25s, border-color .25s;
//   }
//   .snb2-sec-tab {
//     display: inline-flex; align-items: center; gap: 5px;
//     padding: 10px 14px; border: none; border-bottom: 2px solid transparent;
//     background: transparent; cursor: pointer;
//     font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 500;
//     color: var(--text-muted); transition: color .13s, border-color .13s;
//     white-space: nowrap; margin-bottom: -1px;
//   }
//   .snb2-sec-tab.active { font-weight: 700; }
//   .snb2-sec-tab:hover:not(.active) { color: var(--text-secondary); }

//   .snb2-pg-sidebar {
//     width: 130px; flex-shrink: 0;
//     border-right: 1px solid var(--border);
//     background: var(--pg-sidebar-bg);
//     overflow-y: auto; padding: 6px 0;
//     transition: background .25s, border-color .25s;
//   }
//   .snb2-pg-item {
//     display: flex; align-items: center; gap: 6px;
//     padding: 7px 12px; cursor: pointer;
//     border: none; width: 100%; text-align: left;
//     background: transparent;
//     font-family: 'Poppins', sans-serif; font-size: 11px;
//     color: var(--text-muted); font-weight: 400;
//     border-left: 2px solid transparent;
//     transition: background .12s, color .12s;
//   }
//   .snb2-pg-item:hover { background: var(--bg-hover); color: var(--text-secondary); }
//   .snb2-pg-item.active { background: var(--bg-active); color: var(--text-primary); font-weight: 600; border-left-color: var(--accent); }

//   .snb2-editor-page {
//     height: 100%; min-height: 100vh;
//     background: var(--bg-page);
//     font-family: 'Poppins', sans-serif;
//     display: flex; flex-direction: column; overflow: hidden;
//     transition: background .25s;
//   }
//   .snb2-editor-body {
//     flex: 1; display: flex; overflow: hidden;
//     background: var(--bg-surface);
//     transition: background .25s;
//   }

//   .snb2-editor-panel {
//     flex: 1; min-width: 0;
//     display: flex; flex-direction: column; overflow: hidden;
//   }
//   .snb2-page-title-row {
//     padding: 14px 20px 10px;
//     border-bottom: 1px solid var(--border); flex-shrink: 0;
//     transition: border-color .25s;
//   }
//   .snb2-page-title-inp {
//     border: none; outline: none; width: 100%;
//     font-family: 'Poppins', sans-serif;
//     font-size: 16px; font-weight: 700; color: var(--text-primary);
//     background: transparent; padding: 0;
//   }
//   .snb2-page-title-inp::placeholder { color: var(--text-faint); }
//   .snb2-page-date {
//     font-size: 10px; color: var(--text-faint); margin-top: 3px;
//     display: flex; align-items: center; gap: 4px;
//   }

//   .snb2-toolbar {
//     display: flex; align-items: center; gap: 2px;
//     padding: 6px 12px; flex-wrap: wrap; flex-shrink: 0;
//     background: var(--toolbar-bg);
//     border-bottom: 1px solid var(--border);
//     transition: background .25s, border-color .25s;
//   }
//   .snb2-toolbar-sep { width: 1px; height: 18px; background: var(--border-input); margin: 0 3px; flex-shrink: 0; }
//   .snb2-hdg-sel {
//     height: 26px; padding: 0 6px; border-radius: 6px;
//     border: 1px solid var(--border-input);
//     background: var(--search-bg);
//     font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600;
//     color: var(--text-secondary); cursor: pointer; outline: none;
//     transition: background .25s, border-color .25s, color .25s;
//   }

//   .snb2-ta {
//     flex: 1; width: 100%; resize: none; border: none; outline: none;
//     font-family: 'Poppins', sans-serif; font-size: 13.5px;
//     line-height: 1.9; color: var(--text-secondary);
//     background: transparent;
//     padding: 16px 20px; letter-spacing: .01em;
//     transition: color .25s;
//   }
//   .snb2-ta::placeholder { color: var(--text-faint); font-style: italic; }

//   .snb2-editor-footer {
//     display: flex; align-items: center; justify-content: space-between;
//     padding: 9px 18px;
//     border-top: 1px solid var(--border);
//     background: var(--toolbar-bg); flex-shrink: 0;
//     transition: background .25s, border-color .25s;
//   }
//   .snb2-wc-badge {
//     display: inline-flex; align-items: center;
//     padding: 3px 9px; border-radius: 12px;
//     background: var(--wc-bg); border: 1px solid var(--border-input);
//     font-size: 10px; font-weight: 600; color: var(--text-muted);
//     transition: background .25s, border-color .25s, color .25s;
//   }

//   .snb2-status {
//     display: flex; align-items: center; gap: 5px;
//     padding: 4px 10px; border-radius: 14px;
//     background: var(--wc-bg); border: 1px solid var(--border-input);
//     transition: background .25s, border-color .25s;
//   }
//   .snb2-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; }
//   .snb2-status-dot.saving { animation: snb-blink .8s infinite; background: #f59e0b; }
//   .snb2-status-text { font-size: 10px; font-weight: 600; color: var(--text-muted); }

//   .snb2-overlay {
//     position: fixed; inset: 0; z-index: 999;
//     background: var(--overlay-bg);
//     display: flex; align-items: center; justify-content: center;
//     animation: snb-fade .15s ease;
//   }
//   .snb2-modal {
//     background: var(--modal-bg); border-radius: 16px;
//     padding: 24px; width: 300px;
//     box-shadow: 0 20px 60px rgba(0,0,0,.3);
//     animation: snb-pop .2s ease;
//     font-family: 'Poppins', sans-serif;
//     border: 1px solid var(--border);
//     transition: background .25s, border-color .25s;
//   }
//   .snb2-modal-title {
//     font-size: 15px; font-weight: 700; color: var(--text-primary);
//     margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
//   }
//   .snb2-inp {
//     width: 100%; padding: 9px 12px;
//     border: 1px solid var(--border-input); border-radius: 9px;
//     font-family: 'Poppins', sans-serif; font-size: 13px;
//     color: var(--text-primary); background: var(--bg-input); outline: none;
//     transition: border-color .2s, box-shadow .2s, background .25s, color .25s;
//     display: block;
//   }
//   .snb2-inp:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px var(--accent-bg); background: var(--bg-surface); }
//   .snb2-color-label {
//     font-size: 10px; font-weight: 700; letter-spacing: .1em; color: var(--text-muted);
//     margin: 12px 0 7px; text-transform: uppercase;
//   }
//   .snb2-modal-actions { display: flex; gap: 8px; margin-top: 16px; }
//   .snb2-cancel-btn {
//     flex: 1; padding: 8px; border-radius: 8px;
//     border: 1px solid var(--border-input); background: transparent;
//     font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600;
//     color: var(--text-secondary); cursor: pointer;
//     transition: border-color .15s, color .25s;
//   }
//   .snb2-cancel-btn:hover { border-color: var(--text-muted); }

//   .snb2-tag-menu {
//     position: absolute; top: 110%; left: 0; z-index: 50;
//     background: var(--bg-tag-menu); border: 1px solid var(--border-input);
//     border-radius: 12px; padding: 8px;
//     width: 160px; box-shadow: 0 8px 24px rgba(0,0,0,.18);
//     animation: snb-pop .15s ease;
//     transition: background .25s, border-color .25s;
//   }
//   .snb2-tag-opt {
//     display: flex; align-items: center; gap: 7px;
//     width: 100%; border: none; background: transparent;
//     padding: 6px 8px; border-radius: 7px; cursor: pointer;
//     font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600;
//     transition: background .12s; text-align: left;
//   }

//   .snb2-toast {
//     position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
//     background: var(--toast-bg); color: var(--toast-text);
//     font-size: 12px; font-weight: 600;
//     padding: 8px 18px; border-radius: 20px; z-index: 9999;
//     box-shadow: 0 4px 20px rgba(0,0,0,.2);
//     animation: snb-toast .2s ease;
//     white-space: nowrap; font-family: 'Poppins', sans-serif;
//   }

//   .snb2-back-btn {
//     display: flex; align-items: center; gap: 6px;
//     padding: 6px 12px; border-radius: 8px;
//     border: 1px solid var(--border-input);
//     background: var(--bg-surface); cursor: pointer;
//     color: var(--btn-ghost-text);
//     font-family: 'Poppins',sans-serif; font-size: 12px; font-weight: 600;
//     transition: border-color .15s, background .25s, color .25s;
//   }
//   .snb2-back-btn:hover { border-color: var(--accent); color: var(--accent); }

//   .snb2-del-btn {
//     background: transparent; border: none; cursor: pointer;
//     color: var(--text-faint); padding: 4px; border-radius: 6px;
//     display: flex; transition: color .15s;
//   }
//   .snb2-del-btn:hover { color: #ef4444; }

//   .snb2-sect-del {
//     background: transparent; border: none; cursor: pointer;
//     color: var(--text-faint); display: flex; padding: 0 2px;
//   }
//   .snb2-sect-del:hover { color: #ef4444; }
// `;

// const injectCSS = () => {
//   if (document.getElementById(INJECT_ID)) return;
//   const el = document.createElement("style");
//   el.id = INJECT_ID; el.textContent = GLOBAL_CSS;
//   document.head.appendChild(el);
// };

// /* ─── Helpers ─── */
// const uid    = () => `${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
// const mkPage = (title="Page 1", content="") => ({ id:uid(), title, content, createdAt:new Date().toISOString() });
// const mkSect = (title, color, pages) => ({ id:uid(), title, color, pages: pages ?? [mkPage()] });
// const mkNB   = (title, color, sections) => ({ id:uid(), title, color, sections: sections ?? [mkSect("General",color)] });

// const NB_COLORS  = ["#7c3aed","#2563eb","#0891b2","#059669","#d97706","#dc2626","#db2777","#9333ea"];
// const SEC_COLORS = ["#7c3aed","#2563eb","#0891b2","#059669","#d97706","#dc2626","#db2777","#16a34a"];
// const TAG_OPTIONS = [
//   { label:"Important",  icon:"⭐", color:"#f59e0b", bg:"rgba(245,158,11,.12)"  },
//   { label:"Question",   icon:"❓", color:"#3b82f6", bg:"rgba(59,130,246,.12)"  },
//   { label:"To Do",      icon:"✅", color:"#22c55e", bg:"rgba(34,197,94,.12)"   },
//   { label:"Idea",       icon:"💡", color:"#a855f7", bg:"rgba(168,85,247,.12)"  },
//   { label:"Remember",   icon:"🔖", color:"#ef4444", bg:"rgba(239,68,68,.12)"   },
//   { label:"Definition", icon:"📌", color:"#0891b2", bg:"rgba(8,145,178,.12)"   },
// ];

// const DEFAULT_NBS = [
//   mkNB("My Lecture Notes","#7c3aed",[
//     mkSect("Chapter 1","#2563eb",[mkPage("Overview","# Overview\n\nStart writing your lecture notes here…"),mkPage("Key Points")]),
//     mkSect("Chapter 2","#0891b2",[mkPage("Summary")]),
//   ]),
//   mkNB("Assignments","#059669"),
//   mkNB("Quick Notes","#d97706"),
// ];

// const LS_KEY  = "snb_ilmora_v3";
// const loadNBs = () => { try{ const d=localStorage.getItem(LS_KEY); return d?JSON.parse(d):DEFAULT_NBS; }catch{ return DEFAULT_NBS; } };
// const saveNBs = (nbs) => { try{ localStorage.setItem(LS_KEY,JSON.stringify(nbs)); }catch{} };

// /* ─── Detect dark mode from DOM (sidebar controls it) ─── */
// const detectDark = () => {
//   if (document.documentElement.classList.contains("dark")) return true;
//   if (document.body.classList.contains("dark")) return true;
//   const theme = document.documentElement.getAttribute("data-theme") || document.body.getAttribute("data-theme");
//   if (theme === "dark") return true;
//   const hasLight =
//     document.documentElement.classList.contains("light") ||
//     document.body.classList.contains("light") ||
//     document.documentElement.getAttribute("data-theme") === "light";
//   if (hasLight) return false;
//   return window.matchMedia("(prefers-color-scheme: dark)").matches;
// };

// /* ─── Editor helpers ─── */
// function toggleInline(ta, marker, val, set) {
//   const s=ta.selectionStart,e=ta.selectionEnd,sel=val.slice(s,e),m=marker.length;
//   if(val.slice(s-m,s)===marker&&val.slice(e,e+m)===marker){
//     const n=val.slice(0,s-m)+sel+val.slice(e+m); set(n);
//     requestAnimationFrame(()=>{ ta.selectionStart=s-m; ta.selectionEnd=e-m; ta.focus(); }); return;
//   }
//   const n=val.slice(0,s)+marker+sel+marker+val.slice(e); set(n);
//   requestAnimationFrame(()=>{ ta.selectionStart=s+m; ta.selectionEnd=e+m; ta.focus(); });
// }
// function togglePrefix(ta, pfx, val, set) {
//   const s=ta.selectionStart,e=ta.selectionEnd;
//   const ls=val.slice(0,s).lastIndexOf("\n")+1;
//   const block=val.slice(ls,e),lines=block.split("\n");
//   const all=lines.every(l=>l.startsWith(pfx));
//   const nb=lines.map(l=>all?l.slice(pfx.length):(l.startsWith(pfx)?l:pfx+l)).join("\n");
//   const diff=nb.length-block.length; set(val.slice(0,ls)+nb+val.slice(e));
//   requestAnimationFrame(()=>{ ta.selectionStart=ls; ta.selectionEnd=e+diff; ta.focus(); });
// }
// function applyHeading(ta, pfx, val, set) {
//   const HR=/^(#{1,6} )/,s=ta.selectionStart,e=ta.selectionEnd;
//   const ls=val.slice(0,s).lastIndexOf("\n")+1;
//   const block=val.slice(ls,e);
//   const nb=block.split("\n").map(l=>{const st=l.replace(HR,""); return pfx?pfx+st:st;}).join("\n");
//   const diff=nb.length-block.length; set(val.slice(0,ls)+nb+val.slice(e));
//   requestAnimationFrame(()=>{ ta.selectionStart=s+diff; ta.selectionEnd=e+diff; ta.focus(); });
// }
// function insertAt(ta, text, val, set) {
//   const s=ta.selectionStart; set(val.slice(0,s)+text+val.slice(s));
//   requestAnimationFrame(()=>{ ta.selectionStart=ta.selectionEnd=s+text.length; ta.focus(); });
// }
// function insertLink(ta, val, set) {
//   const s=ta.selectionStart,e=ta.selectionEnd,sel=val.slice(s,e)||"Link Text";
//   const lnk=`[${sel}](https://)`; set(val.slice(0,s)+lnk+val.slice(e));
//   requestAnimationFrame(()=>{ ta.selectionStart=s; ta.selectionEnd=s+lnk.length; ta.focus(); });
// }
// function numberedList(ta, val, set) {
//   const s=ta.selectionStart,e=ta.selectionEnd;
//   const ls=val.slice(0,s).lastIndexOf("\n")+1;
//   const block=val.slice(ls,e),lines=block.split("\n");
//   const all=lines.every(l=>/^\d+\. /.test(l));
//   const nb=lines.map((l,i)=>all?l.replace(/^\d+\. /,""):/^\d+\. /.test(l)?l:`${i+1}. ${l}`).join("\n");
//   const diff=nb.length-block.length; set(val.slice(0,ls)+nb+val.slice(e));
//   requestAnimationFrame(()=>{ ta.selectionStart=ls; ta.selectionEnd=e+diff; ta.focus(); });
// }

// /* ─── Toast hook ─── */
// function useToast() {
//   const [toast, setToast] = useState(null);
//   const tmr = useRef(null);
//   const show = useCallback((msg) => {
//     clearTimeout(tmr.current);
//     setToast({ msg, key: Date.now() });
//     tmr.current = setTimeout(() => setToast(null), 2400);
//   }, []);
//   return [toast, show];
// }

// /* ═══════════════════════════════════════
//    MAIN COMPONENT
//    isDark prop: passed from sidebar/parent (true = dark, false = light)
//    If not passed, auto-detects from DOM (sidebar dark class)
// ═══════════════════════════════════════ */
// const StudentNotebook = ({ lectureId="default", lectureTitle="Current Lecture", isDark: isDarkProp }) => {
//   useEffect(() => { injectCSS(); }, []);

//   /* ── Dark mode: controlled by sidebar prop, synced from DOM ── */
//   const [isDark, setIsDark] = useState(() => {
//     if (isDarkProp !== undefined) return isDarkProp;
//     return detectDark();
//   });

//   /* Sync from sidebar DOM changes (sidebar toggles dark class on html/body) */
//   useEffect(() => {
//     const sync = () => setIsDark(detectDark());
//     sync();
//     const obs = new MutationObserver(sync);
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
//     obs.observe(document.body, { attributes: true, attributeFilter: ["class", "data-theme"] });
//     const mq = window.matchMedia("(prefers-color-scheme: dark)");
//     mq.addEventListener("change", sync);
//     return () => { obs.disconnect(); mq.removeEventListener("change", sync); };
//   }, []);

//   /* Also respect explicit prop updates from parent */
//   useEffect(() => {
//     if (isDarkProp !== undefined) setIsDark(isDarkProp);
//   }, [isDarkProp]);

//   const [notebooks,    setNotebooks]    = useState(loadNBs);
//   const [activeNBId,   setActiveNBId]   = useState(() => loadNBs()[0]?.id ?? null);
//   const [activeSectId, setActiveSectId] = useState(null);
//   const [activePageId, setActivePageId] = useState(null);
//   const [view,         setView]         = useState("notebooks");

//   const [localText, setLocalText] = useState("");
//   const localRef   = useRef("");
//   const flushRef   = useRef(null);
//   const taRef      = useRef(null);

//   const [searchQ,          setSearchQ]          = useState("");
//   const [showSearch,       setShowSearch]        = useState(false);
//   const [showTagMenu,      setShowTagMenu]       = useState(false);
//   const [showShareModal,   setShowShareModal]    = useState(false);
//   const [showNewNBModal,   setShowNewNBModal]    = useState(false);
//   const [showNewSectModal, setShowNewSectModal]  = useState(false);
//   const [showNewPageModal, setShowNewPageModal]  = useState(false);
//   const [newTitle,   setNewTitle]   = useState("");
//   const [newColor,   setNewColor]   = useState(NB_COLORS[0]);
//   const [shareEmail, setShareEmail] = useState("");
//   const [saving,     setSaving]     = useState(false);
//   const [toast,      showToast]     = useToast();

//   const activeNB   = notebooks.find(n => n.id === activeNBId);
//   const activeSect = activeNB?.sections.find(s => s.id === activeSectId) ?? activeNB?.sections[0];
//   const activePage = activeSect?.pages.find(p => p.id === activePageId) ?? activeSect?.pages[0];

//   useEffect(() => {
//     const v = activePage?.content ?? "";
//     setLocalText(v); localRef.current = v;
//   }, [activePageId, activeSectId, activeNBId]);

//   useEffect(() => {
//     if (activeNB) {
//       setActiveSectId(activeNB.sections[0]?.id ?? null);
//       setActivePageId(activeNB.sections[0]?.pages[0]?.id ?? null);
//     }
//   }, [activeNBId]);
//   useEffect(() => {
//     if (activeSect) setActivePageId(activeSect.pages[0]?.id ?? null);
//   }, [activeSectId]);

//   useEffect(() => { saveNBs(notebooks); }, [notebooks]);
//   useEffect(() => () => clearTimeout(flushRef.current), []);

//   const handleChange = useCallback((e) => {
//     const v = e.target.value;
//     setLocalText(v); localRef.current = v;
//     setSaving(true);
//     clearTimeout(flushRef.current);
//     flushRef.current = setTimeout(() => {
//       const txt = localRef.current;
//       setNotebooks(nbs => nbs.map(nb => nb.id !== activeNBId ? nb : {
//         ...nb, sections: nb.sections.map(s => s.id !== activeSect?.id ? s : {
//           ...s, pages: s.pages.map(p => p.id !== activePage?.id ? p : { ...p, content: txt })
//         })
//       }));
//       setSaving(false);
//     }, 900);
//   }, [activeNBId, activeSect?.id, activePage?.id]);

//   const doSave = () => {
//     clearTimeout(flushRef.current);
//     const txt = localRef.current;
//     setNotebooks(nbs => nbs.map(nb => nb.id !== activeNBId ? nb : {
//       ...nb, sections: nb.sections.map(s => s.id !== activeSect?.id ? s : {
//         ...s, pages: s.pages.map(p => p.id !== activePage?.id ? p : { ...p, content: txt })
//       })
//     }));
//     setSaving(false); showToast("Notes saved ✓");
//   };

//   const ta  = () => taRef.current;
//   const upd = (v) => { setLocalText(v); localRef.current = v; };

//   const bold   = () => ta() && toggleInline(ta(), "**", localText, upd);
//   const italic = () => ta() && toggleInline(ta(), "_",  localText, upd);
//   const under  = () => ta() && toggleInline(ta(), "__", localText, upd);
//   const strike = () => ta() && toggleInline(ta(), "~~", localText, upd);
//   const icode  = () => ta() && toggleInline(ta(), "`",  localText, upd);
//   const blist  = () => ta() && togglePrefix(ta(), "• ", localText, upd);
//   const nlist  = () => ta() && numberedList(ta(), localText, upd);
//   const bq     = () => ta() && togglePrefix(ta(), "> ", localText, upd);
//   const cblk   = () => ta() && togglePrefix(ta(), "    ", localText, upd);
//   const hRule  = () => ta() && insertAt(ta(), "\n---\n", localText, upd);
//   const chkbox = () => ta() && insertAt(ta(), "☐ ", localText, upd);
//   const tbl    = () => ta() && insertAt(ta(), "\n| Col 1 | Col 2 | Col 3 |\n|-------|-------|-------|\n| Cell  | Cell  | Cell  |\n", localText, upd);
//   const lnk    = () => ta() && insertLink(ta(), localText, upd);
//   const dstamp = () => ta() && insertAt(ta(), `📅 ${new Date().toLocaleDateString("en-IN",{weekday:"short",year:"numeric",month:"short",day:"numeric"})}\n`, localText, upd);
//   const onHdg  = (e) => { ta() && applyHeading(ta(), e.target.value, localText, upd); requestAnimationFrame(() => { e.target.value = ""; }); };
//   const inTag  = (tag) => { ta() && insertAt(ta(), `[${tag.icon} ${tag.label}] `, localText, upd); setShowTagMenu(false); };

//   const addNB = () => {
//     if (!newTitle.trim()) return;
//     const nb = mkNB(newTitle.trim(), newColor);
//     setNotebooks(n => [...n, nb]); setActiveNBId(nb.id); setView("editor");
//     setShowNewNBModal(false); setNewTitle(""); setNewColor(NB_COLORS[0]);
//     showToast(`"${nb.title}" created`);
//   };
//   const delNB = (id) => {
//     if (notebooks.length <= 1) { showToast("Can't delete last notebook"); return; }
//     if (!window.confirm("Delete this notebook?")) return;
//     const nbs = notebooks.filter(n => n.id !== id); setNotebooks(nbs); setActiveNBId(nbs[0].id); showToast("Notebook deleted");
//   };
//   const addSect = () => {
//     if (!newTitle.trim() || !activeNB) return;
//     const s = mkSect(newTitle.trim(), newColor);
//     setNotebooks(nbs => nbs.map(nb => nb.id !== activeNBId ? nb : { ...nb, sections: [...nb.sections, s] }));
//     setActiveSectId(s.id); setShowNewSectModal(false); setNewTitle(""); setNewColor(SEC_COLORS[0]); showToast("Section created");
//   };
//   const delSect = (id) => {
//     if ((activeNB?.sections.length ?? 0) <= 1) { showToast("Can't delete last section"); return; }
//     if (!window.confirm("Delete section?")) return;
//     setNotebooks(nbs => nbs.map(nb => nb.id !== activeNBId ? nb : { ...nb, sections: nb.sections.filter(s => s.id !== id) })); showToast("Deleted");
//   };
//   const addPg = () => {
//     if (!activeSect) return;
//     const p = mkPage(newTitle.trim() || `Page ${activeSect.pages.length + 1}`);
//     setNotebooks(nbs => nbs.map(nb => nb.id !== activeNBId ? nb : {
//       ...nb, sections: nb.sections.map(s => s.id !== activeSect.id ? s : { ...s, pages: [...s.pages, p] })
//     }));
//     setActivePageId(p.id); setShowNewPageModal(false); setNewTitle(""); showToast("Page added");
//   };
//   const delPg = (id) => {
//     if ((activeSect?.pages.length ?? 0) <= 1) { showToast("Can't delete last page"); return; }
//     if (!window.confirm("Delete page?")) return;
//     setNotebooks(nbs => nbs.map(nb => nb.id !== activeNBId ? nb : {
//       ...nb, sections: nb.sections.map(s => s.id !== activeSect?.id ? s : { ...s, pages: s.pages.filter(p => p.id !== id) })
//     })); showToast("Deleted");
//   };
//   const renPg = (id) => {
//     const t = window.prompt("Rename:", activeSect?.pages.find(p => p.id === id)?.title ?? "");
//     if (!t?.trim()) return;
//     setNotebooks(nbs => nbs.map(nb => nb.id !== activeNBId ? nb : {
//       ...nb, sections: nb.sections.map(s => s.id !== activeSect?.id ? s : {
//         ...s, pages: s.pages.map(p => p.id !== id ? p : { ...p, title: t.trim() })
//       })
//     })); showToast("Renamed");
//   };
//   const doClear = () => {
//     if (!localText.trim()) return;
//     if (!window.confirm("Clear page content?")) return;
//     upd("");
//     setNotebooks(nbs => nbs.map(nb => nb.id !== activeNBId ? nb : {
//       ...nb, sections: nb.sections.map(s => s.id !== activeSect?.id ? s : {
//         ...s, pages: s.pages.map(p => p.id !== activePage?.id ? p : { ...p, content: "" })
//       })
//     })); showToast("Cleared");
//   };
//   const doExport = () => {
//     const b = new Blob([localText], { type: "text/plain" });
//     const u = URL.createObjectURL(b);
//     const a = document.createElement("a"); a.href = u; a.download = `${activePage?.title ?? "notes"}.md`; a.click();
//     URL.revokeObjectURL(u); showToast("Exported as .md");
//   };
//   const doCopy = () => { navigator.clipboard.writeText(localText).then(() => showToast("Copied to clipboard")); };
//   const doShare = () => {
//     if (!shareEmail.trim()) return;
//     showToast(`Shared with ${shareEmail}`); setShareEmail(""); setShowShareModal(false);
//   };

//   const searchRes = searchQ.length > 1
//     ? notebooks.flatMap(nb => nb.sections.flatMap(s =>
//         s.pages.filter(p =>
//           p.title.toLowerCase().includes(searchQ.toLowerCase()) ||
//           p.content.toLowerCase().includes(searchQ.toLowerCase())
//         ).map(p => ({ nb, section: s, page: p }))
//       ))
//     : [];

//   const wc = localText.trim() ? localText.trim().split(/\s+/).length : 0;
//   const cc = localText.length;
//   const totalSects = notebooks.reduce((a, nb) => a + nb.sections.length, 0);
//   const totalPgs   = notebooks.reduce((a, nb) => a + nb.sections.reduce((b, s) => b + s.pages.length, 0), 0);

//   /* ── Root class: dark applied when isDark is true ── */
//   const dm = isDark ? "snb2 dark" : "snb2";

//   /* ── Shared toolbar button ── */
//   const TBtn = ({ icon: Icon, tip, onClick, active = false, sz = 14 }) => (
//     <button className={`snb2-tbtn${active ? " active" : ""}`} onClick={onClick}>
//       <Icon size={sz} strokeWidth={2.2} />
//       {tip && <span className="tip">{tip}</span>}
//     </button>
//   );

//   /* ── Color picker row ── */
//   const ColorPicker = ({ colors, selected, onSelect }) => (
//     <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
//       {colors.map(c => (
//         <button key={c} onClick={() => onSelect(c)} style={{
//           width: 22, height: 22, borderRadius: 6, background: c, border: "none",
//           cursor: "pointer",
//           outline: selected === c ? `2px solid ${c}` : "none",
//           outlineOffset: 2,
//           boxShadow: selected === c ? `0 0 0 3px ${isDark ? "#1a1d27" : "white"}, 0 0 0 5px ${c}` : "none",
//           transition: "box-shadow .15s",
//         }} />
//       ))}
//     </div>
//   );

//   /* ════════════════════════════
//      NOTEBOOKS VIEW
//   ════════════════════════════ */
//   if (view === "notebooks") return (
//     <div className={`${dm} snb2-page`}>
//       {toast && <div key={toast.key} className="snb2-toast">{toast.msg}</div>}

//       {/* ── Top bar ── */}
//       <div className="snb2-topbar">
//         <div className="snb2-breadcrumb">
//           <BookMarked size={14} color="var(--accent)" strokeWidth={2.2} />
//           <span>Learning Materials</span>
//           <ChevronRight size={12} strokeWidth={2} />
//           <span className="snb2-breadcrumb-active">Notebook</span>
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           {/* Search inline */}
//           <div style={{ position: "relative" }}>
//             <div className="snb2-search-bar" style={{ maxWidth: 220 }}>
//               <Search size={13} color="var(--text-muted)" strokeWidth={2} />
//               <input
//                 placeholder="Search notes…"
//                 value={searchQ}
//                 onChange={e => setSearchQ(e.target.value)}
//                 onFocus={() => setShowSearch(true)}
//                 onBlur={() => setTimeout(() => setShowSearch(false), 200)}
//               />
//               {searchQ && (
//                 <button onClick={() => setSearchQ("")} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
//                   <X size={12} />
//                 </button>
//               )}
//             </div>
//             {showSearch && searchRes.length > 0 && (
//               <div className="snb2-search-results">
//                 {searchRes.slice(0, 5).map(({ nb, section, page }) => (
//                   <button key={page.id} className="snb2-search-result-item" onMouseDown={() => {
//                     setActiveNBId(nb.id); setActiveSectId(section.id); setActivePageId(page.id);
//                     setView("editor"); setSearchQ(""); setShowSearch(false);
//                   }}>
//                     <div style={{ width: 28, height: 28, borderRadius: 7, background: `${nb.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                       <FileText size={12} color={nb.color} strokeWidth={2} />
//                     </div>
//                     <div>
//                       <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{page.title}</div>
//                       <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{nb.title} › {section.title}</div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             )}
//             {showSearch && searchQ.length > 1 && searchRes.length === 0 && (
//               <div className="snb2-search-results" style={{ padding: "12px 14px" }}>
//                 <span style={{ fontSize: 12, color: "var(--text-muted)" }}>No results found.</span>
//               </div>
//             )}
//           </div>

//           <button className="snb2-btn-primary" onClick={() => { setNewTitle(""); setNewColor(NB_COLORS[0]); setShowNewNBModal(true); }}>
//             <Plus size={13} strokeWidth={2.5} /> New Notebook
//           </button>
//         </div>
//       </div>

//       {/* ── Content ── */}
//       <div className="snb2-content snb2-scroll">
//         {/* Page heading */}
//         <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
//           <div>
//             <div className="snb2-section-label">STUDENT NOTEBOOK</div>
//             <h1 className="snb2-page-title">My Notebooks</h1>
//             <p className="snb2-page-sub">Your classroom &amp; note-taking workspace</p>
//           </div>
//           {/* Stat pills */}
//           <div className="snb2-stat-pills">
//             <div className="snb2-stat-pill">
//               <BookOpen size={12} color="var(--accent)" strokeWidth={2.2} />
//               <b>{notebooks.length}</b> Notebooks
//             </div>
//             <div className="snb2-stat-pill">
//               <Folder size={12} color="var(--accent)" strokeWidth={2.2} />
//               <b>{totalSects}</b> Sections
//             </div>
//             <div className="snb2-stat-pill">
//               <FileText size={12} color="var(--accent)" strokeWidth={2.2} />
//               <b>{totalPgs}</b> Pages
//             </div>
//           </div>
//         </div>

//         {/* Card grid */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
//           {notebooks.map((nb, idx) => (
//             <div
//               key={nb.id} className="snb2-nb-card"
//               style={{ animationDelay: `${idx * 0.05}s` }}
//               onClick={() => { setActiveNBId(nb.id); setView("editor"); }}
//             >
//               <div className="snb2-nb-card-stripe" style={{ background: nb.color }} />
//               <div className="snb2-nb-card-body">
//                 <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
//                   <div className="snb2-nb-card-icon" style={{ background: `${nb.color}20` }}>
//                     <BookOpen size={16} color={nb.color} strokeWidth={2.2} />
//                   </div>
//                   <button
//                     className="snb2-del-btn"
//                     onClick={e => { e.stopPropagation(); delNB(nb.id); }}
//                   >
//                     <Trash2 size={13} strokeWidth={2} />
//                   </button>
//                 </div>
//                 <p className="snb2-nb-card-name">{nb.title}</p>
//                 <p className="snb2-nb-card-meta">
//                   {nb.sections.length} section{nb.sections.length !== 1 ? "s" : ""} · {nb.sections.reduce((a, s) => a + s.pages.length, 0)} page{nb.sections.reduce((a, s) => a + s.pages.length, 0) !== 1 ? "s" : ""}
//                 </p>
//               </div>
//               <div className="snb2-nb-card-footer">
//                 <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//                   <div style={{ width: 5, height: 5, borderRadius: "50%", background: nb.color }} />
//                   <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>Active</span>
//                 </div>
//                 <ChevronRight size={13} color="var(--text-faint)" strokeWidth={2} />
//               </div>
//             </div>
//           ))}

//           {/* Add card */}
//           <div
//             className="snb2-add-card"
//             onClick={() => { setNewTitle(""); setNewColor(NB_COLORS[0]); setShowNewNBModal(true); }}
//           >
//             <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--accent-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <Plus size={18} color="var(--accent)" strokeWidth={2} />
//             </div>
//             <span>New Notebook</span>
//           </div>
//         </div>
//       </div>

//       {/* ── New NB modal ── */}
//       {showNewNBModal && (
//         <div className="snb2-overlay" onClick={() => setShowNewNBModal(false)}>
//           <div className="snb2-modal" onClick={e => e.stopPropagation()}>
//             <div className="snb2-modal-title">
//               <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-bg2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <BookOpen size={15} color="var(--accent)" strokeWidth={2.2} />
//               </div>
//               New Notebook
//             </div>
//             <input className="snb2-inp" value={newTitle} onChange={e => setNewTitle(e.target.value)}
//               placeholder="Notebook name…" onKeyDown={e => e.key === "Enter" && addNB()} autoFocus />
//             <p className="snb2-color-label">Choose colour</p>
//             <ColorPicker colors={NB_COLORS} selected={newColor} onSelect={setNewColor} />
//             <div className="snb2-modal-actions">
//               <button className="snb2-cancel-btn" onClick={() => setShowNewNBModal(false)}>Cancel</button>
//               <button className="snb2-btn-primary" style={{ flex: 2 }} onClick={addNB}>Create Notebook</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   /* ════════════════════════════
//      EDITOR VIEW
//   ════════════════════════════ */
//   return (
//     <div className={`${dm} snb2-editor-page`}>
//       {toast && <div key={toast.key} className="snb2-toast">{toast.msg}</div>}

//       {/* ── Top bar ── */}
//       <div className="snb2-topbar">
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <button
//             className="snb2-back-btn"
//             onClick={() => setView("notebooks")}
//           >
//             <ArrowLeft size={13} strokeWidth={2.2} /> All Notebooks
//           </button>
//           <div className="snb2-breadcrumb">
//             <div style={{ width: 8, height: 8, borderRadius: "50%", background: activeNB?.color ?? "var(--accent)", flexShrink: 0 }} />
//             <span style={{ color: "var(--text-primary)", fontWeight: 600, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeNB?.title}</span>
//             <ChevronRight size={12} strokeWidth={2} />
//             <span style={{ maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeSect?.title}</span>
//             <ChevronRight size={12} strokeWidth={2} />
//             <span className="snb2-breadcrumb-active" style={{ maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activePage?.title}</span>
//           </div>
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           {/* Search */}
//           <div style={{ position: "relative" }}>
//             <div className="snb2-search-bar" style={{ maxWidth: 200 }}>
//               <Search size={12} color="var(--text-muted)" strokeWidth={2} />
//               <input placeholder="Search…" value={searchQ} onChange={e => setSearchQ(e.target.value)}
//                 onFocus={() => setShowSearch(true)} onBlur={() => setTimeout(() => setShowSearch(false), 200)} />
//               {searchQ && (
//                 <button onClick={() => setSearchQ("")} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
//                   <X size={11} />
//                 </button>
//               )}
//             </div>
//             {showSearch && searchRes.length > 0 && (
//               <div className="snb2-search-results">
//                 {searchRes.slice(0, 4).map(({ nb, section, page }) => (
//                   <button key={page.id} className="snb2-search-result-item" onMouseDown={() => {
//                     setActiveNBId(nb.id); setActiveSectId(section.id); setActivePageId(page.id);
//                     setSearchQ(""); setShowSearch(false);
//                   }}>
//                     <FileText size={12} color={nb.color} strokeWidth={2} />
//                     <div>
//                       <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)" }}>{page.title}</div>
//                       <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{nb.title} › {section.title}</div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <TBtn icon={Share2}   tip="Share"       onClick={() => setShowShareModal(true)} />
//           <TBtn icon={Download} tip="Export .md"  onClick={doExport} />
//           <TBtn icon={Copy}     tip="Copy all"    onClick={doCopy} />

//           {/* Status */}
//           <div className="snb2-status">
//             <div className={`snb2-status-dot${saving ? " saving" : ""}`} />
//             <span className="snb2-status-text">{saving ? "Saving…" : "Saved"}</span>
//           </div>

//           <button className="snb2-btn-primary" onClick={doSave}>
//             <Save size={12} strokeWidth={2.2} /> Save
//           </button>
//         </div>
//       </div>

//       {/* ── Section tabs ── */}
//       <div className="snb2-sec-tabs snb2-scroll" style={{ overflowX: "auto" }}>
//         {activeNB?.sections.map(s => {
//           const act = s.id === activeSect?.id;
//           return (
//             <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
//               <button
//                 className={`snb2-sec-tab${act ? " active" : ""}`}
//                 style={{
//                   color: act ? s.color : "var(--text-muted)",
//                   borderBottomColor: act ? s.color : "transparent",
//                 }}
//                 onClick={() => setActiveSectId(s.id)}
//               >
//                 <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
//                 {s.title}
//               </button>
//               {act && (
//                 <button className="snb2-sect-del" onClick={() => delSect(s.id)}>
//                   <X size={10} strokeWidth={2} />
//                 </button>
//               )}
//             </div>
//           );
//         })}
//         <button className="snb2-sec-tab" style={{ color: "var(--text-muted)", borderBottomColor: "transparent" }}
//           onClick={() => { setNewTitle(""); setNewColor(SEC_COLORS[(activeNB?.sections.length ?? 0) % SEC_COLORS.length]); setShowNewSectModal(true); }}>
//           <Plus size={11} strokeWidth={2.5} /> Add Section
//         </button>
//       </div>

//       {/* ── Editor body ── */}
//       <div className="snb2-editor-body">
//         {/* Page list sidebar */}
//         <div className="snb2-pg-sidebar snb2-scroll">
//           {activeSect?.pages.map(p => {
//             const act = p.id === activePage?.id;
//             return (
//               <div key={p.id} style={{ position: "relative" }}
//                 onMouseEnter={e => { const el = e.currentTarget.querySelector(".pg-act"); if (el) el.style.opacity = "1"; }}
//                 onMouseLeave={e => { const el = e.currentTarget.querySelector(".pg-act"); if (el) el.style.opacity = "0"; }}>
//                 <button className={`snb2-pg-item${act ? " active" : ""}`} onClick={() => setActivePageId(p.id)}>
//                   <FileText size={11} strokeWidth={2} style={{ flexShrink: 0 }} />
//                   <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{p.title}</span>
//                 </button>
//                 <div className="pg-act" style={{
//                   position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)",
//                   display: "flex", gap: 1, opacity: 0, transition: "opacity .15s",
//                   background: "var(--pg-sidebar-bg)", borderRadius: 5, padding: 2
//                 }}>
//                   <button onClick={() => renPg(p.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 2 }}><Edit3 size={9} strokeWidth={2} /></button>
//                   <button onClick={() => delPg(p.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 2 }}><Trash2 size={9} strokeWidth={2} /></button>
//                 </div>
//               </div>
//             );
//           })}
//           <button className="snb2-pg-item" onClick={() => { setNewTitle(""); setShowNewPageModal(true); }}>
//             <Plus size={11} strokeWidth={2.5} style={{ flexShrink: 0 }} /> Add page
//           </button>
//         </div>

//         {/* Editor panel */}
//         <div className="snb2-editor-panel">
//           {/* Page title row */}
//           <div className="snb2-page-title-row">
//             <input
//               className="snb2-page-title-inp"
//               value={activePage?.title ?? ""}
//               onChange={e => {
//                 setNotebooks(nbs => nbs.map(nb => nb.id !== activeNBId ? nb : {
//                   ...nb, sections: nb.sections.map(s => s.id !== activeSect?.id ? s : {
//                     ...s, pages: s.pages.map(p => p.id !== activePage?.id ? p : { ...p, title: e.target.value })
//                   })
//                 }));
//               }}
//               placeholder="Page title…"
//             />
//             <div className="snb2-page-date">
//               <Clock size={9} color="var(--text-faint)" strokeWidth={2} />
//               <span>{activePage?.createdAt ? new Date(activePage.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}</span>
//             </div>
//           </div>

//           {/* Toolbar */}
//           <div className="snb2-toolbar">
//             <select className="snb2-hdg-sel" defaultValue="" onChange={onHdg}>
//               <option value="" disabled>¶</option>
//               <option value="# ">H1</option>
//               <option value="## ">H2</option>
//               <option value="### ">H3</option>
//               <option value="">Normal</option>
//             </select>
//             <div className="snb2-toolbar-sep" />
//             <TBtn icon={Bold}          tip="Bold"          onClick={bold} />
//             <TBtn icon={Italic}        tip="Italic"        onClick={italic} />
//             <TBtn icon={Underline}     tip="Underline"     onClick={under} />
//             <TBtn icon={Strikethrough} tip="Strikethrough" onClick={strike} />
//             <TBtn icon={Code}          tip="Inline code"   onClick={icode} />
//             <div className="snb2-toolbar-sep" />
//             <TBtn icon={List}          tip="Bullet list"   onClick={blist} />
//             <TBtn icon={ListOrdered}   tip="Numbered list" onClick={nlist} />
//             <TBtn icon={CheckSquare}   tip="Checkbox"      onClick={chkbox} />
//             <TBtn icon={Quote}         tip="Blockquote"    onClick={bq} />
//             <div className="snb2-toolbar-sep" />
//             <TBtn icon={Code2}         tip="Code block"    onClick={cblk} />
//             <TBtn icon={Table}         tip="Table"         onClick={tbl} />
//             <TBtn icon={Link}          tip="Link"          onClick={lnk} />
//             <TBtn icon={Minus}         tip="Divider"       onClick={hRule} />
//             <TBtn icon={Calendar}      tip="Date stamp"    onClick={dstamp} />
//             <div className="snb2-toolbar-sep" />
//             <div style={{ position: "relative" }}>
//               <TBtn icon={Tag} tip="Tag" onClick={() => setShowTagMenu(v => !v)} active={showTagMenu} />
//               {showTagMenu && (
//                 <div className="snb2-tag-menu">
//                   {TAG_OPTIONS.map(tag => (
//                     <button key={tag.label} className="snb2-tag-opt" style={{ color: tag.color }}
//                       onClick={() => inTag(tag)}
//                       onMouseEnter={e => e.currentTarget.style.background = tag.bg}
//                       onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
//                       <span style={{ fontSize: 13 }}>{tag.icon}</span> {tag.label}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Textarea */}
//           <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
//             <textarea
//               ref={taRef}
//               className="snb2-ta snb2-scroll"
//               value={localText}
//               onChange={handleChange}
//               placeholder={`Write notes for "${activePage?.title ?? "this page"}"…\n\nUse the toolbar above to format your notes.`}
//               spellCheck
//             />
//           </div>

//           {/* Footer */}
//           <div className="snb2-editor-footer">
//             <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
//               <span className="snb2-wc-badge">{wc} words</span>
//               <span className="snb2-wc-badge">{cc} chars</span>
//             </div>
//             <div style={{ display: "flex", gap: 8 }}>
//               <button className="snb2-btn-ghost" onClick={doClear} disabled={!localText.trim()}>
//                 <Trash2 size={11} strokeWidth={2} /> Clear
//               </button>
//               <button className="snb2-btn-primary" onClick={doSave}>
//                 <Save size={12} strokeWidth={2.2} /> Save Notes
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── New Section modal ── */}
//       {showNewSectModal && (
//         <div className="snb2-overlay" onClick={() => setShowNewSectModal(false)}>
//           <div className="snb2-modal" onClick={e => e.stopPropagation()}>
//             <div className="snb2-modal-title">
//               <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-bg2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <Folder size={15} color="var(--accent)" strokeWidth={2.2} />
//               </div>
//               New Section
//             </div>
//             <input className="snb2-inp" value={newTitle} onChange={e => setNewTitle(e.target.value)}
//               placeholder="Section name…" onKeyDown={e => e.key === "Enter" && addSect()} autoFocus />
//             <p className="snb2-color-label">Choose colour</p>
//             <ColorPicker colors={SEC_COLORS} selected={newColor} onSelect={setNewColor} />
//             <div className="snb2-modal-actions">
//               <button className="snb2-cancel-btn" onClick={() => setShowNewSectModal(false)}>Cancel</button>
//               <button className="snb2-btn-primary" style={{ flex: 2 }} onClick={addSect}>Create Section</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── New Page modal ── */}
//       {showNewPageModal && (
//         <div className="snb2-overlay" onClick={() => setShowNewPageModal(false)}>
//           <div className="snb2-modal" onClick={e => e.stopPropagation()}>
//             <div className="snb2-modal-title">
//               <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-bg2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <FileText size={15} color="var(--accent)" strokeWidth={2.2} />
//               </div>
//               New Page
//             </div>
//             <input className="snb2-inp" value={newTitle} onChange={e => setNewTitle(e.target.value)}
//               placeholder="Page title (optional)…" onKeyDown={e => e.key === "Enter" && addPg()} autoFocus />
//             <div className="snb2-modal-actions">
//               <button className="snb2-cancel-btn" onClick={() => setShowNewPageModal(false)}>Cancel</button>
//               <button className="snb2-btn-primary" style={{ flex: 2 }} onClick={addPg}>Add Page</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Share modal ── */}
//       {showShareModal && (
//         <div className="snb2-overlay" onClick={() => setShowShareModal(false)}>
//           <div className="snb2-modal" onClick={e => e.stopPropagation()}>
//             <div className="snb2-modal-title">
//               <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-bg2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <Share2 size={15} color="var(--accent)" strokeWidth={2.2} />
//               </div>
//               Share Notebook
//             </div>
//             <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12 }}>
//               Sharing: <b style={{ color: "var(--text-primary)" }}>{activeNB?.title}</b>
//             </p>
//             <input className="snb2-inp" type="email" value={shareEmail} onChange={e => setShareEmail(e.target.value)}
//               placeholder="Enter email address…" onKeyDown={e => e.key === "Enter" && doShare()} autoFocus />
//             <div style={{ marginTop: 10, padding: "9px 12px", borderRadius: 8, background: "var(--accent-bg3)", border: "1px solid var(--accent-border)" }}>
//               <p style={{ fontSize: 11, color: "var(--accent)", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontFamily: "Poppins,sans-serif" }}>
//                 <Hash size={11} strokeWidth={2} /> Shared notebooks are visible to invited users.
//               </p>
//             </div>
//             <div className="snb2-modal-actions">
//               <button className="snb2-cancel-btn" onClick={() => setShowShareModal(false)}>Cancel</button>
//               <button className="snb2-btn-primary" style={{ flex: 2 }} onClick={doShare}>Share</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentNotebook;






















import { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckSquare,
  Clock,
  Code,
  Code2,
  Copy,
  Download,
  Edit3,
  FileText,
  Folder,
  Hash,
  Link,
  List,
  ListOrdered,
  Minus,
  Plus,
  Quote,
  Save,
  Search,
  Share2,
  Strikethrough,
  Table,
  Tag,
  Trash2,
  X,
  BookMarked,
  Bold,
  Italic,
  Underline,
  ChevronRight,
  Loader2,
  Upload,
  Globe,
  Youtube,
  Mic,
  LayoutGrid,
  Brain,
  BarChart2,
  Layers,
  MessageSquare,
  Send,
  Volume2,
  PanelLeft,
  StickyNote,
  AlertCircle,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import {
  getMyNotebooks,
  createNotebook,
  deleteNotebook,
  addSection,
  deleteSection,
  addPage,
  savePage,
  deletePage,
  addUrlSource,
  addFileSource,
  deleteSource,
  notebookChat,
} from "../services/chatService";

/* ─── CSS Injection ─── */
const INJECT_ID = "snb-lm-v2";
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
  .snblm *, .snblm *::before, .snblm *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes snblm-fade  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
  @keyframes snblm-pop   { 0%{transform:scale(.93);opacity:0} 100%{transform:scale(1);opacity:1} }
  @keyframes snblm-toast { from{opacity:0;transform:translateX(-50%) translateY(-8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
  @keyframes snblm-spin  { to{transform:rotate(360deg)} }
  @keyframes snblm-blink { 0%,100%{opacity:1} 50%{opacity:.25} }
  @keyframes snblm-slide-in { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:none} }
  @keyframes snblm-msg-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }

  .snblm-scroll::-webkit-scrollbar { width:4px; }
  .snblm-scroll::-webkit-scrollbar-track { background:transparent; }
  .snblm-scroll::-webkit-scrollbar-thumb { background:rgba(128,128,128,.18); border-radius:4px; }

  /* ── LIGHT THEME ── */
  .snblm {
    --bg:          #f8f9fb;
    --surface:     #ffffff;
    --surface2:    #f3f4f8;
    --border:      #e8eaf0;
    --border2:     #d8dce8;
    --text:        #1a1d2e;
    --text2:       #4a5068;
    --text3:       #8890a8;
    --text4:       #bec4d4;
    --accent:      #7c3aed;
    --accent2:     #6d28d9;
    --accent-bg:   rgba(124,58,237,.07);
    --accent-bg2:  rgba(124,58,237,.12);
    --accent-sh:   rgba(124,58,237,.25);
    --accent-bdr:  rgba(124,58,237,.2);
    --green:       #16a34a;
    --green-bg:    rgba(22,163,74,.1);
    --red:         #dc2626;
    --red-bg:      rgba(220,38,38,.08);
    --overlay:     rgba(15,20,40,.45);
    --modal:       #ffffff;
    --chat-user:   #7c3aed;
    --chat-ai:     #f3f4f8;
    --chat-ai-txt: #1a1d2e;
    --src-hover:   rgba(124,58,237,.05);
    --studio-btn:  #f3f4f8;
    --studio-hover:#e8eaf2;
    --toast-bg:    #1a1d2e;
    --toast-txt:   #f8f9fb;
  }
  .snblm.dark {
    --bg:          #0d0f16;
    --surface:     #13161f;
    --surface2:    #1a1d2a;
    --border:      #22263a;
    --border2:     #2c3050;
    --text:        #e4e6f0;
    --text2:       #9098b4;
    --text3:       #555e7a;
    --text4:       #323858;
    --accent:      #8b5cf6;
    --accent2:     #7c3aed;
    --accent-bg:   rgba(139,92,246,.1);
    --accent-bg2:  rgba(139,92,246,.18);
    --accent-sh:   rgba(139,92,246,.3);
    --accent-bdr:  rgba(139,92,246,.25);
    --green:       #22c55e;
    --green-bg:    rgba(34,197,94,.1);
    --red:         #f87171;
    --red-bg:      rgba(248,113,113,.08);
    --overlay:     rgba(0,0,0,.65);
    --modal:       #13161f;
    --chat-user:   #8b5cf6;
    --chat-ai:     #1a1d2a;
    --chat-ai-txt: #e4e6f0;
    --src-hover:   rgba(139,92,246,.07);
    --studio-btn:  #1a1d2a;
    --studio-hover:#22263a;
    --toast-bg:    #e4e6f0;
    --toast-txt:   #0d0f16;
  }

  /* ── SHELL ── */
  .snblm-root {
    height:100%; min-height:100vh;
    background:var(--bg); font-family:'Poppins',sans-serif;
    display:flex; flex-direction:column; overflow:hidden;
    color:var(--text); transition:background .25s,color .25s;
  }

  /* ── TOPBAR ── */
  .snblm-topbar {
    display:flex; align-items:center; justify-content:space-between;
    padding:0 20px; height:54px;
    background:var(--surface); border-bottom:1px solid var(--border);
    flex-shrink:0; gap:10px; transition:background .25s,border-color .25s;
    z-index:30;
  }
  .snblm-breadcrumb {
    display:flex; align-items:center; gap:5px;
    font-size:12px; color:var(--text3); font-weight:500;
  }
  .snblm-breadcrumb-active { color:var(--text); font-weight:700; }

  /* ── BUTTONS ── */
  .snblm-btn {
    display:inline-flex; align-items:center; gap:5px;
    padding:7px 14px; background:var(--accent); color:#fff;
    border:none; border-radius:8px;
    font-family:'Poppins',sans-serif; font-size:11px; font-weight:700;
    cursor:pointer; box-shadow:0 2px 10px var(--accent-sh);
    transition:background .15s,transform .12s; white-space:nowrap;
  }
  .snblm-btn:hover { background:var(--accent2); transform:translateY(-1px); }
  .snblm-btn:active { transform:scale(.97); }
  .snblm-btn-ghost {
    display:inline-flex; align-items:center; gap:5px;
    padding:6px 12px; background:transparent;
    border:1px solid var(--border2); border-radius:8px;
    font-family:'Poppins',sans-serif; font-size:11px; font-weight:600;
    color:var(--text2); cursor:pointer;
    transition:border-color .15s,color .15s,background .15s;
  }
  .snblm-btn-ghost:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-bg); }
  .snblm-icon-btn {
    width:30px; height:30px; border-radius:7px; border:none;
    background:transparent; cursor:pointer; color:var(--text3);
    display:inline-flex; align-items:center; justify-content:center;
    transition:background .12s,color .12s; flex-shrink:0;
  }
  .snblm-icon-btn:hover { background:var(--accent-bg2); color:var(--accent); }
  .snblm-back-btn {
    display:flex; align-items:center; gap:5px;
    padding:5px 11px; border-radius:8px; border:1px solid var(--border2);
    background:var(--surface); cursor:pointer; color:var(--text2);
    font-family:'Poppins',sans-serif; font-size:11px; font-weight:600;
    transition:border-color .15s,color .15s;
  }
  .snblm-back-btn:hover { border-color:var(--accent); color:var(--accent); }

  /* ── NOTEBOOKS GRID ── */
  .snblm-content {
    flex:1; overflow-y:auto; padding:24px 24px 20px;
    display:flex; flex-direction:column; gap:18px;
  }
  .snblm-pg-title { font-size:24px; font-weight:800; color:var(--text); letter-spacing:-.3px; }
  .snblm-pg-sub   { font-size:12px; color:var(--text3); margin-top:3px; }
  .snblm-lbl {
    font-size:9px; font-weight:700; letter-spacing:.18em;
    color:var(--accent); display:flex; align-items:center; gap:5px; margin-bottom:2px;
  }
  .snblm-lbl::before { content:''; width:5px; height:5px; border-radius:50%; background:var(--accent); flex-shrink:0; }

  .snblm-pills { display:flex; gap:7px; flex-wrap:wrap; }
  .snblm-pill {
    display:inline-flex; align-items:center; gap:5px;
    padding:5px 12px; background:var(--surface); border:1px solid var(--border);
    border-radius:20px; font-size:11px; font-weight:600; color:var(--text2);
    box-shadow:0 1px 3px rgba(0,0,0,.05);
  }
  .snblm-pill b { color:var(--accent); }

  .snblm-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
    gap:12px;
  }
  .snblm-nb-card {
    background:var(--surface); border-radius:13px; border:1px solid var(--border);
    overflow:hidden; cursor:pointer;
    transition:box-shadow .2s,transform .2s,border-color .2s;
    display:flex; flex-direction:column; animation:snblm-fade .3s ease both;
  }
  .snblm-nb-card:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(0,0,0,.13); border-color:var(--accent-bdr); }
  .snblm-nb-stripe { height:4px; flex-shrink:0; }
  .snblm-nb-body { padding:14px 14px 12px; flex:1; }
  .snblm-nb-icon { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; margin-bottom:10px; }
  .snblm-nb-name { font-size:13px; font-weight:700; color:var(--text); line-height:1.3; margin-bottom:3px; }
  .snblm-nb-meta { font-size:10px; color:var(--text3); }
  .snblm-nb-foot {
    display:flex; align-items:center; justify-content:space-between;
    padding:8px 14px; border-top:1px solid var(--border);
    background:var(--surface2); transition:background .25s;
  }
  .snblm-add-card {
    background:var(--surface); border-radius:13px; border:2px dashed var(--border2);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:5px; cursor:pointer; min-height:130px;
    transition:border-color .2s,background .2s;
  }
  .snblm-add-card:hover { border-color:var(--accent); background:var(--accent-bg); }
  .snblm-add-card span { font-size:10px; font-weight:600; color:var(--text3); }
  .snblm-add-card:hover span { color:var(--accent); }

  /* ── SEARCH ── */
  .snblm-search {
    display:flex; align-items:center; gap:7px;
    padding:7px 11px; background:var(--surface2); border:1px solid var(--border);
    border-radius:9px; transition:border-color .15s;
  }
  .snblm-search:focus-within { border-color:var(--accent); background:var(--surface); }
  .snblm-search input {
    border:none; outline:none; background:transparent;
    font-family:'Poppins',sans-serif; font-size:12px; color:var(--text); flex:1; min-width:0;
  }
  .snblm-search input::placeholder { color:var(--text3); }
  .snblm-search-results {
    position:absolute; top:calc(100% + 4px); left:0; right:0; z-index:50;
    background:var(--modal); border:1px solid var(--border2);
    border-radius:10px; overflow:hidden;
    box-shadow:0 8px 24px rgba(0,0,0,.18); animation:snblm-pop .15s ease;
  }
  .snblm-search-item {
    display:flex; align-items:center; gap:9px; padding:9px 12px;
    background:transparent; border:none; border-bottom:1px solid var(--border);
    width:100%; cursor:pointer; text-align:left; transition:background .12s;
  }
  .snblm-search-item:hover { background:var(--accent-bg); }
  .snblm-search-item:last-child { border-bottom:none; }

  /* ── 3-PANEL EDITOR ── */
  .snblm-lm-body {
    flex:1; display:flex; overflow:hidden;
    background:var(--surface); transition:background .25s;
  }

  /* Sources panel */
  .snblm-sources {
    width:240px; flex-shrink:0; border-right:1px solid var(--border);
    background:var(--surface); display:flex; flex-direction:column;
    overflow:hidden; transition:background .25s,border-color .25s;
  }
  .snblm-sources-hdr {
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 14px 10px;
    font-size:13px; font-weight:700; color:var(--text); flex-shrink:0;
  }
  .snblm-sources-search {
    margin:0 10px 8px; padding:6px 10px;
    display:flex; align-items:center; gap:6px;
    background:var(--surface2); border:1px solid var(--border);
    border-radius:8px; flex-shrink:0;
  }
  .snblm-sources-search input {
    border:none; outline:none; background:transparent;
    font-family:'Poppins',sans-serif; font-size:11px; color:var(--text); flex:1;
  }
  .snblm-sources-search input::placeholder { color:var(--text3); }

  .snblm-sources-list { flex:1; overflow-y:auto; padding:4px 8px; }
  .snblm-src-item {
    display:flex; align-items:center; gap:8px; padding:8px 8px;
    border-radius:8px; cursor:default; animation:snblm-slide-in .2s ease;
    transition:background .12s;
  }
  .snblm-src-item:hover { background:var(--src-hover); }
  .snblm-src-icon {
    width:28px; height:28px; border-radius:7px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
  }
  .snblm-src-info { flex:1; min-width:0; }
  .snblm-src-name { font-size:11px; font-weight:600; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .snblm-src-type { font-size:9px; color:var(--text3); font-weight:500; text-transform:uppercase; letter-spacing:.06em; }
  .snblm-src-del { background:transparent; border:none; cursor:pointer; color:var(--text4); display:flex; padding:2px; border-radius:4px; opacity:0; transition:opacity .12s,color .12s; }
  .snblm-src-item:hover .snblm-src-del { opacity:1; }
  .snblm-src-del:hover { color:var(--red); }

  .snblm-sources-empty {
    flex:1; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:8px; padding:20px 16px; text-align:center;
  }
  .snblm-sources-empty p { font-size:11px; font-weight:600; color:var(--text2); }
  .snblm-sources-empty small { font-size:10px; color:var(--text3); line-height:1.5; }

  .snblm-sources-foot {
    padding:10px; border-top:1px solid var(--border); flex-shrink:0;
    display:flex; flex-direction:column; gap:6px;
  }
  .snblm-add-src-btn {
    width:100%; padding:8px; border-radius:8px;
    background:var(--accent-bg); border:1px dashed var(--accent-bdr);
    display:flex; align-items:center; justify-content:center; gap:6px;
    font-family:'Poppins',sans-serif; font-size:11px; font-weight:700;
    color:var(--accent); cursor:pointer;
    transition:background .15s,border-color .15s;
  }
  .snblm-add-src-btn:hover { background:var(--accent-bg2); border-color:var(--accent); }

  /* Chat panel */
  .snblm-chat {
    flex:1; min-width:0; display:flex; flex-direction:column;
    border-right:1px solid var(--border);
    background:var(--surface); transition:background .25s,border-color .25s;
  }
  .snblm-chat-hdr {
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 16px 10px; border-bottom:1px solid var(--border);
    font-size:13px; font-weight:700; color:var(--text); flex-shrink:0;
  }
  .snblm-chat-msgs { flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:12px; }
  .snblm-chat-welcome {
    flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
    text-align:center; gap:10px; padding:24px;
    animation:snblm-fade .4s ease;
  }
  .snblm-chat-welcome-icon {
    width:64px; height:64px; border-radius:16px;
    background:var(--accent-bg2); display:flex; align-items:center; justify-content:center;
    margin-bottom:4px;
  }
  .snblm-chat-welcome h2 { font-size:18px; font-weight:800; color:var(--text); }
  .snblm-chat-welcome p { font-size:11px; color:var(--text3); }

  .snblm-msg {
    display:flex; gap:8px; animation:snblm-msg-in .2s ease;
  }
  .snblm-msg.user { flex-direction:row-reverse; }
  .snblm-msg-avatar {
    width:28px; height:28px; border-radius:8px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700;
  }
  .snblm-msg.user .snblm-msg-avatar { background:var(--accent); color:#fff; }
  .snblm-msg.ai .snblm-msg-avatar { background:var(--surface2); color:var(--text2); }
  .snblm-msg-bubble {
    max-width:75%; padding:9px 12px; border-radius:12px;
    font-size:12px; line-height:1.7; font-weight:400;
  }
  .snblm-msg.user .snblm-msg-bubble { background:var(--accent); color:#fff; border-bottom-right-radius:3px; }
  .snblm-msg.ai  .snblm-msg-bubble { background:var(--chat-ai); color:var(--chat-ai-txt); border-bottom-left-radius:3px; }

  /* ── MARKDOWN RENDERING IN CHAT ── */
  .snblm-msg-bubble p { margin:3px 0; }
  .snblm-msg-bubble p:first-child { margin-top:0; }
  .snblm-msg-bubble p:last-child { margin-bottom:0; }
  .snblm-msg-bubble h1,.snblm-msg-bubble h2,.snblm-msg-bubble h3 { font-weight:700; margin:8px 0 4px; line-height:1.3; }
  .snblm-msg-bubble h1 { font-size:14px; }
  .snblm-msg-bubble h2 { font-size:13px; }
  .snblm-msg-bubble h3 { font-size:12px; }
  .snblm-msg-bubble ul,.snblm-msg-bubble ol { padding-left:16px; margin:4px 0; }
  .snblm-msg-bubble li { margin:2px 0; }
  .snblm-msg-bubble strong { font-weight:700; }
  .snblm-msg-bubble em { font-style:italic; }
  .snblm-msg-bubble code { background:rgba(0,0,0,.1); padding:1px 5px; border-radius:4px; font-size:11px; font-family:monospace; }
  .snblm-msg.user .snblm-msg-bubble code { background:rgba(255,255,255,.2); }
  .snblm-msg-bubble pre { background:rgba(0,0,0,.08); padding:8px 10px; border-radius:6px; overflow-x:auto; margin:6px 0; }
  .snblm-msg-bubble pre code { background:transparent; padding:0; }
  .snblm-msg-bubble blockquote { border-left:3px solid var(--accent); padding-left:8px; margin:4px 0; opacity:.8; }
  .snblm-msg-bubble hr { border:none; border-top:1px solid var(--border); margin:6px 0; }
  .snblm-msg-bubble table { border-collapse:collapse; width:100%; margin:6px 0; font-size:11px; }
  .snblm-msg-bubble th,.snblm-msg-bubble td { border:1px solid var(--border2); padding:4px 8px; text-align:left; }
  .snblm-msg-bubble th { font-weight:700; background:var(--surface2); }

  /* ── MARKDOWN RENDERING IN STUDIO OUTPUT ── */
  .snblm-studio-out p { margin:4px 0; }
  .snblm-studio-out p:first-child { margin-top:0; }
  .snblm-studio-out h1,.snblm-studio-out h2,.snblm-studio-out h3 { font-weight:700; margin:10px 0 5px; color:var(--text); line-height:1.3; }
  .snblm-studio-out h1 { font-size:15px; }
  .snblm-studio-out h2 { font-size:13px; }
  .snblm-studio-out h3 { font-size:12px; }
  .snblm-studio-out ul,.snblm-studio-out ol { padding-left:18px; margin:5px 0; }
  .snblm-studio-out li { margin:3px 0; line-height:1.6; }
  .snblm-studio-out strong { font-weight:700; color:var(--text); }
  .snblm-studio-out em { font-style:italic; }
  .snblm-studio-out code { background:var(--surface); border:1px solid var(--border); padding:1px 5px; border-radius:4px; font-size:11px; font-family:monospace; }
  .snblm-studio-out pre { background:var(--surface); border:1px solid var(--border); padding:10px 12px; border-radius:7px; overflow-x:auto; margin:8px 0; }
  .snblm-studio-out pre code { background:transparent; border:none; padding:0; }
  .snblm-studio-out blockquote { border-left:3px solid var(--accent); padding-left:10px; margin:6px 0; color:var(--text2); }
  .snblm-studio-out hr { border:none; border-top:1px solid var(--border); margin:10px 0; }
  .snblm-studio-out table { border-collapse:collapse; width:100%; margin:8px 0; font-size:11px; }
  .snblm-studio-out th,.snblm-studio-out td { border:1px solid var(--border2); padding:5px 10px; text-align:left; }
  .snblm-studio-out th { font-weight:700; background:var(--surface2); color:var(--text); }

  .snblm-chat-typing { display:flex; gap:4px; align-items:center; padding:6px 0; }
  .snblm-typing-dot {
    width:6px; height:6px; border-radius:50%; background:var(--text3);
    animation:snblm-blink .9s infinite;
  }
  .snblm-typing-dot:nth-child(2) { animation-delay:.2s; }
  .snblm-typing-dot:nth-child(3) { animation-delay:.4s; }

  .snblm-chat-input-row {
    padding:10px 12px; border-top:1px solid var(--border); flex-shrink:0;
    display:flex; align-items:flex-end; gap:8px;
  }
  .snblm-chat-input {
    flex:1; resize:none; border:1px solid var(--border2); border-radius:10px;
    background:var(--surface2); padding:8px 11px;
    font-family:'Poppins',sans-serif; font-size:12px; color:var(--text);
    outline:none; min-height:36px; max-height:100px; line-height:1.5;
    transition:border-color .15s,background .25s;
  }
  .snblm-chat-input:focus { border-color:var(--accent); background:var(--surface); }
  .snblm-chat-input::placeholder { color:var(--text3); }
  .snblm-chat-src-count { font-size:10px; color:var(--text3); font-weight:600; white-space:nowrap; align-self:center; }
  .snblm-send-btn {
    width:34px; height:34px; border-radius:9px; border:none;
    background:var(--accent); color:#fff; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0; transition:background .15s,transform .12s;
    box-shadow:0 2px 8px var(--accent-sh);
  }
  .snblm-send-btn:hover { background:var(--accent2); transform:translateY(-1px); }
  .snblm-send-btn:disabled { opacity:.4; cursor:not-allowed; transform:none; }

  /* Studio panel */
  .snblm-studio {
    width:240px; flex-shrink:0; overflow-y:auto;
    background:var(--surface); display:flex; flex-direction:column;
    transition:background .25s;
  }
  .snblm-studio-hdr {
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 14px 10px;
    font-size:13px; font-weight:700; color:var(--text); flex-shrink:0;
  }
  .snblm-studio-banner {
    margin:0 10px 10px; padding:10px 11px; border-radius:9px;
    background:linear-gradient(135deg,var(--accent-bg2),var(--accent-bg));
    border:1px solid var(--accent-bdr); flex-shrink:0;
  }
  .snblm-studio-banner p { font-size:10px; font-weight:600; color:var(--accent); margin-bottom:4px; }
  .snblm-studio-banner-langs { display:flex; flex-wrap:wrap; gap:3px; }

  .snblm-lang-chip {
    font-size:9px; font-weight:600; padding:2px 6px; border-radius:4px;
    background:var(--accent-bg2); color:var(--accent); border:1px solid var(--accent-bdr);
    cursor:pointer; transition:background .12s,color .12s,border-color .12s;
    user-select:none;
  }
  .snblm-lang-chip:hover { background:var(--accent); color:#fff; }
  .snblm-lang-chip.selected {
    background:var(--accent); color:#fff;
    border-color:var(--accent2);
    box-shadow:0 0 0 2px var(--accent-sh);
  }

  .snblm-studio-grid {
    display:grid; grid-template-columns:1fr 1fr;
    gap:6px; padding:0 10px 10px; flex-shrink:0;
  }
  .snblm-studio-btn {
    padding:12px 8px; border-radius:10px;
    background:var(--studio-btn); border:1px solid var(--border);
    display:flex; flex-direction:column; align-items:center; gap:6px;
    cursor:pointer; transition:background .15s,border-color .15s,transform .12s;
    font-family:'Poppins',sans-serif;
  }
  .snblm-studio-btn:hover { background:var(--studio-hover); border-color:var(--accent-bdr); transform:translateY(-1px); }
  .snblm-studio-btn:active { transform:scale(.97); }
  .snblm-studio-btn span { font-size:10px; font-weight:600; color:var(--text2); text-align:center; line-height:1.3; }
  .snblm-studio-btn:hover span { color:var(--accent); }
  .snblm-studio-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }

  .snblm-add-note-btn {
    margin:4px 10px 10px; padding:9px; border-radius:9px;
    background:var(--accent); border:none; color:#fff;
    display:flex; align-items:center; justify-content:center; gap:6px;
    font-family:'Poppins',sans-serif; font-size:11px; font-weight:700;
    cursor:pointer; box-shadow:0 2px 10px var(--accent-sh);
    transition:background .15s,transform .12s;
  }
  .snblm-add-note-btn:hover { background:var(--accent2); transform:translateY(-1px); }

  /* ── SECTION TABS ── */
  .snblm-sec-tabs {
    display:flex; align-items:flex-end; gap:0;
    border-bottom:1px solid var(--border);
    background:var(--surface); padding:0 12px; overflow-x:auto; flex-shrink:0;
  }
  .snblm-sec-tab {
    display:inline-flex; align-items:center; gap:5px;
    padding:9px 12px; border:none; border-bottom:2px solid transparent;
    background:transparent; cursor:pointer;
    font-family:'Poppins',sans-serif; font-size:11px; font-weight:500;
    color:var(--text3); white-space:nowrap; margin-bottom:-1px;
    transition:color .13s,border-color .13s;
  }
  .snblm-sec-tab.active { font-weight:700; }
  .snblm-sec-tab:hover:not(.active) { color:var(--text2); }

  /* ── NOTE EDITOR ── */
  .snblm-note-body { flex:1; display:flex; overflow:hidden; background:var(--surface); }
  .snblm-note-sidebar {
    width:140px; flex-shrink:0; border-right:1px solid var(--border);
    background:var(--surface2); overflow-y:auto; padding:6px 0;
  }
  .snblm-note-pg-item {
    display:flex; align-items:center; gap:5px; padding:6px 10px;
    cursor:pointer; border:none; width:100%; text-align:left; background:transparent;
    font-family:'Poppins',sans-serif; font-size:10px; color:var(--text3); font-weight:400;
    border-left:2px solid transparent; transition:background .12s,color .12s;
  }
  .snblm-note-pg-item:hover { background:var(--accent-bg); color:var(--text2); }
  .snblm-note-pg-item.active { background:var(--accent-bg2); color:var(--text); font-weight:600; border-left-color:var(--accent); }

  .snblm-note-panel { flex:1; min-width:0; display:flex; flex-direction:column; overflow:hidden; }
  .snblm-note-title-row { padding:12px 18px 8px; border-bottom:1px solid var(--border); flex-shrink:0; }
  .snblm-note-title-inp {
    border:none; outline:none; width:100%;
    font-family:'Poppins',sans-serif; font-size:15px; font-weight:700;
    color:var(--text); background:transparent;
  }
  .snblm-note-title-inp::placeholder { color:var(--text4); }
  .snblm-note-date { font-size:9px; color:var(--text4); margin-top:2px; display:flex; align-items:center; gap:3px; }

  .snblm-toolbar {
    display:flex; align-items:center; gap:2px; padding:5px 10px; flex-wrap:wrap;
    background:var(--surface2); border-bottom:1px solid var(--border); flex-shrink:0;
  }
  .snblm-tsep { width:1px; height:16px; background:var(--border2); margin:0 3px; flex-shrink:0; }
  .snblm-tbtn {
    width:26px; height:26px; border-radius:6px; border:none; background:transparent;
    cursor:pointer; color:var(--text2); display:inline-flex; align-items:center; justify-content:center;
    position:relative; transition:background .12s,color .12s;
  }
  .snblm-tbtn:hover { background:var(--accent-bg2); color:var(--accent); }
  .snblm-tbtn.active { background:var(--accent-bg2); color:var(--accent); }
  .snblm-tbtn .tip {
    position:absolute; bottom:110%; left:50%; transform:translateX(-50%);
    background:var(--text); color:var(--bg); font-size:9px; font-weight:700;
    padding:3px 6px; border-radius:4px; white-space:nowrap;
    pointer-events:none; opacity:0; transition:opacity .15s;
    font-family:'Poppins',sans-serif; z-index:60;
  }
  .snblm-tbtn:hover .tip { opacity:1; }
  .snblm-hdg-sel {
    height:24px; padding:0 6px; border-radius:5px;
    border:1px solid var(--border2); background:var(--surface2);
    font-family:'Poppins',sans-serif; font-size:10px; font-weight:600;
    color:var(--text2); cursor:pointer; outline:none;
  }

  .snblm-ta {
    flex:1; resize:none; border:none; outline:none;
    font-family:'Poppins',sans-serif; font-size:13px; line-height:1.9;
    color:var(--text2); background:transparent; padding:14px 18px; letter-spacing:.01em;
  }
  .snblm-ta::placeholder { color:var(--text4); font-style:italic; }

  .snblm-note-footer {
    display:flex; align-items:center; justify-content:space-between;
    padding:8px 14px; border-top:1px solid var(--border);
    background:var(--surface2); flex-shrink:0;
  }
  .snblm-wc { font-size:9px; font-weight:600; color:var(--text3); padding:3px 8px; border-radius:10px; background:var(--surface); border:1px solid var(--border); }
  .snblm-status-dot { width:5px; height:5px; border-radius:50%; background:var(--green); display:inline-block; }
  .snblm-status-dot.saving { animation:snblm-blink .8s infinite; background:#f59e0b; }

  /* ── MODALS ── */
  .snblm-overlay {
    position:fixed; inset:0; z-index:999;
    background:var(--overlay);
    display:flex; align-items:center; justify-content:center;
    animation:snblm-fade .15s ease;
  }
  .snblm-modal {
    background:var(--modal); border-radius:14px; padding:22px; width:320px;
    box-shadow:0 20px 60px rgba(0,0,0,.3); animation:snblm-pop .2s ease;
    border:1px solid var(--border);
  }
  .snblm-modal-wide { width:420px; }
  .snblm-modal-title {
    font-size:14px; font-weight:700; color:var(--text); margin-bottom:14px;
    display:flex; align-items:center; gap:8px;
  }
  .snblm-inp {
    width:100%; padding:8px 11px; border:1px solid var(--border2); border-radius:8px;
    font-family:'Poppins',sans-serif; font-size:12px; color:var(--text); background:var(--surface2);
    outline:none; transition:border-color .2s,box-shadow .2s; display:block;
  }
  .snblm-inp:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-bg); background:var(--surface); }
  .snblm-clr-lbl { font-size:9px; font-weight:700; letter-spacing:.1em; color:var(--text3); margin:10px 0 6px; text-transform:uppercase; }
  .snblm-modal-actions { display:flex; gap:7px; margin-top:14px; }
  .snblm-cancel {
    flex:1; padding:7px; border-radius:7px;
    border:1px solid var(--border2); background:transparent;
    font-family:'Poppins',sans-serif; font-size:11px; font-weight:600;
    color:var(--text2); cursor:pointer; transition:border-color .15s;
  }
  .snblm-cancel:hover { border-color:var(--text3); }

  /* Source upload modal tabs */
  .snblm-src-tabs { display:flex; gap:0; border-bottom:1px solid var(--border); margin-bottom:14px; }
  .snblm-src-tab {
    flex:1; padding:8px 4px; border:none; background:transparent;
    font-family:'Poppins',sans-serif; font-size:10px; font-weight:600;
    color:var(--text3); cursor:pointer; border-bottom:2px solid transparent;
    transition:color .13s,border-color .13s; display:flex; align-items:center; justify-content:center; gap:4px;
  }
  .snblm-src-tab.active { color:var(--accent); border-bottom-color:var(--accent); font-weight:700; }
  .snblm-src-tab:hover:not(.active) { color:var(--text2); }

  .snblm-drop-zone {
    border:2px dashed var(--border2); border-radius:10px;
    padding:24px 16px; display:flex; flex-direction:column; align-items:center; gap:8px;
    cursor:pointer; transition:border-color .15s,background .15s;
  }
  .snblm-drop-zone:hover { border-color:var(--accent); background:var(--accent-bg); }
  .snblm-drop-zone p { font-size:11px; font-weight:600; color:var(--text2); }
  .snblm-drop-zone small { font-size:10px; color:var(--text3); }
  .snblm-file-input { display:none; }

  /* Studio output modal */
  .snblm-studio-out {
    max-height:60vh; overflow-y:auto; padding:14px; border-radius:8px;
    background:var(--surface2); border:1px solid var(--border);
    font-size:12px; line-height:1.7; color:var(--text2);
  }

  /* ── SPEAKING INDICATOR ── */
  @keyframes snblm-wave {
    0%,100% { transform: scaleY(0.4); }
    50% { transform: scaleY(1); }
  }
  .snblm-speaking-bar {
    display:inline-block; width:3px; border-radius:2px;
    background:var(--accent); margin:0 1px;
    animation:snblm-wave 0.8s ease-in-out infinite;
  }
  .snblm-speaking-bar:nth-child(2) { animation-delay:0.15s; }
  .snblm-speaking-bar:nth-child(3) { animation-delay:0.3s; }
  .snblm-speaking-bar:nth-child(4) { animation-delay:0.45s; }

  /* ── TOAST ── */
  .snblm-toast {
    position:fixed; bottom:20px; left:50%; transform:translateX(-50%);
    background:var(--toast-bg); color:var(--toast-txt);
    font-size:11px; font-weight:600; padding:7px 16px; border-radius:18px; z-index:9999;
    box-shadow:0 4px 20px rgba(0,0,0,.2); animation:snblm-toast .2s ease;
    white-space:nowrap; font-family:'Poppins',sans-serif;
  }

  /* ── LOADING ── */
  .snblm-loading {
    height:100%; min-height:100vh; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:10px;
    background:var(--bg); font-family:'Poppins',sans-serif;
  }
  .snblm-spin { animation:snblm-spin 1s linear infinite; }

  /* ── MISC ── */
  .snblm-del-btn { background:transparent; border:none; cursor:pointer; color:var(--text4); padding:3px; border-radius:5px; display:flex; transition:color .15s; }
  .snblm-del-btn:hover { color:var(--red); }
`;

const injectCSS = () => {
  if (document.getElementById(INJECT_ID)) return;
  const el = document.createElement("style");
  el.id = INJECT_ID;
  el.textContent = GLOBAL_CSS;
  document.head.appendChild(el);
};

/* ── Constants ── */
const NB_COLORS = [
  "#7c3aed",
  "#2563eb",
  "#0891b2",
  "#059669",
  "#d97706",
  "#dc2626",
  "#db2777",
  "#9333ea",
];
const SEC_COLORS = [
  "#7c3aed",
  "#2563eb",
  "#0891b2",
  "#059669",
  "#d97706",
  "#dc2626",
  "#db2777",
  "#16a34a",
];
const TAG_OPTIONS = [
  {
    label: "Important",
    icon: "⭐",
    color: "#f59e0b",
    bg: "rgba(245,158,11,.12)",
  },
  {
    label: "Question",
    icon: "❓",
    color: "#3b82f6",
    bg: "rgba(59,130,246,.12)",
  },
  { label: "To Do", icon: "✅", color: "#22c55e", bg: "rgba(34,197,94,.12)" },
  { label: "Idea", icon: "💡", color: "#a855f7", bg: "rgba(168,85,247,.12)" },
  {
    label: "Remember",
    icon: "🔖",
    color: "#ef4444",
    bg: "rgba(239,68,68,.12)",
  },
  {
    label: "Definition",
    icon: "📌",
    color: "#0891b2",
    bg: "rgba(8,145,178,.12)",
  },
];

const STUDIO_ITEMS = [
  { label: "Audio Overview", icon: Volume2, key: "audio" },
  { label: "Slide Deck", icon: Layers, key: "slides" },
  { label: "Video Overview", icon: Youtube, key: "video" },
  { label: "Mind Map", icon: Brain, key: "mindmap" },
  { label: "Reports", icon: FileText, key: "report" },
  { label: "Flashcards", icon: BookOpen, key: "flashcards" },
  { label: "Quiz", icon: CheckSquare, key: "quiz" },
  { label: "Infographic", icon: BarChart2, key: "infographic" },
  { label: "Data Table", icon: LayoutGrid, key: "datatable" },
];

const LANG_OPTIONS = [
  { label: "English", name: "English" },
  { label: "हिन्दी", name: "Hindi" },
  { label: "বাংলা", name: "Bengali" },
  { label: "ગુજરાતી", name: "Gujarati" },
  { label: "ಕನ್ನಡ", name: "Kannada" },
  { label: "മലയാളം", name: "Malayalam" },
  { label: "मराठी", name: "Marathi" },
  { label: "ਪੰਜਾਬੀ", name: "Punjabi" },
  { label: "தமிழ்", name: "Tamil" },
  { label: "తెలుగు", name: "Telugu" },
];

const buildStudioPrompts = (languageName) => {
  const lang = languageName || "Telugu";
  const langNote = `IMPORTANT: Generate the ENTIRE response in ${lang} language only. Do not use English anywhere in the output except for proper nouns or technical terms that have no ${lang} equivalent.\n\n`;
  return {
    audio: `${langNote}Generate a detailed audio overview script based on all the content in this notebook's sources. Format it as a spoken narrative with a warm, engaging tone. Include: an intro hook, clearly labeled sections, smooth transitions between topics, key takeaways, and a closing summary. Make it educational and easy to follow when read aloud.`,
    slides: `${langNote}Generate a complete slide deck with 8-12 slides based on the notebook sources. For EVERY slide provide exactly:\n**Slide N: [Title]**\n- Bullet point 1\n- Bullet point 2\n- Bullet point 3\n- Bullet point 4\n*Speaker notes: [2-3 sentences of speaker guidance]*\n\nInclude a title slide, content slides covering all major topics, and a summary/conclusion slide.`,
    video: `${langNote}Generate a full video script based on the notebook sources. Structure it as:\n**[INTRO - 0:00-0:30]**\n[Scene description + narration text]\n\n**[SECTION 1 - 0:30-2:00]**\n[Scene description + narration]\n\nContinue for all sections. Include visual suggestions, on-screen text ideas, and a clear outro with call to action.`,
    mindmap: `${langNote}Generate a comprehensive text-based mind map using indentation. Format:\n\n# [Central Topic]\n\n## Branch 1: [Main Topic]\n- Sub-topic A\n  - Detail 1\n  - Detail 2\n- Sub-topic B\n  - Detail 1\n\n## Branch 2: [Main Topic]\n[continue...]\n\nCover ALL key concepts from the sources with at least 5 main branches.`,
    report: `${langNote}Generate a comprehensive study report based on the notebook sources. Include these sections with proper markdown headings:\n\n# Report Title\n\n## Executive Summary\n## Key Concepts\n## Detailed Analysis\n## Important Points to Remember\n## Practical Applications\n## Conclusion\n\nUse bullet points, bold for key terms, and be thorough.`,
    flashcards: `${langNote}Generate exactly 15 flashcards based on the notebook sources. Use this EXACT format for every card:\n\n---\n**Card 1**\n**Q:** [Clear, specific question]\n**A:** [Concise, accurate answer]\n\n---\n**Card 2**\n**Q:** [question]\n**A:** [answer]\n\n[Continue for all 15 cards]`,
    quiz: `${langNote}Generate a 10-question multiple choice quiz based on the notebook sources. Use this EXACT format:\n\n**Question 1:** [Question text]\na) [Option A]\nb) [Option B]\nc) [Option C]\nd) [Option D]\n✅ **Correct Answer: [letter]) [answer text]**\n*Explanation: [brief explanation]*\n\n[Repeat for all 10 questions]`,
    infographic: `${langNote}Generate a structured infographic outline based on the notebook sources. Include:\n\n# 📊 [Infographic Title]\n\n## 🎯 Key Statistics\n- Stat 1: [value + context]\n- Stat 2: [value + context]\n\n## 📌 Main Sections\n### Section 1: [Title]\n[3-4 key points with icons]\n\n### Section 2: [Title]\n[3-4 key points]\n\n## 💡 Key Takeaways\n[5 bullet points]\n\n## 📝 Summary\n[2-3 sentences]`,
    datatable: `${langNote}Generate a well-structured markdown table based on the notebook sources. Create a table with relevant headers and at least 8-10 rows of meaningful data. Use proper markdown table format:\n\n| Column 1 | Column 2 | Column 3 | Column 4 |\n|----------|----------|----------|----------|\n| Data     | Data     | Data     | Data     |\n\nAfter the table, add a brief summary of what the data shows.`,
  };
};

const SRC_ICONS = {
  PDF: FileText,
  WEBSITE: Globe,
  YOUTUBE: Youtube,
  TEXT: FileText,
  AUDIO: Mic,
  IMAGE: FileText,
  DRIVE: Folder,
};
const SRC_COLORS = {
  PDF: "#ef4444",
  WEBSITE: "#2563eb",
  YOUTUBE: "#dc2626",
  TEXT: "#8b5cf6",
  AUDIO: "#059669",
  IMAGE: "#d97706",
  DRIVE: "#0891b2",
};

const detectDark = () => {
  if (document.documentElement.classList.contains("dark")) return true;
  if (document.body.classList.contains("dark")) return true;
  const t =
    document.documentElement.getAttribute("data-theme") ||
    document.body.getAttribute("data-theme");
  if (t === "dark") return true;
  if (t === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

/* ── Editor helpers ── */
function toggleInline(ta, marker, val, set) {
  const s = ta.selectionStart,
    e = ta.selectionEnd,
    sel = val.slice(s, e),
    m = marker.length;
  if (val.slice(s - m, s) === marker && val.slice(e, e + m) === marker) {
    const n = val.slice(0, s - m) + sel + val.slice(e + m);
    set(n);
    requestAnimationFrame(() => {
      ta.selectionStart = s - m;
      ta.selectionEnd = e - m;
      ta.focus();
    });
    return;
  }
  const n = val.slice(0, s) + marker + sel + marker + val.slice(e);
  set(n);
  requestAnimationFrame(() => {
    ta.selectionStart = s + m;
    ta.selectionEnd = e + m;
    ta.focus();
  });
}
function togglePrefix(ta, pfx, val, set) {
  const s = ta.selectionStart,
    e = ta.selectionEnd,
    ls = val.slice(0, s).lastIndexOf("\n") + 1,
    block = val.slice(ls, e),
    lines = block.split("\n"),
    all = lines.every((l) => l.startsWith(pfx)),
    nb = lines
      .map((l) => (all ? l.slice(pfx.length) : l.startsWith(pfx) ? l : pfx + l))
      .join("\n"),
    diff = nb.length - block.length;
  set(val.slice(0, ls) + nb + val.slice(e));
  requestAnimationFrame(() => {
    ta.selectionStart = ls;
    ta.selectionEnd = e + diff;
    ta.focus();
  });
}
function applyHeading(ta, pfx, val, set) {
  const HR = /^(#{1,6} )/,
    s = ta.selectionStart,
    e = ta.selectionEnd,
    ls = val.slice(0, s).lastIndexOf("\n") + 1,
    block = val.slice(ls, e),
    nb = block
      .split("\n")
      .map((l) => {
        const st = l.replace(HR, "");
        return pfx ? pfx + st : st;
      })
      .join("\n"),
    diff = nb.length - block.length;
  set(val.slice(0, ls) + nb + val.slice(e));
  requestAnimationFrame(() => {
    ta.selectionStart = s + diff;
    ta.selectionEnd = e + diff;
    ta.focus();
  });
}
function insertAt(ta, text, val, set) {
  const s = ta.selectionStart;
  set(val.slice(0, s) + text + val.slice(s));
  requestAnimationFrame(() => {
    ta.selectionStart = ta.selectionEnd = s + text.length;
    ta.focus();
  });
}
function insertLink(ta, val, set) {
  const s = ta.selectionStart,
    e = ta.selectionEnd,
    sel = val.slice(s, e) || "Link Text",
    lnk = `[${sel}](https://)`;
  set(val.slice(0, s) + lnk + val.slice(e));
  requestAnimationFrame(() => {
    ta.selectionStart = s;
    ta.selectionEnd = s + lnk.length;
    ta.focus();
  });
}
function numberedList(ta, val, set) {
  const s = ta.selectionStart,
    e = ta.selectionEnd,
    ls = val.slice(0, s).lastIndexOf("\n") + 1,
    block = val.slice(ls, e),
    lines = block.split("\n"),
    all = lines.every((l) => /^\d+\. /.test(l)),
    nb = lines
      .map((l, i) =>
        all
          ? l.replace(/^\d+\. /, "")
          : /^\d+\. /.test(l)
            ? l
            : `${i + 1}. ${l}`,
      )
      .join("\n"),
    diff = nb.length - block.length;
  set(val.slice(0, ls) + nb + val.slice(e));
  requestAnimationFrame(() => {
    ta.selectionStart = ls;
    ta.selectionEnd = e + diff;
    ta.focus();
  });
}

/* ── Toast hook ── */
function useToast() {
  const [toast, setToast] = useState(null);
  const tmr = useRef(null);
  const show = useCallback((msg) => {
    clearTimeout(tmr.current);
    setToast({ msg, key: Date.now() });
    tmr.current = setTimeout(() => setToast(null), 2400);
  }, []);
  return [toast, show];
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
const StudentNotebook = ({ isDark: isDarkProp }) => {
  useEffect(() => {
    injectCSS();
  }, []);

  /* ── Dark mode ── */
  const [isDark, setIsDark] = useState(() =>
    isDarkProp !== undefined ? isDarkProp : detectDark(),
  );
  useEffect(() => {
    const sync = () => setIsDark(detectDark());
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", sync);
    return () => {
      obs.disconnect();
      mq.removeEventListener("change", sync);
    };
  }, []);
  useEffect(() => {
    if (isDarkProp !== undefined) setIsDark(isDarkProp);
  }, [isDarkProp]);

  /* ── Core state ── */
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNBId, setActiveNBId] = useState(null);
  const [activeSectId, setActiveSectId] = useState(null);
  const [activePageId, setActivePageId] = useState(null);
  const [view, setView] = useState("notebooks");

  /* ── Note editor state ── */
  const [localText, setLocalText] = useState("");
  const localRef = useRef("");
  const flushRef = useRef(null);
  const taRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);

  /* ── Chat state ── */
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  /* ── Source state ── */
  const [showAddSrcModal, setShowAddSrcModal] = useState(false);
  const [srcTab, setSrcTab] = useState("file");
  const [srcUrl, setSrcUrl] = useState("");
  const [srcLoading, setSrcLoading] = useState(false);
  const fileInputRef = useRef(null);

  /* ── Studio state ── */
  const [studioLoading, setStudioLoading] = useState(null);
  const [studioResult, setStudioResult] = useState(null);
  const [studioTitle, setStudioTitle] = useState("");
  const [studioKey, setStudioKey] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  /* ── Language ── */
  const [selectedLang, setSelectedLang] = useState("Telugu");

  /* ── Search ── */
  const [searchQ, setSearchQ] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  /* ── Modals ── */
  const [showNewNBModal, setShowNewNBModal] = useState(false);
  const [showNewSectModal, setShowNewSectModal] = useState(false);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState(NB_COLORS[0]);
  const [shareEmail, setShareEmail] = useState("");
  const [toast, showToast] = useToast();

  /* ── Derived ── */
  const activeNB = notebooks.find((n) => n.id === activeNBId);
  const activeSect =
    activeNB?.sections?.find((s) => s.id === activeSectId) ??
    activeNB?.sections?.[0];
  const activePage =
    activeSect?.pages?.find((p) => p.id === activePageId) ??
    activeSect?.pages?.[0];
  const sources = activeNB?.sources ?? [];

  /* ── Load notebooks ── */
  useEffect(() => {
    setLoading(true);
    getMyNotebooks()
      .then((res) => {
        setNotebooks(res.data);
        if (res.data.length > 0) {
          const f = res.data[0];
          setActiveNBId(f.id);
          setActiveSectId(f.sections?.[0]?.id ?? null);
          setActivePageId(f.sections?.[0]?.pages?.[0]?.id ?? null);
        }
      })
      .catch(() => showToast("Failed to load notebooks"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeNB) {
      setActiveSectId(activeNB.sections?.[0]?.id ?? null);
      setActivePageId(activeNB.sections?.[0]?.pages?.[0]?.id ?? null);
      setChatMessages([]);
    }
  }, [activeNBId]);

  useEffect(() => {
    if (activeSect) setActivePageId(activeSect.pages?.[0]?.id ?? null);
  }, [activeSectId]);

  useEffect(() => {
    const v = activePage?.content ?? "";
    setLocalText(v);
    localRef.current = v;
  }, [activePageId, activeSectId, activeNBId]);

  useEffect(() => () => clearTimeout(flushRef.current), []);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  /* ── Stop speech when modal closes ── */
  useEffect(() => {
    if (!studioResult) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [studioResult]);

  /* ── Track speaking state ── */
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(window.speechSynthesis.speaking);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  /* ── Auto-save ── */
  const handleChange = useCallback(
    (e) => {
      const v = e.target.value;
      setLocalText(v);
      localRef.current = v;
      setSaving(true);
      clearTimeout(flushRef.current);
      flushRef.current = setTimeout(async () => {
        if (!activePage?.id) return;
        try {
          const res = await savePage(activePage.id, {
            content: localRef.current,
            title: activePage.title,
          });
          setNotebooks((nbs) =>
            nbs.map((nb) =>
              nb.id !== activeNBId
                ? nb
                : {
                    ...nb,
                    sections: nb.sections.map((s) =>
                      s.id !== activeSect?.id
                        ? s
                        : {
                            ...s,
                            pages: s.pages.map((p) =>
                              p.id !== activePage.id
                                ? p
                                : {
                                    ...p,
                                    content: res.data.content,
                                    updatedAt: res.data.updatedAt,
                                  },
                            ),
                          },
                    ),
                  },
            ),
          );
        } catch {
          showToast("Auto-save failed");
        }
        setSaving(false);
      }, 1200);
    },
    [activeNBId, activeSect?.id, activePage?.id, activePage?.title],
  );

  const doSave = async () => {
    clearTimeout(flushRef.current);
    if (!activePage?.id) return;
    setSaving(true);
    try {
      await savePage(activePage.id, {
        content: localRef.current,
        title: activePage.title,
      });
      showToast("Saved ✓");
    } catch {
      showToast("Save failed");
    }
    setSaving(false);
  };

  /* ── Toolbar helpers ── */
  const ta = () => taRef.current;
  const upd = (v) => {
    setLocalText(v);
    localRef.current = v;
  };
  const bold = () => ta() && toggleInline(ta(), "**", localText, upd);
  const italic = () => ta() && toggleInline(ta(), "_", localText, upd);
  const under = () => ta() && toggleInline(ta(), "__", localText, upd);
  const strike = () => ta() && toggleInline(ta(), "~~", localText, upd);
  const icode = () => ta() && toggleInline(ta(), "`", localText, upd);
  const blist = () => ta() && togglePrefix(ta(), "• ", localText, upd);
  const nlist = () => ta() && numberedList(ta(), localText, upd);
  const bq = () => ta() && togglePrefix(ta(), "> ", localText, upd);
  const cblk = () => ta() && togglePrefix(ta(), "    ", localText, upd);
  const hRule = () => ta() && insertAt(ta(), "\n---\n", localText, upd);
  const chkbox = () => ta() && insertAt(ta(), "☐ ", localText, upd);
  const tbl = () =>
    ta() &&
    insertAt(
      ta(),
      "\n| Col 1 | Col 2 | Col 3 |\n|-------|-------|-------|\n| Cell  | Cell  | Cell  |\n",
      localText,
      upd,
    );
  const lnk = () => ta() && insertLink(ta(), localText, upd);
  const dstamp = () =>
    ta() &&
    insertAt(
      ta(),
      `📅 ${new Date().toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}\n`,
      localText,
      upd,
    );
  const onHdg = (e) => {
    ta() && applyHeading(ta(), e.target.value, localText, upd);
    requestAnimationFrame(() => {
      e.target.value = "";
    });
  };
  const inTag = (tag) => {
    ta() && insertAt(ta(), `[${tag.icon} ${tag.label}] `, localText, upd);
    setShowTagMenu(false);
  };

  /* ── Text-to-Speech ── */
  const speakText = useCallback(
    (text) => {
      window.speechSynthesis.cancel();
      // Strip markdown symbols for cleaner speech
      const clean = text
        .replace(/#{1,6}\s/g, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`{1,3}(.*?)`{1,3}/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/^[-*•]\s/gm, "")
        .replace(/^\d+\.\s/gm, "")
        .replace(/>/g, "")
        .replace(/---/g, "")
        .replace(/\n{2,}/g, ". ")
        .replace(/\n/g, " ")
        .trim();

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 0.92;
      utterance.pitch = 1;
      utterance.volume = 1;

      const langMap = {
        Telugu: "te",
        Hindi: "hi",
        Bengali: "bn",
        Gujarati: "gu",
        Kannada: "kn",
        Malayalam: "ml",
        Marathi: "mr",
        Punjabi: "pa",
        Tamil: "ta",
        English: "en",
      };
      const code = langMap[selectedLang] || "en";

      const trySpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        const match =
          voices.find((v) => v.lang.startsWith(code)) ||
          voices.find((v) => v.lang.startsWith("en"));
        if (match) utterance.voice = match;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      };

      // Voices may not be loaded yet
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          trySpeak();
        };
      } else {
        trySpeak();
      }
    },
    [selectedLang],
  );

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  /* ── Chat ── */
  const sendChat = async () => {
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: msg },
    ]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await notebookChat({ notebookId: activeNBId, message: msg });
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", content: res.data.reply },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          content: "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    }
    setChatLoading(false);
  };

  const handleChatKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    }
  };

  /* ── Sources ── */
  const handleAddUrl = async () => {
    if (!srcUrl.trim() || !activeNBId) return;
    setSrcLoading(true);
    try {
      const res = await addUrlSource(activeNBId, srcUrl.trim());
      setNotebooks((nbs) =>
        nbs.map((nb) => (nb.id === activeNBId ? res.data : nb)),
      );
      setSrcUrl("");
      setShowAddSrcModal(false);
      showToast("Source added");
    } catch {
      showToast("Failed to add source");
    }
    setSrcLoading(false);
  };

  const handleAddFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeNBId) return;
    setSrcLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await addFileSource(activeNBId, fd);
      setNotebooks((nbs) =>
        nbs.map((nb) => (nb.id === activeNBId ? res.data : nb)),
      );
      setShowAddSrcModal(false);
      showToast("Source added");
    } catch {
      showToast("Failed to upload file");
    }
    setSrcLoading(false);
  };

  const handleDeleteSource = async (id) => {
    try {
      const res = await deleteSource(id);
      setNotebooks((nbs) =>
        nbs.map((nb) => (nb.id === activeNBId ? res.data : nb)),
      );
      showToast("Source removed");
    } catch {
      showToast("Failed to remove source");
    }
  };

  /* ── Studio — with TTS for audio/video ── */
  const handleStudio = async (item) => {
    if (!activeNBId) return;
    setStudioLoading(item.key);
    setStudioTitle(item.label);
    setStudioKey(item.key);
    setStudioResult(null);
    stopSpeech();
    try {
      const prompts = buildStudioPrompts(selectedLang);
      const prompt =
        prompts[item.key] ||
        `Generate a comprehensive ${item.label} based on all the sources in this notebook. Respond entirely in ${selectedLang} language. Be thorough and well-structured.`;
      const res = await notebookChat({
        notebookId: activeNBId,
        message: prompt,
      });
      const reply = res.data.reply;
      setStudioResult(reply);
      // Auto-speak for audio and video
      if (item.key === "audio" || item.key === "video") {
        speakText(reply);
      }
    } catch {
      showToast(`Failed to generate ${item.label}`);
    }
    setStudioLoading(null);
  };

  /* ── NB CRUD ── */
  const addNB = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await createNotebook({
        title: newTitle.trim(),
        color: newColor,
        icon: "book",
      });
      setNotebooks((nbs) => [...nbs, res.data]);
      setActiveNBId(res.data.id);
      setView("lm");
      setShowNewNBModal(false);
      setNewTitle("");
      setNewColor(NB_COLORS[0]);
      showToast(`"${res.data.title}" created`);
    } catch {
      showToast("Failed to create notebook");
    }
  };

  const delNB = async (id) => {
    if (notebooks.length <= 1) {
      showToast("Can't delete last notebook");
      return;
    }
    if (!window.confirm("Delete this notebook?")) return;
    try {
      await deleteNotebook(id);
      const nbs = notebooks.filter((n) => n.id !== id);
      setNotebooks(nbs);
      setActiveNBId(nbs[0].id);
      showToast("Notebook deleted");
    } catch {
      showToast("Delete failed");
    }
  };

  const addSect = async () => {
    if (!newTitle.trim() || !activeNBId) return;
    try {
      const res = await addSection({
        title: newTitle.trim(),
        color: newColor,
        notebookId: activeNBId,
      });
      setNotebooks((nbs) =>
        nbs.map((nb) => (nb.id === activeNBId ? res.data : nb)),
      );
      const ns = res.data.sections[res.data.sections.length - 1];
      setActiveSectId(ns.id);
      setShowNewSectModal(false);
      setNewTitle("");
      setNewColor(SEC_COLORS[0]);
      showToast("Section created");
    } catch {
      showToast("Failed to create section");
    }
  };

  const delSect = async (id) => {
    if ((activeNB?.sections?.length ?? 0) <= 1) {
      showToast("Can't delete last section");
      return;
    }
    if (!window.confirm("Delete section?")) return;
    try {
      const res = await deleteSection(id);
      setNotebooks((nbs) =>
        nbs.map((nb) => (nb.id === activeNBId ? res.data : nb)),
      );
      showToast("Deleted");
    } catch (e) {
      showToast(e?.response?.data?.message ?? "Delete failed");
    }
  };

  const addPg = async () => {
    if (!activeSect?.id) return;
    try {
      const res = await addPage({
        title: newTitle.trim() || null,
        sectionId: activeSect.id,
      });
      setNotebooks((nbs) =>
        nbs.map((nb) => (nb.id === activeNBId ? res.data : nb)),
      );
      const us = res.data.sections.find((s) => s.id === activeSect.id);
      const np = us?.pages[us.pages.length - 1];
      if (np) setActivePageId(np.id);
      setShowNewPageModal(false);
      setNewTitle("");
      showToast("Page added");
    } catch {
      showToast("Failed to add page");
    }
  };

  const delPg = async (id) => {
    if ((activeSect?.pages?.length ?? 0) <= 1) {
      showToast("Can't delete last page");
      return;
    }
    if (!window.confirm("Delete page?")) return;
    try {
      const res = await deletePage(id);
      setNotebooks((nbs) =>
        nbs.map((nb) => (nb.id === activeNBId ? res.data : nb)),
      );
      showToast("Deleted");
    } catch (e) {
      showToast(e?.response?.data?.message ?? "Delete failed");
    }
  };

  const renPg = async (id) => {
    const t = window.prompt(
      "Rename:",
      activeSect?.pages?.find((p) => p.id === id)?.title ?? "",
    );
    if (!t?.trim()) return;
    try {
      const res = await savePage(id, { title: t.trim() });
      setNotebooks((nbs) =>
        nbs.map((nb) =>
          nb.id !== activeNBId
            ? nb
            : {
                ...nb,
                sections: nb.sections.map((s) =>
                  s.id !== activeSect?.id
                    ? s
                    : {
                        ...s,
                        pages: s.pages.map((p) =>
                          p.id !== id ? p : { ...p, title: res.data.title },
                        ),
                      },
                ),
              },
        ),
      );
      showToast("Renamed");
    } catch {
      showToast("Rename failed");
    }
  };

  const doExport = () => {
    const b = new Blob([localText], { type: "text/plain" });
    const u = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = u;
    a.download = `${activePage?.title ?? "notes"}.md`;
    a.click();
    URL.revokeObjectURL(u);
    showToast("Exported as .md");
  };

  const doShare = () => {
    if (!shareEmail.trim()) return;
    showToast(`Shared with ${shareEmail}`);
    setShareEmail("");
    setShowShareModal(false);
  };

  /* ── Search ── */
  const searchRes =
    searchQ.length > 1
      ? notebooks.flatMap(
          (nb) =>
            nb.sections?.flatMap(
              (s) =>
                s.pages
                  ?.filter(
                    (p) =>
                      p.title?.toLowerCase().includes(searchQ.toLowerCase()) ||
                      p.content?.toLowerCase().includes(searchQ.toLowerCase()),
                  )
                  .map((p) => ({ nb, section: s, page: p })) ?? [],
            ) ?? [],
        )
      : [];

  const wc = localText.trim() ? localText.trim().split(/\s+/).length : 0;
  const totalSects = notebooks.reduce(
    (a, nb) => a + (nb.sections?.length ?? 0),
    0,
  );
  const totalPgs = notebooks.reduce(
    (a, nb) =>
      a + (nb.sections?.reduce((b, s) => b + (s.pages?.length ?? 0), 0) ?? 0),
    0,
  );
  const dm = isDark ? "snblm dark" : "snblm";

  /* ── Sub-components ── */
  const TBtn = ({ icon: Icon, tip, onClick, active = false }) => (
    <button
      className={`snblm-tbtn${active ? " active" : ""}`}
      onClick={onClick}
    >
      <Icon size={13} strokeWidth={2.2} />
      {tip && <span className="tip">{tip}</span>}
    </button>
  );

  const ColorPicker = ({ colors, selected, onSelect }) => (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          style={{
            width: 20,
            height: 20,
            borderRadius: 5,
            background: c,
            border: "none",
            cursor: "pointer",
            boxShadow:
              selected === c
                ? `0 0 0 3px ${isDark ? "#13161f" : "white"}, 0 0 0 5px ${c}`
                : "none",
            transition: "box-shadow .15s",
          }}
        />
      ))}
    </div>
  );

  const renderTopBar = (leftContent, rightContent) => (
    <div className="snblm-topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {leftContent}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {rightContent}
      </div>
    </div>
  );

  /* ── LOADING ── */
  if (loading)
    return (
      <div className={`${dm} snblm-loading`}>
        <Loader2 size={22} color="var(--accent)" className="snblm-spin" />
        <span
          style={{
            fontSize: 12,
            color: "var(--text3)",
            fontFamily: "Poppins,sans-serif",
          }}
        >
          Loading notebooks…
        </span>
      </div>
    );

  /* ══════════════════════
     NOTEBOOKS VIEW
  ══════════════════════ */
  if (view === "notebooks")
    return (
      <div className={`${dm} snblm-root`}>
        {toast && (
          <div key={toast.key} className="snblm-toast">
            {toast.msg}
          </div>
        )}

        {renderTopBar(
          <div className="snblm-breadcrumb">
            <BookMarked size={13} color="var(--accent)" strokeWidth={2.2} />
            <span>Learning Materials</span>
            <ChevronRight size={11} strokeWidth={2} />
            <span className="snblm-breadcrumb-active">Notebook</span>
          </div>,
          <>
            <div style={{ position: "relative" }}>
              <div className="snblm-search" style={{ width: 200 }}>
                <Search size={12} color="var(--text3)" strokeWidth={2} />
                <input
                  placeholder="Search notes…"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  onFocus={() => setShowSearch(true)}
                  onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                />
                {searchQ && (
                  <button
                    onClick={() => setSearchQ("")}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "var(--text3)",
                      display: "flex",
                    }}
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
              {showSearch && searchRes.length > 0 && (
                <div className="snblm-search-results">
                  {searchRes.slice(0, 5).map(({ nb, section, page }) => (
                    <button
                      key={page.id}
                      className="snblm-search-item"
                      onMouseDown={() => {
                        setActiveNBId(nb.id);
                        setActiveSectId(section.id);
                        setActivePageId(page.id);
                        setView("notes");
                        setSearchQ("");
                        setShowSearch(false);
                      }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 6,
                          background: `${nb.color}20`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FileText size={11} color={nb.color} strokeWidth={2} />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "var(--text)",
                          }}
                        >
                          {page.title}
                        </div>
                        <div style={{ fontSize: 9, color: "var(--text3)" }}>
                          {nb.title} › {section.title}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              className="snblm-btn"
              onClick={() => {
                setNewTitle("");
                setNewColor(NB_COLORS[0]);
                setShowNewNBModal(true);
              }}
            >
              <Plus size={12} strokeWidth={2.5} /> New Notebook
            </button>
          </>,
        )}

        <div className="snblm-content snblm-scroll">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div>
              <div className="snblm-lbl">STUDENT NOTEBOOK</div>
              <h1 className="snblm-pg-title">My Notebooks</h1>
              <p className="snblm-pg-sub">
                Your classroom &amp; AI-powered note-taking workspace
              </p>
            </div>
            <div className="snblm-pills">
              <div className="snblm-pill">
                <BookOpen size={11} color="var(--accent)" strokeWidth={2.2} />
                <b>{notebooks.length}</b> Notebooks
              </div>
              <div className="snblm-pill">
                <Folder size={11} color="var(--accent)" strokeWidth={2.2} />
                <b>{totalSects}</b> Sections
              </div>
              <div className="snblm-pill">
                <FileText size={11} color="var(--accent)" strokeWidth={2.2} />
                <b>{totalPgs}</b> Pages
              </div>
            </div>
          </div>

          <div className="snblm-grid">
            {notebooks.map((nb, idx) => (
              <div
                key={nb.id}
                className="snblm-nb-card"
                style={{ animationDelay: `${idx * 0.05}s` }}
                onClick={() => {
                  setActiveNBId(nb.id);
                  setView("lm");
                }}
              >
                <div
                  className="snblm-nb-stripe"
                  style={{ background: nb.color }}
                />
                <div className="snblm-nb-body">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      className="snblm-nb-icon"
                      style={{ background: `${nb.color}20` }}
                    >
                      <BookOpen size={15} color={nb.color} strokeWidth={2.2} />
                    </div>
                    <button
                      className="snblm-del-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        delNB(nb.id);
                      }}
                    >
                      <Trash2 size={12} strokeWidth={2} />
                    </button>
                  </div>
                  <p className="snblm-nb-name">{nb.title}</p>
                  <p className="snblm-nb-meta">
                    {nb.sectionCount} section{nb.sectionCount !== 1 ? "s" : ""}{" "}
                    · {nb.pageCount} page{nb.pageCount !== 1 ? "s" : ""} ·{" "}
                    {nb.sourceCount ?? 0} source
                    {(nb.sourceCount ?? 0) !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="snblm-nb-foot">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: nb.color,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 9,
                        color: "var(--text3)",
                        fontWeight: 500,
                      }}
                    >
                      Active
                    </span>
                  </div>
                  <ChevronRight
                    size={12}
                    color="var(--text4)"
                    strokeWidth={2}
                  />
                </div>
              </div>
            ))}
            <div
              className="snblm-add-card"
              onClick={() => {
                setNewTitle("");
                setNewColor(NB_COLORS[0]);
                setShowNewNBModal(true);
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: "var(--accent-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Plus size={17} color="var(--accent)" strokeWidth={2} />
              </div>
              <span>New Notebook</span>
            </div>
          </div>
        </div>

        {showNewNBModal && (
          <div
            className="snblm-overlay"
            onClick={() => setShowNewNBModal(false)}
          >
            <div className="snblm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="snblm-modal-title">
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 7,
                    background: "var(--accent-bg2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BookOpen size={14} color="var(--accent)" strokeWidth={2.2} />
                </div>
                New Notebook
              </div>
              <input
                className="snblm-inp"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Notebook name…"
                onKeyDown={(e) => e.key === "Enter" && addNB()}
                autoFocus
              />
              <p className="snblm-clr-lbl">Choose colour</p>
              <ColorPicker
                colors={NB_COLORS}
                selected={newColor}
                onSelect={setNewColor}
              />
              <div className="snblm-modal-actions">
                <button
                  className="snblm-cancel"
                  onClick={() => setShowNewNBModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="snblm-btn"
                  style={{ flex: 2 }}
                  onClick={addNB}
                >
                  Create Notebook
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );

  /* ══════════════════════
     NOTEBOOKLM VIEW (3-panel)
  ══════════════════════ */
  if (view === "lm")
    return (
      <div className={`${dm} snblm-root`}>
        {toast && (
          <div key={toast.key} className="snblm-toast">
            {toast.msg}
          </div>
        )}

        {renderTopBar(
          <>
            <button
              className="snblm-back-btn"
              onClick={() => setView("notebooks")}
            >
              <ArrowLeft size={12} strokeWidth={2.2} /> All Notebooks
            </button>
            <div className="snblm-breadcrumb">
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: activeNB?.color ?? "var(--accent)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: "var(--text)",
                  fontWeight: 700,
                  maxWidth: 140,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {activeNB?.title}
              </span>
            </div>
          </>,
          <>
            <button
              className="snblm-btn-ghost"
              onClick={() => setView("notes")}
            >
              <StickyNote size={12} strokeWidth={2} /> Notes
            </button>
            <button
              className="snblm-btn-ghost"
              onClick={() => setShowShareModal(true)}
            >
              <Share2 size={12} strokeWidth={2} /> Share
            </button>
          </>,
        )}

        <div className="snblm-lm-body">
          {/* ── LEFT: Sources ── */}
          <div className="snblm-sources">
            <div className="snblm-sources-hdr">
              <span>Sources</span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: "var(--text3)",
                  background: "var(--surface2)",
                  padding: "2px 7px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                }}
              >
                {sources.length}
              </span>
            </div>
            <div className="snblm-sources-search">
              <Globe size={11} color="var(--text3)" strokeWidth={2} />
              <input
                placeholder="Search the web for new sources"
                readOnly
                onClick={() => {
                  setSrcTab("url");
                  setShowAddSrcModal(true);
                }}
                style={{ cursor: "pointer" }}
              />
            </div>
            {sources.length === 0 ? (
              <div className="snblm-sources-empty">
                <FileText size={30} color="var(--text4)" strokeWidth={1.5} />
                <p>Saved sources will appear here</p>
                <small>
                  Click Add source below to add PDFs, websites, text, videos, or
                  audio files.
                </small>
              </div>
            ) : (
              <div className="snblm-sources-list snblm-scroll">
                {sources.map((src) => {
                  const Icon = SRC_ICONS[src.sourceType] ?? FileText;
                  const color = SRC_COLORS[src.sourceType] ?? "var(--accent)";
                  return (
                    <div key={src.id} className="snblm-src-item">
                      <div
                        className="snblm-src-icon"
                        style={{ background: `${color}18` }}
                      >
                        <Icon size={13} color={color} strokeWidth={2} />
                      </div>
                      <div className="snblm-src-info">
                        <div className="snblm-src-name">{src.title}</div>
                        <div className="snblm-src-type">{src.sourceType}</div>
                      </div>
                      <button
                        className="snblm-src-del"
                        onClick={() => handleDeleteSource(src.id)}
                      >
                        <X size={11} strokeWidth={2} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="snblm-sources-foot">
              <button
                className="snblm-add-src-btn"
                onClick={() => setShowAddSrcModal(true)}
              >
                <Plus size={13} strokeWidth={2.5} /> Add sources
              </button>
            </div>
          </div>

          {/* ── CENTER: Chat ── */}
          <div className="snblm-chat">
            <div className="snblm-chat-hdr">
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MessageSquare
                  size={14}
                  color="var(--accent)"
                  strokeWidth={2.2}
                />{" "}
                Chat
              </div>
            </div>
            <div className="snblm-chat-msgs snblm-scroll">
              {chatMessages.length === 0 ? (
                <div className="snblm-chat-welcome">
                  <div className="snblm-chat-welcome-icon">
                    <BookOpen
                      size={28}
                      color="var(--accent)"
                      strokeWidth={1.8}
                    />
                  </div>
                  <h2>{activeNB?.title}</h2>
                  <p>
                    {sources.length} source{sources.length !== 1 ? "s" : ""} ·{" "}
                    {activePage?.updatedAt
                      ? new Date(activePage.updatedAt).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )
                      : "No pages yet"}
                  </p>
                  <p style={{ marginTop: 6, maxWidth: 320, lineHeight: 1.6 }}>
                    Add sources and start chatting. Ask questions, get
                    summaries, generate study materials.
                  </p>
                </div>
              ) : (
                chatMessages.map((m) => (
                  <div key={m.id} className={`snblm-msg ${m.role}`}>
                    <div className="snblm-msg-avatar">
                      {m.role === "user" ? (
                        "U"
                      ) : (
                        <BookOpen size={13} strokeWidth={2} />
                      )}
                    </div>
                    <div className="snblm-msg-bubble">
                      {m.role === "ai" ? (
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="snblm-msg ai">
                  <div className="snblm-msg-avatar">
                    <BookOpen size={13} strokeWidth={2} />
                  </div>
                  <div className="snblm-msg-bubble">
                    <div className="snblm-chat-typing">
                      <div className="snblm-typing-dot" />
                      <div className="snblm-typing-dot" />
                      <div className="snblm-typing-dot" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="snblm-chat-input-row">
              <textarea
                className="snblm-chat-input"
                placeholder="Start typing…"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleChatKey}
                rows={1}
              />
              <span className="snblm-chat-src-count">
                {sources.length} source{sources.length !== 1 ? "s" : ""}
              </span>
              <button
                className="snblm-send-btn"
                onClick={sendChat}
                disabled={!chatInput.trim() || chatLoading}
              >
                <Send size={14} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* ── RIGHT: Studio ── */}
          <div className="snblm-studio snblm-scroll">
            <div className="snblm-studio-hdr">
              Studio{" "}
              <ChevronRight size={12} color="var(--text3)" strokeWidth={2} />
              <span
                style={{
                  fontSize: 9,
                  color: "var(--text3)",
                  fontWeight: 500,
                  marginLeft: "auto",
                }}
              >
                Note
              </span>
            </div>

            <div className="snblm-studio-banner">
              <p>
                Create an Audio Overview in:{" "}
                <span
                  style={{
                    fontSize: 9,
                    color: "var(--accent)",
                    fontWeight: 500,
                  }}
                >
                  (selected: <b>{selectedLang}</b>)
                </span>
              </p>
              <div className="snblm-studio-banner-langs">
                {LANG_OPTIONS.map((lang) => (
                  <span
                    key={lang.name}
                    className={`snblm-lang-chip${selectedLang === lang.name ? " selected" : ""}`}
                    onClick={() => {
                      setSelectedLang(lang.name);
                      showToast(`Language set to ${lang.name}`);
                    }}
                  >
                    {lang.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="snblm-studio-grid">
              {STUDIO_ITEMS.map((item) => (
                <button
                  key={item.key}
                  className="snblm-studio-btn"
                  onClick={() => handleStudio(item)}
                  disabled={studioLoading === item.key}
                >
                  {studioLoading === item.key ? (
                    <Loader2
                      size={18}
                      color="var(--accent)"
                      className="snblm-spin"
                    />
                  ) : (
                    <item.icon
                      size={18}
                      color="var(--text3)"
                      strokeWidth={1.8}
                    />
                  )}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <button
              className="snblm-add-note-btn"
              onClick={() => setView("notes")}
            >
              <StickyNote size={13} strokeWidth={2} /> Add note
            </button>
          </div>
        </div>

        {/* Add Source Modal */}
        {showAddSrcModal && (
          <div
            className="snblm-overlay"
            onClick={() => setShowAddSrcModal(false)}
          >
            <div
              className="snblm-modal snblm-modal-wide"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="snblm-modal-title">
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 7,
                    background: "var(--accent-bg2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Plus size={14} color="var(--accent)" strokeWidth={2.5} />
                </div>
                Add Source
              </div>
              <div className="snblm-src-tabs">
                {[
                  { key: "file", icon: Upload, label: "Upload file" },
                  { key: "url", icon: Globe, label: "Website" },
                  { key: "yt", icon: Youtube, label: "YouTube" },
                ].map((t) => (
                  <button
                    key={t.key}
                    className={`snblm-src-tab${srcTab === t.key ? " active" : ""}`}
                    onClick={() => setSrcTab(t.key)}
                  >
                    <t.icon size={11} strokeWidth={2} /> {t.label}
                  </button>
                ))}
              </div>
              {srcTab === "file" && (
                <>
                  <div
                    className="snblm-drop-zone"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={24} color="var(--accent)" strokeWidth={1.8} />
                    <p>Drop your files here or click to browse</p>
                    <small>PDF, images, docs, audio, and more</small>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="snblm-file-input"
                    accept=".pdf,.txt,.doc,.docx,.png,.jpg,.mp3,.mp4"
                    onChange={handleAddFile}
                  />
                </>
              )}
              {(srcTab === "url" || srcTab === "yt") && (
                <div style={{ display: "flex", gap: 7 }}>
                  <input
                    className="snblm-inp"
                    style={{ flex: 1 }}
                    value={srcUrl}
                    onChange={(e) => setSrcUrl(e.target.value)}
                    placeholder={
                      srcTab === "yt" ? "YouTube URL…" : "https://example.com"
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
                    autoFocus
                  />
                  <button
                    className="snblm-btn"
                    onClick={handleAddUrl}
                    disabled={srcLoading}
                  >
                    {srcLoading ? (
                      <Loader2 size={12} className="snblm-spin" />
                    ) : (
                      <Plus size={12} />
                    )}
                  </button>
                </div>
              )}
              <div className="snblm-modal-actions" style={{ marginTop: 14 }}>
                <button
                  className="snblm-cancel"
                  onClick={() => setShowAddSrcModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Studio Output Modal */}
        {studioResult && (
          <div className="snblm-overlay" onClick={() => setStudioResult(null)}>
            <div
              className="snblm-modal snblm-modal-wide"
              style={{ width: 560 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="snblm-modal-title">
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 7,
                    background: "var(--accent-bg2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {(() => {
                    const item = STUDIO_ITEMS.find((i) => i.key === studioKey);
                    return item ? (
                      <item.icon
                        size={14}
                        color="var(--accent)"
                        strokeWidth={2}
                      />
                    ) : (
                      <Brain size={14} color="var(--accent)" strokeWidth={2} />
                    );
                  })()}
                </div>
                {studioTitle}{" "}
                <span
                  style={{
                    fontSize: 10,
                    color: "var(--text3)",
                    fontWeight: 500,
                  }}
                >
                  · {selectedLang}
                </span>
                {/* Speaking indicator */}
                {(studioKey === "audio" || studioKey === "video") &&
                  isSpeaking && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginLeft: "auto",
                        padding: "3px 10px",
                        borderRadius: 12,
                        background: "var(--accent-bg2)",
                        border: "1px solid var(--accent-bdr)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          gap: 1,
                          height: 14,
                        }}
                      >
                        <div
                          className="snblm-speaking-bar"
                          style={{ height: 6 }}
                        />
                        <div
                          className="snblm-speaking-bar"
                          style={{ height: 10 }}
                        />
                        <div
                          className="snblm-speaking-bar"
                          style={{ height: 14 }}
                        />
                        <div
                          className="snblm-speaking-bar"
                          style={{ height: 8 }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: "var(--accent)",
                        }}
                      >
                        Speaking…
                      </span>
                    </div>
                  )}
              </div>
              <div className="snblm-studio-out snblm-scroll">
                <ReactMarkdown>{studioResult}</ReactMarkdown>
              </div>
              <div className="snblm-modal-actions">
                <button
                  className="snblm-cancel"
                  onClick={() => {
                    setStudioResult(null);
                    stopSpeech();
                  }}
                >
                  Close
                </button>
                {(studioKey === "audio" || studioKey === "video") && (
                  <>
                    {isSpeaking ? (
                      <button
                        className="snblm-btn-ghost"
                        style={{ flex: 1 }}
                        onClick={stopSpeech}
                      >
                        ⏹ Stop
                      </button>
                    ) : (
                      <button
                        className="snblm-btn-ghost"
                        style={{ flex: 1 }}
                        onClick={() => speakText(studioResult)}
                      >
                        <Volume2 size={12} /> Replay
                      </button>
                    )}
                  </>
                )}
                <button
                  className="snblm-btn"
                  style={{ flex: 2 }}
                  onClick={() =>
                    navigator.clipboard
                      .writeText(studioResult)
                      .then(() => showToast("Copied!"))
                  }
                >
                  <Copy size={12} /> Copy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div
            className="snblm-overlay"
            onClick={() => setShowShareModal(false)}
          >
            <div className="snblm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="snblm-modal-title">
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 7,
                    background: "var(--accent-bg2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Share2 size={14} color="var(--accent)" strokeWidth={2.2} />
                </div>
                Share Notebook
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text2)",
                  marginBottom: 10,
                }}
              >
                Sharing:{" "}
                <b style={{ color: "var(--text)" }}>{activeNB?.title}</b>
              </p>
              <input
                className="snblm-inp"
                type="email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                placeholder="Enter email address…"
                onKeyDown={(e) => e.key === "Enter" && doShare()}
                autoFocus
              />
              <div className="snblm-modal-actions">
                <button
                  className="snblm-cancel"
                  onClick={() => setShowShareModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="snblm-btn"
                  style={{ flex: 2 }}
                  onClick={doShare}
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );

  /* ══════════════════════
     NOTES EDITOR VIEW
  ══════════════════════ */
  return (
    <div className={`${dm} snblm-root`}>
      {toast && (
        <div key={toast.key} className="snblm-toast">
          {toast.msg}
        </div>
      )}

      {renderTopBar(
        <>
          <button className="snblm-back-btn" onClick={() => setView("lm")}>
            <ArrowLeft size={12} strokeWidth={2.2} /> AI Workspace
          </button>
          <div className="snblm-breadcrumb">
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: activeNB?.color ?? "var(--accent)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: "var(--text)",
                fontWeight: 700,
                maxWidth: 110,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {activeNB?.title}
            </span>
            <ChevronRight size={11} strokeWidth={2} />
            <span
              style={{
                maxWidth: 80,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {activeSect?.title}
            </span>
            <ChevronRight size={11} strokeWidth={2} />
            <span
              className="snblm-breadcrumb-active"
              style={{
                maxWidth: 80,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {activePage?.title}
            </span>
          </div>
        </>,
        <>
          <div style={{ position: "relative" }}>
            <div className="snblm-search" style={{ width: 180 }}>
              <Search size={11} color="var(--text3)" strokeWidth={2} />
              <input
                placeholder="Search…"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                onFocus={() => setShowSearch(true)}
                onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              />
              {searchQ && (
                <button
                  onClick={() => setSearchQ("")}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "var(--text3)",
                    display: "flex",
                  }}
                >
                  <X size={10} />
                </button>
              )}
            </div>
            {showSearch && searchRes.length > 0 && (
              <div className="snblm-search-results">
                {searchRes.slice(0, 4).map(({ nb, section, page }) => (
                  <button
                    key={page.id}
                    className="snblm-search-item"
                    onMouseDown={() => {
                      setActiveNBId(nb.id);
                      setActiveSectId(section.id);
                      setActivePageId(page.id);
                      setSearchQ("");
                      setShowSearch(false);
                    }}
                  >
                    <FileText size={11} color={nb.color} strokeWidth={2} />
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: "var(--text)",
                        }}
                      >
                        {page.title}
                      </div>
                      <div style={{ fontSize: 9, color: "var(--text3)" }}>
                        {nb.title} › {section.title}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            className="snblm-icon-btn"
            onClick={() => setShowShareModal(true)}
          >
            <Share2 size={14} strokeWidth={2} />
          </button>
          <button className="snblm-icon-btn" onClick={doExport}>
            <Download size={14} strokeWidth={2} />
          </button>
          <button
            className="snblm-icon-btn"
            onClick={() =>
              navigator.clipboard
                .writeText(localText)
                .then(() => showToast("Copied!"))
            }
          >
            <Copy size={14} strokeWidth={2} />
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 9px",
              borderRadius: 12,
              background: "var(--surface2)",
              border: "1px solid var(--border)",
            }}
          >
            <div className={`snblm-status-dot${saving ? " saving" : ""}`} />
            <span
              style={{ fontSize: 9, fontWeight: 600, color: "var(--text3)" }}
            >
              {saving ? "Saving…" : "Saved"}
            </span>
          </div>
          <button className="snblm-btn" onClick={doSave}>
            <Save size={11} strokeWidth={2.2} /> Save
          </button>
        </>,
      )}

      {/* Section tabs */}
      <div className="snblm-sec-tabs snblm-scroll">
        {activeNB?.sections?.map((s) => {
          const act = s.id === activeSect?.id;
          return (
            <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
              <button
                className={`snblm-sec-tab${act ? " active" : ""}`}
                style={{
                  color: act ? s.color : "var(--text3)",
                  borderBottomColor: act ? s.color : "transparent",
                }}
                onClick={() => setActiveSectId(s.id)}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: s.color,
                    flexShrink: 0,
                  }}
                />
                {s.title}
              </button>
              {act && (
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text4)",
                    display: "flex",
                    padding: "0 2px",
                  }}
                  onClick={() => delSect(s.id)}
                >
                  <X size={9} strokeWidth={2} />
                </button>
              )}
            </div>
          );
        })}
        <button
          className="snblm-sec-tab"
          style={{ color: "var(--text3)", borderBottomColor: "transparent" }}
          onClick={() => {
            setNewTitle("");
            setNewColor(
              SEC_COLORS[(activeNB?.sections?.length ?? 0) % SEC_COLORS.length],
            );
            setShowNewSectModal(true);
          }}
        >
          <Plus size={10} strokeWidth={2.5} /> Add Section
        </button>
      </div>

      <div className="snblm-note-body">
        {/* Page sidebar */}
        <div className="snblm-note-sidebar snblm-scroll">
          {activeSect?.pages?.map((p) => {
            const act = p.id === activePage?.id;
            return (
              <div
                key={p.id}
                style={{ position: "relative" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget.querySelector(".pg-act");
                  if (el) el.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget.querySelector(".pg-act");
                  if (el) el.style.opacity = "0";
                }}
              >
                <button
                  className={`snblm-note-pg-item${act ? " active" : ""}`}
                  onClick={() => setActivePageId(p.id)}
                >
                  <FileText
                    size={10}
                    strokeWidth={2}
                    style={{ flexShrink: 0 }}
                  />
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {p.title}
                  </span>
                </button>
                <div
                  className="pg-act"
                  style={{
                    position: "absolute",
                    right: 4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    gap: 1,
                    opacity: 0,
                    transition: "opacity .15s",
                    background: "var(--surface2)",
                    borderRadius: 5,
                    padding: 2,
                  }}
                >
                  <button
                    onClick={() => renPg(p.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text3)",
                      display: "flex",
                      padding: 2,
                    }}
                  >
                    <Edit3 size={9} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => delPg(p.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text3)",
                      display: "flex",
                      padding: 2,
                    }}
                  >
                    <Trash2 size={9} strokeWidth={2} />
                  </button>
                </div>
              </div>
            );
          })}
          <button
            className="snblm-note-pg-item"
            onClick={() => {
              setNewTitle("");
              setShowNewPageModal(true);
            }}
          >
            <Plus size={10} strokeWidth={2.5} style={{ flexShrink: 0 }} /> Add
            page
          </button>
        </div>

        {/* Editor panel */}
        <div className="snblm-note-panel">
          <div className="snblm-note-title-row">
            <input
              className="snblm-note-title-inp"
              value={activePage?.title ?? ""}
              onChange={(e) => {
                const t = e.target.value;
                setNotebooks((nbs) =>
                  nbs.map((nb) =>
                    nb.id !== activeNBId
                      ? nb
                      : {
                          ...nb,
                          sections: nb.sections.map((s) =>
                            s.id !== activeSect?.id
                              ? s
                              : {
                                  ...s,
                                  pages: s.pages.map((p) =>
                                    p.id !== activePage?.id
                                      ? p
                                      : { ...p, title: t },
                                  ),
                                },
                          ),
                        },
                  ),
                );
              }}
              onBlur={async (e) => {
                if (activePage?.id) {
                  try {
                    await savePage(activePage.id, {
                      title: e.target.value,
                      content: localRef.current,
                    });
                  } catch {
                    showToast("Failed to save title");
                  }
                }
              }}
              placeholder="Page title…"
            />
            <div className="snblm-note-date">
              <Clock size={9} color="var(--text4)" strokeWidth={2} />
              <span>
                {activePage?.updatedAt
                  ? new Date(activePage.updatedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : ""}
              </span>
            </div>
          </div>

          <div className="snblm-toolbar">
            <select className="snblm-hdg-sel" defaultValue="" onChange={onHdg}>
              <option value="" disabled>
                ¶
              </option>
              <option value="# ">H1</option>
              <option value="## ">H2</option>
              <option value="### ">H3</option>
              <option value="">Normal</option>
            </select>
            <div className="snblm-tsep" />
            <TBtn icon={Bold} tip="Bold" onClick={bold} />
            <TBtn icon={Italic} tip="Italic" onClick={italic} />
            <TBtn icon={Underline} tip="Underline" onClick={under} />
            <TBtn icon={Strikethrough} tip="Strikethrough" onClick={strike} />
            <TBtn icon={Code} tip="Inline code" onClick={icode} />
            <div className="snblm-tsep" />
            <TBtn icon={List} tip="Bullet list" onClick={blist} />
            <TBtn icon={ListOrdered} tip="Numbered list" onClick={nlist} />
            <TBtn icon={CheckSquare} tip="Checkbox" onClick={chkbox} />
            <TBtn icon={Quote} tip="Blockquote" onClick={bq} />
            <div className="snblm-tsep" />
            <TBtn icon={Code2} tip="Code block" onClick={cblk} />
            <TBtn icon={Table} tip="Table" onClick={tbl} />
            <TBtn icon={Link} tip="Link" onClick={lnk} />
            <TBtn icon={Minus} tip="Divider" onClick={hRule} />
            <TBtn icon={Calendar} tip="Date stamp" onClick={dstamp} />
            <div className="snblm-tsep" />
            <div style={{ position: "relative" }}>
              <TBtn
                icon={Tag}
                tip="Tag"
                onClick={() => setShowTagMenu((v) => !v)}
                active={showTagMenu}
              />
              {showTagMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "110%",
                    left: 0,
                    zIndex: 50,
                    background: "var(--modal)",
                    border: "1px solid var(--border2)",
                    borderRadius: 10,
                    padding: 6,
                    width: 150,
                    boxShadow: "0 8px 24px rgba(0,0,0,.18)",
                  }}
                >
                  {TAG_OPTIONS.map((tag) => (
                    <button
                      key={tag.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        width: "100%",
                        border: "none",
                        background: "transparent",
                        padding: "5px 7px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontFamily: "Poppins,sans-serif",
                        fontSize: 10,
                        fontWeight: 600,
                        color: tag.color,
                        textAlign: "left",
                      }}
                      onClick={() => inTag(tag)}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = tag.bg)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <span style={{ fontSize: 12 }}>{tag.icon}</span>{" "}
                      {tag.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <textarea
            ref={taRef}
            className="snblm-ta snblm-scroll"
            value={localText}
            onChange={handleChange}
            placeholder={`Write notes for "${activePage?.title ?? "this page"}"…\n\nUse the toolbar above to format your notes.`}
            spellCheck
          />

          <div className="snblm-note-footer">
            <div style={{ display: "flex", gap: 5 }}>
              <span className="snblm-wc">{wc} words</span>
              <span className="snblm-wc">{localText.length} chars</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                className="snblm-btn-ghost"
                onClick={() => {
                  if (!localText.trim()) return;
                  if (!window.confirm("Clear page?")) return;
                  upd("");
                }}
              >
                <Trash2 size={10} strokeWidth={2} /> Clear
              </button>
              <button className="snblm-btn" onClick={doSave}>
                <Save size={11} strokeWidth={2.2} /> Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New Section Modal */}
      {showNewSectModal && (
        <div
          className="snblm-overlay"
          onClick={() => setShowNewSectModal(false)}
        >
          <div className="snblm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="snblm-modal-title">
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  background: "var(--accent-bg2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Folder size={14} color="var(--accent)" strokeWidth={2.2} />
              </div>
              New Section
            </div>
            <input
              className="snblm-inp"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Section name…"
              onKeyDown={(e) => e.key === "Enter" && addSect()}
              autoFocus
            />
            <p className="snblm-clr-lbl">Choose colour</p>
            <ColorPicker
              colors={SEC_COLORS}
              selected={newColor}
              onSelect={setNewColor}
            />
            <div className="snblm-modal-actions">
              <button
                className="snblm-cancel"
                onClick={() => setShowNewSectModal(false)}
              >
                Cancel
              </button>
              <button
                className="snblm-btn"
                style={{ flex: 2 }}
                onClick={addSect}
              >
                Create Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Page Modal */}
      {showNewPageModal && (
        <div
          className="snblm-overlay"
          onClick={() => setShowNewPageModal(false)}
        >
          <div className="snblm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="snblm-modal-title">
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  background: "var(--accent-bg2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileText size={14} color="var(--accent)" strokeWidth={2.2} />
              </div>
              New Page
            </div>
            <input
              className="snblm-inp"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Page title (optional)…"
              onKeyDown={(e) => e.key === "Enter" && addPg()}
              autoFocus
            />
            <div className="snblm-modal-actions">
              <button
                className="snblm-cancel"
                onClick={() => setShowNewPageModal(false)}
              >
                Cancel
              </button>
              <button className="snblm-btn" style={{ flex: 2 }} onClick={addPg}>
                Add Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="snblm-overlay" onClick={() => setShowShareModal(false)}>
          <div className="snblm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="snblm-modal-title">
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  background: "var(--accent-bg2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Share2 size={14} color="var(--accent)" strokeWidth={2.2} />
              </div>
              Share Notebook
            </div>
            <p
              style={{ fontSize: 11, color: "var(--text2)", marginBottom: 10 }}
            >
              Sharing: <b style={{ color: "var(--text)" }}>{activeNB?.title}</b>
            </p>
            <input
              className="snblm-inp"
              type="email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              placeholder="Enter email address…"
              onKeyDown={(e) => e.key === "Enter" && doShare()}
              autoFocus
            />
            <div className="snblm-modal-actions">
              <button
                className="snblm-cancel"
                onClick={() => setShowShareModal(false)}
              >
                Cancel
              </button>
              <button
                className="snblm-btn"
                style={{ flex: 2 }}
                onClick={doShare}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentNotebook;
