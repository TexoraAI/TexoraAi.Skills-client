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

  async googleLogin({ idToken, role, onboardingAnswers }) {
    try {
      // authService.googleLogin() already resolves to `res.data` — it
      // returns the parsed response body, NOT an axios response object.
      // Do not unwrap `.data` again here (that was Bug 2 — it made
      // `data` undefined and threw on destructuring, every single time).
      const data = await authService.googleLogin({
        idToken,
        role,
        onboardingAnswers, // ← the actual fix: forward this through
      });

      // Return the raw payload as-is. IlmOraDemoPage.jsx's
      // finalizeOnboarding() is the single source of truth for writing
      // lms_token / lms_user / organizationId to localStorage — it reads
      // res.token, res.role, res.name, res.email, res.organizationId,
      // res.profileCompleted directly off this return value. Doing a
      // second, incomplete localStorage write here (as the old code did)
      // just overwrote that with a worse object.
      return data;
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
    // Token check ke sath-sath lms_user bhi check karo — kyunki naya
    // Google signup user (role-selection / profile-completion ke beech)
    // ke paas token nahi hota, sirf lms_user hota hai.
    return (
      !!localStorage.getItem("lms_token") || !!localStorage.getItem("lms_user")
    );
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
