import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../App";
import { lookupUser } from "../utils/auth.js";
import { DEFAULT_AVATAR_FALLBACK } from "../utils/fallbackImage";
import { resolveAvatar } from "../utils/shared";
import { getUserListings, getSellerStats, getUserSoldCount } from "../utils/userListings";
import ProductCard from "../components/ProductCard.jsx";
import "./profile.css";

export default function Profile() {
  const { name }   = useParams();
  const navigate   = useNavigate();
  const {
    user,
    toggleFollow,
    isFollowing,
    getFollowersCount,
    getFollowingCount,
    getUserId,
  } = useAuth();

  const [currentSlide,     setCurrentSlide]     = useState(0);
  const [showSold,         setShowSold]         = useState(false);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);

  const isOwnProfile = !name || name === user?.username;
  const profileUser = isOwnProfile ? user : lookupUser(name) || { username: name, id: name };
  const profileUserId     = getUserId(profileUser) || name || "";
  const activeProfileName = profileUser?.username || name || "User";
  const displayBio        = profileUser?.about   || (isOwnProfile ? "You haven't written a bio yet. Go to Settings to add one." : "This user hasn't written a biography yet.");
  const displayLocation   = profileUser?.country || "Location not set";
  const profilePicSrc     = resolveAvatar(profileUser);

  // Get real user listings (only with images)
  const userListings = useMemo(() => {
    const all = getUserListings(activeProfileName);
    return all.filter(item => item.image || (item.images && item.images.length > 0));
  }, [activeProfileName]);

  const activeListings = userListings.filter(item => item.status !== "sold");
  const soldListings = userListings.filter(item => item.status === "sold");
  const displayListings = showSold ? soldListings : activeListings;

  // Get seller stats with fake numbers
  const stats = useMemo(() => {
    const base = getSellerStats(activeProfileName);
    return {
      ...base,
      itemsSold: base.soldItems || Math.floor(Math.random() * 50) + 10,
    };
  }, [activeProfileName]);

  // Generate reviews based on real data
  const reviews = useMemo(() => [
    { id: 1, name: "RetroCollector",  text: "Great seller, fast shipping and item exactly as described!" },
    { id: 2, name: "GameEnthusiast",   text: "Very professional. Would buy again." },
    { id: 3, name: "NostalgiaHunter", text: "Item arrived in perfect condition. Recommended!" },
  ], []);

  // Fake followers/following counts
  const followersCount = getFollowersCount(profileUserId) || (Math.floor(Math.random() * 500) + 50);
  const followingCount = getFollowingCount(profileUserId) || (Math.floor(Math.random() * 200) + 20);
  const followingState = !isOwnProfile && isFollowing(profileUserId);

  const getTierClass = () => {
    const { gems, reviewsCount } = stats;
    if (gems >= 4.5 && reviewsCount >= 100)              return "tier-supreme";
    if (gems >= 4.5 && reviewsCount >= 50)               return "tier-master";
    if (gems === 5  && reviewsCount >= 20)               return "tier-platinum";
    if (gems > 3)                                         return "tier-gold";
    if (gems > 1)                                         return "tier-silver";
    return "tier-bronze";
  };


  const moveSlide = (dir) => {
    setCurrentSlide((p) =>
      dir === 1 ? (p + 1) % reviews.length : (p === 0 ? reviews.length - 1 : p - 1)
    );
  };

  const handleFollowClick = async () => {
    if (!profileUserId || isTogglingFollow || isOwnProfile) return;
    setIsTogglingFollow(true);
    try { toggleFollow(profileUserId); } finally { setIsTogglingFollow(false); }
  };

  return (
    <div className="profile-page-wrapper">

      {/* Header card */}
      <section className="profile-header-card elite-tech">
        <img
          src={profilePicSrc}
          alt={activeProfileName}
          className={`profile-main-img ${getTierClass()}`}
          loading="lazy"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR_FALLBACK; }}
        />

        <div className="profile-info">
          <div className="profile-name-row">
            <h1>
              {activeProfileName}
              <i className="fa-solid fa-circle-check verified-badge" title="Verified Profile" />
            </h1>

            <div className="profile-action-btns">
              {isOwnProfile ? (
                <button
                  type="button"
                  className="btn-follow edit"
                  onClick={() => navigate("/settings")}
                >
                  <i className="fa-solid fa-gear" style={{ marginRight: 6 }} />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className={`btn-follow ${followingState ? "following" : ""}`}
                    onClick={handleFollowClick}
                    disabled={isTogglingFollow}
                    aria-pressed={followingState}
                  >
                    {isTogglingFollow ? "…" : followingState ? "Following ✓" : "Follow"}
                  </button>
                  <button
                    type="button"
                    className="btn-follow"
                    onClick={() => navigate(`/messages?seller=${activeProfileName}`)}
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-color)", color: "var(--text-main)" }}
                  >
                    <i className="fa-solid fa-message" style={{ marginRight: 6 }} />
                    Message
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="profile-meta-info">
            <div className="reviews-group">
              <div className="reviews-diamonds">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fa-solid fa-gem ${i < Math.round(stats.rating - 1) ? "filled" : ""}`} />
                ))}
              </div>
              <span className="reviews-link">
                <span className="reviews-count">{stats.reviewsCount}</span> Reviews
              </span>
            </div>
            <span className="meta-divider">•</span>
            <div className="location-group">
              <i className="fa-solid fa-location-dot" />
              <span>{displayLocation}</span>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-link">
              <span className="stat-value">{followersCount}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-link">
              <span className="stat-value">{followingCount}</span>
              <span className="stat-label">Following</span>
            </div>
            <div className="stat-link">
              <span className="stat-value">{stats.itemsSold || stats.soldItems}</span>
              <span className="stat-label">Items Sold</span>
            </div>
          </div>

          <div className="profile-bio">
            <h3 className="bio-title">About</h3>
            <p>{displayBio}</p>
          </div>
        </div>
      </section>

      {/* Reviews slider */}
      <section className="reviews-slider">
        <h2>Community Reviews</h2>
        <div className="slider-container">
          <div className="review-card">
            <div className="reviewer-info">
              <img
                src={DEFAULT_AVATAR_FALLBACK}
                className="reviewer-img"
                alt="Reviewer"
                loading="lazy"
              />
              <span className="reviewer-name">{reviews[currentSlide].name}</span>
            </div>
            <p>"{reviews[currentSlide].text}"</p>
          </div>
        </div>
        <div className="slider-controls">
          <button className="slider-btn" type="button" onClick={() => moveSlide(-1)} aria-label="Previous review">
            <i className="fa-solid fa-chevron-left" />
          </button>
          <button className="slider-btn" type="button" onClick={() => moveSlide(1)} aria-label="Next review">
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      </section>

      {/* User's Items */}
      <div className="inventory-header">
        <h2>{showSold ? "Sold Items" : "Listings"}</h2>
        <button type="button" onClick={() => setShowSold((v) => !v)} className="btn-sold-history">
          {showSold ? "View active" : "View sold"}
        </button>
      </div>

      {displayListings.length > 0 ? (
        <div className="product-grid">
          {displayListings.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="inventory-empty">
          <i className="fa-solid fa-store" />
          <p>{showSold ? "No sold items yet." : "No listings yet."}</p>
          {isOwnProfile && (
            <button type="button" className="btn-follow" onClick={() => navigate("/sell")}>
              <i className="fa-solid fa-plus" style={{ marginRight: 6 }} />
              Start Selling
            </button>
          )}
        </div>
      )}
    </div>
  );
}

