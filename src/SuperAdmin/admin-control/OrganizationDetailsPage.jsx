// pages/OrganizationDetailsPage.jsx
// SuperAdmin → Organization detail
// Feature controls use ONLY real endpoints from existing service files

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import authService from "../../services/authService";
import userService from "../../services/userService";
import {
  getDepartmentsByOrg,
  getBranchesByOrg,
  getBatchesByOrg,
  getTrainerStudents,
  getOrgFeatureFlags,
  updateOrgFeatureFlags,
} from "../../services/batchService";
import { courseService } from "../../services/courseService";

// ─────────────────────────────────────────────────────────────────────────────
// REAL SERVICES CONFIG — mapped 1:1 from actual service files
// Each feature key corresponds to a real API endpoint that exists
// ─────────────────────────────────────────────────────────────────────────────

export const SERVICES_CONFIG = [
  {
    key: "assessment",
    label: "Assessment",
    icon: "📝",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    color: "#8b5cf6",
    colorLight: "#ede9fe",
    colorDark: "rgba(139,92,246,0.15)",
    glow: "rgba(139,92,246,0.4)",
    features: {
      trainer: [
        { key: "create_quiz", label: "Create quiz", endpoint: "POST /quizzes" },
        {
          key: "delete_quiz",
          label: "Delete quiz",
          endpoint: "DELETE /quizzes/:id",
        },
        {
          key: "add_question",
          label: "Add question",
          endpoint: "POST /questions",
        },
        {
          key: "add_option",
          label: "Add answer option",
          endpoint: "POST /options",
        },
        {
          key: "upload_bulk_quiz",
          label: "Bulk upload quiz (CSV)",
          endpoint: "POST /quizzes/upload-bulk",
        },
        {
          key: "create_coding_problem",
          label: "Create coding problem",
          endpoint: "POST /v1/problems",
        },
        {
          key: "update_coding_problem",
          label: "Edit coding problem",
          endpoint: "PUT /v1/problems/:id",
        },
        {
          key: "delete_coding_problem",
          label: "Delete coding problem",
          endpoint: "DELETE /v1/problems/:id",
        },
        {
          key: "assign_problem_to_batch",
          label: "Assign problem to batch",
          endpoint: "POST /v1/assignments",
        },
        {
          key: "unassign_problem",
          label: "Remove problem from batch",
          endpoint: "DELETE /v1/assignments/:id",
        },
        {
          key: "add_test_case",
          label: "Add test case",
          endpoint: "POST /v1/problems/:id/testcases",
        },
        {
          key: "evaluate_submission",
          label: "Grade assignment submission",
          endpoint: "PUT /submissions/evaluate/:id",
        },
        {
          key: "view_submissions",
          label: "View all submissions",
          endpoint: "GET /submissions/:assignmentId",
        },
      ],
      student: [
        {
          key: "view_trainer_quizzes",
          label: "View available quizzes",
          endpoint: "GET /quizzes/student",
        },
        {
          key: "submit_quiz_attempt",
          label: "Attempt a quiz",
          endpoint: "POST /attempts/submit",
        },
        {
          key: "view_quiz_history",
          label: "View quiz history",
          endpoint: "GET /attempts/my",
        },
        {
          key: "view_student_problems",
          label: "View coding problems",
          endpoint: "GET /v1/assignments/student/problems",
        },
        {
          key: "submit_code_for_judge",
          label: "Submit code solution",
          endpoint: "POST /v1/assignments/student/problems/:id/submit",
        },
        {
          key: "run_code_free",
          label: "Free code execution",
          endpoint: "POST /v1/code/run",
        },
        {
          key: "view_my_code_submissions",
          label: "View code submission history",
          endpoint: "GET /v1/code/submissions/student",
        },
        {
          key: "submit_assignment",
          label: "Submit assignment file",
          endpoint: "POST /submissions/:assignmentId",
        },
        {
          key: "view_my_submissions",
          label: "View my submissions",
          endpoint: "GET /submissions/my",
        },
      ],
      admin: [
        {
          key: "get_all_quizzes",
          label: "View all quizzes",
          endpoint: "GET /quizzes",
        },
        {
          key: "get_batch_code_submissions",
          label: "View batch code submissions",
          endpoint: "GET /v1/code/submissions/batch/:batchId",
        },
      ],
    },
  },
  {
    key: "attendance",
    label: "Attendance",
    icon: "🗓️",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
    color: "#14b8a6",
    colorLight: "#f0fdfa",
    colorDark: "rgba(20,184,166,0.15)",
    glow: "rgba(20,184,166,0.4)",
    features: {
      trainer: [
        {
          key: "mark_attendance",
          label: "Mark student attendance",
          endpoint: "POST /trainer/attendance/mark",
        },
        {
          key: "get_trainer_batches",
          label: "View assigned batches",
          endpoint: "GET /batch/trainer",
        },
        {
          key: "get_batch_students",
          label: "View students in batch",
          endpoint: "GET /chat/trainer/students?batchId=",
        },
      ],
      student: [
        {
          key: "view_monthly_attendance",
          label: "View monthly attendance",
          endpoint: "GET /student/attendance/monthly",
        },
      ],
      admin: [],
    },
  },
  {
    key: "batch",
    label: "Batch",
    icon: "👥",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
    color: "#f59e0b",
    colorLight: "#fffbeb",
    colorDark: "rgba(245,158,11,0.15)",
    glow: "rgba(245,158,11,0.4)",
    features: {
      trainer: [
        {
          key: "get_trainer_batches",
          label: "View my batches",
          endpoint: "GET /batch/trainer",
        },
        {
          key: "get_trainer_dashboard",
          label: "Trainer dashboard",
          endpoint: "GET /batch/trainer + /batch/trainer/students",
        },
        {
          key: "get_batch_students",
          label: "View students in batch",
          endpoint: "GET /batch/trainer/batches/:id/students",
        },
      ],
      student: [
        {
          key: "get_student_batch",
          label: "View my batch",
          endpoint: "GET /batch/student",
        },
        {
          key: "get_student_classroom",
          label: "View classroom",
          endpoint: "GET /batch/student/classroom",
        },
      ],
      admin: [
        {
          key: "create_batch",
          label: "Create batch",
          endpoint: "POST /batch/admin/batches",
        },
        {
          key: "delete_batch",
          label: "Delete batch",
          endpoint: "DELETE /batch/admin/batches/:id",
        },
        {
          key: "get_all_batches",
          label: "View all batches",
          endpoint: "GET /batch/admin/batches",
        },
        {
          key: "assign_trainer",
          label: "Assign trainer to batch",
          endpoint: "PUT /batch/admin/batches/:id/trainers/:email",
        },
        {
          key: "remove_trainer",
          label: "Remove trainer from batch",
          endpoint: "DELETE /batch/admin/batches/:id/trainer",
        },
        {
          key: "assign_students",
          label: "Assign students to trainer",
          endpoint: "POST /batch/admin/batches/:id/trainers/:email/students",
        },
        {
          key: "remove_student",
          label: "Remove student from trainer",
          endpoint:
            "DELETE /batch/admin/batches/:id/trainers/:email/students/:email",
        },
        {
          key: "get_trainer_students",
          label: "View trainer–student mapping",
          endpoint: "GET /batch/admin/batches/:id/trainer-students",
        },
        {
          key: "get_available_students",
          label: "View available students",
          endpoint:
            "GET /batch/admin/batches/:id/trainers/:email/available-students",
        },
        {
          key: "get_available_trainers",
          label: "View available trainers",
          endpoint: "GET /batch/admin/batches/:id/available-trainers",
        },
        {
          key: "get_branches",
          label: "View branches",
          endpoint: "GET /branch",
        },
        {
          key: "create_branch",
          label: "Create branch",
          endpoint: "POST /branch",
        },
        {
          key: "delete_branch",
          label: "Delete branch",
          endpoint: "DELETE /branch/:id",
        },
        {
          key: "update_branch",
          label: "Update branch",
          endpoint: "PUT /branch/:id",
        },
        {
          key: "create_department",
          label: "Create department",
          endpoint: "POST /departments",
        },
        {
          key: "get_departments",
          label: "View departments",
          endpoint: "GET /departments",
        },
        {
          key: "get_department_by_id",
          label: "View department by ID",
          endpoint: "GET /departments/:id",
        },
        {
          key: "update_department",
          label: "Update department",
          endpoint: "PUT /departments/:id",
        },
        {
          key: "delete_department",
          label: "Delete department",
          endpoint: "DELETE /departments/:id",
        },
      ],
    },
  },
  {
    key: "chat",
    label: "Chat",
    icon: "💬",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
    color: "#0ea5e9",
    colorLight: "#f0f9ff",
    colorDark: "rgba(14,165,233,0.15)",
    glow: "rgba(14,165,233,0.4)",
    features: {
      trainer: [
        {
          key: "get_trainer_students",
          label: "View students to message",
          endpoint: "GET /chat/trainer/students?batchId=",
        },
        {
          key: "send_message",
          label: "Send message",
          endpoint: "POST /chat/send",
        },
        {
          key: "get_conversation",
          label: "View conversation",
          endpoint: "GET /chat/conversation",
        },
      ],
      student: [
        {
          key: "get_student_trainer",
          label: "View assigned trainer",
          endpoint: "GET /chat/student/trainer?batchId=",
        },
        {
          key: "get_student_context",
          label: "View chat context",
          endpoint: "GET /chat/student/context",
        },
        {
          key: "send_message",
          label: "Send message",
          endpoint: "POST /chat/send",
        },
        {
          key: "get_conversation",
          label: "View conversation",
          endpoint: "GET /chat/conversation",
        },
      ],
      admin: [],
    },
  },
  {
    key: "course",
    label: "Courses",
    icon: "📚",
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "#6366f1",
    colorLight: "#eef2ff",
    colorDark: "rgba(99,102,241,0.15)",
    glow: "rgba(99,102,241,0.4)",
    features: {
      trainer: [
        {
          key: "get_my_courses",
          label: "View my courses",
          endpoint: "GET /courses/my",
        },
        {
          key: "create_course",
          label: "Create course",
          endpoint: "POST /courses",
        },
        {
          key: "update_course",
          label: "Edit course",
          endpoint: "PUT /courses/:id",
        },
        {
          key: "delete_course",
          label: "Delete course",
          endpoint: "DELETE /courses/:id",
        },
        // {
        //   key: "create_study_plan",
        //   label: "Create study plan",
        //   endpoint: "POST /v1/study-plans",
        // },
        // {
        //   key: "manage_study_plans",
        //   label: "Manage study plans",
        //   endpoint: "GET /v1/study-plans/my",
        // },
        // {
        //   key: "toggle_study_plan",
        //   label: "Activate/deactivate study plan",
        //   endpoint: "PATCH /v1/study-plans/:id/toggle-active",
        // },
      ],
      student: [
        {
          key: "get_student_courses",
          label: "View enrolled courses",
          endpoint: "GET /courses/student",
        },
        {
          key: "get_student_study_plans",
          label: "View study plans",
          endpoint: "GET /v1/study-plans/student",
        },
        {
          key: "mark_study_plan_progress",
          label: "Mark study plan item done",
          endpoint: "POST /v1/study-plans/progress/mark",
        },
      ],
      admin: [
        {
          key: "get_all_courses",
          label: "View all courses",
          endpoint: "GET /courses/admin",
        },
        {
          key: "get_courses_by_category",
          label: "Filter by category",
          endpoint: "GET /courses/admin/category/:cat",
        },
        {
          key: "manage_featured_courses",
          label: "Manage featured courses",
          endpoint: "POST /featured-courses/upload",
        },
      ],
    },
  },
  {
    key: "file",
    label: "Files",
    icon: "📁",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)",
    color: "#3b82f6",
    colorLight: "#eff6ff",
    colorDark: "rgba(59,130,246,0.15)",
    glow: "rgba(59,130,246,0.4)",
    features: {
      trainer: [
        {
          key: "upload_file",
          label: "Upload file",
          endpoint: "POST /file/upload",
        },
        {
          key: "edit_file",
          label: "Edit file details",
          endpoint: "PUT /file/:id/edit",
        },
        {
          key: "publish_file",
          label: "Publish file",
          endpoint: "PATCH /file/:id/publish",
        },
        {
          key: "assign_file_batch",
          label: "Assign file to batch",
          endpoint: "PATCH /file/:id/assign-batch",
        },
        {
          key: "delete_file",
          label: "Delete file",
          endpoint: "DELETE /file/:id",
        },
        {
          key: "get_trainer_files",
          label: "View my uploaded files",
          endpoint: "GET /file/trainer",
        },
        {
          key: "upload_assignment_file",
          label: "Upload assignment file",
          endpoint: "POST /assignment-files/:id",
        },
        {
          key: "get_assignment_files",
          label: "View assignment files",
          endpoint: "GET /assignment-files/:id",
        },
      ],
      student: [
        {
          key: "get_student_files",
          label: "View batch files",
          endpoint: "GET /file/student",
        },
        {
          key: "download_file",
          label: "Download file",
          endpoint: "GET /file/download/:name",
        },
        {
          key: "view_file",
          label: "Preview file (PDF/image)",
          endpoint: "GET /file/view/:id",
        },
        {
          key: "download_assignment_file",
          label: "Download assignment file",
          endpoint: "GET /assignment-files/download/:id",
        },
      ],
      admin: [],
    },
  },
  {
    key: "live_session",
    label: "Live Sessions",
    icon: "📡",
    gradient: "linear-gradient(135deg, #ec4899 0%, #f97316 100%)",
    color: "#ec4899",
    colorLight: "#fdf2f8",
    colorDark: "rgba(236,72,153,0.15)",
    glow: "rgba(236,72,153,0.4)",
    features: {
      trainer: [
        {
          key: "create_live_session",
          label: "Schedule live session",
          endpoint: "POST /live-sessions",
        },
        {
          key: "start_live_session",
          label: "Go live (start session)",
          endpoint: "POST /live-sessions/:id/start-live",
        },
        {
          key: "end_live_session",
          label: "End live session",
          endpoint: "POST /live-sessions/:id/end",
        },
        {
          key: "delete_live_session",
          label: "Delete session",
          endpoint: "DELETE /live-sessions/:id",
        },
        {
          key: "get_session_history",
          label: "View session history",
          endpoint: "GET /live-sessions/history",
        },
        {
          key: "upload_recording",
          label: "Upload recording",
          endpoint: "POST /live-sessions/recording/upload",
        },
        {
          key: "get_my_recordings",
          label: "View my recordings",
          endpoint: "GET /live-sessions/recording/trainer/my",
        },
        {
          key: "manage_whiteboard",
          label: "Use whiteboard",
          endpoint: "POST /v1/live-sessions/:id/whiteboard/save",
        },
        {
          key: "ai_companion",
          label: "AI companion chat",
          endpoint: "POST /v1/ai-companion/chat",
        },
        {
          key: "booking_availability",
          label: "Set booking availability",
          endpoint: "POST /live-sessions/v1/booking/availability",
        },
        {
          key: "create_event_type",
          label: "Create booking event type",
          endpoint: "POST /live-sessions/v1/booking/event-types",
        },
      ],
      student: [
        {
          key: "join_live_session",
          label: "Join live session",
          endpoint: "GET /live-sessions/:id/join",
        },
        {
          key: "get_batch_sessions",
          label: "View upcoming sessions",
          endpoint: "GET /live-sessions/batch/:batchId",
        },
        {
          key: "get_batch_recordings",
          label: "Watch recordings",
          endpoint: "GET /live-sessions/recording/batch/:batchId",
        },
        {
          key: "get_whiteboard_state",
          label: "View whiteboard",
          endpoint: "GET /v1/live-sessions/:id/whiteboard/state",
        },
      ],
      admin: [
        {
          key: "get_published_sessions",
          label: "View published sessions",
          endpoint: "GET /live-sessions/published",
        },
        {
          key: "get_all_recordings",
          label: "View all recordings",
          endpoint: "GET /live-sessions/recording/all",
        },
        {
          key: "get_published_trainers",
          label: "View trainer booking pages",
          endpoint: "GET /live-sessions/v1/booking/public/trainers",
        },
      ],
    },
  },
  {
    key: "notification",
    label: "Notifications",
    icon: "🔔",
    gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
    color: "#a855f7",
    colorLight: "#faf5ff",
    colorDark: "rgba(168,85,247,0.15)",
    glow: "rgba(168,85,247,0.4)",
    features: {
      trainer: [
        {
          key: "receive_notifications",
          label: "Receive in-app notifications",
          endpoint: "GET /notification/my",
        },
        {
          key: "mark_read",
          label: "Mark notifications read",
          endpoint: "PUT /notification/:id/read",
        },
        {
          key: "register_device_token",
          label: "Register push token (FCM)",
          endpoint: "POST /notification/register-token",
        },
      ],
      student: [
        {
          key: "receive_notifications",
          label: "Receive notifications",
          endpoint: "GET /notification/my",
        },
        {
          key: "get_unread_count",
          label: "View unread count",
          endpoint: "GET /notification/unread-count",
        },
        {
          key: "mark_all_read",
          label: "Mark all as read",
          endpoint: "PUT /notification/read-all",
        },
        {
          key: "clear_all",
          label: "Clear all notifications",
          endpoint: "DELETE /notification/clear-all",
        },
      ],
      admin: [
        {
          key: "newsletter_subscribe",
          label: "Newsletter subscription",
          endpoint: "POST /v1/notification/newsletter/subscribe",
        },
        {
          key: "contact_form",
          label: "Contact form submission",
          endpoint: "POST /v1/notification/contact",
        },
      ],
    },
  },
  {
    key: "progress",
    label: "Progress & Skills",
    icon: "📊",
    gradient: "linear-gradient(135deg, #f97316 0%, #eab308 100%)",
    color: "#f97316",
    colorLight: "#fff7ed",
    colorDark: "rgba(249,115,22,0.15)",
    glow: "rgba(249,115,22,0.4)",
    features: {
      trainer: [
        {
          key: "get_batch_progress_report",
          label: "View batch progress report",
          endpoint: "GET /progress/reports/batch/:batchId",
        },
        {
          key: "get_student_progress",
          label: "View per-student progress",
          endpoint: "GET /progress/reports/batch/:batchId/student/:email",
        },
        {
          key: "get_batch_skill_analytics",
          label: "View batch skill analytics",
          endpoint: "GET /skill-map/trainer/batch?batchId=",
        },
        {
          key: "view_skill_map",
          label: "View all batches skill data",
          endpoint: "GET /skill-map/trainer?trainerEmail=",
        },
      ],
      student: [
        {
          key: "mark_content_complete",
          label: "Mark course content done",
          endpoint: "POST /progress/mark-complete",
        },
        {
          key: "get_video_progress",
          label: "View video watch progress",
          endpoint: "GET /video-progress/user",
        },
        {
          key: "mark_video_watched",
          label: "Mark video as watched",
          endpoint: "POST /video-progress/mark-watched",
        },
        {
          key: "get_file_progress",
          label: "View document progress",
          endpoint: "GET /file-progress/user",
        },
        {
          key: "get_quiz_progress",
          label: "View quiz progress",
          endpoint: "GET /quiz-progress/user",
        },
        {
          key: "get_assignment_progress",
          label: "View assignment progress",
          endpoint: "GET /assignment-progress/user",
        },
        {
          key: "view_student_skill_map",
          label: "View my skill map",
          endpoint: "GET /skill-map/student?email=&batchId=",
        },
      ],
      admin: [
        {
          key: "get_org_skill_dashboard",
          label: "Org-wide skill dashboard",
          endpoint: "GET /skill-map/admin/org",
        },
        {
          key: "get_trainer_progress_report",
          label: "Trainer progress report",
          endpoint: "GET /progress/reports/trainer/:email",
        },
      ],
    },
  },
  {
    key: "video",
    label: "Videos",
    icon: "🎬",
    gradient: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
    color: "#10b981",
    colorLight: "#ecfdf5",
    colorDark: "rgba(16,185,129,0.15)",
    glow: "rgba(16,185,129,0.4)",
    features: {
      trainer: [
        {
          key: "upload_video",
          label: "Upload video file",
          endpoint: "POST /video/upload",
        },
        {
          key: "upload_video_url",
          label: "Add video by URL",
          endpoint: "POST /video/upload-url",
        },
        {
          key: "edit_video",
          label: "Edit video (file)",
          endpoint: "PUT /video/:id/edit",
        },
        {
          key: "edit_video_url",
          label: "Edit video (URL)",
          endpoint: "PUT /video/:id/edit-url",
        },
        {
          key: "publish_video",
          label: "Publish video",
          endpoint: "PATCH /video/:id/publish",
        },
        {
          key: "assign_batch_video",
          label: "Assign video to batch",
          endpoint: "PATCH /video/:id/assign-batch",
        },
        {
          key: "delete_video",
          label: "Delete video",
          endpoint: "DELETE /video/:id",
        },
        {
          key: "get_trainer_videos",
          label: "View my videos",
          endpoint: "GET /video/trainer",
        },
      ],
      student: [
        {
          key: "get_student_videos",
          label: "Watch batch videos",
          endpoint: "GET /video/student",
        },
        {
          key: "play_video",
          label: "Stream video",
          endpoint: "GET /video/play/:filename",
        },
      ],
      admin: [
        {
          key: "get_all_videos",
          label: "View all videos",
          endpoint: "GET /video",
        },
        {
          key: "upload_admin_course",
          label: "Upload admin course pack",
          endpoint: "POST /upload-course/upload",
        },
        {
          key: "get_all_admin_courses",
          label: "View admin course packs",
          endpoint: "GET /upload-course/all",
        },
      ],
    },
  },
];

