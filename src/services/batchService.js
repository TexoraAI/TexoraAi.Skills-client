import axios from "axios";

const BASE_URL =   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

/* ================= AUTH ================= */

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});

const api = axios.create({
  baseURL: BASE_URL,
  headers: authHeader(),
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

/* CREATE BATCH */
export const createBatch = (payload) =>
  api.post("/batch/admin/batches", payload);

export const deleteBatch = (batchId) =>
  api.delete(`/batch/admin/batches/${batchId}`);

export const getAllBatches = () =>
  axios.get(`${BASE_URL}/batch/admin/batches`, { headers: authHeader() });

/* =====================================================
   TRAINER – STUDENT MAPPING
   ===================================================== */

/* Get trainer -> students map inside batch */
export const getTrainerStudents = async (batchId) => {
  const res = await api.get(`/batch/admin/batches/${batchId}/trainer-students`);
  return res.data;
};

/* Assign students under trainer */
export const assignStudentsToTrainer = (batchId, trainerEmail, emails) =>
  api.post(
    `/batch/admin/batches/${batchId}/trainers/${trainerEmail}/students`,
    { studentEmails: emails },
  );
export const getAvailableStudents = (batchId, trainerEmail) =>
  axios.get(
    `${BASE_URL}/batch/admin/batches/${batchId}/trainers/${encodeURIComponent(trainerEmail)}/available-students`,
    { headers: authHeader() },
  );

// /* Remove trainer from batch */
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
  axios.get(`${BASE_URL}/batch/admin/batches/${batchId}/available-trainers`, {
    headers: authHeader(),
  });

export const removeTrainer = (batchId, trainerEmail) =>
  api.delete(`/batch/admin/batches/${batchId}/trainers/${trainerEmail}`);

export const assignTrainer = (batchId, trainerEmail) =>
  axios.put(
    `${BASE_URL}/batch/admin/batches/${batchId}/trainers/${trainerEmail}`,
    {},
    { headers: authHeader() },
  );

// export const removeStudentFromTrainer = (batchId, trainerEmail, studentEmail) =>
//   api.delete(`/batch/admin/batches/${batchId}/trainer/student`, {
//     params: {
//       trainerEmail,
//       studentEmail,
//     },
//   });
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
