import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard.jsx";
import { normalizeProduct } from "../utils/normalizeProduct";
import "./Wishlist.css";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  const normalizedWishlistItems = useMemo(
    () => wishlistItems.map((item) => normalizeProduct(item)).filter(Boolean),
    [wishlistItems]
  );

  const handleRemove = (item) => {
    removeFromWishlist(item?.id);
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <header className="wishlist-header">
          <h1>My Wishlist</h1>
          <p>Your saved items are waiting here</p>

          <div className="wishlist-counter">
            <span>{normalizedWishlistItems.length}</span>
            <small>saved items</small>
          </div>
        </header>

        {normalizedWishlistItems.length > 0 ? (
          <div className="wishlist-grid">
            {normalizedWishlistItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                variant="wishlist"
                onRemove={handleRemove}
                detailsLabel="View Details"
              />
            ))}
          </div>
        ) : (
          <div className="wishlist-empty">
            <div className="empty-icon-wrapper">
              <i className="fa-solid fa-heart-crack wishlist-empty-icon"></i>
            </div>
            <h2>No items in your wishlist</h2>
            <p>Add something from the Market and it will appear here.</p>
            <Link to="/market" className="btn-explore">
              Explore the Market
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}