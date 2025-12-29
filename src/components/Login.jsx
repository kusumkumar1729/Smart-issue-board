import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch{
      setError("Failed to log in: Invalid email or password");
    }

    setLoading(false);
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Log in to your account</p>

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
              placeholder="Enter your password"
              autoComplete="current-password"
              className="password-input"
            />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary full-width"
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

       
        <div className="auth-switch">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="link-btn">
              Sign Up Free
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