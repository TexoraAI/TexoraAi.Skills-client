import mockBanners from '../data/mockBanners.js';

// Same "mock signup with localStorage" pattern used in SignupModal.jsx —
// persists banners locally so Banner Studio is fully usable (create, edit,
// duplicate, delete, publish, schedule) before the Spring Boot backend for
// /api/banners exists. Swap this out once the real endpoints are live.

const STORAGE_KEY = 'ilmora_banner_studio_banners';

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockBanners));
      return [...mockBanners];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...mockBanners];
  } catch {
    return [...mockBanners];
  }
}

function writeStore(banners) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
  } catch {
    // localStorage unavailable (SSR / private mode) — fail silently,
    // data just won't persist across reloads.
  }
}

function genId() {
  return `bnr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

const GRADIENTS = [
  'linear-gradient(135deg, #e86a2a 0%, #F97316 100%)',
  'linear-gradient(135deg, #14532d 0%, #16A34A 100%)',
  'linear-gradient(135deg, #1a2744 0%, #33445e 100%)',
  'linear-gradient(135deg, #166534 0%, #22c55e 100%)',
  'linear-gradient(135deg, #3b2a1f 0%, #e86a2a 100%)',
];
const randomGradient = () => GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];

// Simulated latency so loading/skeleton states still feel real.
const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms));

export const mockBannerStore = {
  async getAll(status = 'all', search = '') {
    await delay();
    let banners = readStore();
    if (status && status !== 'all') {
      banners = banners.filter((b) => b.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      banners = banners.filter((b) => b.name.toLowerCase().includes(q));
    }
    return [...banners].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  async getById(id) {
    await delay(150);
    return readStore().find((b) => b.id === id) || null;
  },

  async create(banner) {
    await delay();
    const banners = readStore();
    const newBanner = {
      id: genId(),
      name: banner.name || 'Untitled banner',
      status: banner.status || 'draft',
      emoji: banner.emoji || '✨',
      gradient: banner.gradient || randomGradient(),
      updatedAt: new Date().toISOString(),
      startDate: banner.startDate || null,
      startTime: banner.startTime || null,
      views: 0,
      clicks: 0,
      ...banner,
    };
    banners.unshift(newBanner);
    writeStore(banners);
    return newBanner;
  },

  async update(id, patch) {
    await delay();
    const banners = readStore();
    const idx = banners.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error('Banner not found');
    banners[idx] = { ...banners[idx], ...patch, updatedAt: new Date().toISOString() };
    writeStore(banners);
    return banners[idx];
  },

  async duplicate(id) {
    await delay();
    const banners = readStore();
    const original = banners.find((b) => b.id === id);
    if (!original) throw new Error('Banner not found');
    const copy = {
      ...original,
      id: genId(),
      name: `${original.name} (Copy)`,
      status: 'draft',
      updatedAt: new Date().toISOString(),
      views: 0,
      clicks: 0,
    };
    banners.unshift(copy);
    writeStore(banners);
    return copy;
  },

  async publish(id) {
    return mockBannerStore.update(id, { status: 'active', startDate: new Date().toISOString() });
  },

  async remove(id) {
    await delay();
    const banners = readStore().filter((b) => b.id !== id);
    writeStore(banners);
    return { success: true };
  },
};

export default mockBannerStore;
