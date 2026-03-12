

import axios from "axios";

const API_GATEWAY =   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";


const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});

const fileService = {
  // ================= TRAINER UPLOAD =================
  // uploadFile(file, batchId) {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("batchId", batchId);
  //   formData.append("title", title);
  //   formData.append("description", description);

  //   return axios.post(`${API_GATEWAY}/api/file/upload`, formData, {
  //     headers: {
  //       ...authHeader(),
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  // },
  uploadFile(file, batchId, title, description) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("batchId", batchId);
    formData.append("title", title || "");
    formData.append("description", description || "");
  
    return axios.post(`${API_GATEWAY}/file/upload`, formData, {
      headers: {
        ...authHeader(),
        // ✅ No Content-Type here — axios sets multipart/form-data + boundary automatically
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
  downloadFileBlob(name) {
    return axios.get(`${API_GATEWAY}/file/download/${name}`, {
      responseType: "blob",
      headers: authHeader(),
    });
  },

  // DOWNLOAD AS BLOB
  downloadFileBlob(fileName) {
    return axios.get(`${API_GATEWAY}/file/download/${fileName}`, {
      responseType: "blob",
      headers: authHeader(),
    });
  },

  // VIEW FILE (PREVIEW) AS BLOB
  // ================= PREVIEW FILE =================
  viewFileBlob(id) {
    return axios.get(`${API_GATEWAY}/file/view/${id}`, {
      responseType: "blob",
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

  // 1️⃣ Upload Course Module PDF
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

  // 2️⃣ Get Download URL (For Student iframe preview)
  getCourseFileDownloadUrl(fileName) {
    return `${API_GATEWAY}/course-files/download/${encodeURIComponent(fileName)}`;
  },

  // 3️⃣ Delete Course Module File
  deleteCourseFile(id) {
    return axios.delete(`${API_GATEWAY}/course-files/${id}`, {
      headers: authHeader(),
    });
  },
};

export default fileService;
