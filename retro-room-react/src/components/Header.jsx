import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Header.css';


export default function Header({ isLoggedIn, currentUser, theme, toggleTheme }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  
  const dropdownRef = useRef(null); 
  const notifRef = useRef(null); 
  const navigate = useNavigate();
  const location = useLocation(); // Hook para saber em que página estamos

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  // Fechar menus ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="main-header-container">
      <div className="header-main">
        <div className="logo">
          <Link to="/">
            <img src="/images/logo-removebg-preview.png" className="logopic" alt="My Retro Room" />
          </Link>
        </div>

        <div className="user-menu">
          {!isLoggedIn ? (
            <Link to="/login">
              <button className="btn-login-header">LOGIN</button>
            </Link>
          ) : (
            <div className="profile-container is-visible" ref={dropdownRef} style={{ position: 'relative' }}>
              <div 
                className="profile-chip" 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ cursor: 'pointer' }}
              >
                <img src="/images/profilepic.jpg" className="avatar" alt="User" />
                <span id="userName">{currentUser}</span>
                <i className={`fa-solid fa-chevron-down arrow-id ${showDropdown ? 'rotate' : ''}`}></i>
              </div>

              {showDropdown && (
                <div className="retro-dropdown profile-menu">
                  <Link to="/profile" onClick={() => setShowDropdown(false)}>Profile</Link>
                  <Link to="/messages" onClick={() => setShowDropdown(false)}>Messages</Link>
                  <Link to="/notifications" onClick={() => setShowDropdown(false)}>Notifications</Link>
                  <Link to="/invite" onClick={() => setShowDropdown(false)}>Invite friends</Link>
                  <Link to="/settings" onClick={() => setShowDropdown(false)}>Settings</Link>
                  <Link to="/donations" onClick={() => setShowDropdown(false)}>Donations</Link>
                  <Link to="/orders" onClick={() => setShowDropdown(false)}>My orders</Link>
                  <Link to="/rules" onClick={() => setShowDropdown(false)}>Retro Rules</Link>
                  <button onClick={handleLogout} className="logout-btn">Log out</button>
                </div>
              )}
            </div>
          )}

          {/* 1. NOTIFICAÇÕES (PRIMEIRO) */}
          <div className="icon-wrapper" ref={notifRef} style={{ position: 'relative' }}>
            <button 
              className={`icon-btn ${location.pathname === '/notifications' || showNotifDropdown ? 'active' : ''}`}
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              title="Notifications"
            >
              <i className="fa-solid fa-bell"></i>
            </button>

            {showNotifDropdown && (
              <div className="retro-dropdown notif-dropdown">
  <div className="notif-header">Recent Activity</div>
  
  <div className="notif-list">
    {/* Item 1 - Favorito (Roxo) */}
    <div className="notif-item">
      <i className="fa-solid fa-heart fav-icon"></i>
      <span><strong>MariaGamer</strong> favorited your item.</span>
    </div>

    {/* Item 2 - Seguidor (Verde) */}
    <div className="notif-item">
      <i className="fa-solid fa-user-plus follow-icon"></i>
      <span><strong>RetroKing</strong> is following you.</span>
    </div>

    {/* Item 3 - Comentário (Azul) */}
    <div className="notif-item">
      <i className="fa-solid fa-comment comment-icon"></i>
      <span><strong>PixelArt</strong> commented on your post.</span>
    </div>

    {/* Item 4 - Venda/Oferta (Amarelo) */}
    <div className="notif-item">
      <i className="fa-solid fa-tag offer-icon"></i>
      <span>New offer from <strong>Collector99</strong>.</span>
    </div>

    {/* Item 5 - Sistema (Ciano) */}
    <div className="notif-item">
      <i className="fa-solid fa-circle-info info-icon"></i>
      <span>Your listing was approved!</span>
    </div>

    {/* Item 6 - Alerta (Laranja) */}
    <div className="notif-item">
      <i className="fa-solid fa-triangle-exclamation alert-icon"></i>
      <span>Complete your profile to sell faster.</span>
    </div>
  </div>

  <Link to="/notifications" className="read-all-link" onClick={() => setShowNotifDropdown(false)}>
    Read all
  </Link>
              </div>
            )}
          </div>

          {/* 2. MENSAGENS (SEGUNDO) */}
          <Link 
            to="/messages" 
            className={`icon-btn ${location.pathname === '/messages' ? 'active' : ''}`} 
            title="Messages"
          >
            <i className="fa-solid fa-message"></i>
          </Link>

          {/* 3. FAVORITOS (TERCEIRO) */}
          <Link 
            to="/Wishlist" 
            className={`icon-btn ${location.pathname === '/favorites' ? 'active' : ''}`} 
            title="My Favorites"
          >
            <i className="fa-solid fa-heart"></i>
          </Link>
        </div>
      </div>

      <nav className="category-bar">
        <div className="nav-links">
          <Link to="./Home">MARKET</Link>
          <Link to="/sell">SELL</Link>
          <Link to="#">CONSOLES</Link>
          <Link to="#">GAMES</Link>
          <Link to="#">COLLECTIBLES</Link>
          <Link to="#">ARCADE</Link>
          <Link to="/Wishlist">Wishlist</Link>
          <Link to="/blog">BLOG</Link>
        </div>

        <div className="theme-switch-container">
          <span>LIGHT / DARK</span>
          <label className="switch">
            <input type="checkbox" checked={theme === 'light'} onChange={toggleTheme} />
            <span className="slider round"></span>
          </label>
        </div>
      </nav>
    </header>
  );
}