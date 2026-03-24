import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../pages/profile.css'; 


// IMPORTANTE: Certifica-te que o ProductCard.jsx existe em src/components/
import ProductCard from '../components/ProductCard';

export default function Profile({ currentUser }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showSold, setShowSold] = useState(false);

  // --- MOCK DATA PARA PRODUTOS ---
  const myItems = [
    { id: 1, name: "Super Nintendo + Mario World", price: "120.00", image: "https://placehold.co/300x200/222/00d4ff?text=SNES", status: "active" },
    { id: 2, name: "GameBoy Color Purple", price: "85.00", image: "https://placehold.co/300x200/222/9d50bb?text=GameBoy", status: "active" },
    { id: 3, name: "Zelda: Ocarina of Time (Boxed)", price: "250.00", image: "https://placehold.co/300x200/222/ffcc00?text=Zelda+N64", status: "sold" }
  ];

  // --- CONFIGURATION DATA (ESTATÍSTICAS) ---
  const stats = {
    gems: 5,           
    reviewsCount: 105  
  };

  // --- TIER LOGIC ENGINE ---
  const getTierClass = () => {
    const { gems, reviewsCount } = stats;
    if (gems >= 4.5 && reviewsCount >= 100) return "tier-supreme";
    if (gems >= 4.5 && reviewsCount >= 50 && reviewsCount <= 99) return "tier-master";
    if (gems === 5 && reviewsCount >= 20 && reviewsCount <= 49) return "tier-platinum";
    if (gems > 3) return "tier-gold";
    if (gems > 1) return "tier-silver";
    return "tier-bronze";
  };

  // --- REVIEWS DATA ---
  const reviews = [
    { id: 1, name: "John Gamer", text: "Flawless product, arrived before the deadline!", img: "https://placehold.co/100/222/fff?text=User1" },
    { id: 2, name: "Ana Retro", text: "Very attentive seller, I recommend to everyone.", img: "https://placehold.co/100/222/fff?text=User2" },
    { id: 3, name: "Carlos Tech", text: "Excellent condition, looks like new.", img: "https://placehold.co/100/222/fff?text=User3" }
  ];

  // --- SLIDER LOGIC ---
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % reviews.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused, reviews.length]);

  const moveSlide = (direction) => {
    if (direction === 1) {
      setCurrentSlide((prev) => (prev + 1) % reviews.length);
    } else {
      setCurrentSlide((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
    }
  };

  return (
    <div className="profile-page-wrapper">
      {/* HEADER DO PERFIL */}
      <section className="profile-header-card">
        <img 
          src="/images/profilepic.jpg" 
          alt={currentUser} 
          className={`profile-main-img ${getTierClass()}`} 
          id="displayAvatar" 
        />
        
        <div className="profile-info">
          <h1>
            <span id="displayUsername">{currentUser || "User"}</span>
            <i className="fa-solid fa-circle-check verified-badge" title="Verified Profile"></i>
            <div style={{ marginLeft: 'auto' }}>
              <button className="btn-follow" id="actionBtn">Follow User</button>
            </div>
          </h1> 
          
          <div className="profile-meta-info">
            <div className="reviews-group">
              <div className="reviews-diamonds">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fa-solid fa-gem ${i < stats.gems ? 'filled' : ''}`}></i>
                ))}
              </div>
              <Link to="/reviews" className="reviews-link">
                <span className="reviews-count">{stats.reviewsCount}</span> Reviews
              </Link>
            </div>
            
            <span className="meta-divider">•</span>

            <div className="location-group">
              <i className="fa-solid fa-location-dot"></i> 
              <span id="displayLocation">Porto, Portugal</span>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-link">
              <span className="stat-value">1.2k</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-link">
              <span className="stat-value">850</span>
              <span className="stat-label">Following</span>
            </div>
            <div className="stat-link">
              <span className="stat-value">42</span>
              <span className="stat-label">Items Sold</span>
            </div>
          </div>

          <div className="profile-bio">
            <h3 className="bio-title">About Me</h3>
            <p>Especialista em consolas Nintendo e jogos raros dos anos 90.</p>
          </div>
        </div>
      </section>

      {/* SLIDER DE REVIEWS */}
      <section className="reviews-slider">
        <h2>Community Reviews</h2>
        <div className="slider-container">
          <div className="review-card">
            <div className="reviewer-info">
              <img src={reviews[currentSlide].img} className="reviewer-img" alt="Reviewer" />
              <span className="reviewer-name">{reviews[currentSlide].name}</span>
            </div>
            <p>"{reviews[currentSlide].text}"</p>
          </div>
        </div>
        <div className="slider-controls">
          <button className="slider-btn" onClick={() => moveSlide(-1)}><i className="fa-solid fa-chevron-left"></i></button>
          <button className="slider-btn" onClick={() => setIsPaused(!isPaused)}>
            <i className={`fa-solid ${isPaused ? 'fa-play' : 'fa-pause'}`}></i>
          </button>
          <button className="slider-btn" onClick={() => moveSlide(1)}><i className="fa-solid fa-chevron-right"></i></button>
        </div>
      </section>

      {/* GRID DE INVENTÁRIO (DEV-10) */}
      <div className="inventory-header">
        <h2>My List</h2>
        <button onClick={() => setShowSold(!showSold)} className="btn-sold-history">
          {showSold ? "View active listings" : "View sold items"}
        </button>
      </div>

      <div className="product-grid">
        {myItems
          .filter(item => showSold ? item.status === 'sold' : item.status === 'active')
          .map(item => (
            <ProductCard key={item.id} item={item} />
          ))
        }
      </div>
    </div>
  );
}