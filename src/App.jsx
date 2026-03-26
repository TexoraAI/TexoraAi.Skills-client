import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

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
import StudentApplicationForm from "./Student/StudentApplicationForm.jsx";
import ApplyTrainer from "./Trainer/ApplyTrainer.jsx";

/* ================= SUPER ADMIN ================= */
import SuperAdminDashboard from "./SuperAdmin/SuperAdminDashboard";
import SuperAdminLayout from "./SuperAdmin/SuperAdminLayout";
import AdminOrganisationControl from "./SuperAdmin/admin-control/AdminOrganisationControl";
import BusinessDashboardControl from "./SuperAdmin/admin-control/business-control/BusinessDashboardControl";
import SuperAdminProfile from "./SuperAdmin/profile/SuperAdminProfile";
import AuditLogs from "./SuperAdmin/settings/AuditLogs";
import RolePageMatrix from "./SuperAdmin/settings/RolePageMatrix";
import SendEmail from "./SuperAdmin/settings/SendEmail";
import StudentDashboardControl from "./SuperAdmin/student-control/StudentDashboardControl";
import TrainerDashboardControl from "./SuperAdmin/trainer-control/TrainerDashboardControl";

/* ================= AUTH PAGES ================= */
import ApprovalPending from "./pages/Auth/ApprovalPending.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import Login from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Register.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";
import VerifyEmail from "./pages/Auth/VerifyEmail.jsx";

/* ================= LANDING ================= */
import CoursePreview from "./pages/CoursePreview";
import CourseDetail from "./pages/Landing/CourseDetailsPage";
import ExploreFreeServices from "./pages/Landing/ExploreFreeServices";
import LMSHomepage from "./pages/Landing/LMSHomepage";
import SyllabusPage from "./pages/Landing/Syllabus.jsx";
import Watchnow from "./pages/Landing/Watchnow";

/* ================= COMPANY ================= */
import AboutTexoraSkills from "./pages/About/AboutTexoraSkills";
import Careers from "./pages/Company/Careers";
import PrivacyPolicy from "./pages/Company/PrivacyPolicy";
import TermsOfService from "./pages/Company/TermsOfService";

/* ================= COMMON ================= */
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import ApplyForm from "./pages/common/ApplyForm";
import EditProfile from "./pages/common/EditProfile";
import CallRoom from "./components/live/CallRoom.jsx";

/* ================= STUDENT ================= */
import Assessments from "./Student/Assessments.jsx";
import AssignmentDetail from "./Student/AssignmentDetail";
import AttemptQuiz from "./Student/AttemptQuiz.jsx";
import Attendance from "./Student/Attendance.jsx";
import DashboardPage from "./Student/DashboardPage.jsx";
import Documents from "./Student/Documents.jsx";
import Doubts from "./Student/Doubts.jsx";
import LiveClasses from "./Student/LiveClasses.jsx";
import MyCourses from "./Student/MyCourses.jsx";
import MyQuizHistory from "./Student/MyQuizHistory";
import RecordedClasses from "./Student/RecordedClasses.jsx";
import Settings from "./Student/Settings.jsx";
import StudentAssignments from "./Student/StudentAssignments.jsx";
import StudentClassroomPage from "./Student/StudentClassroomPage";
import StudentCourseView from "./Student/StudentCourseView";
import TwoFactorAuth from "./Student/TwoFactorAuth";
import UpdateEmail from "./Student/UpdateEmail";
import Certificates from "./Student/certificates.jsx";
import Overview from "./Student/overview.jsx";
import VideoLectures from "./Student/videolecctures.jsx";
import CallTrainer from "./Student/CallTrainer.jsx";

