
import axios from "axios";

const API_GATEWAY =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});

const fileService = {
  // ================= TRAINER UPLOAD =================
  uploadFile(file, batchId, title, description, courseId, category) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("batchId", batchId);
    formData.append("title", title || "");
    formData.append("description", description || "");
    if (courseId) formData.append("courseId", courseId);
    if (category) formData.append("category", category);

    return axios.post(`${API_GATEWAY}/file/upload`, formData, {
      headers: {
        ...authHeader(),
        // ✅ No Content-Type — axios sets multipart/form-data + boundary automatically
      },
    });
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
      responseType: "arraybuffer",   // ✅ was "blob" — this was the bug
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
};

export default fileService;