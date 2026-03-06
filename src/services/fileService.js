// import axios from "axios";

// const API_GATEWAY = "http://localhost:9000";

// const fileService = {
//   // ================= UPLOAD (Admin / Trainer) =================
//   uploadFile(file, role) {
//     const formData = new FormData();
//     formData.append("file", file);

//     return axios.post(`${API_GATEWAY}/api/files/upload`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         "X-ROLE": role, // ADMIN or TRAINER
//         Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
//       },
//     });
//   },

//   // ================= LIST FILES =================
//   getFiles(page = 0, size = 10) {
//     return axios.get(`${API_GATEWAY}/api/files`, {
//       params: { page, size },
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
//       },
//     });
//   },

//   // ================= DOWNLOAD =================
//   downloadFile(name) {
//     return `${API_GATEWAY}/api/files/download/${name}`;
//   },

//   // ================= DELETE (Admin / Trainer) =================
//   deleteFile(id, role) {
//     return axios.delete(`${API_GATEWAY}/api/files/${id}`, {
//       headers: {
//         "X-ROLE": role,
//         Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
//       },
//     });
//   },

//   // ✅ SECURE DOWNLOAD (JWT + Blob)
//   downloadFileBlob(storedName) {
//     return axios.get(`${API_GATEWAY}/api/files/download/${storedName}`, {
//       responseType: "blob",
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
//       },
//     });
//   },
// };

// export default fileService;

import axios from "axios";

const API_GATEWAY =   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";


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

    return axios.post(`${API_GATEWAY}/api/file/upload`, formData, {
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // ================= TRAINER FILES =================
  getTrainerFiles() {
    return axios.get(`${API_GATEWAY}/api/file/trainer`, {
      headers: authHeader(),
    });
  },

  // ================= STUDENT FILES =================
  getStudentFiles() {
    return axios.get(`${API_GATEWAY}/api/file/student`, {
      headers: authHeader(),
    });
  },

  // ================= DOWNLOAD =================
  downloadFileBlob(name) {
    return axios.get(`${API_GATEWAY}/api/file/download/${name}`, {
      responseType: "blob",
      headers: authHeader(),
    });
  },

  // DOWNLOAD AS BLOB
  downloadFileBlob(fileName) {
    return axios.get(`${API_GATEWAY}/api/file/download/${fileName}`, {
      responseType: "blob",
      headers: authHeader(),
    });
  },

  // VIEW FILE (PREVIEW) AS BLOB
  // ================= PREVIEW FILE =================
  viewFileBlob(id) {
    return axios.get(`${API_GATEWAY}/api/file/view/${id}`, {
      responseType: "blob",
      headers: authHeader(),
    });
  },

  // ================= DELETE =================
  deleteFile(id) {
    return axios.delete(`${API_GATEWAY}/api/file/${id}`, {
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

    return axios.post(`${API_GATEWAY}/api/course-files/upload`, formData, {
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 2️⃣ Get Download URL (For Student iframe preview)
  getCourseFileDownloadUrl(fileName) {
    return `${API_GATEWAY}/api/course-files/download/${encodeURIComponent(fileName)}`;
  },

  // 3️⃣ Delete Course Module File
  deleteCourseFile(id) {
    return axios.delete(`${API_GATEWAY}/api/course-files/${id}`, {
      headers: authHeader(),
    });
  },
};

export default fileService;
