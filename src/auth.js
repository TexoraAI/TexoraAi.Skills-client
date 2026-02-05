import authService from "./services/authService";

const auth = {
  async signup({ name, email, password, role = "STUDENT" }) {
    await authService.register({
      name,
      email,
      password,
      role: role.toUpperCase(),
    });
    return true;
  },

  async login({ email, password }) {
    try {
      const res = await authService.login(email, password);

      const { token, email: userEmail, role } = res.data;

      localStorage.setItem("lms_token", token);
      localStorage.setItem(
        "lms_user",
        JSON.stringify({
          email: userEmail,
          role: role.toLowerCase(),
        })
      );

      return true;
    } catch (err) {
      return false;
    }
  },

  async googleLogin({ idToken, role }) {
    try {
      const res = await authService.googleLogin({
        idToken: idToken, // ✅ MUST MATCH BACKEND
        role,
      });

      const { token, email: userEmail, role: userRole } = res.data;

      localStorage.setItem("lms_token", token);
      localStorage.setItem(
        "lms_user",
        JSON.stringify({
          email: userEmail,
          role: userRole.toLowerCase(),
        })
      );

      return true;
    } catch (err) {
      console.error("Google login failed:", err);
      return false;
    }
  },

  logout() {
    localStorage.removeItem("lms_token");
    localStorage.removeItem("lms_user");
  },

  isAuthenticated() {
    return !!localStorage.getItem("lms_token");
  },

  getCurrentUser() {
    const saved = localStorage.getItem("lms_user");
    return saved ? JSON.parse(saved) : {};
  },

  getCurrentRole() {
    return this.getCurrentUser().role || "student";
  },

  canAccess(targetRole) {
    const currentRole = this.getCurrentRole();
    return currentRole === "admin" || currentRole === targetRole;
  },
};

export default auth;