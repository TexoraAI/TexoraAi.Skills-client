import React, { createContext, useContext, useReducer, useCallback, useMemo } from "react";
import { USER_STATUS, ROLES } from "../constants/permissions";
import {
  MOCK_ORGANIZATIONS,
  MOCK_ORG_ADMINS,
  MOCK_TRAINERS,
  MOCK_BATCHES,
  MOCK_STUDENTS,
} from "../constants/mockData";

// ============================================================
// CONTEXT
// ============================================================
export const SaasContext = createContext(null);

// ============================================================
// INITIAL STATE — Relational (not flat arrays)
// ============================================================
const initialState = {
  organizations: MOCK_ORGANIZATIONS,
  orgAdmins:     MOCK_ORG_ADMINS,
  trainers:      MOCK_TRAINERS,
  batches:       MOCK_BATCHES,
  students:      MOCK_STUDENTS,
  // Session: which org the current org-admin belongs to (null = superadmin sees all)
  sessionOrgId:  null,
  // UI helpers
  activityLog:   [],
};

// ============================================================
// ID GENERATOR
// ============================================================
const makeId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// ============================================================
// REDUCER
// ============================================================
function saasReducer(state, action) {
  const log = (msg) => ({
    ...state,
    activityLog: [{ id: makeId("log"), msg, ts: new Date().toISOString() }, ...state.activityLog.slice(0, 99)],
  });

  const upd = (list, id, patch) => list.map((x) => (x.id === id ? { ...x, ...patch } : x));

  switch (action.type) {

    // ── ORGANIZATIONS ─────────────────────────────────────────
    case "CREATE_ORGANIZATION": {
      const org = { ...action.payload, id: makeId("org"), createdAt: new Date().toISOString(), meta: { totalAdmins: 0, totalTrainers: 0, totalBatches: 0, totalStudents: 0, activeStudents: 0 } };
      return { ...state, organizations: [...state.organizations, org] };
    }
    case "UPDATE_ORGANIZATION":
      return { ...state, organizations: upd(state.organizations, action.payload.id, action.payload) };
    case "DELETE_ORGANIZATION": {
      const { orgId } = action.payload;
      // Cascade: remove all related data
      const batchIds = state.batches.filter((b) => b.organizationId === orgId).map((b) => b.id);
      return {
        ...state,
        organizations: state.organizations.filter((o) => o.id !== orgId),
        orgAdmins:     state.orgAdmins.filter((a) => a.organizationId !== orgId),
        trainers:      state.trainers.filter((t) => t.organizationId !== orgId),
        batches:       state.batches.filter((b) => b.organizationId !== orgId),
        students:      state.students.filter((s) => s.organizationId !== orgId),
      };
    }
    case "UPDATE_ORG_STATUS":
      return { ...state, organizations: upd(state.organizations, action.payload.id, { status: action.payload.status }) };

    // ── ORG ADMINS ────────────────────────────────────────────
    case "CREATE_ORG_ADMIN": {
      const admin = { ...action.payload, id: makeId("oadm"), role: ROLES.ORG_ADMIN, joinedAt: new Date().toISOString(), lastLogin: null, avatar: null };
      return { ...state, orgAdmins: [...state.orgAdmins, admin] };
    }
    case "UPDATE_ORG_ADMIN":
      return { ...state, orgAdmins: upd(state.orgAdmins, action.payload.id, action.payload) };
    case "DELETE_ORG_ADMIN":
      return { ...state, orgAdmins: state.orgAdmins.filter((a) => a.id !== action.payload.id) };
    case "UPDATE_ORG_ADMIN_STATUS":
      return { ...state, orgAdmins: upd(state.orgAdmins, action.payload.id, { status: action.payload.status }) };

    // ── TRAINERS ──────────────────────────────────────────────
    case "CREATE_TRAINER": {
      const trainer = { ...action.payload, id: makeId("tr"), role: ROLES.TRAINER, batchIds: [], joinedAt: new Date().toISOString(), lastLogin: null, avatar: null, totalStudents: 0 };
      return { ...state, trainers: [...state.trainers, trainer] };
    }
    case "UPDATE_TRAINER":
      return { ...state, trainers: upd(state.trainers, action.payload.id, action.payload) };
    case "DELETE_TRAINER": {
      const { id } = action.payload;
      // Unassign trainer from batches; students remain but trainerId cleared
      return {
        ...state,
        trainers: state.trainers.filter((t) => t.id !== id),
        batches:  state.batches.map((b) => b.trainerId === id ? { ...b, trainerId: null } : b),
        students: state.students.map((s) => s.trainerId === id ? { ...s, trainerId: null } : s),
      };
    }
    case "UPDATE_TRAINER_STATUS":
      return { ...state, trainers: upd(state.trainers, action.payload.id, { status: action.payload.status }) };
    case "APPROVE_TRAINER":
      return { ...state, trainers: upd(state.trainers, action.payload.id, { status: USER_STATUS.ACTIVE }) };

    // ── BATCHES ───────────────────────────────────────────────
    case "CREATE_BATCH": {
      const batch = { ...action.payload, id: makeId("batch"), studentIds: [], progress: 0, createdAt: new Date().toISOString() };
      // Add batchId to trainer
      const trainers = action.payload.trainerId
        ? upd(state.trainers, action.payload.trainerId, {
            batchIds: [...(state.trainers.find((t) => t.id === action.payload.trainerId)?.batchIds || []), batch.id],
          })
        : state.trainers;
      return { ...state, batches: [...state.batches, batch], trainers };
    }
    case "UPDATE_BATCH":
      return { ...state, batches: upd(state.batches, action.payload.id, action.payload) };
    case "DELETE_BATCH": {
      const { id } = action.payload;
      const batch = state.batches.find((b) => b.id === id);
      if (!batch) return state;
      // Unassign students from batch
      return {
        ...state,
        batches:  state.batches.filter((b) => b.id !== id),
        students: state.students.map((s) => s.batchId === id ? { ...s, batchId: null } : s),
        trainers: batch.trainerId
          ? upd(state.trainers, batch.trainerId, {
              batchIds: (state.trainers.find((t) => t.id === batch.trainerId)?.batchIds || []).filter((bid) => bid !== id),
            })
          : state.trainers,
      };
    }
    case "ASSIGN_TRAINER_TO_BATCH": {
      const { batchId, trainerId, prevTrainerId } = action.payload;
      const batch = state.batches.find((b) => b.id === batchId);
      let trainers = state.trainers;
      // Remove from old trainer
      if (prevTrainerId) {
        trainers = upd(trainers, prevTrainerId, {
          batchIds: (trainers.find((t) => t.id === prevTrainerId)?.batchIds || []).filter((b) => b !== batchId),
        });
      }
      // Add to new trainer
      if (trainerId) {
        trainers = upd(trainers, trainerId, {
          batchIds: [...new Set([...(trainers.find((t) => t.id === trainerId)?.batchIds || []), batchId])],
        });
      }
      return { ...state, batches: upd(state.batches, batchId, { trainerId }), trainers };
    }

    // ── STUDENTS ──────────────────────────────────────────────
    case "CREATE_STUDENT": {
      const student = { ...action.payload, id: makeId("stu"), role: ROLES.STUDENT, joinedAt: new Date().toISOString(), lastLogin: null, avatar: null, progress: 0, enrolledCourses: 0 };
      // Add student to batch
      const batches = student.batchId
        ? upd(state.batches, student.batchId, {
            studentIds: [...(state.batches.find((b) => b.id === student.batchId)?.studentIds || []), student.id],
          })
        : state.batches;
      return { ...state, students: [...state.students, student], batches };
    }
    case "UPDATE_STUDENT":
      return { ...state, students: upd(state.students, action.payload.id, action.payload) };
    case "DELETE_STUDENT": {
      const { id } = action.payload;
      const student = state.students.find((s) => s.id === id);
      if (!student) return state;
      return {
        ...state,
        students: state.students.filter((s) => s.id !== id),
        batches: student.batchId
          ? upd(state.batches, student.batchId, {
              studentIds: (state.batches.find((b) => b.id === student.batchId)?.studentIds || []).filter((sid) => sid !== id),
            })
          : state.batches,
      };
    }
    case "UPDATE_STUDENT_STATUS":
      return { ...state, students: upd(state.students, action.payload.id, { status: action.payload.status }) };
    case "MOVE_STUDENT_BATCH": {
      const { studentId, fromBatchId, toBatchId, toTrainerId, toOrgId } = action.payload;
      const batches = state.batches
        .map((b) => b.id === fromBatchId ? { ...b, studentIds: b.studentIds.filter((s) => s !== studentId) } : b)
        .map((b) => b.id === toBatchId   ? { ...b, studentIds: [...b.studentIds, studentId] } : b);
      return {
        ...state,
        batches,
        students: upd(state.students, studentId, { batchId: toBatchId, trainerId: toTrainerId, organizationId: toOrgId }),
      };
    }

    // ── SESSION (Org Admin scoping) ────────────────────────────
    case "SET_SESSION_ORG":
      return { ...state, sessionOrgId: action.payload.orgId };

    default:
      return state;
  }
}

