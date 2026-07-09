import React, { useEffect, useState, useCallback, useMemo } from "react";
import StatsBar from "../components/StatsBar.jsx";
import BannerGrid from "../components/BannerGrid.jsx";
import BannerSidePanel from "../components/BannerSidePanel.jsx";
import AIStudioSection from "../components/AIStudioSection.jsx";
import BuilderSection from "../components/BuilderSection.jsx";
import ResponsiveCheckSection from "../components/ResponsiveCheckSection.jsx";
import AnalyticsSection from "../components/AnalyticsSection.jsx";
import CalendarSection from "../components/CalendarSection.jsx";
import PublishCard from "../components/PublishCard.jsx";
import { ToastStack, useToasts } from "../components/Toast.jsx";
import { Icon } from "../components/Icons.jsx";
// ── Real backend, not the mock bannerApi anymore ──────────────────────────
// ADJUST THIS PATH to wherever courseService.js actually lives relative to
// this file, e.g. '../../services/courseService' or
// '../../../services/courseService'.
import { courseService } from "../../../../services/courseService";
import "../styles/banner-studio.css";

/**
 * BannerStudioPage
 * Drop this in as a route inside your existing React Router setup, e.g.:
 *
 *   import BannerStudioPage from './pages/BannerStudioPage.jsx';
 *   <Route path="/super-admin/banners" element={<BannerStudioPage />} />
 *
 * It renders ONLY the page content (header + folding side panel + stats +
 * grid + analytics + calendar + toasts). Your existing Sidebar / Topbar /
 * layout wrapper stays exactly as it is — this component does not bring
 * its own shell, so it inherits your app's theme (dark mode class, fonts,
 * etc.) automatically.
 *
 * The banner create/edit form lives in a collapsible left-side panel
 * (BannerSidePanel) instead of a popup modal, so the banner list stays
 * visible and usable while the form is open.
 *
 * NOTE: This page now talks directly to the real Spring Boot backend via
 * courseService (GET/POST/PUT/DELETE /api/banners/**). There is no more
 * localStorage/mock fallback — every action here persists to the real DB,
 * which is what LMSHomepage.jsx's getActiveBanners() reads from.
 */

// Last-line-of-defense guard so every child NEVER receives a non-array,
// regardless of what the API returns.
function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

export default function BannerStudioPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const { toasts, showToast, removeToast } = useToasts();

  const loadBanners = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      // courseService returns the raw axios response, so unwrap .data here.
      const { data } = await courseService.getAllBanners(filter, searchTerm);
      // Defensive: guarantee an array reaches state no matter what shape
      // the backend returned (array directly, or { banners: [...] }, etc.)
      const list = Array.isArray(data) ? data : (data?.banners ?? []);
      setBanners(ensureArray(list));
    } catch (err) {
      console.error(err);
      setBanners([]); // never leave banners in a non-array/stale state
      setLoadError("Failed to load banners from server");
      showToast("Failed to load banners from server", "info");
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timer = setTimeout(loadBanners, 300);
    return () => clearTimeout(timer);
  }, [loadBanners]);

  const handleCreate = () => {
    setEditingBanner(null);
    setPanelOpen(true);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setPanelOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (editingBanner) {
        await courseService.updateBanner(editingBanner.id, formData);
        showToast("Banner updated successfully");
      } else {
        await courseService.createBanner(formData);
        showToast(
          formData.status === "active"
            ? "Banner published live 🎉"
            : "Banner saved as draft",
        );
      }
      setPanelOpen(false);
      loadBanners();
    } catch (err) {
      console.error(err);
      showToast("Something went wrong saving the banner", "info");
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await courseService.duplicateBanner(id);
      showToast("Banner duplicated successfully");
      loadBanners();
    } catch (err) {
      console.error(err);
      showToast("Failed to duplicate banner", "info");
    }
  };

  const handleDelete = async (id) => {
    try {
      await courseService.deleteBanner(id);
      showToast("Banner deleted");
      loadBanners();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete banner", "info");
    }
  };

  const handlePublishNow = async (id) => {
    try {
      await courseService.publishBannerNow(id);
      showToast("Banner published live 🎉");
      loadBanners();
    } catch (err) {
      console.error(err);
      showToast("Failed to publish banner", "info");
    }
  };

  // Called from AIStudioSection after a successful AI generation, when the
  // user clicks "Add to Banners". We persist the AI result via the
  // dedicated save endpoint rather than the generic createBanner, since the
  // backend may want to log/validate AI-sourced banners differently.
  const handleUseAiBanner = async (aiResult) => {
    try {
      await courseService.saveAiGeneratedBanner(aiResult);
      showToast("AI banner added to your drafts");
      loadBanners();
    } catch (err) {
      console.error(err);
      showToast("Failed to add AI banner", "info");
    }
  };

  const handleSchedule = async (id, date, time) => {
    try {
      await courseService.scheduleBanner(id, date, time);
      showToast("Banner scheduled successfully");
      loadBanners();
    } catch (err) {
      console.error(err);
      showToast("Failed to schedule banner", "info");
    }
  };

  // Always compute a guaranteed-array value right before render/pass-down,
  // so every child can never receive anything but an array.
  const safeBanners = ensureArray(banners);

  // Surface the most recently touched draft as a quick "ready to ship" nudge.
  const latestDraft = useMemo(() => {
    const drafts = safeBanners.filter((b) => b.status === "draft");
    if (!drafts.length) return null;
    return [...drafts].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
    )[0];
  }, [safeBanners]);

  return (
    <div className="banner-studio-page">
      <div className="bs-head-row">
        <div className="bs-page-head">
          <div className="bs-breadcrumb">SuperAdmin / Banner Studio</div>
          <div className="bs-title-row">
            <div className="bs-logo-mark">
              <Icon.Layout size={19} />
            </div>
            <h1>Banner Studio</h1>
          </div>
          <p>Create, schedule and publish banners across ILM ORA.</p>
        </div>
        <div className="bs-head-actions">
          <div className="bs-search-pill">
            <Icon.Search size={16} />
            <input
              type="text"
              placeholder="Search banners…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bs-btn bs-btn-primary" onClick={handleCreate}>
            <Icon.Plus size={16} /> New Banner
          </button>
        </div>
      </div>

      {loadError && !loading && (
        <div className="bs-toolbar" role="alert" style={{ color: "#c0392b" }}>
          <span>{loadError}. </span>
          <button className="bs-btn" onClick={loadBanners}>
            Retry
          </button>
        </div>
      )}

      {/* Split layout: workspace on the left, folding form panel on the
          right. Both are visible simultaneously — no popup, ever. */}
      <div className="bs-split-shell">
        <div className="bs-workspace">
          <StatsBar banners={safeBanners} />
          <BannerGrid
            banners={safeBanners}
            loading={loading}
            filter={filter}
            onFilterChange={setFilter}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onCreate={handleCreate}
          />

          {!loading && <AIStudioSection onUseBanner={handleUseAiBanner} />}
          {!loading && <BuilderSection />}
          {!loading && <ResponsiveCheckSection />}

          {!loading && <AnalyticsSection banners={safeBanners} />}
          {!loading && (
            <PublishCard
              banner={latestDraft}
              onPublish={handlePublishNow}
              onSchedule={handleSchedule}
            />
          )}
          {!loading && (
            <CalendarSection banners={safeBanners} onEdit={handleEdit} />
          )}
        </div>

        <BannerSidePanel
          isOpen={panelOpen}
          onClose={() => setPanelOpen(false)}
          onSave={handleSave}
          editingBanner={editingBanner}
          showToast={showToast}
        />
      </div>

      <ToastStack toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
