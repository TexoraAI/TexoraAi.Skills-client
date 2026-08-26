// // pages/admin/AccessControlPage.jsx
// //
// // ADMIN PORTAL → "Access Control" (new top-level sidebar item)
// //
// // Purpose: lets an ORG ADMIN control per-user feature access for the
// // trainers and students that belong to THEIR organization — mirrors the
// // SuperAdmin → OrganizationDetailsPage → UserPermissionsDrawer pattern,
// // but scoped down one level (admin can only touch their own org's users).
// //
// // ─────────────────────────────────────────────────────────────────────────
// // HOW TO WIRE THIS UP LATER (search for "TODO(BACKEND)"):
// //
// // 1. accessControlService below is a STUB. Replace each method with a real
// //    call into your existing service files (userService, batchService,
// //    courseService, videoService, fileService, chatService,
// //    attendanceService, assessmentService, etc).
// //
// // 2. Each microservice needs TWO new admin-scoped endpoints (mirrors the
// //    superadmin org endpoints you already have, just JWT-scoped to the
// //    admin's own org instead of superadmin):
// //
// //      GET  /{service}/admin/feature-flags/user/:email
// //      PUT  /{service}/admin/feature-flags/user/:email   { enabled, features }
// //
// //    Backend must verify the target user (trainer/student email) belongs
// //    to req.user.organizationId before reading/writing — this is the
// //    critical security boundary that makes this "admin can only control
// //    their own org's people" instead of superadmin's global control.
// //
// // 3. getOrgTrainers / getOrgStudents can reuse whatever endpoint your
// //    admin dashboard already uses to list org members (e.g.
// //    userService.getUsersByOrg(orgId) filtered by role client-side, same
// //    as OrganizationDetailsPage.jsx already does).
// // ─────────────────────────────────────────────────────────────────────────

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import userService from "../services/userService";
// import {
//   getAdminUserFeatureFlags,
//   updateAdminUserFeatureFlags,
// } from "../services/batchService";
// import attendanceService from "../services/attendanceService"; // adjust path if needed
// import fileService from "../services/fileService"; // adjust path if needed
// // Role string used across the app ("ROLE_TRAINER"/"ROLE_STUDENT", same as
// // AllUsers.jsx) → the role key SERVICES_CONFIG.features is keyed by
// // ("trainer"/"student"). Keep this in one place so nothing drifts.
// import videoService from "../services/videoService"; // adjust path if needed
// import assessmentService from "../services/assessmentService";
// import {
//   getAdminUserChatFeatureFlags,
//   updateAdminUserChatFeatureFlags,
// } from "../services/chatService"; // adjust path
// const APP_ROLE_TO_ROLE_KEY = {
//   ROLE_TRAINER: "trainer",
//   ROLE_STUDENT: "student",
// };
// const ROLE_KEY_TO_APP_ROLE = {
//   trainer: "ROLE_TRAINER",
//   student: "ROLE_STUDENT",
// };

// // ═════════════════════════════════════════════════════════════════════════
// // Real org-member lookups — same pattern AllUsers.jsx already uses:
// // userService.getUsersByOrg(orgId) returns every user in the org, we filter
// // by `roles` client-side. Feature-flag calls below are still stubs until
// // each microservice exposes the admin-scoped flag endpoints.
// // ═════════════════════════════════════════════════════════════════════════
// const accessControlService = {
//   // Trainers belonging to this org (roles === "ROLE_TRAINER")
//   // Trainers belonging to this org (roles === "ROLE_TRAINER")
//   getOrgTrainers: async (orgId) => {
//     if (!orgId) return [];
//     const data = await userService.getUsersByOrg(orgId);
//     const list = Array.isArray(data) ? data : data?.content || [];
//     return list.filter((u) => u.roles === "ROLE_TRAINER");
//   },
//   // Students belonging to this org (roles === "ROLE_STUDENT")
//   getOrgStudents: async (orgId) => {
//     if (!orgId) return [];
//     const data = await userService.getUsersByOrg(orgId);
//     const list = Array.isArray(data) ? data : data?.content || [];
//     return list.filter((u) => u.roles === "ROLE_STUDENT");
//   },
//   // GET profile for the drawer's "Profile" tab — reuses the exact same
//   // calls AllUsers.jsx's openProfile() uses.
//   getUserProfile: async (roleKey, email) => {
//     return roleKey === "trainer"
//       ? userService.getTrainerProfileByEmail(email)
//       : userService.getStudentProfileByEmail(email);
//   },

//   // getUserServiceFlags: async (serviceKey, email) => {
//   //   const map = {
//   //     batch: getAdminUserFeatureFlags, // returns res.data already
//   //     attendance: (email) =>
//   //       attendanceService
//   //         .getAdminUserAttendanceFeatureFlags(email)
//   //         .then((res) => res.data), // normalize to same shape as batch
//   //     file: (email) =>
//   //       fileService.getAdminUserFileFeatureFlags(email).then((res) => res.data), // normalize to same shape as batch
//   //   };
//   //   if (!map[serviceKey]) {
//   //     throw new Error(`accessControlService: ${serviceKey} not wired up yet`);
//   //   }
//   //   return map[serviceKey](email);
//   // },
//   // updateUserServiceFlags: async (serviceKey, email, dto) => {
//   //   const map = {
//   //     batch: updateAdminUserFeatureFlags,
//   //     attendance: (email, dto) =>
//   //       attendanceService
//   //         .updateAdminUserAttendanceFeatureFlags(email, dto)
//   //         .then((res) => res.data),
//   //     file: (email, dto) =>
//   //       fileService
//   //         .updateAdminUserFileFeatureFlags(email, dto)
//   //         .then((res) => res.data),
//   //   };
//   //   if (!map[serviceKey]) {
//   //     throw new Error(`accessControlService: ${serviceKey} not wired up yet`);
//   //   }
//   //   return map[serviceKey](email, dto);
//   // },
//   getUserServiceFlags: async (serviceKey, email) => {
//     const map = {
//       batch: getAdminUserFeatureFlags, // returns res.data already
//       attendance: (email) =>
//         attendanceService
//           .getAdminUserAttendanceFeatureFlags(email)
//           .then((res) => res.data), // normalize to same shape as batch
//       file: (email) =>
//         fileService.getAdminUserFileFeatureFlags(email).then((res) => res.data),
//       video: (email) =>
//         videoService
//           .getAdminUserVideoFeatureFlags(email)
//           .then((res) => res.data),
//       assessment: (email) =>
//         assessmentService
//           .getAdminUserAssessmentFeatureFlags(email)
//           .then((res) => res.data),
//       chat: (email) =>
//         getAdminUserChatFeatureFlags(email).then((res) => res.data),
//     };
//     if (!map[serviceKey]) {
//       throw new Error(`accessControlService: ${serviceKey} not wired up yet`);
//     }
//     return map[serviceKey](email);
//   },
//   updateUserServiceFlags: async (serviceKey, email, dto) => {
//     const map = {
//       batch: updateAdminUserFeatureFlags,
//       attendance: (email, dto) =>
//         attendanceService
//           .updateAdminUserAttendanceFeatureFlags(email, dto)
//           .then((res) => res.data),
//       file: (email, dto) =>
//         fileService
//           .updateAdminUserFileFeatureFlags(email, dto)
//           .then((res) => res.data),
//       video: (email, dto) =>
//         videoService
//           .updateAdminUserVideoFeatureFlags(email, dto)
//           .then((res) => res.data),
//       assessment: (email, dto) =>
//         assessmentService
//           .updateAdminUserAssessmentFeatureFlags(email, dto)
//           .then((res) => res.data),
//       chat: (email, dto) =>
//         updateAdminUserChatFeatureFlags(email, dto).then((res) => res.data),
//     };
//     if (!map[serviceKey]) {
//       throw new Error(`accessControlService: ${serviceKey} not wired up yet`);
//     }
//     return map[serviceKey](email, dto);
//   },
// };

