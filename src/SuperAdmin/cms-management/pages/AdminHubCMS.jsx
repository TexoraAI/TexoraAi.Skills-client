/**
 * AdminHubCMS.jsx
 * CMS management page for Admin Hub.
 * Manages: Hero, Features, Analytics, Reports, Student Mgmt, Trainer Mgmt,
 *          Batch Mgmt, Resources, Certificates, FAQ, CTA
 */

import React, { useState } from "react";
import {
  Plus, Eye, EyeOff, Trash2, Edit2, GripVertical,
  ChevronDown, ChevronRight, RefreshCw, Settings, Image as ImageIcon, Navigation,
} from "lucide-react";
import HubShell from "../renderer/HubShell";
import CMSRenderer from "../renderer/CMSRenderer";
import SectionEditor from "../components/SectionEditor";
import ComponentEditor from "../components/ComponentEditor";
import PageEditor from "../components/PageEditor";
import MediaManager from "../components/MediaManager";
import NavigationManager from "../components/NavigationManager";
import { useCMS } from "../hooks/useCMS";
import { getSectionMeta, getComponentMeta } from "../renderer/componentRegistry";
import "../styles/cms.css";

const ALLOWED_SECTION_TYPES = [
  "HeroSection",
  "FeaturesSection",
  "AnalyticsSection",
  "ReportsSection",
  "StudentManagementSection",
  "TrainerManagementSection",
  "BatchManagementSection",
  "ResourcesSection",
  "CertificatesSection",
  "FAQSection",
  "CTASection",
  "PlacementSection",
];

// ─── SectionRow (shared pattern) ──────────────────────────────────────────────

