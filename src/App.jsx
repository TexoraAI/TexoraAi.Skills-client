import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { lazyLoad } from "./lib/lazyLoad";

/* ================= AUTH ================= */
import auth from "./auth";

/* ================= ROLE GUARD ================= */
import RoleGuard from "./components/RoleGuard";

/* ================= PANELS (eager - layout components) ================= */
import AdminPanel from "./Admin/AdminPanel";
import BusinessPanel from "./Business/BusinessPanel";
import StudentPanel from "./Student/StudentPanel";
import TrainerPanel from "./Trainer/TrainerPanel";
import SuperAdminLayout from "./SuperAdmin/SuperAdminLayout";

/* ================= APPLY ================= */
const ApplyAdmin            = lazyLoad(() => import("./Admin/ApplyAdmin.jsx"));
const ApplyBusiness         = lazyLoad(() => import("./Business/ApplyBusiness.jsx"));
const StudentApplicationForm = lazyLoad(() => import("./Student/StudentApplicationForm.jsx"));
const ApplyTrainer          = lazyLoad(() => import("./Trainer/ApplyTrainer.jsx"));

/* ================= SUPER ADMIN ================= */
const SuperAdminDashboard       = lazyLoad(() => import("./SuperAdmin/SuperAdminDashboard"));
const AdminOrganisationControl  = lazyLoad(() => import("./SuperAdmin/admin-control/AdminOrganisationControl"));
const BusinessDashboardControl  = lazyLoad(() => import("./SuperAdmin/admin-control/business-control/BusinessDashboardControl"));
const SuperAdminProfile         = lazyLoad(() => import("./SuperAdmin/profile/SuperAdminProfile"));
const AuditLogs                 = lazyLoad(() => import("./SuperAdmin/settings/AuditLogs"));
const RolePageMatrix            = lazyLoad(() => import("./SuperAdmin/settings/RolePageMatrix"));
const SendEmail                 = lazyLoad(() => import("./SuperAdmin/settings/SendEmail"));
const StudentDashboardControl   = lazyLoad(() => import("./SuperAdmin/student-control/StudentDashboardControl"));
const TrainerDashboardControl   = lazyLoad(() => import("./SuperAdmin/trainer-control/TrainerDashboardControl"));

/* ================= AUTH PAGES ================= */
const ApprovalPending = lazyLoad(() => import("./pages/Auth/ApprovalPending.jsx"));
const ForgotPassword  = lazyLoad(() => import("./pages/Auth/ForgotPassword.jsx"));
const Login           = lazyLoad(() => import("./pages/Auth/Login.jsx"));
const Signup          = lazyLoad(() => import("./pages/Auth/Register.jsx"));
const ResetPassword   = lazyLoad(() => import("./pages/Auth/ResetPassword.jsx"));
const VerifyEmail     = lazyLoad(() => import("./pages/Auth/VerifyEmail.jsx"));

/* ================= LANDING ================= */
const CoursePreview        = lazyLoad(() => import("./pages/CoursePreview"));
const CourseDetail         = lazyLoad(() => import("./pages/Landing/CourseDetailsPage"));
const ExploreFreeServices  = lazyLoad(() => import("./pages/Landing/ExploreFreeServices"));
const LMSHomepage          = lazyLoad(() => import("./pages/Landing/LMSHomepage"));
const SyllabusPage         = lazyLoad(() => import("./pages/Landing/Syllabus.jsx"));
const Watchnow             = lazyLoad(() => import("./pages/Landing/Watchnow"));

/* ================= COMPANY ================= */
const AboutTexoraSkills = lazyLoad(() => import("./pages/About/AboutTexoraSkills"));
const Careers           = lazyLoad(() => import("./pages/Company/Careers"));
const PrivacyPolicy     = lazyLoad(() => import("./pages/Company/PrivacyPolicy"));
const TermsOfService    = lazyLoad(() => import("./pages/Company/TermsOfService"));

/* ================= COMMON ================= */
const NotificationsPage = lazyLoad(() => import("./pages/NotificationsPage"));
const ProfilePage       = lazyLoad(() => import("./pages/ProfilePage"));
const SearchPage        = lazyLoad(() => import("./pages/SearchPage"));
const ApplyForm         = lazyLoad(() => import("./pages/common/ApplyForm"));
const CompleteProfile   = lazyLoad(() => import("./pages/common/CompleteProfile"));
const EditProfile       = lazyLoad(() => import("./pages/common/EditProfile"));
const CallRoom          = lazyLoad(() => import("./components/live/CallRoom.jsx"));