// // ═════════════════════════════════════════════════════════════════════════
// // SERVICES_CONFIG — same shape/keys as onboarding + organization pages.
// // Keep this in a shared file (e.g. src/config/servicesConfig.js) and import
// // it in all three places once you wire the backend, so there's one source
// // of truth for feature keys/endpoints.
// // ═════════════════════════════════════════════════════════════════════════
// export const SERVICES_CONFIG = [
//   {
//     key: "assessment",
//     label: "Assessment",
//     icon: "📝",
//     gradient: "linear-gradient(135deg,#8b5cf6,#6366f1)",
//     color: "#8b5cf6",
//     colorLight: "#ede9fe",
//     colorDark: "rgba(139,92,246,0.15)",
//     glow: "rgba(139,92,246,0.4)",
//     features: {
//       trainer: [
//         {
//           key: "create_quiz",
//           label: "Create & manage quizzes",
//           endpoint: "POST /quizzes + related",
//         },
//         {
//           key: "create_assignment",
//           label: "Create & manage assignments",
//           endpoint: "POST /assignments + related",
//         },
//         {
//           key: "create_coding_problem",
//           label: "Create & manage coding problems",
//           endpoint: "POST /v1/problems + related",
//         },
//         {
//           key: "create_study_plan",
//           label: "Create & manage study plans",
//           endpoint: "POST /v1/study-plans + related",
//         },
//       ],
//       student: [
//         {
//           key: "attempt_quiz",
//           label: "Attempt quizzes",
//           endpoint: "POST /attempts/submit + related",
//         },
//         {
//           key: "submit_assignment",
//           label: "Submit assignments",
//           endpoint: "POST /submissions/:assignmentId + related",
//         },
//         {
//           key: "solve_coding_problem",
//           label: "Solve coding problems",
//           endpoint: "POST /v1/code/run + related",
//         },
//         {
//           key: "access_study_plan",
//           label: "Access study plans",
//           endpoint: "GET /v1/study-plans/student + related",
//         },
//       ],
//       admin: [],
//     },
//   },
//   {
//     key: "attendance",
//     label: "Attendance",
//     icon: "🗓️",
//     gradient: "linear-gradient(135deg,#14b8a6,#06b6d4)",
//     color: "#14b8a6",
//     colorLight: "#f0fdfa",
//     colorDark: "rgba(20,184,166,0.15)",
//     glow: "rgba(20,184,166,0.4)",
//     features: {
//       trainer: [
//         {
//           key: "mark_attendance",
//           label: "Mark student attendance",
//           endpoint: "POST /trainer/attendance/mark",
//         },
//         {
//           key: "mark_trainer_session",
//           label: "Mark own session attendance",
//           endpoint: "POST /trainer/attendance/session/mark",
//         },
//         {
//           key: "get_trainer_session_history",
//           label: "View own session history",
//           endpoint: "GET /trainer/attendance/session/history",
//         },
//         {
//           key: "get_trainer_history",
//           label: "View marked attendance history",
//           endpoint: "GET /trainer/attendance/history",
//         },
//         {
//           key: "get_trainer_session_history_filter",
//           label: "View filtered session history",
//           endpoint: "GET /trainer/attendance/session/history/filter",
//         },
//         {
//           key: "download_trainer_report",
//           label: "Download attendance report",
//           endpoint: "GET /trainer/attendance/download",
//         },
//       ],
//       student: [
//         {
//           key: "get_monthly_attendance",
//           label: "View monthly attendance",
//           endpoint: "GET /student/attendance/monthly",
//         },
//         {
//           key: "get_student_history",
//           label: "View attendance history",
//           endpoint: "GET /student/attendance/history",
//         },
//         {
//           key: "download_student_report",
//           label: "Download attendance report",
//           endpoint: "GET /student/attendance/download",
//         },
//       ],
//       admin: [],
//     },
//   },
//   {
//     key: "batch",
//     label: "Batch",
//     icon: "👥",
//     gradient: "linear-gradient(135deg,#f59e0b,#f97316)",
//     color: "#f59e0b",
//     colorLight: "#fffbeb",
//     colorDark: "rgba(245,158,11,0.15)",
//     glow: "rgba(245,158,11,0.4)",
//     features: {
//       trainer: [
//         {
//           key: "get_trainer_batches",
//           label: "View my batches",
//           endpoint: "GET /batch/trainer",
//         },
//         {
//           key: "get_trainer_dashboard",
//           label: "Trainer dashboard",
//           endpoint: "GET /batch/trainer + /batch/trainer/students",
//         },
//         {
//           key: "get_batch_students",
//           label: "View students in batch",
//           endpoint: "GET /batch/trainer/batches/:id/students",
//         },
//       ],
//       student: [
//         {
//           key: "get_student_batch",
//           label: "View my batch",
//           endpoint: "GET /batch/student",
//         },
//         {
//           key: "get_student_classroom",
//           label: "View classroom",
//           endpoint: "GET /batch/student/classroom",
//         },
//       ],
//       admin: [],
//     },
//   },
//   {
//     key: "chat",
//     label: "Chat",
//     icon: "💬",
//     gradient: "linear-gradient(135deg,#0ea5e9,#6366f1)",
//     color: "#0ea5e9",
//     colorLight: "#f0f9ff",
//     colorDark: "rgba(14,165,233,0.15)",
//     glow: "rgba(14,165,233,0.4)",
//     features: {
//       trainer: [
//         {
//           key: "get_trainer_students",
//           label: "View students to message",
//           endpoint: "GET /chat/trainer/students?batchId=",
//         },
//         {
//           key: "send_message_trainer",
//           label: "Send message",
//           endpoint: "POST /chat/send",
//         },
//         {
//           key: "get_conversation_trainer",
//           label: "View conversation",
//           endpoint: "GET /chat/conversation",
//         },
//         {
//           key: "get_trainer_feedback",
//           label: "View my feedback",
//           endpoint: "GET /feedback/trainer/my",
//         },
//         {
//           key: "get_trainer_feedback_by_batch",
//           label: "View feedback by batch",
//           endpoint: "GET /feedback/trainer/my/batch/:batchId",
//         },
//         {
//           key: "get_trainer_feedback_summary",
//           label: "View feedback summary",
//           endpoint: "GET /feedback/trainer/my/batch/:batchId/summary",
//         },
//       ],
//       student: [
//         {
//           key: "get_student_trainer",
//           label: "View assigned trainer",
//           endpoint: "GET /chat/student/trainer?batchId=",
//         },
//         {
//           key: "get_student_context",
//           label: "View chat context",
//           endpoint: "GET /chat/student/context",
//         },
//         {
//           key: "send_message_student",
//           label: "Send message",
//           endpoint: "POST /chat/send",
//         },
//         {
//           key: "get_conversation_student",
//           label: "View conversation",
//           endpoint: "GET /chat/conversation",
//         },
//         {
//           key: "submit_feedback",
//           label: "Submit feedback",
//           endpoint: "POST /feedback/submit",
//         },
//         {
//           key: "check_feedback_status",
//           label: "Check feedback status",
//           endpoint: "GET /feedback/check/:batchId",
//         },
//         {
//           key: "get_my_feedback",
//           label: "View my feedback",
//           endpoint: "GET /feedback/student/my",
//         },
//         {
//           key: "get_my_feedback_by_batch",
//           label: "View feedback by batch",
//           endpoint: "GET /feedback/student/my/batch/:batchId",
//         },
//         {
//           key: "get_my_notebooks",
//           label: "View my notebooks",
//           endpoint: "GET /notebooks/my",
//         },
//         {
//           key: "get_notebook",
//           label: "View notebook",
//           endpoint: "GET /notebooks/:id",
//         },
//         {
//           key: "create_notebook",
//           label: "Create notebook",
//           endpoint: "POST /notebooks",
//         },
//         {
//           key: "update_notebook",
//           label: "Update notebook",
//           endpoint: "PUT /notebooks/:id",
//         },
//         {
//           key: "delete_notebook",
//           label: "Delete notebook",
//           endpoint: "DELETE /notebooks/:id",
//         },
//         {
//           key: "add_section",
//           label: "Add notebook section",
//           endpoint: "POST /notebooks/sections",
//         },
//         {
//           key: "update_section",
//           label: "Update notebook section",
//           endpoint: "PUT /notebooks/sections/:id",
//         },
//         {
//           key: "delete_section",
//           label: "Delete notebook section",
//           endpoint: "DELETE /notebooks/sections/:id",
//         },
//         {
//           key: "add_page",
//           label: "Add notebook page",
//           endpoint: "POST /notebooks/pages",
//         },
//         {
//           key: "save_page",
//           label: "Save notebook page",
//           endpoint: "PUT /notebooks/pages/:id",
//         },
//         {
//           key: "delete_page",
//           label: "Delete notebook page",
//           endpoint: "DELETE /notebooks/pages/:id",
//         },
//         {
//           key: "add_url_source",
//           label: "Add URL source",
//           endpoint: "POST /notebooks/:notebookId/sources/url",
//         },
//         {
//           key: "add_file_source",
//           label: "Add file source",
//           endpoint: "POST /notebooks/:notebookId/sources/file",
//         },
//         {
//           key: "delete_source",
//           label: "Delete source",
//           endpoint: "DELETE /notebooks/sources/:sourceId",
//         },
//         {
//           key: "notebook_ai_chat",
//           label: "Notebook AI chat",
//           endpoint: "POST /notebooks/:notebookId/chat",
//         },
//       ],
//       admin: [],
//     },
//   },
//   {
//     key: "course",
//     label: "Courses",
//     icon: "📚",
//     gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)",
//     color: "#6366f1",
//     colorLight: "#eef2ff",
//     colorDark: "rgba(99,102,241,0.15)",
//     glow: "rgba(99,102,241,0.4)",
//     features: {
//       trainer: [
//         {
//           key: "get_my_courses",
//           label: "View my courses",
//           endpoint: "GET /courses/my",
//         },
//         {
//           key: "create_course",
//           label: "Create course",
//           endpoint: "POST /courses",
//         },
//         {
//           key: "update_course",
//           label: "Edit course",
//           endpoint: "PUT /courses/:id",
//         },
//         {
//           key: "delete_course",
//           label: "Delete course",
//           endpoint: "DELETE /courses/:id",
//         },
//       ],
//       student: [
//         {
//           key: "get_student_courses",
//           label: "View enrolled courses",
//           endpoint: "GET /courses/student",
//         },
//         {
//           key: "get_student_study_plans",
//           label: "View study plans",
//           endpoint: "GET /v1/study-plans/student",
//         },
//         {
//           key: "mark_study_plan_progress",
//           label: "Mark study plan item done",
//           endpoint: "POST /v1/study-plans/progress/mark",
//         },
//       ],
//       admin: [],
//     },
//   },
//   {
//     key: "file",
//     label: "Files",
//     icon: "📁",
//     gradient: "linear-gradient(135deg,#3b82f6,#0ea5e9)",
//     color: "#3b82f6",
//     colorLight: "#eff6ff",
//     colorDark: "rgba(59,130,246,0.15)",
//     glow: "rgba(59,130,246,0.4)",
//     features: {
//       trainer: [
//         {
//           key: "upload_file",
//           label: "Upload file",
//           endpoint: "POST /file/upload",
//         },
//         {
//           key: "edit_file",
//           label: "Edit file details",
//           endpoint: "PUT /file/:id/edit",
//         },
//         {
//           key: "publish_file",
//           label: "Publish file",
//           endpoint: "PATCH /file/:id/publish",
//         },
//         {
//           key: "assign_file_batch",
//           label: "Assign file to batch",
//           endpoint: "PATCH /file/:id/assign-batch",
//         },
//         {
//           key: "delete_file",
//           label: "Delete file",
//           endpoint: "DELETE /file/:id",
//         },
//         {
//           key: "get_trainer_files",
//           label: "View my uploaded files",
//           endpoint: "GET /file/trainer",
//         },
//         {
//           key: "upload_assignment_file",
//           label: "Upload assignment file",
//           endpoint: "POST /assignment-files/:id",
//         },
//         {
//           key: "get_assignment_files",
//           label: "View assignment files",
//           endpoint: "GET /assignment-files/:id",
//         },
//       ],
//       student: [
//         {
//           key: "get_student_files",
//           label: "View batch files",
//           endpoint: "GET /file/student",
//         },
//         {
//           key: "download_file",
//           label: "Download file",
//           endpoint: "GET /file/download/:name",
//         },
//         {
//           key: "view_file",
//           label: "Preview file (PDF/image)",
//           endpoint: "GET /file/view/:id",
//         },
//         {
//           key: "download_assignment_file",
//           label: "Download assignment file",
//           endpoint: "GET /assignment-files/download/:id",
//         },
//       ],
//       admin: [],
//     },
//   },
//   {
//     key: "live_session",
//     label: "Live Sessions",
//     icon: "📡",
//     gradient: "linear-gradient(135deg,#ec4899,#f97316)",
//     color: "#ec4899",
//     colorLight: "#fdf2f8",
//     colorDark: "rgba(236,72,153,0.15)",
//     glow: "rgba(236,72,153,0.4)",
//     features: {
//       trainer: [
//         {
//           key: "create_live_session",
//           label: "Schedule live session",
//           endpoint: "POST /live-sessions",
//         },
//         {
//           key: "start_live_session",
//           label: "Go live (start session)",
//           endpoint: "POST /live-sessions/:id/start-live",
//         },
//         {
//           key: "end_live_session",
//           label: "End live session",
//           endpoint: "POST /live-sessions/:id/end",
//         },
//         {
//           key: "delete_live_session",
//           label: "Delete session",
//           endpoint: "DELETE /live-sessions/:id",
//         },
//         {
//           key: "get_session_history",
//           label: "View session history",
//           endpoint: "GET /live-sessions/history",
//         },
//         {
//           key: "upload_recording",
//           label: "Upload recording",
//           endpoint: "POST /live-sessions/recording/upload",
//         },
//         {
//           key: "get_my_recordings",
//           label: "View my recordings",
//           endpoint: "GET /live-sessions/recording/trainer/my",
//         },
//         {
//           key: "manage_whiteboard",
//           label: "Use whiteboard",
//           endpoint: "POST /v1/live-sessions/:id/whiteboard/save",
//         },
//         {
//           key: "ai_companion",
//           label: "AI companion chat",
//           endpoint: "POST /v1/ai-companion/chat",
//         },
//         {
//           key: "booking_availability",
//           label: "Set booking availability",
//           endpoint: "POST /live-sessions/v1/booking/availability",
//         },
//         {
//           key: "create_event_type",
//           label: "Create booking event type",
//           endpoint: "POST /live-sessions/v1/booking/event-types",
//         },
//       ],
//       student: [
//         {
//           key: "join_live_session",
//           label: "Join live session",
//           endpoint: "GET /live-sessions/:id/join",
//         },
//         {
//           key: "get_batch_sessions",
//           label: "View upcoming sessions",
//           endpoint: "GET /live-sessions/batch/:batchId",
//         },
//         {
//           key: "get_batch_recordings",
//           label: "Watch recordings",
//           endpoint: "GET /live-sessions/recording/batch/:batchId",
//         },
//         {
//           key: "get_whiteboard_state",
//           label: "View whiteboard",
//           endpoint: "GET /v1/live-sessions/:id/whiteboard/state",
//         },
//       ],
//       admin: [],
//     },
//   },
//   {
//     key: "notification",
//     label: "Notifications",
//     icon: "🔔",
//     gradient: "linear-gradient(135deg,#a855f7,#ec4899)",
//     color: "#a855f7",
//     colorLight: "#faf5ff",
//     colorDark: "rgba(168,85,247,0.15)",
//     glow: "rgba(168,85,247,0.4)",
//     features: {
//       trainer: [
//         {
//           key: "receive_notifications",
//           label: "Receive in-app notifications",
//           endpoint: "GET /notification/my",
//         },
//         {
//           key: "mark_read",
//           label: "Mark notifications read",
//           endpoint: "PUT /notification/:id/read",
//         },
//         {
//           key: "register_device_token",
//           label: "Register push token (FCM)",
//           endpoint: "POST /notification/register-token",
//         },
//       ],
//       student: [
//         {
//           key: "receive_notifications",
//           label: "Receive notifications",
//           endpoint: "GET /notification/my",
//         },
//         {
//           key: "get_unread_count",
//           label: "View unread count",
//           endpoint: "GET /notification/unread-count",
//         },
//         {
//           key: "mark_all_read",
//           label: "Mark all as read",
//           endpoint: "PUT /notification/read-all",
//         },
//         {
//           key: "clear_all",
//           label: "Clear all notifications",
//           endpoint: "DELETE /notification/clear-all",
//         },
//       ],
//       admin: [],
//     },
//   },
//   {
//     key: "progress",
//     label: "Progress & Skills",
//     icon: "📊",
//     gradient: "linear-gradient(135deg,#f97316,#eab308)",
//     color: "#f97316",
//     colorLight: "#fff7ed",
//     colorDark: "rgba(249,115,22,0.15)",
//     glow: "rgba(249,115,22,0.4)",
//     features: {
//       trainer: [
//         {
//           key: "get_batch_progress_report",
//           label: "View batch progress report",
//           endpoint: "GET /progress/reports/batch/:batchId",
//         },
//         {
//           key: "get_student_progress",
//           label: "View per-student progress",
//           endpoint: "GET /progress/reports/batch/:batchId/student/:email",
//         },
//         {
//           key: "get_batch_skill_analytics",
//           label: "View batch skill analytics",
//           endpoint: "GET /skill-map/trainer/batch?batchId=",
//         },
//         {
//           key: "view_skill_map",
//           label: "View all batches skill data",
//           endpoint: "GET /skill-map/trainer?trainerEmail=",
//         },
//       ],
//       student: [
//         {
//           key: "mark_content_complete",
//           label: "Mark course content done",
//           endpoint: "POST /progress/mark-complete",
//         },
//         {
//           key: "get_video_progress",
//           label: "View video watch progress",
//           endpoint: "GET /video-progress/user",
//         },
//         {
//           key: "mark_video_watched",
//           label: "Mark video as watched",
//           endpoint: "POST /video-progress/mark-watched",
//         },
//         {
//           key: "get_file_progress",
//           label: "View document progress",
//           endpoint: "GET /file-progress/user",
//         },
//         {
//           key: "get_quiz_progress",
//           label: "View quiz progress",
//           endpoint: "GET /quiz-progress/user",
//         },
//         {
//           key: "get_assignment_progress",
//           label: "View assignment progress",
//           endpoint: "GET /assignment-progress/user",
//         },
//         {
//           key: "view_student_skill_map",
//           label: "View my skill map",
//           endpoint: "GET /skill-map/student?email=&batchId=",
//         },
//       ],
//       admin: [],
//     },
//   },
//   {
//     key: "video",
//     label: "Videos",
//     icon: "🎬",
//     gradient: "linear-gradient(135deg,#10b981,#14b8a6)",
//     color: "#10b981",
//     colorLight: "#ecfdf5",
//     colorDark: "rgba(16,185,129,0.15)",
//     glow: "rgba(16,185,129,0.4)",
//     features: {
//       trainer: [
//         {
//           key: "upload_video",
//           label: "Upload video file",
//           endpoint: "POST /video/upload",
//         },
//         {
//           key: "upload_video_url",
//           label: "Add video by URL",
//           endpoint: "POST /video/upload-url",
//         },
//         {
//           key: "edit_video",
//           label: "Edit video (file)",
//           endpoint: "PUT /video/:id/edit",
//         },
//         {
//           key: "edit_video_url",
//           label: "Edit video (URL)",
//           endpoint: "PUT /video/:id/edit-url",
//         },
//         {
//           key: "publish_video",
//           label: "Publish video",
//           endpoint: "PATCH /video/:id/publish",
//         },
//         {
//           key: "assign_batch_video",
//           label: "Assign video to batch",
//           endpoint: "PATCH /video/:id/assign-batch",
//         },
//         {
//           key: "delete_video",
//           label: "Delete video",
//           endpoint: "DELETE /video/:id",
//         },
//         {
//           key: "get_trainer_videos",
//           label: "View my videos",
//           endpoint: "GET /video/trainer",
//         },
//       ],
//       student: [
//         {
//           key: "get_student_videos",
//           label: "Watch batch videos",
//           endpoint: "GET /video/student",
//         },
//         {
//           key: "play_video",
//           label: "Stream video",
//           endpoint: "GET /video/play/:filename",
//         },
//       ],
//       admin: [],
//     },
//   },
// ];

