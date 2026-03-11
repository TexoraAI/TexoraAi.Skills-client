import axios from "axios";

const API =   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";


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
  getAllCoursesForAdmin() {
    return axios.get(`${API}/courses/admin`, {
      headers: authHeader(),
    });
  },

  // 🔐 ADMIN - Get Courses By Category
  getCoursesByCategory(category) {
    return axios.get(`${API}/courses/admin/category/${category}`, {
      headers: authHeader(),
    });
  },
};
