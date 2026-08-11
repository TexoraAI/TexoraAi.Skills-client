const seoConfig = {
  "/": {
    title: "ILM ORA | AI-Powered Learning Hub for Students, Trainers & Professionals",
    description: "Your AI-powered learning hub. Learn AI, coding, business, career skills, interview preparation, certifications and become the Top 1% with ILM ORA.",
    keywords: "ILM ORA, AI Learning, Online Courses, AI Education, Career Learning",
  },
  "/all-courses": {
    title: "Online Courses | ILM ORA",
    description: "Browse AI, Programming, Business, Career and Professional Development courses.",
  },
  "/school-class": {
    title: "School Classes | ILM ORA",
    description: "AI-powered school learning for students, organized by class and subject.",
  },
  "/school-class/9": {
    title: "Class 9 Subjects | ILM ORA",
    description: "Explore all Class 9 subjects available on ILM ORA.",
  },
  "/school-class/9/math": {
    title: "Class 9 Math Course | ILM ORA",
    description: "Master Class 9 Mathematics with AI-guided lessons on ILM ORA.",
  },
  "/school-class/9/ai": {
    title: "Class 9 AI Course | ILM ORA",
    description: "Learn Artificial Intelligence basics for Class 9 students with interactive lessons, projects and quizzes on ILM ORA.",
  },
  "/platforms": {
    title: "Platforms | ILM ORA",
    description: "Explore ILM ORA's AI-powered learning platforms for students, trainers and organizations.",
  },
  "/ilm-ora-meet": {
    title: "ILM ORA Meet | Live AI-Powered Classes",
    description: "Join live, AI-powered classes and sessions on ILM ORA Meet.",
  },
  "/ilm-ora-talk": {
    title: "ILM ORA Talk | ILM ORA",
    description: "Connect, discuss and learn with the ILM ORA community.",
  },
  "/study-abroad": {
    title: "Study Abroad | ILM ORA",
    description: "Explore universities, scholarships and admissions worldwide.",
  },
  "/ilm-ora-gulf": {
    title: "ILM ORA Gulf | Career Opportunities in GCC",
    description: "Find jobs and learning opportunities across UAE, Saudi Arabia, Qatar and GCC.",
  },
  "/resume-builder": {
    title: "AI Resume Builder | ILM ORA",
    description: "Create ATS-friendly resumes using AI.",
  },
  "/student-hub": {
    title: "Student Hub | ILM ORA",
    description: "AI-powered learning designed for students with personalized learning paths.",
  },
  "/manager-hub": {
    title: "Manager Hub | ILM ORA",
    description: "Manage workforce learning with AI insights and progress tracking.",
  },
  "/trainer-hub": {
    title: "Trainer Hub | ILM ORA",
    description: "Teach smarter using AI-powered tools and analytics.",
  },
  "/fde-academy": {
    title: "FDE Academy | ILM ORA",
    description: "Explore FDE Academy programs powered by ILM ORA.",
  },
  "/workspace": {
    title: "Workspace | ILM ORA",
    description: "Collaborate and manage your AI-powered learning workspace on ILM ORA.",
  },
  "/about": {
    title: "About ILM ORA | AI Learning Platform",
    description: "Learn about ILM ORA and our mission to empower students, trainers and professionals through AI-powered education.",
  },
  "/careers": {
    title: "Careers | ILM ORA",
    description: "Explore career opportunities at ILM ORA.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | ILM ORA",
    description: "Read ILM ORA's privacy policy.",
  },
  "/terms-of-service": {
    title: "Terms of Service | ILM ORA",
    description: "Read ILM ORA's terms of service.",
  },
  "/contact": {
    title: "Contact ILM ORA",
    description: "Contact ILM ORA for support, partnerships and business inquiries.",
  },
  "/pricing": {
    title: "Pricing | ILM ORA",
    description: "Simple, transparent pricing for AI-powered learning on ILM ORA.",
  },
  "/faq": {
    title: "FAQ | ILM ORA",
    description: "Frequently asked questions about ILM ORA courses and platform.",
  },
  "/help-center": {
    title: "Help Center | ILM ORA",
    description: "Get support and answers for using ILM ORA.",
  },
  "/apply": {
    title: "Apply | ILM ORA",
    description: "Apply to join ILM ORA as a student, trainer, admin or business partner.",
  },
  "/apply-trainer": {
    title: "Become a Trainer | ILM ORA",
    description: "Apply to become a trainer on ILM ORA and teach with AI-powered tools.",
  },
  "/apply-business": {
    title: "Partner With Us | ILM ORA for Business",
    description: "Apply to bring ILM ORA's AI-powered learning to your organization.",
  },
  "/apply-student": {
    title: "Join as a Student | ILM ORA",
    description: "Apply to start learning on ILM ORA.",
  },

  // ================= AUTH — noindex =================
  "/login": { title: "Login | ILM ORA", description: "Login to your ILM ORA account.", noindex: true },
  "/reset-password": { title: "Reset Password | ILM ORA", description: "Reset your ILM ORA account password.", noindex: true },
  "/verify-email": { title: "Verify Email | ILM ORA", description: "Verify your ILM ORA account email.", noindex: true },
  "/approval-pending": { title: "Approval Pending | ILM ORA", description: "Your account approval is pending.", noindex: true },
  "/apply-admin": { title: "Admin Application | ILM ORA", description: "Admin application form.", noindex: true },

  // Demo/internal — noindex
  "/ilm-demo": { title: "ILM ORA Demo", description: "ILM ORA product demo.", noindex: true },
  "/public/sessions": { title: "Live Sessions | ILM ORA", description: "Browse upcoming live sessions on ILM ORA.", noindex: true },
};

// Dynamic detail pages (matched by prefix since they have :id)
const indexablePrefixes = {
  "/course/": { title: "Course Preview | ILM ORA", description: "Preview this course on ILM ORA before you enroll." },
  "/course-details/": { title: "Course Details | ILM ORA", description: "View detailed course information, curriculum and instructors on ILM ORA." },
  "/watch-demo/": { title: "Watch Free Demo | ILM ORA", description: "Watch a free demo lesson from ILM ORA." },
  "/syllabus/": { title: "Course Syllabus | ILM ORA", description: "View the full course syllabus on ILM ORA." },
};

// Private/dashboard prefixes — always noindex
const privatePrefixes = [
  "/student",
  "/trainer",
  "/admin",
  "/business",
  "/superadmin",
  "/workspace/",
  "/ilmorameet/",
  "/public/book-session",
  "/public/join-session",
  "/public/booking-confirmation",
  "/public/session-complete",
];

export const defaultSEO = {
  title: "ILM ORA | AI-Powered Learning Platform",
  description: "Your AI-powered learning hub for students, trainers and professionals.",
  noindex: true,
};

export function resolveSEO(pathname) {
  if (seoConfig[pathname]) return seoConfig[pathname];

  if (privatePrefixes.some((p) => pathname.startsWith(p))) {
    return { ...defaultSEO, noindex: true };
  }

  for (const prefix in indexablePrefixes) {
    if (pathname.startsWith(prefix)) return indexablePrefixes[prefix];
  }

  return defaultSEO;
}

export default seoConfig;