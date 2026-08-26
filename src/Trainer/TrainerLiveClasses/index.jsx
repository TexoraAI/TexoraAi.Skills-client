import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { T, NAV_TABS, FONT_FAMILY, FONT_WEIGHT } from "./data/theme";
import useViewport from "./hooks/useViewport";
import HeroBanner from "./components/HeroBanner";
import StartLiveThreePanel from "./pages/StartLiveThreePanel";
import PanelLiveDashboard from "./pages/PanelLiveDashboard";
import PanelJoinCall from "./pages/PanelJoinCall";
import PanelLiveHistory from "./pages/PanelLiveHistory";
import PanelAttendanceReport from "./pages/PanelAttendanceReport";
import PanelUploadRecorded from "./pages/PanelUploadRecorded";
import PanelRecordedList from "./pages/PanelRecordedList";
import PanelEditRecording from "./pages/PanelEditRecording";

const TrainerLiveClasses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("live-dashboard");
  const [editRecordingId, setEditRecordingId] = useState(null);

  const vw = useViewport();
  const isMobile = vw < 640;
  const isTablet = vw >= 640 && vw < 1024;
  const isDesktop = vw >= 1024;

  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"),
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark",
      ),
    );
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  const switchTab = (tab) => {
    setActiveTab(tab.key);
    setEditRecordingId(null);
  };

  // heroMeta: uses File2's title/highlight/subtitle pattern
  const heroMeta = {
    "live-dashboard": {
      title: "Live",
      highlight: "Dashboard",
      subtitle: "All your sessions — live, scheduled & ended",
    },
    "start-live": {
      title: "Start",
      highlight: "Live Session",
      subtitle: "Schedule a new session for your batch",
    },
    "join-call": {
      title: "Join",
      highlight: "Call",
      subtitle: "Accept incoming student calls",
    },
    "live-history": {
      title: "Session",
      highlight: "History",
      subtitle: "All your past live sessions in one place",
    },
    "live-attendance": {
      title: "Attendance",
      highlight: "Report",
      subtitle: "Detailed attendance analytics",
    },
    "upload-recorded": {
      title: "Upload",
      highlight: "Recorded Video",
      subtitle: "Publish recorded content for students",
    },
    "recorded-list": {
      title: editRecordingId ? "Edit" : "Recorded",
      highlight: editRecordingId ? "Recording" : "Classes",
      subtitle: editRecordingId
        ? "Update title, description or replace file"
        : "Browse and manage your video library",
    },
  }[activeTab] || { title: "Live", highlight: "Studio", subtitle: "" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes fadeUp      { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse       { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes liveDot     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }
        @keyframes blink       { 0%,100%{opacity:1} 50%{opacity:0.15} }
        @keyframes uploadFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes radarPulse  { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.02)} }
        @keyframes callPulse   { 0%{box-shadow:0 0 0 0 rgba(99,102,241,0.5)} 70%{box-shadow:0 0 0 18px rgba(99,102,241,0)} 100%{box-shadow:0 0 0 0 rgba(99,102,241,0)} }
        @keyframes callPulse2  { 0%{box-shadow:0 0 0 0 rgba(99,102,241,0.3)} 70%{box-shadow:0 0 0 32px rgba(99,102,241,0)} 100%{box-shadow:0 0 0 0 rgba(99,102,241,0)} }
        @keyframes pulse-ring  { 0%{box-shadow:0 0 0 0 rgba(34,197,94,0.5)} 70%{box-shadow:0 0 0 8px rgba(34,197,94,0)} 100%{box-shadow:0 0 0 0 rgba(34,197,94,0)} }
        @keyframes slideDown   { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin        { to{transform:rotate(360deg)} }
        @keyframes toastIn     { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .dfade { animation: fadeUp 0.45s ease both }
        .livebadge { animation: pulse-ring 2.2s ease-out infinite }
        .d1 { animation: blink 1.6s ease infinite }
        .d2 { animation: blink 1.6s 0.3s ease infinite }
        .d3 { animation: blink 1.6s 0.6s ease infinite }
        .panel-body-inner { animation: slideDown 0.3s ease both }
        .publish-toast { animation: toastIn 0.3s ease both }
        .nav-strip-scroll { overflow-x:auto; overflow-y:visible; -webkit-overflow-scrolling:touch; scrollbar-width:thin; scrollbar-color:${isDark ? "rgba(255,255,255,0.18) rgba(255,255,255,0.04)" : "rgba(0,0,0,0.18) rgba(0,0,0,0.04)"}; padding-bottom:6px; }
        .nav-strip-scroll::-webkit-scrollbar { display:block; height:4px; }
        .nav-strip-scroll::-webkit-scrollbar-track { background:${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}; border-radius:99px; }
        .nav-strip-scroll::-webkit-scrollbar-thumb { background:${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)"}; border-radius:99px; }
        .nav-strip-inner { display:inline-flex; flex-wrap:nowrap; align-items:center; gap:6px; min-width:max-content; padding:2px; }
        .panel-scroll { overflow-y:auto; flex:1; }
        .panel-scroll::-webkit-scrollbar { width:3px; }
        .panel-scroll::-webkit-scrollbar-track { background:transparent; }
        .panel-scroll::-webkit-scrollbar-thumb { background:${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}; border-radius:99px; }
        input[type=date]::-webkit-calendar-picker-indicator,
        input[type=time]::-webkit-calendar-picker-indicator { filter:${isDark ? "invert(1) opacity(0.3)" : "opacity(0.5)"}; cursor:pointer; }
        .sls-input { width:100%; padding:7px 10px; border-radius:7px; border:1px solid ${t.inputBorder}; background:${t.inputBg}; color:${t.inputText}; font-size:11px; font-family:${FONT_FAMILY}; font-weight:${FONT_WEIGHT.medium}; outline:none; transition:border 0.2s,box-shadow 0.2s; box-sizing:border-box; appearance:none; }
        .sls-input:focus { border-color:#22c55e; box-shadow:0 0 0 2px rgba(34,197,94,0.12); }
        .sls-input::placeholder { color:${t.textMuted}; font-weight:400; }
        .mode-card { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:8px; border:1.5px solid ${t.modeCardBorder}; background:${t.modeCardBg}; cursor:pointer; transition:all 0.18s; flex:1; }
        .mode-card:hover { border-color:${isDark ? "rgba(255,255,255,0.18)" : "#94a3b8"}; background:${t.modeCardHov}; }
        .mode-card.sel-custom { border-color:#22c55e; background:${isDark ? "rgba(34,197,94,0.06)" : "#f0fdf4"}; box-shadow:0 0 0 2px rgba(34,197,94,0.12); }
        .mode-card.sel-ext { border-color:#0078d4; background:${isDark ? "rgba(0,120,212,0.06)" : "#eff6ff"}; box-shadow:0 0 0 2px rgba(0,120,212,0.12); }
        .review-field { background:${t.reviewFieldBg}; border:1px solid ${t.reviewFieldBorder}; border-radius:7px; padding:8px 10px; }
        .next-btn { display:inline-flex; align-items:center; gap:5px; padding:7px 14px; border-radius:7px; border:none; background:#22c55e; color:#fff; font-size:11px; font-weight:${FONT_WEIGHT.bold}; cursor:pointer; font-family:${FONT_FAMILY}; transition:all 0.18s; }
        .next-btn:hover { background:#16a34a; box-shadow:0 3px 10px rgba(34,197,94,0.35); }
        select option { background:${isDark ? "#1a1a1a" : "#f8fafc"}; color:${isDark ? "#ffffff" : "#0f172a"}; }

        /* ═══════ RESPONSIVE — phones / iPad mini / tablets / laptop / desktop ═══════ */
        .rlc-navstrip { padding: 0 32px; }
        .rlc-content { padding: 20px 32px 52px; }
        .rlc-hero-pad { padding: 22px 32px; }
        .rlc-hero-title { font-size: clamp(20px, 3.2vw, 30px); }
        .rlc-row-actions { display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
        .rlc-list-row { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }

        @media (max-width: 1279px) and (min-width: 1024px) {
          .rlc-content { padding: 18px 24px 44px; }
        }
        /* Tablets / iPad */
        @media (max-width: 1023px) {
          .rlc-navstrip { padding: 0 18px; }
          .rlc-content { padding: 16px 18px 40px; }
          .rlc-hero-pad { padding: 18px 20px; }
          .rlc-3panel { flex-direction: column !important; height: auto !important; }
          .rlc-3panel > .rlc-panel-col { width: 100% !important; max-width: 100% !important; border-right: none !important; border-left: none !important; border-bottom: 1px solid ${t.sidebarBorder}; }
        }
        /* iPad mini / small tablets */
        @media (max-width: 820px) {
          .rlc-grid-auto { grid-template-columns: repeat(2, 1fr) !important; }
        }
        /* Phones */
        @media (max-width: 640px) {
          .rlc-navstrip { padding: 0 12px; }
          .rlc-content { padding: 12px 12px 32px; }
          .rlc-hero-pad { padding: 16px 14px; }
          .rlc-list-row { flex-direction: column; align-items: stretch; }
          .rlc-row-actions { width: 100%; justify-content: flex-start; }
          .rlc-sidebar-flex { grid-template-columns: 1fr !important; }
          .rlc-grid-auto { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
          .rlc-hide-sm { display: none !important; }
        }
        @media (max-width: 860px) {
          .rlc-sidebar-flex { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 380px) {
          .rlc-grid-auto { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: t.pageBg,
          color: t.text,
          fontFamily: FONT_FAMILY,
          transition: "background 0.3s,color 0.3s",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HERO BANNER */}
        <HeroBanner
          t={t}
          isDark={isDark}
          heroMeta={heroMeta}
          isMobile={isMobile}
        />

        {/* NAV STRIP */}
        <div
          className="rlc-navstrip"
          style={{
            background: t.navStripBg,
            borderBottom: `1px solid ${t.navStripBorder}`,
            flexShrink: 0,
          }}
        >
          <div
            className="nav-strip-scroll"
            style={{ height: 46, display: "flex", alignItems: "center" }}
          >
            <div className="nav-strip-inner">
              {NAV_TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                const Icon = tab.icon;
                let bg, border, color;
                if (isActive) {
                  bg = "#22c55e";
                  border = "#22c55e";
                  color = "#ffffff";
                } else if (tab.primary) {
                  bg = isDark ? "rgba(34,197,94,0.10)" : "rgba(34,197,94,0.07)";
                  border = "rgba(34,197,94,0.35)";
                  color = "#22c55e";
                } else {
                  bg = t.tabInactiveBg;
                  border = t.tabInactiveBorder;
                  color = t.tabInactiveText;
                }
                return (
                  <button
                    key={tab.key}
                    onClick={() => switchTab(tab)}
                    style={{
                      flexShrink: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      borderRadius: 8,
                      border: `1px solid ${border}`,
                      background: bg,
                      color,
                      fontSize: 11,
                      fontWeight: isActive || tab.primary ? FONT_WEIGHT.bold : FONT_WEIGHT.semibold,
                      cursor: "pointer",
                      transition: "all 0.18s",
                      fontFamily: FONT_FAMILY,
                      letterSpacing: "0.02em",
                      whiteSpace: "nowrap",
                      boxShadow: isActive
                        ? "0 4px 14px rgba(34,197,94,0.35)"
                        : "none",
                    }}
                  >
                    <Icon size={12} strokeWidth={2.2} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div
          style={{
            flex: 1,
            overflow: activeTab === "start-live" ? "hidden" : "auto",
          }}
        >
          {activeTab === "start-live" ? (
            /* StartLive gets the full 3-panel layout */
            <div
              style={{
                height: isMobile || isTablet ? "auto" : "calc(100vh - 140px)",
              }}
            >
              <StartLiveThreePanel
                t={t}
                isDark={isDark}
                navigate={navigate}
                isMobile={isMobile}
                isTablet={isTablet}
              />
            </div>
          ) : (
            <div
              className="rlc-content"
              style={{
                maxWidth: 1300,
                margin: "0 auto",
              }}
            >
              {activeTab === "live-dashboard" && (
                <PanelLiveDashboard t={t} isDark={isDark} navigate={navigate} />
              )}
              {activeTab === "join-call" && (
                <PanelJoinCall t={t} isDark={isDark} navigate={navigate} />
              )}
              {activeTab === "live-history" && (
                <PanelLiveHistory
                  t={t}
                  isDark={isDark}
                  navigate={navigate}
                  onEditRecording={(id) => {
                    setEditRecordingId(id);
                    setActiveTab("recorded-list");
                  }}
                />
              )}
              {activeTab === "live-attendance" && (
                <PanelAttendanceReport
                  t={t}
                  isDark={isDark}
                  navigate={navigate}
                />
              )}
              {activeTab === "upload-recorded" && (
                <PanelUploadRecorded
                  t={t}
                  isDark={isDark}
                  navigate={navigate}
                  onSuccess={() => switchTab({ key: "recorded-list" })}
                />
              )}
              {activeTab === "recorded-list" && !editRecordingId && (
                <PanelRecordedList
                  t={t}
                  isDark={isDark}
                  navigate={navigate}
                  onEdit={(id) => setEditRecordingId(id)}
                  onUpload={() => switchTab({ key: "upload-recorded" })}
                />
              )}
              {activeTab === "recorded-list" && editRecordingId && (
                <PanelEditRecording
                  t={t}
                  isDark={isDark}
                  navigate={navigate}
                  recordingId={editRecordingId}
                  onBack={() => setEditRecordingId(null)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TrainerLiveClasses;