// Build default flags with all features enabled
export function buildDefaultFlags(enabled = true) {
  const flags = {};
  SERVICES_CONFIG.forEach((svc) => {
    const features = {};
    Object.values(svc.features)
      .flat()
      .forEach((f) => {
        features[f.key] = enabled;
      });
    flags[svc.key] = { enabled, features };
  });
  return flags;
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
const ToastContainer = ({ toasts }) => (
  <div
    style={{
      position: "fixed",
      top: 24,
      right: 24,
      zIndex: 99999,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      pointerEvents: "none",
    }}
  >
    {toasts.map((t) => (
      <div
        key={t.id}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 18px",
          borderRadius: 14,
          background: t.enabled
            ? `linear-gradient(135deg, ${t.color}ee, ${t.color}aa)`
            : "linear-gradient(135deg, #374151dd, #1f2937dd)",
          boxShadow: t.enabled
            ? `0 8px 32px ${t.color}66, 0 2px 8px rgba(0,0,0,0.3)`
            : "0 8px 32px rgba(0,0,0,0.4)",
          border: `1px solid ${t.enabled ? t.color + "80" : "rgba(255,255,255,0.1)"}`,
          backdropFilter: "blur(16px)",
          color: "#fff",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "Inter, sans-serif",
          animation: "toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          minWidth: 240,
          maxWidth: 340,
          pointerEvents: "all",
        }}
      >
        <span style={{ fontSize: 20, flexShrink: 0 }}>
          {t.enabled ? "✅" : "🚫"}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 2 }}>
            {t.serviceName}
          </div>
          <div style={{ fontSize: 13 }}>
            <span style={{ opacity: 0.85 }}>{t.featureName} </span>
            <span
              style={{
                fontWeight: 800,
                color: t.enabled ? "#bbf7d0" : "#fca5a5",
              }}
            >
              {t.enabled ? "ENABLED" : "DISABLED"}
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function initials(name = "") {
  return (
    name
      .split(" ")
      .map((w) => w[0] || "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??"
  );
}
function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
const AVATAR_COLORS = [
  ["#6366f1", "#818cf8"],
  ["#8b5cf6", "#a78bfa"],
  ["#ec4899", "#f472b6"],
  ["#14b8a6", "#2dd4bf"],
  ["#f59e0b", "#fbbf24"],
  ["#10b981", "#34d399"],
  ["#3b82f6", "#60a5fa"],
  ["#ef4444", "#f87171"],
];
const avatarColor = (name = "") =>
  AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
const STATUS_CONFIG = {
  active: { label: "Active", dot: "#16a34a", bg: "#dcfce7", color: "#16a34a" },
  inactive: {
    label: "Inactive",
    dot: "#dc2626",
    bg: "#fee2e2",
    color: "#dc2626",
  },
  trial: { label: "Trial", dot: "#ca8a04", bg: "#fef9c3", color: "#ca8a04" },
  pending: {
    label: "Pending",
    dot: "#f59e0b",
    bg: "#fef3c7",
    color: "#d97706",
  },
};
const PLAN_CONFIG = {
  free: {
    label: "Free",
    dot: "#94a3b8",
    bg: "rgba(148,163,184,0.12)",
    color: "#64748b",
  },
  starter: {
    label: "Starter",
    dot: "#14b8a6",
    bg: "rgba(20,184,166,0.12)",
    color: "#0d9488",
  },
  trial: { label: "Trial", dot: "#ca8a04", bg: "#fef9c3", color: "#ca8a04" },
  pro: {
    label: "Pro",
    dot: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
    color: "#7c3aed",
  },
  enterprise: {
    label: "Enterprise",
    dot: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    color: "#d97706",
  },
};
const ROLE_PILL = {
  student: {
    bg: "#eff6ff",
    color: "#1d4ed8",
    darkBg: "rgba(59,130,246,0.15)",
    label: "Student",
  },
  trainer: {
    bg: "#fef3c7",
    color: "#92400e",
    darkBg: "rgba(245,158,11,0.15)",
    label: "Trainer",
  },
  admin: {
    bg: "#ede9fe",
    color: "#5b21b6",
    darkBg: "rgba(139,92,246,0.15)",
    label: "Admin",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED SMALL COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const Badge = ({ cfg }) => {
  const c = cfg || STATUS_CONFIG.inactive;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: 999,
        background: c.bg,
        color: c.color,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: c.dot,
          flexShrink: 0,
        }}
      />
      {c.label}
    </span>
  );
};

const StatMini = ({ value, label, color, dark }) => (
  <div
    style={{
      textAlign: "center",
      padding: "14px 18px",
      borderRadius: 10,
      background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc",
    }}
  >
    <div
      style={{
        fontSize: 26,
        fontWeight: 800,
        color: color || (dark ? "#f1f5f9" : "#0f172a"),
        lineHeight: 1,
      }}
    >
      {value ?? 0}
    </div>
    <div
      style={{
        fontSize: 11,
        color: dark ? "#64748b" : "#94a3b8",
        marginTop: 3,
      }}
    >
      {label}
    </div>
  </div>
);

const TabBtn = ({ label, active, count, onClick, dark }) => (
  <button
    onClick={onClick}
    style={{
      padding: "7px 14px",
      borderRadius: 7,
      fontSize: 12,
      fontWeight: 600,
      border: "none",
      cursor: "pointer",
      background: active
        ? "#6366f1"
        : dark
          ? "rgba(255,255,255,0.05)"
          : "#f1f5f9",
      color: active ? "#fff" : dark ? "#94a3b8" : "#64748b",
      transition: "all 0.15s",
      display: "flex",
      alignItems: "center",
      gap: 6,
    }}
  >
    {label}
    {count !== undefined && (
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          padding: "1px 6px",
          borderRadius: 99,
          background: active
            ? "rgba(255,255,255,0.25)"
            : dark
              ? "rgba(255,255,255,0.10)"
              : "#e5e7eb",
        }}
      >
        {count}
      </span>
    )}
  </button>
);

const MiniToggle = ({ checked, onChange, color = "#6366f1", size = "md" }) => {
  const w = size === "sm" ? 28 : 36;
  const h = size === "sm" ? 16 : 20;
  const dotSize = size === "sm" ? 10 : 14;
  const dotOff = size === "sm" ? 2 : 2;
  const dotOn = size === "sm" ? w - dotSize - 2 : w - dotSize - 3;
  return (
    <label
      style={{
        position: "relative",
        display: "inline-block",
        width: w,
        height: h,
        flexShrink: 0,
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ opacity: 0, width: 0, height: 0 }}
      />
      <span
        style={{
          position: "absolute",
          inset: 0,
          background: checked ? color : "#cbd5e1",
          borderRadius: h,
          transition: ".2s",
          boxShadow: checked ? `0 0 8px ${color}66` : "none",
        }}
      >
        <span
          style={{
            position: "absolute",
            height: dotSize,
            width: dotSize,
            left: checked ? dotOn : dotOff,
            top: (h - dotSize) / 2,
            background: "white",
            borderRadius: "50%",
            transition: ".2s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
          }}
        />
      </span>
    </label>
  );
};

