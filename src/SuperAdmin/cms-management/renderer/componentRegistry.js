/**
 * componentRegistry.js
 * Maps component type strings to their metadata and default data shapes.
 * Add new component types here — no other file needs to change.
 */

export const COMPONENT_REGISTRY = {
    // ── Layout / Hero ──────────────────────────────────────────────────────────
    HeroSection: {
      label: "Hero Banner",
      category: "layout",
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "subtitle", label: "Subtitle", type: "textarea" },
        { key: "backgroundImage", label: "Background Image URL", type: "text" },
      ],
      defaultData: { title: "New Hero", subtitle: "", backgroundImage: "" },
    },
  
    CTASection: {
      label: "CTA Section",
      category: "layout",
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "subtitle", label: "Subtitle", type: "textarea" },
        { key: "buttonLabel", label: "Button Label", type: "text" },
        { key: "buttonHref", label: "Button Link", type: "text" },
      ],
      defaultData: { title: "Get Started", subtitle: "", buttonLabel: "Start Now", buttonHref: "/" },
    },
  
    // ── Card Types ─────────────────────────────────────────────────────────────
    FeatureCard: {
      label: "Feature Card",
      category: "card",
      fields: [
        { key: "icon", label: "Icon (Lucide name)", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ],
      defaultData: { icon: "Star", title: "Feature", description: "" },
    },
  
    CourseCard: {
      label: "Course Card",
      category: "card",
      fields: [
        { key: "title", label: "Course Title", type: "text" },
        { key: "duration", label: "Duration", type: "text" },
        { key: "level", label: "Level", type: "select", options: ["Beginner", "Intermediate", "Advanced"] },
        { key: "enrolled", label: "Enrolled Count", type: "number" },
        { key: "badge", label: "Badge (optional)", type: "text" },
        { key: "image", label: "Image URL", type: "text" },
      ],
      defaultData: { title: "New Course", duration: "3 months", level: "Beginner", enrolled: 0, badge: "", image: "" },
    },
  
    TrainerCard: {
      label: "Trainer Card",
      category: "card",
      fields: [
        { key: "name", label: "Name", type: "text" },
        { key: "role", label: "Role", type: "text" },
        { key: "experience", label: "Experience", type: "text" },
        { key: "avatar", label: "Avatar URL", type: "text" },
      ],
      defaultData: { name: "Trainer Name", role: "Role", experience: "0 yrs", avatar: "" },
    },
  
    StudentCard: {
      label: "Student Card",
      category: "card",
      fields: [
        { key: "name", label: "Name", type: "text" },
        { key: "batch", label: "Batch", type: "text" },
        { key: "progress", label: "Progress (%)", type: "number" },
        { key: "avatar", label: "Avatar URL", type: "text" },
      ],
      defaultData: { name: "Student Name", batch: "", progress: 0, avatar: "" },
    },
  
    BatchCard: {
      label: "Batch Card",
      category: "card",
      fields: [
        { key: "name", label: "Batch Name", type: "text" },
        { key: "students", label: "Student Count", type: "number" },
        { key: "startDate", label: "Start Date", type: "date" },
        { key: "status", label: "Status", type: "select", options: ["Active", "Upcoming", "Completed"] },
      ],
      defaultData: { name: "New Batch", students: 0, startDate: "", status: "Upcoming" },
    },
  
    ResourceCard: {
      label: "Resource Card",
      category: "card",
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "type", label: "Type (PDF, ZIP…)", type: "text" },
        { key: "size", label: "Size", type: "text" },
      ],
      defaultData: { title: "Resource", type: "PDF", size: "" },
    },
  
    CertificateCard: {
      label: "Certificate Card",
      category: "card",
      fields: [
        { key: "title", label: "Certificate Title", type: "text" },
        { key: "issuer", label: "Issuer", type: "text" },
        { key: "validity", label: "Validity", type: "text" },
      ],
      defaultData: { title: "Certificate", issuer: "", validity: "Lifetime" },
    },
  
    AnalyticsCard: {
      label: "Analytics Card",
      category: "card",
      fields: [
        { key: "metric", label: "Metric Name", type: "text" },
        { key: "value", label: "Value", type: "text" },
        { key: "trend", label: "Trend", type: "select", options: ["up", "down", "stable"] },
      ],
      defaultData: { metric: "Metric", value: "0", trend: "stable" },
    },
  
    PlacementCard: {
      label: "Placement Card",
      category: "card",
      fields: [
        { key: "company", label: "Company", type: "text" },
        { key: "placed", label: "Students Placed", type: "number" },
        { key: "month", label: "Month", type: "text" },
      ],
      defaultData: { company: "", placed: 0, month: "" },
    },
  
    ReportCard: {
      label: "Report Card",
      category: "card",
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "date", label: "Date", type: "text" },
        { key: "type", label: "File Type", type: "text" },
      ],
      defaultData: { title: "Report", date: "", type: "PDF" },
    },
  
    SessionCard: {
      label: "Live Session Card",
      category: "card",
      fields: [
        { key: "title", label: "Session Title", type: "text" },
        { key: "date", label: "Date", type: "date" },
        { key: "time", label: "Time", type: "text" },
        { key: "duration", label: "Duration", type: "text" },
      ],
      defaultData: { title: "New Session", date: "", time: "", duration: "60 min" },
    },
  
    AssignmentCard: {
      label: "Assignment Card",
      category: "card",
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "dueDate", label: "Due Date", type: "date" },
        { key: "submissions", label: "Submissions", type: "number" },
        { key: "total", label: "Total Students", type: "number" },
      ],
      defaultData: { title: "Assignment", dueDate: "", submissions: 0, total: 0 },
    },
  
    TestimonialCard: {
      label: "Testimonial Card",
      category: "card",
      fields: [
        { key: "name", label: "Student Name", type: "text" },
        { key: "quote", label: "Quote", type: "textarea" },
        { key: "rating", label: "Rating (1-5)", type: "number" },
        { key: "avatar", label: "Avatar URL", type: "text" },
      ],
      defaultData: { name: "", quote: "", rating: 5, avatar: "" },
    },
  
    // ── List / FAQ / Nav ───────────────────────────────────────────────────────
    FAQItem: {
      label: "FAQ Item",
      category: "list",
      fields: [
        { key: "question", label: "Question", type: "text" },
        { key: "answer", label: "Answer", type: "textarea" },
      ],
      defaultData: { question: "Question?", answer: "Answer." },
    },
  
    RoadmapStep: {
      label: "Roadmap Step",
      category: "list",
      fields: [
        { key: "step", label: "Step Number", type: "number" },
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ],
      defaultData: { step: 1, title: "Step", description: "" },
    },
  
    NavigationItem: {
      label: "Navigation Item",
      category: "navigation",
      fields: [
        { key: "label", label: "Label", type: "text" },
        { key: "href", label: "Link", type: "text" },
      ],
      defaultData: { label: "Link", href: "/" },
    },
  };
  
  // Section types — used by SectionEditor to know what section types exist
  export const SECTION_REGISTRY = {
    HeroSection: { label: "Hero Banner", allowedComponents: [] },
    FeaturesSection: { label: "Features Section", allowedComponents: ["FeatureCard"] },
    CoursesSection: { label: "Courses Section", allowedComponents: ["CourseCard"] },
    TrainersSection: { label: "Trainers Section", allowedComponents: ["TrainerCard"] },
    ResourcesSection: { label: "Resources Section", allowedComponents: ["ResourceCard"] },
    CertificatesSection: { label: "Certificates Section", allowedComponents: ["CertificateCard"] },
    RoadmapSection: { label: "Roadmap Section", allowedComponents: ["RoadmapStep"] },
    FAQSection: { label: "FAQ Section", allowedComponents: ["FAQItem"] },
    TestimonialsSection: { label: "Testimonials Section", allowedComponents: ["TestimonialCard"] },
    CTASection: { label: "CTA Section", allowedComponents: [] },
    NavigationSection: { label: "Navigation", allowedComponents: ["NavigationItem"] },
    BatchSection: { label: "Batch Section", allowedComponents: ["BatchCard"] },
    StudentsSection: { label: "Students Section", allowedComponents: ["StudentCard"] },
    LiveSessionsSection: { label: "Live Sessions", allowedComponents: ["SessionCard"] },
    AssignmentsSection: { label: "Assignments Section", allowedComponents: ["AssignmentCard"] },
    AnalyticsSection: { label: "Analytics Section", allowedComponents: ["AnalyticsCard"] },
    ReportsSection: { label: "Reports Section", allowedComponents: ["ReportCard"] },
    PlacementSection: { label: "Placement Section", allowedComponents: ["PlacementCard"] },
    StudentManagementSection: { label: "Student Management", allowedComponents: [] },
    TrainerManagementSection: { label: "Trainer Management", allowedComponents: [] },
    BatchManagementSection: { label: "Batch Management", allowedComponents: [] },
  };
  
  export const getComponentMeta = (type) =>
    COMPONENT_REGISTRY[type] || { label: type, fields: [], defaultData: {} };
  
  export const getSectionMeta = (type) =>
    SECTION_REGISTRY[type] || { label: type, allowedComponents: [] };