/**
 * cmsSeed.js — Generates initial CMS data for Student, Trainer, and Admin Hubs.
 * Call seedCMSData() once on app init if localStorage is empty.
 *
 * USAGE in your App.jsx or index.jsx:
 *   import { seedCMSData } from "./cms-management/services/cmsSeed";
 *   seedCMSData(); // safe to call on every boot — skips if data exists
 */

import {
  createPage,
  createSection,
  createComponent,
  getPages,
} from "./cmsApi";

// ─── Student Hub Seed ─────────────────────────────────────────────────────────

const studentHubSeed = async (pageId) => {
  const sections = [
    {
      key: "hero",
      type: "HeroSection",
      label: "Hero Banner",
      data: {
        title: "Launch Your Tech Career",
        subtitle: "Learn from industry experts with hands-on projects",
        backgroundImage: "",
        buttons: [
          { label: "Explore Courses", href: "/courses", variant: "primary" },
          { label: "Meet Trainers", href: "/trainers", variant: "secondary" },
        ],
      },
    },
    {
      key: "features",
      type: "FeaturesSection",
      label: "Feature Cards",
      data: { title: "Why Choose Us" },
      components: [
        { type: "FeatureCard", data: { icon: "Zap", title: "Live Sessions", description: "Interactive live classes with real-time Q&A" } },
        { type: "FeatureCard", data: { icon: "BookOpen", title: "Structured Curriculum", description: "Industry-aligned modules built by experts" } },
        { type: "FeatureCard", data: { icon: "Award", title: "Certificates", description: "Earn recognized certificates on completion" } },
        { type: "FeatureCard", data: { icon: "Users", title: "Community", description: "Join thousands of learners and alumni" } },
      ],
    },
    {
      key: "courses",
      type: "CoursesSection",
      label: "Course Cards",
      data: { title: "Popular Courses" },
      components: [
        { type: "CourseCard", data: { title: "Full Stack Development", duration: "6 months", level: "Beginner", enrolled: 1240, badge: "Trending", image: "" } },
        { type: "CourseCard", data: { title: "Data Science & ML", duration: "5 months", level: "Intermediate", enrolled: 980, badge: "New", image: "" } },
        { type: "CourseCard", data: { title: "DevOps & Cloud", duration: "4 months", level: "Advanced", enrolled: 620, badge: "", image: "" } },
      ],
    },
    {
      key: "trainers",
      type: "TrainersSection",
      label: "Trainer Cards",
      data: { title: "Meet Your Trainers" },
      components: [
        { type: "TrainerCard", data: { name: "Priya Sharma", role: "Full Stack Lead", experience: "8 yrs", avatar: "" } },
        { type: "TrainerCard", data: { name: "Rahul Verma", role: "Data Scientist", experience: "6 yrs", avatar: "" } },
        { type: "TrainerCard", data: { name: "Anjali Nair", role: "Cloud Architect", experience: "10 yrs", avatar: "" } },
      ],
    },
    {
      key: "resources",
      type: "ResourcesSection",
      label: "Resource Cards",
      data: { title: "Learning Resources" },
      components: [
        { type: "ResourceCard", data: { title: "Interview Prep Guide", type: "PDF", size: "2.4 MB" } },
        { type: "ResourceCard", data: { title: "Project Templates", type: "ZIP", size: "8.1 MB" } },
        { type: "ResourceCard", data: { title: "DSA Cheatsheet", type: "PDF", size: "1.2 MB" } },
      ],
    },
    {
      key: "testimonials",
      type: "TestimonialsSection",
      label: "Testimonials",
      data: { title: "What Students Say" },
      components: [
        { type: "TestimonialCard", data: { name: "Amit Kumar", quote: "Best platform I've ever used. Got placed in 3 months!", rating: 5, avatar: "" } },
        { type: "TestimonialCard", data: { name: "Sneha Patel", quote: "The trainers are extremely knowledgeable and supportive.", rating: 5, avatar: "" } },
        { type: "TestimonialCard", data: { name: "Rohan Gupta", quote: "Live sessions are super interactive. Highly recommend!", rating: 4, avatar: "" } },
      ],
    },
    {
      key: "faq",
      type: "FAQSection",
      label: "FAQ",
      data: { title: "Frequently Asked Questions" },
      components: [
        { type: "FAQItem", data: { question: "How long are the courses?", answer: "Courses range from 3 to 6 months depending on the track." } },
        { type: "FAQItem", data: { question: "Are there any prerequisites?", answer: "Basic computer knowledge is sufficient for beginner courses." } },
        { type: "FAQItem", data: { question: "Do I get a certificate?", answer: "Yes! You receive an industry-recognized certificate upon completion." } },
      ],
    },
    {
      key: "cta",
      type: "CTASection",
      label: "CTA Banner",
      data: { title: "Ready to Start Your Journey?", subtitle: "Join 10,000+ students already learning", buttonLabel: "Enroll Now", buttonHref: "/enroll" },
    },
  ];

  for (let i = 0; i < sections.length; i++) {
    const { components, ...sectionData } = sections[i];
    const sec = await createSection({ pageId, order: i, ...sectionData, visible: true, published: true });
    if (components) {
      for (let j = 0; j < components.length; j++) {
        await createComponent({ sectionId: sec.id, order: j, visible: true, published: true, ...components[j] });
      }
    }
  }
};

