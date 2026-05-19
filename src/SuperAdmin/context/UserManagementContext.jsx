import React, { createContext, useContext, useReducer, useCallback } from "react";
import { USER_STATUS, ROLES } from "../constants/permissions";

// ← "export" added so SuperAdminTopbar can import it directly if needed
export const UserManagementContext = createContext(null);

// ============================================================
// MOCK DATA
// ============================================================
const generateUsers = () => {
  const students = Array.from({ length: 48 }, (_, i) => ({
    id: `stu-${String(i + 1).padStart(3, "0")}`,
    name: ["Aarav Sharma", "Priya Singh", "Ravi Kumar", "Anjali Gupta", "Mohit Verma", "Deepa Nair", "Arjun Patel", "Sneha Iyer"][i % 8] + ` ${i + 1}`,
    email: `student${i + 1}@example.com`,
    role: ROLES.STUDENT,
    status: [USER_STATUS.ACTIVE, USER_STATUS.ACTIVE, USER_STATUS.ACTIVE, USER_STATUS.INACTIVE, USER_STATUS.PENDING, USER_STATUS.SUSPENDED][i % 6],
    enrolledCourses: Math.floor(Math.random() * 5) + 1,
    progress: Math.floor(Math.random() * 100),
    joinedAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    lastLogin: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    avatar: null,
  }));

  const trainers = Array.from({ length: 18 }, (_, i) => ({
    id: `tra-${String(i + 1).padStart(3, "0")}`,
    name: ["Dr. Rahul Mehta", "Prof. Kavita Reddy", "Suresh Nair", "Meena Pillai", "Vijay Krishnan"][i % 5] + ` ${i + 1}`,
    email: `trainer${i + 1}@example.com`,
    role: ROLES.TRAINER,
    status: [USER_STATUS.ACTIVE, USER_STATUS.ACTIVE, USER_STATUS.PENDING, USER_STATUS.INACTIVE][i % 4],
    specialization: ["React.js", "Python", "Data Science", "UI/UX", "Node.js"][i % 5],
    totalStudents: Math.floor(Math.random() * 200) + 10,
    rating: (Math.random() * 2 + 3).toFixed(1),
    joinedAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    lastLogin: new Date(Date.now() - Math.random() * 15 * 86400000).toISOString(),
    avatar: null,
  }));

  const admins = Array.from({ length: 6 }, (_, i) => ({
    id: `adm-${String(i + 1).padStart(3, "0")}`,
    name: ["Kiran Desai", "Pooja Bhatt", "Anil Joshi", "Sunita Rao"][i % 4] + ` ${i + 1}`,
    email: `admin${i + 1}@texora.ai`,
    role: ROLES.ADMIN,
    status: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE][i % 2],
    department: ["Academics", "Support", "Operations", "Finance"][i % 4],
    joinedAt: new Date(2024, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1).toISOString(),
    lastLogin: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
    avatar: null,
    customPermissions: { add: [], remove: [] },
  }));

  return { students, trainers, admins };
};

const { students, trainers, admins } = generateUsers();

const initialState = {
  students,
  trainers,
  admins,
  activityLogs: [],
  pendingApprovals: [
    ...students.filter((s) => s.status === USER_STATUS.PENDING),
    ...trainers.filter((t) => t.status === USER_STATUS.PENDING),
  ],
};

