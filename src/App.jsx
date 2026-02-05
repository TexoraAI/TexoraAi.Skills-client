
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

/* ================= AUTH ================= */
import auth from "./auth";

/* ================= ROLE GUARD ================= */
import RoleGuard from "./components/RoleGuard";

/* ================= PANELS ================= */
import AdminPanel from "./Admin/AdminPanel";
import BusinessPanel from "./Business/BusinessPanel";
import StudentPanel from "./Student/StudentPanel";
import TrainerPanel from "./Trainer/TrainerPanel";

/* ================= APPLY ================= */
import ApplyAdmin from "./Admin/ApplyAdmin.jsx";
import ApplyBusiness from "./Business/ApplyBusiness.jsx";
import ApplyTrainer from "./Trainer/ApplyTrainer.jsx";
import StudentApplicationForm from "./Student/StudentApplicationForm.jsx";

/* ================= SUPER ADMIN ================= */
import SuperAdminLayout from "./SuperAdmin/SuperAdminLayout";
import SuperAdminDashboard from "./SuperAdmin/SuperAdminDashboard";
import AdminOrganisationControl from "./SuperAdmin/admin-control/AdminOrganisationControl";
import BusinessDashboardControl from "./SuperAdmin/admin-control/business-control/BusinessDashboardControl";
import TrainerDashboardControl from "./SuperAdmin/trainer-control/TrainerDashboardControl";
import StudentDashboardControl from "./SuperAdmin/student-control/StudentDashboardControl";
import RolePageMatrix from "./SuperAdmin/settings/RolePageMatrix";
import SendEmail from "./SuperAdmin/settings/SendEmail";
import AuditLogs from "./SuperAdmin/settings/AuditLogs";
import SuperAdminProfile from "./SuperAdmin/profile/SuperAdminProfile";

/* ================= AUTH PAGES ================= */
import Login from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Register.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";
import ApprovalPending from "./pages/Auth/ApprovalPending.jsx";
import VerifyEmail from "./pages/Auth/VerifyEmail.jsx";

/* ================= LANDING ================= */
import LMSHomepage from "./pages/Landing/LMSHomepage";
import ExploreFreeServices from "./pages/Landing/ExploreFreeServices";
import Watchnow from "./pages/Landing/Watchnow";
import SyllabusPage from "./pages/Landing/Syllabus.jsx";
import CourseDetail from "./pages/Landing/CourseDetailsPage";
import CoursePreview from "./pages/CoursePreview";

/* ================= COMPANY ================= */
import AboutTexoraSkills from "./pages/About/AboutTexoraSkills";
import Careers from "./pages/Company/Careers";
import PrivacyPolicy from "./pages/Company/PrivacyPolicy";
import TermsOfService from "./pages/Company/TermsOfService";

/* ================= COMMON ================= */
import SearchPage from "./pages/SearchPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/common/EditProfile";

/* ================= STUDENT ================= */
import DashboardPage from "./Student/DashboardPage.jsx";
import VideoLectures from "./Student/videolecctures.jsx";
import Documents from "./Student/Documents.jsx";
import Resources from "./Student/Resources.jsx";
import MyCourses from "./Student/MyCourses.jsx";
import StudentCourseView from "./Student/StudentCourseView";
import Assessments from "./Student/Assessments.jsx";
import AttemptQuiz from "./Student/AttemptQuiz.jsx";
import MyQuizHistory from "./Student/MyQuizHistory";
import Attendance from "./Student/Attendance.jsx";
import Doubts from "./Student/Doubts.jsx";
import Certificates from "./Student/certificates.jsx";
import Overview from "./Student/overview.jsx";
import Settings from "./Student/Settings.jsx";
import TwoFactorAuth from "./Student/TwoFactorAuth";
import UpdateEmail from "./Student/UpdateEmail";
// import StudentAssignments from "./Student/StudentAssignments.jsx";

