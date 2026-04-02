import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-ink flex items-center justify-center group-hover:bg-vermillion transition-colors duration-300">
              <span className="text-cream font-display font-bold text-sm">S</span>
            </div>
            <span className="font-display font-bold text-ink text-xl tracking-tight">
              Shop<span className="text-vermillion">Dip</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`font-body text-sm uppercase tracking-widest transition-colors duration-200 ${
                location.pathname === "/" ? "text-vermillion" : "text-ink/60 hover:text-ink"
              }`}
            >
              Products
            </Link>
            {isAuthenticated && (
              <Link
                to="/add-product"
                className={`font-body text-sm uppercase tracking-widest transition-colors duration-200 ${
                  location.pathname === "/add-product" ? "text-vermillion" : "text-ink/60 hover:text-ink"
                }`}
              >
                Add Product
              </Link>
            )}
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-ink flex items-center justify-center">
                    <span className="text-cream text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="font-body text-sm text-ink/70">{user?.name}</span>
                </div>
                <button onClick={handleLogout} className="btn-secondary text-xs py-2 px-4">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-xs py-2 px-4">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-5 flex flex-col gap-1">
              <span className={`h-0.5 bg-ink transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`h-0.5 bg-ink transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`h-0.5 bg-ink transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-ink/10 flex flex-col gap-4">
            <Link to="/" className="font-body text-sm uppercase tracking-widest text-ink/60" onClick={() => setMenuOpen(false)}>Products</Link>
            {isAuthenticated && (
              <Link to="/add-product" className="font-body text-sm uppercase tracking-widest text-ink/60" onClick={() => setMenuOpen(false)}>Add Product</Link>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn-secondary text-xs py-2 px-4 w-fit">Logout</button>
            ) : (
              <Link to="/login" className="btn-primary text-xs py-2 px-4 w-fit" onClick={() => setMenuOpen(false)}>Login</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