// ============================================================
// REDUCER
// ============================================================
const userReducer = (state, action) => {
  const updateInList = (list, id, updates) =>
    list.map((u) => (u.id === id ? { ...u, ...updates } : u));

  switch (action.type) {
    case "UPDATE_USER_STATUS": {
      const { id, status, role } = action.payload;
      if (role === ROLES.STUDENT) return { ...state, students: updateInList(state.students, id, { status }) };
      if (role === ROLES.TRAINER) return { ...state, trainers: updateInList(state.trainers, id, { status }) };
      return { ...state, admins: updateInList(state.admins, id, { status }) };
    }
    case "CREATE_USER": {
      const user = {
        ...action.payload,
        id: `${action.payload.role.slice(0, 3)}-${Date.now()}`,
        joinedAt: new Date().toISOString(),
        lastLogin: null,
        status: USER_STATUS.ACTIVE,
      };
      if (user.role === ROLES.STUDENT) return { ...state, students: [...state.students, user] };
      if (user.role === ROLES.TRAINER) return { ...state, trainers: [...state.trainers, user] };
      if (user.role === ROLES.ADMIN)   return { ...state, admins:   [...state.admins,   user] };
      return state;
    }
    case "UPDATE_USER": {
      const { id, role, ...updates } = action.payload;
      if (role === ROLES.STUDENT) return { ...state, students: updateInList(state.students, id, updates) };
      if (role === ROLES.TRAINER) return { ...state, trainers: updateInList(state.trainers, id, updates) };
      return { ...state, admins: updateInList(state.admins, id, updates) };
    }
    case "DELETE_USER": {
      const { id, role } = action.payload;
      if (role === ROLES.STUDENT) return { ...state, students: state.students.filter((u) => u.id !== id) };
      if (role === ROLES.TRAINER) return { ...state, trainers: state.trainers.filter((u) => u.id !== id) };
      return { ...state, admins: state.admins.filter((u) => u.id !== id) };
    }
    case "APPROVE_USER": {
      const { id } = action.payload;
      return {
        ...state,
        students: updateInList(state.students, id, { status: USER_STATUS.ACTIVE }),
        trainers: updateInList(state.trainers, id, { status: USER_STATUS.ACTIVE }),
        pendingApprovals: state.pendingApprovals.filter((u) => u.id !== id),
      };
    }
    case "REJECT_USER": {
      const { id } = action.payload;
      return { ...state, pendingApprovals: state.pendingApprovals.filter((u) => u.id !== id) };
    }
    default:
      return state;
  }
};

// ============================================================
// PROVIDER
// ============================================================
export const UserManagementProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const updateUserStatus = useCallback((id, status, role) => dispatch({ type: "UPDATE_USER_STATUS", payload: { id, status, role } }), []);
  const createUser       = useCallback((userData)          => dispatch({ type: "CREATE_USER",        payload: userData }),              []);
  const updateUser       = useCallback((userData)          => dispatch({ type: "UPDATE_USER",        payload: userData }),              []);
  const deleteUser       = useCallback((id, role)          => dispatch({ type: "DELETE_USER",        payload: { id, role } }),          []);
  const approveUser      = useCallback((id)                => dispatch({ type: "APPROVE_USER",       payload: { id } }),                []);
  const rejectUser       = useCallback((id)                => dispatch({ type: "REJECT_USER",        payload: { id } }),                []);

  const getAllUsers = useCallback(() => [
    ...state.students, ...state.trainers, ...state.admins,
  ], [state]);

  const getStats = useCallback(() => {
    const all = getAllUsers();
    return {
      totalStudents:  state.students.length,
      totalTrainers:  state.trainers.length,
      totalAdmins:    state.admins.length,
      totalUsers:     all.length,
      activeUsers:    all.filter((u) => u.status === USER_STATUS.ACTIVE).length,
      inactiveUsers:  all.filter((u) => u.status === USER_STATUS.INACTIVE).length,
      suspendedUsers: all.filter((u) => u.status === USER_STATUS.SUSPENDED).length,
      pendingUsers:   all.filter((u) => u.status === USER_STATUS.PENDING).length,
    };
  }, [getAllUsers, state]);

  return (
    <UserManagementContext.Provider value={{
      ...state,
      updateUserStatus, createUser, updateUser, deleteUser,
      approveUser, rejectUser, getAllUsers, getStats,
    }}>
      {children}
    </UserManagementContext.Provider>
  );
};

export const useUserManagement = () => {
  const ctx = useContext(UserManagementContext);
  if (!ctx) throw new Error("useUserManagement must be used within UserManagementProvider");
  return ctx;
};