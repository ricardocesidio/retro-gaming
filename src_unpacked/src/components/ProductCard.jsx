// src/components/ProductCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { normalizeProduct } from "../utils/normalizeProduct";
import { MARKET_PLACEHOLDER_FALLBACK } from "../utils/fallbackImage";
import "./ProductCard.css";

/**
 * Universal product card used in Market, Home (embedded), Wishlist.
 *
 * Props:
 *   item           – raw product object (normalized internally)
 *   variant        – "market" | "wishlist"
 *   onRemove       – callback for wishlist removal (wishlist variant)
 *   onWishlistToggle – optional external toggle handler (market variant)
 *   isInWishlist   – optional boolean from parent (market variant)
 *   detailsLabel   – override the "Details" button label
 *   className      – extra CSS classes on the article element
 */
export default function ProductCard({
  item,
  variant          = "market",
  onRemove,
  onWishlistToggle,
  isInWishlist: isInWishlistProp,
  detailsLabel,
  className        = "",
}) {
  const navigate = useNavigate();
  const { isInWishlist: contextIsInWishlist, toggleWishlist } = useWishlist();

  if (!item) return null;

  const product   = normalizeProduct(item);
  // FIX: prefer prop passed by parent (avoids re-reading context when parent already has it)
  const isFavorite = isInWishlistProp !== undefined
    ? isInWishlistProp
    : (product.id ? contextIsInWishlist(product.id) : false);

  const isSold           = String(product.status ?? "").toLowerCase() === "sold";
  const isWishlistVariant = variant === "wishlist";
  const sellerName       = String(product.seller ?? "").trim();
  const sellerAvatar     = String(product.sellerAvatar ?? product.avatar ?? "").trim();
  const openToOffers     = Boolean(product.openToOffers ?? product.acceptsOffers ?? product.negotiable);

  const handleCardClick = (e) => {
    if (e) {
      const clickedButton = e.target.closest("button, a, label");
      if (clickedButton) return;
      e.preventDefault();
    }
    if (!product.id) return;
    navigate(`/product/${product.id}`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation?.();

    // Use external handler if provided (e.g. from Market), otherwise use context
    if (typeof onWishlistToggle === "function") {
      onWishlistToggle(product);
      return;
    }
    toggleWishlist({
      ...product,
      image: product.image || product.images?.[0] || "",
    });
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation?.();
    if (typeof onRemove === "function") onRemove(product);
  };

  const priceLabel =
    typeof product.price === "number"
      ? `€${product.price.toFixed(2)}`
      : product.price
        ? `€${product.price}`
        : "—";

  const buttonText = isWishlistVariant
    ? detailsLabel || "View Details"
    : detailsLabel || "Details";

  return (
    <article
      className={`product-card ${isSold ? "is-sold" : ""} ${className}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick(e); }
      }}
      aria-label={`View ${product.title}`}
    >
      <div className="product-image-container">
        {product.image ? (
          <img src={product.image} alt={product.title} className="product-image" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = MARKET_PLACEHOLDER_FALLBACK; }} />
        ) : (
          <img src={MARKET_PLACEHOLDER_FALLBACK} alt={product.title} className="product-image" />
        )}

        {isWishlistVariant ? (
          <button
            type="button"
            className="btn-remove-icon"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleRemove}
            aria-label="Remove from wishlist"
            title="Remove from wishlist"
          >
            <i className="fa-solid fa-trash-can" />
          </button>
        ) : (
          <button
            type="button"
            className={`btn-heart ${isFavorite ? "is-active" : ""}`}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleToggleWishlist}
            aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isFavorite}
          >
            <i className={`${isFavorite ? "fa-solid" : "fa-regular"} fa-heart`} />
          </button>
        )}

        {sellerName && (
          <div className="seller-pill" aria-label={`Sold by ${sellerName}`}>
            <img
              src={sellerAvatar || MARKET_PLACEHOLDER_FALLBACK}
              alt={sellerName}
              className="seller-pill-avatar"
              loading="lazy"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = MARKET_PLACEHOLDER_FALLBACK; }}
            />
            <span>{sellerName}</span>
          </div>
        )}

        {openToOffers && <span className="offer-badge">Open to offers</span>}
        {isSold && <span className="sold-badge">SOLD</span>}
      </div>

      <div className="product-details">
        <h4 className="product-title">{product.title}</h4>

        {product.condition && (
          <span className="product-condition">{product.condition}</span>
        )}

        <div className="product-footer">
          <span className="product-price">{priceLabel}</span>

          <button
            type="button"
            className="btn-view-details"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isSold && product.id) navigate(`/product/${product.id}`);
            }}
            disabled={isSold}
            aria-label={`View details for ${product.title}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </article>
  );
}