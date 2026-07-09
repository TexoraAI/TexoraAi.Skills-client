import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});

export const courseService = {
  getMyCourses() {
    return axios.get(`${API}/courses/my`, {
      headers: authHeader(),
    });
  },

  getById(id) {
    return axios.get(`${API}/courses/${id}`);
  },

  createCourse(data) {
    return axios.post(`${API}/courses`, data, {
      headers: authHeader(),
    });
  },

  updateCourse(id, data) {
    return axios.put(`${API}/courses/${id}`, data, {
      headers: authHeader(),
    });
  },

  getStudentCourses() {
    return axios.get(`${API}/courses/student`, {
      headers: authHeader(),
    });
  },

  deleteCourse(id) {
    return axios.delete(`${API}/courses/${id}`, {
      headers: authHeader(),
    });
  },

  // Org Admin — sees only their org's courses
  getOrgAdminCourses() {
    return axios.get(`${API}/courses/org-admin`, {
      headers: authHeader(),
    });
  },
  // Categories for super admin
  getAllCategories() {
    return axios.get(`${API}/courses/categories`, {
      headers: authHeader(),
    });
  },

  // Super Admin — courses with no organizationId (independent trainers only)
  // Super Admin — independent trainer courses (organizationId IS NULL)
  getIndependentTrainerCourses() {
    return axios.get(`${API}/courses/super-admin/independent`, {
      headers: authHeader(),
    });
  },

  // Super Admin — categories from independent trainer courses only
  getIndependentTrainerCategories() {
    return axios.get(`${API}/courses/super-admin/independent-categories`, {
      headers: authHeader(),
    });
  },

  // Super Admin — get courses for a specific organization
  getCoursesByOrgId(organizationId) {
    return axios.get(`${API}/courses/org/${organizationId}`, {
      headers: authHeader(),
    });
  },

  //flag servcie endpoint

  // Course Feature Flags — org scoped
  getCourseFeatureFlags(orgId) {
    return axios.get(`${API}/course-feature-flags/org/${orgId}`, {
      headers: authHeader(),
    });
  },

  updateCourseFeatureFlags(orgId, dto) {
    return axios.put(`${API}/course-feature-flags/org/${orgId}`, dto, {
      headers: authHeader(),
    });
  },

  // Course Feature Flags — individual (org-less users)
  getIndividualCourseFeatureFlags(email) {
    return axios.get(`${API}/course-feature-flags/individual`, {
      params: { email },
      headers: authHeader(),
    });
  },

  updateIndividualCourseFeatureFlags(email, dto) {
    return axios.put(`${API}/course-feature-flags/individual`, dto, {
      params: { email },
      headers: authHeader(),
    });
  },

  // Admin — load trainers in his org for the dropdown
  getOrgTrainers() {
    return axios.get(`${API}/courses/admin/trainers`, {
      headers: authHeader(),
    });
  },

  // Admin creates + assigns course to a trainer
  adminCreateCourse(data) {
    return axios.post(`${API}/courses/admin/assign`, data, {
      headers: authHeader(),
    });
  },

  // Admin clicks trainer email → see their assigned courses
  getCoursesByTrainer(trainerEmail) {
    return axios.get(`${API}/courses/admin/trainer/${trainerEmail}`, {
      headers: authHeader(),
    });
  },

  // Trainer sees own + admin-assigned courses
  getTrainerAllCourses() {
    return axios.get(`${API}/courses/trainer/all`, {
      headers: authHeader(),
    });
  },

  // ===================== FEATURED COURSE ENDPOINTS =====================
  // Base path: /api/course/v1/featurecourse

  // GET /api/course/v1/featurecourse  (public)
  getAllFeaturedPrograms() {
    return axios.get(`${API}/course/v1/featurecourse`);
  },

  // GET /api/course/v1/featurecourse/category/{category}  (public)
  getFeaturedProgramsByCategory(category) {
    return axios.get(`${API}/course/v1/featurecourse/category/${category}`);
  },

  // GET /api/course/v1/featurecourse/{id}  (public)
  getFeaturedProgramById(id) {
    return axios.get(`${API}/course/v1/featurecourse/${id}`);
  },

  // GET /api/course/v1/featurecourse/{id}/syllabus  (public)
  getFeaturedProgramSyllabus(id) {
    return axios.get(`${API}/course/v1/featurecourse/${id}/syllabus`);
  },

  // GET /api/course/v1/featurecourse/superadmin  (SUPER_ADMIN)
  getAllFeaturedProgramsForAdmin() {
    return axios.get(`${API}/course/v1/featurecourse/superadmin`, {
      headers: authHeader(),
    });
  },

  // GET /api/course/v1/featurecourse/superadmin/stats  (SUPER_ADMIN)
  getFeaturedProgramStats() {
    return axios.get(`${API}/course/v1/featurecourse/superadmin/stats`, {
      headers: authHeader(),
    });
  },

  // POST /api/course/v1/featurecourse/superadmin  (SUPER_ADMIN)
  createFeaturedProgram(data) {
    return axios.post(`${API}/course/v1/featurecourse/superadmin`, data, {
      headers: authHeader(),
    });
  },

  // PUT /api/course/v1/featurecourse/superadmin/{id}  (SUPER_ADMIN)
  updateFeaturedProgram(id, data) {
    return axios.put(`${API}/course/v1/featurecourse/superadmin/${id}`, data, {
      headers: authHeader(),
    });
  },

  // DELETE /api/course/v1/featurecourse/superadmin/{id}  (SUPER_ADMIN)
  deleteFeaturedProgram(id) {
    return axios.delete(`${API}/course/v1/featurecourse/superadmin/${id}`, {
      headers: authHeader(),
    });
  },

  // PUT /api/course/v1/featurecourse/superadmin/{id}/publish  (SUPER_ADMIN)
  publishFeaturedProgram(id) {
    return axios.put(
      `${API}/course/v1/featurecourse/superadmin/${id}/publish`,
      null,
      { headers: authHeader() },
    );
  },

  // POST /api/course/v1/featurecourse/superadmin/ai-generate  (SUPER_ADMIN)
  generateFeaturedProgramWithAI(data) {
    // data = { topic, category, level }
    return axios.post(
      `${API}/course/v1/featurecourse/superadmin/ai-generate`,
      data,
      {
        headers: authHeader(),
      },
    );
  },

  extractSyllabusFromFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(
      `${API}/course/v1/featurecourse/superadmin/syllabus/extract`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
          // no Content-Type here at all
        },
      },
    );
  },
  // ===================== MENTOR FEEDBACK ENDPOINTS =====================
  // Base path: /api/v1/mentor-feedback

  // GET /api/v1/mentor-feedback/public/active  (public — for landing page)
  getActiveMentorFeedbacks() {
    return axios.get(`${API}/v1/mentor-feedback/public/active`);
  },

  // GET /api/v1/mentor-feedback  (SUPER_ADMIN — paginated list)
  getAllMentorFeedbacks(params) {
    return axios.get(`${API}/v1/mentor-feedback`, {
      params, // { search, status, rating, page, size }
      headers: authHeader(),
    });
  },

  // GET /api/v1/mentor-feedback/{id}  (SUPER_ADMIN)
  getMentorFeedbackById(id) {
    return axios.get(`${API}/v1/mentor-feedback/${id}`, {
      headers: authHeader(),
    });
  },

  // POST /api/v1/mentor-feedback  (SUPER_ADMIN)
  createMentorFeedback(data) {
    return axios.post(`${API}/v1/mentor-feedback`, data, {
      headers: authHeader(),
    });
  },

  // PUT /api/v1/mentor-feedback/{id}  (SUPER_ADMIN)
  updateMentorFeedback(id, data) {
    return axios.put(`${API}/v1/mentor-feedback/${id}`, data, {
      headers: authHeader(),
    });
  },

  // DELETE /api/v1/mentor-feedback/{id}  (SUPER_ADMIN)
  deleteMentorFeedback(id) {
    return axios.delete(`${API}/v1/mentor-feedback/${id}`, {
      headers: authHeader(),
    });
  },

  // PATCH /api/v1/mentor-feedback/{id}/toggle-status  (SUPER_ADMIN)
  toggleMentorFeedbackStatus(id) {
    return axios.patch(`${API}/v1/mentor-feedback/${id}/toggle-status`, null, {
      headers: authHeader(),
    });
  },

  // PATCH /api/v1/mentor-feedback/{id}/toggle-featured  (SUPER_ADMIN)
  toggleMentorFeedbackFeatured(id) {
    return axios.patch(
      `${API}/v1/mentor-feedback/${id}/toggle-featured`,
      null,
      {
        headers: authHeader(),
      },
    );
  },

  // GET /api/v1/mentor-feedback/stats  (SUPER_ADMIN)
  getMentorFeedbackStats() {
    return axios.get(`${API}/v1/mentor-feedback/stats`, {
      headers: authHeader(),
    });
  },

  // ===================== COMPANY ENDPOINTS (Top Global Companies) =====================
  // Base path: /api/v1/companies

  // GET /api/v1/companies/public/active  (public — for LMS homepage)
  getActiveCompanies() {
    return axios.get(`${API}/v1/companies/public/active`);
  },

  // GET /api/v1/companies  (SUPER_ADMIN — paginated list)
  getAllCompanies(params) {
    return axios.get(`${API}/v1/companies`, {
      params, // { search, category, status, page, size }
      headers: authHeader(),
    });
  },

  // GET /api/v1/companies/{id}  (SUPER_ADMIN)
  getCompanyById(id) {
    return axios.get(`${API}/v1/companies/${id}`, {
      headers: authHeader(),
    });
  },

  // POST /api/v1/companies  (SUPER_ADMIN)
  createCompany(data) {
    return axios.post(`${API}/v1/companies`, data, {
      headers: authHeader(),
    });
  },

  // PUT /api/v1/companies/{id}  (SUPER_ADMIN)
  updateCompany(id, data) {
    return axios.put(`${API}/v1/companies/${id}`, data, {
      headers: authHeader(),
    });
  },

  // DELETE /api/v1/companies/{id}  (SUPER_ADMIN)
  deleteCompany(id) {
    return axios.delete(`${API}/v1/companies/${id}`, {
      headers: authHeader(),
    });
  },

  // PATCH /api/v1/companies/{id}/toggle-status  (SUPER_ADMIN)
  toggleCompanyStatus(id) {
    return axios.patch(`${API}/v1/companies/${id}/toggle-status`, null, {
      headers: authHeader(),
    });
  },

  // GET /api/v1/companies/stats  (SUPER_ADMIN)
  getCompanyStats() {
    return axios.get(`${API}/v1/companies/stats`, {
      headers: authHeader(),
    });
  },

  // ===================== CMS LANDING HUBS ENDPOINTS =====================
  // GET /api/v1/cmslandinghubs/{pageKey}  (SUPER_ADMIN)
  getCmsPage(pageKey) {
    return axios.get(`${API}/v1/cmslandinghubs/${pageKey}`, {
      headers: authHeader(),
    });
  },

  // GET /api/v1/cmslandinghubs/public/{pageKey}  (public, no auth)
  getPublicCmsPage(pageKey) {
    return axios.get(`${API}/v1/cmslandinghubs/public/${pageKey}`);
  },

  // PUT /api/v1/cmslandinghubs/{pageKey}/settings  (SUPER_ADMIN)
  updateCmsPageSettings(pageKey, data) {
    return axios.put(`${API}/v1/cmslandinghubs/${pageKey}/settings`, data, {
      headers: authHeader(),
    });
  },

  // POST /api/v1/cmslandinghubs/{pageKey}/sections  (SUPER_ADMIN)
  addCmsSection(pageKey, data) {
    return axios.post(`${API}/v1/cmslandinghubs/${pageKey}/sections`, data, {
      headers: authHeader(),
    });
  },

  // PUT /api/v1/cmslandinghubs/{pageKey}/sections/{sectionId}  (SUPER_ADMIN)
  updateCmsSection(pageKey, sectionId, data) {
    return axios.put(
      `${API}/v1/cmslandinghubs/${pageKey}/sections/${sectionId}`,
      data,
      { headers: authHeader() },
    );
  },

  // DELETE /api/v1/cmslandinghubs/{pageKey}/sections/{sectionId}  (SUPER_ADMIN)
  deleteCmsSection(pageKey, sectionId) {
    return axios.delete(
      `${API}/v1/cmslandinghubs/${pageKey}/sections/${sectionId}`,
      { headers: authHeader() },
    );
  },

  // PUT /api/v1/cmslandinghubs/{pageKey}/sections/reorder  (SUPER_ADMIN)
  // orderedIds — array of section ids in the desired order
  reorderCmsSections(pageKey, orderedIds) {
    return axios.put(
      `${API}/v1/cmslandinghubs/${pageKey}/sections/reorder`,
      { orderedIds },
      { headers: authHeader() },
    );
  },

  // PATCH /api/v1/cmslandinghubs/{pageKey}/sections/{sectionId}/visibility  (SUPER_ADMIN)
  setCmsSectionVisibility(pageKey, sectionId, visible) {
    return axios.patch(
      `${API}/v1/cmslandinghubs/${pageKey}/sections/${sectionId}/visibility`,
      { visible },
      { headers: authHeader() },
    );
  },

  // PATCH /api/v1/cmslandinghubs/{pageKey}/sections/{sectionId}/publish  (SUPER_ADMIN)
  setCmsSectionPublished(pageKey, sectionId, published) {
    return axios.patch(
      `${API}/v1/cmslandinghubs/${pageKey}/sections/${sectionId}/publish`,
      { published },
      { headers: authHeader() },
    );
  },

  // POST /api/v1/cmslandinghubs/{pageKey}/sections/{sectionId}/components  (SUPER_ADMIN)
  addCmsComponent(pageKey, sectionId, data) {
    return axios.post(
      `${API}/v1/cmslandinghubs/${pageKey}/sections/${sectionId}/components`,
      data,
      { headers: authHeader() },
    );
  },

  // PUT /api/v1/cmslandinghubs/{pageKey}/components/{componentId}  (SUPER_ADMIN)
  updateCmsComponent(pageKey, componentId, data) {
    return axios.put(
      `${API}/v1/cmslandinghubs/${pageKey}/components/${componentId}`,
      data,
      { headers: authHeader() },
    );
  },

  // DELETE /api/v1/cmslandinghubs/{pageKey}/components/{componentId}  (SUPER_ADMIN)
  deleteCmsComponent(pageKey, componentId) {
    return axios.delete(
      `${API}/v1/cmslandinghubs/${pageKey}/components/${componentId}`,
      { headers: authHeader() },
    );
  },

  // PATCH /api/v1/cmslandinghubs/{pageKey}/components/{componentId}/visibility  (SUPER_ADMIN)
  setCmsComponentVisibility(pageKey, componentId, visible) {
    return axios.patch(
      `${API}/v1/cmslandinghubs/${pageKey}/components/${componentId}/visibility`,
      { visible },
      { headers: authHeader() },
    );
  },

  // GET /api/v1/cmslandinghubs/media?search=  (SUPER_ADMIN)
  listCmsMedia(search) {
    return axios.get(`${API}/v1/cmslandinghubs/media`, {
      params: search ? { search } : undefined,
      headers: authHeader(),
    });
  },

  // POST /api/v1/cmslandinghubs/media/upload  (SUPER_ADMIN, multipart "file")
  uploadCmsMedia(file) {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`${API}/v1/cmslandinghubs/media/upload`, formData, {
      headers: {
        ...authHeader(),
        // Do NOT set Content-Type manually — the browser sets
        // multipart/form-data; boundary=... automatically.
      },
    });
  },

  // DELETE /api/v1/cmslandinghubs/media/{mediaId}  (SUPER_ADMIN)
  deleteCmsMedia(mediaId) {
    return axios.delete(`${API}/v1/cmslandinghubs/media/${mediaId}`, {
      headers: authHeader(),
    });
  },

  // GET /api/v1/cmslandinghubs/{pageKey}/navigation  (SUPER_ADMIN)
  listCmsNavItems(pageKey) {
    return axios.get(`${API}/v1/cmslandinghubs/${pageKey}/navigation`, {
      headers: authHeader(),
    });
  },

  // POST /api/v1/cmslandinghubs/{pageKey}/navigation  (SUPER_ADMIN)
  addCmsNavItem(pageKey, data) {
    return axios.post(`${API}/v1/cmslandinghubs/${pageKey}/navigation`, data, {
      headers: authHeader(),
    });
  },

  // PUT /api/v1/cmslandinghubs/{pageKey}/navigation/{itemId}  (SUPER_ADMIN)
  updateCmsNavItem(pageKey, itemId, data) {
    return axios.put(
      `${API}/v1/cmslandinghubs/${pageKey}/navigation/${itemId}`,
      data,
      { headers: authHeader() },
    );
  },

  // DELETE /api/v1/cmslandinghubs/{pageKey}/navigation/{itemId}  (SUPER_ADMIN)
  deleteCmsNavItem(pageKey, itemId) {
    return axios.delete(
      `${API}/v1/cmslandinghubs/${pageKey}/navigation/${itemId}`,
      { headers: authHeader() },
    );
  },

  // PUT /api/v1/cmslandinghubs/{pageKey}/navigation/reorder  (SUPER_ADMIN)
  reorderCmsNavItems(pageKey, orderedIds) {
    return axios.put(
      `${API}/v1/cmslandinghubs/${pageKey}/navigation/reorder`,
      { orderedIds },
      { headers: authHeader() },
    );
  },

  // ===================== WISHLIST ENDPOINTS =====================
  // Base path: /api/course/v1/wishlist  (requires login — Bearer token)

  toggleWishlist(programId) {
    return axios.post(`${API}/course/v1/wishlist/toggle/${programId}`, null, {
      headers: authHeader(),
    });
  },

  getMyWishlist() {
    return axios.get(`${API}/course/v1/wishlist/my`, {
      headers: authHeader(),
    });
  },

  // ===================== BANNER STUDIO ENDPOINTS =====================
  // Base path: /api/banners  (SUPER_ADMIN — CMS Management > Banner Studio)

  // GET /api/banners?status=all&search=
  getAllBanners(status = "all", search = "") {
    return axios.get(`${API}/banners`, {
      params: { status, search },
      headers: authHeader(),
    });
  },

  // GET /api/banners/{id}
  getBannerById(id) {
    return axios.get(`${API}/banners/${id}`, {
      headers: authHeader(),
    });
  },

  // POST /api/banners
  createBanner(data) {
    return axios.post(`${API}/banners`, data, {
      headers: authHeader(),
    });
  },

  // PUT /api/banners/{id}
  updateBanner(id, data) {
    return axios.put(`${API}/banners/${id}`, data, {
      headers: authHeader(),
    });
  },

  // DELETE /api/banners/{id}
  deleteBanner(id) {
    return axios.delete(`${API}/banners/${id}`, {
      headers: authHeader(),
    });
  },

  // POST /api/banners/{id}/duplicate
  duplicateBanner(id) {
    return axios.post(`${API}/banners/${id}/duplicate`, null, {
      headers: authHeader(),
    });
  },

  // PATCH /api/banners/{id}/publish
  publishBannerNow(id) {
    return axios.patch(`${API}/banners/${id}/publish`, null, {
      headers: authHeader(),
    });
  },

  // PATCH /api/banners/{id}/schedule
  scheduleBanner(id, startDate, startTime) {
    return axios.patch(
      `${API}/banners/${id}/schedule`,
      { startDate, startTime },
      { headers: authHeader() },
    );
  },

  // PATCH /api/banners/{id}/status
  updateBannerStatus(id, status) {
    return axios.patch(
      `${API}/banners/${id}/status`,
      { status },
      { headers: authHeader() },
    );
  },

  // PATCH /api/banners/{id}/view  (analytics — impression tracking, public)
  registerBannerView(id) {
    return axios.patch(`${API}/banners/${id}/view`);
  },

  // PATCH /api/banners/{id}/click  (analytics — click tracking, public)
  registerBannerClick(id) {
    return axios.patch(`${API}/banners/${id}/click`);
  },

  // POST /api/banners/ai-generate  (SUPER_ADMIN — AIStudioSection "Generate with AI")
  generateBannerWithAI(data) {
    // data = { prompt, audience, theme, bannerType, style }
    return axios.post(`${API}/banners/ai-generate`, data, {
      headers: authHeader(),
    });
  },

  // POST /api/banners/ai-generate/save  ("Add to Banners" button)
  saveAiGeneratedBanner(aiResult) {
    return axios.post(`${API}/banners/ai-generate/save`, aiResult, {
      headers: authHeader(),
    });
  },

  // GET /api/banners?status=active  (public — used by LMSHomepage promo strip)
  getActiveBanners() {
    return axios.get(`${API}/banners`, {
      params: { status: "active" },
    });
  },
};
