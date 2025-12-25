import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  /* 🎯 Dashboard path by role */
  const dashboardPath =
    {
      Mentor: "/mentor",
      College: "/college",
      Psychologist: "/psychologist",
      Student: "/student",
      Admin: "/college",
    }[user?.role] || "/";

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container nav-inner">
        {/* Logo */}
        <Link to="/" className="logo" onClick={handleLinkClick}>
          AI Dropout
        </Link>

        {/* 🍔 Hamburger */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Navigation */}
        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" end onClick={handleLinkClick}>
            Home
          </NavLink>

          <a href="/#features" onClick={handleLinkClick}>
            Features
          </a>

          <a href="#contact" onClick={handleLinkClick}>
            Contact
          </a>

          {isAuthenticated ? (
            <>
              <NavLink to={dashboardPath} onClick={handleLinkClick}>
                Dashboard
              </NavLink>

              <button
                className="btn btn-outline"
                onClick={handleLogout}
              >
                Logout
              </button>

              <span className="user-chip">
                {user?.role}
              </span>
            </>
          ) : (
            <div className="nav-auth">
              <NavLink
                to="/login"
                className="btn btn-outline"
                onClick={handleLinkClick}
              >
                Login
              </NavLink>

              {/* <NavLink
                to="/signup"
                className="btn"
                onClick={handleLinkClick}
              >
                Sign Up
              </NavLink> */}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
