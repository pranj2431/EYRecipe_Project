import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("userToken");
    const username = localStorage.getItem("username");
    const userRole = localStorage.getItem("userRole");

    const [menuOpen, setMenuOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("username");
        localStorage.removeItem("userRole");
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                {/* Logo */}
                <Link className="navbar-brand" to="/">🍽 Foodies Hub</Link>

                {/* Navbar Toggle Button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Links */}
                <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>

                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/my-recipes">My Recipes</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/add-recipe">Add Recipe</Link>
                                </li>

                                {/* Admin Panel Access for Admins */}
                                {userRole === "admin" && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/admin">Admin Panel</Link>
                                    </li>
                                )}

                                {/* User Dropdown Menu */}
                                <li className="nav-item dropdown">
                                    <button
                                        className="nav-link btn btn-link text-light dropdown-toggle"
                                        onClick={() => setShowDropdown(!showDropdown)}
                                    >
                                        <FaUserCircle size={22} /> {username || "User"}
                                    </button>
                                    {showDropdown && (
                                        <div className="dropdown-menu show">
                                            {userRole === "admin" && (
                                                <Link to="/admin" className="dropdown-item">
                                                    Admin Panel
                                                </Link>
                                            )}
                                            <button
                                                className="dropdown-item text-danger"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signup">Signup</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin">Admin</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