const Spinner = ({ dark }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "52px 0",
      gap: 12,
    }}
  >
    <div
      style={{
        width: 28,
        height: 28,
        border: `3px solid ${dark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
        borderTop: "3px solid #6366f1",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
    />
    <span style={{ fontSize: 12, color: dark ? "#64748b" : "#94a3b8" }}>
      Loading…
    </span>
  </div>
);

const PersonRow = ({
  person,
  roleBadge,
  dark,
  divClr,
  txtMain,
  txtSub,
  onClick,
}) => {
  const [a, b] = avatarColor(person.displayName || person.email || "");
  const name = person.displayName || person.email || "—";
  return (
    <tr
      onClick={onClick}
      style={{
        borderBottom: `1px solid ${divClr}`,
        transition: "background 0.1s",
        cursor: onClick ? "pointer" : "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = dark
          ? "rgba(255,255,255,0.03)"
          : "#f8fafc";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      <td style={{ padding: "11px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              flexShrink: 0,
              background: `linear-gradient(135deg,${a},${b})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {initials(name)}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>
              {name}
            </div>
            <div style={{ fontSize: 11, color: txtSub }}>
              {person.email || "—"}
            </div>
          </div>
        </div>
      </td>
      <td style={{ padding: "11px 16px" }}>{roleBadge}</td>
      <td style={{ padding: "11px 16px", fontSize: 11, color: txtSub }}>
        {person.organizationId ? (
          <span style={{ fontFamily: "monospace", fontSize: 10 }}>
            {person.organizationId.slice(0, 8)}…
          </span>
        ) : (
          "—"
        )}
      </td>
      <td style={{ padding: "11px 16px", fontSize: 11, color: txtSub }}>
        {formatDate(person.createdAt)}
      </td>
      <td style={{ padding: "11px 16px" }}>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            background: "#eef2ff",
            color: "#4f46e5",
            border: "none",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick();
          }}
        >
          View details →
        </button>
      </td>
    </tr>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE CONTROLS — NEW FLAT-DTO VERSION (batch service only)
// KEY FIX: backend stores ONE FLAT { enabled, features } blob per org for the
// batch service only. This version never pretends other services have data.
// ─────────────────────────────────────────────────────────────────────────────

// Only batch service config is used here — find it once.
const BATCH_SVC = SERVICES_CONFIG.find((s) => s.key === "batch");

// All feature keys that exist for batch (trainer + student + admin), flattened.
function getAllBatchFeatureKeys() {
  return Object.values(BATCH_SVC.features)
    .flat()
    .map((f) => f.key);
}

// Build a default flat DTO: { enabled, features: { key: true, ... } }
function buildDefaultBatchDTO(enabled = true) {
  const features = {};
  getAllBatchFeatureKeys().forEach((k) => {
    features[k] = enabled;
  });
  return { enabled, features };
}

const COURSE_SVC = SERVICES_CONFIG.find((s) => s.key === "course");

function getAllCourseFeatureKeys() {
  return Object.values(COURSE_SVC.features)
    .flat()
    .map((f) => f.key);
}

function buildDefaultCourseDTO(enabled = true) {
  const features = {};
  getAllCourseFeatureKeys().forEach((k) => {
    features[k] = enabled;
  });
  return { enabled, features };
}

