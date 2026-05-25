import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { lookupUser } from "../utils/auth.js";
import { DEFAULT_AVATAR_FALLBACK } from "../utils/fallbackImage";
import { resolveAvatar } from "../utils/shared";
import { getUserListings, getSellerStats } from "../utils/userListings";
import { getMockUserProfile, generateAvatar, generateFallbackAvatar } from "../utils/mockUsers";
import { removeMarketListing } from "../utils/marketStorage";
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

  // Generate mock profile data for non-registered users
  const mockProfile = useMemo(() => {
    if (isOwnProfile || !name) return null;
    return getMockUserProfile(name);
  }, [isOwnProfile, name]);

  const registeredUser = !isOwnProfile && name ? lookupUser(name) : null;
  // Merge mock data into profile — mock fills gaps for registered users (bio, country, avatar)
  const profileUser = isOwnProfile
    ? user
    : { ...(mockProfile || {}), ...(registeredUser || {}), username: name, id: name };

  const profileUserId     = getUserId(profileUser) || name || "";
  const activeProfileName = profileUser?.username || name || "User";
  const displayBio        = profileUser?.about   || (isOwnProfile ? "You haven't written a bio yet. Go to Settings to add one." : "This user hasn't written a biography yet.");
  const displayLocation   = profileUser?.country || "Location not set";
  const profilePicSrc     = isOwnProfile
    ? resolveAvatar(profileUser)
    : (profileUser?.avatar || DEFAULT_AVATAR_FALLBACK);
  const fallbackPic       = isOwnProfile ? DEFAULT_AVATAR_FALLBACK : (profileUser?.avatarFallback || DEFAULT_AVATAR_FALLBACK);

  // Listings — mock for other users, real for own
  const userListings = useMemo(() => {
    if (!isOwnProfile && mockProfile?.listings) return mockProfile.listings;
    return getUserListings(activeProfileName);
  }, [activeProfileName, isOwnProfile, mockProfile]);

  const activeListings = userListings.filter(item => item.status !== "sold");
  const soldListings = userListings.filter(item => item.status === "sold");
  const displayListings = showSold ? soldListings : activeListings;

  // Stable mock helper
  const getStableNumber = (str, min, max) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return Math.abs(hash % (max - min + 1)) + min;
  };

  // Stats — mock for other users, boosted for own profile too
  const stats = useMemo(() => {
    if (!isOwnProfile && mockProfile?.stats) return mockProfile.stats;
    const base = getSellerStats(activeProfileName);
    return {
      ...base,
      itemsSold: base.soldItems !== undefined ? base.soldItems : getStableNumber(activeProfileName, 15, 60),
      reviewsCount: base.reviewsCount || getStableNumber(activeProfileName + '_r', 5, 50),
      rating: base.rating || (base.reviewsCount > 0 ? 4.5 : 0),
    };
  }, [activeProfileName, isOwnProfile, mockProfile]);

  // Reviews — per-user mock reviews, fallback for own profile
  const reviews = useMemo(() => {
    if (!isOwnProfile && mockProfile?.reviews) return mockProfile.reviews;
    // Own profile — show some demo reviews
    return [
      { id: 1, name: "RetroCollector",  text: "Great seller, fast shipping and item exactly as described!", gems: 5 },
      { id: 2, name: "GameEnthusiast",   text: "Very professional. Would buy again.", gems: 5 },
      { id: 3, name: "NostalgiaHunter", text: "Item arrived in perfect condition. Recommended!", gems: 5 },
      { id: 4, name: "PixelWizard",     text: "Amazing communication! The controller was even better than the photos.", gems: 5 },
      { id: 5, name: "LevelUp99",       text: "Packaged with care. The console looks brand new. 10/10 experience.", gems: 5 },
      { id: 6, name: "RetroGamer88",    text: "Fair price and quick delivery. Would definitely buy from again.", gems: 4 },
      { id: 7, name: "ClassicCartridge",text: "Shipped internationally and arrived in just 4 days. Impressive!", gems: 5 },
      { id: 8, name: "MarioFanatic",    text: "Exactly what I was looking for. Great condition, honest seller.", gems: 5 },
      { id: 9, name: "DigitalDreamer",  text: "Smooth transaction from start to finish. Highly recommended seller.", gems: 5 },
    ];
  }, [isOwnProfile, mockProfile]);

  // Follower/following counts
  const followersCount = getFollowersCount(profileUserId) || getStableNumber(activeProfileName, 80, 550);
  const followingCount = getFollowingCount(profileUserId) || getStableNumber(activeProfileName + '_f', 30, 230);
  const followingState = !isOwnProfile && isFollowing(profileUserId);

  const getTierClass = () => {
    const { rating, reviewsCount } = stats;
    if (rating >= 4.5 && reviewsCount >= 100)              return "tier-supreme";
    if (rating >= 4.5 && reviewsCount >= 50)               return "tier-master";
    if (rating === 5  && reviewsCount >= 20)               return "tier-platinum";
    if (rating > 3)                                         return "tier-gold";
    if (rating > 1)                                         return "tier-silver";
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
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackPic; }}
        />

        <div className="profile-info">
          <div className="profile-name-row">
            <h1>
              {activeProfileName}
              <i className="fa-solid fa-circle-check verified-badge" title="Verified Profile" />
            </h1>

            <div className="profile-action-btns">
              {!isOwnProfile ? (
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
              ) : null}
            </div>
          </div>

          <div className="profile-meta-info">
            <div className="reviews-group">
              <div className="reviews-diamonds">
                  {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fa-solid fa-gem ${i < Math.round(stats.rating) ? "filled" : "empty"}`} />
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
            {isOwnProfile && (
              <button
                type="button"
                className="btn-follow edit mobile-edit-btn"
                onClick={() => navigate("/settings")}
              >
                <i className="fa-solid fa-gear" style={{ marginRight: 6 }} />
                Edit Profile
              </button>
            )}
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
                src={generateAvatar(reviews[currentSlide].name)}
                className="reviewer-img"
                alt={reviews[currentSlide].name}
                loading="lazy"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = generateFallbackAvatar(reviews[currentSlide].name); }}
              />
              <Link to={`/profile/${encodeURIComponent(reviews[currentSlide].name)}`} className="reviewer-name">{reviews[currentSlide].name}</Link>
              <div className="reviewer-gems">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fa-solid fa-gem ${i < (reviews[currentSlide].gems || 5) ? "filled" : "empty"}`} />
                ))}
              </div>
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
            <ProductCard
              key={item.id}
              item={item}
              isOwner={isOwnProfile}
              onEdit={(id) => navigate(`/sell?edit=${encodeURIComponent(id)}`)}
              onDelete={(id) => {
                if (window.confirm("Delete this listing?")) {
                  removeMarketListing(id);
                  window.location.reload();
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="inventory-empty">
          <i className="fa-solid fa-store" />
          <p>{showSold ? "No sold items yet." : "No listings yet."}</p>
          {isOwnProfile && (
            <button type="button" className="btn-follow" onClick={() => navigate("/sell")}>
              Start Selling
            </button>
          )}
        </div>
      )}
    </div>
  );
}
