import axios from "axios";

const API_GATEWAY =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// ✅ Add this helper — used by all resume endpoints
function authHeader() {
  return {
    Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
  };
}

const userService = {
  // =========================
  // Admin: list users
  // =========================
  getUsers(page = 0, size = 20) {
    return axios.get(`${API_GATEWAY}/users`, {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
      },
    });
  },

  // =========================
  // Get user by ID
  // =========================
  getUserById(id) {
    return axios.get(`${API_GATEWAY}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
      },
    });
  },

  // =========================
  // Update user
  // =========================
  updateUser(id, data) {
    return axios.put(`${API_GATEWAY}/users/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
      },
    });
  },

  // =========================
  // ✅ ADMIN CREATE USER (ONLY THIS IS USED)
  // =========================
  createUser(data) {
    return axios.post(`${API_GATEWAY}/users`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
      },
    });
  },

  // =========================
  // 🔓 PUBLIC AUTH REGISTER (SIGNUP ONLY – NOT USED BY ADMIN)
  // =========================
  createAuthUser(data) {
    return axios.post(`${API_GATEWAY}/auth/register`, {
      email: data.email,
      password: data.password,
      name: data.displayName,
      role: data.roles?.replace("ROLE_", "") || "STUDENT",
    });
  },

  // =========================
  // Delete user
  // =========================
  deleteUser(id) {
    return axios.delete(`${API_GATEWAY}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
      },
    });
  },

  getMyProfile() {
    return axios.get(`${API_GATEWAY}/users/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
      },
    });
  },

  updateMyProfile(data) {
    return axios.put(`${API_GATEWAY}/users/me`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
      },
    });
  },

  // =============================================================
  // =============================================================
  //  RESUME BUILDER ENDPOINTS  →  /api/v1/resume/{userId}
  // =============================================================

  // ✅ GET ALL RESUMES
  getMyResumes(userId) {
    return axios.get(`${API_GATEWAY}/v1/resume/${userId}`, {
      headers: authHeader(),
    });
  },

  // ✅ GET SINGLE RESUME
  getResumeById(userId, resumeId) {
    return axios.get(`${API_GATEWAY}/v1/resume/${userId}/${resumeId}`, {
      headers: authHeader(),
    });
  },

  // ✅ CREATE RESUME
  createResume(userId, resumeData) {
    return axios.post(`${API_GATEWAY}/v1/resume/${userId}`, resumeData, {
      headers: authHeader(),
    });
  },

  // ✅ UPDATE RESUME
  updateResume(userId, resumeId, resumeData) {
    return axios.put(
      `${API_GATEWAY}/v1/resume/${userId}/${resumeId}`,
      resumeData,
      {
        headers: authHeader(),
      },
    );
  },

  // ✅ DELETE RESUME
  deleteResume(userId, resumeId) {
    return axios.delete(`${API_GATEWAY}/v1/resume/${userId}/${resumeId}`, {
      headers: authHeader(),
    });
  },

  // ✅ DUPLICATE RESUME
  duplicateResume(userId, resumeId) {
    return axios.post(
      `${API_GATEWAY}/v1/resume/${userId}/${resumeId}/duplicate`,
      {},
      { headers: authHeader() },
    );
  },

  // ─── Resume AI ─────────────────────────────────────────────────────────────

  // aiGenerateResume(userId, jobTitle, yearsOfExperience, skills) {
  //   return axios.post(
  //     `${API_GATEWAY}/v1/resume/${userId}/ai/generate`,
  //     { jobTitle, yearsOfExperience, skills },
  //     { headers: authHeader() },
  //   );
  // },
  aiGenerateResume(
    userId,
    name,
    email,
    linkedinUrl,
    jobTitle,
    yearsOfExperience,
    skills,
    templateName = "classic",
  ) {
    return axios.post(
      `${API_GATEWAY}/v1/resume/${userId}/ai/generate`,
      {
        name,
        email,
        linkedinUrl,
        jobTitle,
        yearsOfExperience,
        skills,
        templateName,
      },
      { headers: authHeader() },
    );
  },

  aiParsePdf(userId, base64Pdf, fileName) {
    return axios.post(
      `${API_GATEWAY}/v1/resume/${userId}/ai/parse-pdf`,
      { base64Pdf, fileName },
      { headers: authHeader() },
    );
  },

  aiGetAtsTips(userId, resume) {
    return axios.post(
      `${API_GATEWAY}/v1/resume/${userId}/ai/ats-tips`,
      {
        jobTitle: resume.jobTitle,
        profileSummary: resume.profileSummary,
        skillNames: resume.skills.map((s) => s.skillName).join(", "),
        workExperienceCount: resume.workExperiences.length,
        educationCount: resume.educations.length,
        projectCount: resume.projects.length,
        certificationCount: resume.certifications.length,
        hasLinkedin: !!resume.linkedinUrl,
        hasGithub: !!resume.githubUrl,
      },
      { headers: authHeader() },
    );
  },

  
  linkedInScrape(
    userId,
    linkedInUrl,
    jobTitle = "",
    extraSkills = "",
    templateName = "classic",
    base64Pdf = "",
    fileName = "",
  ) {
    return axios.post(
      `${API_GATEWAY}/v1/resume/${userId}/linkedin/scrape`,
      { linkedInUrl, jobTitle, extraSkills, templateName, base64Pdf, fileName },
      { headers: authHeader() },
    );
  },
  aiWriteSection(userId, section, input) {
    return axios.post(
      `${API_GATEWAY}/v1/resume/${userId}/ai/write`,
      { section, input },
      { headers: authHeader() },
    );
  },

  /**
   * Quick URL validation check.
   * GET /api/v1/resume/{userId}/linkedin/validate?url=...
   */
  linkedInValidate(userId, url) {
    return axios.get(`${API_GATEWAY}/v1/resume/${userId}/linkedin/validate`, {
      params: { url },
      headers: authHeader(),
    });
  },
};

export default userService;
