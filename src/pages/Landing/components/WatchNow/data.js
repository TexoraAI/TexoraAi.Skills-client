// ─────────────────────────────────────────────────────────────────────────
// WatchNow — sample data
// Replace these arrays with real API responses (e.g. videoService.getAllWatchNow())
// once the backend endpoints are wired up. Shapes are kept intentionally
// simple/flat so swapping in real data is a drop-in.
// ─────────────────────────────────────────────────────────────────────────

export const watchNowFeatures = [
  { key: "live", text: "Live Expert Sessions" },
  { key: "guidance", text: "Career Guidance" },
  { key: "interview", text: "Interview Preparation" },
  { key: "skills", text: "Skill Based Learning" },
  { key: "projects", text: "Hands-on Projects" },
  { key: "resources", text: "Downloadable Resources" },
];


export const liveSession = {
  id: "live-ml-masterclass",
  isLive: true,
  label: "Live Session",
  title: "Machine Learning Masterclass",
  description: "Build real ML models and advance your career",
  mentor: {
    name: "Alfred Elver",
    title: "ML Engineer, Aviso AI",
    avatar: "",
  },
  views: "120K Views",
  duration: "18:42",
  rating: "4.9 Rating",
};

export const featuredVideos = [
  {
    id: "fv-1",
    title: "React JS Crash Course",
    category: "Web Development",
    duration: "18 min",
    thumbnail: "",
  },
  {
    id: "fv-2",
    title: "AI Career Roadmap",
    category: "Career Guidance",
    duration: "22 min",
    thumbnail: "",
  },
  {
    id: "fv-3",
    title: "Mock Interview Guide",
    category: "Interview Prep",
    duration: "15 min",
    thumbnail: "",
  },
  {
    id: "fv-4",
    title: "Resume Building Tips",
    category: "Career Growth",
    duration: "20 min",
    thumbnail: "",
  },
  {
    id: "fv-5",
    title: "System Design Basics",
    category: "Web Development",
    duration: "26 min",
    thumbnail: "",
  },
];

export const continueLearning = [
  { id: "cl-1", title: "Data Structures Deep Dive", category: "Data Science", duration: "24 min", progress: 62 },
  { id: "cl-2", title: "Product Sense for PMs", category: "Career Guidance", duration: "19 min", progress: 30 },
  { id: "cl-3", title: "UX Research Fundamentals", category: "Soft Skills", duration: "16 min", progress: 80 },
];

export const trendingCourses = [
  { id: "tc-1", title: "Generative AI in Practice", category: "AI & ML", duration: "28 min" },
  { id: "tc-2", title: "Behavioral Interview Playbook", category: "Interview Prep", duration: "21 min" },
  { id: "tc-3", title: "Negotiating Your Offer", category: "Career Guidance", duration: "14 min" },
];

export const recentlyAdded = [
  { id: "ra-1", title: "Intro to LLM Fine-tuning", category: "AI & ML", duration: "31 min" },
  { id: "ra-2", title: "Communicating Up & Across", category: "Soft Skills", duration: "17 min" },
];

export const recommendedVideos = [
  { id: "rv-1", title: "SQL for Analysts", category: "Data Science", duration: "23 min" },
  { id: "rv-2", title: "Storytelling With Data", category: "Data Science", duration: "20 min" },
];

export const upcomingWebinars = [
  { id: "uw-1", title: "Breaking Into Product Management", date: "12 Jul, 6:00 PM", mentor: "Riya Sharma" },
  { id: "uw-2", title: "Cracking System Design Rounds", date: "18 Jul, 7:00 PM", mentor: "Karan Mehta" },
];

export const popularTrainers = [
  { id: "pt-1", name: "Alfred Elver", title: "ML Engineer, Aviso AI", rating: "4.9", videos: 24 },
  { id: "pt-2", name: "Riya Sharma", title: "Sr. Product Manager, Fintech Co", rating: "4.8", videos: 18 },
  { id: "pt-3", name: "Karan Mehta", title: "Staff Engineer, CloudScale", rating: "4.9", videos: 31 },
];

export const watchNowCategories = [
  { key: "ai-ml", label: "AI & ML" },
  { key: "web-dev", label: "Web Development" },
  { key: "data-science", label: "Data Science" },
  { key: "interview-prep", label: "Interview Preparation" },
  { key: "resume", label: "Resume Building" },
  { key: "soft-skills", label: "Soft Skills" },
  { key: "career", label: "Career Guidance" },
];
