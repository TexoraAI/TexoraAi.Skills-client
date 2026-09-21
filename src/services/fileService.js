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

  // ✅ NEW — true total vs visible count, so the UI can show a locked tile
  getStudentFileCount() {
    return axios.get(`${API_GATEWAY}/file/student/count`, {
      headers: authHeader(),
    });
  },

  // ✅ NEW — GET /api/file/upload-quota, used by UsageBadge + pre-upload checks
  getUploadQuota() {
    return axios.get(`${API_GATEWAY}/file/upload-quota`, {
      headers: authHeader(),
    });
  },

  // // ================= DOWNLOAD =================
  // downloadFileBlob(fileName) {
  //   return axios.get(`${API_GATEWAY}/file/download/${fileName}`, {
  //     responseType: "blob",
  //     headers: authHeader(),
  //   });
  // },

  // // ================= PREVIEW / VIEW =================
  // // ✅ FIX: use arraybuffer so Blob constructor gets correct binary data
  // // Backend returns "inline" for PDF/images → browser opens them
  // // Backend returns "attachment" for DOCX/ZIP/PPT → browser downloads them
  // viewFileBlob(id) {
  //   return axios.get(`${API_GATEWAY}/file/view/${id}`, {
  //     responseType: "arraybuffer", // ✅ was "blob" — this was the bug
  //     headers: authHeader(),
  //   });
  // },
  // ================= DOWNLOAD =================
  // Two-step: (1) authed call to our backend for a fresh presigned URL,
  // (2) unauthed call straight to S3 for the bytes. Don't send the
  // Authorization header on step 2 — S3 will reject it.
  async downloadFileBlob(id) {
    const meta = await axios.get(`${API_GATEWAY}/file/download/${id}`, {
      headers: authHeader(),
    });
    const fileRes = await axios.get(meta.data.url, {
      responseType: "blob",
    });
    return {
      data: fileRes.data,
      headers: { "content-type": meta.data.contentType },
      originalName: meta.data.originalName,
    };
  },

  // ================= PREVIEW / VIEW =================
  // Same two-step pattern. Kept the arraybuffer responseType from the
  // original fix (Blob constructor needs binary data, not text).
  // async viewFileBlob(id) {
  //   const meta = await axios.get(`${API_GATEWAY}/file/view/${id}`, {
  //     headers: authHeader(),
  //   });
  //   const fileRes = await axios.get(meta.data.url, {
  //     responseType: "arraybuffer",
  //   });
  //   return {
  //     data: fileRes.data,
  //     headers: { "content-type": meta.data.contentType },
  //     originalName: meta.data.originalName,
  //   };
  // },
  // ================= PREVIEW / VIEW =================
  // Step 1 only — returns the presigned S3 URL + metadata, no bytes.
  // Used directly by <iframe>/<img> for pdf/image/text (no CORS needed,
  // since element `src` loads aren't subject to CORS the way axios.get
  // to S3 is).
  async getViewMeta(id) {
    const meta = await axios.get(`${API_GATEWAY}/file/view/${id}`, {
      headers: authHeader(),
    });
    return meta.data; // { url, contentType, originalName }
  },
  // Same shape as getViewMeta but hits the download endpoint. Used when
  // you want the browser to actually save the file, not just render it.
  async getDownloadMeta(id) {
    const meta = await axios.get(`${API_GATEWAY}/file/download/${id}`, {
      headers: authHeader(),
    });
    return meta.data; // { url, contentType, originalName }
  },
  // For docx/xlsx/pptx, which need raw bytes for mammoth/XLSX.js/JSZip
  // to parse. Requires the S3 bucket's CORS policy to allow this origin
  // for GET — see notes. Kept separate from getViewMeta so pdf/image/text
  // never has to pay the CORS cost at all.
  async fetchViewBytes(url) {
    const fileRes = await axios.get(url, { responseType: "arraybuffer" });
    return fileRes.data;
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

  // Returns a Promise resolving to the presigned S3 URL (was previously a
  // plain synchronous URL builder — now async because the backend has to
  // mint a fresh presigned URL, and the caller must NOT attach an auth
  // header when it later fetches this URL directly).
  async getCourseFileDownloadUrl(id) {
    const res = await axios.get(`${API_GATEWAY}/course-files/download/${id}`, {
      headers: authHeader(),
    });
    return res.data.url;
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

  // 🔥 FEATURED COURSE SESSION FILES (direct-to-file-service, mirrors
  // videoService.js's "FEATURED COURSE SESSION VIDEOS" section)
  // ==========================================

  /**
   * @param {number|string} sessionId
   * @param {File} file
   * @param {Function} onProgress optional (0-100)
   */
  uploadFeaturedSessionFile(sessionId, file, onProgress) {
    const formData = new FormData();
    formData.append("sessionId", sessionId);
    formData.append("file", file);
    return axios.post(`${API_GATEWAY}/featured-files/upload`, formData, {
      headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
      onUploadProgress: onProgress
        ? (e) => {
            if (e.total) onProgress(Math.round((e.loaded * 100) / e.total));
          }
        : undefined,
    });
  },

  /**
   * Build the download URL for a featured session file. Requires auth per
   * FeaturedSessionFileController — verify header/cookie handling before
   * using this raw in an <a href> or <iframe src> in ProgramPlayer.jsx.
   */
  getFeaturedSessionFileDownloadUrl(fileName) {
    return `${API_GATEWAY}/featured-files/download/${encodeURIComponent(fileName)}`;
  },

  // ================= ADMIN — PER-USER-IN-ORG (org admin only) =================
  // organizationId is NOT sent from the client — the backend derives it from
  // the caller's own JWT (SecurityUtils.getCurrentOrganizationId()), so an
  // admin can only ever read/write flags for users in their own org.
  getAdminUserFileFeatureFlags(email) {
    return axios.get(
      `${API_GATEWAY}/file-feature-flags/admin/user/${encodeURIComponent(email)}`,
      { headers: authHeader() },
    );
  },

  updateAdminUserFileFeatureFlags(email, dto) {
    return axios.put(
      `${API_GATEWAY}/file-feature-flags/admin/user/${encodeURIComponent(email)}`,
      dto,
      { headers: authHeader() },
    );
  },

  // ✅ NEW — GET /api/course-files/upload-quota, storage quota for course-module files
  getCourseFileUploadQuota() {
    return axios.get(`${API_GATEWAY}/course-files/upload-quota`, {
      headers: authHeader(),
    });
  },
};
export default fileService;
