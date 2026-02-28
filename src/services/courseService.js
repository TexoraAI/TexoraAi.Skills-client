import axios from "axios";

const API = "http://localhost:9000";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});

export const courseService = {
  getMyCourses() {
    return axios.get(`${API}/api/courses/my`, {
      headers: authHeader(),
    });
  },

  getById(id) {
    return axios.get(`${API}/api/courses/${id}`);
  },

  createCourse(data) {
    return axios.post(`${API}/api/courses`, data, {
      headers: authHeader(),
    });
  },

  updateCourse(id, data) {
    return axios.put(`${API}/api/courses/${id}`, data, {
      headers: authHeader(),
    });
  },

  getStudentCourses() {
    return axios.get(`${API}/api/courses/student`, {
      headers: authHeader(),
    });
  },

  deleteCourse(id) {
    return axios.delete(`${API}/api/courses/${id}`, {
      headers: authHeader(),
    });
  },
  // 🔐 ADMIN - Get All Courses
  getAllCoursesForAdmin() {
    return axios.get(`${API}/api/courses/admin`, {
      headers: authHeader(),
    });
  },

  // 🔐 ADMIN - Get Courses By Category
  getCoursesByCategory(category) {
    return axios.get(`${API}/api/courses/admin/category/${category}`, {
      headers: authHeader(),
    });
  },
};
