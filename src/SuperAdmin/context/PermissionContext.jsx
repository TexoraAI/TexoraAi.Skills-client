import React, { createContext, useContext, useState, useCallback } from "react";
import { ROLES, ROLE_PERMISSIONS, PERMISSIONS } from "../constants/permissions";
import { useAuth } from "./AuthContext";

// ============================================================
// PERMISSION CONTEXT
// ============================================================
const PermissionContext = createContext(null);

// ============================================================
// DEFAULT ROLE PERMISSIONS (editable by SuperAdmin)
// ============================================================
const defaultRolePermissions = { ...ROLE_PERMISSIONS };

// ============================================================
// PROVIDER
// ============================================================
export const PermissionProvider = ({ children }) => {
  const { user, customPermissions } = useAuth();

  // Role-level overrides (SuperAdmin can customize per-role defaults)
  const [roleOverrides, setRoleOverrides] = useState({});

  // User-level overrides (SuperAdmin can customize per-user)
  const [userOverrides, setUserOverrides] = useState({});

  // --------------------------------------------------------
  // Get effective permissions for current user
  // --------------------------------------------------------
  const getUserPermissions = useCallback(
    (targetUserId = null, targetRole = null) => {
      const role = targetRole || user?.role;
      const userId = targetUserId || user?.id;

      if (!role) return [];

      // 1. Start with base role permissions
      let perms = [
        ...(defaultRolePermissions[role] || []),
        ...(roleOverrides[role] || []),
      ];

      // 2. Apply user-level overrides
      if (userId && userOverrides[userId]) {
        const { add = [], remove = [] } = userOverrides[userId];
        perms = [...new Set([...perms, ...add])].filter(
          (p) => !remove.includes(p)
        );
      }

      // 3. Apply customPermissions from auth (from backend)
      if (customPermissions) {
        const { add = [], remove = [] } = customPermissions;
        perms = [...new Set([...perms, ...add])].filter(
          (p) => !remove.includes(p)
        );
      }

      return perms;
    },
    [user, customPermissions, roleOverrides, userOverrides]
  );

  // --------------------------------------------------------
  // Check if current user has a specific permission
  // --------------------------------------------------------
  const hasPermission = useCallback(
    (permission) => {
      if (!user) return false;
      // SuperAdmin always has everything
      if (user.role === ROLES.SUPER_ADMIN) return true;
      const perms = getUserPermissions();
      return perms.includes(permission);
    },
    [user, getUserPermissions]
  );

  // --------------------------------------------------------
  // Check multiple permissions (AND logic)
  // --------------------------------------------------------
  const hasAllPermissions = useCallback(
    (permissionList) => permissionList.every((p) => hasPermission(p)),
    [hasPermission]
  );

  // --------------------------------------------------------
  // Check multiple permissions (OR logic)
  // --------------------------------------------------------
  const hasAnyPermission = useCallback(
    (permissionList) => permissionList.some((p) => hasPermission(p)),
    [hasPermission]
  );

  // --------------------------------------------------------
  // Check role
  // --------------------------------------------------------
  const hasRole = useCallback(
    (role) => {
      if (!user) return false;
      if (Array.isArray(role)) return role.includes(user.role);
      return user.role === role;
    },
    [user]
  );

  // --------------------------------------------------------
  // SuperAdmin: Update role permissions
  // --------------------------------------------------------
  const updateRolePermissions = useCallback((role, permissions) => {
    setRoleOverrides((prev) => ({ ...prev, [role]: permissions }));
  }, []);

  // --------------------------------------------------------
  // SuperAdmin: Update user-level permissions
  // --------------------------------------------------------
  const updateUserPermissions = useCallback((userId, { add, remove }) => {
    setUserOverrides((prev) => ({
      ...prev,
      [userId]: { add: add || [], remove: remove || [] },
    }));
  }, []);

  // --------------------------------------------------------
  // Get all permissions for a role (for UI display)
  // --------------------------------------------------------
  const getRolePermissions = useCallback(
    (role) => {
      return [
        ...(defaultRolePermissions[role] || []),
        ...(roleOverrides[role] || []),
      ];
    },
    [roleOverrides]
  );

  return (
    <PermissionContext.Provider
      value={{
        hasPermission,
        hasAllPermissions,
        hasAnyPermission,
        hasRole,
        getUserPermissions,
        updateRolePermissions,
        updateUserPermissions,
        getRolePermissions,
        roleOverrides,
        userOverrides,
        allPermissions: Object.values(PERMISSIONS),
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

// ============================================================
// HOOK
// ============================================================
export const usePermissions = () => {
  const ctx = useContext(PermissionContext);
  if (!ctx) throw new Error("usePermissions must be used within PermissionProvider");
  return ctx;
};