// ─── SERVICE FEATURE DRAWER — operates directly on the flat batch DTO ────────
const ServiceFeatureDrawer = ({
  dto, // flat { enabled, features }
  onToggleFeature, // (featureKey, val) => void
  onToggleService, // (val) => void  — master switch
  onClose,
  dark,
  onToast,
  onSave, // ← ADD
  saving, // ← ADD
  savedMsg,
}) => {
  const [activeRole, setActiveRole] = useState("trainer");
  const svc = BATCH_SVC;
  const svcEnabled = dto.enabled ?? true;

  const roles = Object.keys(svc.features).filter(
    (r) => (svc.features[r] || []).length > 0,
  );

  const countEnabled = (role) => {
    const feats = svc.features[role] || [];
    return feats.filter((f) => dto.features[f.key] !== false).length;
  };
  const totalForRole = (role) => (svc.features[role] || []).length;

  const txtMain = dark ? "#f1f5f9" : "#0f172a";
  const txtSub = dark ? "#64748b" : "#94a3b8";
  const cardBg = dark ? "#0f172a" : "#ffffff";
  const cardBdr = dark ? "rgba(255,255,255,0.08)" : "#e2e8f0";

  const handleRoleAll = (val) => {
    const feats = svc.features[activeRole] || [];
    feats.forEach((f) => {
      const current = dto.features[f.key] ?? true;
      if (current !== val) {
        onToggleFeature(f.key, val);
        onToast({
          serviceName: svc.label,
          featureName: f.label,
          enabled: val,
          color: svc.color,
        });
      }
    });
  };

  const totalKeys = getAllBatchFeatureKeys().length;
  const onKeys = getAllBatchFeatureKeys().filter(
    (k) => dto.features[k] !== false,
  ).length;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 8000,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(6px)",
        }}
      />
      <div
        style={{
          position: "relative",
          width: 480,
          height: "100%",
          background: cardBg,
          display: "flex",
          flexDirection: "column",
          boxShadow: `-20px 0 60px rgba(0,0,0,0.35), -4px 0 20px ${svc.color}30`,
          border: `1px solid ${cardBdr}`,
          animation: "drawerSlide 0.3s cubic-bezier(0.22,1,0.36,1)",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: svc.gradient,
            padding: "28px 24px 22px",
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                }}
              >
                {svc.icon}
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>
                  {svc.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.7)",
                    marginTop: 3,
                  }}
                >
                  {onKeys} / {totalKeys} features active
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "rgba(255,255,255,0.2)",
                border: "none",
                cursor: "pointer",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 18,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 12,
              padding: "10px 14px",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                Service master switch
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>
                Disabling blocks all batch features for all roles
              </div>
            </div>
            <MiniToggle
              checked={svcEnabled}
              onChange={(e) => {
                onToggleService(e.target.checked);
                onToast({
                  serviceName: svc.label,
                  featureName: "All features",
                  enabled: e.target.checked,
                  color: svc.color,
                });
              }}
              color="#fff"
            />
          </div>
          {/* Save button inside drawer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 12,
            }}
          >
            {savedMsg && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#bbf7d0",
                  background: "rgba(255,255,255,0.15)",
                  padding: "4px 12px",
                  borderRadius: 99,
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                ✓ {savedMsg}
              </span>
            )}
            <button
              onClick={onSave}
              disabled={saving}
              style={{
                fontSize: 12,
                padding: "8px 20px",
                border: "none",
                borderRadius: 10,
                background: saving
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(255,255,255,0.92)",
                cursor: saving ? "not-allowed" : "pointer",
                color: saving ? "rgba(255,255,255,0.5)" : svc.color,
                fontWeight: 700,
                boxShadow: saving ? "none" : "0 2px 8px rgba(0,0,0,0.2)",
                transition: "all 0.15s",
              }}
            >
              {saving ? "Saving…" : "💾 Save changes"}
            </button>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            {roles.map((role) => {
              const pill = ROLE_PILL[role];
              const on = countEnabled(role);
              const total = totalForRole(role);
              const isActive = activeRole === role;
              return (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  style={{
                    flex: 1,
                    padding: "7px 10px",
                    borderRadius: 9,
                    border: "none",
                    cursor: "pointer",
                    background: isActive
                      ? "rgba(255,255,255,0.92)"
                      : "rgba(255,255,255,0.15)",
                    color: isActive ? svc.color : "#fff",
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  {pill.label}
                  <span
                    style={{
                      display: "block",
                      fontSize: 10,
                      fontWeight: 400,
                      opacity: 0.75,
                      marginTop: 1,
                    }}
                  >
                    {on}/{total} on
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature list */}
        <div style={{ flex: 1, padding: "16px 20px", overflowY: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: txtSub,
              }}
            >
              {activeRole} features · {countEnabled(activeRole)}/
              {totalForRole(activeRole)} enabled
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => handleRoleAll(false)}
                style={{
                  fontSize: 10,
                  padding: "4px 10px",
                  border: `1px solid ${cardBdr}`,
                  borderRadius: 6,
                  background: "transparent",
                  cursor: "pointer",
                  color: txtSub,
                  fontWeight: 600,
                }}
              >
                All off
              </button>
              <button
                onClick={() => handleRoleAll(true)}
                style={{
                  fontSize: 10,
                  padding: "4px 10px",
                  border: `1px solid ${svc.color}`,
                  borderRadius: 6,
                  background: svc.colorLight,
                  cursor: "pointer",
                  color: svc.color,
                  fontWeight: 600,
                }}
              >
                All on
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {(svc.features[activeRole] || []).map((feat, idx) => {
              const isOn = dto.features[feat.key] ?? true;
              return (
                <div
                  key={feat.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 14px",
                    borderRadius: 11,
                    background: isOn
                      ? dark
                        ? svc.colorDark
                        : svc.colorLight + "80"
                      : dark
                        ? "rgba(255,255,255,0.02)"
                        : "#f8fafc",
                    border: `1px solid ${isOn ? svc.color + "30" : dark ? "rgba(255,255,255,0.06)" : "#f1f5f9"}`,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    onToggleFeature(feat.key, !isOn);
                    onToast({
                      serviceName: svc.label,
                      featureName: feat.label,
                      enabled: !isOn,
                      color: svc.color,
                    });
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 7,
                      background: isOn
                        ? svc.color
                        : dark
                          ? "rgba(255,255,255,0.08)"
                          : "#e5e7eb",
                      color: isOn ? "#fff" : txtSub,
                      fontSize: 10,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: isOn ? txtMain : txtSub,
                      }}
                    >
                      {feat.label}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: txtSub,
                        fontFamily: "monospace",
                        marginTop: 1,
                        opacity: 0.7,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {feat.endpoint}
                    </div>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <MiniToggle
                      checked={isOn}
                      onChange={(e) => {
                        onToggleFeature(feat.key, e.target.checked);
                        onToast({
                          serviceName: svc.label,
                          featureName: feat.label,
                          enabled: e.target.checked,
                          color: svc.color,
                        });
                      }}
                      color={svc.color}
                      size="sm"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── FEATURE CONTROLS TAB — only the batch card, flat DTO, correct persistence ─
// const FeatureControlsTab = ({ orgId, dark }) => {
//   // dto is the FLAT shape the backend actually returns: { enabled, features: {key: bool} }
//   const [dto, setDto] = useState(() => buildDefaultBatchDTO(true));
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [savedMsg, setSavedMsg] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [toasts, setToasts] = useState([]);
//   const toastCounterRef = useRef(0);

//   const cardBdr = dark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
//   const txtMain = dark ? "#f1f5f9" : "#0f172a";
//   const txtSub = dark ? "#64748b" : "#94a3b8";

//   const pushToast = useCallback(
//     ({ serviceName, featureName, enabled, color }) => {
//       const id = ++toastCounterRef.current;
//       setToasts((prev) => [
//         ...prev.slice(-3),
//         { id, serviceName, featureName, enabled, color },
//       ]);
//       setTimeout(
//         () => setToasts((prev) => prev.filter((t) => t.id !== id)),
//         3200,
//       );
//     },
//     [],
//   );

//   // ── LOAD: GET /feature-flags/org/:orgId returns the FLAT dto directly ──────
//   useEffect(() => {
//     if (!orgId) return;
//     setLoading(true);
//     getOrgFeatureFlags(orgId)
//       .then((data) => {
//         // data is already { enabled, features } — no per-service nesting exists.
//         if (data && typeof data === "object" && data.features) {
//           // Merge against defaults so any newly-added feature keys default to true
//           // instead of being missing/undefined.
//           const defaults = buildDefaultBatchDTO(true);
//           setDto({
//             enabled: data.enabled ?? true,
//             features: { ...defaults.features, ...data.features },
//           });
//         } else {
//           setDto(buildDefaultBatchDTO(true));
//         }
//       })
//       .catch(() => setDto(buildDefaultBatchDTO(true)))
//       .finally(() => setLoading(false));
//   }, [orgId]);

//   const handleToggleFeature = (featKey, val) => {
//     setDto((prev) => {
//       const newFeatures = { ...prev.features, [featKey]: val };
//       const anyOn = Object.values(newFeatures).some(Boolean);
//       return { enabled: anyOn, features: newFeatures };
//     });
//   };

//   const handleToggleService = (val) => {
//     setDto(buildDefaultBatchDTO(val));
//   };

//   const handleGlobalToggle = (val) => {
//     setDto(buildDefaultBatchDTO(val));
//     pushToast({
//       serviceName: "Batch service",
//       featureName: val ? "Everything" : "Everything",
//       enabled: val,
//       color: val ? "#10b981" : "#ef4444",
//     });
//   };

//   // ── SAVE: PUT /feature-flags/org/:orgId with the FLAT dto, exactly as-is ───
//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       await updateOrgFeatureFlags(orgId, dto);
//       setSavedMsg("Changes saved!");
//       setTimeout(() => setSavedMsg(""), 3000);
//     } catch (err) {
//       console.error("Failed to save feature flags", err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <Spinner dark={dark} />;

//   const svc = BATCH_SVC;
//   const totalKeys = getAllBatchFeatureKeys().length;
//   const onKeys = getAllBatchFeatureKeys().filter(
//     (k) => dto.features[k] !== false,
//   ).length;
//   const pct = totalKeys > 0 ? Math.round((onKeys / totalKeys) * 100) : 0;
//   const svcEnabled = dto.enabled ?? true;

//   return (
//     <>
//       <ToastContainer toasts={toasts} />

//       <div style={{ padding: "22px 22px 28px" }}>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "flex-start",
//             justifyContent: "space-between",
//             marginBottom: 22,
//             gap: 12,
//             flexWrap: "wrap",
//           }}
//         >
//           <div>
//             <div
//               style={{
//                 fontSize: 16,
//                 fontWeight: 800,
//                 color: txtMain,
//                 letterSpacing: "-0.02em",
//               }}
//             >
//               Batch service feature controls
//             </div>
//             <div style={{ fontSize: 12, color: txtSub, marginTop: 3 }}>
//               Disabling a feature blocks that API endpoint for every trainer,
//               student and admin in this organization. Only the batch service has
//               backend enforcement right now — other services are not shown here.
//             </div>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               gap: 7,
//               alignItems: "center",
//               flexWrap: "wrap",
//             }}
//           >
//             {savedMsg && (
//               <span
//                 style={{
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#16a34a",
//                   background: "#dcfce7",
//                   padding: "4px 12px",
//                   borderRadius: 99,
//                   border: "1px solid #bbf7d0",
//                 }}
//               >
//                 ✓ {savedMsg}
//               </span>
//             )}
//             <button
//               onClick={() => handleGlobalToggle(false)}
//               style={{
//                 fontSize: 11,
//                 padding: "6px 12px",
//                 border: `1px solid ${cardBdr}`,
//                 borderRadius: 8,
//                 background: dark ? "rgba(255,255,255,0.05)" : "#fff",
//                 cursor: "pointer",
//                 color: txtSub,
//                 fontWeight: 600,
//               }}
//             >
//               🚫 Disable all
//             </button>
//             <button
//               onClick={() => handleGlobalToggle(true)}
//               style={{
//                 fontSize: 11,
//                 padding: "6px 12px",
//                 border: `1px solid ${svc.color}`,
//                 borderRadius: 8,
//                 background: svc.colorLight,
//                 cursor: "pointer",
//                 color: svc.color,
//                 fontWeight: 600,
//               }}
//             >
//               ✅ Enable all
//             </button>
//             <button
//               onClick={handleSave}
//               disabled={saving}
//               style={{
//                 fontSize: 11,
//                 padding: "6px 16px",
//                 border: "none",
//                 borderRadius: 8,
//                 background: saving
//                   ? "#94a3b8"
//                   : "linear-gradient(135deg,#6366f1,#8b5cf6)",
//                 cursor: saving ? "not-allowed" : "pointer",
//                 color: "white",
//                 fontWeight: 700,
//               }}
//             >
//               {saving ? "Saving…" : "💾 Save changes"}
//             </button>
//           </div>
//         </div>

//         {/* ONLY the batch card — no loop over SERVICES_CONFIG */}
//         <div style={{ maxWidth: 260 }}>
//           <div
//             onClick={() => setDrawerOpen(true)}
//             style={{
//               background: svcEnabled
//                 ? dark
//                   ? svc.colorDark
//                   : svc.colorLight
//                 : dark
//                   ? "rgba(255,255,255,0.02)"
//                   : "#f8fafc",
//               border: `1.5px solid ${svcEnabled ? svc.color + "40" : dark ? "rgba(255,255,255,0.07)" : "#e5e7eb"}`,
//               borderRadius: 16,
//               padding: "18px 16px",
//               cursor: "pointer",
//               position: "relative",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 justifyContent: "space-between",
//                 marginBottom: 12,
//               }}
//             >
//               <div
//                 style={{
//                   width: 40,
//                   height: 40,
//                   borderRadius: 12,
//                   background: svcEnabled
//                     ? svc.gradient
//                     : dark
//                       ? "rgba(255,255,255,0.08)"
//                       : "#e5e7eb",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: 20,
//                 }}
//               >
//                 {svc.icon}
//               </div>
//               <div onClick={(e) => e.stopPropagation()}>
//                 <MiniToggle
//                   checked={svcEnabled}
//                   onChange={(e) => {
//                     handleToggleService(e.target.checked);
//                     pushToast({
//                       serviceName: svc.label,
//                       featureName: "All features",
//                       enabled: e.target.checked,
//                       color: svc.color,
//                     });
//                   }}
//                   color={svc.color}
//                   size="sm"
//                 />
//               </div>
//             </div>
//             <div
//               style={{
//                 fontSize: 13,
//                 fontWeight: 700,
//                 color: svcEnabled ? txtMain : txtSub,
//                 marginBottom: 4,
//               }}
//             >
//               {svc.label}
//             </div>
//             <div style={{ fontSize: 10, color: txtSub, marginBottom: 10 }}>
//               {onKeys}/{totalKeys} features on
//             </div>
//             <div
//               style={{
//                 height: 4,
//                 borderRadius: 2,
//                 background: dark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
//                 overflow: "hidden",
//               }}
//             >
//               <div
//                 style={{
//                   height: "100%",
//                   width: `${pct}%`,
//                   background: svcEnabled ? svc.gradient : "#94a3b8",
//                   borderRadius: 2,
//                 }}
//               />
//             </div>
//             <div
//               style={{
//                 marginTop: 10,
//                 fontSize: 10,
//                 color: svc.color,
//                 fontWeight: 600,
//               }}
//             >
//               Click to manage per-role →
//             </div>
//           </div>
//         </div>
//       </div>

//       {drawerOpen && (
//         <ServiceFeatureDrawer
//           dto={dto}
//           onToggleFeature={handleToggleFeature}
//           onToggleService={handleToggleService}
//           onClose={() => setDrawerOpen(false)}
//           dark={dark}
//           onToast={pushToast}
//           onSave={handleSave} // ← ADD
//           saving={saving} // ← ADD
//           savedMsg={savedMsg}
//         />
//       )}
//     </>
//   );
// };

const FeatureControlsTab = ({ orgId, dark }) => {
  // ── BATCH state ────────────────────────────────────────────────────────────
  const [batchDto, setBatchDto] = useState(() => buildDefaultBatchDTO(true));
  const [batchLoading, setBatchLoading] = useState(true);
  const [batchSaving, setBatchSaving] = useState(false);
  const [batchSavedMsg, setBatchSavedMsg] = useState("");
  const [batchDrawerOpen, setBatchDrawerOpen] = useState(false);

  // ── COURSE state ────────────────────────────────────────────────────────────
  const [courseDto, setCourseDto] = useState(() => buildDefaultCourseDTO(true));
  const [courseLoading, setCourseLoading] = useState(true);
  const [courseSaving, setCourseSaving] = useState(false);
  const [courseSavedMsg, setCourseSavedMsg] = useState("");
  const [courseDrawerOpen, setCourseDrawerOpen] = useState(false);

  const [toasts, setToasts] = useState([]);
  const toastCounterRef = useRef(0);

  const txtMain = dark ? "#f1f5f9" : "#0f172a";
  const txtSub = dark ? "#64748b" : "#94a3b8";

  const pushToast = useCallback(
    ({ serviceName, featureName, enabled, color }) => {
      const id = ++toastCounterRef.current;
      setToasts((prev) => [
        ...prev.slice(-3),
        { id, serviceName, featureName, enabled, color },
      ]);
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        3200,
      );
    },
    [],
  );

  // ── Load BATCH flags ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!orgId) return;
    setBatchLoading(true);
    getOrgFeatureFlags(orgId)
      .then((data) => {
        if (data && typeof data === "object" && data.features) {
          const defaults = buildDefaultBatchDTO(true);
          setBatchDto({
            enabled: data.enabled ?? true,
            features: { ...defaults.features, ...data.features },
          });
        } else {
          setBatchDto(buildDefaultBatchDTO(true));
        }
      })
      .catch(() => setBatchDto(buildDefaultBatchDTO(true)))
      .finally(() => setBatchLoading(false));
  }, [orgId]);

  // ── Load COURSE flags ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!orgId) return;
    setCourseLoading(true);
    courseService
      .getCourseFeatureFlags(orgId)
      .then((res) => {
        const data = res.data;
        if (data && typeof data === "object" && data.features) {
          const defaults = buildDefaultCourseDTO(true);
          setCourseDto({
            enabled: data.enabled ?? true,
            features: { ...defaults.features, ...data.features },
          });
        } else {
          setCourseDto(buildDefaultCourseDTO(true));
        }
      })
      .catch(() => setCourseDto(buildDefaultCourseDTO(true)))
      .finally(() => setCourseLoading(false));
  }, [orgId]);

  // ── BATCH handlers ──────────────────────────────────────────────────────────
  const handleBatchToggleFeature = (featKey, val) => {
    setBatchDto((prev) => {
      const newFeatures = { ...prev.features, [featKey]: val };
      return {
        enabled: Object.values(newFeatures).some(Boolean),
        features: newFeatures,
      };
    });
  };
  const handleBatchToggleService = (val) =>
    setBatchDto(buildDefaultBatchDTO(val));
  const handleBatchSave = async () => {
    setBatchSaving(true);
    try {
      await updateOrgFeatureFlags(orgId, batchDto);
      setBatchSavedMsg("Changes saved!");
      setTimeout(() => setBatchSavedMsg(""), 3000);
    } catch (err) {
      console.error("Failed to save batch feature flags", err);
    } finally {
      setBatchSaving(false);
    }
  };

  // ── COURSE handlers ─────────────────────────────────────────────────────────
  const handleCourseToggleFeature = (featKey, val) => {
    setCourseDto((prev) => {
      const newFeatures = { ...prev.features, [featKey]: val };
      return {
        enabled: Object.values(newFeatures).some(Boolean),
        features: newFeatures,
      };
    });
  };
  const handleCourseToggleService = (val) =>
    setCourseDto(buildDefaultCourseDTO(val));
  const handleCourseSave = async () => {
    setCourseSaving(true);
    try {
      await courseService.updateCourseFeatureFlags(orgId, courseDto);
      setCourseSavedMsg("Changes saved!");
      setTimeout(() => setCourseSavedMsg(""), 3000);
    } catch (err) {
      console.error("Failed to save course feature flags", err);
    } finally {
      setCourseSaving(false);
    }
  };

  if (batchLoading && courseLoading) return <Spinner dark={dark} />;

  // ── Batch card values ───────────────────────────────────────────────────────
  const batchSvc = BATCH_SVC;
  const batchTotalKeys = getAllBatchFeatureKeys().length;
  const batchOnKeys = getAllBatchFeatureKeys().filter(
    (k) => batchDto.features[k] !== false,
  ).length;
  const batchPct =
    batchTotalKeys > 0 ? Math.round((batchOnKeys / batchTotalKeys) * 100) : 0;
  const batchEnabled = batchDto.enabled ?? true;

  // ── Course card values ──────────────────────────────────────────────────────
  const courseSvc = COURSE_SVC;
  const courseTotalKeys = getAllCourseFeatureKeys().length;
  const courseOnKeys = getAllCourseFeatureKeys().filter(
    (k) => courseDto.features[k] !== false,
  ).length;
  const coursePct =
    courseTotalKeys > 0
      ? Math.round((courseOnKeys / courseTotalKeys) * 100)
      : 0;
  const courseEnabled = courseDto.enabled ?? true;

  // Reusable card renderer — renders one service card
  const ServiceCard = ({
    svc,
    dto,
    onKeys,
    totalKeys,
    pct,
    svcEnabled,
    onToggleService,
    onDrawerOpen,
    loading,
  }) => (
    <div
      onClick={onDrawerOpen}
      style={{
        background: svcEnabled
          ? dark
            ? svc.colorDark
            : svc.colorLight
          : dark
            ? "rgba(255,255,255,0.02)"
            : "#f8fafc",
        border: `1.5px solid ${svcEnabled ? svc.color + "40" : dark ? "rgba(255,255,255,0.07)" : "#e5e7eb"}`,
        borderRadius: 16,
        padding: "18px 16px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        flex: 1,
        minWidth: 220,
        maxWidth: 260,
        opacity: loading ? 0.6 : 1,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: svcEnabled
              ? svc.gradient
              : dark
                ? "rgba(255,255,255,0.08)"
                : "#e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          {svc.icon}
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <MiniToggle
            checked={svcEnabled}
            onChange={(e) => onToggleService(e.target.checked)}
            color={svc.color}
            size="sm"
          />
        </div>
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: svcEnabled ? txtMain : txtSub,
          marginBottom: 4,
        }}
      >
        {svc.label}
      </div>
      <div style={{ fontSize: 10, color: txtSub, marginBottom: 10 }}>
        {onKeys}/{totalKeys} features on
      </div>
      <div
        style={{
          height: 4,
          borderRadius: 2,
          background: dark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: svcEnabled ? svc.gradient : "#94a3b8",
            borderRadius: 2,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 10,
          color: svc.color,
          fontWeight: 600,
        }}
      >
        Click to manage per-role →
      </div>
    </div>
  );

  return (
    <>
      <ToastContainer toasts={toasts} />

      <div style={{ padding: "22px 22px 28px" }}>
        {/* Header — description only, NO global save/enable/disable buttons */}
        <div style={{ marginBottom: 22 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: txtMain,
              letterSpacing: "-0.02em",
            }}
          >
            Feature controls
          </div>
          <div style={{ fontSize: 12, color: txtSub, marginTop: 3 }}>
            Disabling a feature blocks that API endpoint for every trainer,
            student and admin in this organization. Each service has its own
            Save button inside its drawer.
          </div>
        </div>

        {/* Cards row — Batch + Course side by side */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <ServiceCard
            svc={batchSvc}
            dto={batchDto}
            onKeys={batchOnKeys}
            totalKeys={batchTotalKeys}
            pct={batchPct}
            svcEnabled={batchEnabled}
            onToggleService={(val) => {
              handleBatchToggleService(val);
              pushToast({
                serviceName: batchSvc.label,
                featureName: "All features",
                enabled: val,
                color: batchSvc.color,
              });
            }}
            onDrawerOpen={() => setBatchDrawerOpen(true)}
            loading={batchLoading}
          />

          <ServiceCard
            svc={courseSvc}
            dto={courseDto}
            onKeys={courseOnKeys}
            totalKeys={courseTotalKeys}
            pct={coursePct}
            svcEnabled={courseEnabled}
            onToggleService={(val) => {
              handleCourseToggleService(val);
              pushToast({
                serviceName: courseSvc.label,
                featureName: "All features",
                enabled: val,
                color: courseSvc.color,
              });
            }}
            onDrawerOpen={() => setCourseDrawerOpen(true)}
            loading={courseLoading}
          />
        </div>
      </div>

      {/* BATCH drawer — reuses existing ServiceFeatureDrawer unchanged */}
      {batchDrawerOpen && (
        <ServiceFeatureDrawer
          dto={batchDto}
          onToggleFeature={handleBatchToggleFeature}
          onToggleService={handleBatchToggleService}
          onClose={() => setBatchDrawerOpen(false)}
          dark={dark}
          onToast={pushToast}
          onSave={handleBatchSave}
          saving={batchSaving}
          savedMsg={batchSavedMsg}
        />
      )}

      {/* COURSE drawer — uses the new CourseServiceDrawer below */}
      {courseDrawerOpen && (
        <CourseServiceDrawer
          dto={courseDto}
          onToggleFeature={handleCourseToggleFeature}
          onToggleService={handleCourseToggleService}
          onClose={() => setCourseDrawerOpen(false)}
          dark={dark}
          onToast={pushToast}
          onSave={handleCourseSave}
          saving={courseSaving}
          savedMsg={courseSavedMsg}
        />
      )}
    </>
  );
};

