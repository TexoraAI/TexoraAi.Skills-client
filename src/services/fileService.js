import axios from "axios";

const API_GATEWAY =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});

const fileService = {
  // ================= TRAINER UPLOAD =================

  // ✅ UPDATED — batchId optional, status added
  uploadFile(
    file,
    batchId,
    title,
    description,
    courseId,
    category,
    status = "published",
  ) {
    const formData = new FormData();
    formData.append("file", file);
    if (batchId !== null && batchId !== undefined) {
      formData.append("batchId", batchId); // ✅ only append if real value
    }
    formData.append("title", title || "");
    formData.append("description", description || "");
    if (courseId) formData.append("courseId", courseId);
    if (category) formData.append("category", category);
    formData.append("status", status); // ✅ new

    return axios.post(`${API_GATEWAY}/file/upload`, formData, {
      headers: { ...authHeader() },
    });
  },

  //  ✅ NEW — EDIT FILE
  //  PUT /api/file/{id}/edit
  //  Pass newFile=null to keep the existing stored file.
  // ═══════════════════════════════════════════════════════════════
  editFile(
    fileId,
    newFile,
    title,
    description,
    batchId,
    courseId,
    category,
    status = "draft",
  ) {
    const formData = new FormData();
    if (newFile) formData.append("file", newFile); // only if replacing
    if (title) formData.append("title", title);
    formData.append("description", description || "");
    if (batchId !== null && batchId !== undefined) {
      formData.append("batchId", batchId);
    }
    if (courseId !== null && courseId !== undefined && courseId !== "") {
      formData.append("courseId", courseId);
    }
    if (category) formData.append("category", category);
    formData.append("status", status);
    return axios.put(`${API_GATEWAY}/file/${fileId}/edit`, formData, {
      headers: { ...authHeader() },
    });
  },

  // ✅ ADD — publish a draft that already has batch
  publishFile(fileId) {
    return axios.patch(`${API_GATEWAY}/file/${fileId}/publish`, null, {
      headers: authHeader(),
    });
  },

  // ✅ ADD — assign batch to a no-batch draft (auto-publishes)
  assignFileBatch(fileId, batchId) {
    return axios.patch(
      `${API_GATEWAY}/file/${fileId}/assign-batch?batchId=${batchId}`,
      null,
      { headers: authHeader() },
    );
  },

  // ================= TRAINER FILES =================
  getTrainerFiles() {
    return axios.get(`${API_GATEWAY}/file/trainer`, {
      headers: authHeader(),
    });
  },

  // ================= STUDENT FILES =================
  getStudentFiles() {
    return axios.get(`${API_GATEWAY}/file/student`, {
      headers: authHeader(),
    });
  },

  // ================= DOWNLOAD =================
  downloadFileBlob(fileName) {
    return axios.get(`${API_GATEWAY}/file/download/${fileName}`, {
      responseType: "blob",
      headers: authHeader(),
    });
  },

  // ================= PREVIEW / VIEW =================
  // ✅ FIX: use arraybuffer so Blob constructor gets correct binary data
  // Backend returns "inline" for PDF/images → browser opens them
  // Backend returns "attachment" for DOCX/ZIP/PPT → browser downloads them
  viewFileBlob(id) {
    return axios.get(`${API_GATEWAY}/file/view/${id}`, {
      responseType: "arraybuffer", // ✅ was "blob" — this was the bug
      headers: authHeader(),
    });
  },

  // ================= DELETE =================
  deleteFile(id) {
    return axios.delete(`${API_GATEWAY}/file/${id}`, {
      headers: authHeader(),
    });
  },

  // ==========================================
  // 🔥 COURSE CONTENT FILES (MODULE PDFs)
  // ==========================================

  uploadCourseFile(file, courseId, moduleId, batchId) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", courseId);
    formData.append("moduleId", moduleId);
    formData.append("batchId", batchId);

    return axios.post(`${API_GATEWAY}/course-files/upload`, formData, {
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getCourseFileDownloadUrl(fileName) {
    return `${API_GATEWAY}/course-files/download/${encodeURIComponent(fileName)}`;
  },

  updateCourseFile(id, newFile, courseId, moduleId, batchId) {
    const formData = new FormData();
    if (newFile) formData.append("file", newFile);
    if (courseId !== undefined && courseId !== null)
      formData.append("courseId", courseId);
    if (moduleId !== undefined && moduleId !== null)
      formData.append("moduleId", moduleId);
    if (batchId !== undefined && batchId !== null)
      formData.append("batchId", batchId);

    return axios.put(`${API_GATEWAY}/course-files/${id}`, formData, {
      headers: authHeader(),
    });
  },

  deleteCourseFile(id) {
    return axios.delete(`${API_GATEWAY}/course-files/${id}`, {
      headers: authHeader(),
    });
  },

  // ADD to the fileService object

  // ================= ADMIN — ALL FILES =================
  getAllFilesAdmin() {
    return axios.get(`${API_GATEWAY}/file/admin/all`, {
      headers: authHeader(),
    });
  },

  // ==========================================
  // 🔥 FILE FEATURE FLAGS
  // ==========================================

  // ================= ORG-SCOPED =================
  getFileFeatureFlags(organizationId) {
    return axios.get(
      `${API_GATEWAY}/file-feature-flags/org/${organizationId}`,
      { headers: authHeader() },
    );
  },

  updateFileFeatureFlags(organizationId, dto) {
    return axios.put(
      `${API_GATEWAY}/file-feature-flags/org/${organizationId}`,
      dto,
      { headers: authHeader() },
    );
  },

  // ================= INDIVIDUAL (org-less users) =================
  getIndividualFileFeatureFlags(email) {
    return axios.get(`${API_GATEWAY}/file-feature-flags/individual`, {
      params: { email },
      headers: authHeader(),
    });
  },

  updateIndividualFileFeatureFlags(email, dto) {
    return axios.put(`${API_GATEWAY}/file-feature-flags/individual`, dto, {
      params: { email },
      headers: authHeader(),
    });
  },
};

export default fileService;