// // Only role tabs that admins are allowed to manage from this page.
// // (Org admin permissions themselves are managed by SuperAdmin, not here.)
// const MANAGED_ROLES = ["trainer", "student"];

// function getAllFeatureKeysForRole(svc, roleKey) {
//   return (svc.features[roleKey] || []).map((f) => f.key);
// }
// function buildDefaultDTOForRole(svc, roleKey, enabled = true) {
//   const features = {};
//   getAllFeatureKeysForRole(svc, roleKey).forEach(
//     (k) => (features[k] = enabled),
//   );
//   return { enabled, features };
// }

// // ═════════════════════════════════════════════════════════════════════════
// // SHARED UI ATOMS
// // ═════════════════════════════════════════════════════════════════════════
// function initials(name = "") {
//   return (
//     name
//       .split(" ")
//       .map((w) => w[0] || "")
//       .join("")
//       .slice(0, 2)
//       .toUpperCase() || "??"
//   );
// }
// function formatDate(dateStr) {
//   if (!dateStr) return "—";
//   try {
//     return new Date(dateStr).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   } catch {
//     return dateStr;
//   }
// }
// const AVATAR_COLORS = [
//   ["#6366f1", "#818cf8"],
//   ["#8b5cf6", "#a78bfa"],
//   ["#ec4899", "#f472b6"],
//   ["#14b8a6", "#2dd4bf"],
//   ["#f59e0b", "#fbbf24"],
//   ["#10b981", "#34d399"],
//   ["#3b82f6", "#60a5fa"],
//   ["#ef4444", "#f87171"],
// ];
// const avatarColor = (name = "") =>
//   AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];

// const MiniToggle = ({ checked, onChange, color = "#6366f1", size = "md" }) => {
//   const w = size === "sm" ? 28 : 36;
//   const h = size === "sm" ? 16 : 20;
//   const d = size === "sm" ? 10 : 14;
//   const off = 2,
//     on = w - d - (size === "sm" ? 2 : 3);
//   return (
//     <label
//       style={{
//         position: "relative",
//         display: "inline-block",
//         width: w,
//         height: h,
//         flexShrink: 0,
//         cursor: "pointer",
//       }}
//     >
//       <input
//         type="checkbox"
//         checked={checked}
//         onChange={onChange}
//         style={{ opacity: 0, width: 0, height: 0 }}
//       />
//       <span
//         style={{
//           position: "absolute",
//           inset: 0,
//           background: checked ? color : "#cbd5e1",
//           borderRadius: h,
//           transition: ".2s",
//           boxShadow: checked ? `0 0 8px ${color}66` : "none",
//         }}
//       >
//         <span
//           style={{
//             position: "absolute",
//             height: d,
//             width: d,
//             left: checked ? on : off,
//             top: (h - d) / 2,
//             background: "white",
//             borderRadius: "50%",
//             transition: ".2s",
//             boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
//           }}
//         />
//       </span>
//     </label>
//   );
// };

// const Spinner = ({ label = "Loading…" }) => (
//   <div
//     style={{
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "48px 0",
//       gap: 12,
//     }}
//   >
//     <div
//       style={{
//         width: 26,
//         height: 26,
//         border: "3px solid #e2e8f0",
//         borderTop: "3px solid #6366f1",
//         borderRadius: "50%",
//         animation: "spin 0.7s linear infinite",
//       }}
//     />
//     <span style={{ fontSize: 12, color: "#94a3b8" }}>{label}</span>
//   </div>
// );

// const ErrorState = ({ message, onRetry }) => (
//   <div style={{ padding: "40px 20px", textAlign: "center" }}>
//     <div style={{ fontSize: 30, marginBottom: 8 }}>⚠️</div>
//     <div style={{ fontSize: 13, fontWeight: 700, color: "#dc2626" }}>
//       {message}
//     </div>
//     {onRetry && (
//       <button
//         onClick={onRetry}
//         style={{
//           marginTop: 14,
//           padding: "7px 16px",
//           borderRadius: 8,
//           border: "none",
//           background: "#6366f1",
//           color: "#fff",
//           fontSize: 12,
//           fontWeight: 700,
//           cursor: "pointer",
//         }}
//       >
//         Retry
//       </button>
//     )}
//   </div>
// );

// const ToastStack = ({ toasts }) => (
//   <div
//     style={{
//       position: "fixed",
//       bottom: 24,
//       right: 24,
//       zIndex: 99999,
//       display: "flex",
//       flexDirection: "column",
//       gap: 8,
//       pointerEvents: "none",
//     }}
//   >
//     {toasts.map((t) => (
//       <div
//         key={t.id}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 10,
//           padding: "10px 14px",
//           borderRadius: 12,
//           minWidth: 240,
//           maxWidth: 320,
//           background: t.enabled
//             ? `linear-gradient(135deg,${t.color}ee,${t.color}bb)`
//             : "linear-gradient(135deg,#374151ee,#1f2937ee)",
//           boxShadow: `0 8px 24px ${t.enabled ? t.color + "55" : "rgba(0,0,0,0.35)"}`,
//           border: `1px solid ${t.enabled ? t.color + "70" : "rgba(255,255,255,0.1)"}`,
//           backdropFilter: "blur(12px)",
//           color: "#fff",
//           fontSize: 12,
//           fontWeight: 600,
//           animation: "toastIn .3s cubic-bezier(.34,1.56,.64,1)",
//           pointerEvents: "all",
//         }}
//       >
//         <span style={{ fontSize: 16 }}>{t.enabled ? "✅" : "🚫"}</span>
//         <div style={{ flex: 1 }}>
//           <div style={{ fontSize: 10, opacity: 0.75, marginBottom: 1 }}>
//             {t.serviceName}
//           </div>
//           <div>
//             <span style={{ opacity: 0.85 }}>{t.featureName} </span>
//             <span
//               style={{
//                 fontWeight: 800,
//                 color: t.enabled ? "#bbf7d0" : "#fca5a5",
//               }}
//             >
//               {t.enabled ? "ON" : "OFF"}
//             </span>
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// );

// // ═════════════════════════════════════════════════════════════════════════
// // GENERIC PER-SERVICE FEATURE DRAWER
// // Works for any svc from SERVICES_CONFIG, scoped to ONE role tab
// // (the target user's own role — a trainer never sees student toggles here).
// // ═════════════════════════════════════════════════════════════════════════
// const ServiceFeatureDrawer = ({
//   svc,
//   roleKey, // "trainer" | "student" — the ONE role this user has
//   dto, // { enabled, features }
//   onToggleFeature, // (featKey, val) => void
//   onToggleService, // (val) => void
//   onSave,
//   saving,
//   savedMsg,
//   onClose,
//   onToast,
// }) => {
//   const svcEnabled = dto.enabled ?? true;
//   const feats = svc.features[roleKey] || [];
//   const onCount = feats.filter((f) => dto.features[f.key] !== false).length;

