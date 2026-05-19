import React, { createContext, useContext, useReducer, useCallback } from "react";
import { ROLES, ROLE_PERMISSIONS, USER_STATUS } from "../constants/permissions";

// ============================================================
// AUTH CONTEXT
// ============================================================
const AuthContext = createContext(null);

// ============================================================
// INITIAL STATE
// ============================================================
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  customPermissions: null, // SuperAdmin can override per-user permissions
};

// ============================================================
// REDUCER
// ============================================================
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        customPermissions: action.payload.customPermissions || null,
      };

    case "LOGIN_FAILURE":
      return { ...state, isLoading: false };

    case "LOGOUT":
      return { ...initialState };

    case "UPDATE_USER":
      return { ...state, user: { ...state.user, ...action.payload } };

    case "UPDATE_PERMISSIONS":
      return { ...state, customPermissions: action.payload };

    default:
      return state;
  }
};

// ============================================================
// MOCK USER DATA (Replace with real API calls)
// ============================================================
const MOCK_USERS = {
  superadmin: {
    id: "sa-001",
    name: "Super Admin",
    email: "superadmin@texora.ai",
    role: ROLES.SUPER_ADMIN,
    status: USER_STATUS.ACTIVE,
    avatar: null,
    joinedAt: "2024-01-01",
    lastLogin: new Date().toISOString(),
  },
  admin: {
    id: "ad-001",
    name: "Admin User",
    email: "admin@texora.ai",
    role: ROLES.ADMIN,
    status: USER_STATUS.ACTIVE,
    avatar: null,
    joinedAt: "2024-02-01",
    lastLogin: new Date().toISOString(),
  },
};

// ============================================================
// PROVIDER
// ============================================================
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Login
  const login = useCallback(async (credentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      // Replace with real API call
      await new Promise((r) => setTimeout(r, 800));

      const mockUser = credentials.role === "admin"
        ? MOCK_USERS.admin
        : MOCK_USERS.superadmin;

      // Check user status
      if (mockUser.status === USER_STATUS.SUSPENDED) {
        throw new Error("Your account has been suspended. Contact support.");
      }
      if (mockUser.status === USER_STATUS.INACTIVE) {
        throw new Error("Your account is inactive. Contact your administrator.");
      }

      dispatch({ type: "LOGIN_SUCCESS", payload: mockUser });
      return { success: true, user: mockUser };
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE" });
      return { success: false, error: err.message };
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
  }, []);

  // Update user
  const updateUser = useCallback((data) => {
    dispatch({ type: "UPDATE_USER", payload: data });
  }, []);

  // Update custom permissions (SuperAdmin only)
  const updatePermissions = useCallback((permissions) => {
    dispatch({ type: "UPDATE_PERMISSIONS", payload: permissions });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateUser,
        updatePermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// HOOK
// ============================================================
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};