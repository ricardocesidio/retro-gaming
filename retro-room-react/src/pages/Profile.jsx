import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../pages/profile.css'; 


export default function Profile({ currentUser }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showSold, setShowSold] = useState(false);

  // --- CONFIGURATION DATA ---
  const stats = {
    gems: 5,           // Change this to test (e.g., 1, 3, 4.5, 5)
    reviewsCount: 105  // Change this to test (e.g., 10, 30, 60, 150)
  };

  // --- TIER LOGIC ENGINE ---
  const getTierClass = () => {
    const { gems, reviewsCount } = stats;

    // 1. SUPREME (4.5+ gems AND 100+ reviews)
    if (gems >= 4.5 && reviewsCount >= 100) return "tier-supreme";

    // 2. MASTER (4.5+ gems AND 50-99 reviews)
    if (gems >= 4.5 && reviewsCount >= 50 && reviewsCount <= 99) return "tier-master";

    // 3. PLATINUM (5 gems AND 20-49 reviews)
    if (gems === 5 && reviewsCount >= 20 && reviewsCount <= 49) return "tier-platinum";

    // 4. GOLD (Up to 4.5 or 5 gems)
    if (gems > 3) return "tier-gold";

    // 5. SILVER (Up to 3 gems)
    if (gems > 1) return "tier-silver";

    // 6. BRONZE (Up to 1 gem)
    return "tier-bronze";
  };

  const reviews = [
    { id: 1, name: "John Gamer", text: "Flawless product, arrived before the deadline!", img: "/images/imgreview.avif" },
    { id: 2, name: "Ana Retro", text: "Very attentive seller, I recommend to everyone.", img: "/images/imgreview1.jpg" },
    { id: 3, name: "Carlos Tech", text: "Excellent condition, looks like new.", img: "/images/imgreview.avif" }
  ];

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
      <section className="profile-header-card">
        {/* DYNAMIC TIER CLASS APPLIED HERE */}
        <img 
          src="/images/profilepic.jpg" 
          alt={currentUser} 
          className={`profile-main-img ${getTierClass()}`} 
          id="displayAvatar" 
        />
        
        <div className="profile-info">
          
          <h1>
            <span id="displayUsername">{currentUser || "User"}</span>
            <i className="fa-solid fa-circle-check verified-badge" title="Verified Profile"></i><div style={{ marginLeft: 'auto' }}>
          <button className="btn-follow" id="actionBtn">Follow User</button>
        </div>
            
          </h1> 
           
          
          {/* BLOCO ATUALIZADO: TUDO NA MESMA LINHA E SEM PARENTESES */}
          <div className="profile-meta-info">
            <div className="reviews-group">
              <div className="reviews-diamonds">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fa-solid fa-gem ${i < stats.gems ? 'filled' : ''}`}></i>
                ))}
              </div>
              <Link to="/reviews" className="reviews-link" id="reviewScoreText">
                <span className="reviews-count">{stats.reviewsCount}</span> Reviews
              </Link>
            </div>
            
            <span className="meta-divider">•</span>

            <div className="location-group">
              <i className="fa-solid fa-location-dot"></i> 
              <span id="displayLocation">Location not defined</span>
            </div>
          </div>

          <div className="profile-stats">
            <Link to="/followers" className="stat-link">
              <span className="stat-value">1.2k</span>
              <span className="stat-label">Followers</span>
            </Link>
            <Link to="/following" className="stat-link">
              <span className="stat-value">850</span>
              <span className="stat-label">Following</span>
            </Link>
            <div className="stat-link">
              <span className="stat-value">42</span>
              <span className="stat-label">Items Sold</span>
            </div>
          </div>

          <br />

          <div className="profile-bio">
            <h3 className="bio-title">About Me</h3>
            <p id="displayAbout">This user hasn't written a biography yet...</p>
          </div>
        </div>

       
      </section>

      <section className="reviews-slider">
        <h2>Community Reviews</h2>
        <div className="slider-container">
          <div className="review-card" style={{ display: 'block' }}>
            <div className="reviewer-info">
              <img src={reviews[currentSlide].img} className="reviewer-img" alt="Reviewer" />
              <Link to={`/profile/${reviews[currentSlide].name}`} className="reviewer-name">
                {reviews[currentSlide].name}
              </Link>
            </div>
            <p>"{reviews[currentSlide].text}"</p>
          </div>
        </div>
        <div className="slider-controls">
          <button className="slider-btn" onClick={() => moveSlide(-1)}><i className="fa-solid fa-chevron-left"></i></button>
          <button className="slider-btn" onClick={() => setIsPaused(!isPaused)}><i className={`fa-solid ${isPaused ? 'fa-play' : 'fa-pause'}`}></i></button>
          <button className="slider-btn" onClick={() => moveSlide(1)}><i className="fa-solid fa-chevron-right"></i></button>
        </div>
      </section>

      <div className="inventory-header">
        <h2>My List</h2>
        <button onClick={() => setShowSold(!showSold)} className="btn-sold-history" style={{ display: 'block' }}>
          {showSold ? "View active listings" : "View sold items"}
        </button>
      </div>

      <div className="product-grid">
         <div className="product-card">
           <p style={{color: '#888', padding: '20px'}}>Loading content...</p>
         </div>
      </div>
    </div>
  );
}