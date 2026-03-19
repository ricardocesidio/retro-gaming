import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Header from '../../retro-room-react/src/components/Header.js';
import Sidebar from '../../retro-room-react/src/components/Sidebar.jsx';
import Footer from '../../retro-room-react/src/components/Footer.js';
import Home from '../../retro-room-react/src/pages/Home.jsx';
import Sell from '../../retro-room-react/src/pages/Sell.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(savedUser);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
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
            <Route path="/" element={<Home />} />
            <Route path="/sell" element={<Sell />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  );
}
