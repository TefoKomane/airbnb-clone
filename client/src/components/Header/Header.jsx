import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Icon from "../Icon/Icon.jsx";
import "./Header.css";

// the top header appears on every page of the guest site
// it holds the logo, the location filter and the profile / login section
export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
