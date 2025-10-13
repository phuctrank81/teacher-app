import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 import navigate hook
import { supabase } from "../supabaseClient";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate(); // 👈 tạo navigate
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      data,
      email,
      password,
    });

    if (error) {
      setErrors({ form: error.message });
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate("/student-manager"); // 👈 chuyển trang
      }, 1500);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/student-manager`, // 👈 chuyển về StudentManager
      },
    });
    if (error) alert(error.message);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        {!success ? (
          <form className="login-form" onSubmit={handleEmailLogin}>
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label>Email Address</label>
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <div className="input-wrapper password-wrapper">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label>Password</label>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {errors.form && <p className="error-message">{errors.form}</p>}

            <button type="submit" className="login-btn btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <h3>Login Successful!</h3>
            <p>Redirecting to Student Manager...</p>
          </div>
        )}

        <div className="divider"><span>or continue with</span></div>

        <div className="social-login">
          <button type="button" className="social-btn google-btn" onClick={handleGoogleLogin}>
            <span className="social-icon google-icon"></span> Google
          </button>
          <button type="button" className="social-btn github-btn" disabled>
            <span className="social-icon github-icon"></span> GitHub (coming soon)
          </button>
        </div>
      </div>
    </div>
  );
}
