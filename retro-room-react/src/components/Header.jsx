import { useState, useEffect, useRef } from 'react'; // Adicionado useRef e useEffect
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Header({ isLoggedIn, currentUser, theme, toggleTheme }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null); // Referência para o contentor do menu
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  // Lógica para fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      // Se o clique não foi dentro do dropdownRef, fecha o menu
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    // Adiciona o detetor de cliques no documento
    document.addEventListener("mousedown", handleClickOutside);
    
    // Limpa o detetor quando o componente é destruído
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header>
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
            /* Adicionada a ref={dropdownRef} para controlar a área de clique */
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
                <div className="retro-dropdown">
                  <Link to="/profile" onClick={() => setShowDropdown(false)}>Profile</Link>
                  <Link to="/messages" onClick={() => setShowDropdown(false)}>Messages</Link>
                  <Link to="/notifications" onClick={() => setShowDropdown(false)}>Notifications</Link>
                  <Link to="/invite" onClick={() => setShowDropdown(false)}>Invite friends</Link>
                  <Link to="/settings" onClick={() => setShowDropdown(false)}>Settings</Link>
                  <Link to="/donations" onClick={() => setShowDropdown(false)}>Donations</Link>
                  <Link to="/orders" onClick={() => setShowDropdown(false)}>My orders</Link>
                  <Link to="/rules" onClick={() => setShowDropdown(false)}>Retro Rules</Link>
                  <hr />
                  <button onClick={handleLogout} className="logout-btn">Log out</button>
                </div>
              )}
            </div>
          )}

          <Link to="/messages" className="icon-btn" title="Messages">
            <i className="fa-solid fa-message"></i>
          </Link>
          <Link to="/notifications" className="icon-btn" title="Notifications">
            <i className="fa-solid fa-bell"></i>
          </Link>
          <Link to="/cart" className="icon-btn" title="Cart">
            <i className="fa-solid fa-cart-shopping"></i>
          </Link>
        </div>
      </div>

      <nav className="category-bar">
        <div className="nav-links">
          <Link to="#">MARKET</Link>
          <Link to="/sell">SELL</Link>
          <Link to="#">CONSOLES</Link>
          <Link to="#">GAMES</Link>
          <Link to="#">COLLECTIBLES</Link>
          <Link to="#">ARCADE</Link>
          <Link to="#">COMMUNITY</Link>
          <Link to="#">BLOG</Link>
        </div>

        <div className="theme-switch-container">
          <span>LIGHT MODE / DARK MODE</span>
          <label className="switch">
            <input type="checkbox" checked={theme === 'light'} onChange={toggleTheme} />
            <span className="slider round"></span>
          </label>
        </div>
      </nav>
    </header>
  );
}