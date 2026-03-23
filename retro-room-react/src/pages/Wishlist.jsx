import React from 'react';
import { Link } from 'react-router-dom';
import './Wishlist.css'; // Importando o CSS que criamos acima

export default function Wishlist({ favorites = [], toggleFavorite }) {
  return (
    <div className="wishlist-container">
      <header className="wishlist-header">
        <h1>Minha Lista de Desejos ❤️</h1>
        <p>Tens {favorites.length} itens guardados para o futuro.</p>
      </header>

      {favorites.length === 0 ? (
        <div className="wishlist-empty">
          <span className="wishlist-empty-icon">🛍️</span>
          <h2>A tua lista está vazia</h2>
          <p>Parece que ainda não encontraste nada que amaste. Que tal explorar o mercado?</p>
          <Link to="/" className="btn-explore">Explorar Marketplace</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {favorites.map((product) => (
            <article className="wishlist-card" key={product.id || Math.random()}>
              <div className="wishlist-card-image">
                <img 
                  src={product.image || 'https://via.placeholder.com/400'} 
                  alt={product.name} 
                />
              </div>
              
              <div className="wishlist-card-content">
                <div>
                  <h3>{product.name}</h3>
                  <p className="wishlist-price">{product.price}</p>
                </div>
                
                <div className="wishlist-actions">
                  <button className="btn-buy">Comprar Agora</button>
                  <button 
                    className="btn-remove-item" 
                    onClick={() => toggleFavorite(product)}
                    title="Remover dos favoritos"
                  >
                    Remover 💔
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