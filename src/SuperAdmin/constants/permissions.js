// // ============================================================
// // RBAC PERMISSIONS SYSTEM
// // Central source of truth for all role-based permissions
// // ============================================================

// export const ROLES = {
//     SUPER_ADMIN: "superadmin",
//     ADMIN: "admin",
//     TRAINER: "trainer",
//     STUDENT: "student",
//   };
  
//   export const PERMISSIONS = {
//     // Dashboard
//     VIEW_DASHBOARD: "view_dashboard",
  
//     // User Management
//     VIEW_USERS: "view_users",
//     CREATE_USER: "create_user",
//     EDIT_USER: "edit_user",
//     DELETE_USER: "delete_user",
//     SUSPEND_USER: "suspend_user",
//     ACTIVATE_USER: "activate_user",
  
//     // Student Management
//     VIEW_STUDENTS: "view_students",
//     MANAGE_STUDENTS: "manage_students",
//     VIEW_STUDENT_PROGRESS: "view_student_progress",
//     MANAGE_ENROLLMENTS: "manage_enrollments",
//     MANAGE_CERTIFICATES: "manage_certificates",
  
//     // Trainer Management
//     VIEW_TRAINERS: "view_trainers",
//     MANAGE_TRAINERS: "manage_trainers",
//     APPROVE_TRAINER: "approve_trainer",
//     VIEW_TRAINER_PERFORMANCE: "view_trainer_performance",
  
//     // Admin Management
//     VIEW_ADMINS: "view_admins",
//     MANAGE_ADMINS: "manage_admins",
//     CREATE_ADMIN: "create_admin",
  
//     // Course Management
//     VIEW_COURSES: "view_courses",
//     CREATE_COURSE: "create_course",
//     EDIT_COURSE: "edit_course",
//     DELETE_COURSE: "delete_course",
//     MANAGE_CATEGORIES: "manage_categories",
  
//     // Content
//     UPLOAD_VIDEOS: "upload_videos",
//     MANAGE_RESOURCES: "manage_resources",
//     VIEW_CONTENT: "view_content",
  
//     // Live Sessions
//     CREATE_LIVE_SESSION: "create_live_session",
//     JOIN_LIVE_SESSION: "join_live_session",
//     MANAGE_LIVE_SESSIONS: "manage_live_sessions",
  
//     // Analytics
//     VIEW_ANALYTICS: "view_analytics",
//     VIEW_REPORTS: "view_reports",
//     EXPORT_REPORTS: "export_reports",
  
//     // Finance
//     VIEW_REVENUE: "view_revenue",
//     MANAGE_PAYMENTS: "manage_payments",
  
//     // Settings
//     VIEW_SETTINGS: "view_settings",
//     MANAGE_SETTINGS: "manage_settings",
//     MANAGE_SECURITY: "manage_security",
  
//     // Role & Permission Management
//     MANAGE_ROLES: "manage_roles",
//     MANAGE_PERMISSIONS: "manage_permissions",
  
//     // Assignments & Quizzes
//     CREATE_ASSIGNMENT: "create_assignment",
//     MANAGE_ASSIGNMENTS: "manage_assignments",
//     CREATE_QUIZ: "create_quiz",
//     MANAGE_QUIZZES: "manage_quizzes",
//     ATTEMPT_QUIZ: "attempt_quiz",
  
//     // Batches
//     MANAGE_BATCHES: "manage_batches",
//     VIEW_BATCHES: "view_batches",
  
//     // Notifications
//     SEND_NOTIFICATIONS: "send_notifications",
//     VIEW_NOTIFICATIONS: "view_notifications",
//   };
  
//   // ============================================================
//   // ROLE → PERMISSION MAPPING
//   // ============================================================
//   export const ROLE_PERMISSIONS = {
//     [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS), // All permissions
  
