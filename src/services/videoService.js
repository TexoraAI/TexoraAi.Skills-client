
import axios from "axios";

const API_GATEWAY = "http://localhost:9000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("lms_token");
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
};

const videoService = {
  // ✅ FIXED: file + title + description
  uploadVideo(file, title, description) {
    const formData = new FormData();

    formData.append("file", file);           // MUST MATCH multer
    formData.append("title", title);         // 🔥 REQUIRED
    formData.append("description", description || "");

    return axios.post(`${API_GATEWAY}/api/video/upload`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getVideoStreamUrl(fileName) {
    return `${API_GATEWAY}/api/video/play/${fileName}`;
  },

  getVideoById(id) {
    return axios.get(`${API_GATEWAY}/api/video/${id}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
  },

  getAllVideos() {
    return axios.get(`${API_GATEWAY}/api/video`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
  },

  getVideoBlob(fileName) {
    return axios.get(`${API_GATEWAY}/api/video/play/${fileName}`, {
      headers: {
        ...getAuthHeaders(),
      },
      responseType: "blob",
    });
  },

  deleteVideo(id) {
    return axios.delete(`${API_GATEWAY}/api/video/${id}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
  },
};

export default videoService;
