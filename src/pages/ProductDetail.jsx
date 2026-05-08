import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { normalizeProduct } from "../utils/normalizeProduct";
import { useMarketListings } from "../hooks/useMarketListings";
import { addRecentlyViewed } from "../utils/uiState";
import {
  MARKET_PLACEHOLDER_FALLBACK,
  DEFAULT_AVATAR_FALLBACK,
} from "../utils/fallbackImage";
import "./ProductDetail.css";

const PLACEHOLDER = MARKET_PLACEHOLDER_FALLBACK;

// Demo mock — rating and deal count are hardcoded for a polished demo look
const DEMO_SELLER_RATING = "⭐ 4.9 · 120 deals";

const readFromWishlist = (id) => {
  try {
    const raw = localStorage.getItem("marketplaceWishlist");
    const items = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(items)) return null;
    return items.find((item) => String(item?.id) === String(id)) || null;
  } catch {
    return null;
  }
};

const resolveSellerAvatar = (listing) =>
  listing?.sellerAvatar ||
  listing?.avatar ||
  listing?.profilePic ||
  DEFAULT_AVATAR_FALLBACK;

const normalizeImagesArray = (product) => {
  const rawImages = [];

  if (Array.isArray(product?.images)) rawImages.push(...product.images);
  if (product?.image) rawImages.push(product.image);
  if (product?.mainImage) rawImages.push(product.mainImage);

  return Array.from(
    new Set(
      rawImages
        .filter(Boolean)
        .map((img) => String(img).trim())
        .filter(Boolean)
    )
  );
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(PLACEHOLDER);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyConfirmed, setBuyConfirmed] = useState(false);
  const [activeShippingTab, setActiveShippingTab] = useState('shipping');
  const { listings } = useMarketListings();

  useEffect(() => {
    setLoading(true);

    const foundRaw = Array.isArray(listings)
      ? listings.find((ad) => String(ad.id) === String(id))
      : null;

    const fallbackRaw = foundRaw || readFromWishlist(id);

    if (fallbackRaw) {
      const normalized = normalizeProduct(fallbackRaw);
      const normalizedImages = normalizeImagesArray(normalized);

      const nextProduct = {
        ...normalized,
        images: normalizedImages,
        image: normalizedImages[0] || normalized.image || PLACEHOLDER,
      };

      setProduct(nextProduct);
      setMainImage(normalizedImages[0] || normalized.image || PLACEHOLDER);
      addRecentlyViewed(nextProduct);
    } else {
      setProduct(null);
      setMainImage(PLACEHOLDER);
    }

    setLoading(false);
  }, [id, listings]);

  const imageList = useMemo(() => {
    if (!product) return [];

    const normalizedImages = normalizeImagesArray(product);
    if (normalizedImages.length > 0) return normalizedImages;

    if (product.image) return [product.image];

    return [];
  }, [product]);

  const isFavorite = product?.id ? isInWishlist(product.id) : false;

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist({
      ...product,
      image: product.image || mainImage || PLACEHOLDER,
      images: imageList,
    });
  };

  const formattedDate = useMemo(() => {
    if (!product?.date) return "Today";
    try {
      return new Date(product.date).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return product.date;
    }
  }, [product?.date]);

  const handleContactSeller = () => {
    const params = new URLSearchParams();
    if (product?.seller) params.set("seller", product.seller);
    if (product?.id) params.set("product", product.id);
    navigate(`/messages?${params.toString()}`);
  };

  const handleBuyConfirm = () => {
    setBuyConfirmed(true);
    setTimeout(() => {
      setShowBuyModal(false);
      setBuyConfirmed(false);
      navigate("/my-orders");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-loading-spinner" />
        <p>Loading listing…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-error">
        <i className="fa-solid fa-triangle-exclamation" />
        <h2>Listing Not Found</h2>
        <p>This item no longer exists or has been removed.</p>
        <button
          className="btn-back"
          onClick={() => navigate("/market")}
          type="button"
        >
          Back to Market
        </button>
      </div>
    );
  }

  const conditionClass = String(product.condition ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  const sellerName = product.seller || "Anonymous Seller";
  const sellerAvatar = resolveSellerAvatar(product);

  return (
    <div className="product-detail-page">
      <button type="button" className="btn-back" onClick={() => navigate("/market")}>
        <i className="fa-solid fa-chevron-left" /> Back to Market
      </button>

      <div className="detail-layout">
        <div className="product-gallery">
          <div className="main-image-container">
            <img
              src={mainImage || PLACEHOLDER}
              alt={product.title}
              className="main-image"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = PLACEHOLDER;
              }}
            />
          </div>

          {imageList.length > 1 && (
            <div className="thumbnail-row">
              {imageList.map((img, i) => (
                <button
                  key={`thumb-${i}`}
                  type="button"
                  className={`thumb-btn ${mainImage === img ? "active" : ""}`}
                  onClick={() => setMainImage(img)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`View ${i + 1}`}
                    className={`thumb ${mainImage === img ? "active" : ""}`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info-panel">
          <div className="category-badge">
            {product.category?.replace(/-/g, " ") || "Uncategorized"}
            {product.subCategory ? ` › ${product.subCategory}` : ""}
          </div>

          <h1 className="pd-title">{product.title}</h1>

          <div className="pd-meta">
            <span className={`condition-tag condition-${conditionClass}`}>
              {product.condition?.replace(/-/g, " ") || "Not specified"}
            </span>
            <span className="listing-date">
              <i className="fa-solid fa-calendar-days" style={{ marginRight: 5 }} />
              {formattedDate}
            </span>
          </div>

          <div className="price-box">
            <span className="price-currency">€</span>
            <span className="price-amount">
              {typeof product.price === "number"
                ? product.price.toFixed(2)
                : String(product.price || "0.00")}
            </span>
          </div>

          {product.parcelSize && (
            <div className="shipping-badge">
              <i className="fa-solid fa-box" />
              <span>Parcel: {product.parcelSize}</span>
              {product.weightRange && <span>({product.weightRange})</span>}
            </div>
          )}

          <div className="pd-actions">
            <button
              className="btn-buy-now"
              type="button"
              onClick={() => setShowBuyModal(true)}
            >
              <i className="fa-solid fa-bolt" />
              Buy Now
            </button>

            <button
              className={`btn-wishlist ${isFavorite ? "active" : ""}`}
              type="button"
              onClick={handleToggleWishlist}
            >
              <i className={`${isFavorite ? "fa-solid" : "fa-regular"} fa-heart`} />
              {isFavorite ? "Saved" : "Wishlist"}
            </button>
          </div>

          <div className="seller-card">
            <h3>Seller</h3>
            <div className="seller-row" onClick={() => navigate(`/profile/${encodeURIComponent(sellerName)}`)} style={{ cursor: 'pointer' }}>
              <img
                src={sellerAvatar}
                alt={sellerName}
                className="seller-avatar"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_AVATAR_FALLBACK;
                }}
              />
              <div className="seller-info">
                <p className="seller-name">{sellerName}</p>
                <p className="seller-rating">{DEMO_SELLER_RATING}</p>
              </div>
              <button className="btn-contact" type="button" onClick={(e) => { e.stopPropagation(); handleContactSeller(); }}>
                <i className="fa-solid fa-message" />
                Contact
              </button>
            </div>

            <div className="shipping-tabs" role="tablist" aria-label="Delivery options">
              <button
                className="shipping-tab shipping-tab--selected"
                role="tab"
                aria-selected="true"
                onClick={() => setActiveShippingTab('shipping')}
              >
                <i className="fa-solid fa-truck" />
                Shipping
              </button>
              <button
                className="shipping-tab"
                role="tab"
                aria-selected="false"
                onClick={() => setActiveShippingTab('in-person')}
              >
                <i className="fa-solid fa-handshake" />
                In-person Sale
              </button>
            </div>

            {activeShippingTab === 'shipping' && (
              <div className="shipping-tab-content active">
                <div className="shipping-dealbox">
                  <div className="shipping-dealbox__icon">
                    <i className="fa-solid fa-truck-fast" />
                  </div>
                  <div className="shipping-dealbox__info">
                    <strong>Delivery in 4 - 8 days</strong>
                    <p>At pickup point or at home</p>
                    <span className="shipping-dealbox__price">From €9.05</span>
                  </div>
                </div>

                <div className="shipping-dealbox">
                  <div className="shipping-dealbox__icon" style={{ color: 'var(--success)' }}>
                    <i className="fa-solid fa-shield-halved" />
                  </div>
                  <div className="shipping-dealbox__info">
                    <strong>Protected Shipping</strong>
                    <p>Easy refund, help at your disposal</p>
                  </div>
                </div>
              </div>
            )}

            {activeShippingTab === 'in-person' && (
              <div className="shipping-tab-content active">
                <div className="shipping-dealbox">
                  <div className="shipping-dealbox__icon">
                    <i className="fa-solid fa-handshake" />
                  </div>
                  <div className="shipping-dealbox__info">
                    <strong>In-person Sale</strong>
                    <p>Meet at pickup point or seller's location</p>
                    <span className="shipping-dealbox__price">Free</span>
                  </div>
                </div>
              </div>
            )}

            <div className="seller-actions">
              <button 
                className="btn-offer-bundle" 
                type="button" 
                onClick={() => navigate(`/offer/${product?.id || ''}`)}
              >
                <i className="fa-solid fa-handshake" />
                Make Your Offer
              </button>
              <button 
                className="btn-offer-bundle" 
                type="button" 
                onClick={() => navigate(`/bundle/${product?.id || ''}`)}
              >
                <i className="fa-solid fa-boxes-stacked" />
                Make a Bundle
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pd-description">
        <h2>Description & Condition</h2>
        <p>{product.description || "No description provided."}</p>
      </div>

      <div className="pd-related">
        <h2>More from this seller</h2>
        <p className="pd-related-note">
          Browse the market for more items by {sellerName}.
        </p>
        <button type="button" className="btn-back" onClick={() => navigate(`/market`)}>
          Browse Market
        </button>
      </div>

      {showBuyModal && (
        <div className="modal-overlay" onClick={() => !buyConfirmed && setShowBuyModal(false)}>
          <div className="buy-modal" onClick={(e) => e.stopPropagation()}>
            {buyConfirmed ? (
              <div className="buy-success">
                <i className="fa-solid fa-circle-check" />
                <h3>Order Placed!</h3>
                <p>Redirecting to your orders…</p>
              </div>
            ) : (
              <>
                <div className="buy-modal-header">
                  <h3>Confirm Purchase</h3>
                  <button
                    type="button"
                    className="modal-close-btn"
                    onClick={() => setShowBuyModal(false)}
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>

                <div className="buy-modal-item">
                  <img
                    src={mainImage || PLACEHOLDER}
                    alt={product.title}
                    className="buy-modal-img"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                  />
                  <div>
                    <p className="buy-modal-title">{product.title}</p>
                    <p className="buy-modal-condition">{product.condition}</p>
                  </div>
                </div>

                <div className="buy-modal-breakdown">
                  <div className="buy-row">
                    <span>Item price</span>
                    <span>
                      €{typeof product.price === "number" ? product.price.toFixed(2) : product.price}
                    </span>
                  </div>
                  <div className="buy-row">
                    <span>Shipping</span>
                    <span>{product.parcelSize ? `${product.parcelSize}` : "TBD"}</span>
                  </div>
                  <div className="buy-row total">
                    <span>Total</span>
                    <span>
                      €{typeof product.price === "number" ? product.price.toFixed(2) : product.price}
                    </span>
                  </div>
                </div>

                <p className="buy-modal-note">
                  <i className="fa-solid fa-info-circle" /> Payment and shipping details will
                  be arranged with the seller via messages.
                </p>

                <div className="buy-modal-actions">
                  <button
                    type="button"
                    className="btn-buy-cancel"
                    onClick={() => setShowBuyModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="button" className="btn-buy-confirm" onClick={handleBuyConfirm}>
                    <i className="fa-solid fa-bolt" /> Confirm Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}