//   const setAll = (val) => {
//     feats.forEach((f) => {
//       const cur = dto.features[f.key] ?? true;
//       if (cur !== val) {
//         onToggleFeature(f.key, val);
//         onToast({
//           serviceName: svc.label,
//           featureName: f.label,
//           enabled: val,
//           color: svc.color,
//         });
//       }
//     });
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 9500,
//         display: "flex",
//         justifyContent: "flex-end",
//       }}
//     >
//       <div
//         onClick={onClose}
//         style={{
//           position: "absolute",
//           inset: 0,
//           background: "rgba(0,0,0,0.55)",
//           backdropFilter: "blur(6px)",
//         }}
//       />
//       <div
//         style={{
//           position: "relative",
//           width: 460,
//           maxWidth: "92vw",
//           height: "100%",
//           background: "#fff",
//           display: "flex",
//           flexDirection: "column",
//           boxShadow: `-20px 0 60px rgba(0,0,0,0.3), -4px 0 20px ${svc.color}30`,
//           animation: "drawerSlide .3s cubic-bezier(.22,1,.36,1)",
//           overflowY: "auto",
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             background: svc.gradient,
//             padding: "24px 22px 20px",
//             flexShrink: 0,
//             position: "relative",
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               position: "absolute",
//               top: -30,
//               right: -30,
//               width: 120,
//               height: 120,
//               borderRadius: "50%",
//               background: "rgba(255,255,255,0.08)",
//             }}
//           />
//           <div
//             style={{
//               display: "flex",
//               alignItems: "flex-start",
//               justifyContent: "space-between",
//               position: "relative",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//               <div
//                 style={{
//                   width: 48,
//                   height: 48,
//                   borderRadius: 14,
//                   background: "rgba(255,255,255,0.2)",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: 22,
//                 }}
//               >
//                 {svc.icon}
//               </div>
//               <div>
//                 <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>
//                   {svc.label}
//                 </div>
//                 <div
//                   style={{
//                     fontSize: 11,
//                     color: "rgba(255,255,255,0.7)",
//                     marginTop: 2,
//                   }}
//                 >
//                   {onCount}/{feats.length} features active ·{" "}
//                   {roleKey === "trainer" ? "Trainer" : "Student"} view
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               style={{
//                 width: 30,
//                 height: 30,
//                 borderRadius: 9,
//                 background: "rgba(255,255,255,0.2)",
//                 border: "none",
//                 cursor: "pointer",
//                 color: "#fff",
//                 fontSize: 15,
//                 fontWeight: 700,
//               }}
//             >
//               ✕
//             </button>
//           </div>

//           {/* Master switch */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               marginTop: 16,
//               background: "rgba(255,255,255,0.12)",
//               borderRadius: 11,
//               padding: "9px 13px",
//               border: "1px solid rgba(255,255,255,0.15)",
//             }}
//           >
//             <div>
//               <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
//                 Service master switch
//               </div>
//               <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>
//                 Disabling blocks every {svc.label.toLowerCase()} feature for
//                 this user
//               </div>
//             </div>
//             <MiniToggle
//               checked={svcEnabled}
//               onChange={(e) => {
//                 onToggleService(e.target.checked);
//                 onToast({
//                   serviceName: svc.label,
//                   featureName: "All features",
//                   enabled: e.target.checked,
//                   color: svc.color,
//                 });
//               }}
//               color="#fff"
//               size="md"
//             />
//           </div>

//           {/* Save */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "flex-end",
//               gap: 8,
//               marginTop: 12,
//             }}
//           >
//             {savedMsg && (
//               <span
//                 style={{
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#bbf7d0",
//                   background: "rgba(255,255,255,0.15)",
//                   padding: "4px 12px",
//                   borderRadius: 99,
//                   border: "1px solid rgba(255,255,255,0.2)",
//                 }}
//               >
//                 ✓ {savedMsg}
//               </span>
//             )}
//             <button
//               onClick={onSave}
//               disabled={saving}
//               style={{
//                 fontSize: 12,
//                 padding: "8px 20px",
//                 border: "none",
//                 borderRadius: 10,
//                 background: saving
//                   ? "rgba(255,255,255,0.2)"
//                   : "rgba(255,255,255,0.92)",
//                 cursor: saving ? "not-allowed" : "pointer",
//                 color: saving ? "rgba(255,255,255,0.5)" : svc.color,
//                 fontWeight: 700,
//                 boxShadow: saving ? "none" : "0 2px 8px rgba(0,0,0,0.2)",
//               }}
//             >
//               {saving ? "Saving…" : "💾 Save changes"}
//             </button>
//           </div>
//         </div>

//         {/* Feature list */}
//         <div style={{ flex: 1, padding: "14px 18px", overflowY: "auto" }}>
//           {feats.length === 0 ? (
//             <div
//               style={{
//                 padding: "28px 0",
//                 textAlign: "center",
//                 color: "#94a3b8",
//                 fontSize: 12,
//               }}
//             >
//               No features defined for this role in this service.
//             </div>
//           ) : (
//             <>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   marginBottom: 10,
//                 }}
//               >
//                 <span
//                   style={{
//                     fontSize: 10,
//                     fontWeight: 700,
//                     letterSpacing: "0.1em",
//                     textTransform: "uppercase",
//                     color: "#94a3b8",
//                   }}
//                 >
//                   {onCount}/{feats.length} enabled
//                 </span>
//                 <div style={{ display: "flex", gap: 5 }}>
//                   <button
//                     onClick={() => setAll(false)}
//                     style={{
//                       fontSize: 9.5,
//                       padding: "3px 9px",
//                       border: "1px solid #e2e8f0",
//                       borderRadius: 6,
//                       background: "transparent",
//                       cursor: "pointer",
//                       color: "#94a3b8",
//                       fontWeight: 600,
//                     }}
//                   >
//                     All off
//                   </button>
//                   <button
//                     onClick={() => setAll(true)}
//                     style={{
//                       fontSize: 9.5,
//                       padding: "3px 9px",
//                       border: `1px solid ${svc.color}`,
//                       borderRadius: 6,
//                       background: svc.colorLight,
//                       cursor: "pointer",
//                       color: svc.color,
//                       fontWeight: 600,
//                     }}
//                   >
//                     All on
//                   </button>
//                 </div>
//               </div>

//               <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
//                 {feats.map((feat, idx) => {
//                   const isOn = dto.features[feat.key] ?? true;
//                   return (
//                     <div
//                       key={feat.key}
//                       onClick={() => {
//                         onToggleFeature(feat.key, !isOn);
//                         onToast({
//                           serviceName: svc.label,
//                           featureName: feat.label,
//                           enabled: !isOn,
//                           color: svc.color,
//                         });
//                       }}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 10,
//                         padding: "10px 12px",
//                         borderRadius: 10,
//                         background: isOn ? svc.colorLight + "80" : "#f8fafc",
//                         border: `1px solid ${isOn ? svc.color + "30" : "#f1f5f9"}`,
//                         cursor: "pointer",
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: 22,
//                           height: 22,
//                           borderRadius: 6,
//                           background: isOn ? svc.color : "#e5e7eb",
//                           color: isOn ? "#fff" : "#94a3b8",
//                           fontSize: 10,
//                           fontWeight: 800,
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           flexShrink: 0,
//                         }}
//                       >
//                         {idx + 1}
//                       </div>
//                       <div style={{ flex: 1, minWidth: 0 }}>
//                         <div
//                           style={{
//                             fontSize: 12,
//                             fontWeight: 600,
//                             color: isOn ? "#0f172a" : "#94a3b8",
//                           }}
//                         >
//                           {feat.label}
//                         </div>
//                         <div
//                           style={{
//                             fontSize: 9.5,
//                             color: "#94a3b8",
//                             fontFamily: "monospace",
//                             marginTop: 1,
//                             opacity: 0.7,
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {feat.endpoint}
//                         </div>
//                       </div>
//                       <div onClick={(e) => e.stopPropagation()}>
//                         <MiniToggle
//                           checked={isOn}
//                           onChange={(e) => {
//                             onToggleFeature(feat.key, e.target.checked);
//                             onToast({
//                               serviceName: svc.label,
//                               featureName: feat.label,
//                               enabled: e.target.checked,
//                               color: svc.color,
//                             });
//                           }}
//                           color={svc.color}
//                         />
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ═════════════════════════════════════════════════════════════════════════
// // SERVICE CARD GRID — one card per service, for the user currently open
// // in the drawer. Loads/saves flags for EACH service independently
// // (matches your microservice boundary — each service owns its own flags).
// // ═════════════════════════════════════════════════════════════════════════
// const ServiceCard = ({
//   svc,
//   dto,
//   onKeys,
//   totalKeys,
//   pct,
//   svcEnabled,
//   onToggleService,
//   onOpen,
//   loading,
// }) => (
//   <div
//     onClick={onOpen}
//     style={{
//       background: svcEnabled ? svc.colorLight : "#fff",
//       border: `1.5px solid ${svcEnabled ? svc.color + "40" : "#e2e8f0"}`,
//       borderRadius: 12,
//       padding: "12px 13px",
//       cursor: "pointer",
//       boxShadow: svcEnabled ? `0 3px 14px ${svc.glow}30` : "none",
//       opacity: loading ? 0.6 : 1,
//       minWidth: 0,
//     }}
//   >
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         marginBottom: 9,
//       }}
//     >
//       <div
//         style={{
//           width: 32,
//           height: 32,
//           borderRadius: 9,
//           background: svcEnabled ? svc.gradient : "#f1f5f9",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontSize: 16,
//         }}
//       >
//         {svc.icon}
//       </div>
//       <div onClick={(e) => e.stopPropagation()}>
//         <MiniToggle
//           checked={svcEnabled}
//           onChange={(e) => onToggleService(e.target.checked)}
//           color={svc.color}
//         />
//       </div>
//     </div>
//     <div
//       style={{
//         fontSize: 12,
//         fontWeight: 700,
//         color: svcEnabled ? "#0f172a" : "#94a3b8",
//         marginBottom: 3,
//       }}
//     >
//       {svc.label}
//     </div>
//     <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 7 }}>
//       {onKeys}/{totalKeys} on
//     </div>
//     <div
//       style={{
//         height: 3,
//         borderRadius: 2,
//         background: "#e2e8f0",
//         overflow: "hidden",
//       }}
//     >
//       <div
//         style={{
//           height: "100%",
//           width: `${pct}%`,
//           background: svcEnabled ? svc.gradient : "#94a3b8",
//           borderRadius: 2,
//           transition: "width .3s",
//         }}
//       />
//     </div>
//     <div
//       style={{
//         marginTop: 6,
//         fontSize: 9.5,
//         color: svc.color,
//         fontWeight: 600,
//         opacity: 0.8,
//       }}
//     >
//       Click to manage →
//     </div>
//   </div>
// );

// // ═════════════════════════════════════════════════════════════════════════
// // USER FEATURE PANEL — loads ALL services' flags for one user (parallel),
// // renders the card grid, opens the ServiceFeatureDrawer on click.
// // ═════════════════════════════════════════════════════════════════════════
// const UserFeaturePanel = ({ user, roleKey }) => {
//   // dtos: { [serviceKey]: { enabled, features } }
//   const [dtos, setDtos] = useState({});
//   const [loadingMap, setLoadingMap] = useState({});
//   const [savingMap, setSavingMap] = useState({});
//   const [savedMsgMap, setSavedMsgMap] = useState({});
//   const [openSvcKey, setOpenSvcKey] = useState(null);
//   const [loadError, setLoadError] = useState(null);
//   const [toasts, setToasts] = useState([]);
//   const toastRef = useRef(0);

//   const pushToast = useCallback(
//     ({ serviceName, featureName, enabled, color }) => {
//       const id = ++toastRef.current;
//       setToasts((p) => [
//         ...p.slice(-3),
//         { id, serviceName, featureName, enabled, color },
//       ]);
//       setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 2800);
//     },
//     [],
//   );

//   const loadAll = useCallback(() => {
//     if (!user?.email) return;
//     setLoadError(null);
//     const nextLoading = {};
//     SERVICES_CONFIG.forEach((s) => (nextLoading[s.key] = true));
//     setLoadingMap(nextLoading);

//     Promise.all(
//       SERVICES_CONFIG.map((svc) =>
//         accessControlService
//           .getUserServiceFlags(svc.key, user.email)
//           .then((data) => {
//             const defaults = buildDefaultDTOForRole(svc, roleKey, true);
//             const merged =
//               data && typeof data === "object" && data.features
//                 ? {
//                     enabled: data.enabled ?? true,
//                     features: { ...defaults.features, ...data.features },
//                   }
//                 : defaults;
//             return [svc.key, merged];
//           })
//           .catch(() => [svc.key, buildDefaultDTOForRole(svc, roleKey, true)]),
//       ),
//     )
//       .then((entries) => {
//         setDtos(Object.fromEntries(entries));
//       })
//       .catch(() => setLoadError("Failed to load some feature flags."))
//       .finally(() => {
//         const done = {};
//         SERVICES_CONFIG.forEach((s) => (done[s.key] = false));
//         setLoadingMap(done);
//       });
//   }, [user?.email, roleKey]);

//   useEffect(() => {
//     loadAll();
//   }, [loadAll]);

//   const toggleFeature = (svcKey, featKey, val) => {
//     setDtos((prev) => {
//       const cur = prev[svcKey] || { enabled: true, features: {} };
//       const nextFeatures = { ...cur.features, [featKey]: val };
//       const anyOn = Object.values(nextFeatures).some(Boolean);
//       return { ...prev, [svcKey]: { enabled: anyOn, features: nextFeatures } };
//     });
//   };

//   const toggleService = (svcKey, val) => {
//     const svc = SERVICES_CONFIG.find((s) => s.key === svcKey);
//     setDtos((prev) => ({
//       ...prev,
//       [svcKey]: buildDefaultDTOForRole(svc, roleKey, val),
//     }));
//   };

//   const saveService = async (svcKey) => {
//     setSavingMap((p) => ({ ...p, [svcKey]: true }));
//     try {
//       await accessControlService.updateUserServiceFlags(
//         svcKey,
//         user.email,
//         dtos[svcKey],
//       );
//       setSavedMsgMap((p) => ({ ...p, [svcKey]: "Saved!" }));
//       setTimeout(() => setSavedMsgMap((p) => ({ ...p, [svcKey]: "" })), 2600);
//     } catch (err) {
//       console.error(`Failed to save ${svcKey} flags`, err);
//     } finally {
//       setSavingMap((p) => ({ ...p, [svcKey]: false }));
//     }
//   };

//   const anyLoading = Object.values(loadingMap).some(Boolean);
//   const openSvc = openSvcKey
//     ? SERVICES_CONFIG.find((s) => s.key === openSvcKey)
//     : null;

//   return (
//     <div>
//       <ToastStack toasts={toasts} />

//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           marginBottom: 10,
//         }}
//       >
//         <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>
//           Feature access — {roleKey === "trainer" ? "Trainer" : "Student"} view
//         </div>
//         <div style={{ fontSize: 10.5, color: "#94a3b8" }}>
//           Each service saves independently
//         </div>
//       </div>

//       {anyLoading && Object.keys(dtos).length === 0 ? (
//         <Spinner label="Loading feature access…" />
//       ) : loadError ? (
//         <ErrorState message={loadError} onRetry={loadAll} />
//       ) : (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
//             gap: 8,
//           }}
//         >
//           {SERVICES_CONFIG.map((svc) => {
//             const roleFeats = svc.features[roleKey] || [];
//             if (roleFeats.length === 0) return null; // hide services with nothing for this role
//             const dto =
//               dtos[svc.key] || buildDefaultDTOForRole(svc, roleKey, true);
//             const totalKeys = roleFeats.length;
//             const onKeys = roleFeats.filter(
//               (f) => dto.features[f.key] !== false,
//             ).length;
//             const pct =
//               totalKeys > 0 ? Math.round((onKeys / totalKeys) * 100) : 0;
//             return (
//               <ServiceCard
//                 key={svc.key}
//                 svc={svc}
//                 dto={dto}
//                 onKeys={onKeys}
//                 totalKeys={totalKeys}
//                 pct={pct}
//                 svcEnabled={dto.enabled ?? true}
//                 loading={loadingMap[svc.key]}
//                 onToggleService={(val) => {
//                   toggleService(svc.key, val);
//                   pushToast({
//                     serviceName: svc.label,
//                     featureName: "All features",
//                     enabled: val,
//                     color: svc.color,
//                   });
//                 }}
//                 onOpen={() => setOpenSvcKey(svc.key)}
//               />
//             );
//           })}
//         </div>
//       )}

//       {openSvc && (
//         <ServiceFeatureDrawer
//           svc={openSvc}
//           roleKey={roleKey}
//           dto={
//             dtos[openSvc.key] || buildDefaultDTOForRole(openSvc, roleKey, true)
//           }
//           onToggleFeature={(featKey, val) =>
//             toggleFeature(openSvc.key, featKey, val)
//           }
//           onToggleService={(val) => toggleService(openSvc.key, val)}
//           onSave={() => saveService(openSvc.key)}
//           saving={!!savingMap[openSvc.key]}
//           savedMsg={savedMsgMap[openSvc.key]}
//           onClose={() => setOpenSvcKey(null)}
//           onToast={pushToast}
//         />
//       )}
//     </div>
//   );
// };

// // ═════════════════════════════════════════════════════════════════════════
// // USER DETAIL DRAWER — Profile tab + Permissions tab (UserFeaturePanel)
// // ═════════════════════════════════════════════════════════════════════════
// const UserDetailDrawer = ({ user, roleKey, onClose }) => {
//   const [tab, setTab] = useState("permissions");
//   const [profile, setProfile] = useState(null);
//   const [profileLoading, setProfileLoading] = useState(true);
//   const [profileError, setProfileError] = useState(null);

//   useEffect(() => {
//     if (!user?.email) return;
//     setProfileLoading(true);
//     setProfileError(null);
//     accessControlService
//       .getUserProfile(roleKey, user.email)
//       .then((res) => setProfile(res?.data || res || {}))
//       .catch(() => setProfileError("Could not load profile details."))
//       .finally(() => setProfileLoading(false));
//   }, [user?.email, roleKey]);

//   const [a, b] = avatarColor(user?.displayName || user?.email || "");
//   const accentGrad =
//     roleKey === "trainer"
//       ? "linear-gradient(135deg,#7c3aed,#6366f1)"
//       : "linear-gradient(135deg,#0d9488,#14b8a6)";
//   const accentColor = roleKey === "trainer" ? "#7c3aed" : "#0d9488";

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 9000,
//         display: "flex",
//         justifyContent: "flex-end",
//       }}
//     >
//       <div
//         onClick={onClose}
//         style={{
//           position: "absolute",
//           inset: 0,
//           background: "rgba(0,0,0,0.5)",
//           backdropFilter: "blur(4px)",
//         }}
//       />
//       <div
//         style={{
//           position: "relative",
//           width: 560,
//           maxWidth: "94vw",
//           height: "100%",
//           background: "#fff",
//           boxShadow: "-12px 0 48px rgba(0,0,0,0.3)",
//           overflowY: "auto",
//           display: "flex",
//           flexDirection: "column",
//           animation: "drawerSlide .28s cubic-bezier(.22,1,.36,1)",
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             background: accentGrad,
//             padding: "22px 22px 18px",
//             flexShrink: 0,
//             position: "relative",
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               position: "absolute",
//               top: -20,
//               right: -20,
//               width: 100,
//               height: 100,
//               borderRadius: "50%",
//               background: "rgba(255,255,255,0.08)",
//             }}
//           />
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//               <div
//                 style={{
//                   width: 46,
//                   height: 46,
//                   borderRadius: 12,
//                   background: `linear-gradient(135deg,${a},${b})`,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   color: "#fff",
//                   fontSize: 16,
//                   fontWeight: 800,
//                   boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//                 }}
//               >
//                 {initials(user?.displayName || user?.email)}
//               </div>
//               <div>
//                 <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
//                   {user?.displayName || user?.email}
//                 </div>
//                 <div
//                   style={{
//                     fontSize: 11,
//                     color: "rgba(255,255,255,0.65)",
//                     marginTop: 2,
//                   }}
//                 >
//                   {roleKey === "trainer" ? "Trainer" : "Student"} ·{" "}
//                   {user?.email}
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               style={{
//                 width: 30,
//                 height: 30,
//                 borderRadius: 8,
//                 background: "rgba(255,255,255,0.18)",
//                 border: "none",
//                 cursor: "pointer",
//                 color: "#fff",
//                 fontSize: 16,
//                 fontWeight: 700,
//               }}
//             >
//               ✕
//             </button>
//           </div>

//           <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
//             {[
//               ["profile", "👤 Profile"],
//               ["permissions", "🔐 Feature access"],
//             ].map(([key, label]) => (
//               <button
//                 key={key}
//                 onClick={() => setTab(key)}
//                 style={{
//                   padding: "6px 14px",
//                   borderRadius: 8,
//                   border: "none",
//                   cursor: "pointer",
//                   fontSize: 11,
//                   fontWeight: 600,
//                   background:
//                     tab === key
//                       ? "rgba(255,255,255,0.92)"
//                       : "rgba(255,255,255,0.18)",
//                   color: tab === key ? accentColor : "#fff",
//                 }}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Body */}
//         <div style={{ padding: 20, flex: 1 }}>
//           {tab === "profile" && (
//             <>
//               <div
//                 style={{
//                   fontSize: 10,
//                   fontWeight: 700,
//                   letterSpacing: "0.1em",
//                   textTransform: "uppercase",
//                   color: "#94a3b8",
//                   marginBottom: 10,
//                 }}
//               >
//                 Basic Info
//               </div>
//               {[
//                 { label: "Email", value: user?.email },
//                 {
//                   label: "Role",
//                   value: roleKey === "trainer" ? "Trainer" : "Student",
//                 },
//                 { label: "User ID", value: user?.id },
//               ].map(({ label, value }) => (
//                 <div
//                   key={label}
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     padding: "8px 0",
//                     borderBottom: "1px solid #f1f5f9",
//                   }}
//                 >
//                   <span style={{ fontSize: 12, color: "#94a3b8" }}>
//                     {label}
//                   </span>
//                   <span
//                     style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}
//                   >
//                     {value || "—"}
//                   </span>
//                 </div>
//               ))}

//               {profileLoading && <Spinner label="Loading profile…" />}
//               {profileError && (
//                 <div
//                   style={{ fontSize: 12, color: "#ef4444", padding: "12px 0" }}
//                 >
//                   {profileError}
//                 </div>
//               )}
//               {!profileLoading && !profileError && profile && (
//                 <div style={{ marginTop: 16 }}>
//                   <div
//                     style={{
//                       fontSize: 10,
//                       fontWeight: 700,
//                       letterSpacing: "0.1em",
//                       textTransform: "uppercase",
//                       color: "#94a3b8",
//                       marginBottom: 10,
//                     }}
//                   >
//                     {roleKey === "trainer" ? "Trainer" : "Student"} profile
//                     fields
//                   </div>
//                   {Object.entries(profile)
//                     .filter(
//                       ([k]) =>
//                         ![
//                           "id",
//                           "userId",
//                           "email",
//                           "createdAt",
//                           "updatedAt",
//                         ].includes(k),
//                     )
//                     .slice(0, 14)
//                     .map(([key, value]) => (
//                       <div
//                         key={key}
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           padding: "7px 0",
//                           borderBottom: "1px solid #f1f5f9",
//                         }}
//                       >
//                         <span
//                           style={{
//                             fontSize: 11,
//                             color: "#94a3b8",
//                             textTransform: "capitalize",
//                           }}
//                         >
//                           {key.replace(/([A-Z])/g, " $1").trim()}
//                         </span>
//                         <span
//                           style={{
//                             fontSize: 11,
//                             fontWeight: 600,
//                             color: "#0f172a",
//                             textAlign: "right",
//                             maxWidth: 220,
//                             wordBreak: "break-word",
//                           }}
//                         >
//                           {Array.isArray(value)
//                             ? value.join(", ")
//                             : value?.toString() || "—"}
//                         </span>
//                       </div>
//                     ))}
//                 </div>
//               )}
//             </>
//           )}

//           {tab === "permissions" && (
//             <UserFeaturePanel user={user} roleKey={roleKey} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ═════════════════════════════════════════════════════════════════════════
// // USERS TABLE (Trainers / Students)
// // ═════════════════════════════════════════════════════════════════════════
// const UsersTable = ({
//   users,
//   roleKey,
//   loading,
//   error,
//   onRetry,
//   onRowClick,
// }) => {
//   const ROLE_BADGE =
//     roleKey === "trainer"
//       ? { bg: "rgba(139,92,246,0.12)", color: "#7c3aed", label: "Trainer" }
//       : { bg: "rgba(20,184,166,0.12)", color: "#0d9488", label: "Student" };

//   if (loading) return <Spinner label={`Loading ${roleKey}s…`} />;
//   if (error) return <ErrorState message={error} onRetry={onRetry} />;

//   return (
//     <div style={{ overflowX: "auto" }}>
//       <table
//         style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}
//       >
//         <thead>
//           <tr style={{ background: "#f8fafc" }}>
//             {["USER", "ROLE", "USER ID", ""].map((h) => (
//               <th
//                 key={h}
//                 style={{
//                   padding: "10px 16px",
//                   textAlign: "left",
//                   fontSize: 10,
//                   fontWeight: 700,
//                   letterSpacing: "0.08em",
//                   color: "#94a3b8",
//                   borderBottom: "1px solid #f1f5f9",
//                   textTransform: "uppercase",
//                 }}
//               >
//                 {h}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {users.length === 0 ? (
//             <tr>
//               <td
//                 colSpan={4}
//                 style={{
//                   textAlign: "center",
//                   padding: "40px 0",
//                   color: "#94a3b8",
//                   fontSize: 13,
//                 }}
//               >
//                 No {roleKey}s found in your organization.
//               </td>
//             </tr>
//           ) : (
//             users.map((u) => {
//               const [a, b] = avatarColor(u.displayName || u.email || "");
//               return (
//                 <tr
//                   key={u.id || u.email}
//                   onClick={() => onRowClick(u)}
//                   style={{
//                     borderBottom: "1px solid #f8fafc",
//                     cursor: "pointer",
//                     transition: "background .1s",
//                   }}
//                   onMouseEnter={(e) =>
//                     (e.currentTarget.style.background = "#f9fafb")
//                   }
//                   onMouseLeave={(e) =>
//                     (e.currentTarget.style.background = "transparent")
//                   }
//                 >
//                   <td style={{ padding: "10px 16px" }}>
//                     <div
//                       style={{ display: "flex", alignItems: "center", gap: 10 }}
//                     >
//                       <div
//                         style={{
//                           width: 32,
//                           height: 32,
//                           borderRadius: "50%",
//                           flexShrink: 0,
//                           background: `linear-gradient(135deg,${a},${b})`,
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           color: "#fff",
//                           fontSize: 11,
//                           fontWeight: 700,
//                         }}
//                       >
//                         {initials(u.displayName || u.email)}
//                       </div>
//                       <div>
//                         <div
//                           style={{
//                             fontSize: 13,
//                             fontWeight: 600,
//                             color: "#111827",
//                           }}
//                         >
//                           {u.displayName || "—"}
//                         </div>
//                         <div style={{ fontSize: 10.5, color: "#94a3b8" }}>
//                           {u.email}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td style={{ padding: "10px 16px" }}>
//                     <span
//                       style={{
//                         fontSize: 10,
//                         fontWeight: 600,
//                         padding: "2px 8px",
//                         borderRadius: 99,
//                         background: ROLE_BADGE.bg,
//                         color: ROLE_BADGE.color,
//                       }}
//                     >
//                       {ROLE_BADGE.label}
//                     </span>
//                   </td>
//                   <td
//                     style={{
//                       padding: "10px 16px",
//                       color: "#6b7280",
//                       fontSize: 11,
//                       fontFamily: "monospace",
//                     }}
//                   >
//                     {u.id ?? "—"}
//                   </td>
//                   <td style={{ padding: "10px 16px" }}>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onRowClick(u);
//                       }}
//                       style={{
//                         fontSize: 11,
//                         fontWeight: 600,
//                         padding: "4px 10px",
//                         borderRadius: 6,
//                         background: "#eef2ff",
//                         color: "#4f46e5",
//                         border: "none",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Manage access →
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // ═════════════════════════════════════════════════════════════════════════
// // MAIN PAGE
// // ═════════════════════════════════════════════════════════════════════════
// export default function AccessControlPage({ orgId: orgIdProp }) {
//   // Same source AllUsers.jsx uses for its org-scoped fetch — prefer an
//   // explicit prop if the router/parent passes one, otherwise fall back to
//   // the logged-in admin's own org from localStorage.
//   const orgId =
//     orgIdProp ||
//     JSON.parse(localStorage.getItem("lms_user") || "null")?.organizationId ||
//     null;

//   const [tab, setTab] = useState("trainers");
//   const [search, setSearch] = useState("");

//   const [trainers, setTrainers] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [trainersLoading, setTrainersLoading] = useState(true);
//   const [studentsLoading, setStudentsLoading] = useState(true);
//   const [trainersError, setTrainersError] = useState(null);
//   const [studentsError, setStudentsError] = useState(null);

//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedRoleKey, setSelectedRoleKey] = useState(null);

//   const loadTrainers = useCallback(() => {
//     if (!orgId) {
//       setTrainersError("No organization found on this account.");
//       setTrainersLoading(false);
//       return;
//     }
//     setTrainersLoading(true);
//     setTrainersError(null);
//     accessControlService
//       .getOrgTrainers(orgId)
//       .then((data) => setTrainers(Array.isArray(data) ? data : []))
//       .catch(() => setTrainersError("Failed to load trainers."))
//       .finally(() => setTrainersLoading(false));
//   }, [orgId]);

//   const loadStudents = useCallback(() => {
//     if (!orgId) {
//       setStudentsError("No organization found on this account.");
//       setStudentsLoading(false);
//       return;
//     }
//     setStudentsLoading(true);
//     setStudentsError(null);
//     accessControlService
//       .getOrgStudents(orgId)
//       .then((data) => setStudents(Array.isArray(data) ? data : []))
//       .catch(() => setStudentsError("Failed to load students."))
//       .finally(() => setStudentsLoading(false));
//   }, [orgId]);

//   useEffect(() => {
//     loadTrainers();
//     loadStudents();
//   }, [loadTrainers, loadStudents]);

//   const activeList = tab === "trainers" ? trainers : students;
//   const filtered = activeList.filter((u) => {
//     if (!search) return true;
//     const q = search.toLowerCase();
//     return (
//       (u.displayName || "").toLowerCase().includes(q) ||
//       (u.email || "").toLowerCase().includes(q)
//     );
//   });

//   return (
//     <div
//       style={{
//         fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
//         padding: "20px 22px",
//       }}
//     >
//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes drawerSlide { from { transform: translateX(100%); } to { transform: translateX(0); } }
//         @keyframes toastIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
//       `}</style>

//       {/* Header */}
//       <div style={{ marginBottom: 18 }}>
//         <h1
//           style={{
//             fontSize: 19,
//             fontWeight: 700,
//             color: "#0f172a",
//             letterSpacing: "-0.3px",
//           }}
//         >
//           Access Control
//         </h1>
//         <p style={{ fontSize: 12.5, color: "#64748b", marginTop: 3 }}>
//           Control which features each trainer and student in your organization
//           can use. Changes apply immediately per service — each service saves
//           independently.
//         </p>
//       </div>

//       {/* Tabs */}
//       <div style={{ display: "flex", gap: 7, marginBottom: 14 }}>
//         {[
//           { key: "trainers", label: "Trainers", count: trainers.length },
//           { key: "students", label: "Students", count: students.length },
//         ].map((t) => (
//           <button
//             key={t.key}
//             onClick={() => setTab(t.key)}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//               padding: "7px 14px",
//               borderRadius: 8,
//               fontSize: 12.5,
//               fontWeight: 700,
//               border: "none",
//               cursor: "pointer",
//               background: tab === t.key ? "#6366f1" : "#f1f5f9",
//               color: tab === t.key ? "#fff" : "#64748b",
//             }}
//           >
//             {t.label}
//             <span
//               style={{
//                 fontSize: 10,
//                 fontWeight: 700,
//                 padding: "1px 7px",
//                 borderRadius: 99,
//                 background:
//                   tab === t.key ? "rgba(255,255,255,0.25)" : "#e5e7eb",
//               }}
//             >
//               {t.count}
//             </span>
//           </button>
//         ))}
//       </div>

//       {/* Table card */}
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: 14,
//           border: "1px solid #e5e7eb",
//           boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//           overflow: "hidden",
//         }}
//       >
//         <div
//           style={{
//             padding: "11px 15px",
//             borderBottom: "1px solid #f1f5f9",
//             display: "flex",
//             alignItems: "center",
//             gap: 7,
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//               flex: 1,
//               minWidth: 180,
//               border: "1px solid #e2e8f0",
//               borderRadius: 8,
//               padding: "5px 9px",
//               background: "#f9fafb",
//             }}
//           >
//             <span style={{ fontSize: 12, color: "#94a3b8" }}>🔍</span>
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder={`Search ${tab}…`}
//               style={{
//                 border: "none",
//                 background: "transparent",
//                 fontSize: 12,
//                 color: "#374151",
//                 outline: "none",
//                 width: "100%",
//               }}
//             />
//           </div>
//           <span style={{ fontSize: 11, color: "#9ca3af" }}>
//             {filtered.length} results
//           </span>
//         </div>

//         {tab === "trainers" && (
//           <UsersTable
//             users={filtered}
//             roleKey="trainer"
//             loading={trainersLoading}
//             error={trainersError}
//             onRetry={loadTrainers}
//             onRowClick={(u) => {
//               setSelectedUser(u);
//               setSelectedRoleKey("trainer");
//             }}
//           />
//         )}
//         {tab === "students" && (
//           <UsersTable
//             users={filtered}
//             roleKey="student"
//             loading={studentsLoading}
//             error={studentsError}
//             onRetry={loadStudents}
//             onRowClick={(u) => {
//               setSelectedUser(u);
//               setSelectedRoleKey("student");
//             }}
//           />
//         )}
//       </div>

//       {selectedUser && (
//         <UserDetailDrawer
//           user={selectedUser}
//           roleKey={selectedRoleKey}
//           onClose={() => {
//             setSelectedUser(null);
//             setSelectedRoleKey(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }





































import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  Shield,
  Users,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

// Shared behavior for the View drawer / Edit modal / Delete confirm overlays:
// lock background scroll while open, and jump the viewport to top the
// instant one opens so it's visible immediately — no manual scrolling
// needed to find it (this also protects against any ancestor further up
// the app shell that would otherwise clip a plain `position: fixed`).
function useOverlayOpenEffects() {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);
}

// Renders straight into document.body via a portal, so the overlay is
// always positioned relative to the real browser viewport — immune to any
// scrollable/transformed ancestor elsewhere in the app shell that could
// otherwise push a `position: fixed` panel off-screen.
function OverlayPortal({ children }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

// ─── Global Design System — same source of truth used by AdminDashboard.jsx
// (T.dark / T.light tokens, detected the same way via MutationObserver on
// <html>). This page no longer keeps its own light/dark palette or toggle —
// dark mode here always mirrors the app shell's existing toggle, exactly
// like the dashboard.
import { T, FONT_FAMILY, RADIUS, ACCENT_PURPLE } from "@/design-system";

// ═════════════════════════════════════════════════════════════════════════
// DUMMY DATA — TODO(BACKEND): replace with the real API response from
// accessControlService.getOrgStudents(orgId) / getOrgTrainers(orgId).
// Row shape stays identical to what the table renders, so swapping the
// data source needs zero UI edits — just feed the fetched array into
// setStudents / setTrainers below instead of DUMMY_STUDENTS / DUMMY_TRAINERS.
// ═════════════════════════════════════════════════════════════════════════
const DUMMY_STUDENTS = [
  { id: 1, name: "Aman Raj", email: "aman.raj@email.com", course: "Full Stack Web Development", status: "Active", joinedOn: "24 Apr 2025" },
  { id: 2, name: "Neha Kumari", email: "neha.kumari@email.com", course: "Data Science with Python", status: "Active", joinedOn: "20 Apr 2025" },
  { id: 3, name: "Rohan Singh", email: "rohan.singh@email.com", course: "UI/UX Design", status: "Inactive", joinedOn: "18 Apr 2025" },
  { id: 4, name: "Priya Sharma", email: "priya.sharma@email.com", course: "Digital Marketing", status: "Active", joinedOn: "15 Apr 2025" },
  { id: 5, name: "Mohit Verma", email: "mohit.verma@email.com", course: "Python Programming", status: "Active", joinedOn: "12 Apr 2025" },
  { id: 6, name: "Simran Kaur", email: "simran.kaur@email.com", course: "Mobile App Development", status: "Inactive", joinedOn: "10 Apr 2025" },
];

const DUMMY_TRAINERS = [
  { id: 1, name: "Aditya Kapoor", email: "aditya.kapoor@email.com", expertise: "Full Stack Web Development", batches: 3, status: "Active", joinedOn: "12 Mar 2025" },
  { id: 2, name: "Kavita Nair", email: "kavita.nair@email.com", expertise: "Data Science with Python", batches: 2, status: "Active", joinedOn: "08 Mar 2025" },
  { id: 3, name: "Rahul Mehta", email: "rahul.mehta@email.com", expertise: "UI/UX Design", batches: 1, status: "Inactive", joinedOn: "28 Feb 2025" },
  { id: 4, name: "Sneha Iyer", email: "sneha.iyer@email.com", expertise: "Digital Marketing", batches: 4, status: "Active", joinedOn: "22 Feb 2025" },
  { id: 5, name: "Vikram Chauhan", email: "vikram.chauhan@email.com", expertise: "Python Programming", batches: 2, status: "Active", joinedOn: "15 Feb 2025" },
  { id: 6, name: "Ritika Desai", email: "ritika.desai@email.com", expertise: "Mobile App Development", batches: 1, status: "Inactive", joinedOn: "10 Feb 2025" },
];

// Column configs — drives table headers, filter dropdown, view drawer and
// edit modal for each entity. Add/remove a field here and every part of
// the UI (table, filters, view, edit) updates automatically.
const STUDENT_FIELDS = [
  { key: "course", label: "Course", filterable: true },
  { key: "status", label: "Status", type: "status" },
  { key: "joinedOn", label: "Joined On", editable: false },
];
const TRAINER_FIELDS = [
  { key: "expertise", label: "Expertise", filterable: true },
  { key: "batches", label: "Batches", type: "number" },
  { key: "status", label: "Status", type: "status" },
  { key: "joinedOn", label: "Joined On", editable: false },
];

const AVATAR_COLORS = ["#16a34a", "#f97316", "#7c3aed", "#0d9488", "#2563eb", "#db2777"];
const initials = (name = "") =>
  name.split(" ").map((w) => w[0] || "").join("").slice(0, 2).toUpperCase();
const avatarColor = (name = "") => AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];

// ═════════════════════════════════════════════════════════════════════════
// THEME — sourced from the shared design system (T.dark / T.light), the
// exact same tokens + detection pattern as AdminDashboard.jsx. This page
// has a few extra needs the shared tokens don't cover yet (status pills,
// row-action icon colors, filter-chip active state) — those are derived
// here from the shared tokens/ACCENT_PURPLE using the same "color + alpha"
// convention the dashboard's IconBadge already uses, so nothing is
// invented outside that system.
// ═════════════════════════════════════════════════════════════════════════
const isDark = () =>
  typeof document !== "undefined" &&
  (document.documentElement.classList.contains("dark") ||
    document.documentElement.getAttribute("data-theme") === "dark");

// ═════════════════════════════════════════════════════════════════════════
// RESPONSIVE — matchMedia-driven breakpoints so this page adapts across
// phones (iPhone SE/12/13/14/15/16, Pixel 6/7/8/9), iPad mini/iPad/iPad Pro
// in both orientations, tablets, laptops, desktops and Mac displays.
// `stacked` (<1024px, i.e. phones + portrait tablets/iPad) turns the fixed
// sidebar into a horizontal scrollable tab bar above the table.
// `isMobile` (<640px, phones) tightens padding/type further.
// ═════════════════════════════════════════════════════════════════════════
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    setMatches(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, [query]);
  return matches;
}

const STATUS_GREEN = "#16a34a";
const STATUS_RED = "#ef4444";
const ACTION_BLUE = "#3b82f6";

function buildTheme(dark) {
  const base = dark ? T.dark : T.light;
  const purple = ACCENT_PURPLE.base;
  return {
    // core — straight from the shared design system, same as the dashboard
    pageBg: base.pageBg,
    panelBg: base.cardBg,
    sidebarBg: base.cardBg,
    border: base.border,
    borderStrong: base.border,
    text: base.text,
    textSub: base.textSub,
    textMuted: base.textMuted,
    textFaint: base.textMuted,
    inputBg: base.recentItemBg,
    headerRowBg: base.recentItemBg,
    rowBorder: base.border,
    rowHover: base.recentItemBg,
    shadow: base.shadow,
    link: ACTION_BLUE,
    accent: purple,
    overlay: dark ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.5)",
    // tells the browser to render NATIVE controls (the <select> dropdown
    // popup, its scrollbar, etc.) in the matching theme — this is what
    // was missing before, so opened dropdowns fell back to the OS's
    // default light popup regardless of the app's dark mode.
    colorScheme: dark ? "dark" : "light",
    // filter-chip active state
    chipActiveBg: `${purple}18`,
    chipActiveText: purple,
    // status pill
    activeGreen: `${STATUS_GREEN}18`,
    activeGreenText: STATUS_GREEN,
    inactiveRed: `${STATUS_RED}18`,
    inactiveRedText: STATUS_RED,
    // row actions
    viewBg: `${ACTION_BLUE}18`,
    viewText: ACTION_BLUE,
    editBg: `${purple}18`,
    editText: purple,
    deleteBg: `${STATUS_RED}18`,
    deleteText: STATUS_RED,
  };
}

// ═════════════════════════════════════════════════════════════════════════
// ACCESS SIDEBAR — 2nd folding.
// ═════════════════════════════════════════════════════════════════════════
function AccessSidebar({ activeTab, onSelectTab, counts, t, stacked }) {
  // STACKED (phones + portrait tablets/iPad mini/iPad): horizontal
  // scrollable tab bar instead of a fixed-width side column.
  if (stacked) {
    return (
      <div
        style={{
          width: "100%",
          flexShrink: 0,
          background: t.sidebarBg,
          borderBottom: `1px solid ${t.border}`,
          padding: "10px 12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: t.chipActiveBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Shield size={11} color={t.chipActiveText} />
          </div>
          <span style={{ fontSize: 12.5, fontWeight: 800, color: t.text }}>Access Control</span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            paddingBottom: 2,
          }}
        >
          <SidebarItem
            icon={Users}
            label="Trainers"
            count={counts.trainers}
            active={activeTab === "trainers"}
            onClick={() => onSelectTab("trainers")}
            t={t}
            pill
          />
          <SidebarItem
            icon={Users}
            label="Students"
            count={counts.students}
            active={activeTab === "students"}
            onClick={() => onSelectTab("students")}
            t={t}
            pill
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: 190,
        flexShrink: 0,
        background: t.sidebarBg,
        borderRight: `1px solid ${t.border}`,
        padding: "14px 10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 7,
            background: t.chipActiveBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Shield size={12} color={t.chipActiveText} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: t.text }}>Access Control</span>
      </div>

      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", color: t.textFaint, margin: "0 6px 6px" }}>
        TRAINERS
      </div>
      <SidebarItem
        icon={Users}
        label="Trainers"
        count={counts.trainers}
        active={activeTab === "trainers"}
        onClick={() => onSelectTab("trainers")}
        t={t}
      />

      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", color: t.textFaint, margin: "14px 6px 6px" }}>
        STUDENTS
      </div>
      <SidebarItem
        icon={Users}
        label="Students"
        count={counts.students}
        active={activeTab === "students"}
        onClick={() => onSelectTab("students")}
        t={t}
      />
    </div>
  );
}

