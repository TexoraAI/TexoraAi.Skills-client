/**
 * useCMS.js — Central hook for CMS page state management.
 * Provides sections, components, and all CRUD + ordering actions.
 */

import { useState, useEffect, useCallback } from "react";
import {
  getPages,
  getPage,
  getSections,
  getComponents,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
  createComponent,
  updateComponent,
  deleteComponent,
  reorderComponents,
  publishSection,
  unpublishSection,
  toggleSectionVisibility,
  toggleComponentVisibility,
  updatePage,
} from "../services/cmsApi";

export const useCMS = (pageSlug) => {
  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [componentMap, setComponentMap] = useState({}); // { sectionId: [components] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Load ────────────────────────────────────────────────────────────────

  const loadPage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pages = await getPages();
      const found = pages.find((p) => p.slug === pageSlug);
      if (!found) { setError("Page not found"); setLoading(false); return; }
      setPage(found);

      const secs = await getSections(found.id);
      setSections(secs);

      const compMap = {};
      await Promise.all(
        secs.map(async (sec) => {
          compMap[sec.id] = await getComponents(sec.id);
        })
      );
      setComponentMap(compMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [pageSlug]);

  useEffect(() => { loadPage(); }, [loadPage]);

  // ─── Section Actions ──────────────────────────────────────────────────────

  const addSection = async (sectionData) => {
    const sec = await createSection({ pageId: page.id, ...sectionData });
    setSections((prev) => [...prev, sec]);
    setComponentMap((prev) => ({ ...prev, [sec.id]: [] }));
    return sec;
  };

  const editSection = async (sectionId, updates) => {
    const updated = await updateSection(sectionId, updates);
    setSections((prev) => prev.map((s) => (s.id === sectionId ? updated : s)));
    return updated;
  };

  const removeSection = async (sectionId) => {
    await deleteSection(sectionId);
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setComponentMap((prev) => { const n = { ...prev }; delete n[sectionId]; return n; });
  };

  const moveSections = async (orderedIds) => {
    await reorderSections(page.id, orderedIds);
    setSections((prev) =>
      [...prev].sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id))
    );
  };

  const togglePublishSection = async (sectionId, currentPublished) => {
    const updated = currentPublished
      ? await unpublishSection(sectionId)
      : await publishSection(sectionId);
    setSections((prev) => prev.map((s) => (s.id === sectionId ? updated : s)));
  };

  const setVisibility = async (sectionId, visible) => {
    const updated = await toggleSectionVisibility(sectionId, visible);
    setSections((prev) => prev.map((s) => (s.id === sectionId ? updated : s)));
  };

  // ─── Component Actions ────────────────────────────────────────────────────

  const addComponent = async (sectionId, componentData) => {
    const comp = await createComponent({ sectionId, ...componentData });
    setComponentMap((prev) => ({
      ...prev,
      [sectionId]: [...(prev[sectionId] || []), comp],
    }));
    return comp;
  };

  const editComponent = async (sectionId, componentId, updates) => {
    const updated = await updateComponent(componentId, updates);
    setComponentMap((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].map((c) => (c.id === componentId ? updated : c)),
    }));
    return updated;
  };

  const removeComponent = async (sectionId, componentId) => {
    await deleteComponent(componentId);
    setComponentMap((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].filter((c) => c.id !== componentId),
    }));
  };

  const moveComponents = async (sectionId, orderedIds) => {
    await reorderComponents(sectionId, orderedIds);
    setComponentMap((prev) => ({
      ...prev,
      [sectionId]: [...(prev[sectionId] || [])].sort(
        (a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id)
      ),
    }));
  };

  const toggleComponentVisib = async (sectionId, componentId, visible) => {
    const updated = await toggleComponentVisibility(componentId, visible);
    setComponentMap((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].map((c) => (c.id === componentId ? updated : c)),
    }));
  };

  // ─── Page Actions ─────────────────────────────────────────────────────────

  const savePage = async (updates) => {
    const updated = await updatePage(page.id, updates);
    setPage(updated);
    return updated;
  };

  return {
    page,
    sections,
    componentMap,
    loading,
    error,
    reload: loadPage,
    // Section
    addSection,
    editSection,
    removeSection,
    moveSections,
    togglePublishSection,
    setVisibility,
    // Component
    addComponent,
    editComponent,
    removeComponent,
    moveComponents,
    toggleComponentVisib,
    // Page
    savePage,
  };
};