const CourseServiceDrawer = ({
  dto,
  onToggleFeature,
  onToggleService,
  onClose,
  dark,
  onToast,
  onSave,
  saving,
  savedMsg,
}) => {
  const [activeRole, setActiveRole] = useState("trainer");
  const svc = COURSE_SVC;
  const svcEnabled = dto.enabled ?? true;

  const roles = Object.keys(svc.features).filter(
    (r) => (svc.features[r] || []).length > 0,
  );

  const countEnabled = (role) =>
    (svc.features[role] || []).filter((f) => dto.features[f.key] !== false)
      .length;
  const totalForRole = (role) => (svc.features[role] || []).length;

  const txtMain = dark ? "#f1f5f9" : "#0f172a";
  const txtSub = dark ? "#64748b" : "#94a3b8";
  const cardBg = dark ? "#0f172a" : "#ffffff";
  const cardBdr = dark ? "rgba(255,255,255,0.08)" : "#e2e8f0";

  const totalKeys = getAllCourseFeatureKeys().length;
  const onKeys = getAllCourseFeatureKeys().filter(
    (k) => dto.features[k] !== false,
  ).length;

  const handleRoleAll = (val) => {
    (svc.features[activeRole] || []).forEach((f) => {
      if ((dto.features[f.key] ?? true) !== val) {
        onToggleFeature(f.key, val);
        onToast({
          serviceName: svc.label,
          featureName: f.label,
          enabled: val,
          color: svc.color,
        });
      }
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 8000,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(6px)",
        }}
      />
      <div
        style={{
          position: "relative",
          width: 480,
          height: "100%",
          background: cardBg,
          display: "flex",
          flexDirection: "column",
          boxShadow: `-20px 0 60px rgba(0,0,0,0.35), -4px 0 20px ${svc.color}30`,
          border: `1px solid ${cardBdr}`,
          animation: "drawerSlide 0.3s cubic-bezier(0.22,1,0.36,1)",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: svc.gradient,
            padding: "28px 24px 22px",
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                }}
              >
                {svc.icon}
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>
                  {svc.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.7)",
                    marginTop: 3,
                  }}
                >
                  {onKeys} / {totalKeys} features active
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "rgba(255,255,255,0.2)",
                border: "none",
                cursor: "pointer",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>
          {/* Master switch */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 18,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 12,
              padding: "10px 14px",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                Service master switch
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>
                Disabling blocks all course features for all roles
              </div>
            </div>
            <MiniToggle
              checked={svcEnabled}
              onChange={(e) => {
                onToggleService(e.target.checked);
                onToast({
                  serviceName: svc.label,
                  featureName: "All features",
                  enabled: e.target.checked,
                  color: svc.color,
                });
              }}
              color="#fff"
            />
          </div>
          {/* Save button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 12,
            }}
          >
            {savedMsg && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#bbf7d0",
                  background: "rgba(255,255,255,0.15)",
                  padding: "4px 12px",
                  borderRadius: 99,
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                ✓ {savedMsg}
              </span>
            )}
            <button
              onClick={onSave}
              disabled={saving}
              style={{
                fontSize: 12,
                padding: "8px 20px",
                border: "none",
                borderRadius: 10,
                background: saving
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(255,255,255,0.92)",
                cursor: saving ? "not-allowed" : "pointer",
                color: saving ? "rgba(255,255,255,0.5)" : svc.color,
                fontWeight: 700,
                transition: "all 0.15s",
              }}
            >
              {saving ? "Saving…" : "💾 Save changes"}
            </button>
          </div>
          {/* Role tabs */}
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            {roles.map((role) => {
              const pill = ROLE_PILL[role];
              const isActive = activeRole === role;
              return (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  style={{
                    flex: 1,
                    padding: "7px 10px",
                    borderRadius: 9,
                    border: "none",
                    cursor: "pointer",
                    background: isActive
                      ? "rgba(255,255,255,0.92)"
                      : "rgba(255,255,255,0.15)",
                    color: isActive ? svc.color : "#fff",
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  {pill.label}
                  <span
                    style={{
                      display: "block",
                      fontSize: 10,
                      fontWeight: 400,
                      opacity: 0.75,
                      marginTop: 1,
                    }}
                  >
                    {countEnabled(role)}/{totalForRole(role)} on
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        {/* Feature list */}
        <div style={{ flex: 1, padding: "16px 20px", overflowY: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: txtSub,
              }}
            >
              {activeRole} features · {countEnabled(activeRole)}/
              {totalForRole(activeRole)} enabled
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => handleRoleAll(false)}
                style={{
                  fontSize: 10,
                  padding: "4px 10px",
                  border: `1px solid ${cardBdr}`,
                  borderRadius: 6,
                  background: "transparent",
                  cursor: "pointer",
                  color: txtSub,
                  fontWeight: 600,
                }}
              >
                All off
              </button>
              <button
                onClick={() => handleRoleAll(true)}
                style={{
                  fontSize: 10,
                  padding: "4px 10px",
                  border: `1px solid ${svc.color}`,
                  borderRadius: 6,
                  background: svc.colorLight,
                  cursor: "pointer",
                  color: svc.color,
                  fontWeight: 600,
                }}
              >
                All on
              </button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {(svc.features[activeRole] || []).map((feat, idx) => {
              const isOn = dto.features[feat.key] ?? true;
              return (
                <div
                  key={feat.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 14px",
                    borderRadius: 11,
                    background: isOn
                      ? dark
                        ? svc.colorDark
                        : svc.colorLight + "80"
                      : dark
                        ? "rgba(255,255,255,0.02)"
                        : "#f8fafc",
                    border: `1px solid ${isOn ? svc.color + "30" : dark ? "rgba(255,255,255,0.06)" : "#f1f5f9"}`,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    onToggleFeature(feat.key, !isOn);
                    onToast({
                      serviceName: svc.label,
                      featureName: feat.label,
                      enabled: !isOn,
                      color: svc.color,
                    });
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 7,
                      background: isOn
                        ? svc.color
                        : dark
                          ? "rgba(255,255,255,0.08)"
                          : "#e5e7eb",
                      color: isOn ? "#fff" : txtSub,
                      fontSize: 10,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: isOn ? txtMain : txtSub,
                      }}
                    >
                      {feat.label}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: txtSub,
                        fontFamily: "monospace",
                        marginTop: 1,
                        opacity: 0.7,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {feat.endpoint}
                    </div>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <MiniToggle
                      checked={isOn}
                      onChange={(e) => {
                        onToggleFeature(feat.key, e.target.checked);
                        onToast({
                          serviceName: svc.label,
                          featureName: feat.label,
                          enabled: e.target.checked,
                          color: svc.color,
                        });
                      }}
                      color={svc.color}
                      size="sm"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// USER PERMISSIONS DRAWER
// ─────────────────────────────────────────────────────────────────────────────
const UserPermissionsDrawer = ({ user, roleHint, orgId, dark, onClose }) => {
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setPL] = useState(false);
  const [profileError, setPE] = useState(null);
  const [flags, setFlags] = useState(null);
  const [flagsLoading, setFL] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [permTab, setPermTab] = useState("profile");
  const [activeSvc, setActiveSvc] = useState(null);
  const [toasts, setToasts] = useState([]);
  const toastCounterRef = useRef(0);

  const accentGrad =
    roleHint === "TRAINER"
      ? "linear-gradient(135deg,#7c3aed,#6366f1)"
      : "linear-gradient(135deg,#0d9488,#14b8a6)";
  const accentColor = roleHint === "TRAINER" ? "#7c3aed" : "#0d9488";
  const txtMain = dark ? "#f1f5f9" : "#0f172a";
  const txtSub = dark ? "#64748b" : "#94a3b8";
  const divClr = dark ? "rgba(255,255,255,0.06)" : "#f1f5f9";
  const cardBg = dark ? "#111827" : "#ffffff";
  const cardBdr = dark ? "rgba(255,255,255,0.08)" : "#e2e8f0";

  const pushToast = useCallback(
    ({ serviceName, featureName, enabled, color }) => {
      const id = ++toastCounterRef.current;
      setToasts((prev) => [
        ...prev.slice(-3),
        { id, serviceName, featureName, enabled, color },
      ]);
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        3200,
      );
    },
    [],
  );

  useEffect(() => {
    if (!user?.email) return;
    setPL(true);
    setPE(null);
    const fetch =
      roleHint === "TRAINER"
        ? userService.getTrainerProfileByEmail(user.email)
        : userService.getStudentProfileByEmail(user.email);
    fetch
      .then((res) => setProfileData(res.data || {}))
      .catch(() => setPE("Could not load profile."))
      .finally(() => setPL(false));
  }, [user?.email, roleHint]);

  useEffect(() => {
    if (!orgId) return;
    setFL(true);
    getOrgFeatureFlags(orgId)
      .catch(() => null)
      .then((data) => {
        console.log("=== USER FEATURE FLAGS DEBUG ===");
        console.log("USER ID:", user.id);
        console.log("RAW API RESPONSE:", JSON.stringify(data, null, 2));
        console.log("DATA TYPE:", typeof data);
        console.log("DATA KEYS:", data ? Object.keys(data) : "null/empty");

        let parsed = data;
        if (typeof data === "string") {
          try {
            parsed = JSON.parse(data);
            console.log("PARSED FROM STRING:", JSON.stringify(parsed, null, 2));
          } catch (e) {
            console.log("FAILED TO PARSE STRING:", e);
            parsed = null;
          }
        }

        if (parsed && typeof parsed === "object") {
          if (parsed.flagsJson) {
            try {
              parsed =
                typeof parsed.flagsJson === "string"
                  ? JSON.parse(parsed.flagsJson)
                  : parsed.flagsJson;
              console.log(
                "UNWRAPPED flagsJson:",
                JSON.stringify(parsed, null, 2),
              );
            } catch (e) {
              console.log("FAILED TO PARSE flagsJson:", e);
              parsed = null;
            }
          } else if (parsed.data) {
            parsed = parsed.data;
            console.log("UNWRAPPED .data:", JSON.stringify(parsed, null, 2));
          }
        }

        if (
          parsed &&
          typeof parsed === "object" &&
          Object.keys(parsed).length > 0
        ) {
          const defaults = buildDefaultFlags(true);
          const merged = {};

          Object.keys(defaults).forEach((svcKey) => {
            merged[svcKey] = {
              enabled: parsed[svcKey]?.enabled ?? defaults[svcKey].enabled,
              features: {
                ...defaults[svcKey].features,
                ...(parsed[svcKey]?.features || {}),
              },
            };
          });

          console.log("FINAL MERGED FLAGS:", JSON.stringify(merged, null, 2));
          setFlags(merged);
        } else {
          console.log("FALLING BACK TO DEFAULTS — parsed was empty or invalid");
          setFlags(buildDefaultFlags(true));
        }
      })
      .catch((err) => {
        console.log("ERROR FETCHING USER FLAGS:", err);
        setFlags(buildDefaultFlags(true));
      })
      .finally(() => setFL(false));
  }, [orgId]);

  const handleToggleFeature = (svcKey, featKey, val) => {
    setFlags((prev) => {
      const svcFlags = prev[svcKey] || { enabled: true, features: {} };
      const newFeatures = { ...svcFlags.features, [featKey]: val };
      const anyOn = Object.values(newFeatures).some(Boolean);
      return { ...prev, [svcKey]: { enabled: anyOn, features: newFeatures } };
    });
  };

  const handleToggleService = (svcKey, val) => {
    setFlags((prev) => {
      const allFeats = {};
      Object.values(
        SERVICES_CONFIG.find((s) => s.key === svcKey)?.features || {},
      )
        .flat()
        .forEach((f) => {
          allFeats[f.key] = val;
        });
      return {
        ...prev,
        [svcKey]: {
          enabled: val,
          features: { ...prev[svcKey]?.features, ...allFeats },
        },
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateOrgFeatureFlags(orgId, flags);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save user flags", err);
    } finally {
      setSaving(false);
    }
  };

  const [avA, avB] = avatarColor(user?.displayName || user?.email || "");
  const displayName = user?.displayName || user?.email || "—";
  const userRoleKey = roleHint === "TRAINER" ? "trainer" : "student";

  // UserPermissionsDrawer uses its own local ServiceFeatureDrawer-like nested drawer
  // via activeSvc — it still uses the old multi-service flags shape internally.
  // The nested drawer here is the OLD inline version kept as-is to avoid breaking changes.
  const NestedServiceDrawer =
    activeSvc && flags
      ? () => {
          const svc = activeSvc;
          const [nestedRole, setNestedRole] = useState("trainer");
          const svcFlags = flags[svc.key] || { enabled: true, features: {} };
          const svcEnabled = svcFlags.enabled ?? true;
          const roles = Object.keys(svc.features).filter(
            (r) => (svc.features[r] || []).length > 0,
          );
          const countEnabled = (role) => {
            const feats = svc.features[role] || [];
            return feats.filter((f) => svcFlags.features[f.key]).length;
          };
          const totalForRole = (role) => (svc.features[role] || []).length;
          const nestedCardBg = dark ? "#0f172a" : "#ffffff";
          const nestedCardBdr = dark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
          const handleRoleAll = (val) => {
            const feats = svc.features[nestedRole] || [];
            feats.forEach((f) => {
              const current = svcFlags.features[f.key] ?? true;
              if (current !== val) {
                handleToggleFeature(svc.key, f.key, val);
                pushToast({
                  serviceName: svc.label,
                  featureName: f.label,
                  enabled: val,
                  color: svc.color,
                });
              }
            });
          };
          return (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9500,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div
                onClick={() => setActiveSvc(null)}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.55)",
                  backdropFilter: "blur(6px)",
                }}
              />
              <div
                style={{
                  position: "relative",
                  width: 480,
                  height: "100%",
                  background: nestedCardBg,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: `-20px 0 60px rgba(0,0,0,0.35), -4px 0 20px ${svc.color}30`,
                  border: `1px solid ${nestedCardBdr}`,
                  animation: "drawerSlide 0.3s cubic-bezier(0.22,1,0.36,1)",
                  overflowY: "auto",
                }}
              >
                <div
                  style={{
                    background: svc.gradient,
                    padding: "28px 24px 22px",
                    flexShrink: 0,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: -30,
                      right: -30,
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.08)",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 14 }}
                    >
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 16,
                          background: "rgba(255,255,255,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 24,
                        }}
                      >
                        {svc.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: "#fff",
                          }}
                        >
                          {svc.label}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.7)",
                            marginTop: 3,
                          }}
                        >
                          {
                            Object.values(svc.features)
                              .flat()
                              .filter((f) => svcFlags.features[f.key] !== false)
                              .length
                          }{" "}
                          / {Object.values(svc.features).flat().length} features
                          active
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveSvc(null)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.2)",
                        border: "none",
                        cursor: "pointer",
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 18,
                      background: "rgba(255,255,255,0.12)",
                      borderRadius: 12,
                      padding: "10px 14px",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    <div>
                      <div
                        style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}
                      >
                        Service master switch
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.65)",
                        }}
                      >
                        Disabling blocks all features for all roles
                      </div>
                    </div>
                    <MiniToggle
                      checked={svcEnabled}
                      onChange={(e) => {
                        handleToggleService(svc.key, e.target.checked);
                        pushToast({
                          serviceName: svc.label,
                          featureName: "All features",
                          enabled: e.target.checked,
                          color: svc.color,
                        });
                      }}
                      color="#fff"
                    />
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
                    {roles.map((role) => {
                      const pill = ROLE_PILL[role];
                      const on = countEnabled(role);
                      const total = totalForRole(role);
                      const isActive = nestedRole === role;
                      return (
                        <button
                          key={role}
                          onClick={() => setNestedRole(role)}
                          style={{
                            flex: 1,
                            padding: "7px 10px",
                            borderRadius: 9,
                            border: "none",
                            cursor: "pointer",
                            background: isActive
                              ? "rgba(255,255,255,0.92)"
                              : "rgba(255,255,255,0.15)",
                            color: isActive ? svc.color : "#fff",
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          {pill.label}
                          <span
                            style={{
                              display: "block",
                              fontSize: 10,
                              fontWeight: 400,
                              opacity: 0.75,
                              marginTop: 1,
                            }}
                          >
                            {on}/{total} on
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div
                  style={{ flex: 1, padding: "16px 20px", overflowY: "auto" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: txtSub,
                      }}
                    >
                      {nestedRole} features · {countEnabled(nestedRole)}/
                      {totalForRole(nestedRole)} enabled
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => handleRoleAll(false)}
                        style={{
                          fontSize: 10,
                          padding: "4px 10px",
                          border: `1px solid ${nestedCardBdr}`,
                          borderRadius: 6,
                          background: "transparent",
                          cursor: "pointer",
                          color: txtSub,
                          fontWeight: 600,
                        }}
                      >
                        All off
                      </button>
                      <button
                        onClick={() => handleRoleAll(true)}
                        style={{
                          fontSize: 10,
                          padding: "4px 10px",
                          border: `1px solid ${svc.color}`,
                          borderRadius: 6,
                          background: svc.colorLight,
                          cursor: "pointer",
                          color: svc.color,
                          fontWeight: 600,
                        }}
                      >
                        All on
                      </button>
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    {(svc.features[nestedRole] || []).map((feat, idx) => {
                      const isOn = svcFlags.features[feat.key] ?? true;
                      return (
                        <div
                          key={feat.key}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "11px 14px",
                            borderRadius: 11,
                            background: isOn
                              ? dark
                                ? svc.colorDark
                                : svc.colorLight + "80"
                              : dark
                                ? "rgba(255,255,255,0.02)"
                                : "#f8fafc",
                            border: `1px solid ${isOn ? svc.color + "30" : dark ? "rgba(255,255,255,0.06)" : "#f1f5f9"}`,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            handleToggleFeature(svc.key, feat.key, !isOn);
                            pushToast({
                              serviceName: svc.label,
                              featureName: feat.label,
                              enabled: !isOn,
                              color: svc.color,
                            });
                          }}
                        >
                          <div
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 7,
                              background: isOn
                                ? svc.color
                                : dark
                                  ? "rgba(255,255,255,0.08)"
                                  : "#e5e7eb",
                              color: isOn ? "#fff" : txtSub,
                              fontSize: 10,
                              fontWeight: 800,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {idx + 1}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: isOn ? txtMain : txtSub,
                              }}
                            >
                              {feat.label}
                            </div>
                            <div
                              style={{
                                fontSize: 10,
                                color: txtSub,
                                fontFamily: "monospace",
                                marginTop: 1,
                                opacity: 0.7,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {feat.endpoint}
                            </div>
                          </div>
                          <div onClick={(e) => e.stopPropagation()}>
                            <MiniToggle
                              checked={isOn}
                              onChange={(e) => {
                                handleToggleFeature(
                                  svc.key,
                                  feat.key,
                                  e.target.checked,
                                );
                                pushToast({
                                  serviceName: svc.label,
                                  featureName: feat.label,
                                  enabled: e.target.checked,
                                  color: svc.color,
                                });
                              }}
                              color={svc.color}
                              size="sm"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        }
      : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <ToastContainer toasts={toasts} />
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        }}
      />

      <div
        style={{
          position: "relative",
          width: 420,
          height: "100%",
          background: cardBg,
          border: `1px solid ${cardBdr}`,
          boxShadow: `-12px 0 48px rgba(0,0,0,0.3)`,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          animation: "drawerSlide 0.28s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: accentGrad,
            padding: "22px 20px 18px",
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `linear-gradient(135deg,${avA},${avB})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 800,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                {initials(displayName)}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
                  {displayName}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.65)",
                    marginTop: 2,
                  }}
                >
                  {roleHint === "TRAINER" ? "Trainer" : "Student"} ·{" "}
                  {user?.email}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "rgba(255,255,255,0.18)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            {[
              ["profile", "👤 Profile"],
              ["permissions", "🔐 Permissions"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPermTab(key)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 600,
                  background:
                    permTab === key
                      ? "rgba(255,255,255,0.92)"
                      : "rgba(255,255,255,0.18)",
                  color: permTab === key ? accentColor : "#fff",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 20, flex: 1 }}>
          {permTab === "profile" && (
            <>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: txtSub,
                  marginBottom: 10,
                }}
              >
                Basic Info
              </div>
              {[
                { label: "Email", value: user?.email },
                {
                  label: "Role",
                  value: roleHint === "TRAINER" ? "Trainer" : "Student",
                },
                {
                  label: "Org ID",
                  value: user?.organizationId
                    ? user.organizationId.slice(0, 12) + "…"
                    : "—",
                },
                { label: "Joined", value: formatDate(user?.createdAt) },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: `1px solid ${divClr}`,
                  }}
                >
                  <span style={{ fontSize: 12, color: txtSub }}>{label}</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: txtMain,
                      maxWidth: 200,
                      textAlign: "right",
                      wordBreak: "break-all",
                    }}
                  >
                    {value || "—"}
                  </span>
                </div>
              ))}
              {profileLoading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "20px 0",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      border: `2px solid ${dark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
                      borderTop: `2px solid ${accentColor}`,
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                </div>
              )}
              {profileError && (
                <div
                  style={{ fontSize: 12, color: "#ef4444", padding: "12px 0" }}
                >
                  {profileError}
                </div>
              )}
              {!profileLoading && !profileError && profileData && (
                <div style={{ marginTop: 16 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: txtSub,
                      marginBottom: 10,
                    }}
                  >
                    {roleHint === "TRAINER" ? "Trainer" : "Student"} Profile
                  </div>
                  {Object.entries(profileData)
                    .filter(
                      ([k]) =>
                        ![
                          "id",
                          "userId",
                          "email",
                          "createdAt",
                          "updatedAt",
                        ].includes(k),
                    )
                    .slice(0, 12)
                    .map(([key, value]) => (
                      <div
                        key={key}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "7px 0",
                          borderBottom: `1px solid ${divClr}`,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: txtSub,
                            textTransform: "capitalize",
                          }}
                        >
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: txtMain,
                            maxWidth: 190,
                            textAlign: "right",
                            wordBreak: "break-all",
                          }}
                        >
                          {Array.isArray(value)
                            ? value.join(", ")
                            : value?.toString() || "—"}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}

          {permTab === "permissions" && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 700, color: txtMain }}
                  >
                    Feature permissions
                  </div>
                  <div style={{ fontSize: 11, color: txtSub, marginTop: 2 }}>
                    Override access for this{" "}
                    {roleHint === "TRAINER" ? "trainer" : "student"}.
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving || flagsLoading}
                  style={{
                    padding: "5px 16px",
                    border: "none",
                    borderRadius: 8,
                    background: accentColor,
                    color: "white",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    opacity: saving || flagsLoading ? 0.6 : 1,
                  }}
                >
                  {saving ? "Saving…" : saved ? "✓ Saved" : "Save"}
                </button>
              </div>

              {flagsLoading ? (
                <Spinner dark={dark} />
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  {SERVICES_CONFIG.map((svc) => {
                    const roleFeats = svc.features[userRoleKey] || [];
                    if (roleFeats.length === 0) return null;
                    const svcFlags = flags?.[svc.key] || {
                      enabled: true,
                      features: {},
                    };
                    const svcEnabled = svcFlags.enabled ?? true;
                    const onCount = roleFeats.filter(
                      (f) => svcFlags.features?.[f.key] !== false,
                    ).length;

                    return (
                      <div
                        key={svc.key}
                        onClick={() => setActiveSvc(svc)}
                        style={{
                          border: `1.5px solid ${svcEnabled ? svc.color + "40" : dark ? "rgba(255,255,255,0.07)" : "#e5e7eb"}`,
                          borderRadius: 12,
                          padding: "12px 12px 10px",
                          cursor: "pointer",
                          background: svcEnabled
                            ? dark
                              ? svc.colorDark
                              : svc.colorLight
                            : dark
                              ? "rgba(255,255,255,0.02)"
                              : "#f8fafc",
                          transition: "all 0.15s",
                          boxShadow: svcEnabled
                            ? `0 2px 12px ${svc.glow}25`
                            : "none",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 7,
                          }}
                        >
                          <span style={{ fontSize: 18 }}>{svc.icon}</span>
                          <div onClick={(e) => e.stopPropagation()}>
                            <MiniToggle
                              checked={svcEnabled}
                              onChange={(e) => {
                                handleToggleService(svc.key, e.target.checked);
                                pushToast({
                                  serviceName: svc.label,
                                  featureName: "All features",
                                  enabled: e.target.checked,
                                  color: svc.color,
                                });
                              }}
                              color={svc.color}
                              size="sm"
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: svcEnabled ? txtMain : txtSub,
                          }}
                        >
                          {svc.label}
                        </div>
                        <div
                          style={{ fontSize: 10, color: txtSub, marginTop: 2 }}
                        >
                          {onCount}/{roleFeats.length} on
                        </div>
                        <div
                          style={{
                            marginTop: 7,
                            height: 3,
                            borderRadius: 2,
                            background: dark
                              ? "rgba(255,255,255,0.08)"
                              : "#e2e8f0",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${roleFeats.length > 0 ? (onCount / roleFeats.length) * 100 : 0}%`,
                              background: svcEnabled ? svc.gradient : "#94a3b8",
                              borderRadius: 2,
                              transition: "width 0.3s",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Nested service feature drawer for user permissions */}
      {NestedServiceDrawer && <NestedServiceDrawer />}
    </div>
  );
};

//──── COMPONENT 1: BatchStudentsList ────

const BatchStudentsList = ({
  batch,
  dark,
  txtMain,
  txtSub,
  divClr,
  rowHover,
}) => {
  const [studentMap, setStudentMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!batch?.id) return;
    setLoading(true);
    setError(null);
    getTrainerStudents(batch.id)
      .then((data) => setStudentMap(data || {}))
      .catch(() => setError("Failed to load students."))
      .finally(() => setLoading(false));
  }, [batch?.id]);

  const allStudents = Object.entries(studentMap).flatMap(
    ([trainer, students]) =>
      (Array.isArray(students) ? students : [])
        .filter((s) => s && s !== "__EMPTY__")
        .map((s) => ({ email: s, trainerEmail: trainer })),
  );

  return (
    <div
      style={{
        border: `1.5px solid ${dark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "12px 18px",
          borderBottom: `1px solid ${divClr}`,
          background: dark ? "rgba(255,255,255,0.02)" : "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15 }}>🎓</span>
          <div style={{ fontSize: 13, fontWeight: 700, color: txtMain }}>
            Students
          </div>
        </div>
        {!loading && !error && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "2px 10px",
              borderRadius: 99,
              background: dark ? "rgba(20,184,166,0.15)" : "#f0fdfa",
              color: "#0d9488",
            }}
          >
            {allStudents.length} enrolled
          </span>
        )}
      </div>

      {loading && <Spinner dark={dark} />}

      {error && (
        <div style={{ padding: "20px 18px", fontSize: 12, color: "#ef4444" }}>
          {error}
        </div>
      )}

      {!loading && !error && allStudents.length === 0 && (
        <div
          style={{ padding: "32px 18px", textAlign: "center", color: txtSub }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>👤</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>
            No students enrolled
          </div>
          <div style={{ fontSize: 12, color: txtSub, marginTop: 3 }}>
            No students have been assigned to this batch yet.
          </div>
        </div>
      )}

      {!loading && !error && allStudents.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc",
                }}
              >
                {["STUDENT", "TRAINER"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "9px 16px",
                      textAlign: "left",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: txtSub,
                      borderBottom: `1px solid ${divClr}`,
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allStudents.map((s, i) => {
                const [a, b] = avatarColor(s.email);
                return (
                  <tr
                    key={i}
                    style={{ borderBottom: `1px solid ${divClr}` }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = rowHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td style={{ padding: "11px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            flexShrink: 0,
                            background: `linear-gradient(135deg,${a},${b})`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {s.email[0].toUpperCase()}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: txtMain,
                          }}
                        >
                          {s.email}
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "11px 16px",
                        fontSize: 12,
                        color: txtSub,
                      }}
                    >
                      👤 {s.trainerEmail}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

//──── COMPONENT 2: BatchesTab ────

const BatchesTab = ({ orgId, dark }) => {
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState("departments");
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const txtMain = dark ? "#f1f5f9" : "#0f172a";
  const txtSub = dark ? "#64748b" : "#94a3b8";
  const divClr = dark ? "rgba(255,255,255,0.07)" : "#f1f5f9";
  const rowHover = dark ? "rgba(255,255,255,0.04)" : "#f8fafc";
  const thBg = dark ? "rgba(255,255,255,0.04)" : "#f8fafc";

  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    setError(null);
    Promise.all([
      getDepartmentsByOrg(orgId),
      getBranchesByOrg(orgId),
      getBatchesByOrg(orgId),
    ])
      .then(([depts, brs, bats]) => {
        setDepartments(Array.isArray(depts) ? depts : []);
        setBranches(Array.isArray(brs) ? brs : []);
        setBatches(Array.isArray(bats) ? bats : []);
      })
      .catch(() => setError("Failed to load batch structure."))
      .finally(() => setLoading(false));
  }, [orgId]);

  const deptBranches = branches.filter(
    (br) => br.departmentId === selectedDept?.id,
  );
  const branchBatches = batches.filter(
    (b) => b.branchId === selectedBranch?.id,
  );

  const breadcrumbs = [
    {
      label: "Departments",
      onClick: () => {
        setStep("departments");
        setSelectedDept(null);
        setSelectedBranch(null);
        setSelectedBatch(null);
      },
    },
    selectedDept && {
      label: selectedDept.name,
      onClick: () => {
        setStep("branches");
        setSelectedBranch(null);
        setSelectedBatch(null);
      },
    },
    selectedBranch && {
      label: selectedBranch.name,
      onClick: () => {
        setStep("batches");
        setSelectedBatch(null);
      },
    },
    selectedBatch && { label: selectedBatch.batchName, onClick: () => {} },
  ].filter(Boolean);

  const tableHeader = (cols) => (
    <tr style={{ background: thBg }}>
      {cols.map((c) => (
        <th
          key={c}
          style={{
            padding: "10px 16px",
            textAlign: "left",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: txtSub,
            borderBottom: `1px solid ${divClr}`,
            textTransform: "uppercase",
          }}
        >
          {c}
        </th>
      ))}
    </tr>
  );

  const rowStyle = {
    borderBottom: `1px solid ${divClr}`,
    cursor: "pointer",
    transition: "background 0.1s",
  };

  const counts = {
    departments: `${departments.length} department${departments.length !== 1 ? "s" : ""}`,
    branches: `${deptBranches.length} branch${deptBranches.length !== 1 ? "es" : ""} in ${selectedDept?.name || ""}`,
    batches: `${branchBatches.length} batch${branchBatches.length !== 1 ? "es" : ""} in ${selectedBranch?.name || ""}`,
    detail: selectedBatch?.batchName || "",
  };

  const renderHeader = () => (
    <div
      style={{
        padding: "14px 18px",
        borderBottom: `1px solid ${divClr}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        {breadcrumbs.map((bc, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: txtSub, fontSize: 13 }}>›</span>}
            <button
              onClick={bc.onClick}
              style={{
                background: "none",
                border: "none",
                cursor: i < breadcrumbs.length - 1 ? "pointer" : "default",
                fontSize: 13,
                fontWeight: i === breadcrumbs.length - 1 ? 700 : 600,
                color: i === breadcrumbs.length - 1 ? txtMain : "#6366f1",
                padding: 0,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {bc.label}
            </button>
          </React.Fragment>
        ))}
      </div>
      <div style={{ fontSize: 12, color: txtSub }}>{counts[step]}</div>
    </div>
  );

  if (loading) return <Spinner dark={dark} />;
  if (error)
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          color: "#ef4444",
          fontSize: 13,
        }}
      >
        {error}
      </div>
    );

  // STEP 1 — DEPARTMENTS
  if (step === "departments") {
    if (departments.length === 0)
      return (
        <>
          {renderHeader()}
          <div
            style={{ padding: "52px 0", textAlign: "center", color: txtSub }}
          >
            <div style={{ fontSize: 32, marginBottom: 10 }}>🏢</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>
              No departments yet
            </div>
            <div style={{ fontSize: 12, color: txtSub, marginTop: 4 }}>
              This organization has no departments.
            </div>
          </div>
        </>
      );
    return (
      <>
        {renderHeader()}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>{tableHeader(["DEPARTMENT", "HEAD", "BRANCHES", ""])}</thead>
            <tbody>
              {departments.map((dept) => {
                const branchCount = branches.filter(
                  (b) => b.departmentId === dept.id,
                ).length;
                const [a, b2] = avatarColor(dept.name || "");
                return (
                  <tr
                    key={dept.id}
                    style={rowStyle}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = rowHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onClick={() => {
                      setSelectedDept(dept);
                      setStep("branches");
                    }}
                  >
                    <td style={{ padding: "13px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            flexShrink: 0,
                            background: `linear-gradient(135deg,${a},${b2})`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          {(dept.name || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: txtMain,
                            }}
                          >
                            {dept.name || "—"}
                          </div>
                          <div style={{ fontSize: 11, color: txtSub }}>
                            ID: {dept.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 12,
                        color: txtSub,
                      }}
                    >
                      {dept.head || (
                        <span style={{ fontStyle: "italic" }}>Not set</span>
                      )}
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 99,
                          background: dark
                            ? "rgba(99,102,241,0.15)"
                            : "#eef2ff",
                          color: "#6366f1",
                        }}
                      >
                        {branchCount}{" "}
                        {branchCount === 1 ? "branch" : "branches"}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px", textAlign: "right" }}>
                      <button
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "5px 12px",
                          borderRadius: 7,
                          background: "#eef2ff",
                          color: "#4f46e5",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        View branches →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  // STEP 2 — BRANCHES
  if (step === "branches") {
    if (deptBranches.length === 0)
      return (
        <>
          {renderHeader()}
          <div
            style={{ padding: "52px 0", textAlign: "center", color: txtSub }}
          >
            <div style={{ fontSize: 32, marginBottom: 10 }}>🌿</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>
              No branches yet
            </div>
            <div style={{ fontSize: 12, color: txtSub, marginTop: 4 }}>
              {selectedDept?.name} has no branches.
            </div>
          </div>
        </>
      );
    return (
      <>
        {renderHeader()}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>{tableHeader(["BRANCH", "CITY", "BATCHES", ""])}</thead>
            <tbody>
              {deptBranches.map((branch) => {
                const batchCount = batches.filter(
                  (b) => b.branchId === branch.id,
                ).length;
                const [a, b2] = avatarColor(branch.name || "");
                return (
                  <tr
                    key={branch.id}
                    style={rowStyle}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = rowHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onClick={() => {
                      setSelectedBranch(branch);
                      setStep("batches");
                    }}
                  >
                    <td style={{ padding: "13px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            flexShrink: 0,
                            background: `linear-gradient(135deg,${a},${b2})`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          {(branch.name || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: txtMain,
                            }}
                          >
                            {branch.name || "—"}
                          </div>
                          <div style={{ fontSize: 11, color: txtSub }}>
                            Dept: {selectedDept?.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 12,
                        color: txtSub,
                      }}
                    >
                      {branch.city ? (
                        <span>📍 {branch.city}</span>
                      ) : (
                        <span style={{ fontStyle: "italic" }}>Not set</span>
                      )}
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 99,
                          background: dark
                            ? "rgba(20,184,166,0.15)"
                            : "#f0fdfa",
                          color: "#0d9488",
                        }}
                      >
                        {batchCount} {batchCount === 1 ? "batch" : "batches"}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px", textAlign: "right" }}>
                      <button
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "5px 12px",
                          borderRadius: 7,
                          background: "#f0fdfa",
                          color: "#0d9488",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        View batches →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  // STEP 3 — BATCHES
  if (step === "batches") {
    if (branchBatches.length === 0)
      return (
        <>
          {renderHeader()}
          <div
            style={{ padding: "52px 0", textAlign: "center", color: txtSub }}
          >
            <div style={{ fontSize: 32, marginBottom: 10 }}>👥</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>
              No batches yet
            </div>
            <div style={{ fontSize: 12, color: txtSub, marginTop: 4 }}>
              {selectedBranch?.name} has no batches.
            </div>
          </div>
        </>
      );
    return (
      <>
        {renderHeader()}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              {tableHeader(["BATCH", "CODE", "TRAINER", "STATUS", ""])}
            </thead>
            <tbody>
              {branchBatches.map((batch) => {
                const [a, b2] = avatarColor(batch.batchName || "");
                return (
                  <tr
                    key={batch.id}
                    style={rowStyle}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = rowHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onClick={() => {
                      setSelectedBatch(batch);
                      setStep("detail");
                    }}
                  >
                    <td style={{ padding: "13px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            flexShrink: 0,
                            background: `linear-gradient(135deg,${a},${b2})`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          {(batch.batchName || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: txtMain,
                            }}
                          >
                            {batch.batchName || "—"}
                          </div>
                          <div style={{ fontSize: 11, color: txtSub }}>
                            ID: {batch.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      {batch.batchCode ? (
                        <span
                          style={{
                            fontSize: 11,
                            fontFamily: "monospace",
                            background: dark
                              ? "rgba(255,255,255,0.08)"
                              : "#f1f5f9",
                            color: txtSub,
                            padding: "3px 8px",
                            borderRadius: 5,
                          }}
                        >
                          {batch.batchCode}
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: txtSub }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 12 }}>
                      {batch.trainerEmail ? (
                        <span style={{ color: txtMain, fontWeight: 500 }}>
                          👤 {batch.trainerEmail}
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 99,
                            background: dark
                              ? "rgba(239,68,68,0.12)"
                              : "#fee2e2",
                            color: "#dc2626",
                          }}
                        >
                          No trainer assigned
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "3px 9px",
                          borderRadius: 99,
                          background: batch.active
                            ? dark
                              ? "rgba(16,185,129,0.15)"
                              : "#dcfce7"
                            : dark
                              ? "rgba(255,255,255,0.05)"
                              : "#f1f5f9",
                          color: batch.active ? "#16a34a" : txtSub,
                        }}
                      >
                        {batch.active ? "● Active" : "○ Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px", textAlign: "right" }}>
                      <button
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "5px 12px",
                          borderRadius: 7,
                          background: dark
                            ? "rgba(245,158,11,0.15)"
                            : "#fef3c7",
                          color: "#d97706",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        View details →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  // STEP 4 — BATCH DETAIL
  if (step === "detail" && selectedBatch) {
    return (
      <>
        {renderHeader()}
        <div style={{ padding: "20px 20px 28px" }}>
          <div
            style={{
              border: `1.5px solid ${dark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                background: selectedBatch.active
                  ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                  : dark
                    ? "rgba(255,255,255,0.05)"
                    : "#f1f5f9",
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  color: selectedBatch.active ? "#fff" : txtSub,
                }}
              >
                👥
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: selectedBatch.active ? "#fff" : txtMain,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {selectedBatch.batchName}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: selectedBatch.active
                      ? "rgba(255,255,255,0.7)"
                      : txtSub,
                    marginTop: 3,
                  }}
                >
                  {selectedBranch?.name} · {selectedDept?.name}
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: 99,
                  background: selectedBatch.active
                    ? "rgba(255,255,255,0.2)"
                    : dark
                      ? "rgba(255,255,255,0.07)"
                      : "#e5e7eb",
                  color: selectedBatch.active ? "#fff" : txtSub,
                }}
              >
                {selectedBatch.active ? "● Active" : "○ Inactive"}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                borderTop: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "#f1f5f9"}`,
              }}
            >
              {[
                {
                  label: "Batch Code",
                  value: selectedBatch.batchCode || "—",
                  mono: true,
                },
                { label: "Branch", value: selectedBranch?.name || "—" },
                { label: "Department", value: selectedDept?.name || "—" },
              ].map(({ label, value, mono }) => (
                <div
                  key={label}
                  style={{
                    padding: "14px 18px",
                    borderRight: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "#f1f5f9"}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: txtSub,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: 4,
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: txtMain,
                      fontFamily: mono ? "monospace" : "inherit",
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              border: `1.5px solid ${dark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "#f1f5f9"}`,
                background: dark ? "rgba(255,255,255,0.02)" : "#f8fafc",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 15 }}>🎓</span>
              <div style={{ fontSize: 13, fontWeight: 700, color: txtMain }}>
                Assigned Trainer
              </div>
            </div>
            {selectedBatch.trainerEmail ? (
              <div
                style={{
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {(() => {
                  const [a, b2] = avatarColor(selectedBatch.trainerEmail);
                  return (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        flexShrink: 0,
                        background: `linear-gradient(135deg,${a},${b2})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {selectedBatch.trainerEmail[0].toUpperCase()}
                    </div>
                  );
                })()}
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: txtMain }}
                  >
                    {selectedBatch.trainerEmail}
                  </div>
                  <div style={{ fontSize: 11, color: txtSub, marginTop: 2 }}>
                    Trainer
                  </div>
                </div>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 99,
                    background: dark
                      ? "rgba(139,92,246,0.15)"
                      : "rgba(139,92,246,0.1)",
                    color: "#7c3aed",
                  }}
                >
                  Trainer
                </span>
              </div>
            ) : (
              <div
                style={{
                  padding: "24px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 20 }}>⚠️</span>
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: "#d97706" }}
                  >
                    No trainer assigned
                  </div>
                  <div style={{ fontSize: 11, color: txtSub, marginTop: 2 }}>
                    Assign a trainer to this batch from the admin panel.
                  </div>
                </div>
              </div>
            )}
          </div>

          <BatchStudentsList
            batch={selectedBatch}
            dark={dark}
            txtMain={txtMain}
            txtSub={txtSub}
            divClr={divClr}
            rowHover={rowHover}
          />
        </div>
      </>
    );
  }

  return null;
};

