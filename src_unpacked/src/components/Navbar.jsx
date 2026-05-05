import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const syncUser = () => {
      try {
        const savedUser = sessionStorage.getItem("activeSession");
        setUser(savedUser ? JSON.parse(savedUser) : null);
      } catch (error) {
        console.error("Erro ao ler usuário do sessionStorage:", error);
        setUser(null);
      }
    };

    syncUser();
    window.addEventListener("authChange", syncUser);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("authChange", syncUser);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("activeSession");
    setUser(null);
    setIsDropdownOpen(false);
    window.dispatchEvent(new Event("authChange"));
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <i className="fa-solid fa-box-archive"></i> RETRO<span>ROOM</span>
        </Link>

        <div className="nav-menu">
          <Link to="/market">Marketplace</Link>
          <Link to="/sell" className="nav-sell-btn">Sell Item</Link>
        </div>

        <div className="nav-auth-section">
          {user ? (
            <div className="user-dropdown-wrapper" ref={dropdownRef}>
              <button
                className={`dropdown-trigger ${isDropdownOpen ? "active" : ""}`}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                type="button"
              >
                <div className="user-avatar">
                  {String(user.username || "U").charAt(0).toUpperCase()}
                </div>
                <span className="user-name-text">{user.username}</span>
                <i className={`fa-solid fa-chevron-down arrow-icon ${isDropdownOpen ? "rotate" : ""}`}></i>
              </button>

              {isDropdownOpen && (
                <div className="dropdown-content">
                  <div className="dropdown-header">
                    <p className="header-name">{user.username}</p>
                    <p className="header-email">{user.email}</p>
                  </div>
                  <ul className="dropdown-links">
                    <li>
                      <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
                        <i className="fa-solid fa-user-gear"></i> My Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/wishlist" onClick={() => setIsDropdownOpen(false)}>
                        <i className="fa-solid fa-layer-group"></i> My Collections
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings" onClick={() => setIsDropdownOpen(false)}>
                        <i className="fa-solid fa-sliders"></i> Settings
                      </Link>
                    </li>
                    <li className="dropdown-divider"></li>
                    <li>
                      <button onClick={handleLogout} className="logout-button" type="button">
                        <i className="fa-solid fa-right-from-bracket"></i> Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-link">
                Login
              </Link>
              <Link to="/register" className="register-btn">
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
