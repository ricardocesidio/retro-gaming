import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../App";
import { lookupUser } from "../utils/auth.js";
import { DEFAULT_AVATAR_FALLBACK } from "../utils/fallbackImage";
import { useMarketListings } from "../hooks/useMarketListings";
import ProductCard from "../components/ProductCard";
import "./profile.css";

const resolveAvatar = (u) => u?.avatar || u?.profilePic || u?.profileImage || DEFAULT_AVATAR_FALLBACK;

export default function Profile() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { listings } = useMarketListings();
  const {
    user,
    toggleFollow,
    isFollowing,
    getFollowersCount,
    getFollowingCount,
    getUserId,
  } = useAuth();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSold, setShowSold] = useState(false);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);

  const isOwnProfile = !name || name === user?.username;
  const profileUser = isOwnProfile ? user : lookupUser(name) || { username: name, id: name };
  const profileUserId = getUserId(profileUser) || name || "";
  const activeProfileName = profileUser?.username || name || "User";
  const displayBio = profileUser?.about || (isOwnProfile ? "You haven't written a bio yet. Go to Settings to add one." : "This user hasn't written a biography yet.");
  const displayLocation = profileUser?.country || "Location not set";
  const profilePicSrc = resolveAvatar(profileUser);

  const userListings = useMemo(() => {
    const target = String(profileUser?.username || "").toLowerCase();
    return (listings || []).filter((item) => String(item?.seller || "").toLowerCase().includes(target));
  }, [listings, profileUser?.username]);

  const activeListings = showSold ? userListings.filter((item) => String(item.status).toLowerCase() === "sold") : userListings.filter((item) => String(item.status).toLowerCase() !== "sold");

  const stats = useMemo(() => ({
    gems: Math.min(5, Math.max(1, Math.round((userListings.length || 1) / 2))),
    reviewsCount: Math.max(12, userListings.length * 8 + 21),
  }), [userListings.length]);

  const reviews = useMemo(() => ([
    { id: 1, name: "John Gamer", text: "Flawless product, arrived before the deadline!" },
    { id: 2, name: "Ana Retro", text: "Very attentive seller, I recommend to everyone." },
    { id: 3, name: "Carlos Tech", text: "Excellent condition, looks like new." },
  ]), []);

  const followersCount = getFollowersCount(profileUserId);
  const followingCount = getFollowingCount(profileUserId);
  const followingState = !isOwnProfile && isFollowing(profileUserId);

  const moveSlide = (dir) => {
    setCurrentSlide((p) => dir === 1 ? (p + 1) % reviews.length : (p === 0 ? reviews.length - 1 : p - 1));
  };

  useEffect(() => {
    setCurrentSlide(0);
  }, [name]);

  const handleFollowClick = async () => {
    if (!profileUserId || isTogglingFollow || isOwnProfile) return;
    setIsTogglingFollow(true);
    try { toggleFollow(profileUserId); } finally { setIsTogglingFollow(false); }
  };

  return (
    <div className="profile-page-wrapper">
      <section className="profile-header-card">
        <img
          src={profilePicSrc}
          alt={activeProfileName}
          className="profile-main-img"
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
                <button type="button" className="btn-follow edit" onClick={() => navigate("/settings")}>
                  <i className="fa-solid fa-gear" /> Edit Profile
                </button>
              ) : (
                <>
                  <button type="button" className={`btn-follow ${followingState ? "following" : ""}`} onClick={handleFollowClick} disabled={isTogglingFollow} aria-pressed={followingState}>
                    {isTogglingFollow ? "…" : followingState ? "Following ✓" : "Follow"}
                  </button>
                  <button type="button" className="btn-follow ghost" onClick={() => navigate(`/messages?seller=${activeProfileName}`)}>
                    <i className="fa-solid fa-message" /> Message
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="profile-meta-info">
            <div className="reviews-group">
              <div className="reviews-diamonds">
                {[...Array(5)].map((_, i) => <i key={i} className={`fa-solid fa-gem ${i < stats.gems ? "filled" : ""}`} />)}
              </div>
              <span className="reviews-link"><span className="reviews-count">{stats.reviewsCount}</span> Reviews</span>
            </div>
            <span className="meta-divider">•</span>
            <div className="location-group">
              <i className="fa-solid fa-location-dot" />
              <span>{displayLocation}</span>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-link"><span className="stat-value">{followersCount}</span><span className="stat-label">Followers</span></div>
            <div className="stat-link"><span className="stat-value">{followingCount}</span><span className="stat-label">Following</span></div>
            <div className="stat-link"><span className="stat-value">{userListings.length}</span><span className="stat-label">Listings</span></div>
          </div>

          <div className="profile-bio">
            <h3 className="bio-title">About</h3>
            <p>{displayBio}</p>
          </div>
        </div>
      </section>

      <section className="reviews-slider">
        <h2>Community Reviews</h2>
        <div className="slider-container">
          <div className="review-card">
            <div className="reviewer-info">
              <img src={DEFAULT_AVATAR_FALLBACK} className="reviewer-img" alt="Reviewer" loading="lazy" />
              <span className="reviewer-name">{reviews[currentSlide].name}</span>
            </div>
            <p>"{reviews[currentSlide].text}"</p>
          </div>
        </div>
        <div className="slider-controls">
          <button className="slider-btn" type="button" onClick={() => moveSlide(-1)} aria-label="Previous review"><i className="fa-solid fa-chevron-left" /></button>
          <button className="slider-btn" type="button" onClick={() => moveSlide(1)} aria-label="Next review"><i className="fa-solid fa-chevron-right" /></button>
        </div>
      </section>

      <div className="inventory-header">
        <h2>{isOwnProfile ? "Your Listings" : `${activeProfileName}'s Listings`}</h2>
        <button type="button" onClick={() => setShowSold((v) => !v)} className="btn-sold-history">
          {showSold ? "View active" : "View sold"}
        </button>
      </div>

      {activeListings.length > 0 ? (
        <div className="product-grid profile-grid">
          {activeListings.map((item) => <ProductCard key={item.id} item={item} variant="market" />)}
        </div>
      ) : (
        <div className="inventory-empty">
          <i className="fa-solid fa-store" />
          <p>No listings yet.</p>
          {isOwnProfile && (
            <button type="button" className="btn-follow" onClick={() => navigate("/sell") }>
              <i className="fa-solid fa-plus" /> Start Selling
            </button>
          )}
        </div>
      )}

      <section className="reviews-slider">
        <h2>Highlights</h2>
        <div className="slider-container highlights-grid">
          <div className="review-card"><h4>Fast responses</h4><p>Replies quickly and keeps buyers updated.</p></div>
          <div className="review-card"><h4>Trusted packaging</h4><p>Careful protection for vintage hardware and collectibles.</p></div>
          <div className="review-card"><h4>Open to offers</h4><p>Negotiation-friendly listings with clear item details.</p></div>
        </div>
      </section>
    </div>
  );
}