//     [ROLES.ADMIN]: [
//       PERMISSIONS.VIEW_DASHBOARD,
//       PERMISSIONS.VIEW_USERS,
//       PERMISSIONS.CREATE_USER,
//       PERMISSIONS.EDIT_USER,
//       PERMISSIONS.SUSPEND_USER,
//       PERMISSIONS.ACTIVATE_USER,
//       PERMISSIONS.VIEW_STUDENTS,
//       PERMISSIONS.MANAGE_STUDENTS,
//       PERMISSIONS.VIEW_STUDENT_PROGRESS,
//       PERMISSIONS.MANAGE_ENROLLMENTS,
//       PERMISSIONS.MANAGE_CERTIFICATES,
//       PERMISSIONS.VIEW_TRAINERS,
//       PERMISSIONS.MANAGE_TRAINERS,
//       PERMISSIONS.APPROVE_TRAINER,
//       PERMISSIONS.VIEW_TRAINER_PERFORMANCE,
//       PERMISSIONS.VIEW_COURSES,
//       PERMISSIONS.CREATE_COURSE,
//       PERMISSIONS.EDIT_COURSE,
//       PERMISSIONS.DELETE_COURSE,
//       PERMISSIONS.MANAGE_CATEGORIES,
//       PERMISSIONS.UPLOAD_VIDEOS,
//       PERMISSIONS.MANAGE_RESOURCES,
//       PERMISSIONS.VIEW_CONTENT,
//       PERMISSIONS.MANAGE_LIVE_SESSIONS,
//       PERMISSIONS.VIEW_ANALYTICS,
//       PERMISSIONS.VIEW_REPORTS,
//       PERMISSIONS.EXPORT_REPORTS,
//       PERMISSIONS.VIEW_SETTINGS,
//       PERMISSIONS.MANAGE_BATCHES,
//       PERMISSIONS.VIEW_BATCHES,
//       PERMISSIONS.SEND_NOTIFICATIONS,
//       PERMISSIONS.VIEW_NOTIFICATIONS,
//       PERMISSIONS.MANAGE_ASSIGNMENTS,
//       PERMISSIONS.MANAGE_QUIZZES,
//       PERMISSIONS.VIEW_REVENUE,
//     ],
  
//     [ROLES.TRAINER]: [
//       PERMISSIONS.VIEW_DASHBOARD,
//       PERMISSIONS.VIEW_STUDENTS,
//       PERMISSIONS.VIEW_STUDENT_PROGRESS,
//       PERMISSIONS.VIEW_COURSES,
//       PERMISSIONS.VIEW_CONTENT,
//       PERMISSIONS.UPLOAD_VIDEOS,
//       PERMISSIONS.CREATE_LIVE_SESSION,
//       PERMISSIONS.JOIN_LIVE_SESSION,
//       PERMISSIONS.CREATE_ASSIGNMENT,
//       PERMISSIONS.MANAGE_ASSIGNMENTS,
//       PERMISSIONS.CREATE_QUIZ,
//       PERMISSIONS.MANAGE_QUIZZES,
//       PERMISSIONS.VIEW_BATCHES,
//       PERMISSIONS.VIEW_ANALYTICS,
//       PERMISSIONS.VIEW_NOTIFICATIONS,
//     ],
  
//     [ROLES.STUDENT]: [
//       PERMISSIONS.VIEW_DASHBOARD,
//       PERMISSIONS.VIEW_COURSES,
//       PERMISSIONS.VIEW_CONTENT,
//       PERMISSIONS.JOIN_LIVE_SESSION,
//       PERMISSIONS.ATTEMPT_QUIZ,
//       PERMISSIONS.VIEW_NOTIFICATIONS,
//     ],
//   };
  
//   // ============================================================
//   // USER STATUS
//   // ============================================================
//   export const USER_STATUS = {
//     ACTIVE: "active",
//     INACTIVE: "inactive",
//     SUSPENDED: "suspended",
//     PENDING: "pending",
//   };
  
//   export const STATUS_CONFIG = {
//     [USER_STATUS.ACTIVE]: {
//       label: "Active",
//       color: "text-emerald-400",
//       bg: "bg-emerald-400/10",
//       border: "border-emerald-400/20",
//       dot: "bg-emerald-400",
//     },
//     [USER_STATUS.INACTIVE]: {
//       label: "Inactive",
//       color: "text-slate-400",
//       bg: "bg-slate-400/10",
//       border: "border-slate-400/20",
//       dot: "bg-slate-400",
//     },
//     [USER_STATUS.SUSPENDED]: {
//       label: "Suspended",
//       color: "text-red-400",
//       bg: "bg-red-400/10",
//       border: "border-red-400/20",
//       dot: "bg-red-400",
//     },
//     [USER_STATUS.PENDING]: {
//       label: "Pending",
//       color: "text-amber-400",
//       bg: "bg-amber-400/10",
//       border: "border-amber-400/20",
//       dot: "bg-amber-400",
//     },
//   };




























// ============================================================
// RBAC PERMISSIONS — Updated for SaaS Hierarchy
// SUPER_ADMIN → ORG_ADMIN → TRAINER → STUDENT
// ============================================================

export const ROLES = {
  SUPER_ADMIN: "superadmin",
  ORG_ADMIN:   "org_admin",    // ← NEW: organization-scoped admin
  TRAINER:     "trainer",
  STUDENT:     "student",
  // Legacy alias kept for backward compatibility
  ADMIN:       "org_admin",
};

