import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';


export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Referência para detectar clique fora
  const navigate = useNavigate();

  // 1. Carregar dados do usuário ao montar o componente
  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem('registeredUser');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Erro ao ler usuário do localStorage", error);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    // Listener para atualizar se o usuário deslogar/logar em outra aba
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  // 2. Fechar dropdown ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('registeredUser');
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <i className="fa-solid fa-box-archive"></i> RETRO<span>ROOM</span>
        </Link>

        <div className="nav-menu">
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/sell" className="nav-sell-btn">Sell Item</Link>
        </div>

        <div className="nav-auth-section">
          {user ? (
            <div className="user-dropdown-wrapper" ref={dropdownRef}>
              {/* Gatilho do Dropdown - Mostra apenas o USERNAME */}
              <button 
                className={`dropdown-trigger ${isDropdownOpen ? 'active' : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="user-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="user-name-text">{user.username}</span>
                <i className={`fa-solid fa-chevron-down arrow-icon ${isDropdownOpen ? 'rotate' : ''}`}></i>
              </button>

              {/* Menu Dropdown */}
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
                      <Link to="/my-collections" onClick={() => setIsDropdownOpen(false)}>
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
                      <button onClick={handleLogout} className="logout-button">
                        <i className="fa-solid fa-right-from-bracket"></i> Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-link">Login</Link>
              <Link to="/register" className="register-btn">Join Now</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}