/* ================= TRAINER ================= */
import TrainerAssessments from "./Trainer/Assessments";
import TrainerAttendance from "./Trainer/Attendance";
import BatchReports from "./Trainer/BatchReports";
import CreateAssignments from "./Trainer/CreateAssignments";
import CreateQuiz from "./Trainer/CreateQuiz";
import TrainerDashboard from "./Trainer/Dashboard";
import DoubtsManagement from "./Trainer/DoubtsManagement";
import EditAssignment from "./Trainer/EditAssignment";
import EditRecordedClass from "./Trainer/EditRecordedClass";
import MyAssignments from "./Trainer/MyAssignments";
import MyQuizzes from "./Trainer/MyQuizzes";
import PerformanceAnalysis from "./Trainer/PerformanceAnalysis";
import StudentReports from "./Trainer/StudentReports";
import TrainerBatchesPage from "./Trainer/TrainerBatchesPage";
import TrainerClassroomPage from "./Trainer/TrainerClassroomPage";
import CourseManagement from "./Trainer/TrainerCourseManagement.jsx";
import CourseModules from "./Trainer/TrainerCourseModules";
import TrainerFiles from "./Trainer/TrainerFiles";
import TrainerSettings from "./Trainer/TrainerSettings";
import UploadDocuments from "./Trainer/UploadDocuments";
import UploadVideos from "./Trainer/UploadVideos";
import ViewAssignments from "./Trainer/ViewAssignments";
import ViewSubmissions from "./Trainer/ViewSubmissions";

