import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Header.css";

// top header for the admin dashboard
// differentiates clearly between the logged in and logged out states
export default function Header() {
  const { admin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("airbnbAdminTheme") === "dark");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("airbnbAdminTheme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { to: "/reservations", label: "View Reservations" },
    { to: "/listings", label: "View Listings" },
    { to: "/listings/new", label: "Create Listing" },
  ];

  return (
    <header className="admin-header">
      <div className="admin-header__top container">
        <Link to={admin ? "/listings" : "/login"} className="admin-header__logo">
          <img src="/airbnb-logo.jfif" alt="Airbnb" />
          <span>airbnb</span>
        </Link>

        <div className="admin-header__right">
          <button
            className="admin-header__theme-btn"
            onClick={() => setDarkMode((enabled) => !enabled)}
            aria-label={darkMode ? "Use light mode" : "Use dark mode"}
          >
            {darkMode ? "Light" : "Dark"}
          </button>
          {admin ? (
            <>
              <span className="admin-header__greeting">{admin.username}</span>
              <div className="admin-header__profile">
                <button
                  className="admin-header__profile-btn"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                >
                  <span className="admin-header__avatar">
                    {admin.username.charAt(0).toUpperCase()}
                  </span>
                </button>
                {menuOpen && (
                  <div className="admin-header__dropdown">
                    <Link to="/reservations" onClick={() => setMenuOpen(false)}>
                      View reservations
                    </Link>
                    <button onClick={handleLogout}>Log out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="admin-header__become-host">
              Become a Host
            </Link>
          )}
        </div>
      </div>

      {admin && (
        <nav className="admin-header__nav container">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`admin-header__nav-link ${
                location.pathname === link.to ? "admin-header__nav-link--active" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
