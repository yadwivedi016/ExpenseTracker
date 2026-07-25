import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../api";
import "../Styles/Navbar.css";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      API.get("/profile/", { withCredentials: true })
        .then((response) => setUser(response.data.user))
        .catch(() => {
          setUser(null);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        });
    } else {
      setUser(null);
    }
  }, [isAuthenticated, setIsAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`navbar-header ${scrolled ? "navbar-scrolled" : ""}`}>
      <nav className="navbar">
        <h2>
          <Link to="/" className="brand-link">
            <span className="brand-mark">E</span>
            <span className="brand-word">
              Expense<span className="brand-accent">Tracker</span>
            </span>
          </Link>
        </h2>

        <div className="nav-links">
          {isAuthenticated && user ? (
            <>
              <Link
                to="/dashboard"
                className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                Dashboard
              </Link>

              <Link
                to="/profile"
                className={`profile-icon-badge ${isActive("/profile") ? "active-profile" : ""}`}
                title={`Logged in as ${user.first_name || user.username}`}
              >
                {user.first_name ? user.first_name.charAt(0).toUpperCase() : "U"}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`nav-item ${isActive("/login") ? "active" : ""}`}
              >
                Login
              </Link>

              <Link className="register-btn" to="/register">
                <span>Register</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;