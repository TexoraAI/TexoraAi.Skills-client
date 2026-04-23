// import axios from "axios";

// const API_GATEWAY =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// const getAuthHeaders = () => {
//   const token = localStorage.getItem("lms_token");
//   if (!token) return {};
//   return {
//     Authorization: `Bearer ${token}`,
//   };
// };

// const videoService = {
//   // 🔥 TRAINER UPLOAD (WITH BATCH ID)
//   uploadVideo(file, title, description, batchId) {
//     const formData = new FormData();

//     formData.append("file", file);
//     formData.append("title", title);
//     formData.append("description", description || "");
//     formData.append("batchId", batchId); // ⭐ REQUIRED FOR BACKEND

//     return axios.post(`${API_GATEWAY}/video/upload`, formData, {
//       headers: {
//         ...getAuthHeaders(),
//         "Content-Type": "multipart/form-data",
//       },
//     });
//   },

//   // 🎓 STUDENT VIDEOS
//   getStudentVideos() {
//     return axios.get(`${API_GATEWAY}/video/student`, {
//       headers: {
//         ...getAuthHeaders(),
//       },
//     });
//   },

//   // Trainer/Admin list
//   getAllVideos() {
//     return axios.get(`${API_GATEWAY}/video`, {
//       headers: {
//         ...getAuthHeaders(),
//       },
//     });
//   },

//   // 🔥 GET TRAINER ASSIGNED BATCHES
//   getTrainerBatches() {
//     return axios.get(`${API_GATEWAY}/batch/trainer`, {
//       headers: {
//         ...getAuthHeaders(),
//       },
//     });
//   },
//   //only trainer uploaded videos are visible okay
//   getTrainerVideos() {
//     return axios.get(`${API_GATEWAY}/video/trainer`, {
//       headers: {
//         ...getAuthHeaders(),
//       },
//     });
//   },

//   // Play video
//   getVideoBlob(fileName) {
//     return axios.get(`${API_GATEWAY}/video/play/${fileName}`, {
//       headers: {
//         ...getAuthHeaders(),
//       },
//       responseType: "blob",
//     });
//   },

//   // Delete
//   deleteVideo(id) {
//     return axios.delete(`${API_GATEWAY}/video/${id}`, {
//       headers: {
//         ...getAuthHeaders(),
//       },
//     });
//   },

//   // ===============================
//   // 🔥 NEW COURSE MODULE VIDEOS
//   // ===============================

//   uploadCourseVideo(file, courseId, moduleId, batchId) {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("courseId", courseId);
//     formData.append("moduleId", moduleId);
//     formData.append("batchId", batchId);

//     return axios.post(`${API_GATEWAY}/course-videos/upload`, formData, {
//       headers: {
//         ...getAuthHeaders(),
//         "Content-Type": "multipart/form-data",
//       },
//     });
//   },

//   getCourseVideos(courseId) {
//     return axios.get(`${API_GATEWAY}/course-videos/course/${courseId}`, {
//       headers: getAuthHeaders(),
//     });
//   },

//   getCourseVideoStreamUrl(fileName) {
//     return `${API_GATEWAY}/course-videos/stream/${encodeURIComponent(fileName)}`;
//   },

//   // ✅ EDIT COURSE VIDEO — file is optional (pass null to keep existing)
//   // ✅ EDIT COURSE VIDEO — file is optional (pass null to keep existing)
//   // FIX: was calling authHeader() which doesn't exist → now uses getAuthHeaders()
//   updateCourseVideo(id, newFile, courseId, moduleId, batchId) {
//     const formData = new FormData();
//     if (newFile) formData.append("file", newFile);
//     if (courseId !== undefined && courseId !== null)
//       formData.append("courseId", courseId);
//     if (moduleId !== undefined && moduleId !== null)
//       formData.append("moduleId", moduleId);
//     if (batchId !== undefined && batchId !== null)
//       formData.append("batchId", batchId);

//     return axios.put(`${API_GATEWAY}/course-videos/${id}`, formData, {
//       headers: getAuthHeaders(), // ✅ FIXED: was authHeader() → ReferenceError
//     });
//   },

//   // deleteCourseVideo(id) {
//   //   return axios.delete(`${API_GATEWAY}/course-videos/${id}`, {
//   //     headers: getAuthHeaders(),
//   //   });
//   // },
//   // ✅ DELETE COURSE VIDEO
//   deleteCourseVideo(id) {
//     return axios.delete(`${API_GATEWAY}/course-videos/${id}`, {
//       headers: getAuthHeaders(),
//     });
//   },
//   // ═══════════════════════════════════════════════════════════════════
//   //  ADMIN COURSE UPLOAD
//   // ═══════════════════════════════════════════════════════════════════
//   uploadAdminCourse(formData, onProgress) {
//     return axios.post(`${API_GATEWAY}/upload-course/upload`, formData, {
//       // ✅ changed
//       headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
//       onUploadProgress: onProgress
//         ? (e) => {
//             if (e.total) onProgress(Math.round((e.loaded * 100) / e.total));
//           }
//         : undefined,
//     });
//   },

//   getAllAdminCourses() {
//     return axios.get(`${API_GATEWAY}/upload-course/all`, {
//       // ✅ changed
//       headers: getAuthHeaders(),
//     });
//   },

//   deleteAdminCourse(courseId) {
//     return axios.delete(`${API_GATEWAY}/upload-course/by-course/${courseId}`, {
//       // ✅ changed
//       headers: getAuthHeaders(),
//     });
//   },
// };

