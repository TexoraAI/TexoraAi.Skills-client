// Dummy/seed data for Banner Studio — used only when the real backend
// (Spring Boot /api/banners) isn't reachable yet. Mirrors the shape the
// live API is expected to return, so nothing else in the UI needs to change
// once the backend is wired up. Remove this file (and the fallback in
// bannerApi.js) once /api/banners is live.

const now = Date.now();
const daysAgo = (n) => new Date(now - n * 24 * 60 * 60 * 1000).toISOString();
const hoursAgo = (n) => new Date(now - n * 60 * 60 * 1000).toISOString();

// Upcoming/live start dates so the calendar section has something to show
// for "July 2026" (today = 2026-07-03).
const onDate = (y, m, d) => new Date(y, m - 1, d).toISOString();

export const mockBanners = [
  {
    id: 'bnr_1',
    name: 'Become a Data Scientist — June Cohort',
    status: 'active',
    emoji: '📊',
    gradient: 'linear-gradient(135deg, #e86a2a 0%, #F97316 100%)',
    updatedAt: daysAgo(2),
    startDate: onDate(2026, 7, 1),
    startTime: '09:00',
    views: 24500,
    clicks: 1320,
  },
  {
    id: 'bnr_2',
    name: 'AI Engineer Bootcamp Launch',
    status: 'scheduled',
    emoji: '🚀',
    gradient: 'linear-gradient(135deg, #14532d 0%, #16A34A 100%)',
    updatedAt: hoursAgo(5),
    startDate: onDate(2026, 7, 10),
    startTime: '09:00',
    views: 1840,
    clicks: 96,
  },
  {
    id: 'bnr_3',
    name: 'Summer Mega Sale — 40% Off Courses',
    status: 'active',
    emoji: '🔥',
    gradient: 'linear-gradient(135deg, #3b2a1f 0%, #e86a2a 100%)',
    updatedAt: daysAgo(1),
    startDate: onDate(2026, 6, 20),
    startTime: '09:00',
    views: 51230,
    clicks: 3402,
  },
  {
    id: 'bnr_4',
    name: 'New Cloud Computing Track',
    status: 'draft',
    emoji: '☁️',
    gradient: 'linear-gradient(135deg, #1a2744 0%, #33445e 100%)',
    updatedAt: daysAgo(3),
    startDate: null,
    startTime: null,
    views: 0,
    clicks: 0,
  },
  {
    id: 'bnr_5',
    name: 'Web Development Zero to Hero',
    status: 'active',
    emoji: '💻',
    gradient: 'linear-gradient(135deg, #0f2e1c 0%, #16A34A 100%)',
    updatedAt: daysAgo(7),
    startDate: onDate(2026, 6, 26),
    startTime: '09:00',
    views: 18900,
    clicks: 980,
  },
  {
    id: 'bnr_6',
    name: 'Free Webinar: Cracking FAANG Interviews',
    status: 'scheduled',
    emoji: '🎯',
    gradient: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)',
    updatedAt: daysAgo(1),
    startDate: onDate(2026, 7, 15),
    startTime: '18:00',
    views: 1200,
    clicks: 140,
  },
];

export default mockBanners;
