import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Header.css";

// top header for the admin dashboard
// differentiates clearly between the logged in and logged out states
export default function Header() {
  const { admin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
