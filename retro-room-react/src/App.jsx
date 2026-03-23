import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

// PAGES
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Messages from './pages/Messages.jsx';
import Sell from './pages/Sell.jsx';
import Login from './pages/Login.jsx';
import Wishlist from './pages/Wishlist.jsx'; // Nova Importação

// COMPONENTS
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Footer from './components/footer.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  
  // ESTADO DE FAVORITOS (Inicia com o que estiver no localStorage ou vazio)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('userWishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(savedUser);
    }
  }, [theme]);

  // Salva favoritos sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem('userWishlist', JSON.stringify(favorites));
  }, [favorites]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // FUNÇÃO PARA ADICIONAR/REMOVER
  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const isFav = prev.find(item => item.id === product.id);
      if (isFav) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  return (
    <Router>
      <div className="app">
        <Header 
          isLoggedIn={isLoggedIn} 
          currentUser={currentUser} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />
        
        <Sidebar />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home favorites={favorites} toggleFavorite={toggleFavorite} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/profile" element={<Profile currentUser={currentUser} />} />
            <Route path="/messages" element={<Messages />} />
            
            {/* ROTA DA WISHLIST */}
            <Route path="/wishlist" element={<Wishlist favorites={favorites} toggleFavorite={toggleFavorite} />} />
            
            <Route path="/notifications" element={<h1>Notifications Page</h1>} />
            <Route path="/cart" element={<h1>Cart Page</h1>} />
            <Route path="/settings" element={<h1>Settings Page</h1>} />
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  );
}