const SectionRow = ({
  section, components, expanded, onToggleExpand, onEdit, onDelete,
  onToggleVisible, onTogglePublish, onMoveUp, onMoveDown,
  onAddComponent, onEditComponent, onDeleteComponent, onToggleComponentVisible,
  isFirst, isLast,
}) => {
  const meta = getSectionMeta(section.type);
  const allowedComponents = meta.allowedComponents || [];
  const hasComponents = allowedComponents.length > 0;

  return (
    <div className="cms-section-row">
      <div className="cms-section-header" onClick={onToggleExpand}>
        <div className="cms-section-header__left">
          <GripVertical size={14} className="cms-section-header__drag" onClick={(e) => e.stopPropagation()} />
          <span className="cms-section-header__title">{section.label || section.type}</span>
          <span className="cms-section-header__type">{section.type}</span>
          {!section.visible && <span className="cms-badge cms-badge--hidden">Hidden</span>}
          {section.published
            ? <span className="cms-badge cms-badge--published">Published</span>
            : <span className="cms-badge cms-badge--unpublished">Draft</span>}
        </div>
        <div className="cms-section-header__actions" onClick={(e) => e.stopPropagation()}>
          <button className="cms-btn cms-btn--ghost" onClick={onMoveUp} disabled={isFirst} style={{ opacity: isFirst ? 0.3 : 1 }}>▲</button>
          <button className="cms-btn cms-btn--ghost" onClick={onMoveDown} disabled={isLast} style={{ opacity: isLast ? 0.3 : 1 }}>▼</button>
          <button className="cms-btn cms-btn--ghost" onClick={onToggleVisible}>
            {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button className={`cms-btn cms-btn--sm ${section.published ? "cms-btn--danger" : "cms-btn--success"}`} onClick={onTogglePublish}>
            {section.published ? "Unpublish" : "Publish"}
          </button>
          <button className="cms-btn cms-btn--ghost" onClick={onEdit}><Edit2 size={14} /></button>
          <button className="cms-btn cms-btn--ghost" onClick={onDelete} style={{ color: "var(--cms-danger)" }}><Trash2 size={14} /></button>
          <span style={{ color: "var(--cms-text-muted)", marginLeft: 4 }}>
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="cms-section-body">
          {section.data?.title && (
            <div style={{ fontSize: 12, color: "var(--cms-text-muted)", marginBottom: 12 }}>
              Section title: <strong style={{ color: "var(--cms-text)" }}>{section.data.title}</strong>
            </div>
          )}
          {!hasComponents && (
            <div style={{ fontSize: 13, color: "var(--cms-text-muted)", fontStyle: "italic" }}>
              This section type renders directly from section data (no sub-components).
            </div>
          )}
          {hasComponents && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--cms-text-muted)" }}>
                  Components ({components.length})
                </span>
                <button className="cms-btn cms-btn--primary cms-btn--sm" onClick={() => onAddComponent(allowedComponents[0])}>
                  <Plus size={12} /> Add {getComponentMeta(allowedComponents[0]).label}
                </button>
              </div>
              {components.length === 0 ? (
                <div className="cms-empty" style={{ padding: 20 }}>No components yet.</div>
              ) : (
                components.map((comp) => (
                  <div key={comp.id} className="cms-component-row">
                    <div className="cms-component-row__left">
                      <GripVertical size={12} style={{ color: "var(--cms-text-muted)" }} />
                      <div>
                        <div className="cms-component-row__label">
                          {comp.data?.title || comp.data?.name || comp.data?.metric ||
                           comp.data?.question || comp.data?.company || comp.type}
                        </div>
                        <div className="cms-component-row__type">{comp.type}</div>
                      </div>
                    </div>
                    <div className="cms-component-row__actions">
                      <button className="cms-btn cms-btn--ghost" onClick={() => onToggleComponentVisible(comp.id, !comp.visible)}>
                        {comp.visible !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                      </button>
                      <button className="cms-btn cms-btn--ghost" onClick={() => onEditComponent(comp)}><Edit2 size={12} /></button>
                      <button className="cms-btn cms-btn--ghost" onClick={() => onDeleteComponent(comp.id)} style={{ color: "var(--cms-danger)" }}><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── AdminHubCMS ──────────────────────────────────────────────────────────────

const AdminHubCMS = () => {
  const {
    page, sections, componentMap, loading, error, reload,
    addSection, editSection, removeSection, moveSections,
    togglePublishSection, setVisibility,
    addComponent, editComponent, removeComponent, toggleComponentVisib,
    savePage,
  } = useCMS("admin-hub");

  const [expandedSections, setExpandedSections] = useState({});
  const [showSectionEditor, setShowSectionEditor] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [showComponentEditor, setShowComponentEditor] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [activeComponentType, setActiveComponentType] = useState(null);
  const [showPageEditor, setShowPageEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [showNav, setShowNav] = useState(false);

  const toggleExpand = (id) => setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleMoveSection = (idx, dir) => {
    const ids = sections.map((s) => s.id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= ids.length) return;
    [ids[idx], ids[newIdx]] = [ids[newIdx], ids[idx]];
    moveSections(ids);
  };

  const handleSaveComponent = async (data) => {
    if (editingComponent) {
      await editComponent(activeSection, editingComponent.id, { data });
    } else {
      await addComponent(activeSection, { type: activeComponentType, data });
    }
    setShowComponentEditor(false);
    setEditingComponent(null);
  };

  const stats = {
    total: sections.length,
    published: sections.filter((s) => s.published).length,
    hidden: sections.filter((s) => !s.visible).length,
    components: Object.values(componentMap).reduce((acc, arr) => acc + arr.length, 0),
  };

  return (
    <HubShell
      title="Admin Hub CMS"
      breadcrumb="Super Admin → CMS Management → Admin Hub"
      actions={
        <>
          <button className="cms-btn cms-btn--ghost" onClick={() => setShowMedia(true)}>
            <ImageIcon size={14} /> Media
          </button>
          <button className="cms-btn cms-btn--ghost" onClick={() => setShowNav(true)}>
            <Navigation size={14} /> Nav
          </button>
          <button className="cms-btn cms-btn--ghost" onClick={() => setShowPreview((v) => !v)}>
            <Eye size={14} /> {showPreview ? "Hide Preview" : "Preview"}
          </button>
          <button className="cms-btn cms-btn--ghost" onClick={() => setShowPageEditor(true)}>
            <Settings size={14} /> Page Settings
          </button>
          <button className="cms-btn cms-btn--ghost" onClick={reload}>
            <RefreshCw size={14} /> Reload
          </button>
        </>
      }
    >
      {loading && <div className="cms-loading">Loading Admin Hub...</div>}
      {error && (
        <div style={{ color: "var(--cms-danger)", padding: 20 }}>
          Error: {error} <button className="cms-btn cms-btn--ghost" onClick={reload}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="cms-stats-bar">
            {[
              { label: "Sections", value: stats.total },
              { label: "Published", value: stats.published },
              { label: "Hidden", value: stats.hidden },
              { label: "Components", value: stats.components },
            ].map((s) => (
              <div key={s.label} className="cms-stat-card">
                <div className="cms-stat-card__value">{s.value}</div>
                <div className="cms-stat-card__label">{s.label}</div>
              </div>
            ))}
            {page && (
              <div className="cms-stat-card">
                <div className="cms-stat-card__value" style={{ fontSize: 16 }}>
                  {page.published ? "🟢" : "🔴"}
                </div>
                <div className="cms-stat-card__label">
                  Page: {page.published ? "Published" : "Draft"}
                </div>
              </div>
            )}
          </div>

          {showPreview ? (
            <div>
              <h3 style={{ marginBottom: 16, fontSize: 16 }}>Live Preview</h3>
              <CMSRenderer sections={sections} componentMap={componentMap} />
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 16 }}>Sections ({sections.length})</h3>
                <button className="cms-btn cms-btn--primary" onClick={() => { setEditingSection(null); setShowSectionEditor(true); }}>
                  <Plus size={14} /> Add Section
                </button>
              </div>

              {sections.length === 0 ? (
                <div className="cms-empty">No sections yet. Click "Add Section" to get started.</div>
              ) : (
                sections.map((section, idx) => (
                  <SectionRow
                    key={section.id}
                    section={section}
                    components={componentMap[section.id] || []}
                    expanded={!!expandedSections[section.id]}
                    onToggleExpand={() => toggleExpand(section.id)}
                    onEdit={() => { setEditingSection(section); setShowSectionEditor(true); }}
                    onDelete={() => removeSection(section.id)}
                    onToggleVisible={() => setVisibility(section.id, !section.visible)}
                    onTogglePublish={() => togglePublishSection(section.id, section.published)}
                    onMoveUp={() => handleMoveSection(idx, -1)}
                    onMoveDown={() => handleMoveSection(idx, 1)}
                    onAddComponent={(type) => { setActiveSection(section.id); setActiveComponentType(type); setEditingComponent(null); setShowComponentEditor(true); }}
                    onEditComponent={(comp) => { setActiveSection(section.id); setActiveComponentType(comp.type); setEditingComponent(comp); setShowComponentEditor(true); }}
                    onDeleteComponent={(compId) => removeComponent(section.id, compId)}
                    onToggleComponentVisible={(compId, visible) => toggleComponentVisib(section.id, compId, visible)}
                    isFirst={idx === 0}
                    isLast={idx === sections.length - 1}
                  />
                ))
              )}
            </div>
          )}
        </>
      )}

      {showSectionEditor && (
        <SectionEditor
          initial={editingSection}
          allowedTypes={ALLOWED_SECTION_TYPES}
          onSave={async (data) => {
            if (editingSection) await editSection(editingSection.id, data);
            else await addSection(data);
            setShowSectionEditor(false);
            setEditingSection(null);
          }}
          onClose={() => { setShowSectionEditor(false); setEditingSection(null); }}
        />
      )}

      {showComponentEditor && (
        <ComponentEditor
          type={activeComponentType}
          initial={editingComponent?.data || {}}
          onSave={handleSaveComponent}
          onClose={() => { setShowComponentEditor(false); setEditingComponent(null); }}
        />
      )}

      {showPageEditor && page && (
        <PageEditor
          page={page}
          onSave={async (updates) => { await savePage(updates); setShowPageEditor(false); }}
          onClose={() => setShowPageEditor(false)}
        />
      )}

      {showMedia && <MediaManager onClose={() => setShowMedia(false)} />}
      {showNav && <NavigationManager onClose={() => setShowNav(false)} />}
    </HubShell>
  );
};

export default AdminHubCMS;