// ─── Trainer Hub Seed ─────────────────────────────────────────────────────────

const trainerHubSeed = async (pageId) => {
  const sections = [
    {
      key: "hero",
      type: "HeroSection",
      label: "Hero Banner",
      data: {
        title: "Welcome, Trainers!",
        subtitle: "Manage your batches, students, and sessions in one place",
        backgroundImage: "",
        buttons: [
          { label: "My Batches", href: "/trainer/batches", variant: "primary" },
          { label: "Schedule Session", href: "/trainer/sessions", variant: "secondary" },
        ],
      },
    },
    {
      key: "features",
      type: "FeaturesSection",
      label: "Feature Cards",
      data: { title: "Your Trainer Dashboard" },
      components: [
        { type: "FeatureCard", data: { icon: "Users", title: "Manage Students", description: "Track progress, attendance, and performance" } },
        { type: "FeatureCard", data: { icon: "ClipboardList", title: "Assignments", description: "Create, assign, and grade assignments" } },
        { type: "FeatureCard", data: { icon: "BarChart2", title: "Analytics", description: "Detailed insights on batch performance" } },
        { type: "FeatureCard", data: { icon: "Video", title: "Live Sessions", description: "Schedule and host interactive live classes" } },
      ],
    },
    {
      key: "batches",
      type: "BatchSection",
      label: "Active Batches",
      data: { title: "My Batches" },
      components: [
        { type: "BatchCard", data: { name: "Full Stack Batch 12", students: 45, startDate: "2026-01-15", status: "Active" } },
        { type: "BatchCard", data: { name: "Data Science Batch 8", students: 32, startDate: "2026-02-01", status: "Active" } },
        { type: "BatchCard", data: { name: "DevOps Batch 5", students: 28, startDate: "2026-07-01", status: "Upcoming" } },
      ],
    },
    {
      key: "students",
      type: "StudentsSection",
      label: "Student Overview",
      data: { title: "Recent Students" },
      components: [
        { type: "StudentCard", data: { name: "Aanya Singh", batch: "Full Stack Batch 12", progress: 72, avatar: "" } },
        { type: "StudentCard", data: { name: "Karan Mehta", batch: "Data Science Batch 8", progress: 55, avatar: "" } },
        { type: "StudentCard", data: { name: "Divya Rao", batch: "Full Stack Batch 12", progress: 88, avatar: "" } },
      ],
    },
    {
      key: "assignments",
      type: "AssignmentsSection",
      label: "Assignments",
      data: { title: "Current Assignments" },
      components: [
        { type: "AssignmentCard", data: { title: "React Project 1", dueDate: "2026-06-20", submissions: 38, total: 45 } },
        { type: "AssignmentCard", data: { title: "ML Model Building", dueDate: "2026-06-25", submissions: 20, total: 32 } },
        { type: "AssignmentCard", data: { title: "Docker Deployment", dueDate: "2026-07-05", submissions: 0, total: 28 } },
      ],
    },
    {
      key: "analytics",
      type: "AnalyticsSection",
      label: "Analytics",
      data: { title: "Performance Analytics" },
      components: [
        { type: "AnalyticsCard", data: { metric: "Avg Attendance", value: "87%", trend: "up" } },
        { type: "AnalyticsCard", data: { metric: "Assignments Submitted", value: "94%", trend: "up" } },
        { type: "AnalyticsCard", data: { metric: "Avg Score", value: "76/100", trend: "stable" } },
        { type: "AnalyticsCard", data: { metric: "Dropout Rate", value: "2.1%", trend: "down" } },
      ],
    },
    {
      key: "resources",
      type: "ResourcesSection",
      label: "Resources",
      data: { title: "Teaching Resources" },
      components: [
        { type: "ResourceCard", data: { title: "Slide Deck - React Hooks", type: "PPTX", size: "5.2 MB" } },
        { type: "ResourceCard", data: { title: "Assessment Template", type: "DOCX", size: "0.8 MB" } },
        { type: "ResourceCard", data: { title: "Lab Exercises Pack", type: "ZIP", size: "12.4 MB" } },
      ],
    },
    {
      key: "faq",
      type: "FAQSection",
      label: "FAQ",
      data: { title: "Trainer FAQs" },
      components: [
        { type: "FAQItem", data: { question: "How do I mark attendance?", answer: "Use the Batch → Session page to mark attendance for each session." } },
        { type: "FAQItem", data: { question: "Can I add extra resources?", answer: "Yes, upload materials in the Resources section of your batch." } },
      ],
    },
    {
      key: "cta",
      type: "CTASection",
      label: "CTA",
      data: { title: "Upcoming Session Today", subtitle: "Full Stack Batch 12 — 4:00 PM IST", buttonLabel: "Join Now", buttonHref: "/trainer/session/live" },
    },
  ];

  for (let i = 0; i < sections.length; i++) {
    const { components, ...sectionData } = sections[i];
    const sec = await createSection({ pageId, order: i, ...sectionData, visible: true, published: true });
    if (components) {
      for (let j = 0; j < components.length; j++) {
        await createComponent({ sectionId: sec.id, order: j, visible: true, published: true, ...components[j] });
      }
    }
  }
};