/* ================= STUDENT ================= */
const Assessments           = lazyLoad(() => import("./Student/Assessments.jsx"));
const AssignmentDetail      = lazyLoad(() => import("./Student/AssignmentDetail"));
const AttemptQuiz           = lazyLoad(() => import("./Student/AttemptQuiz.jsx"));
const Attendance            = lazyLoad(() => import("./Student/Attendance.jsx"));
const DashboardPage         = lazyLoad(() => import("./Student/DashboardPage.jsx"));
const Documents             = lazyLoad(() => import("./Student/Documents.jsx"));
const Doubts                = lazyLoad(() => import("./Student/Doubts.jsx"));
const LiveClasses           = lazyLoad(() => import("./Student/LiveClasses.jsx"));
const MyCourses             = lazyLoad(() => import("./Student/MyCourses.jsx"));
const MyQuizHistory         = lazyLoad(() => import("./Student/MyQuizHistory"));
const RecordedClasses       = lazyLoad(() => import("./Student/RecordedClasses.jsx"));
const Settings              = lazyLoad(() => import("./Student/Settings.jsx"));
const StudentAssignments    = lazyLoad(() => import("./Student/StudentAssignments.jsx"));
const StudentClassroomPage  = lazyLoad(() => import("./Student/StudentClassroomPage"));
const StudentCourseView     = lazyLoad(() => import("./Student/StudentCourseView"));
const TwoFactorAuth         = lazyLoad(() => import("./Student/TwoFactorAuth"));
const UpdateEmail           = lazyLoad(() => import("./Student/UpdateEmail"));
const Certificates          = lazyLoad(() => import("./Student/certificates.jsx"));
const Overview              = lazyLoad(() => import("./Student/overview.jsx"));
const VideoLectures         = lazyLoad(() => import("./Student/videolecctures.jsx"));
const CallTrainer           = lazyLoad(() => import("./Student/CallTrainer.jsx"));

/* ================= TRAINER ================= */
const TrainerAssessments    = lazyLoad(() => import("./Trainer/Assessments"));
const TrainerAttendance     = lazyLoad(() => import("./Trainer/Attendance"));
const BatchReports          = lazyLoad(() => import("./Trainer/BatchReports"));
const CreateAssignments     = lazyLoad(() => import("./Trainer/CreateAssignments"));
const CreateQuiz            = lazyLoad(() => import("./Trainer/CreateQuiz"));
const TrainerDashboard      = lazyLoad(() => import("./Trainer/Dashboard"));
const DoubtsManagement      = lazyLoad(() => import("./Trainer/DoubtsManagement"));
const EditAssignment        = lazyLoad(() => import("./Trainer/EditAssignment"));
const EditRecordedClass     = lazyLoad(() => import("./Trainer/EditRecordedClass"));
const MyAssignments         = lazyLoad(() => import("./Trainer/MyAssignments"));
const MyQuizzes             = lazyLoad(() => import("./Trainer/MyQuizzes"));
const PerformanceAnalysis   = lazyLoad(() => import("./Trainer/PerformanceAnalysis"));
const StudentReports        = lazyLoad(() => import("./Trainer/StudentReports"));
const TrainerBatchesPage    = lazyLoad(() => import("./Trainer/TrainerBatchesPage"));
const TrainerClassroomPage  = lazyLoad(() => import("./Trainer/TrainerClassroomPage"));
const CourseManagement      = lazyLoad(() => import("./Trainer/TrainerCourseManagement.jsx"));
const CourseModules         = lazyLoad(() => import("./Trainer/TrainerCourseModules"));
const TrainerFiles          = lazyLoad(() => import("./Trainer/TrainerFiles"));
const TrainerSettings       = lazyLoad(() => import("./Trainer/TrainerSettings"));
const UploadDocuments       = lazyLoad(() => import("./Trainer/UploadDocuments"));
const UploadVideos          = lazyLoad(() => import("./Trainer/UploadVideos"));
const ViewAssignments       = lazyLoad(() => import("./Trainer/ViewAssignments"));
const ViewSubmissions       = lazyLoad(() => import("./Trainer/ViewSubmissions"));
const LiveAttendanceReport  = lazyLoad(() => import("./Trainer/LiveAttendanceReport"));
const LiveSessionControls   = lazyLoad(() => import("./Trainer/LiveSessionControls"));
const LiveSessionHistory    = lazyLoad(() => import("./Trainer/LiveSessionHistory"));
const RecordedClassList     = lazyLoad(() => import("./Trainer/RecordedClassList"));
const StartLiveSession      = lazyLoad(() => import("./Trainer/StartLiveSession"));
const TrainerLiveClasses    = lazyLoad(() => import("./Trainer/TrainerLiveClasses"));
const UploadRecordedVideo   = lazyLoad(() => import("./Trainer/UploadRecordedVideo"));
const TrainerJoinCall       = lazyLoad(() => import("./Trainer/TrainerJoinCall"));