/* ================= TRAINER ================= */
import TrainerDashboard from "./Trainer/Dashboard";
import TrainerBatches from "./Trainer/Batches";
import TrainerAssessments from "./Trainer/Assessments";
import TrainerAttendance from "./Trainer/Attendance";
import BatchReports from "./Trainer/BatchReports";
import CreateAssignments from "./Trainer/CreateAssignments";
import CreateQuiz from "./Trainer/CreateQuiz";
import MyQuizzes from "./Trainer/MyQuizzes";
import DoubtsManagement from "./Trainer/DoubtsManagement";
import PerformanceAnalysis from "./Trainer/PerformanceAnalysis";
import StudentReports from "./Trainer/StudentReports";
import TrainerSettings from "./Trainer/TrainerSettings";
import UploadDocuments from "./Trainer/UploadDocuments";
import UploadVideos from "./Trainer/UploadVideos";
import CourseManagement from "./Trainer/TrainerCourseManagement";
import CourseModules from "./Trainer/TrainerCourseModules";

/* ================= ADMIN ================= */
import AdminDashboard from "./Admin/AdminDashboard";
import OrgSettings from "./Admin/OrgSettings";
import Branches from "./Admin/Branches";
import AdminBatches from "./Admin/AdminBatches";
import AllUsers from "./Admin/AllUsers";
import StudentsAdmin from "./Admin/StudentsAdmin";
import TrainersAdmin from "./Admin/TrainersAdmin";
import AllCourses from "./Admin/AllCourses";
import Categories from "./Admin/Categories";
import CertificatesAdmin from "./Admin/CertificatesAdmin";
import OrgReports from "./Admin/OrgReports";
import AdminResources from "./Admin/AdminResources";
import DepartmentList from "./Admin/DepartmentList";
import UsageAnalytics from "./Admin/UsageAnalytics";
import FeedbackAdmin from "./Admin/FeedbackAdmin";
import PendingUsers from "./Admin/PendingUsers.jsx";

/* ================= BUSINESS ================= */
import BusinessDashboard from "./Business/BusinessDashboard";
import JobOpenings from "./Business/Hiring Manager/JobOpenings.jsx";
import Applications from "./Business/Hiring Manager/Applications.jsx";
import AllLeads from "./Business/Lead Management/AllLeads.jsx";
import FollowUps from "./Business/Lead Management/FollowUps.jsx";
import NewEnrollments from "./Business/Enrollments/NewEnrollments.jsx";
import Renewals from "./Business/Enrollments/Renewals.jsx";
import Invoices from "./Business/Financial/Invoices.jsx";
import Payments from "./Business/Financial/Payments.jsx";
import Campaigns from "./Business/Marketing/Campaigns.jsx";
import Sources from "./Business/Marketing/Sources.jsx";
import Targets from "./Business/Team Targets/Targets.jsx";
import Performance from "./Business/Team Targets/Performance.jsx";
import BusinessSettings from "./Business/Settings.jsx";

