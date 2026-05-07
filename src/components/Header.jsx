import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Header.css";
import "./Menu.css";
import Menu from "./Menu";
import { RETRO_LOGO_FALLBACK, DEFAULT_AVATAR_FALLBACK } from "../utils/fallbackImage";
import logo from "../images/logo.png";
import { readNotifications, unreadNotificationsCount } from "../utils/uiState";

export default function Header({
  isLoggedIn = false,
  currentUser = "",
  currentAvatar = "",
  onLogout,
}) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(() => readNotifications());
  const [unreadCount, setUnreadCount] = useState(() => unreadNotificationsCount());

  useEffect(() => {
    const sync = () => {
      setNotifications(readNotifications());
      setUnreadCount(unreadNotificationsCount());
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) setShowNotifications(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowDropdown(false);
        setShowNotifications(false);
      }
    };

    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogoutClick = () => {
    if (typeof onLogout === "function") onLogout();
    setShowDropdown(false);
    navigate("/login", { replace: true });
  };

  const dropdownLinks = [
    { to: "/profile", label: "Profile", icon: "fa-user" },
    { to: "/messages", label: "Messages", icon: "fa-message" },
    { to: "/notifications", label: "Notifications", icon: "fa-bell" },
    { to: "/my-orders", label: "My Orders", icon: "fa-box" },
    { to: "/invite", label: "Invite Friends", icon: "fa-user-plus" },
    { to: "/settings", label: "Settings", icon: "fa-gear" },
    { to: "/wallet", label: "Wallet", icon: "fa-wallet" },
    { to: "/donations", label: "Donations", icon: "fa-heart" },
    { to: "/retro-rules", label: "Retro Rules", icon: "fa-shield-halved" },
  ];

  return (
    <header className="main-vault-header">
      <div className="header-main">
        <div className="logo">
          <Link to="/" aria-label="Go to home">
            <img
              src={logo}
              className="logopic"
              alt="My Retro Room"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = RETRO_LOGO_FALLBACK;
              }}
            />
          </Link>
        </div>

        <div className="user-menu">
          {!isLoggedIn ? (
            <Link to="/login" className="btn-login-header">LOGIN</Link>
          ) : (
            <div className="profile-container" ref={dropdownRef}>
              <button
                type="button"
                className="profile-chip"
                onClick={() => setShowDropdown((p) => !p)}
                aria-haspopup="menu"
                aria-expanded={showDropdown}
              >
                <img
                  src={currentAvatar || DEFAULT_AVATAR_FALLBACK}
                  className="avatar"
                  alt="Profile"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_AVATAR_FALLBACK;
                  }}
                />
                <span>{currentUser || "Collector"}</span>
                <i className={`fa-solid fa-chevron-down arrow-id ${showDropdown ? "rotate" : ""}`} />
              </button>

              {showDropdown && (
                <div className="retro-dropdown" role="menu">
                  <div className="dropdown-scroll-area">
                    {dropdownLinks.map(({ to, label, icon }) => (
                      <Link key={to} to={to} onClick={() => setShowDropdown(false)} role="menuitem">
                        <i className={`fa-solid ${icon}`} style={{ width: 18, marginRight: 8, opacity: 0.7 }} />
                        {label}
                      </Link>
                    ))}
                  </div>
                  <hr className="divider" />
                  <button type="button" onClick={handleLogoutClick} className="logout-btn" role="menuitem">
                    <i className="fa-solid fa-right-from-bracket" style={{ marginRight: 8 }} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="icon-group">
            <Link to="/messages" className="icon-btn" title="Messages">
              <i className="fa-solid fa-message" />
            </Link>

            <div className="notifications-container" ref={notificationsRef}>
              <button
                type="button"
                className="icon-btn notifications-btn"
                onClick={() => setShowNotifications((p) => !p)}
                aria-haspopup="menu"
                aria-expanded={showNotifications}
                title="Notifications"
              >
                <i className="fa-solid fa-bell" />
                {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
              </button>

              {showNotifications && (
                <div className="notifications-dropdown" role="menu">
                  <div className="dropdown-scroll-area">
                    {notifications.slice(0, 4).map((n) => (
                      <div key={n.id} className="notification-item" role="menuitem">
                        <i className={`fa-solid ${n.icon}`} style={{ color: n.color }} />
                        <div className="notification-content">
                          <p className="notification-message">{n.message}</p>
                          <span className="notification-time">{n.time}</span>
                        </div>
                        {n.unread && <div className="unread-indicator" />}
                      </div>
                    ))}
                  </div>
                  <hr className="divider" />
                  <Link to="/notifications" onClick={() => setShowNotifications(false)} className="see-more-btn">
                    See all notifications
                  </Link>
                </div>
              )}
            </div>

            <Link to="/wishlist" className="icon-btn" title="Wishlist">
              <i className="fa-solid fa-heart" />
             </Link>
          </div>
        </div>
      </div>

      <Menu />
      </header>
  );
}
