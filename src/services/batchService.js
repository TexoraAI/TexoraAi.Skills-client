import axios from "axios";

const BASE_URL = "http://localhost:9000/api";

/**
 * Helper to build Authorization header
 */
const authHeader = () => {
  const token = localStorage.getItem("lms_token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

/* =================================================
   ADMIN APIs
   ================================================= */

/**
 * ADMIN → Create new batch
 */
export const createBatch = async (payload) => {
  return axios.post(`${BASE_URL}/admin/batches`, payload, {
    headers: authHeader(),
  });
};

/* =================================================
   TRAINER APIs
   ================================================= */

/**
 * TRAINER → Get my batches
 */
export const getTrainerBatches = async () => {
  return axios.get(`${BASE_URL}/trainer/batches`, {
    headers: authHeader(),
  });
};

/**
 * TRAINER → Get batch reports
 */
export const getBatchReports = async () => {
  return axios.get(`${BASE_URL}/trainer/batch-reports`, {
    headers: authHeader(),
  });
};

/* =================================================
   STUDENT APIs
   ================================================= */

/**
 * STUDENT → Get assigned batch
 */
export const getStudentBatch = async () => {
  return axios.get(`${BASE_URL}/student/batch`, {
    headers: authHeader(),
  });
};

/* =================================================
   ADMIN – UPDATE / GET SINGLE BATCH
   ================================================= */

/**
 * ADMIN → Get batch by ID (for edit form)
 */
export const getBatchById = async (batchId) => {
  return axios.get(`${BASE_URL}/admin/batches/${batchId}`, {
    headers: authHeader(),
  });
};

/**
 * ADMIN → Update existing batch
 */
export const updateBatch = async (batchId, payload) => {
  return axios.put(`${BASE_URL}/admin/batches/${batchId}`, payload, {
    headers: authHeader(),
  });
};

/**
 * ADMIN → Get all branches
 */
export const getBranches = async () => {
  return axios.get(`${BASE_URL}/admin/branches`, {
    headers: authHeader(),
  });
};

/**
 * ADMIN → Create branch
 */
export const createBranch = async (payload) => {
  return axios.post(`${BASE_URL}/admin/branches`, payload, {
    headers: authHeader(),
  });
};

/* =================================================
   ADMIN → BATCH APIs
   ================================================= */

export const getAdminBatches = async () => {
  return axios.get(`${BASE_URL}/admin/batches`, {
    headers: authHeader(),
  });
};

export const getAllBatches = async () => {
  return axios.get(`${BASE_URL}/admin/batches`, {
    headers: authHeader(),
  });
};

/**
 * ADMIN → Update branch
 */
export const updateBranch = async (id, payload) => {
  return axios.put(`${BASE_URL}/admin/branches/${id}`, payload, {
    headers: authHeader(),
  });
};

/**
 * ADMIN → Delete batch
 */
export const deleteBatch = async (batchId) => {
  return axios.delete(`${BASE_URL}/admin/batches/${batchId}`, {
    headers: authHeader(),
  });
};