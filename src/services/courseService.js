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

  deleteCourse(id) {
    return axios.delete(`${API}/api/courses/${id}`, {
      headers: authHeader(),
    });
  },
};