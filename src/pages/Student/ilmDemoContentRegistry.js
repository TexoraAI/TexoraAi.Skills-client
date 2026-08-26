
// ═══════════════════════════════════════════════════════════════════════
// ILM DEMO — REAL CONTENT REGISTRY
//
// Every component below is lazy-loaded from the exact same file App.jsx
// already routes to at /student/*, /trainer/*, /admin/* — nothing here is
// rebuilt, recreated, or a placeholder. IlmOraDemoPage.jsx renders
// whichever one this file resolves to, inside its own header/sidebar,
// instead of navigating away from /ilm-demo.
//
// "Business & Partnership" always normalizes to the "admin" role in
// IlmOraDemoPage.jsx (see normalizeAppRole/featureRoleKey) — there is no
// separate Business dashboard in this app, by design, so ROLE_HOME and
// SECTION maps below only cover student / trainer / admin.
// ═══════════════════════════════════════════════════════════════════════

import { lazy } from "react";

/* ─── Role home dashboards (shown when no sidebar item is selected) ───── */
const RoleHome = {
  student: lazy(() => import("../../Student/DashboardPage.jsx")),
  trainer: lazy(() => import("../../Trainer/Dashboard")),
  admin: lazy(() => import("../../Admin/AdminDashboard")),
};

export function getRoleHomeComponent(roleKey) {
  return RoleHome[roleKey] || RoleHome.student;
}

/* ─── Student sidebar items (path -> real page component) ─────────────── */
const StudentSections = {
  "/student": RoleHome.student,
  "/student/workspace": lazy(() => import("../../Student/StudentMeetings.jsx")),
  "/student/live-classes": lazy(() => import("../../Student/LiveClasses.jsx")),
  "/student/recorded-classes": lazy(() =>
    import("../../Student/RecordedClasses.jsx"),
  ),
  
  "/student/videos": lazy(() => import("../../Student/videolecctures.jsx")),
  "/student/documents": lazy(() => import("../../Student/Documents.jsx")),
  "/student/courses": lazy(() => import("../../Student/MyCourses.jsx")),
  "/student/assessments": lazy(() => import("../../Student/Assessments.jsx")),
  "/student/assignments": lazy(() =>
    import("../../Student/StudentAssignments.jsx"),
  ),
  "/student/my-quizzes": lazy(() => import("../../Student/MyQuizHistory")),
  "/student/attendance": lazy(() => import("../../Student/Attendance.jsx")),
  "/student/skill-map": lazy(() => import("../../Student/SkillMap.jsx")),
  "/student/certificates": lazy(() => import("../../Student/certificates.jsx")),
  "/student/notebook": lazy(() => import("../../Student/StudentNotebook.jsx")),
  "/student/resume-builder": lazy(() =>
    import("../../Student/ResumeBuilder.jsx"),
  ),
  "/student/doubts": lazy(() => import("../../Student/Doubts.jsx")),
  "/student/feedback": lazy(() => import("../../Student/Studentfeedback.jsx")),
  "/student/compiler": lazy(() =>
    import("../../Student/StudentCompilerPage.jsx"),
  ),
  "/student/study-plan": lazy(() =>
    import("../../Student/StudentStudyPlanPage.jsx"),
  ),
  "/student/roadmaps": lazy(() => import("../../Student/RoadmapBrowser.jsx")),

  "/student/roadmap-progress": lazy(
    () => import("../../Student/RoadmapView.jsx"),
  ),
};

