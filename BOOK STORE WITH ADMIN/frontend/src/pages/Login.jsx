import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAction } from "../store/auth";
import axios from "axios";
import { useDispatch } from "react-redux";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
     try {
      const response = await axios.post( 
        "http://localhost:1000/api/v1/sign-in",
        formData
      );
      dispatch(authAction.login());
      dispatch(authAction.changeRole(response.data.role));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("role", response.data.role);

      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-[340px] h-[340px] bg-violet-700 opacity-10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] bg-emerald-600 opacity-10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-emerald-500 flex items-center justify-center mb-3 shadow-lg shadow-violet-900/40">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            BookHaven
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Welcome back, reader</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white text-xl font-semibold mb-1">Sign in</h2>
          <p className="text-zinc-500 text-sm mb-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-950/50 border border-red-800/50 rounded-xl px-4 py-3 text-red-400 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Email address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none placeholder-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-violet-400 hover:text-violet-300 text-xs transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl pl-10 pr-12 py-3 outline-none placeholder-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-violet-500"
              />
              <span className="text-zinc-500 text-sm">
                Remember me for 30 days
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white text-sm font-semibold tracking-wide transition-all duration-200
                                ${
                                  loading
                                    ? "bg-violet-800/50 cursor-not-allowed"
                                    : "bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-900/40 hover:-translate-y-0.5 active:translate-y-0"
                                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-xs">or continue with</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Google */}
          <button className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-700 hover:border-zinc-600 transition-all duration-200">
            <svg width="17" height="17" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.26 9.77A7.08 7.08 0 0 1 12 4.93c1.69 0 3.21.6 4.4 1.57l3.29-3.29A11.95 11.95 0 0 0 12 .93C8.12.93 4.74 3 2.9 6.12l2.36 3.65z"
              />
              <path
                fill="#34A853"
                d="M16.04 18.2A7.06 7.06 0 0 1 12 19.07c-2.9 0-5.4-1.75-6.6-4.3L3.04 18.4A12 12 0 0 0 12 23.07c2.98 0 5.79-1.1 7.88-2.93l-3.84-1.94z"
              />
              <path
                fill="#4A90E2"
                d="M19.88 20.14A11.94 11.94 0 0 0 24 12c0-.74-.07-1.46-.18-2.16H12v4.32h6.7a5.73 5.73 0 0 1-2.49 3.76l3.67 2.22z"
              />
              <path
                fill="#FBBC05"
                d="M5.4 14.77A7.14 7.14 0 0 1 4.93 12c0-.97.17-1.9.47-2.77L3.04 5.58A11.92 11.92 0 0 0 .93 12c0 1.93.46 3.75 1.27 5.38L5.4 14.77z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center text-zinc-700 text-xs mt-6">
          © {new Date().getFullYear()} BookHaven · Made with{" "}
          <span className="text-red-600">♥</span> by Fida Hussain
        </p>
      </div>
    </div>
  );
};

export default Login;
