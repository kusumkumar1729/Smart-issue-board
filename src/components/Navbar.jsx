import { Link as RouterLink } from "react-router-dom";  // For navigation
import { Link as ScrollLink } from "react-scroll";       // For smooth scroll
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo - smooth scroll to top */}
        <ScrollLink
          to="hero"
          spy={true}
          smooth={true}
          offset={-80}
          duration={800}
          className="navbar-logo"
          style={{ cursor: "pointer" }}
        >
          Smart Issue Board
        </ScrollLink>

        <div className="navbar-links">
          {/* Internal smooth scroll links */}
          <ScrollLink
            to="hero"
            spy={true}
            smooth={true}
            offset={-80}
            duration={800}
            className="nav-link"
            style={{ cursor: "pointer" }}
          >
            Home
          </ScrollLink>
          <ScrollLink
            to="features"
            spy={true}
            smooth={true}
            offset={-80}
            duration={800}
            className="nav-link"
            style={{ cursor: "pointer" }}
          >
            Features
          </ScrollLink>
          <ScrollLink
            to="how-it-works"
            spy={true}
            smooth={true}
            offset={-80}
            duration={800}
            className="nav-link"
            style={{ cursor: "pointer" }}
          >
            How It Works
          </ScrollLink>

          {/* External route links */}
          {user ? (
            <>
              <RouterLink to="/dashboard" className="nav-link" style={{ cursor: "pointer" }}>
                Dashboard
              </RouterLink>
              <button onClick={logout} className="nav-btn logout-btn" style={{ cursor: "pointer" }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <RouterLink to="/login" className="nav-link" style={{ cursor: "pointer" }}>
                Log In
              </RouterLink>
              <RouterLink to="/signup" className="nav-btn primary-btn" style={{ cursor: "pointer" }}>
                Sign Up Free
              </RouterLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}