/* ================= ADMIN ================= */
const AdminBatches              = lazyLoad(() => import("./Admin/AdminBatches"));
const AdminDashboard            = lazyLoad(() => import("./Admin/AdminDashboard"));
const AdminLiveSessions         = lazyLoad(() => import("./Admin/AdminLiveSessions"));
const AdminRecordedVideos       = lazyLoad(() => import("./Admin/AdminRecordedVideos"));
const Admincourseuploadform     = lazyLoad(() => import("./Admin/Admincourseuploadform"));
const AllCourses                = lazyLoad(() => import("./Admin/AllCourses"));
const AllUsers                  = lazyLoad(() => import("./Admin/AllUsers"));
const AssignTrainerPage         = lazyLoad(() => import("./Admin/AssignTrainerPage"));
const BatchStudentsPage         = lazyLoad(() => import("./Admin/BatchStudentsPage"));
const BatchTrainerOverviewPage  = lazyLoad(() => import("./Admin/BatchTrainerOverviewPage"));
const Branches                  = lazyLoad(() => import("./Admin/Branches"));
const Categories                = lazyLoad(() => import("./Admin/Categories"));
const CertificatesAdmin         = lazyLoad(() => import("./Admin/CertificatesAdmin"));
const DepartmentList            = lazyLoad(() => import("./Admin/DepartmentList"));
const Featuredcourseuploadform  = lazyLoad(() => import("./Admin/Featuredcourseuploadform"));
const FeedbackAdmin             = lazyLoad(() => import("./Admin/FeedbackAdmin"));
const OrgReports                = lazyLoad(() => import("./Admin/OrgReports"));
const OrgSettings               = lazyLoad(() => import("./Admin/OrgSettings"));
const PendingUsers              = lazyLoad(() => import("./Admin/PendingUsers.jsx"));
const StudentsAdmin             = lazyLoad(() => import("./Admin/StudentsAdmin"));
const TrainersAdmin             = lazyLoad(() => import("./Admin/TrainersAdmin"));
const UsageAnalytics            = lazyLoad(() => import("./Admin/UsageAnalytics"));

/* ================= BUSINESS ================= */
const BusinessDashboard = lazyLoad(() => import("./Business/BusinessDashboard"));
const NewEnrollments    = lazyLoad(() => import("./Business/Enrollments/NewEnrollments.jsx"));
const Renewals          = lazyLoad(() => import("./Business/Enrollments/Renewals.jsx"));
const Invoices          = lazyLoad(() => import("./Business/Financial/Invoices.jsx"));
const Payments          = lazyLoad(() => import("./Business/Financial/Payments.jsx"));
const Applications      = lazyLoad(() => import("./Business/Hiring Manager/Applications.jsx"));
const JobOpenings       = lazyLoad(() => import("./Business/Hiring Manager/JobOpenings.jsx"));
const AllLeads          = lazyLoad(() => import("./Business/Lead Management/AllLeads.jsx"));
const FollowUps         = lazyLoad(() => import("./Business/Lead Management/FollowUps.jsx"));
const Campaigns         = lazyLoad(() => import("./Business/Marketing/Campaigns.jsx"));
const Sources           = lazyLoad(() => import("./Business/Marketing/Sources.jsx"));
const BusinessSettings  = lazyLoad(() => import("./Business/Settings.jsx"));
const Performance       = lazyLoad(() => import("./Business/Team Targets/Performance.jsx"));
const Targets           = lazyLoad(() => import("./Business/Team Targets/Targets.jsx"));

/* ================= STUDENT DEMO ================= */
const IlmOraDemoPage = lazyLoad(() => import("./pages/Student/IlmOraDemoPage"));

