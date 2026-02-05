import axios from "axios";

const API_GATEWAY = "http://localhost:9000";

const searchService = {
  search(keyword) {
    return axios.get(
      `${API_GATEWAY}/api/search/${encodeURIComponent(keyword)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
        },
      }
    );
  },
};

export default searchService;