/* ─── Trainer sidebar items ─────────────────────────────────────────────── */
const TrainerSections = {
  "/trainer": RoleHome.trainer,
  "/trainer/batches": lazy(() => import("../../Trainer/TrainerBatchesPage")),
  "/trainer/workspace": lazy(() => import("../../Trainer/TrainerMeetings.jsx")),
  "/trainer/upload-videos": lazy(() => import("../../Trainer/UploadVideos")),
  "/trainer/course-management": lazy(() =>
    import("../../Trainer/TrainerCourseManagement.jsx"),
  ),
  "/trainer/assessments": lazy(() => import("../../Trainer/Assessments")),
  "/trainer/attendance": lazy(() => import("../../Trainer/Attendance")),
  "/trainer/doubts-management": lazy(() =>
    import("../../Trainer/DoubtsManagement"),
  ),
  "/trainer/feedback": lazy(() => import("../../Trainer/Trainerfeedback.jsx")),
  "/trainer/live": lazy(() => import("../../Trainer/TrainerLiveClasses")),
  "/trainer/whiteboard": lazy(() => import("../../Trainer/WhiteboardPanel.jsx")),
  "/trainer/ai-companion": lazy(() =>
    import("../../Trainer/AiCompanionPanel.jsx"),
  ),
  "/trainer/student-reports": lazy(() => import("../../Trainer/StudentReports")),
  "/trainer/batch-reports": lazy(() => import("../../Trainer/BatchReports")),
  "/trainer/performance": lazy(() =>
    import("../../Trainer/PerformanceAnalysis"),
  ),
  "/trainer/skill-analytics": lazy(() =>
    import("../../Trainer/TrainerSkillMap.jsx"),
  ),
  "/trainer/compiler": lazy(() =>
    import("../../Trainer/TrainerCompilerPage.jsx"),
  ),
  "/trainer/study-plan": lazy(() =>
    import("../../Trainer/TrainerStudyPlanPage.jsx"),
  ),
  "/trainer/roadmaps": lazy(() => import("../../Trainer/RoadmapList.jsx")),

  "/trainer/roadmap-progress": lazy(
    () => import("../../Trainer/RoadmapStudentsProgress.jsx"),
  ),

  "/trainer/roadmap-editor": lazy(
    () => import("../../Trainer/RoadmapEditor.jsx"),
  ),
};

/* ─── Admin ("Business & Partnership") sidebar items ────────────────────── */
const AdminSections = {
  "/admin": RoleHome.admin,
  "/admin/workspace": lazy(() => import("../../Admin/AdminMeetings.jsx")),
  "/admin/organisation-overview": lazy(() =>
    import("../../Admin/OrganisationOverview"),
  ),
  "/admin/assessment-system": lazy(() =>
    import("../../Admin/AdminAssessmentSystem"),
  ),
  "/admin/access-control": lazy(() => import("../../Admin/AccessControlPage")),
  "/admin/courses": lazy(() => import("../../Admin/AllCourses")),
  "/admin/videos": lazy(() => import("../../Admin/AdminVideos")),
  "/admin/files": lazy(() => import("../../Admin/AdminFiles")),
  "/admin/live-sessions": lazy(() => import("../../Admin/AdminLiveSessions")),
  "/admin/certificates": lazy(() => import("../../Admin/CertificatesAdmin")),
  "/admin/reports": lazy(() => import("../../Admin/OrgReports")),
  "/admin/usage": lazy(() => import("../../Admin/UsageAnalytics")),
  "/admin/skill-analytics": lazy(() =>
    import("../../Admin/AdminSkillDashboard.jsx"),
  ),
  "/admin/feedback-review": lazy(() => import("../../Admin/Adminfeedback.jsx")),
  "/admin/attendance": lazy(() => import("../../Admin/AdminAttendance")),
  "/admin/settings": lazy(() => import("../../Admin/OrgSettings")),
  "/admin/roadmaps": lazy(() => import("../../Admin/RoadmapManagement.jsx")),

  "/admin/roadmap-analytics": lazy(
    () => import("../../Admin/RoadmapAnalytics.jsx"),
  ),
};

const SECTIONS_BY_ROLE = {
  student: StudentSections,
  trainer: TrainerSections,
  admin: AdminSections,
};

/**
 * Returns the real production component for a given role + sidebar path
 * (e.g. "trainer", "/trainer/whiteboard"), or null if that path hasn't
 * been wired up yet — the caller falls back to a small "not available"
 * card in that case instead of a fake dashboard.
 */
export function getSectionComponent(roleKey, path) {
  const sections = SECTIONS_BY_ROLE[roleKey] || SECTIONS_BY_ROLE.student;
  return sections[path] || null;
}