/* ================= PROTECTED ================= */
const ProtectedRoute = ({ children }) => {
  if (!auth.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route
          path="/"
          element={
            <LMSHomepage
              theme={theme}
              toggleTheme={() =>
                setTheme((prev) => (prev === "dark" ? "light" : "dark"))
              }
            />
          }
        />
        <Route path="/explore-programs" element={<ExploreFreeServices />} />
        <Route path="/watch-demo/:videoId" element={<Watchnow />} />
        <Route path="/course/:id" element={<CoursePreview />} />
        <Route path="/course-details" element={<CourseDetail />} />
        <Route path="/syllabus" element={<SyllabusPage />} />

        {/* ================= COMPANY ================= */}
        <Route path="/about" element={<AboutTexoraSkills />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />

        {/* ================= AUTH ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/approval-pending" element={<ApprovalPending />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* ================= APPLY ================= */}
        <Route path="/apply-admin" element={<ApplyAdmin />} />
        <Route path="/apply-business" element={<ApplyBusiness />} />
        <Route path="/apply-trainer" element={<ApplyTrainer />} />
        <Route path="/apply-student" element={<StudentApplicationForm />} />
        {/* ================= STUDENT ================= */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["STUDENT", "ADMIN"]}>
                <StudentPanel />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          {/* DASHBOARD */}
          <Route index element={<DashboardPage />} />

          {/* LEARNING */}
          <Route path="videos" element={<VideoLectures />} />
          <Route path="documents" element={<Documents />} />
          <Route path="resources" element={<Resources />} />

          {/* COURSES */}
          <Route path="courses" element={<MyCourses />} />
          <Route path="course/:id" element={<StudentCourseView />} />
          <Route path="assessments" element={<Assessments />} />
          {/* <Route path="assignments" element={<StudentAssignments />} /> */}
          <Route path="quiz/:quizId" element={<AttemptQuiz />} />
          <Route path="my-quizzes" element={<MyQuizHistory />} />

          {/* ACTIVITY */}
          <Route path="attendance" element={<Attendance />} />
          <Route path="doubts" element={<Doubts />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="overview" element={<Overview />} />

          {/* SETTINGS */}
          <Route path="settings">
            <Route index element={<Settings />} />
            <Route path="2fa" element={<TwoFactorAuth />} />
            <Route path="update-email" element={<UpdateEmail />} />
          </Route>

          {/* 🔔 COMMON TOP BAR ROUTES */}
          <Route path="search" element={<SearchPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="edit-profile" element={<EditProfile />} />
        </Route>

        {/* ================= TRAINER ================= */}
        <Route
          path="/trainer"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["TRAINER", "ADMIN"]}>
                <TrainerPanel />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          <Route index element={<TrainerDashboard />} />
          <Route path="batches" element={<TrainerBatches />} />
          <Route path="upload-videos" element={<UploadVideos />} />
          <Route path="upload-docs" element={<UploadDocuments />} />
          <Route path="create-quiz" element={<CreateQuiz />} />
          <Route path="my-quizzes" element={<MyQuizzes />} />
          <Route path="create-assignments" element={<CreateAssignments />} />
          <Route path="course-management" element={<CourseManagement />} />
          <Route path="course/:courseId/modules" element={<CourseModules />} />
          <Route path="assessments" element={<TrainerAssessments />} />
          <Route path="attendance" element={<TrainerAttendance />} />
          <Route path="doubts-management" element={<DoubtsManagement />} />
          <Route path="student-reports" element={<StudentReports />} />
          <Route path="batch-reports" element={<BatchReports />} />
          <Route path="performance" element={<PerformanceAnalysis />} />
          <Route path="settings" element={<TrainerSettings />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="edit-profile" element={<EditProfile />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN"]}>
                <AdminPanel />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="settings" element={<OrgSettings />} />
          <Route path="branches" element={<Branches />} />
          <Route path="batches" element={<AdminBatches />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="students" element={<StudentsAdmin />} />
          <Route path="trainers" element={<TrainersAdmin />} />
          <Route path="pending-users" element={<PendingUsers />} />
          <Route path="courses" element={<AllCourses />} />
          <Route path="categories" element={<Categories />} />
          <Route path="certificates" element={<CertificatesAdmin />} />
          <Route path="reports" element={<OrgReports />} />
          <Route path="resources" element={<AdminResources />} />
          <Route path="departmentlist" element={<DepartmentList />} />
          <Route path="usage" element={<UsageAnalytics />} />
          <Route path="feedback" element={<FeedbackAdmin />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="edit-profile" element={<EditProfile />} />
        </Route>

        {/* ================= BUSINESS ================= */}
        <Route
          path="/business"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["BUSINESS", "ADMIN"]}>
                <BusinessPanel />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          <Route index element={<BusinessDashboard />} />
          <Route path="jobs" element={<JobOpenings />} />
          <Route path="applications" element={<Applications />} />
          <Route path="leads" element={<AllLeads />} />
          <Route path="followups" element={<FollowUps />} />
          <Route path="enrollments" element={<NewEnrollments />} />
          <Route path="renewals" element={<Renewals />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="payments" element={<Payments />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="sources" element={<Sources />} />
          <Route path="targets" element={<Targets />} />
          <Route path="performance" element={<Performance />} />
          <Route path="settings" element={<BusinessSettings />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="edit-profile" element={<EditProfile />} />
        </Route>

        {/* ================= SUPER ADMIN ================= */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
                <SuperAdminLayout />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="admin-control" element={<AdminOrganisationControl />} />
          <Route
            path="business-control"
            element={<BusinessDashboardControl />}
          />
          <Route path="trainer-control" element={<TrainerDashboardControl />} />
          <Route path="student-control" element={<StudentDashboardControl />} />
          <Route path="settings/role-matrix" element={<RolePageMatrix />} />
          <Route path="settings/send-email" element={<SendEmail />} />
          <Route path="settings/audit-logs" element={<AuditLogs />} />
          <Route path="profile" element={<SuperAdminProfile />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}
