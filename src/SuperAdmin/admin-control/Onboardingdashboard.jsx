import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
  Crown,
  CheckCircle,
  XCircle,
  User,
  Building2,
  ShieldCheck,
  CreditCard,
  Settings,
  BadgeCheck,
  ChevronRight,
  ChevronLeft,
  X,
  Clock,
  Users,
  Briefcase,
  GraduationCap,
  Mic2,
  Shield,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Award,
  TrendingUp,
  AlertCircle,
  CheckSquare,
  Upload,
  Image,
  Layers,
  Bell,
  Lock,
  Globe,
  Hash,
  Activity,
  PieChart,
  Search,
  Download,
  Plus,
  GripVertical,
  ClipboardList,
  Filter,
  MessageSquare,
  Save,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
} from "lucide-react";
import authService from "../../services/authService";
import userService from "../../services/userService";
import {
  getIndividualFeatureFlags,
  updateIndividualFeatureFlags,
} from "../../services/batchService";
import { courseService } from "../../services/courseService";
import videoService from "../../services/videoService";
import fileService from "../../services/fileService";
export const SERVICES_CONFIG = [
  {
    key: "assessment",
    label: "Assessment",
    icon: "📝",
    gradient: "linear-gradient(135deg,#8b5cf6,#6366f1)",
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
          key: "evaluate_submission",
          label: "Grade submissions",
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
    gradient: "linear-gradient(135deg,#14b8a6,#06b6d4)",
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
    gradient: "linear-gradient(135deg,#f59e0b,#f97316)",
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
          endpoint: "DELETE /batch/admin/batches/:id/trainers/:email",
        },
        {
          key: "assign_students",
          label: "Assign students to trainer",
          endpoint: "POST /batch/admin/batches/:id/trainers/:email/students",
        },
        {
          key: "get_trainer_students",
          label: "View trainer–student mapping",
          endpoint: "GET /batch/admin/batches/:id/trainer-students",
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
          key: "get_available_trainers",
          label: "View available trainers",
          endpoint: "GET /batch/admin/batches/:id/available-trainers",
        },
      ],
    },
  },
  {
    key: "chat",
    label: "Chat",
    icon: "💬",
    gradient: "linear-gradient(135deg,#0ea5e9,#6366f1)",
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
    gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)",
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
        {
          key: "create_study_plan",
          label: "Create study plan",
          endpoint: "POST /v1/study-plans",
        },
        {
          key: "manage_study_plans",
          label: "Manage study plans",
          endpoint: "GET /v1/study-plans/my",
        },
        {
          key: "toggle_study_plan",
          label: "Activate/deactivate study plan",
          endpoint: "PATCH /v1/study-plans/:id/toggle-active",
        },
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
    gradient: "linear-gradient(135deg,#3b82f6,#0ea5e9)",
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
    gradient: "linear-gradient(135deg,#ec4899,#f97316)",
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
    gradient: "linear-gradient(135deg,#a855f7,#ec4899)",
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
    gradient: "linear-gradient(135deg,#f97316,#eab308)",
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
    gradient: "linear-gradient(135deg,#10b981,#14b8a6)",
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

// function buildDefaultFlags(enabled = true) {
//   const flags = {};
//   SERVICES_CONFIG.forEach((svc) => {
//     const features = {};
//     Object.values(svc.features)
//       .flat()
//       .forEach((f) => {
//         features[f.key] = enabled;
//       });
//     flags[svc.key] = { enabled, features };
//   });
//   return flags;
// }
function buildDefaultFlags(enabled = true) {
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

// Flat DTO for batch service only (matches backend shape)
const BATCH_SVC_OM = SERVICES_CONFIG.find((s) => s.key === "batch");
function getAllBatchKeysOM() {
  return Object.values(BATCH_SVC_OM.features)
    .flat()
    .map((f) => f.key);
}
function buildDefaultBatchDTOOM(enabled = true) {
  const features = {};
  getAllBatchKeysOM().forEach((k) => {
    features[k] = enabled;
  });
  return { enabled, features };
}
// Flat DTO for course service (individual/standalone users)
const COURSE_SVC_OM = SERVICES_CONFIG.find((s) => s.key === "course");
function getAllCourseKeysOM() {
  return Object.values(COURSE_SVC_OM.features)
    .flat()
    .map((f) => f.key);
}
function buildDefaultCourseDTOOM(enabled = true) {
  const features = {};
  getAllCourseKeysOM().forEach((k) => {
    features[k] = enabled;
  });
  return { enabled, features };
}

const VIDEO_SVC_OM = SERVICES_CONFIG.find((s) => s.key === "video");
function getAllVideoKeysOM() {
  return Object.values(VIDEO_SVC_OM.features)
    .flat()
    .map((f) => f.key);
}
function buildDefaultVideoDTOOM(enabled = true) {
  const features = {};
  getAllVideoKeysOM().forEach((k) => {
    features[k] = enabled;
  });
  return { enabled, features };
}

const FILE_SVC_OM = SERVICES_CONFIG.find((s) => s.key === "file");
function getAllFileKeysOM() {
  return Object.values(FILE_SVC_OM.features)
    .flat()
    .map((f) => f.key);
}
function buildDefaultFileDTOOM(enabled = true) {
  const features = {};
  getAllFileKeysOM().forEach((k) => {
    features[k] = enabled;
  });
  return { enabled, features };
}

// const COURSE_SVC = SERVICES_CONFIG.find((s) => s.key === "course");

// function getAllCourseFeatureKeys() {
//   return Object.values(COURSE_SVC.features).flat().map((f) => f.key);
// }

// function buildDefaultCourseDTO(enabled = true) {
//   const features = {};
//   getAllCourseFeatureKeys().forEach((k) => { features[k] = enabled; });
//   return { enabled, features };
// }

// ─── ROLE PILL CONFIG ─────────────────────────────────────────────────────────
const ROLE_PILL = {
  trainer: { bg: "#fef3c7", color: "#92400e", label: "Trainer" },
  student: { bg: "#eff6ff", color: "#1d4ed8", label: "Student" },
  admin: { bg: "#ede9fe", color: "#5b21b6", label: "Admin" },
};

// ─── MINI TOGGLE ─────────────────────────────────────────────────────────────
const MiniTgl = ({ checked, onChange, color = "#f59e0b", size = "sm" }) => {
  const w = size === "sm" ? 28 : 36,
    h = size === "sm" ? 16 : 20;
  const ds = size === "sm" ? 10 : 14;
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
          transition: ".18s",
          boxShadow: checked ? `0 0 6px ${color}60` : "none",
        }}
      >
        <span
          style={{
            position: "absolute",
            height: ds,
            width: ds,
            left: checked ? w - ds - 3 : 3,
            top: (h - ds) / 2,
            background: "white",
            borderRadius: "50%",
            transition: ".18s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </span>
    </label>
  );
};