/* ================= NEW LIVE + RECORDED ================= */
import LiveAttendanceReport from "./Trainer/LiveAttendanceReport";
import LiveSessionControls from "./Trainer/LiveSessionControls";
import LiveSessionHistory from "./Trainer/LiveSessionHistory";
import RecordedClassList from "./Trainer/RecordedClassList";
import StartLiveSession from "./Trainer/StartLiveSession";
import TrainerLiveClasses from "./Trainer/TrainerLiveClasses";
import UploadRecordedVideo from "./Trainer/UploadRecordedVideo";
import TrainerJoinCall from "./Trainer/TrainerJoinCall";
/* ================= ADMIN ================= */
import AdminBatches from "./Admin/AdminBatches";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminLiveSessions from "./Admin/AdminLiveSessions";
import AdminRecordedVideos from "./Admin/AdminRecordedVideos";
import Admincourseuploadform from "./Admin/Admincourseuploadform";
import AllCourses from "./Admin/AllCourses";
import AllUsers from "./Admin/AllUsers";
import AssignTrainerPage from "./Admin/AssignTrainerPage";
import BatchStudentsPage from "./Admin/BatchStudentsPage";
import BatchTrainerOverviewPage from "./Admin/BatchTrainerOverviewPage";
import Branches from "./Admin/Branches";
import Categories from "./Admin/Categories";
import CertificatesAdmin from "./Admin/CertificatesAdmin";
import DepartmentList from "./Admin/DepartmentList";
import Featuredcourseuploadform from "./Admin/Featuredcourseuploadform";
import FeedbackAdmin from "./Admin/FeedbackAdmin";
import OrgReports from "./Admin/OrgReports";
import OrgSettings from "./Admin/OrgSettings";
import PendingUsers from "./Admin/PendingUsers.jsx";
import StudentsAdmin from "./Admin/StudentsAdmin";
import TrainersAdmin from "./Admin/TrainersAdmin";
import UsageAnalytics from "./Admin/UsageAnalytics";
/* ================= BUSINESS ================= */
import BusinessDashboard from "./Business/BusinessDashboard";
import NewEnrollments from "./Business/Enrollments/NewEnrollments.jsx";
import Renewals from "./Business/Enrollments/Renewals.jsx";
import Invoices from "./Business/Financial/Invoices.jsx";
import Payments from "./Business/Financial/Payments.jsx";
import Applications from "./Business/Hiring Manager/Applications.jsx";
import JobOpenings from "./Business/Hiring Manager/JobOpenings.jsx";
import AllLeads from "./Business/Lead Management/AllLeads.jsx";
import FollowUps from "./Business/Lead Management/FollowUps.jsx";
import Campaigns from "./Business/Marketing/Campaigns.jsx";
import Sources from "./Business/Marketing/Sources.jsx";
import BusinessSettings from "./Business/Settings.jsx";
import Performance from "./Business/Team Targets/Performance.jsx";
import Targets from "./Business/Team Targets/Targets.jsx";

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
<Route path="/apply" element={<ApplyForm />} />
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

          <Route path="classroom" element={<StudentClassroomPage />} />
          {/* LEARNING */}
          <Route path="videos" element={<VideoLectures />} />
          <Route path="documents" element={<Documents />} />

          {/* 🔥 NEW ADDED */}
        <Route path="live-classes" element={<LiveClasses />} />
        <Route path="call-trainer" element={<CallTrainer />} />
        <Route path="recorded-classes" element={<RecordedClasses />} />
        <Route path="call-room" element={<CallRoom />} /> 

          {/* COURSES */}
          <Route path="courses" element={<MyCourses />} />
          <Route path="course/:id" element={<StudentCourseView />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="assignments/:id" element={<AssignmentDetail />} />
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

          {/*  COMMON TOP BAR ROUTES */}
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

  {/* Existing Routes */}
  <Route path="batches" element={<TrainerBatchesPage />} />
  <Route path="batches/:batchId/students" element={<TrainerClassroomPage />} />
  <Route path="trainerfiles" element={<TrainerFiles />} />
  <Route path="upload-videos" element={<UploadVideos />} />
  <Route path="upload-docs" element={<UploadDocuments />} />
  <Route path="create-quiz" element={<CreateQuiz />} />
  <Route path="my-quizzes" element={<MyQuizzes />} />
  <Route path="edit-assignment/:id" element={<EditAssignment />} />
  <Route path="submissions/:id" element={<ViewSubmissions />} />
  <Route path="create-assignments" element={<CreateAssignments />} />
  <Route path="my-assignments" element={<MyAssignments />} />
  <Route path="course-management" element={<CourseManagement />} />
  <Route path="course/:courseId/modules" element={<CourseModules />} />
  <Route path="assessments" element={<TrainerAssessments />} />
  <Route path="attendance" element={<TrainerAttendance />} />
  <Route path="doubts-management" element={<DoubtsManagement />} />
  <Route path="student-reports" element={<StudentReports />} />
  <Route path="batch-reports" element={<BatchReports />} />
  <Route path="performance" element={<PerformanceAnalysis />} />
  <Route path="view-assignments" element={<ViewAssignments />} />
 

{/* ================= LIVE CLASSES ================= */}
          <Route path="live" element={<TrainerLiveClasses />} />
          <Route path="start-live" element={<StartLiveSession />} />
          <Route path="live-controls/:id" element={<LiveSessionControls />} />
          <Route path="live-history" element={<LiveSessionHistory />} />
          <Route path="live-attendance" element={<LiveAttendanceReport />} />
          <Route path="join-call" element={<TrainerJoinCall />} />
          <Route path="call-room" element={<CallRoom role="trainer" />} />
  {/* ================= RECORDED CLASSES ================= */}
  <Route path="upload-recorded" element={<UploadRecordedVideo />} />
  <Route path="recorded-list" element={<RecordedClassList />} />
  <Route path="edit-recorded/:id" element={<EditRecordedClass />} />
  {/* Settings */}
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
          <Route
            path="batches/:batchId/assign-trainer"
            element={<AssignTrainerPage />}
          />
          <Route
            path="batches/:batchId/students/:trainerEmail"
            element={<BatchStudentsPage />}
          />
          <Route
            path="batches/:batchId/trainers"
            element={<BatchTrainerOverviewPage />}
          />

          <Route path="users" element={<AllUsers />} />
          <Route path="students" element={<StudentsAdmin />} />
          <Route path="trainers" element={<TrainersAdmin />} />
          <Route path="pending-users" element={<PendingUsers />} />
          <Route path="courses" element={<AllCourses />} />
          <Route path="categories" element={<Categories />} />
          <Route path="certificates" element={<CertificatesAdmin />} />
          <Route path="reports" element={<OrgReports />} />
          <Route path="departmentlist" element={<DepartmentList />} />
          <Route path="usage" element={<UsageAnalytics />} />
          <Route path="feedback" element={<FeedbackAdmin />} />
          <Route path="live-sessions" element={<AdminLiveSessions />} />
          <Route path="recorded-videos" element={<AdminRecordedVideos />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="featured-course-upload" element={<Featuredcourseuploadform />} />
           <Route path="course-upload" element={<Admincourseuploadform />} />
          
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