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

// COMPONENTS
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Footer from './components/Footer.jsx';

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
            {/* Main Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/sell" element={<Sell />} />
            
            {/* Profile Route with User Data */}
            <Route path="/profile" element={<Profile currentUser={currentUser} />} />
            
            {/* Messages Route (Using the new component) */}
            <Route path="/messages" element={<Messages />} />
            
            {/* Placeholders for future pages */}
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