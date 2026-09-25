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

  // ✅ NEW — true total vs visible count, so the UI can show a locked tile
  getStudentVideoCount() {
    return axios.get(`${API_GATEWAY}/video/student/count`, {
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

  // ✅ NEW — GET /api/video/upload-quota, used by UsageBadge + pre-upload checks
  getUploadQuota() {
    return axios.get(`${API_GATEWAY}/video/upload-quota`, {
      headers: getAuthHeaders(),
    });
  },

  // getVideoBlob(fileName) {
  //   return axios.get(`${API_GATEWAY}/video/play/${fileName}`, {
  //     headers: getAuthHeaders(),
  //     responseType: "blob",
  //   });
  // },
  // Two-step: authed call for the presigned URL, then plain GET to S3.
  // S3 natively supports range requests, so video seeking works correctly —
  // unlike the old byte[] endpoint.
  async getVideoBlob(videoId) {
    const meta = await axios.get(`${API_GATEWAY}/video/play/${videoId}`, {
      headers: getAuthHeaders(),
    });
    return { url: meta.data.url }; // no blob fetch needed — <video src> can hit S3 directly
  },

  deleteVideo(id) {
    return axios.delete(`${API_GATEWAY}/video/${id}`, {
      headers: getAuthHeaders(),
    });
  },

  getVideoTranscript(videoId) {
    return axios.get(`${API_GATEWAY}/video/${videoId}/transcript`, {
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

  // getCourseVideoStreamUrl(fileName) {
  //   return `${API_GATEWAY}/course-videos/stream/${encodeURIComponent(fileName)}`;
  // },
  async getCourseVideoPlaybackUrl(fileName) {
    const res = await axios.get(
      `${API_GATEWAY}/course-videos/play/${encodeURIComponent(fileName)}`,
      { headers: getAuthHeaders() },
    );
    return res.data.url; // real S3 presigned URL
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
  getCourseVideoTranscript(id) {
    return axios.get(`${API_GATEWAY}/course-videos/${id}/transcript`, {
      headers: getAuthHeaders(),
    });
  },

  getCourseVideoTranscriptByUrl(url) {
    return axios.get(`${API_GATEWAY}/course-videos/transcript-by-url`, {
      headers: getAuthHeaders(),
      params: { url },
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

  /**
   * Get all WatchNow entries, any status (SUPER_ADMIN – admin list view).
   */
  getWatchNowAll() {
    return axios.get(`${API_GATEWAY}/v1/watch-now/all`, {
      headers: getAuthHeaders(),
    });
  },
  /**
   * Get story counts for the admin stats bar (SUPER_ADMIN).
   */
  getWatchNowStats() {
    return axios.get(`${API_GATEWAY}/v1/watch-now/stats`, {
      headers: getAuthHeaders(),
    });
  },
  /**
   * Get published WatchNow entries only, ordered by sortOrder (public).
   */
  getWatchNowPublished() {
    return axios.get(`${API_GATEWAY}/v1/watch-now/published`);
  },

  /**
   * Create a new WatchNow entry (SUPER_ADMIN only).
   * @param {FormData} formData – "video" optional, "thumbnail" required, + DTO fields
   * @param {Function} onProgress
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
   * @param {FormData} formData – "video" and "thumbnail" are optional
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
   * Delete a WatchNow entry (SUPER_ADMIN only).
   */
  deleteWatchNow(id) {
    return axios.delete(`${API_GATEWAY}/v1/watch-now/${id}`, {
      headers: getAuthHeaders(),
    });
  },

  /**
   * Bulk-update sortOrder to match array position (SUPER_ADMIN only).
   * @param {Array<number|string>} orderedIds
   */
  reorderWatchNow(orderedIds) {
    return axios.put(`${API_GATEWAY}/v1/watch-now/reorder`, orderedIds, {
      headers: getAuthHeaders(),
    });
  },

  /**
   * Transition an entry to "published" (SUPER_ADMIN only).
   */
  publishWatchNow(id) {
    return axios.patch(`${API_GATEWAY}/v1/watch-now/${id}/publish`, null, {
      headers: getAuthHeaders(),
    });
  },

  /**
   * Transition an entry to "draft" (SUPER_ADMIN only).
   */
  saveWatchNowDraft(id) {
    return axios.patch(`${API_GATEWAY}/v1/watch-now/${id}/draft`, null, {
      headers: getAuthHeaders(),
    });
  },

  /**
   * Build the stream URL for a WatchNow video or thumbnail filename.
   * Used directly in <video src={...}> or <img src={...}>.
   */
  // getWatchNowStreamUrl(fileName) {
  //   return `${API_GATEWAY}/v1/watch-now/stream/${encodeURIComponent(fileName)}`;
  // },

  // getWatchNowStreamUrl(fileNameOrUrl) {
  //   if (!fileNameOrUrl) return "";
  //   // Already an absolute URL (YouTube thumbnail, or any external link) — use as-is.
  //   if (/^https?:\/\//i.test(fileNameOrUrl)) return fileNameOrUrl;
  //   return `${API_GATEWAY}/v1/watch-now/stream/${encodeURIComponent(fileNameOrUrl)}`;
  // },
  async getWatchNowStreamUrl(fileNameOrUrl) {
    if (!fileNameOrUrl) return "";
    if (/^https?:\/\//i.test(fileNameOrUrl)) return fileNameOrUrl; // YouTube etc — pass through
    const res = await axios.get(
      `${API_GATEWAY}/v1/watch-now/stream/${encodeURIComponent(fileNameOrUrl)}`,
    );
    return res.data.url; // real S3 presigned URL — no redirect involved
  },

  // ─────────────────────────────────────────────────────────────────
  //  FEATURED COURSE SESSION VIDEOS (direct-to-video-service, not proxied)
  // ─────────────────────────────────────────────────────────────────

  /**
   * @param {number|string} sessionId
   * @param {File} file
   * @param {{title?: string, description?: string, thumbnail?: File}} meta
   * @param {Function} onProgress optional (0-100)
   */
  // ✅ CHANGED — meta now also accepts courseSlug, sent as a form field so
  // the video (and its thumbnail) land in featured-courses/{slug}/videos/
  // and /thumbnails/ on S3 instead of a flat folder.
  uploadFeaturedSessionVideo(sessionId, file, meta = {}, onProgress) {
    const formData = new FormData();
    formData.append("sessionId", sessionId);
    formData.append("file", file);
    if (meta.title) formData.append("title", meta.title);
    if (meta.description) formData.append("description", meta.description);
    if (meta.thumbnail) formData.append("thumbnail", meta.thumbnail);
    if (meta.courseSlug) formData.append("courseSlug", meta.courseSlug);
    return axios.post(`${API_GATEWAY}/video/v1/featured/session`, formData, {
      headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
      onUploadProgress: onProgress
        ? (e) => {
            if (e.total) onProgress(Math.round((e.loaded * 100) / e.total));
          }
        : undefined,
    });
  },

  /**
   * Fetch the featured video record for a session (title, description,
   * thumbnail, duration, status).
   */
  getFeaturedSessionVideoBySession(sessionId) {
    return axios.get(
      `${API_GATEWAY}/video/v1/featured/session/session/${sessionId}`,
      { headers: getAuthHeaders() },
    );
  },

  /**
   * Edit metadata and/or replace the video file / thumbnail for an
   * existing featured session video. `updates` fields are all optional —
   * only send what changed.
   * @param {number|string} videoRecordId - the FeaturedSessionVideo.id (NOT sessionId)
   * @param {{title?: string, description?: string, thumbnail?: File, newVideo?: File}} updates
   * @param {Function} onProgress optional (0-100)
   */
  // ✅ CHANGED — updates now also accepts courseSlug, needed when
  // replacing the video/thumbnail so the new file still lands in the
  // correct per-course S3 folder.
  updateFeaturedSessionVideo(videoRecordId, updates = {}, onProgress) {
    const formData = new FormData();
    if (updates.title !== undefined) formData.append("title", updates.title);
    if (updates.description !== undefined)
      formData.append("description", updates.description);
    if (updates.thumbnail) formData.append("thumbnail", updates.thumbnail);
    if (updates.newVideo) formData.append("newVideo", updates.newVideo);
    if (updates.courseSlug) formData.append("courseSlug", updates.courseSlug);
    return axios.patch(
      `${API_GATEWAY}/video/v1/featured/session/${videoRecordId}`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: onProgress
          ? (e) => {
              if (e.total) onProgress(Math.round((e.loaded * 100) / e.total));
            }
          : undefined,
      },
    );
  },

  /**
   * Delete a featured session video (removes DB record + file on disk).
   * @param {number|string} videoRecordId - the FeaturedSessionVideo.id
   */
  deleteFeaturedSessionVideo(videoRecordId) {
    return axios.delete(
      `${API_GATEWAY}/video/v1/featured/session/${videoRecordId}`,
      { headers: getAuthHeaders() },
    );
  },

  /**
   * Fetch the transcript for a Featured Session video (auto-generated by
   * video-service via FFmpeg + Whisper, fully decoupled from upload).
   * Returns { status, language, segments: [{startSeconds, endSeconds, text}] }
   * or { status: "FAILED", errorMessage } / { status: "NONE" | "PROCESSING" }.
   */
  getFeaturedSessionVideoTranscript(sessionId) {
    return axios.get(
      `${API_GATEWAY}/video/v1/featured/session/${sessionId}/transcript`,
      { headers: getAuthHeaders() },
    );
  },

  // ================= ADMIN — PER-USER-IN-ORG (org admin only) =================
  getAdminUserVideoFeatureFlags(email) {
    return axios.get(
      `${API_GATEWAY}/video-feature-flags/admin/user/${encodeURIComponent(email)}`,
      { headers: getAuthHeaders() },
    );
  },

  updateAdminUserVideoFeatureFlags(email, dto) {
    return axios.put(
      `${API_GATEWAY}/video-feature-flags/admin/user/${encodeURIComponent(email)}`,
      dto,
      { headers: getAuthHeaders() },
    );
  },

  // ✅ NEW — GET /api/course-videos/upload-quota, storage quota for course-module videos
  getCourseVideoUploadQuota() {
    return axios.get(`${API_GATEWAY}/course-videos/upload-quota`, {
      headers: getAuthHeaders(),
    });
  },
};

export default videoService;
