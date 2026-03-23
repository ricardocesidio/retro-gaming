import React from 'react';
import { Link } from 'react-router-dom';
import './Wishlist.css';

export default function Wishlist({ favorites = [], toggleFavorite }) {
  return (
    <div className="wishlist-container">
      <header className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>You have {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved for the future.</p>
      </header>

      {favorites.length === 0 ? (
        <div className="wishlist-empty">
          <span className="wishlist-empty-icon">🛍️</span>
          <h2>Your wishlist is empty</h2>
          <p>It looks like you haven't found anything you love yet. Why not explore the marketplace?</p>
          <Link to="/" className="btn-explore">Explore Marketplace</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {favorites.map((product) => (
            <article className="wishlist-card" key={product.id || Math.random()}>
              <div className="wishlist-card-image">
                <img 
                  src={product.image || 'https://via.placeholder.com/400'} 
                  alt={product.name || 'Product'} 
                />
              </div>
              
              <div className="wishlist-card-content">
                <div>
                  <h3>{product.name || 'Unnamed Item'}</h3>
                  <p className="wishlist-price">{product.price || 'Contact for price'}</p>
                </div>
                
                <div className="wishlist-actions">
                  <button className="btn-buy">Buy Now</button>
                  <button 
                    className="btn-remove-item" 
                    onClick={() => toggleFavorite && toggleFavorite(product)}
                    title="Remove from favorites"
                  >
                    Remove 💔
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}