import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../SuperAdmin/context/AuthContext";
import { usePermissions } from "../SuperAdmin/context/PermissionContext";
import { USER_STATUS } from "../constants/permissions";

// ============================================================
// PROTECTED ROUTE
// Handles: authentication, role, permission, status checks
// ============================================================
const ProtectedRoute = ({
  children,
  requiredRoles = [],        // e.g. ['superadmin', 'admin']
  requiredPermissions = [],  // e.g. ['view_students']
  requireAll = false,        // true = AND, false = OR for permissions
  redirectTo = "/login",
}) => {
  const { isAuthenticated, user } = useAuth();
  const { hasRole, hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions();
  const location = useLocation();

  // 1. Not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 2. Account suspended
  if (user.status === USER_STATUS.SUSPENDED) {
    return <Navigate to="/suspended" replace />;
  }

  // 3. Account inactive
  if (user.status === USER_STATUS.INACTIVE) {
    return <Navigate to="/inactive" replace />;
  }

  // 4. Role check
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 5. Permission check
  if (requiredPermissions.length > 0) {
    const permitted = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!permitted) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;