function SidebarItem({ icon: Icon, label, count, active, onClick, t, pill }) {
  return (
    <div
      onClick={onClick}
      style={
        pill
          ? {
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 11px",
              borderRadius: 99,
              cursor: "pointer",
              flexShrink: 0,
              whiteSpace: "nowrap",
              border: `1px solid ${active ? "transparent" : t.borderStrong}`,
              background: active ? t.chipActiveBg : "transparent",
            }
          : {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              padding: "7px 10px",
              borderRadius: 8,
              cursor: "pointer",
              background: active ? t.chipActiveBg : "transparent",
            }
      }
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Icon size={13} color={active ? t.chipActiveText : t.textMuted} />
        <span style={{ fontSize: 11.5, fontWeight: active ? 700 : 500, color: active ? t.chipActiveText : t.textSub }}>
          {label}
        </span>
      </div>
      {typeof count === "number" && (
        <span style={{ fontSize: 10, fontWeight: 700, color: active ? t.chipActiveText : t.textFaint }}>{count}</span>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// SMALL SHARED UI PIECES
// ═════════════════════════════════════════════════════════════════════════
function FilterSelect({ label, value, options, onChange, t }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          border: `1px solid ${t.borderStrong}`,
          borderRadius: 7,
          padding: "6px 26px 6px 10px",
          fontSize: 11.5,
          color: t.textSub,
          background: t.inputBg,
          cursor: "pointer",
          whiteSpace: "nowrap",
          outline: "none",
          fontFamily: "inherit",
          colorScheme: t.colorScheme,
        }}
      >
        <option value="all" style={{ background: t.panelBg, color: t.text }}>{label}</option>
        {options.map((o) => (
          <option key={o} value={o} style={{ background: t.panelBg, color: t.text }}>{o}</option>
        ))}
      </select>
      <ChevronDown
        size={12}
        color={t.textFaint}
        style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
      />
    </div>
  );
}

function RowIconBtn({ icon: Icon, color, bg, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        background: bg,
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <Icon size={12} color={color} />
    </button>
  );
}

function PageBtn({ children, active, disabled, onClick, t }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        border: active ? "none" : `1px solid ${t.borderStrong}`,
        background: active ? t.accent : t.panelBg,
        color: active ? "#fff" : disabled ? t.textFaint : t.textMuted,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700,
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// VIEW DRAWER — real "eye" action: read-only details panel
// ═════════════════════════════════════════════════════════════════════════
function ViewDrawer({ row, fields, entityLabel, onClose, t }) {
  useOverlayOpenEffects();
  return (
    <OverlayPortal>
      <div style={{ position: "fixed", inset: 0, zIndex: 9200, display: "flex", justifyContent: "flex-end" }}>
        <div onClick={onClose} style={{ position: "absolute", inset: 0, background: t.overlay }} />
        <div
          style={{
            position: "relative",
            width: 340,
            maxWidth: "92vw",
            height: "100%",
            background: t.panelBg,
            borderLeft: `1px solid ${t.border}`,
            boxShadow: "-16px 0 40px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${t.border}` }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: t.text }}>{entityLabel} details</span>
            <button onClick={onClose} style={{ width: 22, height: 22, borderRadius: 6, border: "none", background: t.inputBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={12} color={t.textMuted} />
            </button>
          </div>
          <div style={{ padding: 16, overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: avatarColor(row.name), color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {initials(row.name)}
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: t.text }}>{row.name}</div>
                <div style={{ fontSize: 11, color: t.link }}>{row.email}</div>
              </div>
            </div>
            {fields.map((f) => (
              <div key={f.key} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${t.rowBorder}` }}>
                <span style={{ fontSize: 11, color: t.textMuted }}>{f.label}</span>
                {f.type === "status" ? (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 9px",
                      borderRadius: 99,
                      background: row[f.key] === "Active" ? t.activeGreen : t.inactiveRed,
                      color: row[f.key] === "Active" ? t.activeGreenText : t.inactiveRedText,
                    }}
                  >
                    {row[f.key]}
                  </span>
                ) : (
                  <span style={{ fontSize: 11, fontWeight: 600, color: t.text, textAlign: "right" }}>{row[f.key]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </OverlayPortal>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// EDIT MODAL — real "pencil" action: editable form, saves back into state
// ═════════════════════════════════════════════════════════════════════════
function EditModal({ row, fields, entityLabel, onClose, onSave, t }) {
  const [form, setForm] = useState(row);
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  useOverlayOpenEffects();

  return (
    <OverlayPortal>
      <div style={{ position: "fixed", inset: 0, zIndex: 9300, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div onClick={onClose} style={{ position: "absolute", inset: 0, background: t.overlay }} />
        <div
          style={{
            position: "relative",
            width: 380,
            maxWidth: "92vw",
            maxHeight: "88vh",
            overflowY: "auto",
            background: t.panelBg,
            borderRadius: 12,
            border: `1px solid ${t.border}`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderBottom: `1px solid ${t.border}` }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: t.text }}>Edit {entityLabel.toLowerCase()}</span>
            <button onClick={onClose} style={{ width: 22, height: 22, borderRadius: 6, border: "none", background: t.inputBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={12} color={t.textMuted} />
            </button>
          </div>

          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 11 }}>
            <FormField label="Name" t={t}>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} style={inputStyle(t)} />
            </FormField>
            <FormField label="Email" t={t}>
              <input value={form.email} onChange={(e) => set("email", e.target.value)} style={inputStyle(t)} />
            </FormField>
            {fields.map((f) => {
              if (f.editable === false) return null;
              if (f.type === "status") {
                return (
                  <FormField key={f.key} label={f.label} t={t}>
                    <select value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} style={inputStyle(t)}>
                      <option value="Active" style={{ background: t.panelBg, color: t.text }}>Active</option>
                      <option value="Inactive" style={{ background: t.panelBg, color: t.text }}>Inactive</option>
                    </select>
                  </FormField>
                );
              }
              return (
                <FormField key={f.key} label={f.label} t={t}>
                  <input
                    type={f.type === "number" ? "number" : "text"}
                    value={form[f.key]}
                    onChange={(e) => set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)}
                    style={inputStyle(t)}
                  />
                </FormField>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "12px 16px", borderTop: `1px solid ${t.border}` }}>
            <button
              onClick={onClose}
              style={{ fontSize: 11.5, fontWeight: 600, padding: "7px 14px", borderRadius: 7, border: `1px solid ${t.borderStrong}`, background: "transparent", color: t.textSub, cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(form)}
              style={{ fontSize: 11.5, fontWeight: 700, padding: "7px 16px", borderRadius: 7, border: "none", background: t.accent, color: "#fff", cursor: "pointer" }}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </OverlayPortal>
  );
}
function FormField({ label, children, t }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, color: t.textMuted }}>{label}</span>
      {children}
    </label>
  );
}
const inputStyle = (t) => ({
  border: `1px solid ${t.borderStrong}`,
  borderRadius: 7,
  padding: "7px 10px",
  fontSize: 11.5,
  color: t.text,
  background: t.inputBg,
  outline: "none",
  fontFamily: "inherit",
  colorScheme: t.colorScheme,
});

// ═════════════════════════════════════════════════════════════════════════
// DELETE CONFIRM — real "trash" action
// ═════════════════════════════════════════════════════════════════════════
function DeleteConfirm({ row, entityLabel, onCancel, onConfirm, t }) {
  useOverlayOpenEffects();
  return (
    <OverlayPortal>
      <div style={{ position: "fixed", inset: 0, zIndex: 9400, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div onClick={onCancel} style={{ position: "absolute", inset: 0, background: t.overlay }} />
        <div style={{ position: "relative", width: 300, maxWidth: "92vw", background: t.panelBg, borderRadius: 12, border: `1px solid ${t.border}`, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", padding: 18 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: t.inactiveRed, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
            <Trash2 size={16} color={t.inactiveRedText} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, color: t.text, marginBottom: 5 }}>Remove {row.name}?</div>
          <div style={{ fontSize: 11.5, color: t.textMuted, marginBottom: 14, lineHeight: 1.45 }}>
            This will remove this {entityLabel.toLowerCase()} from the list. This action can't be undone.
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button onClick={onCancel} style={{ fontSize: 11.5, fontWeight: 600, padding: "7px 14px", borderRadius: 7, border: `1px solid ${t.borderStrong}`, background: "transparent", color: t.textSub, cursor: "pointer" }}>
              Cancel
            </button>
            <button onClick={onConfirm} style={{ fontSize: 11.5, fontWeight: 700, padding: "7px 14px", borderRadius: 7, border: "none", background: "#dc2626", color: "#fff", cursor: "pointer" }}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </OverlayPortal>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// GENERIC PEOPLE TABLE — shared, fully working logic for Students & Trainers:
// live search, real filter dropdown + status filter, working filter-reset
// button, and working view / edit / delete actions.
// TODO(BACKEND): pass `data` from the real API response and swap `setData`
// for the update/delete service calls (updateAdminUserX / deleteX) —
// everything else (filtering, modals) keeps working unchanged.
// ═════════════════════════════════════════════════════════════════════════
function PeopleTable({ title, entityLabel, data, setData, fields, t, isMobile }) {
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [statusValue, setStatusValue] = useState("all");
  const [viewRow, setViewRow] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const filterField = fields.find((f) => f.filterable);
  const filterOptions = useMemo(
    () => Array.from(new Set(data.map((r) => r[filterField.key]))).sort(),
    [data, filterField.key],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((r) => {
      const matchesSearch = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
      const matchesFilter = filterValue === "all" || r[filterField.key] === filterValue;
      const matchesStatus = statusValue === "all" || r.status === statusValue;
      return matchesSearch && matchesFilter && matchesStatus;
    });
  }, [data, search, filterValue, statusValue, filterField.key]);

  useEffect(() => setPage(1), [search, filterValue, statusValue]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const filtersActive = search !== "" || filterValue !== "all" || statusValue !== "all";
  const resetFilters = () => {
    setSearch("");
    setFilterValue("all");
    setStatusValue("all");
  };

  const handleSave = (updated) => {
    setData((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setEditRow(null);
  };
  const handleDelete = () => {
    setData((prev) => prev.filter((r) => r.id !== deleteRow.id));
    setDeleteRow(null);
  };

  return (
    <div style={{ flex: 1, minWidth: 0, padding: isMobile ? "12px 12px" : "16px 20px", overflowY: "auto" }}>
      <h1 style={{ fontSize: "clamp(16px, 4vw, 19px)", fontWeight: 800, color: t.text, margin: "0 0 3px" }}>{title}</h1>
      <div style={{ fontSize: 11.5, color: t.textFaint, marginBottom: 8 }}>
        Access Control <span style={{ margin: "0 4px" }}>›</span>{" "}
        <span style={{ color: t.accent, fontWeight: 600 }}>{title}</span>
      </div>

      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "flex-start", justifyContent: "space-between", gap: isMobile ? 6 : 0, marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: t.textMuted, margin: 0, maxWidth: 640 }}>
          Manage and view all {entityLabel.toLowerCase()}s in your organization. You can search, filter and view {entityLabel.toLowerCase()} details.
        </p>
        <span style={{ fontSize: 12, fontWeight: 700, color: t.accent, whiteSpace: "nowrap", marginLeft: isMobile ? 0 : 16 }}>
          {filtered.length} {title}
        </span>
      </div>

      <div style={{ background: t.panelBg, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden", boxShadow: t.shadow }}>
        {/* toolbar */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, padding: isMobile ? "9px 12px" : "10px 14px", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ flex: isMobile ? "1 1 100%" : 1, minWidth: isMobile ? "100%" : 160, display: "flex", alignItems: "center", gap: 7, border: `1px solid ${t.borderStrong}`, borderRadius: 8, padding: "6px 10px", background: t.inputBg }}>
            <Search size={13} color={t.textFaint} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${entityLabel.toLowerCase()}s by name, email or phone...`}
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 11.5, width: "100%", color: t.text, fontFamily: "inherit" }}
            />
          </div>
          <FilterSelect label={`All ${filterField.label}`} value={filterValue} options={filterOptions} onChange={setFilterValue} t={t} />
          <FilterSelect label="All Status" value={statusValue} options={["Active", "Inactive"]} onChange={setStatusValue} t={t} />
          <button
            onClick={resetFilters}
            title={filtersActive ? "Reset filters" : "No filters applied"}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: `1px solid ${filtersActive ? t.accent : t.borderStrong}`,
              background: filtersActive ? t.chipActiveBg : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Filter size={13} color={filtersActive ? t.chipActiveText : t.textMuted} />
          </button>
        </div>

        {/* table — horizontally scrollable below its natural width so
            columns stay legible on phones/tablets instead of squeezing */}
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", minWidth: 600, borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: t.headerRowBg }}>
                {["#", entityLabel.toUpperCase(), "EMAIL", ...fields.map((f) => f.label.toUpperCase()), ""].map((h, i) => (
                  <th
                    key={h + i}
                    style={{
                      textAlign: "left",
                      padding: "7px 12px",
                      fontSize: 9.5,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: t.textFaint,
                      borderBottom: `1px solid ${t.border}`,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((row, idx) => (
                <tr
                  key={row.id}
                  className="acp-row"
                  onClick={() => setViewRow(row)}
                  style={{ borderBottom: `1px solid ${t.rowBorder}`, cursor: "pointer", "--acp-row-hover": t.rowHover }}
                >
                  <td style={{ padding: "8px 12px", color: t.textMuted }}>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td style={{ padding: "8px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 25, height: 25, borderRadius: "50%", background: avatarColor(row.name), color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {initials(row.name)}
                      </div>
                      <span style={{ fontWeight: 600, color: t.text }}>{row.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "8px 12px", color: t.link }}>{row.email}</td>
                  {fields.map((f) => (
                    <td key={f.key} style={{ padding: "8px 12px", color: t.textSub }}>
                      {f.type === "status" ? (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 9px",
                            borderRadius: 99,
                            background: row[f.key] === "Active" ? t.activeGreen : t.inactiveRed,
                            color: row[f.key] === "Active" ? t.activeGreenText : t.inactiveRedText,
                          }}
                        >
                          {row[f.key]}
                        </span>
                      ) : (
                        row[f.key]
                      )}
                    </td>
                  ))}
                  <td style={{ padding: "8px 12px" }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <RowIconBtn icon={Eye} color={t.viewText} bg={t.viewBg} title="View" onClick={() => setViewRow(row)} />
                      <RowIconBtn icon={Pencil} color={t.editText} bg={t.editBg} title="Edit" onClick={() => setEditRow(row)} />
                      <RowIconBtn icon={Trash2} color={t.deleteText} bg={t.deleteBg} title="Delete" onClick={() => setDeleteRow(row)} />
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={fields.length + 4} style={{ textAlign: "center", padding: "28px 0", color: t.textFaint, fontSize: 12 }}>
                    No {entityLabel.toLowerCase()}s match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8, padding: isMobile ? "9px 12px" : "9px 14px" }}>
          <span style={{ fontSize: 11, color: t.textFaint }}>
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} {entityLabel.toLowerCase()}s
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <PageBtn disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} t={t}>
              <ChevronLeft size={12} />
            </PageBtn>
            <PageBtn active t={t}>{page}</PageBtn>
            <PageBtn disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} t={t}>
              <ChevronRight size={12} />
            </PageBtn>
          </div>
        </div>
      </div>

      {viewRow && <ViewDrawer row={viewRow} fields={fields} entityLabel={entityLabel} onClose={() => setViewRow(null)} t={t} />}
      {editRow && <EditModal row={editRow} fields={fields} entityLabel={entityLabel} onClose={() => setEditRow(null)} onSave={handleSave} t={t} />}
      {deleteRow && <DeleteConfirm row={deleteRow} entityLabel={entityLabel} onCancel={() => setDeleteRow(null)} onConfirm={handleDelete} t={t} />}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// PAGE ROOT
// ═════════════════════════════════════════════════════════════════════════
export default function AccessControlPage() {
  const [accessTab, setAccessTab] = useState("students");
  const [students, setStudents] = useState(DUMMY_STUDENTS);
  const [trainers, setTrainers] = useState(DUMMY_TRAINERS);

  // Dark mode is read-only here — it always mirrors whatever the app shell's
  // existing toggle sets on <html>, exactly like AdminDashboard.jsx. There is
  // no local light/dark button on this page.
  const [dark, setDark] = useState(isDark);
  useEffect(() => {
    setDark(isDark());
    const obs = new MutationObserver(() => setDark(isDark()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = useMemo(() => buildTheme(dark), [dark]);

  // Breakpoints: `stacked` covers phones + portrait tablets/iPad mini/iPad
  // (sidebar becomes a horizontal tab bar); `isMobile` further tightens
  // spacing/type for phones (iPhone SE through Pro Max, Pixel, etc).
  // Landscape iPad, laptops, desktops and Mac displays keep the original
  // side-by-side layout.
  const stacked = useMediaQuery("(max-width: 1023px)");
  const isMobile = useMediaQuery("(max-width: 639px)");

  return (
    <div style={{ fontFamily: FONT_FAMILY, background: t.pageBg, minHeight: "100vh", display: "flex", flexDirection: "column", transition: "background .15s", colorScheme: t.colorScheme }}>
      {/* Row is clickable end-to-end (not just the eye icon) to open the View
          drawer — including touch, so tapping a row on phone/tablet works
          the same as a click on desktop. */}
      <style>{`
        .acp-row:hover, .acp-row:active { background: var(--acp-row-hover); }
        @media (hover: none) {
          .acp-row:active { background: var(--acp-row-hover); }
        }
      `}</style>
      {/* TopNavbar and MainSidebar are rendered by the app shell one level up. */}
      <div style={{ display: "flex", flexDirection: stacked ? "column" : "row", flex: 1, minWidth: 0 }}>
        <AccessSidebar
          activeTab={accessTab}
          onSelectTab={setAccessTab}
          counts={{ students: students.length, trainers: trainers.length }}
          t={t}
          stacked={stacked}
        />
        {accessTab === "students" ? (
          <PeopleTable title="Students" entityLabel="Student" data={students} setData={setStudents} fields={STUDENT_FIELDS} t={t} isMobile={isMobile} />
        ) : (
          <PeopleTable title="Trainers" entityLabel="Trainer" data={trainers} setData={setTrainers} fields={TRAINER_FIELDS} t={t} isMobile={isMobile} />
        )}
      </div>
    </div>
  );
}