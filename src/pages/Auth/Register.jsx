
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import authService from "../../services/authService"; // ✅ update path if needed

const colors = {
  primary: "from-blue-600 to-emerald-600",
  primarySolid: "bg-blue-600",
  muted: "text-gray-600 dark:text-gray-400",
};

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = (searchParams.get("role") || "STUDENT").toUpperCase();

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ GOOGLE SIGNUP (backend)
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");
      setSuccess("");

      const decoded = jwtDecode(credentialResponse.credential);

      const res = await authService.googleLogin({
        idToken: credentialResponse.credential,
        role: role,
      });

      // Save token
      authService.saveToken(res.data.token);

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: res.data.email,
          role: res.data.role,
          name: decoded.name || decoded.email.split("@")[0],
          method: "google",
        }),
      );

      setSuccess("Google signup/login success!");

      // Redirect based on role
      setTimeout(() => {
        if (res.data.role === "STUDENT") navigate("/student/dashboard");
        else if (res.data.role === "TRAINER") navigate("/trainer/dashboard");
        else if (res.data.role === "BUSINESS") navigate("/business/dashboard");
        else if (res.data.role === "ADMIN") navigate("/admin/dashboard");
        else navigate("/");
      }, 800);
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Google signup failed");
    }
  };

  // ✅ EMAIL REGISTER (backend)
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Password mismatch");
      return;
    }

    try {
      // 1) Register
      await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: role,
      });

      setSuccess("Account created successfully! Please login now.");
      setTimeout(() => navigate(`/login?role=${role}`), 1000);
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-black shadow-sm border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div
              className={`w-8 h-8 bg-gradient-to-br ${colors.primary} rounded flex items-center justify-center shadow-md`}
            >
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              TexoraAi.skills
            </span>
          </div>

          <button
            onClick={() => navigate(`/login?role=${role}`)}
            className={`${colors.primarySolid} text-white px-4 py-2 rounded-lg`}
          >
            Log In
          </button>
        </div>
      </header>

      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-black rounded-lg shadow-md border dark:border-gray-800 p-8">
            <h2 className="text-3xl font-bold text-center mb-2">
              Create Account
            </h2>
            <p className="text-sm text-center mb-6">
              Join as <b>{role}</b>
            </p>

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google cancelled")}
              width="100%"
            />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-black">
                  or use email
                </span>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            {success && (
              <p className="text-green-600 text-sm mb-3">{success}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg"
              />

              <button
                type="submit"
                className={`w-full ${colors.primarySolid} text-white py-3 rounded-lg`}
              >
                Create Account
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to={`/login?role=${role}`}
                className="text-sm text-blue-600"
              >
                Already have an account? Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
