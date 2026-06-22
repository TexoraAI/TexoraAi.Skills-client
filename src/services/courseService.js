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
  // 🔐 ADMIN - Get All Courses
  // getAllCoursesForAdmin() {
  //   return axios.get(`${API}/courses/admin`, {
  //     headers: authHeader(),
  //   });
  // },

  // // 🔐 ADMIN - Get Courses By Category
  // getCoursesByCategory(category) {
  //   return axios.get(`${API}/courses/admin/category/${category}`, {
  //     headers: authHeader(),
  //   });
  // },
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
  ////featured ciurses
  // Featured Courses
  // createFeaturedCourse(data) {
  //   return axios.post(`${API}/featured-courses`, data, {
  //     headers: { ...authHeader(), "Content-Type": "application/json" },
  //   });
  // },
  createFeaturedCourse(formData) {
    return axios.post(`${API}/featured-courses/upload`, formData, {
      headers: authHeader(), // ✅ ONLY THIS
    });
  },

  getAllFeaturedCourses() {
    return axios.get(`${API}/featured-courses`);
  },

  updateFeaturedCourse(id, formData) {
    return axios.put(`${API}/featured-courses/${id}`, formData, {
      headers: authHeader(), // axios sets Content-Type multipart automatically
    });
  },
  deleteFeaturedCourse(id) {
    return axios.delete(`${API}/featured-courses/${id}`, {
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
};