// ─── COURSES TAB ──────────────────────────────────────────────
const CoursesTab = ({ orgId, dark, onLoad }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const txtMain = dark ? "#f1f5f9" : "#0f172a";
  const txtSub = dark ? "#64748b" : "#94a3b8";
  const divClr = dark ? "rgba(255,255,255,0.06)" : "#f1f5f9";
  const rowHover = dark ? "rgba(255,255,255,0.04)" : "#f8fafc";

  const CAT_COLORS = [
    {
      bg: "rgba(99,102,241,.10)",
      color: "#6366f1",
      bd: "rgba(99,102,241,.25)",
    },
    {
      bg: "rgba(20,184,166,.10)",
      color: "#14b8a6",
      bd: "rgba(20,184,166,.25)",
    },
    {
      bg: "rgba(245,158,11,.10)",
      color: "#f59e0b",
      bd: "rgba(245,158,11,.25)",
    },
    {
      bg: "rgba(236,72,153,.10)",
      color: "#ec4899",
      bd: "rgba(236,72,153,.25)",
    },
    {
      bg: "rgba(16,185,129,.10)",
      color: "#10b981",
      bd: "rgba(16,185,129,.25)",
    },
  ];
  const catColor = (val) =>
    CAT_COLORS[(String(val)?.charCodeAt(0) ?? 0) % CAT_COLORS.length];

  const GRAD_BG = [
    "linear-gradient(135deg,#6d28d9,#4338ca)",
    "linear-gradient(135deg,#0891b2,#0e7490)",
    "linear-gradient(135deg,#be123c,#9f1239)",
    "linear-gradient(135deg,#b45309,#92400e)",
    "linear-gradient(135deg,#047857,#065f46)",
  ];
  const gradBg = (val) =>
    GRAD_BG[(String(val)?.charCodeAt(0) ?? 0) % GRAD_BG.length];

  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    courseService
      .getCoursesByOrgId(orgId)
      // .then((res) => setCourses(res.data || []))
      .then((res) => {
        const data = res.data || [];
        setCourses(data);
        onLoad?.(data.length);
      })
      .catch((err) => console.error("Failed to load org courses", err))
      .finally(() => setLoading(false));
  }, [orgId]);

  const filtered = courses.filter(
    (c) =>
      (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.ownerEmail || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.category || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* Header row */}
      <div
        style={{
          padding: "14px 18px",
          borderBottom: `1px solid ${divClr}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>
            Courses
          </div>
          <div style={{ fontSize: 12, color: txtSub }}>
            {loading
              ? "Loading…"
              : `${filtered.length} course${filtered.length !== 1 ? "s" : ""} in this organization`}
          </div>
        </div>
        {/* search */}
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 13,
              color: txtSub,
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses…"
            style={{
              paddingLeft: 32,
              paddingRight: 12,
              paddingTop: 7,
              paddingBottom: 7,
              borderRadius: 9,
              border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
              background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc",
              color: txtMain,
              fontSize: 12,
              outline: "none",
              width: 220,
              fontFamily: "Inter, sans-serif",
            }}
          />
        </div>
      </div>

      {/* Skeleton */}
      {loading &&
        [1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 18px",
              borderBottom: `1px solid ${divClr}`,
              animation: "pulse 1.4s ease-in-out infinite",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: dark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
                }}
              />
              <div>
                <div
                  style={{
                    width: 150,
                    height: 10,
                    borderRadius: 5,
                    background: dark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
                    marginBottom: 7,
                  }}
                />
                <div
                  style={{
                    width: 100,
                    height: 8,
                    borderRadius: 5,
                    background: dark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                width: 70,
                height: 22,
                borderRadius: 20,
                background: dark ? "rgba(255,255,255,0.06)" : "#e2e8f0",
              }}
            />
          </div>
        ))}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div style={{ padding: "52px 0", textAlign: "center", color: txtSub }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>📚</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>
            No courses found
          </div>
          <div style={{ fontSize: 12, color: txtSub, marginTop: 4 }}>
            Trainers in this organization haven't created any courses yet.
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc",
                }}
              >
                {["#", "COURSE", "CATEGORY", "TRAINER", "BATCH", "STATUS"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 16px",
                        textAlign: "left",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: txtSub,
                        borderBottom: `1px solid ${divClr}`,
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const cc = catColor(c.category);
                return (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: `1px solid ${divClr}`,
                      transition: "background .1s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = rowHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{ fontSize: 12, fontWeight: 700, color: txtSub }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 9,
                            flexShrink: 0,
                            background: gradBg(c.title),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span style={{ fontSize: 14 }}>📖</span>
                        </div>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: txtMain,
                          }}
                        >
                          {c.title || "—"}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "3px 9px",
                          borderRadius: 7,
                          fontSize: 11,
                          fontWeight: 700,
                          background: cc.bg,
                          color: cc.color,
                          border: `1px solid ${cc.bd}`,
                        }}
                      >
                        🏷 {c.category || "—"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 12,
                        color: txtSub,
                      }}
                    >
                      ✉️ {c.ownerEmail || "—"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: "monospace",
                          background: dark
                            ? "rgba(255,255,255,0.06)"
                            : "#f1f5f9",
                          color: txtSub,
                          padding: "3px 8px",
                          borderRadius: 5,
                        }}
                      >
                        #{c.batchId}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "3px 9px",
                          borderRadius: 7,
                          fontSize: 11,
                          fontWeight: 700,
                          background: "rgba(16,185,129,.10)",
                          border: "1px solid rgba(16,185,129,.20)",
                          color: "#10b981",
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: "#10b981",
                            display: "inline-block",
                          }}
                        />
                        Published
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const OrganizationDetailsPage = ({ defaultTab }) => {
  const { orgId } = useParams();
  const navigate = useNavigate();

  let dark = false;
  try {
    const theme = useTheme();
    dark = theme?.dark ?? false;
  } catch {
    dark = false;
  }

  const [activeTab, setActiveTab] = useState(defaultTab || "trainers");
  const [org, setOrg] = useState(null);
  const [users, setUsers] = useState([]);
  const [capacity, setCapacity] = useState(null);
  const [orgLoading, setOrgLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [orgError, setOrgError] = useState(null);
  const [usersError, setUsersError] = useState(null);
  const [drawerUser, setDrawerUser] = useState(null);
  const [drawerRole, setDrawerRole] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [batches, setBatches] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState(null);

  useEffect(() => {
    if (!orgId) return;
    setOrgLoading(true);
    authService
      .getOrganizationById(orgId)
      .then((data) => {
        setOrg(data);
        setOrgLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setOrgError("Failed to load organization.");
        setOrgLoading(false);
      });
  }, [orgId]);

  useEffect(() => {
    if (!orgId) return;
    authService
      .getOrgCapacity?.(orgId)
      .then(setCapacity)
      .catch(() => {});
  }, [orgId]);

  useEffect(() => {
    if (!orgId) return;
    setUsersLoading(true);
    userService
      .getUsersByOrg(orgId)
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setUsersLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setUsersError("Failed to load users.");
        setUsersLoading(false);
      });
  }, [orgId]);

  const trainers = users.filter((u) =>
    u.roles?.toUpperCase().includes("TRAINER"),
  );
  const students = users.filter((u) =>
    u.roles?.toUpperCase().includes("STUDENT"),
  );

  useEffect(() => {
    if (!orgId) return;
    setBatchLoading(true);
    setBatchError(null);
    Promise.all([
      getDepartmentsByOrg(orgId),
      getBranchesByOrg(orgId),
      getBatchesByOrg(orgId),
    ])
      .then(([depts, brs, bats]) => {
        setDepartments(depts || []);
        setBranches(brs || []);
        setBatches(bats || []);
      })
      .catch(() => setBatchError("Failed to load batch structure."))
      .finally(() => setBatchLoading(false));
  }, [orgId, activeTab]);

  const cardBg = dark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const cardBdr = dark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const thBg = dark ? "rgba(255,255,255,0.04)" : "#f8fafc";
  const thColor = dark ? "#64748b" : "#94a3b8";
  const txtMain = dark ? "#f1f5f9" : "#0f172a";
  const txtSub = dark ? "#64748b" : "#94a3b8";
  const divClr = dark ? "rgba(255,255,255,0.06)" : "#f1f5f9";

  const tabs = [
    { key: "trainers", label: "Trainers", count: trainers.length },
    { key: "students", label: "Students", count: students.length },
    { key: "batches", label: "Batch Sessions", count: batches.length },
    { key: "courses", label: "Courses", count: undefined },
    { key: "features", label: "Feature controls", count: undefined },
  ];

  const renderTableHeaders = (headers) => (
    <tr style={{ background: thBg }}>
      {headers.map((h) => (
        <th
          key={h}
          style={{
            padding: "10px 16px",
            textAlign: "left",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: thColor,
            borderBottom: `1px solid ${divClr}`,
          }}
        >
          {h}
        </th>
      ))}
    </tr>
  );

  const renderUsersTable = (list, roleHint, emptyMsg) => {
    if (usersLoading) return <Spinner dark={dark} />;
    if (usersError)
      return (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "#ef4444",
            fontSize: 13,
          }}
        >
          {usersError}
        </div>
      );
    return (
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            {renderTableHeaders(["USER", "ROLE", "ORG ID", "JOINED", "ACTION"])}
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "40px 0",
                    color: txtSub,
                    fontSize: 13,
                  }}
                >
                  {emptyMsg}
                </td>
              </tr>
            ) : (
              list.map((person) => (
                <PersonRow
                  key={person.id}
                  person={person}
                  onClick={() => {
                    setDrawerUser(person);
                    setDrawerRole(roleHint);
                  }}
                  roleBadge={
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 99,
                        background:
                          roleHint === "TRAINER"
                            ? "rgba(139,92,246,0.12)"
                            : "rgba(20,184,166,0.12)",
                        color: roleHint === "TRAINER" ? "#7c3aed" : "#0d9488",
                      }}
                    >
                      {roleHint === "TRAINER" ? "Trainer" : "Student"}
                    </span>
                  }
                  dark={dark}
                  divClr={divClr}
                  txtMain={txtMain}
                  txtSub={txtSub}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  if (orgLoading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: 12,
          fontFamily: "Inter, sans-serif",
        }}
      >
        <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes drawerSlide{from{transform:translateX(100%)}to{transform:translateX(0)}} @keyframes toastIn{from{transform:translateX(60px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
        <div
          style={{
            width: 32,
            height: 32,
            border: "3px solid #e2e8f0",
            borderTop: "3px solid #6366f1",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <span style={{ fontSize: 13, color: "#94a3b8" }}>
          Loading organization…
        </span>
      </div>
    );

  if (orgError || !org)
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          color: txtSub,
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏢</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: txtMain }}>
          Organization Not Found
        </div>
        <div style={{ fontSize: 13, marginTop: 6 }}>
          {orgError || "The organization you're looking for doesn't exist."}
        </div>
        <button
          onClick={() => navigate("/superadmin/organizations")}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            borderRadius: 8,
            background: "#6366f1",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          Back to Organizations
        </button>
      </div>
    );

  const orgName = org.name || "—";
  const orgStatus = (org.status || "active").toLowerCase();
  const orgPlan = (org.plan || "trial").toLowerCase();
  const [a, b] = avatarColor(orgName);
  const statusCfg = STATUS_CONFIG[orgStatus] || STATUS_CONFIG.inactive;
  const planCfg = PLAN_CONFIG[orgPlan] || PLAN_CONFIG.trial;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes drawerSlide { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes toastIn { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          color: txtSub,
        }}
      >
        <span
          onClick={() => navigate("/superadmin/organizations")}
          style={{ cursor: "pointer", color: "#6366f1", fontWeight: 600 }}
        >
          Organizations
        </span>
        <span>›</span>
        <span style={{ color: txtMain, fontWeight: 600 }}>{orgName}</span>
      </div>

      {/* Org Header Card */}
      <div
        style={{
          background: cardBg,
          border: `1px solid ${cardBdr}`,
          borderRadius: 14,
          padding: "24px 28px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              flexShrink: 0,
              background: `linear-gradient(135deg,${a},${b})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            {initials(orgName)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: txtMain,
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                {orgName}
              </h1>
              <Badge cfg={statusCfg} />
              <Badge cfg={planCfg} />
            </div>
            <div
              style={{
                display: "flex",
                gap: 20,
                marginTop: 8,
                flexWrap: "wrap",
              }}
            >
              {org.email && (
                <span style={{ fontSize: 12, color: txtSub }}>
                  ✉️ {org.email}
                </span>
              )}
              {org.managerName && (
                <span style={{ fontSize: 12, color: txtSub }}>
                  👤 {org.managerName}
                </span>
              )}
              {org.managerEmail && (
                <span style={{ fontSize: 12, color: txtSub }}>
                  📧 {org.managerEmail}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
              <span style={{ fontSize: 11, color: txtSub }}>
                Created {formatDate(org.createdAt)}
              </span>
              {org.updatedAt && (
                <span style={{ fontSize: 11, color: txtSub }}>
                  Updated {formatDate(org.updatedAt)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 10,
            marginTop: 20,
          }}
        >
          <StatMini
            value={`${trainers.length}${capacity?.maxTrainers != null ? ` / ${capacity.maxTrainers}` : ""}`}
            label="Trainers"
            color={
              capacity?.maxTrainers != null &&
              trainers.length >= capacity.maxTrainers
                ? "#ef4444"
                : "#8b5cf6"
            }
            dark={dark}
          />
          <StatMini
            value={`${students.length}${capacity?.maxStudents != null ? ` / ${capacity.maxStudents}` : ""}`}
            label="Students"
            color={
              capacity?.maxStudents != null &&
              students.length >= capacity.maxStudents
                ? "#ef4444"
                : "#14b8a6"
            }
            dark={dark}
          />
          <StatMini
            value={batches.length}
            label="Batches"
            color="#3b82f6"
            dark={dark}
          />
          <StatMini
            value={users.length}
            label="Total Users"
            color="#6366f1"
            dark={dark}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <TabBtn
            key={tab.key}
            label={tab.label}
            count={tab.count}
            active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            dark={dark}
          />
        ))}
      </div>

      {/* Tab Content */}
      <div
        style={{
          background: cardBg,
          border: `1px solid ${cardBdr}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {activeTab === "trainers" && (
          <>
            <div
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${divClr}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>
                Trainers
              </div>
              <div style={{ fontSize: 12, color: txtSub }}>
                {trainers.length} total · click a row to view permissions
              </div>
            </div>
            {renderUsersTable(
              trainers,
              "TRAINER",
              "No trainers found for this organization",
            )}
          </>
        )}

        {activeTab === "students" && (
          <>
            <div
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${divClr}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>
                Students
              </div>
              <div style={{ fontSize: 12, color: txtSub }}>
                {students.length} total · click a row to view permissions
              </div>
            </div>
            {renderUsersTable(
              students,
              "STUDENT",
              "No students found for this organization",
            )}
          </>
        )}

        {activeTab === "batches" && <BatchesTab orgId={orgId} dark={dark} />}
        {/* {activeTab === "courses" && <CoursesTab orgId={orgId} dark={dark} />} */}
        {activeTab === "courses" && (
          <CoursesTab
            orgId={orgId}
            dark={dark}
            onLoad={(count) => {
              setTabs((prev) =>
                prev.map((t) => (t.key === "courses" ? { ...t, count } : t)),
              );
            }}
          />
        )}
        {activeTab === "features" && (
          <FeatureControlsTab orgId={orgId} dark={dark} />
        )}
      </div>

      {drawerUser && (
        <UserPermissionsDrawer
          user={drawerUser}
          roleHint={drawerRole}
          orgId={orgId}
          dark={dark}
          onClose={() => {
            setDrawerUser(null);
            setDrawerRole(null);
          }}
        />
      )}
    </div>
  );
};

export default OrganizationDetailsPage;
