import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

/* ================= AUTH ================= */

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lms_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* =====================================================
   BRANCH APIs  (BranchController)
   ===================================================== */

export const getBranches = () => api.get("/branch");

export const createBranch = (data) => api.post("/branch", data);

export const deleteBranch = (branchId) => api.delete(`/branch/${branchId}`);

export const updateBranch = (id, data) => api.put(`/branch/${id}`, data);

/* =====================================================
   BATCH APIs (BatchController)
   ===================================================== */

export const createBatch = (payload) =>
  api.post("/batch/admin/batches", payload);

export const deleteBatch = (batchId) =>
  api.delete(`/batch/admin/batches/${batchId}`);

export const getAllBatches = () => api.get("/batch/admin/batches");

/* =====================================================
   TRAINER – STUDENT MAPPING
   ===================================================== */

export const getTrainerStudents = async (batchId) => {
  const res = await api.get(`/batch/admin/batches/${batchId}/trainer-students`);
  return res.data;
};

export const assignStudentsToTrainer = (batchId, trainerEmail, emails) =>
  api.post(
    `/batch/admin/batches/${batchId}/trainers/${trainerEmail}/students`,
    { studentEmails: emails },
  );

export const getAvailableStudents = (batchId, trainerEmail) =>
  api.get(
    `/batch/admin/batches/${batchId}/trainers/${encodeURIComponent(trainerEmail)}/available-students`,
  );

export const removeTrainerFromBatch = (batchId, trainerEmail) =>
  api.delete(`/batch/admin/batches/${batchId}/trainer`, {
    params: { trainerEmail },
  });

/* =====================================================
   TRAINER DASHBOARD
   ===================================================== */

export const getTrainerBatches = async () => {
  const res = await api.get("/batch/trainer");
  return res.data;
};

/* =====================================================
   STUDENT DASHBOARD
   ===================================================== */

export const getStudentBatch = async () => {
  const res = await api.get("/batch/student");
  return res.data;
};

export const getAvailableTrainers = (batchId) =>
  api.get(`/batch/admin/batches/${batchId}/available-trainers`);

export const removeTrainer = (batchId, trainerEmail) =>
  api.delete(`/batch/admin/batches/${batchId}/trainers/${trainerEmail}`);

export const assignTrainer = (batchId, trainerEmail) =>
  api.put(`/batch/admin/batches/${batchId}/trainers/${trainerEmail}`, {});

export const removeStudentFromTrainer = (batchId, trainerEmail, studentEmail) =>
  api.delete(
    `/batch/admin/batches/${batchId}/trainers/${encodeURIComponent(trainerEmail)}/students/${encodeURIComponent(studentEmail)}`,
  );

export const getTrainerDashboard = async () => {
  const batches = await api.get("/batch/trainer");
  const students = await api.get("/batch/trainer/students");

  return {
    batches: batches.data || [],
    students: students.data || [],
  };
};

/* TRAINER — STUDENTS IN A BATCH */
export const getTrainerBatchStudents = (batchId) =>
  api.get(`/batch/trainer/batches/${batchId}/students`);

// ================= STUDENT CLASSROOM =================

export const getStudentClassroom = () => api.get("/batch/student/classroom");

// =====================================================
// DEPARTMENT APIs (DepartmentController)
// =====================================================

export const getDepartments = () => api.get("/departments");

export const createDepartment = (data) => api.post("/departments", data);

export const updateDepartment = (id, data) =>
  api.put(`/departments/${id}`, data);

export const deleteDepartment = (id) => api.delete(`/departments/${id}`);

/* =====================================================
   SUPERADMIN — GLOBAL (organizationId = null) APIs
   ===================================================== */

export const getGlobalDepartments = () => api.get("/departments/global");

export const getGlobalBranches = () => api.get("/branch/global");

export const getGlobalBatches = () => api.get("/batch/admin/batches/global");

export const getAvailableTrainersGlobal = (batchId) =>
  api.get(`/batch/admin/batches/${batchId}/available-trainers-global`);

export const getAvailableStudentsGlobal = (batchId, trainerEmail) =>
  api.get(
    `/batch/admin/batches/${batchId}/trainers/${encodeURIComponent(trainerEmail)}/available-students-global`,
  );

// In your batchService.js or wherever batch API calls live:
//for count of each deprt and barcnha nd batch count toshow in prife of admin profie tab
export const getOrgSummary = () =>
  api.get("/batch/admin/org-summary").then((res) => res.data);

// ===== SUPERADMIN — get departments for a specific org =====
export const getDepartmentsByOrg = (orgId) =>
  api.get(`/departments/by-org/${orgId}`).then((res) => res.data);

// ===== SUPERADMIN — get branches for a specific org =====
export const getBranchesByOrg = (orgId) =>
  api.get(`/branch/by-org/${orgId}`).then((res) => res.data);

// ===== SUPERADMIN — get batches for a specific org =====
export const getBatchesByOrg = (orgId) =>
  api.get(`/batch/admin/batches/by-org/${orgId}`).then((res) => res.data);

/* =====================================================
   FEATURE FLAGS (BatchFeatureFlagsController)
   Controller is mounted at /api/feature-flags
   ===================================================== */

// ===== ORG-SCOPED — affects all trainers/students/admins in this org =====
export const getOrgFeatureFlags = (orgId) =>
  api.get(`/feature-flags/org/${orgId}`).then((res) => res.data);

export const updateOrgFeatureFlags = (orgId, dto) =>
  api.put(`/feature-flags/org/${orgId}`, dto).then((res) => res.data);

// ===== INDIVIDUAL (email-scoped) — affects only one org-less user =====
export const getIndividualFeatureFlags = (email) =>
  api
    .get(`/feature-flags/individual`, { params: { email } })
    .then((res) => res.data);

export const updateIndividualFeatureFlags = (email, dto) =>
  api
    .put(`/feature-flags/individual`, dto, { params: { email } })
    .then((res) => res.data);
