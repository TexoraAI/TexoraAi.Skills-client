// videoService.js
import axios from "axios";

const API_GATEWAY =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("lms_token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

const videoService = {
  // ─────────────────────────────────────────────────────────────────
  //  EXISTING VIDEO LIBRARY (unchanged)
  // ─────────────────────────────────────────────────────────────────

  uploadVideo(
    file,
    title,
    description,
    batchId,
    {
      tags = [],
      category = "",
      language = "English",
      visibility = "public",
      audience = "not-kids",
      ageRestrict = false,
      course = "",
      status = "published",
    } = {},
  ) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description || "");
    if (batchId !== null && batchId !== undefined)
      formData.append("batchId", batchId);
    formData.append("tags", tags.join(","));
    formData.append("category", category);
    formData.append("language", language);
    formData.append("visibility", visibility);
    formData.append("audience", audience);
    formData.append("ageRestrict", ageRestrict);
    formData.append("course", course);
    formData.append("status", status);
    return axios.post(`${API_GATEWAY}/video/upload`, formData, {
      headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
    });
  },

  uploadVideoUrl(
    videoUrl,
    title,
    description,
    batchId,
    {
      tags = [],
      category = "",
      language = "English",
      visibility = "public",
      audience = "not-kids",
      ageRestrict = false,
      course = "",
      status = "published",
    } = {},
  ) {
    const formData = new FormData();
    formData.append("videoUrl", videoUrl);
    formData.append("title", title);
    formData.append("description", description || "");
    if (batchId !== null && batchId !== undefined)
      formData.append("batchId", batchId);
    formData.append("tags", tags.join(","));
    formData.append("category", category);
    formData.append("language", language);
    formData.append("visibility", visibility);
    formData.append("audience", audience);
    formData.append("ageRestrict", ageRestrict);
    formData.append("course", course);
    formData.append("status", status);
    return axios.post(`${API_GATEWAY}/video/upload-url`, formData, {
      headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
    });
  },

  editVideo(
    videoId,
    newFile,
    title,
    description,
    batchId,
    {
      tags = [],
      category = "",
      language = "English",
      visibility = "public",
      audience = "not-kids",
      ageRestrict = false,
      course = "",
      status = "draft",
    } = {},
  ) {
    const formData = new FormData();
    if (newFile) formData.append("file", newFile);
    formData.append("title", title);
    formData.append("description", description || "");
    if (batchId !== null && batchId !== undefined)
      formData.append("batchId", batchId);
    formData.append("tags", Array.isArray(tags) ? tags.join(",") : tags);
    formData.append("category", category);
    formData.append("language", language);
    formData.append("visibility", visibility);
    formData.append("audience", audience);
    formData.append("ageRestrict", ageRestrict);
    formData.append("course", course);
    formData.append("status", status);
    return axios.put(`${API_GATEWAY}/video/${videoId}/edit`, formData, {
      headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
    });
  },

  editVideoUrl(
    videoId,
    newVideoUrl,
    title,
    description,
    batchId,
    {
      tags = [],
      category = "",
      language = "English",
      visibility = "public",
      audience = "not-kids",
      ageRestrict = false,
      course = "",
      status = "draft",
    } = {},
  ) {
    const formData = new FormData();
    if (newVideoUrl && newVideoUrl.trim())
      formData.append("videoUrl", newVideoUrl.trim());
    formData.append("title", title);
    formData.append("description", description || "");
    if (batchId !== null && batchId !== undefined)
      formData.append("batchId", batchId);
    formData.append("tags", Array.isArray(tags) ? tags.join(",") : tags);
    formData.append("category", category);
    formData.append("language", language);
    formData.append("visibility", visibility);
    formData.append("audience", audience);
    formData.append("ageRestrict", ageRestrict);
    formData.append("course", course);
    formData.append("status", status);
    return axios.put(`${API_GATEWAY}/video/${videoId}/edit-url`, formData, {
      headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
    });
  },

  assignBatch(videoId, batchId) {
    const params = new URLSearchParams();
    params.append("batchId", batchId);
    return axios.patch(
      `${API_GATEWAY}/video/${videoId}/assign-batch?${params.toString()}`,
      null,
      { headers: getAuthHeaders() },
    );
  },

  publishVideo(videoId) {
    return axios.patch(`${API_GATEWAY}/video/${videoId}/publish`, null, {
      headers: getAuthHeaders(),
    });
  },

  getStudentVideos() {
    return axios.get(`${API_GATEWAY}/video/student`, {
      headers: getAuthHeaders(),
    });
  },

  getAllVideos(type) {
    const params = type && type !== "ALL" ? { type } : {};
    return axios.get(`${API_GATEWAY}/video`, {
      headers: getAuthHeaders(),
      params,
    });
  },

  getTrainerBatches() {
    return axios.get(`${API_GATEWAY}/batch/trainer`, {
      headers: getAuthHeaders(),
    });
  },

  getTrainerVideos() {
    return axios.get(`${API_GATEWAY}/video/trainer`, {
      headers: getAuthHeaders(),
    });
  },

  getVideoBlob(fileName) {
    return axios.get(`${API_GATEWAY}/video/play/${fileName}`, {
      headers: getAuthHeaders(),
      responseType: "blob",
    });
  },

  deleteVideo(id) {
    return axios.delete(`${API_GATEWAY}/video/${id}`, {
      headers: getAuthHeaders(),
    });
  },

  // ─────────────────────────────────────────────────────────────────
  //  COURSE MODULE VIDEOS (unchanged)
  // ─────────────────────────────────────────────────────────────────

  uploadCourseVideo(file, courseId, moduleId, batchId) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", courseId);
    formData.append("moduleId", moduleId);
    formData.append("batchId", batchId);
    return axios.post(`${API_GATEWAY}/course-videos/upload`, formData, {
      headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
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
      headers: getAuthHeaders(),
    });
  },

  deleteCourseVideo(id) {
    return axios.delete(`${API_GATEWAY}/course-videos/${id}`, {
      headers: getAuthHeaders(),
    });
  },

  // ─────────────────────────────────────────────────────────────────
  //  VIDEO FEATURE FLAGS (unchanged)
  // ─────────────────────────────────────────────────────────────────

  getOrgVideoFeatureFlags(organizationId) {
    return axios.get(
      `${API_GATEWAY}/video-feature-flags/org/${organizationId}`,
      {
        headers: getAuthHeaders(),
      },
    );
  },

  updateOrgVideoFeatureFlags(organizationId, dto) {
    return axios.put(
      `${API_GATEWAY}/video-feature-flags/org/${organizationId}`,
      dto,
      {
        headers: getAuthHeaders(),
      },
    );
  },

  getIndividualVideoFeatureFlags(email) {
    return axios.get(`${API_GATEWAY}/video-feature-flags/individual`, {
      headers: getAuthHeaders(),
      params: { email },
    });
  },

  updateIndividualVideoFeatureFlags(email, dto) {
    return axios.put(`${API_GATEWAY}/video-feature-flags/individual`, dto, {
      headers: getAuthHeaders(),
      params: { email },
    });
  },

  // ═════════════════════════════════════════════════════════════════
  //  WATCH NOW  (replaces uploadAdminCourse / getAllAdminCourses /
  //              deleteAdminCourse)
  //
  //  Base URL: /api/v1/watch-now
  //  Auth:     SUPER_ADMIN only (writes); public (reads)
  // ═════════════════════════════════════════════════════════════════

  /**
   * Create a new WatchNow entry (SUPER_ADMIN only).
   * @param {FormData} formData  – must include "video" file + DTO fields
   * @param {Function} onProgress – optional upload progress callback (0–100)
   */
  uploadWatchNow(formData, onProgress) {
    return axios.post(`${API_GATEWAY}/v1/watch-now/upload`, formData, {
      headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
      onUploadProgress: onProgress
        ? (e) => {
            if (e.total) onProgress(Math.round((e.loaded * 100) / e.total));
          }
        : undefined,
    });
  },

  /**
   * Update an existing WatchNow entry (SUPER_ADMIN only).
   * @param {number|string} id
   * @param {FormData} formData  – "video" and "thumbnail" are optional
   * @param {Function} onProgress
   */
  updateWatchNow(id, formData, onProgress) {
    return axios.put(`${API_GATEWAY}/v1/watch-now/${id}`, formData, {
      headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
      onUploadProgress: onProgress
        ? (e) => {
            if (e.total) onProgress(Math.round((e.loaded * 100) / e.total));
          }
        : undefined,
    });
  },

  /**
   * Get all WatchNow entries (public – no auth required).
   */
  getAllWatchNow() {
    return axios.get(`${API_GATEWAY}/v1/watch-now/all`);
  },

  /**
   * Get a single WatchNow entry by id (public – no auth required).
   */
  getWatchNowById(id) {
    return axios.get(`${API_GATEWAY}/v1/watch-now/${id}`);
  },

  /**
   * Build the stream URL for a WatchNow video or thumbnail filename.
   * Used directly in <video src={...}> or <img src={...}>.
   */
  getWatchNowStreamUrl(fileName) {
    return `${API_GATEWAY}/v1/watch-now/stream/${encodeURIComponent(fileName)}`;
  },

  /**
   * Delete a WatchNow entry by primary key (SUPER_ADMIN only).
   */
  deleteWatchNow(id) {
    return axios.delete(`${API_GATEWAY}/v1/watch-now/${id}`, {
      headers: getAuthHeaders(),
    });
  },

  /**
   * Delete all WatchNow entries for a courseId (SUPER_ADMIN only).
   */
  deleteWatchNowByCourse(courseId) {
    return axios.delete(`${API_GATEWAY}/v1/watch-now/by-course/${courseId}`, {
      headers: getAuthHeaders(),
    });
  },
  getWatchNowStats() {
    return axios.get(`${API_GATEWAY}/v1/watch-now/stats`);
  },
};

export default videoService;
