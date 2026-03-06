

import axios from "axios";

const API_GATEWAY =   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("lms_token");
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
};

const videoService = {
  // 🔥 TRAINER UPLOAD (WITH BATCH ID)
  uploadVideo(file, title, description, batchId) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description || "");
    formData.append("batchId", batchId); // ⭐ REQUIRED FOR BACKEND

    return axios.post(`${API_GATEWAY}/api/video/upload`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 🎓 STUDENT VIDEOS
  getStudentVideos() {
    return axios.get(`${API_GATEWAY}/api/video/student`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
  },

  // Trainer/Admin list
  getAllVideos() {
    return axios.get(`${API_GATEWAY}/api/video`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
  },

  // 🔥 GET TRAINER ASSIGNED BATCHES
  getTrainerBatches() {
    return axios.get(`${API_GATEWAY}/api/batch/trainer`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
  },
  //only trainer uploaded videos are visible okay
  getTrainerVideos() {
    return axios.get(`${API_GATEWAY}/api/video/trainer`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
  },

  // Play video
  getVideoBlob(fileName) {
    return axios.get(`${API_GATEWAY}/api/video/play/${fileName}`, {
      headers: {
        ...getAuthHeaders(),
      },
      responseType: "blob",
    });
  },

  // Delete
  deleteVideo(id) {
    return axios.delete(`${API_GATEWAY}/api/video/${id}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
  },

  // ===============================
  // 🔥 NEW COURSE MODULE VIDEOS
  // ===============================

  uploadCourseVideo(file, courseId, moduleId, batchId) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", courseId);
    formData.append("moduleId", moduleId);
    formData.append("batchId", batchId);

    return axios.post(`${API_GATEWAY}/api/course-videos/upload`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getCourseVideos(courseId) {
    return axios.get(`${API_GATEWAY}/api/course-videos/course/${courseId}`, {
      headers: getAuthHeaders(),
    });
  },

  getCourseVideoStreamUrl(fileName) {
    return `${API_GATEWAY}/api/course-videos/stream/${encodeURIComponent(fileName)}`;
  },

  deleteCourseVideo(id) {
    return axios.delete(`${API_GATEWAY}/api/course-videos/${id}`, {
      headers: getAuthHeaders(),
    });
  },
};

export default videoService;
