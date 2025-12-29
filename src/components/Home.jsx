import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";  // Import Navbar

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="landing-container">
      <Navbar />  {/* Add Navbar here */}

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <h1>Smart Issue Tracking for Modern Teams</h1>
          <p className="hero-subtitle">
            Streamline your workflow with intelligent issue management. Detect similar issues, track progress, and collaborate seamlessly with your team.
          </p>
          <div className="hero-buttons">
            {user ? (
              <Link to="/dashboard" className="btn-primary large">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn-primary large">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn-secondary large">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <h2>Powerful Features</h2>
        <div className="features-grid">
          {/* ... your existing feature cards ... */}
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Smart Detection</h3>
            <p>Automatically identify duplicate or similar issues as you create them</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Status Workflow</h3>
            <p>Move issues through Open → In Progress → Done states seamlessly</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Priority Levels</h3>
            <p>Organize by Low, Medium, or High priority for better prioritization</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-time Sync</h3>
            <p>Firebase-powered synchronization across all devices instantly</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Team Assignment</h3>
            <p>Assign issues to team members and track responsibility</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Advanced Filtering</h3>
            <p>Filter by status, priority, or combined criteria quickly</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create</h3>
            <p>Write issue details and watch for similar issues detected in real-time</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Track</h3>
            <p>Move issues through your workflow with status transitions and assignments</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Manage</h3>
            <p>Filter and organize your entire issue backlog for maximum clarity</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Transform Your Issue Management?</h2>
        <p>Join teams worldwide using Smart Issue Board to streamline their workflows.</p>
        <Link to="/login" className="btn-primary large">
          Start Free Today
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>Smart Issue Board © 2025. Built for teams that ship fast.</p>
      </footer>
    </div>
  );
}

