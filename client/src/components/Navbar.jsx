import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">
          <span className="brand-logo">🛡️</span> ATS Analyzer
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/" className={isActive("/") ? "active" : ""}>
          Home
        </Link>
        {token && (
          <Link to="/resumes" className={isActive("/resumes") ? "active" : ""}>
            Analyze Resumes
          </Link>
        )}
        <Link to="/contact" className={isActive("/contact") ? "active" : ""}>
          Contact
        </Link>
      </div>
      <div className="nav-auth">
        {token ? (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="login-link">
              Login
            </Link>
            <Link to="/register" className="register-btn">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
