export const DIFFICULTY_LEVELS = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
  ];
  
  export const STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];
  
  export const SESSION_TYPES = [
    { value: "Live", label: "Live" },
    { value: "Recorded", label: "Recorded" },
    { value: "Assignment", label: "Assignment" },
  ];
  
  export const SYLLABUS_TYPES = [
    { value: "manual", label: "Manual Builder" },
    { value: "upload", label: "Upload PDF / DOC / DOCX" },
  ];
  
  export const TABS = [
    { id: "basic", label: "Basic Info", icon: "📋" },
    { id: "category", label: "Categories", icon: "🏷️" },
    { id: "about", label: "About Program", icon: "📖" },
    { id: "learning", label: "What You'll Learn", icon: "🎯" },
    { id: "highlights", label: "Highlights", icon: "⭐" },
    { id: "faqs", label: "FAQs", icon: "❓" },
    { id: "details", label: "Course Details", icon: "📚" },
    { id: "syllabus", label: "Syllabus", icon: "📅" },
  ];
  
  export const ACCEPTED_SYLLABUS_FILES = [".pdf", ".doc", ".docx"];
  
  export const MOCK_GENERATED_WEEKS = [
    {
      id: "gen-1", weekNumber: 1, title: "Introduction & Foundations",
      startDate: "", endDate: "",
      modules: [{ id: "gen-m1", title: "Getting Started", description: "Overview and setup", sessions: [] }]
    },
    {
      id: "gen-2", weekNumber: 2, title: "Core Concepts",
      startDate: "", endDate: "",
      modules: [{ id: "gen-m2", title: "Deep Dive", description: "Core concepts explained", sessions: [] }]
    },
    {
      id: "gen-3", weekNumber: 3, title: "Practical Applications",
      startDate: "", endDate: "",
      modules: [{ id: "gen-m3", title: "Hands-on Projects", description: "Apply what you've learned", sessions: [] }]
    },
    {
      id: "gen-4", weekNumber: 4, title: "Advanced Topics",
      startDate: "", endDate: "",
      modules: [{ id: "gen-m4", title: "Advanced Techniques", description: "Advanced strategies and tools", sessions: [] }]
    },
  ];