export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: "view_dashboard",

  // ── Super Admin: Organization Management ──
  CREATE_ORGANIZATION:   "create_organization",
  EDIT_ORGANIZATION:     "edit_organization",
  DELETE_ORGANIZATION:   "delete_organization",
  SUSPEND_ORGANIZATION:  "suspend_organization",
  VIEW_ALL_ORGS:         "view_all_orgs",

  // ── Org Admin Management ──
  CREATE_ORG_ADMIN:  "create_org_admin",
  MANAGE_ORG_ADMINS: "manage_org_admins",
  VIEW_ORG_ADMINS:   "view_org_admins",

  // ── User Management ──
  VIEW_USERS:    "view_users",
  CREATE_USER:   "create_user",
  EDIT_USER:     "edit_user",
  DELETE_USER:   "delete_user",
  SUSPEND_USER:  "suspend_user",
  ACTIVATE_USER: "activate_user",

  // ── Student Management ──
  VIEW_STUDENTS:          "view_students",
  MANAGE_STUDENTS:        "manage_students",
  VIEW_STUDENT_PROGRESS:  "view_student_progress",
  MANAGE_ENROLLMENTS:     "manage_enrollments",
  MANAGE_CERTIFICATES:    "manage_certificates",

  // ── Trainer Management ──
  VIEW_TRAINERS:            "view_trainers",
  MANAGE_TRAINERS:          "manage_trainers",
  APPROVE_TRAINER:          "approve_trainer",
  VIEW_TRAINER_PERFORMANCE: "view_trainer_performance",

  // ── Batch Management ──
  VIEW_BATCHES:    "view_batches",
  CREATE_BATCH:    "create_batch",
  EDIT_BATCH:      "edit_batch",
  DELETE_BATCH:    "delete_batch",
  MANAGE_BATCHES:  "manage_batches",
  ASSIGN_TRAINER:  "assign_trainer",

  // ── Course Management ──
  VIEW_COURSES:     "view_courses",
  CREATE_COURSE:    "create_course",
  EDIT_COURSE:      "edit_course",
  DELETE_COURSE:    "delete_course",
  MANAGE_CATEGORIES:"manage_categories",

  // ── Content ──
  UPLOAD_VIDEOS:    "upload_videos",
  MANAGE_RESOURCES: "manage_resources",
  VIEW_CONTENT:     "view_content",

  // ── Live Sessions ──
  CREATE_LIVE_SESSION: "create_live_session",
  JOIN_LIVE_SESSION:   "join_live_session",
  MANAGE_LIVE_SESSIONS:"manage_live_sessions",

  // ── Analytics ──
  VIEW_ANALYTICS: "view_analytics",
  VIEW_REPORTS:   "view_reports",
  EXPORT_REPORTS: "export_reports",

  // ── Finance ──
  VIEW_REVENUE:    "view_revenue",
  MANAGE_PAYMENTS: "manage_payments",

  // ── Settings ──
  VIEW_SETTINGS:    "view_settings",
  MANAGE_SETTINGS:  "manage_settings",
  MANAGE_SECURITY:  "manage_security",

  // ── Role & Permission Management ──
  MANAGE_ROLES:       "manage_roles",
  MANAGE_PERMISSIONS: "manage_permissions",

  // ── Assignments & Quizzes ──
  CREATE_ASSIGNMENT: "create_assignment",
  MANAGE_ASSIGNMENTS:"manage_assignments",
  CREATE_QUIZ:       "create_quiz",
  MANAGE_QUIZZES:    "manage_quizzes",
  ATTEMPT_QUIZ:      "attempt_quiz",

  // ── Notifications ──
  SEND_NOTIFICATIONS:"send_notifications",
  VIEW_NOTIFICATIONS: "view_notifications",

  // ── Admin ──
  VIEW_ADMINS:   "view_admins",
  MANAGE_ADMINS: "manage_admins",
  CREATE_ADMIN:  "create_admin",
};

