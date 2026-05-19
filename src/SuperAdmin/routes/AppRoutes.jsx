import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROLES, PERMISSIONS } from "../constants/permissions";
import ProtectedRoute from "./ProtectedRoute";
import SuperAdminLayout from "../SuperAdmin/SuperAdminLayout";

// ============================================================
// LAZY LOADED PAGES
// ============================================================

// SuperAdmin Pages
const SuperAdminDashboard = lazy(() => import("../SuperAdmin/pages/SuperAdminDashboard"));
const UserManagementPage = lazy(() => import("../SuperAdmin/pages/UserManagementPage"));
const StudentControlPage = lazy(() => import("../SuperAdmin/pages/StudentControlPage"));
const TrainerControlPage = lazy(() => import("../SuperAdmin/pages/TrainerControlPage"));
const AdminControlPage = lazy(() => import("../SuperAdmin/pages/AdminControlPage"));
const PermissionManagerPage = lazy(() => import("../SuperAdmin/pages/PermissionManagerPage"));
const AnalyticsPage = lazy(() => import("../SuperAdmin/pages/AnalyticsPage"));
const SecuritySettingsPage = lazy(() => import("../SuperAdmin/pages/SecuritySettingsPage"));
const PendingApprovalsPage = lazy(() => import("../SuperAdmin/pages/PendingApprovalsPage"));
const ProfilePage = lazy(() => import("../SuperAdmin/pages/ProfilePage"));
const SettingsPage = lazy(() => import("../SuperAdmin/pages/SettingsPage"));

// Auth Pages
const LoginPage = lazy(() => import("../SuperAdmin/pages/LoginPage"));

// Error Pages
const UnauthorizedPage = lazy(() => import("../SuperAdmin/pages/UnauthorizedPage"));
const SuspendedPage = lazy(() => import("../SuperAdmin/pages/SuspendedPage"));
const NotFoundPage = lazy(() => import("../SuperAdmin/pages/NotFoundPage"));

// ============================================================
// LOADING FALLBACK
// ============================================================
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 text-sm font-medium tracking-wide">Loading...</p>
    </div>
  </div>
);

// ============================================================
// APP ROUTES
// ============================================================
const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/suspended" element={<SuspendedPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/inactive" element={<SuspendedPage type="inactive" />} />

        {/* ================================================
            SUPER ADMIN ROUTES
            ================================================ */}
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute requiredRoles={[ROLES.SUPER_ADMIN]}>
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />

          <Route
            path="users"
            element={
              <ProtectedRoute requiredPermissions={[PERMISSIONS.VIEW_USERS]}>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="students"
            element={
              <ProtectedRoute requiredPermissions={[PERMISSIONS.VIEW_STUDENTS]}>
                <StudentControlPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="trainers"
            element={
              <ProtectedRoute requiredPermissions={[PERMISSIONS.VIEW_TRAINERS]}>
                <TrainerControlPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="admins"
            element={
              <ProtectedRoute requiredPermissions={[PERMISSIONS.VIEW_ADMINS]}>
                <AdminControlPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="permissions"
            element={
              <ProtectedRoute requiredPermissions={[PERMISSIONS.MANAGE_PERMISSIONS]}>
                <PermissionManagerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="analytics"
            element={
              <ProtectedRoute requiredPermissions={[PERMISSIONS.VIEW_ANALYTICS]}>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="approvals"
            element={
              <ProtectedRoute requiredPermissions={[PERMISSIONS.APPROVE_TRAINER]}>
                <PendingApprovalsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="security"
            element={
              <ProtectedRoute requiredPermissions={[PERMISSIONS.MANAGE_SECURITY]}>
                <SecuritySettingsPage />
              </ProtectedRoute>
            }
          />

          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* ================================================
            ADMIN ROUTES
            ================================================ */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
              {/* Renders existing Admin module components */}
              <div>Admin Module (connect your existing Admin/ components here)</div>
            </ProtectedRoute>
          }
        />

        {/* ================================================
            TRAINER ROUTES
            ================================================ */}
        <Route
          path="/trainer/*"
          element={
            <ProtectedRoute requiredRoles={[ROLES.TRAINER, ROLES.SUPER_ADMIN]}>
              <div>Trainer Module (connect your existing Trainer/ components here)</div>
            </ProtectedRoute>
          }
        />

        {/* ================================================
            STUDENT ROUTES
            ================================================ */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute requiredRoles={[ROLES.STUDENT, ROLES.SUPER_ADMIN]}>
              <div>Student Module (connect your existing Student/ components here)</div>
            </ProtectedRoute>
          }
        />

        {/* Default redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;