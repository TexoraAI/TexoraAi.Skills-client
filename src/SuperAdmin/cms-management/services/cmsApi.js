/**
 * cmsApi.js — localStorage-based mock API.
 * Safe read/write with error handling.
 * Drop-in compatible with a future Spring Boot backend.
 */

const KEYS = {
  PAGES:      "ilmora_cms_pages",
  SECTIONS:   "ilmora_cms_sections",
  COMPONENTS: "ilmora_cms_components",
  MEDIA:      "ilmora_cms_media",
  NAV:        "ilmora_cms_navigation",
};

// ─── Storage Helpers ─────────────────────────────────────────────────────────

const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("[CMS] localStorage write failed:", e);
  }
};

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// ─── Pages ──────────────────────────────────────────────────────────────────

export const getPages = () =>
  Promise.resolve(read(KEYS.PAGES));

export const getPage = (pageId) => {
  const page = read(KEYS.PAGES).find((p) => p.id === pageId) || null;
  return Promise.resolve(page);
};

export const createPage = (data) => {
  const pages = read(KEYS.PAGES);
  const page = {
    id: uid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: false,
    ...data,
  };
  write(KEYS.PAGES, [...pages, page]);
  return Promise.resolve(page);
};

export const updatePage = (pageId, updates) => {
  const pages = read(KEYS.PAGES).map((p) =>
    p.id === pageId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
  );
  write(KEYS.PAGES, pages);
  return Promise.resolve(pages.find((p) => p.id === pageId));
};

export const deletePage = (pageId) => {
  const sectionIds = read(KEYS.SECTIONS)
    .filter((s) => s.pageId === pageId)
    .map((s) => s.id);
  write(KEYS.PAGES, read(KEYS.PAGES).filter((p) => p.id !== pageId));
  write(KEYS.SECTIONS, read(KEYS.SECTIONS).filter((s) => s.pageId !== pageId));
  write(KEYS.COMPONENTS, read(KEYS.COMPONENTS).filter((c) => !sectionIds.includes(c.sectionId)));
  return Promise.resolve({ success: true });
};

// ─── Sections ────────────────────────────────────────────────────────────────

export const getSections = (pageId) => {
  const sections = read(KEYS.SECTIONS)
    .filter((s) => s.pageId === pageId)
    .sort((a, b) => a.order - b.order);
  return Promise.resolve(sections);
};

export const createSection = (data) => {
  const sections = read(KEYS.SECTIONS);
  const pageOrder = sections.filter((s) => s.pageId === data.pageId).length;
  const section = {
    id: uid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
    visible: true,
    order: pageOrder,
    ...data,
  };
  write(KEYS.SECTIONS, [...sections, section]);
  return Promise.resolve(section);
};

export const updateSection = (sectionId, updates) => {
  const sections = read(KEYS.SECTIONS).map((s) =>
    s.id === sectionId ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
  );
  write(KEYS.SECTIONS, sections);
  return Promise.resolve(sections.find((s) => s.id === sectionId));
};

export const deleteSection = (sectionId) => {
  write(KEYS.SECTIONS, read(KEYS.SECTIONS).filter((s) => s.id !== sectionId));
  write(KEYS.COMPONENTS, read(KEYS.COMPONENTS).filter((c) => c.sectionId !== sectionId));
  return Promise.resolve({ success: true });
};

export const reorderSections = (pageId, orderedIds) => {
  const sections = read(KEYS.SECTIONS).map((s) => {
    if (s.pageId !== pageId) return s;
    const idx = orderedIds.indexOf(s.id);
    return idx !== -1 ? { ...s, order: idx } : s;
  });
  write(KEYS.SECTIONS, sections);
  return Promise.resolve({ success: true });
};

// ─── Components ─────────────────────────────────────────────────────────────

export const getComponents = (sectionId) => {
  const components = read(KEYS.COMPONENTS)
    .filter((c) => c.sectionId === sectionId)
    .sort((a, b) => a.order - b.order);
  return Promise.resolve(components);
};

export const createComponent = (data) => {
  const components = read(KEYS.COMPONENTS);
  const sectionOrder = components.filter((c) => c.sectionId === data.sectionId).length;
  const component = {
    id: uid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
    visible: true,
    order: sectionOrder,
    ...data,
  };
  write(KEYS.COMPONENTS, [...components, component]);
  return Promise.resolve(component);
};

export const updateComponent = (componentId, updates) => {
  const components = read(KEYS.COMPONENTS).map((c) =>
    c.id === componentId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
  );
  write(KEYS.COMPONENTS, components);
  return Promise.resolve(components.find((c) => c.id === componentId));
};

export const deleteComponent = (componentId) => {
  write(KEYS.COMPONENTS, read(KEYS.COMPONENTS).filter((c) => c.id !== componentId));
  return Promise.resolve({ success: true });
};

export const reorderComponents = (sectionId, orderedIds) => {
  const components = read(KEYS.COMPONENTS).map((c) => {
    if (c.sectionId !== sectionId) return c;
    const idx = orderedIds.indexOf(c.id);
    return idx !== -1 ? { ...c, order: idx } : c;
  });
  write(KEYS.COMPONENTS, components);
  return Promise.resolve({ success: true });
};

// ─── Publish helpers ──────────────────────────────────────────────────────────

export const publishPage     = (id) => updatePage(id, { published: true });
export const unpublishPage   = (id) => updatePage(id, { published: false });
export const publishSection  = (id) => updateSection(id, { published: true });
export const unpublishSection = (id) => updateSection(id, { published: false });

export const toggleSectionVisibility   = (id, visible) => updateSection(id, { visible });
export const toggleComponentVisibility = (id, visible) => updateComponent(id, { visible });