// ============================================================
// ROLE → PERMISSION MAPPING
// ============================================================
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),  // all

  [ROLES.ORG_ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    // Own org users
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.SUSPEND_USER,
    PERMISSIONS.ACTIVATE_USER,
    // Students (within org)
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.MANAGE_STUDENTS,
    PERMISSIONS.VIEW_STUDENT_PROGRESS,
    PERMISSIONS.MANAGE_ENROLLMENTS,
    PERMISSIONS.MANAGE_CERTIFICATES,
    // Trainers (within org)
    PERMISSIONS.VIEW_TRAINERS,
    PERMISSIONS.MANAGE_TRAINERS,
    PERMISSIONS.APPROVE_TRAINER,
    PERMISSIONS.VIEW_TRAINER_PERFORMANCE,
    // Batches (within org)
    PERMISSIONS.VIEW_BATCHES,
    PERMISSIONS.CREATE_BATCH,
    PERMISSIONS.EDIT_BATCH,
    PERMISSIONS.DELETE_BATCH,
    PERMISSIONS.MANAGE_BATCHES,
    PERMISSIONS.ASSIGN_TRAINER,
    // Courses
    PERMISSIONS.VIEW_COURSES,
    PERMISSIONS.CREATE_COURSE,
    PERMISSIONS.EDIT_COURSE,
    PERMISSIONS.DELETE_COURSE,
    PERMISSIONS.MANAGE_CATEGORIES,
    // Content
    PERMISSIONS.UPLOAD_VIDEOS,
    PERMISSIONS.MANAGE_RESOURCES,
    PERMISSIONS.VIEW_CONTENT,
    // Live
    PERMISSIONS.MANAGE_LIVE_SESSIONS,
    // Analytics (org-scoped)
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EXPORT_REPORTS,
    // Settings (org-scoped)
    PERMISSIONS.VIEW_SETTINGS,
    // Notifications
    PERMISSIONS.SEND_NOTIFICATIONS,
    PERMISSIONS.VIEW_NOTIFICATIONS,
    // Revenue (org-scoped)
    PERMISSIONS.VIEW_REVENUE,
    // Assignments
    PERMISSIONS.MANAGE_ASSIGNMENTS,
    PERMISSIONS.MANAGE_QUIZZES,
  ],

  [ROLES.TRAINER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.VIEW_STUDENT_PROGRESS,
    PERMISSIONS.VIEW_COURSES,
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.UPLOAD_VIDEOS,
    PERMISSIONS.CREATE_LIVE_SESSION,
    PERMISSIONS.JOIN_LIVE_SESSION,
    PERMISSIONS.CREATE_ASSIGNMENT,
    PERMISSIONS.MANAGE_ASSIGNMENTS,
    PERMISSIONS.CREATE_QUIZ,
    PERMISSIONS.MANAGE_QUIZZES,
    PERMISSIONS.VIEW_BATCHES,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_NOTIFICATIONS,
  ],

  [ROLES.STUDENT]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_COURSES,
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.JOIN_LIVE_SESSION,
    PERMISSIONS.ATTEMPT_QUIZ,
    PERMISSIONS.VIEW_NOTIFICATIONS,
  ],
};

// ============================================================
// USER STATUS
// ============================================================
export const USER_STATUS = {
  ACTIVE:    "active",
  INACTIVE:  "inactive",
  SUSPENDED: "suspended",
  PENDING:   "pending",
};

export const ORG_STATUS = {
  ACTIVE:    "active",
  SUSPENDED: "suspended",
  TRIAL:     "trial",
  EXPIRED:   "expired",
};

export const BATCH_STATUS = {
  ACTIVE:    "active",
  UPCOMING:  "upcoming",
  COMPLETED: "completed",
  PAUSED:    "paused",
};

export const SUBSCRIPTION_PLANS = {
  FREE:       "free",
  STARTER:    "starter",
  PRO:        "pro",
  ENTERPRISE: "enterprise",
};

export const STATUS_CONFIG = {
  [USER_STATUS.ACTIVE]:    { label: "Active",    color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", dot: "bg-emerald-400" },
  [USER_STATUS.INACTIVE]:  { label: "Inactive",  color: "text-slate-400",   bg: "bg-slate-400/10",   border: "border-slate-400/20",   dot: "bg-slate-400"   },
  [USER_STATUS.SUSPENDED]: { label: "Suspended", color: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-400/20",     dot: "bg-red-400"     },
  [USER_STATUS.PENDING]:   { label: "Pending",   color: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/20",   dot: "bg-amber-400"   },
  active:    { label: "Active",    dot: "#10b981", bg: "rgba(16,185,129,0.12)",  color: "#059669" },
  inactive:  { label: "Inactive",  dot: "#94a3b8", bg: "rgba(148,163,184,0.12)", color: "#64748b" },
  suspended: { label: "Suspended", dot: "#ef4444", bg: "rgba(239,68,68,0.12)",   color: "#dc2626" },
  pending:   { label: "Pending",   dot: "#f59e0b", bg: "rgba(245,158,11,0.12)",  color: "#d97706" },
  trial:     { label: "Trial",     dot: "#3b82f6", bg: "rgba(59,130,246,0.12)",  color: "#2563eb" },
  expired:   { label: "Expired",   dot: "#ef4444", bg: "rgba(239,68,68,0.12)",   color: "#dc2626" },
  completed: { label: "Completed", dot: "#6366f1", bg: "rgba(99,102,241,0.12)",  color: "#6366f1" },
  upcoming:  { label: "Upcoming",  dot: "#3b82f6", bg: "rgba(59,130,246,0.12)",  color: "#2563eb" },
  paused:    { label: "Paused",    dot: "#f59e0b", bg: "rgba(245,158,11,0.12)",  color: "#d97706" },
};