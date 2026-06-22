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
      const res = await authService.login({ email, password }); // ✅ pass object

      const { token, email: userEmail, role, name, organizationId } = res;

      localStorage.setItem("lms_token", token);
      // ✅ ADD THIS
      if (organizationId) {
        localStorage.setItem("organizationId", organizationId);
      } else {
        localStorage.removeItem("organizationId");
      }
      localStorage.setItem(
        "lms_user",
        JSON.stringify({
          email: userEmail,
          role: role.toLowerCase(),
          name: name || userEmail.split("@")[0],
          organizationId: organizationId || null, // ← add this
        }),
      );
      return true;
    } catch (err) {
      return false;
    }
  },

  async googleLogin({ idToken, role }) {
    try {
      const res = await authService.googleLogin({
        idToken: idToken,
        role,
      });

      const data = res.data;

      // 🔥 DEBUG LINES
      console.log(">>> auth.js raw data:", JSON.stringify(data));
      console.log(">>> isNewUser value:", data?.isNewUser);
      console.log(">>> isNewUser type:", typeof data?.isNewUser);

      if (data?.isNewUser === true) {
        return { isNewUser: true };
      }

      const {
        token,
        email: userEmail,
        role: userRole,
        name: userName,
        organizationId,
      } = data; // ← name
      localStorage.setItem("lms_token", token);
      if (organizationId) {
        localStorage.setItem("organizationId", organizationId);
      } else {
        localStorage.removeItem("organizationId");
      }
      localStorage.setItem(
        "lms_user",
        JSON.stringify({
          email: userEmail,
          role: userRole ? userRole.toLowerCase() : "student",
          name: userName || userEmail.split("@")[0],
        }),
      );

      return { isNewUser: false, role: userRole };
    } catch (err) {
      console.error("Google login failed:", err);
      throw err;
    }
  },

  logout() {
    localStorage.removeItem("lms_token");
    localStorage.removeItem("lms_user");
    localStorage.removeItem("organizationId");
    localStorage.removeItem("role");
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
