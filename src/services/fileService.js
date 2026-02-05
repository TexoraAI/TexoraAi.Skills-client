import axios from "axios";

const API_GATEWAY = "http://localhost:9000";

const fileService = {
  // ================= UPLOAD (Admin / Trainer) =================
  uploadFile(file, role) {
    const formData = new FormData();
    formData.append("file", file);

    return axios.post(`${API_GATEWAY}/api/files/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-ROLE": role, // ADMIN or TRAINER
        Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
      },
    });
  },

  // ================= LIST FILES =================
  getFiles(page = 0, size = 10) {
    return axios.get(`${API_GATEWAY}/api/files`, {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
      },
    });
  },

  // ================= DOWNLOAD =================
  downloadFile(name) {
    return `${API_GATEWAY}/api/files/download/${name}`;
  },

  // ================= DELETE (Admin / Trainer) =================
  deleteFile(id, role) {
    return axios.delete(`${API_GATEWAY}/api/files/${id}`, {
      headers: {
        "X-ROLE": role,
        Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
      },
    });
  },

  // ✅ SECURE DOWNLOAD (JWT + Blob)
  downloadFileBlob(storedName) {
    return axios.get(`${API_GATEWAY}/api/files/download/${storedName}`, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
      },
    });
  },
};

export default fileService;