// ─── Admin Hub Seed ───────────────────────────────────────────────────────────

const adminHubSeed = async (pageId) => {
  const sections = [
    {
      key: "hero",
      type: "HeroSection",
      label: "Hero Banner",
      data: {
        title: "Admin Control Panel",
        subtitle: "Full visibility and control over the platform",
        backgroundImage: "",
        buttons: [
          { label: "View Reports", href: "/admin/reports", variant: "primary" },
          { label: "Manage Users", href: "/admin/users", variant: "secondary" },
        ],
      },
    },
    {
      key: "features",
      type: "FeaturesSection",
      label: "Feature Cards",
      data: { title: "Admin Capabilities" },
      components: [
        { type: "FeatureCard", data: { icon: "BarChart2", title: "Analytics", description: "Platform-wide performance metrics" } },
        { type: "FeatureCard", data: { icon: "Users", title: "User Management", description: "Manage students, trainers, and staff" } },
        { type: "FeatureCard", data: { icon: "Shield", title: "Access Control", description: "Role-based permissions for all users" } },
        { type: "FeatureCard", data: { icon: "Award", title: "Certificates", description: "Issue and verify student certificates" } },
      ],
    },
    {
      key: "analytics",
      type: "AnalyticsSection",
      label: "Platform Analytics",
      data: { title: "Key Metrics" },
      components: [
        { type: "AnalyticsCard", data: { metric: "Total Students", value: "4,280", trend: "up" } },
        { type: "AnalyticsCard", data: { metric: "Active Trainers", value: "38", trend: "stable" } },
        { type: "AnalyticsCard", data: { metric: "Active Batches", value: "22", trend: "up" } },
        { type: "AnalyticsCard", data: { metric: "Revenue (MTD)", value: "₹18.4L", trend: "up" } },
        { type: "AnalyticsCard", data: { metric: "Placement Rate", value: "91%", trend: "up" } },
        { type: "AnalyticsCard", data: { metric: "Dropout Rate", value: "3.2%", trend: "down" } },
      ],
    },
    {
      key: "reports",
      type: "ReportsSection",
      label: "Reports",
      data: { title: "Recent Reports" },
      components: [
        { type: "ReportCard", data: { title: "Monthly Revenue Report", date: "Jun 2026", type: "PDF" } },
        { type: "ReportCard", data: { title: "Student Progress Summary", date: "May 2026", type: "XLSX" } },
        { type: "ReportCard", data: { title: "Placement Drive Results", date: "Apr 2026", type: "PDF" } },
        { type: "ReportCard", data: { title: "Trainer Performance Q1", date: "Mar 2026", type: "PDF" } },
      ],
    },
    {
      key: "placement",
      type: "PlacementSection",
      label: "Placement Stats",
      data: { title: "Recent Placements" },
      components: [
        { type: "PlacementCard", data: { company: "Infosys", placed: 24, month: "May 2026" } },
        { type: "PlacementCard", data: { company: "TCS", placed: 18, month: "May 2026" } },
        { type: "PlacementCard", data: { company: "Wipro", placed: 15, month: "Apr 2026" } },
        { type: "PlacementCard", data: { company: "Accenture", placed: 31, month: "Apr 2026" } },
      ],
    },
    {
      key: "resources",
      type: "ResourcesSection",
      label: "Admin Resources",
      data: { title: "Admin Documents" },
      components: [
        { type: "ResourceCard", data: { title: "Platform SOP Manual", type: "PDF", size: "3.8 MB" } },
        { type: "ResourceCard", data: { title: "Compliance Checklist", type: "DOCX", size: "1.1 MB" } },
        { type: "ResourceCard", data: { title: "HR Policy Document", type: "PDF", size: "2.0 MB" } },
      ],
    },
    {
      key: "certificates",
      type: "CertificatesSection",
      label: "Certificates",
      data: { title: "Active Certificate Programs" },
      components: [
        { type: "CertificateCard", data: { title: "Full Stack Developer", issuer: "TechAcademy", validity: "Lifetime" } },
        { type: "CertificateCard", data: { title: "Data Science Pro", issuer: "TechAcademy", validity: "Lifetime" } },
        { type: "CertificateCard", data: { title: "Cloud & DevOps", issuer: "TechAcademy", validity: "Lifetime" } },
      ],
    },
    {
      key: "faq",
      type: "FAQSection",
      label: "Admin FAQ",
      data: { title: "Admin FAQs" },
      components: [
        { type: "FAQItem", data: { question: "How to onboard a new trainer?", answer: "Go to User Management → Add Trainer → Fill details → Assign batches." } },
        { type: "FAQItem", data: { question: "How to issue a certificate?", answer: "Navigate to Certificates → Select Student → Verify completion → Issue." } },
        { type: "FAQItem", data: { question: "How to generate a custom report?", answer: "Go to Reports → Custom Report → Select date range and filters → Export." } },
      ],
    },
    {
      key: "cta",
      type: "CTASection",
      label: "CTA",
      data: { title: "Need Help?", subtitle: "Contact the platform support team", buttonLabel: "Get Support", buttonHref: "/admin/support" },
    },
  ];

  for (let i = 0; i < sections.length; i++) {
    const { components, ...sectionData } = sections[i];
    const sec = await createSection({ pageId, order: i, ...sectionData, visible: true, published: true });
    if (components) {
      for (let j = 0; j < components.length; j++) {
        await createComponent({ sectionId: sec.id, order: j, visible: true, published: true, ...components[j] });
      }
    }
  }
};

// ─── Main Seed Function ───────────────────────────────────────────────────────

/**
 * seedCMSData()
 * Idempotent — skips if pages already exist in localStorage.
 * Call once on app startup:
 *
 *   import { seedCMSData } from "./cms-management/services/cmsSeed";
 *   seedCMSData();
 */
export const seedCMSData = async () => {
  const existing = await getPages();
  if (existing.length > 0) return; // Already seeded

  console.log("[CMS] Seeding initial data...");

  const [studentPage, trainerPage, adminPage] = await Promise.all([
    createPage({ slug: "student-hub", title: "Student Hub", description: "Student-facing landing page", published: true }),
    createPage({ slug: "trainer-hub", title: "Trainer Hub", description: "Trainer dashboard page", published: true }),
    createPage({ slug: "admin-hub", title: "Admin Hub", description: "Admin control panel page", published: true }),
  ]);

  await Promise.all([
    studentHubSeed(studentPage.id),
    trainerHubSeed(trainerPage.id),
    adminHubSeed(adminPage.id),
  ]);

  console.log("[CMS] Seed complete ✅");
};

export default seedCMSData;
