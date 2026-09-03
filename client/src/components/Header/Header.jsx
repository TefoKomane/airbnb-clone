import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Icon from "../Icon/Icon.jsx";
import "./Header.css";

// the top header appears on every page of the guest site
// it holds the logo, the location filter and the profile / login section
export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("airbnbTheme") === "dark");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("airbnbTheme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/search?location=${encodeURIComponent(searchValue)}`);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <Link to="/" className="site-header__logo">
          <Icon name="logo" size={28} color="#FF385C" filled />
          <span>airbnb</span>
        </Link>

        <form className="site-header__search" onSubmit={handleSearchSubmit}>
          <Icon name="search" size={16} color="#717171" />
          <input
            type="text"
            placeholder="Search destinations"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            aria-label="Search destinations"
          />
          <button type="submit" className="site-header__search-btn" aria-label="Search">
            <Icon name="search" size={14} color="#fff" />
          </button>
        </form>

        <div className="site-header__profile">
          <button
            className="site-header__theme-btn"
            onClick={() => setDarkMode((enabled) => !enabled)}
            aria-label={darkMode ? "Use light mode" : "Use dark mode"}
          >
            {darkMode ? "Light" : "Dark"}
          </button>
          {!user && (
            <Link to="/login" className="site-header__host-link">
              Become a Host
            </Link>
          )}

          <button
            className="site-header__profile-btn"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <Icon name="menu" size={16} />
            <span className="site-header__avatar">
              {user ? user.username.charAt(0).toUpperCase() : <Icon name="guest" size={18} />}
            </span>
          </button>

          {menuOpen && (
            <div className="site-header__dropdown">
              {user ? (
                <>
                  <p className="site-header__greeting">Hi, {user.username}</p>
                  <Link to="/reservations" onClick={() => setMenuOpen(false)}>
                    View reservations
                  </Link>
                  <button onClick={handleLogout}>Log out</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    Log in
                  </Link>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    Sign up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
