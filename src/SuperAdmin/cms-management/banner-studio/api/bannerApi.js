import axios from 'axios';
import mockBannerStore from './mockBannerStore.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Spring Boot backend for /api/banners isn't wired up yet — while that's
// the case we transparently fall back to a localStorage-backed mock store
// (data/mockBanners.js) so the UI never sits empty during frontend work.
// Set VITE_BANNER_STUDIO_FORCE_MOCK=false once the backend is live, or just
// let it auto-detect: any failed request (network error, 404, etc.) trips
// the fallback for the rest of the session.
const FORCE_MOCK = import.meta.env.VITE_BANNER_STUDIO_FORCE_MOCK !== 'false';
let useMock = FORCE_MOCK;

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 6000,
});

/**
 * Normalizes any backend response shape into a plain array of banners.
 * Handles:
 *   - []                      (already an array)
 *   - { data: [] }            (axios-style / wrapped)
 *   - { banners: [] }         (named-key wrapped)
 *   - { data: { banners: [] } } (double-wrapped, just in case)
 *   - null / undefined / {}   (empty or invalid)
 * Anything that doesn't match a known shape falls back to [] instead
 * of throwing, so components never receive a non-array value.
 */
function normalizeBannerList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.data)) {
      return payload.data;
    }
    if (Array.isArray(payload.banners)) {
      return payload.banners;
    }
    if (payload.data && Array.isArray(payload.data.banners)) {
      return payload.data.banners;
    }
  }

  // Unknown / empty / invalid shape — fail safe, not fail loud.
  if (payload !== null && payload !== undefined) {
    console.warn('bannerApi: unexpected response shape, defaulting to []', payload);
  }
  return [];
}

/**
 * Normalizes a single-banner response the same way, in case the backend
 * ever wraps single-object responses too (e.g. { banner: {...} } or { data: {...} }).
 */
function normalizeBanner(payload) {
  if (!payload || typeof payload !== 'object') return null;
  if (payload.banner && typeof payload.banner === 'object') return payload.banner;
  if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return payload.data;
  }
  return payload;
}

async function withFallback(liveCall, mockFn) {
  if (useMock) return mockFn();
  try {
    return await liveCall();
  } catch (err) {
    console.warn('bannerApi: backend unavailable, switching to local mock data', err?.message || err);
    useMock = true;
    return mockFn();
  }
}

export const bannerApi = {
  getAll: (status = 'all', search = '') =>
    withFallback(
      () => client.get('/banners', { params: { status, search } }).then((r) => normalizeBannerList(r.data)),
      () => mockBannerStore.getAll(status, search)
    ),

  getById: (id) =>
    withFallback(
      () => client.get(`/banners/${id}`).then((r) => normalizeBanner(r.data)),
      () => mockBannerStore.getById(id)
    ),

  create: (banner) =>
    withFallback(
      () => client.post('/banners', banner).then((r) => normalizeBanner(r.data)),
      () => mockBannerStore.create(banner)
    ),

  update: (id, banner) =>
    withFallback(
      () => client.put(`/banners/${id}`, banner).then((r) => normalizeBanner(r.data)),
      () => mockBannerStore.update(id, banner)
    ),

  duplicate: (id) =>
    withFallback(
      () => client.post(`/banners/${id}/duplicate`).then((r) => normalizeBanner(r.data)),
      () => mockBannerStore.duplicate(id)
    ),

  publish: (id) =>
    withFallback(
      () => client.patch(`/banners/${id}/publish`).then((r) => normalizeBanner(r.data)),
      () => mockBannerStore.publish(id)
    ),

  remove: (id) =>
    withFallback(
      () => client.delete(`/banners/${id}`),
      () => mockBannerStore.remove(id)
    ),
};

export default bannerApi;