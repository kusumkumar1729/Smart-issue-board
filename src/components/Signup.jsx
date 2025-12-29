import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setError("");
    setLoading(true);

    try {
      await signup(email, password);
      navigate("/dashboard");
    } catch {
      setError("Failed to create account: Account may already exist");
    }

    setLoading(false);
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Sign up to start tracking issues</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Choose a strong password"
              autoComplete="new-password"
              className="password-input"
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
              autoComplete="new-password"
              className="password-input"
            />
            <span
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >

            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary full-width"
          >
            {loading ? "Creating Account..." : "Sign Up Free"}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="link-btn">
              Log In
            </Link>
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          disabled={loading}
          className="Back"
        >
          Back
        </button>
      </div>
    </div>
  );
}