// export default videoService;
























import axios from "axios";

const API_GATEWAY =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("lms_token");
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
};

const videoService = {
  // 🔥 TRAINER UPLOAD (WITH BATCH ID)
  // uploadVideo(file, title, description, batchId) {
  //   const formData = new FormData();

  //   formData.append("file", file);
  //   formData.append("title", title);
  //   formData.append("description", description || "");
  //   formData.append("batchId", batchId); // ⭐ REQUIRED FOR BACKEND

  //   return axios.post(`${API_GATEWAY}/video/upload`, formData, {
  //     headers: {
  //       ...getAuthHeaders(),
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  // },
  uploadVideo(file, title, description, batchId, { tags = [], category = "", language = "English", visibility = "public", audience = "not-kids", ageRestrict = false, course = "" } = {}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("description", description || "");
  formData.append("batchId", batchId);
  // new fields
  formData.append("tags",        tags.join(","));
  formData.append("category",    category);
  formData.append("language",    language);
  formData.append("visibility",  visibility);
  formData.append("audience",    audience);
  formData.append("ageRestrict", ageRestrict);
  formData.append("course",      course);

  return axios.post(`${API_GATEWAY}/video/upload`, formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
},

uploadVideoUrl(videoUrl, title, description, batchId, { tags = [], category = "", language = "English", visibility = "public", audience = "not-kids", ageRestrict = false, course = "" } = {}) {
  const formData = new FormData();
  formData.append("videoUrl",    videoUrl);
  formData.append("title",       title);
  formData.append("description", description || "");
  formData.append("batchId",     batchId);
  formData.append("tags",        tags.join(","));
  formData.append("category",    category);
  formData.append("language",    language);
  formData.append("visibility",  visibility);
  formData.append("audience",    audience);
  formData.append("ageRestrict", ageRestrict);
  formData.append("course",      course);

  return axios.post(`${API_GATEWAY}/video/upload-url`, formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
},

  // 🎓 STUDENT VIDEOS
  getStudentVideos() {
    return axios.get(`${API_GATEWAY}/video/student`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
  },

  // Trainer/Admin list
  getAllVideos() {
    return axios.get(`${API_GATEWAY}/video`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
  },

  // 🔥 GET TRAINER ASSIGNED BATCHES
  getTrainerBatches() {
    return axios.get(`${API_GATEWAY}/batch/trainer`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
  },
  //only trainer uploaded videos are visible okay
  getTrainerVideos() {
    return axios.get(`${API_GATEWAY}/video/trainer`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
  },

  // Play video
  getVideoBlob(fileName) {
    return axios.get(`${API_GATEWAY}/video/play/${fileName}`, {
      headers: {
        ...getAuthHeaders(),
      },
      responseType: "blob",
    });
  },

  // Delete
  deleteVideo(id) {
    return axios.delete(`${API_GATEWAY}/video/${id}`, {
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

    return axios.post(`${API_GATEWAY}/course-videos/upload`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getCourseVideos(courseId) {
    return axios.get(`${API_GATEWAY}/course-videos/course/${courseId}`, {
      headers: getAuthHeaders(),
    });
  },

  getCourseVideoStreamUrl(fileName) {
    return `${API_GATEWAY}/course-videos/stream/${encodeURIComponent(fileName)}`;
  },

  // ✅ EDIT COURSE VIDEO — file is optional (pass null to keep existing)
  // ✅ EDIT COURSE VIDEO — file is optional (pass null to keep existing)
  // FIX: was calling authHeader() which doesn't exist → now uses getAuthHeaders()
  updateCourseVideo(id, newFile, courseId, moduleId, batchId) {
    const formData = new FormData();
    if (newFile) formData.append("file", newFile);
    if (courseId !== undefined && courseId !== null)
      formData.append("courseId", courseId);
    if (moduleId !== undefined && moduleId !== null)
      formData.append("moduleId", moduleId);
    if (batchId !== undefined && batchId !== null)
      formData.append("batchId", batchId);

    return axios.put(`${API_GATEWAY}/course-videos/${id}`, formData, {
      headers: getAuthHeaders(), // ✅ FIXED: was authHeader() → ReferenceError
    });
  },

  // deleteCourseVideo(id) {
  //   return axios.delete(`${API_GATEWAY}/course-videos/${id}`, {
  //     headers: getAuthHeaders(),
  //   });
  // },
  // ✅ DELETE COURSE VIDEO
  deleteCourseVideo(id) {
    return axios.delete(`${API_GATEWAY}/course-videos/${id}`, {
      headers: getAuthHeaders(),
    });
  },
  // ═══════════════════════════════════════════════════════════════════
  //  ADMIN COURSE UPLOAD
  // ═══════════════════════════════════════════════════════════════════
  uploadAdminCourse(formData, onProgress) {
    return axios.post(`${API_GATEWAY}/upload-course/upload`, formData, {
      // ✅ changed
      headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
      onUploadProgress: onProgress
        ? (e) => {
            if (e.total) onProgress(Math.round((e.loaded * 100) / e.total));
          }
        : undefined,
    });
  },

  getAllAdminCourses() {
    return axios.get(`${API_GATEWAY}/upload-course/all`, {
      // ✅ changed
      headers: getAuthHeaders(),
    });
  },

  deleteAdminCourse(courseId) {
    return axios.delete(`${API_GATEWAY}/upload-course/by-course/${courseId}`, {
      // ✅ changed
      headers: getAuthHeaders(),
    });
  },
};

export default videoService;


