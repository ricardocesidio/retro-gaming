import { Link } from 'react-router-dom'; // OBRIGATÓRIO

export default function Header({ isLoggedIn, currentUser, theme, toggleTheme }) {
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
            <div className="profile-container is-visible">
              <div className="profile-chip" id="profileTrigger">
                <img src="/images/profilepic.jpg" className="avatar" alt="User" />
                <span id="userName">{currentUser}</span>
                <i className="fa-solid fa-chevron-down arrow-id"></i>
              </div>
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