// ─── FEATURE TOAST ───────────────────────────────────────────────────────────
const FeatureToast = ({ toasts }) => (
  <div
    style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 99999,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      pointerEvents: "none",
    }}
  >
    {toasts.map((t) => (
      <div
        key={t.id}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          borderRadius: 12,
          minWidth: 220,
          maxWidth: 300,
          background: t.enabled
            ? `linear-gradient(135deg,${t.color}ee,${t.color}bb)`
            : "linear-gradient(135deg,#374151ee,#1f2937ee)",
          boxShadow: `0 8px 24px ${t.enabled ? t.color + "55" : "rgba(0,0,0,0.35)"}`,
          border: `1px solid ${t.enabled ? t.color + "70" : "rgba(255,255,255,0.1)"}`,
          backdropFilter: "blur(12px)",
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "inherit",
          animation: "toastSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          pointerEvents: "all",
        }}
      >
        <span style={{ fontSize: 16, flexShrink: 0 }}>
          {t.enabled ? "✅" : "🚫"}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, opacity: 0.75, marginBottom: 1 }}>
            {t.svcLabel}
          </div>
          <div>
            <span style={{ opacity: 0.85 }}>{t.featLabel} </span>
            <span
              style={{
                fontWeight: 800,
                color: t.enabled ? "#bbf7d0" : "#fca5a5",
              }}
            >
              {t.enabled ? "ON" : "OFF"}
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─── SERVICE FEATURE DRAWER ───────────────────────────────────────────────────
// CHANGE 1: accepts userRole prop — only shows that role's tab
const ServiceFeatureDrawer = ({
  svc,
  flags,
  onToggleFeature,
  onToggleService,
  onClose,
  onToast,
  userRole,
  onSave,
  onSaving,
  onSaved,
}) => {
  // Filter roles: only show the tab matching the user's role
  const allowedRole = userRole === "business" ? "admin" : userRole; // business maps to admin tab if present
  const roles = Object.keys(svc.features).filter(
    (r) => r === allowedRole && (svc.features[r] || []).length > 0,
  );

  const [activeRole, setActiveRole] = useState(() => roles[0] || "trainer");
  const svcFlags = flags[svc.key] || { enabled: true, features: {} };
  const svcEnabled = svcFlags.enabled ?? true;

  const countEnabled = (role) =>
    (svc.features[role] || []).filter((f) => svcFlags.features[f.key] !== false)
      .length;
  const totalForRole = (role) => (svc.features[role] || []).length;

  const handleRoleAll = (val) => {
    (svc.features[activeRole] || []).forEach((f) => {
      const cur = svcFlags.features[f.key] ?? true;
      if (cur !== val) {
        onToggleFeature(svc.key, f.key, val);
        onToast({
          svcLabel: svc.label,
          featLabel: f.label,
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
          width: 500,
          height: "100%",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          boxShadow: `-20px 0 60px rgba(0,0,0,0.3), -4px 0 20px ${svc.color}30`,
          animation: "drawerSlide 0.3s cubic-bezier(0.22,1,0.36,1)",
          overflowY: "auto",
        }}
      >
        {/* Gradient Header */}
        <div
          style={{
            background: svc.gradient,
            padding: "24px 22px 20px",
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
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                }}
              >
                {svc.icon}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>
                  {svc.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.7)",
                    marginTop: 2,
                  }}
                >
                  {
                    (svc.features[allowedRole] || []).filter(
                      (f) => svcFlags.features[f.key] !== false,
                    ).length
                  }{" "}
                  / {(svc.features[allowedRole] || []).length} features active
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: "rgba(255,255,255,0.2)",
                border: "none",
                cursor: "pointer",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
          {/* Master toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 16,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 11,
              padding: "9px 13px",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                Service master switch
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>
                Disabling blocks all features for all roles
              </div>
            </div>
            <MiniTgl
              checked={svcEnabled}
              onChange={(e) => {
                onToggleService(svc.key, e.target.checked);
                onToast({
                  svcLabel: svc.label,
                  featLabel: "All features",
                  enabled: e.target.checked,
                  color: svc.color,
                });
              }}
              color="#fff"
              size="md"
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
            <button
              onClick={onSave}
              disabled={onSaving}
              style={{
                fontSize: 12,
                padding: "8px 20px",
                border: "none",
                borderRadius: 10,
                background: onSaving
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(255,255,255,0.92)",
                cursor: onSaving ? "not-allowed" : "pointer",
                color: onSaving ? "rgba(255,255,255,0.5)" : svc.color,
                fontWeight: 700,
                boxShadow: onSaving ? "none" : "0 2px 8px rgba(0,0,0,0.2)",
                transition: "all 0.15s",
              }}
            >
              {onSaving ? "Saving…" : onSaved ? "✓ Saved!" : "💾 Save changes"}
            </button>
          </div>
          {/* Role tabs — only the allowed role tab is shown */}
          {roles.length > 0 && (
            <div style={{ display: "flex", gap: 5, marginTop: 12 }}>
              {roles.map((role) => {
                const pill = ROLE_PILL[role] || { label: role };
                const isActive = activeRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    style={{
                      flex: 1,
                      padding: "6px 8px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      background: isActive
                        ? "rgba(255,255,255,0.92)"
                        : "rgba(255,255,255,0.18)",
                      color: isActive ? svc.color : "#fff",
                      fontWeight: 700,
                      fontSize: 11,
                      backdropFilter: "blur(8px)",
                      transition: "all 0.15s",
                    }}
                  >
                    {pill.label}
                    <span
                      style={{
                        display: "block",
                        fontSize: 9.5,
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
          )}
        </div>

        {/* Feature list */}
        <div style={{ flex: 1, padding: "14px 18px", overflowY: "auto" }}>
          {(svc.features[activeRole] || []).length === 0 ? (
            <div
              style={{
                padding: "28px 0",
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 12,
              }}
            >
              No features for this role in this service.
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#94a3b8",
                  }}
                >
                  {activeRole} features · {countEnabled(activeRole)}/
                  {totalForRole(activeRole)} enabled
                </span>
                <div style={{ display: "flex", gap: 5 }}>
                  <button
                    onClick={() => handleRoleAll(false)}
                    style={{
                      fontSize: 9.5,
                      padding: "3px 9px",
                      border: "1px solid #e2e8f0",
                      borderRadius: 6,
                      background: "transparent",
                      cursor: "pointer",
                      color: "#94a3b8",
                      fontWeight: 600,
                      fontFamily: "inherit",
                    }}
                  >
                    All off
                  </button>
                  <button
                    onClick={() => handleRoleAll(true)}
                    style={{
                      fontSize: 9.5,
                      padding: "3px 9px",
                      border: `1px solid ${svc.color}`,
                      borderRadius: 6,
                      background: svc.colorLight,
                      cursor: "pointer",
                      color: svc.color,
                      fontWeight: 600,
                      fontFamily: "inherit",
                    }}
                  >
                    All on
                  </button>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {(svc.features[activeRole] || []).map((feat, idx) => {
                  const isOn = svcFlags.features[feat.key] ?? true;
                  return (
                    <div
                      key={feat.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: isOn ? svc.colorLight + "80" : "#f8fafc",
                        border: `1px solid ${isOn ? svc.color + "30" : "#f1f5f9"}`,
                        transition: "all 0.18s",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        onToggleFeature(svc.key, feat.key, !isOn);
                        onToast({
                          svcLabel: svc.label,
                          featLabel: feat.label,
                          enabled: !isOn,
                          color: svc.color,
                        });
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          background: isOn ? svc.color : "#e5e7eb",
                          color: isOn ? "#fff" : "#94a3b8",
                          fontSize: 10,
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.18s",
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: isOn ? "#0f172a" : "#94a3b8",
                            transition: "color 0.18s",
                          }}
                        >
                          {feat.label}
                        </div>
                        <div
                          style={{
                            fontSize: 9.5,
                            color: "#94a3b8",
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
                        <MiniTgl
                          checked={isOn}
                          onChange={(e) => {
                            onToggleFeature(
                              svc.key,
                              feat.key,
                              e.target.checked,
                            );
                            onToast({
                              svcLabel: svc.label,
                              featLabel: feat.label,
                              enabled: e.target.checked,
                              color: svc.color,
                            });
                          }}
                          color={svc.color}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
//featurecontrolsection
const FeatureControlsSection = ({ userEmail, color, userRole }) => {
  // ── BATCH state (unchanged service, just renamed locally for clarity) ─────
  const [batchDto, setBatchDto] = useState(() => buildDefaultBatchDTOOM(true));
  const [batchLoading, setBatchLoading] = useState(true);
  const [batchSaving, setBatchSaving] = useState(false);
  const [batchSaved, setBatchSaved] = useState(false);
  const [batchDrawerOpen, setBatchDrawerOpen] = useState(false);

  // ── COURSE state ────────────────────────────────────────────────────────────
  const [courseDto, setCourseDto] = useState(() =>
    buildDefaultCourseDTOOM(true),
  );
  const [courseLoading, setCourseLoading] = useState(true);
  const [courseSaving, setCourseSaving] = useState(false);
  const [courseSaved, setCourseSaved] = useState(false);
  const [courseDrawerOpen, setCourseDrawerOpen] = useState(false);

  const [toasts, setToasts] = useState([]);
  const toastRef = useRef(0);

  // ── VIDEO state ──────────────────────────────────────────────────────────────
  const [videoDto, setVideoDto] = useState(() => buildDefaultVideoDTOOM(true));
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoSaving, setVideoSaving] = useState(false);
  const [videoSaved, setVideoSaved] = useState(false);
  const [videoDrawerOpen, setVideoDrawerOpen] = useState(false);

  const videoSvc = VIDEO_SVC_OM;

  // ── FILE state ───────────────────────────────────────────────────────────────
  const [fileDto, setFileDto] = useState(() => buildDefaultFileDTOOM(true));
  const [fileLoading, setFileLoading] = useState(true);
  const [fileSaving, setFileSaving] = useState(false);
  const [fileSaved, setFileSaved] = useState(false);
  const [fileDrawerOpen, setFileDrawerOpen] = useState(false);

  const fileSvc = FILE_SVC_OM;

  const batchSvc = BATCH_SVC_OM;
  const courseSvc = COURSE_SVC_OM;

  // ── Load BATCH flags (unchanged endpoint) ──────────────────────────────────
  useEffect(() => {
    if (!userEmail) return;
    setBatchLoading(true);
    getIndividualFeatureFlags(userEmail)
      .then((data) => {
        if (data && typeof data === "object" && data.features) {
          const defaults = buildDefaultBatchDTOOM(true);
          setBatchDto({
            enabled: data.enabled ?? true,
            features: { ...defaults.features, ...data.features },
          });
        } else {
          setBatchDto(buildDefaultBatchDTOOM(true));
        }
      })
      .catch(() => setBatchDto(buildDefaultBatchDTOOM(true)))
      .finally(() => setBatchLoading(false));
  }, [userEmail]);

  // ── Load COURSE flags ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!userEmail) return;
    setCourseLoading(true);
    courseService
      .getIndividualCourseFeatureFlags(userEmail)
      .then((res) => {
        const data = res.data;
        if (data && typeof data === "object" && data.features) {
          const defaults = buildDefaultCourseDTOOM(true);
          setCourseDto({
            enabled: data.enabled ?? true,
            features: { ...defaults.features, ...data.features },
          });
        } else {
          setCourseDto(buildDefaultCourseDTOOM(true));
        }
      })
      .catch(() => setCourseDto(buildDefaultCourseDTOOM(true)))
      .finally(() => setCourseLoading(false));
  }, [userEmail]);

  // ── Load VIDEO flags ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userEmail) return;
    setVideoLoading(true);
    videoService
      .getIndividualVideoFeatureFlags(userEmail)
      .then((res) => {
        const data = res.data;
        if (data && typeof data === "object" && data.features) {
          const defaults = buildDefaultVideoDTOOM(true);
          setVideoDto({
            enabled: data.enabled ?? true,
            features: { ...defaults.features, ...data.features },
          });
        } else {
          setVideoDto(buildDefaultVideoDTOOM(true));
        }
      })
      .catch(() => setVideoDto(buildDefaultVideoDTOOM(true)))
      .finally(() => setVideoLoading(false));
  }, [userEmail]);
  // ── Load FILE flags ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userEmail) return;
    setFileLoading(true);
    fileService
      .getIndividualFileFeatureFlags(userEmail)
      .then((res) => {
        const data = res.data;
        if (data && typeof data === "object" && data.features) {
          const defaults = buildDefaultFileDTOOM(true);
          setFileDto({
            enabled: data.enabled ?? true,
            features: { ...defaults.features, ...data.features },
          });
        } else {
          setFileDto(buildDefaultFileDTOOM(true));
        }
      })
      .catch(() => setFileDto(buildDefaultFileDTOOM(true)))
      .finally(() => setFileLoading(false));
  }, [userEmail]);
  const pushToast = useCallback(
    ({ svcLabel, featLabel, enabled, color: c }) => {
      const id = ++toastRef.current;
      setToasts((p) => [
        ...p.slice(-3),
        { id, svcLabel, featLabel, enabled, color: c },
      ]);
      setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 2800);
    },
    [],
  );

  // ── BATCH handlers (unchanged logic) ────────────────────────────────────────
  const handleBatchToggleFeature = (featKey, val) => {
    setBatchDto((prev) => {
      const newFeatures = { ...prev.features, [featKey]: val };
      const anyOn = Object.values(newFeatures).some(Boolean);
      return { enabled: anyOn, features: newFeatures };
    });
  };
  const handleBatchToggleService = (val) =>
    setBatchDto(buildDefaultBatchDTOOM(val));
  const handleBatchSave = async () => {
    setBatchSaving(true);
    try {
      await updateIndividualFeatureFlags(userEmail, batchDto);
      setBatchSaved(true);
      setTimeout(() => setBatchSaved(false), 2800);
    } catch (e) {
      console.error(e);
    } finally {
      setBatchSaving(false);
    }
  };

  // ── COURSE handlers ──────────────────────────────────────────────────────────
  const handleCourseToggleFeature = (featKey, val) => {
    setCourseDto((prev) => {
      const newFeatures = { ...prev.features, [featKey]: val };
      const anyOn = Object.values(newFeatures).some(Boolean);
      return { enabled: anyOn, features: newFeatures };
    });
  };
  const handleCourseToggleService = (val) =>
    setCourseDto(buildDefaultCourseDTOOM(val));
  const handleCourseSave = async () => {
    setCourseSaving(true);
    try {
      await courseService.updateIndividualCourseFeatureFlags(
        userEmail,
        courseDto,
      );
      setCourseSaved(true);
      setTimeout(() => setCourseSaved(false), 2800);
    } catch (e) {
      console.error(e);
    } finally {
      setCourseSaving(false);
    }
  };
  // ── VIDEO handlers ───────────────────────────────────────────────────────────
  const handleVideoToggleFeature = (featKey, val) => {
    setVideoDto((prev) => {
      const newFeatures = { ...prev.features, [featKey]: val };
      const anyOn = Object.values(newFeatures).some(Boolean);
      return { enabled: anyOn, features: newFeatures };
    });
  };
  const handleVideoToggleService = (val) =>
    setVideoDto(buildDefaultVideoDTOOM(val));
  const handleVideoSave = async () => {
    setVideoSaving(true);
    try {
      await videoService.updateIndividualVideoFeatureFlags(userEmail, videoDto);
      setVideoSaved(true);
      setTimeout(() => setVideoSaved(false), 2800);
    } catch (e) {
      console.error(e);
    } finally {
      setVideoSaving(false);
    }
  };
  // ── FILE handlers ────────────────────────────────────────────────────────────
  const handleFileToggleFeature = (featKey, val) => {
    setFileDto((prev) => {
      const newFeatures = { ...prev.features, [featKey]: val };
      const anyOn = Object.values(newFeatures).some(Boolean);
      return { enabled: anyOn, features: newFeatures };
    });
  };
  const handleFileToggleService = (val) =>
    setFileDto(buildDefaultFileDTOOM(val));
  const handleFileSave = async () => {
    setFileSaving(true);
    try {
      await fileService.updateIndividualFileFeatureFlags(userEmail, fileDto);
      setFileSaved(true);
      setTimeout(() => setFileSaved(false), 2800);
    } catch (e) {
      console.error(e);
    } finally {
      setFileSaving(false);
    }
  };

  const allowedRole = userRole === "business" ? "admin" : userRole || "trainer";

  const batchTotalKeys = getAllBatchKeysOM().length;
  const batchOnKeys = getAllBatchKeysOM().filter(
    (k) => batchDto.features[k] !== false,
  ).length;
  const batchPct =
    batchTotalKeys > 0 ? Math.round((batchOnKeys / batchTotalKeys) * 100) : 0;
  const batchEnabled = batchDto.enabled ?? true;

  const courseTotalKeys = getAllCourseKeysOM().length;
  const courseOnKeys = getAllCourseKeysOM().filter(
    (k) => courseDto.features[k] !== false,
  ).length;
  const coursePct =
    courseTotalKeys > 0
      ? Math.round((courseOnKeys / courseTotalKeys) * 100)
      : 0;
  const courseEnabled = courseDto.enabled ?? true;

  // Per-role feature counts shown on the card (matches role-scoped behavior elsewhere)
  const batchRoleFeats = batchSvc.features[allowedRole] || [];
  const batchRoleOn = batchRoleFeats.filter(
    (f) => batchDto.features[f.key] !== false,
  ).length;
  const courseRoleFeats = courseSvc.features[allowedRole] || [];
  const courseRoleOn = courseRoleFeats.filter(
    (f) => courseDto.features[f.key] !== false,
  ).length;
  const videoRoleFeats = videoSvc.features[allowedRole] || [];
  const videoRoleOn = videoRoleFeats.filter(
    (f) => videoDto.features[f.key] !== false,
  ).length;
  const showVideoCard = videoRoleFeats.length > 0;

  const fileRoleFeats = fileSvc.features[allowedRole] || [];
  const fileRoleOn = fileRoleFeats.filter(
    (f) => fileDto.features[f.key] !== false,
  ).length;
  const showFileCard = fileRoleFeats.length > 0;
  // Hide a service card entirely if this role has no features for it
  const showBatchCard = batchRoleFeats.length > 0;
  const showCourseCard = courseRoleFeats.length > 0;

  const ServiceCardOM = ({
    svc,
    svcEnabled,
    onKeys,
    totalKeys,
    pct,
    onToggleService,
    onDrawerOpen,
    loading,
  }) => (
    <div
      onClick={onDrawerOpen}
      style={{
        background: svcEnabled ? svc.colorLight : "#fff",
        border: `1.5px solid ${svcEnabled ? svc.color + "40" : "#e2e8f0"}`,
        borderRadius: 11,
        padding: "11px 12px",
        cursor: "pointer",
        boxShadow: svcEnabled ? `0 3px 14px ${svc.glow}30` : "none",
        opacity: loading ? 0.6 : 1,
        flex: 1,
        minWidth: 150,
        maxWidth: 200,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: svcEnabled ? svc.gradient : "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
          }}
        >
          {svc.icon}
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <MiniTgl
            checked={svcEnabled}
            onChange={(e) => onToggleService(e.target.checked)}
            color={svc.color}
          />
        </div>
      </div>
      <div
        style={{
          fontSize: 11.5,
          fontWeight: 700,
          color: svcEnabled ? "#0f172a" : "#94a3b8",
          marginBottom: 3,
        }}
      >
        {svc.label}
      </div>
      <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 7 }}>
        {onKeys}/{totalKeys} on
      </div>
      <div
        style={{
          height: 3,
          borderRadius: 2,
          background: "#e2e8f0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: svcEnabled ? svc.gradient : "#94a3b8",
            borderRadius: 2,
            transition: "width 0.3s",
          }}
        />
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 9.5,
          color: svc.color,
          fontWeight: 600,
          opacity: 0.8,
        }}
      >
        Click to manage →
      </div>
    </div>
  );

  return (
    <>
      <FeatureToast toasts={toasts} />

      <div style={{ marginTop: 6 }}>
        <div
          style={{
            borderTop: "2px dashed #e2e8f0",
            paddingTop: 13,
            marginTop: 2,
          }}
        >
          {/* Header — description only, NO global save/enable/disable buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 7,
                background: "#fef3c7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldAlert size={13} color="#f59e0b" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>
              Feature controls
            </span>
            <span
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: 99,
                background: "#fef3c7",
                color: "#92400e",
              }}
            >
              No org — standalone
            </span>
          </div>

          {batchLoading && courseLoading && videoLoading && fileLoading ? (
            <div
              style={{
                padding: "18px 0",
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  border: "2px solid #e2e8f0",
                  borderTop: `2px solid ${color}`,
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }}
              />
              Loading feature controls…
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {showBatchCard && (
                <ServiceCardOM
                  svc={batchSvc}
                  svcEnabled={batchEnabled}
                  onKeys={batchRoleOn}
                  totalKeys={batchRoleFeats.length}
                  pct={
                    batchRoleFeats.length > 0
                      ? Math.round((batchRoleOn / batchRoleFeats.length) * 100)
                      : 0
                  }
                  onToggleService={(val) => {
                    handleBatchToggleService(val);
                    pushToast({
                      svcLabel: batchSvc.label,
                      featLabel: "All features",
                      enabled: val,
                      color: batchSvc.color,
                    });
                  }}
                  onDrawerOpen={() => setBatchDrawerOpen(true)}
                  loading={batchLoading}
                />
              )}
              {showCourseCard && (
                <ServiceCardOM
                  svc={courseSvc}
                  svcEnabled={courseEnabled}
                  onKeys={courseRoleOn}
                  totalKeys={courseRoleFeats.length}
                  pct={
                    courseRoleFeats.length > 0
                      ? Math.round(
                          (courseRoleOn / courseRoleFeats.length) * 100,
                        )
                      : 0
                  }
                  onToggleService={(val) => {
                    handleCourseToggleService(val);
                    pushToast({
                      svcLabel: courseSvc.label,
                      featLabel: "All features",
                      enabled: val,
                      color: courseSvc.color,
                    });
                  }}
                  onDrawerOpen={() => setCourseDrawerOpen(true)}
                  loading={courseLoading}
                />
              )}
              {showVideoCard && (
                <ServiceCardOM
                  svc={videoSvc}
                  svcEnabled={videoDto.enabled ?? true}
                  onKeys={videoRoleOn}
                  totalKeys={videoRoleFeats.length}
                  pct={
                    videoRoleFeats.length > 0
                      ? Math.round((videoRoleOn / videoRoleFeats.length) * 100)
                      : 0
                  }
                  onToggleService={(val) => {
                    handleVideoToggleService(val);
                    pushToast({
                      svcLabel: videoSvc.label,
                      featLabel: "All features",
                      enabled: val,
                      color: videoSvc.color,
                    });
                  }}
                  onDrawerOpen={() => setVideoDrawerOpen(true)}
                  loading={videoLoading}
                />
              )}

              {showFileCard && (
                <ServiceCardOM
                  svc={fileSvc}
                  svcEnabled={fileDto.enabled ?? true}
                  onKeys={fileRoleOn}
                  totalKeys={fileRoleFeats.length}
                  pct={
                    fileRoleFeats.length > 0
                      ? Math.round((fileRoleOn / fileRoleFeats.length) * 100)
                      : 0
                  }
                  onToggleService={(val) => {
                    handleFileToggleService(val);
                    pushToast({
                      svcLabel: fileSvc.label,
                      featLabel: "All features",
                      enabled: val,
                      color: fileSvc.color,
                    });
                  }}
                  onDrawerOpen={() => setFileDrawerOpen(true)}
                  loading={fileLoading}
                />
              )}
            </div>
          )}

          {batchDrawerOpen && (
            <BatchDrawerOM
              dto={batchDto}
              onToggleFeature={handleBatchToggleFeature}
              onToggleService={handleBatchToggleService}
              onClose={() => setBatchDrawerOpen(false)}
              onToast={pushToast}
              onSave={handleBatchSave}
              saving={batchSaving}
              saved={batchSaved}
              userRole={userRole}
            />
          )}

          {courseDrawerOpen && (
            <CourseDrawerOM
              dto={courseDto}
              onToggleFeature={handleCourseToggleFeature}
              onToggleService={handleCourseToggleService}
              onClose={() => setCourseDrawerOpen(false)}
              onToast={pushToast}
              onSave={handleCourseSave}
              saving={courseSaving}
              saved={courseSaved}
              userRole={userRole}
            />
          )}
          {videoDrawerOpen && (
            <VideoDrawerOM
              dto={videoDto}
              onToggleFeature={handleVideoToggleFeature}
              onToggleService={handleVideoToggleService}
              onClose={() => setVideoDrawerOpen(false)}
              onToast={pushToast}
              onSave={handleVideoSave}
              saving={videoSaving}
              saved={videoSaved}
              userRole={userRole}
            />
          )}
          {fileDrawerOpen && (
            <FileDrawerOM
              dto={fileDto}
              onToggleFeature={handleFileToggleFeature}
              onToggleService={handleFileToggleService}
              onClose={() => setFileDrawerOpen(false)}
              onToast={pushToast}
              onSave={handleFileSave}
              saving={fileSaving}
              saved={fileSaved}
              userRole={userRole}
            />
          )}

          <div
            style={{
              marginTop: 10,
              padding: "8px 10px",
              borderRadius: 8,
              background: "#fffbeb",
              border: "1px solid #fde68a",
              fontSize: 10.5,
              color: "#92400e",
              display: "flex",
              alignItems: "flex-start",
              gap: 6,
            }}
          >
            <span style={{ flexShrink: 0, marginTop: 1 }}>ℹ️</span>
            <span>
              This user has no organization. Permissions set here apply to their
              standalone account.
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
const BatchDrawerOM = ({
  dto,
  onToggleFeature,
  onToggleService,
  onClose,
  onToast,
  onSave,
  saving,
  saved,
  userRole,
}) => {
  const svc = BATCH_SVC_OM;
  const allowedRole = userRole === "business" ? "admin" : userRole || "trainer";
  const roles = Object.keys(svc.features).filter(
    (r) => r === allowedRole && (svc.features[r] || []).length > 0,
  );
  const [activeRole, setActiveRole] = useState(roles[0] || "trainer");
  const svcEnabled = dto.enabled ?? true;

  const countEnabled = (role) =>
    (svc.features[role] || []).filter((f) => dto.features[f.key] !== false)
      .length;
  const totalForRole = (role) => (svc.features[role] || []).length;

  const handleRoleAll = (val) => {
    (svc.features[activeRole] || []).forEach((f) => {
      if ((dto.features[f.key] ?? true) !== val) {
        onToggleFeature(f.key, val);
        onToast({
          svcLabel: svc.label,
          featLabel: f.label,
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
          width: 500,
          height: "100%",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          boxShadow: `-20px 0 60px rgba(0,0,0,0.3)`,
          animation: "drawerSlide 0.3s cubic-bezier(0.22,1,0.36,1)",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            background: svc.gradient,
            padding: "24px 22px 20px",
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
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                {svc.icon}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>
                  {svc.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.7)",
                    marginTop: 2,
                  }}
                >
                  {
                    getAllBatchKeysOM().filter((k) => dto.features[k] !== false)
                      .length
                  }{" "}
                  / {getAllBatchKeysOM().length} features active
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: "rgba(255,255,255,0.2)",
                border: "none",
                cursor: "pointer",
                color: "#fff",
                fontSize: 15,
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
              marginTop: 16,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 11,
              padding: "9px 13px",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                Service master switch
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>
                Disabling blocks all features for all roles
              </div>
            </div>
            <MiniTgl
              checked={svcEnabled}
              onChange={(e) => {
                onToggleService(e.target.checked);
                onToast({
                  svcLabel: svc.label,
                  featLabel: "All features",
                  enabled: e.target.checked,
                  color: svc.color,
                });
              }}
              color="#fff"
              size="md"
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
              {saving ? "Saving…" : saved ? "✓ Saved!" : "💾 Save changes"}
            </button>
          </div>
          {/* Role tabs */}
          {roles.length > 0 && (
            <div style={{ display: "flex", gap: 5, marginTop: 12 }}>
              {roles.map((role) => {
                const pill = ROLE_PILL[role] || { label: role };
                const isActive = activeRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    style={{
                      flex: 1,
                      padding: "6px 8px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      background: isActive
                        ? "rgba(255,255,255,0.92)"
                        : "rgba(255,255,255,0.18)",
                      color: isActive ? svc.color : "#fff",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    {pill.label}
                    <span
                      style={{
                        display: "block",
                        fontSize: 9.5,
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
          )}
        </div>
        {/* Feature list */}
        <div style={{ flex: 1, padding: "14px 18px", overflowY: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#94a3b8",
              }}
            >
              {activeRole} · {countEnabled(activeRole)}/
              {totalForRole(activeRole)} enabled
            </span>
            <div style={{ display: "flex", gap: 5 }}>
              <button
                onClick={() => handleRoleAll(false)}
                style={{
                  fontSize: 9.5,
                  padding: "3px 9px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  background: "transparent",
                  cursor: "pointer",
                  color: "#94a3b8",
                  fontWeight: 600,
                  fontFamily: "inherit",
                }}
              >
                All off
              </button>
              <button
                onClick={() => handleRoleAll(true)}
                style={{
                  fontSize: 9.5,
                  padding: "3px 9px",
                  border: `1px solid ${svc.color}`,
                  borderRadius: 6,
                  background: svc.colorLight,
                  cursor: "pointer",
                  color: svc.color,
                  fontWeight: 600,
                  fontFamily: "inherit",
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
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: isOn ? svc.colorLight + "80" : "#f8fafc",
                    border: `1px solid ${isOn ? svc.color + "30" : "#f1f5f9"}`,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    onToggleFeature(feat.key, !isOn);
                    onToast({
                      svcLabel: svc.label,
                      featLabel: feat.label,
                      enabled: !isOn,
                      color: svc.color,
                    });
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      background: isOn ? svc.color : "#e5e7eb",
                      color: isOn ? "#fff" : "#94a3b8",
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
                        fontSize: 12,
                        fontWeight: 600,
                        color: isOn ? "#0f172a" : "#94a3b8",
                      }}
                    >
                      {feat.label}
                    </div>
                    <div
                      style={{
                        fontSize: 9.5,
                        color: "#94a3b8",
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
                    <MiniTgl
                      checked={isOn}
                      onChange={(e) => {
                        onToggleFeature(feat.key, e.target.checked);
                        onToast({
                          svcLabel: svc.label,
                          featLabel: feat.label,
                          enabled: e.target.checked,
                          color: svc.color,
                        });
                      }}
                      color={svc.color}
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

const CourseDrawerOM = ({
  dto,
  onToggleFeature,
  onToggleService,
  onClose,
  onToast,
  onSave,
  saving,
  saved,
  userRole,
}) => {
  const svc = COURSE_SVC_OM;
  const allowedRole = userRole === "business" ? "admin" : userRole || "trainer";
  const roles = Object.keys(svc.features).filter(
    (r) => r === allowedRole && (svc.features[r] || []).length > 0,
  );
  const [activeRole, setActiveRole] = useState(roles[0] || "trainer");
  const svcEnabled = dto.enabled ?? true;

  const countEnabled = (role) =>
    (svc.features[role] || []).filter((f) => dto.features[f.key] !== false)
      .length;
  const totalForRole = (role) => (svc.features[role] || []).length;

  const handleRoleAll = (val) => {
    (svc.features[activeRole] || []).forEach((f) => {
      if ((dto.features[f.key] ?? true) !== val) {
        onToggleFeature(f.key, val);
        onToast({
          svcLabel: svc.label,
          featLabel: f.label,
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
          width: 500,
          height: "100%",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          boxShadow: `-20px 0 60px rgba(0,0,0,0.3)`,
          animation: "drawerSlide 0.3s cubic-bezier(0.22,1,0.36,1)",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            background: svc.gradient,
            padding: "24px 22px 20px",
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
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                {svc.icon}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>
                  {svc.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.7)",
                    marginTop: 2,
                  }}
                >
                  {
                    getAllCourseKeysOM().filter(
                      (k) => dto.features[k] !== false,
                    ).length
                  }{" "}
                  / {getAllCourseKeysOM().length} features active
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: "rgba(255,255,255,0.2)",
                border: "none",
                cursor: "pointer",
                color: "#fff",
                fontSize: 15,
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
              marginTop: 16,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 11,
              padding: "9px 13px",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                Service master switch
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>
                Disabling blocks all features for all roles
              </div>
            </div>
            <MiniTgl
              checked={svcEnabled}
              onChange={(e) => {
                onToggleService(e.target.checked);
                onToast({
                  svcLabel: svc.label,
                  featLabel: "All features",
                  enabled: e.target.checked,
                  color: svc.color,
                });
              }}
              color="#fff"
              size="md"
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
              {saving ? "Saving…" : saved ? "✓ Saved!" : "💾 Save changes"}
            </button>
          </div>
          {/* Role tabs */}
          {roles.length > 0 && (
            <div style={{ display: "flex", gap: 5, marginTop: 12 }}>
              {roles.map((role) => {
                const pill = ROLE_PILL[role] || { label: role };
                const isActive = activeRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    style={{
                      flex: 1,
                      padding: "6px 8px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      background: isActive
                        ? "rgba(255,255,255,0.92)"
                        : "rgba(255,255,255,0.18)",
                      color: isActive ? svc.color : "#fff",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    {pill.label}
                    <span
                      style={{
                        display: "block",
                        fontSize: 9.5,
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
          )}
        </div>
        {/* Feature list */}
        <div style={{ flex: 1, padding: "14px 18px", overflowY: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#94a3b8",
              }}
            >
              {activeRole} · {countEnabled(activeRole)}/
              {totalForRole(activeRole)} enabled
            </span>
            <div style={{ display: "flex", gap: 5 }}>
              <button
                onClick={() => handleRoleAll(false)}
                style={{
                  fontSize: 9.5,
                  padding: "3px 9px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  background: "transparent",
                  cursor: "pointer",
                  color: "#94a3b8",
                  fontWeight: 600,
                  fontFamily: "inherit",
                }}
              >
                All off
              </button>
              <button
                onClick={() => handleRoleAll(true)}
                style={{
                  fontSize: 9.5,
                  padding: "3px 9px",
                  border: `1px solid ${svc.color}`,
                  borderRadius: 6,
                  background: svc.colorLight,
                  cursor: "pointer",
                  color: svc.color,
                  fontWeight: 600,
                  fontFamily: "inherit",
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
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: isOn ? svc.colorLight + "80" : "#f8fafc",
                    border: `1px solid ${isOn ? svc.color + "30" : "#f1f5f9"}`,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    onToggleFeature(feat.key, !isOn);
                    onToast({
                      svcLabel: svc.label,
                      featLabel: feat.label,
                      enabled: !isOn,
                      color: svc.color,
                    });
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      background: isOn ? svc.color : "#e5e7eb",
                      color: isOn ? "#fff" : "#94a3b8",
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
                        fontSize: 12,
                        fontWeight: 600,
                        color: isOn ? "#0f172a" : "#94a3b8",
                      }}
                    >
                      {feat.label}
                    </div>
                    <div
                      style={{
                        fontSize: 9.5,
                        color: "#94a3b8",
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
                    <MiniTgl
                      checked={isOn}
                      onChange={(e) => {
                        onToggleFeature(feat.key, e.target.checked);
                        onToast({
                          svcLabel: svc.label,
                          featLabel: feat.label,
                          enabled: e.target.checked,
                          color: svc.color,
                        });
                      }}
                      color={svc.color}
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

const VideoDrawerOM = ({
  dto,
  onToggleFeature,
  onToggleService,
  onClose,
  onToast,
  onSave,
  saving,
  saved,
  userRole,
}) => {
  const svc = VIDEO_SVC_OM;
  const allowedRole = userRole === "business" ? "admin" : userRole || "trainer";
  const roles = Object.keys(svc.features).filter(
    (r) => r === allowedRole && (svc.features[r] || []).length > 0,
  );
  const [activeRole, setActiveRole] = useState(roles[0] || "trainer");
  const svcEnabled = dto.enabled ?? true;

  const countEnabled = (role) =>
    (svc.features[role] || []).filter((f) => dto.features[f.key] !== false)
      .length;
  const totalForRole = (role) => (svc.features[role] || []).length;

  const handleRoleAll = (val) => {
    (svc.features[activeRole] || []).forEach((f) => {
      if ((dto.features[f.key] ?? true) !== val) {
        onToggleFeature(f.key, val);
        onToast({
          svcLabel: svc.label,
          featLabel: f.label,
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
          width: 500,
          height: "100%",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          boxShadow: `-20px 0 60px rgba(0,0,0,0.3)`,
          animation: "drawerSlide 0.3s cubic-bezier(0.22,1,0.36,1)",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            background: svc.gradient,
            padding: "24px 22px 20px",
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
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                {svc.icon}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>
                  {svc.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.7)",
                    marginTop: 2,
                  }}
                >
                  {
                    getAllVideoKeysOM().filter((k) => dto.features[k] !== false)
                      .length
                  }{" "}
                  / {getAllVideoKeysOM().length} features active
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: "rgba(255,255,255,0.2)",
                border: "none",
                cursor: "pointer",
                color: "#fff",
                fontSize: 15,
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
              marginTop: 16,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 11,
              padding: "9px 13px",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                Service master switch
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>
                Disabling blocks all features for all roles
              </div>
            </div>
            <MiniTgl
              checked={svcEnabled}
              onChange={(e) => {
                onToggleService(e.target.checked);
                onToast({
                  svcLabel: svc.label,
                  featLabel: "All features",
                  enabled: e.target.checked,
                  color: svc.color,
                });
              }}
              color="#fff"
              size="md"
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
              {saving ? "Saving…" : saved ? "✓ Saved!" : "💾 Save changes"}
            </button>
          </div>
          {/* Role tabs */}
          {roles.length > 0 && (
            <div style={{ display: "flex", gap: 5, marginTop: 12 }}>
              {roles.map((role) => {
                const pill = ROLE_PILL[role] || { label: role };
                const isActive = activeRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    style={{
                      flex: 1,
                      padding: "6px 8px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      background: isActive
                        ? "rgba(255,255,255,0.92)"
                        : "rgba(255,255,255,0.18)",
                      color: isActive ? svc.color : "#fff",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    {pill.label}
                    <span
                      style={{
                        display: "block",
                        fontSize: 9.5,
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
          )}
        </div>
        {/* Feature list */}
        <div style={{ flex: 1, padding: "14px 18px", overflowY: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#94a3b8",
              }}
            >
              {activeRole} · {countEnabled(activeRole)}/
              {totalForRole(activeRole)} enabled
            </span>
            <div style={{ display: "flex", gap: 5 }}>
              <button
                onClick={() => handleRoleAll(false)}
                style={{
                  fontSize: 9.5,
                  padding: "3px 9px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  background: "transparent",
                  cursor: "pointer",
                  color: "#94a3b8",
                  fontWeight: 600,
                  fontFamily: "inherit",
                }}
              >
                All off
              </button>
              <button
                onClick={() => handleRoleAll(true)}
                style={{
                  fontSize: 9.5,
                  padding: "3px 9px",
                  border: `1px solid ${svc.color}`,
                  borderRadius: 6,
                  background: svc.colorLight,
                  cursor: "pointer",
                  color: svc.color,
                  fontWeight: 600,
                  fontFamily: "inherit",
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
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: isOn ? svc.colorLight + "80" : "#f8fafc",
                    border: `1px solid ${isOn ? svc.color + "30" : "#f1f5f9"}`,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    onToggleFeature(feat.key, !isOn);
                    onToast({
                      svcLabel: svc.label,
                      featLabel: feat.label,
                      enabled: !isOn,
                      color: svc.color,
                    });
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      background: isOn ? svc.color : "#e5e7eb",
                      color: isOn ? "#fff" : "#94a3b8",
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
                        fontSize: 12,
                        fontWeight: 600,
                        color: isOn ? "#0f172a" : "#94a3b8",
                      }}
                    >
                      {feat.label}
                    </div>
                    <div
                      style={{
                        fontSize: 9.5,
                        color: "#94a3b8",
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
                    <MiniTgl
                      checked={isOn}
                      onChange={(e) => {
                        onToggleFeature(feat.key, e.target.checked);
                        onToast({
                          svcLabel: svc.label,
                          featLabel: feat.label,
                          enabled: e.target.checked,
                          color: svc.color,
                        });
                      }}
                      color={svc.color}
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

const FileDrawerOM = ({
  dto,
  onToggleFeature,
  onToggleService,
  onClose,
  onToast,
  onSave,
  saving,
  saved,
  userRole,
}) => {
  const svc = FILE_SVC_OM;
  const allowedRole = userRole === "business" ? "admin" : userRole || "trainer";
  const roles = Object.keys(svc.features).filter(
    (r) => r === allowedRole && (svc.features[r] || []).length > 0,
  );
  const [activeRole, setActiveRole] = useState(roles[0] || "trainer");
  const svcEnabled = dto.enabled ?? true;

  const countEnabled = (role) =>
    (svc.features[role] || []).filter((f) => dto.features[f.key] !== false)
      .length;
  const totalForRole = (role) => (svc.features[role] || []).length;

  const handleRoleAll = (val) => {
    (svc.features[activeRole] || []).forEach((f) => {
      if ((dto.features[f.key] ?? true) !== val) {
        onToggleFeature(f.key, val);
        onToast({
          svcLabel: svc.label,
          featLabel: f.label,
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
          width: 500,
          height: "100%",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          boxShadow: `-20px 0 60px rgba(0,0,0,0.3)`,
          animation: "drawerSlide 0.3s cubic-bezier(0.22,1,0.36,1)",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            background: svc.gradient,
            padding: "24px 22px 20px",
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
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                {svc.icon}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>
                  {svc.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.7)",
                    marginTop: 2,
                  }}
                >
                  {
                    getAllFileKeysOM().filter((k) => dto.features[k] !== false)
                      .length
                  }{" "}
                  / {getAllFileKeysOM().length} features active
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: "rgba(255,255,255,0.2)",
                border: "none",
                cursor: "pointer",
                color: "#fff",
                fontSize: 15,
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
              marginTop: 16,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 11,
              padding: "9px 13px",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                Service master switch
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>
                Disabling blocks all features for all roles
              </div>
            </div>
            <MiniTgl
              checked={svcEnabled}
              onChange={(e) => {
                onToggleService(e.target.checked);
                onToast({
                  svcLabel: svc.label,
                  featLabel: "All features",
                  enabled: e.target.checked,
                  color: svc.color,
                });
              }}
              color="#fff"
              size="md"
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
              {saving ? "Saving…" : saved ? "✓ Saved!" : "💾 Save changes"}
            </button>
          </div>
          {/* Role tabs */}
          {roles.length > 0 && (
            <div style={{ display: "flex", gap: 5, marginTop: 12 }}>
              {roles.map((role) => {
                const pill = ROLE_PILL[role] || { label: role };
                const isActive = activeRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    style={{
                      flex: 1,
                      padding: "6px 8px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      background: isActive
                        ? "rgba(255,255,255,0.92)"
                        : "rgba(255,255,255,0.18)",
                      color: isActive ? svc.color : "#fff",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    {pill.label}
                    <span
                      style={{
                        display: "block",
                        fontSize: 9.5,
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
          )}
        </div>
        {/* Feature list */}
        <div style={{ flex: 1, padding: "14px 18px", overflowY: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#94a3b8",
              }}
            >
              {activeRole} · {countEnabled(activeRole)}/
              {totalForRole(activeRole)} enabled
            </span>
            <div style={{ display: "flex", gap: 5 }}>
              <button
                onClick={() => handleRoleAll(false)}
                style={{
                  fontSize: 9.5,
                  padding: "3px 9px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  background: "transparent",
                  cursor: "pointer",
                  color: "#94a3b8",
                  fontWeight: 600,
                  fontFamily: "inherit",
                }}
              >
                All off
              </button>
              <button
                onClick={() => handleRoleAll(true)}
                style={{
                  fontSize: 9.5,
                  padding: "3px 9px",
                  border: `1px solid ${svc.color}`,
                  borderRadius: 6,
                  background: svc.colorLight,
                  cursor: "pointer",
                  color: svc.color,
                  fontWeight: 600,
                  fontFamily: "inherit",
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
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: isOn ? svc.colorLight + "80" : "#f8fafc",
                    border: `1px solid ${isOn ? svc.color + "30" : "#f1f5f9"}`,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    onToggleFeature(feat.key, !isOn);
                    onToast({
                      svcLabel: svc.label,
                      featLabel: feat.label,
                      enabled: !isOn,
                      color: svc.color,
                    });
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      background: isOn ? svc.color : "#e5e7eb",
                      color: isOn ? "#fff" : "#94a3b8",
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
                        fontSize: 12,
                        fontWeight: 600,
                        color: isOn ? "#0f172a" : "#94a3b8",
                      }}
                    >
                      {feat.label}
                    </div>
                    <div
                      style={{
                        fontSize: 9.5,
                        color: "#94a3b8",
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
                    <MiniTgl
                      checked={isOn}
                      onChange={(e) => {
                        onToggleFeature(feat.key, e.target.checked);
                        onToast({
                          svcLabel: svc.label,
                          featLabel: feat.label,
                          enabled: e.target.checked,
                          color: svc.color,
                        });
                      }}
                      color={svc.color}
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

// ─── ROLE CONFIG ──────────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  student: {
    label: "Students",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    Icon: GraduationCap,
  },
  trainer: {
    label: "Trainers",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    Icon: Mic2,
  },
  admin: {
    label: "Admins",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    Icon: Shield,
  },
  business: {
    label: "Businesses",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    Icon: Briefcase,
  },
};

const STATUS_CONFIG = {
  Completed: { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
  "In Progress": { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
  Pending: { bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af" },
};

const SUB_CONFIG = {
  Free: { bg: "#f3f4f6", color: "#6b7280" },
  Pro: { bg: "#ede9fe", color: "#7c3aed" },
  Enterprise: { bg: "#dbeafe", color: "#1d4ed8" },
};

const STEP_DEFS = [
  { num: 1, label: "Basic Info", Icon: User, desc: "Personal details" },
  { num: 2, label: "Organization", Icon: Building2, desc: "Work & education" },
  { num: 3, label: "Documents", Icon: ShieldCheck, desc: "Verification" },
  { num: 4, label: "Subscription", Icon: CreditCard, desc: "Plan & billing" },
  { num: 5, label: "Platform Setup", Icon: Settings, desc: "Preferences" },
  { num: 6, label: "Final Approval", Icon: BadgeCheck, desc: "Activation" },
];

const STEP_LABELS = {
  student: {
    step_0: "What do you want to learn?",
    step_1: "Current learning stage?",
    step_2: "How do you prefer to learn?",
    step_3: "Weekly time available?",
    step_4: "Biggest goal?",
    step_5: "Where to start?",
  },
  trainer: {
    step_0: "What do you want to teach?",
    step_1: "Trainer profile type?",
    step_2: "How to deliver training?",
    step_3: "Training experience?",
    step_4: "Biggest trainer goal?",
    step_5: "Where to start?",
  },
  business: {
    step_0: "What do you want to manage?",
    step_1: "What type of organization?",
    step_2: "How many users?",
    step_3: "What admin tools needed?",
    step_4: "Biggest admin goal?",
    step_5: "Where to start?",
  },
  admin: {
    step_0: "What do you want to manage?",
    step_1: "Organization type?",
    step_2: "Team size?",
    step_3: "Key tools needed?",
    step_4: "Primary goal?",
    step_5: "Where to start?",
  },
};

function mapRoleKey(backendRole) {
  switch ((backendRole || "").toUpperCase()) {
    case "STUDENT":
      return "student";
    case "TRAINER":
      return "trainer";
    case "TENANT_ADMIN":
    case "BUSINESS":
      return "business";
    case "ADMIN":
    case "SUPER_ADMIN":
      return "admin";
    default:
      return "student";
  }
}

function mapRoleLabel(backendRole) {
  switch ((backendRole || "").toUpperCase()) {
    case "STUDENT":
      return "Student";
    case "TRAINER":
      return "Trainer";
    case "TENANT_ADMIN":
    case "BUSINESS":
      return "Business";
    case "ADMIN":
    case "SUPER_ADMIN":
      return "Admin";
    default:
      return "Student";
  }
}

function formatDate(isoStr) {
  if (!isoStr) return "—";
  try {
    return new Date(isoStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function timeAgo(isoStr) {
  if (!isoStr) return "—";
  try {
    const diff = Date.now() - new Date(isoStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  } catch {
    return "—";
  }
}

function calculateStep(onboardingAnswers) {
  if (!onboardingAnswers || typeof onboardingAnswers !== "object") return 1;
  const answered = Object.keys(onboardingAnswers).filter(
    (k) =>
      Array.isArray(onboardingAnswers[k]) && onboardingAnswers[k].length > 0,
  ).length;
  return Math.max(1, Math.min(6, answered));
}

function mapBackendUser(user) {
  const roleKey = mapRoleKey(user.role);
  const answers = user.onboardingAnswers || {};
  const firstAnswer = answers["step_0"]?.[0] || "—";
  return {
    id: user.id.toString(),
    name: user.name || "—",
    email: user.email || "—",
    status:
      user.onboardingStatus === "COMPLETED"
        ? "Completed"
        : user.onboardingStatus === "PENDING"
          ? "Pending"
          : "In Progress",
    step: calculateStep(answers),
    role: mapRoleLabel(user.role),
    roleKey,
    subscription: "Free",
    active: !user.blocked,
    joinDate: formatDate(user.createdAt),
    time: timeAgo(user.createdAt),
    appliedAt: user.createdAt,
    onboardingAnswers: answers,
    learning: firstAnswer,
    expertise: firstAnswer,
    org: firstAnswer,
    type: firstAnswer,
    isGoogleUser: user.googleUser || false,
    organizationId: user.organizationId || null,
  };
}

const generateStepData = (user, roleKey) => ({
  step1: {
    fullName: user.name,
    email: user.email,
    role:
      roleKey === "student"
        ? "Student"
        : roleKey === "trainer"
          ? "Trainer"
          : roleKey === "admin"
            ? "Administrator"
            : "Business Owner",
    registrationDate: user.joinDate,
  },
  step2: {
    orgName: user.org !== "—" ? user.org : "—",
    department: "—",
    industry: "—",
    experience: "—",
    skills: [],
    linkedIn: "—",
  },
  step3: {
    aadhaarStatus: "—",
    resumeStatus: "—",
    certificateCount: 0,
    verificationStatus: user.status === "Completed" ? "Approved" : "Pending",
    uploadedDocs: [],
  },
  step4: {
    plan: user.subscription,
    paymentStatus: user.subscription !== "Free" ? "Active" : "N/A",
    billingDate: "—",
    planFeatures: ["Basic features"],
    amount: "Free",
  },
  step5: {
    profileCompletion: Math.round((user.step / 6) * 100),
    dashboardAccess: user.step >= 5,
    permissions: ["Dashboard"],
    teamSize: "Individual",
    language: "English",
    notifications: true,
  },
  step6: {
    approvalStatus: user.status === "Completed" ? "Approved" : "Pending",
    activeStatus: user.active,
    adminNotes:
      user.status === "Completed"
        ? "Google account verified. Onboarding completed."
        : "Awaiting onboarding completion.",
    completionDate: user.status === "Completed" ? user.joinDate : "—",
    finalReview: user.status === "Completed" ? "Passed" : "Pending",
    reviewer: "System",
  },
});

// ─── SHARED ATOMS ─────────────────────────────────────────────────────────────
const Avatar = ({ name, color, size = 32 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: color + "22",
      border: `2px solid ${color}44`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.31,
      fontWeight: 700,
      color,
      flexShrink: 0,
      letterSpacing: "-0.3px",
    }}
  >
    {(name || "?")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()}
  </div>
);

const InfoRow = ({ Icon: Ic, label, value, accent }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 9,
      padding: "8px 0",
      borderBottom: "1px solid #f1f5f9",
    }}
  >
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        background: accent + "15",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: 1,
      }}
    >
      <Ic size={11} color={accent} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontSize: 9.5,
          fontWeight: 600,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#1e293b",
          marginTop: 1,
          wordBreak: "break-word",
        }}
      >
        {value || "—"}
      </div>
    </div>
  </div>
);

const SectionCard = ({ title, Icon: Ic, color, children }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 10,
      border: "1px solid #e8edf3",
      overflow: "hidden",
      marginBottom: 9,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 11px",
        background: color + "07",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          background: color + "1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ic size={10} color={color} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>
        {title}
      </span>
    </div>
    <div style={{ padding: "2px 11px 5px" }}>{children}</div>
  </div>
);

const OnboardingAnswersCard = ({ user, color }) => {
  const answers = user.onboardingAnswers || {};
  const stepLabels = STEP_LABELS[user.roleKey] || STEP_LABELS.student;
  const hasAnswers = Object.keys(answers).length > 0;
  return (
    <SectionCard
      title="Onboarding Responses"
      Icon={MessageSquare}
      color={color}
    >
      {!hasAnswers ? (
        <div
          style={{
            padding: "14px 0",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: 12,
          }}
        >
          No onboarding answers recorded.
        </div>
      ) : (
        Object.entries(answers)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([stepKey, selections]) => (
            <div
              key={stepKey}
              style={{ padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: 5,
                }}
              >
                {stepLabels[stepKey] || stepKey}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {(Array.isArray(selections) ? selections : []).map((sel, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: 20,
                      background: color + "15",
                      color,
                      border: `1px solid ${color}30`,
                    }}
                  >
                    {sel}
                  </span>
                ))}
              </div>
            </div>
          ))
      )}
    </SectionCard>
  );
};

// ─── STEP PANELS ──────────────────────────────────────────────────────────────
const Step1Panel = ({ data, color }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
    <SectionCard title="Personal Details" Icon={User} color={color}>
      <InfoRow
        Icon={User}
        label="Full Name"
        value={data.fullName}
        accent={color}
      />
      <InfoRow Icon={Mail} label="Email" value={data.email} accent={color} />
    </SectionCard>
    <SectionCard title="Account Info" Icon={Hash} color={color}>
      <InfoRow Icon={Briefcase} label="Role" value={data.role} accent={color} />
      <InfoRow
        Icon={Calendar}
        label="Registered"
        value={data.registrationDate}
        accent={color}
      />
    </SectionCard>
  </div>
);
const Step2Panel = ({ data, color }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
    <SectionCard title="Organization" Icon={Building2} color={color}>
      <InfoRow
        Icon={Building2}
        label="Company / Institute"
        value={data.orgName}
        accent={color}
      />
      <InfoRow
        Icon={Layers}
        label="Department"
        value={data.department}
        accent={color}
      />
      <InfoRow
        Icon={Globe}
        label="Industry"
        value={data.industry}
        accent={color}
      />
      <InfoRow
        Icon={TrendingUp}
        label="Experience"
        value={data.experience}
        accent={color}
      />
    </SectionCard>
    <SectionCard title="Skills & Profile" Icon={Star} color={color}>
      <div style={{ padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
        <div
          style={{
            fontSize: 9.5,
            fontWeight: 600,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            marginBottom: 5,
          }}
        >
          Skills
        </div>
        {data.skills && data.skills.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {data.skills.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "2px 7px",
                  borderRadius: 20,
                  background: color + "15",
                  color,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        ) : (
          <span style={{ fontSize: 11, color: "#94a3b8" }}>—</span>
        )}
      </div>
      <InfoRow
        Icon={Globe}
        label="LinkedIn"
        value={data.linkedIn}
        accent={color}
      />
    </SectionCard>
  </div>
);
const Step3Panel = ({ data, color }) => {
  const vs = {
    Approved: { bg: "#d1fae5", c: "#065f46" },
    "Under Review": { bg: "#fef3c7", c: "#92400e" },
    Pending: { bg: "#f3f4f6", c: "#6b7280" },
  }[data.verificationStatus] || { bg: "#f3f4f6", c: "#6b7280" };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <SectionCard title="Document Status" Icon={ShieldCheck} color={color}>
        <InfoRow
          Icon={ShieldCheck}
          label="Aadhaar / ID"
          value={data.aadhaarStatus}
          accent={color}
        />
        <InfoRow
          Icon={FileText}
          label="Resume"
          value={data.resumeStatus}
          accent={color}
        />
        <InfoRow
          Icon={Award}
          label="Certificates"
          value={`${data.certificateCount} uploaded`}
          accent={color}
        />
        <div style={{ padding: "7px 0" }}>
          <div
            style={{
              fontSize: 9.5,
              fontWeight: 600,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 4,
            }}
          >
            Verification
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 20,
              background: vs.bg,
              color: vs.c,
            }}
          >
            {data.verificationStatus}
          </span>
        </div>
      </SectionCard>
      <SectionCard title="Uploaded Docs" Icon={Upload} color={color}>
        {data.uploadedDocs.length > 0 ? (
          data.uploadedDocs.map((doc, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 0",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 5,
                  background: color + "15",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileText size={10} color={color} />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#334155",
                  flex: 1,
                }}
              >
                {doc}
              </span>
              <CheckCircle size={11} color="#10b981" />
            </div>
          ))
        ) : (
          <div
            style={{
              padding: "14px 0",
              textAlign: "center",
              color: "#94a3b8",
              fontSize: 12,
            }}
          >
            No documents uploaded
          </div>
        )}
      </SectionCard>
    </div>
  );
};
const Step4Panel = ({ data, color }) => {
  const pc = {
    Enterprise: { bg: "#dbeafe", c: "#1d4ed8" },
    Pro: { bg: "#ede9fe", c: "#6d28d9" },
    Free: { bg: "#f3f4f6", c: "#374151" },
  }[data.plan] || { bg: "#f3f4f6", c: "#374151" };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <SectionCard title="Plan Details" Icon={CreditCard} color={color}>
        <div style={{ padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
          <div
            style={{
              fontSize: 9.5,
              fontWeight: 600,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 4,
            }}
          >
            Current Plan
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Crown size={13} color={pc.c} />
            <span style={{ fontSize: 14, fontWeight: 800, color: pc.c }}>
              {data.plan}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#64748b",
                marginLeft: "auto",
              }}
            >
              {data.amount}
            </span>
          </div>
        </div>
        <InfoRow
          Icon={CheckSquare}
          label="Payment Status"
          value={data.paymentStatus}
          accent={color}
        />
        <InfoRow
          Icon={Calendar}
          label="Billing Date"
          value={data.billingDate}
          accent={color}
        />
      </SectionCard>
      <SectionCard title="Plan Features" Icon={Star} color={color}>
        <div style={{ paddingTop: 4 }}>
          {data.planFeatures.map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 0",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <CheckCircle size={10} color="#10b981" />
              <span style={{ fontSize: 11, color: "#334155", fontWeight: 500 }}>
                {f}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};
const Step5Panel = ({ data, color }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
    <SectionCard title="Platform Access" Icon={Settings} color={color}>
      <div style={{ padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
        <div
          style={{
            fontSize: 9.5,
            fontWeight: 600,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            marginBottom: 4,
          }}
        >
          Profile Completion
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              flex: 1,
              height: 5,
              borderRadius: 3,
              background: "#e2e8f0",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${data.profileCompletion}%`,
                background: color,
                borderRadius: 3,
              }}
            />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color }}>
            {data.profileCompletion}%
          </span>
        </div>
      </div>
      <InfoRow
        Icon={CheckCircle}
        label="Dashboard Access"
        value={data.dashboardAccess ? "Granted" : "Restricted"}
        accent={color}
      />
      <InfoRow
        Icon={Users}
        label="Team Size"
        value={data.teamSize}
        accent={color}
      />
    </SectionCard>
    <SectionCard title="Permissions" Icon={Lock} color={color}>
      <div style={{ padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
        <div
          style={{
            fontSize: 9.5,
            fontWeight: 600,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            marginBottom: 5,
          }}
        >
          Granted Permissions
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {data.permissions.map((p) => (
            <span
              key={p}
              style={{
                fontSize: 9.5,
                fontWeight: 600,
                padding: "2px 6px",
                borderRadius: 20,
                background: color + "15",
                color,
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
      <InfoRow
        Icon={Globe}
        label="Language"
        value={data.language}
        accent={color}
      />
      <InfoRow
        Icon={Bell}
        label="Notifications"
        value={data.notifications ? "On" : "Off"}
        accent={color}
      />
    </SectionCard>
  </div>
);
const Step6Panel = ({ data, color }) => {
  const ac = {
    Approved: { bg: "#d1fae5", c: "#065f46" },
    "Under Review": { bg: "#fef3c7", c: "#92400e" },
    Pending: { bg: "#f3f4f6", c: "#6b7280" },
  }[data.approvalStatus] || { bg: "#f3f4f6", c: "#6b7280" };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <SectionCard title="Approval Details" Icon={BadgeCheck} color={color}>
        <div style={{ padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
          <div
            style={{
              fontSize: 9.5,
              fontWeight: 600,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 4,
            }}
          >
            Status
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 20,
              background: ac.bg,
              color: ac.c,
            }}
          >
            {data.approvalStatus}
          </span>
        </div>
        <InfoRow
          Icon={Activity}
          label="Account"
          value={data.activeStatus ? "Active" : "Inactive"}
          accent={color}
        />
        <InfoRow
          Icon={Calendar}
          label="Completion Date"
          value={data.completionDate}
          accent={color}
        />
        <InfoRow
          Icon={CheckSquare}
          label="Final Review"
          value={data.finalReview}
          accent={color}
        />
      </SectionCard>
      <SectionCard title="Review Notes" Icon={FileText} color={color}>
        <InfoRow
          Icon={User}
          label="Reviewed By"
          value={data.reviewer}
          accent={color}
        />
        <div style={{ padding: "7px 0" }}>
          <div
            style={{
              fontSize: 9.5,
              fontWeight: 600,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 4,
            }}
          >
            Admin Notes
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#475569",
              lineHeight: 1.6,
              background: "#f8fafc",
              padding: "7px 9px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
            }}
          >
            {data.adminNotes}
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

// ─── STEPPER ──────────────────────────────────────────────────────────────────
const Stepper = ({ currentStep, userStep, color, onStepClick }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      padding: "10px 14px",
      background: "#f8fafc",
      borderBottom: "1px solid #e8edf3",
      overflowX: "auto",
      flexShrink: 0,
    }}
  >
    {STEP_DEFS.map((s, i) => {
      const done = s.num <= userStep,
        active = s.num === currentStep,
        Ic = s.Icon;
      return (
        <React.Fragment key={s.num}>
          <button
            onClick={() => onStepClick(s.num)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: "3px",
              borderRadius: 8,
              minWidth: 46,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: active ? color : done ? color + "20" : "#e2e8f0",
                border: `2px solid ${active ? color : done ? color + "50" : "#e2e8f0"}`,
                transition: "all 0.2s",
              }}
            >
              {done && !active ? (
                <CheckCircle size={12} color={color} />
              ) : (
                <Ic
                  size={11}
                  color={active ? "#fff" : done ? color : "#94a3b8"}
                />
              )}
            </div>
            <div
              style={{
                fontSize: 8,
                fontWeight: active ? 700 : 500,
                color: active ? color : done ? "#475569" : "#94a3b8",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {s.label}
            </div>
          </button>
          {i < STEP_DEFS.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 1.5,
                minWidth: 4,
                background: i < userStep - 1 ? color + "40" : "#e2e8f0",
                margin: "0 1px 12px",
              }}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── PROFILE FIELD CONFIGS ────────────────────────────────────────────────────
const STUDENT_PROFILE_FIELDS = [
  { key: "mobileNumber", label: "Mobile Number", Icon: Phone },
  { key: "dateOfBirth", label: "Date of Birth", Icon: Calendar },
  { key: "gender", label: "Gender", Icon: User },
  { key: "city", label: "City", Icon: MapPin },
  { key: "state", label: "State", Icon: MapPin },
  { key: "country", label: "Country", Icon: Globe },
  { key: "qualification", label: "Qualification", Icon: GraduationCap },
  { key: "collegeName", label: "College / Institute", Icon: Building2 },
  { key: "yearOfPassing", label: "Year of Passing", Icon: Calendar },
  { key: "domain", label: "Domain / Area", Icon: Briefcase },
  { key: "experience", label: "Experience", Icon: TrendingUp },
];
const TRAINER_PROFILE_FIELDS = [
  { key: "linkedinUrl", label: "LinkedIn URL", Icon: Globe },
  { key: "country", label: "Country", Icon: MapPin },
  { key: "courseTopic", label: "Course Topic", Icon: GraduationCap },
  { key: "audienceSize", label: "Audience Size", Icon: Users },
  { key: "fullTimeRole", label: "Full-Time Role?", Icon: Briefcase },
  { key: "platforms", label: "Platforms", Icon: Layers, isArray: true },
];
const ADMIN_PROFILE_FIELDS = [
  { key: "mobileNumber", label: "Mobile Number", Icon: Phone },
  { key: "employeeId", label: "Employee ID", Icon: Hash },
  { key: "adminType", label: "Admin Type", Icon: Shield },
  { key: "department", label: "Department", Icon: Building2 },
  { key: "location", label: "Location", Icon: MapPin },
];
const BUSINESS_PROFILE_FIELDS = [
  { key: "organizationName", label: "Organization Name", Icon: Building2 },
  { key: "domain", label: "Domain", Icon: Globe },
  { key: "contactEmail", label: "Contact Email", Icon: Mail },
  { key: "location", label: "Location", Icon: MapPin },
  { key: "industry", label: "Industry", Icon: Briefcase },
  { key: "mobileNumber", label: "Mobile Number", Icon: Phone },
  { key: "description", label: "Description", Icon: FileText },
  { key: "plan", label: "Plan", Icon: CreditCard, locked: true },
  { key: "status", label: "Status", Icon: Activity, locked: true },
  { key: "planExpiryDate", label: "Plan Expiry", Icon: Calendar, locked: true },
  { key: "maxStudents", label: "Max Students", Icon: Users, locked: true },
  { key: "maxTrainers", label: "Max Trainers", Icon: Users, locked: true },
];

function getFieldsForRole(roleKey) {
  switch (roleKey) {
    case "trainer":
      return TRAINER_PROFILE_FIELDS;
    case "admin":
      return ADMIN_PROFILE_FIELDS;
    case "business":
      return BUSINESS_PROFILE_FIELDS;
    default:
      return STUDENT_PROFILE_FIELDS;
  }
}

function getServiceMethodsForRole(roleKey) {
  switch (roleKey) {
    case "trainer":
      return {
        get: (e) => userService.getTrainerProfileByEmail(e),
        put: (e, d) => userService.updateTrainerProfileByEmail(e, d),
      };
    case "admin":
    case "business":
      return {
        get: (e) => userService.getAdminProfileByEmail(e),
        put: (e, d) => userService.updateAdminProfileByEmail(e, d),
      };
    default:
      return {
        get: (e) => userService.getStudentProfileByEmail(e),
        put: (e, d) => userService.updateStudentProfileByEmail(e, d),
      };
  }
}

// ─── PROFILE DETAILS CARD ─────────────────────────────────────────────────────
const ProfileDetailsCard = ({ email, color, roleKey }) => {
  const [profileDetails, setProfileDetails] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fields = getFieldsForRole(roleKey);
  const { get: fetchProfile, put: saveProfile } =
    getServiceMethodsForRole(roleKey);

  useEffect(() => {
    if (!email) return;
    setProfileLoading(true);
    setProfileError(null);
    fetchProfile(email)
      .then((res) => {
        setProfileDetails(res.data || {});
        setDraft(res.data || {});
      })
      .catch(() => {
        setProfileError("Could not load profile details.");
        setProfileDetails({});
        setDraft({});
      })
      .finally(() => setProfileLoading(false));
  }, [email, roleKey]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await saveProfile(email, draft);
      setProfileDetails(res.data || draft);
      setDraft(res.data || draft);
      setEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "5px 8px",
    borderRadius: 7,
    border: `1.5px solid ${color}40`,
    fontSize: 11,
    background: color + "06",
    color: "#1e293b",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        border: "1px solid #e8edf3",
        overflow: "hidden",
        marginBottom: 9,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 11px",
          background: color + "07",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              background: color + "1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={10} color={color} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>
            Profile Details
          </span>
          {saveSuccess && (
            <span
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: 20,
                background: "#d1fae5",
                color: "#065f46",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <CheckCircle size={9} /> Saved
            </span>
          )}
        </div>
        {!editing ? (
          <button
            onClick={() => {
              setDraft({ ...profileDetails });
              setSaveSuccess(false);
              setEditing(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 10,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 6,
              border: `1px solid ${color}40`,
              background: color + "10",
              color,
              cursor: "pointer",
            }}
          >
            <Pencil size={9} /> Edit
          </button>
        ) : (
          <div style={{ display: "flex", gap: 5 }}>
            <button
              onClick={() => {
                setDraft({ ...profileDetails });
                setEditing(false);
              }}
              disabled={saving}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                fontSize: 10,
                fontWeight: 700,
                padding: "4px 9px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                background: "#fff",
                color: "#64748b",
                cursor: "pointer",
              }}
            >
              <X size={9} /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                fontSize: 10,
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 6,
                border: "none",
                background: color,
                color: "#fff",
                cursor: "pointer",
                opacity: saving ? 0.65 : 1,
              }}
            >
              {saving ? (
                <>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      border: "1.5px solid rgba(255,255,255,0.3)",
                      borderTop: "1.5px solid #fff",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />{" "}
                  Saving…
                </>
              ) : (
                <>
                  <Save size={9} /> Save
                </>
              )}
            </button>
          </div>
        )}
      </div>
      <div style={{ padding: "10px 11px" }}>
        {profileLoading ? (
          <div
            style={{
              padding: "18px 0",
              textAlign: "center",
              color: "#94a3b8",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                border: "2px solid #e2e8f0",
                borderTop: `2px solid ${color}`,
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }}
            />
            Loading profile details…
          </div>
        ) : profileError ? (
          <div
            style={{
              padding: "14px 0",
              textAlign: "center",
              color: "#ef4444",
              fontSize: 11,
            }}
          >
            {profileError}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px 14px",
            }}
          >
            {fields.map(({ key, label, Icon: Ic, isArray }) => (
              <div key={key}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 3,
                  }}
                >
                  <Ic size={9} color="#94a3b8" />
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 600,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {label}
                  </span>
                </div>
                {editing ? (
                  <input
                    value={
                      isArray
                        ? Array.isArray(draft[key])
                          ? draft[key].join(", ")
                          : draft[key] || ""
                        : draft[key] || ""
                    }
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        [key]: isArray
                          ? e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean)
                          : e.target.value,
                      }))
                    }
                    placeholder={isArray ? "comma-separated values" : ""}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = color)}
                    onBlur={(e) => (e.target.style.borderColor = color + "40")}
                  />
                ) : (
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: profileDetails?.[key] ? "#1e293b" : "#cbd5e1",
                      padding: "4px 0",
                      borderBottom: "1px solid #f8fafc",
                    }}
                  >
                    {isArray
                      ? Array.isArray(profileDetails?.[key])
                        ? profileDetails[key].join(", ")
                        : profileDetails?.[key] || "—"
                      : profileDetails?.[key] || "—"}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── USER VIEW ────────────────────────────────────────────────────────────────
const UserView = ({ user, onEdit, onDelete, onToggle }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const sd = generateStepData(user, user.roleKey);
  const cfg = ROLE_CONFIG[user.roleKey] || ROLE_CONFIG.student;
  const color = cfg.color;
  const pct = Math.round((user.step / 6) * 100);
  const panels = [
    Step1Panel,
    Step2Panel,
    Step3Panel,
    Step4Panel,
    Step5Panel,
    Step6Panel,
  ];
  const Panel = panels[currentStep - 1];
  const panelData = [
    sd.step1,
    sd.step2,
    sd.step3,
    sd.step4,
    sd.step5,
    sd.step6,
  ][currentStep - 1];

  // Show feature controls for trainers with no org
  // const isOutsideTrainer = user.roleKey === "trainer" && !user.organizationId;
  const isStandaloneUser = !user.organizationId;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Hero header */}
      <div
        style={{
          padding: "14px 16px",
          background: `linear-gradient(135deg,${color}f0,${color}a0)`,
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
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <Avatar name={user.name} color="rgba(255,255,255,0.95)" size={40} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#fff",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.name}
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: "rgba(255,255,255,0.72)",
                marginTop: 1,
              }}
            >
              {user.email} · #{user.id}
            </div>
          </div>
          {user.isGoogleUser && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.22)",
                color: "#fff",
              }}
            >
              Google
            </span>
          )}
          {isStandaloneUser && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.35)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.4)",
              }}
            >
              No Org
            </span>
          )}
        </div>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 9 }}
        >
          {[user.status, user.subscription, `Step ${user.step}/6`].map((t) => (
            <span
              key={t}
              style={{
                fontSize: 9.5,
                fontWeight: 600,
                padding: "2px 7px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.22)",
                color: "#fff",
              }}
            >
              {t}
            </span>
          ))}
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              padding: "2px 7px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.35)",
              color: "#fff",
            }}
          >
            {user.role}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 5,
              borderRadius: 3,
              background: "rgba(255,255,255,0.22)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: "rgba(255,255,255,0.88)",
                borderRadius: 3,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            {pct}%
          </span>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {[
            {
              label: user.active ? "Active" : "Inactive",
              icon: user.active ? CheckCircle : XCircle,
              onClick: () => onToggle(user.id),
              danger: false,
            },
            { label: "Edit", icon: Pencil, onClick: onEdit, danger: false },
            { label: "Delete", icon: Trash2, onClick: onDelete, danger: true },
          ].map(({ label, icon: Ic, onClick, danger }) => (
            <button
              key={label}
              onClick={onClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "5px 10px",
                borderRadius: 7,
                background: danger
                  ? "rgba(239,68,68,0.28)"
                  : "rgba(255,255,255,0.18)",
                border: `1px solid ${danger ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.3)"}`,
                color: "#fff",
                fontSize: 10.5,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Ic size={11} /> {label}
            </button>
          ))}
        </div>
      </div>

      <Stepper
        currentStep={currentStep}
        userStep={user.step}
        color={color}
        onStepClick={setCurrentStep}
      />

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "11px 13px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginBottom: 9,
            paddingBottom: 7,
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          {React.createElement(STEP_DEFS[currentStep - 1].Icon, {
            size: 12,
            color,
          })}
          <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>
            Step {currentStep} — {STEP_DEFS[currentStep - 1].label}
          </span>
          <span style={{ fontSize: 10, color: "#94a3b8" }}>
            {STEP_DEFS[currentStep - 1].desc}
          </span>
        </div>

        <Panel data={panelData} color={color} />

        <div style={{ marginTop: 4 }}>
          <ProfileDetailsCard
            email={user.email}
            color={color}
            roleKey={user.roleKey}
          />
        </div>

        <div style={{ marginTop: 4 }}>
          <OnboardingAnswersCard user={user} color={color} />
        </div>

        {/* CHANGE: pass userRole so drawer only shows that role's tab */}
        {isStandaloneUser && (
          <FeatureControlsSection
            // userId={user.id}
            userEmail={user.email}
            color={color}
            userRole={user.roleKey}
          />
        )}
      </div>

      {/* Bottom nav */}
      <div
        style={{
          padding: "9px 13px",
          borderTop: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fafafa",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
          disabled={currentStep === 1}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "5px 11px",
            borderRadius: 7,
            border: "1px solid #e2e8f0",
            background: "#fff",
            color: "#475569",
            fontSize: 11,
            fontWeight: 600,
            cursor: currentStep === 1 ? "not-allowed" : "pointer",
            opacity: currentStep === 1 ? 0.4 : 1,
          }}
        >
          <ChevronLeft size={13} /> Prev
        </button>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>
          {currentStep} / 6
        </span>
        <button
          onClick={() => setCurrentStep((s) => Math.min(6, s + 1))}
          disabled={currentStep === 6}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "5px 11px",
            borderRadius: 7,
            border: "none",
            background: color,
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            cursor: currentStep === 6 ? "not-allowed" : "pointer",
            opacity: currentStep === 6 ? 0.5 : 1,
          }}
        >
          Next <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

// ─── USER FORM ────────────────────────────────────────────────────────────────
const UserForm = ({ user, onSave, onCancel }) => {
  const isEdit = !!user;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    status: user?.status || "Pending",
    subscription: user?.subscription || "Free",
    active: user?.active ?? true,
    roleKey: user?.roleKey || "student",
    role: user?.role || "Student",
  });
  const cfg = ROLE_CONFIG[form.roleKey] || ROLE_CONFIG.student;
  const color = cfg.color;
  const inputStyle = (c) => ({
    width: "100%",
    padding: "9px 11px",
    borderRadius: 9,
    border: `1.5px solid ${c}30`,
    fontSize: 13,
    outline: "none",
    color: "#1e293b",
    background: c + "06",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "15px 16px",
          background: `linear-gradient(135deg,${color}f0,${color}a0)`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isEdit ? (
              <Pencil size={17} color="#fff" />
            ) : (
              <Plus size={17} color="#fff" />
            )}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>
              {isEdit ? "Edit User" : "Add New User"}
            </div>
            {isEdit && (
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>
                ID: {user.id}
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "15px 15px 6px" }}>
        {!isEdit && (
          <div style={{ marginBottom: 15 }}>
            <label
              style={{
                display: "block",
                fontSize: 10,
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 7,
              }}
            >
              User Type
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
              }}
            >
              {Object.entries(ROLE_CONFIG)
                .filter(([key]) => key !== "business")
                .map(([key, rc]) => (
                  <button
                    key={key}
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        roleKey: key,
                        role: rc.label.slice(0, -1),
                      }))
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "7px 9px",
                      borderRadius: 9,
                      border: `2px solid ${form.roleKey === key ? rc.color : "#e2e8f0"}`,
                      background:
                        form.roleKey === key ? rc.color + "0d" : "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 5,
                        background: rc.color + "20",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {React.createElement(rc.Icon, {
                        size: 10,
                        color: rc.color,
                      })}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: form.roleKey === key ? rc.color : "#475569",
                      }}
                    >
                      {rc.label.slice(0, -1)}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        )}
        {!isEdit && form.roleKey === "admin" && (
          <div
            style={{
              background: "#eef2ff",
              border: "1.5px solid #6366f140",
              borderRadius: 10,
              padding: "14px 14px",
              marginBottom: 14,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#4338ca",
                marginBottom: 8,
              }}
            >
              Admin users are created via Organization
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 12 }}>
              Creating an Admin automatically creates their Organization.
            </div>
            <button
              onClick={() => {
                onCancel();
                navigate("/superadmin/organizations/new");
              }}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Go to Create Organization →
            </button>
          </div>
        )}
        {[
          {
            label: "Full Name",
            key: "name",
            type: "text",
            placeholder: "Enter full name...",
          },
          {
            label: "Email Address",
            key: "email",
            type: "email",
            placeholder: "Enter email address...",
          },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key} style={{ marginBottom: 13 }}>
            <label
              style={{
                display: "block",
                fontSize: 10,
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 5,
              }}
            >
              {label}
            </label>
            <input
              type={type}
              value={form[key]}
              placeholder={placeholder}
              onChange={(e) =>
                setForm((f) => ({ ...f, [key]: e.target.value }))
              }
              style={inputStyle(color)}
              onFocus={(e) => {
                e.target.style.borderColor = color;
                e.target.style.background = color + "0d";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = color + "30";
                e.target.style.background = color + "06";
              }}
            />
          </div>
        ))}
        {!isEdit && form.roleKey !== "admin" && (
          <div style={{ marginBottom: 13 }}>
            <label
              style={{
                display: "block",
                fontSize: 10,
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 5,
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={form.password}
              placeholder="Enter password..."
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              style={inputStyle(color)}
              onFocus={(e) => {
                e.target.style.borderColor = color;
                e.target.style.background = color + "0d";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = color + "30";
                e.target.style.background = color + "06";
              }}
            />
          </div>
        )}
        {form.roleKey !== "admin" && (
          <div
            style={{
              background: color + "0a",
              border: `1px solid ${color}25`,
              borderRadius: 11,
              padding: "11px 12px",
              marginTop: 4,
            }}
          >
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                color,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 8,
              }}
            >
              Preview
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Avatar name={form.name || "New User"} color={color} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#1e293b",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {form.name || "Name not set"}
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    color: "#64748b",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {form.email || "email@example.com"}
                </div>
                <div style={{ marginTop: 4 }}>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 600,
                      padding: "1px 6px",
                      borderRadius: 20,
                      background: color + "15",
                      color,
                    }}
                  >
                    {form.roleKey === "student"
                      ? "Student"
                      : form.roleKey === "trainer"
                        ? "Trainer"
                        : "User"}
                  </span>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 600,
                      padding: "1px 6px",
                      borderRadius: 20,
                      background: "#f1f5f9",
                      color: "#64748b",
                      marginLeft: 4,
                    }}
                  >
                    Free
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          padding: "11px 15px",
          borderTop: "1px solid #f1f5f9",
          display: "flex",
          gap: 8,
          background: "#fafafa",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "9px",
            borderRadius: 9,
            border: "1px solid #e2e8f0",
            background: "#fff",
            color: "#475569",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          style={{
            flex: 2,
            padding: "9px",
            borderRadius: 9,
            border: "none",
            background: `linear-gradient(135deg,${color},${color}cc)`,
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {isEdit ? "Save Changes" : "Add User"}
        </button>
      </div>
    </div>
  );
};

// ─── RIGHT PANEL SHELL ────────────────────────────────────────────────────────
const RightPanel = ({
  visible,
  width,
  onClose,
  onDragStart,
  title,
  children,
}) => (
  <div
    style={{
      width,
      flexShrink: 0,
      height: "100vh",
      transform: visible ? "translateX(0)" : "translateX(105%)",
      transition:
        "transform 0.28s cubic-bezier(0.4,0,0.2,1), box-shadow 0.28s ease",
      background: "#fff",
      borderLeft: "1px solid #e2e8f0",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
      boxShadow: visible ? "-10px 0 40px rgba(0,0,0,0.12)" : "none",
    }}
  >
    <div
      onMouseDown={onDragStart}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 7,
        height: "100%",
        cursor: "col-resize",
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(99,102,241,0.12)";
        e.currentTarget.querySelector("div").style.background = "#6366f1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.querySelector("div").style.background = "#d1d5db";
      }}
    >
      <div
        style={{
          width: 3,
          height: 44,
          borderRadius: 4,
          background: "#d1d5db",
          transition: "background 0.2s",
        }}
      />
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "9px 13px 9px 20px",
        borderBottom: "1px solid #f1f5f9",
        background: "#fafafa",
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <GripVertical size={13} color="#c0cad8" />
        <span style={{ fontSize: 11.5, fontWeight: 700, color: "#374151" }}>
          {title}
        </span>
      </div>
      <button
        onClick={onClose}
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          border: "1px solid #e2e8f0",
          background: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <X size={12} color="#64748b" />
      </button>
    </div>
    <div
      style={{
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  </div>
);

// ─── DELETE CONFIRM ───────────────────────────────────────────────────────────
const DeleteOverlay = ({ user, onConfirm, onCancel }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,42,0.5)",
      zIndex: 1200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 22,
        maxWidth: 300,
        width: "90%",
        boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: "#fee2e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 10px",
          }}
        >
          <Trash2 size={20} color="#dc2626" />
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>
          Delete User?
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#64748b",
            marginTop: 4,
            lineHeight: 1.5,
          }}
        >
          Permanently delete <strong>{user?.name}</strong>? This cannot be
          undone.
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: 9,
            border: "1px solid #e2e8f0",
            background: "#f8fafc",
            color: "#475569",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: 9,
            border: "none",
            background: "linear-gradient(135deg,#ef4444,#dc2626)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function OnboardingManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    byRole: {},
  });
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All Roles");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterSub, setFilterSub] = useState("All Plans");
  const [filterActive, setFilterActive] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [panelMode, setPanelMode] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelWidth, setPanelWidth] = useState(480);
  const [deleteUser, setDeleteUser] = useState(null);

  useEffect(() => {
    authService
      .getOnboardingResponses()
      .then((data) => {
        setUsers((data.users || []).map(mapBackendUser));
        setSummary(
          data.summary || { total: 0, completed: 0, pending: 0, byRole: {} },
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setApiError("Failed to load onboarding data. Please try again.");
        setLoading(false);
      });
  }, []);

  const dragRef = useRef({ dragging: false, startX: 0, startW: 0 });
  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.dragging) return;
      setPanelWidth(
        Math.max(
          360,
          Math.min(
            760,
            dragRef.current.startW + (dragRef.current.startX - e.clientX),
          ),
        ),
      );
    };
    const onUp = () => {
      if (dragRef.current.dragging) {
        dragRef.current.dragging = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const onDragStart = (e) => {
    e.preventDefault();
    dragRef.current = { dragging: true, startX: e.clientX, startW: panelWidth };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const openPanel = (mode, user = null) => {
    setActiveUser(user);
    setPanelMode(mode);
    if (!panelOpen) {
      setPanelOpen(true);
      setTimeout(() => setPanelVisible(true), 10);
    } else {
      setPanelMode(mode);
      setActiveUser(user);
    }
  };

  const closePanel = () => {
    setPanelVisible(false);
    setTimeout(() => {
      setPanelOpen(false);
      setPanelMode(null);
      setActiveUser(null);
    }, 300);
  };

  const panelTitle =
    panelMode === "view"
      ? "User Details"
      : panelMode === "edit"
        ? "Edit User"
        : panelMode === "add"
          ? "Add New User"
          : "";

  const total = users.length;
  const completed = users.filter((u) => u.status === "Completed").length;
  const inProgress = users.filter((u) => u.status === "In Progress").length;
  const pending = users.filter((u) => u.status === "Pending").length;
  const overallPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (!search ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)) &&
      (filterRole === "All Roles" || u.role === filterRole) &&
      (filterStatus === "All Status" || u.status === filterStatus) &&
      (filterSub === "All Plans" || u.subscription === filterSub) &&
      (filterActive === "All" ||
        (filterActive === "Active" ? u.active : !u.active))
    );
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSave = (form) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === activeUser?.id ? { ...u, ...form } : u)),
    );
    setActiveUser((prev) => (prev ? { ...prev, ...form } : prev));
    setPanelMode("view");
  };

  const handleAdd = async (form) => {
    const roleMap = { student: "STUDENT", trainer: "TRAINER", admin: "ADMIN" };
    try {
      await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: roleMap[form.roleKey] || "STUDENT",
      });
      closePanel();
      authService
        .getOnboardingResponses()
        .then((data) => setUsers((data.users || []).map(mapBackendUser)));
    } catch (err) {
      alert(
        "Failed to create user: " +
          (err?.response?.data?.message || err.message),
      );
    }
  };

  const handleDelete = async () => {
    try {
      await authService.deleteUser(deleteUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteUser?.id));
      if (activeUser?.id === deleteUser?.id) closePanel();
      setDeleteUser(null);
    } catch (err) {
      alert(
        "Failed to delete user: " +
          (err?.response?.data?.message || err.message),
      );
      setDeleteUser(null);
    }
  };

  const handleToggle = async (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    try {
      await authService.toggleUserBlock(user.id, user.active);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u)),
      );
      if (activeUser?.id === id)
        setActiveUser((v) => (v ? { ...v, active: !v.active } : v));
    } catch (err) {
      alert("Failed to update user status.");
      console.error(err);
    }
  };

  const liveUser = activeUser
    ? users.find((u) => u.id === activeUser.id) || activeUser
    : null;
  const sel = {
    padding: "6px 9px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    background: "#fff",
    fontSize: 11.5,
    color: "#374151",
    cursor: "pointer",
    outline: "none",
    fontFamily: "inherit",
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: 12,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: "3px solid #e2e8f0",
            borderTop: "3px solid #6366f1",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
          Loading onboarding data…
        </span>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  if (apiError)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: 12,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <AlertCircle size={32} color="#ef4444" />
        <span style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>
          {apiError}
        </span>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "8px 18px",
            borderRadius: 9,
            border: "none",
            background: "#6366f1",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );

  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif",
        background: "#f1f5f9",
        height: "100vh",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <style>{`
        *{box-sizing:border-box;margin:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px;}
        button{font-family:inherit;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes toastSlideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes drawerSlide{from{transform:translateX(100%)}to{transform:translateX(0)}}
      `}</style>

      {/* ── MAIN CONTENT ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          minWidth: 0,
          transition: "all 0.28s ease",
        }}
      >
        <div style={{ padding: "20px 22px" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 19,
                  fontWeight: 700,
                  color: "#0f172a",
                  letterSpacing: "-0.3px",
                }}
              >
                Onboarding Management
              </h1>
              <p style={{ fontSize: 12.5, color: "#64748b", marginTop: 3 }}>
                Track and manage user onboarding across all roles and stages.
              </p>
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 14px",
                  borderRadius: 9,
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  color: "#374151",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Download size={13} /> Export
              </button>
              <button
                onClick={() => openPanel("add")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 14px",
                  borderRadius: 9,
                  border: "none",
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(99,102,241,0.35)",
                }}
              >
                <Plus size={13} /> Add User
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 11,
              marginBottom: 14,
            }}
          >
            {[
              {
                label: "Total Onboarded",
                val: total,
                Icon: Users,
                color: "#6366f1",
                bg: "#eef2ff",
                light: "#e0e7ff",
              },
              {
                label: "Completed",
                val: completed,
                Icon: CheckCircle,
                color: "#10b981",
                bg: "#ecfdf5",
                light: "#d1fae5",
              },
              {
                label: "In Progress",
                val: inProgress,
                Icon: Clock,
                color: "#f59e0b",
                bg: "#fffbeb",
                light: "#fef3c7",
              },
              {
                label: "Pending",
                val: pending,
                Icon: AlertCircle,
                color: "#ef4444",
                bg: "#fff5f5",
                light: "#fee2e2",
              },
            ].map(({ label, val, Icon: Ic, color, bg, light }) => (
              <div
                key={label}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "13px 15px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: -8,
                    top: -8,
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: light,
                    opacity: 0.6,
                  }}
                />
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background: bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                    position: "relative",
                  }}
                >
                  <Ic size={15} color={color} />
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#0f172a",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {val}
                </div>
                <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>
                  {label}
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: color + "30",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${total > 0 ? Math.round((val / total) * 100) : 0}%`,
                      background: color,
                      borderRadius: "0 2px 0 0",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Completion Rate */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "12px 16px",
              border: "1px solid #e5e7eb",
              marginBottom: 14,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 7,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <TrendingUp size={13} color="#6366f1" />
                <span
                  style={{ fontSize: 12.5, fontWeight: 700, color: "#374151" }}
                >
                  Overall Completion Rate
                </span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#6366f1" }}>
                {overallPct}%
              </span>
            </div>
            <div
              style={{
                height: 7,
                borderRadius: 4,
                background: "#e2e8f0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${overallPct}%`,
                  background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
                  borderRadius: 4,
                  transition: "width 0.7s ease",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 5,
                fontSize: 9.5,
                color: "#94a3b8",
              }}
            >
              {["0%", "25%", "50%", "75%", "100%"].map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>

          {/* Role Breakdown */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: 11,
              marginBottom: 18,
            }}
          >
            {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
              const ru = users.filter((u) => u.roleKey === key);
              const Ic = cfg.Icon;
              return (
                <div
                  key={key}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: "11px 13px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginBottom: 9,
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: cfg.color + "1a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ic size={11} color={cfg.color} />
                    </div>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "#374151",
                      }}
                    >
                      {cfg.label}
                    </span>
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: cfg.color,
                        marginLeft: "auto",
                      }}
                    >
                      {ru.length}
                    </span>
                  </div>
                  {[
                    {
                      l: "Done",
                      cnt: ru.filter((u) => u.status === "Completed").length,
                    },
                    {
                      l: "Active",
                      cnt: ru.filter((u) => u.status === "In Progress").length,
                    },
                    {
                      l: "Pending",
                      cnt: ru.filter((u) => u.status === "Pending").length,
                    },
                  ].map(({ l, cnt }) => {
                    const p = ru.length
                      ? Math.round((cnt / ru.length) * 100)
                      : 0;
                    return (
                      <div key={l} style={{ marginBottom: 5 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 1.5,
                          }}
                        >
                          <span style={{ fontSize: 9, color: "#94a3b8" }}>
                            {l}
                          </span>
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              color: cfg.color,
                            }}
                          >
                            {p}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: 3,
                            borderRadius: 2,
                            background: "#f1f5f9",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${p}%`,
                              background: cfg.color,
                              borderRadius: 2,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {/* Share card */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "11px 13px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginBottom: 9,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PieChart size={11} color="#6366f1" />
                </div>
                <span
                  style={{ fontSize: 10.5, fontWeight: 700, color: "#374151" }}
                >
                  Share
                </span>
              </div>
              {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
                const cnt = users.filter((u) => u.roleKey === key).length;
                const p = total > 0 ? Math.round((cnt / total) * 100) : 0;
                return (
                  <div key={key} style={{ marginBottom: 5 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 1.5,
                      }}
                    >
                      <span style={{ fontSize: 9, color: "#94a3b8" }}>
                        {cfg.label}
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: cfg.color,
                        }}
                      >
                        {p}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 3,
                        borderRadius: 2,
                        background: "#f1f5f9",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${p}%`,
                          background: cfg.color,
                          borderRadius: 2,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Users Table */}
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #f1f5f9",
                padding: "0 15px",
                background: "#fafafa",
              }}
            >
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "11px 14px",
                  background: "none",
                  border: "none",
                  borderBottom: "2.5px solid #6366f1",
                  color: "#6366f1",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  marginBottom: -1,
                }}
              >
                <Users size={13} /> All Users
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 800,
                    padding: "1px 6px",
                    borderRadius: 20,
                    background: "#6366f1",
                    color: "#fff",
                    minWidth: 18,
                    textAlign: "center",
                  }}
                >
                  {total}
                </span>
              </button>
            </div>
            {/* Toolbar */}
            <div
              style={{
                padding: "11px 15px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                gap: 7,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flex: 1,
                  minWidth: 180,
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: "5px 9px",
                  background: "#f9fafb",
                }}
              >
                <Search size={12} color="#94a3b8" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by name, email, ID…"
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: 12,
                    color: "#374151",
                    outline: "none",
                    width: "100%",
                    fontFamily: "inherit",
                  }}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      lineHeight: 0,
                    }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              {[
                [
                  filterRole,
                  setFilterRole,
                  ["All Roles", "Student", "Trainer", "Admin", "Business"],
                ],
                [
                  filterStatus,
                  setFilterStatus,
                  ["All Status", "Completed", "In Progress", "Pending"],
                ],
                [
                  filterSub,
                  setFilterSub,
                  ["All Plans", "Free", "Pro", "Enterprise"],
                ],
                [filterActive, setFilterActive, ["All", "Active", "Inactive"]],
              ].map(([val, set, opts], i) => (
                <select
                  key={i}
                  value={val}
                  onChange={(e) => {
                    set(e.target.value);
                    setPage(1);
                  }}
                  style={sel}
                >
                  {opts.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ))}
              <span
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  marginLeft: "auto",
                  whiteSpace: "nowrap",
                }}
              >
                {filtered.length} results
              </span>
            </div>
            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12.5,
                }}
              >
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {[
                      "#",
                      "Name",
                      "Role",
                      "Status",
                      "Progress",
                      "Onboarding Interest",
                      "Join Date",
                      "Plan",
                      "Active",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "8px 11px",
                          textAlign: "left",
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#9ca3af",
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          borderBottom: "1px solid #f1f5f9",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        style={{
                          padding: "30px",
                          textAlign: "center",
                          color: "#9ca3af",
                          fontSize: 12,
                        }}
                      >
                        No users match your filters.
                      </td>
                    </tr>
                  )}
                  {paged.map((user, idx) => {
                    const cfg =
                      ROLE_CONFIG[user.roleKey] || ROLE_CONFIG.student;
                    const ss =
                      STATUS_CONFIG[user.status] || STATUS_CONFIG.Pending;
                    const sub =
                      SUB_CONFIG[user.subscription] || SUB_CONFIG.Free;
                    const isAct = activeUser?.id === user.id && panelOpen;
                    const firstInterest =
                      user.onboardingAnswers?.["step_0"]?.[0] || "—";
                    return (
                      <tr
                        key={user.id}
                        style={{
                          borderBottom: "1px solid #f8fafc",
                          cursor: "pointer",
                          background: isAct ? cfg.color + "0a" : "transparent",
                          transition: "background 0.1s",
                          outline: isAct ? `2px solid ${cfg.color}30` : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (!isAct)
                            e.currentTarget.style.background = "#f9fafb";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isAct
                            ? cfg.color + "0a"
                            : "transparent";
                        }}
                        onClick={() => openPanel("view", user)}
                      >
                        <td
                          style={{
                            padding: "9px 11px",
                            color: "#94a3b8",
                            fontSize: 11,
                          }}
                        >
                          {(page - 1) * perPage + idx + 1}
                        </td>
                        <td style={{ padding: "9px 11px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 7,
                            }}
                          >
                            <Avatar
                              name={user.name}
                              color={cfg.color}
                              size={26}
                            />
                            <div>
                              <div
                                style={{
                                  fontWeight: 600,
                                  color: "#111827",
                                  fontSize: 12,
                                }}
                              >
                                {user.name}
                              </div>
                              <div style={{ fontSize: 10, color: "#94a3b8" }}>
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "9px 11px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              fontSize: 10,
                              fontWeight: 600,
                              padding: "2px 7px",
                              borderRadius: 20,
                              background: cfg.bg,
                              color: cfg.color,
                            }}
                          >
                            {React.createElement(cfg.Icon, { size: 9 })}{" "}
                            {user.role}
                          </span>
                        </td>
                        <td style={{ padding: "9px 11px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              fontSize: 10,
                              fontWeight: 600,
                              padding: "2px 8px",
                              borderRadius: 20,
                              background: ss.bg,
                              color: ss.color,
                            }}
                          >
                            <span
                              style={{
                                width: 4,
                                height: 4,
                                borderRadius: "50%",
                                background: ss.dot,
                                display: "inline-block",
                              }}
                            />{" "}
                            {user.status}
                          </span>
                        </td>
                        <td style={{ padding: "9px 11px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <div
                              style={{
                                height: 3,
                                width: 48,
                                borderRadius: 2,
                                background: "#f1f5f9",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  width: `${(user.step / 6) * 100}%`,
                                  background: cfg.color,
                                  borderRadius: 2,
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: 10,
                                color: "#6b7280",
                                fontWeight: 600,
                              }}
                            >
                              {user.step}/6
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            color: "#6b7280",
                            fontSize: 11,
                            maxWidth: 140,
                          }}
                        >
                          <span
                            style={{
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={firstInterest}
                          >
                            {firstInterest}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            color: "#6b7280",
                            fontSize: 11,
                          }}
                        >
                          {user.joinDate}
                        </td>
                        <td style={{ padding: "9px 11px" }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: "2px 7px",
                              borderRadius: 20,
                              background: sub.bg,
                              color: sub.color,
                            }}
                          >
                            {user.subscription}
                          </span>
                        </td>
                        <td
                          style={{ padding: "9px 11px" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleToggle(user.id)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              padding: "3px 7px",
                              borderRadius: 20,
                              border: `1.5px solid ${user.active ? "#10b98145" : "#e2e8f0"}`,
                              background: user.active ? "#d1fae5" : "#f9fafb",
                              color: user.active ? "#065f46" : "#9ca3af",
                              fontSize: 9.5,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            {user.active ? (
                              <CheckCircle size={9} />
                            ) : (
                              <XCircle size={9} />
                            )}{" "}
                            {user.active ? "Active" : "Off"}
                          </button>
                        </td>
                        <td
                          style={{ padding: "9px 11px" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div style={{ display: "flex", gap: 3 }}>
                            {[
                              {
                                label: "View",
                                ic: Eye,
                                onClick: () => openPanel("view", user),
                                borderC: "#dbeafe",
                                hoverBg: "#dbeafe",
                                textC: "#2563eb",
                                showLabel: true,
                              },
                              {
                                label: "Edit",
                                ic: Pencil,
                                onClick: () => openPanel("edit", user),
                                borderC: "#ffedd5",
                                hoverBg: "#ffedd5",
                                textC: "#ea580c",
                                showLabel: false,
                              },
                              {
                                label: "Del",
                                ic: Trash2,
                                onClick: () => setDeleteUser(user),
                                borderC: "#fee2e2",
                                hoverBg: "#fee2e2",
                                textC: "#dc2626",
                                showLabel: false,
                              },
                            ].map(
                              ({
                                label,
                                ic: Ic2,
                                onClick,
                                borderC,
                                hoverBg,
                                textC,
                                showLabel,
                              }) => (
                                <button
                                  key={label}
                                  onClick={onClick}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 3,
                                    padding: showLabel ? "3px 7px" : "0",
                                    width: showLabel ? "auto" : 22,
                                    height: 22,
                                    borderRadius: 6,
                                    border: `1px solid ${borderC}`,
                                    background: "transparent",
                                    color: textC,
                                    fontSize: 10,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    justifyContent: "center",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = hoverBg)
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                      "transparent")
                                  }
                                >
                                  <Ic2 size={10} /> {showLabel && label}
                                </button>
                              ),
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div
              style={{
                padding: "10px 15px",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 11, color: "#6b7280" }}>
                {filtered.length === 0
                  ? "No results"
                  : `${Math.min((page - 1) * perPage + 1, filtered.length)}–${Math.min(page * perPage, filtered.length)} of ${filtered.length}`}
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "3px 9px",
                    borderRadius: 6,
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    color: "#374151",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    opacity: page === 1 ? 0.4 : 1,
                  }}
                >
                  ← Prev
                </button>
                {Array.from(
                  { length: Math.min(totalPages, 7) },
                  (_, i) => i + 1,
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      border: "none",
                      background: p === page ? "#6366f1" : "#f9fafb",
                      color: p === page ? "#fff" : "#374151",
                      fontSize: 11,
                      fontWeight: p === page ? 700 : 500,
                      cursor: "pointer",
                    }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: "3px 9px",
                    borderRadius: 6,
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    color: "#374151",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    opacity: page === totalPages ? 0.4 : 1,
                  }}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      {panelOpen && (
        <RightPanel
          visible={panelVisible}
          width={panelWidth}
          onClose={closePanel}
          onDragStart={onDragStart}
          title={panelTitle}
        >
          {panelMode === "view" && liveUser && (
            <UserView
              user={liveUser}
              onEdit={() => setPanelMode("edit")}
              onDelete={() => {
                closePanel();
                setTimeout(() => setDeleteUser(liveUser), 310);
              }}
              onToggle={handleToggle}
            />
          )}
          {panelMode === "edit" && liveUser && (
            <UserForm
              user={liveUser}
              onSave={handleSave}
              onCancel={() => setPanelMode("view")}
            />
          )}
          {panelMode === "add" && (
            <UserForm user={null} onSave={handleAdd} onCancel={closePanel} />
          )}
        </RightPanel>
      )}

      {/* ── DELETE OVERLAY ── */}
      {deleteUser && (
        <DeleteOverlay
          user={deleteUser}
          onConfirm={handleDelete}
          onCancel={() => setDeleteUser(null)}
        />
      )}
    </div>
  );
}
