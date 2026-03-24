import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o hook de navegação
import './ProductCard.css'; 

export default function ProductCard({ item }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate(); // Inicializa o navegador

  if (!item) return null;

  const isSold = item.status === 'sold';

  // Função para navegar para o detalhe do produto
  const handleCardClick = () => {
    // Redireciona para uma rota dinâmica, ex: /product/1
    navigate(`/product/${item.id}`);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation(); // IMPRESCINDÍVEL: Impede que o clique no coração ative o clique no card
    setIsFavorite(!isFavorite);
  };

  return (
    <div 
      className={`product-card ${isSold ? 'is-sold' : ''}`} 
      onClick={handleCardClick} // O CARD AGORA É CLICÁVEL
      style={{ cursor: 'pointer' }} // Muda o rato para a "mãozinha"
    >
      <div className="product-image-container">
        <img src={item.image} alt={item.name} className="product-image" />
        
        {!isSold && (
          <button 
            className={`btn-heart ${isFavorite ? 'is-active' : ''}`} 
            onClick={toggleFavorite}
          >
            <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
          </button>
        )}
      </div>
      
      <div className="product-details">
        <h4 className="product-title">{item.name}</h4>
        <div className="product-footer">
          <span className="product-price">€{item.price}</span>
          <button className="btn-view-details">Details</button>
        </div>
      </div>
    </div>
  );
}