// ============================================================
// PROVIDER
// ============================================================
export const SaasProvider = ({ children }) => {
  const [state, dispatch] = useReducer(saasReducer, initialState);

  // ── Organization actions ──────────────────────────────────
  const createOrganization  = useCallback((d) => dispatch({ type: "CREATE_ORGANIZATION",  payload: d }), []);
  const updateOrganization  = useCallback((d) => dispatch({ type: "UPDATE_ORGANIZATION",  payload: d }), []);
  const deleteOrganization  = useCallback((orgId) => dispatch({ type: "DELETE_ORGANIZATION", payload: { orgId } }), []);
  const updateOrgStatus     = useCallback((id, status) => dispatch({ type: "UPDATE_ORG_STATUS", payload: { id, status } }), []);

  // ── Org Admin actions ─────────────────────────────────────
  const createOrgAdmin       = useCallback((d) => dispatch({ type: "CREATE_ORG_ADMIN",       payload: d }), []);
  const updateOrgAdmin       = useCallback((d) => dispatch({ type: "UPDATE_ORG_ADMIN",       payload: d }), []);
  const deleteOrgAdmin       = useCallback((id) => dispatch({ type: "DELETE_ORG_ADMIN",      payload: { id } }), []);
  const updateOrgAdminStatus = useCallback((id, status) => dispatch({ type: "UPDATE_ORG_ADMIN_STATUS", payload: { id, status } }), []);

  // ── Trainer actions ───────────────────────────────────────
  const createTrainer       = useCallback((d) => dispatch({ type: "CREATE_TRAINER",       payload: d }), []);
  const updateTrainer       = useCallback((d) => dispatch({ type: "UPDATE_TRAINER",       payload: d }), []);
  const deleteTrainer       = useCallback((id) => dispatch({ type: "DELETE_TRAINER",      payload: { id } }), []);
  const updateTrainerStatus = useCallback((id, status) => dispatch({ type: "UPDATE_TRAINER_STATUS", payload: { id, status } }), []);
  const approveTrainer      = useCallback((id) => dispatch({ type: "APPROVE_TRAINER",     payload: { id } }), []);

  // ── Batch actions ─────────────────────────────────────────
  const createBatch          = useCallback((d) => dispatch({ type: "CREATE_BATCH",           payload: d }), []);
  const updateBatch          = useCallback((d) => dispatch({ type: "UPDATE_BATCH",           payload: d }), []);
  const deleteBatch          = useCallback((id) => dispatch({ type: "DELETE_BATCH",          payload: { id } }), []);
  const assignTrainerToBatch = useCallback((batchId, trainerId, prevTrainerId) =>
    dispatch({ type: "ASSIGN_TRAINER_TO_BATCH", payload: { batchId, trainerId, prevTrainerId } }), []);

  // ── Student actions ───────────────────────────────────────
  const createStudent       = useCallback((d) => dispatch({ type: "CREATE_STUDENT",       payload: d }), []);
  const updateStudent       = useCallback((d) => dispatch({ type: "UPDATE_STUDENT",       payload: d }), []);
  const deleteStudent       = useCallback((id) => dispatch({ type: "DELETE_STUDENT",      payload: { id } }), []);
  const updateStudentStatus = useCallback((id, status) => dispatch({ type: "UPDATE_STUDENT_STATUS", payload: { id, status } }), []);
  const moveStudentBatch    = useCallback((payload) => dispatch({ type: "MOVE_STUDENT_BATCH", payload }), []);

  // ── Session ───────────────────────────────────────────────
  const setSessionOrg = useCallback((orgId) => dispatch({ type: "SET_SESSION_ORG", payload: { orgId } }), []);

  // ============================================================
  // SELECTORS (memoized derived data)
  // ============================================================

  // Scoped lists (if sessionOrgId is set, filter to that org only)
  const scopedOrgs     = useMemo(() => state.sessionOrgId ? state.organizations.filter((o) => o.id === state.sessionOrgId) : state.organizations, [state.organizations, state.sessionOrgId]);
  const scopedAdmins   = useMemo(() => state.sessionOrgId ? state.orgAdmins.filter((a) => a.organizationId === state.sessionOrgId) : state.orgAdmins, [state.orgAdmins, state.sessionOrgId]);
  const scopedTrainers = useMemo(() => state.sessionOrgId ? state.trainers.filter((t) => t.organizationId === state.sessionOrgId) : state.trainers, [state.trainers, state.sessionOrgId]);
  const scopedBatches  = useMemo(() => state.sessionOrgId ? state.batches.filter((b) => b.organizationId === state.sessionOrgId) : state.batches, [state.batches, state.sessionOrgId]);
  const scopedStudents = useMemo(() => state.sessionOrgId ? state.students.filter((s) => s.organizationId === state.sessionOrgId) : state.students, [state.students, state.sessionOrgId]);

  // Per-org stats
  const getOrgStats = useCallback((orgId) => {
    const admins   = state.orgAdmins.filter((a) => a.organizationId === orgId);
    const trainers = state.trainers.filter((t) => t.organizationId === orgId);
    const batches  = state.batches.filter((b) => b.organizationId === orgId);
    const students = state.students.filter((s) => s.organizationId === orgId);
    return {
      totalAdmins:   admins.length,
      totalTrainers: trainers.length,
      totalBatches:  batches.length,
      totalStudents: students.length,
      activeStudents: students.filter((s) => s.status === USER_STATUS.ACTIVE).length,
      activeBatches: batches.filter((b) => b.status === "active").length,
    };
  }, [state.orgAdmins, state.trainers, state.batches, state.students]);

  // Trainer's batches with students
  const getTrainerData = useCallback((trainerId) => {
    const trainer  = state.trainers.find((t) => t.id === trainerId);
    const batches  = state.batches.filter((b) => b.trainerId === trainerId);
    const students = state.students.filter((s) => s.trainerId === trainerId);
    return { trainer, batches, students };
  }, [state.trainers, state.batches, state.students]);

  // Batch with full student objects
  const getBatchDetails = useCallback((batchId) => {
    const batch    = state.batches.find((b) => b.id === batchId);
    const students = state.students.filter((s) => s.batchId === batchId);
    const trainer  = batch ? state.trainers.find((t) => t.id === batch.trainerId) : null;
    const org      = batch ? state.organizations.find((o) => o.id === batch.organizationId) : null;
    return { batch, students, trainer, org };
  }, [state.batches, state.students, state.trainers, state.organizations]);

  // Org trainers with their batches/students (full tree for OrgAdmin view)
  const getOrgTree = useCallback((orgId) => {
    const org     = state.organizations.find((o) => o.id === orgId);
    const admins  = state.orgAdmins.filter((a) => a.organizationId === orgId);
    const trainers = state.trainers.filter((t) => t.organizationId === orgId).map((t) => ({
      ...t,
      batches: state.batches.filter((b) => b.trainerId === t.id).map((b) => ({
        ...b,
        students: state.students.filter((s) => s.batchId === b.id),
      })),
    }));
    return { org, admins, trainers };
  }, [state.organizations, state.orgAdmins, state.trainers, state.batches, state.students]);

  // Global stats (for SuperAdmin dashboard)
  const getGlobalStats = useCallback(() => ({
    totalOrganizations: state.organizations.length,
    activeOrganizations: state.organizations.filter((o) => o.status === "active").length,
    totalOrgAdmins:  state.orgAdmins.length,
    totalTrainers:   state.trainers.length,
    activeTrainers:  state.trainers.filter((t) => t.status === USER_STATUS.ACTIVE).length,
    pendingTrainers: state.trainers.filter((t) => t.status === USER_STATUS.PENDING).length,
    totalBatches:    state.batches.length,
    activeBatches:   state.batches.filter((b) => b.status === "active").length,
    totalStudents:   state.students.length,
    activeStudents:  state.students.filter((s) => s.status === USER_STATUS.ACTIVE).length,
    pendingStudents: state.students.filter((s) => s.status === USER_STATUS.PENDING).length,
  }), [state]);

  // Trainers available for an org (not yet assigned to a batch, or available)
  const getOrgTrainers = useCallback((orgId) =>
    state.trainers.filter((t) => t.organizationId === orgId && t.status === USER_STATUS.ACTIVE),
    [state.trainers]);

  // Batches available for a trainer
  const getTrainerBatches = useCallback((trainerId) =>
    state.batches.filter((b) => b.trainerId === trainerId),
    [state.batches]);

  // Context value
  const value = {
    // Raw state
    ...state,

    // Scoped (role-filtered)
    organizations: scopedOrgs,
    orgAdmins:     scopedAdmins,
    trainers:      scopedTrainers,
    batches:       scopedBatches,
    students:      scopedStudents,

    // Actions
    createOrganization, updateOrganization, deleteOrganization, updateOrgStatus,
    createOrgAdmin, updateOrgAdmin, deleteOrgAdmin, updateOrgAdminStatus,
    createTrainer, updateTrainer, deleteTrainer, updateTrainerStatus, approveTrainer,
    createBatch, updateBatch, deleteBatch, assignTrainerToBatch,
    createStudent, updateStudent, deleteStudent, updateStudentStatus, moveStudentBatch,
    setSessionOrg,

    // Selectors
    getOrgStats, getTrainerData, getBatchDetails, getOrgTree, getGlobalStats,
    getOrgTrainers, getTrainerBatches,
  };

  return <SaasContext.Provider value={value}>{children}</SaasContext.Provider>;
};

// ============================================================
// HOOKS
// ============================================================
export const useSaas = () => {
  const ctx = useContext(SaasContext);
  if (!ctx) throw new Error("useSaas must be used within <SaasProvider>");
  return ctx;
};

// Convenience scoped hooks
export const useOrganizations = () => { const { organizations, ...rest } = useSaas(); return { organizations, ...rest }; };
export const useTrainers      = () => { const { trainers, ...rest } = useSaas(); return { trainers, ...rest }; };
export const useBatches       = () => { const { batches, ...rest } = useSaas(); return { batches, ...rest }; };
export const useStudents      = () => { const { students, ...rest } = useSaas(); return { students, ...rest }; };
export const useOrgAdmins     = () => { const { orgAdmins, ...rest } = useSaas(); return { orgAdmins, ...rest }; };