// import axios from "axios";

// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// const authHeader = () => ({
//   Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
// });

// export const courseService = {
//   getMyCourses() {
//     return axios.get(`${API}/courses/my`, {
//       headers: authHeader(),
//     });
//   },

//   getById(id) {
//     return axios.get(`${API}/courses/${id}`);
//   },

//   createCourse(data) {
//     return axios.post(`${API}/courses`, data, {
//       headers: authHeader(),
//     });
//   },

//   updateCourse(id, data) {
//     return axios.put(`${API}/courses/${id}`, data, {
//       headers: authHeader(),
//     });
//   },

//   getStudentCourses() {
//     return axios.get(`${API}/courses/student`, {
//       headers: authHeader(),
//     });
//   },

//   deleteCourse(id) {
//     return axios.delete(`${API}/courses/${id}`, {
//       headers: authHeader(),
//     });
//   },
//   // 🔐 ADMIN - Get All Courses
//   // getAllCoursesForAdmin() {
//   //   return axios.get(`${API}/courses/admin`, {
//   //     headers: authHeader(),
//   //   });
//   // },

//   // // 🔐 ADMIN - Get Courses By Category
//   // getCoursesByCategory(category) {
//   //   return axios.get(`${API}/courses/admin/category/${category}`, {
//   //     headers: authHeader(),
//   //   });
//   // },
//   // Org Admin — sees only their org's courses
//   getOrgAdminCourses() {
//     return axios.get(`${API}/courses/org-admin`, {
//       headers: authHeader(),
//     });
//   },
//   // Categories for super admin
//   getAllCategories() {
//     return axios.get(`${API}/courses/categories`, {
//       headers: authHeader(),
//     });
//   },

//   // Super Admin — courses with no organizationId (independent trainers only)
//   // Super Admin — independent trainer courses (organizationId IS NULL)
//   getIndependentTrainerCourses() {
//     return axios.get(`${API}/courses/super-admin/independent`, {
//       headers: authHeader(),
//     });
//   },

//   // Super Admin — categories from independent trainer courses only
//   getIndependentTrainerCategories() {
//     return axios.get(`${API}/courses/super-admin/independent-categories`, {
//       headers: authHeader(),
//     });
//   },

//   // Super Admin — get courses for a specific organization
//   getCoursesByOrgId(organizationId) {
//     return axios.get(`${API}/courses/org/${organizationId}`, {
//       headers: authHeader(),
//     });
//   },

//   //flag servcie endpoint

//   // Course Feature Flags — org scoped
//   getCourseFeatureFlags(orgId) {
//     return axios.get(`${API}/course-feature-flags/org/${orgId}`, {
//       headers: authHeader(),
//     });
//   },

//   updateCourseFeatureFlags(orgId, dto) {
//     return axios.put(`${API}/course-feature-flags/org/${orgId}`, dto, {
//       headers: authHeader(),
//     });
//   },

//   // Course Feature Flags — individual (org-less users)
//   getIndividualCourseFeatureFlags(email) {
//     return axios.get(`${API}/course-feature-flags/individual`, {
//       params: { email },
//       headers: authHeader(),
//     });
//   },

//   updateIndividualCourseFeatureFlags(email, dto) {
//     return axios.put(`${API}/course-feature-flags/individual`, dto, {
//       params: { email },
//       headers: authHeader(),
//     });
//   },

//   // Admin — load trainers in his org for the dropdown
//   getOrgTrainers() {
//     return axios.get(`${API}/courses/admin/trainers`, {
//       headers: authHeader(),
//     });
//   },

//   // Admin creates + assigns course to a trainer
//   adminCreateCourse(data) {
//     return axios.post(`${API}/courses/admin/assign`, data, {
//       headers: authHeader(),
//     });
//   },

//   // Admin clicks trainer email → see their assigned courses
//   getCoursesByTrainer(trainerEmail) {
//     return axios.get(`${API}/courses/admin/trainer/${trainerEmail}`, {
//       headers: authHeader(),
//     });
//   },

//   // Trainer sees own + admin-assigned courses
//   getTrainerAllCourses() {
//     return axios.get(`${API}/courses/trainer/all`, {
//       headers: authHeader(),
//     });
//   },

// };
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
};