/* ================= PROTECTED ROUTE ================= */
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

  // ✅ ADDED: Register Firebase service worker once on app load
  // This must run early so getToken() in firebaseService.js always has a SW ready.
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js", { scope: "/" })
        .then((reg) => console.log("✅ FCM SW registered:", reg.scope))
        .catch((err) => console.error("❌ FCM SW registration failed:", err));
    }
  }, []);
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>

            {/* ================= PUBLIC ================= */}
            <Route path="/" element={<LMSHomepage theme={theme} toggleTheme={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))} />} />
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

            {/* ================= DEMO ================= */}
            <Route path="/ilm-demo" element={<IlmOraDemoPage />} />

            {/* ================= APPLY ================= */}
            <Route path="/apply" element={<ApplyForm />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/apply-admin" element={<ApplyAdmin />} />
            <Route path="/apply-business" element={<ApplyBusiness />} />
            <Route path="/apply-trainer" element={<ApplyTrainer />} />
            <Route path="/apply-student" element={<StudentApplicationForm />} />

            {/* ================= STUDENT ================= */}
            <Route path="/student" element={<ProtectedRoute><RoleGuard allowedRoles={["STUDENT", "ADMIN"]}><StudentPanel /></RoleGuard></ProtectedRoute>}>
              <Route index element={<DashboardPage />} />
              <Route path="classroom" element={<StudentClassroomPage />} />
              <Route path="videos" element={<VideoLectures />} />
              <Route path="documents" element={<Documents />} />
              <Route path="live-classes" element={<LiveClasses />} />
              <Route path="call-trainer" element={<CallTrainer />} />
              <Route path="recorded-classes" element={<RecordedClasses />} />
              <Route path="call-room" element={<CallRoom />} />
              <Route path="courses" element={<MyCourses />} />
              <Route path="course/:id" element={<StudentCourseView />} />
              <Route path="assessments" element={<Assessments />} />
              <Route path="assignments" element={<StudentAssignments />} />
              <Route path="assignments/:id" element={<AssignmentDetail />} />
              <Route path="quiz/:quizId" element={<AttemptQuiz />} />
              <Route path="my-quizzes" element={<MyQuizHistory />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="doubts" element={<Doubts />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="overview" element={<Overview />} />
              <Route path="settings">
                <Route index element={<Settings />} />
                <Route path="2fa" element={<TwoFactorAuth />} />
                <Route path="update-email" element={<UpdateEmail />} />
              </Route>
              <Route path="search" element={<SearchPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="edit-profile" element={<EditProfile />} />
            </Route>

            {/* ================= TRAINER ================= */}
            <Route path="/trainer" element={<ProtectedRoute><RoleGuard allowedRoles={["TRAINER", "ADMIN"]}><TrainerPanel /></RoleGuard></ProtectedRoute>}>
              <Route index element={<TrainerDashboard />} />
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
              <Route path="live" element={<TrainerLiveClasses />} />
              <Route path="start-live" element={<StartLiveSession />} />
              <Route path="live-controls/:id" element={<LiveSessionControls />} />
              <Route path="live-history" element={<LiveSessionHistory />} />
              <Route path="live-attendance" element={<LiveAttendanceReport />} />
              <Route path="join-call" element={<TrainerJoinCall />} />
              <Route path="call-room" element={<CallRoom role="trainer" />} />
              <Route path="upload-recorded" element={<UploadRecordedVideo />} />
              <Route path="recorded-list" element={<RecordedClassList />} />
              <Route path="edit-recorded/:id" element={<EditRecordedClass />} />
              <Route path="settings" element={<TrainerSettings />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="edit-profile" element={<EditProfile />} />
            </Route>

            {/* ================= ADMIN ================= */}
            <Route path="/admin" element={<ProtectedRoute><RoleGuard allowedRoles={["ADMIN"]}><AdminPanel /></RoleGuard></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="settings" element={<OrgSettings />} />
              <Route path="branches" element={<Branches />} />
              <Route path="batches" element={<AdminBatches />} />
              <Route path="batches/:batchId/assign-trainer" element={<AssignTrainerPage />} />
              <Route path="batches/:batchId/students/:trainerEmail" element={<BatchStudentsPage />} />
              <Route path="batches/:batchId/trainers" element={<BatchTrainerOverviewPage />} />
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
            <Route path="/business" element={<ProtectedRoute><RoleGuard allowedRoles={["BUSINESS", "ADMIN"]}><BusinessPanel /></RoleGuard></ProtectedRoute>}>
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
            <Route path="/super-admin" element={<ProtectedRoute><RoleGuard allowedRoles={["SUPER_ADMIN"]}><SuperAdminLayout /></RoleGuard></ProtectedRoute>}>
              <Route index element={<SuperAdminDashboard />} />
              <Route path="dashboard" element={<SuperAdminDashboard />} />
              <Route path="admin-control" element={<AdminOrganisationControl />} />
              <Route path="business-control" element={<BusinessDashboardControl />} />
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
        </Suspense>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  );
}