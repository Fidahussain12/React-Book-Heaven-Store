import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:1000/api/v1/sign-up", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ open }) => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );

  const strength = (() => {
    const p = formData.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "#E24B4A", "#EF9F27", "#1D9E75", "#0F6E56"];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(83,74,183,0.15) 0%, transparent 60%),
                                  radial-gradient(ellipse at 80% 20%, rgba(29,158,117,0.1) 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo / Brand */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              background: "linear-gradient(135deg, #534AB7, #1D9E75)",
              borderRadius: "14px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
              boxShadow: "0 8px 32px rgba(83,74,183,0.4)",
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h1
            style={{
              color: "#fff",
              fontSize: "1.75rem",
              fontWeight: "700",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            BookHaven
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.875rem",
              margin: "0.4rem 0 0",
              fontFamily: "sans-serif",
            }}
          >
            Your personal reading universe
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "2.25rem 2rem",
            backdropFilter: "blur(20px)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: "1.35rem",
              fontWeight: "600",
              margin: "0 0 0.35rem",
              fontFamily: "sans-serif",
            }}
          >
            Create your account
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.85rem",
              margin: "0 0 1.75rem",
              fontFamily: "sans-serif",
            }}
          >
            Already have one?{" "}
            <Link
              to="/login"
              style={{
                color: "#7F77DD",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Sign in
            </Link>
          </p>

          {error && (
            <div
              style={{
                background: "rgba(226,75,74,0.12)",
                border: "1px solid rgba(226,75,74,0.3)",
                borderRadius: "10px",
                padding: "0.75rem 1rem",
                color: "#F09595",
                fontSize: "0.85rem",
                marginBottom: "1.25rem",
                fontFamily: "sans-serif",
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Username */}
            <div>
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                name="username"
                placeholder="e.g. booklover123"
                value={formData.username}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(127,119,221,0.6)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.12)")
                }
              />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(127,119,221,0.6)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.12)")
                }
              />
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, paddingRight: "3rem" }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(127,119,221,0.6)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.12)")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={eyeBtn}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {/* Strength bar */}
              {formData.password && (
                <div style={{ marginTop: "0.5rem" }}>
                  <div
                    style={{ display: "flex", gap: "4px", marginBottom: "4px" }}
                  >
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: "3px",
                          borderRadius: "4px",
                          background:
                            i <= strength
                              ? strengthColor[strength]
                              : "rgba(255,255,255,0.1)",
                          transition: "background 0.3s",
                        }}
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: strengthColor[strength],
                      margin: 0,
                      fontFamily: "sans-serif",
                    }}
                  >
                    {strengthLabel[strength]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={labelStyle}>Confirm password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{
                    ...inputStyle,
                    paddingRight: "3rem",
                    borderColor:
                      formData.confirmPassword &&
                      formData.password !== formData.confirmPassword
                        ? "rgba(226,75,74,0.5)"
                        : "rgba(255,255,255,0.12)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(127,119,221,0.6)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.12)")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={eyeBtn}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#F09595",
                      margin: "4px 0 0",
                      fontFamily: "sans-serif",
                    }}
                  >
                    Passwords don't match
                  </p>
                )}
            </div>

            {/* Terms */}
            <label
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                cursor: "pointer",
                marginTop: "0.25rem",
              }}
            >
              <input
                type="checkbox"
                required
                style={{
                  marginTop: "3px",
                  accentColor: "#7F77DD",
                  width: "15px",
                  height: "15px",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: "1.5",
                  fontFamily: "sans-serif",
                }}
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  style={{ color: "#7F77DD", textDecoration: "none" }}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  style={{ color: "#7F77DD", textDecoration: "none" }}
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "0.5rem",
                padding: "0.85rem",
                background: loading
                  ? "rgba(83,74,183,0.5)"
                  : "linear-gradient(135deg, #534AB7, #7F77DD)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.3px",
                fontFamily: "sans-serif",
                boxShadow: loading ? "none" : "0 4px 20px rgba(83,74,183,0.4)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
              }}
            >
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              margin: "1.5rem 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(255,255,255,0.08)",
              }}
            />
            <span
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.75rem",
                fontFamily: "sans-serif",
              }}
            >
              or continue with
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(255,255,255,0.08)",
              }}
            />
          </div>

          {/* Google Button */}
          <button
            style={{
              width: "100%",
              padding: "0.8rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.875rem",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              fontFamily: "sans-serif",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.background = "rgba(255,255,255,0.09)")
            }
            onMouseLeave={(e) =>
              (e.target.style.background = "rgba(255,255,255,0.05)")
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
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
            Sign up with Google
          </button>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.2)",
            fontSize: "0.75rem",
            marginTop: "1.5rem",
            fontFamily: "sans-serif",
          }}
        >
          © 2025 BookHaven. All rights reserved.
        </p>
      </div>
    </div>
  );
};

const labelStyle = {
  display: "block",
  color: "rgba(255,255,255,0.6)",
  fontSize: "0.8rem",
  marginBottom: "0.4rem",
  fontWeight: "500",
  fontFamily: "sans-serif",
  letterSpacing: "0.2px",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem 1rem",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
  fontFamily: "sans-serif",
};

const eyeBtn = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  color: "rgba(255,255,255,0.35)",
  cursor: "pointer",
  padding: "4px",
  display: "flex",
  alignItems: "center",
};

export default Signup;
